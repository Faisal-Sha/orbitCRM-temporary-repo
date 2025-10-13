import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link, Plus, Edit, Trash2 } from "lucide-react";
import DeleteConfirmationDialog from "@/components/settings/usersandroles/DeleteConfirmationDialog";

interface Integration {
  id: string;
  name: string;
  category: string;
  status: string;
  settings: Record<string, string>;
}

interface ExternalProps {
  onBack: () => void;
}

const External = ({ onBack }: ExternalProps) => {
  const [integrations, setIntegrations] = useState<Integration[]>([]);

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [formData, setFormData] = useState<Partial<Integration>>({});

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
    setFormData({ name: "", category: "", status: "Not Configured", settings: {} });
    setShowAddDialog(true);
  };

  const handleEdit = (integration: Integration) => {
    setSelectedIntegration(integration);
    setFormData(integration);
    setShowEditDialog(true);
  };

  const handleDelete = (integration: Integration) => {
    setSelectedIntegration(integration);
    setShowDeleteDialog(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.category) return;

    const newIntegration: Integration = {
      id: selectedIntegration?.id || Date.now().toString(),
      name: formData.name!,
      category: formData.category!,
      status: formData.status || "Not Configured",
      settings: formData.settings || {},
    };

    if (selectedIntegration) {
      setIntegrations(integrations.map(i => i.id === selectedIntegration.id ? newIntegration : i));
    } else {
      setIntegrations([...integrations, newIntegration]);
    }

    setShowAddDialog(false);
    setShowEditDialog(false);
    setSelectedIntegration(null);
    setFormData({});
  };

  const handleDeleteConfirm = () => {
    if (selectedIntegration) {
      setIntegrations(integrations.filter(i => i.id !== selectedIntegration.id));
    }
    setShowDeleteDialog(false);
    setSelectedIntegration(null);
  };

  const handleServiceChange = (serviceName: string) => {
    const template = serviceTemplates[serviceName as keyof typeof serviceTemplates] || {};
    setFormData({ 
      ...formData, 
      name: serviceName,
      settings: template 
    });
  };

  const handleSettingChange = (key: string, value: string) => {
    setFormData({
      ...formData,
      settings: { ...formData.settings, [key]: value }
    });
  };

  const renderSettingsFields = (serviceName: string, settings: Record<string, string>) => {
    const template = serviceTemplates[serviceName as keyof typeof serviceTemplates];
    if (!template) return null;

    return Object.keys(template).map((key) => (
      <div key={key} className="space-y-2">
        <Label htmlFor={key}>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</Label>
        <Input
          id={key}
          value={settings[key] || ""}
          onChange={(e) => handleSettingChange(key, e.target.value)}
          placeholder={`Enter ${key}`}
        />
      </div>
    ));
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
          <div className="space-y-4">
            {integrations.map((integration) => (
              <div key={integration.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-medium">{integration.name}</h4>
                    <Badge variant="outline" className="text-xs">{integration.category}</Badge>
                    <Badge variant={integration.status === 'Connected' ? 'default' : 'secondary'}>
                      {integration.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {Object.keys(integration.settings).length} settings configured
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
            ))}
          </div>
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
                value={formData.name} 
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

            {formData.name && renderSettingsFields(formData.name, formData.settings || {})}

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => {
                setShowAddDialog(false);
                setShowEditDialog(false);
                setSelectedIntegration(null);
                setFormData({});
              }}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
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
        description={`Are you sure you want to delete the ${selectedIntegration?.name} integration? This action cannot be undone.`}
      />
    </div>
  );
};

export default External;