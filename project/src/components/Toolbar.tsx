import React from 'react';
import { 
  Undo, 
  Redo, 
  Printer, 
  Bold, 
  Italic, 
  Underline, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignJustify,
  List,
  ListOrdered,
  Heading,
  Link,
  Type,
  ChevronDown
} from 'lucide-react';

const Toolbar: React.FC = () => {
  return (
    <div className="bg-white px-2 py-1 border-b border-gray-200 flex items-center space-x-2 overflow-x-auto sticky top-12 z-10">
      <div className="flex items-center space-x-1">
        <button className="p-1.5 hover:bg-gray-100 rounded-md">
          <Undo size={16} className="text-gray-600" />
        </button>
        <button className="p-1.5 hover:bg-gray-100 rounded-md">
          <Redo size={16} className="text-gray-600" />
        </button>
        <button className="p-1.5 hover:bg-gray-100 rounded-md">
          <Printer size={16} className="text-gray-600" />
        </button>
      </div>
      
      <div className="h-4 w-px bg-gray-300"></div>
      
      <div className="flex items-center">
        <button className="flex items-center px-2 py-1 text-sm hover:bg-gray-100 rounded">
          Normal text
          <ChevronDown size={14} className="ml-1 text-gray-600" />
        </button>
      </div>
      
      <div className="flex items-center">
        <button className="flex items-center px-2 py-1 text-sm hover:bg-gray-100 rounded">
          Arial
          <ChevronDown size={14} className="ml-1 text-gray-600" />
        </button>
      </div>
      
      <div className="h-4 w-px bg-gray-300"></div>
      
      <div className="flex items-center space-x-1">
        <button className="p-1.5 hover:bg-gray-100 rounded-md">
          <Bold size={16} className="text-gray-600" />
        </button>
        <button className="p-1.5 hover:bg-gray-100 rounded-md">
          <Italic size={16} className="text-gray-600" />
        </button>
        <button className="p-1.5 hover:bg-gray-100 rounded-md">
          <Underline size={16} className="text-gray-600" />
        </button>
      </div>
      
      <div className="h-4 w-px bg-gray-300"></div>
      
      <div className="flex items-center space-x-1">
        <button className="p-1.5 hover:bg-gray-100 rounded-md">
          <AlignLeft size={16} className="text-gray-600" />
        </button>
        <button className="p-1.5 hover:bg-gray-100 rounded-md">
          <AlignCenter size={16} className="text-gray-600" />
        </button>
        <button className="p-1.5 hover:bg-gray-100 rounded-md">
          <AlignRight size={16} className="text-gray-600" />
        </button>
        <button className="p-1.5 hover:bg-gray-100 rounded-md">
          <AlignJustify size={16} className="text-gray-600" />
        </button>
      </div>
      
      <div className="h-4 w-px bg-gray-300"></div>
      
      <div className="flex items-center space-x-1">
        <button className="p-1.5 hover:bg-gray-100 rounded-md">
          <List size={16} className="text-gray-600" />
        </button>
        <button className="p-1.5 hover:bg-gray-100 rounded-md">
          <ListOrdered size={16} className="text-gray-600" />
        </button>
      </div>
      
      <div className="h-4 w-px bg-gray-300"></div>
      
      <div className="flex items-center space-x-1">
        <button className="p-1.5 hover:bg-gray-100 rounded-md">
          <Link size={16} className="text-gray-600" />
        </button>
      </div>
    </div>
  );
};

export default Toolbar;