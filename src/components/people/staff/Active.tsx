
import { useMemo, useState } from "react";
import UserProfilePage from "@/components/UserProfilePage";
import GrowthStatusIndicator from "@/components/Growthstatus";
import FilterSearchBar from "./FilterSearchBar";
import { generateActiveStaffData, filterByOptions } from "./data";
import { useActiveStaff } from "@/hooks/useActiveStaff";
import { Column } from "./types";

const Active = () => {
  const [filterBy, setFilterBy] = useState(filterByOptions[0].value);
  const [searchTerm, setSearchTerm] = useState("");
  const { staffData, loading, error } = useActiveStaff();

  // Columns definition
  const columns = useMemo<Column[]>(() => [
    {
      key: "joinDate",
      header: "Join Date",
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
      key: "contribution",
      header: "Contribution",
      align: "center",
      width: "w-16 md:w-20",
      cellClassName: "font-semibold text-center",
      render: (value: string) => (
        <span className="text-blue-700 font-medium">{value}</span>
      ),
    },
    {
      key: "growth",
      header: "Growth",
      align: "center",
      width: "w-36 md:w-40",
      cellClassName: "flex justify-center items-center",
      render: (_value: any, item: any) => (
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
        filterByValue={filterBy}
        setFilterByValue={setFilterBy}
        search={searchTerm}
        setSearch={setSearchTerm}
        id="active"
        filterByOptions={filterByOptions}
      />
      
      {loading ? (
        <div className="flex items-center justify-center h-32">
          <p className="text-muted-foreground">Loading active staff...</p>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-32">
          <p className="text-red-500">Error: {error}</p>
        </div>
      ) : (
        <UserProfilePage
          data={staffData.length > 0 ? staffData : generateActiveStaffData()}
          columns={columns}
          tableTitle="Active Staff"
          detailsTitle="Staff Details"
          emptyStateTitle="Select a Staff Member"
          emptyStateDescription="Click on the details button next to any staff to view their detailed information."
          showGrowthStatus={false}
          detailsConfig={{
            title: "Staff Overview",
            showHeader: true,
            className: "bg-white",
            renderType: "default",
            summaryConfig: {
              layout: "vertical",
              fields: [
                {
                  key: "contribution",
                  label: "Contribution",
                  render: (item: any) => (
                    <span className="inline-block rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground font-semibold">
                      {item.contribution || ""}
                    </span>
                  ),
                },
              ],
            },
          }}
        />
      )}
    </div>
  );
};

export default Active;
