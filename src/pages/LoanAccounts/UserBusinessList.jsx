import React, { useEffect, useState, useMemo, useRef } from "react";
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
} from "@chakra-ui/react";
import { MdDelete, MdEdit } from "react-icons/md";
import RegisterBusinessForm from "../buisnesspart/buisnessComponents/RegisterBusinessForm";

const UserBusinessList = () => {
  const { userId } = useParams();
  const [businesses, setBusinesses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editingBusiness, setEditingBusiness] = useState(null);
  const [selectedBusinessID, setSelectedBusinessID] = useState(null);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isAlertOpen,
    onOpen: openAlert,
    onClose: closeAlert,
  } = useDisclosure();
  const cancelRef = useRef();

  // Fetch businesses & categories
  const fetchBusinesses = async () => {
    if (userId) {
      try {
        const res = await axios.get(`/bussiness/getBussById/${userId}`);
        setBusinesses(res.data.result || []);
      } catch (err) {
        console.error(err);
      }
    }
  };

  useEffect(() => {
    fetchBusinesses();
    axios.get("/category/getCategory").then((res) => setCategories(res.data.data || []));
  }, [userId]);

  // Handle Create & Update
  const handleFormSubmit = async (formData) => {
    try {
      if (editingBusiness) {
        await axios.put(`/bussiness/updateBuss/${editingBusiness._id}`, formData);
        toast({ title: "Business updated!", status: "success" });
      } else {
        await axios.post("/bussiness/registerBuss", {
          ...formData,
          owner: userId,
        });
        toast({ title: "Business added!", status: "success" });
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

  const columns = useMemo(() => [
    { Header: "#", Cell: ({ row: { index } }) => <Cell text={index + 1} /> },
    { Header: "Business Name", accessor: "name", Cell: ({ value }) => <Cell text={value} bold /> },
    {
      Header: "Category",
      accessor: "category",
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
              setSelectedBusinessID(original._id);
              openAlert();
            }}>
              <MdDelete className="mr-2" /> Delete
            </MenuItem>
          </MenuList>
        </Menu>
      ),
    },
  ], [businesses]);

  return (
    <div className="p-20">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">User’s Businesses</h1>
        <Button colorScheme="blue" onClick={() => { setEditingBusiness(null); onOpen(); }}>
          Add Business
        </Button>
      </div>

      <Table data={businesses} columns={columns} />

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
    </div>
  );
};

export default UserBusinessList;
