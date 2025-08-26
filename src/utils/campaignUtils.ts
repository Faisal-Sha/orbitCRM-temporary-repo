
export const AUDIENCE_OPTIONS = ["Leads", "Clients", "Staff", "Partners"];
export const TYPE_OPTIONS = ["Paid Ads", "Organic", "Referrals", "Partnerships", "Outreach", "Internal", "Events"];

export const AUDIENCE_COLORS: Record<string, string> = {
  "Leads": "bg-blue-100 text-blue-800",
  "Clients": "bg-green-100 text-green-800", 
  "Staff": "bg-purple-100 text-purple-800",
  "Partners": "bg-orange-100 text-orange-800"
};

export const TYPE_COLORS: Record<string, string> = {
  "Paid Ads": "bg-blue-100 text-blue-800",
  "Organic": "bg-green-100 text-green-800",
  "Referrals": "bg-purple-100 text-purple-800",
  "Partnerships": "bg-orange-100 text-orange-800",
  "Outreach": "bg-red-100 text-red-800",
  "Internal": "bg-gray-100 text-gray-800",
  "Events": "bg-yellow-100 text-yellow-800"
};

// Generate dummy campaigns based on audience and type filters
export const generateDummyCampaigns = (audiences: string[] = [], types: string[] = []): Array<{id: string, name: string, audience: string, type: string}> => {
  const campaigns = [
    { id: '1', name: 'Q4 Digital Marketing Push', audience: 'Leads', type: 'Paid Ads' },
    { id: '2', name: 'Holiday Special Promotion', audience: 'Clients', type: 'Organic' },
    { id: '3', name: 'Partner Referral Program', audience: 'Partners', type: 'Referrals' },
    { id: '4', name: 'Staff Training Campaign', audience: 'Staff', type: 'Internal' },
    { id: '5', name: 'Lead Generation Webinar', audience: 'Leads', type: 'Events' },
    { id: '6', name: 'Client Retention Campaign', audience: 'Clients', type: 'Outreach' },
    { id: '7', name: 'Partnership Outreach', audience: 'Partners', type: 'Partnerships' },
    { id: '8', name: 'Organic Content Push', audience: 'Leads', type: 'Organic' },
  ];

  return campaigns.filter(campaign => {
    const audienceMatch = audiences.length === 0 || audiences.includes(campaign.audience);
    const typeMatch = types.length === 0 || types.includes(campaign.type);
    return audienceMatch && typeMatch;
  });
};
