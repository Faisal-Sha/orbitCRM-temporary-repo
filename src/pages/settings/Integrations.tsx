
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link, Webhook, Key, Zap, Target } from "lucide-react";
import { useState } from "react";
import External from "@/components/settings/integrations/External";
import AdAccounts from "@/components/settings/integrations/AdAccounts";
import Webhooks from "@/components/settings/integrations/Webhooks";  
import APIAccess from "@/components/settings/integrations/APIAccess";

const Integrations = () => {
  const [showExternal, setShowExternal] = useState(false);
  const [showAdAccounts, setShowAdAccounts] = useState(false);
  const [showWebhooks, setShowWebhooks] = useState(false);
  const [showAPIAccess, setShowAPIAccess] = useState(false);

  const integrations = [
    { name: "Mailgun", type: "Communication", status: "Connected", description: "Email delivery service" },
    { name: "Zoom", type: "Communication", status: "Connected", description: "Video conferencing" },
    { name: "Twilio", type: "Communication", status: "Not Configured", description: "SMS and voice services" },
    { name: "Stripe", type: "Payment", status: "Connected", description: "Payment processing" },
    { name: "Google Calendar", type: "Scheduling", status: "Connected", description: "Calendar integration" },
    { name: "QuickBooks", type: "Accounting", status: "Disconnected", description: "Financial management" },
  ];

  const adAccounts = [
    { name: "Meta", status: "Connected", description: "Facebook and Instagram advertising" },
    { name: "Google", status: "Disconnected", description: "Google Ads platform" },
    { name: "TikTok", status: "Not Configured", description: "TikTok advertising platform" },
  ];

  const webhooks = [
    { name: "Appointment Created", url: "https://api.example.com/webhooks/appointment", status: "Active" },
    { name: "Payment Processed", url: "https://api.example.com/webhooks/payment", status: "Active" },
    { name: "Client Updated", url: "https://api.example.com/webhooks/client", status: "Inactive" },
    { name: "User Registration", url: "https://api.example.com/webhooks/user", status: "Active" },
    { name: "Document Upload", url: "https://api.example.com/webhooks/document", status: "Inactive" },
  ];

  const apiKeys = [
    { name: "Production API Key", created: "2024-01-15", lastUsed: "2024-01-20" },
    { name: "Development API Key", created: "2024-01-10", lastUsed: "2024-01-19" },
    { name: "Staging API Key", created: "2024-01-08", lastUsed: "2024-01-18" },
    { name: "Testing API Key", created: "2024-01-05", lastUsed: "2024-01-17" },
    { name: "Integration API Key", created: "2024-01-03", lastUsed: "2024-01-16" },
  ];

  // Navigation handlers
  if (showExternal) {
    return <External onBack={() => setShowExternal(false)} />;
  }

  if (showAdAccounts) {
    return <AdAccounts onBack={() => setShowAdAccounts(false)} />;
  }

  if (showWebhooks) {
    return <Webhooks onBack={() => setShowWebhooks(false)} />;
  }

  if (showAPIAccess) {
    return <APIAccess onBack={() => setShowAPIAccess(false)} />;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Link className="h-5 w-5" />
              External Integrations
            </CardTitle>
            <Button onClick={() => setShowExternal(true)}>Manage</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {integrations.map((integration, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{integration.name}</h4>
                  <Badge variant={integration.status === 'Connected' ? 'default' : 'secondary'}>
                    {integration.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{integration.description}</p>
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs">{integration.type}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Ad Accounts
            </CardTitle>
            <Button onClick={() => setShowAdAccounts(true)}>Manage</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {adAccounts.map((account, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded">
                <div>
                  <p className="font-medium">{account.name}</p>
                  <p className="text-sm text-muted-foreground">{account.description}</p>
                </div>
                <Badge variant={account.status === 'Connected' ? 'default' : 'secondary'}>
                  {account.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Webhook className="h-5 w-5" />
              Webhooks
            </CardTitle>
            <Button onClick={() => setShowWebhooks(true)}>Manage</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {webhooks.map((webhook, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded">
                <div>
                  <p className="font-medium">{webhook.name}</p>
                  <p className="text-sm text-muted-foreground">{webhook.url}</p>
                </div>
                <Badge variant={webhook.status === 'Active' ? 'default' : 'secondary'}>
                  {webhook.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              API Access
            </CardTitle>
            <Button onClick={() => setShowAPIAccess(true)}>Manage</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-4 w-4 text-yellow-600" />
                <p className="font-medium text-yellow-800">API Documentation</p>
              </div>
              <p className="text-sm text-yellow-700">
                View our comprehensive API documentation to integrate with your existing systems.
              </p>
              <Button variant="outline" size="sm" className="mt-2">
                View Documentation
              </Button>
            </div>
            
            <div className="space-y-3">
              {apiKeys.map((key, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <p className="font-medium">{key.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Created: {key.created} • Last used: {key.lastUsed}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Integrations;
