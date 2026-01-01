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

	// Handle nested member structure
	const memberData = member.member || member;
	const bioguideId = memberData.bioguideId || member.bioguideId;
	const firstName = memberData.firstName || member.firstName || '';
	const lastName = memberData.lastName || member.lastName || '';
	const middleName = memberData.middleName || member.middleName;
	
	if (!bioguideId || !firstName || !lastName) {
		// Skip invalid members
		return results;
	}

	// Get current term (most recent active term)
	const terms = member.terms || [];
	const currentTerm = terms.find((t: any) => !t.endDate) || terms[terms.length - 1] || {};
	
	const chamber = (currentTerm.chamber || member.chamber || '').toLowerCase();
	if (chamber !== 'house' && chamber !== 'senate') {
		// Skip if we can't determine chamber
		return results;
	}
	
	const state = currentTerm.state || member.state || '';
	const party = currentTerm.party || member.party || member.partyName || 'Unknown';
	const district = currentTerm.district || member.district;
	
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
	// Congress.gov API v3 returns members in a members array
	if (data.members && Array.isArray(data.members)) {
		return data.members;
	}
	if (data.results && data.results.members && Array.isArray(data.results.members)) {
		return data.results.members;
	}
	if (Array.isArray(data)) {
		return data;
	}
	return [];
}

export async function fetchCongressVotes(
	chamber: 'house' | 'senate',
	apiKey: string,
	congress: number = 118,
	limit: number = 50
): Promise<CongressVote[]> {
	// Congress.gov API v3 uses /vote with query parameters
	// Format: /vote?chamber=House&api_key=...
	const chamberParam = chamber === 'house' ? 'House' : 'Senate';
	const url = `${CONGRESS_API_BASE}/vote?chamber=${chamberParam}&api_key=${apiKey}&format=json&limit=${limit}`;
	
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
	// Congress.gov API v3 returns votes in a votes array
	if (data.votes && Array.isArray(data.votes)) {
		return data.votes;
	}
	if (data.results && data.results.votes && Array.isArray(data.results.votes)) {
		return data.results.votes;
	}
	if (Array.isArray(data)) {
		return data;
	}
	return [];
}
