import React, { useState, useEffect, useMemo, useRef } from "react";
import axios from "../../axios";
import Table from "../../componant/Table/Table";
import { Button, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, useToast, Menu, MenuButton, MenuList, MenuItem, InputGroup, InputLeftElement, Input, InputRightAddon, AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter, FormControl, FormLabel, Select, Textarea } from "@chakra-ui/react";
import { MdDelete, MdSearch } from "react-icons/md";
import { IoMdNotifications } from "react-icons/io";
import Cell from "../../componant/Table/cell";

const ProductsMain = () => {
    const [data, setData] = useState([]);
    const [businesses, setBusinesses] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [notifications, setNotifications] = useState([]);
    const [pendingCount, setPendingCount] = useState(0);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [isRejectionModalOpen, setIsRejectionModalOpen] = useState(false);
    const [rejectionReason, setRejectionReason] = useState("");
    const [productToReject, setProductToReject] = useState(null);
    
    // Edit and Delete states
    const [isEditing, setIsEditing] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [selectedProductID, setSelectedProductID] = useState(null);
    const [editFormData, setEditFormData] = useState({
        name: "",
        description: "",
        price: "",
        offerPrice: "",
        brand: "",
        quantity: "",
        feature: "",
        speciality: "",
        status: "active"
    });

    const { isOpen, onOpen, onClose } = useDisclosure(); // modal
    const {
        isOpen: isRejectionOpen,
        onOpen: openRejection,
        onClose: closeRejection,
    } = useDisclosure(); // rejection modal
    const {
        isOpen: isAlertOpen,
        onOpen: openAlert,
        onClose: closeAlert,
    } = useDisclosure(); // delete alert
    const toast = useToast();
    const cancelRef = useRef();

    // Fetch products data - only approved products
    const fetchData = async () => {
        try {
            const res = await axios.get("/product/admin/all");
            console.log("Products fetch response:", res);
           
            
            if (res?.data && res.status !== 404) {
                // The API returns data in res.data.result.products array
                const allProducts = res.data.result?.products || [];
                console.log("All products:", allProducts);
                
                // Filter to show only approved products
                const approvedProducts = allProducts.filter(product => 
                    product.approvalStatus === "approved" || product.approvalStatus === "Approved"
                );
                console.log("Approved products:", approvedProducts);
                setData(Array.isArray(approvedProducts) ? approvedProducts : []);
            } else {
                console.log("No products found or API not available");
                setData([]);
            }
        } catch (err) {
            console.error("Error fetching products", err);
            setData([]);
        }
    };

    // Fetch businesses for associated business column
    const fetchBusinesses = async () => {
        try {
            const res = await axios.get("/bussiness/admin/all");
            if (res?.data && res.status !== 404) {
                setBusinesses(res.data.data || []);
            }
        } catch (err) {
            console.error("Error fetching businesses", err);
            setBusinesses([]);
        }
    };

    // Fetch categories
    const fetchCategories = async () => {
        try {
            const res = await axios.get("/category/getCategory");
            if (res?.data && res.status !== 404) {
                setCategories(res.data.data || []);
            }
        } catch (err) {
            console.error("Error fetching categories", err);
            setCategories([]);
        }
    };

    // Fetch pending product notifications
    const fetchNotifications = async () => {
        try {
            console.log("Fetching product notifications from /api/notifications");
            const notificationsRes = await axios.get("/api/notifications");
            console.log("Notifications API response:", notificationsRes);
            
            if (notificationsRes.data && notificationsRes.status !== 404) {
                const notificationsData = notificationsRes.data.result?.notifications || notificationsRes.data || [];
                console.log("Raw notifications from API:", notificationsData);
                
                // Filter for product notifications
                const productNotifications = Array.isArray(notificationsData) ? 
                    notificationsData.filter(n => n.type === 'product_submission' || n.type === 'product' || n.data?.type === 'product') : [];
                
                // Filter out orphaned products from API notifications as well
                const validProductNotifications = await filterOrphanedProducts(productNotifications);
                console.log("Valid product notifications after filtering orphaned ones:", validProductNotifications);
                
                // Temporarily bypass orphaned product filtering to test
                console.log("Raw product notifications (before orphaned filtering):", productNotifications);
                setNotifications(productNotifications);
                setPendingCount(productNotifications.length);
                return;
            }
        } catch (error) {
            console.log("Notifications endpoint not available, fetching pending products directly");
        }

        try {
            // Fallback: fetch pending products directly
            const productsRes = await axios.get("/product/admin/all");
            console.log("Products API response for notifications:", productsRes);
            if (productsRes.data && productsRes.status !== 404) {
                const allProducts = productsRes.data.result?.products || [];
                
                // Filter for pending products
                const pendingProducts = allProducts.filter(p => 
                    p.approvalStatus === "pending" || p.approvalStatus === "Pending"
                );
                console.log("Pending products for notifications:", pendingProducts);
                
                // Filter out orphaned products (products without valid business)
                const validProducts = await filterOrphanedProducts(pendingProducts);
                console.log("Valid products after filtering orphaned ones:", validProducts);
                
                // Temporarily bypass orphaned product filtering to test
                console.log("Raw pending products (before orphaned filtering):", pendingProducts);
                setNotifications(pendingProducts);
                setPendingCount(pendingProducts.length);
            }
        } catch (error) {
            console.error("Error fetching pending products:", error);
            setNotifications([]);
            setPendingCount(0);
        }
    };

    // Helper function to filter out orphaned products (products without valid business)
    const filterOrphanedProducts = async (products) => {
        try {
            // Get all existing businesses to check against
            const businessesRes = await axios.get("/bussiness/admin/all");
            if (businessesRes.data && businessesRes.status !== 404) {
                const allBusinesses = businessesRes.data.data || [];
                const existingBusinessIds = allBusinesses.map(b => b._id);
                
                // Filter products to only include those with valid business IDs
                const validProducts = products.filter(product => {
                    const businessId = product.bussinessId || product.businessId || product.business?._id;
                    
                    // Check if business ID exists and is not null/undefined
                    if (!businessId) {
                        console.log(`Orphaned product found - no business ID:`, product);
                        return false;
                    }
                    
                    // Check if the business still exists
                    const businessExists = existingBusinessIds.includes(businessId);
                    if (!businessExists) {
                        console.log(`Orphaned product found - business no longer exists:`, product, `Business ID: ${businessId}`);
                        return false;
                    }
                    
                    return true;
                });
                
                console.log(`Filtered out ${products.length - validProducts.length} orphaned products`);
                return validProducts;
            }
        } catch (error) {
            console.error("Error filtering orphaned products:", error);
            // If we can't check businesses, return all products to avoid breaking functionality
            return products;
        }
        
        // If we can't fetch businesses, return all products to avoid breaking functionality
        return products;
    };

    useEffect(() => {
        console.log("ProductsMain useEffect - Initializing...");
        fetchData();
        fetchBusinesses();
        fetchCategories();
        fetchNotifications();
        
        // Listen for product actions to refresh the list
        const handleStatusUpdate = () => {
            console.log("Product status updated, refreshing data...");
            fetchData();
            fetchNotifications();
        };
        
        // Listen for new product creation to update notifications
        const handleNewProduct = () => {
            console.log("New product created, refreshing notifications...");
            fetchNotifications();
        };
        
        window.addEventListener('productStatusUpdated', handleStatusUpdate);
        window.addEventListener('newProductCreated', handleNewProduct);
        
        // Poll for notifications every 30 seconds for real-time updates
        const interval = setInterval(() => {
            console.log("Polling for product notifications...");
            fetchNotifications();
        }, 30000);
        
        return () => {
            window.removeEventListener('productStatusUpdated', handleStatusUpdate);
            window.removeEventListener('newProductCreated', handleNewProduct);
            clearInterval(interval);
        };
    }, []);

    // Debug data state changes
    useEffect(() => {
        console.log("Data state changed:", data);
        console.log("Data length:", data.length);
    }, [data]);

    // Handle product approval
    const handleApprove = async (productId) => {
        setLoading(true);
        try {
            console.log("Approving product ID:", productId);
            const response = await axios.put(`/product/admin/approve/${productId}`);
            console.log("Approval API response:", response);
            
            // Only proceed if API call is successful
            if (response.status === 200 || response.status === 201) {
                // Immediately update notifications by removing the approved product
                setNotifications(prev => {
                    const filtered = prev.filter(n => {
                        const shouldKeep = n._id !== productId && n.data?.productId !== productId;
                        console.log(`Notification filter - ID: ${n._id}, productId: ${productId}, shouldKeep: ${shouldKeep}`);
                        return shouldKeep;
                    });
                    console.log("Filtered notifications after approval:", filtered);
                    return filtered;
                });
                setPendingCount(prev => {
                    const newCount = Math.max(0, prev - 1);
                    console.log(`Pending count updated: ${prev} -> ${newCount}`);
                    return newCount;
                });
                
                // Refresh both product list and notifications from API
                await fetchData();
                await fetchNotifications();
                toast({ title: "Product approved successfully", status: "success" });
                
                // Dispatch detailed product status update event for immediate user-facing updates
                window.dispatchEvent(new CustomEvent('productStatusUpdated', { 
                    detail: { 
                        productId, 
                        status: 'approved',
                        timestamp: new Date().toISOString(),
                        action: 'approve'
                    } 
                }));
            } else {
                throw new Error(`API returned status: ${response.status}`);
            }
        } catch (error) {
            console.error("Error approving product:", error);
            if (error.response?.status === 404) {
                toast({ title: "Approval endpoint not found. Please check API configuration.", status: "error" });
            } else {
                toast({ title: "Error approving product", status: "error" });
            }
        } finally {
            setLoading(false);
        }
    };
    
    // Handle product denial
    const handleDeny = async (productId, customReason = null) => {
        setLoading(true);   
        try {
            console.log("Rejecting product ID:", productId);
            const response = await axios.put(`/product/admin/reject/${productId}`, {
                rejectionReason: customReason || "Not approved by admin"
            });
           
            console.log("Rejection API response:", response);
            
            // Only proceed if API call is successful
            if (response.status === 200 || response.status === 201) {
                // Immediately update notifications by removing the rejected product
                setNotifications(prev => {
                    const filtered = prev.filter(n => {
                        const shouldKeep = n._id !== productId && n.data?.productId !== productId;
                        console.log(`Notification filter - ID: ${n._id}, productId: ${productId}, shouldKeep: ${shouldKeep}`);
                        return shouldKeep;
                    });
                    console.log("Filtered notifications after rejection:", filtered);
                    return filtered;
                });
                setPendingCount(prev => {
                    const newCount = Math.max(0, prev - 1);
                    console.log(`Pending count updated: ${prev} -> ${newCount}`);
                    return newCount;
                });
                
                // Refresh both product list and notifications from API
                await fetchData();
                await fetchNotifications();
                toast({ title: "Product rejected successfully", status: "success" });
                
                // Dispatch detailed product status update event for immediate user-facing updates
                window.dispatchEvent(new CustomEvent('productStatusUpdated', { 
                    detail: { 
                        productId, 
                        status: 'denied',
                        timestamp: new Date().toISOString(),
                        action: 'reject'
                    } 
                }));
            } else {
                throw new Error(`API returned status: ${response.status}`);
            }
        } catch (error) {
            console.error("Error rejecting product:", error);
            if (error.response?.status === 404) {
                toast({ title: "Rejection endpoint not found. Please check API configuration.", status: "error" });
            } else {
                toast({ title: "Error rejecting product", status: "error" });
            }
        } finally {
            setLoading(false);
        }
    };

    // Handle rejection modal
    const openRejectionModal = (productId) => {
        setProductToReject(productId);
        setRejectionReason("");
        openRejection();
    };

    const handleRejectionSubmit = async () => {
        if (productToReject) {
            await handleDeny(productToReject, rejectionReason);
            closeRejection();
            setProductToReject(null);
            setRejectionReason("");
        }
    };

    // Handle edit product
    const handleEdit = (product) => {
        setIsEditing(true);
        setEditingProduct(product);
        setEditFormData({
            name: product.name || "",
            description: product.description || "",
            price: product.price || "",
            offerPrice: product.offerPrice || "",
            brand: product.brand || "",
            quantity: product.quantity || "",
            feature: Array.isArray(product.feature) ? product.feature.join(", ") : (product.feature || ""),
            speciality: product.speciality || "",
            status: product.status || "active"
        });
        onOpen();
    };

    // Handle edit form submission
    const handleEditSubmit = async () => {
        setLoading(true);
        try {
            const updateData = {
                ...editFormData,
                feature: editFormData.feature ? editFormData.feature.split(",").map(f => f.trim()).filter(f => f) : [],
                price: parseFloat(editFormData.price) || 0,
                offerPrice: parseFloat(editFormData.offerPrice) || 0,
                quantity: editFormData.quantity.toString()
            };

            const response = await axios.put(`/product/updateProduct/${editingProduct._id}`, updateData);
            
            if (response.status === 200 || response.status === 201) {
                toast({ title: "Product updated successfully", status: "success" });
                fetchData();
                onClose();
                setIsEditing(false);
                setEditingProduct(null);
                setEditFormData({
                    name: "",
                    description: "",
                    price: "",
                    offerPrice: "",
                    brand: "",
                    quantity: "",
                    feature: "",
                    speciality: "",
                    status: "active"
                });
            } else {
                throw new Error(`API returned status: ${response.status}`);
            }
        } catch (error) {
            console.error("Error updating product:", error);
            toast({ title: "Error updating product", status: "error" });
        } finally {
            setLoading(false);
        }
    };

    // Handle delete product
    const handleDelete = async () => {
        setLoading(true);
        try {
            const response = await axios.delete(`/product/deleteProduct/${selectedProductID}`);
            
            if (response.status === 200 || response.status === 201) {
                toast({ title: "Product deleted successfully", status: "success" });
                closeAlert();
                fetchData();
                setSelectedProductID(null);
            } else {
                throw new Error(`API returned status: ${response.status}`);
            }
        } catch (error) {
            console.error("Error deleting product:", error);
            toast({ title: "Error deleting product", status: "error" });
        } finally {
            setLoading(false);
        }
    };

    const getBusinessName = (businessData) => {
        // Handle both direct business object and business ID
        if (typeof businessData === 'object' && businessData?.name) {
            return businessData.name;
        }
        if (!businessData || !Array.isArray(businesses)) return "Unknown";
        const business = businesses.find((b) => b?._id === businessData);
        return business?.name || "Unknown";
    };

    const getCategoryName = (categoryId) => {
        if (!categoryId || !Array.isArray(categories)) return "Unknown";
        const category = categories.find((c) => c?._id === categoryId);
        return category?.name || "Unknown";
    };

    const columns = useMemo(() => [
        {
            Header: "Sr No.",
            Cell: ({ row: { index } }) => <Cell text={index + 1} />,
        },
        {
            Header: "Image",
            accessor: "image",
            Cell: ({ value }) => (
                <div className="flex justify-center">
                    {value && value.length > 0 ? (
                        <img 
                            src={value[0]} 
                            alt="Product" 
                            className="w-12 h-12 object-cover rounded-md border border-gray-200"
                            onError={(e) => {
                                e.target.style.display = 'none';
                                const fallback = e.target.nextSibling;
                                if (fallback) {
                                    fallback.style.display = 'block';
                                }
                            }}
                        />
                    ) : null}
                    <div 
                        className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center text-gray-500 text-xs"
                        style={{ display: value && value.length > 0 ? 'none' : 'block' }}
                    >
                        {value && value.length > 0 ? 'Error' : 'No Image'}
                    </div>
                </div>
            ),
        },
        {
            Header: "Product Name",
            accessor: "name",
            Cell: ({ value }) => <Cell text={value || "Unknown"} bold="bold" />,
        },
        {
            Header: "Description",
            accessor: "description",
            Cell: ({ value }) => <Cell text={value || "-"} />,
        },
        {
            Header: "Associated Business",
            accessor: "bussinessId",
            Cell: ({ value }) => <Cell text={getBusinessName(value)} />,
        },
        {
            Header: "Price",
            accessor: "price",
            Cell: ({ value }) => <Cell text={value ? `₹${value}` : "-"} />,
        },
        {
            Header: "Status",
            accessor: "approvalStatus",
            Cell: ({ value }) => (
                <Cell 
                    text={value || "-"} 
                    className={value === "pending" ? "text-orange-600" : value === "approved" ? "text-green-600" : "text-red-600"}
                />
            ),
        },
        {
            Header: "Action",
            Cell: ({ row: { original } }) => (
                <Menu>
                    <MenuButton
                        colorScheme="purple" as={Button}>Actions</MenuButton>
                    <MenuList>
                        <MenuItem
                            onClick={() => handleEdit(original)}
                        >
                            ✏️ Edit
                        </MenuItem>
                        <MenuItem
                            onClick={() => {
                                setSelectedProductID(original._id);
                                openAlert();
                            }}
                        >
                            <MdDelete className="mr-2" /> Delete
                        </MenuItem>
                    </MenuList>
                </Menu>
            ),
        },
    ], [businesses, categories]);

    return (
        <div className="py-20 bg-bgWhite">
            <section className="md:p-1">
                <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                    <div className="flex gap-2 items-center">
                        <Button colorScheme="purple">Total Products: {(data || []).length}</Button>
                        <Button colorScheme="orange">Pending: {pendingCount}</Button>
                        
                    </div>

                    <div className="w-full mt-3 sm:w-auto sm:min-w-[300px] flex items-center gap-2">
                        {/* Notification Bell */}
                        <div className="relative">
                            <button
                                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                                className="flex bg-purple-500 rounded-xl p-1 text-white text-xl font-bold focus:ring-2 focus:ring-bgBlue dark:focus:ring-bgBlue mr-2 relative"
                            >
                                <IoMdNotifications size={28} />
                                {pendingCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                                        {pendingCount}
                                    </span>
                                )}
                            </button>
                            {/* Notification Dropdown */}
                            {isNotificationOpen && (
                                <div className="absolute right-0 mt-2 w-96 max-h-96 overflow-auto bg-white shadow-xl rounded-md border border-gray-200 z-50">
                                    <div className="px-4 py-2 flex items-center justify-between border-b">
                                        <span className="font-semibold text-sm">Pending Product Approvals</span>
                                        <span className="text-xs bg-red-500 text-white rounded-full px-2 py-0.5">{Array.isArray(notifications) ? notifications.length : 0}</span>
                                    </div>
                                    {!Array.isArray(notifications) || notifications.length === 0 ? (
                                        <div className="p-4 text-center text-gray-500 text-sm">No pending products</div>
                                    ) : (
                                        <div className="divide-y">
                                             {notifications.map((n, idx) => {
                                                 // Get product ID from different possible fields
                                                 const productId = n.data?.productId || n._id;
                                                 const productName = n.product?.name || n.name || 'Unknown Product';
                                                 const businessName = n.bussinessId?.name || n.business?.name || 'Unknown';
                                                 const categoryName = typeof n.category === 'object' ? (n.category?.name || 'N/A') : (n.category || 'N/A');
                                                 
                                                 return (
                                                <div key={n._id || idx} className="p-3">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <div className="min-w-0">
                                                                 <div className="font-semibold text-sm truncate">{productName}</div>
                                                                 <div className="text-xs text-gray-600 truncate">Business: {businessName}</div>
                                                                 <div className="text-xs text-gray-600 truncate">Category: {categoryName}</div>
                                                            {n.createdAt && (
                                                                <div className="text-[11px] text-gray-400">{new Date(n.createdAt).toLocaleString()}</div>
                                                            )}
                                                            {n.description && (
                                                                <div className="text-xs text-gray-500 mt-1 line-clamp-2">{n.description}</div>
                                                            )}
                                                        </div>
                                                        <span className="text-[10px] bg-orange-100 text-orange-700 px-2 py-0.5 rounded">Pending</span>
                                                    </div>
                                                    <div className="flex justify-end gap-2 mt-2">
                                                        <button
                                                            disabled={loading}
                                                                 onClick={() => handleApprove(productId)}
                                                            className="text-white bg-green-600 hover:bg-green-700 disabled:opacity-60 text-xs px-3 py-1 rounded"
                                                        >
                                                            Approve
                                                        </button>
                                                        <button
                                                            disabled={loading}
                                                            onClick={() => openRejectionModal(productId)}
                                                            className="text-red-600 border border-red-500 hover:bg-red-50 disabled:opacity-60 text-xs px-3 py-1 rounded"
                                                        >
                                                            Deny
                                                        </button>
                                                    </div>
                                                </div>
                                                 );
                                             })}
                                        </div>
                                    )}
                                    <div className="p-2 text-right">
                                        <button onClick={() => setIsNotificationOpen(false)} className="text-xs text-purple-600 hover:underline">Close</button>
                                    </div>
                                </div>
                            )}
                        </div>
                        
                        <InputGroup size="md">
                            <InputLeftElement pointerEvents="none">
                                <MdSearch color="gray.400" />
                            </InputLeftElement>
                            <Input
                                placeholder="Search..."
                                border="1px solid #949494"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
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

                <Table
                    data={(() => {
                        const filteredData = (data || []).filter((item) => {
                            if (!item) return false;
                            const businessName = getBusinessName(item.bussinessId).toLowerCase();
                            return (
                                (item.name?.toLowerCase() || '').includes(search.toLowerCase()) ||
                                (item.description?.toLowerCase() || '').includes(search.toLowerCase()) ||
                                businessName.includes(search.toLowerCase())
                            );
                        });
                        console.log("Filtered data for table:", filteredData);
                        console.log("Original data:", data);
                        return filteredData;
                    })()}
                    columns={columns}
                />
            </section>

            {/* Edit Product Modal */}
            <Modal
                isOpen={isOpen}
                onClose={() => {
                    setIsEditing(false);
                    setEditingProduct(null);
                    onClose();
                }}
                size="4xl"
                scrollBehavior="inside"
            >
                <ModalOverlay />
                <ModalContent className="rounded-2xl">
                    <ModalHeader className="text-xl font-bold">
                        {isEditing ? "Edit Product" : "Add New Product"}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {isEditing ? (
                            <div className="space-y-4">
                                <FormControl isRequired>
                                    <FormLabel>Product Name</FormLabel>
                                    <Input
                                        value={editFormData.name}
                                        onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                                        placeholder="Enter product name"
                                    />
                                </FormControl>
                                
                                <FormControl>
                                    <FormLabel>Description</FormLabel>
                                    <Textarea
                                        value={editFormData.description}
                                        onChange={(e) => setEditFormData({...editFormData, description: e.target.value})}
                                        placeholder="Enter product description"
                                        rows={3}
                                    />
                                </FormControl>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <FormControl isRequired>
                                        <FormLabel>Price (₹)</FormLabel>
                                        <Input
                                            type="number"
                                            value={editFormData.price}
                                            onChange={(e) => setEditFormData({...editFormData, price: e.target.value})}
                                            placeholder="Enter price"
                                        />
                                    </FormControl>
                                    
                                    <FormControl>
                                        <FormLabel>Offer Price (₹)</FormLabel>
                                        <Input
                                            type="number"
                                            value={editFormData.offerPrice}
                                            onChange={(e) => setEditFormData({...editFormData, offerPrice: e.target.value})}
                                            placeholder="Enter offer price"
                                        />
                                    </FormControl>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <FormControl>
                                        <FormLabel>Brand</FormLabel>
                                        <Input
                                            value={editFormData.brand}
                                            onChange={(e) => setEditFormData({...editFormData, brand: e.target.value})}
                                            placeholder="Enter brand"
                                        />
                                    </FormControl>
                                    
                                    <FormControl isRequired>
                                        <FormLabel>Quantity</FormLabel>
                                        <Input
                                            value={editFormData.quantity}
                                            onChange={(e) => setEditFormData({...editFormData, quantity: e.target.value})}
                                            placeholder="Enter quantity"
                                        />
                                    </FormControl>
                                </div>
                                
                                <FormControl>
                                    <FormLabel>Features (comma-separated)</FormLabel>
                                    <Input
                                        value={editFormData.feature}
                                        onChange={(e) => setEditFormData({...editFormData, feature: e.target.value})}
                                        placeholder="Enter features separated by commas"
                                    />
                                </FormControl>
                                
                                <FormControl>
                                    <FormLabel>Speciality</FormLabel>
                                    <Input
                                        value={editFormData.speciality}
                                        onChange={(e) => setEditFormData({...editFormData, speciality: e.target.value})}
                                        placeholder="Enter speciality"
                                    />
                                </FormControl>
                                
                                <FormControl>
                                    <FormLabel>Status</FormLabel>
                                    <Select
                                        value={editFormData.status}
                                        onChange={(e) => setEditFormData({...editFormData, status: e.target.value})}
                                    >
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </Select>
                                </FormControl>
                            </div>
                        ) : (
                            <div className="p-4 text-center text-gray-500">
                                Add product form will be implemented here
                            </div>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        {isEditing && (
                            <>
                                <Button variant="ghost" mr={3} onClick={() => {
                                    setIsEditing(false);
                                    setEditingProduct(null);
                                    onClose();
                                }}>
                                    Cancel
                                </Button>
                                <Button 
                                    colorScheme="blue" 
                                    onClick={handleEditSubmit}
                                    isLoading={loading}
                                >
                                    Update Product
                                </Button>
                            </>
                        )}
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* Delete Confirmation Dialog */}
            <AlertDialog
                isOpen={isAlertOpen}
                leastDestructiveRef={cancelRef}
                onClose={closeAlert}
                isCentered
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Delete Product
                        </AlertDialogHeader>
                        <AlertDialogBody>
                            Are you sure you want to delete this product? This action cannot be undone.
                        </AlertDialogBody>
                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={closeAlert}>
                                Cancel
                            </Button>
                            <Button colorScheme="red" onClick={handleDelete} ml={3} isLoading={loading}>
                                Delete
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>

            {/* Rejection Modal */}
            <Modal
                isOpen={isRejectionOpen}
                onClose={closeRejection}
                isCentered
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Reject Product</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Rejection Reason (Optional)
                            </label>
                            <textarea
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                placeholder="Enter reason for rejection..."
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                rows={3}
                            />
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="ghost" mr={3} onClick={closeRejection}>
                            Cancel
                        </Button>
                        <Button 
                            colorScheme="red" 
                            onClick={handleRejectionSubmit}
                            disabled={loading}
                        >
                            Reject Product
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );
};

export default ProductsMain;
