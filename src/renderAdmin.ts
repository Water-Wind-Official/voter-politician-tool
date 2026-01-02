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
	const { states, representatives, voterData, votes } = data;
	
	return `
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<title>Admin Dashboard</title>
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
			<div class="stat-value">${votes.length}</div>
			<div class="stat-label">Votes</div>
		</div>
	</div>
	
	<div class="tabs">
		<button class="tab active" onclick="showTab('representatives')">Representatives</button>
		<button class="tab" onclick="showTab('voter-data')">Voter Data</button>
		<button class="tab" onclick="showTab('votes')">Votes</button>
		<button class="tab" onclick="showTab('districts')">Districts</button>
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
						<th>Chamber</th>
						<th>Party</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody>
					${representatives.map((r: any) => `
						<tr>
							<td>${escapeHtml(r.name)}</td>
							<td>${r.state_code}</td>
							<td>${r.chamber === 'house' ? 'House' : 'Senate'}</td>
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
				<button class="btn" onclick="openModal('voter-modal')">+ Add Voter Data</button>
			</div>
			<table class="table">
				<thead>
					<tr>
						<th>State</th>
						<th>Registered Voters</th>
						<th>Turnout %</th>
						<th>Year</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody>
					${voterData.map((v: any) => `
						<tr>
							<td>${v.state_code}</td>
							<td>${v.total_registered_voters ? v.total_registered_voters.toLocaleString() : '-'}</td>
							<td>${v.voter_turnout_percentage ? v.voter_turnout_percentage.toFixed(1) + '%' : '-'}</td>
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
	
	<div id="votes" class="tab-content">
		<div class="card">
			<div class="card-header">
				<h2 class="card-title">Votes</h2>
				<button class="btn" onclick="openModal('vote-modal')">+ Add Vote</button>
			</div>
			<table class="table">
				<thead>
					<tr>
						<th>Bill Title</th>
						<th>Chamber</th>
						<th>Date</th>
						<th>Result</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody>
					${votes.map((v: any) => `
						<tr>
							<td>${escapeHtml(v.bill_title || v.question || '-')}</td>
							<td>${v.chamber}</td>
							<td>${v.date}</td>
							<td>${v.result || '-'}</td>
							<td>
								<button class="btn btn-small" onclick="editVote(${v.id})">Edit</button>
							</td>
						</tr>
					`).join('')}
				</tbody>
			</table>
		</div>
	</div>
	
	<div id="districts" class="tab-content">
		<div class="card">
			<div class="card-header">
				<h2 class="card-title">Districts</h2>
				<button class="btn" onclick="openModal('district-modal')">+ Add District</button>
			</div>
			<div id="districts-list">Loading districts...</div>
		</div>
	</div>
	
	<!-- Representative Modal -->
	<div id="rep-modal" class="modal">
		<div class="modal-content">
			<h2 style="margin-bottom: 1.5rem;">Add/Edit Representative</h2>
			<form id="rep-form" onsubmit="saveRep(event)">
				<div class="form-grid">
					<div class="form-group">
						<label>Name *</label>
						<input type="text" name="name" required />
					</div>
					<div class="form-group">
						<label>First Name</label>
						<input type="text" name="first_name" />
					</div>
					<div class="form-group">
						<label>Last Name</label>
						<input type="text" name="last_name" />
					</div>
					<div class="form-group">
						<label>State Code *</label>
						<select name="state_code" required>
							<option value="">Select State</option>
							${states.map((s: any) => `<option value="${s.code}">${s.name}</option>`).join('')}
						</select>
					</div>
					<div class="form-group">
						<label>Chamber *</label>
						<select name="chamber" required>
							<option value="house">House</option>
							<option value="senate">Senate</option>
						</select>
					</div>
					<div class="form-group">
						<label>Party</label>
						<select name="party">
							<option value="">None</option>
							<option value="Democrat">Democrat</option>
							<option value="Republican">Republican</option>
							<option value="Independent">Independent</option>
						</select>
					</div>
					<div class="form-group">
						<label>Email</label>
						<input type="email" name="email" />
					</div>
					<div class="form-group">
						<label>Phone</label>
						<input type="tel" name="office_phone" />
					</div>
					<div class="form-group">
						<label>Twitter Handle</label>
						<input type="text" name="twitter_handle" placeholder="@username" />
					</div>
					<div class="form-group">
						<label>Website</label>
						<input type="url" name="website" />
					</div>
					<div class="form-group" style="grid-column: 1 / -1;">
						<label>Biography</label>
						<textarea name="bio"></textarea>
					</div>
				</div>
				<div style="display: flex; gap: 1rem; margin-top: 1.5rem;">
					<button type="submit" class="btn btn-success">Save</button>
					<button type="button" class="btn btn-secondary" onclick="closeModal('rep-modal')">Cancel</button>
				</div>
				<input type="hidden" name="id" />
			</form>
		</div>
	</div>
	
	<script>
		let currentData = ${JSON.stringify(data)};
		
		function showTab(tabName) {
			document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
			document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
			event.target.classList.add('active');
			document.getElementById(tabName).classList.add('active');
		}
		
		function openModal(modalId) {
			document.getElementById(modalId).classList.add('active');
		}
		
		function closeModal(modalId) {
			document.getElementById(modalId).classList.remove('active');
			document.querySelector(\`#\${modalId} form\`).reset();
		}
		
		async function saveRep(e) {
			e.preventDefault();
			const formData = new FormData(e.target);
			const data = Object.fromEntries(formData);
			const id = data.id;
			
			try {
				const response = await fetch(\`/api/admin/representative\${id ? '/' + id : ''}\`, {
					method: id ? 'PUT' : 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(data)
				});
				
				if (response.ok) {
					location.reload();
				} else {
					alert('Error saving representative');
				}
			} catch (error: any) {
				alert('Error: ' + error.message);
			}
		}
		
		async function editRep(id: number) {
			const rep = currentData.representatives.find((r: any) => r.id === id);
			if (!rep) return;
			
			const form = document.getElementById('rep-form') as HTMLFormElement;
			Object.keys(rep).forEach(key => {
				const input = form.querySelector(\`[name="\${key}"]\`) as HTMLInputElement;
				if (input) input.value = rep[key] || '';
			});
			(form.querySelector('[name="id"]') as HTMLInputElement)!.value = id.toString();
			openModal('rep-modal');
		}
		
		async function deleteRep(id: number) {
			if (!confirm('Are you sure you want to delete this representative?')) return;
			
			try {
				const response = await fetch(\`/api/admin/representative/\${id}\`, {
					method: 'DELETE'
				});
				
				if (response.ok) {
					location.reload();
				} else {
					alert('Error deleting representative');
				}
			} catch (error: any) {
				alert('Error: ' + error.message);
			}
		}
		
		function logout() {
			fetch('/admin/logout', { method: 'POST' }).then(() => {
				window.location.href = '/admin/login';
			});
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
			return text.toString().replace(/[&<>"']/g, m => map[m]);
		}
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
