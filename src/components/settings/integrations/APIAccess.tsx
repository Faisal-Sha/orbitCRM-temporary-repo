import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Key, Plus, Eye, Trash2 } from "lucide-react";
import DeleteConfirmationDialog from "@/components/settings/usersandroles/DeleteConfirmationDialog";

interface APIKey {
  id: string;
  name: string;
  key: string;
  created: string;
  lastUsed: string;
}

interface APIAccessProps {
  onBack: () => void;
}

const APIAccess = ({ onBack }: APIAccessProps) => {
  const [apiKeys, setApiKeys] = useState<APIKey[]>([
    { 
      id: "1", 
      name: "Production API Key", 
      key: "sk_live_abc123def456", 
      created: "2024-01-15", 
      lastUsed: "2024-01-20" 
    },
    { 
      id: "2", 
      name: "Development API Key", 
      key: "sk_test_ghi789jkl012", 
      created: "2024-01-10", 
      lastUsed: "2024-01-19" 
    },
    { 
      id: "3", 
      name: "Staging API Key", 
      key: "sk_test_mno345pqr678", 
      created: "2024-01-08", 
      lastUsed: "2024-01-18" 
    },
    { 
      id: "4", 
      name: "Testing API Key", 
      key: "sk_test_stu901vwx234", 
      created: "2024-01-05", 
      lastUsed: "2024-01-17" 
    },
    { 
      id: "5", 
      name: "Integration API Key", 
      key: "sk_live_yzab567cdef890", 
      created: "2024-01-03", 
      lastUsed: "2024-01-16" 
    },
    { 
      id: "6", 
      name: "Mobile App API Key", 
      key: "sk_live_ghij123klmn456", 
      created: "2024-01-01", 
      lastUsed: "2024-01-15" 
    },
    { 
      id: "7", 
      name: "Webhook API Key", 
      key: "sk_test_opqr789stuv012", 
      created: "2023-12-28", 
      lastUsed: "2024-01-14" 
    },
  ]);

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedApiKey, setSelectedApiKey] = useState<APIKey | null>(null);
  const [formData, setFormData] = useState<Partial<APIKey>>({});

  const generateApiKey = () => {
    const prefix = Math.random() > 0.5 ? 'sk_live_' : 'sk_test_';
    const randomString = Math.random().toString(36).substr(2, 15);
    return prefix + randomString;
  };

  const handleAdd = () => {
    setFormData({ name: "", key: generateApiKey() });
    setShowAddDialog(true);
  };

  const handleView = (apiKey: APIKey) => {
    setSelectedApiKey(apiKey);
    setShowViewDialog(true);
  };

  const handleRevoke = (apiKey: APIKey) => {
    setSelectedApiKey(apiKey);
    setShowDeleteDialog(true);
  };

  const handleSave = () => {
    if (!formData.name) return;

    const newApiKey: APIKey = {
      id: Date.now().toString(),
      name: formData.name!,
      key: formData.key || generateApiKey(),
      created: new Date().toISOString().split('T')[0],
      lastUsed: "Never",
    };

    setApiKeys([...apiKeys, newApiKey]);
    setShowAddDialog(false);
    setFormData({});
  };

  const handleDeleteConfirm = () => {
    if (selectedApiKey) {
      setApiKeys(apiKeys.filter(k => k.id !== selectedApiKey.id));
    }
    setShowDeleteDialog(false);
    setSelectedApiKey(null);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">API Access Management</h2>
        <Button variant="outline" onClick={onBack}>
          Back to Settings
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              API Keys
            </CardTitle>
            <Button onClick={handleAdd}>
              <Plus className="h-4 w-4 mr-2" />
              Generate New Key
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {apiKeys.map((apiKey) => (
              <div key={apiKey.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium mb-1">{apiKey.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    Created: {apiKey.created} • Last used: {apiKey.lastUsed}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {apiKey.key.substring(0, 12)}...
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => handleView(apiKey)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleRevoke(apiKey)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Add Dialog */}
      <Dialog open={showAddDialog} onOpenChange={(open) => {
        if (!open) {
          setShowAddDialog(false);
          setFormData({});
        }
      }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Generate New API Key</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Key Name</Label>
              <Input
                id="name"
                value={formData.name || ""}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter a descriptive name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="key">Generated Key</Label>
              <div className="flex gap-2">
                <Input
                  id="key"
                  value={formData.key || ""}
                  readOnly
                  className="font-mono text-sm"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFormData({ ...formData, key: generateApiKey() })}
                >
                  Regenerate
                </Button>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => {
                setShowAddDialog(false);
                setFormData({});
              }}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                Generate Key
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>API Key Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Key Name</Label>
              <p className="font-medium">{selectedApiKey?.name}</p>
            </div>

            <div className="space-y-2">
              <Label>API Key</Label>
              <div className="flex gap-2">
                <Input
                  value={selectedApiKey?.key || ""}
                  readOnly
                  className="font-mono text-sm"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(selectedApiKey?.key || "")}
                >
                  Copy
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Created</Label>
              <p className="text-sm text-muted-foreground">{selectedApiKey?.created}</p>
            </div>

            <div className="space-y-2">
              <Label>Last Used</Label>
              <p className="text-sm text-muted-foreground">{selectedApiKey?.lastUsed}</p>
            </div>

            <div className="flex justify-end pt-4">
              <Button onClick={() => setShowViewDialog(false)}>
                Close
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
        title="Revoke API Key"
        description={`Are you sure you want to revoke the ${selectedApiKey?.name} API key? This action cannot be undone and will immediately stop all requests using this key.`}
      />
    </div>
  );
};

export default APIAccess;