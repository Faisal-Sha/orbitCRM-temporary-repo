import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Edit2, ArrowLeft, Plus, Copy } from "lucide-react";
import DeleteConfirmationDialog from "@/components/settings/usersandroles/DeleteConfirmationDialog";
import { useWebhooks, WebhookItem, CreateWebhookData, UpdateWebhookData } from "@/hooks/useWebhooks";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

interface WebhooksProps {
  onBack: () => void;
}

const Webhooks: React.FC<WebhooksProps> = ({ onBack }) => {
  const {
    webhooks,
    isLoading,
    createWebhook,
    updateWebhook,
    deleteWebhook,
    isCreating,
    isUpdating,
    isDeleting
  } = useWebhooks();

  const [showDialog, setShowDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedWebhook, setSelectedWebhook] = useState<WebhookItem | null>(null);
  const [formData, setFormData] = useState({
    webhook_name: "",
    webhook_api_secret: "",
    status: "active"
  });

  const handleAdd = () => {
    setSelectedWebhook(null);
    setFormData({
      webhook_name: "",
      webhook_api_secret: "",
      status: "active"
    });
    setShowDialog(true);
  };

  const handleEdit = (webhook: WebhookItem) => {
    setSelectedWebhook(webhook);
    setFormData({
      webhook_name: webhook.webhook_name,
      webhook_api_secret: webhook.webhook_api_secret,
      status: webhook.status
    });
    setShowDialog(true);
  };

  const handleDelete = (webhook: WebhookItem) => {
    setSelectedWebhook(webhook);
    setShowDeleteDialog(true);
  };

  const handleSave = () => {
    if (!formData.webhook_name.trim()) {
      toast.error("Please enter a webhook name");
      return;
    }

    const data: CreateWebhookData | (UpdateWebhookData & { id: string }) = selectedWebhook
      ? { id: selectedWebhook.id, ...formData }
      : formData;

    if (selectedWebhook) {
      updateWebhook(data as UpdateWebhookData & { id: string });
    } else {
      createWebhook(data as CreateWebhookData);
    }

    setShowDialog(false);
    setSelectedWebhook(null);
  };

  const handleDeleteConfirm = () => {
    if (selectedWebhook) {
      deleteWebhook(selectedWebhook.id);
    }
    setShowDeleteDialog(false);
    setSelectedWebhook(null);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Webhooks Management</h2>
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Settings
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Webhook Integrations</CardTitle>
            <Button onClick={handleAdd} disabled={isCreating}>
              <Plus className="h-4 w-4 mr-2" />
              Add Webhook
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-64" />
                  </div>
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                  </div>
                </div>
              ))}
            </div>
          ) : webhooks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No webhooks configured yet. Create your first webhook to get started.
            </div>
          ) : (
            <div className="space-y-4">
              {webhooks.map((webhook) => (
                <div key={webhook.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h4 className="font-medium">{webhook.webhook_name}</h4>
                      <Badge variant={webhook.status === "active" ? "default" : "secondary"}>
                        {webhook.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-sm text-muted-foreground truncate max-w-md">
                        {webhook.webhook_api_endpoint}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(webhook.webhook_api_endpoint)}
                        className="h-6 w-6 p-0"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(webhook)}
                      disabled={isUpdating}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(webhook)}
                      disabled={isDeleting}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedWebhook ? "Edit Webhook" : "Create Webhook"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="webhook_name" className="text-right">
                Name
              </Label>
              <Input
                id="webhook_name"
                value={formData.webhook_name}
                onChange={(e) => setFormData({ ...formData, webhook_name: e.target.value })}
                className="col-span-3"
                placeholder="Enter webhook name"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="webhook_api_secret" className="text-right">
                Secret
              </Label>
              <div className="col-span-3 flex gap-2">
                <Input
                  id="webhook_api_secret"
                  type={formData.webhook_api_secret ? "password" : "text"}
                  value={formData.webhook_api_secret}
                  onChange={(e) => setFormData({ ...formData, webhook_api_secret: e.target.value })}
                  className="flex-1"
                  placeholder="Auto-generated (optional)"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setFormData({ ...formData, webhook_api_secret: crypto.randomUUID() })}
                >
                  Generate
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value) => 
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {selectedWebhook?.webhook_api_endpoint && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">
                  Endpoint URL
                </Label>
                <div className="col-span-3 flex items-center gap-2">
                  <Input
                    value={selectedWebhook.webhook_api_endpoint}
                    readOnly
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(selectedWebhook.webhook_api_endpoint)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              disabled={isCreating || isUpdating}
            >
              {selectedWebhook ? "Update" : "Create"} Webhook
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <DeleteConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDeleteConfirm}
        title="Delete Webhook"
        description={`Are you sure you want to delete "${selectedWebhook?.webhook_name}"? This action cannot be undone.`}
      />
    </div>
  );
};

export default Webhooks;