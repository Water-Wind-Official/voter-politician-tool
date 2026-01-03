/// <reference types="../worker-configuration.d.ts" />

import { renderHomePage } from "./renderMap";
import { renderPoliticianProfile } from "./renderHtml";
import { renderAdminLogin, renderAdminDashboard } from "./renderAdmin";
import { renderSenatorHub } from "./renderSenators";
import { renderHouseHub } from "./renderHouse";
import { renderElectionHub } from "./renderElection";
import { renderIssuesPage } from "./renderIssues";
import { renderCandidateProfile } from "./renderCandidates";
import {
	getAllStates,
	getStateByCode,
	getRepresentativesByState,
	getRepresentative,
	getVoterDataByState,
	getVoterDemographicsByState,
	getPoliticianVotes,
	getAllRepresentatives,
	getAllSenators,
	getAllHouseMembers,
	createRepresentative,
	updateRepresentative,
	deleteRepresentative,
	upsertVoterData,
	updateStateElectoralData,
	getAllIssues,
	getIssuesByParty,
	getIssue,
	createIssue,
	updateIssue,
	deleteIssue
} from "./db";

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const url = new URL(request.url);
		const path = url.pathname;

		// Admin API endpoints (before general API endpoints to ensure admin auth)
		if (path.startsWith('/api/admin/')) {
			return handleAdminApi(request, env, path);
		}

		// API endpoints
		if (path.startsWith('/api/')) {
			return handleApiRequest(request, env, path);
		}

		// Web pages
		if (path === '/' || path === '/index.html') {
			return handleHomePage(request, env);
		}

		if (path === '/senators' || path === '/senator-hub') {
			return handleSenatorHub(request, env);
		}

		if (path === '/house' || path === '/house-hub') {
			return handleHouseHub(request, env);
		}

		if (path === '/election' || path === '/election-hub') {
			return handleElectionHub(request, env);
		}

		if (path === '/issues') {
			return handleIssuesPage(request, env);
		}

		if (path === '/trump' || path === '/donald-trump') {
			return handleCandidatePage(request, env, 'trump');
		}

		if (path === '/harris' || path === '/kamala-harris') {
			return handleCandidatePage(request, env, 'harris');
		}

		if (path.startsWith('/representative/')) {
			const id = parseInt(path.split('/')[2]);
			if (!isNaN(id)) {
				return handleRepresentativePage(request, env, id);
			}
		}

		// Legacy politician route for backward compatibility
		if (path.startsWith('/politician/')) {
			const id = parseInt(path.split('/')[2]);
			if (!isNaN(id)) {
				return handleRepresentativePage(request, env, id);
			}
		}

		// Admin routes
		if (path === '/admin' || path === '/admin/') {
			return handleAdminDashboard(request, env);
		}

		if (path === '/admin/login') {
			return handleAdminLogin(request, env);
		}

		if (path === '/admin/logout') {
			return handleAdminLogout(request, env);
		}

		// 404
		return new Response('Not Found', { status: 404 });
	},
} satisfies ExportedHandler<Env>;

async function handleHomePage(request: Request, env: Env): Promise<Response> {
	const states = await getAllStates(env.DB);

	return new Response(renderHomePage(states), {
		headers: { "content-type": "text/html" },
	});
}

async function handleSenatorHub(request: Request, env: Env): Promise<Response> {
	const senators = await getAllSenators(env.DB);

	return new Response(renderSenatorHub(senators), {
		headers: { "content-type": "text/html" },
	});
}

async function handleHouseHub(request: Request, env: Env): Promise<Response> {
	const houseMembers = await getAllHouseMembers(env.DB);

	return new Response(renderHouseHub(houseMembers), {
		headers: { "content-type": "text/html" },
	});
}

async function handleElectionHub(request: Request, env: Env): Promise<Response> {
	const states = await getAllStates(env.DB);

	return new Response(renderElectionHub(states), {
		headers: { "content-type": "text/html" },
	});
}

async function handleIssuesPage(request: Request, env: Env): Promise<Response> {
	const [democratIssues, republicanIssues, bothIssues] = await Promise.all([
		getIssuesByParty(env.DB, 'Democrat'),
		getIssuesByParty(env.DB, 'Republican'),
		getIssuesByParty(env.DB, 'Both')
	]);

	return new Response(renderIssuesPage(democratIssues, republicanIssues, bothIssues), {
		headers: { "content-type": "text/html" },
	});
}

async function handleCandidatePage(request: Request, env: Env, candidate: 'trump' | 'harris'): Promise<Response> {
	return new Response(renderCandidateProfile(candidate), {
		headers: { "content-type": "text/html" },
	});
}

async function handleRepresentativePage(request: Request, env: Env, id: number): Promise<Response> {
	const representative = await getRepresentative(env.DB, id);

	if (!representative) {
		return new Response('Representative not found', { status: 404 });
	}

	// Fetch state data for the representative's state
	const state = await getStateByCode(env.DB, representative.state_code);
	const stateRepresentatives = await getRepresentativesByState(env.DB, representative.state_code);
	const voterData = await getVoterDataByState(env.DB, representative.state_code);
	const demographics = await getVoterDemographicsByState(env.DB, representative.state_code);

	// Try to get votes if voting_records table still references old politician_id
	// For now, we'll show the profile without votes until we migrate the data
	const votes: any[] = []; // TODO: Migrate voting records to use representative_id

	return new Response(renderRepresentativeProfile(representative, votes, state ? {
		state,
		representatives: stateRepresentatives,
		voterData,
		demographics
	} : null), {
		headers: { "content-type": "text/html" },
	});
}

