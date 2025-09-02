// import React, { useState, useEffect } from "react";
// import {
//   Modal,
//   ModalOverlay,
//   ModalContent,
//   ModalHeader,
//   ModalCloseButton,
//   ModalBody,
//   ModalFooter,
//   FormControl,
//   FormLabel,
//   Input,
//   Select,
//   Button,
//   Text,
//   VStack,
//   useToast,
// } from "@chakra-ui/react";
// import axios from "../../axios";

// const EditUserModal = ({ isOpen, onClose, userId, onUserUpdated }) => {
//   const toast = useToast();
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     role: "user",
//   });

//   // Fetch user data when modal opens
//   useEffect(() => {
//     if (isOpen && userId) {
//       fetchUserData();
//     } else if (!isOpen) {
//       // Reset form data when modal closes
//       setFormData({
//         name: "",
//         email: "",
//         phone: "",
//         role: "user",
//       });
//       setError("");
//     }
//   }, [isOpen, userId]);

//   const fetchUserData = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get(`/users/${userId}`);
//       console.log(response)
//       if (response?.data?.result) {
//         const userData = response.data.result;
//         setFormData({
//           name: userData.name || "",
//           email: userData.email || "",
//           phone: userData.phone || "",
//           role: userData.role || "user",
//         });
//       }
//     } catch (err) {
//       console.error("Error fetching user data:", err);
//       setError("Failed to fetch user data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChange = (e) => {
//     setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//     setError("");
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const { name, email, phone, role } = formData;

//     // Basic validation
//     if (!name || !email || !phone) {
//       setError("Please fill all required fields.");
//       return;
//     }
//     if (!/^\d{10}$/.test(phone)) {
//       setError("Phone number must be 10 digits.");
//       return;
//     }

//     try {
//       setLoading(true);
//       await axios.put(`/users/${userId}`, {
//         name,
//         email,
//         phone,
//         role,
//       });

//       toast({
//         title: "User updated successfully!",
//         description: `${name}'s details have been updated.`,
//         status: "success",
//         duration: 4000,
//         isClosable: true,
//         position: "top",
//       });

//       // Call the callback to refresh the user list
//       if (onUserUpdated) {
//         onUserUpdated();
//       }

//       onClose();
//     } catch (err) {
//       setError(err.response?.data?.message || "Update failed. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
//       <ModalOverlay />
//       <ModalContent borderRadius="2xl" overflow="hidden">
//         <ModalHeader bgGradient="linear(to-r, purple.600, purple.400)" color="white" textAlign="center">
//           Edit User
//         </ModalHeader>
//         <ModalCloseButton color="white" _hover={{ bg: "purple.700" }} />

//         <form onSubmit={handleSubmit}>
//           <ModalBody pt={6} pb={1}>
//             {error && (
//               <Text color="red.500" fontSize="sm" textAlign="center" mb={4}>
//                 {error}
//               </Text>
//             )}

//             <VStack spacing={3} align="stretch">
//               {[
//                 { label: "Name", name: "name", type: "text" },
//                 { label: "Email", name: "email", type: "email" },
//                 { label: "Phone", name: "phone", type: "tel" },
//               ].map(({ label, name, type }) => (
//                 <FormControl key={name} isRequired>
//                   <FormLabel fontSize="sm">{label}</FormLabel>
//                   <Input
//                     name={name}
//                     type={type}
//                     value={formData[name]}
//                     onChange={handleChange}
//                     isDisabled={loading}
//                   />
//                 </FormControl>
//               ))}

//               {/* Role selection */}
//               <FormControl isRequired>
//                 <FormLabel fontSize="sm">Role</FormLabel>
//                 <Select
//                   name="role"
//                   value={formData.role}
//                   onChange={handleChange}
//                   isDisabled={loading}
//                 >
//                   <option value="user">User</option>
//                   <option value="owner">Owner</option>
//                   <option value="admin">Admin</option>
//                 </Select>
//               </FormControl>
//             </VStack>
//           </ModalBody>

//           <ModalFooter pt={2}>
//             <Button variant="ghost" mr={3} onClick={onClose} isDisabled={loading}>
//               Cancel
//             </Button>
//             <Button
//               colorScheme="purple"
//               type="submit"
//               isLoading={loading}
//               loadingText="Updating..."
//             >
//               Update User
//             </Button>
//           </ModalFooter>
//         </form>
//       </ModalContent>
//     </Modal>
//   );
// };

// export default EditUserModal;

import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import axios from "../../axios";

const EditUserModal = ({ isOpen, onClose, userId, onUserUpdated }) => {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "user",
  });

  // Fetch user data when modal opens
  useEffect(() => {
    if (isOpen && userId) {
      fetchUserData();
    } else if (!isOpen) {
      setFormData({ name: "", email: "", phone: "", role: "user" });
      setError("");
    }
  }, [isOpen, userId]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      
      const response = await axios.get("/Users/userDetails");
      const userData = response?.data?.result?.find(u => u._id === userId);

      if (userData) {
        setFormData({
          name: userData.name || "",
          email: userData.email || "",
          phone: userData.phone || "",
          role: userData.role || "user",
        });
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError("Failed to fetch user data");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, phone, role } = formData;

    if (!name || !email || !phone) {
      setError("Please fill all required fields.");
      return;
    }
    if (!/^\d{10}$/.test(phone)) {
      setError("Phone number must be 10 digits.");
      return;
    }

    try {
      setLoading(true);
      
      await axios.put(`/Users/updatedUser/${userId}`, { name, email, phone, role });

      toast({
        title: "User updated successfully!",
        description: `${name}'s details have been updated.`,
        status: "success",
        duration: 4000,
        isClosable: true,
        position: "top",
      });

      if (onUserUpdated) {
        onUserUpdated();
      }
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Update failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
      <ModalOverlay />
      <ModalContent borderRadius="2xl" overflow="hidden">
        <ModalHeader bgGradient="linear(to-r, purple.600, purple.400)" color="white" textAlign="center">
          Edit User
        </ModalHeader>
        <ModalCloseButton color="white" _hover={{ bg: "purple.700" }} />

        <form onSubmit={handleSubmit}>
          <ModalBody pt={6} pb={1}>
            {error && (
              <Text color="red.500" fontSize="sm" textAlign="center" mb={4}>
                {error}
              </Text>
            )}

            <VStack spacing={3} align="stretch">
              {[
                { label: "Name", name: "name", type: "text" },
                { label: "Email", name: "email", type: "email" },
                { label: "Phone", name: "phone", type: "tel" },
              ].map(({ label, name, type }) => (
                <FormControl key={name} isRequired>
                  <FormLabel fontSize="sm">{label}</FormLabel>
                  <Input
                    name={name}
                    type={type}
                    value={formData[name]}
                    onChange={handleChange}
                    isDisabled={loading}
                  />
                </FormControl>
              ))}

              <FormControl isRequired>
                <FormLabel fontSize="sm">Role</FormLabel>
                <Select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  isDisabled={loading}
                >
                  <option value="user">User</option>
                  <option value="owner">Owner</option>
                  <option value="admin">Admin</option>
                </Select>
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter pt={2}>
            <Button variant="ghost" mr={3} onClick={onClose} isDisabled={loading}>
              Cancel
            </Button>
            <Button
              colorScheme="purple"
              type="submit"
              isLoading={loading}
              loadingText="Updating..."
            >
              Update User
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default EditUserModal;
