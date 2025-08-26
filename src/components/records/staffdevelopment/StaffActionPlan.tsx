
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Target, User, Clock, Plus, Edit, Trash2, CheckCircle } from "lucide-react";

const StaffActionPlan = () => {
  const [actionItems, setActionItems] = useState([
    {
      id: 1,
      title: "Improve Documentation Timeliness",
      description: "Complete all client documentation within 24 hours of session",
      priority: "High",
      status: "In Progress",
      assignedTo: "John Doe",
      dueDate: "2024-02-15",
      progress: 75,
      category: "Documentation",
      milestones: [
        { id: 1, title: "Establish documentation workflow", completed: true },
        { id: 2, title: "Complete 90% of notes within 24 hours for 2 weeks", completed: true },
        { id: 3, title: "Maintain 95% compliance for 1 month", completed: false },
      ]
    },
    {
      id: 2,
      title: "Develop Trauma-Informed Care Skills",
      description: "Complete advanced training in trauma-informed therapeutic techniques",
      priority: "Medium",
      status: "Planning",
      assignedTo: "John Doe",
      dueDate: "2024-03-30",
      progress: 25,
      category: "Training",
      milestones: [
        { id: 1, title: "Enroll in trauma-informed care course", completed: true },
        { id: 2, title: "Complete first 4 modules", completed: false },
        { id: 3, title: "Practice techniques with supervision", completed: false },
        { id: 4, title: "Demonstrate competency assessment", completed: false },
      ]
    },
    {
      id: 3,
      title: "Enhance Client Engagement Strategies",
      description: "Develop and implement improved client engagement techniques",
      priority: "Medium",
      status: "To Do",
      assignedTo: "John Doe",
      dueDate: "2024-04-15",
      progress: 10,
      category: "Clinical Skills",
      milestones: [
        { id: 1, title: "Research engagement best practices", completed: true },
        { id: 2, title: "Shadow experienced clinician", completed: false },
        { id: 3, title: "Implement new techniques", completed: false },
        { id: 4, title: "Measure client satisfaction improvement", completed: false },
      ]
    }
  ]);

  const [isCreating, setIsCreating] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "bg-red-100 text-red-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "Low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed": return "bg-green-100 text-green-800";
      case "In Progress": return "bg-blue-100 text-blue-800";
      case "Planning": return "bg-yellow-100 text-yellow-800";
      case "To Do": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const ActionItemForm = ({ item, onSave, onCancel }: any) => {
    const [formData, setFormData] = useState({
      title: item?.title || "",
      description: item?.description || "",
      priority: item?.priority || "Medium",
      status: item?.status || "To Do",
      dueDate: item?.dueDate || "",
      category: item?.category || "General"
    });

    const handleSave = () => {
      onSave(formData);
    };

    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Action Item Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Enter action item title"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe the action item"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="To Do">To Do</SelectItem>
                <SelectItem value="Planning">Planning</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Documentation">Documentation</SelectItem>
                <SelectItem value="Training">Training</SelectItem>
                <SelectItem value="Clinical Skills">Clinical Skills</SelectItem>
                <SelectItem value="Communication">Communication</SelectItem>
                <SelectItem value="Professional Development">Professional Development</SelectItem>
                <SelectItem value="General">General</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date</Label>
            <Input
              id="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            {item ? "Update" : "Create"} Action Item
          </Button>
        </div>
      </div>
    );
  };

  const handleSaveItem = (formData: any) => {
    if (editingItem) {
      setActionItems(actionItems.map(item => 
        item.id === editingItem.id ? { ...item, ...formData } : item
      ));
    } else {
      const newItem = {
        id: Date.now(),
        ...formData,
        assignedTo: "John Doe",
        progress: 0,
        milestones: []
      };
      setActionItems([...actionItems, newItem]);
    }
    setIsCreating(false);
    setEditingItem(null);
  };

  const handleEditItem = (item: any) => {
    setEditingItem(item);
    setIsCreating(true);
  };

  const handleDeleteItem = (id: number) => {
    setActionItems(actionItems.filter(item => item.id !== id));
  };

  return (
    <div className="app-card">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold">Staff Development Action Plan</h2>
            <p className="text-sm text-muted-foreground">
              Track and manage development goals and action items
            </p>
          </div>
          <Button onClick={() => setIsCreating(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Action Item
          </Button>
        </div>

        {/* Create/Edit Form */}
        {isCreating && (
          <Card>
            <CardHeader>
              <CardTitle>
                {editingItem ? "Edit Action Item" : "Create New Action Item"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ActionItemForm
                item={editingItem}
                onSave={handleSaveItem}
                onCancel={() => {
                  setIsCreating(false);
                  setEditingItem(null);
                }}
              />
            </CardContent>
          </Card>
        )}

        {/* Action Items List */}
        <div className="space-y-4">
          {actionItems.map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                      <Badge className={getPriorityColor(item.priority)}>
                        {item.priority}
                      </Badge>
                      <Badge className={getStatusColor(item.status)}>
                        {item.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditItem(item)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Details */}
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>Assigned to: {item.assignedTo}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Due: {item.dueDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-muted-foreground" />
                      <span>Category: {item.category}</span>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span className="font-medium">{item.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Milestones */}
                  {item.milestones.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Milestones</h4>
                      <div className="space-y-1">
                        {item.milestones.map((milestone) => (
                          <div key={milestone.id} className="flex items-center gap-2 text-sm">
                            <CheckCircle 
                              className={`h-4 w-4 ${
                                milestone.completed ? 'text-green-500' : 'text-gray-300'
                              }`}
                            />
                            <span className={milestone.completed ? 'line-through text-muted-foreground' : ''}>
                              {milestone.title}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StaffActionPlan;
