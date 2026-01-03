/// <reference types="../worker-configuration.d.ts" />

import { renderHomePage } from "./renderMap";
import { renderPoliticianProfile } from "./renderHtml";
import { renderAdminLogin, renderAdminDashboard } from "./renderAdmin";
import { renderSenatorHub } from "./renderSenators";
import { renderHouseHub } from "./renderHouse";
import { renderElectionHub } from "./renderElection";
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
	getAllVotes,
	createVote,
	updateVote,
	getDistrictsByState,
	updateStateElectoralData
} from "./db";

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const url = new URL(request.url);
		const path = url.pathname;

		// API endpoints
		if (path.startsWith('/api/')) {
			return handleApiRequest(request, env, path);
		}

		// Admin API endpoints (before admin dashboard check)
		if (path.startsWith('/api/admin/')) {
			return handleAdminApi(request, env, path);
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

async function handleRepresentativePage(request: Request, env: Env, id: number): Promise<Response> {
	const representative = await getRepresentative(env.DB, id);
	
	if (!representative) {
		return new Response('Representative not found', { status: 404 });
	}

	// Try to get votes if voting_records table still references old politician_id
	// For now, we'll show the profile without votes until we migrate the data
	const votes: any[] = []; // TODO: Migrate voting records to use representative_id

	return new Response(renderRepresentativeProfile(representative, votes), {
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
	const votes = await getAllVotes(env.DB);

	return new Response(renderAdminDashboard({
		states,
		representatives,
		voterData,
		votes
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

	// Stances (votes)
	if (path === '/api/admin/stance' && request.method === 'POST') {
		const body = await request.json() as any;
		const id = await createVote(env.DB, body);
		return Response.json({ success: true, id });
	}

	if (path.startsWith('/api/admin/stance/') && request.method === 'PUT') {
		const id = parseInt(path.split('/')[4]);
		if (isNaN(id)) {
			return new Response('Invalid ID', { status: 400 });
		}
		const body = await request.json() as any;
		await updateVote(env.DB, id, body);
		return Response.json({ success: true });
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

	// Populate voter data directly
	if (path === '/api/admin/populate-voter-data' && request.method === 'POST') {
		console.log('Populate voter data endpoint called');

		// Raw TSV data - parse it directly
		const rawData = `ALABAMA	3,931	3,779	2,605	66.3	3.8	68.9	4.5	2,219	56.5	3.8	58.7	4.5
ALASKA	536	521	408	76.1	3.4	78.3	3.4	324	60.4	3.9	62.1	4.1
ARIZONA	5,841	5,186	3,578	61.3	3.4	69.0	3.2	3,201	54.8	3.3	61.7	3.2
ARKANSAS	2,371	2,274	1,472	62.1	2.4	64.7	2.3	1,200	50.6	2.8	52.8	2.7
CALIFORNIA	30,100	25,327	18,471	61.4	1.5	72.9	1.5	16,385	54.4	1.5	64.7	1.6
COLORADO	4,630	4,277	3,158	68.2	4.8	73.8	5.2	2,997	64.7	4.7	70.1	5.0
CONNECTICUT	2,850	2,608	1,882	66.0	3.5	72.2	3.4	1,729	60.7	3.5	66.3	3.4
DELAWARE	819	746	577	70.4	4.0	77.4	3.6	521	63.5	4.0	69.8	3.7
DISTRICT OF COLUMBIA	557	507	432	77.5	3.0	85.1	2.8	404	72.5	3.4	79.5	3.3
FLORIDA	18,333	16,092	10,788	58.8	2.0	67.0	2.2	9,703	52.9	1.7	60.3	1.9
GEORGIA	8,431	7,624	5,401	64.1	2.9	70.8	2.8	4,908	58.2	2.7	64.4	2.6
HAWAII	1,077	1,004	679	63.1	3.0	67.6	3.0	587	54.5	3.4	58.5	3.4
IDAHO	1,517	1,428	1,017	67.0	2.0	71.2	2.1	932	61.4	2.1	65.2	2.2
ILLINOIS	9,793	8,830	6,780	69.2	2.7	76.8	2.6	5,817	59.4	3.0	65.9	3.0
INDIANA	5,191	4,801	3,536	68.1	3.7	73.7	3.3	2,912	56.1	3.6	60.7	3.4
IOWA	2,462	2,310	1,861	75.6	3.9	80.6	3.7	1,658	67.4	4.7	71.8	4.4
KANSAS	2,203	2,041	1,628	73.9	5.1	79.8	4.5	1,443	65.5	5.7	70.7	5.6
KENTUCKY	3,405	3,178	2,558	75.1	4.2	80.5	3.2	2,152	63.2	4.3	67.7	3.6
LOUISIANA	3,400	3,273	2,160	63.5	3.6	66.0	3.6	1,897	55.8	3.7	58.0	3.6
MAINE	1,141	1,123	831	72.8	4.0	74.0	4.0	753	66.0	3.5	67.1	3.5
MARYLAND	4,785	4,350	3,497	73.1	3.5	80.4	3.2	3,091	64.6	3.7	71.1	3.6
MASSACHUSETTS	5,620	4,947	3,728	66.3	3.1	75.4	3.0	3,408	60.6	3.0	68.9	3.1
MICHIGAN	7,850	7,534	6,090	77.6	2.7	80.8	2.5	5,444	69.4	2.9	72.3	2.9
MINNESOTA	4,486	4,208	3,519	78.4	2.5	83.6	2.3	3,193	71.2	2.9	75.9	2.9
MISSISSIPPI	2,201	2,162	1,751	79.5	2.5	81.0	2.2	1,490	67.7	3.0	68.9	2.8
MISSOURI	4,790	4,664	3,707	77.4	2.8	79.5	2.7	3,240	67.6	3.2	69.5	3.3
MONTANA	896	881	651	72.6	2.5	73.8	2.5	610	68.0	2.6	69.2	2.5
NEBRASKA	1,488	1,377	1,016	68.2	4.7	73.8	4.0	928	62.4	4.6	67.4	4.0
NEVADA	2,506	2,230	1,640	65.4	3.0	73.5	2.6	1,493	59.6	3.1	66.9	2.9
NEW HAMPSHIRE	1,144	1,096	856	74.9	3.9	78.1	3.4	788	68.9	3.8	71.9	3.4
NEW JERSEY	7,282	6,323	5,175	71.1	3.2	81.9	2.7	4,581	62.9	3.2	72.5	2.8
NEW MEXICO	1,645	1,491	1,135	69.0	3.4	76.1	3.3	984	59.8	3.8	66.0	3.7
NEW YORK	15,392	13,667	9,051	58.8	2.5	66.2	2.7	8,091	52.6	2.4	59.2	2.6
NORTH CAROLINA	8,496	7,695	5,374	63.3	2.9	69.8	2.7	4,971	58.5	2.8	64.6	2.7
NORTH DAKOTA	582	563	442	76.0	2.7	78.6	2.9	401	68.9	2.7	71.2	2.7
OHIO	9,113	8,782	6,593	72.4	2.3	75.1	2.2	5,922	65.0	2.5	67.4	2.5
OKLAHOMA	3,053	2,924	2,062	67.6	3.4	70.5	3.0	1,747	57.2	3.3	59.7	3.1
OREGON	3,365	3,138	2,604	77.4	2.9	83.0	3.0	2,362	70.2	2.8	75.3	2.8
PENNSYLVANIA	10,185	9,789	7,413	72.8	2.3	75.7	2.3	6,828	67.0	2.4	69.7	2.3
RHODE ISLAND	888	811	645	72.6	3.5	79.5	3.2	568	64.0	3.9	70.0	4.0
SOUTH CAROLINA	4,222	4,006	2,935	69.5	3.2	73.3	3.0	2,510	59.5	3.2	62.7	3.2
SOUTH DAKOTA	690	669	473	68.5	3.5	70.7	3.7	394	57.1	3.7	58.9	3.8
TENNESSEE	5,583	5,300	3,980	71.3	2.9	75.1	2.6	3,433	61.5	2.8	64.8	2.6
TEXAS	23,139	19,754	13,641	59.0	2.2	69.1	2.3	11,442	49.4	2.2	57.9	2.3
UTAH	2,505	2,324	1,736	69.3	3.1	74.7	3.1	1,555	62.1	3.2	66.9	3.1
VERMONT	530	520	401	75.7	3.3	77.2	3.4	373	70.4	3.1	71.7	3.1
VIRGINIA	6,722	6,259	4,981	74.1	2.5	79.6	2.2	4,565	67.9	2.7	72.9	2.4
WASHINGTON	6,155	5,516	4,250	69.1	3.7	77.1	3.5	3,863	62.8	4.1	70.0	4.0
WEST VIRGINIA	1,379	1,355	1,001	72.6	4.5	73.8	4.4	807	58.5	5.5	59.5	5.5
WISCONSIN	4,629	4,431	3,380	73.0	3.3	76.3	3.2	3,201	69.2	3.6	72.2	3.4
WYOMING	453	443	307	67.8	2.8	69.3	2.5	283	62.4	2.5	63.8	2.4`;

		// Parse TSV data
		const lines = rawData.trim().split('\n');
		let updated = 0;
		let errors = 0;

		for (const line of lines) {
			try {
				const parts = line.split('\t');
				if (parts.length < 13) continue;

				// Extract data - columns are:
				// 0: state name, 1: voting_age_pop, 2: citizen_voting_age_pop, 3: registered,
				// 4: pct_registered_total, 5: pct_registered_total_margin,
				// 6: pct_registered_citizen, 7: pct_registered_citizen_margin,
				// 8: total_voted, 9: pct_voted_total, 10: pct_voted_total_margin,
				// 11: pct_voted_citizen, 12: pct_voted_citizen_margin

				const stateName = parts[0].toUpperCase();
				let stateCode = '';

				// Map state names to codes
				if (stateName === 'ALABAMA') stateCode = 'AL';
				else if (stateName === 'ALASKA') stateCode = 'AK';
				else if (stateName === 'ARIZONA') stateCode = 'AZ';
				else if (stateName === 'ARKANSAS') stateCode = 'AR';
				else if (stateName === 'CALIFORNIA') stateCode = 'CA';
				else if (stateName === 'COLORADO') stateCode = 'CO';
				else if (stateName === 'CONNECTICUT') stateCode = 'CT';
				else if (stateName === 'DELAWARE') stateCode = 'DE';
				else if (stateName === 'DISTRICT OF COLUMBIA') stateCode = 'DC';
				else if (stateName === 'FLORIDA') stateCode = 'FL';
				else if (stateName === 'GEORGIA') stateCode = 'GA';
				else if (stateName === 'HAWAII') stateCode = 'HI';
				else if (stateName === 'IDAHO') stateCode = 'ID';
				else if (stateName === 'ILLINOIS') stateCode = 'IL';
				else if (stateName === 'INDIANA') stateCode = 'IN';
				else if (stateName === 'IOWA') stateCode = 'IA';
				else if (stateName === 'KANSAS') stateCode = 'KS';
				else if (stateName === 'KENTUCKY') stateCode = 'KY';
				else if (stateName === 'LOUISIANA') stateCode = 'LA';
				else if (stateName === 'MAINE') stateCode = 'ME';
				else if (stateName === 'MARYLAND') stateCode = 'MD';
				else if (stateName === 'MASSACHUSETTS') stateCode = 'MA';
				else if (stateName === 'MICHIGAN') stateCode = 'MI';
				else if (stateName === 'MINNESOTA') stateCode = 'MN';
				else if (stateName === 'MISSISSIPPI') stateCode = 'MS';
				else if (stateName === 'MISSOURI') stateCode = 'MO';
				else if (stateName === 'MONTANA') stateCode = 'MT';
				else if (stateName === 'NEBRASKA') stateCode = 'NE';
				else if (stateName === 'NEVADA') stateCode = 'NV';
				else if (stateName === 'NEW HAMPSHIRE') stateCode = 'NH';
				else if (stateName === 'NEW JERSEY') stateCode = 'NJ';
				else if (stateName === 'NEW MEXICO') stateCode = 'NM';
				else if (stateName === 'NEW YORK') stateCode = 'NY';
				else if (stateName === 'NORTH CAROLINA') stateCode = 'NC';
				else if (stateName === 'NORTH DAKOTA') stateCode = 'ND';
				else if (stateName === 'OHIO') stateCode = 'OH';
				else if (stateName === 'OKLAHOMA') stateCode = 'OK';
				else if (stateName === 'OREGON') stateCode = 'OR';
				else if (stateName === 'PENNSYLVANIA') stateCode = 'PA';
				else if (stateName === 'RHODE ISLAND') stateCode = 'RI';
				else if (stateName === 'SOUTH CAROLINA') stateCode = 'SC';
				else if (stateName === 'SOUTH DAKOTA') stateCode = 'SD';
				else if (stateName === 'TENNESSEE') stateCode = 'TN';
				else if (stateName === 'TEXAS') stateCode = 'TX';
				else if (stateName === 'UTAH') stateCode = 'UT';
				else if (stateName === 'VERMONT') stateCode = 'VT';
				else if (stateName === 'VIRGINIA') stateCode = 'VA';
				else if (stateName === 'WASHINGTON') stateCode = 'WA';
				else if (stateName === 'WEST VIRGINIA') stateCode = 'WV';
				else if (stateName === 'WISCONSIN') stateCode = 'WI';
				else if (stateName === 'WYOMING') stateCode = 'WY';

				if (!stateCode) continue;

				// Parse numbers, removing commas
				const voting_age_pop = parseInt(parts[1].replace(/,/g, '')) * 1000;
				const citizen_voting_age_pop = parseInt(parts[2].replace(/,/g, '')) * 1000;
				const registered = parseInt(parts[3].replace(/,/g, '')) * 1000;
				const pct_registered_total = parseFloat(parts[4]);
				const pct_registered_total_margin = parseFloat(parts[5]);
				const pct_registered_citizen = parseFloat(parts[6]);
				const pct_registered_citizen_margin = parseFloat(parts[7]);
				const total_voted = parseInt(parts[8].replace(/,/g, '')) * 1000;
				const pct_voted_total = parseFloat(parts[9]);
				const pct_voted_total_margin = parseFloat(parts[10]);
				const pct_voted_citizen = parseFloat(parts[11]);
				const pct_voted_citizen_margin = parseFloat(parts[12]);

				await upsertVoterData(env.DB, {
					state_code: stateCode,
					voting_age_population: voting_age_pop,
					citizen_voting_age_population: citizen_voting_age_pop,
					total_registered_voters: registered,
					percent_registered_total: pct_registered_total,
					percent_registered_total_margin: pct_registered_total_margin,
					percent_registered_citizen: pct_registered_citizen,
					percent_registered_citizen_margin: pct_registered_citizen_margin,
					total_voted: total_voted,
					percent_voted_total: pct_voted_total,
					percent_voted_total_margin: pct_voted_total_margin,
					percent_voted_citizen: pct_voted_citizen,
					percent_voted_citizen_margin: pct_voted_citizen_margin,
					data_year: 2024,
					data_source: 'Census Bureau Voting and Registration Supplement'
				});
				updated++;
			} catch (error) {
				console.error(`Error parsing line: ${line}`, error);
				errors++;
			}
		}

		console.log(`Populate voter data complete: ${updated} updated, ${errors} errors`);

		return Response.json({
			success: true,
			message: `Updated voter data for ${updated} states (${errors} errors)`,
			updated,
			errors
		});
	}

	return new Response('Not found', { status: 404 });
}

function renderRepresentativeProfile(representative: any, votes: any[]): string {
	const partyClass = representative.party?.toLowerCase() || 'independent';
	
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
			background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
			min-height: 100vh;
			padding: 2rem;
			color: #333;
		}

		.container {
			max-width: 1000px;
			margin: 0 auto;
		}
		
		.back-link {
			display: inline-block;
			margin-bottom: 1rem;
			color: white;
			text-decoration: none;
			font-weight: 600;
			opacity: 0.9;
		}
		
		.back-link:hover {
			opacity: 1;
		}
		
		.profile-header {
			background: white;
			border-radius: 12px;
			padding: 2rem;
			margin-bottom: 2rem;
			box-shadow: 0 4px 6px rgba(0,0,0,0.1);
		}
		
		.profile-name {
			font-size: 2.5rem;
			margin-bottom: 1rem;
			color: #333;
		}
		
		.profile-details {
			display: grid;
			grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
			gap: 1rem;
			margin-top: 1.5rem;
		}
		
		.detail-item {
			display: flex;
			flex-direction: column;
		}
		
		.detail-label {
			font-size: 0.85rem;
			color: #666;
			text-transform: uppercase;
			letter-spacing: 0.5px;
			margin-bottom: 0.25rem;
		}
		
		.detail-value {
			font-size: 1.1rem;
			font-weight: 600;
			color: #333;
		}
		
		.badge {
			display: inline-block;
			padding: 0.5rem 1rem;
			border-radius: 20px;
			font-size: 0.9rem;
			font-weight: 600;
			margin-top: 0.5rem;
		}
		
		.badge-democrat {
			background: #3b82f6;
			color: white;
		}
		
		.badge-republican {
			background: #ef4444;
			color: white;
		}
		
		.badge-independent {
			background: #6b7280;
			color: white;
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
	</style>
</head>
<body>
	<div class="container">
		<a href="/" class="back-link">← Back to Map</a>
		
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
			</div>
		</div>
	</div>
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
