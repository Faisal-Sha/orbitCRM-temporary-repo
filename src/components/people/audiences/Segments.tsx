
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Search, Plus, MoreVertical, Users, Trash2, Eye } from "lucide-react";

// Dummy data for segments
const dummySegments = [
  {
    id: 1,
    name: "Active Email Subscribers",
    description: "Contacts who have opened emails in the last 30 days",
    criteria: "Email Status = 'Active' AND Last Email Open < 30 days",
    estimatedCount: 234,
    interest: 78
  },
  {
    id: 2,
    name: "High-Value Clients",
    description: "Clients with outstanding balance > $1000",
    criteria: "Category = 'Client' AND Outstanding Balance > $1000",
    estimatedCount: 45,
    interest: 92
  },
  {
    id: 3,
    name: "Recent Leads",
    description: "Leads added in the last 7 days",
    criteria: "Category = 'Lead' AND Signup Date <= 7 days",
    estimatedCount: 18,
    interest: 65
  },
  {
    id: 4,
    name: "Newsletter Subscribers in NY",
    description: "Newsletter subscribers located in New York",
    criteria: "State = 'NY' AND Has Subscribed to Newsletter = true",
    estimatedCount: 156,
    interest: 56
  }
];

// Field options for criteria builder
const fieldOptions = [
  { value: "email", label: "Email", type: "text" },
  { value: "firstName", label: "First Name", type: "text" },
  { value: "lastName", label: "Last Name", type: "text" },
  { value: "phone", label: "Phone", type: "text" },
  { value: "city", label: "City", type: "text" },
  { value: "state", label: "State", type: "text" },
  { value: "zipCode", label: "Zip Code", type: "text" },
  { value: "dateOfBirth", label: "Date of Birth", type: "date" },
  { value: "gender", label: "Gender", type: "select" },
  { value: "category", label: "Category", type: "select" },
  { value: "groupMembership", label: "Group Membership", type: "relationship" },
  { value: "lastContactedDate", label: "Last Contacted Date", type: "date" },
  { value: "timeInactive", label: "Time Inactive", type: "number" },
  { value: "hasParticipatedInCampaign", label: "Has Participated in Campaign", type: "boolean" },
  { value: "hasOpenedCampaign", label: "Has Opened Campaign", type: "boolean" },
  { value: "hasClickedLink", label: "Has Clicked Link in Campaign", type: "boolean" },
  { value: "hasSubmittedForm", label: "Has Submitted Form", type: "boolean" },
  { value: "hasUpcomingAppointment", label: "Has Upcoming Appointment", type: "boolean" },
  { value: "numberOfAppointments", label: "Number of Appointments", type: "number" },
  { value: "hasActiveAuthorization", label: "Has Active Authorization", type: "boolean" },
  { value: "hasOutstandingBalance", label: "Has Outstanding Balance", type: "boolean" },
  { value: "signupDate", label: "Signup Date", type: "date" }
];

const getOperators = (fieldType) => {
  switch (fieldType) {
    case "text":
      return [
        { value: "equals", label: "equals" },
        { value: "notEquals", label: "does not equal" },
        { value: "contains", label: "contains" },
        { value: "notContains", label: "does not contain" },
        { value: "startsWith", label: "starts with" },
        { value: "endsWith", label: "ends with" },
        { value: "isEmpty", label: "is empty" },
        { value: "isNotEmpty", label: "is not empty" }
      ];
    case "date":
      return [
        { value: "isBefore", label: "is before" },
        { value: "isAfter", label: "is after" },
        { value: "isOn", label: "is on" },
        { value: "isBetween", label: "is between" },
        { value: "inLastDays", label: "is in the last X days" },
        { value: "inNextDays", label: "is in the next X days" },
        { value: "isEmpty", label: "is empty" },
        { value: "isNotEmpty", label: "is not empty" }
      ];
    case "number":
      return [
        { value: "equals", label: "equals" },
        { value: "notEquals", label: "does not equal" },
        { value: "greaterThan", label: "greater than" },
        { value: "lessThan", label: "less than" },
        { value: "greaterThanOrEqual", label: "greater than or equal to" },
        { value: "lessThanOrEqual", label: "less than or equal to" },
        { value: "isBetween", label: "is between" }
      ];
    case "boolean":
      return [
        { value: "isTrue", label: "is true" },
        { value: "isFalse", label: "is false" }
      ];
    case "select":
    case "relationship":
      return [
        { value: "equals", label: "equals" },
        { value: "notEquals", label: "does not equal" },
        { value: "belongsTo", label: "belongs to" },
        { value: "notBelongsTo", label: "does not belong to" }
      ];
    default:
      return [];
  }
};

