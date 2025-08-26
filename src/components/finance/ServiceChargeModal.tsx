
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

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

interface ServiceType {
  name: string;
  code: string;
  defaultCharge: number;
  defaultDuration: number;
}

interface ServiceChargeModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingCharge: ServiceCharge | null;
  newCharge: {
    clientName: string;
    serviceProvided: string;
    provider: string;
    dateOfService: string;
    chargeAmount: number;
    notes: string;
    billingCode: string;
    duration: number;
  };
  setNewCharge: (charge: any) => void;
  serviceTypes: ServiceType[];
  allProviders: string[];
  durationOptions: number[];
  rejectionNotes: string;
  setRejectionNotes: (notes: string) => void;
  showRejectionNotes: boolean;
  setShowRejectionNotes: (show: boolean) => void;
  handleSaveCharge: () => void;
  handleApproveCharge: () => void;
  handleRejectCharge: () => void;
  handleDisapproveCharge: () => void;
  handleServiceTypeChange: (serviceType: string) => void;
  handleDurationChange: (duration: number) => void;
}

const ServiceChargeModal = ({
  isOpen,
  onClose,
  editingCharge,
  newCharge,
  setNewCharge,
  serviceTypes,
  allProviders,
  durationOptions,
  rejectionNotes,
  setRejectionNotes,
  showRejectionNotes,
  setShowRejectionNotes,
  handleSaveCharge,
  handleApproveCharge,
  handleRejectCharge,
  handleDisapproveCharge,
  handleServiceTypeChange,
  handleDurationChange
}: ServiceChargeModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingCharge ? "Edit" : "Create New"} Service Charge</DialogTitle>
          <DialogDescription>
            {editingCharge ? "Update the service charge details" : "Add a new billable service charge"}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="clientName">Client Name</Label>
            <Input
              id="clientName"
              value={newCharge.clientName}
              onChange={(e) => setNewCharge(prev => ({ ...prev, clientName: e.target.value }))}
              placeholder="Enter client name"
              disabled={editingCharge?.status === "paid"}
              className={editingCharge?.status === "paid" ? "bg-gray-100 cursor-not-allowed" : ""}
            />
          </div>
          <div>
            <Label htmlFor="serviceType">Service Type</Label>
            <Select 
              value={newCharge.serviceProvided} 
              onValueChange={handleServiceTypeChange}
              disabled={editingCharge?.status === "paid"}
            >
              <SelectTrigger className={editingCharge?.status === "paid" ? "bg-gray-100 cursor-not-allowed" : ""}>
                <SelectValue placeholder="Select service type" />
              </SelectTrigger>
              <SelectContent>
                {serviceTypes.map(service => (
                  <SelectItem key={service.code} value={service.name}>
                    {service.name} ({service.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="provider">Provider</Label>
            <Select 
              value={newCharge.provider} 
              onValueChange={(value) => setNewCharge(prev => ({ ...prev, provider: value }))}
              disabled={editingCharge?.status === "paid"}
            >
              <SelectTrigger className={editingCharge?.status === "paid" ? "bg-gray-100 cursor-not-allowed" : ""}>
                <SelectValue placeholder="Select provider" />
              </SelectTrigger>
              <SelectContent>
                {allProviders.slice(0, 10).map(provider => (
                  <SelectItem key={provider} value={provider}>{provider}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="dateOfService">Date/Time of Service</Label>
            <Input
              id="dateOfService"
              type="datetime-local"
              value={newCharge.dateOfService}
              onChange={(e) => setNewCharge(prev => ({ ...prev, dateOfService: e.target.value }))}
              disabled={editingCharge?.status === "paid"}
              className={editingCharge?.status === "paid" ? "bg-gray-100 cursor-not-allowed" : ""}
            />
          </div>
          <div>
            <Label htmlFor="duration">Duration (minutes)</Label>
            <Select 
              value={newCharge.duration.toString()} 
              onValueChange={(value) => handleDurationChange(parseInt(value))}
              disabled={editingCharge?.status === "paid"}
            >
              <SelectTrigger className={editingCharge?.status === "paid" ? "bg-gray-100 cursor-not-allowed" : ""}>
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                {durationOptions.map(duration => (
                  <SelectItem key={duration} value={duration.toString()}>
                    {duration} minutes
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="chargeAmount">Charge Amount ($)</Label>
            <Input
              id="chargeAmount"
              type="number"
              value={newCharge.chargeAmount}
              readOnly
              className="bg-gray-100 cursor-not-allowed"
              placeholder="Auto-calculated"
            />
          </div>
          <div>
            <Label htmlFor="billingCode">Billing Code</Label>
            <Input
              id="billingCode"
              value={newCharge.billingCode}
              readOnly
              className="bg-gray-100 cursor-not-allowed"
              placeholder="Auto-generated from service type"
            />
          </div>
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={newCharge.notes}
              onChange={(e) => setNewCharge(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Additional notes or description"
              disabled={editingCharge?.status === "paid"}
              className={editingCharge?.status === "paid" ? "bg-gray-100 cursor-not-allowed" : ""}
            />
          </div>

          {editingCharge && editingCharge.status !== "paid" && (
            <div className="space-y-2">
              {!showRejectionNotes && (
                <Button 
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowRejectionNotes(true)}
                >
                  Add rejection note
                </Button>
              )}
              
              {showRejectionNotes && (
                <div>
                  <Label htmlFor="rejectionNotes">Rejection Notes</Label>
                  <Textarea
                    id="rejectionNotes"
                    value={rejectionNotes}
                    onChange={(e) => setRejectionNotes(e.target.value)}
                    placeholder="Enter reason for rejection..."
                    rows={3}
                  />
                </div>
              )}
            </div>
          )}

          <div className="flex flex-wrap justify-end gap-2">
            {editingCharge?.status === "paid" ? (
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            ) : (
              <>
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                
                {editingCharge ? (
                  <>
                    {editingCharge.status === "unbilled" && (
                      <Button onClick={handleApproveCharge} size="sm">
                        Approve Charge
                      </Button>
                    )}
                    
                    {editingCharge.status === "approved" && (
                      <Button variant="destructive" onClick={handleDisapproveCharge} size="sm">
                        Disapprove Charge
                      </Button>
                    )}
                    
                    {editingCharge.status === "rejected" && (
                      <Button onClick={handleApproveCharge} size="sm">
                        Approve Charge
                      </Button>
                    )}
                    
                    {(editingCharge.status === "unbilled" || editingCharge.status === "approved") && (
                      <Button variant="destructive" onClick={handleRejectCharge} size="sm">
                        Reject Charge
                      </Button>
                    )}
                    
                    <Button onClick={handleSaveCharge} size="sm">
                      Update Charge
                    </Button>
                  </>
                ) : (
                  <Button onClick={handleSaveCharge}>
                    Create Charge
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceChargeModal;
