
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, MessageSquare, Phone } from "lucide-react";
import { useState } from "react";
import PhoneNumbers from "@/components/settings/communication/PhoneNumbers";
import EmailAddresses from "@/components/settings/communication/EmailAddresses";

const Communication = () => {
  const [activeView, setActiveView] = useState<'main' | 'phone' | 'email'>('main');

  const phoneNumbers = [
    { number: "+1 (555) 123-4567", category: "Public", owner: "Organization", verified: true, status: "active" },
    { number: "+1 (555) 987-6543", category: "Clients", owner: "John Doe", verified: true, status: "active" },
    { number: "+1 (555) 456-7890", category: "Staff", owner: "Jane Smith", verified: false, status: "inactive" },
    { number: "+1 (555) 321-0987", category: "AI Voice", owner: "Organization", verified: true, status: "active" },
    { number: "+1 (555) 654-3210", category: "Sales", owner: "Mike Johnson", verified: true, status: "active" },
  ];

  const emailAddresses = [
    { email: "info@healthcare.com", category: "Public", owner: "Organization", verified: true, status: "active" },
    { email: "support@healthcare.com", category: "Clients", owner: "Organization", verified: true, status: "active" },
    { email: "billing@healthcare.com", category: "Staff", owner: "Jane Smith", verified: false, status: "inactive" },
    { email: "ai@healthcare.com", category: "AI Voice", owner: "Organization", verified: true, status: "active" },
    { email: "sales@healthcare.com", category: "Sales", owner: "Mike Johnson", verified: true, status: "active" },
  ];

  if (activeView === 'phone') {
    return <PhoneNumbers onBack={() => setActiveView('main')} />;
  }

  if (activeView === 'email') {
    return <EmailAddresses onBack={() => setActiveView('main')} />;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="smtp-server">SMTP Server</Label>
              <Input id="smtp-server" placeholder="smtp.gmail.com" />
            </div>
            <div>
              <Label htmlFor="smtp-port">SMTP Port</Label>
              <Input id="smtp-port" placeholder="587" />
            </div>
            <div>
              <Label htmlFor="smtp-username">Username</Label>
              <Input id="smtp-username" placeholder="your-email@gmail.com" />
            </div>
            <div>
              <Label htmlFor="smtp-password">Password</Label>
              <Input id="smtp-password" type="password" placeholder="••••••••" />
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Email Addresses</Label>
              <Button onClick={() => setActiveView('email')} className="bg-blue-600 hover:bg-blue-700">
                Manage
              </Button>
            </div>
            <div className="space-y-2">
              {emailAddresses.map((email, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <p className="font-medium">{email.email}</p>
                    <p className="text-sm text-gray-500">{email.category} • {email.owner}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={email.verified ? "default" : "secondary"}>
                      {email.verified ? "Verified" : "Unverified"}
                    </Badge>
                    <Badge variant={email.status === "active" ? "default" : "secondary"}>
                      {email.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Phone & SMS Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="provider">Provider</Label>
              <Select>
                <SelectTrigger id="provider">
                  <SelectValue placeholder="Select provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="twilio">Twilio</SelectItem>
                  <SelectItem value="vonage">Vonage</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="api-key">API Key</Label>
              <Input id="api-key" type="password" placeholder="••••••••••••••••" />
            </div>
            <div>
              <Label htmlFor="account-sid">Account SID</Label>
              <Input id="account-sid" type="password" placeholder="••••••••••••••••" />
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Phone Numbers</Label>
              <Button onClick={() => setActiveView('phone')} className="bg-blue-600 hover:bg-blue-700">
                Manage
              </Button>
            </div>
            <div className="space-y-2">
              {phoneNumbers.map((phone, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <p className="font-medium">{phone.number}</p>
                    <p className="text-sm text-gray-500">{phone.category} • {phone.owner}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={phone.verified ? "default" : "secondary"}>
                      {phone.verified ? "Verified" : "Unverified"}
                    </Badge>
                    <Badge variant={phone.status === "active" ? "default" : "secondary"}>
                      {phone.status}
                    </Badge>
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

export default Communication;
