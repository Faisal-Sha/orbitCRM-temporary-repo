
import { useState } from "react";
import PageContainer from "@/components/PageContainer";
import TabsComponent from "@/components/TabsComponent";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import GrowthStatusIndicator from "@/components/Growthstatus";

const ClientRecords = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Dummy data for assessments with mixed statuses
  const assessmentsData = Array.from({ length: 15 }, (_, i) => ({
    id: i + 1,
    clientName: `Client ${i + 1}`,
    date: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toLocaleDateString(),
    clinician: `Dr. ${['Smith', 'Johnson', 'Williams', 'Brown', 'Jones'][Math.floor(Math.random() * 5)]}`,
    status: i % 3 === 0 ? "Pending" : "Completed"
  }));

  // Dummy data for progress notes with mixed statuses
  const progressNotesData = Array.from({ length: 15 }, (_, i) => ({
    id: i + 1,
    clientName: `Client ${i + 16}`,
    provider: `Provider ${i + 1}`,
    growth: ['foundation', 'developing', 'established'][Math.floor(Math.random() * 3)] as 'foundation' | 'developing' | 'established',
    lastUpdated: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toLocaleDateString(),
    status: i % 4 === 0 ? "Pending" : "Completed"
  }));

  const handleViewAssessment = (clientName: string) => {
    window.open(`/records/assessment-form?client=${encodeURIComponent(clientName)}`, '_blank');
  };

  const handleViewProgressNote = (clientName: string) => {
    window.open(`/records/progress-notes-form?client=${encodeURIComponent(clientName)}`, '_blank');
  };

  const AssessmentsTab = () => (
    <div className="app-card">
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Search records..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <Button>Add New</Button>
      </div>
      
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client Name</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Clinician</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assessmentsData.map((assessment) => (
              <TableRow key={assessment.id}>
                <TableCell className="font-medium">{assessment.clientName}</TableCell>
                <TableCell>{assessment.date}</TableCell>
                <TableCell>{assessment.clinician}</TableCell>
                <TableCell>
                  <Badge 
                    variant="secondary" 
                    className={assessment.status === "Completed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}
                  >
                    {assessment.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleViewAssessment(assessment.clientName)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );

  const ProgressNotesTab = () => (
    <div className="app-card">
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Search records..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <Button>Add New</Button>
      </div>
      
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client Name</TableHead>
              <TableHead>Provider</TableHead>
              <TableHead>Growth</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {progressNotesData.map((note) => (
              <TableRow key={note.id}>
                <TableCell className="font-medium">{note.clientName}</TableCell>
                <TableCell>{note.provider}</TableCell>
                <TableCell>
                  <GrowthStatusIndicator 
                    growthStage={note.growth} 
                    showText={false}
                  />
                </TableCell>
                <TableCell>{note.lastUpdated}</TableCell>
                <TableCell>
                  <Badge 
                    variant="secondary" 
                    className={note.status === "Completed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}
                  >
                    {note.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleViewProgressNote(note.clientName)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );

  const tabs = [
    { value: "assessments", label: "Assessments", content: <AssessmentsTab /> },
    { value: "progress-notes", label: "Progress Notes", content: <ProgressNotesTab /> },
  ];

  return (
    <PageContainer
      title="Client Records"
      description="Manage client assessments and progress notes"
    >
      <TabsComponent tabs={tabs} defaultTab="assessments" />
    </PageContainer>
  );
};

export default ClientRecords;
