// Database operations for politicians and votes
import type { Politician, Vote, VotingRecord } from './types';

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