async function handleApiRequest(request: Request, env: Env, path: string): Promise<Response> {
	// State-specific data endpoint
	if (path.startsWith('/api/state/')) {
		const stateCode = path.split('/')[3]?.toUpperCase();
		if (!stateCode || stateCode.length !== 2) {
			return new Response('Invalid state code', { status: 400 });
		}

		const state = await getStateByCode(env.DB, stateCode);
		if (!state) {
			return new Response('State not found', { status: 404 });
		}

		const representatives = await getRepresentativesByState(env.DB, stateCode);
		const voterData = await getVoterDataByState(env.DB, stateCode);
		const demographics = await getVoterDemographicsByState(env.DB, stateCode);

		return Response.json({
			state,
			representatives,
			voterData,
			demographics
		});
	}

	// Representative endpoint
	if (path.startsWith('/api/representative/')) {
		const id = parseInt(path.split('/')[3]);
		if (!isNaN(id)) {
			const representative = await getRepresentative(env.DB, id);
			if (!representative) {
				return new Response('Not found', { status: 404 });
			}
			return Response.json({ representative });
		}
	}

	// Search endpoints
	if (path.startsWith('/api/search/')) {
		const searchType = path.split('/')[3];
		const url = new URL(request.url);
		const query = url.searchParams.get('q') || '';

		if (!query.trim()) {
			return Response.json({ results: [] });
		}

		if (searchType === 'senators') {
			const senators = await getAllSenators(env.DB);
			const results = senators.filter(senator =>
				senator.name.toLowerCase().includes(query.toLowerCase()) ||
				senator.state_code.toLowerCase().includes(query.toLowerCase())
			).slice(0, 5);

			return Response.json({ results });
		} else if (searchType === 'house') {
			const houseMembers = await getAllHouseMembers(env.DB);
			const results = houseMembers.filter(member =>
				member.name.toLowerCase().includes(query.toLowerCase()) ||
				member.state_code.toLowerCase().includes(query.toLowerCase())
			).slice(0, 5);

			return Response.json({ results });
		} else if (searchType === 'representatives') {
			const representatives = await getAllRepresentatives(env.DB);
			const results = representatives.filter(rep =>
				rep.name.toLowerCase().includes(query.toLowerCase()) ||
				rep.state_code.toLowerCase().includes(query.toLowerCase())
			).slice(0, 5);

			return Response.json({ results });
		}
	}

	return new Response('Not found', { status: 404 });
}

// Admin authentication
const ADMIN_PASSWORD = 'Anarchy420';

function checkAdminAuth(request: Request): boolean {
	const cookie = request.headers.get('Cookie');
	return cookie?.includes('admin_auth=true') || false;
}

function setAdminAuth(response: Response): void {
	response.headers.set('Set-Cookie', 'admin_auth=true; Path=/; HttpOnly; SameSite=Strict; Max-Age=86400');
}

function clearAdminAuth(response: Response): void {
	response.headers.set('Set-Cookie', 'admin_auth=false; Path=/; HttpOnly; SameSite=Strict; Max-Age=0');
}

async function handleAdminLogin(request: Request, env: Env): Promise<Response> {
	if (request.method === 'POST') {
		const body = await request.json() as { password?: string };
		if (body.password === ADMIN_PASSWORD) {
			const response = new Response(JSON.stringify({ success: true }), {
				headers: { 'Content-Type': 'application/json' }
			});
			setAdminAuth(response);
			return response;
		}
		return new Response(JSON.stringify({ success: false }), {
			status: 401,
			headers: { 'Content-Type': 'application/json' }
		});
	}
	return new Response(renderAdminLogin(), {
		headers: { 'Content-Type': 'text/html' }
	});
}

async function handleAdminLogout(request: Request, env: Env): Promise<Response> {
	const response = new Response(JSON.stringify({ success: true }), {
		headers: { 'Content-Type': 'application/json' }
	});
	clearAdminAuth(response);
	return response;
}

async function handleAdminDashboard(request: Request, env: Env): Promise<Response> {
	if (!checkAdminAuth(request)) {
		return Response.redirect(new URL('/admin/login', request.url).toString(), 302);
		}
		
	const states = await getAllStates(env.DB);
	const representatives = await getAllRepresentatives(env.DB);
	const voterData = await Promise.all(
		states.map(s => getVoterDataByState(env.DB, s.code))
	).then(results => results.filter(r => r !== null));
	const issues = await getAllIssues(env.DB);

	return new Response(renderAdminDashboard({
		states,
		representatives,
		voterData,
		issues
	}), {
		headers: { 'Content-Type': 'text/html' }
	});
}

