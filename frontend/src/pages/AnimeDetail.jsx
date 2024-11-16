import React, { useState } from 'react';
import ReactPlayer from 'react-player'; // Ensure you have the react-player installed

// Your custom button components (import them if needed)
import WatchBtn from '../components/Buttons/WatchBtn';
import WatchLaterBtn from '../components/Buttons/WatchLaterBtn';

function AnimeDetail() {
  const [selectedSeason, setSelectedSeason] = useState('Season 1');
  const [episodeIndex, setEpisodeIndex] = useState(5); // Initialize to show first 5 episodes

  // Dummy data for episodes (replace with your actual data)
  const episodes = [
    { title: 'Episode 1', duration: '24 min', image: 'image_link_1' },
    { title: 'Episode 2', duration: '24 min', image: 'image_link_2' },
    { title: 'Episode 3', duration: '24 min', image: 'image_link_3' },
    { title: 'Episode 4', duration: '24 min', image: 'image_link_4' },
    { title: 'Episode 5', duration: '24 min', image: 'image_link_5' },
    { title: 'Episode 6', duration: '24 min', image: 'image_link_6' },
    { title: 'Episode 7', duration: '24 min', image: 'image_link_7' },
    { title: 'Episode 8', duration: '24 min', image: 'image_link_8' },
    // Add more episodes here...
  ];

  const handleSeasonChange = (event) => {
    setSelectedSeason(event.target.value);
  };

  // Show only the episodes that should be displayed
  const displayedEpisodes = episodes.slice(0, episodeIndex);

  // Handle "Next Episode" button click
  const loadMoreEpisodes = () => {
    if (episodeIndex < episodes.length) {
      setEpisodeIndex(episodeIndex + 1); // Show one more episode
    }
  };

  return (
    <div className="flex pt-28 flex-col p-6 bg-neutral-800 min-h-screen">
      <div className="flex flex-col md:flex-row space-y-6 md:space-x-6">
        {/* Video Player */}
        <div className="flex-1 mb-6">
          <ReactPlayer
            url="/videos/clip.mp4" // Use the video from the public folder
            playing
            muted
            loop
            width="100%"
            height="auto"
          />
        </div>

        {/* Anime Info */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-neutral-100 mb-4">Anime Title</h1>
          <p className="text-neutral-300 mb-4">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi officiis eius quidem nostrum omnis iste, sint repellat? Ratione consequatur, harum totam reprehenderit nulla quidem, dolor perspiciatis laboriosam at itaque repellendus, facilis similique ab repellat sed! Libero quidem, cum ullam aperiam modi perspiciatis esse repudiandae, temporibus iusto saepe accusantium quibusdam voluptate soluta, officiis porro amet!
          </p>
          <div className="flex space-x-2 mb-4">
            <WatchLaterBtn />
          </div>

          {/* Episode List */}
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-2 text-neutral-100">Episodes</h2>
            <ul className="list-disc pl-6 space-y-1 text-neutral-300">
              {displayedEpisodes.map((episode, index) => (
                <li key={index} className="max-h-6">
                  <div className="flex items-center">
                    <img src={episode.image} alt='' className="w-12 h-12 rounded mr-3" />
                    <span>{episode.title} - <span className="text-neutral-400">{episode.duration}</span></span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Select Season Dropdown */}
      <div className="mb-4">
        <label htmlFor="seasons" className="block mb-2 text-neutral-100">Select Season:</label>
        <select
          id="seasons"
          value={selectedSeason}
          onChange={handleSeasonChange}
          className="border border-gray-300 rounded p-2 bg-neutral-700 text-neutral-100"
        >
          <option value="Season 1">Season 1</option>
          <option value="Season 2">Season 2</option>
          <option value="Season 3">Season 3</option>
        </select>
      </div>

      {/* More Like This */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2 text-neutral-100">More Like This</h2>
        <div className="flex gap-4">
          {/* Similar anime list (replace with actual images and titles) */}
          <div className="bg-neutral-700 p-4 rounded shadow">
            <img src="image_link_A" alt="Anime A" className="w-[8vw] h-[12vh] mb-2" />
            <h3 className="text-center text-neutral-300">Anime A</h3>
          </div>
          <div className="bg-neutral-700 p-4 rounded shadow">
            <img src="image_link_B" alt="Anime B" className="w-[8vw] h-[12vh] mb-2" />
            <h3 className="text-center text-neutral-300">Anime B</h3>
          </div>
          <div className="bg-neutral-700 p-4 rounded shadow">
            <img src="image_link_C" alt="Anime C" className="w-[8vw] h-[12vh] mb-2" />
            <h3 className="text-center text-neutral-300">Anime C</h3>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnimeDetail;
