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
    <div className="bg-[#192026] w-full flex flex-col items-center">
      <nav className='w-[90%]  h-14 mt-8 flex items-center justify-between p-4'>
        <div className="name text-[#FFFFFF] text-4xl  font-Host">AstroFlix</div>
        <ul className='flex gap-10'>
        {navLinks.map((link, index) => (
            <li key={index}>
              <Link to={link.path} className="text-[#878786] text-lg font-Host">
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
        {/* <input type="search" name="Search" id="" placeholder='Search' className='bg-[#374151] rounded-full p-2 text-white' /> */}
        <Search/>
        <div className="buttons flex gap-2">
          <button className="bg-[#374151] text-white rounded-lg px-4 py-2 hover:bg-[#475057] transition duration-300">LogIn</button>
          <button className="bg-[#374151] text-white rounded-lg px-4 py-2 hover:bg-[#475057] transition duration-300">SignIn</button>
        </div>
        
      </nav>
    </div>
    
  );
}

export default Navbar;
