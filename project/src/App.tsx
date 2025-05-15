import React from 'react';
import DocumentEditor from './components/DocumentEditor';
import { DocProvider } from './context/DocContext';

function App() {
  return (
    <DocProvider>
      <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
        <DocumentEditor />
      </div>
    </DocProvider>
  );
}

export default App;