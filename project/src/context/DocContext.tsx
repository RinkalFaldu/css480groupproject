import React, { createContext, useState, useContext, ReactNode } from 'react';

interface DocContextType {
    isEditing: boolean;
    setIsEditing: (editing: boolean) => void;

    shakeDetected: boolean;
    setShakeDetected: (shake: boolean) => void;
}

const DocContext = createContext<DocContextType>({
    isEditing: false,
    setIsEditing: () => {},

    shakeDetected: false,
    setShakeDetected: () => {},
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
    const [shakeDetected, setShakeDetected] = useState(false);

    const value = {
        isEditing,
        setIsEditing,
        shakeDetected,
        setShakeDetected,
    };

    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
    };

    return (
        <div
            className="flex flex-col min-h-screen relative"
            onContextMenu={handleContextMenu}
        >
            <DocContext.Provider value={value}>
                {children}
            </DocContext.Provider>
        </div>
    );
};
