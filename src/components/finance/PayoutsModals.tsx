
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

interface PayoutsModalsProps {
  isEditDialogOpen: boolean;
  isCreateDialogOpen: boolean;
  editingPayout: Payout | null;
  newPayout: {
    recipientName: string;
    service: string;
    amount: number;
    paymentMethod: string;
    associatedServices: string;
    notes: string;
    servicesPeriod: string;
    scheduledDate: string;
  };
  setNewPayout: (payout: any) => void;
  cancelationNotes: string;
  setCancelationNotes: (notes: string) => void;
  showCancelationNotes: boolean;
  setShowCancelationNotes: (show: boolean) => void;
  allRecipients: string[];
  handleCloseEditDialog: () => void;
  handleCloseCreateDialog: () => void;
  handleSavePayout: () => void;
  handleProcessNow: () => void;
  handleCancelPayout: () => void;
}

const PayoutsModals = ({
  isEditDialogOpen,
  isCreateDialogOpen,
  editingPayout,
  newPayout,
  setNewPayout,
  cancelationNotes,
  setCancelationNotes,
  showCancelationNotes,
  setShowCancelationNotes,
  allRecipients,
  handleCloseEditDialog,
  handleCloseCreateDialog,
  handleSavePayout,
  handleProcessNow,
  handleCancelPayout
}: PayoutsModalsProps) => {
  return (
    <>
      {/* Edit Payout Modal */}
      <Dialog open={isEditDialogOpen} onOpenChange={handleCloseEditDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Payout</DialogTitle>
            <DialogDescription>
              Update the payout details
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="recipientName">Recipient</Label>
              <Input
                id="recipientName"
                value={newPayout.recipientName}
                readOnly
                className="bg-gray-100 cursor-not-allowed"
              />
            </div>
            <div>
              <Label htmlFor="service">Service</Label>
              <Input
                id="service"
                value={newPayout.service}
                readOnly
                className="bg-gray-100 cursor-not-allowed"
              />
            </div>
            <div>
              <Label htmlFor="amount">Amount ($)</Label>
              <Input
                id="amount"
                type="number"
                value={newPayout.amount}
                readOnly
                className="bg-gray-100 cursor-not-allowed"
              />
            </div>
            <div>
              <Label htmlFor="servicesPeriod">Services Period</Label>
              <Input
                id="servicesPeriod"
                value={newPayout.servicesPeriod}
                readOnly
                className="bg-gray-100 cursor-not-allowed"
              />
            </div>
            <div>
              <Label htmlFor="associatedServices">Associated Services</Label>
              <Textarea
                id="associatedServices"
                value={newPayout.associatedServices}
                readOnly
                className="bg-gray-100 cursor-not-allowed"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="paymentMethod">Payment Method</Label>
              <Select 
                value={newPayout.paymentMethod} 
                onValueChange={(value) => setNewPayout((prev: any) => ({ ...prev, paymentMethod: value }))}
                disabled={editingPayout?.status === "processed" || editingPayout?.status === "paid"}
              >
                <SelectTrigger className={editingPayout?.status === "processed" || editingPayout?.status === "paid" ? "bg-gray-100 cursor-not-allowed" : ""}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                  <SelectItem value="Direct Deposit">Direct Deposit</SelectItem>
                  <SelectItem value="Check">Check</SelectItem>
                  <SelectItem value="PayPal">PayPal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="scheduledDate">Schedule Payment</Label>
              <Input
                id="scheduledDate"
                type="datetime-local"
                value={newPayout.scheduledDate}
                onChange={(e) => setNewPayout((prev: any) => ({ ...prev, scheduledDate: e.target.value }))}
                disabled={editingPayout?.status === "processed" || editingPayout?.status === "paid"}
                className={editingPayout?.status === "processed" || editingPayout?.status === "paid" ? "bg-gray-100 cursor-not-allowed" : ""}
              />
            </div>
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={newPayout.notes}
                onChange={(e) => setNewPayout((prev: any) => ({ ...prev, notes: e.target.value }))}
                placeholder="Additional notes about this payout"
                disabled={editingPayout?.status === "processed" || editingPayout?.status === "paid"}
                className={editingPayout?.status === "processed" || editingPayout?.status === "paid" ? "bg-gray-100 cursor-not-allowed" : ""}
                rows={2}
              />
            </div>

            {editingPayout && editingPayout.status !== "processed" && editingPayout.status !== "paid" && (
              <div className="space-y-2">
                {!showCancelationNotes && (
                  <Button 
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowCancelationNotes(true)}
                  >
                    Add cancelation note
                  </Button>
                )}
                
                {showCancelationNotes && (
                  <div>
                    <Label htmlFor="cancelationNotes">Cancelation Notes</Label>
                    <Textarea
                      id="cancelationNotes"
                      value={cancelationNotes}
                      onChange={(e) => setCancelationNotes(e.target.value)}
                      placeholder="Enter reason for cancelation..."
                      rows={3}
                    />
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-wrap justify-end gap-2 pt-4">
              {editingPayout?.status === "processed" || editingPayout?.status === "paid" ? (
                <Button variant="outline" onClick={handleCloseEditDialog}>
                  Close
                </Button>
              ) : (
                <>
                  <Button variant="outline" onClick={handleCloseEditDialog}>
                    Close
                  </Button>
                  
                  {editingPayout && (editingPayout.status === "ready" || editingPayout.status === "scheduled" || editingPayout.status === "canceled") && (
                    <Button onClick={handleProcessNow} size="sm">
                      Process Now
                    </Button>
                  )}
                  
                  {editingPayout && (editingPayout.status === "ready" || editingPayout.status === "scheduled") && (
                    <Button variant="destructive" onClick={handleCancelPayout} size="sm">
                      Cancel Payout
                    </Button>
                  )}
                  
                  <Button onClick={handleSavePayout} size="sm">
                    Update Payout
                  </Button>
                </>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Payout Modal */}
      <Dialog open={isCreateDialogOpen} onOpenChange={handleCloseCreateDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Payout</DialogTitle>
            <DialogDescription>
              Create a new payout for a service provider
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="recipientName">Recipient</Label>
              <Select 
                value={newPayout.recipientName} 
                onValueChange={(value) => setNewPayout((prev: any) => ({ ...prev, recipientName: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select recipient" />
                </SelectTrigger>
                <SelectContent>
                  {allRecipients.slice(0, 10).map(recipient => (
                    <SelectItem key={recipient} value={recipient}>
                      {recipient}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="service">Service</Label>
              <Select 
                value={newPayout.service} 
                onValueChange={(value) => setNewPayout((prev: any) => ({ ...prev, service: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select service" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Individual Therapy Session">Individual Therapy Session</SelectItem>
                  <SelectItem value="Group Therapy Session">Group Therapy Session</SelectItem>
                  <SelectItem value="Assessment Consultation">Assessment Consultation</SelectItem>
                  <SelectItem value="Family Therapy Session">Family Therapy Session</SelectItem>
                  <SelectItem value="Psychological Testing">Psychological Testing</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="amount">Amount ($)</Label>
              <Input
                id="amount"
                type="number"
                value={newPayout.amount}
                onChange={(e) => setNewPayout((prev: any) => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                placeholder="0.00"
              />
            </div>
            <div>
              <Label htmlFor="servicesPeriod">Services Period</Label>
              <Input
                id="servicesPeriod"
                value={newPayout.servicesPeriod}
                onChange={(e) => setNewPayout((prev: any) => ({ ...prev, servicesPeriod: e.target.value }))}
                placeholder="e.g., January 2025"
              />
            </div>
            <div>
              <Label htmlFor="associatedServices">Associated Services (one per line)</Label>
              <Textarea
                id="associatedServices"
                value={newPayout.associatedServices}
                onChange={(e) => setNewPayout((prev: any) => ({ ...prev, associatedServices: e.target.value }))}
                placeholder="Individual Therapy - John Doe&#10;Group Session - Jane Smith"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="paymentMethod">Payment Method</Label>
              <Select 
                value={newPayout.paymentMethod} 
                onValueChange={(value) => setNewPayout((prev: any) => ({ ...prev, paymentMethod: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                  <SelectItem value="Direct Deposit">Direct Deposit</SelectItem>
                  <SelectItem value="Check">Check</SelectItem>
                  <SelectItem value="PayPal">PayPal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="scheduledDate">Schedule Payment</Label>
              <Input
                id="scheduledDate"
                type="datetime-local"
                value={newPayout.scheduledDate}
                onChange={(e) => setNewPayout((prev: any) => ({ ...prev, scheduledDate: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={newPayout.notes}
                onChange={(e) => setNewPayout((prev: any) => ({ ...prev, notes: e.target.value }))}
                placeholder="Additional notes about this payout"
                rows={2}
              />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={handleCloseCreateDialog}>
                Close
              </Button>
              <Button 
                onClick={handleSavePayout}
                disabled={!newPayout.recipientName || !newPayout.amount}
              >
                Create Payout
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PayoutsModals;
