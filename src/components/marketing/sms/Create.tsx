
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CampaignSetup from './CampaignSetup';
import AudienceSelection from './AudienceSelection';
import EditorTab from './EditorTab';
import Preview from './Preview';
import ReviewTesting from './ReviewTesting';
import SchedulingSending from './SchedulingSending';
import SendConfirmationModal from './SendConfirmationModal';

export interface SMSCampaignData {
  name: string;
  message: string;
  fromNumber: string;
  tags: string[];
  recipientGroups: string[];
  excludeGroups: string[];
  individualContacts: string;
  optOutMessage: string;
}

const Create = () => {
  const [campaignData, setCampaignData] = useState<SMSCampaignData>({
    name: '',
    message: '',
    fromNumber: '+1234567890',
    tags: [],
    recipientGroups: [],
    excludeGroups: [],
    individualContacts: '',
    optOutMessage: "Reply STOP to opt out of future messages."
  });

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [sendAction, setSendAction] = useState<'now' | 'schedule'>('now');

  const updateCampaignData = (updates: Partial<SMSCampaignData>) => {
    setCampaignData(prev => ({ ...prev, ...updates }));
  };

  const handleSendAction = (action: 'now' | 'schedule') => {
    setSendAction(action);
    setShowConfirmModal(true);
  };

  const calculateRecipientCount = () => {
    // Dummy calculation based on selected groups
    const baseCount = campaignData.recipientGroups.length * 150;
    const excludeCount = campaignData.excludeGroups.length * 25;
    const individualCount = campaignData.individualContacts.split('\n').filter(line => line.trim()).length;
    return Math.max(0, baseCount - excludeCount + individualCount);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <Tabs defaultValue="setup" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="setup">Setup</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="testing">Testing</TabsTrigger>
          <TabsTrigger value="audience">Audience</TabsTrigger>
          <TabsTrigger value="send">Send</TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="setup" className="space-y-6">
            <div className="px-6 pt-6 pb-6">
              <CampaignSetup 
                data={campaignData} 
                onUpdate={updateCampaignData} 
              />
            </div>
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <div className="pt-6">
              <EditorTab 
                data={campaignData} 
                onUpdate={updateCampaignData}
              />
            </div>
          </TabsContent>

          <TabsContent value="preview" className="space-y-6">
            <div className="px-6 pt-6 pb-6">
              <Preview 
                data={campaignData}
              />
            </div>
          </TabsContent>

          <TabsContent value="testing" className="space-y-6">
            <div className="px-6 pt-6 pb-6">
              <ReviewTesting />
            </div>
          </TabsContent>

          <TabsContent value="audience" className="space-y-6">
            <div className="px-6 pt-6 pb-6">
              <AudienceSelection 
                data={campaignData} 
                onUpdate={updateCampaignData} 
              />
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">
                  Estimated Recipients: <span className="font-semibold">{calculateRecipientCount()}</span>
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="send" className="space-y-6">
            <div className="px-6 pt-6 pb-6">
              <SchedulingSending 
                onSendAction={handleSendAction}
                onSaveDraft={() => console.log('SMS Draft saved!')}
              />
            </div>
          </TabsContent>
        </div>
      </Tabs>

      {/* Send Confirmation Modal */}
      <SendConfirmationModal
        open={showConfirmModal}
        onOpenChange={setShowConfirmModal}
        campaignData={campaignData}
        sendAction={sendAction}
        recipientCount={calculateRecipientCount()}
      />
    </div>
  );
};

export default Create;
