import type { State, Representative, VoterData, VoterDemographic } from './types';

export function renderHomePage(states: State[]): string {
	return `
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<title>Voter Politician Tool</title>
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
			text-align: center;
		}
		
		nav {
			margin-top: 1rem;
			padding-top: 1rem;
			border-top: 1px solid #e5e7eb;
		}
		
		nav a {
			color: #667eea;
			text-decoration: none;
			margin: 0 0.5rem;
			font-weight: 500;
		}
		
		nav a:hover {
			text-decoration: underline;
		}

		.search-container {
			margin-top: 1rem;
			padding-top: 1rem;
			border-top: 1px solid #e5e7eb;
			display: flex;
			justify-content: center;
		}

		.search-bar {
			display: flex;
			gap: 0.5rem;
			max-width: 500px;
			width: 100%;
		}

		.search-input {
			flex: 1;
			padding: 0.75rem 1rem;
			border: 2px solid #e5e7eb;
			border-radius: 8px;
			font-size: 1rem;
			transition: border-color 0.2s;
		}

		.search-input:focus {
			outline: none;
			border-color: #667eea;
		}

		.search-btn {
			padding: 0.75rem 1.5rem;
			background: #667eea;
			color: white;
			border: none;
			border-radius: 8px;
			cursor: pointer;
			font-weight: 600;
			transition: background 0.2s;
		}

		.search-btn:hover {
			background: #5a67d8;
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
		}

		.map-container {
			background: white;
			border-radius: 12px;
			padding: 2rem;
			margin-bottom: 2rem;
			box-shadow: 0 4px 6px rgba(0,0,0,0.1);
			display: flex;
			flex-direction: column;
			align-items: center;
			position: relative;
		}
		
		.map-wrapper {
			width: 100%;
			max-width: 1000px;
			position: relative;
		}

		.map-legend {
			position: absolute;
			top: 10px;
			right: 10px;
			background: white;
			border-radius: 8px;
			padding: 1rem;
			box-shadow: 0 2px 8px rgba(0,0,0,0.15);
			border: 1px solid #e5e7eb;
			z-index: 10;
		}

		.legend-title {
			font-weight: 600;
			margin-bottom: 0.5rem;
			font-size: 0.9rem;
			color: #333;
		}

		.legend-item {
			display: flex;
			align-items: center;
			gap: 0.5rem;
			margin-bottom: 0.25rem;
			font-size: 0.85rem;
		}

		.legend-color {
			width: 16px;
			height: 16px;
			border-radius: 2px;
			border: 1px solid #ccc;
		}

		.legend-color.republican {
			background: #ff6b6b;
		}

		.legend-color.democrat {
			background: #74b9ff;
		}
		
		#us-map {
			width: 100%;
			height: auto;
			cursor: pointer;
		}
		
		.state-path {
			fill: #e5e7eb;
			stroke: #ffffff;
			stroke-width: 1.5;
			transition: all 0.3s ease;
			cursor: pointer;
		}
		
		.state-path.republican {
			fill: #ff6b6b; /* Vibrant pastel red for Republican states */
		}

		.state-path.democrat {
			fill: #74b9ff; /* Vibrant pastel blue for Democratic states */
		}

		.state-path.republican:hover {
			fill: #ff5252; /* Darker red on hover */
		}

		.state-path.democrat:hover {
			fill: #0984e3; /* Darker blue on hover */
		}
		
		.state-path:hover:not(.republican):not(.democrat) {
			fill: #667eea;
			stroke-width: 2;
		}
		
		.state-path.selected {
			fill: #764ba2;
			stroke-width: 2.5;
		}
		
		.state-path.has-data {
			/* Keep electoral colors even with voter data */
		}
		
		.state-path.has-data:hover {
			opacity: 0.8;
		}
		
		.state-info {
			position: absolute;
			background: rgba(0, 0, 0, 0.8);
			color: white;
			padding: 0.5rem 1rem;
			border-radius: 6px;
			pointer-events: none;
			display: none;
			font-size: 0.9rem;
			z-index: 1000;
		}
		
		.state-details {
			background: white;
			border-radius: 12px;
			padding: 2rem;
			box-shadow: 0 4px 6px rgba(0,0,0,0.1);
			display: none;
		}
		
		.state-details.active {
			display: block;
		}
		
		.state-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 2rem;
			padding-bottom: 1rem;
			border-bottom: 2px solid #e5e7eb;
		}
		
		.state-title {
			font-size: 2rem;
			font-weight: 700;
			color: #333;
		}
		
		.close-btn {
			background: #ef4444;
			color: white;
			border: none;
			padding: 0.5rem 1rem;
			border-radius: 8px;
			cursor: pointer;
			font-weight: 600;
			transition: background 0.2s;
		}
		
		.close-btn:hover {
			background: #dc2626;
		}
		
		.voter-data-section {
			margin-bottom: 2rem;
		}
		
		.section-title {
			font-size: 1.5rem;
			margin-bottom: 1rem;
			color: #333;
		}
		
		.data-grid {
			display: grid;
			grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
			gap: 1rem;
			margin-bottom: 1.5rem;
		}
		
		.data-card {
			background: #f9fafb;
			padding: 1rem;
			border-radius: 8px;
			border-left: 4px solid #667eea;
		}
		
		.data-label {
			font-size: 0.85rem;
			color: #666;
			text-transform: uppercase;
			letter-spacing: 0.5px;
			margin-bottom: 0.25rem;
		}
		
		.data-value {
			font-size: 1.5rem;
			font-weight: 700;
			color: #333;
		}
		
		.representatives-section {
			margin-top: 2rem;
		}
		
		.representatives-grid {
			display: grid;
			grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
			gap: 1.5rem;
		}
		
		.representative-card {
			background: #f9fafb;
			border-radius: 8px;
			padding: 1.5rem;
			border-left: 4px solid #667eea;
			transition: transform 0.2s, box-shadow 0.2s;
			cursor: pointer;
			text-decoration: none;
			color: inherit;
			display: block;
		}
		
		.representative-card:hover {
			transform: translateY(-4px);
			box-shadow: 0 8px 16px rgba(0,0,0,0.15);
		}
		
		.representative-name {
			font-size: 1.25rem;
			font-weight: 700;
			margin-bottom: 0.5rem;
			color: #333;
		}
		
		.representative-info {
			display: flex;
			flex-direction: column;
			gap: 0.5rem;
			margin-top: 0.5rem;
		}
		
		.info-item {
			font-size: 0.9rem;
			color: #666;
		}
		
		.badge {
			display: inline-block;
			padding: 0.25rem 0.75rem;
			border-radius: 20px;
			font-size: 0.85rem;
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
		
		.empty-state {
			text-align: center;
			padding: 3rem;
			color: #666;
		}
		
		.loading {
			text-align: center;
			padding: 2rem;
			color: #666;
		}

		@media (max-width: 768px) {
			.map-legend {
				position: static;
				margin-bottom: 1rem;
				align-self: flex-start;
			}

			.map-container {
				padding: 1rem;
			}
		}
		
		.chamber-tabs {
			display: flex;
			gap: 1rem;
			margin-bottom: 1.5rem;
		}
		
		.tab {
			padding: 0.75rem 1.5rem;
			background: #e5e7eb;
			border: none;
			border-radius: 8px;
			cursor: pointer;
			font-weight: 600;
			transition: all 0.2s;
		}
		
		.tab.active {
			background: #667eea;
			color: white;
		}
		
		.tab:hover:not(.active) {
			background: #d1d5db;
		}
	</style>
</head>
<body>
	<div class="container">
		<header>
			<h1>Voter Politician Tool</h1>
			<p class="subtitle">Click on any state to view representatives and voter information</p>
			<nav>
				<a href="/senators">Senate Hub</a>
				<a href="/house">House Hub</a>
				<a href="/election">Election Hub</a>
			</nav>
			<div class="search-container">
				<div class="search-bar">
					<input type="text" id="state-search" class="search-input" placeholder="Search for a state..." />
					<button class="search-btn" onclick="searchState()">Search</button>
				</div>
			</div>
		</header>
		
		<div class="map-container">
			<div class="map-wrapper">
				<svg id="us-map" viewBox="0 0 959 593" xmlns="http://www.w3.org/2000/svg">
					${generateUSMapSVG(states)}
				</svg>
				<div id="state-info" class="state-info"></div>
			</div>
		</div>
		
		<div id="state-details" class="state-details">
			<div class="state-header">
				<h2 id="state-title" class="state-title"></h2>
				<button class="close-btn" onclick="closeStateDetails()">✕ Close</button>
			</div>
			<div id="state-content"></div>
		</div>
	</div>
	
	<script>
		const stateData = ${JSON.stringify(states)};
		
		// Add click handlers to all state paths
		document.querySelectorAll('.state-path').forEach(path => {
			const stateCode = path.getAttribute('data-state');
			const state = stateData.find(s => s.code === stateCode);
			
			path.addEventListener('click', () => {
				loadStateDetails(stateCode);
			});
			
			path.addEventListener('mouseenter', (e) => {
				if (state) {
					showStateTooltip(e, state.name);
				}
			});
			
			path.addEventListener('mousemove', (e) => {
				if (state) {
					updateTooltipPosition(e);
				}
			});
			
			path.addEventListener('mouseleave', () => {
				hideStateTooltip();
			});
		});
		
		function showStateTooltip(e, stateName) {
			const tooltip = document.getElementById('state-info');
			const state = stateData.find(s => s.name === stateName);

			let tooltipText = stateName;
			if (state && state.electoral_winner) {
				const winner = state.electoral_winner;
				const votes = state.electoral_votes || 0;
				let marginText = '';
				if (state.electoral_margin) {
					marginText = ' (' + state.electoral_margin.toFixed(1) + '% margin)';
				}
				tooltipText = stateName + ': ' + winner + ' won ' + votes + ' electoral votes' + marginText;
			}

			tooltip.textContent = tooltipText;
			tooltip.style.display = 'block';
			updateTooltipPosition(e);
		}
		
		function updateTooltipPosition(e) {
			const tooltip = document.getElementById('state-info');
			const map = document.getElementById('us-map');
			const rect = map.getBoundingClientRect();
			tooltip.style.left = (e.clientX - rect.left + 10) + 'px';
			tooltip.style.top = (e.clientY - rect.top - 10) + 'px';
		}
		
		function hideStateTooltip() {
			document.getElementById('state-info').style.display = 'none';
		}
		
		async function loadStateDetails(stateCode) {
			const detailsDiv = document.getElementById('state-details');
			const titleDiv = document.getElementById('state-title');
			const contentDiv = document.getElementById('state-content');
			
			// Show loading state
			detailsDiv.classList.add('active');
			titleDiv.textContent = 'Loading...';
			contentDiv.innerHTML = '<div class="loading">Loading state information...</div>';
			
			// Scroll to details
			detailsDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
			
			try {
				const response = await fetch(\`/api/state/\${stateCode}\`);
				const data = await response.json();
				
				// Store data for chamber filtering
				window.currentStateData = data;
				
				titleDiv.textContent = data.state.name;
				contentDiv.innerHTML = renderStateContent(data);
			} catch (error) {
				contentDiv.innerHTML = \`<div class="empty-state"><p>Error loading state information: \${error.message}</p></div>\`;
			}
		}
		
		function renderStateContent(data) {
			let html = '';
			
			// Voter data section
			if (data.voterData) {
				html += \`
					<div class="voter-data-section">
						<h3 class="section-title">Voter Information</h3>
						<div class="data-grid">
							\${data.voterData.total_registered_voters ? \`
								<div class="data-card">
									<div class="data-label">Registered Voters</div>
									<div class="data-value">\${formatNumber(data.voterData.total_registered_voters)}</div>
								</div>
							\` : ''}
							\${data.voterData.voting_age_population ? \`
								<div class="data-card">
									<div class="data-label">Voting Age Population</div>
									<div class="data-value">\${formatNumber(data.voterData.voting_age_population)}</div>
								</div>
							\` : ''}
							\${data.voterData.total_voted && data.voterData.total_registered_voters ? \`
								<div class="data-card">
									<div class="data-label">Registered Voter Turnout</div>
									<div class="data-value">\${(((data.voterData.total_voted / data.voterData.total_registered_voters) * 100).toFixed(1))}%</div>
								</div>
							\` : ''}
							\${data.voterData.total_voted && data.voterData.voting_age_population ? \`
								<div class="data-card">
									<div class="data-label">Citizen Turnout (18+)</div>
									<div class="data-value">\${(((data.voterData.total_voted / data.voterData.voting_age_population) * 100).toFixed(1))}%</div>
								</div>
							\` : ''}
						</div>
					</div>
				\`;
			} else {
				html += \`
					<div class="voter-data-section">
						<h3 class="section-title">Voter Information</h3>
						<div class="empty-state">
							<p>Voter data not yet available for this state. Starting with Georgia!</p>
						</div>
					</div>
				\`;
			}
			
			// Representatives section
			if (data.representatives && data.representatives.length > 0) {
				html += \`
					<div class="representatives-section">
						<h3 class="section-title">Representatives</h3>
						<div class="chamber-tabs">
							<button class="tab active" onclick="showChamber('all')">All</button>
							<button class="tab" onclick="showChamber('house')">House</button>
							<button class="tab" onclick="showChamber('senate')">Senate</button>
						</div>
						<div id="representatives-grid" class="representatives-grid">
							\${renderRepresentatives(data.representatives, 'all')}
						</div>
					</div>
				\`;
			} else {
				html += \`
					<div class="representatives-section">
						<h3 class="section-title">Representatives</h3>
						<div class="empty-state">
							<p>No representatives found for this state.</p>
						</div>
					</div>
				\`;
			}
			
			return html;
		}
		
		function renderRepresentatives(reps, chamber) {
			const filtered = chamber === 'all' ? reps : reps.filter(r => r.chamber === chamber);
			
			if (filtered.length === 0) {
				return '<div class="empty-state"><p>No representatives found.</p></div>';
			}
			
			return filtered.map(rep => \`
				<a href="/representative/\${rep.id}" class="representative-card">
					<div class="representative-name">\${escapeHtml(rep.name)}</div>
					<div class="representative-info">
						<div class="info-item">
							<strong>Chamber:</strong> \${rep.chamber === 'house' ? 'House of Representatives' : 'Senate'}
						</div>
						\${rep.party ? \`
							<span class="badge badge-\${rep.party.toLowerCase()}">\${escapeHtml(rep.party)}</span>
						\` : ''}
					</div>
				</a>
			\`).join('');
		}
		
		function showChamber(chamber) {
			document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
			event.target.classList.add('active');
			
			const data = window.currentStateData;
			if (data && data.representatives) {
				document.getElementById('representatives-grid').innerHTML = renderRepresentatives(data.representatives, chamber);
			}
		}
		
		function closeStateDetails() {
			document.getElementById('state-details').classList.remove('active');
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

		function searchState() {
			const searchInput = document.getElementById('state-search');
			const query = searchInput.value.trim().toLowerCase();
			if (!query) return;

			// Find matching state
			const state = stateData.find(s =>
				s.name.toLowerCase().includes(query) ||
				s.code.toLowerCase() === query
			);

			if (state) {
				loadStateDetails(state.code);
				// Highlight the state on the map
				document.querySelectorAll('.state-path').forEach(path => {
					path.classList.remove('selected');
				});
				const statePath = document.querySelector(`[data-state="${state.code}"]`);
				if (statePath) {
					statePath.classList.add('selected');
				}
			} else {
				alert('State not found. Please try again.');
			}
		}

		// Add Enter key support for search
		document.getElementById('state-search').addEventListener('keypress', function(e) {
			if (e.key === 'Enter') {
				searchState();
			}
		});
	</script>
</body>
</html>
	`;
}

