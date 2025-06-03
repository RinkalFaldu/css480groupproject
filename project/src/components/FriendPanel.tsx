import React, { useState } from 'react';
import { useDocContext } from '../context/DocContext';

type Person = {
    name: string;
    locationInDoc: string;
    scrollOptions?: ScrollToOptions;
};

export default function FriendPanel() {
    const { shakeDetected } = useDocContext();

    const peopleLocations: Person[] = [
        { name: 'Annushka Zolyomi', locationInDoc: '✏️ Title', scrollOptions: { top: 0, left: 0, behavior: 'smooth' } },
        { name: 'Bill Gates', locationInDoc: '✏️ Mouse Lock Gesture', scrollOptions: { top: 200, left: 0, behavior: 'smooth' } },
        { name: 'You', locationInDoc: '🔃 Start of Document' },
        { name: 'John Cena', locationInDoc: '💤 Idle for 5 minutes', scrollOptions: { top: 2000, left: 0, behavior: 'smooth' } }
    ];

    const [lastScrollPosition, setLastScrollPosition] = useState<number | null>(null);
    const [hasGoneToSomeone, setHasGoneToSomeone] = useState<boolean>(false);

    const handleGoTo = (person: Person) => {
        if (person.scrollOptions) {
            setLastScrollPosition(window.scrollY);
            setHasGoneToSomeone(true);
            window.scrollTo(person.scrollOptions);
        }
    };

    const handleGoBack = () => {
        if (lastScrollPosition !== null) {
            window.scrollTo({ top: lastScrollPosition, behavior: 'smooth' });
            setHasGoneToSomeone(false);
            setLastScrollPosition(null);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        setLastScrollPosition(null);
        setHasGoneToSomeone(false);
    };

    return (
        <div className="sticky top-[96px] bg-white shadow-md rounded-lg p-4 w-64 m-2 ml-4 self-start">
            <table className="w-full table-fixed">
                <tbody>
                    {peopleLocations.map((person, index) => (
                        <tr
                            key={index}
                            className={`border-b border-gray-200 ${person.name === 'You' && shakeDetected ? 'animate-pulse-yellow' : ''
                                }`}
                        >

                            <td className="pr-4 py-2 w-44">
                                <div className="flex flex-col">
                                    <span className="font-medium">{person.name}</span>
                                    <span className="text-sm text-gray-500">{person.locationInDoc}</span>
                                </div>
                            </td>
                            <td className={`text-right py-2`}>
                                {person.name === 'You' ? (
                                    hasGoneToSomeone ? (
                                        <button
                                            onClick={handleGoBack}
                                            className="text-red-500 bg-white border border-red-500 rounded-full px-2 py-1 hover:bg-red-50 transition-colors duration-200"
                                        >
                                            ⬅️
                                        </button>
                                    ) : (
                                        <button
                                            onClick={scrollToTop}
                                            className="text-blue-500 bg-white border border-blue-500 rounded-full px-2 py-1 hover:bg-blue-50 transition-colors duration-200"
                                        >
                                            ⬆️
                                        </button>
                                    )
                                ) : (
                                    <button
                                        onClick={() => handleGoTo(person)}
                                        className="text-blue-500 bg-white border border-blue-500 rounded-full px-2 py-1 hover:bg-blue-50 transition-colors duration-200"
                                    >
                                        ➡️
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
