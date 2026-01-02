/// <reference types="../worker-configuration.d.ts" />

import { renderHomePage } from "./renderMap";
import { renderPoliticianProfile } from "./renderHtml";
import { 
	getAllStates, 
	getStateByCode,
	getRepresentativesByState,
	getRepresentative,
	getVoterDataByState,
	getVoterDemographicsByState,
	getPoliticianVotes
} from "./db";

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
