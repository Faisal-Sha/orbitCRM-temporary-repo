
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { DollarSign, FileText, Shield, CheckCircle, Clock, AlertTriangle } from "lucide-react";

const StaffOfferCompliance = () => {
  // Dummy offer and compliance data
  const offerData = {
    positionOffered: "Clinical Therapist",
    compensationPackage: {
      baseSalary: "$78,000",
      benefits: ["Health Insurance", "Dental Insurance", "401k Match", "PTO"],
      startDate: "2024-03-01"
    },
    offerStatus: "Extended",
    rejectionReason: null,
    backgroundCheckStatus: "In Progress",
    preHireDocuments: [
      {
        document: "Employment Contract",
        required: true,
        dueDate: "2024-02-15",
        status: "Pending Signature",
        uploadedDate: null
      },
      {
        document: "Tax Forms (W-4, I-9)",
        required: true,
        dueDate: "2024-02-20",
        status: "Not Started",
        uploadedDate: null
      },
      {
        document: "Direct Deposit Authorization",
        required: true,
        dueDate: "2024-02-20",
        status: "Not Started",
        uploadedDate: null
      },
      {
        document: "Emergency Contact Information",
        required: true,
        dueDate: "2024-02-20",
        status: "Completed",
        uploadedDate: "2024-01-25"
      },
      {
        document: "Professional License Verification",
        required: true,
        dueDate: "2024-02-10",
        status: "Under Review",
        uploadedDate: "2024-01-23"
      },
      {
        document: "Background Check Authorization",
        required: true,
        dueDate: "2024-02-05",
        status: "Completed",
        uploadedDate: "2024-01-24"
      }
    ],
    finalOfferJustification: "Candidate demonstrates excellent clinical skills, strong values alignment, and comes highly recommended. The salary offer is competitive within our range and reflects their experience level."
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Under Review":
        return "bg-blue-100 text-blue-800";
      case "Pending Signature":
        return "bg-yellow-100 text-yellow-800";
      case "Not Started":
        return "bg-gray-100 text-gray-800";
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      case "Extended":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "Under Review":
      case "In Progress":
        return <Clock className="h-4 w-4 text-blue-500" />;
      case "Pending Signature":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <ScrollArea className="h-full">
      <div className="app-card">
        <div className="space-y-6">
          {/* Position & Compensation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Position & Compensation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Position Offered</span>
                    <p className="text-sm text-gray-600 mt-1">{offerData.positionOffered}</p>
                  </div>
                  
                  <div>
                    <span className="text-sm font-medium text-gray-700">Base Salary</span>
                    <p className="text-sm text-gray-600 mt-1">{offerData.compensationPackage.baseSalary}</p>
                  </div>
                  
                  <div>
                    <span className="text-sm font-medium text-gray-700">Start Date</span>
                    <p className="text-sm text-gray-600 mt-1">{offerData.compensationPackage.startDate}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Benefits Package</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {offerData.compensationPackage.benefits.map((benefit, index) => (
                        <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700">
                          {benefit}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Offer Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Offer Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Current Status</span>
                    <div className="mt-2">
                      <Select defaultValue={offerData.offerStatus}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Draft">Draft</SelectItem>
                          <SelectItem value="Extended">Extended</SelectItem>
                          <SelectItem value="Accepted">Accepted</SelectItem>
                          <SelectItem value="Declined">Declined</SelectItem>
                          <SelectItem value="Withdrawn">Withdrawn</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Rejection Reason</span>
                    <div className="mt-2">
                      <Select disabled={offerData.offerStatus !== "Declined"}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select reason if declined" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="salary">Salary expectations</SelectItem>
                          <SelectItem value="schedule">Schedule conflicts</SelectItem>
                          <SelectItem value="location">Location concerns</SelectItem>
                          <SelectItem value="benefits">Benefits package</SelectItem>
                          <SelectItem value="other">Other opportunity</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Background Check */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Background Check
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                {getStatusIcon(offerData.backgroundCheckStatus)}
                <span className="text-sm font-medium text-gray-700">Background Check Status:</span>
                <Badge variant="secondary" className={getStatusColor(offerData.backgroundCheckStatus)}>
                  {offerData.backgroundCheckStatus}
                </Badge>
              </div>
              
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> Background check is conducted by third-party vendor. Results typically available within 3-5 business days.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Pre-Hire Documents */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Pre-Hire Documents Checklist
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {offerData.preHireDocuments.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Checkbox checked={doc.status === "Completed"} />
                      <div>
                        <p className="text-sm font-medium">{doc.document}</p>
                        <p className="text-xs text-gray-500">Due: {doc.dueDate}</p>
                        {doc.uploadedDate && (
                          <p className="text-xs text-green-600">Uploaded: {doc.uploadedDate}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {getStatusIcon(doc.status)}
                      <Badge variant="secondary" className={getStatusColor(doc.status)}>
                        {doc.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 flex justify-end">
                <Button variant="outline" size="sm">
                  Send Reminder Email
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Final Offer Justification */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Final Offer Justification
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  <strong>Required:</strong> Please provide justification for this offer decision for audit and compliance purposes.
                </p>
                
                <Textarea
                  placeholder="Enter justification for the offer decision..."
                  className="min-h-[120px]"
                  defaultValue={offerData.finalOfferJustification}
                />
                
                <div className="flex justify-end gap-2">
                  <Button variant="outline">Save Draft</Button>
                  <Button>Submit Final Offer</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ScrollArea>
  );
};

export default StaffOfferCompliance;
