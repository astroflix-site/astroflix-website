import React, { useEffect } from "react";
import WatchBtn from "../components/Buttons/WatchBtn";
import WatchLaterBtn from "../components/Buttons/WatchLaterBtn";
import AnimeList from "../components/Cards/AnimeList";
import BookmarkButton from "../components/Buttons/BookmarkButton";
import { Link } from "react-router-dom";
import Search from "../components/Nav/Search";
import "./utility.css";
// import './Home.js'
const Home = () => {
  
  const scroll = (containerClass, direction) => {
    const container = document.querySelector(`.${containerClass}`);
    const scrollAmount = 200; // Adjust as needed
    if (container) {
      if (direction === "next") {
        container.scrollBy({ left: scrollAmount, behavior: "smooth" });
      } else if (direction === "prev") {
        container.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      }
    }
  };
  

  const cards = [
    {
      title: "vinand saga",
      image:
        "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx153288-tD2OmKy5CJab.jpg",
    },
    {
      title: "vinand saga dsfdhf dfsfdsf sdfdsf",
      image:
        "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx153288-tD2OmKy5CJab.jpg",
    },
    {
      title: "vinand saga",
      image:
        "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx153288-tD2OmKy5CJab.jpg",
    },
    {
      title: "vinand saga",
      image:
        "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx153288-tD2OmKy5CJab.jpg",
    },
    {
      title: "vinand saga",
      image:
        "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx153288-tD2OmKy5CJab.jpg",
    },
    {
      title: "vinand saga",
      image:
        "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx153288-tD2OmKy5CJab.jpg",
    },
    {
      title: "vinand saga",
      image:
        "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx153288-tD2OmKy5CJab.jpg",
    },
    {
      title: "vinand saga",
      image:
        "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx153288-tD2OmKy5CJab.jpg",
    },
    {
      title: "vinand saga",
      image:
        "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx153288-tD2OmKy5CJab.jpg",
    },
    {
      title: "vinand saga",
      image:
        "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx153288-tD2OmKy5CJab.jpg",
    },
  ];
  return (
    <>
      <div className=" bg-[#192026] w-full h-full flex flex-col items-center">
        <div className="spotlight w-[90%] h-[500px] bg-white rounded-xl m-6 overflow-hidden relative">
          <div className="black-shade "></div>
          <div className="spotlight-content ">
            <img
              src="https://img.uhdpaper.com/wallpaper/spy-x-family-poster-501@1@g-preview.jpg?dl"
              alt=""
              className="spotlight-image object-cover w-full h-full"
            />
            <div className="spotlight-text absolute top-52 left-5 z-20 font-Host w-[500px]">
              <h1 className="spotlight-title text-4xl  text-white">
                Spy x Family
              </h1>
              <p className="spotlight-discriptions text-lg text-[#ffffff88] mt-4 font-Host">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem
                ipsum dolor sit, amet consectetur adipisicing elit. Deleniti
                perspiciatis molestiae libero delectus at dolorum reprehenderit
                distinctio culpa consectetur atque. Lorem ipsum dolor sit, amet
                consectetur adipisicing elit. Molestias officia reiciendis totam
                nisi sunt ab ad veniam eius fuga ipsam?{" "}
              </p>
              <div className="spotlight-buttons mt-2">
                <WatchBtn />
              </div>
            </div>
          </div>
        </div>
        <div className="main-section w-[90%]">
          <div className="popular-anime ">
            <h1 className="popular-anime-title text-3xl text-white  mb-4 font-Host">
              <i className="ri-arrow-right-wide-fill text-white "></i>Popular
              Anime
            </h1>
            <div className="relative w-full">
              {/* Scrollable card container */}
              <div className="popular-card-container flex w-full overflow-x-scroll scrollbar-hide relative z-0">
                <div className="cards-wrapper flex space-x-4">
                  {cards.map((entery, index) => (
                    <div
                      key={index}
                      className="card w-[150px] h-full   overflow-hidden rounded-lg shadow-lg transition-transform duration-200 hover:scale-110"
                    >
                      <div className="card-image w-[150px] h-[225px] ">
                        
                        <img
                          src={entery.image}
                          alt={entery.title}
                          className="object-cover w-full h-full rounded-lg"
                        />
                      </div>
                      <div className="card-title text-[#F5F5F5] text-center font-Host ">
                        {entery.title}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              
              <div className="scroller-buttons absolute top-1/2 right-1 transform -translate-y-1/2 z-10 flex flex-col space-y-2  rounded h-full w-10 justify-between">
                <button
                  className="nextButton px-3 py-1 bg-gray-700 text-white rounded-md shadow-lg h-[50%]"
                  onClick={() => scroll("popular-card-container","next")}
                >
                  <i className="ri-arrow-right-wide-line font-bold"></i>
                </button>
                <button
                  className="prevButton px-3 py-1 bg-gray-700 text-white rounded-md shadow-lg h-[50%]"
                  onClick={() => scroll("popular-card-container","prev")}
                >
                  <i className="ri-arrow-left-wide-line font-bold"></i>
                </button>
              </div>
            </div>
          </div>
          <div className="latest-anime my-10 ">
            <h1 className="latest-anime-title text-3xl text-white  mb-4 font-Host">
              <i className="ri-arrow-right-wide-fill text-white "></i>Latest Anime
            </h1>
            <div className="relative w-full">
              {/* Scrollable card container */}
              <div className="latest-card-container flex w-full overflow-x-scroll scrollbar-hide relative z-0">
                <div className="cards-wrapper flex space-x-4">
                  {cards.map((entery, index) => (
                    <div
                      key={index}
                      className="card w-[150px] h-full   overflow-hidden rounded-lg shadow-lg transition-transform duration-200 hover:scale-110"
                    >
                      <div className="card-image w-[150px] h-[225px] ">
                        
                        <img
                          src={entery.image}
                          alt={entery.title}
                          className="object-cover w-full h-full rounded-lg"
                        />
                      </div>
                      <div className="card-title text-[#F5F5F5] text-center font-Host ">
                        {entery.title}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              
              <div className="scroller-buttons absolute top-1/2 right-1 transform -translate-y-1/2 z-10 flex flex-col space-y-2  rounded h-full w-10 justify-between">
                <button
                  className="nextButton px-3 py-1 bg-gray-700 text-white rounded-md shadow-lg h-[50%]"
                  onClick={() => scroll("latest-card-container","next")}
                >
                  <i className="ri-arrow-right-wide-line font-bold"></i>
                </button>
                <button
                  className="prevButton px-3 py-1 bg-gray-700 text-white rounded-md shadow-lg h-[50%]"
                  onClick={() => scroll("latest-card-container","prev")}
                >
                  <i className="ri-arrow-left-wide-line font-bold"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
