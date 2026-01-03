export function renderAdminLogin(): string {
	return `
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<title>Admin Login</title>
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
			display: flex;
			align-items: center;
			justify-content: center;
			padding: 2rem;
		}
		
		.login-container {
			background: white;
			border-radius: 12px;
			padding: 3rem;
			box-shadow: 0 10px 25px rgba(0,0,0,0.2);
			width: 100%;
			max-width: 400px;
		}
		
		h1 {
			font-size: 2rem;
			margin-bottom: 0.5rem;
			background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
			-webkit-background-clip: text;
			-webkit-text-fill-color: transparent;
			background-clip: text;
			text-align: center;
		}
		
		.subtitle {
			color: #666;
			text-align: center;
			margin-bottom: 2rem;
		}
		
		.form-group {
			margin-bottom: 1.5rem;
		}
		
		label {
			display: block;
			margin-bottom: 0.5rem;
			color: #333;
			font-weight: 600;
		}
		
		input {
			width: 100%;
			padding: 0.75rem;
			border: 2px solid #e0e0e0;
			border-radius: 8px;
			font-size: 1rem;
			transition: border-color 0.2s;
		}
		
		input:focus {
			outline: none;
			border-color: #667eea;
		}
		
		.btn {
			width: 100%;
			padding: 0.75rem;
			background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
			color: white;
			border: none;
			border-radius: 8px;
			font-size: 1rem;
			font-weight: 600;
			cursor: pointer;
			transition: transform 0.2s, box-shadow 0.2s;
		}
		
		.btn:hover {
			transform: translateY(-2px);
			box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
		}
		
		.error {
			background: #fee;
			color: #c33;
			padding: 0.75rem;
			border-radius: 8px;
			margin-bottom: 1rem;
			display: none;
		}
	</style>
</head>
<body>
	<div class="login-container">
		<h1>🔐 Admin Login</h1>
		<p class="subtitle">Enter password to access admin panel</p>
		<div id="error" class="error"></div>
		<form id="login-form">
			<div class="form-group">
				<label for="password">Password</label>
				<input type="password" id="password" name="password" required autofocus />
			</div>
			<button type="submit" class="btn">Login</button>
		</form>
	</div>
	<script>
		document.getElementById('login-form').addEventListener('submit', async (e) => {
			e.preventDefault();
			const password = document.getElementById('password').value;
			const errorDiv = document.getElementById('error');
			
			try {
				const response = await fetch('/admin/login', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ password })
				});
				
				if (response.ok) {
					window.location.href = '/admin';
				} else {
					errorDiv.textContent = 'Invalid password';
					errorDiv.style.display = 'block';
				}
			} catch (error) {
				errorDiv.textContent = 'Error: ' + error.message;
				errorDiv.style.display = 'block';
			}
		});
	</script>
</body>
</html>
	`;
}

