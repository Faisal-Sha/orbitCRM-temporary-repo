import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link, Plus, Edit, Trash2, Loader2 } from "lucide-react";
import DeleteConfirmationDialog from "@/components/settings/usersandroles/DeleteConfirmationDialog";
import { useExternalIntegrations, ExternalIntegration } from "@/hooks/useExternalIntegrations";

interface FormData {
  service_provider: string;
  category: string;
  configuration: Record<string, string>;
}

interface ExternalProps {
  onBack: () => void;
}

const External = ({ onBack }: ExternalProps) => {
  const { 
    integrations, 
    isLoading, 
    createIntegration, 
    updateIntegration, 
    deleteIntegration,
    isCreating,
    isUpdating,
    isDeleting
  } = useExternalIntegrations();

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<ExternalIntegration | null>(null);
  const [formData, setFormData] = useState<Partial<FormData>>({});

  const serviceTemplates = {
    "Mailgun": { apiKey: "", sendingDomain: "" },
    "MailerLite": { apiKey: "", sendingDomain: "" },
    "Zoom": { clientId: "", clientSecret: "", redirectUrl: "" },
    "Twilio": { accountSid: "", authToken: "", apiKeySid: "", apiKeySecret: "" },
    "Stripe": { apiKey: "", webhookSecret: "" },
    "Google Calendar": { clientId: "", clientSecret: "", redirectUrl: "" },
    "QuickBooks": { clientId: "", clientSecret: "", redirectUrl: "" },
  };

  const handleAdd = () => {
    setFormData({ service_provider: "", category: "", configuration: {} });
    setShowAddDialog(true);
  };

  const handleEdit = (integration: ExternalIntegration) => {
    setSelectedIntegration(integration);
    setFormData({
      service_provider: integration.service_provider,
      category: integration.category,
      configuration: integration.configuration,
    });
    setShowEditDialog(true);
  };

  const handleDelete = (integration: ExternalIntegration) => {
    setSelectedIntegration(integration);
    setShowDeleteDialog(true);
  };

  const handleSave = () => {
    if (!formData.service_provider || !formData.category) return;

    if (selectedIntegration) {
      updateIntegration({
        id: selectedIntegration.id,
        service_provider: formData.service_provider,
        category: formData.category,
        configuration: formData.configuration || {},
      });
    } else {
      createIntegration({
        service_provider: formData.service_provider,
        category: formData.category,
        configuration: formData.configuration || {},
      });
    }

    setShowAddDialog(false);
    setShowEditDialog(false);
    setSelectedIntegration(null);
    setFormData({});
  };

  const handleDeleteConfirm = () => {
    if (selectedIntegration) {
      deleteIntegration(selectedIntegration.id);
    }
    setShowDeleteDialog(false);
    setSelectedIntegration(null);
  };

  const handleServiceChange = (serviceName: string) => {
    const template = serviceTemplates[serviceName as keyof typeof serviceTemplates] || {};
    setFormData({ 
      ...formData, 
      service_provider: serviceName,
      configuration: template 
    });
  };

  const handleSettingChange = (key: string, value: string) => {
    setFormData({
      ...formData,
      configuration: { ...formData.configuration, [key]: value }
    });
  };

  const renderSettingsFields = (serviceName: string, configuration: Record<string, string>) => {
    const template = serviceTemplates[serviceName as keyof typeof serviceTemplates];
    if (!template) return null;

    return Object.keys(template).map((key) => (
      <div key={key} className="space-y-2">
        <Label htmlFor={key}>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</Label>
        <Input
          id={key}
          value={configuration[key] || ""}
          onChange={(e) => handleSettingChange(key, e.target.value)}
          placeholder={`Enter ${key}`}
        />
      </div>
    ));
  };

  const getIntegrationStatus = (configuration: Record<string, string>) => {
    const hasAllSettings = Object.values(configuration).every(val => val && val.trim() !== "");
    return hasAllSettings ? "Connected" : "Not Configured";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">External Integrations Management</h2>
        <Button variant="outline" onClick={onBack}>
          Back to Settings
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Link className="h-5 w-5" />
              External Integrations
            </CardTitle>
            <Button onClick={handleAdd}>
              <Plus className="h-4 w-4 mr-2" />
              Add Integration
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Loading integrations...
            </div>
          ) : (
            <div className="space-y-4">
              {integrations.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Link className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No external integrations configured yet</p>
                  <p className="text-sm">Click "Add Integration" to get started</p>
                </div>
              ) : (
                integrations.map((integration) => {
                  const status = getIntegrationStatus(integration.configuration);
                  return (
                    <div key={integration.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-medium">{integration.service_provider}</h4>
                          <Badge variant="outline" className="text-xs">{integration.category}</Badge>
                          <Badge variant={status === 'Connected' ? 'default' : 'secondary'}>
                            {status}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {Object.keys(integration.configuration).length} settings configured
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(integration)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(integration)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={showAddDialog || showEditDialog} onOpenChange={(open) => {
        if (!open) {
          setShowAddDialog(false);
          setShowEditDialog(false);
          setSelectedIntegration(null);
          setFormData({});
        }
      }}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedIntegration ? "Edit Integration" : "Add Integration"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="service">Service</Label>
              <Select 
                value={formData.service_provider} 
                onValueChange={handleServiceChange}
                disabled={!!selectedIntegration}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a service" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(serviceTemplates).map((service) => (
                    <SelectItem key={service} value={service}>{service}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Communication">Communication</SelectItem>
                  <SelectItem value="Payment">Payment</SelectItem>
                  <SelectItem value="Accounting">Accounting</SelectItem>
                  <SelectItem value="Scheduling">Scheduling</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.service_provider && renderSettingsFields(formData.service_provider, formData.configuration || {})}

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => {
                setShowAddDialog(false);
                setShowEditDialog(false);
                setSelectedIntegration(null);
                setFormData({});
              }}>
                Cancel
              </Button>
              <Button 
                onClick={handleSave}
                disabled={isCreating || isUpdating}
              >
                {(isCreating || isUpdating) && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                {selectedIntegration ? "Update" : "Add"} Integration
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
        title="Delete Integration"
        description={`Are you sure you want to delete the ${selectedIntegration?.service_provider} integration? This action cannot be undone.`}
      />
    </div>
  );
};

export default External;