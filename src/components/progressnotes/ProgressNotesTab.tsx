
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Plus, Calendar } from "lucide-react";
import ProgressNoteCard from "./ProgressNoteCard";
import ProgressNoteDetail from "./ProgressNoteDetail";
import ProgressNoteForm from "./ProgressNoteForm";

// Dummy data for 7 progress notes
const dummyNotes = [
  {
    id: "1",
    date: "2024-06-04",
    time: "2:00 PM",
    duration: "50 min",
    type: "Individual Therapy",
    author: "Dr. Sarah Johnson",
    status: "Signed",
    providerRating: 4,
    clientRating: 5,
    preview: "Client showed significant progress in anxiety management techniques...",
    growthStage: "developing" as const,
    program: "Wellbeing",
    content: {
      sessionSummary: "Client demonstrated improved coping strategies and was more engaged in discussion about anxiety triggers.",
      goalsAlignment: "Made progress on goals 1 and 3, need to focus more on goal 2 in next session.",
      treatmentPlan: "Following CBT approach, client responding well to cognitive restructuring techniques."
    }
  },
  {
    id: "2",
    date: "2024-05-28",
    time: "10:30 AM",
    duration: "45 min",
    type: "Mentoring Session",
    author: "Michael Chen",
    status: "Pending Review",
    providerRating: 3,
    clientRating: 4,
    preview: "Discussed career goals and job search strategies, client seems motivated...",
    growthStage: "established" as const,
    program: "Achievement",
    content: {
      sessionSummary: "Focused on career development and networking strategies.",
      goalsAlignment: "Strong alignment with professional development goals.",
      treatmentPlan: "Continue with strength-based approach and skill building."
    }
  },
  {
    id: "3",
    date: "2024-05-21",
    time: "3:15 PM",
    duration: "60 min",
    type: "Family Session",
    author: "Dr. Sarah Johnson",
    status: "Draft",
    providerRating: 5,
    clientRating: 3,
    preview: "Family dynamics discussion, some tension noted but progress made...",
    growthStage: "foundation" as const,
    program: "Stability",
    content: {
      sessionSummary: "Family session focused on communication patterns and conflict resolution.",
      goalsAlignment: "Addressing family relationship goals, mixed progress.",
      treatmentPlan: "Family therapy approach with emphasis on communication skills."
    }
  },
  {
    id: "4",
    date: "2024-05-14",
    time: "1:00 PM",
    duration: "50 min",
    type: "Individual Therapy",
    author: "Dr. Emily Rodriguez",
    status: "Signed",
    providerRating: 4,
    clientRating: 4,
    preview: "Breakthrough session discussing childhood trauma, client very receptive...",
    growthStage: "developing" as const,
    program: "Wellbeing",
    content: {
      sessionSummary: "Significant breakthrough in trauma processing, client showed courage in sharing.",
      goalsAlignment: "Major progress on emotional processing goals.",
      treatmentPlan: "Trauma-informed care approach proving effective."
    }
  },
  {
    id: "5",
    date: "2024-05-07",
    time: "11:00 AM",
    duration: "45 min",
    type: "Group Therapy",
    author: "Dr. Sarah Johnson",
    status: "Signed",
    providerRating: 3,
    clientRating: 4,
    preview: "Participated actively in group discussion about coping mechanisms...",
    growthStage: "developing" as const,
    program: "Wellbeing",
    content: {
      sessionSummary: "Good participation in group setting, shared experiences with peers.",
      goalsAlignment: "Social interaction goals showing positive progress.",
      treatmentPlan: "Group therapy complementing individual sessions well."
    }
  },
  {
    id: "6",
    date: "2024-04-30",
    time: "4:00 PM",
    duration: "50 min",
    type: "Consultation",
    author: "Michael Chen",
    status: "Signed",
    providerRating: 4,
    clientRating: 5,
    preview: "Assessment consultation for new treatment approach, very promising...",
    growthStage: "foundation" as const,
    program: "Stability",
    content: {
      sessionSummary: "Comprehensive assessment for new intervention strategies.",
      goalsAlignment: "Realigning goals based on assessment findings.",
      treatmentPlan: "Recommended multimodal approach for better outcomes."
    }
  },
  {
    id: "7",
    date: "2024-04-23",
    time: "9:30 AM",
    duration: "60 min",
    type: "Individual Therapy",
    author: "Dr. Emily Rodriguez",
    status: "Signed",
    providerRating: 5,
    clientRating: 4,
    preview: "Initial session establishing rapport and treatment goals, good engagement...",
    growthStage: "foundation" as const,
    program: "Wellbeing",
    content: {
      sessionSummary: "First session focused on building therapeutic alliance and goal setting.",
      goalsAlignment: "Established initial treatment goals collaboratively.",
      treatmentPlan: "Beginning with CBT foundation and rapport building."
    }
  }
];

