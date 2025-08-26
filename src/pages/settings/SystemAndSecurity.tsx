
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Archive, Database, HardDrive, Shield, Clock, Lock, AlertTriangle, Eye } from "lucide-react";

const SystemAndSecurity = () => {
  const auditLogs = [
    { action: "User Login", user: "Dr. Sarah Johnson", timestamp: "2024-01-20 14:30", ip: "192.168.1.100" },
    { action: "Patient Record Updated", user: "Mike Chen", timestamp: "2024-01-20 13:45", ip: "192.168.1.101" },
    { action: "System Backup", user: "System", timestamp: "2024-01-20 02:00", ip: "System" },
  ];

  const storageInfo = [
    { type: "Patient Records", size: "2.4 GB", percentage: 60 },
    { type: "Document Storage", size: "1.8 GB", percentage: 45 },
    { type: "System Backups", size: "3.2 GB", percentage: 80 },
    { type: "Media Files", size: "0.8 GB", percentage: 20 },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Archive className="h-5 w-5" />
            Audit Log Retention
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="retention-period">Retention Period</Label>
              <Input id="retention-period" placeholder="365 days" />
            </div>
            <div>
              <Label htmlFor="backup-frequency">Backup Frequency</Label>
              <Input id="backup-frequency" placeholder="Daily" />
            </div>
          </div>
          
          <div>
            <Label>Recent Audit Logs</Label>
            <div className="space-y-2 mt-2">
              {auditLogs.map((log, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <p className="font-medium text-sm">{log.action}</p>
                    <p className="text-xs text-gray-500">{log.user} • {log.timestamp}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">{log.ip}</Badge>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full">View All Logs</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Data Retention Policies
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded">
              <div>
                <p className="font-medium">Patient Records</p>
                <p className="text-sm text-gray-500">Retain for 7 years after last visit</p>
              </div>
              <Button variant="ghost" size="sm">Configure</Button>
            </div>
            <div className="flex items-center justify-between p-3 border rounded">
              <div>
                <p className="font-medium">Financial Records</p>
                <p className="text-sm text-gray-500">Retain for 10 years</p>
              </div>
              <Button variant="ghost" size="sm">Configure</Button>
            </div>
            <div className="flex items-center justify-between p-3 border rounded">
              <div>
                <p className="font-medium">Communication Logs</p>
                <p className="text-sm text-gray-500">Retain for 3 years</p>
              </div>
              <Button variant="ghost" size="sm">Configure</Button>
            </div>
          </div>
          <Button variant="outline">Add Retention Policy</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HardDrive className="h-5 w-5" />
            Storage Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">Total Storage Used</h4>
                <p className="text-2xl font-bold text-blue-900">8.2 GB</p>
                <p className="text-sm text-blue-600">of 50 GB available</p>
              </div>
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-medium text-green-800 mb-2">Backup Status</h4>
                <p className="text-lg font-semibold text-green-900">✓ Up to date</p>
                <p className="text-sm text-green-600">Last backup: 2 hours ago</p>
              </div>
            </div>
            
            <div className="space-y-3">
              {storageInfo.map((storage, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{storage.type}</span>
                    <span className="text-sm text-gray-500">{storage.size}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${storage.percentage}%` }}
                    ></div>
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
            <Shield className="h-5 w-5" />
            Security Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Password Policies
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span>Minimum Length</span>
                  <Badge variant="outline">8 characters</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Require Special Characters</span>
                  <Badge variant="default">Enabled</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Password Expiry</span>
                  <Badge variant="outline">90 days</Badge>
                </div>
              </div>
              <Button variant="outline" size="sm">Configure Policies</Button>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Multi-Factor Authentication
              </h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 border rounded">
                  <span className="text-sm">Enforce MFA for all users</span>
                  <Badge variant="default">Enabled</Badge>
                </div>
                <div className="flex items-center justify-between p-2 border rounded">
                  <span className="text-sm">SMS Authentication</span>
                  <Badge variant="default">Available</Badge>
                </div>
                <div className="flex items-center justify-between p-2 border rounded">
                  <span className="text-sm">Authenticator Apps</span>
                  <Badge variant="default">Available</Badge>
                </div>
              </div>
              <Button variant="outline" size="sm">Configure MFA</Button>
            </div>
          </div>
          
          <div className="pt-4 border-t">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Session Timeout</h4>
                <p className="text-sm text-gray-500">Automatically log out inactive users</p>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <Badge variant="outline">30 minutes</Badge>
                <Button variant="ghost" size="sm">Change</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemAndSecurity;
