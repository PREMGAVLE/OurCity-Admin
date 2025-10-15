import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../axios";
import dayjs from "dayjs";
import Table from "../../componant/Table/Table";
import Cell from "../../componant/Table/cell";
import {
  Button,
  useToast,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  InputGroup,
  InputLeftElement,
  Input,
  InputRightAddon,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Box,
  Text,
  Badge,
  Stat,
  StatLabel,
  StatNumber,
  SimpleGrid,
} from "@chakra-ui/react";
import { MdDelete, MdEdit, MdSearch } from "react-icons/md";
import { ArrowBackIcon } from "@chakra-ui/icons";

const ViewProducts = () => {
  const { businessId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  
  const [products, setProducts] = useState([]);
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  // Fetch business details
  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const response = await axios.get(`/bussiness/getBussById/${businessId}`);
        
        if (response.data && response.data.result) {
          // If result is an array, find the business by ID
          if (Array.isArray(response.data.result)) {
            const businessData = response.data.result.find(b => b._id === businessId);
            setBusiness(businessData);
          } else {
            // If result is a single object, use it directly
            setBusiness(response.data.result);
          }
        }
      } catch (error) {
        console.error("Error fetching business:", error);
        toast({
          title: "Error fetching business details",
          status: "error",
          duration: 3000,
        });
      }
    };

    if (businessId) {
      fetchBusiness();
    }
  }, [businessId, toast]);

  // Fetch products for the business
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/product/business/${businessId}`);
      
      // Extract products from the API response structure
      const productsData = response?.data?.result?.products || [];
      
      setProducts(productsData);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast({
        title: "Error fetching products",
        description: error.response?.data?.message || "Please try again.",
        status: "error",
        duration: 5000,
      });
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (businessId) {
      fetchProducts();
    }
  }, [businessId]);


  // Handle delete product
  const handleDelete = async (productId) => {
    try {
      await axios.delete(`/product/deleteProduct/${productId}`);
      toast({
        title: "Product deleted successfully",
        status: "success",
      });
      fetchProducts(); // Refresh the list
    } catch (error) {
      console.error("Error deleting product:", error);
      toast({
        title: "Error deleting product",
        status: "error",
      });
    }
  };

  // Handle edit product (navigate to edit page or show modal)
  const handleEdit = (product) => {
    // For now, just show a toast - you can implement edit functionality later
    toast({
      title: "Edit functionality",
      description: "Edit functionality will be implemented in future updates.",
      status: "info",
    });
  };

  // Filter products based on search
  const filteredProducts = useMemo(() => {
    if (!search.trim()) return products;
    
    return products.filter((product) => {
      const searchTerm = search.toLowerCase();
      const productName = (product.name || "").toLowerCase();
      const productBrand = (product.brand || "").toLowerCase();
      const productDescription = (product.description || "").toLowerCase();
      const productSpeciality = (product.speciality || "").toLowerCase();
      
      return productName.includes(searchTerm) || 
             productBrand.includes(searchTerm) || 
             productDescription.includes(searchTerm) ||
             productSpeciality.includes(searchTerm);
    });
  }, [products, search]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalProducts = products.length;
    const activeProducts = products.filter(p => p.status === 'active').length;
    const pendingProducts = products.filter(p => p.approvalStatus === 'pending').length;
    const approvedProducts = products.filter(p => p.approvalStatus === 'approved').length;
    
    return {
      total: totalProducts,
      active: activeProducts,
      pending: pendingProducts,
      approved: approvedProducts
    };
  }, [products]);

  const columns = useMemo(() => [
    { Header: "#", Cell: ({ row: { index } }) => <Cell text={index + 1} /> },
    { 
      Header: "Product Name", 
      accessor: "name", 
      Cell: ({ value }) => <Cell text={value} bold /> 
    },
    { 
      Header: "Description", 
      accessor: "description", 
      Cell: ({ value }) => <Cell text={value || "N/A"} /> 
    },
    { 
      Header: "Price", 
      accessor: "price", 
      Cell: ({ value }) => <Cell text={`₹${value || 0}`} /> 
    },
    { 
      Header: "Offer Price", 
      accessor: "offerPrice", 
      Cell: ({ value }) => <Cell text={value ? `₹${value}` : "N/A"} /> 
    },
    { 
      Header: "Quantity", 
      accessor: "quantity", 
      Cell: ({ value }) => <Cell text={value || 0} /> 
    },
    {
      Header: "Status",
      accessor: "status",
      Cell: ({ value }) => {
        const color = value === 'active' ? 'green' : 'red';
        return (
          <Badge colorScheme={color} variant="solid">
            {value || 'inactive'}
          </Badge>
        );
      },
    },
    {
      Header: "Approval Status",
      accessor: "approvalStatus",
      Cell: ({ value }) => {
        const color = value === 'approved' ? 'green' : value === 'pending' ? 'orange' : 'red';
        return (
          <Badge colorScheme={color} variant="solid">
            {value || 'pending'}
          </Badge>
        );
      },
    },
    {
      Header: "Created At",
      accessor: "createdAt",
      Cell: ({ value }) => <Cell text={dayjs(value).format("D MMM, YYYY")} />,
    },
    {
      Header: "Actions",
      Cell: ({ row: { original } }) => (
        <Menu>
          <MenuButton as={Button} size="sm" colorScheme="purple">
            Actions
          </MenuButton>
          <MenuList>
            <MenuItem onClick={() => handleEdit(original)}>
              <MdEdit className="mr-2" /> Edit
            </MenuItem>
            <MenuItem 
              onClick={() => handleDelete(original._id)}
              color="red.500"
            >
              <MdDelete className="mr-2" /> Delete
            </MenuItem>
          </MenuList>
        </Menu>
      ),
    },
  ], [products]);

  // Remove business loading check - we'll show products regardless
  // The businessId is already available from the URL params

  return (
    <div className="p-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            leftIcon={<ArrowBackIcon />}
            variant="outline"
            onClick={() => navigate(`/dash/userbus/${business?.owner || 'unknown'}`)}
          >
            Back to Business List
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Business Products</h1>
            <Text color="gray.600">Business: {business?.name || `ID: ${businessId}`}</Text>
          </div>
        </div>
      </div>

      {/* Business Info Alert */}
      {business && (
        <Alert status="info" mb={6}>
          <AlertIcon />
          <Box>
            <AlertTitle>Business Information</AlertTitle>
            <AlertDescription>
              Viewing products for: <strong>{business.name}</strong> - {business.location || 'Location not available'}
            </AlertDescription>
          </Box>
        </Alert>
      )}

      {/* Statistics */}
      <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4} mb={6}>
        <Box bg="white" p={4} borderRadius="lg" shadow="sm" border="1px" borderColor="gray.200">
          <Stat>
            <StatLabel>Total Products</StatLabel>
            <StatNumber>{stats.total}</StatNumber>
          </Stat>
        </Box>
        <Box bg="white" p={4} borderRadius="lg" shadow="sm" border="1px" borderColor="gray.200">
          <Stat>
            <StatLabel>Active Products</StatLabel>
            <StatNumber color="green.500">{stats.active}</StatNumber>
          </Stat>
        </Box>
        <Box bg="white" p={4} borderRadius="lg" shadow="sm" border="1px" borderColor="gray.200">
          <Stat>
            <StatLabel>Pending Approval</StatLabel>
            <StatNumber color="orange.500">{stats.pending}</StatNumber>
          </Stat>
        </Box>
        <Box bg="white" p={4} borderRadius="lg" shadow="sm" border="1px" borderColor="gray.200">
          <Stat>
            <StatLabel>Approved</StatLabel>
            <StatNumber color="blue.500">{stats.approved}</StatNumber>
          </Stat>
        </Box>
      </SimpleGrid>

      {/* Search and Actions */}
      <div className="flex justify-between items-center mb-6">
        <div className="w-96">
          <InputGroup size="md">
            <InputLeftElement pointerEvents="none">
              <MdSearch color="gray.400" />
            </InputLeftElement>
            <Input
              placeholder="Search products by name, brand, description..."
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


      {/* Products Table */}
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Text>Loading products...</Text>
        </div>
      ) : filteredProducts.length === 0 ? (
        <Box bg="white" p={8} borderRadius="lg" shadow="sm" border="1px" borderColor="gray.200" textAlign="center">
          <Text fontSize="lg" color="gray.500" mb={4}>
            {products.length === 0 ? "No products found for this business." : "No products match your search criteria."}
          </Text>
        </Box>
      ) : (
        <Table data={filteredProducts} columns={columns} />
      )}
    </div>
  );
};

export default ViewProducts;
