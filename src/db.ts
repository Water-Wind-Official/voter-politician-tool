// Database operations for state-based voter information system
import type {
	Politician, Vote, VotingRecord,
	State, Representative, VoterData, VoterDemographic, Issue
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

export async function updateStateElectoralData(
	db: D1Database,
	stateCode: string,
	electoralWinner: string | null,
	electoralYear: number | null,
	electoralMargin: number | null,
	electoralVotes: number | null
): Promise<void> {
	await db
		.prepare(`
			UPDATE states
			SET electoral_winner = ?,
				electoral_year = ?,
				electoral_margin = ?,
				electoral_votes = ?,
				updated_at = CURRENT_TIMESTAMP
			WHERE code = ?
		`)
		.bind(electoralWinner, electoralYear, electoralMargin, electoralVotes, stateCode)
		.run();
}

export async function getRepresentativesByState(
	db: D1Database,
	stateCode: string,
	chamber?: 'house' | 'senate'
): Promise<Representative[]> {
	let query = `
		SELECT r.*
		FROM representatives r
		WHERE r.state_code = ? AND r.is_active = 1
	`;
	const params: any[] = [stateCode];

	if (chamber) {
		query += ' AND r.chamber = ?';
		params.push(chamber);
	}

	query += ' ORDER BY r.chamber, r.last_name';

	const stmt = db.prepare(query);
	if (params.length > 1) {
		return (await stmt.bind(...params).all<Representative>()).results;
	}
	return (await stmt.bind(stateCode).all<Representative>()).results;
}

export async function getRepresentative(db: D1Database, id: number): Promise<Representative | null> {
	const result = await db
		.prepare(`
			SELECT r.*
			FROM representatives r
			WHERE r.id = ?
		`)
		.bind(id)
		.first<Representative>();
	return result || null;
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
	stateCode: string
): Promise<VoterDemographic[]> {
	const result = await db
		.prepare('SELECT * FROM voter_demographics WHERE state_code = ? ORDER BY demographic_type, category')
		.bind(stateCode)
		.all<VoterDemographic>();
	return result.results;
}

// Admin functions for CRUD operations

export async function getAllRepresentatives(db: D1Database): Promise<Representative[]> {
	const result = await db
		.prepare(`
			SELECT r.*
			FROM representatives r
			ORDER BY r.state_code, r.chamber, r.last_name
		`)
		.all<Representative>();
	return result.results;
}

export async function getAllSenators(db: D1Database): Promise<Representative[]> {
	const result = await db
		.prepare(`
			SELECT r.*
			FROM representatives r
			WHERE r.chamber = 'senate' AND (r.chamber_type = 1 OR r.chamber_type IS NULL)
			ORDER BY r.state_code, r.last_name
		`)
		.all<Representative>();
	return result.results;
}

export async function getAllHouseMembers(db: D1Database): Promise<Representative[]> {
	const result = await db
		.prepare(`
			SELECT r.*
			FROM representatives r
			WHERE r.chamber = 'house' AND r.chamber_type = 0
			ORDER BY r.state_code, r.last_name
		`)
		.all<Representative>();
	return result.results;
}

export async function createRepresentative(db: D1Database, data: Partial<Representative>): Promise<number> {
	const result = await db
		.prepare(`
			INSERT INTO representatives (
				external_id, name, first_name, last_name, middle_name, suffix,
				state_code, party, chamber, chamber_type, office_address, office_phone,
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
			data.chamber === 'senate' ? 1 : 0,
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
				citizen_voting_age_population, percent_registered_total, percent_registered_total_margin,
				percent_registered_citizen, percent_registered_citizen_margin, total_voted,
				percent_voted_total, percent_voted_total_margin, percent_voted_citizen,
				percent_voted_citizen_margin, last_election_date, data_source, data_year, notes
			) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
			ON CONFLICT(state_code, data_year) DO UPDATE SET
				total_registered_voters = excluded.total_registered_voters,
				total_population = excluded.total_population,
				voting_age_population = excluded.voting_age_population,
				citizen_voting_age_population = excluded.citizen_voting_age_population,
				percent_registered_total = excluded.percent_registered_total,
				percent_registered_total_margin = excluded.percent_registered_total_margin,
				percent_registered_citizen = excluded.percent_registered_citizen,
				percent_registered_citizen_margin = excluded.percent_registered_citizen_margin,
				total_voted = excluded.total_voted,
				percent_voted_total = excluded.percent_voted_total,
				percent_voted_total_margin = excluded.percent_voted_total_margin,
				percent_voted_citizen = excluded.percent_voted_citizen,
				percent_voted_citizen_margin = excluded.percent_voted_citizen_margin,
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
			data.citizen_voting_age_population || null,
			data.percent_registered_total || null,
			data.percent_registered_total_margin || null,
			data.percent_registered_citizen || null,
			data.percent_registered_citizen_margin || null,
			data.total_voted || null,
			data.percent_voted_total || null,
			data.percent_voted_total_margin || null,
			data.percent_voted_citizen || null,
			data.percent_voted_citizen_margin || null,
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
				state_code, demographic_type, category, count, percentage, data_year
			) VALUES (?, ?, ?, ?, ?, ?)
			ON CONFLICT DO NOTHING
			RETURNING id
		`)
		.bind(
			data.state_code || '',
			data.demographic_type || '',
			data.category || '',
			data.count || null,
			data.percentage || null,
			data.data_year || new Date().getFullYear()
		)
		.first<{ id: number }>();
	return result ? result.id : 0;
}


export async function updateVote(db: D1Database, id: number, data: Partial<VoteData>): Promise<void> {
	const updates: string[] = [];
	const values: any[] = [];

	if (data.bill_id !== undefined) { updates.push('bill_id = ?'); values.push(data.bill_id); }
	if (data.bill_title !== undefined) { updates.push('bill_title = ?'); values.push(data.bill_title); }
	if (data.bill_number !== undefined) { updates.push('bill_number = ?'); values.push(data.bill_number); }
	if (data.description !== undefined) { updates.push('description = ?'); values.push(data.description); }
	if (data.question !== undefined) { updates.push('question = ?'); values.push(data.question); }
	if (data.date !== undefined) { updates.push('date = ?'); values.push(data.date); }
	if (data.chamber !== undefined) { updates.push('chamber = ?'); values.push(data.chamber); }
	if (data.result !== undefined) { updates.push('result = ?'); values.push(data.result); }
	if ((data as any).stance !== undefined) { updates.push('stance = ?'); values.push((data as any).stance); }
	if ((data as any).party_in_opposition !== undefined) { updates.push('party_in_opposition = ?'); values.push((data as any).party_in_opposition); }
	if ((data as any).party_in_favor !== undefined) { updates.push('party_in_favor = ?'); values.push((data as any).party_in_favor); }
	if ((data as any).votes_in_favor !== undefined) { updates.push('votes_in_favor = ?'); values.push((data as any).votes_in_favor); }
	if ((data as any).votes_opposed !== undefined) { updates.push('votes_opposed = ?'); values.push((data as any).votes_opposed); }
	if ((data as any).total_votes !== undefined) { updates.push('total_votes = ?'); values.push((data as any).total_votes); }
	if ((data as any).exact_terminology !== undefined) { updates.push('exact_terminology = ?'); values.push((data as any).exact_terminology); }
	if ((data as any).page_line !== undefined) { updates.push('page_line = ?'); values.push((data as any).page_line); }

	if (updates.length === 0) return;

	values.push(id);

	await db
		.prepare(`UPDATE votes SET ${updates.join(', ')} WHERE id = ?`)
		.bind(...values)
		.run();
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
				question, date, chamber, result, stance, party_in_opposition,
				party_in_favor, votes_in_favor, votes_opposed, total_votes,
				exact_terminology, page_line
			) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
			ON CONFLICT(propublica_roll_id) DO UPDATE SET
				bill_id = excluded.bill_id,
				bill_title = excluded.bill_title,
				bill_number = excluded.bill_number,
				description = excluded.description,
				question = excluded.question,
				date = excluded.date,
				chamber = excluded.chamber,
				result = excluded.result,
				stance = excluded.stance,
				party_in_opposition = excluded.party_in_opposition,
				party_in_favor = excluded.party_in_favor,
				votes_in_favor = excluded.votes_in_favor,
				votes_opposed = excluded.votes_opposed,
				total_votes = excluded.total_votes,
				exact_terminology = excluded.exact_terminology,
				page_line = excluded.page_line
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
			data.result || null,
			(data as any).stance || null,
			(data as any).party_in_opposition || null,
			(data as any).party_in_favor || null,
			(data as any).votes_in_favor || null,
			(data as any).votes_opposed || null,
			(data as any).total_votes || null,
			(data as any).exact_terminology || null,
			(data as any).page_line || null
		)
		.first<{ id: number }>();
	return result!.id;
}

