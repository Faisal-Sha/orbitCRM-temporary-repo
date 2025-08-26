
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Settings, Trash2, Save, Eye, Award, Download } from "lucide-react";

interface CertificatesProps {
  type: "staff" | "clients";
}

interface Certificate {
  id: string;
  name: string;
  awardingBody: string;
  template: string;
  completionLogic: string;
  autoAward?: boolean;
  active?: boolean;
  category?: string;
}

const Certificates: React.FC<CertificatesProps> = ({ type }) => {
  const isStaff = type === "staff";
  
  const [certificates, setCertificates] = useState<Certificate[]>([
    {
      id: "onboarding-cert",
      name: isStaff ? "Service Provider Onboarding Completion" : "Client Onboarding Completion",
      awardingBody: isStaff ? "Your Company Name" : "Wellness Platform",
      template: isStaff 
        ? "This certificate is awarded to [STAFF_NAME] for successfully completing the Service Provider Onboarding Program on [DATE]. This achievement demonstrates their commitment to professional excellence and readiness to serve clients."
        : "Congratulations! You have successfully completed the Client Onboarding Program. This certificate recognizes your commitment to your wellness journey.",
      autoAward: isStaff ? true : true,
      completionLogic: isStaff ? "onboarding_100_percent" : "onboarding_100_percent",
      active: true,
      category: "Onboarding"
    },
    {
      id: "training-cert",
      name: isStaff ? "Professional Development Training" : "Training Curriculum Graduate",
      awardingBody: isStaff ? "Your Company Name" : "Wellness Platform",
      template: isStaff
        ? "Congratulations to [STAFF_NAME] for completing the Professional Development Training Program. This certificate recognizes their dedication to continuous learning and professional growth in healthcare services."
        : "This certificate is awarded to recognize the successful completion of our comprehensive training curriculum. You have demonstrated dedication to personal growth and learning.",
      autoAward: isStaff ? true : true,
      completionLogic: isStaff ? "training_all_modules" : "training_all_modules",
      active: true,
      category: "Training"
    },
    {
      id: "excellence-cert",
      name: isStaff ? "Service Excellence Recognition" : "Community Engagement Champion",
      awardingBody: isStaff ? "Your Company Name" : "Wellness Platform",
      template: isStaff
        ? "[STAFF_NAME] has demonstrated exceptional service excellence and is hereby recognized for their outstanding contributions to client care and professional development."
        : "Awarded for outstanding participation and positive contributions to our community forum. Your engagement helps create a supportive environment for all members.",
      autoAward: isStaff ? false : false,
      completionLogic: isStaff ? "manual_award" : "manual_award",
      active: false,
      category: "Community"
    }
  ]);

  const completionLogicOptions = [
    { value: "onboarding_100_percent", label: "Onboarding 100% Complete" },
    { value: "training_all_modules", label: "All Training Modules Complete" },
    { value: "combined_completion", label: "Onboarding + Training Complete" },
    { value: "manual_award", label: "Manual Award Only" }
  ];

  const categories = ["Onboarding", "Training", "Community", "Achievement", "General"];

  const [editingCertificate, setEditingCertificate] = useState(null);
  const [isPreview, setIsPreview] = useState(false);

  const addCertificate = () => {
    const newCert: Certificate = {
      id: `cert-${Date.now()}`,
      name: "New Certificate",
      awardingBody: isStaff ? "Your Company Name" : "Wellness Platform",
      template: isStaff 
        ? "This certificate is awarded to [STAFF_NAME] for [ACHIEVEMENT] on [DATE]."
        : "This certificate is awarded to [CLIENT_NAME] for [ACHIEVEMENT] on [DATE].",
      autoAward: false,
      completionLogic: "manual_award",
      active: true,
      category: "General"
    };
    setCertificates([...certificates, newCert]);
  };

  const updateCertificate = (id: string, field: keyof Certificate, value: any) => {
    setCertificates(certificates.map(cert => 
      cert.id === id ? { ...cert, [field]: value } : cert
    ));
  };

  const deleteCertificate = (id: string) => {
    setCertificates(certificates.filter(cert => cert.id !== id));
  };

  const toggleCertificateStatus = (id: string) => {
    setCertificates(certificates.map(cert => 
      cert.id === id ? { ...cert, active: !cert.active } : cert
    ));
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      "Onboarding": "bg-blue-100 text-blue-800",
      "Training": "bg-green-100 text-green-800",
      "Community": "bg-purple-100 text-purple-800",
      "Achievement": "bg-orange-100 text-orange-800",
      "General": "bg-gray-100 text-gray-800",
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{isStaff ? "Staff" : ""} Certificate Builder</CardTitle>
              <p className="text-sm text-muted-foreground mt-2">
                {isStaff 
                  ? "Create and manage certificates for staff achievements and program completions"
                  : "Create and manage certificates for staff achievements and program completions"
                }
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                Preview Templates
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
          {/* Certificates List */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Certificate Templates</CardTitle>
                <Button onClick={addCertificate} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Certificate
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {certificates.map((certificate) => (
                  <div key={certificate.id} className="border rounded-lg p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Award className="h-5 w-5 text-primary" />
                        <input
                          type="text"
                          value={certificate.name}
                          onChange={(e) => updateCertificate(certificate.id, "name", e.target.value)}
                          className="text-lg font-semibold bg-transparent border-none outline-none focus:bg-background focus:border focus:rounded px-2 py-1"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        {certificate.category && (
                          <Badge className={getCategoryColor(certificate.category)}>
                            {certificate.category}
                          </Badge>
                        )}
                        <Badge variant={certificate.autoAward ? "default" : "secondary"}>
                          {certificate.autoAward ? "Auto Award" : "Manual"}
                        </Badge>
                        <Button variant="ghost" size="sm" onClick={() => toggleCertificateStatus(certificate.id)}>
                          <Settings className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteCertificate(certificate.id)}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Certificate Name</label>
                        <input
                          type="text"
                          value={certificate.name}
                          onChange={(e) => updateCertificate(certificate.id, "name", e.target.value)}
                          className="w-full p-2 border border-input rounded-md bg-background text-sm"
                          placeholder="Enter certificate name"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Awarding Body</label>
                        <input
                          type="text"
                          value={certificate.awardingBody}
                          onChange={(e) => updateCertificate(certificate.id, "awardingBody", e.target.value)}
                          className="w-full p-2 border border-input rounded-md bg-background text-sm"
                          placeholder="Enter organization name"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Category</label>
                      <select
                        value={certificate.category || ""}
                        onChange={(e) => updateCertificate(certificate.id, "category", e.target.value)}
                        className="w-full p-2 border border-input rounded-md bg-background text-sm"
                      >
                        {categories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Certificate Template</label>
                      <Textarea
                        value={certificate.template}
                        onChange={(e) => updateCertificate(certificate.id, "template", e.target.value)}
                        className="min-h-[100px]"
                        placeholder={isStaff ? "Enter certificate text template. Use [STAFF_NAME] for name and [DATE] for date placeholders." : "Enter certificate text template. Use [STAFF_NAME] for name and [DATE] for date placeholders."}
                      />
                      <p className="text-xs text-muted-foreground">
                        Available placeholders: [STAFF_NAME], [DATE], [ACHIEVEMENT]
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Completion Logic</label>
                        <select
                          value={certificate.completionLogic}
                          onChange={(e) => updateCertificate(certificate.id, "completionLogic", e.target.value)}
                          className="w-full p-2 border border-input rounded-md bg-background text-sm"
                        >
                          {completionLogicOptions.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="flex items-center space-x-2 pt-6">
                        <Switch
                          id={`auto-award-${certificate.id}`}
                          checked={certificate.autoAward || false}
                          onCheckedChange={(checked) => updateCertificate(certificate.id, "autoAward", checked)}
                        />
                        <label htmlFor={`auto-award-${certificate.id}`} className="text-sm font-medium">
                          Enable Auto Award
                        </label>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-4 border-t">
                      <Button variant="outline" size="sm">
                        Preview Certificate
                      </Button>
                      <Button variant="outline" size="sm">
                        Test Award Logic
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        /* Preview Mode */
        <Card>
          <CardHeader>
            <CardTitle>{isStaff ? "Staff" : "Client"} Certificate Gallery Preview</CardTitle>
            <p className="text-sm text-muted-foreground">
              This is how {isStaff ? "staff" : "clients"} will see their certificates
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {certificates.filter(cert => cert.active).map((certificate) => (
                <Card key={certificate.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <Award className="h-5 w-5 text-primary" />
                        <CardTitle className="text-lg leading-tight">{certificate.name}</CardTitle>
                      </div>
                      {certificate.category && (
                        <Badge className={getCategoryColor(certificate.category)}>
                          {certificate.category}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {certificate.template}
                    </p>
                    
                    <div className="space-y-2">
                      <div className="text-sm">
                        <span className="font-medium">Issued by:</span> {certificate.awardingBody}
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Date Earned:</span> Dec 15, 2024
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Award className="h-3 w-3" />
                        Earned
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
          </CardContent>
        </Card>
      )}

      {/* Global Certificate Settings - ALWAYS SHOW FOR BOTH STAFF AND CLIENTS */}
      <Card>
        <CardHeader>
          <CardTitle>Global Certificate Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium">Email Notifications</h4>
                <p className="text-xs text-muted-foreground">Send email when certificates are awarded</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium">Certificate Archive</h4>
                <p className="text-xs text-muted-foreground">Keep copies of all awarded certificates</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium">Digital Signatures</h4>
                <p className="text-xs text-muted-foreground">Include digital signature on certificates</p>
              </div>
              <Switch />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Certificates;
