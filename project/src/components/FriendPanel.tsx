import React from 'react';

type Person = {
    name: string;
    scrollOptions?: ScrollToOptions;
};

export default function FriendPanel() {
    const peopleLocations: Person[] = [
        { name: 'Annushka Zolyomi', scrollOptions: { top: 0, left: 0, behavior: 'smooth' } },
        { name: 'Bill Gates', scrollOptions: { top: 200, left: 0, behavior: 'smooth' } },
        { name: 'You' }, // no scrollOptions
        { name: 'John Cena', scrollOptions: { top: 2000, left: 0, behavior: 'smooth' } }
    ];

    const handleScroll = (scrollOptions: ScrollToOptions) => {
        window.scrollTo(scrollOptions);
    };

    return (
        <div className="sticky top-[96px] bg-white shadow-md rounded-lg p-4 w-96 m-2 ml-4 self-start">

            <h2 className="text-lg font-semibold mb-4">Friends</h2>
            <ul className="space-y-2">
                {peopleLocations.map((person, index) => (
                    <li key={index} className="flex items-center justify-between">
                        <span>{person.name}</span>
                        {person.name === 'You' ? (
                            <button
                                onClick={() => alert("That's you!")}
                                className="text-blue-500 hover:underline"
                            >
                                Alert
                            </button>
                        ) : (
                            <button
                                onClick={() => person.scrollOptions && handleScroll(person.scrollOptions)}
                                className="text-blue-500 hover:underline"
                            >
                                Go to
                            </button>
                        )}
                    </li>
                ))}
            </ul>
        </div>

    );
}
