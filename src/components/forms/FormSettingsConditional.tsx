import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, X } from 'lucide-react';

interface FormSettingsConditionalProps {
  formData: any;
  setFormData: (data: any) => void;
  updateFormDataWithHistory?: (data: any, actionType: string, description: string) => void;
}

export const FormSettingsConditional: React.FC<FormSettingsConditionalProps> = ({
  formData,
  setFormData,
  updateFormDataWithHistory,
}) => {
  const updateConditionalRules = (rules: any[]) => {
    const newData = {
      ...formData,
      settings: {
        ...formData.settings,
        conditionalRules: rules
      }
    };

    if (updateFormDataWithHistory) {
      updateFormDataWithHistory(newData, 'conditional', 'Conditional rules updated');
    } else {
      setFormData(newData);
    }
  };

  const addRule = () => {
    const currentRules = formData.settings?.conditionalRules || [];
    const newRule = {
      id: Date.now(),
      name: `Rule ${currentRules.length + 1}`,
      conditions: [{
        id: Date.now(),
        triggerField: '',
        operator: 'equals',
        value: '',
        logicOperator: 'and'
      }],
      actions: [{
        id: Date.now(),
        action: 'show',
        targetFields: [],
        confirmationId: null,
        emailId: null,
        smsId: null,
        aiVoiceId: null
      }],
      otherwiseActions: [{
        id: Date.now() + 1,
        action: 'do_not_hide',
        targetFields: [],
        confirmationId: null,
        emailId: null,
        smsId: null,
        aiVoiceId: null
      }]
    };
    
    updateConditionalRules([...currentRules, newRule]);
  };

  const updateRule = (ruleId: number, field: string, value: any) => {
    const currentRules = formData.settings?.conditionalRules || [];
    const updatedRules = currentRules.map((rule: any) =>
      rule.id === ruleId ? { ...rule, [field]: value } : rule
    );
    updateConditionalRules(updatedRules);
  };

  const removeRule = (ruleId: number) => {
    const currentRules = formData.settings?.conditionalRules || [];
    const updatedRules = currentRules.filter((rule: any) => rule.id !== ruleId);
    updateConditionalRules(updatedRules);
  };

  const addCondition = (ruleId: number) => {
    const currentRules = formData.settings?.conditionalRules || [];
    const updatedRules = currentRules.map((rule: any) => {
      if (rule.id === ruleId) {
        return {
          ...rule,
          conditions: [...rule.conditions, {
            id: Date.now(),
            triggerField: '',
            operator: 'equals',
            value: '',
            logicOperator: 'and'
          }]
        };
      }
      return rule;
    });
    updateConditionalRules(updatedRules);
  };

  const updateCondition = (ruleId: number, conditionId: number, field: string, value: any) => {
    const currentRules = formData.settings?.conditionalRules || [];
    const updatedRules = currentRules.map((rule: any) => {
      if (rule.id === ruleId) {
        return {
          ...rule,
          conditions: rule.conditions.map((condition: any) =>
            condition.id === conditionId ? { ...condition, [field]: value } : condition
          )
        };
      }
      return rule;
    });
    updateConditionalRules(updatedRules);
  };

  const removeCondition = (ruleId: number, conditionId: number) => {
    const currentRules = formData.settings?.conditionalRules || [];
    const updatedRules = currentRules.map((rule: any) => {
      if (rule.id === ruleId && rule.conditions.length > 1) {
        return {
          ...rule,
          conditions: rule.conditions.filter((condition: any) => condition.id !== conditionId)
        };
      }
      return rule;
    });
    updateConditionalRules(updatedRules);
  };

  const addAction = (ruleId: number) => {
    const currentRules = formData.settings?.conditionalRules || [];
    const updatedRules = currentRules.map((rule: any) => {
      if (rule.id === ruleId) {
        const newAction = {
          id: Date.now(),
          action: 'show',
          targetFields: [],
          confirmationId: null,
          emailId: null,
          smsId: null,
          aiVoiceId: null
        };
        const newOtherwiseAction = {
          id: Date.now() + 1,
          action: 'do_not_hide',
          targetFields: [],
          confirmationId: null,
          emailId: null,
          smsId: null,
          aiVoiceId: null
        };
        return {
          ...rule,
          actions: [...rule.actions, newAction],
          otherwiseActions: [...(rule.otherwiseActions || []), newOtherwiseAction]
        };
      }
      return rule;
    });
    updateConditionalRules(updatedRules);
  };

  const updateAction = (ruleId: number, actionId: number, field: string, value: any) => {
    const currentRules = formData.settings?.conditionalRules || [];
    const updatedRules = currentRules.map((rule: any) => {
      if (rule.id === ruleId) {
        return {
          ...rule,
          actions: rule.actions.map((action: any) =>
            action.id === actionId ? { ...action, [field]: value } : action
          )
        };
      }
      return rule;
    });
    updateConditionalRules(updatedRules);
  };

  const removeAction = (ruleId: number, actionId: number) => {
    const currentRules = formData.settings?.conditionalRules || [];
    const updatedRules = currentRules.map((rule: any) => {
      if (rule.id === ruleId && rule.actions.length > 1) {
        const actionIndex = rule.actions.findIndex((a: any) => a.id === actionId);
        return {
          ...rule,
          actions: rule.actions.filter((action: any) => action.id !== actionId),
          otherwiseActions: (rule.otherwiseActions || []).filter((_: any, index: number) => index !== actionIndex)
        };
      }
      return rule;
    });
    updateConditionalRules(updatedRules);
  };

  const updateOtherwiseAction = (ruleId: number, actionIndex: number, field: string, value: any) => {
    const currentRules = formData.settings?.conditionalRules || [];
    const updatedRules = currentRules.map((rule: any) => {
      if (rule.id === ruleId) {
        const updatedOtherwiseActions = [...(rule.otherwiseActions || [])];
        if (updatedOtherwiseActions[actionIndex]) {
          updatedOtherwiseActions[actionIndex] = { ...updatedOtherwiseActions[actionIndex], [field]: value };
        } else {
          updatedOtherwiseActions[actionIndex] = {
            id: Date.now(),
            action: 'do_not_hide',
            targetFields: [],
            confirmationId: null,
            emailId: null,
            smsId: null,
            aiVoiceId: null,
            [field]: value
          };
        }
        return {
          ...rule,
          otherwiseActions: updatedOtherwiseActions
        };
      }
      return rule;
    });
    updateConditionalRules(updatedRules);
  };

  const getAllFormFields = () => {
    const fields: any[] = [];
    formData.steps?.forEach((step: any) => {
      step.elements?.forEach((element: any) => {
        if (!['linebreak'].includes(element.type)) {
          fields.push({
            id: element.id,
            label: element.label,
            type: element.type
          });
        }
      });
    });
    return fields;
  };

  const getFieldOptions = (fieldId: string) => {
    const field = getAllFormFields().find(f => f.id === fieldId);
    if (!field) return [];
    
    let element = null;
    formData.steps?.forEach((step: any) => {
      const found = step.elements?.find((el: any) => el.id === fieldId);
      if (found) element = found;
    });
    
    return element?.options || [];
  };

  const getConfirmations = () => {
    return formData.settings?.confirmations || [];
  };

  // Fixed: Get communication flow steps by type with proper data access
  const getCommunicationFlowSteps = (type: 'EMAIL' | 'SMS' | 'AIVOICE') => {
    const flows = formData.settings?.communicationFlows || [];
    const steps: any[] = [];
    
    flows.forEach((flow: any) => {
      flow.steps?.forEach((step: any) => {
        if (step.type === type.toLowerCase()) {
          steps.push({
            id: step.id,
            name: step.name || step.subject || `${type} Step`,
            flowName: flow.name
          });
        }
      });
    });
    
    return steps;
  };

  const renderValueField = (condition: any, ruleId: number) => {
    const noValueOperators = ['is_empty', 'is_not_empty', 'is_checked', 'is_unchecked', 'is_clicked'];
    
    if (noValueOperators.includes(condition.operator)) {
      return (
        <div className="h-10 flex items-center text-sm text-muted-foreground">
          No value needed
        </div>
      );
    }

    if (condition.operator === 'is_selected' && 
        ['dropdown', 'radio', 'checkbox', 'quiz_dropdown', 'quiz_radio', 'quiz_checkbox'].includes(
          getAllFormFields().find(f => f.id === condition.triggerField)?.type
        )) {
      return (
        <Select
          value={condition.value || ''}
          onValueChange={(value) => updateCondition(ruleId, condition.id, 'value', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Option" />
          </SelectTrigger>
          <SelectContent className="max-h-48 overflow-y-auto z-[9999]">
            {getFieldOptions(condition.triggerField).map((option: any) => (
              <SelectItem key={option.id} value={option.text}>
                {option.text}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    return (
      <Input
        value={condition.value || ''}
        onChange={(e) => updateCondition(ruleId, condition.id, 'value', e.target.value)}
        placeholder="Value"
      />
    );
  };

  const renderActionTargetField = (action: any, ruleId: number) => {
    if (action.action === 'show_confirmation') {
      return (
        <Select
          value={action.confirmationId || ''}
          onValueChange={(value) => updateAction(ruleId, action.id, 'confirmationId', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Confirmation" />
          </SelectTrigger>
          <SelectContent className="max-h-48 overflow-y-auto z-[9999]">
            {getConfirmations().map((confirmation: any) => (
              <SelectItem key={confirmation.id} value={confirmation.id.toString()}>
                {confirmation.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    } else if (action.action === 'send_email') {
      const emailSteps = getCommunicationFlowSteps('EMAIL');
      return (
        <Select
          value={action.emailId || ''}
          onValueChange={(value) => updateAction(ruleId, action.id, 'emailId', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Email Step" />
          </SelectTrigger>
          <SelectContent className="max-h-48 overflow-y-auto z-[9999]">
            {emailSteps.map((step: any) => (
              <SelectItem key={step.id} value={step.id.toString()}>
                {step.name} ({step.flowName})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    } else if (action.action === 'send_sms') {
      const smsSteps = getCommunicationFlowSteps('SMS');
      return (
        <Select
          value={action.smsId || ''}
          onValueChange={(value) => updateAction(ruleId, action.id, 'smsId', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select SMS Step" />
          </SelectTrigger>
          <SelectContent className="max-h-48 overflow-y-auto z-[9999]">
            {smsSteps.map((step: any) => (
              <SelectItem key={step.id} value={step.id.toString()}>
                {step.name} ({step.flowName})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    } else if (action.action === 'send_ai_voice') {
      const aiVoiceSteps = getCommunicationFlowSteps('AIVOICE');
      return (
        <Select
          value={action.aiVoiceId || ''}
          onValueChange={(value) => updateAction(ruleId, action.id, 'aiVoiceId', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select AI Voice Step" />
          </SelectTrigger>
          <SelectContent className="max-h-48 overflow-y-auto z-[9999]">
            {aiVoiceSteps.map((step: any) => (
              <SelectItem key={step.id} value={step.id.toString()}>
                {step.name} ({step.flowName})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    } else {
      return (
        <Select
          value={(action.targetFields || []).join(',')}
          onValueChange={(value) => updateAction(ruleId, action.id, 'targetFields', value.split(',').filter(Boolean))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Fields" />
          </SelectTrigger>
          <SelectContent className="max-h-48 overflow-y-auto z-[9999]">
            {getAllFormFields().map((field) => (
              <SelectItem key={field.id} value={field.id}>
                {field.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }
  };

  const renderOtherwiseTargetField = (rule: any, actionIndex: number) => {
    const otherwiseAction = rule.otherwiseActions?.[actionIndex];
    const action = otherwiseAction?.action;

    if (action === 'do_not_show_confirmation') {
      return (
        <Select
          value={otherwiseAction?.confirmationId || ''}
          onValueChange={(value) => updateOtherwiseAction(rule.id, actionIndex, 'confirmationId', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Confirmation" />
          </SelectTrigger>
          <SelectContent className="max-h-48 overflow-y-auto z-[9999]">
            {getConfirmations().map((confirmation: any) => (
              <SelectItem key={confirmation.id} value={confirmation.id.toString()}>
                {confirmation.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    } else if (action === 'do_not_send_email') {
      const emailSteps = getCommunicationFlowSteps('EMAIL');
      return (
        <Select
          value={otherwiseAction?.emailId || ''}
          onValueChange={(value) => updateOtherwiseAction(rule.id, actionIndex, 'emailId', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Email Step" />
          </SelectTrigger>
          <SelectContent className="max-h-48 overflow-y-auto z-[9999]">
            {emailSteps.map((step: any) => (
              <SelectItem key={step.id} value={step.id.toString()}>
                {step.name} ({step.flowName})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    } else if (action === 'do_not_send_sms') {
      const smsSteps = getCommunicationFlowSteps('SMS');
      return (
        <Select
          value={otherwiseAction?.smsId || ''}
          onValueChange={(value) => updateOtherwiseAction(rule.id, actionIndex, 'smsId', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select SMS Step" />
          </SelectTrigger>
          <SelectContent className="max-h-48 overflow-y-auto z-[9999]">
            {smsSteps.map((step: any) => (
              <SelectItem key={step.id} value={step.id.toString()}>
                {step.name} ({step.flowName})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    } else if (action === 'do_not_send_ai_voice') {
      const aiVoiceSteps = getCommunicationFlowSteps('AIVOICE');
      return (
        <Select
          value={otherwiseAction?.aiVoiceId || ''}
          onValueChange={(value) => updateOtherwiseAction(rule.id, actionIndex, 'aiVoiceId', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select AI Voice Step" />
          </SelectTrigger>
          <SelectContent className="max-h-48 overflow-y-auto z-[9999]">
            {aiVoiceSteps.map((step: any) => (
              <SelectItem key={step.id} value={step.id.toString()}>
                {step.name} ({step.flowName})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    } else {
      const mainAction = rule.actions[actionIndex];
      return (
        <Select
          value={(otherwiseAction?.targetFields || mainAction?.targetFields || []).join(',')}
          onValueChange={(value) => updateOtherwiseAction(rule.id, actionIndex, 'targetFields', value.split(',').filter(Boolean))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Fields" />
          </SelectTrigger>
          <SelectContent className="max-h-48 overflow-y-auto z-[9999]">
            {getAllFormFields().map((field) => (
              <SelectItem key={field.id} value={field.id}>
                {field.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Conditional Logic Rules</h3>
        <Button onClick={addRule} className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="h-4 w-4 mr-1" />
          Add Rule
        </Button>
      </div>

      <div className="space-y-6">
        {(formData.settings?.conditionalRules || []).map((rule: any) => (
          <div key={rule.id} className="p-6 border rounded-lg space-y-6 bg-card">
            <div className="flex items-center justify-between">
              <Input
                value={rule.name || ''}
                onChange={(e) => updateRule(rule.id, 'name', e.target.value)}
                className="font-medium text-lg"
                placeholder="Rule name"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeRule(rule.id)}
                className="text-destructive hover:text-destructive"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Conditions Section */}
            <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <Label className="font-semibold text-blue-800">IF Conditions</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addCondition(rule.id)}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Condition
                </Button>
              </div>

              {rule.conditions.map((condition: any, index: number) => (
                <div key={condition.id} className="p-4 bg-white rounded-md border border-blue-100 space-y-3">
                  {index > 0 && (
                    <div className="text-center">
                      <Select
                        value={condition.logicOperator || 'and'}
                        onValueChange={(value) => updateCondition(rule.id, condition.id, 'logicOperator', value)}
                      >
                        <SelectTrigger className="w-20 mx-auto">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="z-[9999]">
                          <SelectItem value="and">AND</SelectItem>
                          <SelectItem value="or">OR</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-4 gap-3">
                    <div>
                      <Label className="text-xs text-muted-foreground mb-1 block">Field</Label>
                      <Select
                        value={condition.triggerField || ''}
                        onValueChange={(value) => updateCondition(rule.id, condition.id, 'triggerField', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select field" />
                        </SelectTrigger>
                        <SelectContent className="max-h-48 overflow-y-auto z-[9999]">
                          {getAllFormFields().map((field) => (
                            <SelectItem key={field.id} value={field.id}>
                              {field.label}
                            </SelectItem>
                          ))}
                          <SelectItem value="quiz_total">Quiz Total Score</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label className="text-xs text-muted-foreground mb-1 block">Operator</Label>
                      <Select
                        value={condition.operator || 'equals'}
                        onValueChange={(value) => updateCondition(rule.id, condition.id, 'operator', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="max-h-48 overflow-y-auto z-[9999]">
                          <SelectItem value="equals">equals</SelectItem>
                          <SelectItem value="not_equals">not equals</SelectItem>
                          <SelectItem value="greater_than">greater than</SelectItem>
                          <SelectItem value="less_than">less than</SelectItem>
                          <SelectItem value="greater_than_or_equal">greater than or equal to</SelectItem>
                          <SelectItem value="less_than_or_equal">less than or equal to</SelectItem>
                          <SelectItem value="contains">contains</SelectItem>
                          <SelectItem value="starts_with">starts with</SelectItem>
                          <SelectItem value="does_not_start_with">does not start with</SelectItem>
                          <SelectItem value="ends_with">ends with</SelectItem>
                          <SelectItem value="does_not_end_with">does not end with</SelectItem>
                          <SelectItem value="is_empty">is empty</SelectItem>
                          <SelectItem value="is_not_empty">is not empty</SelectItem>
                          <SelectItem value="is_checked">is checked</SelectItem>
                          <SelectItem value="is_unchecked">is unchecked</SelectItem>
                          <SelectItem value="is_selected">is selected</SelectItem>
                          <SelectItem value="is_clicked">is clicked</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label className="text-xs text-muted-foreground mb-1 block">Value</Label>
                      {renderValueField(condition, rule.id)}
                    </div>
                    
                    <div className="flex items-end">
                      {rule.conditions.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeCondition(rule.id, condition.id)}
                          className="text-destructive hover:text-destructive w-full"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Actions and Otherwise Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="font-semibold text-green-800">THEN Actions & OTHERWISE Logic</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addAction(rule.id)}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Action Pair
                </Button>
              </div>

              {rule.actions.map((action: any, actionIndex: number) => (
                <div key={action.id} className="grid grid-cols-2 gap-4">
                  {/* THEN Action */}
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <Label className="text-sm font-semibold text-green-800 mb-3 block">
                      THEN Action {actionIndex + 1}
                    </Label>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-xs text-muted-foreground mb-1 block">Action</Label>
                        <Select
                          value={action.action || 'show'}
                          onValueChange={(value) => updateAction(rule.id, action.id, 'action', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="z-[9999]">
                            <SelectItem value="show">Show</SelectItem>
                            <SelectItem value="hide">Hide</SelectItem>
                            <SelectItem value="enable">Enable</SelectItem>
                            <SelectItem value="disable">Disable</SelectItem>
                            <SelectItem value="require">Set Required</SelectItem>
                            <SelectItem value="unrequire">Remove Required</SelectItem>
                            <SelectItem value="show_confirmation">Show Confirmation</SelectItem>
                            <SelectItem value="send_email">Send Email</SelectItem>
                            <SelectItem value="send_sms">Send SMS</SelectItem>
                            <SelectItem value="send_ai_voice">Send AI Voice</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label className="text-xs text-muted-foreground mb-1 block">Target</Label>
                        {renderActionTargetField(action, rule.id)}
                      </div>
                      
                      {rule.actions.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeAction(rule.id, action.id)}
                          className="text-destructive hover:text-destructive w-full"
                        >
                          <X className="h-4 w-4 mr-1" />
                          Remove Action Pair
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* OTHERWISE Action */}
                  <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <Label className="text-sm font-semibold text-orange-800 mb-3 block">
                      OTHERWISE for Action {actionIndex + 1}
                    </Label>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-xs text-muted-foreground mb-1 block">Action</Label>
                        <Select
                          value={rule.otherwiseActions?.[actionIndex]?.action || 'do_not_hide'}
                          onValueChange={(value) => updateOtherwiseAction(rule.id, actionIndex, 'action', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="z-[9999]">
                            <SelectItem value="do_not_show">Do Not Show</SelectItem>
                            <SelectItem value="do_not_hide">Do Not Hide</SelectItem>
                            <SelectItem value="do_not_enable">Do Not Enable</SelectItem>
                            <SelectItem value="do_not_disable">Do Not Disable</SelectItem>
                            <SelectItem value="do_not_require">Do Not Set Required</SelectItem>
                            <SelectItem value="do_not_unrequire">Do Not Remove Required</SelectItem>
                            <SelectItem value="do_not_show_confirmation">Do Not Show Confirmation</SelectItem>
                            <SelectItem value="do_not_send_email">Do Not Send Email</SelectItem>
                            <SelectItem value="do_not_send_sms">Do Not Send SMS</SelectItem>
                            <SelectItem value="do_not_send_ai_voice">Do Not Send AI Voice</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label className="text-xs text-muted-foreground mb-1 block">Target</Label>
                        {renderOtherwiseTargetField(rule, actionIndex)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {(formData.settings?.conditionalRules || []).length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-lg mb-2">No conditional rules configured.</p>
          <p className="text-sm">Add rules to show/hide or enable/disable fields based on user input.</p>
        </div>
      )}
    </div>
  );
};
