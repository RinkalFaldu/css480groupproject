import React, { createContext, useState, useContext, ReactNode } from 'react';

interface DocContextType {
  documentTitle: string;
  setDocumentTitle: (title: string) => void;
  isEditing: boolean;
  setIsEditing: (editing: boolean) => void;
}

const DocContext = createContext<DocContextType>({
  documentTitle: 'Untitled document',
  setDocumentTitle: () => {},
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
  const [documentTitle, setDocumentTitle] = useState('Untitled document');
  const [isEditing, setIsEditing] = useState(false);

  const value = {
    documentTitle,
    setDocumentTitle,
    isEditing,
    setIsEditing,
  };

  return (
    <DocContext.Provider value={value}>
      {children}
    </DocContext.Provider>
  );
};