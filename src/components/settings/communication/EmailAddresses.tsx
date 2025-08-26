
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

interface EmailAddress {
  id: number;
  email: string;
  category: string;
  owner: string;
  verified: boolean;
  status: string;
}

interface EmailAddressesProps {
  onBack: () => void;
}

const EmailAddresses: React.FC<EmailAddressesProps> = ({ onBack }) => {
  const [emailAddresses, setEmailAddresses] = useState<EmailAddress[]>([
    { id: 1, email: "info@healthcare.com", category: "Public", owner: "Organization", verified: true, status: "active" },
    { id: 2, email: "support@healthcare.com", category: "Clients", owner: "Organization", verified: true, status: "active" },
    { id: 3, email: "billing@healthcare.com", category: "Staff", owner: "Jane Smith", verified: false, status: "inactive" },
    { id: 4, email: "ai@healthcare.com", category: "AI Voice", owner: "Organization", verified: true, status: "active" },
    { id: 5, email: "sales@healthcare.com", category: "Sales", owner: "Mike Johnson", verified: true, status: "active" },
    { id: 6, email: "admin@healthcare.com", category: "Public", owner: "Organization", verified: false, status: "active" },
    { id: 7, email: "help@healthcare.com", category: "Clients", owner: "Sarah Wilson", verified: true, status: "inactive" },
    { id: 8, email: "staff@healthcare.com", category: "Staff", owner: "Tom Brown", verified: true, status: "active" },
    { id: 9, email: "voice@healthcare.com", category: "AI Voice", owner: "Organization", verified: false, status: "active" },
    { id: 10, email: "contact@healthcare.com", category: "Sales", owner: "Lisa Davis", verified: true, status: "active" },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmail, setEditingEmail] = useState<EmailAddress | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [emailToDelete, setEmailToDelete] = useState<EmailAddress | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    emailPrefix: "",
    domain: "",
    category: "",
    owner: "",
    verified: false,
    status: "active"
  });

  const categories = ["Public", "Clients", "Staff", "AI Voice", "Sales"];
  const owners = ["Organization", "John Doe", "Jane Smith", "Mike Johnson", "Sarah Wilson", "Tom Brown", "Lisa Davis"];
  const domains = ["healthcare.com", "healthcorp.com", "medicalcenter.org", "clinic.net"];

  const filteredEmailAddresses = emailAddresses.filter(email =>
    email.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    email.owner.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openAddModal = () => {
    setEditingEmail(null);
    setFormData({
      emailPrefix: "",
      domain: "",
      category: "",
      owner: "",
      verified: false,
      status: "active"
    });
    setIsModalOpen(true);
  };

  const openEditModal = (email: EmailAddress) => {
    const [prefix, domain] = email.email.split('@');
    setEditingEmail(email);
    setFormData({
      emailPrefix: prefix,
      domain: domain,
      category: email.category,
      owner: email.owner,
      verified: email.verified,
      status: email.status
    });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    const fullEmail = `${formData.emailPrefix}@${formData.domain}`;
    
    if (editingEmail) {
      setEmailAddresses(prev => prev.map(email => 
        email.id === editingEmail.id 
          ? { ...email, email: fullEmail, category: formData.category, owner: formData.owner, verified: formData.verified, status: formData.status }
          : email
      ));
    } else {
      const newEmail: EmailAddress = {
        id: Math.max(...emailAddresses.map(e => e.id)) + 1,
        email: fullEmail,
        category: formData.category,
        owner: formData.owner,
        verified: formData.verified,
        status: formData.status
      };
      setEmailAddresses(prev => [...prev, newEmail]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (email: EmailAddress) => {
    setEmailToDelete(email);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (emailToDelete) {
      setEmailAddresses(prev => prev.filter(email => email.id !== emailToDelete.id));
      setDeleteConfirmOpen(false);
      setEmailToDelete(null);
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
            <CardTitle>Email Addresses Management</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by email or owner..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button onClick={openAddModal}>
              <Plus className="h-4 w-4 mr-2" />
              Add Email Address
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email Address</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Verified</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmailAddresses.map((email) => (
                <TableRow key={email.id}>
                  <TableCell className="font-medium">{email.email}</TableCell>
                  <TableCell>{email.category}</TableCell>
                  <TableCell>{email.owner}</TableCell>
                  <TableCell>
                    <Badge variant={email.verified ? "default" : "secondary"}>
                      {email.verified ? "Verified" : "Unverified"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={email.status === "active" ? "default" : "secondary"}>
                      {email.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => openEditModal(email)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(email)}>
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
                {editingEmail ? "Edit Email Address" : "Add Email Address"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 p-1">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="emailPrefix">Email Prefix</Label>
                  <Input
                    id="emailPrefix"
                    value={formData.emailPrefix}
                    onChange={(e) => setFormData(prev => ({ ...prev, emailPrefix: e.target.value }))}
                    placeholder="info"
                  />
                </div>
                <div>
                  <Label htmlFor="domain">Domain</Label>
                  <Select value={formData.domain} onValueChange={(value) => setFormData(prev => ({ ...prev, domain: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select domain" />
                    </SelectTrigger>
                    <SelectContent>
                      {domains.map((domain) => (
                        <SelectItem key={domain} value={domain}>{domain}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label>Preview</Label>
                <div className="p-2 bg-gray-50 rounded border">
                  {formData.emailPrefix && formData.domain 
                    ? `${formData.emailPrefix}@${formData.domain}` 
                    : "Enter prefix and select domain"}
                </div>
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
                  {editingEmail ? "Update" : "Add"} Email Address
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
        title="Delete Email Address"
        description={`Are you sure you want to delete ${emailToDelete?.email}? This action cannot be undone.`}
      />
    </div>
  );
};

export default EmailAddresses;
