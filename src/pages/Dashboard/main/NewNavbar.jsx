import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IoMdLogOut } from "react-icons/io";
import { useUser } from "../../../hooks/use-user";
import { useAuth } from "../../../componant/authentication/authentication";
import { IoSettings } from "react-icons/io5";
import { IoMdNotifications } from "react-icons/io";
import { IoPerson, IoSettings as SettingsIcon } from "react-icons/io5";
import axios from "../../../axios";
import NotificationModal from "../../../componant/NotificationModal/NotificationModal";
import Logo from '../../../Images/Burhanpur_transparent.png'

const NewNavbar = () => {
  const { data: user, isLoading: userLoading, error: userError } = useUser();
  const authUser = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Try to get user data from multiple sources
  const currentUser = user || authUser || JSON.parse(localStorage.getItem('userData') || 'null');
  
  // Debug: Log user data to see what's being returned
  console.log("User data from useUser hook:", user);
  console.log("Auth user data:", authUser);
  console.log("Current user (final):", currentUser);
  console.log("User loading state:", userLoading);
  console.log("User error:", userError);
  const [pro, setPro] = useState("");
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isMenuOpen2, setIsMenuOpen2] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  // Fetch notifications for pending businesses from API (no localStorage dependency)
  const fetchNotifications = async () => {
    try {
      // First try the notifications endpoint
      const notificationsRes = await axios.get("/notifications");
      console.log("Notifications API response:", notificationsRes);
      if (notificationsRes.data && notificationsRes.status !== 404) {
        const notificationsData = notificationsRes.data.result?.notifications || notificationsRes.data || [];
        console.log("Raw notifications from API:", notificationsData);
        
        // Filter for both business and product notifications
        const allNotifications = Array.isArray(notificationsData) ? notificationsData : [];
        const businessNotifications = allNotifications.filter(n => n.type === 'business_submission');
        const productNotifications = allNotifications.filter(n => n.type === 'product_submission');
        
        // Combine all notifications
        const combinedNotifications = [...businessNotifications, ...productNotifications];
        
        setNotifications(combinedNotifications);
        setPendingCount(combinedNotifications.length);
        return;
      }
    } catch (error) {
      console.log("Notifications endpoint not available, fetching pending businesses directly");
    }

    try {
      // Fallback: fetch pending businesses directly and filter by approvalStatus
      const businessesRes = await axios.get("/bussiness/admin/all");
      console.log("Businesses API response for notifications:", businessesRes);
      if (businessesRes.data && businessesRes.status !== 404) {
        const allBusinesses = businessesRes.data.data || businessesRes.data || [];
        
        // Only show businesses that are explicitly pending (approvalStatus: "pending")
        // AND are truly new businesses (not existing ones)
        // Use a timestamp approach to distinguish new vs existing businesses
        const currentTime = new Date();
        const oneDayAgo = new Date(currentTime.getTime() - (24 * 60 * 60 * 1000)); // 24 hours ago
        
        const pendingBusinesses = allBusinesses.filter(b => {
          const approvalStatus = b.approvalStatus;
          const createdAt = new Date(b.createdAt || b.created_at || b.dateCreated || 0);
          
          // console.log(`Navbar notification check - Business: ${b.name}, approvalStatus: ${approvalStatus}, createdAt: ${createdAt}`);
          
          // Only show if:
          // 1. Explicitly pending (approvalStatus: "pending")
          // 2. Created within the last 24 hours (truly new)
          return (approvalStatus === "pending" || approvalStatus === "Pending") && 
                 createdAt > oneDayAgo;
        });
        
        console.log("Pending businesses for notifications:", pendingBusinesses);
        setNotifications(Array.isArray(pendingBusinesses) ? pendingBusinesses : []);
        setPendingCount(Array.isArray(pendingBusinesses) ? pendingBusinesses.length : 0);
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
    console.log("NewNavbar useEffect - Fetching notifications...");
    fetchNotifications();
    
    // Listen for new business creation to update notifications
    const handleNewBusiness = () => {
      console.log("New business created, refreshing notifications...");
      fetchNotifications();
    };
    
    // Listen for business status updates
    const handleStatusUpdate = () => {
      console.log("Business status updated, refreshing notifications...");
      fetchNotifications();
    };
    
    window.addEventListener('newBusinessCreated', handleNewBusiness);
    window.addEventListener('businessStatusUpdated', handleStatusUpdate);
    
    // Poll for notifications every 30 seconds for real-time updates
    const interval = setInterval(() => {
      console.log("Polling for notifications...");
      fetchNotifications();
    }, 30000);
    
    return () => {
      window.removeEventListener('newBusinessCreated', handleNewBusiness);
      window.removeEventListener('businessStatusUpdated', handleStatusUpdate);
      clearInterval(interval);
    };
  }, [user]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsMenuOpen2(false);
      }
    };

    if (isMenuOpen2) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen2]);


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
      console.log("Approving business ID:", businessId);
      const response = await axios.post(`/api/admin/approve/${businessId}`);
      console.log("Navbar approval API response:", response);
      
      // Only proceed if API call is successful
      if (response.status === 200 || response.status === 201) {
        // Immediately update notifications by removing the approved business
        setNotifications(prev => {
          const filtered = prev.filter(n => {
            // Check both _id and data.businessId fields
            const shouldKeep = n._id !== businessId && n.data?.businessId !== businessId;
            console.log(`Navbar notification filter - ID: ${n._id}, businessId: ${businessId}, shouldKeep: ${shouldKeep}`);
            return shouldKeep;
          });
          console.log("Navbar filtered notifications after approval:", filtered);
          return filtered;
        });
        setPendingCount(prev => {
          const newCount = Math.max(0, prev - 1);
          console.log(`Navbar pending count updated: ${prev} -> ${newCount}`);
          return newCount;
        });
        
        // Refresh notifications from API
        await fetchNotifications();
        // Show success message
        console.log("Business approved successfully");
        // Notify other pages to refresh
        window.dispatchEvent(new CustomEvent('businessStatusUpdated', { detail: { businessId, status: 'approved' } }));
      } else {
        throw new Error(`API returned status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error approving business:", error);
      if (error.response?.status === 404) {
        console.error("Approval endpoint not found. Please check API configuration.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle business denial
  const handleDeny = async (businessId) => {
    setLoading(true);
    try {
      console.log("Rejecting business ID:", businessId);
      const response = await axios.post(`/api/admin/reject/${businessId}`);
      console.log("Navbar rejection API response:", response);
      
      // Only proceed if API call is successful
      if (response.status === 200 || response.status === 201) {
        // Immediately update notifications by removing the rejected business
        setNotifications(prev => {
          const filtered = prev.filter(n => {
            // Check both _id and data.businessId fields
            const shouldKeep = n._id !== businessId && n.data?.businessId !== businessId;
            console.log(`Navbar notification filter - ID: ${n._id}, businessId: ${businessId}, shouldKeep: ${shouldKeep}`);
            return shouldKeep;
          });
          console.log("Navbar filtered notifications after rejection:", filtered);
          return filtered;
        });
        setPendingCount(prev => {
          const newCount = Math.max(0, prev - 1);
          console.log(`Navbar pending count updated: ${prev} -> ${newCount}`);
          return newCount;
        });
        
        // Refresh notifications from API
        await fetchNotifications();
        // Show success message
        console.log("Business rejected successfully");
        // Notify other pages to refresh
        window.dispatchEvent(new CustomEvent('businessStatusUpdated', { detail: { businessId, status: 'denied' } }));
      } else {
        throw new Error(`API returned status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error rejecting business:", error);
      if (error.response?.status === 404) {
        console.error("Rejection endpoint not found. Please check API configuration.");
      }
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
        <li>
          <Link to="/dash/products" className="hover:text-purple">
            Products

          </Link>
        </li>



        {/* Payment Controls */}

      </ul>

      {/* Avatar & Logout */}
      <div className="flex items-center gap-2">
        {/* Admin User Display */}
        <div className="flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl px-3 sm:px-4 py-2 text-white">
          {/* Admin Avatar */}
          <div className="w-8 h-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center text-white font-bold text-sm">
            {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'A'}
          </div>
          
          {/* Admin Username */}
          <div className="flex flex-col items-start">
            <span className="text-sm font-bold text-white">
              {userLoading ? 'Loading...' : (currentUser?.name || 'Admin')}
            </span>
            <span className="text-xs text-purple-100 opacity-80">
              Administrator
            </span>
          </div>
        </div>

        {/* Settings Button */}
        <button
          onClick={() => setIsMenuOpen2(!isMenuOpen2)}
          className="flex bg-purple-500 rounded-xl p-1 text-white text-xl font-bold focus:ring-2 focus:ring-bgBlue dark:focus:ring-bgBlue mr-4 hover:bg-purple-600 transition-colors"
        >
          <IoSettings size={28} />
        </button>
      </div>

      {/* User Menu Card */}
      {isMenuOpen2 && (
        <div
          ref={dropdownRef}
          className="absolute z-50 right-4 top-16 w-72 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
          id="user-dropdown"
        >
          {/* User Info Section */}
          <div className="px-6 py-4 bg-gradient-to-r from-purple-50 to-blue-50 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              {/* User Avatar */}
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'A'}
              </div>
              
              {/* User Details */}
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-gray-900 truncate">
                  {currentUser?.name || 'Admin'}
                </h3>
                <p className="text-xs text-gray-500 truncate">
                  {currentUser?.email || 'admin@example.com'}
                </p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100"></div>

          {/* Menu Options */}
          <div className="py-2">
            {/* Profile Option */}
            <button
              onClick={() => {
                setIsMenuOpen2(false);
                // Add profile navigation logic here
                console.log('Navigate to profile');
              }}
              className="w-full flex items-center px-6 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
            >
              <IoPerson className="w-5 h-5 mr-3 text-gray-500" />
              <span>Profile</span>
            </button>

            {/* Settings Option */}
            <button
              onClick={() => {
                setIsMenuOpen2(false);
                // Add settings navigation logic here
                console.log('Navigate to settings');
              }}
              className="w-full flex items-center px-6 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
            >
              <SettingsIcon className="w-5 h-5 mr-3 text-gray-500" />
              <span>Settings</span>
            </button>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100"></div>

          {/* Logout Option */}
          <div className="py-2">
            <button
              onClick={() => {
                setIsMenuOpen2(false);
                localStorage.removeItem("token");
                navigate("/login");
              }}
              className="w-full flex items-center px-6 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
            >
              <IoMdLogOut className="w-5 h-5 mr-3" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
      
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
