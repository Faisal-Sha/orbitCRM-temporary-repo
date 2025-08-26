
import { useTransactionsData } from "@/hooks/useTransactionsData";
import TransactionsStats from "./TransactionsStats";
import TransactionsCharts from "./TransactionsCharts";
import TransactionsTable from "./TransactionsTable";

const TransactionsActual = () => {
  const { filteredData, getTableData, summaryStats } = useTransactionsData();

  return (
    <div className="space-y-8">
      {/* Statistics Overview */}
      <TransactionsStats summaryStats={summaryStats} />

      {/* Charts Section */}
      <TransactionsCharts data={filteredData} summaryStats={summaryStats} />

      {/* Table Section */}
      <TransactionsTable getTableData={getTableData} isEditable={false} />
    </div>
  );
};

export default TransactionsActual;
