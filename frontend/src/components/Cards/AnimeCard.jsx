import React from 'react';

const AnimeCard = ({ title, image }) => {
  return (
    <div className="w-40 sm:w-48 md:w-56 lg:w-64 xl:w-72 rounded-2xl overflow-hidden shadow-md bg-neutral-700">
      {/* Image Container */}
      <div className="w-full h-52 sm:h-40 md:h-44 lg:h-56 xl:h-64">
        <img
          className="w-full h-full object-cover"
          src={image}
          alt={title || 'Anime Image'}
        />
      </div>
      {/* Title */}
      <div className="px-2 py-1">
        <div className="font-semibold text-gray-300 text-xs sm:text-sm md:text-base xl:text-lg truncate">
          {title}
        </div>
      </div>
    </div>
  );
};

export default AnimeCard;
