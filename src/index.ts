import { renderPoliticianList, renderPoliticianProfile } from "./renderHtml";
import { getPoliticians, getPolitician, getPoliticianVotes, getPoliticianByProPublicaId } from "./db";
import { upsertPolitician, upsertVote, upsertVotingRecord } from "./db";
import { 
	fetchGovTrackMembers, 
	fetchGovTrackRecentVotes, 
	convertGovTrackPerson, 
	convertGovTrackVote 
} from "./govtrack";

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const url = new URL(request.url);
		const path = url.pathname;

		// API endpoints
		if (path.startsWith('/api/')) {
			return handleApiRequest(request, env, path);
		}

		// Web pages
		if (path === '/' || path === '/index.html') {
			return handleHomePage(request, env);
		}

		if (path.startsWith('/politician/')) {
			const id = parseInt(path.split('/')[2]);
			if (!isNaN(id)) {
				return handlePoliticianPage(request, env, id);
			}
		}

		if (path === '/sync') {
			return handleSync(request, env);
		}

		// 404
		return new Response('Not Found', { status: 404 });
	},
} satisfies ExportedHandler<Env>;

async function handleHomePage(request: Request, env: Env): Promise<Response> {
	const state = new URL(request.url).searchParams.get('state');
	const chamber = new URL(request.url).searchParams.get('chamber');

	const politicians = await getPoliticians(env.DB, state || undefined, chamber || undefined);

	return new Response(renderPoliticianList(politicians, state, chamber), {
		headers: { "content-type": "text/html" },
	});
}

async function handlePoliticianPage(request: Request, env: Env, id: number): Promise<Response> {
	const politician = await getPolitician(env.DB, id);
	
	if (!politician) {
		return new Response('Politician not found', { status: 404 });
	}

	const votes = await getPoliticianVotes(env.DB, id, 50);

	return new Response(renderPoliticianProfile(politician, votes), {
		headers: { "content-type": "text/html" },
	});
}

async function handleApiRequest(request: Request, env: Env, path: string): Promise<Response> {
	if (path === '/api/politicians') {
		const state = new URL(request.url).searchParams.get('state');
		const chamber = new URL(request.url).searchParams.get('chamber');
		const politicians = await getPoliticians(env.DB, state || undefined, chamber || undefined);
		return Response.json(politicians);
	}

	if (path.startsWith('/api/politician/')) {
		const id = parseInt(path.split('/')[3]);
		if (!isNaN(id)) {
			const politician = await getPolitician(env.DB, id);
			if (!politician) {
				return new Response('Not found', { status: 404 });
			}
			const votes = await getPoliticianVotes(env.DB, id);
			return Response.json({ politician, votes });
		}
	}

	return new Response('Not found', { status: 404 });
}

async function handleSync(request: Request, env: Env): Promise<Response> {
	// This endpoint syncs data from GovTrack API
	// No API key required - GovTrack API is free and open
	
	try {
		// Fetch and sync House members
		const houseMembers = await fetchGovTrackMembers('house');
		let houseCount = 0;
		for (const member of houseMembers) {
			const converted = convertGovTrackPerson(member);
			for (const person of converted) {
				await upsertPolitician(env.DB, person);
				houseCount++;
			}
		}

		// Fetch and sync Senate members
		const senateMembers = await fetchGovTrackMembers('senate');
		let senateCount = 0;
		for (const member of senateMembers) {
			const converted = convertGovTrackPerson(member);
			for (const person of converted) {
				await upsertPolitician(env.DB, person);
				senateCount++;
			}
		}

		// Fetch recent votes and sync
		const houseVotes = await fetchGovTrackRecentVotes('house', 100);
		let houseVoteCount = 0;
		let houseVoteRecordCount = 0;
		
		for (const vote of houseVotes) {
			const voteData = convertGovTrackVote(vote);
			const voteId = await upsertVote(env.DB, voteData);
			houseVoteCount++;
			
			// Sync voting positions
			for (const voter of vote.voters) {
				const politicianId = `govtrack-${voter.person}`;
				const politician = await getPoliticianByProPublicaId(env.DB, politicianId);
				if (politician) {
					// Map GovTrack vote options to standard positions
					const position = mapVoteOption(voter.option.key);
					await upsertVotingRecord(env.DB, politician.id, voteId, position);
					houseVoteRecordCount++;
				}
			}
		}

		const senateVotes = await fetchGovTrackRecentVotes('senate', 100);
		let senateVoteCount = 0;
		let senateVoteRecordCount = 0;
		
		for (const vote of senateVotes) {
			const voteData = convertGovTrackVote(vote);
			const voteId = await upsertVote(env.DB, voteData);
			senateVoteCount++;
			
			for (const voter of vote.voters) {
				const politicianId = `govtrack-${voter.person}`;
				const politician = await getPoliticianByProPublicaId(env.DB, politicianId);
				if (politician) {
					const position = mapVoteOption(voter.option.key);
					await upsertVotingRecord(env.DB, politician.id, voteId, position);
					senateVoteRecordCount++;
				}
			}
		}

		return new Response(JSON.stringify({ 
			success: true, 
			message: 'Data synced successfully from GovTrack API',
			houseMembers: houseCount,
			senateMembers: senateCount,
			houseVotes: houseVoteCount,
			senateVotes: senateVoteCount,
			houseVoteRecords: houseVoteRecordCount,
			senateVoteRecords: senateVoteRecordCount
		}), {
			headers: { "content-type": "application/json" },
		});
	} catch (error: any) {
		return new Response(JSON.stringify({ 
			success: false, 
			error: error.message,
			stack: error.stack
		}), {
			status: 500,
			headers: { "content-type": "application/json" },
		});
	}
}

// Map GovTrack vote options to standard positions
function mapVoteOption(option: string): 'Yes' | 'No' | 'Not Voting' | 'Present' {
	const normalized = option.toLowerCase().trim();
	
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
