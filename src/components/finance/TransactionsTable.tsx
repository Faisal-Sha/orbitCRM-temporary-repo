
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import DateRangePicker from "./DateRangePicker";
import { TransactionData, TableDateRange } from "@/hooks/useTransactionsData";

interface TransactionsTableProps {
  getTableData: (range: TableDateRange, customRange?: {from?: Date; to?: Date}) => TransactionData[];
  isEditable?: boolean;
}

const TransactionsTable = ({ getTableData, isEditable = false }: TransactionsTableProps) => {
  const [tableRange, setTableRange] = useState<TableDateRange>("this-year");
  const [customRange, setCustomRange] = useState<{from?: Date; to?: Date}>({});
  const [editableData, setEditableData] = useState<TransactionData[]>([]);

  const tableData = getTableData(tableRange, customRange);

  // Initialize editable data when table data changes
  useState(() => {
    if (isEditable && tableData.length > 0) {
      setEditableData([...tableData]);
    }
  });

  const handleCustomRangeChange = (from: Date | undefined, to: Date | undefined) => {
    setCustomRange({ from, to });
  };

  const handleCellEdit = (rowIndex: number, field: keyof TransactionData, value: string) => {
    if (!isEditable) return;
    
    const updatedData = [...editableData];
    const numericValue = parseFloat(value) || 0;
    updatedData[rowIndex] = { ...updatedData[rowIndex], [field]: numericValue };
    setEditableData(updatedData);
  };

  const displayData = isEditable && editableData.length > 0 ? editableData : tableData;
  const shouldScroll = displayData.length > 12;

  const formatCurrency = (value: number) => `$${value.toLocaleString()}`;
  const formatNumber = (value: number) => value.toLocaleString();
  const formatPercentage = (value: number) => `${value.toFixed(1)}%`;

  const renderCell = (value: number, rowIndex: number, field: keyof TransactionData, format: 'currency' | 'number' | 'percentage' = 'currency') => {
    const formattedValue = format === 'currency' ? formatCurrency(value) : 
                          format === 'percentage' ? formatPercentage(value) : 
                          formatNumber(value);
    
    if (isEditable) {
      return (
        <Input
          value={value.toString()}
          onChange={(e) => handleCellEdit(rowIndex, field, e.target.value)}
          className="h-8 text-sm"
          type="number"
          step={format === 'percentage' ? '0.1' : '1'}
        />
      );
    }
    
    return formattedValue;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Financial Data Table</CardTitle>
            <div className="flex items-center gap-4">
              <Select value={tableRange} onValueChange={(val) => setTableRange(val as TableDateRange)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="this-year">This Year</SelectItem>
                  <SelectItem value="last-year">Last Year</SelectItem>
                  <SelectItem value="last-12-months">Last 12 Months</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
              {tableRange === "custom" && (
                <DateRangePicker onDateRangeChange={handleCustomRangeChange} />
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className={`${shouldScroll ? 'overflow-x-auto' : ''}`}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[200px] sticky left-0 bg-background">Description</TableHead>
                  {displayData.map((item, index) => (
                    <TableHead key={index} className="text-center min-w-[100px]">
                      {item.month}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Transactions Summary */}
                <TableRow className="bg-muted/50">
                  <TableCell className="font-semibold sticky left-0 bg-muted/50">Transactions Summary</TableCell>
                  {displayData.map((_, index) => (
                    <TableCell key={index}></TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className="sticky left-0 bg-background pl-4">Total Revenue</TableCell>
                  {displayData.map((item, index) => (
                    <TableCell key={index} className="text-center">
                      {renderCell(item.totalRevenue, index, 'totalRevenue')}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className="sticky left-0 bg-background pl-4">Monthly Rev Growth Rate %</TableCell>
                  {displayData.map((item, index) => (
                    <TableCell key={index} className="text-center">
                      {renderCell(item.monthlyGrowthRate, index, 'monthlyGrowthRate', 'percentage')}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className="sticky left-0 bg-background pl-4">Operating Expenses</TableCell>
                  {displayData.map((item, index) => (
                    <TableCell key={index} className="text-center">
                      {renderCell(item.operatingExpenses, index, 'operatingExpenses')}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className="sticky left-0 bg-background pl-4">Total Net Income</TableCell>
                  {displayData.map((item, index) => (
                    <TableCell key={index} className="text-center">
                      {renderCell(item.totalNetIncome, index, 'totalNetIncome')}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className="sticky left-0 bg-background pl-4">Gross Margin %</TableCell>
                  {displayData.map((item, index) => (
                    <TableCell key={index} className="text-center">
                      {renderCell(item.grossMargin, index, 'grossMargin', 'percentage')}
                    </TableCell>
                  ))}
                </TableRow>

                {/* Growth Data */}
                <TableRow className="bg-muted/50">
                  <TableCell className="font-semibold sticky left-0 bg-muted/50">Growth Data</TableCell>
                  {displayData.map((_, index) => (
                    <TableCell key={index}></TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className="sticky left-0 bg-background pl-4">New Clients</TableCell>
                  {displayData.map((item, index) => (
                    <TableCell key={index} className="text-center">
                      {renderCell(item.newClients, index, 'newClients', 'number')}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className="sticky left-0 bg-background pl-4">Total Clients</TableCell>
                  {displayData.map((item, index) => (
                    <TableCell key={index} className="text-center">
                      {renderCell(item.totalClients, index, 'totalClients', 'number')}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className="sticky left-0 bg-background pl-4"># of Services</TableCell>
                  {displayData.map((item, index) => (
                    <TableCell key={index} className="text-center">
                      {renderCell(item.numberOfServices, index, 'numberOfServices', 'number')}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className="sticky left-0 bg-background pl-4"># of Service Providers</TableCell>
                  {displayData.map((item, index) => (
                    <TableCell key={index} className="text-center">
                      {renderCell(item.numberOfProviders, index, 'numberOfProviders', 'number')}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className="sticky left-0 bg-background pl-4">Service Hours Billed</TableCell>
                  {displayData.map((item, index) => (
                    <TableCell key={index} className="text-center">
                      {renderCell(item.serviceHoursBilled, index, 'serviceHoursBilled', 'number')}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className="sticky left-0 bg-background pl-4">Avg Hours per Client</TableCell>
                  {displayData.map((item, index) => (
                    <TableCell key={index} className="text-center">
                      {renderCell(item.avgHoursPerClient, index, 'avgHoursPerClient', 'number')}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className="sticky left-0 bg-background pl-4">Avg Clients per Provider</TableCell>
                  {displayData.map((item, index) => (
                    <TableCell key={index} className="text-center">
                      {renderCell(item.avgClientsPerProvider, index, 'avgClientsPerProvider', 'number')}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className="sticky left-0 bg-background pl-4">Avg Hours per Provider</TableCell>
                  {displayData.map((item, index) => (
                    <TableCell key={index} className="text-center">
                      {renderCell(item.avgHoursPerProvider, index, 'avgHoursPerProvider', 'number')}
                    </TableCell>
                  ))}
                </TableRow>

                {/* Revenue Data */}
                <TableRow className="bg-muted/50">
                  <TableCell className="font-semibold sticky left-0 bg-muted/50">Revenue Data</TableCell>
                  {displayData.map((_, index) => (
                    <TableCell key={index}></TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className="sticky left-0 bg-background pl-4">Assessments Revenue</TableCell>
                  {displayData.map((item, index) => (
                    <TableCell key={index} className="text-center">
                      {renderCell(item.assessmentsRevenue, index, 'assessmentsRevenue')}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className="sticky left-0 bg-background pl-4">CPST Hours Revenue</TableCell>
                  {displayData.map((item, index) => (
                    <TableCell key={index} className="text-center">
                      {renderCell(item.cpstHoursRevenue, index, 'cpstHoursRevenue')}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className="sticky left-0 bg-background pl-4">SUD Hours Revenue</TableCell>
                  {displayData.map((item, index) => (
                    <TableCell key={index} className="text-center">
                      {renderCell(item.sudHoursRevenue, index, 'sudHoursRevenue')}
                    </TableCell>
                  ))}
                </TableRow>

                {/* Costs & Expenditure - Cost of Services */}
                <TableRow className="bg-muted/50">
                  <TableCell className="font-semibold sticky left-0 bg-muted/50">Costs & Expenditure</TableCell>
                  {displayData.map((_, index) => (
                    <TableCell key={index}></TableCell>
                  ))}
                </TableRow>
                <TableRow className="bg-muted/25">
                  <TableCell className="font-medium sticky left-0 bg-muted/25 pl-2">Cost of Services (category)</TableCell>
                  {displayData.map((_, index) => (
                    <TableCell key={index}></TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className="sticky left-0 bg-background pl-6">Labor – Service Providers</TableCell>
                  {displayData.map((item, index) => (
                    <TableCell key={index} className="text-center">
                      {renderCell(item.laborServiceProviders, index, 'laborServiceProviders')}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className="sticky left-0 bg-background pl-6">Labor – Clinicians</TableCell>
                  {displayData.map((item, index) => (
                    <TableCell key={index} className="text-center">
                      {renderCell(item.laborClinicians, index, 'laborClinicians')}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className="sticky left-0 bg-background pl-6">General – Freight & Postage</TableCell>
                  {displayData.map((item, index) => (
                    <TableCell key={index} className="text-center">
                      {renderCell(item.freightPostage, index, 'freightPostage')}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className="sticky left-0 bg-background pl-6">Other costs of services</TableCell>
                  {displayData.map((item, index) => (
                    <TableCell key={index} className="text-center">
                      {renderCell(item.otherCostServices, index, 'otherCostServices')}
                    </TableCell>
                  ))}
                </TableRow>

                {/* Operating Expenses */}
                <TableRow className="bg-muted/25">
                  <TableCell className="font-medium sticky left-0 bg-muted/25 pl-2">Operating Expenses (category)</TableCell>
                  {displayData.map((_, index) => (
                    <TableCell key={index}></TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className="sticky left-0 bg-background pl-6">Fractional Exec</TableCell>
                  {displayData.map((item, index) => (
                    <TableCell key={index} className="text-center">
                      {renderCell(item.fractionalExec, index, 'fractionalExec')}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className="sticky left-0 bg-background pl-6">Fractional Contractors</TableCell>
                  {displayData.map((item, index) => (
                    <TableCell key={index} className="text-center">
                      {renderCell(item.fractionalContractors, index, 'fractionalContractors')}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className="sticky left-0 bg-background pl-6">Payroll Processing Expenses</TableCell>
                  {displayData.map((item, index) => (
                    <TableCell key={index} className="text-center">
                      {renderCell(item.payrollProcessing, index, 'payrollProcessing')}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className="sticky left-0 bg-background pl-6">Rent & Utilities</TableCell>
                  {displayData.map((item, index) => (
                    <TableCell key={index} className="text-center">
                      {renderCell(item.rentUtilities, index, 'rentUtilities')}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className="sticky left-0 bg-background pl-6">Professional Fees & Services</TableCell>
                  {displayData.map((item, index) => (
                    <TableCell key={index} className="text-center">
                      {renderCell(item.professionalFees, index, 'professionalFees')}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className="sticky left-0 bg-background pl-6">Office Supplies & Expenses</TableCell>
                  {displayData.map((item, index) => (
                    <TableCell key={index} className="text-center">
                      {renderCell(item.officeSupplies, index, 'officeSupplies')}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className="sticky left-0 bg-background pl-6">Advertising – CPST</TableCell>
                  {displayData.map((item, index) => (
                    <TableCell key={index} className="text-center">
                      {renderCell(item.advertisingCPST, index, 'advertisingCPST')}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className="sticky left-0 bg-background pl-6">Advertising – SUD</TableCell>
                  {displayData.map((item, index) => (
                    <TableCell key={index} className="text-center">
                      {renderCell(item.advertisingSUD, index, 'advertisingSUD')}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className="sticky left-0 bg-background pl-6">Insurance</TableCell>
                  {displayData.map((item, index) => (
                    <TableCell key={index} className="text-center">
                      {renderCell(item.insurance, index, 'insurance')}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className="sticky left-0 bg-background pl-6">Technology & Software</TableCell>
                  {displayData.map((item, index) => (
                    <TableCell key={index} className="text-center">
                      {renderCell(item.technologySoftware, index, 'technologySoftware')}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className="sticky left-0 bg-background pl-6">Travel & Entertainment</TableCell>
                  {displayData.map((item, index) => (
                    <TableCell key={index} className="text-center">
                      {renderCell(item.travelEntertainment, index, 'travelEntertainment')}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className="sticky left-0 bg-background pl-6">Repairs & Maintenance</TableCell>
                  {displayData.map((item, index) => (
                    <TableCell key={index} className="text-center">
                      {renderCell(item.repairsMaintenance, index, 'repairsMaintenance')}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className="sticky left-0 bg-background pl-6">Permits & Licensing</TableCell>
                  {displayData.map((item, index) => (
                    <TableCell key={index} className="text-center">
                      {renderCell(item.permitsLicensing, index, 'permitsLicensing')}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className="sticky left-0 bg-background pl-6">Uncategorized Expenses</TableCell>
                  {displayData.map((item, index) => (
                    <TableCell key={index} className="text-center">
                      {renderCell(item.uncategorizedExpenses, index, 'uncategorizedExpenses')}
                    </TableCell>
                  ))}
                </TableRow>

                {/* Debt, Taxes, Depreciation */}
                <TableRow className="bg-muted/25">
                  <TableCell className="font-medium sticky left-0 bg-muted/25 pl-2">Debt, Taxes, Depreciation (category)</TableCell>
                  {displayData.map((_, index) => (
                    <TableCell key={index}></TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className="sticky left-0 bg-background pl-6">Business Banking Fees</TableCell>
                  {displayData.map((item, index) => (
                    <TableCell key={index} className="text-center">
                      {renderCell(item.businessBankingFees, index, 'businessBankingFees')}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className="sticky left-0 bg-background pl-6">Business Debt Interest</TableCell>
                  {displayData.map((item, index) => (
                    <TableCell key={index} className="text-center">
                      {renderCell(item.businessDebtInterest, index, 'businessDebtInterest')}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className="sticky left-0 bg-background pl-6">Company Payable Tax (paid)</TableCell>
                  {displayData.map((item, index) => (
                    <TableCell key={index} className="text-center">
                      {renderCell(item.companyPayableTax, index, 'companyPayableTax')}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className="sticky left-0 bg-background pl-6">Depreciation Expense</TableCell>
                  {displayData.map((item, index) => (
                    <TableCell key={index} className="text-center">
                      {renderCell(item.depreciationExpense, index, 'depreciationExpense')}
                    </TableCell>
                  ))}
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionsTable;
