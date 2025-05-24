import React, { createContext, useState, useContext, ReactNode } from 'react';

interface DocContextType {
  isEditing: boolean;
  setIsEditing: (editing: boolean) => void;
}

const DocContext = createContext<DocContextType>({
  isEditing: false,
  setIsEditing: () => {},
});

export const useDocContext = () => {
  const context = useContext(DocContext);
  if (!context) {
    throw new Error('useDocContext must be used within a DocProvider');
  }
  return context;
};

interface DocProviderProps {
  children: ReactNode;
}

export const DocProvider = ({ children }: DocProviderProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const value = {
    isEditing,
    setIsEditing,
  };

  return (
    <DocContext.Provider value={value}>
      {children}
    </DocContext.Provider>
  );
};