import React from 'react';
import { 
  Menu, 
  FileText,
  Share2,
  MessageSquare,
  Star,
  Save
} from 'lucide-react';
import { useDocContext } from '../context/DocContext';

const Navbar = () => {
  const { documentTitle } = useDocContext();

  return (
    <div className="bg-white border-b border-gray-200 px-2 py-1 flex items-center sticky top-0 z-10">
      <div className="flex items-center">
        <div className="p-2 hover:bg-gray-100 rounded-full cursor-pointer mr-1">
          <Menu size={20} className="text-gray-600" />
        </div>
        <div className="h-8 w-8 mr-2">
          <FileText size={24} className="text-blue-600" />
        </div>
      </div>
      
      <div className="flex-1">
        <div className="flex items-center space-x-4">
          <div className="flex space-x-1">
            <button className="px-3 py-1 text-sm hover:bg-gray-100 rounded">File</button>
            <button className="px-3 py-1 text-sm hover:bg-gray-100 rounded">Edit</button>
            <button className="px-3 py-1 text-sm hover:bg-gray-100 rounded">View</button>
            <button className="px-3 py-1 text-sm hover:bg-gray-100 rounded">Insert</button>
            <button className="px-3 py-1 text-sm hover:bg-gray-100 rounded">Format</button>
            <button className="px-3 py-1 text-sm hover:bg-gray-100 rounded">Tools</button>
            <button className="px-3 py-1 text-sm hover:bg-gray-100 rounded">Extensions</button>
            <button className="px-3 py-1 text-sm hover:bg-gray-100 rounded">Help</button>
          </div>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-1 text-gray-600">
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Save size={18} />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Star size={18} />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <MessageSquare size={18} />
          </button>
        </div>
        
        <button className="bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors flex items-center px-4 py-1 rounded text-sm font-medium">
          <Share2 size={16} className="mr-1" />
          Share
        </button>
      </div>
    </div>
  );
};

export default Navbar;