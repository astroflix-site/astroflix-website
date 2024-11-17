import React,{useEffect} from 'react';
import WatchBtn from '../components/Buttons/WatchBtn';
import WatchLaterBtn from '../components/Buttons/WatchLaterBtn';
import AnimeList from '../components/Cards/AnimeList';
import BookmarkButton from '../components/Buttons/BookmarkButton';
import { Link } from 'react-router-dom';
import Search from '../components/Search';
import './utility.css'
// import './Home.js'
const Home = () => {
  useEffect(() => {
    // Get the DOM elements
    const animeList = document.getElementById("animeList");
    const scrollLeftBtn = document.getElementById("scrollLeft");
    const scrollRightBtn = document.getElementById("scrollRight");

    if (animeList && scrollLeftBtn && scrollRightBtn) {
      // Scroll amount
      const scrollAmount = 300;

      // Event listeners
      const scrollLeft = () => {
        animeList.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      };

      const scrollRight = () => {
        animeList.scrollBy({ left: scrollAmount, behavior: "smooth" });
      };

      scrollLeftBtn.addEventListener("click", scrollLeft);
      scrollRightBtn.addEventListener("click", scrollRight);

      // Cleanup listeners on component unmount
      return () => {
        scrollLeftBtn.removeEventListener("click", scrollLeft);
        scrollRightBtn.removeEventListener("click", scrollRight);
      };
    }
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Browse", path: "/browse" },
    { name: "Wishlist", path: "/bookmark" }
  ];
  return (<>
    <div className="main bg-[#192026] w-full h-screen flex flex-col items-center">
      <nav className='w-[90%]  h-14 mt-8 flex items-center justify-between p-4'>
        <div className="name text-[#FFFFFF] text-4xl  font-Host">AstroFlix</div>
        <ul className='flex gap-10'>
        {navLinks.map((link, index) => (
            <li key={index}>
              <Link to={link.path} className="text-[#878786] text-lg">
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
        {/* <input type="search" name="Search" id="" placeholder='Search' className='bg-[#374151] rounded-full p-2 text-white' /> */}
        <Search/>
      </nav>
      <div className="spotlight w-[90%] h-[500px] bg-white rounded-xl m-6 overflow-hidden relative">
          <div className="black-shade w-full h-full"></div>
          <div className="spotlight-content ">
            
            <img src="https://img.uhdpaper.com/wallpaper/spy-x-family-poster-501@1@g-preview.jpg?dl" alt="" className="spotlight-image object-cover w-full h-full" />
            <div className="spotlight-text absolute top-10 left-5 z-20 font-Host w-[500px] h-full">
              <h1 className="text-4xl  text-white ">Spy x Family</h1>
              <p className="text-lg text-[#ffffff88] mt-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Deleniti perspiciatis molestiae libero delectus at dolorum reprehenderit distinctio culpa consectetur atque. </p>

            </div>
          </div>
      </div>
    </div>
    

    </>
  );
};

export default Home;
