
import { useMemo, useState } from "react";
import UserProfilePage, { TableColumn } from "@/components/UserProfilePage";
import { Mail, Phone } from "lucide-react";
import MilestonesIcon from "@/components/MilestonesIcon";
import FilterSearchBar from "./FilterSearchBar";
import { generateNoShowsData, milestoneSetsNoShows, filterByOptions } from "./data";

interface NoShowsProps {
  useSimplifiedView: boolean;
}

const NoShows = ({ useSimplifiedView }: NoShowsProps) => {
  const [filterByNoShows, setFilterByNoShows] = useState(filterByOptions[0].value);
  const [searchTermNoShows, setSearchTermNoShows] = useState("");

  // No Shows data
  const noShowsData = useMemo(() => {
    return generateNoShowsData().sort((a, b) => {
      const dateA = new Date(a.inquiryDate);
      const dateB = new Date(b.inquiryDate);
      return dateB.getTime() - dateA.getTime();
    });
  }, []);

  // No Shows columns
  const noShowsColumns: TableColumn[] = useMemo(() => [
    {
      key: "inquiryDate",
      header: "Appointment",
      align: "left",
      width: "w-32 md:w-36",
    },
    {
      key: "name",
      header: "Name",
      align: "left",
      width: "w-28 md:w-32",
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
        const key = item.interest || "45%";
        return (
          <div className="flex justify-center items-center w-full">
            <MilestonesIcon
              milestones={milestoneSetsNoShows[key] || milestoneSetsNoShows["45%"]}
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
        filterId="filter-by-ns"
        searchId="search-no-shows"
        filterBy={filterByNoShows}
        setFilterBy={setFilterByNoShows}
        searchTerm={searchTermNoShows}
        setSearchTerm={setSearchTermNoShows}
        filterByOptions={filterByOptions}
      />
      <UserProfilePage
        data={noShowsData}
        columns={noShowsColumns}
        tableTitle="No Shows"
        detailsTitle="No Show Details"
        emptyStateTitle="Select a No Show"
        emptyStateDescription="Click on the details button next to any no show to view their detailed information."
        showGrowthStatus={false}
        detailsConfig={{
          title: "No Show Overview",
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
                          {item.email || "email@example.com"}
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
                          {item.phone || "000-000-0000"}
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

export default NoShows;
