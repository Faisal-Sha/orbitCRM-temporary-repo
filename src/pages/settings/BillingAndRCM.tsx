import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Calendar, DollarSign, Users, Shield } from "lucide-react";
import { useState } from "react";
import Insurances from "@/components/settings/servicesbilling/Insurances";
import Services from "@/components/settings/servicesbilling/Services";
import PayoutRules from "@/components/settings/servicesbilling/PayoutRules";

const BillingAndRCM = () => {
  const [showInsurances, setShowInsurances] = useState(false);
  const [showServices, setShowServices] = useState(false);
  const [showPayoutRules, setShowPayoutRules] = useState(false);
  const [billingCycle, setBillingCycle] = useState("Monthly");
  const [paymentTerms, setPaymentTerms] = useState("Net 30");
  const [lateFee, setLateFee] = useState("5%");
  const [editingField, setEditingField] = useState<string | null>(null);

  const insurances = [
    { name: "Caresource", category: "Medicaid", status: "Active" },
    { name: "Molina", category: "Medicaid & Medicare", status: "Active" },
    { name: "UnitedHealthcare", category: "Private", status: "Active" },
    { name: "Cadem", category: "Medicaid", status: "Inactive" },
    { name: "NationalHealth", category: "Private", status: "Active" },
  ];

  const services = [
    { name: "Case Management", category: "Adults", fee: "$30", feeType: "per hour", status: "Active" },
    { name: "Counseling", category: "Teens", fee: "$75", feeType: "per session", status: "Active" },
    { name: "Therapy", category: "Adults", fee: "$120", feeType: "per hour", status: "Active" },
    { name: "SUD", category: "Adults", fee: "$90", feeType: "per session", status: "Inactive" },
    { name: "Assessment", category: "Teens", fee: "$200", feeType: "flat fee", status: "Active" },
  ];

  const payoutRules = [
    { service: "Case Management", category: "Adults", rule: "$30/hr" },
    { service: "Counseling", category: "Teens", rule: "$50/session" },
    { service: "Therapy", category: "Adults", rule: "$85/hr" },
    { service: "SUD", category: "Adults", rule: "$65/session" },
    { service: "Assessment", category: "Teens", rule: "$150 flat" },
  ];

  const handleEditField = (field: string, value: string) => {
    setEditingField(field);
  };

  const handleSaveField = (field: string, value: string) => {
    switch (field) {
      case 'billingCycle':
        setBillingCycle(value);
        break;
      case 'paymentTerms':
        setPaymentTerms(value);
        break;
      case 'lateFee':
        setLateFee(value);
        break;
    }
    setEditingField(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent, field: string, value: string) => {
    if (e.key === 'Enter') {
      handleSaveField(field, value);
    }
    if (e.key === 'Escape') {
      setEditingField(null);
    }
  };

  // Navigation handlers
  if (showInsurances) {
    return <Insurances onBack={() => setShowInsurances(false)} />;
  }

  if (showServices) {
    return <Services onBack={() => setShowServices(false)} />;
  }

  if (showPayoutRules) {
    return <PayoutRules onBack={() => setShowPayoutRules(false)} />;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Accepted Insurances
            </CardTitle>
            <Button onClick={() => setShowInsurances(true)}>Manage</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {insurances.map((insurance, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded">
                <div>
                  <p className="font-medium">{insurance.name}</p>
                  <p className="text-sm text-muted-foreground">{insurance.category}</p>
                </div>
                <Badge variant={insurance.status === 'Active' ? 'default' : 'secondary'}>
                  {insurance.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Services & Fees
            </CardTitle>
            <Button onClick={() => setShowServices(true)}>Manage</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {services.map((service, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded">
                <div>
                  <p className="font-medium">{service.name}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{service.category}</span>
                    <span>•</span>
                    <span>{service.fee} {service.feeType}</span>
                  </div>
                </div>
                <Badge variant={service.status === 'Active' ? 'default' : 'secondary'}>
                  {service.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Billing Cycles & Terms
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span>Default Billing Cycle</span>
                {editingField === 'billingCycle' ? (
                  <Input
                    value={billingCycle}
                    onChange={(e) => setBillingCycle(e.target.value)}
                    onBlur={() => setEditingField(null)}
                    onKeyDown={(e) => handleKeyPress(e, 'billingCycle', billingCycle)}
                    className="w-24 h-8 text-sm"
                    autoFocus
                  />
                ) : (
                  <Badge 
                    variant="outline" 
                    className="cursor-pointer hover:bg-accent"
                    onClick={() => handleEditField('billingCycle', billingCycle)}
                  >
                    {billingCycle}
                  </Badge>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span>Payment Terms</span>
                {editingField === 'paymentTerms' ? (
                  <Input
                    value={paymentTerms}
                    onChange={(e) => setPaymentTerms(e.target.value)}
                    onBlur={() => setEditingField(null)}
                    onKeyDown={(e) => handleKeyPress(e, 'paymentTerms', paymentTerms)}
                    className="w-24 h-8 text-sm"
                    autoFocus
                  />
                ) : (
                  <Badge 
                    variant="outline" 
                    className="cursor-pointer hover:bg-accent"
                    onClick={() => handleEditField('paymentTerms', paymentTerms)}
                  >
                    {paymentTerms}
                  </Badge>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span>Late Fee</span>
                {editingField === 'lateFee' ? (
                  <Input
                    value={lateFee}
                    onChange={(e) => setLateFee(e.target.value)}
                    onBlur={() => setEditingField(null)}
                    onKeyDown={(e) => handleKeyPress(e, 'lateFee', lateFee)}
                    className="w-24 h-8 text-sm"
                    autoFocus
                  />
                ) : (
                  <Badge 
                    variant="outline" 
                    className="cursor-pointer hover:bg-accent"
                    onClick={() => handleEditField('lateFee', lateFee)}
                  >
                    {lateFee}
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Payout Rules
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {payoutRules.map((rule, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <p className="font-medium">{rule.service}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{rule.category}</span>
                      <span>•</span>
                      <span>{rule.rule}</span>
                    </div>
                  </div>
                </div>
              ))}
              <Button onClick={() => setShowPayoutRules(true)} className="w-full">Manage</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BillingAndRCM;
