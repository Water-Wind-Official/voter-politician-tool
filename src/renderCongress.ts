export function renderCongressPage(): string {
	return `
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<title>Congress Hub - Voter Politician Tool</title>
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
			display: flex;
			justify-content: center;
			gap: 1rem;
			flex-wrap: wrap;
			position: relative;
			z-index: 1;
		}

		nav a {
			color: #93c5fd;
			text-decoration: none;
			padding: 0.5rem 1rem;
			border-radius: 8px;
			transition: all 0.3s ease;
			border: 1px solid transparent;
			font-weight: 600;
		}

		nav a:hover {
			background: rgba(59, 130, 246, 0.2);
			border-color: rgba(59, 130, 246, 0.5);
			color: #dbeafe;
			transform: translateY(-1px);
		}

		.congress-grid {
			display: grid;
			grid-template-columns: 1fr 1fr;
			gap: 2rem;
			margin-bottom: 2rem;
		}

		.congress-card {
			background: linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(51, 65, 85, 0.95) 100%);
			backdrop-filter: blur(20px);
			border: 1px solid rgba(148, 163, 184, 0.2);
			border-radius: 16px;
			padding: 2rem;
			box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(148, 163, 184, 0.1);
			position: relative;
			transition: all 0.3s ease;
		}

		.congress-card::before {
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			border-radius: 16px;
			pointer-events: none;
		}

		.house-card::before {
			background: linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(59, 130, 246, 0.1) 100%);
		}

		.senate-card::before {
			background: linear-gradient(135deg, rgba(239, 68, 68, 0.05) 0%, rgba(239, 68, 68, 0.1) 100%);
		}

		.congress-card:hover {
			transform: translateY(-5px);
			box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(148, 163, 184, 0.2);
		}

		.card-header {
			display: flex;
			align-items: center;
			margin-bottom: 1.5rem;
			position: relative;
			z-index: 1;
		}

		.card-icon {
			width: 60px;
			height: 60px;
			margin-right: 1rem;
			border-radius: 12px;
			object-fit: cover;
		}

		.card-title {
			font-size: 2rem;
			font-weight: 700;
			color: #f1f5f9;
		}

		.house-title {
			color: #60a5fa;
		}

		.senate-title {
			color: #f87171;
		}

		.card-description {
			color: #cbd5e1;
			line-height: 1.6;
			margin-bottom: 1.5rem;
			position: relative;
			z-index: 1;
		}

		.feature-list {
			list-style: none;
			margin-bottom: 1.5rem;
			position: relative;
			z-index: 1;
		}

		.feature-list li {
			padding: 0.5rem 0;
			color: #e2e8f0;
			position: relative;
			padding-left: 1.5rem;
		}

		.feature-list li::before {
			content: '•';
			position: absolute;
			left: 0;
			font-weight: bold;
		}

		.house-list li::before {
			color: #60a5fa;
		}

		.senate-list li::before {
			color: #f87171;
		}

		.explore-btn {
			display: inline-block;
			padding: 1rem 2rem;
			background: linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(59, 130, 246, 0.3) 100%);
			color: #93c5fd;
			text-decoration: none;
			border-radius: 12px;
			font-weight: 600;
			transition: all 0.3s ease;
			border: 1px solid rgba(59, 130, 246, 0.3);
			position: relative;
			z-index: 1;
		}

		.house-btn:hover {
			background: linear-gradient(135deg, rgba(59, 130, 246, 0.3) 0%, rgba(59, 130, 246, 0.4) 100%);
			border-color: rgba(59, 130, 246, 0.5);
			color: #dbeafe;
			transform: translateY(-2px);
			box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
		}

		.senate-btn {
			background: linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(239, 68, 68, 0.3) 100%);
			color: #fca5a5;
			border-color: rgba(239, 68, 68, 0.3);
		}

		.senate-btn:hover {
			background: linear-gradient(135deg, rgba(239, 68, 68, 0.3) 0%, rgba(239, 68, 68, 0.4) 100%);
			border-color: rgba(239, 68, 68, 0.5);
			color: #fecaca;
			transform: translateY(-2px);
			box-shadow: 0 8px 25px rgba(239, 68, 68, 0.3);
		}

		.comparison-section {
			background: linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(51, 65, 85, 0.95) 100%);
			backdrop-filter: blur(20px);
			border: 1px solid rgba(148, 163, 184, 0.2);
			border-radius: 16px;
			padding: 2rem;
			box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(148, 163, 184, 0.1);
			position: relative;
		}

		.comparison-section::before {
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			background: linear-gradient(135deg, rgba(148, 163, 184, 0.05) 0%, rgba(148, 163, 184, 0.1) 100%);
			border-radius: 16px;
			pointer-events: none;
		}

		.comparison-title {
			font-size: 1.8rem;
			font-weight: 700;
			color: #f1f5f9;
			margin-bottom: 1.5rem;
			text-align: center;
			position: relative;
			z-index: 1;
		}

		.comparison-grid {
			display: grid;
			grid-template-columns: 1fr 1fr 1fr;
			gap: 1rem;
			position: relative;
			z-index: 1;
		}

		.comparison-item {
			padding: 1rem;
			background: rgba(255, 255, 255, 0.05);
			border-radius: 8px;
			text-align: center;
		}

		.comparison-label {
			font-weight: 600;
			color: #cbd5e1;
			margin-bottom: 0.5rem;
		}

		.comparison-value {
			color: #f1f5f9;
		}

		@media (max-width: 1024px) {
			.congress-grid {
				grid-template-columns: 1fr;
			}

			.comparison-grid {
				grid-template-columns: 1fr;
			}
		}

		@media (max-width: 768px) {
			body {
				padding: 1rem;
			}

			h1 {
				font-size: 2rem;
			}

			.card-icon {
				width: 40px;
				height: 40px;
			}

			.card-title {
				font-size: 1.5rem;
			}
		}
	</style>
</head>
<body>
	<div class="container">
		<header>
			<h1>United States Congress</h1>
			<p class="subtitle">The legislative branch of the federal government, consisting of the House and Senate</p>
			<nav>
				<a href="/">← Back to Map</a>
				<a href="/money">Money Hub</a>
				<a href="/issues">Issues Hub</a>
				<a href="/election">Election Hub</a>
			</nav>
		</header>

		<div class="congress-grid">
			<!-- House of Representatives -->
			<div class="congress-card house-card">
				<div class="card-header">
					<img class="card-icon" src="https://content.mycutegraphics.com/graphics/animal/horse-head.png" alt="House Icon" />
					<h2 class="card-title house-title">House of Representatives</h2>
				</div>
				<p class="card-description">
					The lower chamber of Congress, with 435 members serving two-year terms. Representation is based on state population, with more populous states having more representatives.
				</p>
				<ul class="feature-list house-list">
					<li>435 voting members</li>
					<li>2-year terms</li>
					<li>Must be 25+ years old</li>
					<li>Must be US citizen 7+ years</li>
					<li>Must live in state represented</li>
					<li>Revenue bills originate here</li>
					<li>More rules, less debate</li>
					<li>Closer to the people</li>
				</ul>
				<a href="/house" class="explore-btn house-btn">Explore House →</a>
			</div>

			<!-- Senate -->
			<div class="congress-card senate-card">
				<div class="card-header">
					<img class="card-icon" src="https://content.mycutegraphics.com/graphics/animal/cute-elephant.png" alt="Senate Icon" />
					<h2 class="card-title senate-title">Senate</h2>
				</div>
				<p class="card-description">
					The upper chamber of Congress, with 100 members serving six-year terms. Each state has two senators regardless of population, providing equal representation.
				</p>
				<ul class="feature-list senate-list">
					<li>100 voting members</li>
					<li>6-year terms</li>
					<li>Must be 30+ years old</li>
					<li>Must be US citizen 9+ years</li>
					<li>Must live in state represented</li>
					<li>Treaties & appointments</li>
					<li>Unlimited debate (filibuster)</li>
					<li>More deliberative</li>
				</ul>
				<a href="/senators" class="explore-btn senate-btn">Explore Senate →</a>
			</div>
		</div>

		<!-- Key Differences -->
		<div class="comparison-section">
			<h3 class="comparison-title">Key Differences</h3>
			<div class="comparison-grid">
				<div class="comparison-item">
					<div class="comparison-label">Members</div>
					<div class="comparison-value">House: 435<br>Senate: 100</div>
				</div>
				<div class="comparison-item">
					<div class="comparison-label">Terms</div>
					<div class="comparison-value">House: 2 years<br>Senate: 6 years</div>
				</div>
				<div class="comparison-item">
					<div class="comparison-label">Representation</div>
					<div class="comparison-value">House: By population<br>Senate: Equal (2 per state)</div>
				</div>
				<div class="comparison-item">
					<div class="comparison-label">Age Requirement</div>
					<div class="comparison-value">House: 25+<br>Senate: 30+</div>
				</div>
				<div class="comparison-item">
					<div class="comparison-label">Citizenship</div>
					<div class="comparison-value">House: 7+ years<br>Senate: 9+ years</div>
				</div>
				<div class="comparison-item">
					<div class="comparison-label">Special Powers</div>
					<div class="comparison-value">House: Revenue bills<br>Senate: Treaties, appointments</div>
				</div>
			</div>
		</div>
	</div>
</body>
</html>
	`;
}
