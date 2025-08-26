import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Plus, Edit, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import DeleteConfirmationDialog from "@/components/settings/usersandroles/DeleteConfirmationDialog";

interface PayoutRule {
  id: number;
  service: string;
  serviceCategory: string;
  serviceFee: string;
  payoutFee: string;
  payoutFeeType: string;
}

interface PayoutRulesProps {
  onBack: () => void;
}

const PayoutRules = ({ onBack }: PayoutRulesProps) => {
  const [payoutRules, setPayoutRules] = useState<PayoutRule[]>([
    { id: 1, service: "Case Management", serviceCategory: "Adults", serviceFee: "$30/hr", payoutFee: "25", payoutFeeType: "per hour" },
    { id: 2, service: "Counseling", serviceCategory: "Teens", serviceFee: "$75/session", payoutFee: "50", payoutFeeType: "per session" },
    { id: 3, service: "Therapy", serviceCategory: "Adults", serviceFee: "$120/hr", payoutFee: "85", payoutFeeType: "per hour" },
    { id: 4, service: "SUD", serviceCategory: "Adults", serviceFee: "$90/session", payoutFee: "65", payoutFeeType: "per session" },
    { id: 5, service: "Assessment", serviceCategory: "Teens", serviceFee: "$200 flat", payoutFee: "150", payoutFeeType: "flat fee" },
    { id: 6, service: "Group Therapy", serviceCategory: "Adults", serviceFee: "$50/hr", payoutFee: "35", payoutFeeType: "per hour" },
    { id: 7, service: "Family Therapy", serviceCategory: "Adults", serviceFee: "$150/session", payoutFee: "105", payoutFeeType: "per session" },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<PayoutRule | null>(null);
  const [deleteRuleId, setDeleteRuleId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    service: "",
    serviceCategory: "",
    serviceFee: "",
    payoutFee: "",
    payoutFeeType: "",
  });

  const availableServices = [
    { name: "Case Management", category: "Adults", fee: "$30/hr" },
    { name: "Counseling", category: "Teens", fee: "$75/session" },
    { name: "Therapy", category: "Adults", fee: "$120/hr" },
    { name: "SUD", category: "Adults", fee: "$90/session" },
    { name: "Assessment", category: "Teens", fee: "$200 flat" },
    { name: "Group Therapy", category: "Adults", fee: "$50/hr" },
    { name: "Family Therapy", category: "Adults", fee: "$150/session" },
    { name: "Crisis Intervention", category: "Adults", fee: "$100/session" },
    { name: "Peer Support", category: "Adults", fee: "$40/hr" },
  ];

  const feeTypes = ["per hour", "per session", "flat fee", "per day"];

  const handleAdd = () => {
    setEditingRule(null);
    setFormData({ service: "", serviceCategory: "", serviceFee: "", payoutFee: "", payoutFeeType: "per hour" });
    setIsModalOpen(true);
  };

  const handleEdit = (rule: PayoutRule) => {
    setEditingRule(rule);
    setFormData({
      service: rule.service,
      serviceCategory: rule.serviceCategory,
      serviceFee: rule.serviceFee,
      payoutFee: rule.payoutFee,
      payoutFeeType: rule.payoutFeeType,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    setDeleteRuleId(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (deleteRuleId) {
      setPayoutRules(payoutRules.filter(rule => rule.id !== deleteRuleId));
      setIsDeleteModalOpen(false);
      setDeleteRuleId(null);
    }
  };

  const handleServiceChange = (serviceName: string) => {
    const selectedService = availableServices.find(s => s.name === serviceName);
    if (selectedService) {
      setFormData({
        ...formData,
        service: serviceName,
        serviceCategory: selectedService.category,
        serviceFee: selectedService.fee,
      });
    }
  };

  const handleSubmit = () => {
    if (editingRule) {
      setPayoutRules(payoutRules.map(rule =>
        rule.id === editingRule.id
          ? { ...rule, ...formData }
          : rule
      ));
    } else {
      const newRule: PayoutRule = {
        id: Math.max(...payoutRules.map(r => r.id)) + 1,
        ...formData,
      };
      setPayoutRules([...payoutRules, newRule]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Payout Rules Management</h2>
        <Button variant="outline" onClick={onBack}>
          Back to Settings
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Payout Rules
            </CardTitle>
            <Button onClick={handleAdd}>
              <Plus className="h-4 w-4 mr-2" />
              Add Rule
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {payoutRules.map((rule) => (
              <div key={rule.id} className="flex items-center justify-between p-3 border rounded">
                <div>
                  <p className="font-medium">{rule.service}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{rule.serviceCategory}</span>
                    <span>•</span>
                    <span>Service: {rule.serviceFee}</span>
                    <span>•</span>
                    <span>Payout: ${rule.payoutFee} {rule.payoutFeeType}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(rule)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(rule.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingRule ? 'Edit Payout Rule' : 'Add Payout Rule'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="service">Service</Label>
              <Select value={formData.service} onValueChange={handleServiceChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select service" />
                </SelectTrigger>
                <SelectContent>
                  {availableServices.map((service) => (
                    <SelectItem key={service.name} value={service.name}>
                      {service.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {formData.service && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Service Category</Label>
                    <Input value={formData.serviceCategory} disabled className="bg-muted" />
                  </div>
                  <div>
                    <Label>Service Fee</Label>
                    <Input value={formData.serviceFee} disabled className="bg-muted" />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="payoutFee">Payout Fee Amount ($)</Label>
                    <Input
                      id="payoutFee"
                      type="number"
                      value={formData.payoutFee}
                      onChange={(e) => setFormData({ ...formData, payoutFee: e.target.value })}
                      placeholder="Enter payout amount"
                    />
                  </div>
                  <div>
                    <Label htmlFor="payoutFeeType">Payout Fee Type</Label>
                    <Select value={formData.payoutFeeType} onValueChange={(value) => setFormData({ ...formData, payoutFeeType: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select fee type" />
                      </SelectTrigger>
                      <SelectContent>
                        {feeTypes.map((feeType) => (
                          <SelectItem key={feeType} value={feeType}>
                            {feeType}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!formData.service || !formData.payoutFee}>
              {editingRule ? 'Update' : 'Add'} Rule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <DeleteConfirmationDialog
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        onConfirm={confirmDelete}
        title="Delete Payout Rule"
        description="Are you sure you want to delete this payout rule? This action cannot be undone."
      />
    </div>
  );
};

export default PayoutRules;