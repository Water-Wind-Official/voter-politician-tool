// Types for politician and vote data
// Compatible with multiple data sources (GovTrack, ProPublica, etc.)

export interface Politician {
	id: number;
	propublica_id: string; // Using this field name for backward compatibility, but can store GovTrack ID
	name: string;
	first_name: string | null;
	last_name: string | null;
	state: string;
	party: string | null;
	chamber: string;
	district: string | null;
	twitter_handle: string | null;
	website: string | null;
}

export interface Vote {
	id: number;
	propublica_roll_id: string; // Using this field name for backward compatibility
	bill_id: string | null;
	bill_title: string | null;
	bill_number: string | null;
	description: string | null;
	question: string | null;
	date: string;
	chamber: string;
	result: string | null;
}

export interface VotingRecord {
	id: number;
	politician_id: number;
	vote_id: number;
	position: 'Yes' | 'No' | 'Not Voting' | 'Present';
	vote?: Vote;
}

// Legacy ProPublica types (kept for reference, but API is discontinued)
export interface ProPublicaMember {
	id: string;
	name: string;
	first_name: string;
	middle_name?: string;
	last_name: string;
	suffix?: string;
	party: string;
	state: string;
	district?: string;
	chamber: 'house' | 'senate';
	twitter_account?: string;
	url?: string;
}

export interface ProPublicaVote {
	roll_call: string;
	bill?: {
		bill_id: string;
		number: string;
		title: string;
	};
	description: string;
	question: string;
	date: string;
	chamber: 'House' | 'Senate';
	result: string;
	positions: Array<{
		member_id: string;
		name: string;
		party: string;
		state: string;
		vote_position: 'Yes' | 'No' | 'Not Voting' | 'Present';
	}>;
}

// GovTrack types
export interface GovTrackPerson {
	id: number;
	name: string;
	firstname: string;
	lastname: string;
	roles: Array<{
		type: string;
		state: string;
		party: string;
		district: number | null;
		chamber: 'house' | 'senate';
	}>;
	twitterid: string | null;
	website: string | null;
}

export interface GovTrackVote {
	id: number;
	question: string;
	result: string;
	voted_at: string;
	chamber: 'house' | 'senate';
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
	} | null;
}
