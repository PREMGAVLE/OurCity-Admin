import React, { useState } from "react";
import axios from "../../axios";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Select,
  VStack,
  HStack,
  useToast,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Box,
  Text,
  Divider,
} from "@chakra-ui/react";

const AddProductModal = ({ isOpen, onClose, businessId, businessName, onProductAdded }) => {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
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

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price) || 0,
        offerPrice: parseFloat(formData.offerPrice) || 0,
        quantity: formData.quantity.toString(),
        feature: formData.feature ? formData.feature.split(",").map(f => f.trim()).filter(f => f) : [],
      };

      const response = await axios.post(`/product/createproduct`, {
        ...productData,
        bussinessId: businessId
      });
      
      if (response.status === 200 || response.status === 201) {
        toast({
          title: "Product added successfully!",
          description: "Your product has been created and is pending admin approval.",
          status: "success",
          duration: 5000,
        });
        
        // Reset form
        setFormData({
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
        
        // Notify parent component to refresh data
        if (onProductAdded) {
          onProductAdded();
        }
        
        onClose();
      } else {
        throw new Error(`API returned status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error adding product:", error);
      toast({
        title: "Error adding product",
        description: error.response?.data?.message || "Please try again.",
        status: "error",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    // Reset form when closing
    setFormData({
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
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="xl">
      <ModalOverlay />
      <ModalContent maxW="800px">
        <ModalHeader>Add New Product</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {/* Business Info Alert */}
          <Alert status="info" mb={4}>
            <AlertIcon />
            <Box>
              <AlertTitle>Business Information</AlertTitle>
              <AlertDescription>
                Adding product for: <strong>{businessName}</strong>
              </AlertDescription>
            </Box>
          </Alert>

          <form onSubmit={handleSubmit}>
            <VStack spacing={4} align="stretch">
              {/* Basic Information */}
              <Box>
                <Text fontSize="md" fontWeight="bold" mb={2}>Basic Information</Text>
                <Divider mb={3} />
                
                <HStack spacing={3} mb={3}>
                  <FormControl isRequired>
                    <FormLabel fontSize="sm">Product Name</FormLabel>
                    <Input
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="Enter product name"
                      size="sm"
                    />
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel fontSize="sm">Brand</FormLabel>
                    <Input
                      value={formData.brand}
                      onChange={(e) => handleInputChange("brand", e.target.value)}
                      placeholder="Enter brand name"
                      size="sm"
                    />
                  </FormControl>
                </HStack>

                <FormControl isRequired mb={3}>
                  <FormLabel fontSize="sm">Description</FormLabel>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Enter product description"
                    rows={2}
                    size="sm"
                  />
                </FormControl>

                <FormControl mb={3}>
                  <FormLabel fontSize="sm">Speciality</FormLabel>
                  <Input
                    value={formData.speciality}
                    onChange={(e) => handleInputChange("speciality", e.target.value)}
                    placeholder="Enter product speciality"
                    size="sm"
                  />
                </FormControl>
              </Box>

              {/* Pricing Information */}
              <Box>
                <Text fontSize="md" fontWeight="bold" mb={2}>Pricing Information</Text>
                <Divider mb={3} />
                
                <HStack spacing={3} mb={3}>
                  <FormControl isRequired>
                    <FormLabel fontSize="sm">Price (₹)</FormLabel>
                    <NumberInput
                      value={formData.price}
                      onChange={(value) => handleInputChange("price", value)}
                      min={0}
                      precision={2}
                      size="sm"
                    >
                      <NumberInputField placeholder="0.00" />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel fontSize="sm">Offer Price (₹)</FormLabel>
                    <NumberInput
                      value={formData.offerPrice}
                      onChange={(value) => handleInputChange("offerPrice", value)}
                      min={0}
                      precision={2}
                      size="sm"
                    >
                      <NumberInputField placeholder="0.00" />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>
                </HStack>

                <HStack spacing={3} mb={3}>
                  <FormControl isRequired>
                    <FormLabel fontSize="sm">Quantity</FormLabel>
                    <NumberInput
                      value={formData.quantity}
                      onChange={(value) => handleInputChange("quantity", value)}
                      min={0}
                      size="sm"
                    >
                      <NumberInputField placeholder="0" />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel fontSize="sm">Status</FormLabel>
                    <Select
                      value={formData.status}
                      onChange={(e) => handleInputChange("status", e.target.value)}
                      size="sm"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </Select>
                  </FormControl>
                </HStack>
              </Box>

              {/* Features */}
              <Box>
                <Text fontSize="md" fontWeight="bold" mb={2}>Product Features</Text>
                <Divider mb={3} />
                
                <FormControl>
                  <FormLabel fontSize="sm">Features (comma-separated)</FormLabel>
                  <Textarea
                    value={formData.feature}
                    onChange={(e) => handleInputChange("feature", e.target.value)}
                    placeholder="Enter features separated by commas (e.g., Waterproof, Durable, Lightweight)"
                    rows={2}
                    size="sm"
                  />
                </FormControl>
              </Box>
            </VStack>
          </form>
        </ModalBody>

        <ModalFooter>
          <Button variant="outline" mr={3} onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            colorScheme="purple"
            onClick={handleSubmit}
            isLoading={loading}
            loadingText="Adding Product..."
          >
            Add Product
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddProductModal;
