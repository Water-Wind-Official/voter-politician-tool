// GovTrack.us API integration
// API Docs: https://www.govtrack.us/developers/api
// No API key required for basic usage

import type { PoliticianData, VoteData } from './db';

const GOVTRACK_API_BASE = 'https://www.govtrack.us/api/v2';

export interface GovTrackPerson {
	id: number;
	name: string;
	firstname: string;
	lastname: string;
	birthday: string;
	gender: string;
	roles: Array<{
		type: string;
		startdate: string;
		enddate: string | null;
		state: string;
		party: string;
		district: number | null;
		url: string;
	}>;
	twitterid: string | null;
	website: string | null;
}

export interface GovTrackVote {
	id: number;
	category: string;
	chamber: 'house' | 'senate';
	congress: number;
	number: number;
	question: string;
	required: string;
	result: string;
	roll: string;
	session: string;
	source_url: string;
	url: string;
	vote_type: string;
	voted_at: string;
	voters: Array<{
		person: number;
		option: {
			key: string;
			value: string;
		};
	}>;
	related_bill: {
		display_number: string;
		title: string;
		url: string;
	} | null;
}

// Convert GovTrack person to our internal format
export function convertGovTrackPerson(person: GovTrackPerson): PoliticianData[] {
	const results: PoliticianData[] = [];

	// Get current active roles
	const currentRoles = person.roles
		.filter(r => r.enddate === null && (r.type === 'rep' || r.type === 'sen'));

	for (const role of currentRoles) {
		const chamber = role.type === 'rep' ? 'house' : 'senate';
		const district = role.district ? String(role.district) : null;

		results.push({
			propublica_id: `govtrack-${person.id}`,
			name: person.name,
			first_name: person.firstname,
			last_name: person.lastname,
			state: role.state,
			party: role.party || 'Unknown',
			chamber: chamber,
			district: district,
			twitter_handle: person.twitterid || null,
			website: person.website || null,
		});
	}

	return results;
}

// Convert GovTrack vote to our internal format
export function convertGovTrackVote(vote: GovTrackVote): VoteData {
	// Map vote options to standard positions
	const optionMap: Record<string, string> = {
		'yes': 'Yes',
		'no': 'No',
		'not voting': 'Not Voting',
		'present': 'Present',
		'present,': 'Present',
		'not voting,': 'Not Voting',
	};

	return {
		propublica_roll_id: `govtrack-${vote.id}`,
		bill_id: vote.related_bill?.url || null,
		bill_title: vote.related_bill?.title || null,
		bill_number: vote.related_bill?.display_number || null,
		description: vote.category || null,
		question: vote.question || null,
		date: vote.voted_at,
		chamber: vote.chamber,
		result: vote.result || null,
	};
}

export async function fetchGovTrackMembers(
	chamber: 'house' | 'senate',
	limit: number = 600
): Promise<GovTrackPerson[]> {
	const roleType = chamber === 'house' ? 'rep' : 'sen';
	const url = `${GOVTRACK_API_BASE}/person?roles__current=true&roles__role_type=${roleType}&limit=${limit}`;
	
	const response = await fetch(url);

	if (!response.ok) {
		throw new Error(`GovTrack API error: ${response.status} ${response.statusText}`);
	}

	const data = await response.json();
	return data.objects;
}

export async function fetchGovTrackRecentVotes(
	chamber: 'house' | 'senate',
	limit: number = 50
): Promise<GovTrackVote[]> {
	const url = `${GOVTRACK_API_BASE}/vote?chamber=${chamber}&limit=${limit}&order_by=-created`;
	
	const response = await fetch(url);

	if (!response.ok) {
		throw new Error(`GovTrack API error: ${response.status} ${response.statusText}`);
	}

	const data = await response.json();
	return data.objects;
}

export async function fetchGovTrackPersonVotes(
	personId: number,
	limit: number = 50
): Promise<GovTrackVote[]> {
	const url = `${GOVTRACK_API_BASE}/vote?voters__person=${personId}&limit=${limit}&order_by=-created`;
	
	const response = await fetch(url);

	if (!response.ok) {
		throw new Error(`GovTrack API error: ${response.status} ${response.statusText}`);
	}

	const data = await response.json();
	return data.objects;
}
