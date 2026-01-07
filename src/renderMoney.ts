import type { Money } from './types';

export function renderMoneyPage(democratMoney: Money[], republicanMoney: Money[], bothMoney: Money[]): string {
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
			grid-template-columns: 1fr 1.5fr 1fr;
			gap: 2rem;
			align-items: start;
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
			min-height: 600px;
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
			overflow: hidden;
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
			overflow: hidden;
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
			max-height: 500px;
			margin-top: 1rem;
			opacity: 1;
		}

		.money-header.expanded .money-arrow {
			transform: rotate(180deg);
		}

		.money-links {
			position: absolute;
			bottom: 0.5rem;
			right: 0.5rem;
			display: flex;
			gap: 0.25rem;
		}

		.money-link-superscript {
			display: inline-block;
			width: 1rem;
			height: 1rem;
			line-height: 1rem;
			text-align: center;
			font-size: 0.7rem;
			font-weight: bold;
			background: rgba(59, 130, 246, 0.1);
			color: #2563eb;
			border-radius: 50%;
			text-decoration: none;
			transition: all 0.2s;
			border: 1px solid rgba(59, 130, 246, 0.2);
		}

		.money-link-superscript:hover {
			background: #2563eb;
			color: white;
			transform: scale(1.1);
		}

		/* Ensure money items are positioned relatively for absolute positioning of links */
		.money-item {
			position: relative;
			padding-bottom: 2rem; /* Make room for the superscript links */
		}

		.money-description {
			color: #cbd5e1;
			line-height: 1.5;
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
				<a href="/issues">Issues Hub</a>
				<a href="/senators">Senate Hub</a>
				<a href="/house">House Hub</a>
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
				${democratMoney.length > 0 ?
					democratMoney.map(money => `
						<div class="money-item democrat-money">
							<div class="money-header" onclick="toggleMoneyDescription(this)">
								<div class="money-title">${escapeHtml(money.title)}</div>
								${money.description ? '<div class="money-arrow">▼</div>' : ''}
							</div>
							${money.description ? `<div class="money-description collapsed">${escapeHtml(money.description)}</div>` : ''}
							${money.category ? `<div class="money-category">${escapeHtml(money.category)}</div>` : ''}
							${renderMoneyLinks(money)}
						</div>
					`).join('') :
					`<div class="empty-state">
						<p>No Democratic funding information available</p>
						<p>Check back later for updates</p>
					</div>`
				}
			</div>
		</div>

		<!-- Center Section (Both Parties) -->
		<div class="section center-section">
			<div class="section-header">
				<h2 class="section-title center-title">Shared Funding</h2>
			</div>
			<div class="money-list">
				${bothMoney.length > 0 ?
					bothMoney.map(money => `
						<div class="money-item both-money">
							<div class="money-header" onclick="toggleMoneyDescription(this)">
								<div class="money-title">${escapeHtml(money.title)}</div>
								${money.description ? '<div class="money-arrow">▼</div>' : ''}
							</div>
							${money.description ? `<div class="money-description collapsed">${escapeHtml(money.description)}</div>` : ''}
							${money.category ? `<div class="money-category">${escapeHtml(money.category)}</div>` : ''}
							${renderMoneyLinks(money)}
						</div>
					`).join('') :
					`<div class="empty-state">
						<p>No shared funding information available</p>
						<p>Funding that affects both parties will appear here</p>
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
				${republicanMoney.length > 0 ?
					republicanMoney.map(money => `
						<div class="money-item republican-money">
							<div class="money-header" onclick="toggleMoneyDescription(this)">
								<div class="money-title">${escapeHtml(money.title)}</div>
								${money.description ? '<div class="money-arrow">▼</div>' : ''}
							</div>
							${money.description ? `<div class="money-description collapsed">${escapeHtml(money.description)}</div>` : ''}
							${money.category ? `<div class="money-category">${escapeHtml(money.category)}</div>` : ''}
							${renderMoneyLinks(money)}
						</div>
					`).join('') :
					`<div class="empty-state">
						<p>No Republican funding information available</p>
						<p>Check back later for updates</p>
					</div>`
				}
			</div>
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
	</script>
</body>
</html>
	`;
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
