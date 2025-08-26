
export const useConditionalLogicEvaluator = () => {
  const evaluateCondition = (condition: any, formValues: Record<string, any>, quizScore: number) => {
    const fieldValue = condition.triggerField === 'quiz_total' ? quizScore : formValues[condition.triggerField];
    
    switch (condition.operator) {
      case 'equals':
        return fieldValue == condition.value;
      case 'not_equals':
        return fieldValue != condition.value;
      case 'greater_than':
        return parseFloat(fieldValue) > parseFloat(condition.value);
      case 'less_than':
        return parseFloat(fieldValue) < parseFloat(condition.value);
      case 'greater_than_or_equal':
        return parseFloat(fieldValue) >= parseFloat(condition.value);
      case 'less_than_or_equal':
        return parseFloat(fieldValue) <= parseFloat(condition.value);
      case 'contains':
        return String(fieldValue).toLowerCase().includes(String(condition.value).toLowerCase());
      case 'starts_with':
        return String(fieldValue).toLowerCase().startsWith(String(condition.value).toLowerCase());
      case 'does_not_start_with':
        return !String(fieldValue).toLowerCase().startsWith(String(condition.value).toLowerCase());
      case 'ends_with':
        return String(fieldValue).toLowerCase().endsWith(String(condition.value).toLowerCase());
      case 'does_not_end_with':
        return !String(fieldValue).toLowerCase().endsWith(String(condition.value).toLowerCase());
      case 'is_empty':
        return !fieldValue || fieldValue === '';
      case 'is_not_empty':
        return fieldValue && fieldValue !== '';
      case 'is_checked':
        return fieldValue === true;
      case 'is_unchecked':
        return fieldValue !== true;
      case 'is_selected':
        return Array.isArray(fieldValue) ? fieldValue.includes(condition.value) : fieldValue === condition.value;
      case 'is_clicked':
        return fieldValue === true;
      default:
        return false;
    }
  };

  const evaluateRule = (rule: any, formValues: Record<string, any>, quizScore: number) => {
    if (!rule.conditions || rule.conditions.length === 0) return false;
    
    let result = evaluateCondition(rule.conditions[0], formValues, quizScore);
    
    for (let i = 1; i < rule.conditions.length; i++) {
      const condition = rule.conditions[i];
      const conditionResult = evaluateCondition(condition, formValues, quizScore);
      const prevCondition = rule.conditions[i - 1];
      
      if (prevCondition.logicOperator === 'or') {
        result = result || conditionResult;
      } else {
        result = result && conditionResult;
      }
    }
    
    return result;
  };

  const getTriggeredConfirmation = (rules: any[], formValues: Record<string, any>, quizScore: number) => {
    console.log('Evaluating conditional rules for confirmation:', {
      rules: rules.length,
      formValues,
      quizScore
    });
    
    for (const rule of rules) {
      const conditionsMet = evaluateRule(rule, formValues, quizScore);
      console.log(`Rule "${rule.name}" conditions met:`, conditionsMet);
      
      if (conditionsMet) {
        // Check main actions for show_confirmation
        const confirmationAction = rule.actions.find((action: any) => action.action === 'show_confirmation');
        if (confirmationAction && confirmationAction.confirmationId) {
          console.log('Found triggered confirmation:', confirmationAction.confirmationId);
          return confirmationAction.confirmationId.toString();
        }
      } else {
        // Check otherwise actions - but only if they're NOT "do not show confirmation"
        const otherwiseActions = rule.otherwiseActions || [];
        const confirmationAction = otherwiseActions.find((action: any) => 
          action.action === 'show_confirmation' && action.confirmationId
        );
        if (confirmationAction) {
          console.log('Found otherwise confirmation:', confirmationAction.confirmationId);
          return confirmationAction.confirmationId.toString();
        }
      }
    }
    
    console.log('No conditional confirmation found, using default');
    return null;
  };

  return {
    evaluateCondition,
    evaluateRule,
    getTriggeredConfirmation
  };
};
