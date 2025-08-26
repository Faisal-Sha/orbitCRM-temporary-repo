
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTransactionsData } from "@/hooks/useTransactionsData";
import DateRangeFilter from "@/components/finance/DateRangeFilter";
import TransactionsActual from "@/components/finance/TransactionsActual";
import TransactionsPlanner from "@/components/finance/TransactionsPlanner";

const Transactions = () => {
  const [activeTab, setActiveTab] = useState("transactions");
  const { dateRange, setDateRange, setCustomDateRange } = useTransactionsData();

  const handleCustomRangeChange = (from: Date | undefined, to: Date | undefined) => {
    setCustomDateRange({ from, to });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Financial Transactions</h1>
        <p className="text-muted-foreground">
          View and manage actual transactions and financial planning.
        </p>
      </div>

      {/* Global Date Range Filter */}
      <div className="flex justify-between items-center p-4 bg-muted/30 rounded-lg">
        <h3 className="font-medium">Date Range Filter</h3>
        <DateRangeFilter
          value={dateRange}
          onChange={setDateRange}
          onCustomRangeChange={handleCustomRangeChange}
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
          <TabsTrigger value="transactions" className="text-sm font-medium">
            Transactions
          </TabsTrigger>
          <TabsTrigger value="planner" className="text-sm font-medium">
            Planner
          </TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="space-y-6">
          <TransactionsActual />
        </TabsContent>

        <TabsContent value="planner" className="space-y-6">
          <TransactionsPlanner />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Transactions;
