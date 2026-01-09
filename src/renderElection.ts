import type { State } from './types';

export function renderElectionHub(states: State[]): string {
	// Electoral data for 2024 election
	const electoralData: { [key: string]: { total: number; harris: number; trump: number; margin: number } } = {
		'AL': { total: 9, harris: 0, trump: 9, margin: 25.4 },
		'AK': { total: 3, harris: 0, trump: 3, margin: 32.6 },
		'AZ': { total: 11, harris: 0, trump: 11, margin: 5.5 },
		'AR': { total: 6, harris: 0, trump: 6, margin: 27.8 },
		'CA': { total: 54, harris: 54, trump: 0, margin: 29.0 },
		'CO': { total: 10, harris: 10, trump: 0, margin: 13.5 },
		'CT': { total: 7, harris: 7, trump: 0, margin: 21.2 },
		'DE': { total: 3, harris: 3, trump: 0, margin: 18.7 },
		'DC': { total: 3, harris: 3, trump: 0, margin: 85.6 },
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

	// Calculate electoral summary
	const republicanVotes = Object.values(electoralData).reduce((sum, data) => sum + data.trump, 0);
	const democratVotes = Object.values(electoralData).reduce((sum, data) => sum + data.harris, 0);
	const totalVotes = republicanVotes + democratVotes;

	// Sort states by name
	const sortedStates = states.sort((a, b) => a.name.localeCompare(b.name));

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
			text-align: center;
			position: relative;
		}

		header::before {
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			background: linear-gradient(135deg, rgba(120, 119, 198, 0.1) 0%, rgba(120, 119, 198, 0.05) 100%);
			border-radius: 16px;
		}

		h1 {
			font-size: 3rem;
			font-weight: 700;
			background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 50%, #cbd5e1 100%);
			-webkit-background-clip: text;
			-webkit-text-fill-color: transparent;
			background-clip: text;
			margin-bottom: 1rem;
			position: relative;
			z-index: 1;
		}

		.subtitle {
			font-size: 1.25rem;
			color: #94a3b8;
			margin-bottom: 2rem;
			position: relative;
			z-index: 1;
		}

		.electoral-summary {
			display: grid;
			grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
			gap: 1.5rem;
			margin-bottom: 3rem;
		}

		.summary-card {
			background: linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(51, 65, 85, 0.95) 100%);
			backdrop-filter: blur(20px);
			border: 1px solid rgba(148, 163, 184, 0.2);
			border-radius: 12px;
			padding: 1.5rem;
			text-align: center;
			box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
		}

		.summary-card.republican {
			border-color: rgba(239, 68, 68, 0.3);
			background: linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(185, 28, 28, 0.05) 100%);
		}

		.summary-card.democrat {
			border-color: rgba(59, 130, 246, 0.3);
			background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(29, 78, 216, 0.05) 100%);
		}

		.summary-card h3 {
			font-size: 1.125rem;
			font-weight: 600;
			margin-bottom: 0.5rem;
			color: #cbd5e1;
		}

		.summary-card .votes {
			font-size: 2.5rem;
			font-weight: 700;
			margin-bottom: 0.5rem;
		}

		.summary-card.republican .votes {
			color: #ef4444;
		}

		.summary-card.democrat .votes {
			color: #3b82f6;
		}

		.summary-card .states {
			font-size: 0.875rem;
			color: #94a3b8;
		}

		.votes-democrat {
			color: #3b82f6;
		}

		.votes-republican {
			color: #ef4444;
		}

		.winner-democrat {
			background: rgba(59, 130, 246, 0.1);
		}

		.winner-republican {
			background: rgba(239, 68, 68, 0.1);
		}

		.states-grid {
			display: grid;
			grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
			gap: 1.5rem;
		}

		.state-card {
			background: linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(51, 65, 85, 0.95) 100%);
			backdrop-filter: blur(20px);
			border: 1px solid rgba(148, 163, 184, 0.2);
			border-radius: 12px;
			padding: 1.5rem;
			box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
			transition: all 0.3s ease;
		}

		.state-card:hover {
			transform: translateY(-2px);
			box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
		}

		.state-card.republican {
			border-color: rgba(239, 68, 68, 0.3);
			background: linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(185, 28, 28, 0.05) 100%);
		}

		.state-card.democrat {
			border-color: rgba(59, 130, 246, 0.3);
			background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(29, 78, 216, 0.05) 100%);
		}

		.state-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 1rem;
		}

		.state-name {
			font-size: 1.25rem;
			font-weight: 600;
			color: #f1f5f9;
		}

		.state-winner {
			padding: 0.25rem 0.75rem;
			border-radius: 20px;
			font-size: 0.875rem;
			font-weight: 600;
			text-transform: uppercase;
		}

		.state-winner.republican {
			background: rgba(239, 68, 68, 0.2);
			color: #ef4444;
		}

		.state-winner.democrat {
			background: rgba(59, 130, 246, 0.2);
			color: #3b82f6;
		}

		.state-details {
			display: grid;
			grid-template-columns: 1fr 1fr;
			gap: 1rem;
		}

		.state-detail {
			display: flex;
			flex-direction: column;
		}

		.state-detail-label {
			font-size: 0.75rem;
			color: #64748b;
			text-transform: uppercase;
			margin-bottom: 0.25rem;
		}

		.state-detail-value {
			font-size: 1rem;
			font-weight: 600;
			color: #cbd5e1;
		}

		.no-data {
			text-align: center;
			padding: 3rem;
			color: #64748b;
		}

		.nav-links {
			display: flex;
			justify-content: center;
			gap: 1rem;
			margin-bottom: 2rem;
		}

		.nav-link {
			padding: 0.75rem 1.5rem;
			background: linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(51, 65, 85, 0.95) 100%);
			border: 1px solid rgba(148, 163, 184, 0.2);
			border-radius: 8px;
			color: #cbd5e1;
			text-decoration: none;
			font-weight: 500;
			transition: all 0.3s ease;
		}

		.nav-link:hover {
			background: linear-gradient(135deg, rgba(51, 65, 85, 0.95) 0%, rgba(71, 85, 105, 0.95) 100%);
			transform: translateY(-1px);
		}

		.nav-link.active {
			background: linear-gradient(135deg, rgba(120, 119, 198, 0.3) 0%, rgba(120, 119, 198, 0.1) 100%);
			border-color: rgba(120, 119, 198, 0.5);
		}

		.nav-link.trump-winner {
			background: linear-gradient(135deg, rgba(255, 215, 0, 0.2) 0%, rgba(255, 215, 0, 0.1) 100%);
			border-color: rgba(255, 215, 0, 0.4);
			box-shadow: 0 0 20px rgba(255, 215, 0, 0.3), 0 4px 16px rgba(0, 0, 0, 0.3);
			color: #ffd700;
			font-weight: 600;
		}

		.nav-link.trump-winner:hover {
			background: linear-gradient(135deg, rgba(255, 215, 0, 0.3) 0%, rgba(255, 215, 0, 0.2) 100%);
			border-color: rgba(255, 215, 0, 0.6);
			box-shadow: 0 0 25px rgba(255, 215, 0, 0.4), 0 4px 16px rgba(0, 0, 0, 0.3);
			transform: translateY(-1px);
		}

		@media (max-width: 768px) {
			body {
				padding: 1rem;
			}

			h1 {
				font-size: 2rem;
			}

			.electoral-summary {
				grid-template-columns: 1fr;
			}

			.states-grid {
				grid-template-columns: 1fr;
			}

			.nav-links {
				flex-wrap: wrap;
			}
		}
	</style>
