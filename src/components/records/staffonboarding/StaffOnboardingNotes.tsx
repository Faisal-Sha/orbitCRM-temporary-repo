
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

const StaffOnboardingNotes = () => {
  const [tags, setTags] = useState<string[]>(["onboarding", "hr-review"]);
  const [tagInput, setTagInput] = useState("");
  const [notes, setNotes] = useState<
    { id: number; date: string; content: string; tags: string[] }[]
  >([
    {
      id: 1,
      date: "2024-01-22",
      content:
        "Interview went exceptionally well. Candidate demonstrated strong clinical knowledge and excellent communication skills. Particularly impressed with their response to ethical dilemma questions. Recommend moving forward with offer.",
      tags: ["interview", "positive", "recommend"],
    },
    {
      id: 2,
      date: "2024-01-20",
      content:
        "Initial phone screening completed. Candidate has relevant experience and seems enthusiastic about the role. Scheduling in-person interview for next week. Need to verify license status before final offer.",
      tags: ["screening", "license-check", "follow-up"],
    },
    {
      id: 3,
      date: "2024-01-18",
      content:
        "Application received and reviewed. Strong educational background and relevant work experience. References look good. Moving to phone screening stage.",
      tags: ["application-review", "references"],
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
                <strong>HR Notes:</strong> These notes are for HR and hiring team use only.
                Document all interactions, decisions, and observations during the onboarding process.
              </p>
            </div>
          </div>
        </div>

        {/* New Note Section */}
        <Card>
          <CardHeader>
            <CardTitle>Add HR Note</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="hr-note">Note</Label>
              <Textarea
                id="hr-note"
                placeholder="Enter HR notes here (interactions, decisions, observations, etc.)..."
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
                  placeholder="Add a tag (e.g. interview, background-check, reference)"
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
        <h2 className="text-xl font-semibold mt-8">Previous HR Notes</h2>

        {notes.map((note) => (
          <Card key={note.id} className="mt-4">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-base">HR Note</CardTitle>
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

export default StaffOnboardingNotes;
