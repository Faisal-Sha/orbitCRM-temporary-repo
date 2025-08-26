
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Flag } from "lucide-react";

const SupervisionNotesTab = () => {
  // Dummy data for supervision notes
  const supervisionNotes = [
    {
      id: 1,
      supervisorName: "Dr. Emily Wilson",
      date: "2024-04-10",
      comments:
        "Mentor is making good progress with this client. Appropriate use of CBT techniques for anxiety management. Continue to focus on sleep hygiene interventions as this remains a challenge area.",
      flags: ["Sleep disturbance", "Financial stress"],
      guidance:
        "Consider adding mindfulness exercises specifically for bedtime routine. Review progress on job applications in next session.",
    },
    {
      id: 2,
      supervisorName: "Dr. Emily Wilson",
      date: "2024-03-25",
      comments:
        "Initial treatment plan is well-structured. Good identification of anxiety triggers and appropriate goal-setting. Client appears motivated for treatment.",
      flags: ["Recent job loss", "Panic symptoms"],
      guidance:
        "Ensure regular assessment of suicidal ideation given recent stressors. Consider adding financial resource referrals to treatment plan.",
    },
  ];

  return (
    <div className="app-card">
      <div className="space-y-6">
        {/* Add New Supervision Note */}
        <Card>
          <CardHeader>
            <CardTitle>Add Supervision Note</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="supervisor-name">Supervisor Name</Label>
                <Input id="supervisor-name" placeholder="Enter supervisor name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="supervision-date">Date of Supervision</Label>
                <Input id="supervision-date" type="date" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="supervision-comments">Supervisor Comments</Label>
              <Textarea
                id="supervision-comments"
                placeholder="Enter supervision comments and observations"
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label>Flags/Concerns</Label>
              <div className="flex flex-wrap gap-2">
                <div className="flex items-center space-x-2 bg-red-50 border border-red-200 rounded-md px-3 py-1">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <span className="text-sm">Suicidal ideation</span>
                  <button className="text-red-500 font-bold ml-2">×</button>
                </div>
                <div className="flex items-center space-x-2 bg-amber-50 border border-amber-200 rounded-md px-3 py-1">
                  <Flag className="h-4 w-4 text-amber-500" />
                  <span className="text-sm">Sleep disturbance</span>
                  <button className="text-amber-500 font-bold ml-2">×</button>
                </div>
                <Button variant="outline" size="sm" className="h-8">
                  + Add Flag
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mentor-guidance">Mentor Guidance/Feedback</Label>
              <Textarea
                id="mentor-guidance"
                placeholder="Enter guidance or feedback for the mentor"
                className="min-h-[100px]"
              />
            </div>

            <div className="flex justify-end">
              <Button>Save Supervision Note</Button>
            </div>
          </CardContent>
        </Card>

        {/* Previous Supervision Notes */}
        <h2 className="text-xl font-semibold mt-8">Previous Supervision Notes</h2>

        {supervisionNotes.map((note) => (
          <Card key={note.id} className="mt-4">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-base">{note.supervisorName}</CardTitle>
                <span className="text-sm text-muted-foreground">{note.date}</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-0">
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Comments</Label>
                <p className="text-sm">{note.comments}</p>
              </div>

              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">
                  Flags/Concerns
                </Label>
                <div className="flex flex-wrap gap-2">
                  {note.flags.map((flag, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-2 bg-amber-50 border border-amber-200 rounded-md px-3 py-1"
                    >
                      <Flag className="h-4 w-4 text-amber-500" />
                      <span className="text-sm">{flag}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Guidance</Label>
                <p className="text-sm">{note.guidance}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SupervisionNotesTab;
