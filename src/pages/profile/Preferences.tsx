
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bell, Home } from "lucide-react";

const Preferences = () => {
  const notificationSettings = [
    {
      category: "Email Notifications",
      settings: [
        { label: "New appointments", description: "Get notified when new appointments are scheduled", enabled: true },
        { label: "Appointment reminders", description: "Receive reminders before appointments", enabled: true },
        { label: "System updates", description: "Important system and feature updates", enabled: false },
        { label: "Marketing emails", description: "Product updates and promotional content", enabled: false },
      ],
    },
    {
      category: "SMS Notifications",
      settings: [
        { label: "Urgent alerts", description: "Critical system alerts and emergency notifications", enabled: true },
        { label: "Appointment confirmations", description: "SMS confirmations for appointments", enabled: true },
        { label: "Daily summaries", description: "Daily summary of activities and tasks", enabled: false },
      ],
    },
    {
      category: "In-App Push Notifications",
      settings: [
        { label: "Real-time messages", description: "Instant notifications for new messages", enabled: true },
        { label: "Task reminders", description: "Reminders for pending tasks and deadlines", enabled: true },
        { label: "Activity updates", description: "Updates on team activities and progress", enabled: false },
      ],
    },
  ];

  const defaultViewOptions = [
    { value: "dashboard", label: "Dashboard" },
    { value: "appointments", label: "Appointments" },
    { value: "email", label: "Email" },
    { value: "phone", label: "Phone" },
    { value: "chat", label: "Chat" },
    { value: "goals", label: "Goals" },
    { value: "tasks", label: "Tasks" },
  ];

  return (
    <div className="space-y-6">
      {/* Notifications Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {notificationSettings.map((category, categoryIndex) => (
            <div key={categoryIndex} className="space-y-4">
              <h4 className="text-sm font-medium text-muted-foreground border-b pb-2">
                {category.category}
              </h4>
              <div className="space-y-4">
                {category.settings.map((setting, settingIndex) => (
                  <div key={settingIndex} className="flex items-center justify-between">
                    <div className="space-y-1 flex-1">
                      <Label className="text-sm font-medium">{setting.label}</Label>
                      <p className="text-xs text-muted-foreground">{setting.description}</p>
                    </div>
                    <Switch defaultChecked={setting.enabled} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Default View Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="h-5 w-5" />
            Default View
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="defaultView">Preferred Landing Page</Label>
            <p className="text-sm text-muted-foreground">
              Choose which page you'd like to see first when you log in
            </p>
            <Select defaultValue="dashboard">
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select default view" />
              </SelectTrigger>
              <SelectContent>
                {defaultViewOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Preferences;
