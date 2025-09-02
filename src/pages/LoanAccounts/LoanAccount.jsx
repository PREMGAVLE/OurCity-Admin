import React, { useEffect, useState, useMemo, useRef } from "react";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import axios from "../../axios";
import Table from "../../componant/Table/Table";
import Cell from "../../componant/Table/cell";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  InputGroup,
  Input,
  Button,
  InputRightAddon,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  useToast,
  Box,
} from "@chakra-ui/react";
import { MdEdit, MdDelete } from "react-icons/md";
import { HiStatusOnline } from "react-icons/hi";
import CreateLoanUser from "./CreateLoanUser";
import RegisterBusinessForm from "../buisnesspart/buisnessComponents/RegisterBusinessForm";
import EditUserModal from "./EditUserModal";

function UserManagement() {
  const [data, setData] = useState([]);
  const [userBusinesses, setUserBusinesses] = useState({});
  const [selectedUserIdForBusiness, setSelectedUserIdForBusiness] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  const [isBusinessFormOpen, setIsBusinessFormOpen] = useState(false);
  const [selectedUserIdForEdit, setSelectedUserIdForEdit] = useState(null);
  const toast = useToast();
  const navigate = useNavigate();

  const { isOpen: isAlertOpen, onOpen: openAlert, onClose: closeAlert } = useDisclosure();
  const { isOpen: isCreateOpen, onOpen: openCreate, onClose: closeCreate } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: openEdit, onClose: closeEdit } = useDisclosure();
  const cancelRef = useRef();

  // 🔹 Fetch users + businesses on mount
  useEffect(() => {
    (async () => {
      try {
        const { data: res } = await axios.get("/Users/userDetails");

        if (res?.result) {
          setData(res.result);

          const resultMap = {};
          await Promise.all(
            res.result.map(async (u) => {
              try {
                const { data: bizRes } = await axios.get(`/bussiness/getBussById/${u._id}`);
                resultMap[u._id] = bizRes.result || [];
              } catch {
                resultMap[u._id] = [];
              }
            })
          );
          setUserBusinesses(resultMap);
        }
      } catch (err) {
        console.error(err);
      }
    })();

    axios.get("/category/getCategory").then(({ data }) => setCategories(data.data || []));
  }, []);

  // 🔹 Delete user by id
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/Users/deleteUser/${id}`);
      toast({
        title: "User deleted successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setData((d) => d.filter((u) => u._id !== id));
    } catch (err) {
      toast({
        title: "Error deleting user",
        description: err.response?.data?.message || "Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
    closeAlert();
  };

  // 🔹 Refresh users after update
  const handleUserUpdated = async () => {
    try {
      const { data: res } = await axios.get("/Users/userDetails");
      if (res?.result) setData(res.result);
    } catch (err) {
      console.error("Error refreshing user data:", err);
    }
  };

  // 🔹 Table Columns
  const columns = useMemo(() => [
    { Header: "#", Cell: ({ row: { index } }) => <Cell text={index + 1} /> },
    { Header: "Name", accessor: "name", Cell: ({ value }) => <Cell text={value} bold /> },
    { Header: "Email", accessor: "email", Cell: ({ value }) => <Cell text={value} bold /> },
    { Header: "Phone", accessor: "phone", Cell: ({ value }) => <Cell text={value} /> },
    { Header: "Role", accessor: "role", Cell: ({ value }) => <Cell text={value} /> },
    {
      Header: "Registered",
      accessor: "createdAt",
      Cell: ({ value }) => <Cell text={dayjs(value).format("D MMM, YYYY h:mm A")} />,
    },
    {
      Header: "Action",
      Cell: ({ row: { original } }) => {
        const hasBusiness = userBusinesses[original._id]?.length > 0;

        return (
          <Menu>
            <MenuButton as={Button} colorScheme="purple">Actions</MenuButton>
            <MenuList>
              {hasBusiness ? (
                <MenuItem
          onClick={() => {
            // ✅ Navigate to UserBusiness page
            navigate(`/dash/userbus/${original._id}`);
          }}
        >
          <HiStatusOnline /> View Business
        </MenuItem>

              ) : (
                <MenuItem onClick={() => { setSelectedUserIdForBusiness(original._id); setIsBusinessFormOpen(true); }}>
                  <HiStatusOnline /> Add Business
                </MenuItem>
              )}
              <MenuItem onClick={() => { setSelectedUserIdForEdit(original._id); openEdit(); }}>
                <MdEdit /> Edit
              </MenuItem>
              <MenuItem onClick={() => { setSelectedUserIdForBusiness(original._id); openAlert(); }}>
                <MdDelete /> Delete
              </MenuItem>
            </MenuList>
          </Menu>
        );
      },
    },
  ], [userBusinesses]);

  return (
    <div className="py-20">
      {/* 🔹 Top Bar */}
      <div className="flex justify-between mb-4">
        <div className="flex gap-2 items-center">
          <Button colorScheme="green" variant="solid">
            Total Users: {(data || []).length}
          </Button>
          <Button colorScheme="purple" onClick={openCreate}>Add New User</Button>
        </div>
        <InputGroup w="300px">
          <Input
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <InputRightAddon>
            <Button colorScheme="green">Search</Button>
          </InputRightAddon>
        </InputGroup>
      </div>

      {/* 🔹 User Table */}
      <Table
        data={data.filter((u) =>
          [u.name, u.email, u.phone].some((f) => f?.toLowerCase().includes(searchTerm.toLowerCase()))
        )}
        columns={columns}
      />

      {/* 🔹 Delete Confirmation */}
      <AlertDialog isOpen={isAlertOpen} leastDestructiveRef={cancelRef} onClose={closeAlert} isCentered>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>Delete User?</AlertDialogHeader>
            <AlertDialogBody>Are you sure you want to delete this user?</AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={closeAlert}>Cancel</Button>
              <Button colorScheme="red" onClick={() => handleDelete(selectedUserIdForBusiness)}>Delete</Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      {/* 🔹 Create & Edit User */}
      <CreateLoanUser isOpen={isCreateOpen} onClose={closeCreate} />
      <EditUserModal isOpen={isEditOpen} onClose={closeEdit} userId={selectedUserIdForEdit} onUserUpdated={handleUserUpdated} />

      {/* 🔹 Business Drawer */}
      <Drawer isOpen={isBusinessFormOpen} placement="right" onClose={() => setIsBusinessFormOpen(false)} size="md">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            {userBusinesses[selectedUserIdForBusiness]?.length > 0 ? "View Business" : "Add Business"}
          </DrawerHeader>
          <DrawerBody>
  {userBusinesses[selectedUserIdForBusiness]?.length > 0 ? (
    userBusinesses[selectedUserIdForBusiness].map((biz, idx) => (
      <Box key={biz._id || idx} className="mb-4">
        <p><strong>Name:</strong> {biz?.name || "N/A"}</p>
        <p>
          <strong>Category:</strong>{" "}
          {biz?.category ? (typeof biz.category === "object" ? biz.category.name : biz.category) : "N/A"}
        </p>
        <p><strong>Address:</strong> {biz?.location || "N/A"}</p>
      </Box>
    ))
  ) : (
    <RegisterBusinessForm
      categories={categories}
      onSubmit={(businessData) => {
        const payload = { ...businessData, owner: selectedUserIdForBusiness };
        return axios.post("/bussiness/registerBuss", payload).then(() => {
          toast({ title: "Business Registered", status: "success", duration: 3000 });
          setIsBusinessFormOpen(false);
          setUserBusinesses((prev) => ({
            ...prev,
            [selectedUserIdForBusiness]: [payload],
          }));
        });
      }}
    />
  )}


          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </div>
  );
}

export default UserManagement;