export function renderAdminDashboard(data: any): string {
	const { states, representatives, voterData, issues } = data;
	
	return `
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<title>Admin Dashboard</title>
	<script>
		window.adminData = ${JSON.stringify(data).replace(/<\/script>/gi, '</scr"+"ipt>')};
	</script>
	<style>
		* {
			margin: 0;
			padding: 0;
			box-sizing: border-box;
		}
		
		body {
			font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
			background: #f5f5f5;
			min-height: 100vh;
			padding: 2rem;
		}
		
		.header {
			background: white;
			border-radius: 12px;
			padding: 2rem;
			margin-bottom: 2rem;
			box-shadow: 0 2px 4px rgba(0,0,0,0.1);
			display: flex;
			justify-content: space-between;
			align-items: center;
		}
		
		h1 {
			font-size: 2rem;
			background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
			-webkit-background-clip: text;
			-webkit-text-fill-color: transparent;
			background-clip: text;
		}
		
		.nav {
			display: flex;
			gap: 1rem;
		}
		
		.btn {
			padding: 0.5rem 1rem;
			background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
			color: white;
			border: none;
			border-radius: 8px;
			cursor: pointer;
			text-decoration: none;
			font-weight: 600;
			transition: transform 0.2s;
		}
		
		.btn:hover {
			transform: translateY(-2px);
		}
		
		.btn-secondary {
			background: #6b7280;
		}
		
		.tabs {
			display: flex;
			gap: 1rem;
			margin-bottom: 2rem;
			background: white;
			padding: 1rem;
			border-radius: 12px;
			box-shadow: 0 2px 4px rgba(0,0,0,0.1);
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
		
		.tab-content {
			display: none;
		}
		
		.tab-content.active {
			display: block;
		}
		
		.card {
			background: white;
			border-radius: 12px;
			padding: 2rem;
			margin-bottom: 2rem;
			box-shadow: 0 2px 4px rgba(0,0,0,0.1);
		}
		
		.card-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 1.5rem;
			padding-bottom: 1rem;
			border-bottom: 2px solid #e5e7eb;
		}
		
		.card-title {
			font-size: 1.5rem;
			font-weight: 700;
			color: #333;
		}
		
		.table {
			width: 100%;
			border-collapse: collapse;
		}
		
		.table th,
		.table td {
			padding: 0.75rem;
			text-align: left;
			border-bottom: 1px solid #e5e7eb;
		}
		
		.table th {
			background: #f9fafb;
			font-weight: 600;
			color: #333;
		}
		
		.table tr:hover {
			background: #f9fafb;
		}
		
		.form-grid {
			display: grid;
			grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
			gap: 1.5rem;
			margin-bottom: 1.5rem;
		}
		
		.form-group {
			display: flex;
			flex-direction: column;
		}
		
		.form-group label {
			margin-bottom: 0.5rem;
			font-weight: 600;
			color: #333;
		}
		
		.form-group input,
		.form-group select,
		.form-group textarea {
			padding: 0.75rem;
			border: 2px solid #e0e0e0;
			border-radius: 8px;
			font-size: 1rem;
			font-family: inherit;
		}
		
		.form-group textarea {
			min-height: 100px;
			resize: vertical;
		}
		
		.form-group input:focus,
		.form-group select:focus,
		.form-group textarea:focus {
			outline: none;
			border-color: #667eea;
		}
		
		.btn-small {
			padding: 0.25rem 0.75rem;
			font-size: 0.875rem;
		}
		
		.btn-danger {
			background: #ef4444;
		}
		
		.btn-success {
			background: #10b981;
		}
		
		.modal {
			display: none;
			position: fixed;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			background: rgba(0,0,0,0.5);
			z-index: 1000;
			align-items: center;
			justify-content: center;
		}
		
		.modal.active {
			display: flex;
		}
		
		.modal-content {
			background: white;
			border-radius: 12px;
			padding: 2rem;
			max-width: 600px;
			width: 90%;
			max-height: 90vh;
			overflow-y: auto;
		}
		
		.stats {
			display: grid;
			grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
			gap: 1rem;
			margin-bottom: 2rem;
		}
		
		.stat-card {
			background: white;
			padding: 1.5rem;
			border-radius: 12px;
			box-shadow: 0 2px 4px rgba(0,0,0,0.1);
		}
		
		.stat-value {
			font-size: 2rem;
			font-weight: 700;
			color: #667eea;
		}
		
		.stat-label {
			color: #666;
			margin-top: 0.5rem;
		}
	</style>
</head>
<body>
	<div class="header">
		<h1>⚙️ Admin Dashboard</h1>
		<div class="nav">
			<a href="/" class="btn btn-secondary">View Site</a>
			<button class="btn btn-secondary" onclick="logout()">Logout</button>
		</div>
	</div>
	
	<div class="stats">
		<div class="stat-card">
			<div class="stat-value">${representatives.length}</div>
			<div class="stat-label">Representatives</div>
		</div>
		<div class="stat-card">
			<div class="stat-value">${states.length}</div>
			<div class="stat-label">States</div>
		</div>
		<div class="stat-card">
			<div class="stat-value">${voterData.length}</div>
			<div class="stat-label">States with Voter Data</div>
		</div>
		<div class="stat-card">
			<div class="stat-value">${issues ? issues.length : 0}</div>
			<div class="stat-label">Issues</div>
		</div>
	</div>
	
	<div class="tabs">
		<button class="tab active" onclick="showTab('representatives', event)">Representatives</button>
		<button class="tab" onclick="showTab('voter-data', event)">Voter Data</button>
		<button class="tab" onclick="showTab('electoral-data', event)">Electoral Data</button>
		<button class="tab" onclick="showTab('issues', event)">Issues</button>
	</div>
	
	<div id="representatives" class="tab-content active">
		<div class="card">
			<div class="card-header">
				<h2 class="card-title">Representatives</h2>
				<button class="btn" onclick="openModal('rep-modal')">+ Add Representative</button>
			</div>
			<table class="table">
				<thead>
					<tr>
						<th>Name</th>
						<th>State</th>
						<th>Position</th>
						<th>District</th>
						<th>Party</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody>
					${representatives.map((r) => `
						<tr>
							<td>${escapeHtml(r.name)}</td>
							<td>${r.state_code}</td>
							<td>${r.chamber === 'house' ? 'House Representative' : 'Senator'}</td>
							<td>${r.district_number ? 'District ' + r.district_number : (r.chamber === 'house' ? 'At-Large' : 'N/A')}</td>
							<td>${r.party || '-'}</td>
							<td>
								<button class="btn btn-small" onclick="editRep(${r.id})">Edit</button>
								<button class="btn btn-small btn-danger" onclick="deleteRep(${r.id})">Delete</button>
							</td>
						</tr>
					`).join('')}
				</tbody>
			</table>
		</div>
	</div>
	
	<div id="voter-data" class="tab-content">
		<div class="card">
			<div class="card-header">
				<h2 class="card-title">Voter Data</h2>
				<div style="display: flex; gap: 1rem;">
					<button class="btn" onclick="openModal('voter-modal')">+ Add Voter Data</button>
				</div>
			</div>
			<table class="table">
				<thead>
					<tr>
						<th>State</th>
						<th>Registered Voters</th>
						<th>Reg. Voter Turnout*</th>
						<th>Citizen Turnout (18+)*</th>
						<th>Year</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody>
					${voterData.map((v) => `
						<tr>
							<td>${v.state_code}</td>
							<td>${v.total_registered_voters ? v.total_registered_voters.toLocaleString() : '-'}</td>
							<td>${v.total_voted && v.total_registered_voters ? (((v.total_voted / v.total_registered_voters) * 100).toFixed(1)) + '%' : '-'}</td>
							<td>${v.total_voted && v.voting_age_population ? (((v.total_voted / v.voting_age_population) * 100).toFixed(1)) + '%' : '-'}</td>
							<td>${v.data_year || '-'}</td>
							<td>
								<button class="btn btn-small" onclick="editVoterData('${v.state_code}', ${v.data_year})">Edit</button>
							</td>
						</tr>
					`).join('')}
				</tbody>
			</table>
		</div>
	</div>
	
	<div id="electoral-data" class="tab-content">
		<div class="card">
			<div class="card-header">
				<h2 class="card-title">Electoral Data</h2>
				<div style="display: flex; gap: 1rem;">
					<button class="btn" onclick="openModal('electoral-modal')">+ Add Electoral Data</button>
					<button class="btn btn-primary populate-electoral-btn" onclick="populateElectoralData()">📊 Populate 2024 Results</button>
				</div>
			</div>
			<div style="background: #f0f9ff; border-left: 4px solid #3b82f6; padding: 1rem; margin-bottom: 1.5rem; border-radius: 4px;">
				<p style="margin: 0; font-size: 0.9rem; color: #1e40af;">
					<strong>🗳️ Official Electoral Data Sources:</strong> Use official government sources only:
					<a href="https://www.fec.gov/introduction-campaign-finance/election-and-voting-information/" target="_blank" style="color: #3b82f6; text-decoration: underline;">FEC Election Information</a> | 
					<a href="https://www.archives.gov/electoral-college" target="_blank" style="color: #3b82f6; text-decoration: underline;">National Archives Electoral College</a> | 
					<a href="https://www.census.gov/data/tables/time-series/demo/voting-and-registration/voting-historical-time-series.html" target="_blank" style="color: #3b82f6; text-decoration: underline;">Census Bureau Voting Data</a> | 
					<a href="https://www.eac.gov/research-and-data" target="_blank" style="color: #3b82f6; text-decoration: underline;">EAC Election Data</a>
					<br><br>
					<strong>Legal Notice:</strong> Electoral vote results are matters of public record. This data reflects official election results from state-certified sources.
				</p>
			</div>
					<table class="table">
				<thead>
					<tr>
						<th>State</th>
						<th>Electoral Votes</th>
						<th>Winner</th>
						<th>Margin (%)</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody>
					${states.map((s) => {
						const winnerDisplay = s.electoral_winner || '-';
						const votesDisplay = s.electoral_votes || '-';
						const marginDisplay = s.electoral_margin ? s.electoral_margin.toFixed(1) + '%' : '-';
						return `
						<tr>
							<td><strong>${escapeHtml(s.code)}</strong> - ${escapeHtml(s.name)}</td>
							<td>${votesDisplay}</td>
							<td>${escapeHtml(winnerDisplay)}</td>
							<td>${marginDisplay}</td>
							<td>
								<button class="btn btn-small" onclick="editElectoral('${s.code}')">Edit</button>
							</td>
						</tr>
					`;
					}).join('')}
				</tbody>
			</table>
		</div>
	</div>

	<div id="issues" class="tab-content">
		<div class="card">
			<div class="card-header">
				<h2 class="card-title">Political Issues</h2>
				<button class="btn" onclick="openModal('issue-modal')">+ Add Issue</button>
			</div>
			<table class="table">
				<thead>
					<tr>
						<th>Title</th>
						<th>Party</th>
						<th>Category</th>
						<th>Priority</th>
						<th>Status</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody id="issues-table-body">
					<!-- Issues will be loaded dynamically -->
				</tbody>
			</table>
		</div>
	</div>

	<!-- Issue Modal -->
	<div id="issue-modal" class="modal">
		<div class="modal-content">
			<h2 style="margin-bottom: 1rem;">Add/Edit Issue</h2>
			<form id="issue-form" onsubmit="saveIssue(event)">
				<div class="form-grid">
					<div class="form-group" style="grid-column: 1 / -1;">
						<label>Title *</label>
						<input type="text" name="title" required>
					</div>
					<div class="form-group" style="grid-column: 1 / -1;">
						<label>Description</label>
						<textarea name="description" rows="3"></textarea>
					</div>
					<div class="form-group">
						<label>Party *</label>
						<select name="party" required>
							<option value="">Select Party</option>
							<option value="Democrat">Democrat</option>
							<option value="Republican">Republican</option>
							<option value="Both">Both Parties</option>
						</select>
					</div>
					<div class="form-group">
						<label>Category</label>
						<input type="text" name="category" placeholder="e.g., Economy, Healthcare">
					</div>
					<div class="form-group">
						<label>Priority</label>
						<input type="number" name="priority" value="0" min="0">
					</div>
					<div class="form-group">
						<label>Active</label>
						<input type="checkbox" name="is_active" checked>
					</div>
				</div>
				<div style="margin-top: 1.5rem; display: flex; gap: 1rem; justify-content: flex-end;">
					<button type="button" class="btn btn-secondary" onclick="closeModal('issue-modal')">Cancel</button>
					<button type="submit" class="btn">Save Issue</button>
				</div>
			</form>
		</div>
	</div>

	<!-- Representative Modal -->
	<div id="rep-modal" class="modal">
		<div class="modal-content">
			<h2 style="margin-bottom: 1rem;">Add/Edit Representative (House or Senate)</h2>
			<div style="background: #f0f9ff; border-left: 4px solid #3b82f6; padding: 1rem; margin-bottom: 1.5rem; border-radius: 4px;">
				<p style="margin: 0; font-size: 0.9rem; color: #1e40af;">
					<strong>📋 Official Sources:</strong> All information must be from public sources only. 
					Find current representatives at: 
					<a href="https://www.congress.gov/members" target="_blank" style="color: #3b82f6; text-decoration: underline;">Congress.gov</a> | 
					<a href="https://www.house.gov/representatives" target="_blank" style="color: #3b82f6; text-decoration: underline;">House.gov</a> | 
					<a href="https://www.senate.gov/senators" target="_blank" style="color: #3b82f6; text-decoration: underline;">Senate.gov</a> | 
					<a href="https://openstates.org" target="_blank" style="color: #3b82f6; text-decoration: underline;">Open States</a>
				</p>
			</div>
			<form id="rep-form" onsubmit="saveRep(event)">
				<div class="form-grid">
					<div class="form-group" style="grid-column: 1 / -1;">
						<label>Full Name *</label>
						<input type="text" name="name" required placeholder="e.g., John Smith" />
						<small style="color: #666; font-size: 0.85rem;">The representative's full official name</small>
					</div>
					<div class="form-group">
						<label>First Name</label>
						<input type="text" name="first_name" placeholder="John" />
					</div>
					<div class="form-group">
						<label>Last Name</label>
						<input type="text" name="last_name" placeholder="Smith" />
					</div>
					<div class="form-group">
						<label>State *</label>
						<select name="state_code" required>
							<option value="">Select State</option>
							${states.map((s) => `<option value="${s.code}">${s.name}</option>`).join('')}
						</select>
					</div>
					<div class="form-group">
						<label>Position *</label>
						<select name="chamber" required id="chamber-select" onchange="toggleDistrictField()">
							<option value="house">House of Representatives</option>
							<option value="senate">Senate</option>
						</select>
						<small style="color: #666; font-size: 0.85rem;">House Representative or Senator</small>
					</div>
					<div class="form-group" id="district-field" style="display: none;">
						<label>Congressional District</label>
						<input type="number" name="district_number" min="1" max="53" placeholder="e.g., 5" />
						<small style="color: #666; font-size: 0.85rem;">District number (only for House members - leave blank for at-large districts)</small>
					</div>
					<div class="form-group">
						<label>Political Party</label>
						<select name="party">
							<option value="">None</option>
							<option value="Democrat">Democrat</option>
							<option value="Republican">Republican</option>
							<option value="Independent">Independent</option>
							<option value="Libertarian">Libertarian</option>
						</select>
					</div>
					<div class="form-group" style="grid-column: 1 / -1;">
						<label>Washington Office Address</label>
						<input type="text" name="office_address" placeholder="e.g., 1234 Longworth House Office Building, Washington, DC 20515" />
						<small style="color: #666; font-size: 0.85rem;">Their office address in Washington, DC (public information)</small>
					</div>
					<div class="form-group">
						<label>Office Phone Number</label>
						<input type="tel" name="office_phone" placeholder="(202) 225-1234" />
						<small style="color: #666; font-size: 0.85rem;">Their Washington office phone number (public information)</small>
					</div>
					<div class="form-group">
						<label>Office Email Address</label>
						<input type="email" name="email" placeholder="firstname.lastname@mail.house.gov or firstname.lastname@senate.gov" />
						<small style="color: #666; font-size: 0.85rem;">Their official congressional email address (public information)</small>
					</div>
					<div class="form-group">
						<label>Official Website</label>
						<input type="url" name="website" placeholder="https://..." />
						<small style="color: #666; font-size: 0.85rem;">Their official website URL</small>
					</div>
					<div class="form-group">
						<label>Twitter Account</label>
						<input type="text" name="twitter_handle" placeholder="@username" />
						<small style="color: #666; font-size: 0.85rem;">Their official Twitter handle (without the @ symbol)</small>
					</div>
					<div class="form-group">
						<label>Facebook Page</label>
						<input type="url" name="facebook_url" placeholder="https://facebook.com/..." />
						<small style="color: #666; font-size: 0.85rem;">Link to their official Facebook page</small>
					</div>
					<div class="form-group" style="grid-column: 1 / -1;">
						<label>Biography</label>
						<textarea name="bio" rows="4" placeholder="Brief biography or background information..."></textarea>
						<small style="color: #666; font-size: 0.85rem;">Background information about the representative (from official sources only)</small>
					</div>
					<div class="form-group">
						<label>Current Term Started</label>
						<input type="date" name="term_start" />
						<small style="color: #666; font-size: 0.85rem;">When their current term in office began</small>
					</div>
					<div class="form-group">
						<label>Current Term Ends</label>
						<input type="date" name="term_end" />
						<small style="color: #666; font-size: 0.85rem;">When their current term in office ends</small>
					</div>
				</div>
				<div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 1rem; margin-top: 1.5rem; border-radius: 4px;">
					<p style="margin: 0; font-size: 0.85rem; color: #92400e;">
						<strong>⚠️ Important:</strong> Only enter information that is publicly available from official sources. 
						This form works for both House Representatives and Senators. For House members, include the district number. 
						For Senators, leave the district field blank. Do not include personal contact information or private addresses.
					</p>
				</div>
				<div style="display: flex; gap: 1rem; margin-top: 1.5rem;">
					<button type="submit" class="btn btn-success">Save Representative</button>
					<button type="button" class="btn btn-secondary" onclick="closeModal('rep-modal')">Cancel</button>
				</div>
				<input type="hidden" name="id" />
			</form>
		</div>
	</div>
	
	<!-- Voter Data Modal -->
	<div id="voter-modal" class="modal">
		<div class="modal-content">
			<h2 style="margin-bottom: 1rem;">Add/Edit Voter Data</h2>
			<div style="background: #f0f9ff; border-left: 4px solid #3b82f6; padding: 1rem; margin-bottom: 1.5rem; border-radius: 4px;">
				<p style="margin: 0; font-size: 0.9rem; color: #1e40af;">
					<strong>📊 Official Voter Data Sources:</strong> Use official government sources only:
					<a href="https://www.census.gov/data/tables/time-series/demo/voting-and-registration/voting-historical-time-series.html" target="_blank" style="color: #3b82f6; text-decoration: underline;">Census Bureau</a> | 
					<a href="https://www.eac.gov/research-and-data" target="_blank" style="color: #3b82f6; text-decoration: underline;">EAC Election Data</a> | 
					<a href="https://www.fec.gov/introduction-campaign-finance/election-and-voting-information/" target="_blank" style="color: #3b82f6; text-decoration: underline;">FEC Election Info</a> | 
					<a href="https://www.usa.gov/election-office" target="_blank" style="color: #3b82f6; text-decoration: underline;">State Election Offices</a>
				</p>
			</div>
			<form id="voter-form" onsubmit="saveVoterData(event)">
				<div class="form-grid">
					<div class="form-group">
						<label>State *</label>
						<select name="state_code" required>
							<option value="">Select State</option>
							${states.map((s) => `<option value="${s.code}">${s.name}</option>`).join('')}
						</select>
					</div>
					<div class="form-group">
						<label>Data Year *</label>
						<input type="number" name="data_year" required min="2000" max="2030" value="${new Date().getFullYear()}" />
						<small style="color: #666; font-size: 0.85rem;">Year this data represents</small>
					</div>
					<div class="form-group">
						<label>Total Registered Voters</label>
						<input type="number" name="total_registered_voters" min="0" placeholder="e.g., 7500000" />
						<small style="color: #666; font-size: 0.85rem;">Total number of registered voters (public record)</small>
					</div>
					<div class="form-group">
						<label>Total Population</label>
						<input type="number" name="total_population" min="0" placeholder="e.g., 10700000" />
						<small style="color: #666; font-size: 0.85rem;">Total state population (Census data)</small>
					</div>
					<div class="form-group">
						<label>Voting Age Population</label>
						<input type="number" name="voting_age_population" min="0" placeholder="e.g., 8500000" />
						<small style="color: #666; font-size: 0.85rem;">Population age 18+ (Census data)</small>
					</div>
					<div class="form-group">
						<label>Last Election Date</label>
						<input type="date" name="last_election_date" />
						<small style="color: #666; font-size: 0.85rem;">Date of the most recent major election</small>
					</div>
					<div class="form-group">
						<label>Data Source</label>
						<input type="text" name="data_source" placeholder="e.g., U.S. Census Bureau, State Election Office" />
						<small style="color: #666; font-size: 0.85rem;">Official source of this data</small>
					</div>
					<div class="form-group" style="grid-column: 1 / -1;">
						<label>Notes</label>
						<textarea name="notes" rows="3" placeholder="Additional notes about this voter data"></textarea>
						<small style="color: #666; font-size: 0.85rem;">Any additional context or notes</small>
					</div>
				</div>
				<div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 1rem; margin-top: 1.5rem; border-radius: 4px;">
					<p style="margin: 0; font-size: 0.85rem; color: #92400e;">
						<strong>⚠️ Legal Notice:</strong> Only enter voter data from official government sources. 
						Voter registration and turnout data are public records from state election offices, 
						the Census Bureau, or the Election Assistance Commission.
					</p>
				</div>
				<div style="display: flex; gap: 1rem; margin-top: 1.5rem;">
					<button type="submit" class="btn btn-success">Save Voter Data</button>
					<button type="button" class="btn btn-secondary" onclick="closeModal('voter-modal')">Cancel</button>
				</div>
				<input type="hidden" name="id" />
			</form>
		</div>
	</div>


	<!-- Electoral Data Modal -->
	<div id="electoral-modal" class="modal">
		<div class="modal-content">
			<h2 style="margin-bottom: 1rem;">Add/Edit Electoral Data</h2>
			<div style="background: #f0f9ff; border-left: 4px solid #3b82f6; padding: 1rem; margin-bottom: 1.5rem; border-radius: 4px;">
				<p style="margin: 0; font-size: 0.9rem; color: #1e40af;">
					<strong>🗳️ Official Electoral Data Sources:</strong> Use official government sources only:
					<a href="https://www.fec.gov/introduction-campaign-finance/election-and-voting-information/" target="_blank" style="color: #3b82f6; text-decoration: underline;">FEC Election Information</a> | 
					<a href="https://www.archives.gov/electoral-college" target="_blank" style="color: #3b82f6; text-decoration: underline;">National Archives Electoral College</a> | 
					<a href="https://www.census.gov/data/tables/time-series/demo/voting-and-registration/voting-historical-time-series.html" target="_blank" style="color: #3b82f6; text-decoration: underline;">Census Bureau Voting Data</a> | 
					<a href="https://www.eac.gov/research-and-data" target="_blank" style="color: #3b82f6; text-decoration: underline;">EAC Election Data</a>
					<br><br>
					<strong>Recommended:</strong> <a href="https://www.archives.gov/electoral-college" target="_blank" style="color: #3b82f6; text-decoration: underline;">National Archives Electoral College Results</a> - Official certified results by state.
				</p>
			</div>
			<form id="electoral-form" onsubmit="saveElectoralData(event)">
				<div class="form-grid">
					<div class="form-group">
						<label>State *</label>
						<select name="state_code" required>
							<option value="">Select State</option>
							${states.map((s) => `<option value="${s.code}">${s.name} (${s.code})</option>`).join('')}
						</select>
					</div>
					<div class="form-group">
						<label>Election Year *</label>
						<input type="number" name="electoral_year" required min="2000" max="2030" placeholder="e.g., 2024" />
						<small style="color: #666; font-size: 0.85rem;">Year of the presidential election</small>
					</div>
					<div class="form-group">
						<label>Winning Party *</label>
						<select name="electoral_winner" required>
							<option value="">Select Party</option>
							<option value="Republican">Republican</option>
							<option value="Democrat">Democrat</option>
						</select>
						<small style="color: #666; font-size: 0.85rem;">Which party won this state's electoral votes</small>
					</div>
					<div class="form-group">
						<label>Electoral Votes *</label>
						<input type="number" name="electoral_votes" min="0" max="55" placeholder="e.g., 11" required />
						<small style="color: #666; font-size: 0.85rem;">Number of electoral votes allocated to this state</small>
					</div>
					<div class="form-group">
						<label>Margin of Victory (%)</label>
						<input type="number" name="electoral_margin" min="0" max="100" step="0.1" placeholder="e.g., 5.2" />
						<small style="color: #666; font-size: 0.85rem;">Margin of victory percentage (optional)</small>
					</div>
				</div>
				<div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 1rem; margin-top: 1.5rem; border-radius: 4px;">
					<p style="margin: 0; font-size: 0.85rem; color: #92400e;">
						<strong>⚠️ Legal Notice:</strong> Electoral vote results are matters of public record. 
						This data reflects official election results from state-certified sources. 
						Use only official state election office results or certified federal sources.
					</p>
				</div>
				<div style="display: flex; gap: 1rem; margin-top: 1.5rem;">
					<button type="submit" class="btn btn-success">Save Electoral Data</button>
					<button type="button" class="btn btn-secondary" onclick="closeModal('electoral-modal')">Cancel</button>
				</div>
				<input type="hidden" name="state_code_original" />
			</form>
		</div>
	</div>


	<script>
		let currentData = window.adminData;
		
		window.showTab = function(tabName, event) {
			document.querySelectorAll('.tab').forEach(function(t) { t.classList.remove('active'); });
			document.querySelectorAll('.tab-content').forEach(function(c) { c.classList.remove('active'); });
			if (event && event.target) {
				event.target.classList.add('active');
			}
			document.getElementById(tabName).classList.add('active');

			// Dispatch custom event for tab activation
			document.dispatchEvent(new CustomEvent('tabActivated', { detail: tabName }));
		};

		window.openModal = function(modalId) {
			document.getElementById(modalId).classList.add('active');
		};

		window.closeModal = function(modalId) {
			document.getElementById(modalId).classList.remove('active');
			const form = document.querySelector('#' + modalId + ' form');
			if (form) form.reset();
		};
		
		async function saveRep(e) {
			e.preventDefault();
			const formData = new FormData(e.target);
			const data = Object.fromEntries(formData);
			const id = data.id;
			
			try {
				const url = '/api/admin/representative' + (id ? '/' + id : '');
				const response = await fetch(url, {
					method: id ? 'PUT' : 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(data)
				});
				
				if (response.ok) {
					location.reload();
				} else {
					alert('Error saving representative');
				}
			} catch (error) {
				alert('Error: ' + (error.message || 'Unknown error'));
			}
		}
		
		window.editRep = async function(id) {
			const rep = currentData.representatives.find(function(r) { return r.id === id; });
			if (!rep) return;
			
			const form = document.getElementById('rep-form');
			if (!form) return;
			
			Object.keys(rep).forEach(function(key) {
				const input = form.querySelector('[name="' + key + '"]');
				if (input) input.value = rep[key] || '';
			});
			const idInput = form.querySelector('[name="id"]');
			if (idInput) idInput.value = id.toString();
			openModal('rep-modal');
		}
		
		window.deleteRep = async function(id) {
			if (!confirm('Are you sure you want to delete this representative?')) return;
			
			try {
				const response = await fetch('/api/admin/representative/' + id, {
					method: 'DELETE'
				});
				
				if (response.ok) {
					location.reload();
				} else {
					alert('Error deleting representative');
				}
			} catch (error) {
				alert('Error: ' + (error.message || 'Unknown error'));
			}
		}
		
		async function saveVoterData(e) {
			e.preventDefault();
			const formData = new FormData(e.target);
			const data = Object.fromEntries(formData);
			
			// Convert numeric fields
			if (data.data_year) data.data_year = parseInt(data.data_year);
			if (data.total_registered_voters) data.total_registered_voters = parseInt(data.total_registered_voters);
			if (data.total_population) data.total_population = parseInt(data.total_population);
			if (data.voting_age_population) data.voting_age_population = parseInt(data.voting_age_population);
			
			try {
				const response = await fetch('/api/admin/voter-data', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(data)
				});
				
				if (response.ok) {
					location.reload();
				} else {
					alert('Error saving voter data');
				}
			} catch (error) {
				alert('Error: ' + (error.message || 'Unknown error'));
			}
		}


		window.editVoterData = async function(stateCode, dataYear) {
			const voterData = currentData.voterData.find(function(v) { 
				return v.state_code === stateCode && v.data_year === dataYear; 
			});
			if (!voterData) {
				// If not found, create new entry for this state/year
				const form = document.getElementById('voter-form');
				if (form) {
					const stateSelect = form.querySelector('[name="state_code"]');
					const yearInput = form.querySelector('[name="data_year"]');
					if (stateSelect) stateSelect.value = stateCode;
					if (yearInput) yearInput.value = dataYear;
					openModal('voter-modal');
				}
				return;
			}
			
			const form = document.getElementById('voter-form');
			if (!form) return;
			
			Object.keys(voterData).forEach(function(key) {
				const input = form.querySelector('[name="' + key + '"]');
				if (input) {
					if (input.type === 'date' && voterData[key]) {
						input.value = voterData[key].split('T')[0];
					} else {
						input.value = voterData[key] || '';
					}
				}
			});
			const idInput = form.querySelector('[name="id"]');
			if (idInput) idInput.value = voterData.id ? voterData.id.toString() : '';
			openModal('voter-modal');
		}
		
		async function saveElectoralData(e) {
			e.preventDefault();
			const formData = new FormData(e.target);
			const data = Object.fromEntries(formData);

			// Convert numeric fields
			if (data.electoral_votes) data.electoral_votes = parseInt(data.electoral_votes);
			if (data.electoral_year) data.electoral_year = parseInt(data.electoral_year);
			if (data.electoral_margin) data.electoral_margin = parseFloat(data.electoral_margin);

			// Handle empty values
			if (!data.electoral_winner || data.electoral_winner === '') {
				data.electoral_winner = null;
			}
			if (!data.electoral_votes || data.electoral_votes === '') {
				data.electoral_votes = null;
			}
			if (!data.electoral_year || data.electoral_year === '') {
				data.electoral_year = null;
			}
			if (!data.electoral_margin || data.electoral_margin === '') {
				data.electoral_margin = null;
			}

			try {
				const response = await fetch('/api/admin/electoral', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(data)
				});

				if (response.ok) {
					location.reload();
				} else {
					alert('Error saving electoral data');
				}
			} catch (error) {
				alert('Error: ' + (error.message || 'Unknown error'));
			}
		}

		window.populateElectoralData = async function() {
			if (!confirm('This will populate electoral data for all 50 states + DC with official 2024 election results. Continue?')) {
				return;
			}

			// Show loading state
			const originalText = '📊 Populate 2024 Results';
			const btn = document.querySelector('.populate-electoral-btn');
			if (btn) {
				btn.disabled = true;
				btn.textContent = '⏳ Populating...';
			}

			try {
				const response = await fetch('/api/admin/populate-electoral-2024', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' }
				});

				const result = await response.json();

				if (response.ok && result.success) {
					alert('✅ Success! Updated electoral data for all 50 states + DC. The map will now show pastel colors based on 2024 election results!');
					location.reload();
				} else {
					alert('❌ Error: ' + (result.message || 'Failed to populate electoral data'));
				}
			} catch (error) {
				alert('❌ Error: ' + (error.message || 'Network error'));
			} finally {
				// Reset button
				if (btn) {
					btn.disabled = false;
					btn.textContent = originalText;
				}
			}
		}


		window.editElectoral = async function(stateCode) {
			const state = currentData.states.find(function(s) { return s.code === stateCode; });
			if (!state) return;

			const form = document.getElementById('electoral-form');
			if (!form) return;

			// Populate form fields
			const stateSelect = form.querySelector('[name="state_code"]');
			const votesInput = form.querySelector('[name="electoral_votes"]');
			const yearInput = form.querySelector('[name="electoral_year"]');
			const winnerSelect = form.querySelector('[name="electoral_winner"]');
			const marginInput = form.querySelector('[name="electoral_margin"]');
			const originalInput = form.querySelector('[name="state_code_original"]');

			if (stateSelect) stateSelect.value = state.code;
			if (votesInput) votesInput.value = state.electoral_votes || '';
			if (yearInput) yearInput.value = state.electoral_year || '';
			if (winnerSelect) winnerSelect.value = state.electoral_winner || '';
			if (marginInput) marginInput.value = state.electoral_margin || '';
			if (originalInput) originalInput.value = state.code;

			openModal('electoral-modal');
		}
		
		window.logout = function() {
			fetch('/admin/logout', { method: 'POST' }).then(function() {
				window.location.href = '/admin/login';
			});
		}

		// Issues functions
		async function loadIssues() {
			try {
				console.log('Loading issues...');
				const response = await fetch('/api/admin/issues');
				console.log('Response status:', response.status);
				if (!response.ok) {
					console.error('API request failed:', response.status, response.statusText);
					const tbody = document.getElementById('issues-table-body');
					if (tbody) {
						tbody.innerHTML = '<tr><td colspan="6">Error: API request failed</td></tr>';
					}
					return;
				}
				const data = await response.json();
				console.log('Data received:', data);
				const tbody = document.getElementById('issues-table-body');
				if (!tbody) {
					console.error('issues-table-body element not found');
					return;
				}

				if (!data.issues || !Array.isArray(data.issues)) {
					console.error('Invalid issues data:', data);
					tbody.innerHTML = '<tr><td colspan="6">Error: Invalid data format</td></tr>';
					return;
				}

				if (data.issues.length === 0) {
					tbody.innerHTML = '<tr><td colspan="6">No issues found</td></tr>';
					return;
				}

				tbody.innerHTML = data.issues.map(function(issue) {
					if (!issue || typeof issue !== 'object') {
						console.error('Invalid issue object:', issue);
						return '<tr><td colspan="6">Error: Invalid issue data</td></tr>';
					}
					var partyClass = 'party-' + (issue.party ? issue.party.toLowerCase() : 'unknown');
					var statusClass = issue.is_active ? 'active' : 'inactive';
					var statusText = issue.is_active ? 'Active' : 'Inactive';
					return '<tr>' +
						'<td>' + (issue.title ? escapeHtml(issue.title) : 'No title') + '</td>' +
						'<td><span class="party-badge ' + partyClass + '">' + (issue.party || 'Unknown') + '</span></td>' +
						'<td>' + (issue.category ? escapeHtml(issue.category) : '-') + '</td>' +
						'<td>' + (issue.priority || 0) + '</td>' +
						'<td><span class="status ' + statusClass + '">' + statusText + '</span></td>' +
						'<td>' +
							'<button class="btn btn-small" onclick="editIssue(' + (issue.id || 0) + ')">Edit</button> ' +
							'<button class="btn btn-small btn-danger" onclick="deleteIssue(' + (issue.id || 0) + ')">Delete</button>' +
						'</td>' +
					'</tr>';
				}).join('');
				console.log('Issues loaded successfully');
			} catch (error) {
				console.error('Error loading issues:', error);
				const tbody = document.getElementById('issues-table-body');
				if (tbody) {
					tbody.innerHTML = '<tr><td colspan="6">Error loading issues: ' + (error.message || 'Unknown error') + '</td></tr>';
				}
			}
		}

		// Load issues when issues tab is activated
		document.addEventListener('tabActivated', function(e) {
			console.log('Tab activated event received:', e);
			if (e && e.detail === 'issues') {
				console.log('Loading issues tab');
				loadIssues();
			}
		});

		async function saveIssue(e) {
			e.preventDefault();
			const formData = new FormData(e.target);
			const data = Object.fromEntries(formData);

			// Handle checkbox
			data.is_active = formData.has('is_active') ? 1 : 0;
			data.priority = parseInt(data.priority) || 0;

			const id = data.id;

			try {
				const url = '/api/admin/issue' + (id ? '/' + id : '');
				const response = await fetch(url, {
					method: id ? 'PUT' : 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(data)
				});

				if (response.ok) {
					location.reload();
				} else {
					alert('Error saving issue');
				}
			} catch (error) {
				alert('Error: ' + (error.message || 'Unknown error'));
			}
		}

		window.editIssue = async function(id) {
			try {
				const response = await fetch('/api/admin/issues');
				const data = await response.json();
				const issue = data.issues.find(i => i.id === id);
				if (!issue) return;

				const form = document.getElementById('issue-form');
				if (!form) return;

				Object.keys(issue).forEach(function(key) {
					const input = form.querySelector('[name="' + key + '"]');
					if (input) {
						if (input.type === 'checkbox') {
							input.checked = issue[key];
						} else {
							input.value = issue[key] || '';
						}
					}
				});

				// Add hidden ID field
				let idField = form.querySelector('input[name="id"]');
				if (!idField) {
					idField = document.createElement('input');
					idField.type = 'hidden';
					idField.name = 'id';
					form.appendChild(idField);
				}
				idField.value = issue.id;

				openModal('issue-modal');
			} catch (error) {
				console.error('Error loading issue for edit:', error);
			}
		};

		window.deleteIssue = async function(id) {
			if (!confirm('Are you sure you want to delete this issue?')) return;

			try {
				const response = await fetch('/api/admin/issue/' + id, {
					method: 'DELETE'
				});

				if (response.ok) {
					loadIssues();
				} else {
					alert('Error deleting issue');
				}
			} catch (error) {
				alert('Error: ' + (error.message || 'Unknown error'));
			}
		};

		function escapeHtml(text) {
			if (!text) return '';
			const map = {
				'&': '&amp;',
				'<': '&lt;',
				'>': '&gt;',
				'"': '&quot;',
				"'": '&#039;'
			};
			return text.toString().replace(/[&<>"']/g, function(m) { return map[m]; });
		}


		function toggleDistrictField() {
			const chamberSelect = document.getElementById('chamber-select');
			const districtField = document.getElementById('district-field');
			if (chamberSelect && districtField) {
				districtField.style.display = chamberSelect.value === 'house' ? 'block' : 'none';
			}
		}
		
		// Initialize district field visibility
		document.addEventListener('DOMContentLoaded', function() {
			toggleDistrictField();
		});
	</script>
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
