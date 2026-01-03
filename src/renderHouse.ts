import type { Representative } from './types';

export function renderHouseHub(houseMembers: Representative[]): string {
	// Group house members by state
	const membersByState: { [key: string]: Representative[] } = {};
	houseMembers.forEach(member => {
		if (!membersByState[member.state_code]) {
			membersByState[member.state_code] = [];
		}
		membersByState[member.state_code].push(member);
	});

	// Sort states alphabetically
	const sortedStates = Object.keys(membersByState).sort();

	return `
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<title>US House Hub - All Representatives</title>
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
		
		.members-grid {
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
			max-height: 500px;
			overflow-y: auto;
			display: flex;
			flex-direction: column;
		}
		
		.state-header {
			font-size: 1.5rem;
			font-weight: 700;
			margin-bottom: 1rem;
			color: #667eea;
			border-bottom: 2px solid #e5e7eb;
			padding-bottom: 0.5rem;
			display: flex;
			align-items: center;
			gap: 1rem;
			flex-shrink: 0;
		}
		
		.state-header .party-counts {
			display: flex;
			gap: 0.75rem;
			font-size: 1rem;
			font-weight: 600;
		}
		
		.state-header .party-counts .republican-count {
			color: #ef4444;
		}
		
		.state-header .party-counts .democrat-count {
			color: #3b82f6;
		}
		
		.state-header .party-counts .independent-count {
			color: #6b7280;
		}
		
		.members-container {
			flex: 1;
			overflow-y: auto;
		}
		
		.member-card {
			background: #f9fafb;
			border-radius: 8px;
			padding: 1rem;
			margin-bottom: 1rem;
			border-left: 4px solid #667eea;
		}
		
		.member-card:last-child {
			margin-bottom: 0;
		}
		
		.member-name {
			font-size: 1.2rem;
			font-weight: 600;
			margin-bottom: 0.5rem;
			color: #1f2937;
		}
		
		.member-details {
			display: flex;
			flex-direction: column;
			gap: 0.25rem;
			font-size: 0.9rem;
			color: #6b7280;
		}
		
		.member-details strong {
			color: #374151;
		}
		
		.member-link {
			display: inline-block;
			margin-top: 0.5rem;
			color: #667eea;
			text-decoration: none;
			font-weight: 500;
		}
		
		.member-link:hover {
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
			.members-grid {
				grid-template-columns: 1fr;
			}
		}
	</style>
</head>
<body>
	<div class="container">
		<header>
			<h1>Voter Politician Tool</h1>
			<p class="subtitle">US House Hub - Complete directory of all 435+ United States Representatives</p>
			
			<nav>
				<a href="/">← Back to Map</a>
				<a href="/issues">Issues Hub</a>
				<a href="/senators">Senate Hub</a>
				<a href="/election">Election Hub</a>
			</nav>
		</header>
		
		<div class="stats">
			<div class="stat-item">
				<div class="stat-value">${houseMembers.length}</div>
				<div class="stat-label">Total Representatives</div>
			</div>
			<div class="stat-item">
				<div class="stat-value">${houseMembers.filter(m => m.party === 'Democrat').length}</div>
				<div class="stat-label">Democrats</div>
			</div>
			<div class="stat-item">
				<div class="stat-value">${houseMembers.filter(m => m.party === 'Republican').length}</div>
				<div class="stat-label">Republicans</div>
			</div>
			<div class="stat-item">
				<div class="stat-value">${houseMembers.filter(m => m.party === 'Independent').length}</div>
				<div class="stat-label">Independents</div>
			</div>
		</div>
		
		<div class="members-grid">
			${sortedStates.map(stateCode => {
				const stateMembers = membersByState[stateCode];
				const republicanCount = stateMembers.filter(m => m.party === 'Republican').length;
				const democratCount = stateMembers.filter(m => m.party === 'Democrat').length;
				const independentCount = stateMembers.filter(m => m.party === 'Independent').length;
				return `
					<div class="state-section">
						<div class="state-header">
							<span>${stateCode}</span>
							<div class="party-counts">
								<span class="republican-count">R ${republicanCount}</span>
								<span class="democrat-count">D ${democratCount}</span>
								${independentCount > 0 ? `<span class="independent-count">Ind. ${independentCount}</span>` : ''}
							</div>
						</div>
						<div class="members-container">
						${stateMembers.map(member => {
							const partyClass = member.party?.toLowerCase() || 'independent';
							return `
								<div class="member-card">
									<div class="member-name">${escapeHtml(member.name)}</div>
									<div class="member-details">
										${member.party ? `<span class="party-badge ${partyClass}">${escapeHtml(member.party)}</span>` : ''}
										${member.office_phone ? `<div><strong>Phone:</strong> ${escapeHtml(member.office_phone)}</div>` : ''}
										${member.office_address ? `<div><strong>Office:</strong> ${escapeHtml(member.office_address)}</div>` : ''}
										${member.email ? `<div><strong>Email:</strong> ${escapeHtml(member.email)}</div>` : ''}
										${member.website ? `<div><strong>Website:</strong> <a href="${escapeHtml(member.website)}" target="_blank" style="color: #667eea;">Visit</a></div>` : ''}
									</div>
									${member.id ? `<a href="/representative/${member.id}" class="member-link">View Full Profile →</a>` : ''}
								</div>
							`;
						}).join('')}
						</div>
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
