
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Eye, FileText, Image, Video } from "lucide-react";
import GeneralTab from "@/components/userprofile/GeneralTab";
import CommentsTab from "@/components/userprofile/CommentsTab";
import ActivityTab from "@/components/userprofile/ActivityTab";

const StaffProfile = () => {
  const [activeTab, setActiveTab] = useState("general");

  // Dummy staff user data
  const staffUser = {
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "555-123-4567"
  };

  // Dummy files data similar to RecordsTab
  const filesData = [
    {
      id: 1,
      name: "Resume_JohnDoe.pdf",
      type: "PDF",
      size: "2.3 MB",
      uploadDate: "2024-01-15",
      category: "Resume",
      status: "Approved"
    },
    {
      id: 2,
      name: "Cover_Letter.pdf",
      type: "PDF",
      size: "1.1 MB",
      uploadDate: "2024-01-15",
      category: "Cover Letter",
      status: "Pending Review"
    },
    {
      id: 3,
      name: "License_Copy.jpg",
      type: "Image",
      size: "856 KB",
      uploadDate: "2024-01-16",
      category: "License",
      status: "Approved"
    },
    {
      id: 4,
      name: "Portfolio_Video.mp4",
      type: "Video",
      size: "15.2 MB",
      uploadDate: "2024-01-18",
      category: "Portfolio",
      status: "Pending Review"
    }
  ];

  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf':
        return <FileText className="h-4 w-4 text-red-500" />;
      case 'image':
        return <Image className="h-4 w-4 text-blue-500" />;
      case 'video':
        return <Video className="h-4 w-4 text-purple-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800";
      case "Pending Review":
        return "bg-yellow-100 text-yellow-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const FilesTab = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Files & Documents</h3>
        <Button size="sm">Upload File</Button>
      </div>
      
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>File Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Upload Date</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filesData.map((file) => (
              <TableRow key={file.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    {getFileIcon(file.type)}
                    {file.name}
                  </div>
                </TableCell>
                <TableCell>{file.type}</TableCell>
                <TableCell>{file.size}</TableCell>
                <TableCell>{file.uploadDate}</TableCell>
                <TableCell>
                  <Badge variant="outline">{file.category}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className={getStatusColor(file.status)}>
                    {file.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
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

  return (
    <div className="app-card">
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="app-tabs w-full mb-6">
          <TabsTrigger value="general" className="app-tab">
            General
          </TabsTrigger>
          <TabsTrigger value="conversations" className="app-tab">
            Conversations
          </TabsTrigger>
          <TabsTrigger value="files" className="app-tab">
            Files
          </TabsTrigger>
          <TabsTrigger value="activity" className="app-tab">
            Activity
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="mt-0">
          <div className="h-[600px] overflow-y-auto">
            <GeneralTab user={staffUser} hideUpcomingAppointments={true} />
          </div>
        </TabsContent>
        
        <TabsContent value="conversations" className="mt-0">
          <div className="h-[600px] overflow-y-auto">
            <CommentsTab user={staffUser} />
          </div>
        </TabsContent>
        
        <TabsContent value="files" className="mt-0">
          <div className="h-[600px] overflow-y-auto p-4">
            <FilesTab />
          </div>
        </TabsContent>
        
        <TabsContent value="activity" className="mt-0">
          <div className="h-[600px] overflow-y-auto">
            <ActivityTab user={staffUser} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StaffProfile;
