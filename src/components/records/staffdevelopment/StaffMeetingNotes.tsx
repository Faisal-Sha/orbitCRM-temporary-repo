
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Plus, Calendar } from "lucide-react";
import StaffMeetingNoteCard from "./StaffMeetingNoteCard";
import StaffMeetingNoteDetail from "./StaffMeetingNoteDetail";
import StaffMeetingNoteForm from "./StaffMeetingNoteForm";

// Dummy data for 7 staff meeting notes
const dummyNotes = [
  {
    id: "1",
    date: "2024-06-04",
    time: "2:00 PM",
    duration: "50 min",
    type: "Performance Review",
    author: "Dr. Sarah Johnson",
    status: "Signed",
    managerRating: 4,
    staffRating: 5,
    preview: "Staff member showed significant improvement in client engagement and documentation quality...",
    growthStage: "developing" as const,
    program: "Clinician",
    content: {
      sessionSummary: "Staff member demonstrated improved performance in client interactions and case documentation.",
      goalsAlignment: "Made progress on professional development goals, particularly in clinical assessment skills.",
      developmentPlan: "Following structured mentoring approach, staff responding well to feedback and guidance."
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
    managerRating: 3,
    staffRating: 4,
    preview: "Discussed career development and skill enhancement opportunities, staff shows motivation...",
    growthStage: "established" as const,
    program: "Provider",
    content: {
      sessionSummary: "Focused on career advancement and professional skill development.",
      goalsAlignment: "Strong alignment with professional growth objectives.",
      developmentPlan: "Continue with competency-based development and skill building."
    }
  },
  {
    id: "3",
    date: "2024-05-21",
    time: "3:15 PM",
    duration: "60 min",
    type: "1-on-1 Check-in",
    author: "Dr. Sarah Johnson",
    status: "Draft",
    managerRating: 5,
    staffRating: 3,
    preview: "Regular check-in discussion, addressed workload concerns and training needs...",
    growthStage: "foundation" as const,
    program: "Clinician",
    content: {
      sessionSummary: "Weekly check-in focused on workload management and training requirements.",
      goalsAlignment: "Addressing foundational competencies, mixed progress noted.",
      developmentPlan: "Structured support approach with emphasis on skill building."
    }
  },
  {
    id: "4",
    date: "2024-05-14",
    time: "1:00 PM",
    duration: "50 min",
    type: "Team Meeting",
    author: "Dr. Emily Rodriguez",
    status: "Signed",
    managerRating: 4,
    staffRating: 4,
    preview: "Team collaboration session discussing case management and peer support...",
    growthStage: "developing" as const,
    program: "Provider",
    content: {
      sessionSummary: "Team session focused on collaborative case management and peer learning.",
      goalsAlignment: "Good progress on teamwork and communication goals.",
      developmentPlan: "Group-based learning approach showing positive results."
    }
  },
  {
    id: "5",
    date: "2024-05-07",
    time: "11:00 AM",
    duration: "45 min",
    type: "Skills Assessment",
    author: "Dr. Sarah Johnson",
    status: "Signed",
    managerRating: 3,
    staffRating: 4,
    preview: "Comprehensive skills evaluation and feedback session, identified growth areas...",
    growthStage: "developing" as const,
    program: "Clinician",
    content: {
      sessionSummary: "Thorough assessment of clinical and administrative competencies.",
      goalsAlignment: "Skills development goals showing steady progress.",
      developmentPlan: "Targeted skill enhancement plan with specific milestones."
    }
  },
  {
    id: "6",
    date: "2024-04-30",
    time: "4:00 PM",
    duration: "50 min",
    type: "Performance Review",
    author: "Michael Chen",
    status: "Signed",
    managerRating: 4,
    staffRating: 5,
    preview: "Quarterly performance evaluation with focus on achievements and development areas...",
    growthStage: "foundation" as const,
    program: "Provider",
    content: {
      sessionSummary: "Quarterly review assessing performance metrics and development progress.",
      goalsAlignment: "Performance goals being met with room for improvement in specific areas.",
      developmentPlan: "Structured performance improvement plan with clear objectives."
    }
  },
  {
    id: "7",
    date: "2024-04-23",
    time: "9:30 AM",
    duration: "60 min",
    type: "Mentoring Session",
    author: "Dr. Emily Rodriguez",
    status: "Signed",
    managerRating: 5,
    staffRating: 4,
    preview: "Initial mentoring session establishing development goals and support structure...",
    growthStage: "foundation" as const,
    program: "Clinician",
    content: {
      sessionSummary: "First mentoring session focused on goal setting and relationship building.",
      goalsAlignment: "Established initial development goals collaboratively.",
      developmentPlan: "Beginning with foundational competencies and mentor support."
    }
  }
];

const StaffMeetingNotes = () => {
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
    return <StaffMeetingNoteForm onClose={handleCloseNewNote} />;
  }

  if (expandedNote) {
    const note = dummyNotes.find(n => n.id === expandedNote);
    if (note) {
      return (
        <StaffMeetingNoteDetail 
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
            <h2 className="text-2xl font-semibold">Staff Development Meeting Notes</h2>
            <p className="text-muted-foreground">Chronological record of staff development sessions and progress</p>
          </div>
          <Button onClick={handleNewNote} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Development Note
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
                        <SelectItem value="Performance Review">Performance Review</SelectItem>
                        <SelectItem value="Mentoring Session">Mentoring Session</SelectItem>
                        <SelectItem value="1-on-1 Check-in">1-on-1 Check-in</SelectItem>
                        <SelectItem value="Team Meeting">Team Meeting</SelectItem>
                        <SelectItem value="Skills Assessment">Skills Assessment</SelectItem>
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
            Showing {filteredNotes.length} of {dummyNotes.length} development notes
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

        {/* Meeting Notes List */}
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
                      : "No development notes available for this staff member yet."
                    }
                  </p>
                  <Button onClick={handleNewNote}>Create First Note</Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            filteredNotes.map((note) => (
              <StaffMeetingNoteCard
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

export default StaffMeetingNotes;
