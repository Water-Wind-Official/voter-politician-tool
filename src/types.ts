// Types for state-based voter information system

export interface State {
	id: number;
	code: string;
	name: string;
	capital: string | null;
	population: number | null;
	area_sq_miles: number | null;
	timezone: string | null;
	voter_data_available: boolean;
	created_at: string;
	updated_at: string;
}

export interface District {
	id: number;
	state_code: string;
	district_number: number | null;
	name: string | null;
	population: number | null;
	area_sq_miles: number | null;
	description: string | null;
	created_at: string;
	updated_at: string;
}

export interface Representative {
	id: number;
	external_id: string | null;
	name: string;
	first_name: string | null;
	last_name: string | null;
	middle_name: string | null;
	suffix: string | null;
	state_code: string;
	party: string | null;
	chamber: 'house' | 'senate';
	district_id: number | null;
	office_address: string | null;
	office_phone: string | null;
	email: string | null;
	twitter_handle: string | null;
	facebook_url: string | null;
	website: string | null;
	photo_url: string | null;
	bio: string | null;
	term_start: string | null;
	term_end: string | null;
	is_active: boolean;
	created_at: string;
	updated_at: string;
}

export interface VoterData {
	id: number;
	state_code: string;
	total_registered_voters: number | null;
	total_population: number | null;
	voting_age_population: number | null;
	voter_turnout_percentage: number | null;
	last_election_date: string | null;
	data_source: string | null;
	data_year: number | null;
	notes: string | null;
	created_at: string;
	updated_at: string;
}

export interface VoterDemographic {
	id: number;
	state_code: string;
	district_id: number | null;
	demographic_type: string;
	category: string;
	count: number | null;
	percentage: number | null;
	data_year: number | null;
	created_at: string;
	updated_at: string;
}

// Legacy Politician type for backward compatibility
export interface Politician {
	id: number;
	propublica_id: string;
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
