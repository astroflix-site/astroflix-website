import React from 'react';
import WatchBtn from '../components/Buttons/WatchBtn';
import WatchLaterBtn from '../components/Buttons/WatchLaterBtn';
import AnimeList from '../components/Cards/Animelist';

const Home = () => {
  return (
    <div className="relative w-full h-screen bg-neutral-800">
      {/* Background video */}
      <video
        src="/videos/clip.mp4"
        autoPlay
        loop
        muted
        className="absolute top-0 left-0 w-full h-4/5 object-cover z-0 bg-opacity-80"
      />
      {/* Content container */}
      <div className="relative z-10 flex flex-col justify-center items-center md:items-start  pb-20 md:pb-32 lg:pb-40 w-full h-full text-center md:text-left">
        {/* Title and description */}
        <div className="flex flex-col mt-8 md:mt-0 px-4 md:pl-10 lg:pl-16 xl:pl-28 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
          <h1 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-6xl font-bold font-Roboto">
            Chainsaw Man
          </h1>
          <p className="text-white font-medium text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl mt-4">
            Denji has a simple dream - to live a happy and peaceful life, spending time with a girl.
          </p>
        </div>

        {/* Button container */}
        <div className="mt-4 md:pl-10 lg:pl-16 xl:pl-28 flex space-x-2 px-4 md:px-0">
          <WatchBtn />
          <WatchLaterBtn />
        </div>

        {/* Carousel Container */}
        <div className="fixed sm:overflow-x-auto bottom-1 px-4 sm:px-10 md:px-16 lg:px-20 xl:px-24 w-full">
          <AnimeList />
        </div>
      </div>

    </div>
  );
};

export default Home;
