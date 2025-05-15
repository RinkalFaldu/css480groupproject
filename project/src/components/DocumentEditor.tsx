import React from 'react';
import Navbar from './Navbar';
import Toolbar from './Toolbar';

import DocumentArea from './DocumentArea';
import StatusBar from './StatusBar';

const DocumentEditor: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-1 flex flex-col">
        <Toolbar />
        <div className="flex-1 overflow-auto flex justify-center bg-[#f8f9fa] py-4">
          <DocumentArea />
        </div>
        <StatusBar />
      </div>
    </div>
  );
};

export default DocumentEditor;