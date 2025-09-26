import React, { useEffect, useState, useMemo, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "../../../../axios";
import { Atom } from "react-loading-indicators";
import Table from "../../../../componant/Table/Table";
import Cell from "../../../../componant/Table/cell";
import {
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightAddon,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useToast,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
} from "@chakra-ui/react";
import { MdEdit, MdDelete, MdSearch } from "react-icons/md";
import dayjs from "dayjs";
import RegisterBusinessForm from "../../../buisnesspart/buisnessComponents/RegisterBusinessForm";


const ChildSubcategoryPage = () => {
  const { subcategoryId } = useParams();
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [editingBusiness, setEditingBusiness] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedBusinessId, setSelectedBusinessId] = useState(null);
  
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { 
    isOpen: isDeleteOpen, 
    onOpen: openDelete, 
    onClose: closeDelete 
  } = useDisclosure();
  const cancelRef = useRef();

  const fetchBusiness = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/subcategory/getSubCategory/${subcategoryId}`);
      const allBusinesses = res?.data?.result?.businesses || [];
      
      // Filter out pending businesses (those marked in local storage)
      const approvedBusinesses = allBusinesses.filter(business => {
        const isPending = localStorage.getItem(`pending_business_${business._id}`) === 'true';
        return !isPending;
      });
      
      setBusinesses(approvedBusinesses);
      console.log("Filtered businesses:", approvedBusinesses);
    } catch (err) {
      console.error("Error fetching businesses", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get("/category/getCategory");
      setCategories(res.data.data || []);
    } catch (err) {
      console.error("Error fetching categories", err);
    }
  };

  useEffect(() => {
    fetchBusiness();
    fetchCategories();
  }, [subcategoryId]);

  const handleFormSubmit = async (formData) => {
    setLoading(true);
    try {
      if (editingBusiness) {
        // Edit existing business
        const response = await axios.put(`/bussiness/updateBuss/${editingBusiness._id}`, formData);
        if (response?.status !== 404) {
          toast({ title: "Business updated successfully", status: "success", duration: 3000 });
          fetchBusiness();
          onClose();
          setEditingBusiness(null);
        } else {
          toast({ title: "Update failed - API not available", status: "error", duration: 3000 });
        }
      } else {
        // Add new business with pending status - no fallback allowed
        const response = await axios.post("/bussiness/registerBuss", formData);
        
        if (response?.status !== 404) {
          toast({ title: "Business added successfully", status: "success", duration: 3000 });
          
          // Get the business ID from response
          const businessId = response?.data?.data?._id || response?.data?.result?._id || response?.data?._id;
          if (businessId) {
            // Mark as pending in local storage
            localStorage.setItem(`pending_business_${businessId}`, 'true');
            // Notify admin pages about new business creation
            window.dispatchEvent(new CustomEvent('newBusinessCreated', { detail: { businessId } }));
          }
          
          fetchBusiness();
          onClose();
          setEditingBusiness(null);
        } else {
          toast({ title: "Add failed - API not available", status: "error", duration: 3000 });
        }
      }
    } catch (error) {
      console.error("Form submission error:", error);
      toast({ title: editingBusiness ? "Update failed" : "Add failed", status: "error", duration: 3000 });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/bussiness/deleteBuss/${selectedBusinessId}`);
      toast({ 
        title: "Business deleted successfully", 
        status: "success", 
        duration: 3000 
      });
      fetchBusiness(); // Refresh the business list
      closeDelete();
      setSelectedBusinessId(null);
    } catch (err) {
      console.error("Error deleting business:", err);
      toast({ 
        title: "Delete failed", 
        status: "error", 
        duration: 3000 
      });
    }
  };

  const columns = useMemo(() => [
    { Header: "#", Cell: ({ row: { index } }) => <Cell text={index + 1} /> },
    { Header: "Business Name", accessor: "name", Cell: ({ value }) => <Cell text={value} bold /> },
    {
      Header: "Address",
      accessor: "address",
      Cell: ({ value }) => (
        <Cell 
          text={value ? `${value.street}, ${value.city}, ${value.state} - ${value.pincode}` : "N/A"} 
        />
      ),
    },
    { Header: "Location", accessor: "location", Cell: ({ value }) => <Cell text={value} /> },
    {
      Header: "Created At",
      accessor: "createdAt",
      Cell: ({ value }) => <Cell text={dayjs(value).format("D MMM, YYYY h:mm A")} />,
    },
    {
      Header: "Actions",
      Cell: ({ row: { original } }) => (
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
              setSelectedBusinessId(original._id);
              openDelete();
            }}>
              <MdDelete className="mr-2" /> Delete
            </MenuItem>
          </MenuList>
        </Menu>
      ),
    },
  ], []);

  // Filter businesses based on search and status (only show approved businesses)
  const filteredBusinesses = useMemo(() => {
    // First filter out pending businesses - only show approved/denied businesses
    const approvedBusinesses = businesses.filter(business => {
      const status = business.status || 'pending';
      return status !== 'pending';
    });
    
    if (!search.trim()) return approvedBusinesses;
    
    return approvedBusinesses.filter((business) => {
      const searchTerm = search.toLowerCase();
      const businessName = (business.name || "").toLowerCase();
      const businessLocation = (business.location || "").toLowerCase();
      const businessAddress = business.address ? 
        `${business.address.street || ""} ${business.address.city || ""} ${business.address.state || ""} ${business.address.pincode || ""}`.toLowerCase() 
        : "";
      
      return businessName.includes(searchTerm) || 
             businessLocation.includes(searchTerm) || 
             businessAddress.includes(searchTerm);
    });
  }, [businesses, search]);

  return (
    <div className="p-20">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Subcategory Businesses</h1>
      </div>

      {/* Summary Section */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Button colorScheme="green" size="md">
            Total Businesses: {businesses.length}
          </Button>
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
              placeholder="Search businesses by name, location, or address..."
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

      {loading ? (
        <div className="flex justify-center items-center h-32">
          <Atom color="#333" size="medium" />
        </div>
      ) : businesses.length === 0 ? (
        <p className="text-center text-gray-500">No businesses found.</p>
      ) : (
        <Table data={filteredBusinesses} columns={columns} />
      )}

      {/* Business Edit Modal */}
      <Modal
        isOpen={isOpen}
        onClose={() => {
          setEditingBusiness(null);
          onClose();
        }}
        size="4xl"
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent className="rounded-2xl">
          <ModalHeader className="text-xl font-bold">
            {editingBusiness ? "Edit Business" : "Add New Business"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <RegisterBusinessForm
              categories={categories}
              initialData={editingBusiness}
              onSubmit={handleFormSubmit}
              loading={loading}
            />
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        isOpen={isDeleteOpen}
        leastDestructiveRef={cancelRef}
        onClose={closeDelete}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Business
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to delete this business? This action cannot be undone.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={closeDelete}>
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

export default ChildSubcategoryPage;
