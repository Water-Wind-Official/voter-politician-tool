import { renderPoliticianList, renderPoliticianProfile } from "./renderHtml";
import { getPoliticians, getPolitician, getPoliticianVotes, getPoliticianByProPublicaId } from "./db";
import { upsertPolitician, upsertVote, upsertVotingRecord } from "./db";
import { 
	fetchCongressMembers, 
	fetchCongressVotes, 
	convertCongressMember,
	convertCongressVote,
	mapCongressVote
} from "./congressgov";

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
	// This endpoint syncs data from Congress.gov API
	// Requires CONGRESS_API_KEY in environment variables
	
	if (!env.CONGRESS_API_KEY) {
		return new Response(JSON.stringify({ 
			success: false, 
			error: 'Congress.gov API key not configured. Set CONGRESS_API_KEY environment variable.' 
		}), {
			status: 500,
			headers: { "content-type": "application/json" },
		});
	}
	
	try {
		// Fetch and sync House members
		const houseMembers = await fetchCongressMembers('house', env.CONGRESS_API_KEY);
		let houseCount = 0;
		for (const member of houseMembers) {
			const converted = convertCongressMember(member);
			for (const person of converted) {
				await upsertPolitician(env.DB, person);
				houseCount++;
			}
		}

		// Fetch and sync Senate members
		const senateMembers = await fetchCongressMembers('senate', env.CONGRESS_API_KEY);
		let senateCount = 0;
		for (const member of senateMembers) {
			const converted = convertCongressMember(member);
			for (const person of converted) {
				await upsertPolitician(env.DB, person);
				senateCount++;
			}
		}

		// Fetch recent votes and sync (optional - Congress.gov API may not have vote endpoint)
		let houseVoteCount = 0;
		let houseVoteRecordCount = 0;
		let senateVoteCount = 0;
		let senateVoteRecordCount = 0;
		let voteError: string | null = null;
		
		try {
			const houseVotes = await fetchCongressVotes('house', env.CONGRESS_API_KEY, 118, 100);
			
			for (const vote of houseVotes) {
				const voteData = convertCongressVote(vote);
				const voteId = await upsertVote(env.DB, voteData);
				houseVoteCount++;
				
				// Sync voting positions
				for (const member of vote.members) {
					const politicianId = `congress-${member.bioguideId}`;
					const politician = await getPoliticianByProPublicaId(env.DB, politicianId);
					if (politician) {
						const position = mapCongressVote(member.vote);
						await upsertVotingRecord(env.DB, politician.id, voteId, position);
						houseVoteRecordCount++;
					}
				}
			}
		} catch (error: any) {
			voteError = `House votes: ${error.message}`;
		}

		try {
			const senateVotes = await fetchCongressVotes('senate', env.CONGRESS_API_KEY, 118, 100);
			
			for (const vote of senateVotes) {
				const voteData = convertCongressVote(vote);
				const voteId = await upsertVote(env.DB, voteData);
				senateVoteCount++;
				
				for (const member of vote.members) {
					const politicianId = `congress-${member.bioguideId}`;
					const politician = await getPoliticianByProPublicaId(env.DB, politicianId);
					if (politician) {
						const position = mapCongressVote(member.vote);
						await upsertVotingRecord(env.DB, politician.id, voteId, position);
						senateVoteRecordCount++;
					}
				}
			}
		} catch (error: any) {
			voteError = voteError ? `${voteError}; Senate votes: ${error.message}` : `Senate votes: ${error.message}`;
		}

		return new Response(JSON.stringify({ 
			success: true, 
			message: 'Data synced successfully from Congress.gov API',
			houseMembers: houseCount,
			senateMembers: senateCount,
			houseVotes: houseVoteCount,
			senateVotes: senateVoteCount,
			houseVoteRecords: houseVoteRecordCount,
			senateVoteRecords: senateVoteRecordCount,
			note: voteError ? `Note: Vote data unavailable - ${voteError}. Members synced successfully.` : undefined
		}), {
			headers: { "content-type": "application/json" },
		});
	} catch (error: any) {
		return new Response(JSON.stringify({ 
			success: false, 
			error: error.message || 'Unknown error',
			stack: error.stack
		}), {
			status: 500,
			headers: { "content-type": "application/json" },
		});
	}
}

