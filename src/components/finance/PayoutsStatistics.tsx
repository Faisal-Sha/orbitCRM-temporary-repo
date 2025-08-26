
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PayoutsStatisticsProps {
  statistics: {
    total: { amount: number; count: number };
    ready: { amount: number; count: number };
    scheduled: { amount: number; count: number };
    processed: { amount: number; count: number };
    paid: { amount: number; count: number };
    canceled: { amount: number; count: number };
  };
}

const PayoutsStatistics = ({ statistics }: PayoutsStatisticsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Payouts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${statistics.total.amount.toLocaleString()}</div>
          <div className="text-sm text-muted-foreground">{statistics.total.count} entries</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Ready</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${statistics.ready.amount.toLocaleString()}</div>
          <div className="text-sm text-muted-foreground">{statistics.ready.count} entries</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${statistics.scheduled.amount.toLocaleString()}</div>
          <div className="text-sm text-muted-foreground">{statistics.scheduled.count} entries</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Processed</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${statistics.processed.amount.toLocaleString()}</div>
          <div className="text-sm text-muted-foreground">{statistics.processed.count} entries</div>
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
          <CardTitle className="text-sm font-medium">Canceled</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${statistics.canceled.amount.toLocaleString()}</div>
          <div className="text-sm text-muted-foreground">{statistics.canceled.count} entries</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PayoutsStatistics;
