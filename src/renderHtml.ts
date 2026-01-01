import type { Politician, VotingRecord } from './types';

export function renderPoliticianList(
	politicians: Politician[],
	selectedState?: string | null,
	selectedChamber?: string | null
): string {
	const states = Array.from(new Set(politicians.map(p => p.state))).sort();
	
	return `
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<title>Politician Voting Records</title>
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
		}
		
		.filters {
			background: white;
			border-radius: 12px;
			padding: 1.5rem;
			margin-bottom: 2rem;
			box-shadow: 0 4px 6px rgba(0,0,0,0.1);
			display: flex;
			gap: 1rem;
			flex-wrap: wrap;
			align-items: center;
		}
		
		.filters label {
			font-weight: 600;
			color: #555;
		}
		
		.filters select {
			padding: 0.5rem 1rem;
			border: 2px solid #e0e0e0;
			border-radius: 8px;
			font-size: 1rem;
			background: white;
			cursor: pointer;
			transition: border-color 0.2s;
		}
		
		.filters select:hover {
			border-color: #667eea;
		}
		
		.filters select:focus {
			outline: none;
			border-color: #667eea;
		}
		
		.btn {
			padding: 0.5rem 1.5rem;
			background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
			color: white;
			border: none;
			border-radius: 8px;
			font-size: 1rem;
			font-weight: 600;
			cursor: pointer;
			transition: transform 0.2s, box-shadow 0.2s;
			text-decoration: none;
			display: inline-block;
		}
		
		.btn:hover {
			transform: translateY(-2px);
			box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
		}
		
		.politicians-grid {
			display: grid;
			grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
			gap: 1.5rem;
		}
		
		.politician-card {
			background: white;
			border-radius: 12px;
			padding: 1.5rem;
			box-shadow: 0 4px 6px rgba(0,0,0,0.1);
			transition: transform 0.2s, box-shadow 0.2s;
			cursor: pointer;
			text-decoration: none;
			color: inherit;
			display: block;
		}
		
		.politician-card:hover {
			transform: translateY(-4px);
			box-shadow: 0 8px 16px rgba(0,0,0,0.15);
		}
		
		.politician-name {
			font-size: 1.5rem;
			font-weight: 700;
			margin-bottom: 0.5rem;
			color: #333;
		}
		
		.politician-info {
			display: flex;
			flex-direction: column;
			gap: 0.5rem;
			margin-top: 1rem;
		}
		
		.info-item {
			display: flex;
			align-items: center;
			gap: 0.5rem;
			font-size: 0.95rem;
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
			background: white;
			border-radius: 12px;
			padding: 3rem;
			text-align: center;
			box-shadow: 0 4px 6px rgba(0,0,0,0.1);
		}
		
		.empty-state h2 {
			color: #666;
			margin-bottom: 1rem;
		}
		
		.legal-notice {
			background: white;
			border-radius: 12px;
			padding: 1.5rem;
			margin-top: 2rem;
			box-shadow: 0 4px 6px rgba(0,0,0,0.1);
			font-size: 0.9rem;
			color: #666;
			line-height: 1.6;
		}
		
		.legal-notice strong {
			color: #333;
		}
	</style>
</head>
<body>
	<div class="container">
		<header>
			<h1>🏛️ Politician Voting Records</h1>
			<p class="subtitle">Explore how members of Congress vote on important issues</p>
		</header>
		
		<div class="filters">
			<label for="state-filter">State:</label>
			<select id="state-filter" onchange="applyFilters()">
				<option value="">All States</option>
				${states.map(state => `
					<option value="${state}" ${selectedState === state ? 'selected' : ''}>${state}</option>
				`).join('')}
			</select>
			
			<label for="chamber-filter">Chamber:</label>
			<select id="chamber-filter" onchange="applyFilters()">
				<option value="">All Chambers</option>
				<option value="house" ${selectedChamber === 'house' ? 'selected' : ''}>House of Representatives</option>
				<option value="senate" ${selectedChamber === 'senate' ? 'selected' : ''}>Senate</option>
			</select>
			
			<a href="/sync" class="btn" style="margin-left: auto;">🔄 Sync Data</a>
		</div>
		
		${politicians.length === 0 ? `
			<div class="empty-state">
				<h2>No politicians found</h2>
				<p>Try adjusting your filters or <a href="/sync">sync data from Congress.gov</a></p>
			</div>
		` : `
			<div class="politicians-grid">
				${politicians.map(p => `
					<a href="/politician/${p.id}" class="politician-card">
						<div class="politician-name">${escapeHtml(p.name)}</div>
						<div class="politician-info">
							<div class="info-item">
								<strong>State:</strong> ${escapeHtml(p.state)}
							</div>
							<div class="info-item">
								<strong>Chamber:</strong> ${p.chamber === 'house' ? 'House' : 'Senate'}
								${p.district ? ` - District ${p.district}` : ''}
							</div>
							${p.party ? `
								<span class="badge badge-${p.party.toLowerCase()}">${escapeHtml(p.party)}</span>
							` : ''}
						</div>
					</a>
				`).join('')}
			</div>
		`}
		
		<div class="legal-notice">
			<strong>Legal Notice:</strong> This website displays public voting records and information about elected officials. 
			All data is sourced from the <a href="https://api.congress.gov/" target="_blank">Congress.gov API</a> 
			and is used in accordance with their terms of service. Voting records are matters of public record and may be freely republished.
		</div>
	</div>
	
	<script>
		function applyFilters() {
			const state = document.getElementById('state-filter').value;
			const chamber = document.getElementById('chamber-filter').value;
			const params = new URLSearchParams();
			if (state) params.set('state', state);
			if (chamber) params.set('chamber', chamber);
			window.location.href = '/' + (params.toString() ? '?' + params.toString() : '');
		}
	</script>
</body>
</html>
	`;
}

