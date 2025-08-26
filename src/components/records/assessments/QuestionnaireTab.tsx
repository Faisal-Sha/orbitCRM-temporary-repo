import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, FileText } from "lucide-react";

const QuestionnaireTab = () => {
  // State for collapsible sections
  const [isPresentingProblemOpen, setIsPresentingProblemOpen] = useState(true);
  const [isPastPsychiatricOpen, setIsPastPsychiatricOpen] = useState(true);
  const [isMedicalHistoryOpen, setIsMedicalHistoryOpen] = useState(true);
  const [isSubstanceUseOpen, setIsSubstanceUseOpen] = useState(true);
  const [isFamilyHistoryOpen, setIsFamilyHistoryOpen] = useState(true);
  const [isMentalStatusOpen, setIsMentalStatusOpen] = useState(true);
  const [isMseDetailsOpen, setIsMseDetailsOpen] = useState(true);
  const [isRiskAssessmentOpen, setIsRiskAssessmentOpen] = useState(true);
  const [isStrengthsResourcesOpen, setIsStrengthsResourcesOpen] =
    useState(true);
  const [isClinicalGoalsOpen, setIsClinicalGoalsOpen] = useState(true);

  // Dummy data
  const dummyData = {
    presentingProblem: {
      chiefComplaint:
        "Anxiety and depression symptoms worsening over past 3 months",
      historyOfPresentIllness:
        "Patient reports increasing anxiety, difficulty sleeping, and low mood since losing job. Symptoms include racing thoughts, fatigue, and social withdrawal.",
    },
    pastPsychiatricHistory: {
      previousDiagnoses: [
        "Major Depressive Disorder",
        "Generalized Anxiety Disorder",
      ],
      previousTreatments: ["CBT (2019-2020)", "Group therapy (2020)"],
      medications:
        "Sertraline 50mg daily (2019-2021), Lorazepam 0.5mg as needed for anxiety (2020)",
    },
    medicalHistory: {
      conditions: ["Hypertension", "Asthma"],
      medications: "Lisinopril 10mg daily, Albuterol inhaler as needed",
      allergies: "Penicillin (hives), Pollen (seasonal)",
    },
    substanceUse: {
      alcohol: {
        frequency: "weekly",
        amount: "2-3 drinks per occasion",
        lastUse: "3 days ago",
      },
      tobacco: {
        frequency: "never",
        amount: "",
        lastUse: "",
      },
      cannabis: {
        frequency: "monthly",
        amount: "small amount",
        lastUse: "2 weeks ago",
      },
      other: "No other substance use reported",
    },
    familyHistory: {
      medical:
        "Father: Hypertension, Type 2 Diabetes\nMother: Migraines\nMaternal Grandmother: Breast cancer",
      psychiatric:
        "Mother: History of depression\nMaternal aunt: Anxiety disorder\nNo other known psychiatric conditions",
    },
    mentalStatus: {
      behavioralObservations:
        "Client arrived on time and was appropriately dressed. Maintained good eye contact throughout the session. Speech was clear and at normal rate and volume. Cooperative with the assessment process.",
      appearance: "Well-groomed",
      behavior: "Cooperative",
      speech: "Normal rate and rhythm",
      mood: "Depressed",
      affect: "Congruent with mood",
      thoughtProcess: "Logical",
      thoughtContent: "No delusions or hallucinations",
      cognition: "Alert and oriented x3",
      insight: "Good",
      judgment: "Fair",
    },
    riskAssessment: {
      suicidalIdeation: "none",
      suicidalIntent: "none",
      homicidalIdeation: "none",
      selfHarmRisk: 1,
      harmToOthersRisk: 1,
      substanceAbuseRisk: 2,
      impulsivityRisk: 2,
      overallRisk: "low",
      safetyPlan:
        "Client denies current suicidal or homicidal ideation. No history of suicide attempts. Has good support system with family and friends. Agrees to contact therapist or crisis line if thoughts of self-harm arise.",
    },
    strengthsResources:
      "Client is highly motivated for treatment. Has strong family support system, especially from spouse. Employed full-time with stable housing. Good problem-solving skills and insight into condition. Regular exercise routine helps manage stress. Has responded well to therapy in the past.",
    clinicalGoals:
      "1. Reduce anxiety symptoms by 50% within 3 months through weekly CBT sessions and daily mindfulness practice.\n2. Improve sleep quality to 6+ hours of uninterrupted sleep per night within 2 months.\n3. Develop 3-5 healthy coping strategies for managing work stress within 1 month.\n4. Reconnect with social support network by scheduling at least one social activity per week.",
  };

  // Get current date and time in the format required for datetime-local input
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const currentDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;

  // Dummy data for assessment info
  const assessmentInfo = {
    date: currentDateTime,
    assessor: "Dr. Sarah Johnson",
  };

  return (
    <div className="app-card">
      <div className="space-y-6">
        {/* Assessment Information */}
        <Card>
          <CardHeader>
            <CardTitle>Assessment Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="assessment-date">Date/Time of Assessment</Label>
              <Input
                id="assessment-date"
                type="datetime-local"
                defaultValue={assessmentInfo.date}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="assessor">Assessor</Label>
              <Input
                id="assessor"
                defaultValue={assessmentInfo.assessor}
                readOnly
              />
            </div>
          </CardContent>
        </Card>

        {/* Application Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Application Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-2 text-xs text-gray-500">
              Application completed on 3/19/2024, 3:07 PM
            </div>
            <div className="mb-3">
              <h4 className="text-xs font-semibold text-gray-600 mb-1.5">Priority Goals</h4>
              <div className="flex flex-wrap gap-2">
                {["Manage stress", "Find new job", "Improve health"].map((item, idx) => (
                  <Badge key={idx} variant="secondary" className="bg-gray-200 text-gray-700 hover:bg-gray-300">
                    {item}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="mb-3">
              <h4 className="text-xs font-semibold text-gray-600 mb-1.5">Preference & Interests</h4>
              <div className="flex flex-wrap gap-2">
                {["Black mentor", "Phone calls", "Community events"].map((item, idx) => (
                  <Badge key={idx} variant="secondary" className="bg-gray-200 text-gray-700 hover:bg-gray-300">
                    {item}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="mb-3">
              <h4 className="text-xs font-semibold text-gray-600 mb-1.5">Expectation</h4>
              <div className="flex flex-wrap gap-2">
                {["Supportive communication"].map((item, idx) => (
                  <Badge key={idx} variant="secondary" className="bg-gray-200 text-gray-700 hover:bg-gray-300">
                    {item}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-gray-600 mb-1.5 mt-3">Applicant Notes</h4>
              <p className="text-xs text-gray-600 bg-gray-50 p-3 rounded border">Looking for a therapist who is understanding and can provide practical coping strategies. Open to group sessions if available.</p>
            </div>
          </CardContent>
        </Card>

        {/* Template Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Questionnaire Template</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="template">Select Template</Label>
              <Select defaultValue="standard">
                <SelectTrigger id="template">
                  <SelectValue placeholder="Select template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard Assessment</SelectItem>
                  <SelectItem value="brief">Brief Assessment</SelectItem>
                  <SelectItem value="comprehensive">
                    Comprehensive Assessment
                  </SelectItem>
                  <SelectItem value="trauma">Trauma-Focused</SelectItem>
                  <SelectItem value="substance">Substance Use</SelectItem>
                  <SelectItem value="custom">Custom Template</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Presenting Problem & History */}
        <Collapsible
          open={isPresentingProblemOpen}
          onOpenChange={setIsPresentingProblemOpen}
          className="w-full"
        >
          <Card>
            <CardHeader className="cursor-pointer flex flex-row items-center justify-between">
              <CardTitle>Presenting Problem & History</CardTitle>
              <CollapsibleTrigger>
                {isPresentingProblemOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </CollapsibleTrigger>
            </CardHeader>
            <CollapsibleContent>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="chief-complaint">Chief Complaint</Label>
                  <Textarea
                    id="chief-complaint"
                    placeholder="Enter the client's primary reason for seeking treatment"
                    defaultValue={dummyData.presentingProblem.chiefComplaint}
                    className="min-h-[100px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="history-present-illness">
                    History of Present Illness
                  </Label>
                  <Textarea
                    id="history-present-illness"
                    placeholder="Describe onset, duration, triggers, and impact on functioning"
                    defaultValue={
                      dummyData.presentingProblem.historyOfPresentIllness
                    }
                    className="min-h-[150px]"
                  />
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* Past Psychiatric History */}
        <Collapsible
          open={isPastPsychiatricOpen}
          onOpenChange={setIsPastPsychiatricOpen}
          className="w-full"
        >
          <Card>
            <CardHeader className="cursor-pointer flex flex-row items-center justify-between">
              <CardTitle>Past Psychiatric History</CardTitle>
              <CollapsibleTrigger>
                {isPastPsychiatricOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </CollapsibleTrigger>
            </CardHeader>
            <CollapsibleContent>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Previous Diagnoses</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      "Major Depressive Disorder",
                      "Generalized Anxiety Disorder",
                      "Bipolar Disorder",
                      "PTSD",
                      "ADHD",
                      "Substance Use Disorder",
                      "Eating Disorder",
                      "OCD",
                    ].map((diagnosis) => (
                      <div
                        className="flex items-center space-x-2"
                        key={diagnosis}
                      >
                        <Checkbox
                          id={`diagnosis-${diagnosis.replace(/\s+/g, "-").toLowerCase()}`}
                          defaultChecked={dummyData.pastPsychiatricHistory.previousDiagnoses.includes(
                            diagnosis,
                          )}
                        />
                        <Label
                          htmlFor={`diagnosis-${diagnosis
                            .replace(/\s+/g, "-")
                            .toLowerCase()}`}
                          className="font-normal"
                        >
                          {diagnosis}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="previous-treatments">Previous Treatments</Label>
                  <Textarea
                    id="previous-treatments"
                    placeholder="List previous therapy, hospitalizations, etc."
                    defaultValue={dummyData.pastPsychiatricHistory.previousTreatments.join(
                      "\n",
                    )}
                    className="min-h-[100px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="psych-medications">
                    Psychiatric Medications (Past & Current)
                  </Label>
                  <Textarea
                    id="psych-medications"
                    placeholder="List medication name, dosage, dates, and response"
                    defaultValue={dummyData.pastPsychiatricHistory.medications}
                    className="min-h-[100px]"
                  />
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* Medical History */}
        <Collapsible
          open={isMedicalHistoryOpen}
          onOpenChange={setIsMedicalHistoryOpen}
          className="w-full"
        >
          <Card>
            <CardHeader className="cursor-pointer flex flex-row items-center justify-between">
              <CardTitle>Medical History</CardTitle>
              <CollapsibleTrigger>
                {isMedicalHistoryOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </CollapsibleTrigger>
            </CardHeader>
            <CollapsibleContent>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Medical Conditions</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      "Hypertension",
                      "Diabetes",
                      "Asthma",
                      "Heart Disease",
                      "Thyroid Disorder",
                      "Seizures",
                      "Chronic Pain",
                      "Autoimmune Disorder",
                    ].map((condition) => (
                      <div
                        className="flex items-center space-x-2"
                        key={condition}
                      >
                        <Checkbox
                          id={`condition-${condition.replace(/\s+/g, "-").toLowerCase()}`}
                          defaultChecked={dummyData.medicalHistory.conditions.includes(
                            condition,
                          )}
                        />
                        <Label
                          htmlFor={`condition-${condition
                            .replace(/\s+/g, "-")
                            .toLowerCase()}`}
                          className="font-normal"
                        >
                          {condition}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="medical-medications">Current Medications</Label>
                  <Textarea
                    id="medical-medications"
                    placeholder="List medication name, dosage, and purpose"
                    defaultValue={dummyData.medicalHistory.medications}
                    className="min-h-[100px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="allergies">Allergies</Label>
                  <Textarea
                    id="allergies"
                    placeholder="List allergies and reactions"
                    defaultValue={dummyData.medicalHistory.allergies}
                    className="min-h-[80px]"
                  />
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* Substance Use History */}
        <Collapsible
          open={isSubstanceUseOpen}
          onOpenChange={setIsSubstanceUseOpen}
          className="w-full"
        >
          <Card>
            <CardHeader className="cursor-pointer flex flex-row items-center justify-between">
              <CardTitle>Substance Use History</CardTitle>
              <CollapsibleTrigger>
                {isSubstanceUseOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </CollapsibleTrigger>
            </CardHeader>
            <CollapsibleContent>
              <CardContent className="space-y-4">
                {/* Alcohol */}
                <div className="space-y-2">
                  <Label className="font-semibold">Alcohol</Label>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="alcohol-frequency">Frequency</Label>
                      <Select
                        defaultValue={dummyData.substanceUse.alcohol.frequency}
                      >
                        <SelectTrigger id="alcohol-frequency">
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="never">Never</SelectItem>
                          <SelectItem value="rarely">Rarely</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="daily">Daily</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="alcohol-amount">Amount</Label>
                      <Input
                        id="alcohol-amount"
                        placeholder="Amount per occasion"
                        defaultValue={dummyData.substanceUse.alcohol.amount}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="alcohol-last-use">Last Use</Label>
                      <Input
                        id="alcohol-last-use"
                        placeholder="When last used"
                        defaultValue={dummyData.substanceUse.alcohol.lastUse}
                      />
                    </div>
                  </div>
                </div>

                {/* Tobacco */}
                <div className="space-y-2">
                  <Label className="font-semibold">Tobacco/Nicotine</Label>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="tobacco-frequency">Frequency</Label>
                      <Select
                        defaultValue={dummyData.substanceUse.tobacco.frequency}
                      >
                        <SelectTrigger id="tobacco-frequency">
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="never">Never</SelectItem>
                          <SelectItem value="rarely">Rarely</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="daily">Daily</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tobacco-amount">Amount</Label>
                      <Input
                        id="tobacco-amount"
                        placeholder="Amount per occasion"
                        defaultValue={dummyData.substanceUse.tobacco.amount}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tobacco-last-use">Last Use</Label>
                      <Input
                        id="tobacco-last-use"
                        placeholder="When last used"
                        defaultValue={dummyData.substanceUse.tobacco.lastUse}
                      />
                    </div>
                  </div>
                </div>

                {/* Cannabis */}
                <div className="space-y-2">
                  <Label className="font-semibold">Cannabis</Label>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cannabis-frequency">Frequency</Label>
                      <Select
                        defaultValue={dummyData.substanceUse.cannabis.frequency}
                      >
                        <SelectTrigger id="cannabis-frequency">
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="never">Never</SelectItem>
                          <SelectItem value="rarely">Rarely</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="daily">Daily</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cannabis-amount">Amount</Label>
                      <Input
                        id="cannabis-amount"
                        placeholder="Amount per occasion"
                        defaultValue={dummyData.substanceUse.cannabis.amount}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cannabis-last-use">Last Use</Label>
                      <Input
                        id="cannabis-last-use"
                        placeholder="When last used"
                        defaultValue={dummyData.substanceUse.cannabis.lastUse}
                      />
                    </div>
                  </div>
                </div>

                {/* Other Substances */}
                <div className="space-y-2">
                  <Label htmlFor="other-substances">Other Substances</Label>
                  <Textarea
                    id="other-substances"
                    placeholder="List any other substances used, including frequency, amount, and last use"
                    defaultValue={dummyData.substanceUse.other}
                    className="min-h-[100px]"
                  />
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* Family Medical & Psychiatric History */}
        <Collapsible
          open={isFamilyHistoryOpen}
          onOpenChange={setIsFamilyHistoryOpen}
          className="w-full"
        >
          <Card>
            <CardHeader className="cursor-pointer flex flex-row items-center justify-between">
              <CardTitle>Family Medical & Psychiatric History</CardTitle>
              <CollapsibleTrigger>
                {isFamilyHistoryOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </CollapsibleTrigger>
            </CardHeader>
            <CollapsibleContent>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="family-medical-history">
                    Family Medical History
                  </Label>
                  <Textarea
                    id="family-medical-history"
                    placeholder="List significant family medical conditions"
                    defaultValue={dummyData.familyHistory.medical}
                    className="min-h-[120px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="family-psychiatric-history">
                    Family Psychiatric History
                  </Label>
                  <Textarea
                    id="family-psychiatric-history"
                    placeholder="List significant family psychiatric conditions"
                    defaultValue={dummyData.familyHistory.psychiatric}
                    className="min-h-[120px]"
                  />
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* Mental Status & Risk */}
        <Collapsible
          open={isMentalStatusOpen}
          onOpenChange={setIsMentalStatusOpen}
          className="w-full"
        >
          <Card>
            <CardHeader className="cursor-pointer flex flex-row items-center justify-between">
              <CardTitle>Mental Status & Risk</CardTitle>
              <CollapsibleTrigger>
                {isMentalStatusOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </CollapsibleTrigger>
            </CardHeader>
            <CollapsibleContent>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="behavioral-observations">
                    Behavioral Observations
                  </Label>
                  <Textarea
                    id="behavioral-observations"
                    placeholder="Describe client's presentation during assessment"
                    defaultValue={dummyData.mentalStatus.behavioralObservations}
                    className="min-h-[120px]"
                  />
                </div>

                {/* Mental Status Exam */}
                <Collapsible
                  open={isMseDetailsOpen}
                  onOpenChange={setIsMseDetailsOpen}
                  className="w-full border rounded-md p-2"
                >
                  <div className="flex items-center justify-between px-4">
                    <h3 className="text-md font-medium">
                      Mental Status Exam (MSE)
                    </h3>
                    <CollapsibleTrigger>
                      {isMseDetailsOpen ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </CollapsibleTrigger>
                  </div>
                  <CollapsibleContent className="px-4 pt-2 pb-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="appearance">Appearance</Label>
                        <Select defaultValue={dummyData.mentalStatus.appearance}>
                          <SelectTrigger id="appearance">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Well-groomed">
                              Well-groomed
                            </SelectItem>
                            <SelectItem value="Casual">Casual</SelectItem>
                            <SelectItem value="Disheveled">Disheveled</SelectItem>
                            <SelectItem value="Inappropriate">
                              Inappropriate
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="behavior">Behavior</Label>
                        <Select defaultValue={dummyData.mentalStatus.behavior}>
                          <SelectTrigger id="behavior">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Cooperative">
                              Cooperative
                            </SelectItem>
                            <SelectItem value="Guarded">Guarded</SelectItem>
                            <SelectItem value="Agitated">Agitated</SelectItem>
                            <SelectItem value="Withdrawn">Withdrawn</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="speech">Speech</Label>
                        <Select defaultValue={dummyData.mentalStatus.speech}>
                          <SelectTrigger id="speech">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Normal rate and rhythm">
                              Normal rate and rhythm
                            </SelectItem>
                            <SelectItem value="Pressured">Pressured</SelectItem>
                            <SelectItem value="Slow">Slow</SelectItem>
                            <SelectItem value="Tangential">Tangential</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="mood">Mood</Label>
                        <Select defaultValue={dummyData.mentalStatus.mood}>
                          <SelectTrigger id="mood">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Euthymic">Euthymic</SelectItem>
                            <SelectItem value="Depressed">Depressed</SelectItem>
                            <SelectItem value="Anxious">Anxious</SelectItem>
                            <SelectItem value="Irritable">Irritable</SelectItem>
                            <SelectItem value="Elevated">Elevated</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="affect">Affect</Label>
                        <Select defaultValue={dummyData.mentalStatus.affect}>
                          <SelectTrigger id="affect">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Full range">Full range</SelectItem>
                            <SelectItem value="Restricted">Restricted</SelectItem>
                            <SelectItem value="Blunted">Blunted</SelectItem>
                            <SelectItem value="Flat">Flat</SelectItem>
                            <SelectItem value="Congruent with mood">
                              Congruent with mood
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="thought-process">Thought Process</Label>
                        <Select
                          defaultValue={dummyData.mentalStatus.thoughtProcess}
                        >
                          <SelectTrigger id="thought-process">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Logical">Logical</SelectItem>
                            <SelectItem value="Disorganized">
                              Disorganized
                            </SelectItem>
                            <SelectItem value="Circumstantial">
                              Circumstantial
                            </SelectItem>
                            <SelectItem value="Tangential">Tangential</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="thought-content">Thought Content</Label>
                        <Select
                          defaultValue={dummyData.mentalStatus.thoughtContent}
                        >
                          <SelectTrigger id="thought-content">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="No delusions or hallucinations">
                              No delusions or hallucinations
                            </SelectItem>
                            <SelectItem value="Delusions present">
                              Delusions present
                            </SelectItem>
                            <SelectItem value="Hallucinations present">
                              Hallucinations present
                            </SelectItem>
                            <SelectItem value="Suicidal ideation">
                              Suicidal ideation
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cognition">Cognition</Label>
                        <Select defaultValue={dummyData.mentalStatus.cognition}>
                          <SelectTrigger id="cognition">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Alert and oriented x3">
                              Alert and oriented x3
                            </SelectItem>
                            <SelectItem value="Disoriented to time">
                              Disoriented to time
                            </SelectItem>
                            <SelectItem value="Disoriented to place">
                              Disoriented to place
                            </SelectItem>
                            <SelectItem value="Disoriented to person">
                              Disoriented to person
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="insight">Insight</Label>
                        <Select defaultValue={dummyData.mentalStatus.insight}>
                          <SelectTrigger id="insight">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Good">Good</SelectItem>
                            <SelectItem value="Fair">Fair</SelectItem>
                            <SelectItem value="Poor">Poor</SelectItem>
                            <SelectItem value="None">None</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="judgment">Judgment</Label>
                        <Select defaultValue={dummyData.mentalStatus.judgment}>
                          <SelectTrigger id="judgment">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Good">Good</SelectItem>
                            <SelectItem value="Fair">Fair</SelectItem>
                            <SelectItem value="Poor">Poor</SelectItem>
                            <SelectItem value="Impaired">Impaired</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* Risk Assessment */}
        <Collapsible
          open={isRiskAssessmentOpen}
          onOpenChange={setIsRiskAssessmentOpen}
          className="w-full"
        >
          <Card>
            <CardHeader className="cursor-pointer flex flex-row items-center justify-between">
              <CardTitle>Risk Assessment</CardTitle>
              <CollapsibleTrigger>
                {isRiskAssessmentOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </CollapsibleTrigger>
            </CardHeader>
            <CollapsibleContent>
              <CardContent className="space-y-4">
                {/* Suicidal/Homicidal Ideation */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="suicidal-ideation">Suicidal Ideation</Label>
                    <RadioGroup
                      defaultValue={dummyData.riskAssessment.suicidalIdeation}
                      id="suicidal-ideation"
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="none" id="si-none" />
                        <Label htmlFor="si-none" className="font-normal">
                          None
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="passive" id="si-passive" />
                        <Label htmlFor="si-passive" className="font-normal">
                          Passive
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="active" id="si-active" />
                        <Label htmlFor="si-active" className="font-normal">
                          Active
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="homicidal-ideation">Homicidal Ideation</Label>
                    <RadioGroup
                      defaultValue={dummyData.riskAssessment.homicidalIdeation}
                      id="homicidal-ideation"
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="none" id="hi-none" />
                        <Label htmlFor="hi-none" className="font-normal">
                          None
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="passive" id="hi-passive" />
                        <Label htmlFor="hi-passive" className="font-normal">
                          Passive
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="active" id="hi-active" />
                        <Label htmlFor="hi-active" className="font-normal">
                          Active
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>

                {/* Risk Levels */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Risk Levels</h3>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="self-harm-risk">Self-Harm Risk</Label>
                        <span className="text-sm text-muted-foreground">
                          {dummyData.riskAssessment.selfHarmRisk}/5
                        </span>
                      </div>
                      <Slider
                        id="self-harm-risk"
                        defaultValue={[dummyData.riskAssessment.selfHarmRisk]}
                        max={5}
                        step={1}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Low</span>
                        <span>Moderate</span>
                        <span>High</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="harm-others-risk">
                          Harm to Others Risk
                        </Label>
                        <span className="text-sm text-muted-foreground">
                          {dummyData.riskAssessment.harmToOthersRisk}/5
                        </span>
                      </div>
                      <Slider
                        id="harm-others-risk"
                        defaultValue={[dummyData.riskAssessment.harmToOthersRisk]}
                        max={5}
                        step={1}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Low</span>
                        <span>Moderate</span>
                        <span>High</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="substance-abuse-risk">
                          Substance Abuse Risk
                        </Label>
                        <span className="text-sm text-muted-foreground">
                          {dummyData.riskAssessment.substanceAbuseRisk}/5
                        </span>
                      </div>
                      <Slider
                        id="substance-abuse-risk"
                        defaultValue={[
                          dummyData.riskAssessment.substanceAbuseRisk,
                        ]}
                        max={5}
                        step={1}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Low</span>
                        <span>Moderate</span>
                        <span>High</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="impulsivity-risk">Impulsivity Risk</Label>
                        <span className="text-sm text-muted-foreground">
                          {dummyData.riskAssessment.impulsivityRisk}/5
                        </span>
                      </div>
                      <Slider
                        id="impulsivity-risk"
                        defaultValue={[dummyData.riskAssessment.impulsivityRisk]}
                        max={5}
                        step={1}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Low</span>
                        <span>Moderate</span>
                        <span>High</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="overall-risk">Overall Risk Level</Label>
                  <Select defaultValue={dummyData.riskAssessment.overallRisk}>
                    <SelectTrigger id="overall-risk">
                      <SelectValue placeholder="Select risk level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="moderate">Moderate</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="extreme">Extreme</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="safety-plan">Safety Plan</Label>
                  <Textarea
                    id="safety-plan"
                    placeholder="Document safety plan and protective factors"
                    defaultValue={dummyData.riskAssessment.safetyPlan}
                    className="min-h-[120px]"
                  />
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* Strengths & Resources */}
        <Collapsible
          open={isStrengthsResourcesOpen}
          onOpenChange={setIsStrengthsResourcesOpen}
          className="w-full"
        >
          <Card>
            <CardHeader className="cursor-pointer flex flex-row items-center justify-between">
              <CardTitle>Strengths & Resources</CardTitle>
              <CollapsibleTrigger>
                {isStrengthsResourcesOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </CollapsibleTrigger>
            </CardHeader>
            <CollapsibleContent>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="strengths-resources">
                    Client Strengths & Resources
                  </Label>
                  <Textarea
                    id="strengths-resources"
                    placeholder="Document client's strengths, coping skills, support systems, and resources"
                    defaultValue={dummyData.strengthsResources}
                    className="min-h-[150px]"
                  />
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* Clinical Goals */}
        <Collapsible
          open={isClinicalGoalsOpen}
          onOpenChange={setIsClinicalGoalsOpen}
          className="w-full"
        >
          <Card>
            <CardHeader className="cursor-pointer flex flex-row items-center justify-between">
              <CardTitle>Clinical Goals</CardTitle>
              <CollapsibleTrigger>
                {isClinicalGoalsOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </CollapsibleTrigger>
            </CardHeader>
            <CollapsibleContent>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="clinical-goals">Treatment Goals</Label>
                  <Textarea
                    id="clinical-goals"
                    placeholder="List specific, measurable, achievable, relevant, and time-bound (SMART) goals for treatment"
                    defaultValue={dummyData.clinicalGoals}
                    className="min-h-[150px]"
                  />
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      </div>
    </div>
  );
};

export default QuestionnaireTab;
