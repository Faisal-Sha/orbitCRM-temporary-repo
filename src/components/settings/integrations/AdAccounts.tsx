import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Target, Plus, Edit, Trash2 } from "lucide-react";
import DeleteConfirmationDialog from "@/components/settings/usersandroles/DeleteConfirmationDialog";

interface AdAccount {
  id: string;
  name: string;
  status: string;
  description: string;
  settings: Record<string, string>;
}

interface AdAccountsProps {
  onBack: () => void;
}

const AdAccounts = ({ onBack }: AdAccountsProps) => {
  const [adAccounts, setAdAccounts] = useState<AdAccount[]>([
    { 
      id: "1", 
      name: "Meta", 
      status: "Connected",
      description: "Facebook and Instagram advertising",
      settings: { appId: "meta123", appSecret: "secret456", accessToken: "token789" }
    },
    { 
      id: "2", 
      name: "Google", 
      status: "Disconnected",
      description: "Google Ads platform", 
      settings: { clientId: "", clientSecret: "", refreshToken: "" }
    },
    { 
      id: "3", 
      name: "TikTok", 
      status: "Not Configured",
      description: "TikTok advertising platform",
      settings: { appId: "", secret: "", accessToken: "" }
    },
  ]);

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<AdAccount | null>(null);
  const [formData, setFormData] = useState<Partial<AdAccount>>({});

  const accountTemplates = {
    "Meta": { 
      appId: "", 
      appSecret: "", 
      accessToken: "",
      description: "Facebook and Instagram advertising"
    },
    "Google": { 
      clientId: "", 
      clientSecret: "", 
      refreshToken: "",
      description: "Google Ads platform"
    },
    "TikTok": { 
      appId: "", 
      secret: "", 
      accessToken: "",
      description: "TikTok advertising platform"
    },
  };

  const handleAdd = () => {
    setFormData({ name: "", status: "Not Configured", settings: {}, description: "" });
    setShowAddDialog(true);
  };

  const handleEdit = (account: AdAccount) => {
    setSelectedAccount(account);
    setFormData(account);
    setShowEditDialog(true);
  };

  const handleDelete = (account: AdAccount) => {
    setSelectedAccount(account);
    setShowDeleteDialog(true);
  };

  const handleSave = () => {
    if (!formData.name) return;

    const newAccount: AdAccount = {
      id: selectedAccount?.id || Date.now().toString(),
      name: formData.name!,
      status: formData.status || "Not Configured",
      description: formData.description || "",
      settings: formData.settings || {},
    };

    if (selectedAccount) {
      setAdAccounts(adAccounts.map(a => a.id === selectedAccount.id ? newAccount : a));
    } else {
      setAdAccounts([...adAccounts, newAccount]);
    }

    setShowAddDialog(false);
    setShowEditDialog(false);
    setSelectedAccount(null);
    setFormData({});
  };

  const handleDeleteConfirm = () => {
    if (selectedAccount) {
      setAdAccounts(adAccounts.filter(a => a.id !== selectedAccount.id));
    }
    setShowDeleteDialog(false);
    setSelectedAccount(null);
  };

  const handleAccountChange = (accountName: string) => {
    const template = accountTemplates[accountName as keyof typeof accountTemplates];
    if (template) {
      const { description, ...settings } = template;
      setFormData({ 
        ...formData, 
        name: accountName,
        description: description,
        settings: settings 
      });
    }
  };

  const handleSettingChange = (key: string, value: string) => {
    setFormData({
      ...formData,
      settings: { ...formData.settings, [key]: value }
    });
  };

  const renderSettingsFields = (accountName: string, settings: Record<string, string>) => {
    const template = accountTemplates[accountName as keyof typeof accountTemplates];
    if (!template) return null;

    const { description, ...settingsTemplate } = template;
    return Object.keys(settingsTemplate).map((key) => (
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
        <h2 className="text-2xl font-semibold">Ad Accounts Management</h2>
        <Button variant="outline" onClick={onBack}>
          Back to Settings
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Ad Accounts
            </CardTitle>
            <Button onClick={handleAdd}>
              <Plus className="h-4 w-4 mr-2" />
              Add Ad Account
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {adAccounts.map((account) => (
              <div key={account.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-medium">{account.name}</h4>
                    <Badge variant={account.status === 'Connected' ? 'default' : 'secondary'}>
                      {account.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{account.description}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(account)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(account)}>
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
          setSelectedAccount(null);
          setFormData({});
        }
      }}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedAccount ? "Edit Ad Account" : "Add Ad Account"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="account">Ad Account</Label>
              <Select 
                value={formData.name} 
                onValueChange={handleAccountChange}
                disabled={!!selectedAccount}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an ad account" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(accountTemplates).map((account) => (
                    <SelectItem key={account} value={account}>{account}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Connected">Connected</SelectItem>
                  <SelectItem value="Disconnected">Disconnected</SelectItem>
                  <SelectItem value="Not Configured">Not Configured</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.name && renderSettingsFields(formData.name, formData.settings || {})}

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => {
                setShowAddDialog(false);
                setShowEditDialog(false);
                setSelectedAccount(null);
                setFormData({});
              }}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                {selectedAccount ? "Update" : "Add"} Ad Account
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
        title="Delete Ad Account"
        description={`Are you sure you want to delete the ${selectedAccount?.name} ad account? This action cannot be undone.`}
      />
    </div>
  );
};

export default AdAccounts;