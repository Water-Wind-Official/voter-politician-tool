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

		if (path === '/debug') {
			return handleDebug(request, env);
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
	
	// Debug info
	let debugInfo: any = {};
	
	try {
		// Fetch and sync House members
		const houseMembers = await fetchCongressMembers('house', env.CONGRESS_API_KEY);
		let houseCount = 0;
		let houseSkipped = 0;
		
		// Log first member structure for debugging
		if (houseMembers.length > 0) {
			console.log('Sample House member structure:', JSON.stringify(houseMembers[0]).substring(0, 500));
		}
		
		for (const member of houseMembers) {
			const converted = convertCongressMember(member, 'house');
			if (converted.length === 0) {
				houseSkipped++;
			}
			for (const person of converted) {
				await upsertPolitician(env.DB, person);
				houseCount++;
			}
		}

		// Fetch and sync Senate members
		const senateMembers = await fetchCongressMembers('senate', env.CONGRESS_API_KEY);
		let senateCount = 0;
		let senateSkipped = 0;
		
		// Log first member structure for debugging
		if (senateMembers.length > 0) {
			console.log('Sample Senate member structure:', JSON.stringify(senateMembers[0]).substring(0, 500));
		}
		
		for (const member of senateMembers) {
			const converted = convertCongressMember(member, 'senate');
			if (converted.length === 0) {
				senateSkipped++;
			}
			for (const person of converted) {
				await upsertPolitician(env.DB, person);
				senateCount++;
			}
		}
		
		// Debug info
		debugInfo = {
			houseMembersReceived: houseMembers.length,
			houseMembersSynced: houseCount,
			houseMembersSkipped: houseSkipped,
			senateMembersReceived: senateMembers.length,
			senateMembersSynced: senateCount,
			senateMembersSkipped: senateSkipped,
		};

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
				
				// Sync voting positions - need to fetch member votes for each vote
				// Congress.gov API has a separate endpoint for member votes: /house-vote/{congress}/{session}/{rollCallVoteNumber}/members
				if (vote.members && Array.isArray(vote.members)) {
					for (const member of vote.members) {
						const bioguideId = member.bioguideId;
						if (bioguideId) {
							const politicianId = `congress-${bioguideId}`;
							const politician = await getPoliticianByProPublicaId(env.DB, politicianId);
							if (politician) {
								const votePosition = (member as any).vote || (member as any).votePosition || 'Not Voting';
								const position = mapCongressVote(votePosition);
								await upsertVotingRecord(env.DB, politician.id, voteId, position);
								houseVoteRecordCount++;
							}
						}
					}
				} else {
					// If members aren't in the vote object, we'd need to fetch from the members endpoint
					// For now, skip individual member votes if not available
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
				
				if (vote.members && Array.isArray(vote.members)) {
					for (const member of vote.members) {
						const bioguideId = member.bioguideId;
						if (bioguideId) {
							const politicianId = `congress-${bioguideId}`;
							const politician = await getPoliticianByProPublicaId(env.DB, politicianId);
							if (politician) {
								const votePosition = (member as any).vote || (member as any).votePosition || 'Not Voting';
								const position = mapCongressVote(votePosition);
								await upsertVotingRecord(env.DB, politician.id, voteId, position);
								senateVoteRecordCount++;
							}
						}
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
			debug: debugInfo,
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

async function handleDebug(request: Request, env: Env): Promise<Response> {
	if (!env.CONGRESS_API_KEY) {
		return new Response('Congress.gov API key not configured', { status: 500 });
	}

	try {
		// Fetch a small sample to see the structure
		const houseMembers = await fetchCongressMembers('house', env.CONGRESS_API_KEY);
		const senateMembers = await fetchCongressMembers('senate', env.CONGRESS_API_KEY);
		
		// Try converting one to see what happens
		const testHouseConversion = houseMembers.length > 0 ? convertCongressMember(houseMembers[0], 'house') : [];
		const testSenateConversion = senateMembers.length > 0 ? convertCongressMember(senateMembers[0], 'senate') : [];
		
		return new Response(JSON.stringify({
			houseSample: houseMembers.length > 0 ? houseMembers[0] : null,
			senateSample: senateMembers.length > 0 ? senateMembers[0] : null,
			houseCount: houseMembers.length,
			senateCount: senateMembers.length,
			houseKeys: houseMembers.length > 0 ? Object.keys(houseMembers[0]) : [],
			senateKeys: senateMembers.length > 0 ? Object.keys(senateMembers[0]) : [],
			testHouseConversion: testHouseConversion,
			testSenateConversion: testSenateConversion,
		}, null, 2), {
			headers: { "content-type": "application/json" },
		});
	} catch (error: any) {
		return new Response(JSON.stringify({ 
			error: error.message,
			stack: error.stack
		}), {
			status: 500,
			headers: { "content-type": "application/json" },
		});
	}
}
