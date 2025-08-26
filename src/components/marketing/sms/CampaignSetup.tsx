
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { X, Plus, ArrowLeft, Trash2, Edit } from "lucide-react";
import { SMSCampaignData } from './Create';

interface CampaignSetupProps {
  data: SMSCampaignData;
  onUpdate: (updates: Partial<SMSCampaignData>) => void;
}

const CampaignSetup: React.FC<CampaignSetupProps> = ({ data, onUpdate }) => {
  const [showTagManager, setShowTagManager] = useState(false);
  const [managedTags, setManagedTags] = useState([
    'Promotion', 'Reminder', 'Alert', 'Welcome', 'Follow-up', 
    'Event', 'Update', 'Seasonal', 'Urgent', 'Flash Sale'
  ]);
  const [newTagName, setNewTagName] = useState('');
  const [editingTag, setEditingTag] = useState<{ index: number; name: string } | null>(null);

  const phoneNumbers = [
    '+1234567890',
    '+1987654321',
    '+1555123456'
  ];

  const addTag = (tag: string) => {
    if (!data.tags.includes(tag)) {
      onUpdate({ tags: [...data.tags, tag] });
    }
  };

  const removeTag = (tagToRemove: string) => {
    onUpdate({ tags: data.tags.filter(tag => tag !== tagToRemove) });
  };

  // Tag Manager Functions
  const addNewTag = () => {
    if (newTagName.trim() && !managedTags.includes(newTagName.trim())) {
      setManagedTags([...managedTags, newTagName.trim()]);
      setNewTagName('');
    }
  };

  const deleteTag = (tagToDelete: string) => {
    setManagedTags(managedTags.filter(tag => tag !== tagToDelete));
    if (data.tags.includes(tagToDelete)) {
      removeTag(tagToDelete);
    }
  };

  const startEditingTag = (index: number, name: string) => {
    setEditingTag({ index, name });
  };

  const saveEditedTag = () => {
    if (editingTag && editingTag.name.trim()) {
      const updatedTags = [...managedTags];
      const oldName = updatedTags[editingTag.index];
      updatedTags[editingTag.index] = editingTag.name.trim();
      setManagedTags(updatedTags);
      
      if (data.tags.includes(oldName)) {
        const updatedCampaignTags = data.tags.map(tag => 
          tag === oldName ? editingTag.name.trim() : tag
        );
        onUpdate({ tags: updatedCampaignTags });
      }
      
      setEditingTag(null);
    }
  };

  const cancelEditingTag = () => {
    setEditingTag(null);
  };

  if (showTagManager) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            onClick={() => setShowTagManager(false)}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to setup</span>
          </Button>
          <h2 className="text-2xl font-bold">Manage Campaign Tags</h2>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Add New Tag</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-2">
              <Input
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                placeholder="Enter new tag name..."
                onKeyPress={(e) => e.key === 'Enter' && addNewTag()}
              />
              <Button onClick={addNewTag} disabled={!newTagName.trim()}>
                <Plus className="w-4 h-4 mr-1" />
                Add Tag
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Existing Tags</CardTitle>
            <p className="text-sm text-muted-foreground">
              Manage your campaign tags. You can edit or delete existing tags.
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {managedTags.map((tag, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  {editingTag?.index === index ? (
                    <div className="flex items-center space-x-2 flex-1">
                      <Input
                        value={editingTag.name}
                        onChange={(e) => setEditingTag({ ...editingTag, name: e.target.value })}
                        onKeyPress={(e) => e.key === 'Enter' && saveEditedTag()}
                        className="flex-1"
                      />
                      <Button size="sm" onClick={saveEditedTag}>Save</Button>
                      <Button size="sm" variant="ghost" onClick={cancelEditingTag}>Cancel</Button>
                    </div>
                  ) : (
                    <>
                      <span className="font-medium">{tag}</span>
                      <div className="flex items-center space-x-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => startEditingTag(index, tag)}
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteTag(tag)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
            {managedTags.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                No tags available. Add some tags to get started.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <p className="text-sm text-muted-foreground">
            Set up the fundamental details for your SMS campaign.
          </p>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="campaignName">Campaign Name</Label>
              <Input
                id="campaignName"
                value={data.name}
                onChange={(e) => onUpdate({ name: e.target.value })}
                placeholder="Enter campaign name..."
              />
            </div>

            <div>
              <Label htmlFor="fromNumber">From Phone Number</Label>
              <Select value={data.fromNumber} onValueChange={(value) => onUpdate({ fromNumber: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select phone number..." />
                </SelectTrigger>
                <SelectContent>
                  {phoneNumbers.map(number => (
                    <SelectItem key={number} value={number}>{number}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label>Message Length</Label>
              <div className="text-sm text-muted-foreground">
                {data.message.length}/160 characters
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div 
                  className={`h-2 rounded-full transition-all ${
                    data.message.length > 160 ? 'bg-red-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min((data.message.length / 160) * 100, 100)}%` }}
                />
              </div>
              {data.message.length > 160 && (
                <p className="text-xs text-red-500 mt-1">
                  Message exceeds 160 characters. This will be sent as multiple SMS.
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Campaign Tags</CardTitle>
          <p className="text-sm text-muted-foreground">
            Organize your campaign with relevant tags for better management.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {data.tags.map(tag => (
              <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                {tag}
                <X 
                  className="w-3 h-3 cursor-pointer hover:text-red-500" 
                  onClick={() => removeTag(tag)}
                />
              </Badge>
            ))}
          </div>
          
          <div className="flex flex-wrap gap-2">
            {managedTags.filter(tag => !data.tags.includes(tag)).slice(0, 8).map(tag => (
              <Button
                key={tag}
                variant="outline"
                size="sm"
                onClick={() => addTag(tag)}
                className="text-xs"
              >
                + {tag}
              </Button>
            ))}
          </div>

          <div className="pt-2">
            <Button
              variant="link"
              onClick={() => setShowTagManager(true)}
              className="text-blue-600 hover:text-blue-800 p-0 h-auto"
            >
              Manage tags
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Opt-Out Settings</CardTitle>
          <p className="text-sm text-muted-foreground">
            Customize the opt-out message for compliance with SMS regulations.
          </p>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="optOutMessage">Opt-Out Message</Label>
            <Textarea
              id="optOutMessage"
              value={data.optOutMessage}
              onChange={(e) => onUpdate({ optOutMessage: e.target.value })}
              placeholder="Customize your opt-out message..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CampaignSetup;
