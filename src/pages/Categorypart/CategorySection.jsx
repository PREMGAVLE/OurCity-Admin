import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "../../axios";
import {
  Button,
  useToast,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  HStack,
} from "@chakra-ui/react";
import { MdEdit, MdDelete } from "react-icons/md";
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
        await axios.put(`/category/updateCategory/${currentCategoryId}`, payload);
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
    if (!window.confirm("Are you sure you want to delete this category?")) return;
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
  const currentItems = filteredCategories.slice(indexOfFirstItem, indexOfLastItem);
  const pageCount = Math.ceil(filteredCategories.length / itemsPerPage);

  const handlePageChange = (page) => setCurrentPage(page);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Top Section */}
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-2xl font-bold">Categories</h2>
        <Button onClick={openAddModal} leftIcon={<FaPlus />} colorScheme="blue">
          Add Category
        </Button>
      </div>

      {/* Categories Grid */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-5">
        {currentItems.map((cat) => (
          <div key={cat._id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <img src={cat.image} alt={cat.name} className="w-full h-32 object-cover" />
            <div className="p-3">
              <h2 className="text-lg font-semibold">{cat.name}</h2>
              <p className="text-gray-600 text-sm mb-2">{cat.description}</p>

              <HStack spacing={2}>
                <Menu>
                  <MenuButton as={Button} size="sm" colorScheme="purple">
                    Actions
                  </MenuButton>
                  <MenuList>
                    <MenuItem icon={<MdEdit />} onClick={() => openEditModal(cat)}>
                      Edit
                    </MenuItem>
                    <MenuItem icon={<MdDelete />} onClick={() => handleDelete(cat._id)}>
                      Delete
                    </MenuItem>
                  </MenuList>
                </Menu>

                <Button colorScheme="teal" onClick={() => handleSubcategoryClick(cat._id)}>
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
      </div>

      {/* Pagination */}
      {pageCount > 1 && (
        <PaginationNav
          pageCount={pageCount}
          currentPage={currentPage}
          setCurrentPage={handlePageChange}
        />
      )}
    </div>
  );
};

export default CategorySection;
