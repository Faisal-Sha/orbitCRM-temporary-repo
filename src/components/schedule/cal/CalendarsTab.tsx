import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Edit, Copy, ExternalLink, Loader2, Check } from "lucide-react";
import { useCalendarSettings } from "@/hooks/useCalendarSettings";
import { usePeople } from "@/hooks/usePeople";
import { useOrganizationSettings } from "@/hooks/useOrganizationSettings";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const CalendarsTab = () => {
  const { settings, loading: settingsLoading, saving, saveSettings } = useCalendarSettings();
  const { people, loading: peopleLoading } = usePeople();
  const { formData: orgData, loading: orgLoading } = useOrganizationSettings();

  const [isEditing, setIsEditing] = useState(false);
  const [editedSettings, setEditedSettings] = useState(settings);
  const [selectedPersonId, setSelectedPersonId] = useState<string>("");
  const [videoMeetingUrl, setVideoMeetingUrl] = useState("");
  const [urlError, setUrlError] = useState("");
  const [copied, setCopied] = useState(false);
  const [currentUserName, setCurrentUserName] = useState("");

  useEffect(() => {
    const loadCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('people')
        .select('first_name, middle_name, last_name')
        .eq('user_account_id', (await supabase
          .from('app_users')
          .select('id')
          .eq('user_id', user.id)
          .single()).data?.id)
        .eq('is_deleted', false)
        .single();

      if (data) {
        const nameParts = [
          data.first_name.toLowerCase(),
          data.middle_name?.toLowerCase(),
          data.last_name.toLowerCase()
        ].filter(Boolean);
        setCurrentUserName(nameParts.join('-'));
      }
    };
    loadCurrentUser();
  }, []);

  useEffect(() => {
    setEditedSettings(settings);
    if (!settings.calendar_url && !settings.calendar_owner_id && !settings.appointment_type) {
      setIsEditing(true);
    }
  }, [settings]);

  const selectedPerson = people.find(p => p.id === selectedPersonId);

  const validateUrl = (url: string): boolean => {
    if (!url.trim()) return true;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleVideoUrlChange = (value: string) => {
    setVideoMeetingUrl(value);
    if (value && !validateUrl(value)) {
      setUrlError("Please enter a valid URL");
    } else {
      setUrlError("");
    }
  };

  const handleSave = async () => {
    const success = await saveSettings(editedSettings);
    if (success) {
      setIsEditing(false);
    }
  };

  const getBaseUrl = (): string => {
    const domain = orgData.domains?.[0];
    if (domain) {
      return `${domain.protocol}://${domain.domain}/calendars/${currentUserName}`;
    }
    return `https://example.com/calendars/${currentUserName}`;
  };

  const formatPhoneForUrl = (phone: string): string => {
    const digits = phone.replace(/\D/g, '');
    return `%2B1${digits}`;
  };

  const constructCalUrl = (): string => {
    if (!settings.calendar_url || !selectedPerson) return "";

    const params = new URLSearchParams();
    
    const fullName = `${selectedPerson.first_name} ${selectedPerson.last_name}`;
    params.append('name', fullName);
    params.append('attendee_id', selectedPerson.id);
    params.append('email', selectedPerson.email || '');
    
    if (selectedPerson.phone) {
      const phoneJson = JSON.stringify({
        value: "phone",
        optionValue: formatPhoneForUrl(selectedPerson.phone)
      });
      params.append('location', phoneJson);
    }

    if (videoMeetingUrl && validateUrl(videoMeetingUrl)) {
      params.append('meetingURL', videoMeetingUrl);
    }

    params.append('appointment_type', settings.appointment_type);
    params.append('calendar_owner_id', settings.calendar_owner_id);

    return `${settings.calendar_url}?${params.toString()}`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getBaseUrl());
    setCopied(true);
    toast({
      title: "Copied!",
      description: "Link copied to clipboard"
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenCalUrl = () => {
    const url = constructCalUrl();
    if (url) {
      window.open(url, '_blank');
    }
  };

  const handleScheduleAppointment = () => {
    const url = constructCalUrl();
    if (url) {
      window.open(url, '_blank');
    }
  };

  if (settingsLoading || peopleLoading || orgLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Step 1: Calendar Settings */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Cal.com Settings</CardTitle>
          {!isEditing && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="cal-url">Cal.com Domain URL</Label>
            <Input
              id="cal-url"
              value={editedSettings.calendar_url}
              onChange={(e) => setEditedSettings({ ...editedSettings, calendar_url: e.target.value })}
              disabled={!isEditing}
              placeholder="https://cal.com/companioned/william-v-vysniauskas"
            />
          </div>

          <div>
            <Label htmlFor="owner-id">Calendar Owner ID</Label>
            <Input
              id="owner-id"
              value={editedSettings.calendar_owner_id}
              onChange={(e) => setEditedSettings({ ...editedSettings, calendar_owner_id: e.target.value })}
              disabled={!isEditing}
              placeholder="da38e67f-fb56-44f8-a980-9fe768efbe65"
            />
          </div>

          <div>
            <Label htmlFor="appointment-type">Appointment Type</Label>
            <Input
              id="appointment-type"
              value={editedSettings.appointment_type}
              onChange={(e) => setEditedSettings({ ...editedSettings, appointment_type: e.target.value })}
              disabled={!isEditing}
              placeholder="Client"
            />
          </div>

          {isEditing && (
            <div className="flex gap-2 pt-2">
              <Button
                onClick={handleSave}
                disabled={saving || !editedSettings.calendar_url || !editedSettings.calendar_owner_id || !editedSettings.appointment_type}
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Settings'
                )}
              </Button>
              {settings.calendar_url && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditedSettings(settings);
                    setIsEditing(false);
                  }}
                >
                  Cancel
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Step 2: User Scheduling Link */}
      {settings.calendar_url && (
        <Card>
          <CardHeader>
            <CardTitle>Your Scheduling Link</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
              <button
                onClick={handleOpenCalUrl}
                className="flex-1 text-left text-primary hover:underline"
              >
                {getBaseUrl()}
              </button>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCopy}
                    >
                      {copied ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-white text-black">
                    <p>Copy</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Attendee Selection */}
      {settings.calendar_url && (
        <Card>
          <CardHeader>
            <CardTitle>Schedule Appointment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="attendee">Select Attendee</Label>
              <Select
                value={selectedPersonId}
                onValueChange={setSelectedPersonId}
              >
                <SelectTrigger id="attendee">
                  <SelectValue placeholder="Choose a person..." />
                </SelectTrigger>
                <SelectContent className="bg-background">
                  {people.map((person) => (
                    <SelectItem key={person.id} value={person.id}>
                      {person.first_name} {person.last_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedPerson && (
              <>
                <div>
                  <Label>Email</Label>
                  <Input
                    value={selectedPerson.email || 'Not available'}
                    disabled
                    className="bg-muted"
                  />
                </div>

                <div>
                  <Label>Phone Number</Label>
                  <Input
                    value={selectedPerson.phone || 'Not available'}
                    disabled
                    className="bg-muted"
                  />
                </div>

                <div>
                  <Label htmlFor="meeting-url">Video Meeting URL (Optional)</Label>
                  <Input
                    id="meeting-url"
                    value={videoMeetingUrl}
                    onChange={(e) => handleVideoUrlChange(e.target.value)}
                    placeholder="https://zoom.us/j/123456789"
                  />
                  {urlError && (
                    <p className="text-sm text-destructive mt-1">{urlError}</p>
                  )}
                </div>

                <Button
                  onClick={handleScheduleAppointment}
                  disabled={!!urlError || !selectedPerson.email}
                  className="w-full"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Schedule Appointment
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CalendarsTab;
