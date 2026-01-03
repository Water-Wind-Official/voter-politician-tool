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
	electoral_winner: string | null; // 'Republican', 'Democrat', or null
	electoral_year: number | null;
	electoral_margin: number | null;
	electoral_votes: number | null; // Number of electoral votes for this state
	webpage: string | null; // Congress.gov search URL for state representatives
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
	chamber_type: number | null; // 0 = house, 1 = senate
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
	citizen_voting_age_population: number | null;
	percent_registered_total: number | null;
	percent_registered_total_margin: number | null;
	percent_registered_citizen: number | null;
	percent_registered_citizen_margin: number | null;
	total_voted: number | null;
	percent_voted_total: number | null;
	percent_voted_total_margin: number | null;
	percent_voted_citizen: number | null;
	percent_voted_citizen_margin: number | null;
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
	bill_title: string | null; // Used for "bill" field
	bill_number: string | null;
	description: string | null;
	question: string | null; // Used for "vote" field
	date: string;
	chamber: string;
	result: string | null;
	stance: string | null; // The stance/position on the issue
	party_in_opposition: string | null; // Party that opposed
	party_in_favor: string | null; // Party that favored
	votes_in_favor: number | null; // Number of votes in favor
	votes_opposed: number | null; // Number of votes opposed
	total_votes: number | null; // Total votes cast
	exact_terminology: string | null; // Exact text from the bill supporting the stance
	page_line: string | null; // Page and line number citation (e.g., "Page 45, Line 12")
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
