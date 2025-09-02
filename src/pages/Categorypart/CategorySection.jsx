import React, { useEffect, useState } from "react";
import axios from "../../axios";
import {
  Button,
  useToast,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  HStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Spinner,
  InputGroup,
  InputLeftElement,
  Badge,
  InputRightAddon,
} from "@chakra-ui/react";
import { MdEdit, MdDelete, MdSearch } from "react-icons/md";
import { FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import PaginationNav from "../../componant/Pagination/Pagination";

const CategorySection = () => {
  const [categories, setCategories] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentCategoryId, setCurrentCategoryId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
  });
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const toast = useToast();
  const navigate = useNavigate();

  // Fetch all categories
  const fetchCategories = async () => {
    try {
      const res = await axios.get("/category/getCategory");
      setCategories(res.data?.data || []);
    } catch (error) {
      console.error(
        "Error fetching categories:",
        error.response?.data || error.message
      );
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Open modal for add
  const openAddModal = () => {
    setIsEditMode(false);
    setFormData({ name: "", description: "", image: "" });
    setModalOpen(true);
  };

  // Open modal for edit
  const openEditModal = (category) => {
    setIsEditMode(true);
    setCurrentCategoryId(category._id);
    setFormData({
      name: category.name,
      description: category.description,
      image: category.image,
    });
    setModalOpen(true);
  };

  // Subcategory button click
  const handleSubcategoryClick = (categoryId) => {
    navigate(`/dash/subcategory/${categoryId}`);
  };

  // Add / Edit submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, description, image } = formData;

    if (!name.trim() || !image.trim()) {
      toast({
        title: "Missing required fields.",
        description: "Name and Image URL are required.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);
    const payload = {
      name: name.trim(),
      description: description.trim() || "No description",
      image: image.trim(),
      isActive: true,
    };

    try {
      if (isEditMode) {
        await axios.put(
          `/category/updateCategory/${currentCategoryId}`,
          payload
        );
        toast({ title: "Category updated successfully!", status: "success" });
        setIsEditMode(false);
      } else {
        await axios.post("/category/createCategory", payload);
        toast({ title: "Category added successfully!", status: "success" });
      }
      setModalOpen(false);
      fetchCategories();
      setFormData({ name: "", description: "", image: "" });
    } catch (err) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Server error",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // Delete category
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?"))
      return;
    try {
      await axios.delete(`/category/deleteCategory/${id}`);
      fetchCategories();
      toast({
        title: "Category deleted.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error deleting category",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // ---------------- Pagination Logic ----------------
  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(search.toLowerCase())
  );
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCategories.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const pageCount = Math.ceil(filteredCategories.length / itemsPerPage);

  const handlePageChange = (page) => setCurrentPage(page);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  return (
    // <div className="p-6 pt-20 pb-6 max-w-7xl mx-auto">
    <div className="pt-24 pb-4 px-6 max-w-7xl mx-auto">
      {/* Top Section */}
      <div className="flex justify-between items-center mb-5 ">
        <div className="flex items-center gap-4">
          <Button size="md" colorScheme="green" variant="solid">
            Total Categories : {categories.length}
          </Button>
          <Button onClick={openAddModal} leftIcon={<FaPlus />} colorScheme="blue" size="md">
            Add Category
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-96">
            <InputGroup size="md">
              <InputLeftElement pointerEvents="none">
                <MdSearch color="gray.400" />
              </InputLeftElement>
              <Input
                placeholder="Search categories by name..."
                value={search}
                onChange={handleSearchChange}
                border="1px solid #949494"
                _hover={{ borderColor: "gray.300" }}
                _focus={{ borderColor: "blue.500", boxShadow: "outline" }}
                size="md"
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

      {/* Search Results Info */}
      {search && (
        <div className="mb-6 text-sm text-gray-600">
          Showing {filteredCategories.length} of {categories.length} categories
        </div>
      )}

      {/* Categories Grid */}
      {/* <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-5">
        {currentItems.map((cat) => (
          <div
            key={cat._id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <img
              src={cat.image}
              alt={cat.name}
              className="w-full h-32 object-cover"
            />
            <div className="p-3">
              <h2 className="text-lg font-semibold">{cat.name}</h2>
              <p className="text-gray-600 text-sm mb-2">{cat.description}</p>

              <HStack spacing={2}  justify="center">
                <Menu>
                  <MenuButton as={Button} size="sm" colorScheme="purple">
                    Actions
                  </MenuButton>
                  <MenuList>
                    <MenuItem
                      icon={<MdEdit />}
                      onClick={() => openEditModal(cat)}
                    >
                      Edit
                    </MenuItem>
                    <MenuItem
                      icon={<MdDelete />}
                      onClick={() => handleDelete(cat._id)}
                    >
                      Delete
                    </MenuItem>
                  </MenuList>
                </Menu>

                <Button
                  colorScheme="teal"
                  size="sm" 
                  onClick={() => handleSubcategoryClick(cat._id)}
                >
                  Subcategory
                </Button>
              </HStack>
            </div>
          </div>
        ))}

        {currentItems.length === 0 && (
          <div className="text-center text-gray-500 col-span-full">
            No categories found.
          </div>
        )}

      </div> */}

      {/* Categories Grid */}
<div className="grid gap-3 grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 mb-4">
  {currentItems.map((cat) => (
    <div
      key={cat._id}
      className="bg-white rounded shadow-sm overflow-hidden"
      style={{ minHeight: "150px" }} // 🔽 force compact
    >
      <img
        src={cat.image}
        alt={cat.name}
        className="w-full h-20 object-cover"  // 🔽 was h-32, now h-20
      />
      <div className="p-2">
        <h2 className="text-sm font-semibold truncate">{cat.name}</h2>
        <p className="text-gray-600 text-xs mb-1 truncate">
          {cat.description}
        </p>

        <HStack spacing={1} justify="center">
          <Menu>
            <MenuButton as={Button} size="xs" colorScheme="purple">
              Actions
            </MenuButton>
            <MenuList>
              <MenuItem
                icon={<MdEdit />}
                onClick={() => openEditModal(cat)}
              >
                Edit
              </MenuItem>
              <MenuItem
                icon={<MdDelete />}
                onClick={() => handleDelete(cat._id)}
              >
                Delete
              </MenuItem>
            </MenuList>
          </Menu>

          <Button
            colorScheme="teal"
            size="xs"
            onClick={() => handleSubcategoryClick(cat._id)}
          >
            Subcategory
          </Button>
        </HStack>
      </div>
    </div>
  ))}
</div>


      {/* Pagination */}
      {pageCount > 1 && (
        <PaginationNav
          pageCount={pageCount}
          currentPage={currentPage}
          setCurrentPage={handlePageChange}
        />
      )}

      {/* ✅ Add/Edit Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {isEditMode ? "Edit Category" : "Add Category"}
          </ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleSubmit}>
            <ModalBody>
              <FormControl isRequired mb={3}>
                <FormLabel>Name</FormLabel>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </FormControl>
              <FormControl mb={3}>
                <FormLabel>Description</FormLabel>
                <Input
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </FormControl>
              <FormControl isRequired mb={3}>
                <FormLabel>Image URL</FormLabel>
                <Input
                  value={formData.image}
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                />
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button
                colorScheme="blue"
                type="submit"
                isLoading={loading}
                mr={3}
              >
                {isEditMode ? "Update" : "Create"}
              </Button>
              <Button variant="ghost" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default CategorySection;
