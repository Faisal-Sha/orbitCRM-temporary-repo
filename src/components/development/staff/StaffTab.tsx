
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { User } from "lucide-react";
import GrowthStatusIndicator from "@/components/Growthstatus";
import UserProfilePanel from "@/components/userprofile/UserProfilePanel";

const StaffTab = () => {
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [growthLevelFilter, setGrowthLevelFilter] = useState("All");
  const [supervisorFilter, setSupervisorFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  // Dummy staff data with properly typed growth levels
  const staff = [
    {
      id: 1,
      dateJoined: "2024-01-15",
      name: "Amanda Lee",
      surname: "Lee",
      supervisor: "Dr. Michael Thompson",
      onboardingProgress: 85,
      trainingProgress: 65,
      growthLevel: "established" as const,
      interestPercentage: 92,
      email: "amanda.lee@email.com",
      phone: "(555) 123-4567",
      interest: "Clinical Psychology"
    },
    {
      id: 2,
      dateJoined: "2024-02-03",
      name: "Carlos Diaz",
      surname: "Diaz",
      supervisor: "Dr. Sarah Martinez",
      onboardingProgress: 100,
      trainingProgress: 45,
      growthLevel: "developing" as const,
      interestPercentage: 88,
      email: "carlos.diaz@email.com",
      phone: "(555) 234-5678",
      interest: "Family Therapy"
    },
    {
      id: 3,
      dateJoined: "2024-02-20",
      name: "Sandy Brooks",
      surname: "Brooks",
      supervisor: "Dr. Emily Chen",
      onboardingProgress: 60,
      trainingProgress: 30,
      growthLevel: "foundation" as const,
      interestPercentage: 95,
      email: "sandy.brooks@email.com",
      phone: "(555) 345-6789",
      interest: "Behavioral Therapy"
    },
    {
      id: 4,
      dateJoined: "2024-01-28",
      name: "Priya Shah",
      surname: "Shah",
      supervisor: "Dr. Michael Thompson",
      onboardingProgress: 90,
      trainingProgress: 80,
      growthLevel: "established" as const,
      interestPercentage: 90,
      email: "priya.shah@email.com",
      phone: "(555) 456-7890",
      interest: "Cognitive Therapy"
    },
    {
      id: 5,
      dateJoined: "2024-03-05",
      name: "Tom Garner",
      surname: "Garner",
      supervisor: "Dr. Sarah Martinez",
      onboardingProgress: 45,
      trainingProgress: 20,
      growthLevel: "developing" as const,
      interestPercentage: 87,
      email: "tom.garner@email.com",
      phone: "(555) 567-8901",
      interest: "Group Therapy"
    },
    {
      id: 6,
      dateJoined: "2024-01-10",
      name: "Eva Tran",
      surname: "Tran",
      supervisor: "Dr. Emily Chen",
      onboardingProgress: 100,
      trainingProgress: 95,
      growthLevel: "established" as const,
      interestPercentage: 93,
      email: "eva.tran@email.com",
      phone: "(555) 678-9012",
      interest: "Trauma Therapy"
    }
  ];

  const supervisors = ["All", "Dr. Michael Thompson", "Dr. Sarah Martinez", "Dr. Emily Chen"];
  const growthLevels = ["All", "foundation", "developing", "established"];

  const filteredStaff = staff.filter(member => {
    const matchesGrowthLevel = growthLevelFilter === "All" || member.growthLevel === growthLevelFilter;
    const matchesSupervisor = supervisorFilter === "All" || member.supervisor === supervisorFilter;
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.surname.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesGrowthLevel && matchesSupervisor && matchesSearch;
  });

  const openProfile = (member) => {
    setSelectedStaff({
      name: `${member.name} ${member.surname}`,
      email: member.email,
      phone: member.phone,
      interest: member.interest,
      inquiryDate: member.dateJoined
    });
    setIsProfileOpen(true);
  };

  return (
    <div className="app-card space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle>Staff Development Dashboard</CardTitle>
          <p className="text-sm text-muted-foreground">
            Monitor and manage staff progress across onboarding and training programs
          </p>
        </CardHeader>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Growth Level</label>
              <select
                value={growthLevelFilter}
                onChange={(e) => setGrowthLevelFilter(e.target.value)}
                className="w-full p-2 border border-input rounded-md bg-background text-sm"
              >
                {growthLevels.map(level => (
                  <option key={level} value={level}>{level === "All" ? "All Levels" : level.charAt(0).toUpperCase() + level.slice(1)}</option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Supervisor</label>
              <select
                value={supervisorFilter}
                onChange={(e) => setSupervisorFilter(e.target.value)}
                className="w-full p-2 border border-input rounded-md bg-background text-sm"
              >
                {supervisors.map(supervisor => (
                  <option key={supervisor} value={supervisor}>{supervisor === "All" ? "All Supervisors" : supervisor}</option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Search Staff</label>
              <input
                type="text"
                placeholder="Search by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 border border-input rounded-md bg-background text-sm"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredStaff.length} of {staff.length} staff members
      </div>

      {/* Staff Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date Joined</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Supervisor</TableHead>
                <TableHead>Onboarding Progress</TableHead>
                <TableHead>Training Progress</TableHead>
                <TableHead>Growth Level</TableHead>
                <TableHead>Interest %</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStaff.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>{member.dateJoined}</TableCell>
                  <TableCell className="font-medium">{member.name} {member.surname}</TableCell>
                  <TableCell>{member.supervisor}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <Progress value={member.onboardingProgress} className="h-2" />
                      <span className="text-xs text-muted-foreground">{member.onboardingProgress}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <Progress value={member.trainingProgress} className="h-2" />
                      <span className="text-xs text-muted-foreground">{member.trainingProgress}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <GrowthStatusIndicator growthStage={member.growthLevel} showText={false} />
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{member.interestPercentage}%</Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openProfile(member)}
                      className="h-8 w-8 p-0"
                    >
                      <User className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* User Profile Panel */}
      <UserProfilePanel
        open={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        user={selectedStaff}
      />
    </div>
  );
};

export default StaffTab;
