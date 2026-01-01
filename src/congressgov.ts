// Official Congress.gov API integration
// API Docs: https://api.congress.gov/
// Requires API key (free): https://api.congress.gov/sign-up

const CONGRESS_API_BASE = 'https://api.congress.gov/v3';

export interface CongressMember {
	bioguideId: string;
	firstName: string;
	lastName: string;
	middleName?: string;
	partyName: string;
	state: string;
	district?: number;
	chamber: 'House' | 'Senate';
	url?: string;
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
export function convertCongressMember(member: CongressMember): Array<{
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

	const chamber = member.chamber === 'House' ? 'house' : 'senate';
	const district = member.district ? String(member.district) : null;
	const fullName = member.middleName 
		? `${member.firstName} ${member.middleName} ${member.lastName}`
		: `${member.firstName} ${member.lastName}`;

	results.push({
		propublica_id: `congress-${member.bioguideId}`,
		name: fullName,
		first_name: member.firstName,
		last_name: member.lastName,
		state: member.state,
		party: member.partyName || 'Unknown',
		chamber: chamber,
		district: district,
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
	const chamberParam = chamber === 'house' ? 'house' : 'senate';
	const url = `${CONGRESS_API_BASE}/member/${chamberParam}?api_key=${apiKey}&format=json`;
	
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
	// Congress.gov API returns members in different structures depending on endpoint
	// Try multiple possible response structures
	if (data.members && Array.isArray(data.members)) {
		return data.members;
	}
	if (Array.isArray(data)) {
		return data;
	}
	if (data.results && Array.isArray(data.results)) {
		return data.results;
	}
	return [];
}

export async function fetchCongressVotes(
	chamber: 'house' | 'senate',
	apiKey: string,
	congress: number = 118,
	limit: number = 50
): Promise<CongressVote[]> {
	const chamberParam = chamber === 'house' ? 'house' : 'senate';
	const url = `${CONGRESS_API_BASE}/vote/${chamberParam}?api_key=${apiKey}&format=json&limit=${limit}`;
	
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
	// Congress.gov API returns votes in different structures depending on endpoint
	// Try multiple possible response structures
	if (data.votes && Array.isArray(data.votes)) {
		return data.votes;
	}
	if (Array.isArray(data)) {
		return data;
	}
	if (data.results && Array.isArray(data.results)) {
		return data.results;
	}
	return [];
}
