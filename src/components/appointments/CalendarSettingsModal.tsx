
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Eye } from "lucide-react";
import { GeneralTab } from "./GeneralTab";
import { CustomFieldsTab } from "./CustomFieldsTab";
import { TimingTab } from "./TimingTab";
import { AvailabilityTab } from "./AvailabilityTab";
import { CommunicationTab } from "@/components/communicationflows/CommunicationTab";
import { AdvancedTab } from "./AdvancedTab";

interface CalendarSettingsModalProps {
  open: boolean;
  onClose: () => void;
  editing: any;
  setEditing: (editing: any) => void;
  onSave: () => void;
  isNew: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  customFields: any[];
  setCustomFields: (fields: any[]) => void;
  newCustomFieldLabel: string;
  setNewCustomFieldLabel: (label: string) => void;
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
  editingPhoneFormat: { [id: string]: string };
  setEditingPhoneFormat: (formats: { [id: string]: string }) => void;
  editingFieldType: { [id: string]: "text"|"textarea"|"phone" };
  setEditingFieldType: (types: { [id: string]: "text"|"textarea"|"phone" }) => void;
  calendarAvailability: any;
  setCalendarAvailability: (availability: any) => void;
  scheduleOption: string;
  setScheduleOption: (option: string) => void;
  dateRange: {from: Date|null, to: Date|null};
  setDateRange: (range: {from: Date|null, to: Date|null}) => void;
  numUpcomingDays: string;
  setNumUpcomingDays: (days: string) => void;
  selectedGlobalAvailability: string;
  setSelectedGlobalAvailability: (availability: string) => void;
}

export function CalendarSettingsModal({
  open,
  onClose,
  editing,
  setEditing,
  onSave,
  isNew,
  activeTab,
  setActiveTab,
  customFields,
  setCustomFields,
  newCustomFieldLabel,
  setNewCustomFieldLabel,
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
  editingPhoneFormat,
  setEditingPhoneFormat,
  editingFieldType,
  setEditingFieldType,
  calendarAvailability,
  setCalendarAvailability,
  scheduleOption,
  setScheduleOption,
  dateRange,
  setDateRange,
  numUpcomingDays,
  setNumUpcomingDays,
  selectedGlobalAvailability,
  setSelectedGlobalAvailability,
}: CalendarSettingsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto !flex flex-col px-4 sm:px-6">
        <DialogHeader>
          <DialogTitle>
            {isNew ? "Create New Calendar" : "Calendar Settings"}
          </DialogTitle>
          <DialogDescription>
            {isNew
              ? "Create a new appointment calendar for your organization."
              : "Manage calendar details and availability."}
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="mb-2"
          >
            <TabsList className="mb-2 w-full sticky top-0 z-10 bg-background">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="customFields">Custom Fields</TabsTrigger>
              <TabsTrigger value="timing">Timing</TabsTrigger>
              <TabsTrigger value="availability">Availability</TabsTrigger>
              <TabsTrigger value="communication">Communication</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>
            
            <TabsContent value="general">
              <GeneralTab
                editing={editing}
                setEditing={setEditing}
                meetingLocation={meetingLocation}
                setMeetingLocation={setMeetingLocation}
                meetingAddress={meetingAddress}
                setMeetingAddress={setMeetingAddress}
                meetingUrl={meetingUrl}
                setMeetingUrl={setMeetingUrl}
                meetingPhone={meetingPhone}
                setMeetingPhone={setMeetingPhone}
                meetingOther={meetingOther}
                setMeetingOther={setMeetingOther}
              />
            </TabsContent>
            
            <TabsContent value="customFields">
              <CustomFieldsTab
                customFields={customFields}
                setCustomFields={setCustomFields}
                newCustomFieldLabel={newCustomFieldLabel}
                setNewCustomFieldLabel={setNewCustomFieldLabel}
                editingPhoneFormat={editingPhoneFormat}
                setEditingPhoneFormat={setEditingPhoneFormat}
                editingFieldType={editingFieldType}
                setEditingFieldType={setEditingFieldType}
              />
            </TabsContent>
            
            <TabsContent value="timing">
              <TimingTab
                editing={editing}
                setEditing={setEditing}
              />
            </TabsContent>
            
            <TabsContent value="availability">
              <AvailabilityTab
                calendarAvailability={calendarAvailability}
                setCalendarAvailability={setCalendarAvailability}
                scheduleOption={scheduleOption}
                setScheduleOption={setScheduleOption}
                dateRange={dateRange}
                setDateRange={setDateRange}
                numUpcomingDays={numUpcomingDays}
                setNumUpcomingDays={setNumUpcomingDays}
                selectedGlobalAvailability={selectedGlobalAvailability}
                setSelectedGlobalAvailability={setSelectedGlobalAvailability}
              />
            </TabsContent>
            
            <TabsContent value="communication">
              <CommunicationTab
                editing={editing}
                setEditing={setEditing}
                customFields={customFields}
              />
            </TabsContent>
            
            <TabsContent value="advanced">
              <AdvancedTab
                editing={editing}
                setEditing={setEditing}
              />
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="flex justify-between mt-6 px-0 sm:px-2">
          <Button
            variant="outline"
            onClick={() => {
              window.open('/schedule/calendar/preview/', "_blank");
            }}
          >
            <Eye className="mr-2" size={16} /> Preview Calendar
          </Button>
          <div className="flex gap-2">
            <Button variant="secondary" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={onSave} type="button">
              {isNew ? "Create" : "Save"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
