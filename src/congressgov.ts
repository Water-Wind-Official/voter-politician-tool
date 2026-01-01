// Official Congress.gov API integration
// API Docs: https://api.congress.gov/
// Requires API key (free): https://api.congress.gov/sign-up

const CONGRESS_API_BASE = 'https://api.congress.gov/v3';

// Congress.gov API v3 member structure (flexible to handle actual API response)
export interface CongressMember {
	bioguideId?: string;
	firstName?: string;
	lastName?: string;
	middleName?: string;
	partyName?: string;
	party?: string;
	state?: string;
	district?: number;
	chamber?: 'House' | 'Senate';
	url?: string;
	// Handle different possible field names
	member?: {
		bioguideId?: string;
		firstName?: string;
		lastName?: string;
	};
	terms?: Array<{
		chamber?: string;
		state?: string;
		district?: number;
		party?: string;
	}>;
}

export interface CongressVote {
	rollNumber: number;
	question: string;
	description: string;
	voteDate: string;
	chamber: 'House' | 'Senate';
	result: string;
	members: Array<{
		bioguideId: string;
		firstName: string;
		lastName: string;
		vote: string;
	}>;
	bill?: {
		number: string;
		title: string;
		url: string;
	};
}

// Convert Congress.gov member to our internal format
export function convertCongressMember(member: any, knownChamber?: 'house' | 'senate'): Array<{
	propublica_id: string;
	name: string;
	first_name: string;
	last_name: string;
	state: string;
	party: string;
	chamber: 'house' | 'senate';
	district: string | null;
	twitter_handle: string | null;
	website: string | null;
}> {
	const results: Array<{
		propublica_id: string;
		name: string;
		first_name: string;
		last_name: string;
		state: string;
		party: string;
		chamber: 'house' | 'senate';
		district: string | null;
		twitter_handle: string | null;
		website: string | null;
	}> = [];

	// Handle nested member structure - try multiple possible field names
	const memberData = member.member || member;
	
	// Try different possible field names for bioguideId
	const bioguideId = memberData.bioguideId || member.bioguideId || memberData.id || member.id || memberData.memberId || member.memberId;
	
	// Try different possible field names for names
	const firstName = memberData.firstName || member.firstName || memberData.first_name || member.first_name || memberData.givenName || member.givenName || memberData.name?.first || member.name?.first || '';
	const lastName = memberData.lastName || member.lastName || memberData.last_name || member.last_name || memberData.familyName || member.familyName || memberData.name?.last || member.name?.last || '';
	const middleName = memberData.middleName || member.middleName || memberData.middle_name || member.middle_name || memberData.name?.middle || member.name?.middle;
	
	// If we have a full name string, try to parse it
	let parsedFirstName = firstName;
	let parsedLastName = lastName;
	if ((!firstName || !lastName) && memberData.name) {
		const fullName = typeof memberData.name === 'string' ? memberData.name : (member.name || '');
		if (fullName) {
			const nameParts = fullName.trim().split(/\s+/);
			if (nameParts.length >= 2) {
				parsedFirstName = nameParts[0];
				parsedLastName = nameParts[nameParts.length - 1];
			}
		}
	}
	
	// Use parsed names if original names are missing
	const finalFirstName = parsedFirstName || firstName;
	const finalLastName = parsedLastName || lastName;
	
	// Debug: Log if we're skipping a member (only log first few to avoid spam)
	if (!bioguideId || !finalFirstName || !finalLastName) {
		if (results.length < 3) { // Only log first 3 skipped members
			console.warn('Skipping member - missing required fields:', {
				bioguideId: bioguideId || 'MISSING',
				firstName: finalFirstName || 'MISSING',
				lastName: finalLastName || 'MISSING',
				allKeys: Object.keys(member),
				sampleData: JSON.stringify(member).substring(0, 300)
			});
		}
		return results;
	}

	// Get current term (most recent active term) - handle various structures
	let terms = member.terms || member.term || member.memberTerms || [];
	if (!Array.isArray(terms)) {
		terms = [terms];
	}
	const currentTerm = terms.length > 0
		? (terms.find((t: any) => !t.endDate && !t.end && !t.endDateString) || terms[terms.length - 1] || {})
		: {};
	
	// Try to get chamber from multiple possible locations
	let chamber = '';
	
	// Try term first
	if (currentTerm && currentTerm.chamber) {
		chamber = String(currentTerm.chamber).toLowerCase();
	}
	// Try member level
	if (!chamber && member.chamber) {
		chamber = String(member.chamber).toLowerCase();
	}
	// Try memberData level
	if (!chamber && memberData.chamber) {
		chamber = String(memberData.chamber).toLowerCase();
	}
	// Try type field
	if (!chamber && (member.type || memberData.type)) {
		const type = String(member.type || memberData.type).toLowerCase();
		if (type === 'rep' || type === 'representative') {
			chamber = 'house';
		} else if (type === 'sen' || type === 'senator') {
			chamber = 'senate';
		}
	}
	
	// Normalize chamber values
	if (chamber.includes('house') || chamber === 'h' || chamber === 'rep' || chamber === 'representative') {
		chamber = 'house';
	} else if (chamber.includes('senate') || chamber === 's' || chamber === 'sen' || chamber === 'senator') {
		chamber = 'senate';
	}
	
	// If still no chamber, use the known chamber from the API call
	if ((chamber !== 'house' && chamber !== 'senate') && knownChamber) {
		chamber = knownChamber;
	}
	
	// If still no chamber, skip this member
	if (chamber !== 'house' && chamber !== 'senate') {
		// Last resort: check if there's any indication in the data structure
		// Skip for now - require chamber to be determined
		if (results.length < 3) { // Only log first few
			console.warn('Skipping member - cannot determine chamber:', { 
				bioguideId, 
				chamber, 
				knownChamber,
				hasTerm: !!currentTerm,
				termChamber: currentTerm?.chamber,
				memberChamber: member.chamber,
				keys: Object.keys(member).slice(0, 15) 
			});
		}
		return results;
	}
	
	const state = currentTerm?.state || member.state || memberData.state || member.stateCode || memberData.stateCode || '';
	const party = currentTerm?.party || member.party || member.partyName || memberData.party || memberData.partyName || member.partyCode || memberData.partyCode || 'Unknown';
	const district = currentTerm?.district || member.district || memberData.district;
	
	const fullName = middleName 
		? `${finalFirstName} ${middleName} ${finalLastName}`
		: `${finalFirstName} ${finalLastName}`;

	results.push({
		propublica_id: `congress-${bioguideId}`,
		name: fullName.trim(),
		first_name: finalFirstName,
		last_name: finalLastName,
		state: state,
		party: party,
		chamber: chamber as 'house' | 'senate',
		district: district ? String(district) : null,
		twitter_handle: null, // Congress.gov API doesn't include Twitter
		website: member.url || memberData.url || null,
	});

	return results;
}

