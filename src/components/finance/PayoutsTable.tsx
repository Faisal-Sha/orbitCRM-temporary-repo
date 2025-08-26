
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, Edit, User, Trash2, StickyNote } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface Payout {
  id: string;
  recipientName: string;
  service: string;
  payoutDate: string;
  amount: number;
  status: "ready" | "scheduled" | "processed" | "paid" | "canceled";
  paymentMethod: string;
  associatedServices: string[];
  invoiceLinks: string[];
  notes: string;
  cancelationNotes?: string;
  servicesPeriod: string;
  scheduledDate?: string;
}

interface PayoutsTableProps {
  paginatedPayouts: Payout[];
  selectedPayouts: string[];
  setSelectedPayouts: (payouts: string[]) => void;
  handleEditPayout: (payout: Payout) => void;
  handleDeletePayout: (id: string) => void;
  handleUserProfileClick: (userName: string) => void;
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
}

const PayoutsTable = ({
  paginatedPayouts,
  selectedPayouts,
  setSelectedPayouts,
  handleEditPayout,
  handleDeletePayout,
  handleUserProfileClick,
  currentPage,
  totalPages,
  setCurrentPage
}: PayoutsTableProps) => {
  const getStatusBadge = (status: string) => {
    const variants = {
      ready: "secondary",
      scheduled: "default",
      processed: "secondary", 
      paid: "default",
      canceled: "destructive"
    } as const;
    
    const colors = {
      ready: "",
      scheduled: "bg-green-100 text-green-800 border-green-200",
      processed: "bg-gray-100 text-gray-800 border-gray-200",
      paid: "",
      canceled: "bg-red-100 text-red-800 border-red-200"
    };
    
    const displayStatus = status === "ready" ? "Ready" : status.charAt(0).toUpperCase() + status.slice(1);
    
    return (
      <Badge 
        variant={variants[status as keyof typeof variants]}
        className={colors[status as keyof typeof colors]}
      >
        {displayStatus}
      </Badge>
    );
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox 
                checked={selectedPayouts.length === paginatedPayouts.filter(p => p.status === "ready" || p.status === "canceled").length && paginatedPayouts.filter(p => p.status === "ready" || p.status === "canceled").length > 0}
                onCheckedChange={(checked) => {
                  const selectableIds = paginatedPayouts.filter(p => p.status === "ready" || p.status === "canceled").map(p => p.id);
                  if (checked) {
                    setSelectedPayouts(selectableIds);
                  } else {
                    setSelectedPayouts([]);
                  }
                }}
              />
            </TableHead>
            <TableHead>Recipient</TableHead>
            <TableHead>Service</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Period</TableHead>
            <TableHead>Method</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedPayouts.map((payout) => (
            <TableRow key={payout.id}>
              <TableCell>
                <Checkbox 
                  checked={selectedPayouts.includes(payout.id)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedPayouts([...selectedPayouts, payout.id]);
                    } else {
                      setSelectedPayouts(selectedPayouts.filter(id => id !== payout.id));
                    }
                  }}
                  disabled={payout.status === "processed" || payout.status === "paid" || payout.status === "scheduled"}
                  className={payout.status === "processed" || payout.status === "paid" || payout.status === "scheduled" ? "cursor-not-allowed opacity-50" : ""}
                />
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="p-1 h-auto"
                    onClick={() => handleUserProfileClick(payout.recipientName)}
                  >
                    <User className="w-4 h-4" />
                  </Button>
                  {payout.recipientName}
                  {payout.notes && (
                    <StickyNote className="w-4 h-4 text-blue-500" />
                  )}
                  {payout.cancelationNotes && (
                    <StickyNote className="w-4 h-4 text-red-500" />
                  )}
                </div>
              </TableCell>
              <TableCell>{payout.service}</TableCell>
              <TableCell className="font-medium">${payout.amount.toLocaleString()}</TableCell>
              <TableCell>{new Date(payout.payoutDate).toLocaleDateString()}</TableCell>
              <TableCell>{payout.servicesPeriod}</TableCell>
              <TableCell>{payout.paymentMethod}</TableCell>
              <TableCell>{getStatusBadge(payout.status)}</TableCell>
              <TableCell>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleEditPayout(payout)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  {(payout.status === "ready" || payout.status === "scheduled" || payout.status === "canceled") && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the payout record.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeletePayout(payout.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </>
  );
};

export default PayoutsTable;