const ProgressNotesTab = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDateRange, setSelectedDateRange] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedAuthor, setSelectedAuthor] = useState("");
  const [expandedNote, setExpandedNote] = useState<string | null>(null);
  const [showNewNoteForm, setShowNewNoteForm] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Filter notes based on search and filters
  const filteredNotes = dummyNotes.filter(note => {
    const matchesSearch = searchTerm === "" || 
      note.preview.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = selectedType === "" || note.type === selectedType;
    const matchesAuthor = selectedAuthor === "" || note.author === selectedAuthor;
    
    return matchesSearch && matchesType && matchesAuthor;
  });

  const handleExpandNote = (noteId: string) => {
    setExpandedNote(expandedNote === noteId ? null : noteId);
  };

  const handleNewNote = () => {
    setShowNewNoteForm(true);
    setExpandedNote(null);
  };

  const handleCloseNewNote = () => {
    setShowNewNoteForm(false);
  };

  if (showNewNoteForm) {
    return <ProgressNoteForm onClose={handleCloseNewNote} />;
  }

  if (expandedNote) {
    const note = dummyNotes.find(n => n.id === expandedNote);
    if (note) {
      return (
        <ProgressNoteDetail 
          note={note} 
          onClose={() => setExpandedNote(null)} 
        />
      );
    }
  }

  return (
    <div className="app-card">
      <div className="space-y-6">
        
        {/* Header with New Note Button */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Progress Notes</h2>
            <p className="text-muted-foreground">Chronological record of client sessions and progress</p>
          </div>
          <Button onClick={handleNewNote} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Progress Note
          </Button>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search notes by content, author, or type..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2"
                >
                  <Filter className="h-4 w-4" />
                  Filters
                </Button>
              </div>

              {/* Filters */}
              {showFilters && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-4 border-t">
                  <div>
                    <label className="block text-sm font-medium mb-1">Date Range</label>
                    <Select value={selectedDateRange} onValueChange={setSelectedDateRange}>
                      <SelectTrigger>
                        <SelectValue placeholder="All dates" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All dates</SelectItem>
                        <SelectItem value="last-week">Last 7 days</SelectItem>
                        <SelectItem value="last-month">Last 30 days</SelectItem>
                        <SelectItem value="last-quarter">Last 3 months</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Session Type</label>
                    <Select value={selectedType} onValueChange={setSelectedType}>
                      <SelectTrigger>
                        <SelectValue placeholder="All types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All types</SelectItem>
                        <SelectItem value="Individual Therapy">Individual Therapy</SelectItem>
                        <SelectItem value="Group Therapy">Group Therapy</SelectItem>
                        <SelectItem value="Family Session">Family Session</SelectItem>
                        <SelectItem value="Mentoring Session">Mentoring Session</SelectItem>
                        <SelectItem value="Consultation">Consultation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Author</label>
                    <Select value={selectedAuthor} onValueChange={setSelectedAuthor}>
                      <SelectTrigger>
                        <SelectValue placeholder="All authors" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All authors</SelectItem>
                        <SelectItem value="Dr. Sarah Johnson">Dr. Sarah Johnson</SelectItem>
                        <SelectItem value="Dr. Emily Rodriguez">Dr. Emily Rodriguez</SelectItem>
                        <SelectItem value="Michael Chen">Michael Chen</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Results Summary */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {filteredNotes.length} of {dummyNotes.length} progress notes
          </p>
          {(searchTerm || selectedType || selectedAuthor) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchTerm("");
                setSelectedType("");
                setSelectedAuthor("");
                setSelectedDateRange("");
              }}
            >
              Clear filters
            </Button>
          )}
        </div>

        {/* Progress Notes List */}
        <div className="space-y-4">
          {filteredNotes.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No notes found</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchTerm || selectedType || selectedAuthor 
                      ? "No notes match your current filters. Try adjusting your search criteria."
                      : "No progress notes available for this client yet."
                    }
                  </p>
                  <Button onClick={handleNewNote}>Create First Note</Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            filteredNotes.map((note) => (
              <ProgressNoteCard
                key={note.id}
                note={note}
                onExpand={() => handleExpandNote(note.id)}
                isExpanded={expandedNote === note.id}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgressNotesTab;
