
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
  AlertTriangle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ReviewTesting: React.FC = () => {
  const [testEmail, setTestEmail] = useState('');
  const [spamCheckResults, setSpamCheckResults] = useState<any>(null);
  const { toast } = useToast();

  const handleSendTest = () => {
    if (!testEmail) {
      toast({
        title: "Email Required",
        description: "Please enter an email address to send the test.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Test Email Sent",
      description: `Test email sent to ${testEmail}`,
    });
    
    console.log('Test email sent to:', testEmail);
  };

  const handleSpamCheck = () => {
    // Simulate spam check with random results
    const spamScore = Math.floor(Math.random() * 10);
    const issues = [];
    
    if (spamScore > 7) issues.push("Subject line contains too many promotional words");
    if (spamScore > 5) issues.push("Consider adding more text content");
    if (spamScore > 3) issues.push("Image-to-text ratio is high");
    
    const results = {
      score: spamScore,
      status: spamScore <= 3 ? 'good' : spamScore <= 6 ? 'warning' : 'poor',
      issues: issues
    };
    
    setSpamCheckResults(results);
    
    toast({
      title: "Spam Check Complete",
      description: `Spam score: ${spamScore}/10`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Send Test Email */}
      <div>
        <Label className="text-base font-semibold mb-3 block">Send Test Email</Label>
        <div className="flex gap-3">
          <div className="flex-1">
            <Input
              type="email"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              placeholder="Enter test email address..."
            />
          </div>
          <Button onClick={handleSendTest}>
            <Send className="w-4 h-4 mr-2" />
            Send Test
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Send a test email to preview how it will look in actual email clients.
        </p>
      </div>

      {/* Spam Check */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <Label className="text-base font-semibold">Spam Check</Label>
          <Button variant="outline" onClick={handleSpamCheck}>
            <Shield className="w-4 h-4 mr-2" />
            Run Spam Check
          </Button>
        </div>
        
        {spamCheckResults && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium">Spam Score: {spamCheckResults.score}/10</span>
                <Badge 
                  variant={
                    spamCheckResults.status === 'good' ? 'default' : 
                    spamCheckResults.status === 'warning' ? 'secondary' : 
                    'destructive'
                  }
                >
                  {spamCheckResults.status === 'good' ? 'Good' : 
                   spamCheckResults.status === 'warning' ? 'Fair' : 'Poor'}
                </Badge>
              </div>
              
              {spamCheckResults.issues.length > 0 && (
                <div className="space-y-2">
                  <div className="text-sm font-medium text-orange-700">Recommendations:</div>
                  {spamCheckResults.issues.map((issue: string, index: number) => (
                    <div key={index} className="flex items-start gap-2 text-sm">
                      <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                      <span>{issue}</span>
                    </div>
                  ))}
                </div>
              )}
              
              {spamCheckResults.status === 'good' && (
                <div className="flex items-center gap-2 text-sm text-green-700">
                  <CheckCircle className="w-4 h-4" />
                  <span>Your email has a low spam risk and should deliver well.</span>
                </div>
              )}
            </CardContent>
          </Card>
        )}
        
        <p className="text-xs text-muted-foreground mt-2">
          Check your email against common spam filters to improve deliverability.
        </p>
      </div>
    </div>
  );
};

export default ReviewTesting;