async function handleAdminApi(request: Request, env: Env, path: string): Promise<Response> {
	if (!checkAdminAuth(request)) {
		return new Response('Unauthorized', { status: 401 });
		}
		
	// Representative CRUD
	if (path === '/api/admin/representative' && request.method === 'POST') {
		const body = await request.json() as any;
		
		// Handle district number - find or note that district needs to be created
		if (body.district_number && body.chamber === 'house') {
			// Try to find existing district
			const district = await env.DB
				.prepare('SELECT id FROM districts WHERE state_code = ? AND district_number = ?')
				.bind(body.state_code, parseInt(body.district_number))
				.first<{ id: number }>();
			
			if (district) {
				body.district_id = district.id;
			}
			// If district doesn't exist, district_id will remain null
			// Districts can be managed separately if needed
		}
		
		// Remove district_number from body as it's not a direct field
		delete body.district_number;
		
		const id = await createRepresentative(env.DB, body);
		return Response.json({ success: true, id });
	}

	if (path.startsWith('/api/admin/representative/') && request.method === 'PUT') {
		const id = parseInt(path.split('/')[4]);
		if (isNaN(id)) {
			return new Response('Invalid ID', { status: 400 });
		}
		const body = await request.json() as any;
				
		// Handle district number - find or note that district needs to be created
		if (body.district_number && body.chamber === 'house') {
			// Try to find existing district
			const district = await env.DB
				.prepare('SELECT id FROM districts WHERE state_code = ? AND district_number = ?')
				.bind(body.state_code, parseInt(body.district_number))
				.first<{ id: number }>();
			
			if (district) {
				body.district_id = district.id;
			}
		}
		
		// Remove district_number from body as it's not a direct field
		delete body.district_number;
		
		await updateRepresentative(env.DB, id, body);
		return Response.json({ success: true });
	}

	if (path.startsWith('/api/admin/representative/') && request.method === 'DELETE') {
		const id = parseInt(path.split('/')[4]);
		if (isNaN(id)) {
			return new Response('Invalid ID', { status: 400 });
		}
		await deleteRepresentative(env.DB, id);
		return Response.json({ success: true });
	}

	// Voter data
	if (path === '/api/admin/voter-data' && request.method === 'POST') {
		const body = await request.json() as any;
		const id = await upsertVoterData(env.DB, body);
		return Response.json({ success: true, id });
	}

	// Electoral data
	if (path === '/api/admin/electoral' && request.method === 'POST') {
		const body = await request.json() as any;
		await updateStateElectoralData(
			env.DB,
			body.state_code,
			body.electoral_winner || null,
			body.electoral_year || null,
			body.electoral_margin || null,
			body.electoral_votes || null
		);
		return Response.json({ success: true });
	}

	// Populate 2024 electoral data
	if (path === '/api/admin/populate-electoral-2024' && request.method === 'POST') {
		console.log('Populate electoral data endpoint called');

		// Official 2024 Electoral Vote Results
		const electoralData: Record<string, { total: number; harris: number; trump: number; margin?: number }> = {
			'AL': { total: 9, harris: 0, trump: 9, margin: 25.5 },
			'AK': { total: 3, harris: 0, trump: 3, margin: 19.4 },
			'AZ': { total: 11, harris: 0, trump: 11, margin: 5.2 },
			'AR': { total: 6, harris: 0, trump: 6, margin: 27.6 },
			'CA': { total: 54, harris: 54, trump: 0, margin: 16.8 },
			'CO': { total: 10, harris: 10, trump: 0, margin: 14.0 },
			'CT': { total: 7, harris: 7, trump: 0, margin: 21.2 },
			'DE': { total: 3, harris: 3, trump: 0, margin: 19.0 },
			'DC': { total: 3, harris: 3, trump: 0, margin: 86.8 },
			'FL': { total: 30, harris: 0, trump: 30, margin: 3.1 },
			'GA': { total: 16, harris: 0, trump: 16, margin: 5.2 },
			'HI': { total: 4, harris: 4, trump: 0, margin: 29.5 },
			'ID': { total: 4, harris: 0, trump: 4, margin: 31.8 },
			'IL': { total: 19, harris: 19, trump: 0, margin: 17.6 },
			'IN': { total: 11, harris: 0, trump: 11, margin: 21.1 },
			'IA': { total: 6, harris: 0, trump: 6, margin: 14.1 },
			'KS': { total: 6, harris: 0, trump: 6, margin: 18.2 },
			'KY': { total: 8, harris: 0, trump: 8, margin: 26.0 },
			'LA': { total: 8, harris: 0, trump: 8, margin: 19.6 },
			'ME': { total: 4, harris: 3, trump: 1, margin: 9.1 },
			'MD': { total: 10, harris: 10, trump: 0, margin: 33.2 },
			'MA': { total: 11, harris: 11, trump: 0, margin: 33.5 },
			'MI': { total: 15, harris: 0, trump: 15, margin: 2.9 },
			'MN': { total: 10, harris: 10, trump: 0, margin: 7.2 },
			'MS': { total: 6, harris: 0, trump: 6, margin: 17.8 },
			'MO': { total: 10, harris: 0, trump: 10, margin: 15.4 },
			'MT': { total: 4, harris: 0, trump: 4, margin: 16.4 },
			'NE': { total: 5, harris: 1, trump: 4, margin: 15.2 },
			'NV': { total: 6, harris: 0, trump: 6, margin: 2.4 },
			'NH': { total: 4, harris: 4, trump: 0, margin: 8.8 },
			'NJ': { total: 14, harris: 14, trump: 0, margin: 15.9 },
			'NM': { total: 5, harris: 5, trump: 0, margin: 10.8 },
			'NY': { total: 28, harris: 28, trump: 0, margin: 21.4 },
			'NC': { total: 16, harris: 0, trump: 16, margin: 3.3 },
			'ND': { total: 3, harris: 0, trump: 3, margin: 33.4 },
			'OH': { total: 17, harris: 0, trump: 17, margin: 8.0 },
			'OK': { total: 7, harris: 0, trump: 7, margin: 32.3 },
			'OR': { total: 8, harris: 8, trump: 0, margin: 16.1 },
			'PA': { total: 19, harris: 0, trump: 19, margin: 0.3 },
			'RI': { total: 4, harris: 4, trump: 0, margin: 19.8 },
			'SC': { total: 9, harris: 0, trump: 9, margin: 14.0 },
			'SD': { total: 3, harris: 0, trump: 3, margin: 21.9 },
			'TN': { total: 11, harris: 0, trump: 11, margin: 23.9 },
			'TX': { total: 40, harris: 0, trump: 40, margin: 11.0 },
			'UT': { total: 6, harris: 0, trump: 6, margin: 20.6 },
			'VT': { total: 3, harris: 3, trump: 0, margin: 25.2 },
			'VA': { total: 13, harris: 13, trump: 0, margin: 10.2 },
			'WA': { total: 12, harris: 12, trump: 0, margin: 18.2 },
			'WV': { total: 4, harris: 0, trump: 4, margin: 26.8 },
			'WI': { total: 10, harris: 0, trump: 10, margin: 0.9 },
			'WY': { total: 3, harris: 0, trump: 3, margin: 43.4 }
		};

		let updated = 0;
		let errors = 0;

		for (const [stateCode, data] of Object.entries(electoralData)) {
			try {
				const winner = data.harris > data.trump ? 'Democrat' : data.trump > data.harris ? 'Republican' : 'Split';
				await updateStateElectoralData(
					env.DB,
					stateCode,
					winner,
					2024,
					data.margin || null,
					data.total
				);
				updated++;
			} catch (error) {
				console.error(`Error updating ${stateCode}:`, error);
				errors++;
			}
		}

		console.log(`Populate complete: ${updated} updated, ${errors} errors`);

		return Response.json({
			success: true,
			message: `Updated electoral data for ${updated} states (${errors} errors)`,
			electoralBreakdown: {
				republicanStates: Object.values(electoralData).filter(d => d.trump > d.harris).length,
				democratStates: Object.values(electoralData).filter(d => d.harris > d.trump).length,
				splitStates: Object.values(electoralData).filter(d => d.harris === d.trump).length,
				totalElectoralVotes: Object.values(electoralData).reduce((sum, d) => sum + d.total, 0)
			},
			updated,
			errors
		});
	}

	// Import voter data from Excel (2024 election data)
	if (path === '/api/admin/import-voter-data' && request.method === 'POST') {
		const body = await request.json() as any;
		if (!body.data || !Array.isArray(body.data)) {
			return Response.json({ success: false, error: 'Invalid data format. Expected array of voter data records.' });
		}

		let imported = 0;
		let skipped = 0;

		for (const record of body.data) {
			try {
				// Map Excel data to our database format
				// Expected Excel format: state_code, state_name, total_registered_voters, voting_age_population, voter_turnout_percentage, etc.
				const voterData = {
					state_code: record.state_code || record.State || record.state,
					total_registered_voters: record.total_registered_voters || record.registered_voters || record.Registered || null,
					voting_age_population: record.voting_age_population || record.voting_age || record.Voting_Age || null,
					total_population: record.total_population || record.total_pop || record.Population || null,
					voter_turnout_percentage: record.voter_turnout_percentage || record.turnout_percentage || record.Turnout || record['Turnout (%)'] || null,
					last_election_date: record.last_election_date || '2024-11-05',
					data_source: record.data_source || '2024 Election Data (vote04a_2024.xlsx)',
					data_year: record.data_year || 2024,
					notes: record.notes || 'Imported from vote04a_2024.xlsx'
				};

				// Validate required fields
				if (!voterData.state_code) {
					skipped++;
					continue;
				}

				// Convert state names to codes if needed
				if (voterData.state_code.length > 2) {
					// If it's a state name, try to convert to code
					const stateCode = getStateCodeFromName(voterData.state_code);
					if (stateCode) {
						voterData.state_code = stateCode;
					} else {
						skipped++;
						continue;
					}
				}

				// Ensure state code is uppercase
				voterData.state_code = voterData.state_code.toUpperCase();

				await upsertVoterData(env.DB, voterData);
				imported++;
			} catch (error) {
				console.error('Error importing voter data record:', error, record);
				skipped++;
			}
		}

		return Response.json({
			success: true,
			message: `Imported ${imported} voter data records, skipped ${skipped} records.`,
			imported,
			skipped
		});
	}

	// Legacy vote endpoint
	if (path === '/api/admin/vote' && request.method === 'POST') {
		const body = await request.json() as any;
		const id = await createVote(env.DB, body);
		return Response.json({ success: true, id });
	}

	// Populate electoral data from hardcoded 2024 results
	if (path === '/api/admin/populate-electoral' && request.method === 'POST') {
		// 2024 Electoral College results
		const electoralData: Record<string, { total: number; harris: number; trump: number; margin?: number }> = {
			'AL': { total: 9, harris: 0, trump: 9, margin: 25.5 },
			'AK': { total: 3, harris: 0, trump: 3, margin: 19.4 },
			'AZ': { total: 11, harris: 0, trump: 11, margin: 5.2 },
			'AR': { total: 6, harris: 0, trump: 6, margin: 27.6 },
			'CA': { total: 54, harris: 54, trump: 0, margin: 16.8 },
			'CO': { total: 10, harris: 10, trump: 0, margin: 14.0 },
			'CT': { total: 7, harris: 7, trump: 0, margin: 21.2 },
			'DE': { total: 3, harris: 3, trump: 0, margin: 19.0 },
			'DC': { total: 3, harris: 3, trump: 0, margin: 86.8 },
			'FL': { total: 30, harris: 0, trump: 30, margin: 3.1 },
			'GA': { total: 16, harris: 0, trump: 16, margin: 5.2 },
			'HI': { total: 4, harris: 4, trump: 0, margin: 29.5 },
			'ID': { total: 4, harris: 0, trump: 4, margin: 31.8 },
			'IL': { total: 19, harris: 19, trump: 0, margin: 17.6 },
			'IN': { total: 11, harris: 0, trump: 11, margin: 21.1 },
			'IA': { total: 6, harris: 0, trump: 6, margin: 14.1 },
			'KS': { total: 6, harris: 0, trump: 6, margin: 18.2 },
			'KY': { total: 8, harris: 0, trump: 8, margin: 26.0 },
			'LA': { total: 8, harris: 0, trump: 8, margin: 19.6 },
			'ME': { total: 4, harris: 3, trump: 1, margin: 9.1 }, // Split votes
			'MD': { total: 10, harris: 10, trump: 0, margin: 33.2 },
			'MA': { total: 11, harris: 11, trump: 0, margin: 33.5 },
			'MI': { total: 15, harris: 0, trump: 15, margin: 2.9 },
			'MN': { total: 10, harris: 10, trump: 0, margin: 7.2 },
			'MS': { total: 6, harris: 0, trump: 6, margin: 17.8 },
			'MO': { total: 10, harris: 0, trump: 10, margin: 15.4 },
			'MT': { total: 4, harris: 0, trump: 4, margin: 16.4 },
			'NE': { total: 5, harris: 1, trump: 4, margin: 15.2 }, // Split votes
			'NV': { total: 6, harris: 0, trump: 6, margin: 2.4 },
			'NH': { total: 4, harris: 4, trump: 0, margin: 8.8 },
			'NJ': { total: 14, harris: 14, trump: 0, margin: 15.9 },
			'NM': { total: 5, harris: 5, trump: 0, margin: 10.8 },
			'NY': { total: 28, harris: 28, trump: 0, margin: 21.4 },
			'NC': { total: 16, harris: 0, trump: 16, margin: 3.3 },
			'ND': { total: 3, harris: 0, trump: 3, margin: 33.4 },
			'OH': { total: 17, harris: 0, trump: 17, margin: 8.0 },
			'OK': { total: 7, harris: 0, trump: 7, margin: 32.3 },
			'OR': { total: 8, harris: 8, trump: 0, margin: 16.1 },
			'PA': { total: 19, harris: 0, trump: 19, margin: 0.3 },
			'RI': { total: 4, harris: 4, trump: 0, margin: 19.8 },
			'SC': { total: 9, harris: 0, trump: 9, margin: 14.0 },
			'SD': { total: 3, harris: 0, trump: 3, margin: 21.9 },
			'TN': { total: 11, harris: 0, trump: 11, margin: 23.9 },
			'TX': { total: 40, harris: 0, trump: 40, margin: 11.0 },
			'UT': { total: 6, harris: 0, trump: 6, margin: 20.6 },
			'VT': { total: 3, harris: 3, trump: 0, margin: 25.2 },
			'VA': { total: 13, harris: 13, trump: 0, margin: 10.2 },
			'WA': { total: 12, harris: 12, trump: 0, margin: 18.2 },
			'WV': { total: 4, harris: 0, trump: 4, margin: 26.8 },
			'WI': { total: 10, harris: 0, trump: 10, margin: 0.9 },
			'WY': { total: 3, harris: 0, trump: 3, margin: 43.4 }
		};

		let updated = 0;
		let errors = 0;

		for (const [stateCode, data] of Object.entries(electoralData)) {
			try {
				const winner = data.harris > data.trump ? 'Democrat' : data.trump > data.harris ? 'Republican' : 'Split';
				await updateStateElectoralData(
					env.DB,
					stateCode,
					winner,
					2024,
					data.margin || null,
					data.total
				);
				updated++;
			} catch (error) {
				console.error(`Error updating electoral data for ${stateCode}:`, error);
				errors++;
			}
		}

		return Response.json({
			success: true,
			message: `Updated electoral data for ${updated} states, ${errors} errors.`,
			updated,
			errors
		});
	}

	// Debug endpoint to check electoral data
	if (path === '/debug/electoral' && request.method === 'GET') {
		const states = await getAllStates(env.DB);
		const electoralSummary = states.map(s => ({
			code: s.code,
			name: s.name,
			electoral_winner: s.electoral_winner,
			electoral_year: s.electoral_year,
			electoral_votes: s.electoral_votes
		}));

		// Test the color logic
		const colorTest = electoralSummary.map(s => ({
			code: s.code,
			winner: s.electoral_winner,
			cssClass: s.electoral_winner === 'Republican' ? 'republican' :
					  s.electoral_winner === 'Democrat' ? 'democrat' : 'none'
		})).filter(s => s.cssClass !== 'none');

		return Response.json({
			totalStates: states.length,
			statesWithElectoralData: electoralSummary.filter(s => s.electoral_winner).length,
			electoralData: electoralSummary.slice(0, 10), // First 10 states only
			colorTest,
			testStates: ['CA', 'TX', 'FL', 'NY'].map(code => {
				const state = electoralSummary.find(s => s.code === code);
				return {
					code,
					winner: state?.electoral_winner,
					cssClass: state?.electoral_winner === 'Republican' ? 'republican' :
							 state?.electoral_winner === 'Democrat' ? 'democrat' : 'none'
				};
			})
		});
	}

	// Test endpoint to manually set electoral data for a few states
	if (path === '/api/admin/test-electoral' && request.method === 'POST') {
		console.log('Test electoral endpoint called');

		// Manually set test data
		await updateStateElectoralData(env.DB, 'CA', 'Democrat', 2024, 16.8, 54);
		await updateStateElectoralData(env.DB, 'TX', 'Republican', 2024, 11.0, 40);
		await updateStateElectoralData(env.DB, 'FL', 'Republican', 2024, 3.1, 30);
		await updateStateElectoralData(env.DB, 'NY', 'Democrat', 2024, 21.4, 28);

		return Response.json({
			success: true,
			message: 'Test electoral data set for CA, TX, FL, NY'
		});
	}

	// Issues management
	if (path === '/api/admin/issues' && request.method === 'GET') {
		const issues = await getAllIssues(env.DB);
		return Response.json({ issues });
	}

	if (path === '/api/admin/issue' && request.method === 'POST') {
		const body = await request.json() as any;
		const id = await createIssue(env.DB, body);
		return Response.json({ success: true, id });
	}

	if (path.startsWith('/api/admin/issue/') && request.method === 'PUT') {
		const id = parseInt(path.split('/')[4]);
		if (isNaN(id)) {
			return new Response('Invalid ID', { status: 400 });
		}
		const body = await request.json() as any;
		await updateIssue(env.DB, id, body);
		return Response.json({ success: true });
	}

	if (path.startsWith('/api/admin/issue/') && request.method === 'DELETE') {
		const id = parseInt(path.split('/')[4]);
		if (isNaN(id)) {
			return new Response('Invalid ID', { status: 400 });
		}
		await deleteIssue(env.DB, id);
		return Response.json({ success: true });
	}

	return new Response('Not found', { status: 404 });
}

