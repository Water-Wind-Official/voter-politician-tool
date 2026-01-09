import type { State } from './types';

export function renderElectionHub(states: State[]): string {
	// Calculate electoral summary
	const republicanStates = states.filter(s => s.electoral_winner === 'Republican');
	const democratStates = states.filter(s => s.electoral_winner === 'Democrat');
	const republicanVotes = republicanStates.reduce((sum, s) => sum + (s.electoral_votes || 0), 0);
	const democratVotes = democratStates.reduce((sum, s) => sum + (s.electoral_votes || 0), 0);
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
			<a href="/senators" class="nav-link">Senators</a>
			<a href="/house" class="nav-link">House</a>
			<a href="/election" class="nav-link active">Election</a>
			<a href="/issues" class="nav-link">Issues</a>
			<a href="/money" class="nav-link">Money</a>
		</nav>

		<div class="electoral-summary">
			<div class="summary-card republican">
				<h3>Republican</h3>
				<div class="votes">${republicanVotes}</div>
				<div class="states">${republicanStates.length} states</div>
			</div>
			<div class="summary-card democrat">
				<h3>Democrat</h3>
				<div class="votes">${democratVotes}</div>
				<div class="states">${democratStates.length} states</div>
			</div>
			<div class="summary-card">
				<h3>Total Electoral Votes</h3>
				<div class="votes">${totalVotes}</div>
				<div class="states">${states.length} states + DC</div>
			</div>
		</div>

		<div class="states-grid">
			${sortedStates.map(state => {
				if (!state.electoral_winner) {
					return `
						<div class="state-card">
							<div class="state-header">
								<div class="state-name">${state.name}</div>
							</div>
							<div class="state-details">
								<div class="state-detail">
									<span class="state-detail-label">Status</span>
									<span class="state-detail-value">No data</span>
								</div>
								<div class="state-detail">
									<span class="state-detail-label">Electoral Votes</span>
									<span class="state-detail-value">${state.electoral_votes || 'N/A'}</span>
								</div>
							</div>
						</div>
					`;
				}

				const winnerClass = state.electoral_winner.toLowerCase();
				const marginText = state.electoral_margin ? `${state.electoral_margin}%` : 'N/A';

				return `
					<div class="state-card ${winnerClass}">
						<div class="state-header">
							<div class="state-name">${state.name}</div>
							<div class="state-winner ${winnerClass}">${state.electoral_winner}</div>
						</div>
						<div class="state-details">
							<div class="state-detail">
								<span class="state-detail-label">Electoral Votes</span>
								<span class="state-detail-value">${state.electoral_votes || 'N/A'}</span>
							</div>
							<div class="state-detail">
								<span class="state-detail-label">Margin</span>
								<span class="state-detail-value">${marginText}</span>
							</div>
							<div class="state-detail">
								<span class="state-detail-label">Year</span>
								<span class="state-detail-value">${state.electoral_year || 'N/A'}</span>
							</div>
							<div class="state-detail">
								<span class="state-detail-label">State Code</span>
								<span class="state-detail-value">${state.code}</span>
							</div>
						</div>
					</div>
				`;
			}).join('')}
		</div>
	</div>
</body>
</html>`;
}