
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ServiceCharge {
  id: string;
  clientName: string;
  serviceProvided: string;
  provider: string;
  dateOfService: string;
  chargeAmount: number;
  status: "unbilled" | "approved" | "paid" | "rejected";
  notes: string;
  rejectionNotes?: string;
  billingCode: string;
  duration: number;
}

interface BillingStatisticsProps {
  filteredCharges: ServiceCharge[];
}

const BillingStatistics = ({ filteredCharges }: BillingStatisticsProps) => {
  const getStatistics = () => {
    const totalCharges = filteredCharges.reduce((sum, charge) => sum + charge.chargeAmount, 0);
    const totalCount = filteredCharges.length;

    const unbilledCharges = filteredCharges.filter(c => c.status === "unbilled");
    const unbilledAmount = unbilledCharges.reduce((sum, charge) => sum + charge.chargeAmount, 0);
    const unbilledCount = unbilledCharges.length;

    const approvedCharges = filteredCharges.filter(c => c.status === "approved");
    const approvedAmount = approvedCharges.reduce((sum, charge) => sum + charge.chargeAmount, 0);
    const approvedCount = approvedCharges.length;

    const paidCharges = filteredCharges.filter(c => c.status === "paid");
    const paidAmount = paidCharges.reduce((sum, charge) => sum + charge.chargeAmount, 0);
    const paidCount = paidCharges.length;

    const rejectedCharges = filteredCharges.filter(c => c.status === "rejected");
    const rejectedAmount = rejectedCharges.reduce((sum, charge) => sum + charge.chargeAmount, 0);
    const rejectedCount = rejectedCharges.length;

    return {
      total: { amount: totalCharges, count: totalCount },
      unbilled: { amount: unbilledAmount, count: unbilledCount },
      approved: { amount: approvedAmount, count: approvedCount },
      paid: { amount: paidAmount, count: paidCount },
      rejected: { amount: rejectedAmount, count: rejectedCount }
    };
  };

  const statistics = getStatistics();

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Charges</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${statistics.total.amount.toLocaleString()}</div>
          <div className="text-sm text-muted-foreground">{statistics.total.count} entries</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Unbilled</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${statistics.unbilled.amount.toLocaleString()}</div>
          <div className="text-sm text-muted-foreground">{statistics.unbilled.count} entries</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Approved</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${statistics.approved.amount.toLocaleString()}</div>
          <div className="text-sm text-muted-foreground">{statistics.approved.count} entries</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Paid</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${statistics.paid.amount.toLocaleString()}</div>
          <div className="text-sm text-muted-foreground">{statistics.paid.count} entries</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Rejected</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${statistics.rejected.amount.toLocaleString()}</div>
          <div className="text-sm text-muted-foreground">{statistics.rejected.count} entries</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BillingStatistics;
