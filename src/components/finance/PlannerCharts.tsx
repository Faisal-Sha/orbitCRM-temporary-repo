
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BarChart from "@/components/charts/BarChart";
import { TransactionData } from "@/hooks/useTransactionsData";
import { PieChart, Pie, Cell, ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine } from "recharts";

interface PlannerChartsProps {
  data: TransactionData[];
  summaryStats: any;
}

const PlannerCharts = ({ data, summaryStats }: PlannerChartsProps) => {
  // Revenue vs Costs pie chart
  const revenueVsCostsData = [
    { name: 'Planned Revenue', value: summaryStats.totalRevenue, fill: '#3b82f6' },
    { name: 'Planned Costs & Expenditures', value: summaryStats.totalExpenses, fill: '#ef4444' },
  ];

  // Services revenue data
  const serviceRevenueData = [
    {
      service: 'Assessments',
      planned: summaryStats.totalRevenue * 0.35,
      actual: summaryStats.totalRevenue * 0.35 * 1.08,
    },
    {
      service: 'CPST',
      planned: summaryStats.totalRevenue * 0.4,
      actual: summaryStats.totalRevenue * 0.4 * 1.05,
    },
    {
      service: 'SUD',
      planned: summaryStats.totalRevenue * 0.25,
      actual: summaryStats.totalRevenue * 0.25 * 1.12,
    },
  ];

  // Cost categories data
  const costCategoryData = [
    {
      category: 'Cost of Services',
      planned: summaryStats.costOfService,
      actual: summaryStats.costOfService * 0.95,
    },
    {
      category: 'Expenditures',
      planned: summaryStats.expenditure,
      actual: summaryStats.expenditure * 0.92,
    },
    {
      category: 'Debt, Tax, Depreciation',
      planned: summaryStats.debtTaxDepreciation,
      actual: summaryStats.debtTaxDepreciation * 1.05,
    },
  ];

  // Monthly planning combo chart
  const monthlyPlanningData = data.slice(-12).map(item => ({
    month: item.month,
    plannedRevenue: item.totalRevenue,
    plannedExpenses: item.operatingExpenses,
    revenueTarget: 950000,
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Revenue vs Costs Pie Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Planned Revenue vs Costs & Expenditures</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={revenueVsCostsData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: $${(value / 1000).toFixed(0)}K`}
                >
                  {revenueVsCostsData.map((entry, index) => (
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
          <CardTitle className="text-base">Revenue by Services - Planned vs Actual</CardTitle>
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

      {/* Monthly Planning Combo Chart */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-base">Monthly Financial Planning</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={monthlyPlanningData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `$${(value as number).toLocaleString()}`} />
                <Legend />
                <Bar dataKey="plannedRevenue" name="Planned Revenue" fill="#3b82f6" />
                <Line type="monotone" dataKey="plannedExpenses" name="Planned Expenses" stroke="#ef4444" strokeWidth={3} />
                <ReferenceLine y={950000} stroke="#10b981" strokeDasharray="5 5" label="Revenue Target" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlannerCharts;
