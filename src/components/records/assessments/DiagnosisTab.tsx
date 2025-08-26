
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

const DiagnosisTab = () => {
  const [format, setFormat] = useState<string>("SOAP");

  const handleGenerateWithAI = () => {
    // This would be connected to an AI service in a real implementation
    console.log("Generating diagnosis with AI");
  };

  return (
    <div className="app-card">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-xl font-semibold">
              Structured Clinical Diagnosis
            </h3>
            <p className="text-sm text-muted-foreground">
              Document your clinical assessment using standardized formats
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
          <Label htmlFor="format">Diagnosis Format</Label>
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

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="subjective" className="text-base font-medium">
              Subjective (S)
            </Label>
            <p className="text-sm text-muted-foreground">
              Key client-reported issues, symptoms, and concerns
            </p>
            <Textarea
              id="subjective"
              className="min-h-[120px]"
              defaultValue="Client reports persistent feelings of sadness and hopelessness for the past 3 months following job loss. Describes difficulty sleeping (averaging 4-5 hours per night), decreased appetite with 10lb weight loss, and withdrawal from previously enjoyed activities. Reports occasional passive suicidal ideation without plan or intent. Denies homicidal ideation or psychotic symptoms."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="objective" className="text-base font-medium">
              Objective (O)
            </Label>
            <p className="text-sm text-muted-foreground">
              Mental status examination and clinical observations
            </p>
            <Textarea
              id="objective"
              className="min-h-[120px]"
              defaultValue="Client presented with disheveled appearance and poor eye contact. Affect was flat and mood described as 'empty.' Speech was slow but coherent. Thought process logical and goal-directed. Cognitive functions intact. Client became tearful when discussing job loss. No evidence of perceptual disturbances. Insight and judgment appear fair. MSE indicates symptoms consistent with major depressive episode."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="assessment" className="text-base font-medium">
              Assessment (A)
            </Label>
            <p className="text-sm text-muted-foreground">
              Preliminary diagnosis, clinical rationale, and differential
              considerations
            </p>
            <Textarea
              id="assessment"
              className="min-h-[120px]"
              defaultValue="Client meets DSM-5 criteria for Major Depressive Disorder, single episode, moderate (F32.1). Symptoms include depressed mood, anhedonia, significant weight loss, insomnia, and passive suicidal ideation persisting for 3+ months. Precipitated by job loss and financial stressors. Rule out Adjustment Disorder with Depressed Mood and consider screening for comorbid Generalized Anxiety Disorder given reported rumination and sleep disturbance."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="plan" className="text-base font-medium">
              Plan (P)
            </Label>
            <p className="text-sm text-muted-foreground">
              Treatment recommendations, further assessment, and
              psychoeducation
            </p>
            <Textarea
              id="plan"
              className="min-h-[120px]"
              defaultValue="1. Schedule weekly individual therapy sessions using CBT approach focused on negative thought patterns and behavioral activation.
2. Refer to psychiatrist for medication evaluation.
3. Administer PHQ-9 and GAD-7 at next session to establish baseline measurements.
4. Provide psychoeducation on depression and sleep hygiene.
5. Develop safety plan and provide crisis resources.
6. Connect client with local job search resources and support groups.
7. Reassess in 4 weeks for treatment response."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiagnosisTab;
