export function renderCandidateProfile(candidate: 'trump' | 'harris'): string {
	const candidateData = {
		trump: {
			name: 'Donald J. Trump',
			fullName: 'Donald John Trump',
			party: 'Republican',
			position: 'Former President of the United States',
			flag: '🇺🇸',
			partyColor: '#dc2626',
			partyBg: 'rgba(220, 38, 38, 0.1)',
			currentWebsite: 'https://www.donaldjtrump.com/',
			wayback2024: 'https://web.archive.org/web/20241010000624/https://www.donaldjtrump.com/platform',
			bio: `Donald John Trump is an American politician, media personality, and businessman who served as the 45th president of the United States from 2017 to 2021. Born in Queens, New York City, Trump graduated from the Kew-Forest School in 1964 and took over the family real estate business in 1971. He expanded it into building and renovating skyscrapers, hotels, casinos, and golf courses.

Trump entered politics in 2015 with his candidacy for president, winning the Republican nomination and defeating Hillary Clinton in the 2016 election. He was inaugurated on January 20, 2017, and served one term before losing re-election to Joe Biden in 2020.

After leaving office, Trump continued to be active in politics and announced his candidacy for the 2024 presidential election in November 2022. He won the Republican nomination and faced Vice President Kamala Harris in the 2024 general election, ultimately winning with 312 electoral votes.`,
			achievements: [
				'45th President of the United States (2017-2021)',
				'Won 2024 Presidential Election',
				'Appointed three Supreme Court justices',
				'Signed the Tax Cuts and Jobs Act of 2017',
				'Negotiated the Abraham Accords peace agreements',
				'Launched Operation Warp Speed for COVID-19 vaccine development'
			],
			websiteLinks: [
				{
					title: 'Official Campaign Website',
					url: 'https://www.donaldjtrump.com/',
					description: 'Current official website with campaign information'
				},
				{
					title: '2024 Campaign Platform (Wayback Machine)',
					url: 'https://web.archive.org/web/20241010000624/https://www.donaldjtrump.com/platform',
					description: 'Archived version of Trump\'s 2024 campaign platform from October 2024'
				},
				{
					title: 'Social Media',
					url: 'https://truthsocial.com/@realDonaldTrump',
					description: 'Official Truth Social account'
				}
			]
		},
		harris: {
			name: 'Kamala Harris',
			fullName: 'Kamala Devi Harris',
			party: 'Democrat',
			position: 'Vice President of the United States',
			flag: '🇺🇸',
			partyColor: '#2563eb',
			partyBg: 'rgba(37, 99, 235, 0.1)',
			currentWebsite: 'https://kamalaharris.com/',
			wayback2024: 'https://web.archive.org/web/20241005024829/https://kamalaharris.com/issues/',
			bio: `Kamala Devi Harris is an American politician and attorney who has served as the 49th vice president of the United States since 2021. She is the first woman, first Black American, and first South Asian American to hold the office. Born in Oakland, California, Harris graduated from Howard University and the University of California, Hastings College of the Law.

Harris began her career as a deputy district attorney in Alameda County, California, and later served as attorney general of California from 2011 to 2017. She was elected to the United States Senate in 2016, becoming the first South Asian American and second Black woman to serve in the Senate.

In 2020, Harris was selected by Joe Biden as his running mate in the presidential election. They won the election, and Harris was inaugurated as vice president on January 20, 2021. She served as Biden's vice president for one term.

Harris sought the Democratic nomination for president in the 2024 election and became the presumptive nominee after Biden withdrew from the race. She selected Minnesota Governor Tim Walz as her running mate and faced former President Donald Trump in the general election.`,
			achievements: [
				'49th Vice President of the United States (2021-Present)',
				'First Woman Vice President',
				'First Black American Vice President',
				'First South Asian American Vice President',
				'California Attorney General (2011-2017)',
				'United States Senator (2017-2021)',
				'2024 Democratic Presidential Nominee'
			],
			websiteLinks: [
				{
					title: 'Official Campaign Website',
					url: 'https://kamalaharris.com/',
					description: 'Current official website with campaign information'
				},
				{
					title: '2024 Campaign Issues (Wayback Machine)',
					url: 'https://web.archive.org/web/20241005024829/https://kamalaharris.com/issues/',
					description: 'Archived version of Harris\'s 2024 campaign issues from October 2024'
				},
				{
					title: 'Official Vice President Website',
					url: 'https://www.whitehouse.gov/administration/vice-president-harris/',
					description: 'Official White House website for Vice President Harris'
				}
			]
		}
	};

	const data = candidateData[candidate];

	return `
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<title>${data.name} - Voter Politician Tool</title>
	<style>
		* {
			margin: 0;
			padding: 0;
			box-sizing: border-box;
		}

		body {
			font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
			background:
				radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
				radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
				radial-gradient(circle at 40% 80%, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
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
			padding: 3rem;
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

		.candidate-flag {
			font-size: 4rem;
			margin-bottom: 1rem;
			position: relative;
			z-index: 1;
		}

		.candidate-name {
			font-size: 3rem;
			font-weight: 800;
			margin-bottom: 0.5rem;
			color: #ffffff;
			letter-spacing: -0.025em;
			position: relative;
			z-index: 1;
			text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
		}

		.candidate-position {
			font-size: 1.2rem;
			color: #cbd5e1;
			margin-bottom: 1rem;
			opacity: 0.9;
			position: relative;
			z-index: 1;
		}

		.party-badge {
			display: inline-block;
			padding: 0.75rem 2rem;
			border-radius: 25px;
			font-size: 1.1rem;
			font-weight: 600;
			color: white;
			background: linear-gradient(135deg, ${data.partyColor} 0%, ${data.partyColor.replace('dc2626', 'b91c1c').replace('2563eb', '1d4ed8')} 100%);
			margin-bottom: 1rem;
			box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
			position: relative;
			z-index: 1;
			text-transform: uppercase;
			letter-spacing: 0.5px;
		}

		.bio-section {
			background: linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(51, 65, 85, 0.9) 100%);
			backdrop-filter: blur(20px);
			border: 1px solid rgba(148, 163, 184, 0.2);
			border-radius: 16px;
			padding: 2rem;
			margin-bottom: 2rem;
			box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(148, 163, 184, 0.1);
			position: relative;
		}

		.bio-section::before {
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
			font-weight: 700;
			color: #f1f5f9;
			margin-bottom: 1.5rem;
			padding-bottom: 0.5rem;
			border-bottom: 2px solid rgba(148, 163, 184, 0.3);
			position: relative;
			z-index: 1;
			text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
		}

		.bio-text {
			font-size: 1.1rem;
			line-height: 1.7;
			color: #cbd5e1;
			margin-bottom: 2rem;
			position: relative;
			z-index: 1;
		}

		.achievements-title {
			font-size: 1.4rem;
			font-weight: 700;
			color: #f1f5f9;
			margin-bottom: 1.5rem;
			padding-bottom: 0.5rem;
			border-bottom: 2px solid rgba(148, 163, 184, 0.3);
			position: relative;
			z-index: 1;
		}

		.achievements-list {
			display: grid;
			grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
			gap: 1.5rem;
			position: relative;
			z-index: 1;
		}

		.achievement-item {
			background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
			backdrop-filter: blur(10px);
			padding: 1.5rem;
			border-radius: 12px;
			border-left: 4px solid ${data.partyColor};
			border: 1px solid rgba(148, 163, 184, 0.2);
			transition: all 0.3s ease;
			box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
			position: relative;
			z-index: 1;
			font-size: 1rem;
			font-weight: 600;
			color: #f1f5f9;
			text-align: center;
		}

		.achievement-item:hover {
			transform: translateY(-3px) scale(1.01);
			box-shadow: 0 8px 25px rgba(0, 0, 0, 0.25);
			border-color: rgba(148, 163, 184, 0.4);
		}

		.websites-section {
			background: linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(51, 65, 85, 0.9) 100%);
			backdrop-filter: blur(20px);
			border: 1px solid rgba(148, 163, 184, 0.2);
			border-radius: 16px;
			padding: 2rem;
			margin-bottom: 2rem;
			box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(148, 163, 184, 0.1);
			position: relative;
		}

		.websites-section::before {
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

		.website-links {
			display: grid;
			gap: 1.5rem;
		}

		.website-link {
			display: block;
			padding: 2rem;
			border: 2px solid rgba(148, 163, 184, 0.3);
			border-radius: 16px;
			text-decoration: none;
			color: inherit;
			transition: all 0.3s ease;
			background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
			backdrop-filter: blur(10px);
			box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
			position: relative;
			z-index: 1;
		}

		.website-link:hover {
			transform: translateY(-6px) scale(1.01);
			box-shadow: 0 12px 30px rgba(0, 0, 0, 0.25);
			border-color: ${data.partyColor};
		}

		.website-title {
			font-size: 1.3rem;
			font-weight: 700;
			color: #f1f5f9;
			margin-bottom: 0.5rem;
		}

		.website-url {
			font-size: 1rem;
			color: ${data.partyColor};
			font-weight: 600;
			margin-bottom: 0.5rem;
			word-break: break-all;
			opacity: 0.9;
		}

		.website-description {
			font-size: 1rem;
			color: #cbd5e1;
			line-height: 1.5;
			opacity: 0.9;
		}

		.external-link-icon {
			display: inline-block;
			margin-left: 0.5rem;
			font-size: 1rem;
			opacity: 0.7;
		}

		/* Navigation hover effects */
		nav a:hover {
			background: rgba(59, 130, 246, 0.2);
			border-color: rgba(59, 130, 246, 0.5);
			color: #dbeafe;
			transform: translateY(-1px);
		}

		@media (max-width: 768px) {
			body {
				padding: 1rem;
			}

			.profile-header {
				padding: 2rem 1rem;
				margin-left: 0;
				margin-right: 0;
			}

			.candidate-name {
				font-size: 2rem;
			}

			.achievements-list {
				grid-template-columns: 1fr;
			}

			.website-links {
				grid-template-columns: 1fr;
			}

			nav {
				display: block !important;
				margin-left: 0 !important;
				margin-top: 1rem !important;
			}

			nav a {
				display: inline-block;
				margin: 0.25rem 0.5rem !important;
			}
		}
	</style>
</head>
<body>
	<div class="container">
		<div style="text-align: center; margin-bottom: 1rem;">
			<a href="/" class="back-link">← Back to Map</a>
			<nav style="display: inline-block; margin-left: 2rem;">
				<a href="/issues" style="color: #93c5fd; text-decoration: none; margin: 0 0.75rem; font-weight: 600; padding: 0.5rem 1rem; border-radius: 8px; transition: all 0.3s ease; border: 1px solid transparent;">Issues Hub</a>
				<a href="/senators" style="color: #93c5fd; text-decoration: none; margin: 0 0.75rem; font-weight: 600; padding: 0.5rem 1rem; border-radius: 8px; transition: all 0.3s ease; border: 1px solid transparent;">Senate Hub</a>
				<a href="/house" style="color: #93c5fd; text-decoration: none; margin: 0 0.75rem; font-weight: 600; padding: 0.5rem 1rem; border-radius: 8px; transition: all 0.3s ease; border: 1px solid transparent;">House Hub</a>
				<a href="/election" style="color: #93c5fd; text-decoration: none; margin: 0 0.75rem; font-weight: 600; padding: 0.5rem 1rem; border-radius: 8px; transition: all 0.3s ease; border: 1px solid transparent;">Election Hub</a>
			</nav>
		</div>

		<div class="profile-header">
			<div class="candidate-flag">${data.flag}</div>
			<h1 class="candidate-name">${data.name}</h1>
			<div class="candidate-position">${data.position}</div>
			<div class="party-badge">${data.party}</div>
		</div>

		<div class="bio-section">
			<h2 class="section-title">Biography</h2>
			<div class="bio-text">${data.bio.replace(/\n/g, '<br>')}</div>

			<h3 class="achievements-title">🏆 Key Achievements</h3>
			<div class="achievements-list">
				${data.achievements.map(achievement => `
					<div class="achievement-item">
						${achievement}
					</div>
				`).join('')}
			</div>
		</div>

		<div class="websites-section">
			<h2 class="section-title">Official Websites & Resources</h2>
			<div class="website-links">
				${data.websiteLinks.map(link => `
					<a href="${link.url}" target="_blank" class="website-link">
						<div class="website-title">${link.title} <span class="external-link-icon">↗</span></div>
						<div class="website-url">${link.url}</div>
						<div class="website-description">${link.description}</div>
					</a>
				`).join('')}
			</div>
		</div>
	</div>
</body>
</html>`;
}