function generateUSMapSVG(states: State[]): string {
	// US Map SVG with approximate state positions
	// For production, consider using a proper SVG map library like D3.js or a pre-made SVG
	// This is a simplified but functional version with better positioning
	
	// State coordinates (x, y, width, height) for a 959x593 viewBox
	const stateCoords: Record<string, { x: number; y: number; w: number; h: number }> = {
		'AL': { x: 600, y: 380, w: 80, h: 100 },
		'AK': { x: 50, y: 300, w: 150, h: 200 },
		'AZ': { x: 180, y: 320, w: 120, h: 120 },
		'AR': { x: 520, y: 340, w: 80, h: 80 },
		'CA': { x: 50, y: 250, w: 100, h: 180 },
		'CO': { x: 350, y: 280, w: 100, h: 100 },
		'CT': { x: 780, y: 220, w: 50, h: 50 },
		'DE': { x: 760, y: 280, w: 30, h: 30 },
		'FL': { x: 680, y: 420, w: 120, h: 100 },
		'GA': { x: 640, y: 360, w: 80, h: 100 },
		'HI': { x: 250, y: 420, w: 80, h: 60 },
		'ID': { x: 200, y: 180, w: 100, h: 120 },
		'IL': { x: 540, y: 240, w: 80, h: 80 },
		'IN': { x: 580, y: 240, w: 60, h: 80 },
		'IA': { x: 480, y: 220, w: 80, h: 80 },
		'KS': { x: 420, y: 300, w: 100, h: 80 },
		'KY': { x: 600, y: 300, w: 80, h: 80 },
		'LA': { x: 500, y: 400, w: 100, h: 80 },
		'ME': { x: 800, y: 120, w: 80, h: 100 },
		'MD': { x: 740, y: 280, w: 50, h: 50 },
		'MA': { x: 780, y: 200, w: 60, h: 50 },
		'MI': { x: 580, y: 180, w: 100, h: 100 },
		'MN': { x: 460, y: 160, w: 100, h: 100 },
		'MS': { x: 560, y: 380, w: 80, h: 100 },
		'MO': { x: 480, y: 300, w: 100, h: 80 },
		'MT': { x: 250, y: 140, w: 150, h: 120 },
		'NE': { x: 420, y: 240, w: 100, h: 80 },
		'NV': { x: 150, y: 280, w: 80, h: 100 },
		'NH': { x: 780, y: 160, w: 50, h: 50 },
		'NJ': { x: 750, y: 250, w: 50, h: 50 },
		'NM': { x: 320, y: 340, w: 120, h: 100 },
		'NY': { x: 720, y: 200, w: 80, h: 100 },
		'NC': { x: 700, y: 320, w: 80, h: 100 },
		'ND': { x: 400, y: 140, w: 100, h: 80 },
		'OH': { x: 620, y: 240, w: 80, h: 80 },
		'OK': { x: 420, y: 360, w: 100, h: 80 },
		'OR': { x: 100, y: 180, w: 100, h: 120 },
		'PA': { x: 700, y: 220, w: 80, h: 80 },
		'RI': { x: 780, y: 230, w: 30, h: 30 },
		'SC': { x: 680, y: 360, w: 60, h: 80 },
		'SD': { x: 400, y: 220, w: 100, h: 80 },
		'TN': { x: 580, y: 320, w: 100, h: 80 },
		'TX': { x: 380, y: 380, w: 140, h: 120 },
		'UT': { x: 250, y: 280, w: 80, h: 80 },
		'VT': { x: 750, y: 160, w: 50, h: 50 },
		'VA': { x: 700, y: 280, w: 80, h: 80 },
		'WA': { x: 100, y: 120, w: 100, h: 100 },
		'WV': { x: 640, y: 280, w: 60, h: 60 },
		'WI': { x: 520, y: 180, w: 80, h: 80 },
		'WY': { x: 300, y: 240, w: 100, h: 100 },
		'DC': { x: 730, y: 290, w: 20, h: 20 }
	};
	
	const stateCodes = states.map(s => s.code);
	
	return stateCodes.map(code => {
		const state = states.find(s => s.code === code);
		const coords = stateCoords[code];
		if (!coords) return '';
		
		const hasData = state?.voter_data_available ? 'has-data' : '';
		// Add electoral color class based on winner
		let electoralClass = '';
		if (state?.electoral_winner === 'Republican') {
			electoralClass = 'republican';
		} else if (state?.electoral_winner === 'Democrat') {
			electoralClass = 'democrat';
		}
		
		// Create a rounded rectangle for each state
		const path = `M ${coords.x} ${coords.y} L ${coords.x + coords.w} ${coords.y} L ${coords.x + coords.w} ${coords.y + coords.h} L ${coords.x} ${coords.y + coords.h} Z`;
		
		return `<path class="state-path ${electoralClass} ${hasData}" data-state="${code}" d="${path}" />`;
	}).join('\n');
}
