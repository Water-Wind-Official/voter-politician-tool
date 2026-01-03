import { getAllStates } from "./db";

export function renderElectionHub(states: any[]): string {
	return `
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<title>Election Hub - Voter Politician Tool</title>
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
			max-width: 1200px;
			margin: 0 auto;
		}

		header {
			text-align: center;
			margin-bottom: 3rem;
		}

		.title {
			font-size: 2.5rem;
			font-weight: 700;
			color: white;
			margin-bottom: 0.5rem;
			text-shadow: 0 2px 4px rgba(0,0,0,0.3);
		}

		.subtitle {
			color: rgba(255, 255, 255, 0.9);
			font-size: 1.1rem;
			margin-bottom: 2rem;
		}

		nav {
			display: flex;
			justify-content: center;
			gap: 2rem;
			margin-bottom: 2rem;
		}

		nav a {
			color: white;
			text-decoration: none;
			font-weight: 600;
			padding: 0.75rem 1.5rem;
			background: rgba(255, 255, 255, 0.1);
			border-radius: 8px;
			transition: all 0.3s ease;
		}

		nav a:hover {
			background: rgba(255, 255, 255, 0.2);
			transform: translateY(-2px);
		}

		.card {
			background: white;
			border-radius: 12px;
			padding: 2rem;
			margin-bottom: 2rem;
			box-shadow: 0 4px 6px rgba(0,0,0,0.1);
		}

		.card-title {
			font-size: 1.5rem;
			font-weight: 700;
			color: #333;
			margin-bottom: 1rem;
		}

		.election-results {
			display: grid;
			grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
			gap: 2rem;
			margin-top: 2rem;
		}

		.result-card {
			background: #f8fafc;
			border-radius: 8px;
			padding: 1.5rem;
			border-left: 4px solid #667eea;
		}

		.result-title {
			font-size: 1.2rem;
			font-weight: 600;
			margin-bottom: 1rem;
			color: #1f2937;
		}

		.result-meta {
			margin-bottom: 1rem;
			color: #6b7280;
			font-size: 0.9rem;
		}

		.download-btn {
			display: inline-block;
			background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
			color: white;
			text-decoration: none;
			padding: 1rem 2rem;
			border-radius: 8px;
			font-weight: 600;
			transition: transform 0.2s;
			margin-top: 1rem;
		}

		.download-btn:hover {
			transform: translateY(-2px);
			box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
		}

		.state-grid {
			display: grid;
			grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
			gap: 1rem;
			margin-top: 2rem;
		}

		.state-item {
			background: #f8fafc;
			padding: 1rem;
			border-radius: 6px;
			border-left: 3px solid #e5e7eb;
			font-size: 0.9rem;
		}

		.state-item.republican {
			border-left-color: #fecaca;
		}

		.state-item.democrat {
			border-left-color: #bfdbfe;
		}

		.state-name {
			font-weight: 600;
			margin-bottom: 0.25rem;
		}

		.state-details {
			color: #6b7280;
			font-size: 0.8rem;
		}

		.electoral-table {
			width: 100%;
			border-collapse: collapse;
			font-size: 0.9rem;
		}

		.electoral-table th,
		.electoral-table td {
			padding: 0.75rem;
			text-align: left;
			border-bottom: 1px solid #e5e7eb;
		}

		.electoral-table th {
			background: #f9fafb;
			font-weight: 600;
			color: #333;
		}

		.electoral-table tr:hover {
			background: #f9fafb;
		}

		.electoral-table .votes-democrat {
			color: #3b82f6;
			font-weight: 600;
		}

		.electoral-table .votes-republican {
			color: #dc2626;
			font-weight: 600;
		}

		.electoral-table .winner-democrat {
			background: rgba(59, 130, 246, 0.1);
		}

		.electoral-table .winner-republican {
			background: rgba(220, 38, 38, 0.1);
		}

		.stats-grid {
			display: grid;
			grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
			gap: 1.5rem;
			margin-top: 2rem;
		}

		.stat-card {
			background: #f8fafc;
			padding: 1.5rem;
			border-radius: 8px;
			text-align: center;
		}

		.stat-value {
			font-size: 2rem;
			font-weight: 700;
			color: #667eea;
			margin-bottom: 0.5rem;
		}

		.stat-label {
			color: #6b7280;
			font-size: 0.9rem;
		}

		.popular-vote-section {
			margin-bottom: 2rem;
		}

		.popular-vote-grid {
			display: grid;
			grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
			gap: 2rem;
			margin-top: 1rem;
		}

		.popular-vote-card {
			background: #f8fafc;
			border-radius: 12px;
			padding: 1.5rem;
			border: 2px solid #e5e7eb;
			transition: transform 0.2s;
		}

		.popular-vote-card:hover {
			transform: translateY(-2px);
			box-shadow: 0 4px 12px rgba(0,0,0,0.1);
		}

		.popular-vote-card.trump {
			border-color: #fecaca;
			background: linear-gradient(135deg, #fecaca 0%, #ffffff 100%);
		}

		.popular-vote-card.harris {
			border-color: #bfdbfe;
			background: linear-gradient(135deg, #bfdbfe 0%, #ffffff 100%);
		}

		.candidate-name {
			font-size: 1.2rem;
			font-weight: 700;
			color: #333;
			margin-bottom: 0.5rem;
		}

		.popular-votes {
			font-size: 1.1rem;
			font-weight: 600;
			color: #1f2937;
			margin-bottom: 0.25rem;
		}

		.popular-percentage {
			font-size: 1rem;
			color: #6b7280;
			margin-bottom: 0.25rem;
		}

		.popular-margin {
			font-size: 0.9rem;
			color: #374151;
			font-weight: 500;
		}

		.electoral-section {
			border-top: 2px solid #e5e7eb;
			padding-top: 2rem;
		}

		@media (max-width: 768px) {
			nav {
				flex-direction: column;
				align-items: center;
			}

			.title {
				font-size: 2rem;
			}

			.election-results {
				grid-template-columns: 1fr;
			}

			.popular-vote-grid {
				grid-template-columns: 1fr;
			}

			.popular-vote-card {
				text-align: center;
			}
		}
	</style>
</head>
<body>
	<div class="container">
		<header>
			<h1 class="title">Voter Politician Tool</h1>
			<p class="subtitle">Presidential Election Results & Data Hub</p>
			<nav>
				<a href="/">State Map</a>
				<a href="/senators">Senate Hub</a>
				<a href="/house">House Hub</a>
			</nav>
		</header>

		<div class="card">
			<h2 class="card-title">🗳️ 2024 Presidential Election Results</h2>
			<p style="color: #6b7280; margin-bottom: 1rem;">
				Official results from the Federal Election Commission (FEC) as reported by state election offices.
			</p>

			<!-- Popular Vote Results -->
			<div class="popular-vote-section">
				<h3 style="color: #333; margin-bottom: 1rem; font-size: 1.3rem;">Popular Vote Results</h3>
				<div class="popular-vote-grid">
					<div class="popular-vote-card trump">
						<div class="candidate-name">Donald J. Trump (R)</div>
						<div class="popular-votes">~77 million votes</div>
						<div class="popular-percentage">~50.9%</div>
						<div class="popular-margin">Winner by ~6.6 million votes</div>
					</div>
					<div class="popular-vote-card harris">
						<div class="candidate-name">Kamala Harris (D)</div>
						<div class="popular-votes">~70.4 million votes</div>
						<div class="popular-percentage">~46.5%</div>
						<div class="popular-margin">Margin: ~4.4%</div>
					</div>
				</div>
			</div>

			<!-- Electoral College Results -->
			<div class="electoral-section">
				<h3 style="color: #333; margin: 2rem 0 1rem 0; font-size: 1.3rem;">Electoral College Results</h3>
				<div class="stats-grid">
					<div class="stat-card">
						<div class="stat-value">312</div>
						<div class="stat-label">Electoral Votes for Trump (R)</div>
					</div>
					<div class="stat-card">
						<div class="stat-value">226</div>
						<div class="stat-label">Electoral Votes for Harris (D)</div>
					</div>
					<div class="stat-card">
						<div class="stat-value">270</div>
						<div class="stat-label">Electoral Votes Needed to Win</div>
					</div>
					<div class="stat-card">
						<div class="stat-value">538</div>
						<div class="stat-label">Total Electoral Votes</div>
					</div>
				</div>
			</div>


			<div style="text-align: center; margin-top: 2rem;">
				<a href="https://www.fec.gov/resources/cms-content/documents/2024presgeresults.pdf" class="download-btn" target="_blank">
					📄 Download Official FEC Results PDF
				</a>
			</div>

			<div style="background: #f0f9ff; border-left: 4px solid #3b82f6; padding: 1rem; margin-top: 2rem; border-radius: 4px;">
				<p style="margin: 0; font-size: 0.9rem; color: #1e40af;">
					<strong>📋 Source:</strong>
					<a href="https://www.fec.gov/resources/cms-content/documents/2024presgeresults.pdf" target="_blank" style="color: #3b82f6; text-decoration: underline;">
						https://www.fec.gov/resources/cms-content/documents/2024presgeresults.pdf
					</a>
					<br><br>
					This PDF contains the official 2024 presidential election results as certified by state election offices and compiled by the Federal Election Commission.
				</p>
			</div>

		</div>

		<div class="card">
			<h2 class="card-title">📊 State-by-State Electoral Vote Results</h2>
			<div style="overflow-x: auto;">
				<table class="electoral-table">
					<thead>
						<tr>
							<th>State</th>
							<th>Electoral Votes</th>
							<th>Harris (D)</th>
							<th>Trump (R)</th>
							<th>Winner</th>
							<th>Margin (%)</th>
						</tr>
					</thead>
					<tbody>
						${getElectoralVoteBreakdown(states)}
					</tbody>
				</table>
			</div>
		</div>

		<div class="card">
			<h2 class="card-title">📈 Key Election Statistics</h2>
			<div class="election-results">
				<div class="result-card">
					<div class="result-title">Popular Vote Summary</div>
					<div class="result-meta">Based on official FEC data</div>
					<ul style="list-style: none; padding: 0;">
						<li><strong>Donald J. Trump (R):</strong> ~77 million votes</li>
						<li><strong>Kamala Harris (D):</strong> ~74 million votes</li>
						<li><strong>Other Candidates:</strong> ~2 million votes</li>
					</ul>
				</div>

				<div class="result-card">
					<div class="result-title">Electoral Vote Distribution</div>
					<div class="result-meta">270 votes needed to win</div>
					<ul style="list-style: none; padding: 0;">
						<li><strong>Republican States:</strong> 312 electoral votes</li>
						<li><strong>Democratic States:</strong> 226 electoral votes</li>
						<li><strong>Swing States:</strong> Varies by election</li>
					</ul>
				</div>

				<div class="result-card">
					<div class="result-title">State Results Overview</div>
					<div class="result-meta">2024 Presidential Election</div>
					<ul style="list-style: none; padding: 0;">
						<li><strong>Republican Wins:</strong> 26 states</li>
						<li><strong>Democratic Wins:</strong> 24 states + DC</li>
						<li><strong>Split Electoral Votes:</strong> ME, NE</li>
					</ul>
				</div>
			</div>
		</div>
	</div>
</body>
</html>`;
}

function getElectoralVoteBreakdown(states: any[]): string {
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

	return states.map(state => {
		const data = electoralData[state.code] || { total: 0, harris: 0, trump: 0 };
		const winner = data.harris > data.trump ? 'Democrat' : data.trump > data.harris ? 'Republican' : 'Split';
		const rowClass = winner === 'Democrat' ? 'winner-democrat' : winner === 'Republican' ? 'winner-republican' : '';

		return `
			<tr class="${rowClass}">
				<td><strong>${state.name}</strong> (${state.code})</td>
				<td>${data.total}</td>
				<td class="votes-democrat">${data.harris > 0 ? data.harris : '-'}</td>
				<td class="votes-republican">${data.trump > 0 ? data.trump : '-'}</td>
				<td>${winner}</td>
				<td>${data.margin ? data.margin.toFixed(1) + '%' : '-'}</td>
			</tr>
		`;
	}).join('');
}