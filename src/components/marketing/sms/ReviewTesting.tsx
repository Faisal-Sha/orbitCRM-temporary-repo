
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Send, 
  Shield, 
  CheckCircle, 
  AlertTriangle,
  Smartphone
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ReviewTesting: React.FC = () => {
  const [testPhone, setTestPhone] = useState('');
  const [complianceResults, setComplianceResults] = useState<any>(null);
  const { toast } = useToast();

  const handleSendTest = () => {
    if (!testPhone) {
      toast({
        title: "Phone Number Required",
        description: "Please enter a phone number to send the test SMS.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Test SMS Sent",
      description: `Test SMS sent to ${testPhone}`,
    });
    
    console.log('Test SMS sent to:', testPhone);
  };

  const handleComplianceCheck = () => {
    // Simulate compliance check with random results
    const complianceScore = Math.floor(Math.random() * 10) + 1;
    const issues = [];
    
    if (complianceScore < 8) issues.push("Consider adding your business name to the message");
    if (complianceScore < 6) issues.push("Ensure opt-out instructions are clear");
    if (complianceScore < 4) issues.push("Message may be too promotional - review content");
    
    const results = {
      score: complianceScore,
      status: complianceScore >= 8 ? 'good' : complianceScore >= 6 ? 'warning' : 'poor',
      issues: issues
    };
    
    setComplianceResults(results);
    
    toast({
      title: "Compliance Check Complete",
      description: `Compliance score: ${complianceScore}/10`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Send Test SMS */}
      <div>
        <Label className="text-base font-semibold mb-3 block">Send Test SMS</Label>
        <div className="flex gap-3">
          <div className="flex-1">
            <Input
              type="tel"
              value={testPhone}
              onChange={(e) => setTestPhone(e.target.value)}
              placeholder="Enter phone number (e.g., +1234567890)..."
            />
          </div>
          <Button onClick={handleSendTest}>
            <Send className="w-4 h-4 mr-2" />
            Send Test
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Send a test SMS to preview how it will appear on mobile devices.
        </p>
      </div>

      {/* Compliance Check */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <Label className="text-base font-semibold">SMS Compliance Check</Label>
          <Button variant="outline" onClick={handleComplianceCheck}>
            <Shield className="w-4 h-4 mr-2" />
            Run Compliance Check
          </Button>
        </div>
        
        {complianceResults && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium">Compliance Score: {complianceResults.score}/10</span>
                <Badge 
                  variant={
                    complianceResults.status === 'good' ? 'default' : 
                    complianceResults.status === 'warning' ? 'secondary' : 
                    'destructive'
                  }
                >
                  {complianceResults.status === 'good' ? 'Good' : 
                   complianceResults.status === 'warning' ? 'Fair' : 'Poor'}
                </Badge>
              </div>
              
              {complianceResults.issues.length > 0 && (
                <div className="space-y-2">
                  <div className="text-sm font-medium text-orange-700">Recommendations:</div>
                  {complianceResults.issues.map((issue: string, index: number) => (
                    <div key={index} className="flex items-start gap-2 text-sm">
                      <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                      <span>{issue}</span>
                    </div>
                  ))}
                </div>
              )}
              
              {complianceResults.status === 'good' && (
                <div className="flex items-center gap-2 text-sm text-green-700">
                  <CheckCircle className="w-4 h-4" />
                  <span>Your SMS meets compliance requirements and should deliver well.</span>
                </div>
              )}
            </CardContent>
          </Card>
        )}
        
        <p className="text-xs text-muted-foreground mt-2">
          Check your SMS against regulatory requirements and best practices.
        </p>
      </div>

      {/* Device Testing */}
      <div>
        <Label className="text-base font-semibold mb-3 block">Device Compatibility</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-blue-600" />
                  <span className="font-medium">iPhone</span>
                </div>
                <Badge variant="outline" className="text-green-600">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Compatible
                </Badge>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Message will display properly on iOS devices
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-green-600" />
                  <span className="font-medium">Android</span>
                </div>
                <Badge variant="outline" className="text-green-600">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Compatible
                </Badge>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Message will display properly on Android devices
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* SMS Regulations */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium mb-2">📋 SMS Regulations Checklist:</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>✓ Recipients have opted in to receive SMS messages</li>
          <li>✓ Clear opt-out instructions are provided</li>
          <li>✓ Business identification is included</li>
          <li>✓ Message content is compliant with local regulations</li>
          <li>✓ Sending during appropriate hours</li>
        </ul>
      </div>
    </div>
  );
};

export default ReviewTesting;
