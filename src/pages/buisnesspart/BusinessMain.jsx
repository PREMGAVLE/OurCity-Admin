import React, { useState, useEffect, useMemo, useRef } from "react";
import axios from "../../axios";
import dayjs from "dayjs";
import Table from "../../componant/Table/Table";
import { Button, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, useToast, AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter, Menu, MenuButton, MenuList, MenuItem, InputGroup, InputLeftElement, Input, InputRightAddon } from "@chakra-ui/react";
import { MdDelete, MdSearch } from "react-icons/md";
import { IoMdNotifications } from "react-icons/io";
import RegisterBusinessForm from "./buisnessComponents/RegisterBusinessForm";
import Cell from "../../componant/Table/cell";

const BusinessMain = () => {
    const [data, setData] = useState([]);
    const [owners, setOwners] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedBusinessID, setSelectedBusinessID] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editingBusiness, setEditingBusiness] = useState(null);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [notifications, setNotifications] = useState([]);
    const [pendingCount, setPendingCount] = useState(0);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);

    const { isOpen, onOpen, onClose } = useDisclosure(); // modal
    const {
        isOpen: isAlertOpen,
        onOpen: openAlert,
        onClose: closeAlert,
    } = useDisclosure(); // delete alert

    const cancelRef = useRef();
    const toast = useToast();

    // Fetch pending notifications from API (no localStorage dependency)
    const fetchNotifications = async () => {
        try {
            console.log("Fetching notifications from /api/notifications");
            const notificationsRes = await axios.get("/api/notifications");
            console.log("Notifications API response:", notificationsRes);
            
            if (notificationsRes.data && notificationsRes.status !== 404) {
                const notificationsData = notificationsRes.data.result?.notifications || notificationsRes.data || [];
                console.log("Raw notifications from API:", notificationsData);
                
                // Show all pending notifications from API (no localStorage filtering)
                setNotifications(Array.isArray(notificationsData) ? notificationsData : []);
                setPendingCount(Array.isArray(notificationsData) ? notificationsData.length : 0);
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
                const allBusinesses = businessesRes.data.data || [];
                
                // Only show businesses that are explicitly pending (approvalStatus: "pending")
                // AND are truly new businesses (not existing ones)
                // Use a timestamp approach to distinguish new vs existing businesses
                const currentTime = new Date();
                const oneDayAgo = new Date(currentTime.getTime() - (24 * 60 * 60 * 1000)); // 24 hours ago
                
                const pendingBusinesses = allBusinesses.filter(b => {
                    const approvalStatus = b.approvalStatus;
                    const createdAt = new Date(b.createdAt || b.created_at || b.dateCreated || 0);
                    
                    console.log(`Notification check - Business: ${b.name}, approvalStatus: ${approvalStatus}, createdAt: ${createdAt}`);
                    
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

    // Handle business approval
    const handleApprove = async (businessId) => {
        setLoading(true);
        try {
            console.log("Approving business ID:", businessId);
            const response = await axios.put(`bussiness/admin/approve/${businessId}`);
            console.log("Approval API response:", response);
            
            // Only proceed if API call is successful
            if (response.status === 200 || response.status === 201) {
                // Immediately update notifications by removing the approved business
                setNotifications(prev => {
                    const filtered = prev.filter(n => {
                        // Check both _id and data.businessId fields
                        const shouldKeep = n._id !== businessId && n.data?.businessId !== businessId;
                        console.log(`Notification filter - ID: ${n._id}, businessId: ${businessId}, shouldKeep: ${shouldKeep}`);
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
                
                // Refresh both business list and notifications from API
                await fetchData();
                await fetchNotifications();
                toast({ title: "Business approved successfully", status: "success" });
                
                // Dispatch detailed business status update event for immediate user-facing updates
                window.dispatchEvent(new CustomEvent('businessStatusUpdated', { 
                    detail: { 
                        businessId, 
                        status: 'approved',
                        timestamp: new Date().toISOString(),
                        action: 'approve'
                    } 
                }));
            } else {
                throw new Error(`API returned status: ${response.status}`);
            }
        } catch (error) {
            console.error("Error approving business:", error);
            if (error.response?.status === 404) {
                toast({ title: "Approval endpoint not found. Please check API configuration.", status: "error" });
            } else {
                toast({ title: "Error approving business", status: "error" });
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
            const response = await axios.put(`bussiness/admin/reject/${businessId}`);
            console.log("Rejection API response:", response);
            
            // Only proceed if API call is successful
            if (response.status === 200 || response.status === 201) {
                // Immediately update notifications by removing the rejected business
                setNotifications(prev => {
                    const filtered = prev.filter(n => {
                        // Check both _id and data.businessId fields
                        const shouldKeep = n._id !== businessId && n.data?.businessId !== businessId;
                        console.log(`Notification filter - ID: ${n._id}, businessId: ${businessId}, shouldKeep: ${shouldKeep}`);
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
                
                // Refresh both business list and notifications from API
                await fetchData();
                await fetchNotifications();
                toast({ title: "Business rejected successfully", status: "success" });
                
                // Dispatch detailed business status update event for immediate user-facing updates
                window.dispatchEvent(new CustomEvent('businessStatusUpdated', { 
                    detail: { 
                        businessId, 
                        status: 'denied',
                        timestamp: new Date().toISOString(),
                        action: 'reject'
                    } 
                }));
            } else {
                throw new Error(`API returned status: ${response.status}`);
            }
        } catch (error) {
            console.error("Error rejecting business:", error);
            if (error.response?.status === 404) {
                toast({ title: "Rejection endpoint not found. Please check API configuration.", status: "error" });
            } else {
                toast({ title: "Error rejecting business", status: "error" });
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchData = async () => {
        try {
            const res = await axios.get("/bussiness/admin/all");
            console.log("Business fetch response:", res);
            console.log("Business data:", res.data);
            
            if (res?.data && res.status !== 404) {
                const allBusinesses = res.data.data || [];
                console.log("All businesses:", allBusinesses);
                
                // Show ALL existing businesses in the main list
                // No filtering - display all businesses regardless of status
                console.log("All businesses for main list:", allBusinesses);
                setData(allBusinesses);
            } else {
                console.log("No businesses found or API not available");
                setData([]);
            }
        } catch (err) {
            console.error("Error fetching businesses", err);
            setData([]);
        }
    };

    useEffect(() => {
        console.log("BusinessMain useEffect - Initializing...");
        fetchData();
        fetchNotifications();
        
        // Fetch users with proper error handling
        axios.get("/user/getUser")
            .then((res) => {
                if (res?.data && res.status !== 404) {
                    setOwners(res.data.result || []);
                } else {
                    setOwners([]);
                }
            })
            .catch((err) => {
                console.error("Error fetching users", err);
                setOwners([]);
            });
        
        // Fetch categories with proper error handling
        axios.get("/category/getCategory")
            .then((res) => {
                if (res?.data && res.status !== 404) {
                    setCategories(res.data.data || []);
                } else {
                    setCategories([]);
                }
            })
            .catch((err) => {
                console.error("Error fetching categories", err);
                setCategories([]);
            });
            
        // Listen for admin actions to refresh the list
        const handleStatusUpdate = () => {
            console.log("Business status updated, refreshing data...");
            fetchData();
            fetchNotifications();
        };
        
        // Listen for new business creation to update notifications
        const handleNewBusiness = () => {
            console.log("New business created, refreshing notifications...");
            fetchNotifications();
        };
        
        window.addEventListener('businessStatusUpdated', handleStatusUpdate);
        window.addEventListener('newBusinessCreated', handleNewBusiness);
        
        // Poll for notifications every 30 seconds for real-time updates
        const interval = setInterval(() => {
            console.log("Polling for notifications...");
            fetchNotifications();
        }, 30000);
        
        return () => {
            window.removeEventListener('businessStatusUpdated', handleStatusUpdate);
            window.removeEventListener('newBusinessCreated', handleNewBusiness);
            clearInterval(interval);
        };
    }, []);




    const getOwnerName = (id) => {
        if (!id || !Array.isArray(owners)) return "Unknown";
        const owner = owners.find((o) => o?._id === id);
        return owner?.name || owner?.title || "Unknown";
    };

    const getCategoryName = (id) => {
        if (!id || !Array.isArray(categories)) return "Unknown";
        const category = categories.find((c) => c?._id === id);
        return category?.name || "Unknown";
    };

    const handleFormSubmit = async (formData) => {
        setLoading(true);
        try {
            if (isEditing && editingBusiness) {
                const response = await axios.put(`/bussiness/updateBuss/${editingBusiness._id}`, formData);
                if (response?.status !== 404) {
                    toast({ title: "Business updated.", status: "success", duration: 3000 });
                    fetchData();
                    onClose();
                    setIsEditing(false);
                    setEditingBusiness(null);
                } else {
                    toast({ title: "Update failed - API not available.", status: "error", duration: 3000 });
                }
            } else {
                // Create business with pending status - no fallback allowed
                const response = await axios.post("bussiness/registerBuss", formData);
                
                if (response?.status !== 404) {
                    toast({ title: "Business added and pending approval.", status: "success", duration: 3000 });
                    
                    // Get the business ID from response
                    const businessId = response?.data?.data?._id || response?.data?.result?._id || response?.data?._id;
                    if (businessId) {
                        // Notify admin pages about new business creation
                        window.dispatchEvent(new CustomEvent('newBusinessCreated', { detail: { businessId } }));
                    }
                    
                    // Refresh notifications to show new pending business
                    fetchNotifications();
                    onClose();
                    setIsEditing(false);
                    setEditingBusiness(null);
                } else {
                    toast({ title: "Registration failed - API not available.", status: "error", duration: 3000 });
                }
            }
        } catch (error) {
            console.error("Form submission error:", error);
            toast({ title: "Operation failed.", status: "error", duration: 3000 });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        try {
            const response = await axios.delete(`/bussiness/deleteBuss/${selectedBusinessID}`);
            if (response?.status !== 404) {
                toast({ title: "Business deleted.", status: "success", duration: 3000 });
                closeAlert();
                fetchData();
            } else {
                toast({ title: "Delete failed - API not available.", status: "error", duration: 3000 });
            }
        } catch (err) {
            console.error("Delete error:", err);
            toast({ title: "Delete failed.", status: "error", duration: 3000 });
        }
    };

    const columns = useMemo(() => [
        {
            Header: "Sr No.",
            Cell: ({ row: { index } }) => <Cell text={index + 1} />,
        },
        {
            Header: "Business Name",
            accessor: "name",
            Cell: ({ value }) => <Cell text={value || "Unknown"} bold="bold" />,
        },

        


        {
            Header: "Category",
            accessor: "category",
            Cell: ({ value }) => <Cell text={getCategoryName(value)} />,
        },
        {
            Header: "Description",
            accessor: "description",
            Cell: ({ value }) => <Cell text={value || "-"} />,
        },
        {
            Header: "Phone",
            accessor: "contact.phone",
            Cell: ({ row }) => <Cell text={row.original?.contact?.phone || "-"} />,
        },
 
        {
            Header: "Street",
            accessor: "address.street",
            Cell: ({ row }) => <Cell text={row.original?.address?.street || "-"} />,
        },
         {
            Header: "Speciality",
            accessor: "speciality",
            Cell: ({ value }) => <Cell text={value || "-"} />,
        },
 
        {
            Header: "Action",
            Cell: ({ row: { original } }) => (
                <Menu>
                    <MenuButton
                        colorScheme="purple" as={Button}>Actions</MenuButton>
                    <MenuList>
                        <MenuItem
                            onClick={() => {
                                setIsEditing(true);
                                setEditingBusiness(original);
                                onOpen();
                            }}
                        >
                            ✏️ Edit
                        </MenuItem>
                        <MenuItem
                            onClick={() => {
                                setSelectedBusinessID(original._id);
                                openAlert();
                            }}
                        >
                            <MdDelete className="mr-2" /> Delete
                        </MenuItem>
                    </MenuList>
                </Menu>
            ),
        },
    ], [owners, categories]);


    return (
        <div className="py-20 bg-bgWhite">
            <section className="md:p-1">
                <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                    <div className="flex gap-2 items-center">
                        <Button colorScheme="purple">Total Businesses: {(data || []).length}</Button>
                        <Button colorScheme="orange">Pending: {pendingCount}</Button>
                        <Button
                            colorScheme="blue"
                            onClick={() => {
                                setIsEditing(false);
                                setEditingBusiness(null);
                                onOpen();
                            }}
                        >
                            Add New Business
                        </Button>
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
                                        <span className="font-semibold text-sm">Pending Business Approvals</span>
                                        <span className="text-xs bg-red-500 text-white rounded-full px-2 py-0.5">{Array.isArray(notifications) ? notifications.length : 0}</span>
                                    </div>
                                    {!Array.isArray(notifications) || notifications.length === 0 ? (
                                        <div className="p-4 text-center text-gray-500 text-sm">No pending businesses</div>
                                    ) : (
                                        <div className="divide-y">
                                             {notifications.map((n, idx) => {
                                                 // Get business ID from different possible fields
                                                 const businessId = n.data?.businessId || n._id;
                                                 const businessName = n.business?.name || n.name || 'Unknown Business';
                                                 const ownerName = n.data?.ownerId || n.owner || 'Unknown';
                                                 const categoryName = typeof n.category === 'object' ? (n.category?.name || 'N/A') : (n.category || 'N/A');
                                                 
                                                 return (
                                                <div key={n._id || idx} className="p-3">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <div className="min-w-0">
                                                                 <div className="font-semibold text-sm truncate">{businessName}</div>
                                                                 <div className="text-xs text-gray-600 truncate">Owner: {ownerName}</div>
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
                                                                 onClick={() => handleApprove(businessId)}
                                                            className="text-white bg-green-600 hover:bg-green-700 disabled:opacity-60 text-xs px-3 py-1 rounded"
                                                        >
                                                            Approve
                                                        </button>
                                                        <button
                                                            disabled={loading}
                                                                 onClick={() => handleDeny(businessId)}
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
                
                    data={(data || []).filter((item) => {
                        if (!item) return false;
                        // Data is already filtered to approved businesses in fetchData
                        const ownerName = getOwnerName(item.owner).toLowerCase();
                        const categoryName = getCategoryName(item.category).toLowerCase();
                        return (
                            (item.name?.toLowerCase() || '').includes(search.toLowerCase()) ||
                            (item.contact?.phone?.toLowerCase() || '').includes(search.toLowerCase()) ||
                            (item.contact?.email?.toLowerCase() || '').includes(search.toLowerCase()) ||
                            ownerName.includes(search.toLowerCase()) ||
                            categoryName.includes(search.toLowerCase())
                        );
                    })}
                    columns={columns}
                />

            </section>

            {/* Business Modal */}
            <Modal
                isOpen={isOpen}
                onClose={() => {
                    setIsEditing(false);
                    setEditingBusiness(null);
                    onClose();
                }}
                size="4xl"
                scrollBehavior="inside"
            >
                <ModalOverlay />
                <ModalContent className="rounded-2xl">
                    <ModalHeader className="text-xl font-bold">
                        {isEditing ? "Edit Business" : "Register New Business"}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <RegisterBusinessForm
                            owners={owners}
                            categories={categories}
                            initialData={editingBusiness}
                            onSubmit={handleFormSubmit}
                            loading={loading}
                        />
                    </ModalBody>
                </ModalContent>
            </Modal>

            {/* Delete Alert Dialog */}
            <AlertDialog
                isOpen={isAlertOpen}
                leastDestructiveRef={cancelRef}
                onClose={closeAlert}
                isCentered
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Delete Business
                        </AlertDialogHeader>
                        <AlertDialogBody>
                            Are you sure you want to delete this business?
                        </AlertDialogBody>
                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={closeAlert}>
                                Cancel
                            </Button>
                            <Button colorScheme="red" onClick={handleDelete} ml={3}>
                                Delete
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </div>
    );
};

export default BusinessMain;
