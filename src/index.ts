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

	// Populate voter data from TSV
	if (path === '/api/admin/populate-voter-data' && request.method === 'POST') {
		console.log('Populate voter data endpoint called');

		// 2024 Voter Data - numbers in thousands
		const voterData: Record<string, {
			voting_age_pop: number;
			citizen_voting_age_pop: number;
			registered: number;
			pct_registered_total: number;
			pct_registered_total_margin: number;
			pct_registered_citizen: number;
			pct_registered_citizen_margin: number;
			total_voted: number;
			pct_voted_total: number;
			pct_voted_total_margin: number;
			pct_voted_citizen: number;
			pct_voted_citizen_margin: number;
		}> = {
			'AL': { voting_age_pop: 3931, citizen_voting_age_pop: 3779, registered: 2605, pct_registered_total: 66.3, pct_registered_total_margin: 3.8, pct_registered_citizen: 68.9, pct_registered_citizen_margin: 4.5, total_voted: 2219, pct_voted_total: 56.5, pct_voted_total_margin: 3.8, pct_voted_citizen: 58.7, pct_voted_citizen_margin: 4.5 },
			'AK': { voting_age_pop: 536, citizen_voting_age_pop: 521, registered: 408, pct_registered_total: 76.1, pct_registered_total_margin: 3.4, pct_registered_citizen: 78.3, pct_registered_citizen_margin: 3.4, total_voted: 324, pct_voted_total: 60.4, pct_voted_total_margin: 3.9, pct_voted_citizen: 62.1, pct_voted_citizen_margin: 4.1 },
			'AZ': { voting_age_pop: 5841, citizen_voting_age_pop: 5186, registered: 3578, pct_registered_total: 61.3, pct_registered_total_margin: 3.4, pct_registered_citizen: 69.0, pct_registered_citizen_margin: 3.2, total_voted: 3201, pct_voted_total: 54.8, pct_voted_total_margin: 3.3, pct_voted_citizen: 61.7, pct_voted_citizen_margin: 3.2 },
			'AR': { voting_age_pop: 2371, citizen_voting_age_pop: 2274, registered: 1472, pct_registered_total: 62.1, pct_registered_total_margin: 2.4, pct_registered_citizen: 64.7, pct_registered_citizen_margin: 2.3, total_voted: 1200, pct_voted_total: 50.6, pct_voted_total_margin: 2.8, pct_voted_citizen: 52.8, pct_voted_citizen_margin: 2.7 },
			'CA': { voting_age_pop: 30100, citizen_voting_age_pop: 25327, registered: 18471, pct_registered_total: 61.4, pct_registered_total_margin: 1.5, pct_registered_citizen: 72.9, pct_registered_citizen_margin: 1.5, total_voted: 16385, pct_voted_total: 54.4, pct_voted_total_margin: 1.5, pct_voted_citizen: 64.7, pct_voted_citizen_margin: 1.6 },
			'CO': { voting_age_pop: 4630, citizen_voting_age_pop: 4277, registered: 3158, pct_registered_total: 68.2, pct_registered_total_margin: 4.8, pct_registered_citizen: 73.8, pct_registered_citizen_margin: 5.2, total_voted: 2997, pct_voted_total: 64.7, pct_voted_total_margin: 4.7, pct_voted_citizen: 70.1, pct_voted_citizen_margin: 5.0 },
			'CT': { voting_age_pop: 2850, citizen_voting_age_pop: 2608, registered: 1882, pct_registered_total: 66.0, pct_registered_total_margin: 3.5, pct_registered_citizen: 72.2, pct_registered_citizen_margin: 3.4, total_voted: 1729, pct_voted_total: 60.7, pct_voted_total_margin: 3.5, pct_voted_citizen: 66.3, pct_voted_citizen_margin: 3.4 },
			'DE': { voting_age_pop: 819, citizen_voting_age_pop: 746, registered: 577, pct_registered_total: 70.4, pct_registered_total_margin: 4.0, pct_registered_citizen: 77.4, pct_registered_citizen_margin: 3.6, total_voted: 521, pct_voted_total: 63.5, pct_voted_total_margin: 4.0, pct_voted_citizen: 69.8, pct_voted_citizen_margin: 3.7 },
			'DC': { voting_age_pop: 557, citizen_voting_age_pop: 507, registered: 432, pct_registered_total: 77.5, pct_registered_total_margin: 3.0, pct_registered_citizen: 85.1, pct_registered_citizen_margin: 2.8, total_voted: 404, pct_voted_total: 72.5, pct_voted_total_margin: 3.4, pct_voted_citizen: 79.5, pct_voted_citizen_margin: 3.3 },
			'FL': { voting_age_pop: 18333, citizen_voting_age_pop: 16092, registered: 10788, pct_registered_total: 58.8, pct_registered_total_margin: 2.0, pct_registered_citizen: 67.0, pct_registered_citizen_margin: 2.2, total_voted: 9703, pct_voted_total: 52.9, pct_voted_total_margin: 1.7, pct_voted_citizen: 60.3, pct_voted_citizen_margin: 1.9 },
			'GA': { voting_age_pop: 8431, citizen_voting_age_pop: 7624, registered: 5401, pct_registered_total: 64.1, pct_registered_total_margin: 2.9, pct_registered_citizen: 70.8, pct_registered_citizen_margin: 2.8, total_voted: 4908, pct_voted_total: 58.2, pct_voted_total_margin: 2.7, pct_voted_citizen: 64.4, pct_voted_citizen_margin: 2.6 },
			'HI': { voting_age_pop: 1077, citizen_voting_age_pop: 1004, registered: 679, pct_registered_total: 63.1, pct_registered_total_margin: 3.0, pct_registered_citizen: 67.6, pct_registered_citizen_margin: 3.0, total_voted: 587, pct_voted_total: 54.5, pct_voted_total_margin: 3.4, pct_voted_citizen: 58.5, pct_voted_citizen_margin: 3.4 },
			'ID': { voting_age_pop: 1517, citizen_voting_age_pop: 1428, registered: 1017, pct_registered_total: 67.0, pct_registered_total_margin: 2.0, pct_registered_citizen: 71.2, pct_registered_citizen_margin: 2.1, total_voted: 932, pct_voted_total: 61.4, pct_voted_total_margin: 2.1, pct_voted_citizen: 65.2, pct_voted_citizen_margin: 2.2 },
			'IL': { voting_age_pop: 9793, citizen_voting_age_pop: 8830, registered: 6780, pct_registered_total: 69.2, pct_registered_total_margin: 2.7, pct_registered_citizen: 76.8, pct_registered_citizen_margin: 2.6, total_voted: 5817, pct_voted_total: 59.4, pct_voted_total_margin: 3.0, pct_voted_citizen: 65.9, pct_voted_citizen_margin: 3.0 },
			'IN': { voting_age_pop: 5191, citizen_voting_age_pop: 4801, registered: 3536, pct_registered_total: 68.1, pct_registered_total_margin: 3.7, pct_registered_citizen: 73.7, pct_registered_citizen_margin: 3.3, total_voted: 2912, pct_voted_total: 56.1, pct_voted_total_margin: 3.6, pct_voted_citizen: 60.7, pct_voted_citizen_margin: 3.4 },
			'IA': { voting_age_pop: 2462, citizen_voting_age_pop: 2310, registered: 1861, pct_registered_total: 75.6, pct_registered_total_margin: 3.9, pct_registered_citizen: 80.6, pct_registered_citizen_margin: 3.7, total_voted: 1658, pct_voted_total: 67.4, pct_voted_total_margin: 4.7, pct_voted_citizen: 71.8, pct_voted_citizen_margin: 4.4 },
			'KS': { voting_age_pop: 2203, citizen_voting_age_pop: 2041, registered: 1628, pct_registered_total: 73.9, pct_registered_total_margin: 5.1, pct_registered_citizen: 79.8, pct_registered_citizen_margin: 4.5, total_voted: 1443, pct_voted_total: 65.5, pct_voted_total_margin: 5.7, pct_voted_citizen: 70.7, pct_voted_citizen_margin: 5.6 },
			'KY': { voting_age_pop: 3405, citizen_voting_age_pop: 3178, registered: 2558, pct_registered_total: 75.1, pct_registered_total_margin: 4.2, pct_registered_citizen: 80.5, pct_registered_citizen_margin: 3.2, total_voted: 2152, pct_voted_total: 63.2, pct_voted_total_margin: 4.3, pct_voted_citizen: 67.7, pct_voted_citizen_margin: 3.6 },
			'LA': { voting_age_pop: 3400, citizen_voting_age_pop: 3273, registered: 2160, pct_registered_total: 63.5, pct_registered_total_margin: 3.6, pct_registered_citizen: 66.0, pct_registered_citizen_margin: 3.6, total_voted: 1897, pct_voted_total: 55.8, pct_voted_total_margin: 3.7, pct_voted_citizen: 58.0, pct_voted_citizen_margin: 3.6 },
			'ME': { voting_age_pop: 1141, citizen_voting_age_pop: 1123, registered: 831, pct_registered_total: 72.8, pct_registered_total_margin: 4.0, pct_registered_citizen: 74.0, pct_registered_citizen_margin: 4.0, total_voted: 753, pct_voted_total: 66.0, pct_voted_total_margin: 3.5, pct_voted_citizen: 67.1, pct_voted_citizen_margin: 3.5 },
			'MD': { voting_age_pop: 4785, citizen_voting_age_pop: 4350, registered: 3497, pct_registered_total: 73.1, pct_registered_total_margin: 3.5, pct_registered_citizen: 80.4, pct_registered_citizen_margin: 3.2, total_voted: 3091, pct_voted_total: 64.6, pct_voted_total_margin: 3.7, pct_voted_citizen: 71.1, pct_voted_citizen_margin: 3.6 },
			'MA': { voting_age_pop: 5620, citizen_voting_age_pop: 4947, registered: 3728, pct_registered_total: 66.3, pct_registered_total_margin: 3.1, pct_registered_citizen: 75.4, pct_registered_citizen_margin: 3.0, total_voted: 3408, pct_voted_total: 60.6, pct_voted_total_margin: 3.0, pct_voted_citizen: 68.9, pct_voted_citizen_margin: 3.1 },
			'MI': { voting_age_pop: 7850, citizen_voting_age_pop: 7534, registered: 6090, pct_registered_total: 77.6, pct_registered_total_margin: 2.7, pct_registered_citizen: 80.8, pct_registered_citizen_margin: 2.5, total_voted: 5444, pct_voted_total: 69.4, pct_voted_total_margin: 2.9, pct_voted_citizen: 72.3, pct_voted_citizen_margin: 2.9 },
			'MN': { voting_age_pop: 4486, citizen_voting_age_pop: 4208, registered: 3519, pct_registered_total: 78.4, pct_registered_total_margin: 2.5, pct_registered_citizen: 83.6, pct_registered_citizen_margin: 2.3, total_voted: 3193, pct_voted_total: 71.2, pct_voted_total_margin: 2.9, pct_voted_citizen: 75.9, pct_voted_citizen_margin: 2.9 },
			'MS': { voting_age_pop: 2201, citizen_voting_age_pop: 2162, registered: 1751, pct_registered_total: 79.5, pct_registered_total_margin: 2.5, pct_registered_citizen: 81.0, pct_registered_citizen_margin: 2.2, total_voted: 1490, pct_voted_total: 67.7, pct_voted_total_margin: 3.0, pct_voted_citizen: 68.9, pct_voted_citizen_margin: 2.8 },
			'MO': { voting_age_pop: 4790, citizen_voting_age_pop: 4664, registered: 3707, pct_registered_total: 77.4, pct_registered_total_margin: 2.8, pct_registered_citizen: 79.5, pct_registered_citizen_margin: 2.7, total_voted: 3240, pct_voted_total: 67.6, pct_voted_total_margin: 3.2, pct_voted_citizen: 69.5, pct_voted_citizen_margin: 3.3 },
			'MT': { voting_age_pop: 896, citizen_voting_age_pop: 881, registered: 651, pct_registered_total: 72.6, pct_registered_total_margin: 2.5, pct_registered_citizen: 73.8, pct_registered_citizen_margin: 2.5, total_voted: 610, pct_voted_total: 68.0, pct_voted_total_margin: 2.6, pct_voted_citizen: 69.2, pct_voted_citizen_margin: 2.5 },
			'NE': { voting_age_pop: 1488, citizen_voting_age_pop: 1377, registered: 1016, pct_registered_total: 68.2, pct_registered_total_margin: 4.7, pct_registered_citizen: 73.8, pct_registered_citizen_margin: 4.0, total_voted: 928, pct_voted_total: 62.4, pct_voted_total_margin: 4.6, pct_voted_citizen: 67.4, pct_voted_citizen_margin: 4.0 },
			'NV': { voting_age_pop: 2506, citizen_voting_age_pop: 2230, registered: 1640, pct_registered_total: 65.4, pct_registered_total_margin: 3.0, pct_registered_citizen: 73.5, pct_registered_citizen_margin: 2.6, total_voted: 1493, pct_voted_total: 59.6, pct_voted_total_margin: 3.1, pct_voted_citizen: 66.9, pct_voted_citizen_margin: 2.9 },
			'NH': { voting_age_pop: 1144, citizen_voting_age_pop: 1096, registered: 856, pct_registered_total: 74.9, pct_registered_total_margin: 3.9, pct_registered_citizen: 78.1, pct_registered_citizen_margin: 3.4, total_voted: 788, pct_voted_total: 68.9, pct_voted_total_margin: 3.8, pct_voted_citizen: 71.9, pct_voted_citizen_margin: 3.4 },
			'NJ': { voting_age_pop: 7282, citizen_voting_age_pop: 6323, registered: 5175, pct_registered_total: 71.1, pct_registered_total_margin: 3.2, pct_registered_citizen: 81.9, pct_registered_citizen_margin: 2.7, total_voted: 4581, pct_voted_total: 62.9, pct_voted_total_margin: 3.2, pct_voted_citizen: 72.5, pct_voted_citizen_margin: 2.8 },
			'NM': { voting_age_pop: 1645, citizen_voting_age_pop: 1491, registered: 1135, pct_registered_total: 69.0, pct_registered_total_margin: 3.4, pct_registered_citizen: 76.1, pct_registered_citizen_margin: 3.3, total_voted: 984, pct_voted_total: 59.8, pct_voted_total_margin: 3.8, pct_voted_citizen: 66.0, pct_voted_citizen_margin: 3.7 },
			'NY': { voting_age_pop: 15392, citizen_voting_age_pop: 13667, registered: 9051, pct_registered_total: 58.8, pct_registered_total_margin: 2.5, pct_registered_citizen: 66.2, pct_registered_citizen_margin: 2.7, total_voted: 8091, pct_voted_total: 52.6, pct_voted_total_margin: 2.4, pct_voted_citizen: 59.2, pct_voted_citizen_margin: 2.6 },
			'NC': { voting_age_pop: 8496, citizen_voting_age_pop: 7695, registered: 5374, pct_registered_total: 63.3, pct_registered_total_margin: 2.9, pct_registered_citizen: 69.8, pct_registered_citizen_margin: 2.7, total_voted: 4971, pct_voted_total: 58.5, pct_voted_total_margin: 2.8, pct_voted_citizen: 64.6, pct_voted_citizen_margin: 2.7 },
			'ND': { voting_age_pop: 582, citizen_voting_age_pop: 563, registered: 442, pct_registered_total: 76.0, pct_registered_total_margin: 2.7, pct_registered_citizen: 78.6, pct_registered_citizen_margin: 2.9, total_voted: 401, pct_voted_total: 68.9, pct_voted_total_margin: 2.7, pct_voted_citizen: 71.2, pct_voted_citizen_margin: 2.7 },
			'OH': { voting_age_pop: 9113, citizen_voting_age_pop: 8782, registered: 6593, pct_registered_total: 72.4, pct_registered_total_margin: 2.3, pct_registered_citizen: 75.1, pct_registered_citizen_margin: 2.2, total_voted: 5922, pct_voted_total: 65.0, pct_voted_total_margin: 2.5, pct_voted_citizen: 67.4, pct_voted_citizen_margin: 2.5 },
			'OK': { voting_age_pop: 3053, citizen_voting_age_pop: 2924, registered: 2062, pct_registered_total: 67.6, pct_registered_total_margin: 3.4, pct_registered_citizen: 70.5, pct_registered_citizen_margin: 3.0, total_voted: 1747, pct_voted_total: 57.2, pct_voted_total_margin: 3.3, pct_voted_citizen: 59.7, pct_voted_citizen_margin: 3.1 },
			'OR': { voting_age_pop: 3365, citizen_voting_age_pop: 3138, registered: 2604, pct_registered_total: 77.4, pct_registered_total_margin: 2.9, pct_registered_citizen: 83.0, pct_registered_citizen_margin: 3.0, total_voted: 2362, pct_voted_total: 70.2, pct_voted_total_margin: 2.8, pct_voted_citizen: 75.3, pct_voted_citizen_margin: 2.8 },
			'PA': { voting_age_pop: 10185, citizen_voting_age_pop: 9789, registered: 7413, pct_registered_total: 72.8, pct_registered_total_margin: 2.3, pct_registered_citizen: 75.7, pct_registered_citizen_margin: 2.3, total_voted: 6828, pct_voted_total: 67.0, pct_voted_total_margin: 2.4, pct_voted_citizen: 69.7, pct_voted_citizen_margin: 2.3 },
			'RI': { voting_age_pop: 888, citizen_voting_age_pop: 811, registered: 645, pct_registered_total: 72.6, pct_registered_total_margin: 3.5, pct_registered_citizen: 79.5, pct_registered_citizen_margin: 3.2, total_voted: 568, pct_voted_total: 64.0, pct_voted_total_margin: 3.9, pct_voted_citizen: 70.0, pct_voted_citizen_margin: 4.0 },
			'SC': { voting_age_pop: 4222, citizen_voting_age_pop: 4006, registered: 2935, pct_registered_total: 69.5, pct_registered_total_margin: 3.2, pct_registered_citizen: 73.3, pct_registered_citizen_margin: 3.0, total_voted: 2510, pct_voted_total: 59.5, pct_voted_total_margin: 3.2, pct_voted_citizen: 62.7, pct_voted_citizen_margin: 3.2 },
			'SD': { voting_age_pop: 690, citizen_voting_age_pop: 669, registered: 473, pct_registered_total: 68.5, pct_registered_total_margin: 3.5, pct_registered_citizen: 70.7, pct_registered_citizen_margin: 3.7, total_voted: 394, pct_voted_total: 57.1, pct_voted_total_margin: 3.7, pct_voted_citizen: 58.9, pct_voted_citizen_margin: 3.8 },
			'TN': { voting_age_pop: 5583, citizen_voting_age_pop: 5300, registered: 3980, pct_registered_total: 71.3, pct_registered_total_margin: 2.9, pct_registered_citizen: 75.1, pct_registered_citizen_margin: 2.6, total_voted: 3433, pct_voted_total: 61.5, pct_voted_total_margin: 2.8, pct_voted_citizen: 64.8, pct_voted_citizen_margin: 2.6 },
			'TX': { voting_age_pop: 23139, citizen_voting_age_pop: 19754, registered: 13641, pct_registered_total: 59.0, pct_registered_total_margin: 2.2, pct_registered_citizen: 69.1, pct_registered_citizen_margin: 2.3, total_voted: 11442, pct_voted_total: 49.4, pct_voted_total_margin: 2.2, pct_voted_citizen: 57.9, pct_voted_citizen_margin: 2.3 },
			'UT': { voting_age_pop: 2505, citizen_voting_age_pop: 2324, registered: 1736, pct_registered_total: 69.3, pct_registered_total_margin: 3.1, pct_registered_citizen: 74.7, pct_registered_citizen_margin: 3.1, total_voted: 1555, pct_voted_total: 62.1, pct_voted_total_margin: 3.2, pct_voted_citizen: 66.9, pct_voted_citizen_margin: 3.1 },
			'VT': { voting_age_pop: 530, citizen_voting_age_pop: 520, registered: 401, pct_registered_total: 75.7, pct_registered_total_margin: 3.3, pct_registered_citizen: 77.2, pct_registered_citizen_margin: 3.4, total_voted: 373, pct_voted_total: 70.4, pct_voted_total_margin: 3.1, pct_voted_citizen: 71.7, pct_voted_citizen_margin: 3.1 },
			'VA': { voting_age_pop: 6722, citizen_voting_age_pop: 6259, registered: 4981, pct_registered_total: 74.1, pct_registered_total_margin: 2.5, pct_registered_citizen: 79.6, pct_registered_citizen_margin: 2.2, total_voted: 4565, pct_voted_total: 67.9, pct_voted_total_margin: 2.7, pct_voted_citizen: 72.9, pct_voted_citizen_margin: 2.4 },
			'WA': { voting_age_pop: 6155, citizen_voting_age_pop: 5516, registered: 4250, pct_registered_total: 69.1, pct_registered_total_margin: 3.7, pct_registered_citizen: 77.1, pct_registered_citizen_margin: 3.5, total_voted: 3863, pct_voted_total: 62.8, pct_voted_total_margin: 4.1, pct_voted_citizen: 70.0, pct_voted_citizen_margin: 4.0 },
			'WV': { voting_age_pop: 1379, citizen_voting_age_pop: 1355, registered: 1001, pct_registered_total: 72.6, pct_registered_total_margin: 4.5, pct_registered_citizen: 73.8, pct_registered_citizen_margin: 4.4, total_voted: 807, pct_voted_total: 58.5, pct_voted_total_margin: 5.5, pct_voted_citizen: 59.5, pct_voted_citizen_margin: 5.5 },
			'WI': { voting_age_pop: 4629, citizen_voting_age_pop: 4431, registered: 3380, pct_registered_total: 73.0, pct_registered_total_margin: 3.3, pct_registered_citizen: 76.3, pct_registered_citizen_margin: 3.2, total_voted: 3201, pct_voted_total: 69.2, pct_voted_total_margin: 3.6, pct_voted_citizen: 72.2, pct_voted_citizen_margin: 3.4 },
			'WY': { voting_age_pop: 453, citizen_voting_age_pop: 443, registered: 307, pct_registered_total: 67.8, pct_registered_total_margin: 2.8, pct_registered_citizen: 69.3, pct_registered_citizen_margin: 2.5, total_voted: 283, pct_voted_total: 62.4, pct_voted_total_margin: 2.5, pct_voted_citizen: 63.8, pct_voted_citizen_margin: 2.4 }
		};

		let updated = 0;
		let errors = 0;

		for (const [stateCode, data] of Object.entries(voterData)) {
			try {
				await upsertVoterData(env.DB, {
					state_code: stateCode,
					voting_age_population: data.voting_age_pop * 1000, // Convert from thousands
					citizen_voting_age_population: data.citizen_voting_age_pop * 1000,
					total_registered_voters: data.registered * 1000,
					percent_registered_total: data.pct_registered_total,
					percent_registered_total_margin: data.pct_registered_total_margin,
					percent_registered_citizen: data.pct_registered_citizen,
					percent_registered_citizen_margin: data.pct_registered_citizen_margin,
					total_voted: data.total_voted * 1000,
					percent_voted_total: data.pct_voted_total,
					percent_voted_total_margin: data.pct_voted_total_margin,
					percent_voted_citizen: data.pct_voted_citizen,
					percent_voted_citizen_margin: data.pct_voted_citizen_margin,
					data_year: 2024,
					data_source: 'Census Bureau Voting and Registration Supplement'
				});
				updated++;
			} catch (error) {
				console.error(`Error updating voter data for ${stateCode}:`, error);
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