// Convert Congress.gov vote to our internal format
export function convertCongressVote(vote: CongressVote): {
	propublica_roll_id: string;
	bill_id: string | null;
	bill_title: string | null;
	bill_number: string | null;
	description: string | null;
	question: string | null;
	date: string;
	chamber: string;
	result: string | null;
} {
	return {
		propublica_roll_id: `congress-${vote.rollNumber}`,
		bill_id: vote.bill?.url || null,
		bill_title: vote.bill?.title || null,
		bill_number: vote.bill?.number || null,
		description: vote.description || null,
		question: vote.question || null,
		date: vote.voteDate,
		chamber: vote.chamber.toLowerCase(),
		result: vote.result || null,
	};
}

// Map Congress.gov vote strings to standard positions
export function mapCongressVote(voteString: string): 'Yes' | 'No' | 'Not Voting' | 'Present' {
	const normalized = voteString.toLowerCase().trim();
	
	if (normalized === 'yes' || normalized === 'yea' || normalized === 'y') {
		return 'Yes';
	}
	if (normalized === 'no' || normalized === 'nay' || normalized === 'n') {
		return 'No';
	}
	if (normalized === 'present' || normalized === 'p') {
		return 'Present';
	}
	return 'Not Voting';
}

export async function fetchCongressMembers(
	chamber: 'house' | 'senate',
	apiKey: string,
	congress: number = 118
): Promise<CongressMember[]> {
	// Congress.gov API v3 uses /member with query parameters, not path parameters
	// Format: /member?chamber=House&api_key=...
	const chamberParam = chamber === 'house' ? 'House' : 'Senate';
	const url = `${CONGRESS_API_BASE}/member?chamber=${chamberParam}&api_key=${apiKey}&format=json&limit=500`;
	
	const response = await fetch(url, {
		headers: {
			'User-Agent': 'PoliticianVotingRecords/1.0',
			'Accept': 'application/json',
		},
	});

	if (!response.ok) {
		const errorText = await response.text().catch(() => '');
		throw new Error(`Congress.gov API error: ${response.status} ${response.statusText}. ${errorText}`);
	}

	const data = await response.json();
	
	// Debug: Log the structure to understand the API response
	// console.log('Congress.gov API response structure:', JSON.stringify(Object.keys(data)).substring(0, 200));
	
	// Congress.gov API v3 returns members in different possible structures
	// Try multiple possible response structures
	if (data.members && Array.isArray(data.members)) {
		return data.members;
	}
	if (data.results && data.results.members && Array.isArray(data.results.members)) {
		return data.results.members;
	}
	if (data.results && Array.isArray(data.results)) {
		return data.results;
	}
	if (Array.isArray(data)) {
		return data;
	}
	
	// If we get here, log what we actually got
	console.error('Unexpected Congress.gov API response structure:', JSON.stringify(data).substring(0, 500));
	return [];
}

