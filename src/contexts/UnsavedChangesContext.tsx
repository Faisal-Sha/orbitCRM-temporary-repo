import React, { createContext, useContext, useState, useCallback } from 'react';

interface UnsavedChangesContextType {
  hasUnsavedChanges: boolean;
  setHasUnsavedChanges: (value: boolean) => void;
  onSave: (() => Promise<void>) | null;
  setOnSave: (callback: (() => Promise<void>) | null) => void;
  onDiscard: (() => void) | null;
  setOnDiscard: (callback: (() => void) | null) => void;
  interceptNavigation: (targetTab: string, navigationCallback: () => void) => void;
  showUnsavedModal: boolean;
  setShowUnsavedModal: (show: boolean) => void;
  pendingNavigation: (() => void) | null;
  saving: boolean;
  setSaving: (saving: boolean) => void;
}

const UnsavedChangesContext = createContext<UnsavedChangesContextType | undefined>(undefined);

export const useUnsavedChanges = () => {
  const context = useContext(UnsavedChangesContext);
  if (context === undefined) {
    throw new Error('useUnsavedChanges must be used within UnsavedChangesProvider');
  }
  return context;
};

interface UnsavedChangesProviderProps {
  children: React.ReactNode;
}

export const UnsavedChangesProvider: React.FC<UnsavedChangesProviderProps> = ({ children }) => {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [onSave, setOnSave] = useState<(() => Promise<void>) | null>(null);
  const [onDiscard, setOnDiscard] = useState<(() => void) | null>(null);
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<(() => void) | null>(null);
  const [saving, setSaving] = useState(false);

  const interceptNavigation = useCallback((targetTab: string, navigationCallback: () => void) => {
    if (hasUnsavedChanges) {
      setPendingNavigation(() => navigationCallback);
      setShowUnsavedModal(true);
    } else {
      navigationCallback();
    }
  }, [hasUnsavedChanges]);

  const value: UnsavedChangesContextType = {
    hasUnsavedChanges,
    setHasUnsavedChanges,
    onSave,
    setOnSave,
    onDiscard,
    setOnDiscard,
    interceptNavigation,
    showUnsavedModal,
    setShowUnsavedModal,
    pendingNavigation,
    saving,
    setSaving,
  };

  return (
    <UnsavedChangesContext.Provider value={value}>
      {children}
    </UnsavedChangesContext.Provider>
  );
};