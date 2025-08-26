
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar, GraduationCap, Award, Briefcase, Link, Globe } from "lucide-react";

const StaffProfessional = () => {
  // Dummy professional data
  const professionalData = {
    dateApplied: "2024-01-15",
    desiredRoles: ["Clinician", "Therapist", "Counselor"],
    education: [
      {
        degree: "Master of Social Work (MSW)",
        institution: "University of California, Los Angeles",
        graduationYear: "2020",
        gpa: "3.8",
        relevant: true
      },
      {
        degree: "Bachelor of Psychology",
        institution: "University of Southern California",
        graduationYear: "2018",
        gpa: "3.6",
        relevant: true
      }
    ],
    licenses: [
      {
        name: "Licensed Clinical Social Worker (LCSW)",
        state: "California",
        licenseNumber: "LCSW-12345",
        issueDate: "2022-03-15",
        expirationDate: "2024-03-15",
        status: "Active"
      },
      {
        name: "Licensed Marriage and Family Therapist (LMFT)",
        state: "California",
        licenseNumber: "LMFT-67890",
        issueDate: "2021-08-20",
        expirationDate: "2023-08-20",
        status: "Expired"
      }
    ],
    workHistory: [
      {
        position: "Senior Therapist",
        company: "Mindful Therapy Center",
        duration: "2022 - Present",
        description: "Provided individual and group therapy sessions, specialized in anxiety and depression treatment.",
        current: true
      },
      {
        position: "Clinical Social Worker",
        company: "Community Health Services",
        duration: "2020 - 2022",
        description: "Conducted assessments and provided crisis intervention services.",
        current: false
      }
    ],
    portfolioLinks: [
      {
        title: "LinkedIn Profile",
        url: "https://linkedin.com/in/johndoe",
        type: "LinkedIn"
      },
      {
        title: "Professional Website",
        url: "https://johndoetherapy.com",
        type: "Website"
      }
    ],
    languages: [
      { language: "English", proficiency: "Native" },
      { language: "Spanish", proficiency: "Fluent" },
      { language: "French", proficiency: "Conversational" }
    ]
  };

  const getProficiencyColor = (proficiency: string) => {
    switch (proficiency) {
      case "Native":
        return "bg-green-100 text-green-800";
      case "Fluent":
        return "bg-blue-100 text-blue-800";
      case "Conversational":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Expired":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <ScrollArea className="h-full">
      <div className="app-card">
        <div className="space-y-6">
          {/* Date Applied */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Application Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">Date Applied</p>
                  <p className="text-sm text-gray-500">{professionalData.dateApplied}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Desired Role(s)</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {professionalData.desiredRoles.map((role, index) => (
                      <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700">
                        {role}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Education */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Education
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {professionalData.education.map((edu, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-4">
                    <h4 className="font-semibold">{edu.degree}</h4>
                    <p className="text-sm text-gray-600">{edu.institution}</p>
                    <div className="flex items-center gap-4 mt-1">
                      <p className="text-sm text-gray-500">Graduated: {edu.graduationYear}</p>
                      <p className="text-sm text-gray-500">GPA: {edu.gpa}</p>
                      {edu.relevant && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          Relevant
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Licenses */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Professional Licensing/Certification
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {professionalData.licenses.map((license, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">{license.name}</h4>
                        <p className="text-sm text-gray-600">{license.state}</p>
                        <p className="text-sm text-gray-500">License #: {license.licenseNumber}</p>
                      </div>
                      <Badge variant="secondary" className={getStatusColor(license.status)}>
                        {license.status}
                      </Badge>
                    </div>
                    <div className="mt-2 flex items-center gap-4">
                      <p className="text-sm text-gray-500">Issued: {license.issueDate}</p>
                      <p className="text-sm text-gray-500">Expires: {license.expirationDate}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Work History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Work History & Experience
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {professionalData.workHistory.map((job, index) => (
                  <div key={index} className="border-l-4 border-green-500 pl-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">{job.position}</h4>
                        <p className="text-sm text-gray-600">{job.company}</p>
                        <p className="text-sm text-gray-500">{job.duration}</p>
                      </div>
                      {job.current && (
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                          Current
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-700 mt-2">{job.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Portfolio Links */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link className="h-5 w-5" />
                Portfolio/Previous Jobs Links
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {professionalData.portfolioLinks.map((link, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Globe className="h-4 w-4 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium">{link.title}</p>
                      <p className="text-sm text-blue-600">{link.url}</p>
                    </div>
                    <Badge variant="outline" className="ml-auto">
                      {link.type}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Languages */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Languages
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {professionalData.languages.map((lang, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">{lang.language}</span>
                    <Badge variant="secondary" className={getProficiencyColor(lang.proficiency)}>
                      {lang.proficiency}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ScrollArea>
  );
};

export default StaffProfessional;