// Issues management functions
export async function getAllIssues(db: D1Database): Promise<Issue[]> {
	const result = await db
		.prepare('SELECT * FROM issues WHERE is_active = 1 ORDER BY priority DESC, created_at DESC')
		.all();
	return result.results as Issue[];
}

export async function getIssuesByParty(db: D1Database, party: string): Promise<Issue[]> {
	const result = await db
		.prepare('SELECT * FROM issues WHERE party = ? AND is_active = 1 ORDER BY priority DESC, created_at DESC')
		.bind(party)
		.all();
	return result.results as Issue[];
}

export async function getIssue(db: D1Database, id: number): Promise<Issue | null> {
	const result = await db
		.prepare('SELECT * FROM issues WHERE id = ?')
		.bind(id)
		.first();
	return result as Issue | null;
}

export async function createIssue(db: D1Database, data: Omit<Issue, 'id' | 'created_at' | 'updated_at'>): Promise<number> {
	const result = await db
		.prepare(`
			INSERT INTO issues (title, description, party, category, priority, is_active, link1, link2, link3, link4, link5, link6)
			VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
		`)
		.bind(
			data.title,
			data.description || null,
			data.party,
			data.category || null,
			data.priority || 0,
			data.is_active ? 1 : 0,
			data.link1 || null,
			data.link2 || null,
			data.link3 || null,
			data.link4 || null,
			data.link5 || null,
			data.link6 || null
		)
		.run();

	// Get the inserted ID
	const idResult = await db
		.prepare('SELECT last_insert_rowid() as id')
		.first<{ id: number }>();
	return idResult!.id;
}

