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

interface Service {
  id: number;
  name: string;
  category: string;
  fee: string;
  feeType: string;
  status: string;
}

interface ServicesProps {
  onBack: () => void;
}

const Services = ({ onBack }: ServicesProps) => {
  const [services, setServices] = useState<Service[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [deleteServiceId, setDeleteServiceId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    fee: "",
    feeType: "",
    status: "",
  });

  const serviceNames = ["Case Management", "Counseling", "Therapy", "SUD", "Assessment", "Group Therapy", "Family Therapy", "Crisis Intervention", "Peer Support"];
  const categories = ["Adults", "Teens", "Children", "Seniors"];
  const feeTypes = ["per hour", "per session", "flat fee", "per day"];
  const statuses = ["Active", "Inactive"];

  const handleAdd = () => {
    setEditingService(null);
    setFormData({ name: "", category: "", fee: "", feeType: "per hour", status: "Active" });
    setIsModalOpen(true);
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      category: service.category,
      fee: service.fee,
      feeType: service.feeType,
      status: service.status,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    setDeleteServiceId(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (deleteServiceId) {
      setServices(services.filter(service => service.id !== deleteServiceId));
      setIsDeleteModalOpen(false);
      setDeleteServiceId(null);
    }
  };

  const handleSubmit = () => {
    if (editingService) {
      setServices(services.map(service =>
        service.id === editingService.id
          ? { ...service, ...formData }
          : service
      ));
    } else {
      const newService: Service = {
        id: services.length > 0 ? Math.max(...services.map(s => s.id)) + 1 : 1,
        ...formData,
      };
      setServices([...services, newService]);
    }
    setIsModalOpen(false);
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
          <div className="space-y-3">
            {services.map((service) => (
              <div key={service.id} className="flex items-center justify-between p-3 border rounded">
                <div>
                  <p className="font-medium">{service.name}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{service.category}</span>
                    <span>•</span>
                    <span>${service.fee} {service.feeType}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={service.status === 'Active' ? 'default' : 'secondary'}>
                    {service.status}
                  </Badge>
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(service)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(service.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
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
              <Select value={formData.name} onValueChange={(value) => setFormData({ ...formData, name: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select service" />
                </SelectTrigger>
                <SelectContent>
                  {serviceNames.map((name) => (
                    <SelectItem key={name} value={name}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fee">Fee Amount ($)</Label>
                <Input
                  id="fee"
                  type="number"
                  value={formData.fee}
                  onChange={(e) => setFormData({ ...formData, fee: e.target.value })}
                  placeholder="Enter fee amount"
                />
              </div>
              <div>
                <Label htmlFor="feeType">Fee Type</Label>
                <Select value={formData.feeType} onValueChange={(value) => setFormData({ ...formData, feeType: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select fee type" />
                  </SelectTrigger>
                  <SelectContent>
                    {feeTypes.map((feeType) => (
                      <SelectItem key={feeType} value={feeType}>
                        {feeType}
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
                    <SelectItem key={status} value={status}>
                      {status}
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
            <Button onClick={handleSubmit} disabled={!formData.name || !formData.category || !formData.fee}>
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