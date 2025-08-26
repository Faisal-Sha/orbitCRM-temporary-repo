
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BarChart from "@/components/charts/BarChart";
import LineChart from "@/components/charts/LineChart";
import { TransactionData } from "@/hooks/useTransactionsData";
import { PieChart, Pie, Cell, ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine } from "recharts";

interface TransactionsChartsProps {
  data: TransactionData[];
  summaryStats: any;
}

const TransactionsCharts = ({ data, summaryStats }: TransactionsChartsProps) => {
  // Pie chart data
  const revenuePieData = [
    { name: 'Planned Revenue', value: summaryStats.totalRevenue * 0.92, fill: '#3b82f6' },
    { name: 'Actual Revenue', value: summaryStats.totalRevenue, fill: '#10b981' },
  ];

  const expensesPieData = [
    { name: 'Planned Expenses', value: summaryStats.totalExpenses * 1.05, fill: '#f59e0b' },
    { name: 'Actual Expenses', value: summaryStats.totalExpenses, fill: '#ef4444' },
  ];

  // Bar chart data for services
  const serviceRevenueData = [
    {
      service: 'Assessments',
      planned: summaryStats.totalRevenue * 0.35 * 0.92,
      actual: summaryStats.totalRevenue * 0.35,
    },
    {
      service: 'CPST',
      planned: summaryStats.totalRevenue * 0.4 * 0.92,
      actual: summaryStats.totalRevenue * 0.4,
    },
    {
      service: 'SUD',
      planned: summaryStats.totalRevenue * 0.25 * 0.92,
      actual: summaryStats.totalRevenue * 0.25,
    },
  ];

  // Bar chart data for costs
  const costCategoryData = [
    {
      category: 'Cost of Services',
      planned: summaryStats.costOfService * 1.05,
      actual: summaryStats.costOfService,
    },
    {
      category: 'Expenditures',
      planned: summaryStats.expenditure * 1.08,
      actual: summaryStats.expenditure,
    },
    {
      category: 'Debt, Tax, Depreciation',
      planned: summaryStats.debtTaxDepreciation * 0.95,
      actual: summaryStats.debtTaxDepreciation,
    },
  ];

  // Monthly combo chart data
  const monthlyComboData = data.slice(-12).map(item => ({
    month: item.month,
    plannedRevenue: item.totalRevenue * 0.92,
    actualRevenue: item.totalRevenue,
    target: 900000,
  }));

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Gross Revenue Pie Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Gross Revenue - Planned vs Actual</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={revenuePieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: $${(value / 1000).toFixed(0)}K`}
                >
                  {revenuePieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${(value as number).toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Costs & Expenditures Pie Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Costs & Expenditures - Planned vs Actual</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expensesPieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: $${(value / 1000).toFixed(0)}K`}
                >
                  {expensesPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${(value as number).toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Revenue by Services Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Revenue by Services</CardTitle>
        </CardHeader>
        <CardContent>
          <BarChart
            data={serviceRevenueData}
            series={[
              { dataKey: 'planned', name: 'Planned', color: '#3b82f6' },
              { dataKey: 'actual', name: 'Actual', color: '#10b981' },
            ]}
            xAxisDataKey="service"
            height={250}
            showSeriesToggle={false}
          />
        </CardContent>
      </Card>

      {/* Costs by Category Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Costs & Expenditures by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <BarChart
            data={costCategoryData}
            series={[
              { dataKey: 'planned', name: 'Planned', color: '#f59e0b' },
              { dataKey: 'actual', name: 'Actual', color: '#ef4444' },
            ]}
            xAxisDataKey="category"
            height={250}
            showSeriesToggle={false}
          />
        </CardContent>
      </Card>

      {/* Monthly Revenue Combo Chart */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-base">Monthly Revenue Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={monthlyComboData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `$${(value as number).toLocaleString()}`} />
                <Legend />
                <Bar dataKey="plannedRevenue" name="Planned Revenue" fill="#3b82f6" />
                <Line type="monotone" dataKey="actualRevenue" name="Actual Revenue" stroke="#10b981" strokeWidth={3} />
                <ReferenceLine y={900000} stroke="#ef4444" strokeDasharray="5 5" label="Revenue Target" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionsCharts;
