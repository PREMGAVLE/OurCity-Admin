import React, { useEffect, useState } from "react";
import Logo from "../../../Images/SVG 1.png";
import MenuIcone from "../../../Images/Frame.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MdDashboard } from "react-icons/md";
import { FaRegClipboard } from "react-icons/fa";
import { SiHelpscout } from "react-icons/si";
import { LuLogOut } from "react-icons/lu";
import { IoNewspaperOutline } from "react-icons/io5";
import { TbBuildingBank } from "react-icons/tb";
import { useTranslation } from "react-i18next";
import { HiMenuAlt2 } from "react-icons/hi";
import { useUser } from "../../../hooks/use-user";
import { BsGlobe } from "react-icons/bs";
import { FaAward, FaWallet } from "react-icons/fa";
import { MdKeyboardArrowDown } from "react-icons/md";
import { FaArtstation } from "react-icons/fa6";
import { GoDotFill } from "react-icons/go";
import { IoMdLogOut } from "react-icons/io";
import { IoSettings } from "react-icons/io5";
const Navbar = () => {
  const { data: user } = useUser();
  // console.log(user);

  const navigate = useNavigate();

  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMenuOpen2, setIsMenuOpen2] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [vlaue, setVlue] = useState("");
  const [pro, setPro] = useState("");
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  const toggleMenu2 = () => {
    setIsMenuOpen2(!isMenuOpen2);
    console.log("clcik");
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };
  const closeMenu2 = () => {
    setIsMenuOpen2(false);
  };

  const [t, i18n] = useTranslation();

  const stHinmdi = () => {
    //  console.log(i18n.language)
    if (i18n.language == "en") {
      i18n.changeLanguage("hi");
    } else if (i18n.language == "hi") {
      i18n.changeLanguage("en");
    }
  };

  const ChageLang = (lang) => {
    if (lang == "en") {
      i18n.changeLanguage("en");
      setShowModal(false);
      // setMobileOpen(false);
    } else if (lang == "hi") {
      i18n.changeLanguage("hi");
      setShowModal(false);
      // setMobileOpen(false);
    }
  };
  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    setShowModal(false);
  };

  useEffect(() => {
    if (user) {
      setPro(user.profilePicUrl);
    }
  }, [user]);
  const getLinkClass = (path) => {
    return location.pathname === path
      ? "flex items-center p-2 text-purple bg-purple-100 rounded-lg dark:text-purple-400 group font-bold"
      : "flex items-center p-2 text-gray-900 rounded-lg dark:text-black group font-bold";
  };

  return (
    <>
      <nav className="bg-white border-gray-200 fixed top-0 w-full z-50  lg:h-12 h-16 ">
        <nav className="bg-white border-gray-200 fixed top-0 left-0 w-full z-50 shadow-xl lg:h-14 h-16">
          <div className="flex items-center justify-between lg:p-2 p-2 ">
            {/* Hamburger Icon on the left side */}
            <button
              type="button"
              className="flex items-center text-sm md:hidden pl-2"
              onClick={toggleMenu}
            >
              {/* <HiMenuAlt2 size={30} /> */}
              <img src={MenuIcone} alt="" className="w-10" />
            </button>

            {/* Logo in the center */}
            <div className="flex-grow flex justify-center md:justify-start  invisible md:visible">
              <a
                href="/dash"
                className="flex items-center space-x-3 rtl:space-x-reverse md:visible "
              >
                <img
                  src={Logo}
                  className="lg:w-28 w-28 md:visible"
                  alt="Learn2ern Logo"
                />
              </a>
            </div>

            {/* Avatar on the right side */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleMenu2}
                className="flex text-sm bg-purple rounded-xl p-1 text-white text-xl font-bold focus:ring-2 focus:ring-bgBlue dark:focus:ring-bgBlue mr-4 "
              >
                {/* <img
                    className="w-10 lg:w-12  rounded-full bg-bgBlue"
                    src={pro}
                    alt="user photo"
                  /> */}
                <IoSettings size={28} />
              </button>
            </div>
          </div>
        </nav>

        <div
          className={`w-60 absolute z-50 right-4 top-16 border border-purple p-2  ${
            isMenuOpen2 ? "" : "hidden"
          } text-base list-none bg-bgWhite rounded-xl`}
          id="user-dropdown"
        >
          <button
            type="button"
            className="absolute top-0 right-0 p-2 text-purple hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-200 font-semibold"
            onClick={closeMenu2}
          >
            <svg
              className="w-6 h-6 font-semibold"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
         
          <br />
          <div className="w-full flex flex-col justify-center items-center ">
            <div className="flex flex-col gap-2 justify-center items-center  text-bgBlue font-oswald  ">
              <div className="w-1/3 m-auto ">
                <img src={pro} alt="" className="rounded-full border  m-auto" />
              </div>

              <div className=" ">
                <h1 className="text-sm font-bold">{user?.name}</h1>

                <p className="text-sm">{user?.email}</p>
              </div>
            </div>
            <div className="w-full flex gap-4 justify-between items-center p-2  text-bgBlue font-oswald  ">
              <div className="ml-4 ">
                <p className="text-sm text-green font-semibold">
                  Active Course
                </p>
                <h1 className="font-bold text-purple">{user?.planName}</h1>
              </div>

              <div className=" mr-4 text-purple">
                <IoMdLogOut size={25} />
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div
        className={`fixed inset-0 z-50 transition-transform transform ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        } md:hidden`}
      >
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75"
          onClick={closeMenu}
        ></div>
        <div className="relative w-64 bg-white h-full shadow-xl z-50">
          <div className="flex justify-end items-center p-4 border-b border-gray-200">
            <div className="flex-grow flex  ">
              <a
                href="/dash"
                className="flex items-center space-x-3 rtl:space-x-reverse  "
              >
                <img src={Logo} className="w-28" alt="Learn2ern Logo" />
              </a>
            </div>
            {/* <span className="text-lg font-semibold">Menu</span> */}
            <button
              type="button"
              className="text-gray-600 hover:text-gray-800 "
              onClick={closeMenu}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <ul className="space-y-2 font-medium font-oswald font-bold p-4">
            <li onClick={closeMenu}>
              <Link to="/dash/home" className={getLinkClass("/dash/home")}>
                <MdDashboard className="w-7 h-7 text-bgBlue transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-black" />
                <span className="ms-3 text-lg font-semibold">Home</span>
              </Link>
            </li>
            <hr className="" />
            {user?.planName !== "TEST" && (
              <>
                <li onClick={closeMenu}>
                  <Link
                    to="/dash/quize"
                    className={getLinkClass("/dash/quize")}
                  >
                    <FaArtstation className="w-7 h-7 text-bgBlue transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-black" />
                    <span className="ms-3 text-lg font-semibold"> Quiz</span>
                  </Link>
                </li>
                <hr />
              </>
            )}
            <li onClick={closeMenu}>
              <Link to="/dash/plan" className={getLinkClass("/dash/plan")}>
                <IoNewspaperOutline className="w-7 h-7 text-bgBlue transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-black" />
                <span className="ms-3 text-lg font-semibold">Course</span>
              </Link>
            </li>
            <hr />
            <li onClick={closeMenu}>
              <Link
                to="/dash/contest"
                className={getLinkClass("/dash/contest")}
              >
                <FaAward className="w-7 h-7 text-bgBlue transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-black" />
                <span className="ms-3 text-lg font-semibold">Contest</span>
              </Link>
            </li>
            <hr />
            <li onClick={closeMenu}>
              <Link to="/dash/wallet" className={getLinkClass("/dash/wallet")}>
                <FaWallet className="w-7 h-7 text-bgBlue transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-black" />
                <span className="ms-3 text-lg font-semibold">Wallet</span>
              </Link>
            </li>
            <hr />
            <li onClick={toggleDropdown}>
              <div
                className={`flex items-center justify-between p-2 rounded-lg cursor-pointer ${
                  isOpen ? "bg-gray-100" : ""
                }`}
              >
                <div className="flex items-center">
                  <BsGlobe className="w-7 h-7 text-bgBlue transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-black" />
                  <span className="ms-3 text-lg font-semibold">Language</span>
                </div>
                <MdKeyboardArrowDown className="text-end" size={24} />
              </div>
              <ul
                id="dropdown-example"
                className={`space-y-2 font-medium flex flex-col items-center justify-center mt-2 text-end ${
                  isOpen ? "" : "hidden"
                }`}
              >
                <li
                  className="flex items-center  w-full  text-bgBlue font-bold text-lg pl-10 cursor-pointer"
                  onClick={() => changeLanguage("hi")}
                >
                  <GoDotFill className="text-purple mr-2" size={25} /> हिन्दी
                </li>
                <li
                  className="flex items-center  w-full  text-bgBlue font-bold text-lg pl-10 cursor-pointer"
                  onClick={() => changeLanguage("en")}
                >
                  <GoDotFill className="text-purple mr-2" size={25} /> English
                </li>
              </ul>
            </li>
            <hr />
            <li>
              <Link className={getLinkClass("/support")}>
                <SiHelpscout className="w-7 h-7 text-bgBlue transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-black" />
                <span className="ms-3 text-lg font-semibold">Support</span>
              </Link>
            </li>
            <hr />
            <li
              onClick={() => {
                localStorage.removeItem("token");
                navigate("/login");
              }}
            >
              <Link className={getLinkClass("/logout")}>
                <LuLogOut className="w-7 h-7 text-bgBlue transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-black" />
                <span className="ms-3 text-lg font-semibold">Logout</span>
              </Link>
            </li>
            <hr />
          </ul>
        </div>
        
      </div>
    </>
  );
};

export default Navbar;
