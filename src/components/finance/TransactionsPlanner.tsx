
import { useTransactionsData } from "@/hooks/useTransactionsData";
import PlannerStats from "./PlannerStats";
import PlannerCharts from "./PlannerCharts";
import TransactionsTable from "./TransactionsTable";

const TransactionsPlanner = () => {
  const { filteredData, getTableData, summaryStats } = useTransactionsData();

  return (
    <div className="space-y-8">
      {/* Planning Statistics Overview */}
      <PlannerStats summaryStats={summaryStats} />

      {/* Planning Charts Section */}
      <PlannerCharts data={filteredData} summaryStats={summaryStats} />

      {/* Editable Planning Table */}
      <TransactionsTable getTableData={getTableData} isEditable={true} />
    </div>
  );
};

export default TransactionsPlanner;
