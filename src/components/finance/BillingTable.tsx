
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Edit, Trash2, User, StickyNote } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

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

interface BillingTableProps {
  paginatedCharges: ServiceCharge[];
  selectedCharges: string[];
  setSelectedCharges: (charges: string[]) => void;
  handleEditCharge: (charge: ServiceCharge) => void;
  handleDeleteCharge: (id: string) => void;
  handleUserProfileClick: (userName: string) => void;
  handleNoteClick: (clientName: string) => void;
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
}

const BillingTable = ({
  paginatedCharges,
  selectedCharges,
  setSelectedCharges,
  handleEditCharge,
  handleDeleteCharge,
  handleUserProfileClick,
  handleNoteClick,
  currentPage,
  totalPages,
  setCurrentPage
}: BillingTableProps) => {
  const getStatusBadge = (status: string) => {
    const variants = {
      unbilled: "secondary",
      approved: "default",
      paid: "default",
      rejected: "destructive"
    } as const;
    
    const colors = {
      unbilled: "",
      approved: "bg-green-100 text-green-800 border-green-200",
      paid: "",
      rejected: "bg-red-100 text-red-800 border-red-200"
    };
    
    return (
      <Badge 
        variant={variants[status as keyof typeof variants]}
        className={colors[status as keyof typeof colors]}
      >
        {status}
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
                checked={selectedCharges.length === paginatedCharges.filter(c => c.status === "unbilled").length && paginatedCharges.filter(c => c.status === "unbilled").length > 0}
                onCheckedChange={(checked) => {
                  const unbilledIds = paginatedCharges.filter(c => c.status === "unbilled").map(c => c.id);
                  if (checked) {
                    setSelectedCharges(unbilledIds);
                  } else {
                    setSelectedCharges([]);
                  }
                }}
              />
            </TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Service</TableHead>
            <TableHead>Provider</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedCharges.map((charge) => (
            <TableRow key={charge.id}>
              <TableCell>
                <Checkbox 
                  checked={selectedCharges.includes(charge.id)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedCharges([...selectedCharges, charge.id]);
                    } else {
                      setSelectedCharges(selectedCharges.filter(id => id !== charge.id));
                    }
                  }}
                  disabled={charge.status === "approved" || charge.status === "paid"}
                  className={charge.status === "approved" || charge.status === "paid" ? "cursor-not-allowed opacity-50" : ""}
                />
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="p-1 h-auto"
                    onClick={() => handleUserProfileClick(charge.clientName)}
                  >
                    <User className="w-4 h-4" />
                  </Button>
                  {charge.clientName}
                </div>
              </TableCell>
              <TableCell>{charge.serviceProvided}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="p-1 h-auto"
                    onClick={() => handleUserProfileClick(charge.provider)}
                  >
                    <User className="w-4 h-4" />
                  </Button>
                  {charge.provider}
                  {charge.notes && (
                    <StickyNote className="w-4 h-4 text-blue-500" />
                  )}
                  {charge.rejectionNotes && (
                    <StickyNote className="w-4 h-4 text-red-500" />
                  )}
                </div>
              </TableCell>
              <TableCell>{new Date(charge.dateOfService).toLocaleDateString()}</TableCell>
              <TableCell>{charge.duration} min</TableCell>
              <TableCell>${charge.chargeAmount}</TableCell>
              <TableCell>{getStatusBadge(charge.status)}</TableCell>
              <TableCell>
                <div className="flex gap-1">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleEditCharge(charge)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleNoteClick(charge.clientName)}
                  >
                    <StickyNote className="w-4 h-4" />
                  </Button>
                  {charge.status !== "paid" && (
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
                            This action cannot be undone. This will permanently delete the service charge record.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteCharge(charge.id)}>
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

export default BillingTable;
