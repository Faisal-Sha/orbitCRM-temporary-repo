
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, FileText } from "lucide-react";

const LegalAdminTab = () => {
  const [expandedConsent, setExpandedConsent] = useState<string | null>(null);
  const [consentChecked, setConsentChecked] = useState({
    treatment: false,
    privacy: false,
  });

  const toggleExpand = (id: string) => {
    setExpandedConsent(expandedConsent === id ? null : id);
  };

  return (
    <div className="app-card">
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Consent Forms</h3>
            <div className="space-y-4">
              {/* Consent for Treatment */}
              <div className="border rounded-md p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="consent-treatment"
                      checked={consentChecked.treatment}
                      onCheckedChange={(checked) =>
                        setConsentChecked((prev) => ({
                          ...prev,
                          treatment: checked === true,
                        }))
                      }
                    />
                    <div className="flex flex-col">
                      <Label htmlFor="consent-treatment" className="font-medium">
                        Consent for Treatment
                      </Label>
                      <span className="text-sm text-muted-foreground">
                        Client must acknowledge before proceeding
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={() => window.open("#", "_blank")}
                    >
                      <FileText className="h-4 w-4" />
                      <span>View PDF</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleExpand("treatment")}
                    >
                      {expandedConsent === "treatment" ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {expandedConsent === "treatment" && (
                  <div className="mt-4 p-4 bg-muted/50 rounded-md text-sm">
                    <p className="mb-2">
                      I hereby consent to and authorize the assessment and
                      treatment services provided by the healthcare provider. I
                      understand that:
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>
                        My participation in assessment and treatment is voluntary.
                      </li>
                      <li>
                        I have the right to refuse any specific treatment or
                        intervention.
                      </li>
                      <li>
                        I can withdraw this consent at any time by providing
                        written notice.
                      </li>
                      <li>
                        The potential benefits, risks, and alternatives to
                        treatment have been explained to me.
                      </li>
                      <li>
                        I am responsible for payment of all services rendered, as
                        applicable.
                      </li>
                    </ul>
                  </div>
                )}
              </div>

              {/* Privacy Acknowledgement */}
              <div className="border rounded-md p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="consent-privacy"
                      checked={consentChecked.privacy}
                      onCheckedChange={(checked) =>
                        setConsentChecked((prev) => ({
                          ...prev,
                          privacy: checked === true,
                        }))
                      }
                    />
                    <div className="flex flex-col">
                      <Label htmlFor="consent-privacy" className="font-medium">
                        Privacy Acknowledgement
                      </Label>
                      <span className="text-sm text-muted-foreground">
                        HIPAA and data privacy consent
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={() => window.open("#", "_blank")}
                    >
                      <FileText className="h-4 w-4" />
                      <span>View PDF</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleExpand("privacy")}
                    >
                      {expandedConsent === "privacy" ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {expandedConsent === "privacy" && (
                  <div className="mt-4 p-4 bg-muted/50 rounded-md text-sm">
                    <p className="mb-2">
                      I acknowledge that I have received a copy of the Notice of
                      Privacy Practices, which explains:
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>
                        How my health information may be used and disclosed.
                      </li>
                      <li>
                        My rights regarding my personal health information under
                        HIPAA.
                      </li>
                      <li>
                        The provider's responsibilities in protecting my
                        information.
                      </li>
                      <li>
                        How to file a complaint if I believe my privacy rights
                        have been violated.
                      </li>
                      <li>
                        That my information may be shared with other providers for
                        continuity of care.
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Signatures Section */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Signatures</h3>

            {/* Client Signature */}
            <div className="mb-6">
              <Label className="block mb-2">Client Signature</Label>
              <div className="border border-dashed rounded-md p-6 flex flex-col items-center justify-center bg-muted/30">
                <p className="text-muted-foreground text-sm mb-2">
                  Click to sign or upload signature
                </p>
                <Button variant="outline" className="mt-2">
                  Add Signature
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Optional based on workflow requirements
              </p>
            </div>

            {/* Assessor Signature */}
            <div>
              <Label className="block mb-2">Assessor Signature</Label>
              <div className="border rounded-md p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-32 bg-primary/10 rounded flex items-center justify-center">
                      <span className="text-sm italic">Michael Scott</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Auto-filled from logged-in user
                    </div>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">
                      Date: {new Date().toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Administrative Section */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Administrative</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="block mb-2">Assessment Status</Label>
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-800 text-sm">
                  Draft - Not Submitted
                </div>
              </div>

              <div>
                <Label className="block mb-2">Billing Code</Label>
                <div className="p-3 border rounded-md text-sm">
                  90791 - Psychiatric diagnostic evaluation
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LegalAdminTab;
