
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

const PersonalNotesTab = () => {
  const [tags, setTags] = useState<string[]>(["crisis", "reschedule"]);
  const [tagInput, setTagInput] = useState("");
  const [notes, setNotes] = useState<
    { id: number; date: string; content: string; tags: string[] }[]
  >([
    {
      id: 1,
      date: "2024-04-15",
      content:
        "Client mentioned financial concerns multiple times. Need to follow up on job search progress in next session. Consider providing additional resources for local job fairs.",
      tags: ["job-search", "resources", "follow-up"],
    },
    {
      id: 2,
      date: "2024-04-08",
      content:
        "Client arrived 15 minutes late. Seemed distracted during session. Mentioned conflict with spouse - may need to explore this further if it continues to impact anxiety symptoms.",
      tags: ["late", "relationship-issues"],
    },
    {
      id: 3,
      date: "2024-04-01",
      content:
        "Initial session went well. Client is highly motivated but has unrealistic expectations about timeline for finding new employment. Need to manage expectations while maintaining hope.",
      tags: ["first-session", "expectations"],
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
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-yellow-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <strong>Private Notes:</strong> These notes are for your eyes only
                and will not be included in the client's official record.
              </p>
            </div>
          </div>
        </div>

        {/* New Note Section */}
        <Card>
          <CardHeader>
            <CardTitle>Add Personal Note</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="personal-note">Note</Label>
              <Textarea
                id="personal-note"
                placeholder="Enter your private notes here..."
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
                  placeholder="Add a tag (e.g. follow-up, crisis)"
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
        <h2 className="text-xl font-semibold mt-8">Previous Personal Notes</h2>

        {notes.map((note) => (
          <Card key={note.id} className="mt-4">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-base">Personal Note</CardTitle>
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

export default PersonalNotesTab;
