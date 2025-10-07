import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { MdDashboard, MdKeyboardArrowDown } from "react-icons/md";
import { FaAward, FaWallet } from "react-icons/fa";
import { IoNewspaperOutline } from "react-icons/io5";
import { BsGlobe } from "react-icons/bs";
import { SiHelpscout } from "react-icons/si";
import { LuLogOut } from "react-icons/lu";
import Layout from "./Layout";
import { useUser } from "../../../hooks/use-user";
import { FaArtstation } from "react-icons/fa6";
import { MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";
import { RiArrowLeftRightFill } from "react-icons/ri";
import { FaRegCircleDot } from "react-icons/fa6";
import { GoDotFill } from "react-icons/go";
import { FaUsers } from "react-icons/fa";
import { FaBookOpenReader } from "react-icons/fa6";
import { GiTakeMyMoney } from "react-icons/gi";
import { FaBox } from "react-icons/fa";
const Sidebar = () => {
  const { data: user } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const [isOpen3, setIsOpen3] = useState(false);
  const [isOpen4, setIsOpen4] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [t, i18n] = useTranslation();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  const toggleDropdown2 = () => {
    setIsOpen2(!isOpen2);
  };
  const toggleDropdown3 = () => {
    setIsOpen3(!isOpen3);
  };
  const toggleDropdown4 = () => {
    setIsOpen4(!isOpen4);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    setShowModal(false);
  };

  const getLinkClass = (path) => {
    return location.pathname === path
      ? "flex items-center p-2 text-purple bg-purple-100 rounded-lg dark:text-purple-400 group"
      : "flex items-center p-2 text-gray-900 rounded-lg dark:text-black group";
  };

  return (
    <>
      <button
        onClick={toggleSidebar}
        className="p-2  mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden flex"
      >
        <svg
          className="w-8 h-8"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            clipRule="evenodd"
            fillRule="evenodd"
            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
          ></path>
        </svg>
        Button
      </button>

      <aside
        id="sidebar-multi-level-sidebar"
        className={`fixed top-16 left-0 z-40 w-64 h-screen transition-transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full sm:translate-x-0"
        }`}
        aria-label="Sidebar"
      >
        <div className="h-full  py-4 overflow-y-auto bg-gray-50 dark:bg-white-800 shadow-2xl">
          <button
            onClick={closeSidebar}
            className="absolute top-2 right-2 p-2 text-gray-500 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 sm:hidden"
          >
            <svg
              className="w-6 h-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <ul className="space-y-2 font-medium font-oswald font-bold p-4">
            <li>
              <Link to="/dash/home" className={getLinkClass("/dash/home")}>
                <MdDashboard className="w-7 h-7 text-bgBlue transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-black" />
                <span className="ms-3 font-semibold">Home</span>
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
                  <FaUsers className="w-7 h-7 text-bgBlue transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-black" />
                  <span className="ms-3  font-semibold">User Controls</span>
                </div>
                <MdKeyboardArrowDown className="text-end" size={24} />
              </div>
              <ul
                id="dropdown-example"
                className={`space-y-2 font-medium flex flex-col  mt-2 text-end ${
                  isOpen ? "" : "hidden"
                }`}
              >
                <Link to="/dash/demo-user">
                  <li
                    className="flex items-center  w-full pl-5  text-bgBlue font-bold   cursor-pointer"
                    onClick={() => changeLanguage("hi")}
                  >
                    <MdOutlineKeyboardDoubleArrowRight
                      className="text-purple mr-2"
                      size={25}
                    />{" "}
                    Demo Users
                  </li>
                </Link>
                <Link to="/dash/active-user">
                  <li
                    className="flex items-center  w-full pl-5   text-bgBlue font-bold   cursor-pointer"
                    onClick={() => changeLanguage("hi")}
                  >
                    <MdOutlineKeyboardDoubleArrowRight
                      className="text-purple mr-2"
                      size={25}
                    />{" "}
                    Active Users
                  </li>
                </Link>
                <Link to="/dash/demo-user">
                  <li
                    className="flex items-center  w-full pl-5  text-bgBlue font-bold   cursor-pointer"
                    onClick={() => changeLanguage("hi")}
                  >
                    <MdOutlineKeyboardDoubleArrowRight
                      className="text-purple mr-2"
                      size={25}
                    />{" "}
                    Daily Users
                  </li>
                </Link>
                <Link to="/dash/demo-user">
                  <li
                    className="flex items-center  w-full pl-5  text-bgBlue font-bold   cursor-pointer"
                    onClick={() => changeLanguage("hi")}
                  >
                    <MdOutlineKeyboardDoubleArrowRight
                      className="text-purple mr-2"
                      size={25}
                    />{" "}
                    Hold Users
                  </li>
                </Link>
              </ul>
            </li>
            <hr />
            <li onClick={toggleDropdown2}>
              <div
                className={`flex items-center justify-between p-2 rounded-lg cursor-pointer ${
                  isOpen2 ? "bg-gray-100" : ""
                }`}
              >
                <div className="flex items-center">
                  <FaBookOpenReader className="w-7 h-7 text-bgBlue transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-black" />
                  <span className="ms-3  font-semibold">Course Controls</span>
                </div>
                <MdKeyboardArrowDown className="text-end" size={24} />
              </div>
              <ul
                id="dropdown-example"
                className={`space-y-2 font-medium flex flex-col  mt-2 text-end ${
                  isOpen2 ? "" : "hidden"
                }`}
              >
                <Link to="/dash/view-course">
                  <li
                    className="flex items-center  w-full pl-5  text-bgBlue font-bold   cursor-pointer"
                    onClick={() => changeLanguage("hi")}
                  >
                    <MdOutlineKeyboardDoubleArrowRight
                      className="text-purple mr-2"
                      size={25}
                    />{" "}
                    View Course
                  </li>
                </Link>
                <Link to="/dash/create-course">
                  <li
                    className="flex items-center  w-full pl-5   text-bgBlue font-bold   cursor-pointer"
                    onClick={() => changeLanguage("hi")}
                  >
                    <MdOutlineKeyboardDoubleArrowRight
                      className="text-purple mr-2"
                      size={25}
                    />{" "}
                    Create Course
                  </li>
                </Link>
              </ul>
            </li>
            <hr />
            <li onClick={toggleDropdown4}>
              <div
                className={`flex items-center justify-between p-2 rounded-lg cursor-pointer ${
                  isOpen4 ? "bg-gray-100" : ""
                }`}
              >
                <div className="flex items-center">
                  <FaAward className="w-7 h-7 text-bgBlue transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-black" />
                  <span className="ms-3  font-semibold">Contest Controls</span>
                </div>
                <MdKeyboardArrowDown className="text-end" size={24} />
              </div>
              <ul
                id="dropdown-example"
                className={`space-y-2 font-medium flex flex-col  mt-2 text-end ${
                  isOpen4 ? "" : "hidden"
                }`}
              >
                <Link to="/dash/view-contest">
                  <li
                    className="flex items-center  w-full pl-5  text-bgBlue font-bold   cursor-pointer"
                    onClick={() => changeLanguage("hi")}
                  >
                    <MdOutlineKeyboardDoubleArrowRight
                      className="text-purple mr-2"
                      size={25}
                    />{" "}
                    View Contest
                  </li>
                </Link>
                <Link to="/dash/add-contest">
                  <li
                    className="flex items-center  w-full pl-5   text-bgBlue font-bold   cursor-pointer"
                    onClick={() => changeLanguage("hi")}
                  >
                    <MdOutlineKeyboardDoubleArrowRight
                      className="text-purple mr-2"
                      size={25}
                    />{" "}
                    Add Contest
                  </li>
                </Link>
              </ul>
            </li>
            <hr />
            <li onClick={toggleDropdown3}>
              <div
                className={`flex items-center justify-between p-2  rounded-lg cursor-pointer ${
                  isOpen3 ? "bg-gray-100" : ""
                }`}
              >
                <div className="flex items-center gap-0.5">
                  <GiTakeMyMoney className="w-7 h-7 text-bgBlue transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-black" />
                  <span className="  font-semibold">Payment Controls</span>
                </div>
                <MdKeyboardArrowDown className="text-end" size={24} />
              </div>
              <ul
                id="dropdown-example"
                className={`space-y-2 font-medium flex flex-col  mt-2 text-end ${
                  isOpen3 ? "" : "hidden"
                }`}
              >
                <Link to="/dash/demo-user">
                  <li
                    className="flex items-center  w-full pl-5  text-bgBlue font-bold   cursor-pointer"
                    onClick={() => changeLanguage("hi")}
                  >
                    <MdOutlineKeyboardDoubleArrowRight
                      className="text-purple mr-2"
                      size={25}
                    />{" "}
                    Payment
                  </li>
                </Link>
                <Link to="/dash/payment-request">
                  <li
                    className="flex items-center  w-full pl-5   text-bgBlue font-bold   cursor-pointer"
                    onClick={() => changeLanguage("hi")}
                  >
                    <MdOutlineKeyboardDoubleArrowRight
                      className="text-purple mr-2"
                      size={25}
                    />{" "}
                    Payment Request
                  </li>
                </Link>
                <Link to="/dash/demo-user">
                  <li
                    className="flex items-center  w-full pl-5  text-bgBlue font-bold   cursor-pointer"
                    onClick={() => changeLanguage("hi")}
                  >
                    <MdOutlineKeyboardDoubleArrowRight
                      className="text-purple mr-2"
                      size={25}
                    />{" "}
                    Payment History
                  </li>
                </Link>
              </ul>
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
                <span className="ms-3  font-semibold">Logout</span>
              </Link>
            </li>
            <hr />
          </ul>
        </div>
      </aside>

      <div className="sm:ml-64 lg:py-8 h-full bg-bgWhite">
        <Layout />
      </div>
    </>
  );
};

export default Sidebar;
