import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, MoreVertical, Users, ArrowLeft, User } from "lucide-react";
import UserProfilePanel from "@/components/userprofile/UserProfilePanel";

// Dummy data for groups
const dummyGroups = [
  { id: 1, name: "Cold Leads Group", description: "Potential customers not yet contacted", category: "Leads", members: 45, interest: 23 },
  { id: 2, name: "Active Clients Group", description: "Current paying customers", category: "Clients", members: 78, interest: 89 },
  { id: 3, name: "Active Staff Group", description: "Current team members", category: "Staff", members: 12, interest: 95 },
  { id: 4, name: "Campaign X Recipients", description: "Email campaign target audience", category: "Campaigns", members: 156, interest: 67 },
  { id: 5, name: "VIP Clients", description: "High-value customers", category: "Clients", members: 23, interest: 94 },
  { id: 6, name: "Newsletter Subscribers", description: "General newsletter audience", category: "General", members: 234, interest: 45 },
  { id: 7, name: "Referral Partners", description: "Business referral network", category: "General", members: 18, interest: 78 }
];

// Dummy data for group members
const dummyMembers = [
  { id: 1, entryDate: "2024-01-15", name: "John Smith", category: "Lead", email: "john.smith@example.com", phone: "(555) 123-4567", interest: 78 },
  { id: 2, entryDate: "2024-01-18", name: "Sarah Johnson", category: "Client", email: "sarah.johnson@example.com", phone: "(555) 234-5678", interest: 92 },
  { id: 3, entryDate: "2024-01-20", name: "Mike Wilson", category: "Staff", email: "mike.wilson@company.com", phone: "(555) 345-6789", interest: 85 },
  { id: 4, entryDate: "2024-01-22", name: "Emily Davis", category: "Lead", email: "emily.davis@example.com", phone: "(555) 456-7890", interest: 67 },
  { id: 5, entryDate: "2024-01-25", name: "Robert Brown", category: "Client", email: "robert.brown@example.com", phone: "(555) 567-8901", interest: 89 }
];

const Groups = () => {
  const [groups, setGroups] = useState(dummyGroups);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [members, setMembers] = useState(dummyMembers);
  const [searchTerm, setSearchTerm] = useState("");
  const [memberSearchTerm, setMemberSearchTerm] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newGroup, setNewGroup] = useState({
    name: "",
    description: "",
    category: ""
  });

  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(memberSearchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(memberSearchTerm.toLowerCase())
  );

  const handleCreateGroup = () => {
    if (newGroup.name && newGroup.category) {
      const newGroupData = {
        id: groups.length + 1,
        name: newGroup.name,
        description: newGroup.description,
        category: newGroup.category,
        members: Math.floor(Math.random() * 100),
        interest: Math.floor(Math.random() * 100)
      };
      setGroups([...groups, newGroupData]);
      setNewGroup({ name: "", description: "", category: "" });
      setShowCreateModal(false);
    }
  };

  const handleMemberSelect = (memberId) => {
    setSelectedMembers(prev =>
      prev.includes(memberId)
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleSelectAll = () => {
    if (selectedMembers.length === filteredMembers.length) {
      setSelectedMembers([]);
    } else {
      setSelectedMembers(filteredMembers.map(member => member.id));
    }
  };

  const handleUserProfileClick = (member) => {
    setSelectedUser(member);
    setShowUserProfile(true);
  };

  if (selectedGroup) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => setSelectedGroup(null)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Groups
          </Button>
          <div>
            <h2 className="text-2xl font-bold">{selectedGroup.name}</h2>
            <p className="text-muted-foreground">{selectedGroup.description}</p>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search members..."
                value={memberSearchTerm}
                onChange={(e) => setMemberSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            {selectedMembers.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    Bulk Actions ({selectedMembers.length})
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>Remove from group</DropdownMenuItem>
                  <DropdownMenuItem>Add to other groups</DropdownMenuItem>
                  <DropdownMenuItem>Unsubscribe</DropdownMenuItem>
                  <DropdownMenuItem>Delete</DropdownMenuItem>
                  <DropdownMenuItem>Export to CSV</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>Add Members</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Single member entry</DropdownMenuItem>
              <DropdownMenuItem>From a Segment</DropdownMenuItem>
              <DropdownMenuItem>CSV Import</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedMembers.length === filteredMembers.length}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Entry Date</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Interest %</TableHead>
                  <TableHead>Profile</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMembers.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedMembers.includes(member.id)}
                        onCheckedChange={() => handleMemberSelect(member.id)}
                      />
                    </TableCell>
                    <TableCell>{member.entryDate}</TableCell>
                    <TableCell className="font-medium">{member.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{member.category}</Badge>
                    </TableCell>
                    <TableCell>{member.email}</TableCell>
                    <TableCell>{member.phone}</TableCell>
                    <TableCell>{member.interest}%</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleUserProfileClick(member)}
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

        {showUserProfile && selectedUser && (
          <UserProfilePanel
            open={showUserProfile}
            onClose={() => setShowUserProfile(false)}
            user={selectedUser}
          />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Groups</h2>
          <p className="text-muted-foreground">Manage static lists of people</p>
        </div>
        <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create New Group
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Group</DialogTitle>
              <DialogDescription>
                Create a new static group to organize your contacts.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="groupName">Group Name *</Label>
                <Input
                  id="groupName"
                  value={newGroup.name}
                  onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                  placeholder="Enter group name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="groupDescription">Description</Label>
                <Textarea
                  id="groupDescription"
                  value={newGroup.description}
                  onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
                  placeholder="Optional description for internal reference"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="groupCategory">Category *</Label>
                <Select onValueChange={(value) => setNewGroup({ ...newGroup, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Leads">Leads</SelectItem>
                    <SelectItem value="Clients">Clients</SelectItem>
                    <SelectItem value="Staff">Staff</SelectItem>
                    <SelectItem value="General">General</SelectItem>
                    <SelectItem value="Campaigns">Campaigns</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateGroup}>Save Group</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search groups..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Group Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Members</TableHead>
                <TableHead>Interest %</TableHead>
                <TableHead className="w-12">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredGroups.map((group) => (
                <TableRow
                  key={group.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => setSelectedGroup(group)}
                >
                  <TableCell className="font-medium">{group.name}</TableCell>
                  <TableCell>{group.description}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{group.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      {group.members}
                    </div>
                  </TableCell>
                  <TableCell>{group.interest}%</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>Rename</DropdownMenuItem>
                        <DropdownMenuItem>View</DropdownMenuItem>
                        <DropdownMenuItem>Duplicate</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Groups;
