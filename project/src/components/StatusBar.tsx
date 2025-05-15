import React from 'react';
import { Eye, Clock, Smile, ChevronDown } from 'lucide-react';

const StatusBar: React.FC = () => {
  return (
    <div className="bg-white border-t border-gray-200 px-4 py-1 flex items-center justify-between text-xs text-gray-600">
      <div className="flex items-center space-x-4">
        <div className="flex items-center">
          <Clock size={14} className="mr-1" />
          <span>Last edit was 2 minutes ago</span>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="flex items-center px-2 py-1 rounded hover:bg-gray-100 cursor-pointer">
          <Eye size={14} className="mr-1" />
          <span>Editing</span>
          <ChevronDown size={12} className="ml-1" />
        </div>
        
        <div className="flex items-center px-2 py-1 rounded hover:bg-gray-100 cursor-pointer">
          <Smile size={14} className="mr-1" />
          <span>All changes saved</span>
        </div>
      </div>
    </div>
  );
};

export default StatusBar;