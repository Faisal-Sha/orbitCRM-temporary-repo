
import React from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Monitor,
  Tablet,
  Smartphone,
  CheckCircle
} from "lucide-react";
import { CampaignData } from './Create';

interface PreviewProps {
  data: CampaignData;
  previewDevice: 'desktop' | 'tablet' | 'mobile';
  onPreviewDeviceChange: (device: 'desktop' | 'tablet' | 'mobile') => void;
}

const Preview: React.FC<PreviewProps> = ({ 
  data, 
  previewDevice, 
  onPreviewDeviceChange 
}) => {
  const getDeviceIcon = (device: string) => {
    switch (device) {
      case 'tablet': return <Tablet className="w-4 h-4" />;
      case 'mobile': return <Smartphone className="w-4 h-4" />;
      default: return <Monitor className="w-4 h-4" />;
    }
  };

  const getPreviewWidth = () => {
    switch (previewDevice) {
      case 'mobile': return 'max-w-sm';
      case 'tablet': return 'max-w-md';
      default: return 'max-w-2xl';
    }
  };

  return (
    <div className="space-y-6">
      {/* Mobile Responsiveness Preview */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <Label className="text-base font-semibold">Mobile Responsiveness Preview</Label>
          <div className="flex gap-1">
            {(['desktop', 'tablet', 'mobile'] as const).map(device => (
              <Button
                key={device}
                variant={previewDevice === device ? 'default' : 'outline'}
                size="sm"
                onClick={() => onPreviewDeviceChange(device)}
                className="capitalize"
              >
                {getDeviceIcon(device)}
                <span className="ml-1">{device}</span>
              </Button>
            ))}
          </div>
        </div>
        
        <div className="text-sm text-muted-foreground mb-2">
          Current preview: <span className="font-medium capitalize">{previewDevice}</span>
        </div>
        
        <Card className="bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm">Email layout is responsive across all devices</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Email Preview */}
      <div className="border rounded-lg p-4 bg-gray-50">
        <div className={`mx-auto bg-white border rounded-lg shadow-sm ${getPreviewWidth()}`}>
          <div className="p-6">
            <div className="border-b pb-4 mb-4">
              <div className="text-sm text-gray-500">Subject: {data.subjectLine || 'Your subject line'}</div>
              <div className="text-sm text-gray-500">From: {data.fromName || 'Your Name'} &lt;{data.fromEmail}&gt;</div>
              {data.preheaderText && (
                <div className="text-xs text-gray-400 mt-1">{data.preheaderText}</div>
              )}
            </div>
            
            <div className="prose prose-sm max-w-none">
              {data.content ? (
                <div dangerouslySetInnerHTML={{ __html: data.content }} />
              ) : (
                <div className="text-gray-400 italic">Your email content will appear here...</div>
              )}
            </div>
            
            <div className="mt-8 pt-4 border-t text-xs text-gray-400 space-y-1">
              <div>{data.unsubscribeMessage}</div>
              <div>[Unsubscribe Link]</div>
              <div>[Company Physical Address]</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preview;
