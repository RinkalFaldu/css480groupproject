import React from 'react';
import Toolbar from './components/Toolbar';
import Navbar from './components/Navbar';
import StatusBar from './components/StatusBar';
import DocumentArea from './components/DocumentArea';
import { DocProvider } from './context/DocContext';

function App() {
  return (
    <DocProvider>
      <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col">
          <Toolbar />
          <div className="flex-1 overflow-auto flex justify-center bg-[#f8f9fa] py-4">
            <DocumentArea />
          </div>
          <StatusBar />
        </div>
      </div>
    </DocProvider>
  );
}

export default App;