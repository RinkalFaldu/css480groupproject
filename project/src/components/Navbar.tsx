import React from 'react';
import { 
  Menu, 
  Share2,
  MessageSquare,
  Star,
  Save
} from 'lucide-react';
import { useDocContext } from '../context/DocContext';

const Navbar = () => {
  
  return (
    <div className="bg-white border-b border-gray-200 px-2 py-1 flex items-center sticky top-0 z-10">
      <div className="flex items-center">
        <div className="p-2 hover:bg-gray-100 rounded-full cursor-pointer mr-1">
          <Menu size={20} className="text-gray-600" />
        </div>
      </div>

         <div className="w-10 h-10 flex items-center justify-center">
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path 
              d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" 
              fill="#4285F4" 
              stroke="#4285F4" 
              strokeWidth="1.5" 
            />
            <path 
              d="M14 2V8H20" 
              stroke="white" 
              strokeWidth="1.5" 
            />
            <path 
              d="M8 13H16M8 17H16M8 9H10" 
              stroke="white" 
              strokeWidth="1.5" 
              strokeLinecap="round" 
            />
          </svg>
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