export async function updateIssue(db: D1Database, id: number, data: Partial<Omit<Issue, 'id' | 'created_at' | 'updated_at'>>): Promise<void> {
	const updates: string[] = [];
	const values: any[] = [];

	if (data.title !== undefined) {
		updates.push('title = ?');
		values.push(data.title);
	}
	if (data.description !== undefined) {
		updates.push('description = ?');
		values.push(data.description);
	}
	if (data.party !== undefined) {
		updates.push('party = ?');
		values.push(data.party);
	}
	if (data.category !== undefined) {
		updates.push('category = ?');
		values.push(data.category);
	}
	if (data.priority !== undefined) {
		updates.push('priority = ?');
		values.push(data.priority);
	}
	if (data.is_active !== undefined) {
		updates.push('is_active = ?');
		values.push(data.is_active ? 1 : 0);
	}
	if (data.link1 !== undefined) {
		updates.push('link1 = ?');
		values.push(data.link1);
	}
	if (data.link2 !== undefined) {
		updates.push('link2 = ?');
		values.push(data.link2);
	}
	if (data.link3 !== undefined) {
		updates.push('link3 = ?');
		values.push(data.link3);
	}
	if (data.link4 !== undefined) {
		updates.push('link4 = ?');
		values.push(data.link4);
	}
	if (data.link5 !== undefined) {
		updates.push('link5 = ?');
		values.push(data.link5);
	}
	if (data.link6 !== undefined) {
		updates.push('link6 = ?');
		values.push(data.link6);
	}

	if (updates.length > 0) {
		updates.push('updated_at = CURRENT_TIMESTAMP');
		values.push(id);

		await db
			.prepare(`UPDATE issues SET ${updates.join(', ')} WHERE id = ?`)
			.bind(...values)
			.run();
	}
}

