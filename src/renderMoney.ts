import type { Money } from './types';

export function renderMoneyPage(democratMoney: Money[], republicanMoney: Money[], bothMoney: Money[]): string {
	// Sort money arrays by amount (descending), with main presidential committee always first
	function sortMoneyByAmount(moneyArray: Money[]): Money[] {
		return [...moneyArray].sort((a, b) => {
			// Main presidential committee always comes first
			const aIsMain = a.funding_type === 'Main presidential committee';
			const bIsMain = b.funding_type === 'Main presidential committee';
			
			if (aIsMain && !bIsMain) return -1;
			if (!aIsMain && bIsMain) return 1;
			
			// Then sort by amount (descending)
			const aAmount = a.amount || 0;
			const bAmount = b.amount || 0;
			
			if (aAmount !== bAmount) {
				return bAmount - aAmount; // Higher amounts first
			}
			
			// If amounts are equal, use priority as tiebreaker (lower priority number = higher priority)
			const aPriority = a.priority || 999;
			const bPriority = b.priority || 999;
			
			return aPriority - bPriority;
		});
	}
	
	// Sort all money arrays
	const sortedDemocratMoney = sortMoneyByAmount(democratMoney);
	const sortedRepublicanMoney = sortMoneyByAmount(republicanMoney);
	const sortedBothMoney = sortMoneyByAmount(bothMoney);
	
	// Calculate totals
	const democratTotal = sortedDemocratMoney.reduce((sum, money) => sum + (money.amount || 0), 0);
	const republicanTotal = sortedRepublicanMoney.reduce((sum, money) => sum + (money.amount || 0), 0);
	const bothTotal = sortedBothMoney.reduce((sum, money) => sum + (money.amount || 0), 0);
	const grandTotal = democratTotal + republicanTotal + bothTotal;

	function formatAmount(amount: number): string {
		return `$${amount.toLocaleString()}`;
	}

	return `
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<title>Campaign Money & Lobbying - Voter Politician Tool</title>
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
			height: auto;
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
			display: grid;
			grid-template-columns: 1fr 1fr 1fr;
			gap: 2rem;
			align-items: start;
			width: 100%;
			min-height: 100vh;
			height: auto;
		}

		header {
			background: linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(51, 65, 85, 0.95) 100%);
			backdrop-filter: blur(20px);
			border: 1px solid rgba(148, 163, 184, 0.2);
			border-radius: 16px;
			padding: 2.5rem;
			margin-bottom: 2rem;
			box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(148, 163, 184, 0.1);
			grid-column: 1 / -1;
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
			background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(239, 68, 68, 0.1) 100%);
			border-radius: 16px;
			pointer-events: none;
		}

		h1 {
			font-size: 3rem;
			margin-bottom: 0.5rem;
			color: #ffffff;
			font-weight: 800;
			letter-spacing: -0.025em;
			position: relative;
			z-index: 1;
		}

		.subtitle {
			color: #cbd5e1;
			font-size: 1.2rem;
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
			margin: 0 0.75rem;
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

		nav a:hover {
			text-decoration: underline;
		}

		.section {
			background: linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(51, 65, 85, 0.9) 100%);
			backdrop-filter: blur(20px);
			border: 1px solid rgba(148, 163, 184, 0.2);
			border-radius: 16px;
			padding: 2rem;
			box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(148, 163, 184, 0.1);
			min-height: auto;
			height: auto;
			position: relative;
		}

		.section::before {
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

		.democrat-section {
			position: relative;
		}

		.democrat-section::before {
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			background: linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(37, 99, 235, 0.08) 100%);
			pointer-events: none;
		}

		.republican-section {
			position: relative;
		}

		.republican-section::before {
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			background: linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(220, 38, 38, 0.08) 100%);
			pointer-events: none;
		}

		.center-section {
			background: linear-gradient(135deg, rgba(248, 250, 252, 0.1) 0%, rgba(226, 232, 240, 0.05) 100%);
			border: 2px solid rgba(148, 163, 184, 0.3);
		}

		.section-header {
			display: flex;
			align-items: center;
			justify-content: center;
			margin-bottom: 2rem;
			padding-bottom: 1rem;
			border-bottom: 2px solid rgba(148, 163, 184, 0.3);
			position: relative;
			z-index: 1;
		}

		.section-icon {
			width: 60px;
			height: 60px;
			margin-right: 1rem;
			animation: bounce 2s infinite;
		}

		.donkey-icon {
			filter: drop-shadow(0 0 15px rgba(59, 130, 246, 0.6)) brightness(1.1);
		}

		.elephant-icon {
			filter: drop-shadow(0 0 15px rgba(239, 68, 68, 0.6)) brightness(1.1);
		}

		.section-title {
			font-size: 1.8rem;
			font-weight: 700;
			color: #f1f5f9;
			text-align: center;
			text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
		}

		.democrat-title {
			color: #60a5fa;
			text-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
		}

		.republican-title {
			color: #f87171;
			text-shadow: 0 0 10px rgba(239, 68, 68, 0.5);
		}

		.center-title {
			color: #cbd5e1;
			text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
		}

		.money-list {
			position: relative;
			z-index: 2;
		}

		.money-item {
			background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
			backdrop-filter: blur(10px);
			border: 1px solid rgba(148, 163, 184, 0.2);
			border-radius: 12px;
			padding: 1.5rem;
			margin-bottom: 1rem;
			border-left: 4px solid;
			transition: all 0.3s ease;
			box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
		}

		.money-item:hover {
			transform: translateY(-3px) scale(1.01);
			box-shadow: 0 8px 25px rgba(0, 0, 0, 0.25);
			border-color: rgba(148, 163, 184, 0.4);
		}

		.democrat-money {
			border-left-color: #60a5fa;
			box-shadow: 0 0 20px rgba(59, 130, 246, 0.2);
		}

		.republican-money {
			border-left-color: #f87171;
			box-shadow: 0 0 20px rgba(239, 68, 68, 0.2);
		}

		.both-money {
			border-left-color: #94a3b8;
			box-shadow: 0 0 20px rgba(148, 163, 184, 0.2);
		}

		.money-icon {
			width: 24px;
			height: 24px;
			margin-right: 0.75rem;
			border-radius: 4px;
			object-fit: cover;
		}

		.money-cash {
			width: 24px;
			height: 24px;
			margin-right: 0.75rem;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 16px;
			background: rgba(255, 215, 0, 0.2);
			border-radius: 4px;
		}

		.money-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			cursor: pointer;
			padding: 0.5rem 0;
		}

		.money-header:hover {
			background: rgba(0,0,0,0.02);
			border-radius: 6px;
			margin: -0.5rem -0.5rem 0 -0.5rem;
			padding: 1rem;
		}

		.money-title {
			font-size: 1.2rem;
			font-weight: 600;
			color: #f1f5f9;
			flex: 1;
		}

		.money-arrow {
			font-size: 0.8rem;
			color: #6b7280;
			transition: transform 0.3s ease;
			margin-left: 0.5rem;
		}

		.money-description {
			color: #cbd5e1;
			line-height: 1.6;
			margin-top: 0.5rem;
			max-height: 0;
			overflow: hidden;
			transition: max-height 0.3s ease, margin-top 0.3s ease, opacity 0.3s ease;
			opacity: 0;
		}

		.money-description:not(.collapsed) {
			max-height: 2000px;
			margin-top: 1rem;
			opacity: 1;
		}

		.money-header.expanded .money-arrow {
			transform: rotate(180deg);
		}

		.money-description {
			color: #cbd5e1;
			line-height: 1.5;
		}

		.money-citations {
			margin-top: 0.5rem;
			font-size: 0.8rem;
			color: #94a3b8;
		}

		.contributor-citations {
			margin-top: 0.25rem;
			font-size: 0.7rem;
			color: #64748b;
		}

		.money-category {
			display: inline-block;
			padding: 0.25rem 0.75rem;
			background: rgba(148, 163, 184, 0.2);
			border: 1px solid rgba(148, 163, 184, 0.3);
			border-radius: 12px;
			font-size: 0.8rem;
			font-weight: 500;
			margin-top: 0.5rem;
			color: #f1f5f9;
			backdrop-filter: blur(5px);
		}

		.money-amount {
			display: inline-block;
			padding: 0.5rem 1rem;
			background: linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(16, 185, 129, 0.1) 100%);
			border: 1px solid rgba(34, 197, 94, 0.3);
			border-radius: 8px;
			font-size: 1.1rem;
			font-weight: 700;
			margin-top: 0.5rem;
			color: #22c55e;
			text-shadow: 0 0 10px rgba(34, 197, 94, 0.3);
			backdrop-filter: blur(5px);
		}

		.empty-state {
			text-align: center;
			padding: 3rem;
			color: #94a3b8;
		}

		.empty-state p {
			font-size: 1.1rem;
			margin-bottom: 0.5rem;
			color: #cbd5e1;
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

		@media (max-width: 1024px) {
			.container {
				grid-template-columns: 1fr;
				gap: 1rem;
			}

			.section {
				min-height: auto;
			}
		}

		.total-amounts {
			background: linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%);
			border: 2px solid rgba(34, 197, 94, 0.3);
			border-radius: 16px;
			padding: 2rem;
			margin-bottom: 2rem;
			text-align: center;
			backdrop-filter: blur(10px);
		}

		.total-amounts h3 {
			color: #22c55e;
			font-size: 1.5rem;
			margin-bottom: 1rem;
			text-shadow: 0 0 10px rgba(34, 197, 94, 0.3);
		}

		.total-row {
			display: flex;
			justify-content: space-around;
			align-items: center;
			margin: 1rem 0;
			flex-wrap: wrap;
			gap: 1rem;
		}

		.total-item {
			display: flex;
			flex-direction: column;
			align-items: center;
			padding: 1rem;
			background: rgba(255, 255, 255, 0.05);
			border-radius: 12px;
			border: 1px solid rgba(148, 163, 184, 0.2);
			min-width: 150px;
		}

		.total-label {
			font-size: 0.9rem;
			color: #94a3b8;
			margin-bottom: 0.5rem;
			font-weight: 500;
		}

		.total-value {
			font-size: 1.8rem;
			font-weight: 800;
			text-shadow: 0 0 10px rgba(34, 197, 94, 0.3);
		}

		.democrat-total {
			color: #60a5fa;
			text-shadow: 0 0 10px rgba(59, 130, 246, 0.3);
		}

		.republican-total {
			color: #f87171;
			text-shadow: 0 0 10px rgba(239, 68, 68, 0.3);
		}

		.grand-total {
			color: #22c55e;
			text-shadow: 0 0 10px rgba(34, 197, 94, 0.3);
		}

		@media (max-width: 768px) {
			body {
				padding: 1rem;
			}

			h1 {
				font-size: 2rem;
			}

			.section {
				padding: 1rem;
			}

			.section-icon {
				width: 40px;
				height: 40px;
			}

			.total-row {
				flex-direction: column;
			}

			.total-value {
				font-size: 1.4rem;
			}
		}
	</style>
</head>
<body>
	<div class="container">
		<header>
			<h1>Campaign Money & Lobbying</h1>
			<p class="subtitle">Funding sources, campaign finance, and lobbying activities for political parties</p>
			<nav>
				<a href="/">← Back to Map</a>
				<a href="/money">Money Hub</a>
				<a href="/issues">Issues Hub</a>
				<a href="/congress">Congress Hub</a>
				<a href="/election">Election Hub</a>
			</nav>
		</header>

		<!-- Democrats Section (Left) -->
		<div class="section democrat-section">
			<div class="section-header">
				<img class="section-icon donkey-icon" src="https://content.mycutegraphics.com/graphics/animal/horse-head.png" alt="Horse" />
				<h2 class="section-title democrat-title">Democratic Funding</h2>
			</div>
			<div class="money-list">
				${(() => {
					const mainCommittee = sortedDemocratMoney.find(m => m.funding_type === 'Main presidential committee');
					const insideEntries = sortedDemocratMoney.filter(m => m.funding_type === 'Inside');
					const otherEntries = sortedDemocratMoney.filter(m => m.funding_type !== 'Main presidential committee' && m.funding_type !== 'Inside');
					
					if (mainCommittee && insideEntries.length > 0) {
						// Group Inside entries within Main presidential committee
						const mainCommitteeLinks = [];
						if (mainCommittee.link1) mainCommitteeLinks.push({ url: mainCommittee.link1, number: 1 });
						if (mainCommittee.link2) mainCommitteeLinks.push({ url: mainCommittee.link2, number: 2 });
						if (mainCommittee.link3) mainCommitteeLinks.push({ url: mainCommittee.link3, number: 3 });
						if (mainCommittee.link4) mainCommitteeLinks.push({ url: mainCommittee.link4, number: 4 });
						if (mainCommittee.link5) mainCommitteeLinks.push({ url: mainCommittee.link5, number: 5 });
						if (mainCommittee.link6) mainCommitteeLinks.push({ url: mainCommittee.link6, number: 6 });
						
						// Collect all contributor citations with proper numbering
						const allContributorCitations: { url: string; number: number }[] = [];
						let citationCounter = mainCommitteeLinks.length + 1;
						
						const bulletPoints = insideEntries.map(money => {
							let point = `${money.amount ? formatAmount(money.amount) + ': ' : ''}${escapeHtml(money.title)}`;
							
							// Add citations from individual contributor with proper numbering
							if (money.link1) {
								allContributorCitations.push({ url: money.link1, number: citationCounter++ });
							}
							if (money.link2) {
								allContributorCitations.push({ url: money.link2, number: citationCounter++ });
							}
							if (money.link3) {
								allContributorCitations.push({ url: money.link3, number: citationCounter++ });
							}
							if (money.link4) {
								allContributorCitations.push({ url: money.link4, number: citationCounter++ });
							}
							if (money.link5) {
								allContributorCitations.push({ url: money.link5, number: citationCounter++ });
							}
							if (money.link6) {
								allContributorCitations.push({ url: money.link6, number: citationCounter++ });
							}
							
							return point;
						}).join('\n');
						
						const allLinks = [...mainCommitteeLinks, ...allContributorCitations];
						
						return `
							<div class="money-item democrat-money">
								<div class="money-header" onclick="toggleMoneyDescription(this)">
									${mainCommittee.icon_url ? `<img class="money-icon" src="${escapeHtml(mainCommittee.icon_url)}" alt="Money icon" />` : '<div class="money-cash">💰</div>'}
									<div class="money-title">${escapeHtml(mainCommittee.title)}</div>
									<div class="money-arrow">▼</div>
								</div>
								${mainCommittee.amount ? `<div class="money-amount">${formatAmount(mainCommittee.amount)}</div>` : ''}
								${mainCommitteeLinks.length > 0 ? `
									<div class="money-citations" style="margin-top: 0.5rem; font-size: 0.8rem; color: #94a3b8;">
										Sources: ${mainCommitteeLinks.map(link => `<a href="${escapeHtml(link.url)}" target="_blank" style="color: #60a5fa; text-decoration: none;">[${link.number}]</a>`).join('')}
									</div>
								` : ''}
								<div class="money-description collapsed">
									${mainCommittee.description ? `<p style="margin-bottom: 1rem; color: #cbd5e1;">${escapeHtml(mainCommittee.description)}</p>` : ''}
									<h4 style="margin-top: 1rem; margin-bottom: 0.5rem; color: #94a3b8;">Major Contributors:</h4>
									<ul style="margin: 0; padding-left: 1.5rem;">
										${insideEntries.map(money => {
											return `<li style="margin-bottom: 0.5rem; color: #cbd5e1; cursor: pointer;" onclick="showContributorDetails('${escapeHtml(money.title)}', '${money.amount || 0}', '${escapeHtml(money.description || '')}', [${money.link1 ? `'${escapeHtml(money.link1)}'` : ''},${money.link2 ? `'${escapeHtml(money.link2)}'` : ''},${money.link3 ? `'${escapeHtml(money.link3)}'` : ''},${money.link4 ? `'${escapeHtml(money.link4)}'` : ''},${money.link5 ? `'${escapeHtml(money.link5)}'` : ''},${money.link6 ? `'${escapeHtml(money.link6)}'` : ''}].filter(Boolean))">
												${money.amount ? formatAmount(money.amount) + ': ' : ''}${escapeHtml(money.title)}
											</li>`;
										}).join('')}
									</ul>
								</div>
								${mainCommittee.category ? `<div class="money-category">${escapeHtml(mainCommittee.category)}</div>` : ''}
							</div>
							${otherEntries.length > 0 ? 
								otherEntries.map(money => `
									<div class="money-item democrat-money">
										<div class="money-header" onclick="toggleMoneyDescription(this)">
											${money.icon_url ? `<img class="money-icon" src="${escapeHtml(money.icon_url)}" alt="Money icon" />` : '<div class="money-cash">💰</div>'}
											<div class="money-title">${escapeHtml(money.title)}</div>
											${money.description ? '<div class="money-arrow">▼</div>' : ''}
										</div>
										${money.description ? `<div class="money-description collapsed">${escapeHtml(money.description)}</div>` : ''}
										${money.category ? `<div class="money-category">${escapeHtml(money.category)}</div>` : ''}
										${money.amount ? `<div class="money-amount">${formatAmount(money.amount)}</div>` : ''}
										${renderIndividualMoneyLinks(money, 'democrat')}
									</div>
								`).join('') : ''
							}
						`;
					} else if (sortedDemocratMoney.length > 0) {
						// Regular display if no main committee
						return sortedDemocratMoney.map(money => `
							<div class="money-item democrat-money">
								<div class="money-header" onclick="toggleMoneyDescription(this)">
									${money.icon_url ? `<img class="money-icon" src="${escapeHtml(money.icon_url)}" alt="Money icon" />` : '<div class="money-cash">💰</div>'}
									<div class="money-title">${escapeHtml(money.title)}</div>
									${money.description ? '<div class="money-arrow">▼</div>' : ''}
								</div>
								${money.description ? `<div class="money-description collapsed">${escapeHtml(money.description)}</div>` : ''}
								${money.category ? `<div class="money-category">${escapeHtml(money.category)}</div>` : ''}
								${money.amount ? `<div class="money-amount">${formatAmount(money.amount)}</div>` : ''}
								${renderIndividualMoneyLinks(money, 'democrat')}
							</div>
						`).join('');
					} else {
						return `<div class="empty-state">
							<p>No Democratic funding information available</p>
							<p>Check back later for updates</p>
						</div>`;
					}
				})()}
			</div>
		</div>

		<!-- Fact Points Section (Center) -->
		<div class="section center-section">
			<div class="section-header">
				<div class="section-icon" style="font-size: 2rem; margin-right: 0.5rem;">💵</div>
				<h2 class="section-title center-title">Fact Points</h2>
			</div>
			<div class="money-list">
				${sortedBothMoney.length > 0 ?
					sortedBothMoney.map(money => `
						<div class="money-item both-money">
							<div class="money-header" onclick="toggleMoneyDescription(this)">
								${money.icon_url ? `<img class="money-icon" src="${escapeHtml(money.icon_url)}" alt="Money icon" />` : '<div class="money-cash">💰</div>'}
								<div class="money-title">${escapeHtml(money.title)}</div>
								${money.description ? '<div class="money-arrow">▼</div>' : ''}
							</div>
							${money.description ? `<div class="money-description collapsed">${escapeHtml(money.description)}</div>` : ''}
							${money.category ? `<div class="money-category">${escapeHtml(money.category)}</div>` : ''}
							${money.amount ? `<div class="money-amount">${formatAmount(money.amount)}</div>` : ''}
							${renderIndividualMoneyLinks(money, 'both')}
						</div>
					`).join('') :
					`<div class="empty-state">
						<p>No fact points available</p>
						<p>Check back later for updates</p>
					</div>`
				}
			</div>
		</div>

		<!-- Republicans Section (Right) -->
		<div class="section republican-section">
			<div class="section-header">
				<img class="section-icon elephant-icon" src="https://content.mycutegraphics.com/graphics/animal/cute-elephant.png" alt="Elephant" />
				<h2 class="section-title republican-title">Republican Funding</h2>
			</div>
			<div class="money-list">
				${(() => {
					const mainCommittee = sortedRepublicanMoney.find(m => m.funding_type === 'Main presidential committee');
					const insideEntries = sortedRepublicanMoney.filter(m => m.funding_type === 'Inside');
					const otherEntries = sortedRepublicanMoney.filter(m => m.funding_type !== 'Main presidential committee' && m.funding_type !== 'Inside');
					
					if (mainCommittee && insideEntries.length > 0) {
						// Group Inside entries within Main presidential committee
						const mainCommitteeLinks = [];
						if (mainCommittee.link1) mainCommitteeLinks.push({ url: mainCommittee.link1, number: 1 });
						if (mainCommittee.link2) mainCommitteeLinks.push({ url: mainCommittee.link2, number: 2 });
						if (mainCommittee.link3) mainCommitteeLinks.push({ url: mainCommittee.link3, number: 3 });
						if (mainCommittee.link4) mainCommitteeLinks.push({ url: mainCommittee.link4, number: 4 });
						if (mainCommittee.link5) mainCommitteeLinks.push({ url: mainCommittee.link5, number: 5 });
						if (mainCommittee.link6) mainCommitteeLinks.push({ url: mainCommittee.link6, number: 6 });
						
						// Collect all contributor citations with proper numbering
						const allContributorCitations: { url: string; number: number }[] = [];
						let citationCounter = mainCommitteeLinks.length + 1;
						
						const bulletPoints = insideEntries.map(money => {
							let point = `${money.amount ? formatAmount(money.amount) + ': ' : ''}${escapeHtml(money.title)}`;
							
							// Add citations from individual contributor with proper numbering
							if (money.link1) {
								allContributorCitations.push({ url: money.link1, number: citationCounter++ });
							}
							if (money.link2) {
								allContributorCitations.push({ url: money.link2, number: citationCounter++ });
							}
							if (money.link3) {
								allContributorCitations.push({ url: money.link3, number: citationCounter++ });
							}
							if (money.link4) {
								allContributorCitations.push({ url: money.link4, number: citationCounter++ });
							}
							if (money.link5) {
								allContributorCitations.push({ url: money.link5, number: citationCounter++ });
							}
							if (money.link6) {
								allContributorCitations.push({ url: money.link6, number: citationCounter++ });
							}
							
							return point;
						}).join('\n');
						
						const allLinks = [...mainCommitteeLinks, ...allContributorCitations];
						
						return `
							<div class="money-item republican-money">
								<div class="money-header" onclick="toggleMoneyDescription(this)">
									${mainCommittee.icon_url ? `<img class="money-icon" src="${escapeHtml(mainCommittee.icon_url)}" alt="Money icon" />` : '<div class="money-cash">💰</div>'}
									<div class="money-title">${escapeHtml(mainCommittee.title)}</div>
									<div class="money-arrow">▼</div>
								</div>
								${mainCommittee.amount ? `<div class="money-amount">${formatAmount(mainCommittee.amount)}</div>` : ''}
								${mainCommitteeLinks.length > 0 ? `
									<div class="money-citations" style="margin-top: 0.5rem; font-size: 0.8rem; color: #94a3b8;">
										Sources: ${mainCommitteeLinks.map(link => `<a href="${escapeHtml(link.url)}" target="_blank" style="color: #f87171; text-decoration: none;">[${link.number}]</a>`).join('')}
									</div>
								` : ''}
								<div class="money-description collapsed">
									${mainCommittee.description ? `<p style="margin-bottom: 1rem; color: #cbd5e1;">${escapeHtml(mainCommittee.description)}</p>` : ''}
									<h4 style="margin-top: 1rem; margin-bottom: 0.5rem; color: #94a3b8;">Major Contributors:</h4>
									<ul style="margin: 0; padding-left: 1.5rem;">
										${insideEntries.map(money => {
											return `<li style="margin-bottom: 0.5rem; color: #cbd5e1; cursor: pointer;" onclick="showContributorDetails('${escapeHtml(money.title)}', '${money.amount || 0}', '${escapeHtml(money.description || '')}', [${money.link1 ? `'${escapeHtml(money.link1)}'` : ''},${money.link2 ? `'${escapeHtml(money.link2)}'` : ''},${money.link3 ? `'${escapeHtml(money.link3)}'` : ''},${money.link4 ? `'${escapeHtml(money.link4)}'` : ''},${money.link5 ? `'${escapeHtml(money.link5)}'` : ''},${money.link6 ? `'${escapeHtml(money.link6)}'` : ''}].filter(Boolean))">
												${money.amount ? formatAmount(money.amount) + ': ' : ''}${escapeHtml(money.title)}
											</li>`;
										}).join('')}
									</ul>
								</div>
								${mainCommittee.category ? `<div class="money-category">${escapeHtml(mainCommittee.category)}</div>` : ''}
							</div>
							${otherEntries.length > 0 ? 
								otherEntries.map(money => `
									<div class="money-item republican-money">
										<div class="money-header" onclick="toggleMoneyDescription(this)">
											${money.icon_url ? `<img class="money-icon" src="${escapeHtml(money.icon_url)}" alt="Money icon" />` : '<div class="money-cash">💰</div>'}
											<div class="money-title">${escapeHtml(money.title)}</div>
											${money.description ? '<div class="money-arrow">▼</div>' : ''}
										</div>
										${money.description ? `<div class="money-description collapsed">${escapeHtml(money.description)}</div>` : ''}
										${money.category ? `<div class="money-category">${escapeHtml(money.category)}</div>` : ''}
										${money.amount ? `<div class="money-amount">${formatAmount(money.amount)}</div>` : ''}
										${renderIndividualMoneyLinks(money, 'republican')}
									</div>
								`).join('') : ''
							}
						`;
					} else if (sortedRepublicanMoney.length > 0) {
						// Regular display if no main committee
						return sortedRepublicanMoney.map(money => `
							<div class="money-item republican-money">
								<div class="money-header" onclick="toggleMoneyDescription(this)">
									${money.icon_url ? `<img class="money-icon" src="${escapeHtml(money.icon_url)}" alt="Money icon" />` : '<div class="money-cash">💰</div>'}
									<div class="money-title">${escapeHtml(money.title)}</div>
									${money.description ? '<div class="money-arrow">▼</div>' : ''}
								</div>
								${money.description ? `<div class="money-description collapsed">${escapeHtml(money.description)}</div>` : ''}
								${money.category ? `<div class="money-category">${escapeHtml(money.category)}</div>` : ''}
								${money.amount ? `<div class="money-amount">${formatAmount(money.amount)}</div>` : ''}
								${renderIndividualMoneyLinks(money, 'republican')}
							</div>
						`).join('');
					} else {
						return `<div class="empty-state">
							<p>No Republican funding information available</p>
							<p>Check back later for updates</p>
						</div>`;
					}
				})()}
			</div>
		</div>

		<script>
		function toggleMoneyDescription(headerElement) {
			const description = headerElement.parentElement.querySelector('.money-description');
			const arrow = headerElement.querySelector('.money-arrow');

			if (description && arrow) {
				const isCollapsed = description.classList.contains('collapsed');

				if (isCollapsed) {
					description.classList.remove('collapsed');
					headerElement.classList.add('expanded');
				} else {
					description.classList.add('collapsed');
					headerElement.classList.remove('expanded');
				}
			}
		}

		function showContributorDetails(title, amount, description, links) {
			const modal = document.createElement('div');
			modal.style.position = 'fixed';
			modal.style.top = '0';
			modal.style.left = '0';
			modal.style.right = '0';
			modal.style.bottom = '0';
			modal.style.background = 'rgba(0, 0, 0, 0.8)';
			modal.style.display = 'flex';
			modal.style.alignItems = 'center';
			modal.style.justifyContent = 'center';
			modal.style.zIndex = '1000';

			const content = document.createElement('div');
			content.style.background = 'linear-gradient(135deg, #1e293b 0%, #334155 100%)';
			content.style.border = '2px solid rgba(148, 163, 184, 0.2)';
			content.style.borderRadius = '16px';
			content.style.padding = '2rem';
			content.style.maxWidth = '500px';
			content.style.width = '90%';
			content.style.maxHeight = '80vh';
			content.style.overflowY = 'auto';
			content.style.color = '#f1f5f9';
			content.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.3)';

			const formatAmount = (amt) => {
				return '$' + amt.toLocaleString();
			};

			const headerDiv = document.createElement('div');
			headerDiv.style.display = 'flex';
			headerDiv.style.justifyContent = 'space-between';
			headerDiv.style.alignItems = 'center';
			headerDiv.style.marginBottom = '1.5rem';

			const titleH2 = document.createElement('h2');
			titleH2.style.color = '#60a5fa';
			titleH2.style.margin = '0';
			titleH2.style.fontSize = '1.5rem';
			titleH2.textContent = title;

			const closeButton = document.createElement('button');
			closeButton.textContent = '✕';
			closeButton.style.background = 'none';
			closeButton.style.border = 'none';
			closeButton.style.color = '#cbd5e1';
			closeButton.style.fontSize = '1.5rem';
			closeButton.style.cursor = 'pointer';
			closeButton.onclick = () => modal.remove();

			headerDiv.appendChild(titleH2);
			headerDiv.appendChild(closeButton);

			if (amount) {
				const amountDiv = document.createElement('div');
				amountDiv.style.fontSize = '2rem';
				amountDiv.style.fontWeight = 'bold';
				amountDiv.style.color = '#22c55e';
				amountDiv.style.marginBottom = '1rem';
				amountDiv.textContent = formatAmount(amount);
				content.appendChild(amountDiv);
			}

			if (description) {
				const descDiv = document.createElement('div');
				descDiv.style.color = '#cbd5e1';
				descDiv.style.lineHeight = '1.6';
				descDiv.style.marginBottom = '1.5rem';
				descDiv.textContent = description;
				content.appendChild(descDiv);
			}

			if (links.length > 0) {
				const sourcesDiv = document.createElement('div');
				sourcesDiv.style.marginTop = '1rem';

				const sourcesH3 = document.createElement('h3');
				sourcesH3.style.color = '#94a3b8';
				sourcesH3.style.marginBottom = '0.5rem';
				sourcesH3.textContent = 'Sources:';
				sourcesDiv.appendChild(sourcesH3);

				links.forEach((link, index) => {
					const linkDiv = document.createElement('div');
					linkDiv.style.marginBottom = '0.5rem';
					
					const linkA = document.createElement('a');
					linkA.href = link;
					linkA.target = '_blank';
					linkA.style.color = '#60a5fa';
					linkA.style.textDecoration = 'none';
					linkA.textContent = (index + 1) + '. ' + link;
					
					linkDiv.appendChild(linkA);
					sourcesDiv.appendChild(linkDiv);
				});

				content.appendChild(sourcesDiv);
			}

			content.appendChild(headerDiv);
			modal.appendChild(content);
			document.body.appendChild(modal);

			modal.addEventListener('click', (e) => {
				if (e.target === modal) {
					modal.remove();
				}
			});
		}
	</script>
</body>
</html>
	`;
}

