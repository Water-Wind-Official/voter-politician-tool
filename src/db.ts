// Database operations for state-based voter information system
import type { 
	Politician, Vote, VotingRecord, 
	State, Representative, District, VoterData, VoterDemographic 
} from './types';

// Generic politician data interface
export interface PoliticianData {
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
}

// Generic vote data interface
export interface VoteData {
	propublica_roll_id: string;
	bill_id: string | null;
	bill_title: string | null;
	bill_number: string | null;
	description: string | null;
	question: string | null;
	date: string;
	chamber: string;
	result: string | null;
}

export async function upsertPolitician(
	db: D1Database,
	member: PoliticianData
): Promise<number> {
	const result = await db
		.prepare(
			`INSERT INTO politicians (
				propublica_id, name, first_name, last_name, state, party, chamber, 
				district, twitter_handle, website, updated_at
			) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
			ON CONFLICT(propublica_id) DO UPDATE SET
				name = excluded.name,
				first_name = excluded.first_name,
				last_name = excluded.last_name,
				state = excluded.state,
				party = excluded.party,
				chamber = excluded.chamber,
				district = excluded.district,
				twitter_handle = excluded.twitter_handle,
				website = excluded.website,
				updated_at = CURRENT_TIMESTAMP
			RETURNING id`
		)
		.bind(
			member.propublica_id,
			member.name,
			member.first_name,
			member.last_name,
			member.state,
			member.party,
			member.chamber,
			member.district || null,
			member.twitter_handle || null,
			member.website || null
		)
		.first<{ id: number }>();

	return result!.id;
}

export async function upsertVote(
	db: D1Database,
	vote: VoteData
): Promise<number> {
	const result = await db
		.prepare(
			`INSERT INTO votes (
				propublica_roll_id, bill_id, bill_title, bill_number, description, 
				question, date, chamber, result
			) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
			ON CONFLICT(propublica_roll_id) DO UPDATE SET
				bill_id = excluded.bill_id,
				bill_title = excluded.bill_title,
				bill_number = excluded.bill_number,
				description = excluded.description,
				question = excluded.question,
				date = excluded.date,
				chamber = excluded.chamber,
				result = excluded.result
			RETURNING id`
		)
		.bind(
			vote.propublica_roll_id,
			vote.bill_id,
			vote.bill_title,
			vote.bill_number,
			vote.description,
			vote.question,
			vote.date,
			vote.chamber,
			vote.result
		)
		.first<{ id: number }>();

	return result!.id;
}

export async function upsertVotingRecord(
	db: D1Database,
	politicianId: number,
	voteId: number,
	position: string
): Promise<void> {
	await db
		.prepare(
			`INSERT INTO voting_records (politician_id, vote_id, position)
			VALUES (?, ?, ?)
			ON CONFLICT(politician_id, vote_id) DO UPDATE SET
				position = excluded.position`
		)
		.bind(politicianId, voteId, position)
		.run();
}

export async function getPoliticians(
	db: D1Database,
	state?: string,
	chamber?: string
): Promise<Politician[]> {
	let query = 'SELECT * FROM politicians WHERE 1=1';
	const params: any[] = [];

	if (state) {
		query += ' AND state = ?';
		params.push(state);
	}

	if (chamber) {
		query += ' AND chamber = ?';
		params.push(chamber);
	}

	query += ' ORDER BY state, last_name';

	const stmt = db.prepare(query);
	if (params.length > 0) {
		return (await stmt.bind(...params).all<Politician>()).results;
	}
	return (await stmt.all<Politician>()).results;
}

export async function getPolitician(
	db: D1Database,
	id: number
): Promise<Politician | null> {
	const result = await db
		.prepare('SELECT * FROM politicians WHERE id = ?')
		.bind(id)
		.first<Politician>();

	return result || null;
}

export async function getPoliticianByProPublicaId(
	db: D1Database,
	propublicaId: string
): Promise<Politician | null> {
	const result = await db
		.prepare('SELECT * FROM politicians WHERE propublica_id = ?')
		.bind(propublicaId)
		.first<Politician>();

	return result || null;
}