export async function deleteIssue(db: D1Database, id: number): Promise<void> {
	await db.prepare('DELETE FROM issues WHERE id = ?').bind(id).run();
}

// Money management functions
export async function getAllMoney(db: D1Database): Promise<Money[]> {
	const result = await db
		.prepare('SELECT * FROM moneyhub WHERE is_active = 1 ORDER BY priority DESC, created_at DESC')
		.all();
	return result.results as Money[];
}

export async function getMoneyByParty(db: D1Database, party: string): Promise<Money[]> {
	const result = await db
		.prepare('SELECT * FROM moneyhub WHERE party = ? AND is_active = 1 ORDER BY priority DESC, created_at DESC')
		.bind(party)
		.all();
	return result.results as Money[];
}

export async function getMoney(db: D1Database, id: number): Promise<Money | null> {
	const result = await db
		.prepare('SELECT * FROM moneyhub WHERE id = ?')
		.bind(id)
		.first();
	return result as Money | null;
}

export async function createMoney(db: D1Database, data: Omit<Money, 'id' | 'created_at' | 'updated_at'>): Promise<number> {
	const result = await db
		.prepare(`
			INSERT INTO moneyhub (title, description, party, category, priority, is_active, link1, link2, link3, link4, link5, link6)
			VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
		`)
		.bind(
			data.title,
			data.description,
			data.party,
			data.category,
			data.priority,
			data.is_active,
			data.link1,
			data.link2,
			data.link3,
			data.link4,
			data.link5,
			data.link6
		)
		.run();

	const idResult = await db.prepare('SELECT last_insert_rowid() as id').first();
	return idResult!.id;
}

export async function updateMoney(db: D1Database, id: number, data: Partial<Omit<Money, 'id' | 'created_at' | 'updated_at'>>): Promise<void> {
	const updates: string[] = [];
	const values: any[] = [];

	if (data.title !== undefined) {
		updates.push('title = ?');
		values.push(data.title);
	}
	if (data.description !== undefined) {
		updates.push('description = ?');
		values.push(data.description);
	}
	if (data.party !== undefined) {
		updates.push('party = ?');
		values.push(data.party);
	}
	if (data.category !== undefined) {
		updates.push('category = ?');
		values.push(data.category);
	}
	if (data.priority !== undefined) {
		updates.push('priority = ?');
		values.push(data.priority);
	}
	if (data.is_active !== undefined) {
		updates.push('is_active = ?');
		values.push(data.is_active);
	}
	if (data.link1 !== undefined) {
		updates.push('link1 = ?');
		values.push(data.link1);
	}
	if (data.link2 !== undefined) {
		updates.push('link2 = ?');
		values.push(data.link2);
	}
	if (data.link3 !== undefined) {
		updates.push('link3 = ?');
		values.push(data.link3);
	}
	if (data.link4 !== undefined) {
		updates.push('link4 = ?');
		values.push(data.link4);
	}
	if (data.link5 !== undefined) {
		updates.push('link5 = ?');
		values.push(data.link5);
	}
	if (data.link6 !== undefined) {
		updates.push('link6 = ?');
		values.push(data.link6);
	}

	if (updates.length > 0) {
		updates.push('updated_at = CURRENT_TIMESTAMP');
		values.push(id);

		await db
			.prepare(`UPDATE moneyhub SET ${updates.join(', ')} WHERE id = ?`)
			.bind(...values)
			.run();
	}
}

export async function deleteMoney(db: D1Database, id: number): Promise<void> {
	await db.prepare('DELETE FROM moneyhub WHERE id = ?').bind(id).run();
}
