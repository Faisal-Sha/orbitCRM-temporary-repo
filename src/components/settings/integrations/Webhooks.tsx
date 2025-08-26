import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Webhook, Plus, Edit, Trash2 } from "lucide-react";
import DeleteConfirmationDialog from "@/components/settings/usersandroles/DeleteConfirmationDialog";

interface WebhookItem {
  id: string;
  name: string;
  url: string;
  status: string;
  secret: string;
}

interface WebhooksProps {
  onBack: () => void;
}

const Webhooks = ({ onBack }: WebhooksProps) => {
  const [webhooks, setWebhooks] = useState<WebhookItem[]>([
    { 
      id: "1", 
      name: "Appointment Created", 
      url: "https://api.example.com/webhooks/appointment", 
      status: "Active",
      secret: "whsec_abc123"
    },
    { 
      id: "2", 
      name: "Payment Processed", 
      url: "https://api.example.com/webhooks/payment", 
      status: "Active",
      secret: "whsec_def456"
    },
    { 
      id: "3", 
      name: "Client Updated", 
      url: "https://api.example.com/webhooks/client", 
      status: "Inactive",
      secret: "whsec_ghi789"
    },
    { 
      id: "4", 
      name: "User Registration", 
      url: "https://api.example.com/webhooks/user", 
      status: "Active",
      secret: "whsec_jkl012"
    },
    { 
      id: "5", 
      name: "Document Upload", 
      url: "https://api.example.com/webhooks/document", 
      status: "Inactive",
      secret: "whsec_mno345"
    },
    { 
      id: "6", 
      name: "Session Completed", 
      url: "https://api.example.com/webhooks/session", 
      status: "Active",
      secret: "whsec_pqr678"
    },
    { 
      id: "7", 
      name: "Report Generated", 
      url: "https://api.example.com/webhooks/report", 
      status: "Inactive",
      secret: "whsec_stu901"
    },
  ]);

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedWebhook, setSelectedWebhook] = useState<WebhookItem | null>(null);
  const [formData, setFormData] = useState<Partial<WebhookItem>>({});

  const handleAdd = () => {
    setFormData({ name: "", url: "", status: "Active", secret: "" });
    setShowAddDialog(true);
  };

  const handleEdit = (webhook: WebhookItem) => {
    setSelectedWebhook(webhook);
    setFormData(webhook);
    setShowEditDialog(true);
  };

  const handleDelete = (webhook: WebhookItem) => {
    setSelectedWebhook(webhook);
    setShowDeleteDialog(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.url) return;

    const newWebhook: WebhookItem = {
      id: selectedWebhook?.id || Date.now().toString(),
      name: formData.name!,
      url: formData.url!,
      status: formData.status || "Active",
      secret: formData.secret || `whsec_${Math.random().toString(36).substr(2, 9)}`,
    };

    if (selectedWebhook) {
      setWebhooks(webhooks.map(w => w.id === selectedWebhook.id ? newWebhook : w));
    } else {
      setWebhooks([...webhooks, newWebhook]);
    }

    setShowAddDialog(false);
    setShowEditDialog(false);
    setSelectedWebhook(null);
    setFormData({});
  };

  const handleDeleteConfirm = () => {
    if (selectedWebhook) {
      setWebhooks(webhooks.filter(w => w.id !== selectedWebhook.id));
    }
    setShowDeleteDialog(false);
    setSelectedWebhook(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Webhooks Management</h2>
        <Button variant="outline" onClick={onBack}>
          Back to Settings
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Webhook className="h-5 w-5" />
              Webhooks
            </CardTitle>
            <Button onClick={handleAdd}>
              <Plus className="h-4 w-4 mr-2" />
              Add Webhook
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {webhooks.map((webhook) => (
              <div key={webhook.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-medium">{webhook.name}</h4>
                    <Badge variant={webhook.status === 'Active' ? 'default' : 'secondary'}>
                      {webhook.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{webhook.url}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(webhook)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(webhook)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={showAddDialog || showEditDialog} onOpenChange={(open) => {
        if (!open) {
          setShowAddDialog(false);
          setShowEditDialog(false);
          setSelectedWebhook(null);
          setFormData({});
        }
      }}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedWebhook ? "Edit Webhook" : "Add Webhook"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Webhook Name</Label>
              <Input
                id="name"
                value={formData.name || ""}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter webhook name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="url">API Endpoint</Label>
              <Input
                id="url"
                value={formData.url || ""}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder="https://api.example.com/webhooks/endpoint"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="secret">Webhook Secret</Label>
              <Input
                id="secret"
                value={formData.secret || ""}
                onChange={(e) => setFormData({ ...formData, secret: e.target.value })}
                placeholder="whsec_your_secret_here"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => {
                setShowAddDialog(false);
                setShowEditDialog(false);
                setSelectedWebhook(null);
                setFormData({});
              }}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                {selectedWebhook ? "Update" : "Add"} Webhook
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <DeleteConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDeleteConfirm}
        title="Delete Webhook"
        description={`Are you sure you want to delete the ${selectedWebhook?.name} webhook? This action cannot be undone.`}
      />
    </div>
  );
};

export default Webhooks;