function renderRepresentativeProfile(representative: any, votes: any[], stateData?: {
	state: any,
	representatives: any[],
	voterData: any,
	demographics: any
} | null): string {
	const partyClass = representative.party?.toLowerCase() || 'independent';
	
function renderStateSection(stateData: {
	state: any,
	representatives: any[],
	voterData: any,
	demographics: any
}): string {
	const { state, representatives, voterData } = stateData;

	let html = `
		<div class="state-section">
			<h2>About ${escapeHtml(state.name)}</h2>
	`;

	// Voter data section
	if (voterData) {
		html += `
			<div class="state-data-grid">
				${voterData.total_registered_voters ? `
					<div class="state-data-card">
						<div class="state-data-label">Registered Voters</div>
						<div class="state-data-value">${formatNumber(voterData.total_registered_voters)}</div>
					</div>
				` : ''}
				${voterData.voting_age_population ? `
					<div class="state-data-card">
						<div class="state-data-label">Voting Age Population</div>
						<div class="state-data-value">${formatNumber(voterData.voting_age_population)}</div>
					</div>
				` : ''}
				${voterData.total_voted && voterData.total_registered_voters ? `
					<div class="state-data-card">
						<div class="state-data-label">Registered Voter Turnout</div>
						<div class="state-data-value">${(((voterData.total_voted / voterData.total_registered_voters) * 100).toFixed(1))}%</div>
					</div>
				` : ''}
				${voterData.total_voted && voterData.voting_age_population ? `
					<div class="state-data-card">
						<div class="state-data-label">Citizen Turnout (18+)</div>
						<div class="state-data-value">${(((voterData.total_voted / voterData.voting_age_population) * 100).toFixed(1))}%</div>
					</div>
				` : ''}
			</div>
		`;
	} else {
		html += `
			<div class="state-empty-state">
				<p>Voter data not yet available for this state. Starting with Georgia!</p>
			</div>
		`;
	}

	// Representatives section
	if (representatives && representatives.length > 0) {
		html += `
			<div class="state-representatives-section">
				<h3>All Representatives from ${escapeHtml(state.name)}</h3>
				<div class="chamber-tabs">
					<button class="tab active" onclick="showChamber('all')">All (${representatives.length})</button>
					<button class="tab" onclick="showChamber('house')">House (${representatives.filter(r => r.chamber === 'house').length})</button>
					<button class="tab" onclick="showChamber('senate')">Senate (${representatives.filter(r => r.chamber === 'senate').length})</button>
				</div>
				<div id="state-representatives-grid" class="state-representatives-grid">
					${renderStateRepresentatives(representatives, 'all', representative.id)}
				</div>
			</div>
		`;
	} else {
		html += `
			<div class="state-representatives-section">
				<h3>Representatives from ${escapeHtml(state.name)}</h3>
				<div class="state-empty-state">
					<p>No representatives found for this state.</p>
				</div>
			</div>
		`;
	}

	html += `
		</div>
	`;

	return html;
}

function renderStateRepresentatives(reps: any[], chamber: string, currentRepId: number): string {
	const filtered = chamber === 'all' ? reps : reps.filter(r => r.chamber === chamber);

	if (filtered.length === 0) {
		return '<div class="state-empty-state"><p>No representatives found.</p></div>';
	}

	return filtered.map(rep => {
		const partyClass = rep.party?.toLowerCase() || 'independent';
		const isCurrent = rep.id === currentRepId;

		return `
			<a href="/representative/${rep.id}" class="state-representative-card ${isCurrent ? 'current' : ''}">
				<div class="state-representative-name">${escapeHtml(rep.name)}${isCurrent ? ' (You)' : ''}</div>
				<div class="state-representative-info">
					<div class="state-info-item">
						<strong>Chamber:</strong> ${rep.chamber === 'house' ? 'House of Representatives' : 'Senate'}
					</div>
					${rep.party ? `
						<span class="state-badge state-badge-${partyClass}">${escapeHtml(rep.party)}</span>
					` : ''}
				</div>
			</a>
		`;
	}).join('');
}

	return `
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<title>${escapeHtml(representative.name)} - Profile</title>
	<style>

		* {
			margin: 0;
			padding: 0;
			box-sizing: border-box;
		}
		
		body {
			font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
			background:
				radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
				radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
				radial-gradient(circle at 40% 80%, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
				linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #475569 75%, #64748b 100%);
			min-height: 100vh;
			padding: 2rem;
			color: #f1f5f9;
			position: relative;
		}

		body::before {
			content: '';
			position: fixed;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			background:
				radial-gradient(circle at 30% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 40%),
				radial-gradient(circle at 70% 80%, rgba(239, 68, 68, 0.08) 0%, transparent 40%),
				radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.05) 0%, transparent 50%);
			pointer-events: none;
			z-index: -1;
		}

		.container {
			max-width: 1000px;
			margin: 0 auto;
		}
		
		.back-link {
			display: inline-block;
			margin-bottom: 1rem;
			color: #93c5fd;
			text-decoration: none;
			font-weight: 600;
			opacity: 0.9;
			transition: all 0.3s ease;
		}

		.back-link:hover {
			opacity: 1;
			color: #dbeafe;
			transform: translateX(-2px);
		}
		
		.back-link:hover {
			opacity: 1;
		}
		
		.profile-header {
			background: linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(51, 65, 85, 0.95) 100%);
			backdrop-filter: blur(20px);
			border: 1px solid rgba(148, 163, 184, 0.2);
			border-radius: 16px;
			padding: 2rem;
			margin-bottom: 2rem;
			box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(148, 163, 184, 0.1);
			position: relative;
		}

		.profile-header::before {
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(239, 68, 68, 0.1) 100%);
			border-radius: 16px;
			pointer-events: none;
		}

		.profile-name {
			font-size: 2.5rem;
			margin-bottom: 1rem;
			color: #ffffff;
			font-weight: 800;
			letter-spacing: -0.025em;
			position: relative;
			z-index: 1;
			text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
		}
		
		.profile-details {
			display: grid;
			grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
			gap: 1.5rem;
			margin-top: 1.5rem;
			position: relative;
			z-index: 1;
		}

		.detail-item {
			background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
			backdrop-filter: blur(10px);
			border: 1px solid rgba(148, 163, 184, 0.2);
			border-radius: 12px;
			padding: 1rem;
			text-align: center;
			transition: all 0.3s ease;
		}

		.detail-item:hover {
			transform: translateY(-2px);
			box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
			border-color: rgba(148, 163, 184, 0.4);
		}

		.detail-label {
			font-size: 0.85rem;
			color: #94a3b8;
			text-transform: uppercase;
			letter-spacing: 1px;
			margin-bottom: 0.5rem;
			opacity: 0.9;
		}

		.detail-value {
			font-size: 1.2rem;
			font-weight: 700;
			color: #f1f5f9;
		}
		
		.badge {
			display: inline-block;
			padding: 0.75rem 1.5rem;
			border-radius: 25px;
			font-size: 1rem;
			font-weight: 700;
			margin-top: 1rem;
			position: relative;
			z-index: 1;
			text-transform: uppercase;
			letter-spacing: 0.5px;
		}

		.badge-democrat {
			background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
			color: white;
			box-shadow: 0 0 15px rgba(59, 130, 246, 0.4);
		}

		.badge-republican {
			background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
			color: white;
			box-shadow: 0 0 15px rgba(239, 68, 68, 0.4);
		}

		.badge-independent {
			background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
			color: white;
			box-shadow: 0 0 15px rgba(107, 114, 128, 0.4);
		}
		
		.social-links {
			display: flex;
			gap: 1rem;
			margin-top: 1rem;
			flex-wrap: wrap;
		}
		
		.social-link {
			padding: 0.5rem 1rem;
			background: #f3f4f6;
			border-radius: 8px;
			text-decoration: none;
			color: #333;
			font-weight: 600;
			transition: background 0.2s;
	}
		
		.social-link:hover {
			background: #e5e7eb;
		}

		/* State section styles */
		.state-section {
			background: linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(51, 65, 85, 0.9) 100%);
			backdrop-filter: blur(20px);
			border: 1px solid rgba(148, 163, 184, 0.2);
			border-radius: 16px;
			padding: 2rem;
			margin-bottom: 2rem;
			box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(148, 163, 184, 0.1);
			position: relative;
		}

		.state-section::before {
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			background: linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(239, 68, 68, 0.05) 100%);
			border-radius: 16px;
			pointer-events: none;
		}

		.state-section h2 {
			font-size: 1.8rem;
			margin-bottom: 1.5rem;
			color: #f1f5f9;
			font-weight: 700;
			border-bottom: 2px solid rgba(148, 163, 184, 0.3);
			padding-bottom: 0.5rem;
			position: relative;
			z-index: 1;
			text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
		}

		.state-data-grid {
			display: grid;
			grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
			gap: 1.5rem;
			margin-bottom: 2rem;
			position: relative;
			z-index: 1;
		}

		.state-data-card {
			background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
			backdrop-filter: blur(10px);
			padding: 1.5rem;
			border-radius: 12px;
			border-left: 4px solid #60a5fa;
			border: 1px solid rgba(148, 163, 184, 0.2);
			box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
			transition: all 0.3s ease;
			position: relative;
			z-index: 1;
			text-align: center;
		}

		.state-data-card:hover {
			transform: translateY(-2px);
			box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
			border-color: rgba(148, 163, 184, 0.4);
		}

		.state-data-label {
			font-size: 0.9rem;
			color: #94a3b8;
			text-transform: uppercase;
			letter-spacing: 1px;
			margin-bottom: 0.5rem;
			opacity: 0.9;
		}

		.state-data-value {
			font-size: 1.8rem;
			font-weight: 700;
			color: #60a5fa;
		}

		.state-representatives-section {
			background: linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(51, 65, 85, 0.9) 100%);
			backdrop-filter: blur(20px);
			border: 1px solid rgba(148, 163, 184, 0.2);
			border-radius: 16px;
			padding: 2rem;
			margin-top: 2rem;
			box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(148, 163, 184, 0.1);
			position: relative;
		}

		.state-representatives-section::before {
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			background: linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(239, 68, 68, 0.05) 100%);
			border-radius: 16px;
			pointer-events: none;
		}

		.state-representatives-section h3 {
			font-size: 1.8rem;
			margin-bottom: 1.5rem;
			color: #f1f5f9;
			font-weight: 700;
			padding-bottom: 0.5rem;
			border-bottom: 2px solid rgba(148, 163, 184, 0.3);
			position: relative;
			z-index: 1;
			text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
		}

		.chamber-tabs {
			display: flex;
			gap: 1rem;
			margin-bottom: 1.5rem;
			position: relative;
			z-index: 1;
		}

		.tab {
			padding: 0.75rem 1.5rem;
			background: rgba(148, 163, 184, 0.2);
			backdrop-filter: blur(10px);
			border: 1px solid rgba(148, 163, 184, 0.3);
			border-radius: 8px;
			cursor: pointer;
			font-weight: 600;
			transition: all 0.3s ease;
			color: #cbd5e1;
		}

		.tab.active {
			background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
			color: white;
			border-color: rgba(59, 130, 246, 0.5);
			box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
		}

		.tab:hover:not(.active) {
			background: rgba(148, 163, 184, 0.3);
			border-color: rgba(148, 163, 184, 0.5);
			color: #f1f5f9;
			transform: translateY(-1px);
		}

		.state-representatives-grid {
			display: grid;
			grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
			gap: 1.5rem;
			position: relative;
			z-index: 1;
		}

		.state-representative-card {
			background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
			backdrop-filter: blur(10px);
			border: 1px solid rgba(148, 163, 184, 0.2);
			border-radius: 12px;
			padding: 1.5rem;
			border-left: 4px solid #60a5fa;
			transition: all 0.3s ease;
			cursor: pointer;
			text-decoration: none;
			color: inherit;
			display: block;
			box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
			position: relative;
			z-index: 1;
		}

		.state-representative-card:hover {
			transform: translateY(-4px);
			box-shadow: 0 12px 30px rgba(0, 0, 0, 0.25);
			border-color: rgba(148, 163, 184, 0.4);
		}

		.state-representative-card.current {
			border-left-color: #10b981;
			background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.05) 100%);
		}

		.state-representative-name {
			font-size: 1.25rem;
			font-weight: 700;
			margin-bottom: 0.5rem;
			color: #f1f5f9;
		}

		.state-representative-info {
			display: flex;
			flex-direction: column;
			gap: 0.5rem;
			margin-top: 0.5rem;
			color: #cbd5e1;
			font-size: 0.9rem;
		}

		.state-info-item {
			font-size: 0.9rem;
			color: #666;
		}

		.state-badge {
			display: inline-block;
			padding: 0.25rem 0.75rem;
			border-radius: 20px;
			font-size: 0.85rem;
			font-weight: 600;
			margin-top: 0.5rem;
		}

		.state-badge-democrat {
			background: #3b82f6;
			color: white;
		}

		.state-badge-republican {
			background: #ef4444;
			color: white;
		}

		.state-badge-independent {
			background: #6b7280;
			color: white;
		}

		.state-empty-state {
			text-align: center;
			padding: 3rem;
			color: #666;
		}
	</style>
</head>
<body>
	<div class="container">
		<div style="text-align: center; margin-bottom: 1rem;">
			<a href="/" class="back-link">← Back to Map</a>
			<nav style="display: inline-block; margin-left: 2rem;">
				<a href="/issues" style="color: #667eea; text-decoration: none; margin: 0 0.5rem; font-weight: 500;">Issues Hub</a>
				<a href="/senators" style="color: #667eea; text-decoration: none; margin: 0 0.5rem; font-weight: 500;">Senate Hub</a>
				<a href="/house" style="color: #667eea; text-decoration: none; margin: 0 0.5rem; font-weight: 500;">House Hub</a>
				<a href="/election" style="color: #667eea; text-decoration: none; margin: 0 0.5rem; font-weight: 500;">Election Hub</a>
			</nav>
		</div>
		
		<div class="profile-header">
			<h1 class="profile-name">${escapeHtml(representative.name)}</h1>
			${representative.party ? `<span class="badge badge-${partyClass}">${escapeHtml(representative.party)}</span>` : ''}
			
			<div class="profile-details">
				<div class="detail-item">
					<div class="detail-label">State</div>
					<div class="detail-value">${escapeHtml(representative.state_code)}</div>
				</div>
				<div class="detail-item">
					<div class="detail-label">Chamber</div>
					<div class="detail-value">${representative.chamber === 'house' ? 'House of Representatives' : 'Senate'}</div>
				</div>
				${representative.district_number ? `
				<div class="detail-item">
					<div class="detail-label">District</div>
					<div class="detail-value">${representative.district_number}</div>
				</div>
				` : ''}
				${representative.term_start && representative.term_end ? `
				<div class="detail-item">
					<div class="detail-label">Term</div>
					<div class="detail-value">${formatFullDate(representative.term_start)} - ${formatFullDate(representative.term_end)}</div>
				</div>
				` : ''}
				${representative.office_phone ? `
				<div class="detail-item">
					<div class="detail-label">Office Phone</div>
					<div class="detail-value">${escapeHtml(representative.office_phone)}</div>
				</div>
				` : ''}
				${representative.email ? `
				<div class="detail-item">
					<div class="detail-label">Email</div>
					<div class="detail-value">${escapeHtml(representative.email)}</div>
				</div>
				` : ''}
			</div>
			
			${representative.bio ? `
				<div style="margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid #e5e7eb;">
					<h3 style="margin-bottom: 0.5rem; color: #333;">Biography</h3>
					<p style="color: #666; line-height: 1.6;">${escapeHtml(representative.bio)}</p>
				</div>
			` : ''}
			
			<div class="social-links">
				${representative.twitter_handle ? `
					<a href="https://twitter.com/${escapeHtml(representative.twitter_handle)}" target="_blank" class="social-link">
						🐦 Twitter: @${escapeHtml(representative.twitter_handle)}
					</a>
				` : ''}
				${representative.facebook_url ? `
					<a href="${escapeHtml(representative.facebook_url)}" target="_blank" class="social-link">
						📘 Facebook
					</a>
				` : ''}
				${representative.website ? `
					<a href="${escapeHtml(representative.website)}" target="_blank" class="social-link">
						🌐 Official Website
					</a>
				` : ''}
				${stateData?.state?.webpage && representative?.chamber ? (() => {
					const url = generateCongressGovUrl(stateData.state.webpage, representative.chamber);
					return url && url !== '#' ? `<a href="${url}" target="_blank" class="social-link">🏛️ Congress.gov</a>` : '';
				})() : ''}
			</div>
		</div>

		${stateData ? renderStateSection(stateData) : ''}
	</div>

	<script>
		let currentStateRepresentatives = ${stateData ? JSON.stringify(stateData.representatives) : '[]'};
		let currentRepresentativeId = ${representative.id};

		function showChamber(chamber) {
			document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
			event.target.classList.add('active');

			if (currentStateRepresentatives) {
				document.getElementById('state-representatives-grid').innerHTML = renderStateRepresentatives(currentStateRepresentatives, chamber, currentRepresentativeId);
			}
		}

		function renderStateRepresentatives(reps, chamber, currentRepId) {
			const filtered = chamber === 'all' ? reps : reps.filter(r => r.chamber === chamber);

			if (filtered.length === 0) {
				return '<div class="state-empty-state"><p>No representatives found.</p></div>';
			}

			return filtered.map(rep => {
				const partyClass = rep.party?.toLowerCase() || 'independent';
				const isCurrent = rep.id === currentRepId;
				const cardClass = 'state-representative-card' + (isCurrent ? ' current' : '');
				const displayName = escapeHtml(rep.name) + (isCurrent ? ' (You)' : '');
				const chamberName = rep.chamber === 'house' ? 'House of Representatives' : 'Senate';
				const partyBadge = rep.party ? '<span class="state-badge state-badge-' + partyClass + '">' + escapeHtml(rep.party) + '</span>' : '';

				return '<a href="/representative/' + rep.id + '" class="' + cardClass + '">' +
					'<div class="state-representative-name">' + displayName + '</div>' +
					'<div class="state-representative-info">' +
						'<div class="state-info-item">' +
							'<strong>Chamber:</strong> ' + chamberName +
						'</div>' +
						partyBadge +
					'</div>' +
				'</a>';
			}).join('');
		}

		function formatNumber(num) {
			return new Intl.NumberFormat('en-US').format(num);
		}

		function escapeHtml(text) {
			if (!text) return '';
			const map = {
				'&': '&amp;',
				'<': '&lt;',
				'>': '&gt;',
				'"': '&quot;',
				"'": '&#039;'
			};
			return text.replace(/[&<>"']/g, m => map[m]);
		}
	</script>
</body>
</html>
	`;
}