export async function getPoliticianVotes(
	db: D1Database,
	politicianId: number,
	limit: number = 20
): Promise<Array<VotingRecord & { vote: Vote }>> {
	const results = await db
		.prepare(
			`SELECT 
				vr.*,
				v.id as vote_id,
				v.propublica_roll_id,
				v.bill_id,
				v.bill_title,
				v.bill_number,
				v.description,
				v.question,
				v.date,
				v.chamber,
				v.result
			FROM voting_records vr
			JOIN votes v ON vr.vote_id = v.id
			WHERE vr.politician_id = ?
			ORDER BY v.date DESC
			LIMIT ?`
		)
		.bind(politicianId, limit)
		.all();

	return results.results.map((row: any) => ({
		id: row.id,
		politician_id: row.politician_id,
		vote_id: row.vote_id,
		position: row.position,
		vote: {
			id: row.vote_id,
			propublica_roll_id: row.propublica_roll_id,
			bill_id: row.bill_id,
			bill_title: row.bill_title,
			bill_number: row.bill_number,
			description: row.description,
			question: row.question,
			date: row.date,
			chamber: row.chamber,
			result: row.result,
		},
	}));
}

// New database functions for state-based system

export async function getAllStates(db: D1Database): Promise<State[]> {
	const result = await db
		.prepare('SELECT * FROM states ORDER BY name')
		.all<State>();
	return result.results;
}

export async function getStateByCode(db: D1Database, code: string): Promise<State | null> {
	const result = await db
		.prepare('SELECT * FROM states WHERE code = ?')
		.bind(code)
		.first<State>();
	return result || null;
}

export async function getRepresentativesByState(
	db: D1Database,
	stateCode: string,
	chamber?: 'house' | 'senate'
): Promise<Representative[]> {
	let query = `
		SELECT r.*, d.district_number, d.name as district_name
		FROM representatives r
		LEFT JOIN districts d ON r.district_id = d.id
		WHERE r.state_code = ? AND r.is_active = 1
	`;
	const params: any[] = [stateCode];

	if (chamber) {
		query += ' AND r.chamber = ?';
		params.push(chamber);
	}

	query += ' ORDER BY r.chamber, d.district_number, r.last_name';

	const stmt = db.prepare(query);
	if (params.length > 1) {
		return (await stmt.bind(...params).all<Representative>()).results;
	}
	return (await stmt.bind(stateCode).all<Representative>()).results;
}

export async function getRepresentative(db: D1Database, id: number): Promise<Representative | null> {
	const result = await db
		.prepare(`
			SELECT r.*, d.district_number, d.name as district_name
			FROM representatives r
			LEFT JOIN districts d ON r.district_id = d.id
			WHERE r.id = ?
		`)
		.bind(id)
		.first<Representative>();
	return result || null;
}

export async function getDistrictsByState(db: D1Database, stateCode: string): Promise<District[]> {
	const result = await db
		.prepare('SELECT * FROM districts WHERE state_code = ? ORDER BY district_number')
		.bind(stateCode)
		.all<District>();
	return result.results;
}

export async function getVoterDataByState(
	db: D1Database,
	stateCode: string
): Promise<VoterData | null> {
	const result = await db
		.prepare(`
			SELECT * FROM voter_data 
			WHERE state_code = ? 
			ORDER BY data_year DESC 
			LIMIT 1
		`)
		.bind(stateCode)
		.first<VoterData>();
	return result || null;
}

export async function getVoterDemographicsByState(
	db: D1Database,
	stateCode: string,
	districtId?: number
): Promise<VoterDemographic[]> {
	let query = 'SELECT * FROM voter_demographics WHERE state_code = ?';
	const params: any[] = [stateCode];

	if (districtId) {
		query += ' AND district_id = ?';
		params.push(districtId);
	} else {
		query += ' AND district_id IS NULL';
	}

	query += ' ORDER BY demographic_type, category';

	const stmt = db.prepare(query);
	return (await stmt.bind(...params).all<VoterDemographic>()).results;
}

