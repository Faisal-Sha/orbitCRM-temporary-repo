import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DollarSign, Plus, Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import DeleteConfirmationDialog from "@/components/settings/usersandroles/DeleteConfirmationDialog";
import { useServices, type Service, type ServiceFormData } from "@/hooks/useServices";
import { useCurrentUserAgency } from "@/hooks/useCurrentUserAgency";

interface ServicesProps {
  onBack: () => void;
}

const Services = ({ onBack }: ServicesProps) => {
  const { agencyId } = useCurrentUserAgency();
  const { services, loading, addService, updateService, deleteService } = useServices(agencyId || undefined);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);
  const [formData, setFormData] = useState<ServiceFormData>({
    name: "",
    category: "adults",
    billedFee: "",
    billedFeeType: "per hour",
    payoutFee: "",
    payoutFeeType: "per hour",
    status: "active",
  });

  const categories = [
    { value: "adults", label: "Adults" },
    { value: "teens", label: "Teens" }
  ];
  const feeTypes = [
    { value: "per hour", label: "per hour" },
    { value: "per session", label: "per session" },
    { value: "per day", label: "per day" },
    { value: "flat fee", label: "flat fee" }
  ];
  const statuses = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" }
  ];

  const handleAdd = () => {
    setEditingService(null);
    setFormData({ 
      name: "", 
      category: "adults", 
      billedFee: "", 
      billedFeeType: "per hour", 
      payoutFee: "", 
      payoutFeeType: "per hour", 
      status: "active" 
    });
    setIsModalOpen(true);
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      name: service.service || "",
      category: service.service_category,
      billedFee: service.fee_billed || "",
      billedFeeType: service.billed_fee_type,
      payoutFee: service.fee_payout || "",
      payoutFeeType: service.payout_fee_type || "per hour",
      status: service.service_status,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (service: Service) => {
    setServiceToDelete(service);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (serviceToDelete) {
      await deleteService(serviceToDelete.id);
      setServiceToDelete(null);
      setIsDeleteModalOpen(false);
    }
  };

  const handleSubmit = async () => {
    if (editingService) {
      await updateService(editingService.id, formData);
    } else {
      await addService(formData);
    }
    setIsModalOpen(false);
    setEditingService(null);
  };

  const getCategoryLabel = (value: string) => {
    const category = categories.find(c => c.value === value);
    return category ? category.label : value;
  };

  const getStatusLabel = (value: string) => {
    const status = statuses.find(s => s.value === value);
    return status ? status.label : value;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Services & Fees Management</h2>
        <Button variant="outline" onClick={onBack}>
          Back to Settings
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Services
            </CardTitle>
            <Button onClick={handleAdd}>
              <Plus className="h-4 w-4 mr-2" />
              Add Service
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading services...
            </div>
          ) : services.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No services added yet. Click "Add Service" to get started.
            </div>
          ) : (
            <div className="space-y-3">
              {services.map((service) => (
                <div key={service.id} className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <p className="font-medium">{service.service}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{getCategoryLabel(service.service_category)}</span>
                      <span>•</span>
                      <span>Bill: ${service.fee_billed} {service.billed_fee_type}</span>
                      {service.fee_payout && (
                        <>
                          <span>•</span>
                          <span>Payout: ${service.fee_payout} {service.payout_fee_type}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={service.service_status === 'active' ? 'default' : 'secondary'}>
                      {getStatusLabel(service.service_status)}
                    </Badge>
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(service)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(service)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingService ? 'Edit Service' : 'Add Service'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Service Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter service name"
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="billedFee">Fee – Billed ($)</Label>
                <Input
                  id="billedFee"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.billedFee}
                  onChange={(e) => setFormData({ ...formData, billedFee: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="billedFeeType">Billed Fee Type</Label>
                <Select value={formData.billedFeeType} onValueChange={(value) => setFormData({ ...formData, billedFeeType: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select fee type" />
                  </SelectTrigger>
                  <SelectContent>
                    {feeTypes.map((feeType) => (
                      <SelectItem key={feeType.value} value={feeType.value}>
                        {feeType.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="payoutFee">Fee - Payout ($)</Label>
                <Input
                  id="payoutFee"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.payoutFee}
                  onChange={(e) => setFormData({ ...formData, payoutFee: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="payoutFeeType">Payout Fee Type</Label>
                <Select value={formData.payoutFeeType} onValueChange={(value) => setFormData({ ...formData, payoutFeeType: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select fee type" />
                  </SelectTrigger>
                  <SelectContent>
                    {feeTypes.map((feeType) => (
                      <SelectItem key={feeType.value} value={feeType.value}>
                        {feeType.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!formData.name || !formData.category || !formData.billedFee}>
              {editingService ? 'Update' : 'Add'} Service
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <DeleteConfirmationDialog
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        onConfirm={confirmDelete}
        title="Delete Service"
        description="Are you sure you want to delete this service? This action cannot be undone."
      />
    </div>
  );
};

export default Services;