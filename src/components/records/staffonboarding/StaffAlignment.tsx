
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DollarSign, Clock, Calendar, MessageSquare, Heart } from "lucide-react";

const StaffAlignment = () => {
  // Dummy alignment data
  const alignmentData = {
    preferences: {
      desiredSalary: "$75,000 - $85,000",
      desiredSchedule: "Full-time, flexible hours",
      desiredStartDate: "2024-03-01"
    },
    careerMotivation: [
      {
        question: "What drew you to this field?",
        answer: "I have always been passionate about helping others overcome mental health challenges and find their path to wellness."
      },
      {
        question: "What are your long-term career goals?",
        answer: "I aspire to specialize in trauma therapy and eventually open my own practice focused on serving underserved communities."
      },
      {
        question: "How do you handle stressful situations?",
        answer: "I practice mindfulness and self-care techniques, and I always seek supervision and support when needed."
      },
      {
        question: "What motivates you to work with clients?",
        answer: "Seeing clients make progress and regain hope in their lives is incredibly fulfilling and drives my passion for this work."
      },
      {
        question: "How do you stay current with best practices?",
        answer: "I regularly attend workshops, read professional journals, and participate in continuing education programs."
      },
      {
        question: "What is your approach to difficult clients?",
        answer: "I believe in building trust through empathy, patience, and consistent boundaries while maintaining professional therapeutic relationships."
      },
      {
        question: "How do you balance work and personal life?",
        answer: "I maintain clear boundaries, practice self-care, and have a strong support system to prevent burnout."
      }
    ],
    valuesAlignment: [
      {
        question: "How do you define compassionate care?",
        answer: "Compassionate care means meeting clients where they are, without judgment, and providing support that honors their dignity and autonomy."
      },
      {
        question: "What does diversity and inclusion mean to you?",
        answer: "It means creating a safe space where all clients feel valued, respected, and understood regardless of their background or identity."
      },
      {
        question: "How do you handle ethical dilemmas?",
        answer: "I consult with supervisors, review ethical guidelines, and always prioritize client safety and well-being in decision-making."
      },
      {
        question: "What role does teamwork play in your practice?",
        answer: "Collaboration with colleagues enhances client care and provides valuable perspectives that improve treatment outcomes."
      },
      {
        question: "How do you approach cultural competency?",
        answer: "I continuously educate myself about different cultures, examine my own biases, and adapt my approach to be culturally responsive."
      },
      {
        question: "What does professional integrity mean to you?",
        answer: "It means being honest, maintaining confidentiality, staying within my scope of practice, and always acting in the client's best interest."
      },
      {
        question: "How do you contribute to a positive work environment?",
        answer: "I bring positivity, support my colleagues, communicate openly, and contribute to a culture of learning and growth."
      },
      {
        question: "What is your philosophy on client empowerment?",
        answer: "I believe in helping clients discover their own strengths and resources, supporting their autonomy and self-determination."
      }
    ]
  };

  return (
    <ScrollArea className="h-full">
      <div className="app-card">
        <div className="space-y-6">
          {/* Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Preferences
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium text-gray-700">Desired Salary</span>
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    {alignmentData.preferences.desiredSalary}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-medium text-gray-700">Desired Schedule</span>
                  </div>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">
                    {alignmentData.preferences.desiredSchedule}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-purple-500" />
                    <span className="text-sm font-medium text-gray-700">Desired Start Date</span>
                  </div>
                  <Badge variant="outline" className="bg-purple-50 text-purple-700">
                    {alignmentData.preferences.desiredStartDate}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Career Motivation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Career Motivation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alignmentData.careerMotivation.map((item, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-4">
                    <h4 className="font-semibold text-sm mb-2">{item.question}</h4>
                    <p className="text-sm text-gray-700">{item.answer}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Values Alignment */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Values Alignment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alignmentData.valuesAlignment.map((item, index) => (
                  <div key={index} className="border-l-4 border-green-500 pl-4">
                    <h4 className="font-semibold text-sm mb-2">{item.question}</h4>
                    <p className="text-sm text-gray-700">{item.answer}</p>
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

export default StaffAlignment;
