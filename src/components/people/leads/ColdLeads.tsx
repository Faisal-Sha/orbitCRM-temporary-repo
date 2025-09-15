
import { useMemo, useState } from "react";
import UserProfilePage, { TableColumn } from "@/components/UserProfilePage";
import { Mail, Phone } from "lucide-react";
import MilestonesIcon from "@/components/MilestonesIcon";
import FilterSearchBar from "./FilterSearchBar";
import { milestoneSets, filterByOptions } from "./data";
import { useLeads } from "@/hooks/useLeads";
import { transformLeadData } from "./utils";

interface ColdLeadsProps {
  useSimplifiedView: boolean;
}

const ColdLeads = ({ useSimplifiedView }: ColdLeadsProps) => {
  const [filterBy, setFilterBy] = useState(filterByOptions[0].value);
  const [searchTerm, setSearchTerm] = useState("");

  // Leads data from Supabase
  const { data: leadRecords, isLoading, error } = useLeads();
  
  const leadsData = useMemo(() => {
    if (!leadRecords) return [];
    return transformLeadData(leadRecords).sort((a, b) => {
      const dateA = new Date(a.inquiryDate);
      const dateB = new Date(b.inquiryDate);
      return dateB.getTime() - dateA.getTime(); // newest to oldest
    });
  }, [leadRecords]);

  // Table columns
  const leadColumns: TableColumn[] = useMemo(() => [
    {
      key: "inquiryDate",
      header: "Application",
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
        const key = item.interest || "70%";
        return (
          <div className="flex justify-center items-center w-full">
            <MilestonesIcon
              milestones={milestoneSets[key] || milestoneSets["70%"]}
              iconSize={5}
              tooltipSide="top"
              tooltipAlign="center"
            />
          </div>
        );
      },
    },
  ], []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">Loading leads...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-destructive">Error loading leads: {error.message}</div>
      </div>
    );
  }

  return (
    <div>
      <FilterSearchBar
        filterId="filter-by"
        searchId="search-leads"
        filterBy={filterBy}
        setFilterBy={setFilterBy}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterByOptions={filterByOptions}
      />
      <UserProfilePage
        data={leadsData}
        columns={leadColumns}
        tableTitle="Cold Leads"
        detailsTitle="Lead Details"
        emptyStateTitle="Select a Lead"
        emptyStateDescription="Click on the details button next to any lead to view their detailed information."
        showGrowthStatus={false}
        detailsConfig={{
          title: "Lead Overview",
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

export default ColdLeads;
