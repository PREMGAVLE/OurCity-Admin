import React, { useEffect, useState, useRef } from "react";
import axios from "../../axios";
import {
  Box,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
  useToast,
  Input,
  FormControl,
  FormLabel,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Select,
} from "@chakra-ui/react";

const AdsMain = () => {
  const [ads, setAds] = useState([]);
  const [form, setForm] = useState({
    title: "",
    image: "",
    link: "",
    position: "",
    addType: "",
  });
  const [editId, setEditId] = useState(null);
  const [selectedAdId, setSelectedAdId] = useState(null);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isAlertOpen,
    onOpen: openAlert,
    onClose: closeAlert,
  } = useDisclosure();
  const cancelRef = useRef();

  // const [filterPosition, setFilterPosition] = useState('');
  const [filteredAds, setFilteredAds] = useState([]); // For dropdown
  const [selectedType, setSelectedType] = useState(""); // Filtered ads
  const [selectedPosition, setSelectedPosition] = useState("sidebar");
  // const filteredAds = allAds.filter((ad) => ad.position === selectedPosition);

  const fetchAds = async () => {
    try {
      const res = await axios.get("/advertisements/getAllAdd");
      console.log("Raw Response:", res);

      const adsArray = res.data.result || res.data.data || res.data || [];
      console.log("Fetched Ads: ", adsArray);
      setAds(Array.isArray(adsArray) ? adsArray : []);
      setFilteredAds(Array.isArray(adsArray) ? adsArray : []);
    } catch (err) {
      console.error("Fetch error:", err);
      toast({ title: "Error fetching ads.", status: "error", duration: 3000 });
    }
  };

  useEffect(() => {
    fetchAds();
  }, []);

  useEffect(() => {
    if (selectedType === "") {
      setFilteredAds(ads); // Show all if nothing selected
    } else {
      const filtered = ads.filter((ad) => ad.addType === selectedType);
      setFilteredAds(filtered);
    }
  }, [selectedType, ads]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting form:", form);
    if (!form.position || !form.addType) {
      toast({
        title: "Please select Position and Add Type",
        status: "warning",
      });
      return;
    }

    try {
      if (editId) {
        console.log("Updating ID:", editId);
        await axios.put(`/advertisements/updateAdd/${editId}`, form);
        toast({ title: "Ad updated successfully.", status: "success" });
      } else {
        await axios.post("/advertisements/registerAdd", form);
        toast({ title: "Ad added successfully.", status: "success" });
      }
      setForm({ title: "", image: "", link: "", position: "", addType: "" });
      setEditId(null);
      onClose();
      fetchAds();
    } catch (error) {
      console.error("Submit error:", error);
      toast({ title: "Failed to submit ad.", status: "error" });
    }
  };

  const handleEdit = async (id) => {
    try {
      if (!id) {
        toast({ title: "Invalid ad ID.", status: "error" });
        return;
      }

      console.log("Editing Ad ID:", id);
      const res = await axios.get(`/advertisements/getAddById/${id}`);
      console.log("with id ", res);
      const ad = res.data?.result || res.data?.data || res.data || {};

      console.log("Fetched ad data:", ad);

      if (!ad || !ad._id) {
        toast({ title: "Ad not found.", status: "error" });
        return;
      }

      setForm({
        title: ad.title || "",
        image: ad.image || "",
        link: ad.link || "",
        position: ad.position || "",
        addType: ad.addType || "",
      });
      setEditId(ad._id);
      onOpen();
    } catch (err) {
      console.error("Edit fetch error:", err.response?.data || err.message);
      toast({ title: "Failed to load ad details.", status: "error" });
    }
  };

  const handleDelete = async () => {
    try {
      if (!selectedAdId) {
        toast({ title: "No ad selected to delete.", status: "warning" });
        return;
      }

      console.log("Deleting Ad ID:", selectedAdId);
      const res = await axios.delete(
        `/advertisements/deleteAdd/${selectedAdId}`
      );
      console.log("Delete response:", res.data);

      toast({ title: "Ad deleted successfully.", status: "success" });
      closeAlert();
      fetchAds();
    } catch (err) {
      console.error("Delete error:", err.response?.data || err.message);
      toast({ title: "Failed to delete ad.", status: "error" });
    }
  };

  return (
    <Box mt="150px" p={4}>
      <Box
        mb={4}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
        gap={4}
        flexDirection={{ base: "column", md: "row" }}
      >
        {/* ✅ Left: Total Ads */}
        <Box>
          <Button
            colorScheme="purple"
            fontSize={{ base: "sm", md: "md" }}
            px={{ base: 4, md: 6 }}
            width={{ base: "100%", md: "auto" }}
          >
            Total Ads: {filteredAds.length}
          </Button>
        </Box>

        {/* ✅ Right: Filter + Add Button */}
        <Box
          display="flex"
          flexDirection={{ base: "column", sm: "row" }}
          alignItems={{ base: "stretch", sm: "center" }}
          justifyContent={{ base: "center", sm: "flex-end" }}
          gap={{ base: 3, sm: 4 }}
          width={{ base: "100%", md: "auto" }}
        >
          {/* Filter Dropdown */}
          <FormControl width={{ base: "100%", sm: "200px" }}>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              style={{
                padding: "10px",
                borderRadius: "6px",
                border: "1px solid #ccc",
                width: "100%",
                fontSize: "14px",
              }}
            >
              <option value="">All</option>
              <option value="slider">Slider</option>
              <option value="popUp">Popup</option>
              <option value="product">Products</option>
            </select>
          </FormControl>

          {/* Add Button */}
          <Button
            colorScheme="blue"
            onClick={() => {
              setForm({
                title: "",
                image: "",
                link: "",
                position: "sidebar",
                addType: "slider",
              });
              setEditId(null);
              onOpen();
            }}
            fontSize={{ base: "sm", sm: "md" }}
            px={{ base: 4, sm: 6 }}
            whiteSpace="normal"
            textAlign="center"
            width={{ base: "100%", sm: "auto" }}
          >
            Add New Advertisement
          </Button>
        </Box>
      </Box>

      <Table variant="striped" colorScheme="gray">
        <Thead>
          <Tr>
            <Th>Title</Th>
            <Th>Image</Th>
            <Th>Link</Th>
            <Th>Position</Th>

            <Th>Created</Th>
            <Th>Updated</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {filteredAds.map((ad) => (
            <Tr key={ad._id}>
              <Td>{ad.title}</Td>
              <Td>
                <Image src={ad.image} boxSize="60px" objectFit="contain" />
              </Td>
              <Td>
                <a href={ad.link} target="_blank" rel="noreferrer">
                  {ad.link}
                </a>
              </Td>
              <Td>{ad.position || "-"}</Td>

              <Td>
                {ad.createdAt ? new Date(ad.createdAt).toLocaleString() : "-"}
              </Td>
              <Td>
                {ad.updatedAt ? new Date(ad.updatedAt).toLocaleString() : "-"}
              </Td>
              <Td>
                <Button
                  size="sm"
                  colorScheme="yellow"
                  mr={2}
                  onClick={() => handleEdit(ad._id)}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  colorScheme="red"
                  onClick={() => {
                    setSelectedAdId(ad._id);
                    openAlert();
                  }}
                >
                  Delete
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      {/* Modal */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {editId ? "Edit Advertisement" : "Add Advertisement"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <form onSubmit={handleSubmit}>
              {["title", "image", "link", "position"].map((field) => (
                <FormControl key={field} mb={3}>
                  <FormLabel>
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </FormLabel>

                  {field === "position" ? (
                    <Select
                      placeholder="Select Position"
                      value={form.position}
                      onChange={(e) =>
                        setForm({ ...form, position: e.target.value })
                      }
                      required
                    >
                      <option value="home_banner">Home Banner</option>
                      <option value="sidebar">Sidebar</option>
                      <option value="footer">Footer</option>
                    </Select>
                  ) : (
                    <Input
                      placeholder={`Enter ${field}`}
                      value={form[field]}
                      onChange={(e) =>
                        setForm({ ...form, [field]: e.target.value })
                      }
                      required={["title", "image", "link"].includes(field)}
                    />
                  )}
                </FormControl>
              ))}

              {/* ✅ Add Type Dropdown */}
              <FormControl mb={4} isRequired>
                <FormLabel>Add Type</FormLabel>
                <Select
                  // placeholder="Select Add Type"
                  value={form.addType}
                  onChange={(e) => {
                    console.log("addType changed ->", e.target.value);
                    setForm({ ...form, addType: e.target.value });
                  }}
                >
                  {/* <option value="" disabled>Select Add Type</option> 🔒 Placeholder disabled */}
                  <option value="slider">Slider</option>
                  <option value="popUp">Popup</option>
                  <option value="product">Products</option>
                </Select>
              </FormControl>

              <Button type="submit" colorScheme="blue" w="full">
                {editId ? "Update" : "Add"} Advertisement
              </Button>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Delete Confirmation */}
      <AlertDialog
        isOpen={isAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={closeAlert}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Advertisement
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to delete this ad?
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
    </Box>
  );
};

export default AdsMain;
