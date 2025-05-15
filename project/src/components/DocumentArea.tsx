import React, { useState } from 'react';

const DocumentArea: React.FC = () => {
  const [isFocused, setIsFocused] = useState(false);
  
  // Sample document content with multiple pages
  const pages = [
    {
      sections: [
        { type: 'heading', content: 'CSS480 Group Project' },
        { type: 'paragraph', content: 'What is mouse Gesture?' },
        { type: 'paragraph', content: 'When a user holds right click on their mouse, their cursor will turn into a pen design. The user can then draw various shapes or patterns to cause some behavior in the document. When a shape is recognized by the program, the path drawn by the user changes color to indicate a pattern match.' },
        { type: 'paragraph', content: 'When a user holds right click on their mouse, their cursor will turn into a pen design. The user can then draw various shapes or patterns to cause some behavior in the document. When a shape is recognized by the program, the path drawn by the user changes color to indicate a pattern match.' },
        { type: 'heading', content: 'Mouse Lock Gesture' },
        { type: 'paragraph', content: 'If the user draws an lock shape over a paragraph of text, that section will be locked to all other users without additional input, meaning that they cannot edit the body of the text. If any user draws a U shape over the locked section, it unlocks the section, re-allowing text input.' },
      ]
    },
    {
      sections: [
        { type: 'heading', content: 'Mouse Shake Gesture' },
        { type: 'paragraph', content: 'If the user shakes their mouse while holding right click, it will indicate to all other users that the shaking user wants everyone to look at their location. Their tab on the right side of the document will then become larger and light up to indicate this. Other users can click on that tab to be taken to the shaking user’s location on the document. ' },
        { type: 'bullet', content: 'This allow user to find where other users working in document' },
        { type: 'bullet', content: 'It also track work progress, by mouse movement of users' },
        { type: 'bullet', content: 'It also allow to track mouse position of users' },
        { type: 'bullet', content: 'This allow user to find where other users working in document' },
        { type: 'paragraph', content: 'We are using a mouse-input model, where users perform certain mouse motions (a circle, a star, a squiggle, etc.) to enact certain actions (launching a link, enlarging a section of the webpage, bookmarking a piece of content, etc.)' },
        { type: 'paragraph', content: 'If the user shakes their mouse while holding right click, it will indicate to all other users that the shaking user wants everyone to look at their location. Their tab on the right side of the document will then become larger and light up to indicate this. Other users can click on that tab to be taken to the shaking user’s location on the document.' },
      ]
    },
    {
      sections: [
        { type: 'heading', content: 'Budget and Resources' },
        { type: 'paragraph', content: 'The total budget for this project is estimated at $500,000, broken down as follows:' },
        { type: 'bullet', content: 'Software licenses and implementation: $250,000' },
        { type: 'bullet', content: 'Training and documentation: $100,000' },
        { type: 'bullet', content: 'Project management and oversight: $100,000' },
        { type: 'bullet', content: 'Contingency: $50,000' },
        { type: 'heading', content: 'Expected Benefits' },
        { type: 'paragraph', content: 'The implementation of this new system is expected to yield significant benefits across multiple areas of our organization. Key performance indicators will be tracked to measure the success of the implementation.' },
      ]
    }
  ];

  return (
    <div className="flex flex-col items-center gap-4 py-4 w-full">
      {pages.map((page, pageIndex) => (
        <div 
          key={pageIndex}
          className="bg-white shadow-md w-full max-w-[8.5in] mx-auto"
          style={{ height: '11in' }}
        >
          <div 
            className="px-[1in] py-[1in] h-full"
            onClick={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            tabIndex={0}
          >
            {page.sections.map((section, sectionIndex) => {
              if (section.type === 'heading') {
                return (
                  <h1 key={sectionIndex} className="text-2xl font-bold mb-4 text-gray-800">
                    {section.content}
                  </h1>
                );
              } else if (section.type === 'paragraph') {
                return (
                  <p key={sectionIndex} className="mb-4 text-gray-700 leading-relaxed">
                    {section.content}
                  </p>
                );
              } else if (section.type === 'bullet') {
                return (
                  <div key={sectionIndex} className="flex mb-2 pl-5">
                    <div className="mr-2">•</div>
                    <div className="text-gray-700">{section.content}</div>
                  </div>
                );
              }
              return null;
            })}
          </div>
        </div>
      ))}
      {isFocused && (
        <div className="h-5 w-px bg-black animate-pulse absolute"></div>
      )}
    </div>
  );
};

export default DocumentArea;