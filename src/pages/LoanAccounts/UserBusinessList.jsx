import React, { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import AddProductModal from "./AddProductModal";

const UserBusinessList = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
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
  const [businessProducts, setBusinessProducts] = useState({}); // Track which businesses have products
  const [selectedBusinessForProduct, setSelectedBusinessForProduct] = useState(null);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { 
    isOpen: isAddProductOpen, 
    onOpen: onAddProductOpen, 
    onClose: onAddProductClose 
  } = useDisclosure();
  const {
    isOpen: isAlertOpen,
    onOpen: openAlert,
    onClose: closeAlert,
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

  // Check if a business has products
  const checkBusinessProducts = async (businessId) => {
    try {
      const response = await axios.get(`/product/business/${businessId}`);
      console.log("Product response for business", businessId, ":", response);
      
      // Handle different possible response structures
      let products = [];
      if (response.data && Array.isArray(response.data)) {
        // Direct array response
        products = response.data;
      } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
        // Nested data structure
        products = response.data.data;
      } else if (response.data && response.data.result && Array.isArray(response.data.result)) {
        // Result structure
        products = response.data.result;
      } else if (response.data && response.data.products && Array.isArray(response.data.products)) {
        // Products property
        products = response.data.products;
      } else if (response.data && response.data.result && response.data.result.products && Array.isArray(response.data.result.products)) {
        // Nested result.products structure (your specific case)
        products = response.data.result.products;
      }
      
      const hasProducts = products && products.length > 0;
      console.log("Business", businessId, "has products:", hasProducts, "count:", products.length);
      
      // Special debugging for Shree Clinic
      if (businessId === "68e633dd36b96968cc80718b") {
        console.log("=== SHREE CLINIC DEBUG ===");
        console.log("Full response:", response);
        console.log("Response data:", response.data);
        console.log("Response data.result:", response.data?.result);
        console.log("Response data.result.products:", response.data?.result?.products);
        console.log("Products array:", products);
        console.log("Has products:", hasProducts);
        console.log("=== END DEBUG ===");
      }
      
      setBusinessProducts(prev => ({
        ...prev,
        [businessId]: hasProducts
      }));
      return hasProducts;
    } catch (error) {
      console.error('Error checking products for business:', businessId, error);
      setBusinessProducts(prev => ({
        ...prev,
        [businessId]: false
      }));
      return false;
    }
  };

  // Check products for all businesses
  const checkAllBusinessProducts = async (businessList) => {
    console.log("Checking products for", businessList.length, "businesses");
    const productChecks = businessList.map(business => 
      checkBusinessProducts(business._id)
    );
    await Promise.all(productChecks);
    console.log("Final businessProducts state:", businessProducts);
  };

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
        
        // Check products for all businesses
        await checkAllBusinessProducts(businessesWithStatus);
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

  // Monitor businessProducts state changes
  useEffect(() => {
    console.log("businessProducts state updated:", businessProducts);
  }, [businessProducts]);

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

  // Handle Add Product modal
  const handleAddProduct = (business) => {
    setSelectedBusinessForProduct(business);
    onAddProductOpen();
  };

  // Handle product added successfully
  const handleProductAdded = () => {
    // Refresh the business products check
    if (selectedBusinessForProduct) {
      checkBusinessProducts(selectedBusinessForProduct._id);
    }
    setSelectedBusinessForProduct(null);
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
        const hasProducts = businessProducts[original._id];
        console.log("Actions Cell - Business:", original.name, "Category:", original.category, "CategoryType:", categoryType, "HasProducts:", hasProducts, "Categories length:", categories.length);
        
        // Special debugging for Shree Clinic
        if (original._id === "68e633dd36b96968cc80718b") {
          console.log("=== SHREE CLINIC ACTIONS DEBUG ===");
          console.log("Business ID:", original._id);
          console.log("Business name:", original.name);
          console.log("businessProducts state:", businessProducts);
          console.log("hasProducts value:", hasProducts);
          console.log("Will show button:", hasProducts ? "View Products" : "Add Product");
          console.log("=== END ACTIONS DEBUG ===");
        }
        
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
              {categoryType && categoryType.toLowerCase().includes("product-based") && (
                <MenuItem onClick={() => navigate(`/dash/business-leads/${original._id}`)}>
                  📊 Leads
                </MenuItem>
              )}
              {categoryType && categoryType.toLowerCase().includes("management") && (
                <MenuItem onClick={() => navigate(`/dash/business-bookings/${original._id}`)}>
                  📅 Booking
                </MenuItem>
              )}
              
              {/* Dynamic Products Button */}
              {hasProducts ? (
                <MenuItem onClick={() => navigate(`/dash/admin/view-products/${original._id}`)}>
                  📦 View Products
                </MenuItem>
              ) : (
                <MenuItem onClick={() => handleAddProduct(original)}>
                  ➕ Add Product
                </MenuItem>
              )}
              
            </MenuList>
          </Menu>
        );
      },
    },
  ], [businesses, categories, businessProducts]);

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

      <Table data={[...filteredBusinesses].reverse()} columns={columns} />

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

      {/* Add Product Modal */}
      <AddProductModal
        isOpen={isAddProductOpen}
        onClose={onAddProductClose}
        businessId={selectedBusinessForProduct?._id}
        businessName={selectedBusinessForProduct?.name}
        onProductAdded={handleProductAdded}
      />

    </div>
  );
};

export default UserBusinessList;