// Admin functions for CRUD operations

export async function getAllRepresentatives(db: D1Database): Promise<Representative[]> {
	const result = await db
		.prepare(`
			SELECT r.*, d.district_number, d.name as district_name
			FROM representatives r
			LEFT JOIN districts d ON r.district_id = d.id
			ORDER BY r.state_code, r.chamber, d.district_number, r.last_name
		`)
		.all<Representative>();
	return result.results;
}

export async function createRepresentative(db: D1Database, data: Partial<Representative>): Promise<number> {
	const result = await db
		.prepare(`
			INSERT INTO representatives (
				external_id, name, first_name, last_name, middle_name, suffix,
				state_code, party, chamber, district_id, office_address, office_phone,
				email, twitter_handle, facebook_url, website, photo_url, bio,
				term_start, term_end, is_active
			) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
			RETURNING id
		`)
		.bind(
			data.external_id || null,
			data.name || '',
			data.first_name || null,
			data.last_name || null,
			data.middle_name || null,
			data.suffix || null,
			data.state_code || '',
			data.party || null,
			data.chamber || 'house',
			data.district_id || null,
			data.office_address || null,
			data.office_phone || null,
			data.email || null,
			data.twitter_handle || null,
			data.facebook_url || null,
			data.website || null,
			data.photo_url || null,
			data.bio || null,
			data.term_start || null,
			data.term_end || null,
			data.is_active !== undefined ? (data.is_active ? 1 : 0) : 1
		)
		.first<{ id: number }>();
	return result!.id;
}

export async function updateRepresentative(db: D1Database, id: number, data: Partial<Representative>): Promise<void> {
	const updates: string[] = [];
	const values: any[] = [];

	if (data.name !== undefined) { updates.push('name = ?'); values.push(data.name); }
	if (data.first_name !== undefined) { updates.push('first_name = ?'); values.push(data.first_name); }
	if (data.last_name !== undefined) { updates.push('last_name = ?'); values.push(data.last_name); }
	if (data.middle_name !== undefined) { updates.push('middle_name = ?'); values.push(data.middle_name); }
	if (data.suffix !== undefined) { updates.push('suffix = ?'); values.push(data.suffix); }
	if (data.state_code !== undefined) { updates.push('state_code = ?'); values.push(data.state_code); }
	if (data.party !== undefined) { updates.push('party = ?'); values.push(data.party); }
	if (data.chamber !== undefined) { updates.push('chamber = ?'); values.push(data.chamber); }
	if (data.district_id !== undefined) { updates.push('district_id = ?'); values.push(data.district_id); }
	if (data.office_address !== undefined) { updates.push('office_address = ?'); values.push(data.office_address); }
	if (data.office_phone !== undefined) { updates.push('office_phone = ?'); values.push(data.office_phone); }
	if (data.email !== undefined) { updates.push('email = ?'); values.push(data.email); }
	if (data.twitter_handle !== undefined) { updates.push('twitter_handle = ?'); values.push(data.twitter_handle); }
	if (data.facebook_url !== undefined) { updates.push('facebook_url = ?'); values.push(data.facebook_url); }
	if (data.website !== undefined) { updates.push('website = ?'); values.push(data.website); }
	if (data.photo_url !== undefined) { updates.push('photo_url = ?'); values.push(data.photo_url); }
	if (data.bio !== undefined) { updates.push('bio = ?'); values.push(data.bio); }
	if (data.term_start !== undefined) { updates.push('term_start = ?'); values.push(data.term_start); }
	if (data.term_end !== undefined) { updates.push('term_end = ?'); values.push(data.term_end); }
	if (data.is_active !== undefined) { updates.push('is_active = ?'); values.push(data.is_active ? 1 : 0); }

	updates.push('updated_at = CURRENT_TIMESTAMP');
	values.push(id);

	await db
		.prepare(`UPDATE representatives SET ${updates.join(', ')} WHERE id = ?`)
		.bind(...values)
		.run();
}

