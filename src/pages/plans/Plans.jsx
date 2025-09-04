import React, { useEffect, useState, useMemo, useRef } from "react";
import axios from "../../axios";
import Table from "../../componant/Table/Table";
import Cell from "../../componant/Table/cell";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  InputGroup,
  InputLeftElement,
  Input,
  InputRightAddon,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerFooter,
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
  Select,
} from "@chakra-ui/react";
import { MdEdit, MdDelete, MdSearch } from "react-icons/md";

const Plans = () => {
  const [plans, setPlans] = useState([]);
  const [form, setForm] = useState({ title: "", price: "", type: "Basic", validity: "Monthly", features: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [editingId, setEditingId] = useState(null);
  const [selectedPlanId, setSelectedPlanId] = useState(null);

  const toast = useToast();
  const btnRef = useRef();
  const cancelRef = useRef();

  const { isOpen: isDrawerOpen, onOpen: openDrawer, onClose: closeDrawer } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: openDelete, onClose: closeDelete } = useDisclosure();

  const fetchPlans = async () => {
    try {
      const res = await axios.get("/plan/GetAllPlans");
      console.log(res)
      setPlans(res.data.result || []);
      // console.log("plans",res.data.result)
    } catch (err) {
      console.error("Error fetching plans", err);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name: form.title.trim(), // backend ke liye 'name'
      price: Number(form.price),
      type: form.type,
      validity: form.validity,
      features: form.features.split(",").map(f => f.trim()),
    };

    try {
      if (editingId) {
        await axios.put(`/plan/UpdatePlan/${editingId}`, payload);
        toast({ title: "Plan updated successfully", status: "success", duration: 3000 });
      } else {
        await axios.post("/plan/CreatePlan", payload);
        toast({ title: "Plan created successfully", status: "success", duration: 3000 });
      }

      setForm({ title: "", price: "", type: "Basic", validity: "Monthly", features: "" });
      setEditingId(null);
      closeDrawer();
      fetchPlans();
    } catch (err) {
      console.error("Create/Update Plan Error:", err.response?.data || err.message);
      toast({
        title: "Action failed",
        description: err.response?.data?.message || "Something went wrong",
        status: "error",
        duration: 4000,
      });
    }
  };

  const handleEdit = (plan) => {
    setForm({
      title: plan.name || "", // editing form input
      price: plan.price || "",
      type: plan.type || "Basic",
      validity: plan.validity || "Monthly",
      features: Array.isArray(plan.features) ? plan.features.join(", ") : "",
    });
    setEditingId(plan._id);
    openDrawer();
  };



  const handleDelete = async () => {
    try {
      await axios.delete(`/plan/DeletePlan/${selectedPlanId}`);
      toast({ title: "Plan deleted.", status: "success", duration: 3000 });
      fetchPlans();
      closeDelete();
    } catch (err) {
      toast({ title: "Delete failed.", status: "error", duration: 3000 });
    }
  };

  const columns = useMemo(() => [
    {
      Header: "Sr No.",
      accessor: "srNo",
      Cell: ({ row: { index } }) => <Cell text={index + 1} />,
    },
    {
      Header: "Title",
      accessor: "name",
      Cell: ({ value }) => <Cell text={value} bold="bold" />,
    },
    {
      Header: "Price",
      accessor: "price",
      Cell: ({ value }) => <Cell text={`₹${value}`} />,
    },
    {
      Header: "Type",
      accessor: "type",
      Cell: ({ value }) => <Cell text={value || ""} />,
    },
    {
      Header: "Validity",
      accessor: "validity",
      Cell: ({ value }) => <Cell text={value || ""} />,
    },
    {
      Header: "Features",
      accessor: "features",
      Cell: ({ value }) => <Cell text={value?.join(", ")} />,
    },
    {
      Header: "Action",
      Cell: ({ row: { original } }) => (
        <Menu>
          <MenuButton as={Button} colorScheme="purple">Actions</MenuButton>
          <MenuList>
            <MenuItem onClick={() => handleEdit(original)}><MdEdit className="mr-4" /> Edit</MenuItem>
            <MenuItem onClick={() => { setSelectedPlanId(original._id); openDelete(); }}>
              <MdDelete className="mr-4" /> Delete
            </MenuItem>
          </MenuList>
        </Menu>
      ),
    },
  ], []);

  const filteredPlans = useMemo(() => {
    let filtered = Array.isArray(plans) ? plans : [];
    
    // Apply validity filter
    if (filterType !== "all") {
      filtered = filtered.filter((plan) => {
        const planValidity = plan.validity ? plan.validity.trim() : "";
        const selectedFilterType = filterType ? filterType.trim() : "";
        return planValidity === selectedFilterType;
      });
    }
    
    // Apply search filter
    if (searchTerm.trim()) {
      filtered = filtered.filter((plan) =>
        (plan.name || "").toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  }, [plans, filterType, searchTerm]);

  return (
    <div className="py-20 bg-bgWhite">
      <section className="md:p-4">
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2 items-center">
            <Button colorScheme="green" variant="solid">
              Total Plans: {(plans || []).length}
            </Button>
            <Button ref={btnRef} colorScheme="purple" onClick={openDrawer}>Add New Plan</Button>
          </div>
          <div className="flex gap-4 items-center">
            {/* Filter Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Validity:</span>
                            <Select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                size="sm"
                width="120px"
                border="1px solid #949494"
                _hover={{ borderColor: "gray.300" }}
                _focus={{ borderColor: "blue.500", boxShadow: "outline" }}
              >
                <option value="all">All</option>
                <option value="Monthly">Monthly</option>
                <option value="Yearly">Yearly</option>
              </Select>
            </div>
            
            {/* Search Input */}
            <div className="w-80">
              <InputGroup size="md">
                <InputLeftElement pointerEvents="none">
                  <MdSearch color="gray.400" />
                </InputLeftElement>
                <Input
                  placeholder="Search by title..."
                  border="1px solid #949494"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
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
        </div>

        <Table data={filteredPlans} columns={columns} />
      </section>

      {/* Drawer for Create/Edit */}
      <Drawer isOpen={isDrawerOpen} placement="right" onClose={closeDrawer} finalFocusRef={btnRef}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>{editingId ? "Edit Plan" : "Create Plan"}</DrawerHeader>
          <DrawerBody>
            <Input
              placeholder="Title (e.g., Basic, Standard, Premium)"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="mb-4"
            />
            <Input
              placeholder="Price"
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="mb-4"
            />
            <Select
              placeholder="Type"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="mb-4"
            >
              <option value="Basic">Basic</option>
              <option value="Standard">Standard</option>
              <option value="Premium">Premium</option>
            </Select>
            <Select
              placeholder="Validity"
              value={form.validity}
              onChange={(e) => setForm({ ...form, validity: e.target.value })}
              className="mb-4"
            >
              <option value="Monthly">Monthly</option>
              <option value="Yearly">Yearly</option>
            </Select>
            <Input
              placeholder="Features (comma separated)"
              value={form.features}
              onChange={(e) => setForm({ ...form, features: e.target.value })}
            />
          </DrawerBody>
          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={closeDrawer}>Cancel</Button>
            <Button colorScheme="blue" onClick={handleSubmit}>
              {editingId ? "Update" : "Create"}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      {/* Delete Dialog */}
      <AlertDialog isOpen={isDeleteOpen} leastDestructiveRef={cancelRef} onClose={closeDelete}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">Delete Plan</AlertDialogHeader>
            <AlertDialogBody>Are you sure you want to delete this plan?</AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={closeDelete}>Cancel</Button>
              <Button colorScheme="red" onClick={handleDelete} ml={3}>Delete</Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </div>
  );
};

export default Plans;
