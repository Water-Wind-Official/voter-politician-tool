/// <reference types="../worker-configuration.d.ts" />

import { renderHomePage } from "./renderMap";
import { renderPoliticianProfile } from "./renderHtml";
import { renderAdminLogin, renderAdminDashboard } from "./renderAdmin";
import { renderSenatorHub } from "./renderSenators";
import { renderHouseHub } from "./renderHouse";
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
			body.electoral_margin || null
		);
		return Response.json({ success: true });
	}

	// Legacy vote endpoint
	if (path === '/api/admin/vote' && request.method === 'POST') {
		const body = await request.json() as any;
		const id = await createVote(env.DB, body);
		return Response.json({ success: true, id });
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
