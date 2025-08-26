import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { User } from "lucide-react";
import GrowthStatusIndicator from "@/components/Growthstatus";
import UserProfilePanel from "@/components/userprofile/UserProfilePanel";

const ClientsTab = () => {
  const [selectedClient, setSelectedClient] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [growthLevelFilter, setGrowthLevelFilter] = useState("All");
  const [providerFilter, setProviderFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  // Dummy client data with properly typed growth levels
  const clients = [
    {
      id: 1,
      dateJoined: "2024-01-15",
      name: "Sarah Johnson",
      surname: "Johnson",
      provider: "Dr. Emily Chen",
      onboardingProgress: 85,
      trainingProgress: 65,
      growthLevel: "developing" as const,
      interestPercentage: 92,
      email: "sarah.johnson@email.com",
      phone: "(555) 123-4567",
      interest: "Anxiety Management"
    },
    {
      id: 2,
      dateJoined: "2024-02-03",
      name: "Michael Rodriguez",
      surname: "Rodriguez",
      provider: "Dr. James Wilson",
      onboardingProgress: 100,
      trainingProgress: 45,
      growthLevel: "established" as const,
      interestPercentage: 88,
      email: "michael.rodriguez@email.com",
      phone: "(555) 234-5678",
      interest: "Stress Management"
    },
    {
      id: 3,
      dateJoined: "2024-02-20",
      name: "Emma Thompson",
      surname: "Thompson",
      provider: "Dr. Sarah Martinez",
      onboardingProgress: 60,
      trainingProgress: 30,
      growthLevel: "foundation" as const,
      interestPercentage: 95,
      email: "emma.thompson@email.com",
      phone: "(555) 345-6789",
      interest: "Depression Support"
    },
    {
      id: 4,
      dateJoined: "2024-01-28",
      name: "David Kim",
      surname: "Kim",
      provider: "Dr. Emily Chen",
      onboardingProgress: 90,
      trainingProgress: 80,
      growthLevel: "developing" as const,
      interestPercentage: 90,
      email: "david.kim@email.com",
      phone: "(555) 456-7890",
      interest: "Relationship Counseling"
    },
    {
      id: 5,
      dateJoined: "2024-03-05",
      name: "Lisa Anderson",
      surname: "Anderson",
      provider: "Dr. James Wilson",
      onboardingProgress: 45,
      trainingProgress: 20,
      growthLevel: "foundation" as const,
      interestPercentage: 87,
      email: "lisa.anderson@email.com",
      phone: "(555) 567-8901",
      interest: "Trauma Recovery"
    },
    {
      id: 6,
      dateJoined: "2024-01-10",
      name: "Robert Davis",
      surname: "Davis",
      provider: "Dr. Sarah Martinez",
      onboardingProgress: 100,
      trainingProgress: 95,
      growthLevel: "established" as const,
      interestPercentage: 93,
      email: "robert.davis@email.com",
      phone: "(555) 678-9012",
      interest: "Anger Management"
    }
  ];

  const providers = ["All", "Dr. Emily Chen", "Dr. James Wilson", "Dr. Sarah Martinez"];
  const growthLevels = ["All", "foundation", "developing", "established"];

  const filteredClients = clients.filter(client => {
    const matchesGrowthLevel = growthLevelFilter === "All" || client.growthLevel === growthLevelFilter;
    const matchesProvider = providerFilter === "All" || client.provider === providerFilter;
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.surname.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesGrowthLevel && matchesProvider && matchesSearch;
  });

  const openProfile = (client) => {
    setSelectedClient({
      name: `${client.name} ${client.surname}`,
      email: client.email,
      phone: client.phone,
      interest: client.interest,
      inquiryDate: client.dateJoined
    });
    setIsProfileOpen(true);
  };

  return (
    <div className="app-card space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle>Client Development Dashboard</CardTitle>
          <p className="text-sm text-muted-foreground">
            Monitor and manage client progress across onboarding and training programs
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
              <label className="text-sm font-medium">Provider</label>
              <select
                value={providerFilter}
                onChange={(e) => setProviderFilter(e.target.value)}
                className="w-full p-2 border border-input rounded-md bg-background text-sm"
              >
                {providers.map(provider => (
                  <option key={provider} value={provider}>{provider === "All" ? "All Providers" : provider}</option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Search Client</label>
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
        Showing {filteredClients.length} of {clients.length} clients
      </div>

      {/* Client Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date Joined</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Onboarding Progress</TableHead>
                <TableHead>Training Progress</TableHead>
                <TableHead>Growth Level</TableHead>
                <TableHead>Interest %</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell>{client.dateJoined}</TableCell>
                  <TableCell className="font-medium">{client.name} {client.surname}</TableCell>
                  <TableCell>{client.provider}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <Progress value={client.onboardingProgress} className="h-2" />
                      <span className="text-xs text-muted-foreground">{client.onboardingProgress}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <Progress value={client.trainingProgress} className="h-2" />
                      <span className="text-xs text-muted-foreground">{client.trainingProgress}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <GrowthStatusIndicator growthStage={client.growthLevel} showText={false} />
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{client.interestPercentage}%</Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openProfile(client)}
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
        user={selectedClient}
      />
    </div>
  );
};

export default ClientsTab;