export async function fetchCongressVotes(
	chamber: 'house' | 'senate',
	apiKey: string,
	congress: number = 118,
	limit: number = 50
): Promise<CongressVote[]> {
	// Note: Congress.gov API v3 may not have a direct vote endpoint
	// This function attempts to fetch votes, but may not be available
	// Alternative: Votes might be available through bill endpoints or member-specific endpoints
	
	// Try different possible vote endpoints
	const endpoints = [
		`${CONGRESS_API_BASE}/vote?chamber=${chamber === 'house' ? 'House' : 'Senate'}&api_key=${apiKey}&format=json&limit=${limit}`,
		`${CONGRESS_API_BASE}/rollcall?chamber=${chamber === 'house' ? 'House' : 'Senate'}&api_key=${apiKey}&format=json&limit=${limit}`,
		`${CONGRESS_API_BASE}/vote/${congress}/${chamber === 'house' ? 'house' : 'senate'}?api_key=${apiKey}&format=json&limit=${limit}`,
	];

	for (const url of endpoints) {
		try {
			const response = await fetch(url, {
				headers: {
					'User-Agent': 'PoliticianVotingRecords/1.0',
					'Accept': 'application/json',
				},
			});

			if (response.ok) {
				const data = await response.json();
				// Try different response structures
				if (data.votes && Array.isArray(data.votes)) {
					return data.votes;
				}
				if (data.results && data.results.votes && Array.isArray(data.results.votes)) {
					return data.results.votes;
				}
				if (data.rollCalls && Array.isArray(data.rollCalls)) {
					return data.rollCalls;
				}
				if (Array.isArray(data)) {
					return data;
				}
			}
		} catch (e) {
			// Try next endpoint
			continue;
		}
	}
	
	// If all endpoints fail, throw error
	throw new Error('Congress.gov API does not have a vote endpoint available. Vote data cannot be synced through this API.');
}
