
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import { Plus, Settings, Trash2, Save, Eye, Edit3, Upload, Link as LinkIcon, CheckSquare, Play, Book, FileText } from "lucide-react";

interface TrainingProps {
  type: "staff" | "clients";
}

interface TrainingModule {
  id: string;
  title: string;
  description: string;
  items: TrainingItem[];
  estimatedTime: string;
  completed?: boolean;
  progress?: number;
}

interface TrainingItem {
  id: string;
  type: string;
  name: string;
  resourceLink: string;
  description?: string;
  duration?: string;
  completed?: boolean;
}

const Training: React.FC<TrainingProps> = ({ type }) => {
  const isStaff = type === "staff";
  
  const [modules, setModules] = useState<TrainingModule[]>([
    {
      id: "getting-started",
      title: "Getting Started with Your Business",
      description: "Learn the fundamentals of running a successful service business",
      estimatedTime: "2 hours",
      completed: false,
      progress: isStaff ? undefined : 65,
      items: [
        { id: "1", type: "Video", name: "Introduction to Business Basics", resourceLink: "https://example.com/intro-video", description: "Overview of business fundamentals", completed: true, duration: "15 min" },
        { id: "2", type: "Article", name: "Setting Up Your Workspace", resourceLink: "https://example.com/workspace-guide", description: "Guide to creating an effective workspace", completed: true, duration: "10 min" },
        { id: "3", type: "Quiz", name: "Business Basics Quiz", resourceLink: "", description: "Test your understanding of business fundamentals", completed: false, duration: "5 min" }
      ]
    },
    {
      id: "client-care",
      title: "Client Care Excellence",
      description: "Master the art of exceptional client service and relationship building",
      estimatedTime: "3 hours",
      completed: false,
      progress: isStaff ? undefined : 30,
      items: [
        { id: "4", type: "Video", name: "Client Communication Best Practices", resourceLink: "https://example.com/communication-video", description: "Learn effective communication techniques", completed: true, duration: "20 min" },
        { id: "5", type: "Article", name: "Building Trust with Clients", resourceLink: "https://example.com/trust-guide", description: "Strategies for building lasting client relationships", completed: false, duration: "15 min" },
        { id: "6", type: "Interactive", name: "Role-Playing Scenarios", resourceLink: "", description: "Practice client interactions through scenarios", completed: false, duration: "30 min" }
      ]
    }
  ]);

  const itemTypes = ["Video", "Article", "Quiz", "Interactive", "PDF", "Assignment"];

  const [editingModule, setEditingModule] = useState(null);
  const [isPreview, setIsPreview] = useState(false);

  const addModule = () => {
    const newMod: TrainingModule = {
      id: `module-${Date.now()}`,
      title: "New Module",
      description: "",
      estimatedTime: "1 hour",
      completed: false,
      progress: isStaff ? undefined : 0,
      items: []
    };
    setModules([...modules, newMod]);
  };

  const addItem = (moduleId: string) => {
    const newItem: TrainingItem = {
      id: `${Date.now()}`,
      type: "Video",
      name: "New Item",
      resourceLink: "",
      description: "",
      duration: "",
      completed: false
    };
    setModules(modules.map(module => 
      module.id === moduleId 
        ? { ...module, items: [...module.items, newItem] }
        : module
    ));
  };

  const updateModule = (moduleId: string, field: keyof TrainingModule, value: any) => {
    if (field === 'items') return;
    setModules(modules.map(module => 
      module.id === moduleId ? { ...module, [field]: value } : module
    ));
  };

  const updateItem = (moduleId: string, itemId: string, field: keyof TrainingItem, value: any) => {
    setModules(modules.map(module => 
      module.id === moduleId 
        ? {
            ...module,
            items: module.items.map(item => 
              item.id === itemId ? { ...item, [field]: value } : item
            )
          }
        : module
    ));
  };

  const deleteItem = (moduleId: string, itemId: string) => {
    setModules(modules.map(module => 
      module.id === moduleId 
        ? { ...module, items: module.items.filter(item => item.id !== itemId) }
        : module
    ));
  };

  const deleteModule = (moduleId: string) => {
    setModules(modules.filter(module => module.id !== moduleId));
  };

  const getContentTypeIcon = (type: string) => {
    switch(type) {
      case "Video": return <Play className="h-4 w-4" />;
      case "Article": return <Book className="h-4 w-4" />;
      case "Quiz": return <CheckSquare className="h-4 w-4" />;
      case "Interactive": return <Settings className="h-4 w-4" />;
      case "PDF": return <FileText className="h-4 w-4" />;
      case "Assignment": return <Edit3 className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{isStaff ? "Staff Training" : "Training"} Path Builder</CardTitle>
              <p className="text-sm text-muted-foreground mt-2">
                {isStaff 
                  ? "Create comprehensive training modules for staff development"
                  : "Build interactive training courses for client education and growth"
                }
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                {isPreview ? "Edit Mode" : "Preview"}
              </Button>
              <Button size="sm">
                <Save className="h-4 w-4 mr-2" />
                Save & Publish
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {!isPreview ? (
        <>
          {/* Modules Builder */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Training Modules</CardTitle>
                <Button onClick={addModule} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Module
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {modules.map((module, index) => (
                  <AccordionItem key={module.id} value={module.id}>
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center justify-between w-full mr-4">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline">Module {index + 1}</Badge>
                          <input
                            type="text"
                            value={module.title}
                            onChange={(e) => updateModule(module.id, "title", e.target.value)}
                            className="font-medium bg-transparent border-none outline-none focus:bg-background focus:border focus:rounded px-2 py-1"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{module.items.length} items</Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteModule(module.id);
                            }}
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 pt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Description</label>
                            <Textarea
                              value={module.description}
                              onChange={(e) => updateModule(module.id, "description", e.target.value)}
                              placeholder="Describe this module..."
                              rows={3}
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Estimated Time</label>
                            <input
                              type="text"
                              value={module.estimatedTime}
                              onChange={(e) => updateModule(module.id, "estimatedTime", e.target.value)}
                              className="w-full p-2 border border-input rounded-md bg-background text-sm"
                              placeholder="e.g., 2 hours"
                            />
                          </div>
                        </div>
                        
                        {module.items.map((item) => (
                          <div key={item.id} className="border rounded-lg p-4 space-y-3">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <label className="text-sm font-medium">Content Type</label>
                                <select
                                  value={item.type}
                                  onChange={(e) => updateItem(module.id, item.id, "type", e.target.value)}
                                  className="w-full p-2 border border-input rounded-md bg-background text-sm"
                                >
                                  {itemTypes.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                  ))}
                                </select>
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-medium">Content Name</label>
                                <input
                                  type="text"
                                  value={item.name}
                                  onChange={(e) => updateItem(module.id, item.id, "name", e.target.value)}
                                  className="w-full p-2 border border-input rounded-md bg-background text-sm"
                                  placeholder="Enter content name"
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Resource Link</label>
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  value={item.resourceLink}
                                  onChange={(e) => updateItem(module.id, item.id, "resourceLink", e.target.value)}
                                  className="flex-1 p-2 border border-input rounded-md bg-background text-sm"
                                  placeholder="Enter URL or upload path"
                                />
                                <Button variant="outline" size="sm">
                                  Upload
                                </Button>
                              </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <label className="text-sm font-medium">Description</label>
                                <input
                                  type="text"
                                  value={item.description || ""}
                                  onChange={(e) => updateItem(module.id, item.id, "description", e.target.value)}
                                  className="w-full p-2 border border-input rounded-md bg-background text-sm"
                                  placeholder="Brief description of this content"
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-medium">Duration</label>
                                <input
                                  type="text"
                                  value={item.duration || ""}
                                  onChange={(e) => updateItem(module.id, item.id, "duration", e.target.value)}
                                  className="w-full p-2 border border-input rounded-md bg-background text-sm"
                                  placeholder="e.g., 15 min"
                                />
                              </div>
                            </div>
                            <div className="flex justify-end">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteItem(module.id, item.id)}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Item
                              </Button>
                            </div>
                          </div>
                        ))}
                        <Button
                          variant="outline"
                          onClick={() => addItem(module.id)}
                          className="w-full"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Content to Module
                        </Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </>
      ) : (
        /* Preview Mode */
        <Card>
          <CardHeader>
            <CardTitle>{isStaff ? "Staff" : "Client"} Training Preview</CardTitle>
            <p className="text-sm text-muted-foreground">
              This is how {isStaff ? "staff" : "clients"} will experience the training modules
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {modules.map((module, index) => (
                <Card key={module.id} className="border-l-4 border-l-primary">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{module.title}</CardTitle>
                          <p className="text-sm text-muted-foreground">{module.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline">{module.estimatedTime}</Badge>
                        {!isStaff && (
                          <div className="mt-2">
                            <Progress value={module.progress} className="w-24" />
                            <span className="text-xs text-muted-foreground">{module.progress}% complete</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {module.items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                        <div className="flex items-center gap-3">
                          {getContentTypeIcon(item.type)}
                          <div>
                            <div className="font-medium">{item.name}</div>
                            {item.description && <p className="text-sm text-muted-foreground">{item.description}</p>}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {item.duration && (
                            <span className="text-xs text-muted-foreground">{item.duration}</span>
                          )}
                          <Badge variant="outline">{item.type}</Badge>
                          <Button size="sm" variant="outline">
                            {item.type === "Quiz" ? "Take Quiz" : "Start"}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Training;