</head>
<body>
	<div class="container">
		<header>
			<h1>Election Hub</h1>
			<p class="subtitle">2024 Electoral College Results & State-by-State Analysis</p>
		</header>

		<nav class="nav-links">
			<a href="/" class="nav-link">Home</a>
			<a href="/congress" class="nav-link">Congress</a>
			<a href="/election" class="nav-link active">Election</a>
			<a href="/issues" class="nav-link">Issues</a>
			<a href="/money" class="nav-link">Money</a>
			<a href="/harris" class="nav-link">Harris</a>
			<a href="/trump" class="nav-link trump-winner">Trump</a>
		</nav>

		<div class="electoral-summary">
			<div class="summary-card republican">
				<h3>Republican</h3>
				<div class="votes">${republicanVotes}</div>
				<div class="states">${Object.values(electoralData).filter(data => data.trump > 0).length} states</div>
			</div>
			<div class="summary-card democrat">
				<h3>Democrat</h3>
				<div class="votes">${democratVotes}</div>
				<div class="states">${Object.values(electoralData).filter(data => data.harris > 0).length} states + DC</div>
			</div>
			<div class="summary-card">
				<h3>Total Electoral Votes</h3>
				<div class="votes">${totalVotes}</div>
				<div class="states">51 total</div>
			</div>
		</div>

		<table style="width: 100%; border-collapse: collapse; margin-top: 2rem;">
			<thead>
				<tr style="background: rgba(30, 41, 59, 0.95);">
					<th style="padding: 1rem; text-align: left; border: 1px solid rgba(148, 163, 184, 0.2); color: #f1f5f9;">State</th>
					<th style="padding: 1rem; text-align: center; border: 1px solid rgba(148, 163, 184, 0.2); color: #f1f5f9;">Total EV</th>
					<th style="padding: 1rem; text-align: center; border: 1px solid rgba(148, 163, 184, 0.2); color: #f1f5f9;">Harris</th>
					<th style="padding: 1rem; text-align: center; border: 1px solid rgba(148, 163, 184, 0.2); color: #f1f5f9;">Trump</th>
					<th style="padding: 1rem; text-align: center; border: 1px solid rgba(148, 163, 184, 0.2); color: #f1f5f9;">Winner</th>
					<th style="padding: 1rem; text-align: center; border: 1px solid rgba(148, 163, 184, 0.2); color: #f1f5f9;">Margin</th>
				</tr>
			</thead>
			<tbody>
				${sortedStates.map(state => {
					const data = electoralData[state.code] || { total: 0, harris: 0, trump: 0, margin: 0 };
					const winner = data.harris > data.trump ? 'Democrat' : data.trump > data.harris ? 'Republican' : 'Split';
					const rowClass = winner === 'Democrat' ? 'winner-democrat' : winner === 'Republican' ? 'winner-republican' : '';

					return `
						<tr class="${rowClass}" style="background: ${winner === 'Democrat' ? 'rgba(59, 130, 246, 0.1)' : winner === 'Republican' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(30, 41, 59, 0.95)'};">
							<td style="padding: 1rem; border: 1px solid rgba(148, 163, 184, 0.2); color: #f1f5f9;"><strong>${state.name}</strong> (${state.code})</td>
							<td style="padding: 1rem; text-align: center; border: 1px solid rgba(148, 163, 184, 0.2); color: #f1f5f9;">${data.total}</td>
							<td style="padding: 1rem; text-align: center; border: 1px solid rgba(148, 163, 184, 0.2); color: ${data.harris > 0 ? '#3b82f6' : '#94a3b8'};">${data.harris > 0 ? data.harris : '-'}</td>
							<td style="padding: 1rem; text-align: center; border: 1px solid rgba(148, 163, 184, 0.2); color: ${data.trump > 0 ? '#ef4444' : '#94a3b8'};">${data.trump > 0 ? data.trump : '-'}</td>
							<td style="padding: 1rem; text-align: center; border: 1px solid rgba(148, 163, 184, 0.2); color: #f1f5f9;">${winner}</td>
							<td style="padding: 1rem; text-align: center; border: 1px solid rgba(148, 163, 184, 0.2); color: #f1f5f9;">${data.margin ? data.margin.toFixed(1) + '%' : '-'}</td>
						</tr>
					`;
				}).join('')}
			</tbody>
		</table>

		</div>
</body>
</html>`;
}