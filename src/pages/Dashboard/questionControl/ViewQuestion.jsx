import React from "react";
import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import { Link, useParams } from "react-router-dom";
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
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton
} from "@chakra-ui/react";
import { useToast } from '@chakra-ui/react'
import { MdEdit, MdDelete } from "react-icons/md";
import { HiStatusOnline } from "react-icons/hi";
import { GrOverview } from "react-icons/gr";
function ViewQuestion() {
    const {id}=useParams()
    console.log(id)
    const toast = useToast()
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

  const [data, setData] = useState([]);
  const [newID, setNewID] = useState(null);
  console.log(data);


  useEffect(() => {
    axios
    .get(`getQuestionsByCourseId/${id}`)
    .then((res) => {
      if (res.data) {
      console.log(res.data);
      setData(res.data.result)
    
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

  }, [id]);
  const handleDelete = () => {
    axios
      .delete(`deleteQuestion/${newID}`)
      .then((res) => {
        if (res.data) {
          console.log(res.data);
          toast({
            title: `Success! Question has been Deleted successfully`,
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
            Cell: ({ value, row: { index } }) => (
              <Cell text={index + 1 } />
            ),
          },
          {
            Header: "Question",
            accessor: "question",
            Cell: ({ value, row: { original } }) => (
              <>
                <Cell
                  text={`${value}`}
                
                />
                
              </>
            ),
          },
         
          {
            Header: "answer",
            accessor: "answer",
            Cell: ({ value, row: { original } }) => (
              <>
                <Cell text={` ${value}`} />
              </>
            ),
          },
          {
            Header: "Que. Type",
            accessor: "quesType",
            Cell: ({ value, row: { original } }) => (
              <>
                <Cell text={` ${value}`} />
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
                  <Link to={`/dash/edit-question/${original._id}&${id}`}>
                    <MenuItem>
                      {" "}
                      <MdEdit className="mr-4" /> Edit
                    </MenuItem>
                  </Link>

                  <MenuItem onClick={onOpen}>
                    {" "}
                    <MdDelete className="mr-4" />
                    Delete
                  </MenuItem>

                </MenuList>
              </Menu>
            </>
          );
        },
      },
     
    ],

    [data]
  );

  return (
    <div
      className="lg:py-8 py-4 bg-bgWhite"
     
    >
      <section class=" md:p-1 ">
        <div class="">
          <div class="flex  justify-between items-center">
            <div>
              <h2 class="text-xl font-bold  mb-4 text-purple text-oswald">
                View Questions
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
                  colorScheme="#FF782D"
                  zIndex={20}
                  className="bg-purple"
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
                Delete Question
              </AlertDialogHeader>

              <AlertDialogBody>
                Are you sure? Delete this Question
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
       
      </section>
    </div>
  );
}

export default ViewQuestion;
