import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MdKeyboardArrowDown } from "react-icons/md";
import { IoMdLogOut } from "react-icons/io";
import { useUser } from "../../../hooks/use-user";
import { IoSettings } from "react-icons/io5";
import { IoMdNotifications } from "react-icons/io";
import axios from "../../../axios";
import NotificationModal from "../../../componant/NotificationModal/NotificationModal";
import Logo from '../../../Images/Burhanpur_transparent.png'

const NewNavbar = () => {
  const { data: user } = useUser();
  const location = useLocation();
  const navigate = useNavigate();
  const [pro, setPro] = useState("");
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isMenuOpen2, setIsMenuOpen2] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch notifications for pending businesses
  const fetchNotifications = async () => {
    try {
      // First try the notifications endpoint
      const notificationsRes = await axios.get("/notifications");
      if (notificationsRes.data && notificationsRes.status !== 404) {
        const notificationsData = notificationsRes.data || [];
        // Filter out businesses that have been processed (not in local storage)
        const filteredNotifications = notificationsData.filter(notification => {
          const businessId = notification.data?.businessId || notification._id;
          const isStillPending = localStorage.getItem(`pending_business_${businessId}`) === 'true';
          return isStillPending;
        });
        setNotifications(filteredNotifications);
        setPendingCount(filteredNotifications.length);
        return;
      }
    } catch (error) {
      console.log("Notifications endpoint not available, fetching pending businesses directly");
    }

    try {
      // Fallback: fetch pending businesses directly
      const businessesRes = await axios.get("/bussiness/admin/all/");
      if (businessesRes.data && businessesRes.status !== 404) {
        const allBusinesses = businessesRes.data.data || [];
        
        // Filter businesses that are marked as pending in local storage
        const pendingBusinesses = allBusinesses.filter(b => {
          const isPending = localStorage.getItem(`pending_business_${b._id}`) === 'true';
          return isPending;
        });
        
        setNotifications(pendingBusinesses);
        setPendingCount(pendingBusinesses.length);
      }
    } catch (error) {
      console.error("Error fetching pending businesses:", error);
      setNotifications([]);
      setPendingCount(0);
    }
  };

  useEffect(() => {
    if (user) {
      setPro(user.profilePicUrl);
    }
    fetchNotifications();
    
    // Listen for new business creation to update notifications
    const handleNewBusiness = () => {
      fetchNotifications();
    };
    
    window.addEventListener('newBusinessCreated', handleNewBusiness);
    
    // Poll for notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => {
      window.removeEventListener('newBusinessCreated', handleNewBusiness);
      clearInterval(interval);
    };
  }, [user]);

  const toggleDropdown = (menu) => {
    setOpenDropdown((prev) => (prev === menu ? null : menu));
  };

  const closeDropdown = () => {
    setOpenDropdown(null);
  };

  // Handle business approval
  const handleApprove = async (businessId) => {
    setLoading(true);
    try {
      await axios.put(`/bussiness/admin/approve/${businessId}`);
      // Remove from local storage when approved
      localStorage.removeItem(`pending_business_${businessId}`);
      
      // Immediately update notifications by removing the approved business
      setNotifications(prev => prev.filter(n => {
        // Check both _id and data.businessId fields
        return n._id !== businessId && n.data?.businessId !== businessId;
      }));
      setPendingCount(prev => Math.max(0, prev - 1));
      
      // Don't call fetchNotifications() here as it will override our immediate updates
      // Show success message
      console.log("Business approved successfully");
      // Notify other pages to refresh
      window.dispatchEvent(new CustomEvent('businessStatusUpdated', { detail: { businessId, status: 'approved' } }));
    } catch (error) {
      console.error("Error approving business:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle business denial
  const handleDeny = async (businessId) => {
    setLoading(true);
    try {
      await axios.put(`/admin/reject/${businessId}`);
      // Remove from local storage when rejected
      localStorage.removeItem(`pending_business_${businessId}`);
      
      // Immediately update notifications by removing the rejected business
      setNotifications(prev => prev.filter(n => {
        // Check both _id and data.businessId fields
        return n._id !== businessId && n.data?.businessId !== businessId;
      }));
      setPendingCount(prev => Math.max(0, prev - 1));
      
      // Don't call fetchNotifications() here as it will override our immediate updates
      // Show success message
      console.log("Business rejected successfully");
      // Notify other pages to refresh
      window.dispatchEvent(new CustomEvent('businessStatusUpdated', { detail: { businessId, status: 'denied' } }));
    } catch (error) {
      console.error("Error rejecting business:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <nav className="w-full top-0 flex items-center justify-between bg-white p-4 shadow-lg fixed  z-50">
      {/* Logo */}
      <div className="text-2xl font-bold  text-bgBlue    ">
        <img style={{
          // border:'2px solid red ',
          // marginBottom:'10px',
          width: '100px',
          height: '70px',
        }} src={Logo} alt="" className="w-15" />

      </div>

      {/* Menu Items */}
      <ul className="flex space-x-6 font-semibold">
        <li>
          <Link to="/dash/home" className="hover:text-purple">
            Home
          </Link>
        </li>
        <li>
          <Link to="/dash/user-Account" className="hover:text-purple">
            User Details
          </Link>
        </li>
        <li>
          <Link to="/dash/category" className="hover:text-purple">
            Category Details
          </Link>
        </li>
        <li>
          <Link to="/dash/buisness" className="hover:text-purple">
            Buisness

          </Link>
        </li>
        <li>
          <Link to="/dash/plains" className="hover:text-purple">
            Pricing

          </Link>
        </li>
        <li>
          <Link to="/dash/ads" className="hover:text-purple">
            Ads

          </Link>
        </li>



        {/* Payment Controls */}

      </ul>

      {/* Avatar & Logout */}
      <div className="flex items-center gap-2">
        {/* Notification Bell */}
        {/* <div className="relative">
          <button
            onClick={() => setIsNotificationOpen(true)}
            className="flex bg-purple-500 rounded-xl p-1 text-white text-xl font-bold focus:ring-2 focus:ring-bgBlue dark:focus:ring-bgBlue mr-2 relative"
          >
            <IoMdNotifications size={28} />
            {pendingCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                {pendingCount}
              </span>
            )}
          </button>
        </div> */}

        <button
          onClick={() => setIsMenuOpen2(!isMenuOpen2)}
          className="flex  bg-purple-500 rounded-xl p-1 text-white text-xl font-bold focus:ring-2 focus:ring-bgBlue dark:focus:ring-bgBlue mr-4"
        >

          <IoSettings size={28} />
        </button>
      </div>

      {/* Profile Menu */}
      <div
        className={`w-60 absolute z-50 right-4 top-16 border border-purple p-2 ${isMenuOpen2 ? "" : "hidden"
          } text-base list-none bg-bgWhite rounded-xl`}
        id="user-dropdown"
      >
        <button
          type="button"
          className="absolute top-0 right-0 p-2 text-purple-500 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-200 font-semibold"
          onClick={() => setIsMenuOpen2(false)}
        >
          <svg className="w-6 h-6 font-semibold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <br />
        <div className="w-full flex flex-col justify-center items-center">
          <div className="flex flex-col gap-2 justify-center items-center text-purple-500 font-oswald">
            <div className="w-1/3 m-auto">
              <img src={pro} alt="" className="rounded-full border m-auto" />
            </div>

            <div>
              <h1 className="text-sm font-bold">{user?.name}</h1>
              <p className="text-sm">{user?.email}</p>
            </div>
          </div>
          <div className="w-full flex gap-4 justify-between items-center p-2 text-purple-500 font-oswald">
            <div className="ml-4">
              <p className="text-sm text-green font-semibold">Active Course</p>
              <h1 className="font-bold text-purple-500">{user?.planName}</h1>
            </div>

            <div className="mr-4 text-purple-500">
              <IoMdLogOut onClick={() => {
                localStorage.removeItem("token");
                navigate("/login");
              }} size={25} cursor={"pointer"} />
            </div>
          </div>
        </div>
      </div>
      
      {/* Notification Modal */}
      <NotificationModal
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        notifications={notifications}
        onApprove={handleApprove}
        onDeny={handleDeny}
        loading={loading}
      />
    </nav>
  );
};

export default NewNavbar;
