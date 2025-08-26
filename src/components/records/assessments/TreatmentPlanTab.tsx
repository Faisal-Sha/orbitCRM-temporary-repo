
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sparkles } from "lucide-react";

const TreatmentPlanTab = () => {
  const [format, setFormat] = useState<string>("SOAP");

  // Dummy data for treatment plan (editable)
  const [treatmentPlan, setTreatmentPlan] = useState({
    approach: {
      modality: "Cognitive Behavioral Therapy",
      frequency: "Weekly",
      duration: "Medium-term (12-16 weeks)",
      rationale:
        "Cognitive Behavioral Therapy (CBT) is recommended as the primary treatment modality based on strong empirical support for anxiety disorders. CBT will focus on identifying and challenging maladaptive thought patterns, reducing avoidance behaviors, and developing effective coping strategies. Weekly sessions are recommended initially to establish therapeutic rapport and momentum.",
    },
    goals: [
      {
        title:
          "Reduce frequency of panic attacks from 2-3 times per week to less than 1 per week within 8 weeks",
        interventions:
          "- Teach diaphragmatic breathing\n- Practice progressive muscle relaxation\n- Identify and challenge catastrophic thinking\n- Develop panic attack action plan",
        measurement:
          "- Client self-report\n- Weekly panic attack frequency log\n- Subjective Units of Distress Scale (SUDS)\n- Panic Disorder Severity Scale (PDSS)",
      },
      {
        title:
          "Improve sleep quality from current 4-5 hours per night to 7+ hours per night within 6 weeks",
        interventions:
          "- Establish consistent sleep/wake schedule\n- Implement sleep hygiene practices\n- Evening relaxation routine\n- Limit screen time before bed\n- Mindfulness meditation",
        measurement:
          "- Sleep diary\n- Pittsburgh Sleep Quality Index\n- Self-reported sleep quality rating (1-10)\n- Insomnia Severity Index",
      },
      {
        title:
          "Return to full work schedule (40 hours/week) without anxiety-related absences within 12 weeks",
        interventions:
          "- Gradual exposure to anxiety-provoking work situations\n- Develop workplace coping strategies\n- Time management and prioritization skills\n- Assertiveness training\n- Stress management techniques",
        measurement:
          "- Work attendance log\n- Workplace Anxiety Scale\n- Self-reported confidence ratings\n- Work Performance Questionnaire\n- Feedback from employer (if appropriate)",
      },
    ],
  });

  const handleGenerateWithAI = () => {
    // This would be connected to an AI service in a real implementation
    console.log("Generating treatment plan with AI");
  };

  return (
    <div className="app-card">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-xl font-semibold">Treatment Plan</h3>
            <p className="text-sm text-muted-foreground">
              Outline the therapeutic strategies, goals, and interventions
              guiding client care.
            </p>
          </div>
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={handleGenerateWithAI}
          >
            <Sparkles className="h-4 w-4" />
            Auto-generate with AI
          </Button>
        </div>

        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="format">Treatment Format</Label>
          <Select value={format} onValueChange={setFormat}>
            <SelectTrigger id="format">
              <SelectValue placeholder="Select format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="SOAP">SOAP</SelectItem>
              <SelectItem value="DAP">DAP</SelectItem>
              <SelectItem value="APIE">APIE</SelectItem>
              <SelectItem value="ADPIE">ADPIE</SelectItem>
              <SelectItem value="SBAR">SBAR</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Treatment Approach */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold">Treatment Approach</h4>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">
                Treatment Modality
              </Label>
              <Textarea
                value={treatmentPlan.approach.modality}
                onChange={(e) =>
                  setTreatmentPlan({
                    ...treatmentPlan,
                    approach: {
                      ...treatmentPlan.approach,
                      modality: e.target.value,
                    },
                  })
                }
                className="min-h-[60px]"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">
                Treatment Frequency
              </Label>
              <Textarea
                value={treatmentPlan.approach.frequency}
                onChange={(e) =>
                  setTreatmentPlan({
                    ...treatmentPlan,
                    approach: {
                      ...treatmentPlan.approach,
                      frequency: e.target.value,
                    },
                  })
                }
                className="min-h-[60px]"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">
                Estimated Duration
              </Label>
              <Textarea
                value={treatmentPlan.approach.duration}
                onChange={(e) =>
                  setTreatmentPlan({
                    ...treatmentPlan,
                    approach: {
                      ...treatmentPlan.approach,
                      duration: e.target.value,
                    },
                  })
                }
                className="min-h-[60px]"
              />
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <Label className="text-sm text-muted-foreground">
              Treatment Rationale
            </Label>
            <Textarea
              value={treatmentPlan.approach.rationale}
              onChange={(e) =>
                setTreatmentPlan({
                  ...treatmentPlan,
                  approach: {
                    ...treatmentPlan.approach,
                    rationale: e.target.value,
                  },
                })
              }
              className="min-h-[120px]"
            />
          </div>
        </div>

        {/* SMART Goals */}
        <div className="space-y-6">
          <h4 className="text-lg font-semibold">SMART Treatment Goals</h4>
          {treatmentPlan.goals.map((goal, index) => (
            <div
              key={index}
              className="space-y-3 pb-4 border-b last:border-0 last:pb-0"
            >
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">
                  Goal {index + 1}
                </Label>
                <Textarea
                  value={goal.title}
                  onChange={(e) => {
                    const updatedGoals = [...treatmentPlan.goals];
                    updatedGoals[index] = {
                      ...updatedGoals[index],
                      title: e.target.value,
                    };
                    setTreatmentPlan({
                      ...treatmentPlan,
                      goals: updatedGoals,
                    });
                  }}
                  className="min-h-[80px]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div className="space-y-1">
                  <Label className="text-sm text-muted-foreground">
                    Interventions
                  </Label>
                  <Textarea
                    value={goal.interventions}
                    onChange={(e) => {
                      const updatedGoals = [...treatmentPlan.goals];
                      updatedGoals[index] = {
                        ...updatedGoals[index],
                        interventions: e.target.value,
                      };
                      setTreatmentPlan({
                        ...treatmentPlan,
                        goals: updatedGoals,
                      });
                    }}
                    className="min-h-[120px] whitespace-pre-line"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-sm text-muted-foreground">
                    Measurement
                  </Label>
                  <Textarea
                    value={goal.measurement}
                    onChange={(e) => {
                      const updatedGoals = [...treatmentPlan.goals];
                      updatedGoals[index] = {
                        ...updatedGoals[index],
                        measurement: e.target.value,
                      };
                      setTreatmentPlan({
                        ...treatmentPlan,
                        goals: updatedGoals,
                      });
                    }}
                    className="min-h-[120px] whitespace-pre-line"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TreatmentPlanTab;
