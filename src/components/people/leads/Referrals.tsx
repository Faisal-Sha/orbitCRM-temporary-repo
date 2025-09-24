
import { useMemo, useState } from "react";
import UserProfilePage, { TableColumn } from "@/components/UserProfilePage";
import { Mail, Phone } from "lucide-react";
import MilestonesIcon from "@/components/MilestonesIcon";
import FilterSearchBar from "./FilterSearchBar";
import { generateReferralsData, milestoneSetsReferrals, filterByOptions } from "./data";

interface ReferralsProps {
  useSimplifiedView: boolean;
}

const Referrals = ({ useSimplifiedView }: ReferralsProps) => {
  const [filterByReferrals, setFilterByReferrals] = useState(filterByOptions[0].value);
  const [searchTermReferrals, setSearchTermReferrals] = useState("");

  // Referrals data
  const referralsData = useMemo(() => {
    return generateReferralsData()
      .map(item => ({
        ...item,
        name: item.person ? `${item.person.first_name} ${item.person.last_name}` : 'Unknown',
        email: item.person?.email || '',
        phone: item.person?.phone || '',
        inquiryDate: item.entryDate,
        status: 'referral'
      }))
      .sort((a, b) => {
        const dateA = new Date(a.entryDate);
        const dateB = new Date(b.entryDate);
        return dateB.getTime() - dateA.getTime();
      });
  }, []);

  // Referrals columns
  const referralsColumns: TableColumn[] = useMemo(() => [
    {
      key: "entryDate",
      header: "Entry Date",
      align: "left",
      width: "w-32 md:w-36",
    },
    {
      key: "name",
      header: "Name", 
      align: "left",
      width: "w-28 md:w-32",
      render: (value, item) => {
        const person = item.person;
        return person ? `${person.first_name} ${person.last_name}` : 'Unknown';
      }
    },
    {
      key: "interest",
      header: "Interest",
      align: "center",
      width: "w-16 md:w-20",
      cellClassName: "font-semibold text-center",
    },
    {
      key: "milestones",
      header: "Milestones",
      align: "center",
      width: "w-36 md:w-40",
      cellClassName: "flex justify-center items-center",
      render: (value, item) => {
        const key = item.interest || "69%";
        return (
          <div className="flex justify-center items-center w-full">
            <MilestonesIcon
              milestones={milestoneSetsReferrals[key] || milestoneSetsReferrals["69%"]}
              iconSize={5}
              tooltipSide="top"
              tooltipAlign="center"
            />
          </div>
        );
      },
    },
  ], []);

  return (
    <div>
      <FilterSearchBar
        filterId="filter-by-referrals"
        searchId="search-referrals"
        filterBy={filterByReferrals}
        setFilterBy={setFilterByReferrals}
        searchTerm={searchTermReferrals}
        setSearchTerm={setSearchTermReferrals}
        filterByOptions={filterByOptions}
      />
      <UserProfilePage
        data={referralsData}
        columns={referralsColumns}
        tableTitle="Referrals"
        detailsTitle="Referral Details"
        emptyStateTitle="Select a Referral"
        emptyStateDescription="Click on the details button next to any referral to view their detailed information."
        showGrowthStatus={false}
        detailsConfig={{
          title: "Referral Overview",
          showHeader: true,
          className: "bg-white",
          renderType: useSimplifiedView ? "summary" : "default",
          summaryConfig: useSimplifiedView
            ? {
                layout: "vertical",
                fields: [
                  {
                    key: "email",
                    label: "Email",
                    render: (value, item) => (
                      <>
                        <Mail className="h-4 w-4 text-blue-500" />
                        <span className="text-sm">
                          {item.person?.email || "email@example.com"}
                        </span>
                      </>
                    ),
                  },
                  {
                    key: "phone",
                    label: "Phone",
                    render: (value, item) => (
                      <>
                        <Phone className="h-4 w-4 text-green-500" />
                        <span className="text-sm">
                          {item.person?.phone || "000-000-0000"}
                        </span>
                      </>
                    ),
                  },
                ],
              }
            : undefined,
        }}
      />
    </div>
  );
};

export default Referrals;
