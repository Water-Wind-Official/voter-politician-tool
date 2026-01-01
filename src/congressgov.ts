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
export function convertCongressMember(member: any): Array<{
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
	const bioguideId = memberData.bioguideId || member.bioguideId || memberData.id || member.id;
	
	// Try different possible field names for names
	const firstName = memberData.firstName || member.firstName || memberData.first_name || member.first_name || memberData.givenName || member.givenName || '';
	const lastName = memberData.lastName || member.lastName || memberData.last_name || member.last_name || memberData.familyName || member.familyName || '';
	const middleName = memberData.middleName || member.middleName || memberData.middle_name || member.middle_name;
	
	// Debug: Log if we're skipping a member
	if (!bioguideId || !firstName || !lastName) {
		console.warn('Skipping member - missing required fields:', {
			bioguideId: !!bioguideId,
			firstName: !!firstName,
			lastName: !!lastName,
			keys: Object.keys(member).slice(0, 10)
		});
		return results;
	}

	// Get current term (most recent active term)
	const terms = member.terms || member.term || [];
	const currentTerm = Array.isArray(terms) 
		? (terms.find((t: any) => !t.endDate || !t.end) || terms[terms.length - 1] || {})
		: terms;
	
	// Try to get chamber from multiple possible locations
	let chamber = '';
	if (currentTerm && currentTerm.chamber) {
		chamber = String(currentTerm.chamber).toLowerCase();
	} else if (member.chamber) {
		chamber = String(member.chamber).toLowerCase();
	} else if (memberData.chamber) {
		chamber = String(memberData.chamber).toLowerCase();
	}
	
	// Normalize chamber values
	if (chamber.includes('house') || chamber === 'h' || chamber === 'rep') {
		chamber = 'house';
	} else if (chamber.includes('senate') || chamber === 's' || chamber === 'sen') {
		chamber = 'senate';
	}
	
	if (chamber !== 'house' && chamber !== 'senate') {
		// Skip if we can't determine chamber
		console.warn('Skipping member - cannot determine chamber:', { bioguideId, chamber, keys: Object.keys(member).slice(0, 10) });
		return results;
	}
	
	const state = currentTerm?.state || member.state || memberData.state || '';
	const party = currentTerm?.party || member.party || member.partyName || memberData.party || memberData.partyName || 'Unknown';
	const district = currentTerm?.district || member.district || memberData.district;
	
	const fullName = middleName 
		? `${firstName} ${middleName} ${lastName}`
		: `${firstName} ${lastName}`;

	results.push({
		propublica_id: `congress-${bioguideId}`,
		name: fullName.trim(),
		first_name: firstName,
		last_name: lastName,
		state: state,
		party: party,
		chamber: chamber as 'house' | 'senate',
		district: district ? String(district) : null,
		twitter_handle: null, // Congress.gov API doesn't include Twitter
		website: member.url || null,
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
