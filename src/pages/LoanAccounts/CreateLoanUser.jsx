// import React, { useEffect, useState } from "react";
// import axios from "../../axios";
// import {
//   useToast,
//   Modal,
//   ModalOverlay,
//   ModalContent,
//   ModalHeader,
//   ModalBody,
//   ModalCloseButton,
//   Button,
//   ModalFooter,
// } from "@chakra-ui/react";

// const CreateLoanUser = () => {
//   const toast = useToast();
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const initialFormState = {
//     // user_name: "",

//     full_name: "",
//     phone_number: "",
//     monthly_income: "",
//     pan_no: "",
//     aadhar_no: "",
//     address: "",
//     dob: "",
//     officer_id: "",
//     loan_details: {
//       loan_amount: "",
//       principle_amount: 0,
//       file_charge: 500,
//       interest_rate: "",
//       duration_months: 4,
//       emi_day: 0,
//       total_amount: 0,
//       total_interest_pay: 0,
//       total_penalty_amount: 0,
//       total_due_amount: 0,

//     },
//   };

//   const fieldLabels = {
//     // user_name: "Username",

//     full_name: "Full Name",
//     phone_number: "Phone Number",
//     dob: "Date of Birth",
//     address: "Address",
//     aadhar_no: "Aadhar Number",
//     pan_no: "PAN Number",
//     monthly_income: "Monthly Income",
//   };

//   const [formData, setFormData] = useState(initialFormState);
//   const [officerData, setOfficerData] = useState([]);

//   useEffect(() => {
//     async function fetchData() {
//       axios.get("officers").then((response) => {
//         console.log(response?.data);
//         if (response?.data) {
//           setOfficerData(response?.data?.result);
//         }
//       });
//     }
//     fetchData();
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   const handleloan_detailsChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => {
//       let updatedloan_details = { ...prevData.loan_details, [name]: value };

//       if (name === "loan_amount" || name === "interest_rate") {
//         const loan_amount = parseFloat(updatedloan_details.loan_amount) || 0;
//         const interest_rate =
//           parseFloat(updatedloan_details.interest_rate) || 0;
//         const file_charge = 500;
//         const duration_months = 4;
//         const principle_amount = loan_amount - file_charge;
//         const total_interest_pay =
//           (loan_amount * interest_rate * duration_months) / 100;
//         const total_amount = loan_amount + total_interest_pay;
//         const emi_day = total_amount / (duration_months * 30);

//         updatedloan_details = {
//           ...updatedloan_details,
//           principle_amount,
//           total_interest_pay: total_interest_pay.toFixed(2),
//           total_amount: total_amount.toFixed(2),
//           emi_day: Math.ceil(emi_day),
//           file_charge:file_charge ,

//         };
//       }
//       return {
//         ...prevData,
//         loan_details: updatedloan_details,
//       };
//     });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log(formData);
//     formData.password=formData.phone_number
//     axios.post('admins/createUser', formData)
//     .then((res) => {
//         if (res.data) {
//             toast({
//                 title: "Success! Contest Added successfully",
//                 status: "success",
//                 duration: 4000,
//                 isClosable: true,
//                 position: "top"
//             });
//             window.location.reload();
//         }
//     })
//     .catch((err) => {
//         toast({
//             title: "Something Went Wrong!",
//             status: "error",
//             duration: 4000,
//             isClosable: true,
//             position: "top"
//         });
//     });
//   };

//   return (
//     <div className="m-6 py-8">
//       <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6">
//         <h3 className="text-xl font-bold text-purple mb-4">
//           Create Loan Customer
//         </h3>

//         <h4 className="text-lg font-bold mt-6">Loan Details</h4>
//         <div className=" grid grid-cols-3 gap-4 mt-2 text-start">
//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Loan Amount
//             </label>
//             <input
//               className="mt-1 block w-2/3 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//               name="loan_amount"
//               value={formData.loan_details.loan_amount}
//               type="text"
//               // required
//               onChange={handleloan_detailsChange}
//               placeholder="Loan Amount"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Interest Rate
//             </label>
//             <input
//               className="mt-1 block w-2/3 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//               name="interest_rate"
//               value={formData.loan_details.interest_rate}
//               type="text"
//               // required
//               onChange={handleloan_detailsChange}
//               placeholder="Intrest Rate"
//             />
//           </div>
//           <div className=" mt-4">
//           <Button colorScheme="blue" onClick={() => setIsModalOpen(true)}>
//             Generate Details
//           </Button>
//         </div>
//         </div>
//         <br />
//   <hr />


//         <h4 className="text-lg font-bold mt-6">Personal Details</h4>
//         <div className=" grid grid-cols-3 gap-4 text-start">
//           {Object.keys(fieldLabels).map((key) => (
//             <div key={key} className="">
//               <label className="block text-sm font-medium text-gray-700">
//                 {fieldLabels[key]}
//               </label>
//               <input
//                 className="mt-1 block w-2/3 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//                 name={key}
//                 value={formData[key]}
//                 type="text"
//                 // required
//                 onChange={handleChange}
//                 placeholder={fieldLabels[key]}
//               />
//             </div>
//           ))}
//           <div className="grid grid-cols-1 ">
//             <label className=" text-sm font-medium text-gray-700">
//               {"Select Officers"}
//             </label>
//             <select
//               name="officer_id"
//               // value={formData?.loan_details?.officer || ""}
//               onChange={handleChange}
//               className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//             >
//               <option value="">Select Officer</option>
//               {officerData?.map((el) => (
//                 <option value={el?._id}>{el?.name}</option>
//               ))}
//             </select>
//           </div>
//         </div>

//         <div className="flex justify-end mt-6">
//           <button
//             type="submit"
//             className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none"
//           >
//             Submit Loan User
//           </button>
//         </div>
//       </form>

//       {/* Modal for Loan Details */}
//       <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
//         <ModalOverlay />
//         <ModalContent>
//           <ModalHeader>Loan Calculation Details</ModalHeader>
//           <ModalCloseButton />
//           <ModalBody>
//             <p>
//               <strong>Loan Amount:</strong> {formData.loan_details.loan_amount}
//             </p>
//             <p>
//               <strong>Interest Rate:</strong>{" "}
//               {formData.loan_details.interest_rate}%
//             </p>
//             <p>
//               <strong>Principle Amount:</strong>{" "}
//               {formData.loan_details.principle_amount}
//             </p>
//             <p>
//               <strong>File Charge:</strong> {formData.loan_details.file_charge}
//             </p>
//             <p>
//               <strong>Total Interest Payable:</strong>{" "}
//               {formData.loan_details.totalIntrestPay}
//             </p>
//             <p>
//               <strong>Total Amount:</strong>{" "}
//               {formData.loan_details.total_amount}
//             </p>
//             <p>
//               <strong>Daily EMI:</strong> {formData.loan_details.emi_day}
//             </p>
//           </ModalBody>
//           <ModalFooter display={"flex"} gap={"10px"}>
//             <Button onClick={() => setIsModalOpen(false)} colorScheme="red">
//               Cancel
//             </Button>
//             <Button onClick={() => setIsModalOpen(false)} colorScheme="green">
//               OK
//             </Button>
//           </ModalFooter>
//         </ModalContent>
//       </Modal>
//     </div>
//   );
// };

// export default CreateLoanUser;

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
import { useState } from "react";
import axios from "../../axios";

/**
 * CreateLoanUser – registration‑only modal (login removed).
 * Allows role selection (user / owner) as requested.
 */
const CreateLoanUser = ({ isOpen, onClose }) => {
  const toast = useToast();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "user", // default role
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, phone, password, confirmPassword, role } = formData;

    // basic validation
    if (!name || !email || !phone || !password || !confirmPassword) {
      setError("Please fill all fields.");
      return;
    }
    if (!/^\d{10}$/.test(phone)) {
      setError("Phone number must be 10 digits.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      await axios.post("/Users/createUser", {
        name,
        email,
        phone,
        password,
        role,
        owner: role === "owner" ? name : "",
      });

      toast({
        title: "User registered!",
        description: `${name} added as ${role}.`,
        status: "success",
        duration: 4000,
        isClosable: true,
        position: "top",
      })

      // reset & close
      setFormData({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        role: "user",
      });
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
      <ModalOverlay />
      <ModalContent borderRadius="2xl" overflow="hidden">
        <ModalHeader bgGradient="linear(to-r, purple.600, purple.400)" color="white" textAlign="center">
          Register User
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
                { label: "Password", name: "password", type: "password" },
                {
                  label: "Confirm Password",
                  name: "confirmPassword",
                  type: "password",
                },
              ].map(({ label, name, type }) => (
                <FormControl key={name} isRequired>
                  <FormLabel fontSize="sm">{label}</FormLabel>
                  <Input
                    name={name}
                    type={type}
                    value={formData[name]}
                    onChange={handleChange}
                  />
                </FormControl>
              ))}

              {/* Role selection */}
              <FormControl isRequired>
                <FormLabel fontSize="sm">Role</FormLabel>
                <Select name="role" value={formData.role} onChange={handleChange}>
                  <option value="user">User</option>
                  <option value="owner">Owner</option>
                </Select>
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="outline" mr={3} onClick={onClose} isDisabled={loading}>
              Cancel
            </Button>
            <Button
              type="submit"
              colorScheme="purple"
              isLoading={loading}
              loadingText="Registering"
            >
              Register
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default CreateLoanUser;