const Segments = () => {
  const [segments, setSegments] = useState(dummySegments);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [newSegment, setNewSegment] = useState({
    name: "",
    description: "",
    conditions: [{ field: "", operator: "", value: "", logic: "AND" }],
    logic: "AND"
  });

  const filteredSegments = segments.filter(segment =>
    segment.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addCondition = () => {
    setNewSegment(prev => ({
      ...prev,
      conditions: [...prev.conditions, { field: "", operator: "", value: "", logic: "AND" }]
    }));
  };

  const removeCondition = (index) => {
    setNewSegment(prev => ({
      ...prev,
      conditions: prev.conditions.filter((_, i) => i !== index)
    }));
  };

  const updateCondition = (index, field, value) => {
    setNewSegment(prev => ({
      ...prev,
      conditions: prev.conditions.map((condition, i) =>
        i === index ? { ...condition, [field]: value } : condition
      )
    }));
  };

  const handleCreateSegment = () => {
    if (newSegment.name && newSegment.conditions.some(c => c.field && c.operator)) {
      const newSegmentData = {
        id: segments.length + 1,
        name: newSegment.name,
        description: newSegment.description,
        criteria: newSegment.conditions
          .filter(c => c.field && c.operator)
          .map(c => `${fieldOptions.find(f => f.value === c.field)?.label} ${c.operator} ${c.value}`)
          .join(` ${newSegment.logic} `),
        estimatedCount: Math.floor(Math.random() * 500),
        interest: Math.floor(Math.random() * 100)
      };
      setSegments([...segments, newSegmentData]);
      setNewSegment({
        name: "",
        description: "",
        conditions: [{ field: "", operator: "", value: "", logic: "AND" }],
        logic: "AND"
      });
      setShowCreateModal(false);
    }
  };

  const getEstimatedCount = () => {
    const validConditions = newSegment.conditions.filter(c => c.field && c.operator);
    return validConditions.length > 0 ? Math.floor(Math.random() * 300) + 50 : 0;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Segments</h2>
          <p className="text-muted-foreground">Create and manage dynamic audience segments</p>
        </div>
        <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create New Segment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Segment</DialogTitle>
              <DialogDescription>
                Define criteria to create a dynamic segment that automatically updates.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="segmentName">Segment Name *</Label>
                  <Input
                    id="segmentName"
                    value={newSegment.name}
                    onChange={(e) => setNewSegment({ ...newSegment, name: e.target.value })}
                    placeholder="Enter segment name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="segmentDescription">Description</Label>
                  <Input
                    id="segmentDescription"
                    value={newSegment.description}
                    onChange={(e) => setNewSegment({ ...newSegment, description: e.target.value })}
                    placeholder="Optional description"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold">Criteria Builder</Label>
                  <div className="flex items-center gap-4">
                    <Label>Logic:</Label>
                    <RadioGroup
                      value={newSegment.logic}
                      onValueChange={(value) => setNewSegment({ ...newSegment, logic: value })}
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="AND" id="and" />
                        <Label htmlFor="and">AND</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="OR" id="or" />
                        <Label htmlFor="or">OR</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>

                {newSegment.conditions.map((condition, index) => (
                  <Card key={index} className="p-4">
                    <div className="grid grid-cols-12 gap-2 items-end">
                      <div className="col-span-3">
                        <Label>Field</Label>
                        <Select
                          value={condition.field}
                          onValueChange={(value) => updateCondition(index, "field", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select field" />
                          </SelectTrigger>
                          <SelectContent>
                            {fieldOptions.map((field) => (
                              <SelectItem key={field.value} value={field.value}>
                                {field.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-3">
                        <Label>Operator</Label>
                        <Select
                          value={condition.operator}
                          onValueChange={(value) => updateCondition(index, "operator", value)}
                          disabled={!condition.field}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select operator" />
                          </SelectTrigger>
                          <SelectContent>
                            {condition.field &&
                              getOperators(fieldOptions.find(f => f.value === condition.field)?.type).map((operator) => (
                                <SelectItem key={operator.value} value={operator.value}>
                                  {operator.label}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-4">
                        <Label>Value</Label>
                        <Input
                          value={condition.value}
                          onChange={(e) => updateCondition(index, "value", e.target.value)}
                          placeholder="Enter value"
                          disabled={!condition.operator}
                        />
                      </div>
                      <div className="col-span-2">
                        {newSegment.conditions.length > 1 && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeCondition(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}

                <Button variant="outline" onClick={addCondition} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Condition
                </Button>
              </div>

              <Card className="p-4 bg-muted/50">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">Segment Preview</h4>
                    <p className="text-sm text-muted-foreground">
                      Estimated members: <span className="font-medium">{getEstimatedCount()}</span>
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setShowPreview(!showPreview)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    {showPreview ? "Hide" : "Show"} Preview
                  </Button>
                </div>
                {showPreview && (
                  <div className="mt-4">
                    <p className="text-sm text-muted-foreground mb-2">Sample matching contacts:</p>
                    <div className="space-y-1">
                      <div className="text-sm">• John Smith (john.smith@example.com)</div>
                      <div className="text-sm">• Sarah Johnson (sarah.johnson@example.com)</div>
                      <div className="text-sm">• Mike Wilson (mike.wilson@example.com)</div>
                      <div className="text-sm text-muted-foreground">... and {getEstimatedCount() - 3} more</div>
                    </div>
                  </div>
                )}
              </Card>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateSegment}>Save Segment</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search segments..."
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
                <TableHead>Segment Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Criteria Summary</TableHead>
                <TableHead>Estimated Count</TableHead>
                <TableHead>Interest %</TableHead>
                <TableHead className="w-12">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSegments.map((segment) => (
                <TableRow key={segment.id}>
                  <TableCell className="font-medium">{segment.name}</TableCell>
                  <TableCell>{segment.description}</TableCell>
                  <TableCell className="max-w-xs truncate">{segment.criteria}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      {segment.estimatedCount}
                    </div>
                  </TableCell>
                  <TableCell>{segment.interest}%</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>Rename</DropdownMenuItem>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Duplicate</DropdownMenuItem>
                        <DropdownMenuItem>Export Members</DropdownMenuItem>
                        <DropdownMenuItem>Refresh Segment</DropdownMenuItem>
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

export default Segments;
