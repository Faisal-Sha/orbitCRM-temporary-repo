
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, Plus, Pencil, Trash2, Search } from "lucide-react";
import DeleteConfirmationDialog from "@/components/settings/usersandroles/DeleteConfirmationDialog";

interface PhoneNumber {
  id: number;
  number: string;
  category: string;
  owner: string;
  verified: boolean;
  status: string;
}

interface PhoneNumbersProps {
  onBack: () => void;
}

const PhoneNumbers: React.FC<PhoneNumbersProps> = ({ onBack }) => {
  const [phoneNumbers, setPhoneNumbers] = useState<PhoneNumber[]>([
    { id: 1, number: "+1 (555) 123-4567", category: "Public", owner: "Organization", verified: true, status: "active" },
    { id: 2, number: "+1 (555) 987-6543", category: "Clients", owner: "John Doe", verified: true, status: "active" },
    { id: 3, number: "+1 (555) 456-7890", category: "Staff", owner: "Jane Smith", verified: false, status: "inactive" },
    { id: 4, number: "+1 (555) 321-0987", category: "AI Voice", owner: "Organization", verified: true, status: "active" },
    { id: 5, number: "+1 (555) 654-3210", category: "Sales", owner: "Mike Johnson", verified: true, status: "active" },
    { id: 6, number: "+1 (555) 111-2222", category: "Public", owner: "Organization", verified: false, status: "active" },
    { id: 7, number: "+1 (555) 333-4444", category: "Clients", owner: "Sarah Wilson", verified: true, status: "inactive" },
    { id: 8, number: "+1 (555) 555-6666", category: "Staff", owner: "Tom Brown", verified: true, status: "active" },
    { id: 9, number: "+1 (555) 777-8888", category: "AI Voice", owner: "Organization", verified: false, status: "active" },
    { id: 10, number: "+1 (555) 999-0000", category: "Sales", owner: "Lisa Davis", verified: true, status: "active" },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPhone, setEditingPhone] = useState<PhoneNumber | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [phoneToDelete, setPhoneToDelete] = useState<PhoneNumber | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    number: "",
    category: "",
    owner: "",
    verified: false,
    status: "active"
  });

  const categories = ["Public", "Clients", "Staff", "AI Voice", "Sales"];
  const owners = ["Organization", "John Doe", "Jane Smith", "Mike Johnson", "Sarah Wilson", "Tom Brown", "Lisa Davis"];

  const filteredPhoneNumbers = phoneNumbers.filter(phone =>
    phone.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    phone.owner.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openAddModal = () => {
    setEditingPhone(null);
    setFormData({
      number: "",
      category: "",
      owner: "",
      verified: false,
      status: "active"
    });
    setIsModalOpen(true);
  };

  const openEditModal = (phone: PhoneNumber) => {
    setEditingPhone(phone);
    setFormData({
      number: phone.number,
      category: phone.category,
      owner: phone.owner,
      verified: phone.verified,
      status: phone.status
    });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (editingPhone) {
      setPhoneNumbers(prev => prev.map(phone => 
        phone.id === editingPhone.id 
          ? { ...phone, ...formData }
          : phone
      ));
    } else {
      const newPhone: PhoneNumber = {
        id: Math.max(...phoneNumbers.map(p => p.id)) + 1,
        ...formData
      };
      setPhoneNumbers(prev => [...prev, newPhone]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (phone: PhoneNumber) => {
    setPhoneToDelete(phone);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (phoneToDelete) {
      setPhoneNumbers(prev => prev.filter(phone => phone.id !== phoneToDelete.id));
      setDeleteConfirmOpen(false);
      setPhoneToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={onBack}>
                <ArrowLeft className="h-4 w-4" />
                Back to Settings
              </Button>
            </div>
            <CardTitle>Phone Numbers Management</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by number or owner..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button onClick={openAddModal}>
              <Plus className="h-4 w-4 mr-2" />
              Add Phone Number
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Phone Number</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Verified</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPhoneNumbers.map((phone) => (
                <TableRow key={phone.id}>
                  <TableCell className="font-medium">{phone.number}</TableCell>
                  <TableCell>{phone.category}</TableCell>
                  <TableCell>{phone.owner}</TableCell>
                  <TableCell>
                    <Badge variant={phone.verified ? "default" : "secondary"}>
                      {phone.verified ? "Verified" : "Unverified"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={phone.status === "active" ? "default" : "secondary"}>
                      {phone.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => openEditModal(phone)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(phone)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-h-[90vh]">
          <ScrollArea className="max-h-[80vh]">
            <DialogHeader>
              <DialogTitle>
                {editingPhone ? "Edit Phone Number" : "Add Phone Number"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 p-1">
              <div>
                <Label htmlFor="number">Phone Number</Label>
                <Input
                  id="number"
                  value={formData.number}
                  onChange={(e) => setFormData(prev => ({ ...prev, number: e.target.value }))}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="owner">Owner</Label>
                <Select value={formData.owner} onValueChange={(value) => setFormData(prev => ({ ...prev, owner: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select owner" />
                  </SelectTrigger>
                  <SelectContent>
                    {owners.map((owner) => (
                      <SelectItem key={owner} value={owner}>{owner}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="verified"
                  checked={formData.verified}
                  onChange={(e) => setFormData(prev => ({ ...prev, verified: e.target.checked }))}
                  className="rounded"
                />
                <Label htmlFor="verified">Verified</Label>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  {editingPhone ? "Update" : "Add"} Phone Number
                </Button>
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <DeleteConfirmationDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        onConfirm={confirmDelete}
        title="Delete Phone Number"
        description={`Are you sure you want to delete ${phoneToDelete?.number}? This action cannot be undone.`}
      />
    </div>
  );
};

export default PhoneNumbers;
