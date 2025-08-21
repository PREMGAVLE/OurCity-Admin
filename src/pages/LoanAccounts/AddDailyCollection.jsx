import React, { useEffect, useState } from "react";
import axios from "../../axios";
import {
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  ModalFooter,
  Menu,
  MenuButton,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";

const AddDailyCollection = () => {

    const {id}=useParams()
  const toast = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const initialFormState = {
    collected_officer_code: "1100",
    amount:"",
    addPenaltyFlag: false,
  };

  const [formData, setFormData] = useState(initialFormState);
  const [userData, setOfficerData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      axios.get(`users/${id}`).then((response) => {
        if (response?.data) {
          setOfficerData(response?.data?.result);
        }
      });
    }
    fetchData();
  }, []);



  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);

    axios
      .post(`dailyCollections/byAdmin/${id}`, formData)
      .then((res) => {
        if (res.data) {
          toast({
            title: "Success! Collection Added Successfully",
            status: "success",
            duration: 4000,
            isClosable: true,
            position: "top",
          });
          window.location.reload();
        }
      })
      .catch((err) => {
        toast({
          title: "Something Went Wrong!",
          status: "error",
          duration: 4000,
          isClosable: true,
          position: "top",
        });
      });
  };

  return (
    <div className="m-6 py-12">

<div className="flex flex-col  gap-4 py-4 ">
              <div className="w-full flex gap-4 justify-end ">
                <Menu className="">
                  <MenuButton
                    as={Button}
                    colorScheme="#FF782D"
                    zIndex={20}
                    className="bg-bgBlue"
                  >
                    Total Loan {userData?.active_loan_id?.loan_amount} Rs.
                  </MenuButton>
                  <MenuButton
                    as={Button}
                    colorScheme="#FF782D"
                    zIndex={20}
                    className="bg-bgBlue"
                  >
                    Total Due Amount {userData?.active_loan_id?.total_due_amount} Rs.
                  </MenuButton>
                  <MenuButton
                    as={Button}
                    colorScheme="#FF782D"
                    zIndex={20}
                    className="bg-bgBlue"
                  >
                    Total Penalty {userData?.active_loan_id?.total_penalty_amount} Rs.
                  </MenuButton>
                </Menu>
              </div>

              <div className="w-full flex  gap-4 justify-end ">
                <Menu>
                  <MenuButton
                    as={Button}
                    colorScheme="#FF782D"
                    zIndex={20}
                    className="bg-bgBlue"
                  >
                    Emi Amount {userData?.active_loan_id?.emi_day} Rs.
                  </MenuButton>
                 
 
                </Menu>
              </div>
            </div>
      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6">
        <h3 className="text-xl font-bold text-purple mb-4">
          Add Daily Collecion
        </h3>

        <div className="grid grid-cols-2 gap-4 mt-2 text-start">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Collected Officer Code
            </label>
            <input
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              name="collected_officer_code"
              value={formData.collected_officer_code}
              type="text"
              onChange={handleChange}
              placeholder="Officer Code"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Amount
            </label>
            <input
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              name="amount"
              value={formData.amount}
              type="number"
              onChange={handleChange}
              placeholder="Amount"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="addPenaltyFlag"
              checked={formData.addPenaltyFlag}
              onChange={(e) =>
                setFormData((prevData) => ({
                  ...prevData,
                  addPenaltyFlag: e.target.checked,
                }))
              }
            />
            <label className="ml-2 text-sm font-medium text-gray-700">
              Add Penalty
            </label>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none"
          >
            Submit Collection
          </button>
        </div>
      </form>

      {/* Modal for Confirmation */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Collection</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <p>
              <strong>Collected Officer Code:</strong>{" "}
              {formData.collected_officer_code}
            </p>
            <p>
              <strong>Amount:</strong> {formData.amount}
            </p>
            <p>
              <strong>Penalty Applied:</strong>{" "}
              {formData.addPenaltyFlag ? "Yes" : "No"}
            </p>
          </ModalBody>
          <ModalFooter>
            <Button onClick={() => setIsModalOpen(false)} colorScheme="red">
              Cancel
            </Button>
            <Button onClick={() => setIsModalOpen(false)} colorScheme="green">
              OK
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default AddDailyCollection;
