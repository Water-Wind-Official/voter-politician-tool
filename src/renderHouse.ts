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
			background:
				radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
				radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.15) 0%, transparent 50%),
				radial-gradient(circle at 40% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
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
			max-width: 1400px;
			margin: 0 auto;
		}
		
		header {
			background: linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(51, 65, 85, 0.95) 100%);
			backdrop-filter: blur(20px);
			border: 1px solid rgba(148, 163, 184, 0.2);
			border-radius: 16px;
			padding: 2.5rem;
			margin-bottom: 2rem;
			box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(148, 163, 184, 0.1);
			position: relative;
		}

		header::before {
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
		
		h1 {
			font-size: 2.5rem;
			margin-bottom: 0.5rem;
			color: #ffffff;
			font-weight: 800;
			letter-spacing: -0.025em;
			position: relative;
			z-index: 1;
		}
		
		.subtitle {
			color: #cbd5e1;
			font-size: 1.1rem;
			margin-bottom: 1rem;
			opacity: 0.9;
			position: relative;
			z-index: 1;
		}

		nav {
			margin-top: 1.5rem;
			padding-top: 1.5rem;
			border-top: 1px solid rgba(148, 163, 184, 0.3);
			position: relative;
			z-index: 1;
		}

		nav a {
			color: #93c5fd;
			text-decoration: none;
			margin-right: 1rem;
			font-weight: 600;
			padding: 0.5rem 1rem;
			border-radius: 8px;
			transition: all 0.3s ease;
			border: 1px solid transparent;
		}

		nav a:hover {
			background: rgba(59, 130, 246, 0.2);
			border-color: rgba(59, 130, 246, 0.5);
			color: #dbeafe;
			transform: translateY(-1px);
		}
		
		.members-grid {
			display: grid;
			grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
			gap: 1.5rem;
			margin-bottom: 2rem;
		}
		
		.state-section {
			background: linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(51, 65, 85, 0.9) 100%);
			backdrop-filter: blur(20px);
			border: 1px solid rgba(148, 163, 184, 0.2);
			border-radius: 16px;
			padding: 1.5rem;
			box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(148, 163, 184, 0.1);
			max-height: 500px;
			overflow-y: auto;
			display: flex;
			flex-direction: column;
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
		
		.state-header {
			font-size: 1.5rem;
			font-weight: 700;
			margin-bottom: 1rem;
			color: #60a5fa;
			border-bottom: 2px solid rgba(148, 163, 184, 0.3);
			padding-bottom: 0.5rem;
			display: flex;
			align-items: center;
			gap: 1rem;
			flex-shrink: 0;
			position: relative;
			z-index: 1;
			text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
		}
		
		.state-party-icon {
			width: 32px;
			height: 32px;
			flex-shrink: 0;
		}

		.state-party-icon.donkey-icon {
			filter: drop-shadow(0 0 8px rgba(59, 130, 246, 0.4));
		}

		.state-party-icon.elephant-icon {
			filter: drop-shadow(0 0 8px rgba(239, 68, 68, 0.4));
		}

		.state-header .party-counts {
			display: flex;
			align-items: center;
			gap: 0.5rem;
			font-size: 1.2rem;
			font-weight: 700;
		}

		.loser-count, .winner-count {
			min-width: 1.2em;
			text-align: center;
		}

		.state-header .party-counts .independent-count {
			color: #94a3b8;
			font-size: 0.9rem;
			margin-left: 0.5rem;
		}
		
		.members-container {
			flex: 1;
			overflow-y: auto;
		}
		
		.member-card {
			background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
			backdrop-filter: blur(10px);
			border: 1px solid rgba(148, 163, 184, 0.2);
			border-radius: 12px;
			padding: 1rem;
			margin-bottom: 1rem;
			border-left: 4px solid #60a5fa;
			transition: all 0.3s ease;
			box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
			position: relative;
			z-index: 1;
		}

		
		.member-card:last-child {
			margin-bottom: 0;
		}

		.party-icon {
			position: absolute;
			top: 1rem;
			right: 1rem;
			width: 40px;
			height: 40px;
			animation: bounce 2s infinite;
		}

		.donkey-icon {
			filter: drop-shadow(0 0 10px rgba(59, 130, 246, 0.5));
		}

		.elephant-icon {
			filter: drop-shadow(0 0 10px rgba(239, 68, 68, 0.5));
		}
		
		.member-name {
			font-size: 1.2rem;
			font-weight: 600;
			margin-bottom: 0.5rem;
			color: #f1f5f9;
		}

		.member-details {
			display: flex;
			flex-direction: column;
			gap: 0.25rem;
			font-size: 0.9rem;
			color: #cbd5e1;
		}

		.member-details strong {
			color: #f1f5f9;
		}
		
		.member-card-link {
			text-decoration: none;
			color: inherit;
			display: block;
			transition: all 0.3s ease;
			cursor: pointer;
		}

		.member-card-link:hover .member-card {
			transform: translateY(-4px);
			box-shadow: 0 12px 30px rgba(0, 0, 0, 0.3);
			border-color: rgba(59, 130, 246, 0.5);
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
			background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
			color: white;
			box-shadow: 0 0 10px rgba(59, 130, 246, 0.3);
		}

		.party-badge.republican {
			background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
			color: white;
			box-shadow: 0 0 10px rgba(239, 68, 68, 0.3);
		}

		.party-badge.independent {
			background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
			color: white;
			box-shadow: 0 0 10px rgba(107, 114, 128, 0.3);
		}
		
		.stats {
			background: linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(51, 65, 85, 0.9) 100%);
			backdrop-filter: blur(20px);
			border: 1px solid rgba(148, 163, 184, 0.2);
			border-radius: 16px;
			padding: 1.5rem;
			margin-bottom: 2rem;
			box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(148, 163, 184, 0.1);
			display: grid;
			grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
			gap: 1rem;
			position: relative;
		}

		.stats::before {
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

		.stat-item {
			text-align: center;
			position: relative;
			z-index: 1;
		}

		.stat-value {
			font-size: 2rem;
			font-weight: 700;
			color: #60a5fa;
		}

		.stat-label {
			color: #cbd5e1;
			font-size: 0.9rem;
			margin-top: 0.25rem;
			opacity: 0.9;
		}
		
		@media (max-width: 768px) {
			.members-grid {
				grid-template-columns: 1fr;
			}
		}

		@keyframes bounce {
			0%, 20%, 50%, 80%, 100% {
				transform: translateY(0);
			}
			40% {
				transform: translateY(-10px);
			}
			60% {
				transform: translateY(-5px);
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

				// Determine winning party and create display format
				let winnerIcon = '';
				let loserCount = '';
				let winnerCount = '';
				let loserColor = '';
				let winnerColor = '';

				if (republicanCount > democratCount) {
					// Republicans win
					winnerIcon = '<img class="state-party-icon elephant-icon" src="https://content.mycutegraphics.com/graphics/animal/cute-elephant.png" alt="Republican" />';
					loserCount = democratCount.toString();
					winnerCount = republicanCount.toString();
					loserColor = '#60a5fa'; // blue for democrats (losers)
					winnerColor = '#f87171'; // red for republicans (winners)
				} else if (democratCount > republicanCount) {
					// Democrats win
					winnerIcon = '<img class="state-party-icon donkey-icon" src="https://content.mycutegraphics.com/graphics/animal/horse-head.png" alt="Democrat" />';
					loserCount = republicanCount.toString();
					winnerCount = democratCount.toString();
					loserColor = '#f87171'; // red for republicans (losers)
					winnerColor = '#60a5fa'; // blue for democrats (winners)
				} else {
					// Tie or independents only
					winnerIcon = '';
					loserCount = republicanCount.toString();
					winnerCount = democratCount.toString();
					loserColor = '#f87171';
					winnerColor = '#60a5fa';
				}

				return `
					<div class="state-section">
						<div class="state-header">
							<span>${stateCode}</span>
							<div class="party-counts">
								<span class="loser-count" style="color: ${loserColor}">${loserCount}</span>
								${winnerIcon}
								<span class="winner-count" style="color: ${winnerColor}">${winnerCount}</span>
								${independentCount > 0 ? `<span class="independent-count">(Ind. ${independentCount})</span>` : ''}
							</div>
						</div>
						<div class="members-container">
						${stateMembers.map(member => {
							const partyClass = member.party?.toLowerCase() || 'independent';
							const cardContent = `
								<div class="member-name">${escapeHtml(member.name)}</div>
								<div class="member-details">
									${member.party ? `<span class="party-badge ${partyClass}">${escapeHtml(member.party)}</span>` : ''}
									${member.office_phone ? `<div><strong>Phone:</strong> ${escapeHtml(member.office_phone)}</div>` : ''}
									${member.office_address ? `<div><strong>Office:</strong> ${escapeHtml(member.office_address)}</div>` : ''}
									${member.email ? `<div><strong>Email:</strong> ${escapeHtml(member.email)}</div>` : ''}
									${member.website ? `<div><strong>Website:</strong> <a href="${escapeHtml(member.website)}" target="_blank" style="color: #667eea;">Visit</a></div>` : ''}
								</div>
							`;

							if (member.id) {
								return `
									<a href="/representative/${member.id}" class="member-card-link">
										<div class="member-card">
											${cardContent}
										</div>
									</a>
								`;
							} else {
								return `
									<div class="member-card">
										${cardContent}
									</div>
								`;
							}
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

function renderPartyIcon(party: string | null): string {
	if (!party) return '';

	const normalizedParty = party.toLowerCase();
	if (normalizedParty === 'democrat') {
		return `<img class="party-icon donkey-icon" src="https://content.mycutegraphics.com/graphics/animal/horse-head.png" alt="Donkey" />`;
	} else if (normalizedParty === 'republican') {
		return `<img class="party-icon elephant-icon" src="https://content.mycutegraphics.com/graphics/animal/cute-elephant.png" alt="Elephant" />`;
	}
	return '';
}
