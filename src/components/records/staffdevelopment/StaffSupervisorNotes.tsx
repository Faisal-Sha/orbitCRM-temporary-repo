
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

const StaffSupervisorNotes = () => {
  const [tags, setTags] = useState<string[]>(["supervision", "development"]);
  const [tagInput, setTagInput] = useState("");
  const [notes, setNotes] = useState<
    { id: number; date: string; content: string; tags: string[] }[]
  >([
    {
      id: 1,
      date: "2024-01-22",
      content:
        "Regular supervision session focused on clinical skill development. Staff member demonstrated improved confidence in handling complex cases. We discussed strategies for managing difficult client interactions and reviewed documentation standards. Progress noted in therapeutic rapport building.",
      tags: ["supervision", "clinical-skills", "progress"],
    },
    {
      id: 2,
      date: "2024-01-15",
      content:
        "Monthly performance review completed. Staff member has shown significant improvement in time management and case documentation. Areas for continued development include specialized training in trauma-informed care and group therapy facilitation. Recommended enrollment in advanced training program.",
      tags: ["performance-review", "development", "training"],
    },
    {
      id: 3,
      date: "2024-01-08",
      content:
        "Discussed career development goals and professional growth opportunities. Staff member expressed interest in pursuing specialization in adolescent therapy. Outlined steps for additional training and certification requirements. Scheduled follow-up meeting to track progress on development plan.",
      tags: ["career-development", "specialization", "goals"],
    },
  ]);

  const handleAddTag = () => {
    if (tagInput && !tags.includes(tagInput)) {
      setTags([...tags, tagInput]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <div className="app-card">
      <div className="space-y-6">
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-blue-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                <strong>Supervisor Notes:</strong> These notes are for supervisory use only.
                Document supervision sessions, performance observations, and development planning discussions.
              </p>
            </div>
          </div>
        </div>

        {/* New Note Section */}
        <Card>
          <CardHeader>
            <CardTitle>Add Supervisor Note</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="supervisor-note">Note</Label>
              <Textarea
                id="supervisor-note"
                placeholder="Enter supervisor notes here (supervision sessions, performance observations, development discussions, etc.)..."
                className="min-h-[150px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((tag) => (
                  <div
                    key={tag}
                    className="flex items-center bg-primary/10 text-primary rounded-full px-3 py-1 text-sm"
                  >
                    #{tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-2 text-primary hover:text-primary/80"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  id="tag-input"
                  placeholder="Add a tag (e.g. supervision, performance, development)"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <Button type="button" onClick={handleAddTag} variant="outline">
                  Add
                </Button>
              </div>
            </div>

            <div className="flex justify-end">
              <Button>Save Note</Button>
            </div>
          </CardContent>
        </Card>

        {/* Previous Notes */}
        <h2 className="text-xl font-semibold mt-8">Previous Supervisor Notes</h2>

        {notes.map((note) => (
          <Card key={note.id} className="mt-4">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-base">Supervisor Note</CardTitle>
                <span className="text-sm text-muted-foreground">{note.date}</span>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="mb-4">{note.content}</p>
              <div className="flex flex-wrap gap-2">
                {note.tags.map((tag, index) => (
                  <div
                    key={index}
                    className="bg-primary/10 text-primary rounded-full px-3 py-1 text-sm"
                  >
                    #{tag}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default StaffSupervisorNotes;
