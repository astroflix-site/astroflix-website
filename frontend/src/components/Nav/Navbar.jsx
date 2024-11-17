import React from 'react';
import { Link } from 'react-router-dom';
import { CgMenuLeftAlt } from "react-icons/cg";
import { RxCross1 } from "react-icons/rx";
import Search from './Search';
import { useSelector } from 'react-redux'

const Navbar=() => {
  const isLoggedIn = useSelector((state)=> state.auth.isLoggedIn);
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Browse", path: "/browse" },
    { name: "Wishlist", path: "/bookmark" }
  ];
  const navLinksEnd = [
    { name: "Socials", path: "/category" },
    { name: "Message", path: "/category" },
  ];

  const [isOpen, setIsOpen] = React.useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="text-white px-4 md:px-8 xl:px-20 lg:px-12 py-4 flex  justify-between fixed top-0 left-0 w-full z-50 bg-transparent border-b border-white">

      {/* Navbar Content */}
      <div className="relative z-10 flex items-center lg:flex-1">
        <Link to="/" className="text-xs md:text-lg lg:text-lg xl:text-4xl font-medium font-serif tracking-widest">ASTROFLIX</Link>
        
        {/* Desktop Links */}
        <ul className="hidden lg:flex pl-2 xl:pl-6 text-gray-300 items-center lg:space-x-2 xl:space-x-4 lg:flex-1 justify-start">
          {navLinks.map((link, index) => (
            <li key={index}>
              <Link to={link.path} className="hover:font-semibold transition-all md:text-sm xl:text-lg duration-150 hover:underline">
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Centered Search Bar */}
      <div>
        <Search className="px-2 rounded-full border border-gray-400" />
      </div>

      {/* Desktop Links
      <ul className="hidden lg:flex text-gray-300 items-center xl:space-x-4 lg:space-x-2 lg:flex-1 xl:justify-center xl:ml-24 lg:justify-end">
        {navLinksEnd.map((link, index) => (
          <li key={index}>
            <Link to={link.path} className="hover:font-semibold transition-all duration-150 hover:underline xl:text-lg text-sm">
              {link.name}
            </Link>
          </li>
        ))}
      </ul> */}

      {/* Auth Buttons for Desktop */}
      <div className="hidden lg:flex items-center lg:space-x-2 xl:space-x-4 ml-4">
        {!isLoggedIn ? (
          <>
            <Link to="/login" className="px-4 py-2 border border-gray-400 rounded-full hover:bg-gray-100 xl:text-xl transition duration-150">Login</Link>
            <Link to="/register" className="px-4 py-2 bg-black text-white rounded-full hover:bg-gray-800 xl:text-xl transition duration-150">SignUp</Link>
          </>
        ) : (
          <Link to="/profile" className="flex items-center space-x-2">
            <img className="h-12 w-12 rounded-full" src="/user.png" alt="Profile" />
            <span className="text-black font-semibold"></span>
          </Link>
        )}
      </div>

      {/* Mobile Menu Button */}
      <div className="lg:hidden flex items-center">
        <button
          className={`text-2xl transform transition-transform duration-300 ${isOpen ? 'rotate-90' : 'rotate-0'}`}
          aria-label="Open menu"
          onClick={handleToggle}
        >
          <CgMenuLeftAlt />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed top-0 left-0 w-full h-full bg-gray-800 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ zIndex: 49 }}
      >
        <div className="w-full h-full flex flex-col justify-center items-center text-white">
          <button
            className="absolute top-4 right-4 text-2xl"
            aria-label="Close menu"
            onClick={handleToggle}
          >
            <RxCross1 />
          </button>

          <ul className="flex flex-col items-center space-y-6">
            {navLinks.map((link, index) => (
              <li key={index}>
                <Link to={link.path} onClick={handleToggle} className="text-xl hover:font-semibold transition-all duration-150">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex flex-col items-center mt-8 space-y-4">
            {!isLoggedIn ? (
              <>
                <Link to="/login" onClick={handleToggle} className="px-8 py-2 border border-white rounded-full hover:bg-gray-700 transition duration-150">Login</Link>
                <Link to="/register" onClick={handleToggle} className="px-8 py-2 bg-white text-black rounded-full hover:bg-gray-300 transition duration-150">Sign Up</Link>
              </>
            ) : (
              <Link to="/profile" onClick={handleToggle} className="flex items-center space-x-2">
                <img className="h-8 w-8 rounded-full" src="/user.png" alt="Profile" />
                <span className="text-xl font-semibold">Profile</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
