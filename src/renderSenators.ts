import type { Representative } from './types';

export function renderSenatorHub(senators: Representative[]): string {
	// Group senators by state
	const senatorsByState: { [key: string]: Representative[] } = {};
	senators.forEach(senator => {
		if (!senatorsByState[senator.state_code]) {
			senatorsByState[senator.state_code] = [];
		}
		senatorsByState[senator.state_code].push(senator);
	});

	// Sort states alphabetically
	const sortedStates = Object.keys(senatorsByState).sort();

	return `
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<title>Voter Politician Tool - Senate Hub</title>
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
			max-width: 1400px;
			margin: 0 auto;
		}
		
		header {
			background: white;
			border-radius: 12px;
			padding: 2rem;
			margin-bottom: 2rem;
			box-shadow: 0 4px 6px rgba(0,0,0,0.1);
		}
		
		nav {
			margin-top: 1rem;
			padding-top: 1rem;
			border-top: 1px solid #e5e7eb;
		}
		
		nav a {
			color: #667eea;
			text-decoration: none;
			margin-right: 1rem;
			font-weight: 500;
		}
		
		nav a:hover {
			text-decoration: underline;
		}
		
		h1 {
			font-size: 2.5rem;
			margin-bottom: 0.5rem;
			background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
			-webkit-background-clip: text;
			-webkit-text-fill-color: transparent;
			background-clip: text;
		}
		
		.subtitle {
			color: #666;
			font-size: 1.1rem;
			margin-bottom: 1rem;
		}
		
		.pdf-notice {
			background: #f0f9ff;
			border-left: 4px solid #3b82f6;
			padding: 1rem;
			margin-bottom: 2rem;
			border-radius: 8px;
		}
		
		.pdf-notice a {
			color: #3b82f6;
			text-decoration: none;
			font-weight: 600;
		}
		
		.pdf-notice a:hover {
			text-decoration: underline;
		}
		
		.senators-grid {
			display: grid;
			grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
			gap: 1.5rem;
			margin-bottom: 2rem;
		}
		
		.state-section {
			background: white;
			border-radius: 12px;
			padding: 1.5rem;
			box-shadow: 0 4px 6px rgba(0,0,0,0.1);
		}
		
		.state-header {
			font-size: 1.5rem;
			font-weight: 700;
			margin-bottom: 1rem;
			color: #667eea;
			border-bottom: 2px solid #e5e7eb;
			padding-bottom: 0.5rem;
		}
		
		.senator-card {
			background: #f9fafb;
			border-radius: 8px;
			padding: 1rem;
			margin-bottom: 1rem;
			border-left: 4px solid #667eea;
		}
		
		.senator-card:last-child {
			margin-bottom: 0;
		}
		
		.senator-name {
			font-size: 1.2rem;
			font-weight: 600;
			margin-bottom: 0.5rem;
			color: #1f2937;
		}
		
		.senator-details {
			display: flex;
			flex-direction: column;
			gap: 0.25rem;
			font-size: 0.9rem;
			color: #6b7280;
		}
		
		.senator-details strong {
			color: #374151;
		}
		
		.senator-link {
			display: inline-block;
			margin-top: 0.5rem;
			color: #667eea;
			text-decoration: none;
			font-weight: 500;
		}
		
		.senator-link:hover {
			text-decoration: underline;
		}
		
		.party-badge {
			display: inline-block;
			padding: 0.25rem 0.75rem;
			border-radius: 12px;
			font-size: 0.85rem;
			font-weight: 600;
			margin-top: 0.5rem;
		}
		
		.party-badge.democrat {
			background: #3b82f6;
			color: white;
		}
		
		.party-badge.republican {
			background: #ef4444;
			color: white;
		}
		
		.party-badge.independent {
			background: #6b7280;
			color: white;
		}
		
		.stats {
			background: white;
			border-radius: 12px;
			padding: 1.5rem;
			margin-bottom: 2rem;
			box-shadow: 0 4px 6px rgba(0,0,0,0.1);
			display: grid;
			grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
			gap: 1rem;
		}
		
		.stat-item {
			text-align: center;
		}
		
		.stat-value {
			font-size: 2rem;
			font-weight: 700;
			color: #667eea;
		}
		
		.stat-label {
			color: #6b7280;
			font-size: 0.9rem;
			margin-top: 0.25rem;
		}
		
		@media (max-width: 768px) {
			.senators-grid {
				grid-template-columns: 1fr;
			}
		}
	</style>
</head>
<body>
	<div class="container">
		<header>
			<h1>Voter Politician Tool</h1>
			<p class="subtitle">US Senate Hub - Complete directory of all 100 United States Senators</p>
			<nav>
				<a href="/">← Back to Map</a>
				<a href="/house">House Hub</a>
			</nav>
			
			<div class="pdf-notice">
				<strong>📋 Official Senate Phone Directory:</strong> 
				<a href="https://www.senate.gov/general/resources/pdf/senators_phone_list.pdf" target="_blank">
					Download Senate Phone List (PDF)
				</a>
				<br>
				<small style="color: #6b7280; margin-top: 0.5rem; display: block;">
					Source: <a href="https://www.senate.gov" target="_blank" style="color: #3b82f6;">Senate.gov</a> - Published by the Senate Sergeant at Arms
				</small>
			</div>
		</header>
		
		<div class="stats">
			<div class="stat-item">
				<div class="stat-value">${senators.length}</div>
				<div class="stat-label">Total Senators</div>
			</div>
			<div class="stat-item">
				<div class="stat-value">${senators.filter(s => s.party === 'Democrat').length}</div>
				<div class="stat-label">Democrats</div>
			</div>
			<div class="stat-item">
				<div class="stat-value">${senators.filter(s => s.party === 'Republican').length}</div>
				<div class="stat-label">Republicans</div>
			</div>
			<div class="stat-item">
				<div class="stat-value">${senators.filter(s => s.party === 'Independent').length}</div>
				<div class="stat-label">Independents</div>
			</div>
		</div>
		
		<div class="senators-grid">
			${sortedStates.map(stateCode => {
				const stateSenators = senatorsByState[stateCode];
				return `
					<div class="state-section">
						<div class="state-header">${stateCode}</div>
						${stateSenators.map(senator => {
							const partyClass = senator.party?.toLowerCase() || 'independent';
							return `
								<div class="senator-card">
									<div class="senator-name">${escapeHtml(senator.name)}</div>
									<div class="senator-details">
										${senator.party ? `<span class="party-badge ${partyClass}">${escapeHtml(senator.party)}</span>` : ''}
										${senator.term_start && senator.term_end ? `
											<div><strong>Term:</strong> ${formatDate(senator.term_start)} - ${formatDate(senator.term_end)}</div>
										` : ''}
										${senator.office_phone ? `<div><strong>Phone:</strong> ${escapeHtml(senator.office_phone)}</div>` : ''}
										${senator.email ? `<div><strong>Email:</strong> ${escapeHtml(senator.email)}</div>` : ''}
										${senator.website ? `<div><strong>Website:</strong> <a href="${escapeHtml(senator.website)}" target="_blank" style="color: #667eea;">Visit</a></div>` : ''}
									</div>
									${senator.id ? `<a href="/representative/${senator.id}" class="senator-link">View Full Profile →</a>` : ''}
								</div>
							`;
						}).join('')}
					</div>
				`;
			}).join('')}
		</div>
	</div>
</body>
</html>
	`;
}

function escapeHtml(text: string | null | undefined): string {
	if (!text) return '';
	const map: { [key: string]: string } = {
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;',
		"'": '&#039;'
	};
	return text.toString().replace(/[&<>"']/g, m => map[m]);
}

function formatDate(dateString: string | null | undefined): string {
	if (!dateString) return '';
	try {
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
	} catch {
		return dateString;
	}
}
