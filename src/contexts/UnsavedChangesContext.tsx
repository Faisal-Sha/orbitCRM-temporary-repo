
import React, { createContext, useContext, useState, useCallback } from 'react';

interface UnsavedChangesContextType {
  hasUnsavedChanges: boolean;
  setHasUnsavedChanges: (hasChanges: boolean) => void;
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  pendingNavigation: (() => void) | null;
  setPendingNavigation: (callback: (() => void) | null) => void;
  onSave: (() => Promise<void>) | null;
  setOnSave: (callback: (() => Promise<void>) | null) => void;
  onDiscard: (() => void) | null;
  setOnDiscard: (callback: (() => void) | null) => void;
  interceptNavigation: (callback: () => void) => void;
}

const UnsavedChangesContext = createContext<UnsavedChangesContextType | undefined>(undefined);

export const useUnsavedChanges = () => {
  const context = useContext(UnsavedChangesContext);
  if (!context) {
    throw new Error('useUnsavedChanges must be used within UnsavedChangesProvider');
  }
  return context;
};

export const UnsavedChangesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<(() => void) | null>(null);
  const [onSave, setOnSave] = useState<(() => Promise<void>) | null>(null);
  const [onDiscard, setOnDiscard] = useState<(() => void) | null>(null);

  const interceptNavigation = useCallback((callback: () => void) => {
    if (hasUnsavedChanges) {
      setPendingNavigation(() => callback);
      setShowModal(true);
    } else {
      callback();
    }
  }, [hasUnsavedChanges]);

  return (
    <UnsavedChangesContext.Provider
      value={{
        hasUnsavedChanges,
        setHasUnsavedChanges,
        showModal,
        setShowModal,
        pendingNavigation,
        setPendingNavigation,
        onSave,
        setOnSave,
        onDiscard,
        setOnDiscard,
        interceptNavigation,
      }}
    >
      {children}
    </UnsavedChangesContext.Provider>
  );
};
