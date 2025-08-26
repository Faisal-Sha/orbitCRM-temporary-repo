
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

const TreatmentPlanTab = () => {
  // Dummy data for treatment plan (read-only)
  const treatmentPlan = {
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
  };

  return (
    <div className="app-card">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Treatment Plan</h2>
          <div className="bg-amber-100 text-amber-800 px-3 py-1 rounded-md text-sm">
            Read-Only View
          </div>
        </div>

        {/* Treatment Approach */}
        <Card>
          <CardHeader>
            <CardTitle>Treatment Approach</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">
                  Treatment Modality
                </Label>
                <p className="font-medium">{treatmentPlan.approach.modality}</p>
              </div>

              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">
                  Treatment Frequency
                </Label>
                <p className="font-medium">{treatmentPlan.approach.frequency}</p>
              </div>

              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">
                  Estimated Duration
                </Label>
                <p className="font-medium">{treatmentPlan.approach.duration}</p>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <Label className="text-sm text-muted-foreground">
                Treatment Rationale
              </Label>
              <div className="p-3 bg-muted rounded-md">
                <p>{treatmentPlan.approach.rationale}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SMART Goals */}
        <Card>
          <CardHeader>
            <CardTitle>SMART Treatment Goals</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {treatmentPlan.goals.map((goal, index) => (
              <div
                key={index}
                className="space-y-3 pb-4 border-b last:border-0 last:pb-0"
              >
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">
                    Goal {index + 1}
                  </Label>
                  <div className="p-3 bg-muted rounded-md">
                    <p className="font-medium">{goal.title}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div className="space-y-1">
                    <Label className="text-sm text-muted-foreground">
                      Interventions
                    </Label>
                    <div className="p-3 bg-muted rounded-md whitespace-pre-line">
                      {goal.interventions}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm text-muted-foreground">
                      Measurement
                    </Label>
                    <div className="p-3 bg-muted rounded-md whitespace-pre-line">
                      {goal.measurement}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TreatmentPlanTab;
