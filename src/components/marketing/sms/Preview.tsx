
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Smartphone, MessageSquare, Clock, CheckCircle } from "lucide-react";
import { SMSCampaignData } from './Create';

interface PreviewProps {
  data: SMSCampaignData;
}

const Preview: React.FC<PreviewProps> = ({ data }) => {
  const getMessageSegments = () => {
    const message = data.message || '';
    const segments = Math.ceil(message.length / 160);
    return segments;
  };

  const getEstimatedCost = () => {
    const segments = getMessageSegments();
    const baseCost = 0.0075; // $0.0075 per segment
    return segments * baseCost;
  };

  return (
    <div className="space-y-6">
      {/* SMS Preview */}
      <div>
        <Label className="text-base font-semibold mb-4 block">SMS Preview</Label>
        
        <div className="flex justify-center">
          <div className="bg-gray-900 rounded-3xl p-6 w-80 shadow-2xl">
            {/* Phone Header */}
            <div className="bg-black rounded-t-3xl p-4 mb-4">
              <div className="flex justify-between items-center text-white text-sm">
                <span>9:41 AM</span>
                <div className="flex items-center space-x-1">
                  <div className="w-4 h-2 bg-white rounded-sm"></div>
                  <div className="w-1 h-1 bg-white rounded-full"></div>
                  <div className="w-6 h-3 border border-white rounded-sm"></div>
                </div>
              </div>
            </div>

            {/* Message Thread */}
            <div className="bg-white rounded-lg p-4 space-y-3">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <MessageSquare className="w-4 h-4" />
                <span>Messages</span>
              </div>
              
              <div className="space-y-2">
                <div className="text-sm font-medium">
                  {data.fromNumber || '+1234567890'}
                </div>
                
                <div className="bg-gray-100 rounded-2xl p-3 max-w-xs">
                  <div className="text-sm text-gray-900">
                    {data.message || 'Your SMS message will appear here...'}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    <Clock className="w-3 h-3 inline mr-1" />
                    Just now
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Message Analysis */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {data.message.length}
              </div>
              <div className="text-sm text-gray-600">Characters</div>
              <div className="text-xs text-gray-500 mt-1">
                Limit: 160 per SMS
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {getMessageSegments()}
              </div>
              <div className="text-sm text-gray-600">SMS Segments</div>
              <div className="text-xs text-gray-500 mt-1">
                Messages split
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                ${getEstimatedCost().toFixed(4)}
              </div>
              <div className="text-sm text-gray-600">Est. Cost per SMS</div>
              <div className="text-xs text-gray-500 mt-1">
                Per recipient
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delivery Information */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">From Number:</span>
              <span className="text-gray-600">{data.fromNumber || '+1234567890'}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="font-medium">Message Type:</span>
              <Badge variant="outline">
                {getMessageSegments() === 1 ? 'Single SMS' : 'Multi-part SMS'}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="font-medium">Delivery Status:</span>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-green-600">Ready to Send</span>
              </div>
            </div>
            
            {data.optOutMessage && (
              <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                <div className="text-sm font-medium text-yellow-800">Opt-out Message:</div>
                <div className="text-sm text-yellow-700 mt-1">{data.optOutMessage}</div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Best Practices */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium mb-2">📱 SMS Best Practices:</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Keep messages under 160 characters to avoid splitting</li>
          <li>• Include your business name for brand recognition</li>
          <li>• Always provide opt-out instructions (STOP)</li>
          <li>• Send during business hours for better engagement</li>
          <li>• Test messages on different devices before sending</li>
        </ul>
      </div>
    </div>
  );
};

export default Preview;
