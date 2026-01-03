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
			max-width: 1200px;
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
			opacity: 0.9;
			position: relative;
			z-index: 1;
		}
		
		.filters {
			background: linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(51, 65, 85, 0.9) 100%);
			backdrop-filter: blur(20px);
			border: 1px solid rgba(148, 163, 184, 0.2);
			border-radius: 16px;
			padding: 1.5rem;
			margin-bottom: 2rem;
			box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(148, 163, 184, 0.1);
			display: flex;
			gap: 1rem;
			flex-wrap: wrap;
			align-items: center;
			position: relative;
		}

		.filters::before {
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

		.filters label {
			font-weight: 600;
			color: #f1f5f9;
			position: relative;
			z-index: 1;
		}

		.filters select {
			padding: 0.5rem 1rem;
			border: 2px solid rgba(148, 163, 184, 0.3);
			border-radius: 12px;
			font-size: 1rem;
			background: rgba(255, 255, 255, 0.1);
			backdrop-filter: blur(10px);
			color: #f1f5f9;
			cursor: pointer;
			transition: all 0.3s ease;
			position: relative;
			z-index: 1;
		}

		.filters select:hover {
			border-color: rgba(59, 130, 246, 0.5);
			background: rgba(255, 255, 255, 0.15);
		}

		.filters select:focus {
			outline: none;
			border-color: #60a5fa;
			box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
		}
		
		.btn {
			padding: 0.5rem 1.5rem;
			background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
			color: white;
			border: none;
			border-radius: 12px;
			font-size: 1rem;
			font-weight: 600;
			cursor: pointer;
			transition: all 0.3s ease;
			text-decoration: none;
			display: inline-block;
			border: 1px solid rgba(255, 255, 255, 0.2);
			position: relative;
			z-index: 1;
		}

		.btn:hover:not(:disabled) {
			transform: translateY(-3px) scale(1.02);
			box-shadow: 0 8px 25px rgba(59, 130, 246, 0.5);
		}

		.btn:disabled {
			opacity: 0.6;
			cursor: not-allowed;
			transform: none;
		}
		
		@keyframes spin {
			from { transform: rotate(0deg); }
			to { transform: rotate(360deg); }
		}
		
		.syncing {
			animation: spin 1s linear infinite;
		}
		
		.politicians-grid {
			display: grid;
			grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
			gap: 1.5rem;
		}
		
		.politician-card {
			background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
			backdrop-filter: blur(10px);
			border: 1px solid rgba(148, 163, 184, 0.2);
			border-radius: 16px;
			padding: 1.5rem;
			box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
			transition: all 0.3s ease;
			cursor: pointer;
			text-decoration: none;
			color: inherit;
			display: block;
			position: relative;
		}

		.politician-card:hover {
			transform: translateY(-6px) scale(1.01);
			box-shadow: 0 12px 30px rgba(0, 0, 0, 0.25);
			border-color: rgba(148, 163, 184, 0.4);
		}

		.politician-name {
			font-size: 1.5rem;
			font-weight: 700;
			margin-bottom: 0.5rem;
			color: #f1f5f9;
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
			color: #cbd5e1;
			opacity: 0.9;
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
			background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
			color: white;
			box-shadow: 0 0 10px rgba(59, 130, 246, 0.3);
		}

		.badge-republican {
			background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
			color: white;
			box-shadow: 0 0 10px rgba(239, 68, 68, 0.3);
		}

		.badge-independent {
			background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
			color: white;
			box-shadow: 0 0 10px rgba(107, 114, 128, 0.3);
		}
		
		.empty-state {
			background: linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(51, 65, 85, 0.9) 100%);
			backdrop-filter: blur(20px);
			border: 1px solid rgba(148, 163, 184, 0.2);
			border-radius: 16px;
			padding: 3rem;
			text-align: center;
			box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(148, 163, 184, 0.1);
			position: relative;
		}

		.empty-state::before {
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

		.empty-state h2 {
			color: #cbd5e1;
			margin-bottom: 1rem;
			position: relative;
			z-index: 1;
		}

		.legal-notice {
			background: linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(51, 65, 85, 0.9) 100%);
			backdrop-filter: blur(20px);
			border: 1px solid rgba(148, 163, 184, 0.2);
			border-radius: 16px;
			padding: 1.5rem;
			margin-top: 2rem;
			box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(148, 163, 184, 0.1);
			font-size: 0.9rem;
			color: #cbd5e1;
			line-height: 1.6;
			position: relative;
		}

		.legal-notice::before {
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

		.legal-notice strong {
			color: #f1f5f9;
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
			
			<button id="sync-btn" class="btn" style="margin-left: auto;" onclick="syncData()">🔄 Sync Data</button>
			<div id="sync-status" style="display: none; margin-left: 1rem; color: white; font-weight: 600;"></div>
		</div>
		
		${politicians.length === 0 ? `
			<div class="empty-state">
				<h2>No politicians found</h2>
				<p>Try adjusting your filters or <button onclick="syncData()" class="btn" style="margin-top: 1rem;">🔄 Sync Data from Congress.gov</button></p>
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
		
		async function syncData() {
			const btn = document.getElementById('sync-btn');
			const status = document.getElementById('sync-status');
			
			if (!btn || !status) {
				// If elements don't exist (e.g., on politician profile page), navigate to sync
				window.location.href = '/sync';
				return;
			}
			
			// Disable button and show loading
			btn.disabled = true;
			btn.innerHTML = '⏳ Syncing...';
			btn.classList.add('syncing');
			status.style.display = 'block';
			status.textContent = 'Syncing data from Congress.gov...';
			status.style.color = '#fff';
			
			try {
				const response = await fetch('/sync');
				const data = await response.json();
				
				if (data.success) {
					status.textContent = \`✅ Success! Synced \${data.houseMembers || 0} House members and \${data.senateMembers || 0} Senate members. Refreshing...\`;
					status.style.color = '#10b981';
					
					// Wait a moment then refresh the page to show new data
					setTimeout(() => {
						window.location.reload();
					}, 2000);
				} else {
					status.textContent = \`❌ Error: \${data.error || 'Unknown error'}\`;
					status.style.color = '#ef4444';
					btn.disabled = false;
					btn.innerHTML = '🔄 Sync Data';
					btn.classList.remove('syncing');
				}
			} catch (error) {
				status.textContent = \`❌ Error: \${error.message}\`;
				status.style.color = '#ef4444';
				btn.disabled = false;
				btn.innerHTML = '🔄 Sync Data';
				btn.classList.remove('syncing');
			}
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
			max-width: 1000px;
			margin: 0 auto;
		}
		
		.back-link {
			display: inline-block;
			margin-bottom: 1rem;
			color: #93c5fd;
			text-decoration: none;
			font-weight: 600;
			opacity: 0.9;
			transition: all 0.3s ease;
		}

		.back-link:hover {
			opacity: 1;
			color: #dbeafe;
			transform: translateX(-2px);
		}
		
		.profile-header {
			background: linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(51, 65, 85, 0.95) 100%);
			backdrop-filter: blur(20px);
			border: 1px solid rgba(148, 163, 184, 0.2);
			border-radius: 16px;
			padding: 2.5rem;
			margin-bottom: 2rem;
			box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(148, 163, 184, 0.1);
			position: relative;
		}

		.profile-header::before {
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
		
		.profile-header {
			background: linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(51, 65, 85, 0.95) 100%);
			backdrop-filter: blur(20px);
			border: 1px solid rgba(148, 163, 184, 0.2);
			border-radius: 16px;
			padding: 2rem;
			margin-bottom: 2rem;
			box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(148, 163, 184, 0.1);
			text-align: center;
			position: relative;
		}

		.profile-header::before {
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

		.profile-name {
			font-size: 2.5rem;
			margin-bottom: 1rem;
			color: #ffffff;
			font-weight: 800;
			letter-spacing: -0.025em;
			position: relative;
			z-index: 1;
			text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
		}

		.profile-position {
			font-size: 1.2rem;
			color: #cbd5e1;
			margin-bottom: 1rem;
			font-weight: 500;
			opacity: 0.9;
			position: relative;
			z-index: 1;
		}

		.profile-details {
			display: grid;
			grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
			gap: 1.5rem;
			margin-top: 1.5rem;
			position: relative;
			z-index: 1;
		}

		.detail-item {
			background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
			backdrop-filter: blur(10px);
			border: 1px solid rgba(148, 163, 184, 0.2);
			border-radius: 12px;
			padding: 1rem;
			text-align: center;
			transition: all 0.3s ease;
		}

		.detail-item:hover {
			transform: translateY(-2px);
			box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
			border-color: rgba(148, 163, 184, 0.4);
		}

		.detail-label {
			font-size: 0.8rem;
			color: #94a3b8;
			text-transform: uppercase;
			letter-spacing: 1px;
			margin-bottom: 0.5rem;
			opacity: 0.8;
			font-weight: 600;
		}

		.detail-value {
			font-size: 1.2rem;
			font-weight: 700;
			color: #f1f5f9;
		}
		
		.badge {
			display: inline-block;
			padding: 0.75rem 1.5rem;
			border-radius: 25px;
			font-size: 1rem;
			font-weight: 700;
			margin-top: 1rem;
			position: relative;
			z-index: 1;
			text-transform: uppercase;
			letter-spacing: 0.5px;
		}

		.badge-democrat {
			background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
			color: white;
			box-shadow: 0 0 15px rgba(59, 130, 246, 0.4);
		}

		.badge-republican {
			background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
			color: white;
			box-shadow: 0 0 15px rgba(239, 68, 68, 0.4);
		}

		.badge-independent {
			background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
			color: white;
			box-shadow: 0 0 15px rgba(107, 114, 128, 0.4);
		}

		.state-info-section {
			background: linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(51, 65, 85, 0.9) 100%);
			backdrop-filter: blur(20px);
			border: 1px solid rgba(148, 163, 184, 0.2);
			border-radius: 16px;
			padding: 2rem;
			margin-bottom: 2rem;
			box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(148, 163, 184, 0.1);
			position: relative;
		}

		.state-info-section::before {
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

		.state-info-title {
			font-size: 1.5rem;
			font-weight: 700;
			color: #60a5fa;
			margin-bottom: 1.5rem;
			padding-bottom: 0.5rem;
			border-bottom: 2px solid rgba(148, 163, 184, 0.3);
			position: relative;
			z-index: 1;
			text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
		}

		.state-stats {
			display: grid;
			grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
			gap: 1.5rem;
			position: relative;
			z-index: 1;
		}

		.stat-item {
			text-align: center;
			padding: 1rem;
			background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
			backdrop-filter: blur(10px);
			border: 1px solid rgba(148, 163, 184, 0.2);
			border-radius: 12px;
			transition: all 0.3s ease;
		}

		.stat-item:hover {
			transform: translateY(-2px);
			box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
			border-color: rgba(148, 163, 184, 0.4);
		}

		.stat-value {
			font-size: 1.8rem;
			font-weight: 700;
			color: #60a5fa;
			margin-bottom: 0.25rem;
		}

		.stat-label {
			font-size: 0.9rem;
			color: #cbd5e1;
			opacity: 0.9;
		}

		.contact-section {
			background: linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(51, 65, 85, 0.9) 100%);
			backdrop-filter: blur(20px);
			border: 1px solid rgba(148, 163, 184, 0.2);
			border-radius: 16px;
			padding: 2rem;
			margin-bottom: 2rem;
			box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(148, 163, 184, 0.1);
			position: relative;
		}

		.contact-section::before {
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

		.contact-title {
			font-size: 1.5rem;
			font-weight: 700;
			color: #60a5fa;
			margin-bottom: 1.5rem;
			padding-bottom: 0.5rem;
			border-bottom: 2px solid rgba(148, 163, 184, 0.3);
			position: relative;
			z-index: 1;
			text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
		}

		.social-links {
			display: grid;
			grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
			gap: 1rem;
			position: relative;
			z-index: 1;
		}

		.social-link {
			display: block;
			padding: 1rem;
			background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
			backdrop-filter: blur(10px);
			border: 1px solid rgba(148, 163, 184, 0.2);
			border-radius: 12px;
			color: #93c5fd;
			text-decoration: none;
			font-weight: 600;
			transition: all 0.3s ease;
			text-align: center;
		}

		.social-link:hover {
			background: linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(37, 99, 235, 0.1) 100%);
			border-color: rgba(59, 130, 246, 0.5);
			color: #dbeafe;
			transform: translateY(-2px);
			box-shadow: 0 4px 16px rgba(59, 130, 246, 0.3);
		}
		
		.social-links {
			display: flex;
			gap: 1rem;
			margin-top: 1rem;
		}

		.social-link {
			padding: 0.5rem 1rem;
			background: rgba(148, 163, 184, 0.2);
			backdrop-filter: blur(10px);
			border: 1px solid rgba(148, 163, 184, 0.3);
			border-radius: 12px;
			text-decoration: none;
			color: #f1f5f9;
			font-weight: 600;
			transition: all 0.3s ease;
		}

		.social-link:hover {
			background: rgba(148, 163, 184, 0.3);
			border-color: rgba(148, 163, 184, 0.5);
			transform: translateY(-1px);
		}
		
		.votes-section {
			background: linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(51, 65, 85, 0.9) 100%);
			backdrop-filter: blur(20px);
			border: 1px solid rgba(148, 163, 184, 0.2);
			border-radius: 16px;
			padding: 2rem;
			box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(148, 163, 184, 0.1);
			position: relative;
		}

		.votes-section::before {
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

		.section-title {
			font-size: 1.8rem;
			margin-bottom: 1.5rem;
			color: #f1f5f9;
			position: relative;
			z-index: 1;
			text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
		}
		
		.vote-item {
			border-left: 4px solid rgba(148, 163, 184, 0.3);
			padding: 1rem;
			margin-bottom: 1rem;
			background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
			backdrop-filter: blur(10px);
			border: 1px solid rgba(148, 163, 184, 0.2);
			border-radius: 0 12px 12px 0;
			transition: all 0.3s ease;
			position: relative;
			z-index: 1;
		}

		.vote-item:hover {
			border-color: rgba(59, 130, 246, 0.5);
			transform: translateX(4px);
			box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
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
			background: linear-gradient(135deg, #10b981 0%, #059669 100%);
			color: white;
			box-shadow: 0 0 10px rgba(16, 185, 129, 0.3);
		}

		.vote-position.no {
			background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
			color: white;
			box-shadow: 0 0 10px rgba(239, 68, 68, 0.3);
		}

		.vote-position.not-voting {
			background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
			color: white;
			box-shadow: 0 0 10px rgba(107, 114, 128, 0.3);
		}

		.vote-position.present {
			background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
			color: white;
			box-shadow: 0 0 10px rgba(245, 158, 11, 0.3);
		}
		
		.vote-title {
			font-weight: 600;
			font-size: 1.1rem;
			margin-bottom: 0.5rem;
			color: #f1f5f9;
		}

		.vote-description {
			color: #cbd5e1;
			margin-bottom: 0.5rem;
			line-height: 1.5;
			opacity: 0.9;
		}

		.vote-meta {
			display: flex;
			gap: 1rem;
			font-size: 0.85rem;
			color: #94a3b8;
			margin-top: 0.5rem;
		}
		
		.twitter-embed {
			margin-top: 2rem;
			padding: 1.5rem;
			background: linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(51, 65, 85, 0.9) 100%);
			backdrop-filter: blur(20px);
			border: 1px solid rgba(148, 163, 184, 0.2);
			border-radius: 12px;
			position: relative;
		}

		.twitter-embed::before {
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			background: linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(239, 68, 68, 0.05) 100%);
			border-radius: 12px;
			pointer-events: none;
		}

		.twitter-embed h3 {
			margin-bottom: 1rem;
			color: #f1f5f9;
			position: relative;
			z-index: 1;
		}
		
		.empty-votes {
			text-align: center;
			padding: 3rem;
			color: #94a3b8;
			position: relative;
			z-index: 1;
		}

		.party-icon {
			position: absolute;
			top: 2rem;
			right: 2rem;
			width: 50px;
			height: 50px;
			animation: bounce 2s infinite;
		}

		.donkey-icon {
			filter: drop-shadow(0 0 15px rgba(59, 130, 246, 0.6)) brightness(1.1);
		}

		.elephant-icon {
			filter: drop-shadow(0 0 15px rgba(239, 68, 68, 0.6)) brightness(1.1);
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
		<a href="/" class="back-link">← Back to All Politicians</a>

		<div class="profile-header">
			${renderPartyIcon(politician.party)}
			<h1 class="profile-name">${escapeHtml(politician.name)}</h1>
			<div class="profile-position">${politician.chamber === 'house' ? 'Representative' : 'Senator'}</div>
			${politician.party ? `<span class="badge badge-${partyClass}">${escapeHtml(politician.party)}</span>` : ''}

			<div class="profile-details">
				<div class="detail-item">
					<div class="detail-label">State</div>
					<div class="detail-value">${escapeHtml(politician.state)}</div>
				</div>
				<div class="detail-item">
					<div class="detail-label">Chamber</div>
					<div class="detail-value">${politician.chamber === 'house' ? 'House' : 'Senate'}</div>
				</div>
				${politician.district ? `
				<div class="detail-item">
					<div class="detail-label">District</div>
					<div class="detail-value">${escapeHtml(politician.district)}</div>
				</div>
				` : ''}
				${politician.term_start && politician.term_end ? `
				<div class="detail-item">
					<div class="detail-label">Term</div>
					<div class="detail-value">${formatDate(politician.term_start)} - ${formatDate(politician.term_end)}</div>
				</div>
				` : ''}
			</div>
		</div>

		${politician.state_data ? `
		<div class="state-info-section">
			<h2 class="state-info-title">📊 About ${escapeHtml(politician.state)}</h2>
			<div class="state-stats">
				<div class="stat-item">
					<div class="stat-value">${politician.state_data.registered_voters?.toLocaleString() || 'N/A'}</div>
					<div class="stat-label">Registered Voters</div>
				</div>
				<div class="stat-item">
					<div class="stat-value">${politician.state_data.voting_age_population?.toLocaleString() || 'N/A'}</div>
					<div class="stat-label">Voting Age Population</div>
				</div>
				<div class="stat-item">
					<div class="stat-value">${politician.state_data.registered_voter_turnout ? (politician.state_data.registered_voter_turnout * 100).toFixed(1) + '%' : 'N/A'}</div>
					<div class="stat-label">Voter Turnout</div>
				</div>
				<div class="stat-item">
					<div class="stat-value">${politician.state_data.citizen_turnout ? (politician.state_data.citizen_turnout * 100).toFixed(1) + '%' : 'N/A'}</div>
					<div class="stat-label">Citizen Turnout (18+)</div>
				</div>
			</div>
		</div>
		` : ''}

		<div class="contact-section">
			<h2 class="contact-title">📞 Contact Information</h2>
			<div class="social-links">
				${politician.office_phone ? `
					<a href="tel:${escapeHtml(politician.office_phone)}" class="social-link">
						📞 ${escapeHtml(politician.office_phone)}<br><small>Office Phone</small>
					</a>
				` : ''}
				${politician.email ? `
					<a href="mailto:${escapeHtml(politician.email)}" class="social-link">
						✉️ ${escapeHtml(politician.email)}<br><small>Email</small>
					</a>
				` : ''}
				${politician.twitter_handle ? `
					<a href="https://twitter.com/${escapeHtml(politician.twitter_handle)}" target="_blank" class="social-link">
						🐦 @${escapeHtml(politician.twitter_handle)}<br><small>Twitter</small>
					</a>
				` : ''}
				${politician.website ? `
					<a href="${escapeHtml(politician.website)}" target="_blank" class="social-link">
						🌐 Official Website<br><small>Congress.gov</small>
					</a>
				` : ''}
			</div>
		</div>
		
		<div class="votes-section">
			<h2 class="section-title">Voting Record</h2>
			${votes.length === 0 ? `
				<div class="empty-votes">
					<p>No voting records available yet. <button onclick="window.location.href='/sync'" class="btn" style="margin-top: 1rem;">🔄 Sync Data from Congress.gov</button></p>
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
