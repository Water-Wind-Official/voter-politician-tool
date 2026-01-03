import type { Issue } from './types';

export function renderIssuesPage(democratIssues: Issue[], republicanIssues: Issue[], bothIssues: Issue[]): string {
	return `
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<title>Political Issues - Voter Politician Tool</title>
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
			display: grid;
			grid-template-columns: 1fr 2fr 1fr;
			gap: 2rem;
			align-items: start;
		}

		header {
			background: white;
			border-radius: 12px;
			padding: 2rem;
			margin-bottom: 2rem;
			box-shadow: 0 4px 6px rgba(0,0,0,0.1);
			grid-column: 1 / -1;
			text-align: center;
		}

		h1 {
			font-size: 3rem;
			margin-bottom: 0.5rem;
			background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
			-webkit-background-clip: text;
			-webkit-text-fill-color: transparent;
			background-clip: text;
		}

		.subtitle {
			color: #666;
			font-size: 1.2rem;
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

		.section {
			background: white;
			border-radius: 12px;
			padding: 2rem;
			box-shadow: 0 4px 6px rgba(0,0,0,0.1);
			min-height: 600px;
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
			background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(37, 99, 235, 0.05) 100%);
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
			background: linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.05) 100%);
			pointer-events: none;
		}

		.center-section {
			background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
			border: 2px solid #e5e7eb;
		}

		.section-header {
			display: flex;
			align-items: center;
			justify-content: center;
			margin-bottom: 2rem;
			padding-bottom: 1rem;
			border-bottom: 2px solid #e5e7eb;
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
			filter: drop-shadow(0 0 10px rgba(59, 130, 246, 0.5));
		}

		.elephant-icon {
			filter: drop-shadow(0 0 10px rgba(239, 68, 68, 0.5));
		}

		.section-title {
			font-size: 1.8rem;
			font-weight: 700;
			color: #333;
			text-align: center;
		}

		.democrat-title {
			color: #2563eb;
		}

		.republican-title {
			color: #dc2626;
		}

		.center-title {
			color: #374151;
		}

		.issues-list {
			position: relative;
			z-index: 1;
		}

		.issue-item {
			background: rgba(255, 255, 255, 0.9);
			border-radius: 8px;
			padding: 1.5rem;
			margin-bottom: 1rem;
			border-left: 4px solid;
			transition: transform 0.2s, box-shadow 0.2s;
			backdrop-filter: blur(10px);
		}

		.issue-item:hover {
			transform: translateY(-2px);
			box-shadow: 0 8px 16px rgba(0,0,0,0.1);
		}

		.democrat-issue {
			border-left-color: #3b82f6;
		}

		.republican-issue {
			border-left-color: #ef4444;
		}

		.both-issue {
			border-left-color: #6b7280;
		}

		.issue-title {
			font-size: 1.2rem;
			font-weight: 600;
			margin-bottom: 0.5rem;
			color: #1f2937;
		}

		.issue-links {
			position: absolute;
			bottom: 0.5rem;
			right: 0.5rem;
			display: flex;
			gap: 0.25rem;
		}

		.issue-link-superscript {
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

		.issue-link-superscript:hover {
			background: #2563eb;
			color: white;
			transform: scale(1.1);
		}

		/* Ensure issue items are positioned relatively for absolute positioning of links */
		.issue-item {
			position: relative;
			padding-bottom: 2rem; /* Make room for the superscript links */
		}

		.issue-description {
			color: #6b7280;
			line-height: 1.5;
		}

		.issue-category {
			display: inline-block;
			padding: 0.25rem 0.75rem;
			background: rgba(0,0,0,0.05);
			border-radius: 12px;
			font-size: 0.8rem;
			font-weight: 500;
			margin-top: 0.5rem;
			color: #374151;
		}

		.empty-state {
			text-align: center;
			padding: 3rem;
			color: #6b7280;
		}

		.empty-state p {
			font-size: 1.1rem;
			margin-bottom: 0.5rem;
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
			<h1>Political Issues</h1>
			<p class="subtitle">Key issues being addressed by both major political parties</p>
			<nav>
				<a href="/">← Back to Map</a>
				<a href="/senators">Senate Hub</a>
				<a href="/house">House Hub</a>
				<a href="/election">Election Hub</a>
			</nav>
		</header>

		<!-- Democrats Section (Left) -->
		<div class="section democrat-section">
			<div class="section-header">
				<svg class="section-icon donkey-icon" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
					<path d="M50 10c-5 0-10 5-10 10v10c0 5 5 10 10 10s10-5 10-10V20c0-5-5-10-10-10z" fill="#3b82f6"/>
					<path d="M30 40c-5 0-10 5-10 10v20c0 5 5 10 10 10h40c5 0 10-5 10-10V50c0-5-5-10-10-10H30z" fill="#3b82f6"/>
					<path d="M20 60c-5 0-10 5-10 10v10c0 5 5 10 10 10h10c5 0 10-5 10-10V70c0-5-5-10-10-10H20z" fill="#3b82f6"/>
					<path d="M70 60c-5 0-10 5-10 10v10c0 5 5 10 10 10h10c5 0 10-5 10-10V70c0-5-5-10-10-10H70z" fill="#3b82f6"/>
				</svg>
				<h2 class="section-title democrat-title">Democratic Issues</h2>
			</div>
			<div class="issues-list">
				${democratIssues.length > 0 ?
					democratIssues.map(issue => `
						<div class="issue-item democrat-issue">
							<div class="issue-title">${escapeHtml(issue.title)}</div>
							${issue.description ? `<div class="issue-description">${escapeHtml(issue.description)}</div>` : ''}
							${issue.category ? `<div class="issue-category">${escapeHtml(issue.category)}</div>` : ''}
							${renderIssueLinks(issue)}
						</div>
					`).join('') :
					`<div class="empty-state">
						<p>No Democratic issues available</p>
						<p>Check back later for updates</p>
					</div>`
				}
			</div>
		</div>

		<!-- Center Section (Both Parties) -->
		<div class="section center-section">
			<div class="section-header">
				<h2 class="section-title center-title">Bipartisan Issues</h2>
			</div>
			<div class="issues-list">
				${bothIssues.length > 0 ?
					bothIssues.map(issue => `
						<div class="issue-item both-issue">
							<div class="issue-title">${escapeHtml(issue.title)}</div>
							${issue.description ? `<div class="issue-description">${escapeHtml(issue.description)}</div>` : ''}
							${issue.category ? `<div class="issue-category">${escapeHtml(issue.category)}</div>` : ''}
							${renderIssueLinks(issue)}
						</div>
					`).join('') :
					`<div class="empty-state">
						<p>No bipartisan issues available</p>
						<p>Issues that affect both parties will appear here</p>
					</div>`
				}
			</div>
		</div>

		<!-- Republicans Section (Right) -->
		<div class="section republican-section">
			<div class="section-header">
				<svg class="section-icon elephant-icon" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
					<path d="M50 10c-5 0-10 5-10 10v10c0 5 5 10 10 10s10-5 10-10V20c0-5-5-10-10-10z" fill="#ef4444"/>
					<path d="M30 40c-5 0-10 5-10 10v20c0 5 5 10 10 10h40c5 0 10-5 10-10V50c0-5-5-10-10-10H30z" fill="#ef4444"/>
					<path d="M15 55c-5 0-10 5-10 10v5c0 5 5 10 10 10h15c5 0 10-5 10-10v-5c0-5-5-10-10-10H15z" fill="#ef4444"/>
					<path d="M70 55c-5 0-10 5-10 10v5c0 5 5 10 10 10h15c5 0 10-5 10-10v-5c0-5-5-10-10-10H70z" fill="#ef4444"/>
					<path d="M45 65c-3 0-5 2-5 5v5c0 3 2 5 5 5s5-2 5-5v-5c0-3-2-5-5-5z" fill="#ef4444"/>
				</svg>
				<h2 class="section-title republican-title">Republican Issues</h2>
			</div>
			<div class="issues-list">
				${republicanIssues.length > 0 ?
					republicanIssues.map(issue => `
						<div class="issue-item republican-issue">
							<div class="issue-title">${escapeHtml(issue.title)}</div>
							${issue.description ? `<div class="issue-description">${escapeHtml(issue.description)}</div>` : ''}
							${issue.category ? `<div class="issue-category">${escapeHtml(issue.category)}</div>` : ''}
							${renderIssueLinks(issue)}
						</div>
					`).join('') :
					`<div class="empty-state">
						<p>No Republican issues available</p>
						<p>Check back later for updates</p>
					</div>`
				}
			</div>
		</div>
	</div>
</body>
</html>
	`;
}

function renderIssueLinks(issue: any): string {
	const links = [];
	if (issue.link1) links.push({ url: issue.link1, number: 1 });
	if (issue.link2) links.push({ url: issue.link2, number: 2 });
	if (issue.link3) links.push({ url: issue.link3, number: 3 });
	if (issue.link4) links.push({ url: issue.link4, number: 4 });
	if (issue.link5) links.push({ url: issue.link5, number: 5 });
	if (issue.link6) links.push({ url: issue.link6, number: 6 });

	if (links.length === 0) return '';

	return `<div class="issue-links">
		${links.map(link => `<a href="${escapeHtml(link.url)}" target="_blank" class="issue-link-superscript">${link.number}</a>`).join('')}
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