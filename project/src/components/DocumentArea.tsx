import React, { useState, useRef, useEffect } from 'react';



type SectionType = 'heading' | 'paragraph' | 'bullet';

interface Section {
  type: SectionType;
  content: string;
  id?: string;
}

interface Page {
  sections: Section[];
}

const initialPages: Page[] = [
  {
    sections: [
      { type: 'heading', content: 'CSS480 Group Project Spring 2025' },
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

const DocumentArea: React.FC = () => {
  // Add unique IDs to each section for editing
  const [pages, setPages] = useState<Page[]>(
    initialPages.map(page => ({
      sections: page.sections.map((section, idx) => ({
        ...section,
        id: `${section.type}-${Math.random().toString(36).substr(2, 9)}-${idx}`
      }))
    }))
  );
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Auto-resize textarea when content changes
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [editingContent, activeSection]);

  const handleSectionClick = (sectionId: string, content: string) => {
    setActiveSection(sectionId);
    setEditingContent(content);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditingContent(e.target.value);
  };

  const handleBlur = (pageIdx: number, sectionIdx: number) => {
    if (activeSection) {
      setPages(prevPages =>
        prevPages.map((page, pIdx) =>
          pIdx === pageIdx
            ? {
                ...page,
                sections: page.sections.map((section, sIdx) =>
                  sIdx === sectionIdx
                    ? { ...section, content: editingContent }
                    : section
                )
              }
            : page
        )
      );
      setActiveSection(null);
    }
  };
  // Prevent the default context menu from appearing
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  return (
    <div
        className="flex flex-col items-center gap-4 py-4 w-full"
        onContextMenu={handleContextMenu}
    >
      {pages.map((page, pageIndex) => (
        <div
          key={pageIndex}
          className="bg-white shadow-md w-full max-w-[8.5in] mx-auto"
          style={{ minHeight: '11in' }}
        >
          <div className="px-[1in] py-[1in]">
            {page.sections.map((section, sectionIdx) => (
              <div key={section.id} className="mb-2">
                {activeSection === section.id ? (
                  <textarea
                    ref={textareaRef}
                    value={editingContent}
                    onChange={handleContentChange}
                    onBlur={() => handleBlur(pageIndex, sectionIdx)}
                    className={`w-full overflow-hidden focus:outline-none ${
                      section.type === 'heading'
                        ? 'text-2xl font-bold mb-2'
                        : section.type === 'bullet'
                        ? 'pl-6 mb-1'
                        : 'mb-2'
                    }`}
                    autoFocus
                    rows={1}
                    style={{
                      resize: 'none',
                      minHeight: section.type === 'heading' ? '2em' : '1.5em'
                    }}
                  />
                ) : (
                  <div
                    onClick={() => handleSectionClick(section.id!, section.content)}
                    className={`cursor-text flex items-start ${
                      section.type === 'heading'
                        ? 'text-2xl font-bold mb-2'
                        : section.type === 'bullet'
                        ? 'pl-6 mb-1'
                        : 'mb-2'
                    }`}
                  >
                    {section.type === 'bullet' && (
                      <span className="mr-2 mt-1 text-lg">•</span>
                    )}
                    <span>{section.content}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DocumentArea;