function renderIndividualMoneyLinks(money: any, party: 'democrat' | 'republican' | 'both' = 'democrat'): string {
	const links = [];
	if (money.link1) links.push({ url: money.link1, number: 1 });
	if (money.link2) links.push({ url: money.link2, number: 2 });
	if (money.link3) links.push({ url: money.link3, number: 3 });
	if (money.link4) links.push({ url: money.link4, number: 4 });
	if (money.link5) links.push({ url: money.link5, number: 5 });
	if (money.link6) links.push({ url: money.link6, number: 6 });

	if (links.length === 0) return '';

	// Set color based on party
	const linkColor = party === 'republican' ? '#f87171' : party === 'both' ? '#94a3b8' : '#60a5fa';

	return `<div class="money-citations" style="margin-top: 0.5rem; font-size: 0.8rem; color: #94a3b8;">
		Sources: ${links.map(link => `<a href="${escapeHtml(link.url)}" target="_blank" style="color: ${linkColor}; text-decoration: none;">[${link.number}]</a>`).join('')}
	</div>`;
}

function renderMoneyLinks(money: any): string {
	const links = [];
	if (money.link1) links.push({ url: money.link1, number: 1 });
	if (money.link2) links.push({ url: money.link2, number: 2 });
	if (money.link3) links.push({ url: money.link3, number: 3 });
	if (money.link4) links.push({ url: money.link4, number: 4 });
	if (money.link5) links.push({ url: money.link5, number: 5 });
	if (money.link6) links.push({ url: money.link6, number: 6 });

	if (links.length === 0) return '';

	return `<div class="money-links">
		${links.map(link => `<a href="${escapeHtml(link.url)}" target="_blank" class="money-link-superscript">${link.number}</a>`).join('')}
	</div>`;
}

function escapeHtml(text: string): string {
	if (!text) return '';
	const map: { [key: string]: string } = {
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;',
		"'": '&#039;'
	};
	return text.replace(/[&<>"']/g, m => map[m]);
}
