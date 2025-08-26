
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectItem, SelectContent, SelectValue } from "@/components/ui/select";
import { PresetColorPicker } from "./ColorPickers";
import { CATEGORY_OPTIONS, MEETING_LOCATIONS, CARD_COLORS } from "./constants";
import { LeadCampaignSelector } from "@/components/shared/LeadCampaignSelector";

interface GeneralTabProps {
  editing: any;
  setEditing: (editing: any) => void;
  meetingLocation: string;
  setMeetingLocation: (location: string) => void;
  meetingAddress: string;
  setMeetingAddress: (address: string) => void;
  meetingUrl: string;
  setMeetingUrl: (url: string) => void;
  meetingPhone: string;
  setMeetingPhone: (phone: string) => void;
  meetingOther: string;
  setMeetingOther: (other: string) => void;
}

export function GeneralTab({
  editing,
  setEditing,
  meetingLocation,
  setMeetingLocation,
  meetingAddress,
  setMeetingAddress,
  meetingUrl,
  setMeetingUrl,
  meetingPhone,
  setMeetingPhone,
  meetingOther,
  setMeetingOther,
}: GeneralTabProps) {
  
  const handleCampaignSelection = (campaignData: any) => {
    setEditing({
      ...editing,
      leadCampaign: campaignData
    });
  };

  return (
    <div className="pt-4 space-y-4 px-0 sm:px-2">
      <div>
        <Label className="mb-1 block">Title</Label>
        <Input
          value={editing.title || ""}
          onChange={e => setEditing({ ...editing, title: e.target.value })}
          className="rounded-lg px-4 py-2"
        />
      </div>
      <div>
        <Label className="mb-1 block">Description</Label>
        <Textarea
          value={editing.description || ""}
          onChange={e => setEditing({ ...editing, description: e.target.value })}
          className="rounded-lg px-4 py-2 min-h-[70px] resize-y"
        />
      </div>
      <div className="flex flex-col md:flex-row gap-6 items-start md:items-end">
        <div>
          <Label className="mb-1 block">Color</Label>
          <PresetColorPicker
            value={editing.color || CARD_COLORS[0]}
            onChange={color => setEditing({ ...editing, color })}
          />
        </div>
        <div className="flex-1 min-w-[180px]">
          <Label className="mb-1 block">Category</Label>
          <Select value={editing.category || CATEGORY_OPTIONS[0]} onValueChange={val => setEditing({ ...editing, category: val })}>
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORY_OPTIONS.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <Label className="mb-1 block">Meeting Location</Label>
        <Select
          value={meetingLocation}
          onValueChange={v => setMeetingLocation(v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            {MEETING_LOCATIONS.map(opt => (
              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {/* Conditional Fields */}
        {meetingLocation === "video" && (
          <div className="mt-2">
            <Label className="mb-1 block">Video meeting link</Label>
            <Input
              value={meetingUrl}
              placeholder="Paste video call URL"
              onChange={e => setMeetingUrl(e.target.value)}
              className="rounded-lg px-4 py-2"
            />
          </div>
        )}
        {meetingLocation === "phone" && (
          <div className="mt-2">
            <Label className="mb-1 block">Phone number</Label>
            <Input
              value={meetingPhone}
              placeholder="Enter phone number"
              onChange={e => setMeetingPhone(e.target.value)}
              className="rounded-lg px-4 py-2"
            />
          </div>
        )}
        {meetingLocation === "in_person" && (
          <div className="mt-2">
            <Label className="mb-1 block">Address</Label>
            <Input
              value={meetingAddress}
              placeholder="Enter meeting address"
              onChange={e => setMeetingAddress(e.target.value)}
              className="rounded-lg px-4 py-2"
            />
          </div>
        )}
        {meetingLocation === "other" && (
          <div className="mt-2">
            <Label className="mb-1 block">Other details</Label>
            <Input
              value={meetingOther}
              placeholder="Enter other details"
              onChange={e => setMeetingOther(e.target.value)}
              className="rounded-lg px-4 py-2"
            />
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label>Lead Campaign Assignment</Label>
        <p className="text-sm text-muted-foreground">
          Assign this appointment type to specific lead campaigns for tracking and analytics
        </p>
        <LeadCampaignSelector onSelectionChange={handleCampaignSelection} />
      </div>
    </div>
  );
}
