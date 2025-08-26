
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Award, Download, Calendar, CheckCircle } from "lucide-react";

// Dummy certificate data
const certificates = [
  {
    id: 1,
    title: "Client Onboarding Completion",
    description: "Successfully completed all required onboarding tasks and orientation modules",
    issueDate: "2024-12-01",
    category: "Onboarding",
    status: "Earned",
    credentialId: "OB-2024-001",
  },
  {
    id: 2,
    title: "Training Curriculum Graduate",
    description: "Completed comprehensive client training curriculum with 100% module completion",
    issueDate: "2024-12-10",
    category: "Training",
    status: "Earned",
    credentialId: "TR-2024-002",
  },
  {
    id: 3,
    title: "Community Forum Participation",
    description: "Active participation in community discussions and peer support activities",
    issueDate: "2024-11-28",
    category: "Community",
    status: "Earned",
    credentialId: "CF-2024-003",
  },
  {
    id: 4,
    title: "Goal Setting Mastery",
    description: "Demonstrated proficiency in setting and tracking personal development goals",
    issueDate: "2024-11-25",
    category: "Personal Development",
    status: "Earned",
    credentialId: "GS-2024-004",
  },
  {
    id: 5,
    title: "Crisis Resources Awareness",
    description: "Completed crisis awareness training and emergency resources familiarization",
    issueDate: "2024-11-20",
    category: "Safety",
    status: "Earned",
    credentialId: "CR-2024-005",
  },
  {
    id: 6,
    title: "Effective Communication Skills",
    description: "Mastered communication techniques for therapeutic relationship building",
    issueDate: "2024-11-15",
    category: "Communication",
    status: "Earned",
    credentialId: "EC-2024-006",
  },
  {
    id: 7,
    title: "Client Portal Navigation Expert",
    description: "Demonstrated advanced proficiency in using all client portal features",
    issueDate: "2024-11-10",
    category: "Technology",
    status: "Earned",
    credentialId: "PN-2024-007",
  },
  {
    id: 8,
    title: "Provider Matching Success",
    description: "Successfully completed provider matching process and established therapeutic relationship",
    issueDate: "2024-11-05",
    category: "Matching",
    status: "Earned",
    credentialId: "PM-2024-008",
  },
  {
    id: 9,
    title: "HIPAA Privacy Compliance",
    description: "Completed HIPAA privacy training and demonstrated understanding of confidentiality requirements",
    issueDate: "2024-11-01",
    category: "Compliance",
    status: "Earned",
    credentialId: "HC-2024-009",
  },
  {
    id: 10,
    title: "Wellness Journey Milestone",
    description: "Achieved significant milestone in personal wellness and therapeutic progress",
    issueDate: "2024-10-28",
    category: "Wellness",
    status: "Earned",
    credentialId: "WJ-2024-010",
  },
];

const getCategoryColor = (category: string) => {
  const colors = {
    "Onboarding": "bg-blue-100 text-blue-800",
    "Training": "bg-green-100 text-green-800",
    "Community": "bg-purple-100 text-purple-800",
    "Personal Development": "bg-orange-100 text-orange-800",
    "Safety": "bg-red-100 text-red-800",
    "Communication": "bg-cyan-100 text-cyan-800",
    "Technology": "bg-gray-100 text-gray-800",
    "Matching": "bg-pink-100 text-pink-800",
    "Compliance": "bg-yellow-100 text-yellow-800",
    "Wellness": "bg-emerald-100 text-emerald-800",
  };
  return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800";
};

const PersonalCertificates = () => {
  const totalCertificates = certificates.length;
  const earnedCertificates = certificates.filter(cert => cert.status === "Earned").length;

  return (
    <div className="app-card space-y-6">
      {/* Header Stats */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                My Certificates
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Track your achievements and earned certifications
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">{earnedCertificates}</div>
              <div className="text-sm text-muted-foreground">Certificates Earned</div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Certificates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {certificates.map((certificate) => (
          <Card key={certificate.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg leading-tight">{certificate.title}</CardTitle>
                </div>
                <Badge className={getCategoryColor(certificate.category)}>
                  {certificate.category}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {certificate.description}
              </p>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Issued: {certificate.issueDate}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Credential ID: {certificate.credentialId}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <Badge variant="secondary" className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  {certificate.status}
                </Badge>
                <Button size="sm" variant="outline" className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Download
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary Card */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Award className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-primary">Certificate Collection Complete</h3>
              <p className="text-sm text-muted-foreground">
                You've earned {earnedCertificates} out of {totalCertificates} available certificates. Great job on your achievements!
              </p>
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Download All
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PersonalCertificates;
