
import { useMemo, useState } from "react";
import UserProfilePage, { TableColumn } from "@/components/UserProfilePage";
import GrowthStatusIndicator from "@/components/Growthstatus";
import FilterSearchBar from "./FilterSearchBar";
import { useActiveClients } from "@/hooks/useActiveClients";
import { FilterByOption } from "./types";

const filterByOptions: FilterByOption[] = [
  { value: "provider", label: "Provider" },
  { value: "date-started", label: "Date Started" },
  { value: "growth", label: "Growth Stage" },
];

const Active = () => {
  const [filterBy, setFilterBy] = useState(filterByOptions[0].value);
  const [searchTerm, setSearchTerm] = useState("");
  const { data: clientsData, loading, error } = useActiveClients();

  // Filter and search the data
  const filteredData = useMemo(() => {
    if (!clientsData) return [];
    
    let filtered = [...clientsData];
    
    // Apply search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(client => 
        client.name.toLowerCase().includes(searchLower) ||
        client.email.toLowerCase().includes(searchLower) ||
        client.phone.toLowerCase().includes(searchLower) ||
        client.provider.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply sort based on filterBy
    switch (filterBy) {
      case "provider":
        filtered.sort((a, b) => a.provider.localeCompare(b.provider));
        break;
      case "date-started":
        filtered.sort((a, b) => new Date(b.dateStarted || '').getTime() - new Date(a.dateStarted || '').getTime());
        break;
      case "growth":
        const growthOrder = { established: 3, developing: 2, foundation: 1 };
        filtered.sort((a, b) => (growthOrder[b.growthStage as keyof typeof growthOrder] || 0) - (growthOrder[a.growthStage as keyof typeof growthOrder] || 0));
        break;
    }
    
    return filtered;
  }, [clientsData, searchTerm, filterBy]);

  const clientColumns: TableColumn[] = useMemo(() => [
    {
      key: "dateStarted",
      header: "Date Started",
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
        filterId="filter-by-active"
        searchId="search-active"
      />
      {loading && <div className="flex justify-center p-4">Loading clients...</div>}
      {error && <div className="text-red-500 p-4">Error: {error}</div>}
      {!loading && !error && (
        <UserProfilePage
          data={filteredData}
          columns={clientColumns}
          tableTitle="Active Clients"
          detailsTitle="Client Overview"
          emptyStateTitle="Select a Client"
          emptyStateDescription="Click on the details button next to any client to view their detailed information."
          showGrowthStatus={false}
          detailsConfig={{
            title: "Client Overview",
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
      )}
    </div>
  );
};

export default Active;
