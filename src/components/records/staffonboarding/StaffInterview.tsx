
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Calendar, User, Briefcase, Star, TrendingUp, CheckCircle, XCircle } from "lucide-react";

const StaffInterview = () => {
  // Dummy interview data
  const interviewData = {
    interviewInfo: {
      date: "2024-01-22",
      interviewer: "Dr. Sarah Johnson",
      roleInterviewedFor: "Clinical Therapist"
    },
    scoreCategories: [
      {
        category: "Communication",
        score: 4,
        notes: "Excellent verbal and written communication skills. Clear and professional in responses."
      },
      {
        category: "Emotional Intelligence",
        score: 5,
        notes: "Demonstrated high emotional awareness and empathy. Showed understanding of client perspectives."
      },
      {
        category: "Clinical/Technical Judgment",
        score: 4,
        notes: "Strong clinical knowledge and decision-making skills. Appropriately cautious in complex scenarios."
      },
      {
        category: "Client-Facing Readiness",
        score: 4,
        notes: "Confident and professional demeanor. Good rapport-building skills demonstrated."
      },
      {
        category: "Mission & Values Alignment",
        score: 5,
        notes: "Strongly aligned with our mission of compassionate care. Values diversity and inclusion."
      }
    ],
    overallRecommendation: "Yes",
    confidenceLevel: "High",
    finalScore: 4.4,
    timestamp: "2024-01-22 14:30:00"
  };

  const getScoreColor = (score: number) => {
    if (score >= 4.5) return "text-green-600";
    if (score >= 3.5) return "text-blue-600";
    if (score >= 2.5) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBadgeColor = (score: number) => {
    if (score >= 4.5) return "bg-green-100 text-green-800";
    if (score >= 3.5) return "bg-blue-100 text-blue-800";
    if (score >= 2.5) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const getConfidenceColor = (level: string) => {
    switch (level) {
      case "High":
        return "bg-green-100 text-green-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Low":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const renderStars = (score: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= score ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
            }`}
          />
        ))}
        <span className={`ml-2 font-semibold ${getScoreColor(score)}`}>
          {score}/5
        </span>
      </div>
    );
  };

  return (
    <ScrollArea className="h-full">
      <div className="app-card">
        <div className="space-y-6">
          {/* Interview Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Interview Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-medium text-gray-700">Date of Interview</span>
                  </div>
                  <p className="text-sm text-gray-600">{interviewData.interviewInfo.date}</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium text-gray-700">Interviewer</span>
                  </div>
                  <p className="text-sm text-gray-600">{interviewData.interviewInfo.interviewer}</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-purple-500" />
                    <span className="text-sm font-medium text-gray-700">Role Interviewed For</span>
                  </div>
                  <p className="text-sm text-gray-600">{interviewData.interviewInfo.roleInterviewedFor}</p>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">
                  <strong>Submitted:</strong> {interviewData.timestamp}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Score Categories */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Evaluation Scores
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {interviewData.scoreCategories.map((category, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-semibold">{category.category}</h4>
                      <div className="flex flex-col items-end">
                        {renderStars(category.score)}
                        <Badge variant="secondary" className={`mt-1 ${getScoreBadgeColor(category.score)}`}>
                          {category.score >= 4.5 ? "Excellent" : 
                           category.score >= 3.5 ? "Good" : 
                           category.score >= 2.5 ? "Fair" : "Poor"}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700">{category.notes}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Overall Assessment */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Overall Assessment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <span className="text-sm font-medium text-gray-700">Overall Recommendation</span>
                  <div className="flex items-center gap-2">
                    {interviewData.overallRecommendation === "Yes" ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                    <Badge variant="secondary" className={
                      interviewData.overallRecommendation === "Yes" ? 
                      "bg-green-100 text-green-800" : 
                      "bg-red-100 text-red-800"
                    }>
                      {interviewData.overallRecommendation}
                    </Badge>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <span className="text-sm font-medium text-gray-700">Confidence Level</span>
                  <Badge variant="secondary" className={getConfidenceColor(interviewData.confidenceLevel)}>
                    {interviewData.confidenceLevel}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <span className="text-sm font-medium text-gray-700">Final Score</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-2xl font-bold ${getScoreColor(interviewData.finalScore)}`}>
                      {interviewData.finalScore}
                    </span>
                    <span className="text-sm text-gray-500">/5.0</span>
                  </div>
                </div>
              </div>
              
              {/* Score Chart Placeholder */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-3">Score Breakdown</h4>
                <div className="space-y-2">
                  {interviewData.scoreCategories.map((category, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <span className="text-sm font-medium w-32">{category.category}</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(category.score / 5) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium w-8">{category.score}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2">
            <Button variant="outline">Edit Evaluation</Button>
            <Button variant="outline">Export Report</Button>
            <Button>Save Changes</Button>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
};

export default StaffInterview;