function escapeHtml(text: string | null | undefined): string {
	if (!text) return '';
	const map: Record<string, string> = {
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;',
		"'": '&#039;'
	};
	return text.replace(/[&<>"']/g, (m) => map[m]);
}

function formatFullDate(dateString: string | null | undefined): string {
	if (!dateString) return '';
	try {
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	} catch {
		return dateString;
	}
}

function formatNumber(num: number): string {
	return new Intl.NumberFormat('en-US').format(num);
}

function generateCongressGovUrl(stateName: string, chamber: string): string {
	const congress = '118';
	const chamberParam = chamber === 'house' ? 'House' : 'Senate';
	const stateParam = stateName.replace(/ /g, '+');

	if (chamber === 'senate') {
		return `https://www.congress.gov/search?q=%7B%22source%22%3A%22members%22%2C%22chamber%22%3A%22Senate%22%2C%22congress%22%3A%22${congress}%22%2C%22member-state%22%3A%22${stateParam}%22%7D`;
	} else {
		return `https://www.congress.gov/search?q=%7B%22source%22%3A%22members%22%2C%22congress%22%3A%22${congress}%22%2C%22member-state%22%3A%22${stateParam}%22%2C%22chamber%22%3A%22House%22%7D`;
	}
}

// Helper function to convert state names to state codes
function getStateCodeFromName(stateName: string): string | null {
	const stateMap: Record<string, string> = {
		'Alabama': 'AL',
		'Alaska': 'AK',
		'Arizona': 'AZ',
		'Arkansas': 'AR',
		'California': 'CA',
		'Colorado': 'CO',
		'Connecticut': 'CT',
		'Delaware': 'DE',
		'Florida': 'FL',
		'Georgia': 'GA',
		'Hawaii': 'HI',
		'Idaho': 'ID',
		'Illinois': 'IL',
		'Indiana': 'IN',
		'Iowa': 'IA',
		'Kansas': 'KS',
		'Kentucky': 'KY',
		'Louisiana': 'LA',
		'Maine': 'ME',
		'Maryland': 'MD',
		'Massachusetts': 'MA',
		'Michigan': 'MI',
		'Minnesota': 'MN',
		'Mississippi': 'MS',
		'Missouri': 'MO',
		'Montana': 'MT',
		'Nebraska': 'NE',
		'Nevada': 'NV',
		'New Hampshire': 'NH',
		'New Jersey': 'NJ',
		'New Mexico': 'NM',
		'New York': 'NY',
		'North Carolina': 'NC',
		'North Dakota': 'ND',
		'Ohio': 'OH',
		'Oklahoma': 'OK',
		'Oregon': 'OR',
		'Pennsylvania': 'PA',
		'Rhode Island': 'RI',
		'South Carolina': 'SC',
		'South Dakota': 'SD',
		'Tennessee': 'TN',
		'Texas': 'TX',
		'Utah': 'UT',
		'Vermont': 'VT',
		'Virginia': 'VA',
		'Washington': 'WA',
		'West Virginia': 'WV',
		'Wisconsin': 'WI',
		'Wyoming': 'WY',
		'District of Columbia': 'DC'
	};

	const normalizedName = stateName.trim();
	return stateMap[normalizedName] || null;
}
