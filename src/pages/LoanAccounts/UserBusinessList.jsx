import React, { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "../../axios";
import dayjs from "dayjs";
import Table from "../../componant/Table/Table";
import Cell from "../../componant/Table/cell";
import {
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useToast,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightAddon,
} from "@chakra-ui/react";
import { MdDelete, MdEdit, MdSearch } from "react-icons/md";
import RegisterBusinessForm from "../buisnesspart/buisnessComponents/RegisterBusinessForm";

const UserBusinessList = () => {
  const { userId } = useParams();
  const [businesses, setBusinesses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editingBusiness, setEditingBusiness] = useState(null);
  const [selectedBusinessID, setSelectedBusinessID] = useState(null);
  const [search, setSearch] = useState("");
  const [showPendingBadge, setShowPendingBadge] = useState(false);
  const [pendingBusinessId, setPendingBusinessId] = useState(null);
  const [businessStatus, setBusinessStatus] = useState(null); // 'pending', 'approved', 'denied'
  const [lastRefreshTime, setLastRefreshTime] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [leads, setLeads] = useState([]);
  const [leadsLoading, setLeadsLoading] = useState(false);
  const [selectedBusinessForLeads, setSelectedBusinessForLeads] = useState(null);
  const [businessInfo, setBusinessInfo] = useState(null);
  const [selectedBusinessForBooking, setSelectedBusinessForBooking] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [bookingInfo, setBookingInfo] = useState(null);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isAlertOpen,
    onOpen: openAlert,
    onClose: closeAlert,
  } = useDisclosure();
  const {
    isOpen: isLeadsOpen,
    onOpen: openLeads,
    onClose: closeLeads,
  } = useDisclosure();
  const {
    isOpen: isBookingOpen,
    onOpen: openBooking,
    onClose: closeBooking,
  } = useDisclosure();
  const cancelRef = useRef();
  const refreshTimeoutRef = useRef(null);

  // Debounced refresh function to prevent excessive API calls
  const debouncedRefresh = useCallback((delay = 1000) => {
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
    }
    
    refreshTimeoutRef.current = setTimeout(() => {
      console.log('Debounced refresh triggered');
      fetchBusinesses(true);
    }, delay);
  }, []);

  // Fetch businesses & categories with optimized caching
  const fetchBusinesses = async (forceRefresh = false) => {
    if (userId && !isRefreshing) {
      try {
        setIsRefreshing(true);
        console.log('Fetching businesses for user:', userId, 'Force refresh:', forceRefresh);
        
        // Check if we need to refresh based on time since last refresh
        const now = new Date();
        const timeSinceLastRefresh = lastRefreshTime ? 
          (now.getTime() - new Date(lastRefreshTime).getTime()) / 1000 : Infinity;
        
        // Only skip API call if not forcing refresh and recent data exists
        if (!forceRefresh && timeSinceLastRefresh < 5) {
          console.log('Skipping API call - recent data available');
          setIsRefreshing(false);
          return;
        }
        
        const res = await axios.get(`/bussiness/getBussById/${userId}`);
        const allBusinesses = res.data.result || [];
        
        // Add pending status to businesses based on local storage
        const businessesWithStatus = allBusinesses.map(business => {
          const isPending = localStorage.getItem(`pending_business_${business._id}`) === 'true';
          return {
            ...business,
            status: isPending ? 'pending' : (business.status || 'approved')
          };
        });
        
        // Check for any pending businesses in local storage
        const pendingBusinesses = businessesWithStatus.filter(b => b.status === 'pending');
        if (pendingBusinesses.length > 0) {
          // Set the first pending business as the tracked one
          const firstPending = pendingBusinesses[0];
          setPendingBusinessId(firstPending._id);
          setBusinessStatus('pending');
          setShowPendingBadge(true);
        } else {
          // No pending businesses, reset state
          setPendingBusinessId(null);
          setBusinessStatus(null);
          setShowPendingBadge(false);
        }
        
        setBusinesses(businessesWithStatus);
        setLastRefreshTime(new Date().toISOString());
        console.log('Businesses updated:', businessesWithStatus.length, 'total businesses');
      } catch (err) {
        console.error('Error fetching businesses:', err);
      } finally {
        setIsRefreshing(false);
      }
    }
  };

  // Check for pending businesses on component mount
  useEffect(() => {
    if (userId) {
      // Check if there are any pending businesses in local storage for this user
      const checkPendingBusinesses = async () => {
        try {
          // First fetch the user's businesses to get their IDs
          const res = await axios.get(`/bussiness/getBussById/${userId}`);
          const userBusinesses = res.data.result || [];
          
          // Clean up any old pending businesses that no longer exist
          const allKeys = Object.keys(localStorage);
          const pendingKeys = allKeys.filter(key => key.startsWith(`pending_business_`));
          pendingKeys.forEach(key => {
            const businessId = key.replace('pending_business_', '');
            const businessExists = userBusinesses.some(b => b._id === businessId);
            if (!businessExists) {
              localStorage.removeItem(key);
            }
          });
          
          // Check if any of the user's businesses are marked as pending
          const pendingBusiness = userBusinesses.find(business => {
            return localStorage.getItem(`pending_business_${business._id}`) === 'true';
          });
          
          if (pendingBusiness) {
            setPendingBusinessId(pendingBusiness._id);
            setBusinessStatus('pending');
            setShowPendingBadge(true);
          }
        } catch (error) {
          console.error("Error checking pending businesses:", error);
        }
      };
      
      checkPendingBusinesses();
      
      // Add immediate refresh on page focus to catch any missed updates
      const handleFocus = () => {
        console.log('Page focused, refreshing businesses...');
        debouncedRefresh(200); // Very short delay for focus events
      };
      
      window.addEventListener('focus', handleFocus);
      
      return () => {
        window.removeEventListener('focus', handleFocus);
      };
    }
  }, [userId]);

  useEffect(() => {
    fetchBusinesses();
    axios.get("/category/getCategory").then((res) => {
      console.log("Categories loaded:", res.data.data);
      setCategories(res.data.data || []);
    });
    
    // Listen for admin actions to refresh the list immediately
    const handleStatusUpdate = (event) => {
      const { businessId, status, timestamp, action } = event.detail || {};
      console.log('Business status update received:', { businessId, status, pendingBusinessId, timestamp, action });
      
      if (businessId === pendingBusinessId) {
        setBusinessStatus(status);
        if (status === 'approved' || status === 'denied') {
          // Remove from local storage when approved/denied
          localStorage.removeItem(`pending_business_${businessId}`);
          setPendingBusinessId(null);
          setShowPendingBadge(false);
        }
      }
      
      // Use debounced refresh for immediate updates without overwhelming the API
      if (action === 'approve' || action === 'reject') {
        console.log('Immediate refresh triggered for business action:', action);
        debouncedRefresh(500); // Shorter delay for immediate actions
      } else {
        debouncedRefresh(1000); // Standard delay for other updates
      }
    };
    
    window.addEventListener('businessStatusUpdated', handleStatusUpdate);
    
    // Reduced polling frequency from 30 seconds to 10 seconds for better responsiveness
    const interval = setInterval(fetchBusinesses, 10000);
    
    return () => {
      window.removeEventListener('businessStatusUpdated', handleStatusUpdate);
      clearInterval(interval);
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, [userId, pendingBusinessId]);

  // Handle Create & Update
  const handleFormSubmit = async (formData) => {
    try {
      if (editingBusiness) {
        await axios.put(`/bussiness/updateBuss/${editingBusiness._id}`, formData);
        toast({ title: "Business updated!", status: "success" });
      } else {
        // Create business normally (backend doesn't support status field)
        console.log("Creating business with data:", { ...formData, owner: userId });
        const res = await axios.post("/bussiness/registerBuss", {
          ...formData,
          owner: userId,
        });
        
        console.log("Business creation response:", res.data);
        
        // Store the business ID to track its status
        const businessId = res?.data?.data?._id || res?.data?.result?._id || res?.data?._id;
        if (businessId) {
          // Mark as pending in local storage and state
          localStorage.setItem(`pending_business_${businessId}`, 'true');
          setPendingBusinessId(businessId);
          setBusinessStatus('pending');
        }
        
        toast({ 
          title: "Your business request has been submitted and is awaiting admin approval. It will only be listed after approval.", 
          status: "info", 
          duration: 5000 
        });
        setShowPendingBadge(true);
        
        // Notify admin pages about new business creation
        window.dispatchEvent(new CustomEvent('newBusinessCreated', { detail: { businessId } }));
        
        // Don't fetch businesses immediately - let admin approval handle visibility
        return;
      }
      fetchBusinesses();
      setEditingBusiness(null);
      onClose();
    } catch (err) {
      console.error(err);
      toast({ title: "Operation failed!", status: "error" });
    }
  };

  // Handle Delete
  const handleDelete = async () => {
    try {
      await axios.delete(`/bussiness/deleteBuss/${selectedBusinessID}`);
      toast({ title: "Business deleted!", status: "success" });
      fetchBusinesses();
      closeAlert();
    } catch (err) {
      console.error(err);
      toast({ title: "Delete failed!", status: "error" });
    }
  };

  // Handle leads modal
  const openLeadsModal = async (businessId, businessName) => {
    setSelectedBusinessForLeads({ id: businessId, name: businessName });
    setLeadsLoading(true);
    openLeads();
    
    try {
      const response = await axios.get(`/bussiness/leads/${businessId}`);
      console.log("Leads API response:", response);
      
      if (response?.data && response.status !== 404) {
        // Handle the specific API response structure
        const leadsData = response.data.result?.leads || response.data.leads || [];
        const businessInfo = response.data.result || {};
        console.log("Leads for business:", businessId, leadsData);
        console.log("Business info:", businessInfo);
        setLeads(Array.isArray(leadsData) ? leadsData : []);
        setBusinessInfo(businessInfo);
      } else {
        console.log("No leads found for business:", businessId);
        setLeads([]);
        setBusinessInfo(null);
      }
    } catch (error) {
      console.error("Error fetching leads:", error);
      setLeads([]);
      toast({ title: "Error fetching leads", status: "error" });
    } finally {
      setLeadsLoading(false);
    }
  };

  const closeLeadsModal = () => {
    closeLeads();
    setSelectedBusinessForLeads(null);
    setLeads([]);
    setBusinessInfo(null);
  };

  // Helper function to get category type
  const getCategoryType = (category, categories) => {
    console.log("getCategoryType called with:", { category, categories });
    
    // Handle case where category is null or undefined
    if (!category) {
      console.log("Category is null/undefined");
      return null;
    }
    
    // Handle case where category is an object (from business data)
    let categoryId;
    if (typeof category === 'object' && category._id) {
      categoryId = category._id;
    } else if (typeof category === 'string') {
      categoryId = category;
    } else {
      console.log("Invalid category format:", category);
      return null;
    }
    
    const cat = categories.find(c => c._id === categoryId);
    console.log("Found category:", cat);
    const type = cat?.type?.[0] ?? null;
    console.log("Category type:", type);
    return type;
  };

  // Handle booking modal
  const openBookingModal = async (businessId, businessName) => {
    setSelectedBusinessForBooking({ id: businessId, name: businessName });
    setBookingsLoading(true);
    openBooking();
    
    try {
      const response = await axios.get(`/bookings/business/${businessId}`);
      console.log("Booking API response", response)
      
      if (response?.data && response.status !== 404) {
        // Handle the specific API response structure
        const bookingsData = response.data?.data || [];
        setBookings(Array.isArray(bookingsData) ? bookingsData : []);
        setBookingInfo(response.data);
      } else {
        console.log("No bookings found for business:", businessId);
        setBookings([]);
        setBookingInfo(null);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setBookings([]);
      toast({ title: "Error fetching bookings", status: "error" });
    } finally {
      setBookingsLoading(false);
    }
  };

  const closeBookingModal = () => {
    closeBooking();
    setSelectedBusinessForBooking(null);
    setBookings([]);
    setBookingInfo(null);
  };

  const columns = useMemo(() => [
    { Header: "#", Cell: ({ row: { index } }) => <Cell text={index + 1} /> },
    { Header: "Business Name", accessor: "name", Cell: ({ value }) => <Cell text={value} bold /> },
    {
      Header: "Category",
      accessor: "category",
      Cell: ({ value }) =>
        <Cell text={typeof value === 'object' && value !== null ? value.name : value || "N/A"} />
    },
    {
      Header: "Subcategory",
      accessor: "subCategory",
      Cell: ({ value }) =>
        <Cell text={typeof value === 'object' && value !== null ? value.name : value || "N/A"} />
    },
    { Header: "Location", accessor: "location", Cell: ({ value }) => <Cell text={value} /> },
    {
      Header: "Created At",
      accessor: "createdAt",
      Cell: ({ value }) => <Cell text={dayjs(value).format("D MMM, YYYY h:mm A")} />,
    },
    {
      Header: "Status",
      accessor: "status",
      Cell: ({ value }) => {
        const status = value || 'pending';
        const color = status === 'approved' ? 'green' : status === 'denied' ? 'red' : 'orange';
        return <span className={`px-2 py-1 rounded text-xs text-white bg-${color}-500`}>{status.toUpperCase()}</span>;
      },
    },
    {
      Header: "Actions",
      Cell: ({ row: { original } }) => {
        const categoryType = getCategoryType(original.category, categories);
        console.log("Actions Cell - Business:", original.name, "Category:", original.category, "CategoryType:", categoryType, "Categories length:", categories.length);
        
        return (
          <Menu>
            <MenuButton as={Button} size="sm" colorScheme="purple">Actions</MenuButton>
            <MenuList>
              <MenuItem onClick={() => {
                setEditingBusiness(original);
                onOpen();
              }}>
                <MdEdit className="mr-2" /> Edit
              </MenuItem>
              <MenuItem onClick={() => {
                setSelectedBusinessID(original._id);
                openAlert();
              }}>
                <MdDelete className="mr-2" /> Delete
              </MenuItem>
              {categoryType === "Product-based service" && (
                <MenuItem onClick={() => openLeadsModal(original._id, original.name)}>
                  📊 Leads
                </MenuItem>
              )}
              {categoryType === "Management & Service" && (
                <MenuItem onClick={() => openBookingModal(original._id, original.name)}>
                  📅 Booking
                </MenuItem>
              )}
              
              
              
              
            </MenuList>
          </Menu>
        );
      },
    },
  ], [businesses, categories]);

  // Filter businesses based on search - only show approved/denied, hide pending
  const filteredBusinesses = useMemo(() => {
    // Only show approved and denied businesses, hide pending ones
    const visibleBusinesses = businesses.filter(b => (b.status || 'pending') !== 'pending');
    if (!search.trim()) return visibleBusinesses;
    
    return visibleBusinesses.filter((business) => {
      const searchTerm = search.toLowerCase();
      const businessName = (business.name || "").toLowerCase();
      const businessLocation = (business.location || "").toLowerCase();
      const categoryName = business.category && typeof business.category === 'object' 
        ? (business.category.name || "").toLowerCase() 
        : (business.category || "").toLowerCase();
      const subcategoryName = business.subCategory && typeof business.subCategory === 'object' 
        ? (business.subCategory.name || "").toLowerCase() 
        : (business.subCategory || "").toLowerCase();
      
      return businessName.includes(searchTerm) || 
             businessLocation.includes(searchTerm) || 
             categoryName.includes(searchTerm) ||
             subcategoryName.includes(searchTerm);
    });
  }, [businesses, search]);

  return (
    <div className="p-20">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">User's Businesses</h1>
      </div>

      {/* Rejection Message */}
      {businessStatus === 'denied' && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <span className="text-red-600 font-semibold">Your business request was rejected by the admin.</span>
          </div>
        </div>
      )}

      {/* Summary Section */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Button colorScheme="green" size="md">
            Total Businesses: {businesses.filter(b => (b.status || 'pending') !== 'pending').length}
          </Button>
          {showPendingBadge && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold">Status:</span>
              {businessStatus === 'pending' && (
                <span className="bg-yellow-500 text-white px-2 py-1 rounded text-sm">Pending Approval</span>
              )}
              {businessStatus === 'approved' && (
                <span className="bg-green-500 text-white px-2 py-1 rounded text-sm">Approved</span>
              )}
              {businessStatus === 'denied' && (
                <span className="bg-red-500 text-white px-2 py-1 rounded text-sm">Rejected</span>
              )}
            </div>
          )}
          <Button colorScheme="blue" onClick={() => { setEditingBusiness(null); onOpen(); }}>
            Add Business
          </Button>
        </div>

        {/* Search Section */}
        <div className="w-96">
          <InputGroup size="md">
            <InputLeftElement pointerEvents="none">
              <MdSearch color="gray.400" />
            </InputLeftElement>
            <Input
              placeholder="Search businesses by name, location, category, or subcategory..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              border="1px solid #949494"
              _hover={{ borderColor: "gray.300" }}
              _focus={{ borderColor: "blue.500", boxShadow: "outline" }}
            />
            <InputRightAddon p={0} border="none">
              <Button
                className="bg-purple"
                colorScheme="purple"
                size="md"
                borderLeftRadius={0}
                borderRightRadius={3.3}
                border="1px solid #949494"
              >
                Search
              </Button>
            </InputRightAddon>
          </InputGroup>
        </div>
      </div>

      <Table data={filteredBusinesses} columns={columns} />

      {/* Business Form Modal */}
      <Modal isOpen={isOpen} onClose={() => { setEditingBusiness(null); onClose(); }} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{editingBusiness ? "Edit Business" : "Add New Business"}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <RegisterBusinessForm
              categories={categories}
              initialData={editingBusiness}
              onSubmit={handleFormSubmit}
            />
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Delete Confirmation */}
      <AlertDialog isOpen={isAlertOpen} leastDestructiveRef={cancelRef} onClose={closeAlert}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>Delete Business</AlertDialogHeader>
            <AlertDialogBody>Are you sure you want to delete this business?</AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={closeAlert}>Cancel</Button>
              <Button colorScheme="red" onClick={handleDelete} ml={3}>Delete</Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      {/* Leads Modal */}
      <Modal
        isOpen={isLeadsOpen}
        onClose={closeLeadsModal}
        size="6xl"
        scrollBehavior="outside"
      >
        <ModalOverlay 
          bg="blackAlpha.600" 
          backdropFilter="blur(10px)"
        />
        <ModalContent 
          className="rounded-2xl shadow-2xl border-0"
          bg="white"
          maxH="85vh"
        >
          <ModalHeader 
            className="bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-t-2xl"
            py={4}
            px={6}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h2 className="text-sm font-medium mb-1 text-purple-100">
                  Business Leads
                </h2>
                <p className="text-white text-xl font-bold mb-2 drop-shadow-md">
                  {businessInfo?.businessName || selectedBusinessForLeads?.name || 'Business'}
                </p>
                {businessInfo?.totalLeads && (
                  <div className="flex items-center gap-3">
                    <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-xs font-medium text-white">
                      {businessInfo.totalLeads} Total Leads
                    </span>
                    {businessInfo?.activeLeads !== undefined && (
                      <span className="bg-green-400 bg-opacity-20 px-3 py-1 rounded-full text-xs font-medium text-white">
                        {businessInfo.activeLeads} Active
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </ModalHeader>
          <ModalCloseButton 
            color="white"
            bg="rgba(255,255,255,0.2)"
            _hover={{ bg: "rgba(255,255,255,0.3)" }}
            size="lg"
            top={4}
            right={4}
          />
          <ModalBody className="p-0">
            {leadsLoading ? (
              <div className="flex flex-col justify-center items-center py-16 bg-gradient-to-br from-purple-50 to-blue-50">
                <div className="relative">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200"></div>
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent absolute top-0 left-0"></div>
                </div>
                <div className="mt-6 text-center">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Loading Leads</h3>
                  <p className="text-gray-500">Fetching lead data for this business...</p>
                </div>
              </div>
            ) : leads.length === 0 ? (
              <div className="flex flex-col justify-center items-center py-16 bg-gradient-to-br from-purple-50 to-blue-50">
                <div className="text-6xl mb-4">📋</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Leads Found</h3>
                <p className="text-gray-500 text-center max-w-md">
                  No leads have been generated for this business yet. 
                  Leads will appear here once customers start showing interest.
                </p>
                <div className="mt-6 bg-purple-50 border border-purple-200 rounded-lg p-4 max-w-md">
                  <div className="flex items-center">
                    <div className="text-2xl mr-3">💡</div>
                    <div className="text-sm text-purple-700">
                      <strong>Tip:</strong> Encourage customers to contact this business to generate leads.
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white">
                <div className="px-6 py-4 bg-gradient-to-r from-purple-50 to-blue-50 border-b">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-800">Lead Details</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full font-medium">
                        {leads.length} Records
                      </span>
                    </div>
                  </div>
                </div>
                <div className="overflow-x-auto overflow-y-auto max-h-80">
                  <table className="min-w-full">
                    <thead className="bg-gradient-to-r from-purple-50 to-blue-50 sticky top-0 z-10">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Lead Name
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Phone
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Message
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {leads.map((lead, index) => {
                        // Handle the specific API response structure
                        const leadData = lead._id || lead;
                        const leadId = leadData._id || lead._id || index;
                        const leadName = leadData.name || lead.name || 'N/A';
                        const leadEmail = leadData.email || lead.email || 'N/A';
                        const leadPhone = leadData.phone || lead.phone || lead.contact || 'N/A';
                        const leadMessage = leadData.message || leadData.description || lead.message || lead.description || 'N/A';
                        const leadDate = leadData.createdAt || lead.createdAt || leadData.date || lead.date;
                        const leadStatus = leadData.status || lead.status || (leadData.isActive ? 'Active' : 'Inactive');
                        
                        return (
                          <tr 
                            key={leadId} 
                            className={`transition-all duration-200 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 hover:shadow-md group ${
                              index % 2 === 0 ? "bg-white" : "bg-gray-50"
                            }`}
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10">
                                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-500 to-purple-700 flex items-center justify-center text-white font-semibold text-sm shadow-lg">
                                    {leadName.charAt(0).toUpperCase()}
                                  </div>
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-semibold text-gray-900 group-hover:text-purple-700 transition-colors">
                                    {leadName}
                                  </div>
                                  <div className="text-xs text-gray-500">Lead #{index + 1}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-600">
                                <a 
                                  href={`mailto:${leadEmail}`}
                                  className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                                >
                                  {leadEmail}
                                </a>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-600">
                                {leadPhone !== 'N/A' ? (
                                  <a 
                                    href={`tel:${leadPhone}`}
                                    className="text-green-600 hover:text-green-800 hover:underline transition-colors"
                                  >
                                    {leadPhone}
                                  </a>
                                ) : (
                                  <span className="text-gray-400">Not provided</span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600 max-w-xs">
                              <div className="truncate group-hover:bg-white group-hover:shadow-sm group-hover:rounded group-hover:p-2 transition-all" title={leadMessage}>
                                {leadMessage}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <div className="flex items-center">
                                <span className="bg-purple-100 px-2 py-1 rounded text-xs text-purple-800">
                                  {leadDate ? new Date(leadDate).toLocaleDateString() : 'N/A'}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200 ${
                                leadStatus === 'New' || leadStatus === 'new' ? 'bg-blue-500 text-white shadow-lg' :
                                leadStatus === 'In Progress' || leadStatus === 'in_progress' ? 'bg-yellow-500 text-white shadow-lg' :
                                leadStatus === 'Converted' || leadStatus === 'converted' ? 'bg-green-500 text-white shadow-lg' :
                                leadStatus === 'Active' ? 'bg-green-500 text-white shadow-lg' :
                                leadStatus === 'Inactive' ? 'bg-gray-500 text-white shadow-lg' :
                                'bg-gray-500 text-white shadow-lg'
                              }`}>
                                {leadStatus}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </ModalBody>
          <ModalFooter className="bg-gradient-to-r from-purple-50 to-blue-50 px-6 py-4 rounded-b-2xl">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  <span>Active Leads</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                  <span>Inactive Leads</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button 
                  variant="outline" 
                  colorScheme="purple"
                  onClick={closeLeadsModal}
                  className="hover:bg-purple-50 transition-colors border-purple-300"
                >
                  Export Data
                </Button>
                <Button 
                  colorScheme="purple" 
                  onClick={closeLeadsModal}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Close
                </Button>
              </div>
            </div>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Booking Modal */}
        <Modal
          isOpen={isBookingOpen}
          onClose={closeBookingModal}
          size="full"
          scrollBehavior="outside"
        >
          <ModalOverlay 
            bg="blackAlpha.600" 
            backdropFilter="blur(10px)"
          />
          <ModalContent 
            className="rounded-2xl shadow-2xl border-0"
            bg="white"
            maxH="90vh"
            maxW="90vw"
            my={4}
          >
          {/* Business Name Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 py-4 border-b-2 border-blue-200">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-black">
                {bookingInfo?.businessName || selectedBusinessForBooking?.name || 'Business'}
              </h1>
              <div className="flex items-center gap-6 text-blue-800 text-sm">
                <span>Total Bookings: {bookingInfo?.totalBookings || bookings.length}</span>
                <span>•</span>
                <span>Active: {bookingInfo?.activeBookings || bookings.filter(b => b.status === 'confirmed').length}</span>
              </div>
            </div>
          </div>

          <ModalCloseButton
            color="white"
            bg="rgba(255,255,255,0.2)"
            _hover={{ bg: "rgba(255,255,255,0.3)" }}
            size="lg"
            top={4}
            right={4}
          />
          <ModalBody className="p-0">
            {bookingsLoading ? (
              <div className="flex flex-col justify-center items-center py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
                <div className="relative">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200"></div>
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent absolute top-0 left-0"></div>
                </div>
                <div className="mt-6 text-center">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Loading Bookings</h3>
                  <p className="text-gray-500">Fetching booking data for this business...</p>
                </div>
              </div>
            ) : bookings.length === 0 ? (
              <div className="flex flex-col justify-center items-center py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
                <div className="text-6xl mb-4">📅</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Bookings Found</h3>
                <p className="text-gray-500 text-center max-w-md">
                  No bookings have been made for this business yet. 
                  Bookings will appear here once customers start making reservations.
                </p>
                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md">
                  <div className="flex items-center">
                    <div className="text-2xl mr-3">💡</div>
                    <div className="text-sm text-blue-700">
                      <strong>Tip:</strong> Encourage customers to make bookings for this business.
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white">
                <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-800">Booking Details</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                        {bookings.length} Records
                      </span>
                    </div>
                  </div>
                </div>
                <div className="overflow-x-auto overflow-y-auto max-h-[500px]">
                  <table className="min-w-full border-collapse">
                    <thead className="bg-gray-50 sticky top-0 z-10">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                          Customer
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                          Service
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                          Amount
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                          Scheduled
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                          Payment
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {bookings.map((booking, index) => {
                        const bookingId = booking.booking_id;
                        const customerName = booking.extra_details?.customer_name || booking.user_id?.name || 'N/A';
                        const customerPhone = booking.extra_details?.customer_phone || booking.user_id?.phone || 'N/A';
                        const serviceName = booking.extra_details?.service_name || booking.product_id?.name || 'N/A';
                        const amount = booking.amount || 0;
                        const bookingDate = booking.booking_date;
                        const scheduledDate = booking.scheduled_date;
                        const startTime = booking.start_time || 'N/A';
                        const status = booking.status || 'pending';
                        const paymentStatus = booking.payment_status || 'pending';
                        
                        return (
                          <tr 
                            key={booking._id} 
                            className={`transition-all duration-200 hover:bg-blue-50 hover:shadow-sm group border-b border-gray-100 ${
                              index % 2 === 0 ? "bg-white" : "bg-gray-50"
                            }`}
                          >
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-8 w-8">
                                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-700 flex items-center justify-center text-white font-semibold text-xs shadow-lg">
                                    {customerName.charAt(0).toUpperCase()}
                                  </div>
                                </div>
                                <div className="ml-3">
                                  <div className="text-sm font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                                    {customerName}
                                  </div>
                                  {customerPhone !== 'N/A' && (
                                    <a 
                                      href={`tel:${customerPhone}`}
                                      className="text-xs text-green-600 hover:text-green-800 hover:underline transition-colors"
                                    >
                                      {customerPhone}
                                    </a>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              <div className="truncate max-w-xs" title={serviceName}>
                                {serviceName}
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 font-semibold">
                              ₹{amount.toLocaleString()}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                              <div className="flex flex-col">
                                <span className="bg-blue-100 px-2 py-1 rounded text-xs text-blue-800 mb-1">
                                  {scheduledDate ? new Date(scheduledDate).toLocaleDateString() : 'N/A'}
                                </span>
                                {startTime !== 'N/A' && (
                                  <span className="bg-gray-100 px-2 py-1 rounded text-xs text-gray-600">
                                    {startTime}
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wide transition-all duration-200 ${
                                status === 'Confirmed' || status === 'confirmed' ? 'bg-green-500 text-white shadow-md' :
                                status === 'Pending' || status === 'pending' ? 'bg-amber-500 text-white shadow-md' :
                                status === 'Cancelled' || status === 'cancelled' ? 'bg-red-500 text-white shadow-md' :
                                status === 'Completed' || status === 'completed' ? 'bg-blue-500 text-white shadow-md' :
                                'bg-gray-500 text-white shadow-md'
                              }`}>
                                {status}
                              </span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wide transition-all duration-200 ${
                                paymentStatus === 'Paid' || paymentStatus === 'paid' ? 'bg-green-500 text-white shadow-md' :
                                paymentStatus === 'Pending' || paymentStatus === 'pending' ? 'bg-amber-500 text-white shadow-md' :
                                paymentStatus === 'Failed' || paymentStatus === 'failed' ? 'bg-red-500 text-white shadow-md' :
                                paymentStatus === 'Refunded' || paymentStatus === 'refunded' ? 'bg-purple-500 text-white shadow-md' :
                                'bg-gray-500 text-white shadow-md'
                              }`}>
                                {paymentStatus}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </ModalBody>
          <ModalFooter className="bg-gray-50 px-6 py-4 rounded-b-2xl border-t border-gray-200">
            <div className="flex items-center justify-between w-full">
              {/* Summary Stats */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                  <span className="font-medium">Confirmed: {bookings.filter(b => b.status === 'confirmed').length}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="w-3 h-3 bg-amber-500 rounded-full"></span>
                  <span className="font-medium">Pending: {bookings.filter(b => b.status === 'pending').length}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                  <span className="font-medium">Cancelled: {bookings.filter(b => b.status === 'cancelled').length}</span>
                </div>
                <div className="text-sm text-gray-600 border-l border-gray-300 pl-4">
                  <span className="font-semibold">Total: ₹{bookings.reduce((sum, b) => sum + (b.amount || 0), 0).toLocaleString()}</span>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <Button 
                  variant="outline" 
                  colorScheme="blue"
                  onClick={closeBookingModal}
                  className="hover:bg-blue-50 transition-colors border-blue-300"
                >
                  Export Data
                </Button>
                <Button 
                  colorScheme="blue" 
                  onClick={closeBookingModal}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Close
                </Button>
              </div>
            </div>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default UserBusinessList;
