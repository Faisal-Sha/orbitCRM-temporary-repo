
// Data generation functions for the People Dashboard
export const generateDashboardData = (peopleType: string, dateRange: string) => {
  const getRandomValue = (base: number, variance: number = 0.3) => {
    return Math.floor(base + (Math.random() - 0.5) * base * variance);
  };

  const getPercentageChange = () => {
    const change = Math.floor((Math.random() - 0.5) * 40); // -20% to +20%
    return change >= 0 ? `↗ ${change}%` : `↘ ${Math.abs(change)}%`;
  };

  const getRandomGrowthStage = () => {
    const stages = ["Foundation", "Developing", "Established"];
    return stages[Math.floor(Math.random() * stages.length)];
  };

  if (peopleType === "leads") {
    return {
      widgets: {
        totalLeads: getRandomValue(150),
        totalNoShows: getRandomValue(25),
        totalReferrals: getRandomValue(45),
        avgInterest: `${getRandomValue(78, 0.2)}%`,
        newLeads: getRandomValue(35),
        newNoShows: getRandomValue(8),
        newReferrals: getRandomValue(12),
        avgNewInterest: `${getRandomValue(82, 0.2)}%`
      },
      charts: {
        leadsOverview: [
          { month: "Jan", leads: getRandomValue(45), noShows: getRandomValue(8), referrals: getRandomValue(12) },
          { month: "Feb", leads: getRandomValue(52), noShows: getRandomValue(10), referrals: getRandomValue(15) },
          { month: "Mar", leads: getRandomValue(38), noShows: getRandomValue(6), referrals: getRandomValue(9) },
          { month: "Apr", leads: getRandomValue(65), noShows: getRandomValue(12), referrals: getRandomValue(18) },
          { month: "May", leads: getRandomValue(48), noShows: getRandomValue(9), referrals: getRandomValue(14) },
          { month: "Jun", leads: getRandomValue(55), noShows: getRandomValue(11), referrals: getRandomValue(16) }
        ],
        interestTrend: [
          { month: "Jan", interest: getRandomValue(75, 0.1) },
          { month: "Feb", interest: getRandomValue(78, 0.1) },
          { month: "Mar", interest: getRandomValue(82, 0.1) },
          { month: "Apr", interest: getRandomValue(79, 0.1) },
          { month: "May", interest: getRandomValue(85, 0.1) },
          { month: "Jun", interest: getRandomValue(83, 0.1) }
        ]
      },
      metrics: {
        avgApplicationToAssessment: `${getRandomValue(3, 0.3)} days`,
        avgAssessmentToProviderPick: `${getRandomValue(5, 0.3)} days`,
        avgProviderPickToMeeting: `${getRandomValue(7, 0.3)} days`
      },
      otherData: {
        leadsSource: [
          { source: "Website", percentage: getRandomValue(35, 0.2) },
          { source: "Referral", percentage: getRandomValue(25, 0.2) },
          { source: "Facebook", percentage: getRandomValue(15, 0.2) },
          { source: "Instagram", percentage: getRandomValue(10, 0.2) },
          { source: "Google", percentage: getRandomValue(8, 0.2) },
          { source: "Other", percentage: getRandomValue(7, 0.2) }
        ],
        applicationTimes: {
          weekdays: [
            { day: "Monday", percentage: getRandomValue(18, 0.2) },
            { day: "Tuesday", percentage: getRandomValue(22, 0.2) },
            { day: "Wednesday", percentage: getRandomValue(20, 0.2) },
            { day: "Thursday", percentage: getRandomValue(16, 0.2) },
            { day: "Friday", percentage: getRandomValue(14, 0.2) },
            { day: "Saturday", percentage: getRandomValue(6, 0.2) },
            { day: "Sunday", percentage: getRandomValue(4, 0.2) }
          ],
          hours: [
            { time: "9-12 AM", percentage: getRandomValue(25, 0.2) },
            { time: "12-3 PM", percentage: getRandomValue(30, 0.2) },
            { time: "3-6 PM", percentage: getRandomValue(28, 0.2) },
            { time: "6-9 PM", percentage: getRandomValue(12, 0.2) },
            { time: "After 9 PM", percentage: getRandomValue(5, 0.2) }
          ]
        }
      },
      feedback: {
        applicationProcess: [
          { rating: "Wow", count: getRandomValue(45), percentage: getRandomValue(45, 0.1) },
          { rating: "Ok", count: getRandomValue(35), percentage: getRandomValue(35, 0.1) },
          { rating: "Unhappy", count: getRandomValue(20), percentage: getRandomValue(20, 0.1) }
        ]
      },
      trendIndicators: {
        newLeads: getPercentageChange(),
        newNoShows: getPercentageChange(),
        newReferrals: getPercentageChange()
      }
    };
  }

  if (peopleType === "clients") {
    return {
      widgets: {
        totalClients: getRandomValue(320),
        totalDischarged: getRandomValue(45),
        totalIssues: getRandomValue(12),
        avgGrowth: getRandomGrowthStage(),
        newClients: getRandomValue(28),
        newDischarged: getRandomValue(8),
        newIssues: getRandomValue(3),
        avgNewGrowth: getRandomGrowthStage()
      },
      charts: {
        clientsVsAttending: [
          { month: "Jan", clients: getRandomValue(85), attending: getRandomValue(78) },
          { month: "Feb", clients: getRandomValue(92), attending: getRandomValue(85) },
          { month: "Mar", clients: getRandomValue(88), attending: getRandomValue(82) },
          { month: "Apr", clients: getRandomValue(95), attending: getRandomValue(89) },
          { month: "May", clients: getRandomValue(90), attending: getRandomValue(84) },
          { month: "Jun", clients: getRandomValue(98), attending: getRandomValue(92) }
        ],
        dischargedVsIssues: [
          { month: "Jan", discharged: getRandomValue(8), issues: getRandomValue(3) },
          { month: "Feb", discharged: getRandomValue(12), issues: getRandomValue(2) },
          { month: "Mar", discharged: getRandomValue(6), issues: getRandomValue(4) },
          { month: "Apr", discharged: getRandomValue(15), issues: getRandomValue(1) },
          { month: "May", discharged: getRandomValue(9), issues: getRandomValue(5) },
          { month: "Jun", discharged: getRandomValue(11), issues: getRandomValue(2) }
        ],
        interestTrend: [
          { month: "Jan", interest: getRandomValue(88, 0.1) },
          { month: "Feb", interest: getRandomValue(91, 0.1) },
          { month: "Mar", interest: getRandomValue(89, 0.1) },
          { month: "Apr", interest: getRandomValue(93, 0.1) },
          { month: "May", interest: getRandomValue(90, 0.1) },
          { month: "Jun", interest: getRandomValue(95, 0.1) }
        ]
      },
      demographics: {
        ageGroups: [
          { group: "18-24", count: getRandomValue(45), percentage: getRandomValue(18, 0.1) },
          { group: "25-34", count: getRandomValue(85), percentage: getRandomValue(28, 0.1) },
          { group: "35-44", count: getRandomValue(72), percentage: getRandomValue(24, 0.1) },
          { group: "45-54", count: getRandomValue(58), percentage: getRandomValue(19, 0.1) },
          { group: "55-64", count: getRandomValue(35), percentage: getRandomValue(8, 0.1) },
          { group: "65+", count: getRandomValue(15), percentage: getRandomValue(3, 0.1) }
        ],
        genderIdentity: [
          { identity: "Female", count: getRandomValue(185), percentage: getRandomValue(58, 0.1) },
          { identity: "Male", count: getRandomValue(125), percentage: getRandomValue(39, 0.1) },
          { identity: "Non-binary", count: getRandomValue(8), percentage: getRandomValue(2, 0.1) },
          { identity: "Prefer not to say", count: getRandomValue(2), percentage: getRandomValue(1, 0.1) }
        ],
        ethnicity: [
          { ethnicity: "White", count: getRandomValue(145), percentage: getRandomValue(45, 0.1) },
          { ethnicity: "Black/African American", count: getRandomValue(85), percentage: getRandomValue(27, 0.1) },
          { ethnicity: "Hispanic/Latino", count: getRandomValue(48), percentage: getRandomValue(15, 0.1) },
          { ethnicity: "Asian", count: getRandomValue(25), percentage: getRandomValue(8, 0.1) },
          { ethnicity: "Two or More Races", count: getRandomValue(12), percentage: getRandomValue(4, 0.1) },
          { ethnicity: "Other", count: getRandomValue(5), percentage: getRandomValue(1, 0.1) }
        ],
        locations: [
          { region: "Northeast", count: getRandomValue(95), percentage: getRandomValue(30, 0.1) },
          { region: "Southeast", count: getRandomValue(85), percentage: getRandomValue(27, 0.1) },
          { region: "Midwest", count: getRandomValue(68), percentage: getRandomValue(21, 0.1) },
          { region: "Southwest", count: getRandomValue(45), percentage: getRandomValue(14, 0.1) },
          { region: "West", count: getRandomValue(27), percentage: getRandomValue(8, 0.1) }
        ],
        languages: [
          { language: "English", count: getRandomValue(285), percentage: getRandomValue(89, 0.1) },
          { language: "Spanish", count: getRandomValue(25), percentage: getRandomValue(8, 0.1) },
          { language: "French", count: getRandomValue(8), percentage: getRandomValue(2, 0.1) },
          { language: "Other", count: getRandomValue(2), percentage: getRandomValue(1, 0.1) }
        ],
        insurance: [
          { provider: "Molina", count: getRandomValue(85), percentage: getRandomValue(27, 0.1) },
          { provider: "Caresource", count: getRandomValue(72), percentage: getRandomValue(23, 0.1) },
          { provider: "Aetna", count: getRandomValue(58), percentage: getRandomValue(18, 0.1) },
          { provider: "UnitedHealthcare", count: getRandomValue(65), percentage: getRandomValue(20, 0.1) },
          { provider: "Other", count: getRandomValue(40), percentage: getRandomValue(12, 0.1) }
        ]
      },
      feedback: {
        serviceSatisfaction: [
          { rating: "Extremely Satisfied", count: getRandomValue(145), percentage: getRandomValue(45, 0.1) },
          { rating: "Very Satisfied", count: getRandomValue(98), percentage: getRandomValue(31, 0.1) },
          { rating: "Satisfied", count: getRandomValue(52), percentage: getRandomValue(16, 0.1) },
          { rating: "Dissatisfied", count: getRandomValue(18), percentage: getRandomValue(6, 0.1) },
          { rating: "Very Dissatisfied", count: getRandomValue(7), percentage: getRandomValue(2, 0.1) }
        ],
        connectionFrequency: [
          { frequency: "Weekly", count: getRandomValue(125), percentage: getRandomValue(39, 0.1) },
          { frequency: "Bi-weekly", count: getRandomValue(98), percentage: getRandomValue(31, 0.1) },
          { frequency: "Monthly", count: getRandomValue(72), percentage: getRandomValue(23, 0.1) },
          { frequency: "As Needed", count: getRandomValue(25), percentage: getRandomValue(7, 0.1) }
        ],
        supportMethod: [
          { method: "Video Call", count: getRandomValue(145), percentage: getRandomValue(45, 0.1) },
          { method: "Phone Call", count: getRandomValue(85), percentage: getRandomValue(27, 0.1) },
          { method: "In-Person", count: getRandomValue(65), percentage: getRandomValue(20, 0.1) },
          { method: "Text/Chat", count: getRandomValue(25), percentage: getRandomValue(8, 0.1) }
        ],
        likelihood: [
          { rating: "Extremely Likely", count: getRandomValue(158), percentage: getRandomValue(49, 0.1) },
          { rating: "Very Likely", count: getRandomValue(95), percentage: getRandomValue(30, 0.1) },
          { rating: "Likely", count: getRandomValue(45), percentage: getRandomValue(14, 0.1) },
          { rating: "Unlikely", count: getRandomValue(15), percentage: getRandomValue(5, 0.1) },
          { rating: "Very Unlikely", count: getRandomValue(7), percentage: getRandomValue(2, 0.1) }
        ],
        anotherSession: [
          { response: "Definitely", count: getRandomValue(165), percentage: getRandomValue(52, 0.1) },
          { response: "Probably", count: getRandomValue(88), percentage: getRandomValue(28, 0.1) },
          { response: "Maybe", count: getRandomValue(45), percentage: getRandomValue(14, 0.1) },
          { response: "Probably Not", count: getRandomValue(15), percentage: getRandomValue(5, 0.1) },
          { response: "Definitely Not", count: getRandomValue(7), percentage: getRandomValue(1, 0.1) }
        ]
      },
      trendIndicators: {
        newClients: getPercentageChange(),
        newDischarged: getPercentageChange(),
        newIssues: getPercentageChange()
      }
    };
  }

  // Staff data
  return {
    widgets: {
      totalActive: getRandomValue(45),
      totalInactive: getRandomValue(8),
      totalOnboarding: getRandomValue(12),
      avgGrowth: getRandomGrowthStage(),
      newStaff: getRandomValue(5),
      newDischarged: getRandomValue(2),
      newOnboarding: getRandomValue(4),
      avgNewGrowth: getRandomGrowthStage()
    },
    charts: {
      activeVsOnboarding: [
        { month: "Jan", active: getRandomValue(42), onboarding: getRandomValue(8) },
        { month: "Feb", active: getRandomValue(44), onboarding: getRandomValue(6) },
        { month: "Mar", active: getRandomValue(43), onboarding: getRandomValue(9) },
        { month: "Apr", active: getRandomValue(46), onboarding: getRandomValue(7) },
        { month: "May", active: getRandomValue(45), onboarding: getRandomValue(11) },
        { month: "Jun", active: getRandomValue(47), onboarding: getRandomValue(5) }
      ],
      interestTrend: [
        { month: "Jan", interest: getRandomValue(92, 0.1) },
        { month: "Feb", interest: getRandomValue(94, 0.1) },
        { month: "Mar", interest: getRandomValue(91, 0.1) },
        { month: "Apr", interest: getRandomValue(96, 0.1) },
        { month: "May", interest: getRandomValue(93, 0.1) },
        { month: "Jun", interest: getRandomValue(97, 0.1) }
      ]
    },
    demographics: {
      ageGroups: [
        { group: "18-24", count: getRandomValue(5), percentage: getRandomValue(11, 0.1) },
        { group: "25-34", count: getRandomValue(18), percentage: getRandomValue(40, 0.1) },
        { group: "35-44", count: getRandomValue(15), percentage: getRandomValue(33, 0.1) },
        { group: "45-54", count: getRandomValue(6), percentage: getRandomValue(13, 0.1) },
        { group: "55+", count: getRandomValue(3), percentage: getRandomValue(3, 0.1) }
      ],
      genderIdentity: [
        { identity: "Female", count: getRandomValue(32), percentage: getRandomValue(71, 0.1) },
        { identity: "Male", count: getRandomValue(12), percentage: getRandomValue(27, 0.1) },
        { identity: "Non-binary", count: getRandomValue(1), percentage: getRandomValue(2, 0.1) }
      ],
      ethnicity: [
        { ethnicity: "White", count: getRandomValue(25), percentage: getRandomValue(56, 0.1) },
        { ethnicity: "Black/African American", count: getRandomValue(12), percentage: getRandomValue(27, 0.1) },
        { ethnicity: "Hispanic/Latino", count: getRandomValue(5), percentage: getRandomValue(11, 0.1) },
        { ethnicity: "Asian", count: getRandomValue(2), percentage: getRandomValue(4, 0.1) },
        { ethnicity: "Other", count: getRandomValue(1), percentage: getRandomValue(2, 0.1) }
      ],
      locations: [
        { region: "Northeast", count: getRandomValue(15), percentage: getRandomValue(33, 0.1) },
        { region: "Southeast", count: getRandomValue(12), percentage: getRandomValue(27, 0.1) },
        { region: "Midwest", count: getRandomValue(8), percentage: getRandomValue(18, 0.1) },
        { region: "Southwest", count: getRandomValue(6), percentage: getRandomValue(13, 0.1) },
        { region: "West", count: getRandomValue(4), percentage: getRandomValue(9, 0.1) }
      ],
      languages: [
        { language: "English", count: getRandomValue(42), percentage: getRandomValue(93, 0.1) },
        { language: "Spanish", count: getRandomValue(2), percentage: getRandomValue(4, 0.1) },
        { language: "French", count: getRandomValue(1), percentage: getRandomValue(2, 0.1) },
        { language: "Other", count: getRandomValue(1), percentage: getRandomValue(1, 0.1) }
      ],
      roles: [
        { role: "Clinician", count: getRandomValue(25), percentage: getRandomValue(56, 0.1) },
        { role: "Provider", count: getRandomValue(8), percentage: getRandomValue(18, 0.1) },
        { role: "Supervisor", count: getRandomValue(5), percentage: getRandomValue(11, 0.1) },
        { role: "Admin", count: getRandomValue(4), percentage: getRandomValue(9, 0.1) },
        { role: "Executive", count: getRandomValue(3), percentage: getRandomValue(6, 0.1) }
      ],
      tenure: [
        { years: "<1 year", count: getRandomValue(12), percentage: getRandomValue(27, 0.1) },
        { years: "1-3 years", count: getRandomValue(18), percentage: getRandomValue(40, 0.1) },
        { years: "4-7 years", count: getRandomValue(10), percentage: getRandomValue(22, 0.1) },
        { years: "8-15 years", count: getRandomValue(4), percentage: getRandomValue(9, 0.1) },
        { years: "15+ years", count: getRandomValue(1), percentage: getRandomValue(2, 0.1) }
      ]
    },
    feedback: {
      programSatisfaction: [
        { rating: "Extremely Satisfied", count: getRandomValue(25), percentage: getRandomValue(56, 0.1) },
        { rating: "Very Satisfied", count: getRandomValue(12), percentage: getRandomValue(27, 0.1) },
        { rating: "Satisfied", count: getRandomValue(6), percentage: getRandomValue(13, 0.1) },
        { rating: "Dissatisfied", count: getRandomValue(2), percentage: getRandomValue(4, 0.1) }
      ],
      likelihood: [
        { rating: "Extremely Likely", count: getRandomValue(28), percentage: getRandomValue(62, 0.1) },
        { rating: "Very Likely", count: getRandomValue(10), percentage: getRandomValue(22, 0.1) },
        { rating: "Likely", count: getRandomValue(5), percentage: getRandomValue(11, 0.1) },
        { rating: "Unlikely", count: getRandomValue(2), percentage: getRandomValue(5, 0.1) }
      ]
    },
    trendIndicators: {
      newStaff: getPercentageChange(),
      newDischarged: getPercentageChange(),
      newOnboarding: getPercentageChange()
    }
  };
};
