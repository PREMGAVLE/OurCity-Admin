import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "../../axios";
import {
    Button,
    InputGroup,
    InputLeftElement,
    Input,
    InputRightAddon,
    useToast,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
} from "@chakra-ui/react";
import { MdEdit, MdDelete } from "react-icons/md";
import { FaPlus } from "react-icons/fa";
import PaginationNav from "../../componant/Pagination/Pagination";
// import PaginationNav from "./PaginationNav"; // ✅ Import PaginationNav

const CategorySection = () => {
    const [categories, setCategories] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentCategoryId, setCurrentCategoryId] = useState(null);
    const [formData, setFormData] = useState({ name: "", description: "", image: "" });
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(8);
    const toast = useToast();

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

  const openAddModal = () => {
    setIsEditMode(false);
    setFormData({ name: "", description: "", image: "" });
    setModalOpen(true);
  };

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

  const handleAddSubcategory = (categoryId) => {
    toast({
      title: "Subcategory handler invoked.",
      description: `Category ID: ${categoryId}`,
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  };

   

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, description, image ,address} = formData;

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
      address:address.trim(),
      isActive: true,
    };

    try {
      if (isEditMode) {
        await axios.put(
          `/category/updateCategory/${currentCategoryId}`,
          payload
        );
        toast({ title: "Category updated successfully!", status: "success" });
        
        setIsEditMode(null)
      } else {
        await axios.post("/category/createCategory", payload);
        toast({ title: "Category added successfully!", status: "success" });
      }
      setModalOpen(false); 
      fetchCategories();
       setFormData({ name: "", description: "", image: "", address: "" });
     
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

   

     
 

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this category?")) return;
        try {
            await axios.delete(`/category/deleteCategory/${id}`);
            fetchCategories();
            toast({ title: "Category deleted.", status: "success", duration: 3000, isClosable: true });
        } catch (error) {
            toast({ title: "Error deleting category", status: "error", duration: 3000, isClosable: true });
        }
    };

    

    const filteredCategories = categories.filter((cat) =>
        cat.name.toLowerCase().includes(search.toLowerCase())
    );
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredCategories.slice(indexOfFirstItem, indexOfLastItem);
    const pageCount = Math.ceil(filteredCategories.length / itemsPerPage);

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mt-10 flex-wrap gap-3">
                <div className="flex gap-2 items-center">
                    <Button  colorScheme="purple">
                        Total Categories: {categories.length}
                    </Button>
                    <Button onClick={openAddModal} colorScheme="blue" leftIcon={<FaPlus />}>
                        Add New Category
                    </Button>
                </div>

                <div className="w-full mt-3 sm:w-auto sm:min-w-[300px]">
                    <InputGroup size="sm">
                        <InputLeftElement pointerEvents="none" />
                        <Input
                            placeholder="Search..."
                            border="1px solid #949494"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <InputRightAddon border="none">
                            <Button className="bg-purple" size="sm">
                                Search
                            </Button>
                        </InputRightAddon>
                    </InputGroup>
                </div>
            </div>

            <div
                style={{ marginTop: "20px" }}
                className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-5"
            >
                {currentItems.map((cat) => (
                    <div key={cat._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                        <img
                            src={cat.image}
                            alt={cat.name}
                            className="w-full h-32 object-cover" // h-40 -> h-32
                        />
                        <div className="p-3"> {/* p-4 -> p-3 */}
                            <h2 className="text-lg font-semibold">{cat.name}</h2> {/* text-xl -> text-lg */}
                            <p className="text-gray-600 text-sm mb-2">{cat.description}</p> {/* mb-3 -> mb-2 */}
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
                                    <MenuItem onClick={() => handleAddSubcategory(cat._id)}>
                                        + Add Subcategory
                                    </MenuItem>
                                </MenuList>
                            </Menu>
                            
                        </div>
                    </div>
                ))}

                {currentItems.length === 0 && (
                    <div className="text-center text-gray-500 col-span-full">No categories found.</div>
                )}
            </div>

            {/* ✅ Pagination Section */}
            {currentItems.length > 0 && (
                <PaginationNav
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    pageCount={pageCount}
                />
            )}

            {modalOpen && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg"
                    >
                        <h2 className="text-xl font-semibold mb-4">
                            {isEditMode ? "Edit Category" : "Add Category"}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input
                                type="text"
                                placeholder="Category Name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="border w-full px-3 py-2 rounded"
                                required
                            />
                            <input
                                type="text"
                                placeholder="Description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="border w-full px-3 py-2 rounded"
                            />
                            <input
                                type="text"
                                placeholder="Image URL"
                                value={formData.image}
                                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                className="border w-full px-3 py-2 rounded"
                                required
                            />
                            <div className="flex justify-end gap-2">
                                <Button onClick={() => setModalOpen(false)} variant="outline">
                                    Cancel
                                </Button>
                                <Button type="submit" isLoading={loading} colorScheme="blue">
                                    {isEditMode ? "Update" : "Add"}
                                </Button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
      )}

    

export default CategorySection;
