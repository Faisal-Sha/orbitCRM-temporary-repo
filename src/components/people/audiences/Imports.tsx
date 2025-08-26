
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Upload, UserPlus, FileText, CheckCircle, AlertCircle } from "lucide-react";

const Imports = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [importStatus, setImportStatus] = useState(null);
  const [newContact, setNewContact] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    category: "",
    address: "",
    notes: ""
  });

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setImportStatus(null);
    }
  };

  const handleCSVImport = () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select a CSV file to import.",
        variant: "destructive"
      });
      return;
    }

    // Simulate import process
    setImportStatus("processing");
    setTimeout(() => {
      const success = Math.random() > 0.2; // 80% success rate
      setImportStatus(success ? "success" : "error");
      
      if (success) {
        toast({
          title: "Import successful",
          description: `Successfully imported ${Math.floor(Math.random() * 100) + 10} contacts from ${selectedFile.name}`,
        });
      } else {
        toast({
          title: "Import failed",
          description: "There was an error processing your CSV file. Please check the format and try again.",
          variant: "destructive"
        });
      }
    }, 2000);
  };

  const handleAddContact = () => {
    if (!newContact.firstName || !newContact.lastName || !newContact.email) {
      toast({
        title: "Missing required fields",
        description: "Please fill in at least the first name, last name, and email.",
        variant: "destructive"
      });
      return;
    }

    // Simulate adding contact
    toast({
      title: "Contact added",
      description: `Successfully added ${newContact.firstName} ${newContact.lastName} to your contacts.`,
    });

    // Reset form
    setNewContact({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      category: "",
      address: "",
      notes: ""
    });
  };

  const downloadTemplate = () => {
    // Simulate CSV template download
    toast({
      title: "Template downloaded",
      description: "CSV template has been downloaded to your device.",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Imports</h2>
        <p className="text-muted-foreground">Import and manage audience data from external sources</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CSV Import Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Import from CSV
            </CardTitle>
            <CardDescription>
              Upload a CSV file to import multiple contacts at once
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="csvFile">Select CSV File</Label>
              <Input
                id="csvFile"
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="cursor-pointer"
              />
              {selectedFile && (
                <p className="text-sm text-muted-foreground">
                  Selected: {selectedFile.name}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Button
                variant="outline"
                onClick={downloadTemplate}
                className="w-full"
              >
                <FileText className="h-4 w-4 mr-2" />
                Download CSV Template
              </Button>
            </div>

            {importStatus && (
              <div className="p-4 rounded-md border">
                {importStatus === "processing" && (
                  <div className="flex items-center gap-2 text-blue-600">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    Processing import...
                  </div>
                )}
                {importStatus === "success" && (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    Import completed successfully!
                  </div>
                )}
                {importStatus === "error" && (
                  <div className="flex items-center gap-2 text-red-600">
                    <AlertCircle className="h-4 w-4" />
                    Import failed. Please check your file format.
                  </div>
                )}
              </div>
            )}

            <Button
              onClick={handleCSVImport}
              disabled={!selectedFile || importStatus === "processing"}
              className="w-full"
            >
              {importStatus === "processing" ? "Importing..." : "Import CSV"}
            </Button>

            <div className="text-xs text-muted-foreground space-y-1">
              <p><strong>CSV Format Requirements:</strong></p>
              <ul className="list-disc list-inside space-y-1">
                <li>Headers: firstName, lastName, email, phone, category, address</li>
                <li>Email field is required for all contacts</li>
                <li>Category options: Lead, Client, Staff, General</li>
                <li>Phone format: (XXX) XXX-XXXX</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Single Contact Entry */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Add Single Contact
            </CardTitle>
            <CardDescription>
              Manually add a single contact to your audience
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={newContact.firstName}
                  onChange={(e) => setNewContact({ ...newContact, firstName: e.target.value })}
                  placeholder="John"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={newContact.lastName}
                  onChange={(e) => setNewContact({ ...newContact, lastName: e.target.value })}
                  placeholder="Smith"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={newContact.email}
                onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                placeholder="john.smith@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={newContact.phone}
                onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                placeholder="(555) 123-4567"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select onValueChange={(value) => setNewContact({ ...newContact, category: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Lead">Lead</SelectItem>
                  <SelectItem value="Client">Client</SelectItem>
                  <SelectItem value="Staff">Staff</SelectItem>
                  <SelectItem value="General">General</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={newContact.address}
                onChange={(e) => setNewContact({ ...newContact, address: e.target.value })}
                placeholder="123 Main St, City, State 12345"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={newContact.notes}
                onChange={(e) => setNewContact({ ...newContact, notes: e.target.value })}
                placeholder="Additional notes about this contact..."
                rows={3}
              />
            </div>

            <Button onClick={handleAddContact} className="w-full">
              <UserPlus className="h-4 w-4 mr-2" />
              Add Contact
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Import History */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Imports</CardTitle>
          <CardDescription>
            History of your recent import activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-md">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium">contacts_batch_1.csv</p>
                  <p className="text-sm text-muted-foreground">45 contacts imported successfully</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">2 hours ago</p>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-md">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium">new_leads.csv</p>
                  <p className="text-sm text-muted-foreground">23 contacts imported successfully</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">1 day ago</p>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-md">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <div>
                  <p className="font-medium">invalid_format.csv</p>
                  <p className="text-sm text-muted-foreground">Import failed - invalid format</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">2 days ago</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Imports;