export async function deleteRepresentative(db: D1Database, id: number): Promise<void> {
	await db.prepare('DELETE FROM representatives WHERE id = ?').bind(id).run();
}

export async function upsertVoterData(db: D1Database, data: Partial<VoterData>): Promise<number> {
	const result = await db
		.prepare(`
			INSERT INTO voter_data (
				state_code, total_registered_voters, total_population, voting_age_population,
				voter_turnout_percentage, last_election_date, data_source, data_year, notes
			) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
			ON CONFLICT(state_code, data_year) DO UPDATE SET
				total_registered_voters = excluded.total_registered_voters,
				total_population = excluded.total_population,
				voting_age_population = excluded.voting_age_population,
				voter_turnout_percentage = excluded.voter_turnout_percentage,
				last_election_date = excluded.last_election_date,
				data_source = excluded.data_source,
				notes = excluded.notes,
				updated_at = CURRENT_TIMESTAMP
			RETURNING id
		`)
		.bind(
			data.state_code || '',
			data.total_registered_voters || null,
			data.total_population || null,
			data.voting_age_population || null,
			data.voter_turnout_percentage || null,
			data.last_election_date || null,
			data.data_source || null,
			data.data_year || new Date().getFullYear(),
			data.notes || null
		)
		.first<{ id: number }>();
	return result!.id;
}

export async function upsertVoterDemographic(db: D1Database, data: Partial<VoterDemographic>): Promise<number> {
	const result = await db
		.prepare(`
			INSERT INTO voter_demographics (
				state_code, district_id, demographic_type, category, count, percentage, data_year
			) VALUES (?, ?, ?, ?, ?, ?, ?)
			ON CONFLICT DO NOTHING
			RETURNING id
		`)
		.bind(
			data.state_code || '',
			data.district_id || null,
			data.demographic_type || '',
			data.category || '',
			data.count || null,
			data.percentage || null,
			data.data_year || new Date().getFullYear()
		)
		.first<{ id: number }>();
	return result ? result.id : 0;
}

export async function createDistrict(db: D1Database, data: Partial<District>): Promise<number> {
	const result = await db
		.prepare(`
			INSERT INTO districts (state_code, district_number, name, population, area_sq_miles, description)
			VALUES (?, ?, ?, ?, ?, ?)
			RETURNING id
		`)
		.bind(
			data.state_code || '',
			data.district_number || null,
			data.name || null,
			data.population || null,
			data.area_sq_miles || null,
			data.description || null
		)
		.first<{ id: number }>();
	return result!.id;
}

export async function getAllVotes(db: D1Database): Promise<any[]> {
	const result = await db
		.prepare('SELECT * FROM votes ORDER BY date DESC LIMIT 100')
		.all();
	return result.results;
}

export async function createVote(db: D1Database, data: Partial<VoteData>): Promise<number> {
	const result = await db
		.prepare(`
			INSERT INTO votes (
				propublica_roll_id, bill_id, bill_title, bill_number, description,
				question, date, chamber, result
			) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
			ON CONFLICT(propublica_roll_id) DO UPDATE SET
				bill_id = excluded.bill_id,
				bill_title = excluded.bill_title,
				bill_number = excluded.bill_number,
				description = excluded.description,
				question = excluded.question,
				date = excluded.date,
				chamber = excluded.chamber,
				result = excluded.result
			RETURNING id
		`)
		.bind(
			data.propublica_roll_id || `vote-${Date.now()}`,
			data.bill_id || null,
			data.bill_title || null,
			data.bill_number || null,
			data.description || null,
			data.question || null,
			data.date || new Date().toISOString().split('T')[0],
			data.chamber || 'house',
			data.result || null
		)
		.first<{ id: number }>();
	return result!.id;
}
