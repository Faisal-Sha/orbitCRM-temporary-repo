
export interface BaseElementProps {
  element: any;
  formValues: Record<string, any>;
  errors: Record<string, string>;
  hiddenElements: Set<string>;
  disabledElements: Set<string>;
  requiredElements: Set<string>;
  userLoginStatus: string;
  updateFormValue: (elementId: string, value: any) => void;
  isDisabled?: boolean;
  isRequired?: boolean;
  value?: any;
  error?: string;
}

export interface FormPreviewElementProps extends BaseElementProps {
  repeaterValues: Record<string, any[]>;
  signatureCanvasRefs: React.MutableRefObject<Record<string, HTMLCanvasElement>>;
  setRepeaterValues: React.Dispatch<React.SetStateAction<Record<string, any[]>>>;
  handleNext: () => void;
  handlePrevious: () => void;
  handleSubmit: () => void;
  canNavigateNext: () => boolean;
  currentStep: number;
  formData: any;
}