export function renderPoliticianProfile(
	politician: Politician,
	votes: Array<VotingRecord & { vote: any }>
): string {
	const partyClass = politician.party?.toLowerCase() || 'independent';
	
	return `
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<title>${escapeHtml(politician.name)} - Voting Record</title>
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
			max-width: 1000px;
			margin: 0 auto;
		}
		
		.back-link {
			display: inline-block;
			margin-bottom: 1rem;
			color: white;
			text-decoration: none;
			font-weight: 600;
			opacity: 0.9;
		}
		
		.back-link:hover {
			opacity: 1;
		}
		
		.profile-header {
			background: white;
			border-radius: 12px;
			padding: 2rem;
			margin-bottom: 2rem;
			box-shadow: 0 4px 6px rgba(0,0,0,0.1);
		}
		
		.profile-name {
			font-size: 2.5rem;
			margin-bottom: 1rem;
			color: #333;
		}
		
		.profile-details {
			display: grid;
			grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
			gap: 1rem;
			margin-top: 1.5rem;
		}
		
		.detail-item {
			display: flex;
			flex-direction: column;
		}
		
		.detail-label {
			font-size: 0.85rem;
			color: #666;
			text-transform: uppercase;
			letter-spacing: 0.5px;
			margin-bottom: 0.25rem;
		}
		
		.detail-value {
			font-size: 1.1rem;
			font-weight: 600;
			color: #333;
		}
		
		.badge {
			display: inline-block;
			padding: 0.5rem 1rem;
			border-radius: 20px;
			font-size: 0.9rem;
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
		
		.social-links {
			display: flex;
			gap: 1rem;
			margin-top: 1rem;
		}
		
		.social-link {
			padding: 0.5rem 1rem;
			background: #f3f4f6;
			border-radius: 8px;
			text-decoration: none;
			color: #333;
			font-weight: 600;
			transition: background 0.2s;
		}
		
		.social-link:hover {
			background: #e5e7eb;
		}
		
		.votes-section {
			background: white;
			border-radius: 12px;
			padding: 2rem;
			box-shadow: 0 4px 6px rgba(0,0,0,0.1);
		}
		
		.section-title {
			font-size: 1.8rem;
			margin-bottom: 1.5rem;
			color: #333;
		}
		
		.vote-item {
			border-left: 4px solid #e5e7eb;
			padding: 1rem;
			margin-bottom: 1rem;
			background: #f9fafb;
			border-radius: 0 8px 8px 0;
			transition: border-color 0.2s;
		}
		
		.vote-item:hover {
			border-color: #667eea;
		}
		
		.vote-item.yes {
			border-color: #10b981;
		}
		
		.vote-item.no {
			border-color: #ef4444;
		}
		
		.vote-item.not-voting {
			border-color: #6b7280;
		}
		
		.vote-header {
			display: flex;
			justify-content: space-between;
			align-items: start;
			margin-bottom: 0.5rem;
		}
		
		.vote-position {
			padding: 0.25rem 0.75rem;
			border-radius: 20px;
			font-size: 0.85rem;
			font-weight: 600;
		}
		
		.vote-position.yes {
			background: #10b981;
			color: white;
		}
		
		.vote-position.no {
			background: #ef4444;
			color: white;
		}
		
		.vote-position.not-voting {
			background: #6b7280;
			color: white;
		}
		
		.vote-position.present {
			background: #f59e0b;
			color: white;
		}
		
		.vote-title {
			font-weight: 600;
			font-size: 1.1rem;
			margin-bottom: 0.5rem;
			color: #333;
		}
		
		.vote-description {
			color: #666;
			margin-bottom: 0.5rem;
			line-height: 1.5;
		}
		
		.vote-meta {
			display: flex;
			gap: 1rem;
			font-size: 0.85rem;
			color: #999;
			margin-top: 0.5rem;
		}
		
		.twitter-embed {
			margin-top: 2rem;
			padding: 1.5rem;
			background: #f9fafb;
			border-radius: 8px;
		}
		
		.twitter-embed h3 {
			margin-bottom: 1rem;
			color: #333;
		}
		
		.empty-votes {
			text-align: center;
			padding: 3rem;
			color: #666;
		}
	</style>
</head>
<body>
	<div class="container">
		<a href="/" class="back-link">← Back to All Politicians</a>
		
		<div class="profile-header">
			<h1 class="profile-name">${escapeHtml(politician.name)}</h1>
			${politician.party ? `<span class="badge badge-${partyClass}">${escapeHtml(politician.party)}</span>` : ''}
			
			<div class="profile-details">
				<div class="detail-item">
					<div class="detail-label">State</div>
					<div class="detail-value">${escapeHtml(politician.state)}</div>
				</div>
				<div class="detail-item">
					<div class="detail-label">Chamber</div>
					<div class="detail-value">${politician.chamber === 'house' ? 'House of Representatives' : 'Senate'}</div>
				</div>
				${politician.district ? `
				<div class="detail-item">
					<div class="detail-label">District</div>
					<div class="detail-value">${escapeHtml(politician.district)}</div>
				</div>
				` : ''}
			</div>
			
			<div class="social-links">
				${politician.twitter_handle ? `
					<a href="https://twitter.com/${escapeHtml(politician.twitter_handle)}" target="_blank" class="social-link">
						🐦 Twitter: @${escapeHtml(politician.twitter_handle)}
					</a>
				` : ''}
				${politician.website ? `
					<a href="${escapeHtml(politician.website)}" target="_blank" class="social-link">
						🌐 Official Website
					</a>
				` : ''}
			</div>
		</div>
		
		<div class="votes-section">
			<h2 class="section-title">Voting Record</h2>
			${votes.length === 0 ? `
				<div class="empty-votes">
					<p>No voting records available yet. <a href="/sync">Sync data from Congress.gov</a> to see voting history.</p>
				</div>
			` : votes.map(v => {
				const positionClass = v.position.toLowerCase().replace(' ', '-');
				return `
					<div class="vote-item ${positionClass}">
						<div class="vote-header">
							<div class="vote-title">${escapeHtml(v.vote.bill_title || v.vote.question || v.vote.description || 'Vote')}</div>
							<span class="vote-position ${positionClass}">${escapeHtml(v.position)}</span>
						</div>
						${v.vote.description ? `<div class="vote-description">${escapeHtml(v.vote.description)}</div>` : ''}
						${v.vote.bill_number ? `<div class="vote-meta"><strong>Bill:</strong> ${escapeHtml(v.vote.bill_number)}</div>` : ''}
						<div class="vote-meta">
							<span><strong>Date:</strong> ${formatDate(v.vote.date)}</span>
							${v.vote.result ? `<span><strong>Result:</strong> ${escapeHtml(v.vote.result)}</span>` : ''}
						</div>
					</div>
				`;
			}).join('')}
		</div>
		
		${politician.twitter_handle ? `
		<div class="twitter-embed">
			<h3>Official Twitter Feed</h3>
			<p style="color: #666; margin-bottom: 1rem;">
				Note: To display tweets legally, we use Twitter's official embed widget. 
				Visit <a href="https://twitter.com/${escapeHtml(politician.twitter_handle)}" target="_blank">@${escapeHtml(politician.twitter_handle)}</a> 
				to view their official tweets, or implement Twitter's Timeline Widget for embedded display.
			</p>
			<p style="color: #666; font-size: 0.9rem;">
				<strong>Legal Note:</strong> We do not store or republish tweets directly. 
				For embedded display, use Twitter's official embed code which handles copyright compliance.
			</p>
		</div>
		` : ''}
	</div>
</body>
</html>
	`;
}

function escapeHtml(text: string | null | undefined): string {
	if (!text) return '';
	const map: Record<string, string> = {
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;',
		"'": '&#039;'
	};
	return text.replace(/[&<>"']/g, (m) => map[m]);
}

function formatDate(dateString: string): string {
	try {
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', { 
			year: 'numeric', 
			month: 'long', 
			day: 'numeric' 
		});
	} catch {
		return dateString;
	}
}
