import React, { useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';

const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Simulated search function
  const fetchSearchResults = (term) => {
    const simulatedResults = [
      'Naruto',
      'Attack on Titan',
      'One Piece',
      'Dragon Ball Z',
      'My Hero Academia',
      'Demon Slayer',
      'Death Note',
      'Fullmetal Alchemist',
      'Sword Art Online',
    ];

    const filteredResults = simulatedResults.filter((item) =>
      item.toLowerCase().includes(term.toLowerCase())
    );

    setSearchResults(filteredResults);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchTerm);
    fetchSearchResults(searchTerm);
  };

  const handleResultClick = (result) => {
    console.log('Selected result:', result);
    setSearchTerm(result);
    setIsMenuOpen(false); // Close menu after selecting a result
  };

  return (
    <div className="relative">
      {/* Normal Search Input */}
      <form
        onClick={() => setIsMenuOpen(true)}
        className="flex items-center w-full max-w-md lg:max-w-lg xl:max-w-xl border border-gray-300 rounded-full overflow-hidden shadow-md cursor-pointer"
      >
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search Anime..."
          className="w-full py-3 px-5 text-lg xl:text-xl text-gray-700 focus:outline-none"
          readOnly // Input is read-only to trigger menu opening
        />
      </form>

      {/* Fullscreen Search Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-neutral-900 bg-opacity-95 flex flex-col items-center justify-center transition-opacity duration-300">
          {/* Close Button */}
          <button
            onClick={() => setIsMenuOpen(false)}
            className="absolute top-6 right-6 text-gray-400 hover:text-white"
          >
            <AiOutlineClose size={28} />
          </button>

          {/* Search Input for Menu */}
          <form
            onSubmit={handleSearch}
            className="w-full max-w-lg flex items-center border-b border-gray-600 pb-3"
          >
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search Anime..."
              className="w-full px-4 py-2 text-base text-white bg-transparent placeholder-gray-500 focus:outline-none"
              autoFocus // Focuses input when menu opens
            />
          </form>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="mt-8 w-full max-w-lg max-h-60 overflow-y-auto bg-neutral-800 rounded-lg shadow-lg">
              <ul className="text-base">
                {searchResults.map((result, index) => (
                  <li
                    key={index}
                    onClick={() => handleResultClick(result)}
                    className="px-6 py-3 text-gray-300 hover:text-white hover:bg-neutral-700 cursor-pointer"
                  >
                    {result}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* No Results Feedback */}
          {searchResults.length === 0 && searchTerm.length > 0 && (
            <p className="mt-8 text-gray-500 text-lg">No results found</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;
