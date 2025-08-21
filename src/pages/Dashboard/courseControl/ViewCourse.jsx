import React from "react";
import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import { useUser } from "../../../hooks/use-user";
import { errorToast } from "../../../utils/toast";
import axios from "../../../axios";
import { FaArrowRightLong } from "react-icons/fa6";
import Correct from "../../../Images/Vector.png";
import bgImage from "../../../Images/Section (2).png";
import Info from "../../../Images/ph_info-duotone.png";
import Table from "../../../componant/Table/Table";
import Cell from "../../../componant/Table/cell";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
  ChevronDownIcon,
  Button,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
  useDisclosure,
  Box,
  FormControl,
  FormLabel,
  Text,
  InputGroup,
  InputLeftElement,
  Input,
  InputRightAddon,
  useToast,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton
} from "@chakra-ui/react";

import { MdEdit, MdDelete } from "react-icons/md";
import { HiStatusOnline } from "react-icons/hi";
import { GrOverview } from "react-icons/gr";
function ViewCourse() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpen2,
    onOpen: onOpen2,
    onClose: onClose2,
  } = useDisclosure();
  const {
    isOpen: isOpen3,
    onOpen: onOpen3,
    onClose: onClose3,
  } = useDisclosure();
  const btnRef = React.useRef()

  const cancelRef = React.useRef();
  const toast = useToast()
  const [data, setData] = useState([]);
  const [newID, setNewID] = useState(null);
  console.log(data);
  // const [isOpen1, setIsOpen1] = useState(false);
  // const [isOpen2, setIsOpen2] = useState(false);

  // const toggleDropdown = () => {
  //   setIsOpen1(!isOpen1);
  // };
  // const toggleDropdown2 = () => {
  //   setIsOpen2(!isOpen2);
  // };
  useEffect(() => {
    async function fetchData() {
      axios.get("getAllCoursesForAdmin").then((response) => {
        console.log(response?.data);
        if (response?.data) {
          setData(response?.data?.result);
          localStorage.setItem("plans", JSON.stringify(response?.data?.result));
        }
      });
    }
    fetchData();
  }, []);
  const handleDelete = () => {
    axios
      .delete(`deleteCourse/${newID}`)
      .then((res) => {
        if (res.data) {
          console.log(res.data);
          toast({
            title: `Success! This course has been deleted`,
            
            status: "success",
            duration: 4000,
            isClosable: true,
            position:"top"
          });
          window.location.reload();
        }
      })
      .catch((err) => {
        toast({
          title: `Something Went Wrong!`,
          
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      });
  };

  const [formData, setTextData] = useState({
    planName: "",
    planNameHin: "",
    desc: "",
    descHin: "",
    price: "",
    priceHin: "",
    offerPrice: "",
    offerPriceHin: "",
    planValidity: "",
    planValidityHin: "",
    planImage: "",
    planImageHin: "",
    isRight: "",
    isWrong: "",
    isSkip: "",
    rightLimit: "",
    rightLimitHin: "",
    wrongLimit: "",
    wrongLimitHin: "",
    exams: [],
    examsHin: [],
    isActive: false,
  });

  useEffect(() => {
    axios
      .get(`getAllCoursesForAdmin`)
      .then((res) => {
        if (res.data) {
          const predata = res.data?.result.find((el) => el._id === newID);
          const { _id, __v, createdOn, ...filteredPredata } = predata;
          setTextData(filteredPredata);
        }
      })
      .catch((err) => {
        // toast.error("Something went wrong. Please try again.");
      });
  }, [newID]);

  const handleStatusChange = (e) => {
    e.preventDefault();
    const newFormData = { ...formData, isActive: !formData.isActive };
    console.log(newFormData);
    axios
      .put(`editCourse/${newID}`, newFormData)
      .then((res) => {
        if (res.data) {
          toast({
            title: `Success! Status has been updated`,
            status: "success",
            duration: 4000,
            isClosable: true,
            position:"top"
          });
          window.location.reload();
        }
      })
      .catch((err) => {
        toast({
          title: `Something Went Wrong!`,
          status: "error",
          duration: 4000,
          isClosable: true,
           position:"top"
        });
      });
  };

  const columns = React.useMemo(
    () => [
      {
        Header: "Sr No.",
        accessor: "srNo",
        Cell: ({ value, row: { index } }) => <Cell text={index + 1} />,
      },
      {
        Header: "Title",
        accessor: "planName",
        Cell: ({ value, row: { original } }) => (
          <>
            <Cell text={`${value}`} />
          </>
        ),
      },

      {
        Header: "Price",
        accessor: "price",
        Cell: ({ value, row: { original } }) => (
          <>
            <Cell text={` ${value}`} />
          </>
        ),
      },
      {
        Header: "Offer Price",
        accessor: "offerPrice",
        Cell: ({ value, row: { original } }) => (
          <>
            <Cell text={` ${value}`} />
          </>
        ),
      },
      {
        Header: "Status",
        accessor: "isActive",
        Cell: ({ value, row: { original } }) => (
          <>
            <Cell text={value ? "Active" : "In Active"} />
          </>
        ),
      },

      {
        Header: "Created On",
        accessor: "createdOn",
        Cell: ({ value, row: { original } }) => (
          <Cell text={dayjs(value).format("D MMM, YYYY h:mm A")} />
        ),
      },
    
      {
        Header: "Add Question",
        accessor: "",
        Cell: ({ value, row: { original } }) => {
          return (
            <>
              <Link to={`/dash/add-question/${original._id}`}>
                <button
                  className="bg-purple p-2 rounded-xl text-white px-6 border-2 border-bgBlue"
                  //    onClick={()=>{ history.push({
                  //         pathname: "/d/create-question",
                  //         query: { ...history.query, userId: original._id },
                  //       });}}
                >
                  Add
                </button>
              </Link>
            </>
          );
        },
      },
      {
        Header: "Action",
        accessor: "",
        Cell: ({ value, row: { original } }) => {
          return (
            <>
              <Menu>
                <MenuButton
                  as={Button}
                  className="bg-bgBlue "
                  colorScheme="bgBlue"
                  onClick={() => setNewID(original._id)}
                >
                  Actions
                </MenuButton>
                <MenuList>
                  <Link to={`/dash/edit-course/${original._id}`}>
                    <MenuItem>
                      {" "}
                      <MdEdit className="mr-4" /> Edit
                    </MenuItem>
                  </Link>

                  <MenuItem onClick={onOpen2}>
                    {" "}
                    <HiStatusOnline className="mr-4" /> Status
                  </MenuItem>

                  <MenuItem onClick={onOpen}>
                    {" "}
                    <MdDelete className="mr-4" />
                    Delete
                  </MenuItem>
                  <Link to={`/dash/view-question/${original._id}`}>
                  <MenuItem>
                    <GrOverview className="mr-4" /> View Question
                  </MenuItem>
                  </Link>
                </MenuList>
              </Menu>
            </>
          );
        },
      },
      //   {
      //     Header: "Actions",
      //     accessor: "_id",
      //     Cell: ({ value, row: { original } }) => {
      //       return (
      //         <>
      //           <CustomMenu
      //             onChange={(opened) => setSelectedUserId(value)}
      //             target={<CustomButton size="sm">Actions</CustomButton>}
      //             items={[
      //               {
      //                 icon: <PencilLine />,
      //                 onClick: () => {
      //                   setActionsDialogs((val) => ({ ...val, edit: true }));

      //                 },
      //                 label: "Edit",
      //               },
      //               {
      //                 icon: <HandGrabbing />,
      //                 onClick: () => {
      //                   setActionsDialogs((val) => ({ ...val, hold: true }));
      //                 },
      //                 label: "Delete",
      //               },
      //               {
      //                 icon: <HandGrabbing />,
      //                 onClick: () => {
      //                   setActionsDialogs((val) => ({ ...val, status: true }));
      //                 },
      //                 label: "Status",
      //               },
      //               {
      //                 icon: <PencilLine />,
      //                 onClick: () => {
      //                   history.push({
      //                     pathname: "/d/question-view",
      //                     query: { ...history.query, userId: value },
      //                   });
      //                 },
      //                 label: "View Question",
      //               },

      //             ]}
      //           />
      //         </>
      //       );
      //     },
      //   },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data]
  );

  return (
    <div
      className="lg:py-12 py-4 bg-bgWhite"
      style={
        {
          // backgroundImage: `url('${bgImage}')`,
          // backgroundSize: "cover",
          //  backgroundRepeat: 'no-repeat',
          //  backgroundPosition: 'center'
        }
      }
    >
      <section class=" md:p-1 ">
        <div class="fixed z-40 w-full p-2">
          <div class="flex  justify-between items-center">
            <div>
              <h2 class="text-xl font-bold  mb-4 text-purple text-oswald">
                View Course
              </h2>
            </div>
            <div className=" w-96">
              <InputGroup borderRadius={5} size="sm">
                <InputLeftElement
                  pointerEvents="none"
                  // children={<Search2Icon color="gray.600" />}
                />
                <Input
                  type="text"
                  placeholder="Search..."
                  border="1px solid #949494"
                />
                <InputRightAddon p={0} border="none">
                  <Button
                    className="bg-purple"
                    colorScheme="#FF782D"
                    size="sm"
                    borderLeftRadius={0}
                    borderRightRadius={3.3}
                    border="1px solid #949494"
                  >
                    Search
                  </Button>
                </InputRightAddon>
              </InputGroup>
            </div>

            <div className="flex gap-2">
              <Menu>
                <MenuButton
                  as={Button}
                  colorScheme="#4D2C5E"
                  zIndex={20}
                  className="bg-bgBlue"
                >
                  Sort By
                </MenuButton>
                <MenuList zIndex={20}>
                  <MenuItem>Download</MenuItem>
                  <MenuItem>Create a Copy</MenuItem>
                  <MenuItem>Mark as Draft</MenuItem>
                  <MenuItem>Delete</MenuItem>
                  <MenuItem>Attend a Workshop</MenuItem>
                </MenuList>
              </Menu>
              <Menu>
                <MenuButton
                  as={Button}
                  colorScheme="#FF782D"
                  zIndex={20}
                  className="bg-purple"
                  ref={btnRef}  onClick={onOpen3}
                >
                  Filter By
                </MenuButton>
                
              </Menu>
            </div>
            <Drawer
        isOpen={isOpen3}
        placement='right'
        onClose={onClose3}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Create your account</DrawerHeader>

          <DrawerBody>
            <Input placeholder='Type here...' />
          </DrawerBody>

          <DrawerFooter>
            <Button variant='outline' mr={3} onClick={onClose3}>
              Cancel
            </Button>
            <Button colorScheme='blue'>Save</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
          </div>
          <div className="mt-2">
            <Table
              // isLoading={isLoading}
              data={data || []}
              columns={columns}
              // total={data?.total}
            />
          </div>
        </div>
        {/* //delete Dialog// */}
        <AlertDialog
          isOpen={isOpen}
          leastDestructiveRef={cancelRef}
          onClose={onClose}
          isCentered
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Delete Course
              </AlertDialogHeader>

              <AlertDialogBody>
                Are you sure? Delete this Course
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onClose}>
                  Cancel
                </Button>
                <Button colorScheme="red" onClick={handleDelete} ml={3}>
                  Delete
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
        {/* //Status Dialog// */}
        <AlertDialog
          isOpen={isOpen2}
          leastDestructiveRef={cancelRef}
          onClose={onClose2}
          isCentered
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Change Course Status
              </AlertDialogHeader>

              <AlertDialogBody>
                <Box
                  as="form"
                  id="edit-form"
                  px={4}
                  py={6}
                  w="full"
                  spacing={6}
                >
                  <FormControl id="status" w="full">
                    <FormLabel>Change Status?</FormLabel>
                    <Text>
                      Current Status:{" "}
                      {formData.isActive ? "Active" : "Inactive"}
                    </Text>
                  </FormControl>
                </Box>
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onClose2}>
                  Cancel
                </Button>
                <Button colorScheme="red" onClick={handleStatusChange} ml={3}>
                  Change Status
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </section>
    </div>
  );
}

export default ViewCourse;
