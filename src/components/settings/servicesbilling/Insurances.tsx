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

interface InsuranceProvider {
  id: number;
  name: string;
  category: string;
  status: string;
}

interface InsurancesProps {
  onBack: () => void;
}

const Insurances = ({ onBack }: InsurancesProps) => {
  const [insurances, setInsurances] = useState<InsuranceProvider[]>([
    { id: 1, name: "Caresource", category: "Medicaid", status: "Active" },
    { id: 2, name: "Molina", category: "Medicaid & Medicare", status: "Active" },
    { id: 3, name: "UnitedHealthcare", category: "Private", status: "Active" },
    { id: 4, name: "Cadem", category: "Medicaid", status: "Inactive" },
    { id: 5, name: "NationalHealth", category: "Private", status: "Active" },
    { id: 6, name: "Anthem", category: "Private", status: "Active" },
    { id: 7, name: "Cigna", category: "Private", status: "Inactive" },
    { id: 8, name: "Humana", category: "Medicare", status: "Active" },
    { id: 9, name: "Kaiser Permanente", category: "Private", status: "Active" },
    { id: 10, name: "Wellcare", category: "Medicaid & Medicare", status: "Active" },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingInsurance, setEditingInsurance] = useState<InsuranceProvider | null>(null);
  const [deleteInsuranceId, setDeleteInsuranceId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    status: "",
  });

  const categories = ["Medicaid", "Medicare", "Medicaid & Medicare", "Private"];
  const statuses = ["Active", "Inactive"];

  const handleAdd = () => {
    setEditingInsurance(null);
    setFormData({ name: "", category: "", status: "Active" });
    setIsModalOpen(true);
  };

  const handleEdit = (insurance: InsuranceProvider) => {
    setEditingInsurance(insurance);
    setFormData({
      name: insurance.name,
      category: insurance.category,
      status: insurance.status,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    setDeleteInsuranceId(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (deleteInsuranceId) {
      setInsurances(insurances.filter(insurance => insurance.id !== deleteInsuranceId));
      setIsDeleteModalOpen(false);
      setDeleteInsuranceId(null);
    }
  };

  const handleSubmit = () => {
    if (editingInsurance) {
      setInsurances(insurances.map(insurance =>
        insurance.id === editingInsurance.id
          ? { ...insurance, ...formData }
          : insurance
      ));
    } else {
      const newInsurance: InsuranceProvider = {
        id: Math.max(...insurances.map(i => i.id)) + 1,
        ...formData,
      };
      setInsurances([...insurances, newInsurance]);
    }
    setIsModalOpen(false);
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
          <div className="space-y-3">
            {insurances.map((insurance) => (
              <div key={insurance.id} className="flex items-center justify-between p-3 border rounded">
                <div>
                  <p className="font-medium">{insurance.name}</p>
                  <p className="text-sm text-muted-foreground">{insurance.category}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={insurance.status === 'Active' ? 'default' : 'secondary'}>
                    {insurance.status}
                  </Badge>
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(insurance)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(insurance.id)}>
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
                    <SelectItem key={category} value={category}>
                      {category}
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