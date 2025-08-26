
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { X, Sparkles, Plus, ArrowLeft, Trash2, Edit } from "lucide-react";
import { CampaignData } from './Create';
import { AISubjectLineGenerator } from '@/components/automation/sidebar/AISubjectLineGenerator';

interface CampaignSetupProps {
  data: CampaignData;
  onUpdate: (updates: Partial<CampaignData>) => void;
}

const CampaignSetup: React.FC<CampaignSetupProps> = ({ data, onUpdate }) => {
  const [showAISubjectGenerator, setShowAISubjectGenerator] = useState(false);
  const [showTagManager, setShowTagManager] = useState(false);
  const [managedTags, setManagedTags] = useState([
    'Newsletter', 'Promotion', 'Announcement', 'Welcome', 'Follow-up', 
    'Event', 'Product Update', 'Educational', 'Seasonal', 'Urgent'
  ]);
  const [newTagName, setNewTagName] = useState('');
  const [editingTag, setEditingTag] = useState<{ index: number; name: string } | null>(null);

  const emailOptions = [
    'admin@example.com',
    'support@example.com',
    'noreply@example.com'
  ];

  const addTag = (tag: string) => {
    if (!data.tags.includes(tag)) {
      onUpdate({ tags: [...data.tags, tag] });
    }
  };

  const removeTag = (tagToRemove: string) => {
    onUpdate({ tags: data.tags.filter(tag => tag !== tagToRemove) });
  };

  const handleAISubjectInsert = (subjectLine: string) => {
    onUpdate({ subjectLine });
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
    // Also remove from campaign tags if it exists there
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
      
      // Update campaign tags if the old tag was being used
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
            Set up the fundamental details for your email campaign.
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
              <Label htmlFor="fromName">From Name</Label>
              <Input
                id="fromName"
                value={data.fromName}
                onChange={(e) => onUpdate({ fromName: e.target.value })}
                placeholder="Your Name or Company Name"
              />
            </div>

            <div>
              <Label htmlFor="fromEmail">From Email Address</Label>
              <Select value={data.fromEmail} onValueChange={(value) => onUpdate({ fromEmail: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select from email..." />
                </SelectTrigger>
                <SelectContent>
                  {emailOptions.map(email => (
                    <SelectItem key={email} value={email}>{email}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="subjectLine">Subject Line</Label>
              <div className="flex gap-2">
                <Input
                  id="subjectLine"
                  value={data.subjectLine}
                  onChange={(e) => onUpdate({ subjectLine: e.target.value })}
                  placeholder="Enter subject line..."
                  className="flex-1"
                />
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowAISubjectGenerator(true)}
                  className="whitespace-nowrap"
                >
                  <Sparkles className="w-4 h-4 mr-1" />
                  AI Generate
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="preheaderText">Preheader Text</Label>
              <Input
                id="preheaderText"
                value={data.preheaderText}
                onChange={(e) => onUpdate({ preheaderText: e.target.value })}
                placeholder="Preview text that appears after subject line..."
              />
            </div>

            <div>
              <Label htmlFor="replyToEmail">Reply-To Email Address</Label>
              <Input
                id="replyToEmail"
                value={data.replyToEmail}
                onChange={(e) => onUpdate({ replyToEmail: e.target.value })}
                placeholder={data.fromEmail || "reply@example.com"}
              />
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
          <CardTitle>Unsubscribe Settings</CardTitle>
          <p className="text-sm text-muted-foreground">
            Customize the unsubscribe message that appears in your emails.
          </p>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="unsubscribeMessage">Unsubscribe Message</Label>
            <Textarea
              id="unsubscribeMessage"
              value={data.unsubscribeMessage}
              onChange={(e) => onUpdate({ unsubscribeMessage: e.target.value })}
              placeholder="Customize your unsubscribe message..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <AISubjectLineGenerator
        isOpen={showAISubjectGenerator}
        onClose={() => setShowAISubjectGenerator(false)}
        onInsert={handleAISubjectInsert}
      />
    </div>
  );
};

export default CampaignSetup;
