
import { useMemo, useState } from "react";
import UserProfilePage, { TableColumn } from "@/components/UserProfilePage";
import GrowthStatusIndicator from "@/components/Growthstatus";
import FilterSearchBar from "./FilterSearchBar";
import { FilterByOption } from "./types";
import { useIssuesClients } from "@/hooks/useIssuesClients";

const filterByOptions: FilterByOption[] = [
  { value: "provider", label: "Provider" },
  { value: "date-flagged", label: "Date Flagged" },
  { value: "growth", label: "Growth Stage" },
];

const Issues = () => {
  const [filterBy, setFilterBy] = useState(filterByOptions[0].value);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Use the custom hook to fetch data and listen for updates
  const { data: issuesData, loading, error } = useIssuesClients();

  const issuesColumns: TableColumn[] = useMemo(() => [
    {
      key: "dateFlagged",
      header: "Date Flagged",
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
      key: "provider",
      header: "Provider",
      align: "left",
      width: "w-36 md:w-40",
      cellClassName: "text-left",
      render: (value) => value,
    },
    {
      key: "growth",
      header: "Growth",
      align: "center",
      width: "w-36 md:w-40",
      cellClassName: "flex justify-center items-center",
      render: (_value, item) => (
        <div className="flex justify-center items-center w-full">
          <GrowthStatusIndicator
            growthStage={item.growthStage || "foundation"}
            showText={false}
            className="mx-auto"
          />
        </div>
      ),
    },
  ], []);

  return (
    <div>
      <FilterSearchBar
        filterBy={filterBy}
        setFilterBy={setFilterBy}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterByOptions={filterByOptions}
        filterId="filter-by-issues"
        searchId="search-issues"
      />
      <UserProfilePage
        data={issuesData}
        columns={issuesColumns}
        tableTitle="Clients With Issues"
        detailsTitle="Issue Details"
        emptyStateTitle="Select a Client With Issue"
        emptyStateDescription="Click on the details button next to any client to view their issue details."
        showGrowthStatus={false}
        detailsConfig={{
          title: "Issues Overview",
          showHeader: true,
          className: "bg-white",
          renderType: "default",
          summaryConfig: {
            layout: "vertical",
            fields: [
              {
                key: "provider",
                label: "Provider",
                render: (item: any) =>
                  <span className="inline-block rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground font-semibold">
                    {item.provider || ""}
                  </span>,
              },
            ],
          },
        }}
      />
    </div>
  );
};

export default Issues;
