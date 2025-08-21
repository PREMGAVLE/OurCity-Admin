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

// -------------------------------------------
function ViewContest() {
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
  const [contestId, setContestid] = useState(null);
  const [totalJoined, setTotalJoined] = useState(0); 
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
      axios.get("getAllContestForAdmin").then((response) => {
        console.log(response?.data);
        if (response?.data) {
          setData(response?.data?.result);
          setContestid(response?.data?.result[0]?._id)
        //   localStorage.setItem("plans", JSON.stringify(response?.data?.result));
        }
      });
    }
    fetchData();
  }, []);

  console.log(contestId)
  console.log(newID)
  const handleDelete = () => {
    axios
      .delete(`deleteContest/${newID}`)
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
    contestName: '',
    contestNameHin: '',
    startTime: '',
    endTime: '',
    prizePool: '',
    duration: '',
    isActive: false,
    entryFees: '',
    winers: '',
    totalSlot: '',
    winersPrize: ''
  });

  useEffect(() => {
    axios
      .get(`getAllContestForAdmin`)
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

  
  
  // useEffect(()=>{
  //   fetchJoinedData()
  // },[])
  // const fetchJoinedData = async () => {
  //   try {
  //     const response = await axios.get(`getTotalUserJoinedContestCount`);
  //     console.log(response.data)
  //     // return response?.data?.result?.totalUserJoinedCount || 0;
  //   } catch (error) {
  //     console.log(error);
  //     return 0;
  //   }
  // };

  // useEffect(()=>{
  //   fetchJoinedData()
  // },[])
  const handleStatusChange = (e) => {
    e.preventDefault();
    const newFormData = { ...formData, isActive: !formData.isActive };
    console.log(newFormData);
    axios
      .put(`updateContest/${newID}`, newFormData)
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
        Header: "Contest Name",
        accessor: "contestName",
        Cell: ({ value, row: { original } }) => (
          <>
            <Cell text={`${value}`} />
          </>
        ),
      },

      {
        Header: "Price",
        accessor: "entryFees",
        Cell: ({ value, row: { original } }) => (
          <>
            <Cell text={` ${value}`} />
          </>
        ),
      },
      {
        Header: " Prize Pool",
        accessor: "prizePool",
        Cell: ({ value, row: { original } }) => (
          <>
            <Cell text={` ${value}`} />
          </>
        ),
      },
      {
        Header: "1st Prize",
        accessor: "winersPrize",
        Cell: ({ value, row: { original } }) => (
          <>
            <Cell text={` ${value[0]}`} />
          </>
        ),
      },
      {
        Header: "Joined Slot",
        accessor: "",
        Cell: ({ value, row: { original } }) => {
          const [joinedSlots, setJoinedSlots] = useState(0);
          useEffect(() => {
            axios
              .get(`getTotalUserJoinedContestCount/${original._id}`)
              .then((res) => {
                if (res.data) {
                  setJoinedSlots(res?.data?.result?.totalUserJoinedCount)
                }
              })
              .catch((err) => {
                setJoinedSlots(0)
                // toast.error("Something went wrong. Please try again.");
              });
          }, [original._id]);

          return <Cell text={` ${joinedSlots}`} />;
        },
      },
      {
        Header: "Total Slot",
        accessor: "totalSlot",
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
              <Link to={`/dash/addcontest-question/${original._id}`}>
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
                  <Link to={`/dash/edit-contest/${original._id}`}>
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
                  <Link to={`/dash/viewcontest-question/${original._id}`}>
                  <MenuItem>
                    <GrOverview className="mr-4" /> View Question
                  </MenuItem>
                  </Link>
                  <Link to={`/dash/join-user/${original._id}`}>
                  <MenuItem>
                    <GrOverview className="mr-4" /> View Join User
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
        <div class="">
          <div class="flex  justify-between items-center">
            <div>
              <h2 class="text-xl font-bold  mb-4 text-purple text-oswald">
                View Contest
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
                Delete Contest
              </AlertDialogHeader>

              <AlertDialogBody>
                Are you sure? Delete this Contest
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
                Change Contest Status
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

export default ViewContest;
