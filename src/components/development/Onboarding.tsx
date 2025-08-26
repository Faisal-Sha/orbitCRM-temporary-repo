
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Plus, Settings, Trash2, Save, Eye, Edit3, Upload, Link as LinkIcon, CheckSquare } from "lucide-react";

interface OnboardingProps {
  type: "staff" | "clients";
}

interface OnboardingSection {
  id: string;
  title: string;
  items: OnboardingItem[];
}

interface OnboardingItem {
  id: string;
  type: string;
  name: string;
  resourceLink: string;
  completed?: boolean;
}

const Onboarding: React.FC<OnboardingProps> = ({ type }) => {
  const isStaff = type === "staff";
  
  const [sequentialAccess, setSequentialAccess] = useState(true);
  
  const [sections, setSections] = useState<OnboardingSection[]>([
    {
      id: "welcome",
      title: "Welcome",
      items: [
        { id: "1", type: "Video", name: isStaff ? "Welcome to the Team" : "Welcome Video", resourceLink: "https://example.com/welcome-video", completed: false },
        { id: "2", type: "PDF", name: isStaff ? "Company Handbook" : "Company Overview", resourceLink: "https://example.com/handbook.pdf", completed: false },
        { id: "3", type: "Checklist Task", name: isStaff ? "Complete Emergency Contact Form" : "I agree with company values", resourceLink: "", completed: false }
      ]
    },
    {
      id: "orientation",
      title: isStaff ? "Orientation" : "Finding Your Match",
      items: [
        { id: "4", type: "Video", name: isStaff ? "Office Tour" : "Find Your Match", resourceLink: "https://example.com/office-tour", completed: false },
        { id: "5", type: "Text Block", name: isStaff ? "Company Values and Mission" : "Select your 3 best matches", resourceLink: "", completed: true },
        { id: "6", type: "Checklist Task", name: isStaff ? "Setup IT Equipment" : "Schedule appointment with first match", resourceLink: "", completed: false }
      ]
    },
    ...(isStaff ? [{
      id: "compliance",
      title: "Compliance & Training",
      items: [
        { id: "7", type: "PDF", name: "HIPAA Training Materials", resourceLink: "https://example.com/hipaa.pdf", completed: false },
        { id: "8", type: "Video", name: "Ethics in Healthcare", resourceLink: "https://example.com/ethics-video", completed: false },
        { id: "9", type: "Checklist Task", name: "Complete Compliance Quiz", resourceLink: "", completed: false }
      ]
    }] : [])
  ]);

  const itemTypes = ["Video", "PDF", "Text Block", "Checklist Task"];

  const [editingSection, setEditingSection] = useState(null);
  const [isPreview, setIsPreview] = useState(false);

  const addSection = () => {
    const newSec: OnboardingSection = {
      id: `section-${Date.now()}`,
      title: "New Section",
      items: []
    };
    setSections([...sections, newSec]);
  };

  const addItem = (sectionId: string) => {
    const newItem: OnboardingItem = {
      id: `${Date.now()}`,
      type: "Video",
      name: "New Item",
      resourceLink: "",
      completed: false
    };
    setSections(sections.map(section => 
      section.id === sectionId 
        ? { ...section, items: [...section.items, newItem] }
        : section
    ));
  };

  const updateSectionTitle = (sectionId: string, newTitle: string) => {
    setSections(sections.map(section => 
      section.id === sectionId ? { ...section, title: newTitle } : section
    ));
  };

  const updateItem = (sectionId: string, itemId: string, field: keyof OnboardingItem, value: any) => {
    setSections(sections.map(section => 
      section.id === sectionId 
        ? {
            ...section,
            items: section.items.map(item => 
              item.id === itemId ? { ...item, [field]: value } : item
            )
          }
        : section
    ));
  };

  const deleteItem = (sectionId: string, itemId: string) => {
    setSections(sections.map(section => 
      section.id === sectionId 
        ? { ...section, items: section.items.filter(item => item.id !== itemId) }
        : section
    ));
  };

  const deleteSection = (sectionId: string) => {
    setSections(sections.filter(section => section.id !== sectionId));
  };

  const getContentTypeIcon = (type: string) => {
    switch(type) {
      case "Video": return "🎥";
      case "PDF": return "📄";
      case "Text Block": return "📝";
      case "Checklist Task": return "☑️";
      default: return "📋";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{isStaff ? "Staff Onboarding" : "Onboarding"} Path Builder</CardTitle>
              <p className="text-sm text-muted-foreground mt-2">
                {isStaff 
                  ? "Configure the onboarding experience for new staff members"
                  : "Configure the client onboarding experience with sequential modules and tasks"
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
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Switch
                id="sequential-access"
                checked={sequentialAccess}
                onCheckedChange={setSequentialAccess}
              />
              <label htmlFor="sequential-access" className="text-sm font-medium">
                Enable Sequential Access
              </label>
            </div>
            <Badge variant={sequentialAccess ? "default" : "secondary"}>
              {sequentialAccess ? "Sequential" : "Open Access"}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            When enabled, {isStaff ? "staff" : "clients"} must complete each section before accessing the next
          </p>
        </CardContent>
      </Card>

      {!isPreview ? (
        <>
          {/* Sections Builder */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Onboarding Sections</CardTitle>
                <Button onClick={addSection} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Section
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {sections.map((section, index) => (
                  <AccordionItem key={section.id} value={section.id}>
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center justify-between w-full mr-4">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline">Section {index + 1}</Badge>
                          <input
                            type="text"
                            value={section.title}
                            onChange={(e) => updateSectionTitle(section.id, e.target.value)}
                            className="font-medium bg-transparent border-none outline-none focus:bg-background focus:border focus:rounded px-2 py-1"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{section.items.length} items</Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteSection(section.id);
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
                        {section.items.map((item) => (
                          <div key={item.id} className="border rounded-lg p-4 space-y-3">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <label className="text-sm font-medium">Item Type</label>
                                <select
                                  value={item.type}
                                  onChange={(e) => updateItem(section.id, item.id, "type", e.target.value)}
                                  className="w-full p-2 border border-input rounded-md bg-background text-sm"
                                >
                                  {itemTypes.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                  ))}
                                </select>
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-medium">Item Name</label>
                                <input
                                  type="text"
                                  value={item.name}
                                  onChange={(e) => updateItem(section.id, item.id, "name", e.target.value)}
                                  className="w-full p-2 border border-input rounded-md bg-background text-sm"
                                  placeholder="Enter item name"
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Resource Link</label>
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  value={item.resourceLink}
                                  onChange={(e) => updateItem(section.id, item.id, "resourceLink", e.target.value)}
                                  className="flex-1 p-2 border border-input rounded-md bg-background text-sm"
                                  placeholder="Enter URL or upload path"
                                />
                                <Button variant="outline" size="sm">
                                  Upload
                                </Button>
                              </div>
                            </div>
                            <div className="flex justify-end">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteItem(section.id, item.id)}
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
                          onClick={() => addItem(section.id)}
                          className="w-full"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Item to Section
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
            <CardTitle>{isStaff ? "Staff" : "Client"} Preview</CardTitle>
            <p className="text-sm text-muted-foreground">
              This is how {isStaff ? "staff" : "clients"} will experience the onboarding process
            </p>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {sections.map((section, index) => (
                <AccordionItem key={section.id} value={`section-${section.id}`}>
                  <AccordionTrigger className="text-left">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium">{section.title}</div>
                        <div className="text-sm text-muted-foreground">{section.items.length} items</div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-4">
                    {section.items.map((item) => (
                      <div key={item.id} className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{getContentTypeIcon(item.type)}</span>
                          <span className="font-medium">{item.name}</span>
                          <Badge variant="outline">{item.type}</Badge>
                        </div>
                        {item.type === "Video" && (
                          <div className="bg-gray-100 h-32 rounded flex items-center justify-center">
                            <span className="text-gray-400">Video Player</span>
                          </div>
                        )}
                        {item.type === "Checklist Task" && (
                          <div className="flex items-center gap-2">
                            <CheckSquare className="h-4 w-4" />
                            <span className="text-sm">Task: {item.name}</span>
                          </div>
                        )}
                        <Button size="sm" variant="outline">
                          {item.type === "Checklist Task" ? "Mark Complete" : "Mark as Done"}
                        </Button>
                      </div>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Onboarding;
