import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, Plus, Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import DeleteConfirmationDialog from "@/components/settings/usersandroles/DeleteConfirmationDialog";
import { useInsurances, type InsuranceProvider, type InsuranceFormData } from "@/hooks/useInsurances";

interface InsurancesProps {
  onBack: () => void;
}

const Insurances = ({ onBack }: InsurancesProps) => {
  // TODO: Get actual agency_id from user context/session
  const agencyId = "temp-agency-id"; // This should come from user's agency context
  const { insurances, loading, addInsurance, updateInsurance, deleteInsurance } = useInsurances(agencyId);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingInsurance, setEditingInsurance] = useState<InsuranceProvider | null>(null);
  const [insuranceToDelete, setInsuranceToDelete] = useState<InsuranceProvider | null>(null);
  const [formData, setFormData] = useState<InsuranceFormData>({
    name: "",
    category: "medicaid",
    status: "active",
  });

  const categories = [
    { value: "medicaid", label: "Medicaid" },
    { value: "medicare", label: "Medicare" },
    { value: "dual", label: "Dual (Medicaid & Medicare)" },
    { value: "private", label: "Private" }
  ];
  const statuses = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" }
  ];

  const handleAdd = () => {
    setEditingInsurance(null);
    setFormData({ name: "", category: "medicaid", status: "active" });
    setIsModalOpen(true);
  };

  const handleEdit = (insurance: InsuranceProvider) => {
    setEditingInsurance(insurance);
    setFormData({
      name: insurance.insurance_provider || "",
      category: insurance.insurance_category,
      status: insurance.insurance_status,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (insurance: InsuranceProvider) => {
    setInsuranceToDelete(insurance);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (insuranceToDelete) {
      await deleteInsurance(insuranceToDelete.id);
      setInsuranceToDelete(null);
      setIsDeleteModalOpen(false);
    }
  };

  const handleSubmit = async () => {
    if (editingInsurance) {
      await updateInsurance(editingInsurance.id, formData);
    } else {
      await addInsurance(formData);
    }
    setIsModalOpen(false);
    setEditingInsurance(null);
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
        <h2 className="text-2xl font-semibold">Accepted Insurances Management</h2>
        <Button variant="outline" onClick={onBack}>
          Back to Settings
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Insurance Providers
            </CardTitle>
            <Button onClick={handleAdd}>
              <Plus className="h-4 w-4 mr-2" />
              Add Provider
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading insurance providers...
            </div>
          ) : insurances.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No insurance providers added yet. Click "Add Provider" to get started.
            </div>
          ) : (
            <div className="space-y-3">
              {insurances.map((insurance) => (
                <div key={insurance.id} className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <p className="font-medium">{insurance.insurance_provider}</p>
                    <p className="text-sm text-muted-foreground">{getCategoryLabel(insurance.insurance_category)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={insurance.insurance_status === 'active' ? 'default' : 'secondary'}>
                      {getStatusLabel(insurance.insurance_status)}
                    </Badge>
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(insurance)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(insurance)}>
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
              {editingInsurance ? 'Edit Insurance Provider' : 'Add Insurance Provider'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Provider Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter provider name"
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
            <Button onClick={handleSubmit} disabled={!formData.name || !formData.category}>
              {editingInsurance ? 'Update' : 'Add'} Provider
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <DeleteConfirmationDialog
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        onConfirm={confirmDelete}
        title="Delete Insurance Provider"
        description="Are you sure you want to delete this insurance provider? This action cannot be undone."
      />
    </div>
  );
};

export default Insurances;