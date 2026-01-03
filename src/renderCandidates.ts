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
			padding: 3rem;
			margin-bottom: 2rem;
			box-shadow: 0 4px 6px rgba(0,0,0,0.1);
			text-align: center;
			position: relative;
		}

		.candidate-flag {
			font-size: 4rem;
			margin-bottom: 1rem;
		}

		.candidate-name {
			font-size: 3rem;
			font-weight: 700;
			color: #333;
			margin-bottom: 0.5rem;
		}

		.candidate-position {
			font-size: 1.2rem;
			color: #6b7280;
			margin-bottom: 1rem;
		}

		.party-badge {
			display: inline-block;
			padding: 0.75rem 2rem;
			border-radius: 25px;
			font-size: 1.1rem;
			font-weight: 600;
			color: white;
			background: ${data.partyColor};
			margin-bottom: 1rem;
		}

		.bio-section {
			background: white;
			border-radius: 12px;
			padding: 2rem;
			margin-bottom: 2rem;
			box-shadow: 0 4px 6px rgba(0,0,0,0.1);
		}

		.section-title {
			font-size: 1.8rem;
			font-weight: 700;
			color: #333;
			margin-bottom: 1.5rem;
			padding-bottom: 0.5rem;
			border-bottom: 2px solid #e5e7eb;
		}

		.bio-text {
			font-size: 1.1rem;
			line-height: 1.7;
			color: #4b5563;
			margin-bottom: 2rem;
		}

		.achievements-list {
			display: grid;
			grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
			gap: 1rem;
		}

		.achievement-item {
			background: #f9fafb;
			padding: 1.5rem;
			border-radius: 8px;
			border-left: 4px solid ${data.partyColor};
			transition: transform 0.2s;
		}

		.achievement-item:hover {
			transform: translateY(-2px);
			box-shadow: 0 4px 12px rgba(0,0,0,0.1);
		}

		.websites-section {
			background: white;
			border-radius: 12px;
			padding: 2rem;
			margin-bottom: 2rem;
			box-shadow: 0 4px 6px rgba(0,0,0,0.1);
		}

		.website-links {
			display: grid;
			gap: 1.5rem;
		}

		.website-link {
			display: block;
			padding: 2rem;
			border: 2px solid #e5e7eb;
			border-radius: 12px;
			text-decoration: none;
			color: inherit;
			transition: all 0.3s ease;
			background: linear-gradient(135deg, #f9fafb 0%, #ffffff 100%);
		}

		.website-link:hover {
			transform: translateY(-4px);
			box-shadow: 0 8px 25px rgba(0,0,0,0.15);
			border-color: ${data.partyColor};
		}

		.website-title {
			font-size: 1.3rem;
			font-weight: 700;
			color: #1f2937;
			margin-bottom: 0.5rem;
		}

		.website-url {
			font-size: 1rem;
			color: ${data.partyColor};
			font-weight: 600;
			margin-bottom: 0.5rem;
			word-break: break-all;
		}

		.website-description {
			font-size: 1rem;
			color: #6b7280;
			line-height: 1.5;
		}

		.external-link-icon {
			display: inline-block;
			margin-left: 0.5rem;
			font-size: 1rem;
		}

		@media (max-width: 768px) {
			body {
				padding: 1rem;
			}

			.profile-header {
				padding: 2rem 1rem;
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
		}
	</style>
</head>
<body>
	<div class="container">
		<div style="text-align: center; margin-bottom: 1rem;">
			<a href="/" class="back-link">← Back to Map</a>
			<nav style="display: inline-block; margin-left: 2rem;">
				<a href="/issues" style="color: #667eea; text-decoration: none; margin: 0 0.5rem; font-weight: 500;">Issues Hub</a>
				<a href="/senators" style="color: #667eea; text-decoration: none; margin: 0 0.5rem; font-weight: 500;">Senate Hub</a>
				<a href="/house" style="color: #667eea; text-decoration: none; margin: 0 0.5rem; font-weight: 500;">House Hub</a>
				<a href="/election" style="color: #667eea; text-decoration: none; margin: 0 0.5rem; font-weight: 500;">Election Hub</a>
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

			<h3 style="color: #333; margin-bottom: 1rem; font-size: 1.4rem;">Key Achievements</h3>
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