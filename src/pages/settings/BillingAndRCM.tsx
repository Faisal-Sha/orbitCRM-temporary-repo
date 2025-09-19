import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Calendar, DollarSign, Users, Shield, Loader2 } from "lucide-react";
import { useState } from "react";
import Insurances from "@/components/settings/servicesbilling/Insurances";
import Services from "@/components/settings/servicesbilling/Services";
import PayoutRules from "@/components/settings/servicesbilling/PayoutRules";
import { useInsurances } from "@/hooks/useInsurances";
import { useServices } from "@/hooks/useServices";
import { useCurrentUserAgency } from "@/hooks/useCurrentUserAgency";

const BillingAndRCM = () => {
  const [showInsurances, setShowInsurances] = useState(false);
  const [showServices, setShowServices] = useState(false);
  const [showPayoutRules, setShowPayoutRules] = useState(false);
  const [billingCycle, setBillingCycle] = useState("Monthly");
  const [paymentTerms, setPaymentTerms] = useState("Net 30");
  const [lateFee, setLateFee] = useState("5%");
  const [editingField, setEditingField] = useState<string | null>(null);

  // Get insurance data for display
  const { insurances, loading: insurancesLoading } = useInsurances();

  const { agencyId } = useCurrentUserAgency();
  const { services, loading: servicesLoading } = useServices(agencyId || undefined);

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
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Accepted Insurances ({insurancesLoading ? '...' : insurances.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {insurancesLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Loading insurances...
            </div>
          ) : (
            <div className="space-y-4">
              {insurances.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No insurances configured yet</p>
                  <p className="text-sm">Click "View All Insurances" to get started</p>
                </div>
              ) : (
                <>
                  {insurances.slice(0, 3).map((insurance) => (
                    <div key={insurance.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{insurance.insurance_provider}</p>
                        <p className="text-sm text-muted-foreground">
                          {insurance.insurance_category}
                        </p>
                      </div>
                      <Badge variant="outline">
                        {insurance.insurance_status}
                      </Badge>
                    </div>
                  ))}
                  <div className="text-center pt-4">
                    <Button variant="outline" onClick={() => setShowInsurances(true)}>
                      View All Insurances
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Services & Fees ({servicesLoading ? '...' : services.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {servicesLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Loading services...
            </div>
          ) : (
            <div className="space-y-4">
              {services.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No services configured yet</p>
                  <p className="text-sm">Click "View All Services" to get started</p>
                </div>
              ) : (
                <>
                  {services.slice(0, 3).map((service) => (
                    <div key={service.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{service.service}</p>
                        <p className="text-sm text-muted-foreground">
                          {service.service_category === 'adults' ? 'Adults' : 'Teens'} • 
                          Bill: ${service.fee_billed} {service.billed_fee_type}
                          {service.fee_payout && ` • Payout: $${service.fee_payout} ${service.payout_fee_type}`}
                        </p>
                      </div>
                      <Badge variant="outline">
                        {service.service_status}
                      </Badge>
                    </div>
                  ))}
                  <div className="text-center pt-4">
                    <Button variant="outline" onClick={() => setShowServices(true)}>
                      View All Services
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}
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