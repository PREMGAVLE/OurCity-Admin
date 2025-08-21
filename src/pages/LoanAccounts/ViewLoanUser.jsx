import React from "react";
import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import { Link, useParams } from "react-router-dom";

import axios from "../../axios";
import { FaArrowRightLong } from "react-icons/fa6";
import Correct from "../../Images/Vector.png";
import bgImage from "../../Images/Section (2).png";
import Info from "../../Images/ph_info-duotone.png";
import Table from "../../componant/Table/Table";
import Cell from "../../componant/Table/cell";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
  InputGroup,
  InputLeftElement,
  Input,
  Button,
  InputRightAddon,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from "@chakra-ui/react";

import { MdEdit, MdDelete } from "react-icons/md";
import { HiStatusOnline } from "react-icons/hi";
import { GrOverview } from "react-icons/gr";
function ViewLoanUser() {
  const { id } = useParams();
  console.log(id);
  const [data, setData] = useState([]);
  const [Dailydata, setDailyData] = useState([]);
  const [userdata, setUserData] = useState({});
  const [newID, setNewID] = useState(null);
  console.log(data);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpen2,
    onOpen: onOpen2,
    onClose: onClose2,
  } = useDisclosure();
  const cancelRef = React.useRef();
  const btnRef = React.useRef();

  useEffect(() => {
    async function fetchData() {
      axios.get(`users/`).then((response) => {
        // console.log(response?.data?.result);
        if (response?.data) {
          setData(response?.data?.result);
          
        }
      });
    }
    fetchData();
  }, []);



  
  useEffect(() => {
    async function fetchData() {
      axios.get(`users/${id}`).then((response) => {
        // console.log(response?.data?.result);
        if (response?.data) {
            setUserData(response?.data?.result);
          
        }
      });
    }
    fetchData();
  }, []);




  useEffect(() => {
    async function fetchData() {
      axios.get(`dailyCollections/${id}`).then((response) => {
        // console.log(response?.data?.result);
        if (response?.data) {
          setDailyData(response?.data?.result);
        }

        // const sum = response.data.result.reduce((acc, item) => {
        //   return acc + (item.amount || 0);
        // }, 0);

        // setTotalAmount(sum);
      });
    }
    fetchData();
  }, []);
  console.log(Dailydata)

  //   const initialFormState = {
  //     user_name: "",
  //     password: "",
  //     full_name: "",
  //     phone_number: "",
  //     monthly_income: "",
  //     pan_no: "",
  //     aadhar_no: "",
  //     address: "",
  //     dob: "",
  //     loan_details: {
  //         loan_amount: 0,
  //         principle_amount: 0,
  //         file_charge: 500,
  //         interest_rate: "",
  //         duration_months: 4,
  //         emi_day: 0,
  //         total_amount: 0,
  //         total_interest_pay: 0,
  //         total_penalty_amount: 0,
  //         total_due_amount:0
  //     }
  // }

  const columns = React.useMemo(
    () => [
      {
        Header: "Sr No.",
        accessor: "srNo",
        Cell: ({ value, row: { index } }) => <Cell text={index + 1} />,
      },

      {
        Header: "Date",
        accessor: "created_on",
        Cell: ({ value, row: { original } }) => (
          <Cell text={dayjs(value).format("D MMM, YYYY h:mm A")} />
        ),
      },

      

      // {
      //   Header: "Loan Ammount",
      //   accessor: "loan_amount",
      //   Cell: ({ value, row: { original } }) => (
      //     <>
      //       {/* {console.log(original)} */}
      //       <Cell text={`Rs. ${original?.loan_detail_id?.loan_amount}`} />
      //     </>
      //   ),
      // },
      // {
      //   Header: "Total Pay Ammount",
      //   accessor: "total_amount",
      //   Cell: ({ value, row: { original } }) => (
      //     <>
      //       <Cell text={`Rs. ${value}`} />
      //     </>
      //   ),
      // },

      {
        Header: "EMI Amount/Day",
        accessor: "amount",
        Cell: ({ value, row: { original } }) => <Cell text={`Rs. ${value}`} />,
      },
      {
        Header: "total_penalty_amount",
        accessor: "total_penalty_amount",
        Cell: ({ value, row: { original } }) => <Cell text={`Rs. ${value}`} />,
      },

      
      // {
      //   Header: "Mobile Number",
      //   accessor: "phone_number",
      //   Cell: ({ value, row: { original } }) => (
      //     <Cell text={`${Math.ceil(value)}`} />
      //   ),
      // },

      {
        Header: "Collected By",
        accessor: "collected_officer_name",
        Cell: ({ value, row: { original } }) => (
          <>
            <Cell text={`${original?.collected_officer_name}`} bold={"bold"} />
          </>
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
                  className="bg-purple "
                  colorScheme="bgBlue"
                  onClick={() => setNewID(original._id)}
                >
                  Actions
                </MenuButton>
                <MenuList>
                  <Link to={`/dash/edit-course/${original._id}`}>
                    <MenuItem>
                      {" "}
                      <HiStatusOnline className="mr-4" /> View User
                    </MenuItem>
                  </Link>

                  <Link to={`/dash/edit-course/${original._id}`}>
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
                  <MenuItem onClick={onOpen2}>
                    {" "}
                    <HiStatusOnline className="mr-4" /> Status
                  </MenuItem>
                </MenuList>
              </Menu>
            </>
          );
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [Dailydata]
  );

  return (
    <div className="lg:py-8 py-4 bg-bgWhite">
      <section class=" md:p-1 ">
        <div class="py-6 ">
          <div class="flex  justify-between items-center ">
            <div className="flex w-3/2 flex-col gap-2 text-start">
              <h2 class="text-xl font-bold   text-purple text-oswald">Name  :<span className="ml-4">{userdata?.full_name}</span></h2>
              <div className="flex gap-20">
                <h2 class="text-lg font-bold   text-purple text-oswald">
                  Start Date :<span className="ml-4">{dayjs(userdata?.active_loan_id?.created_on).format("D MMM, YYYY")}</span>
                </h2>
                <h2 class="text-lg font-bold   text-purple text-oswald">
                  End Date :<span className="ml-4">{dayjs(userdata?.active_loan_id?.created_on).format("D MMM, YYYY")}</span>
                </h2>
              </div>
            </div>

            <div className="w-1/2 flex flex-col  gap-4 ">
              <div className="w-full flex gap-4 justify-end ">
                <Menu className="">
                  <MenuButton
                    as={Button}
                    colorScheme="#FF782D"
                    zIndex={20}
                    className="bg-bgBlue"
                  >
                    Total Loan {userdata?.active_loan_id?.loan_amount} Rs.
                  </MenuButton>
                  <MenuButton
                    as={Button}
                    colorScheme="#FF782D"
                    zIndex={20}
                    className="bg-bgBlue"
                  >
                    Total Due Amount {userdata?.active_loan_id?.total_due_amount} Rs.
                  </MenuButton>
                  <MenuButton
                    as={Button}
                    colorScheme="#FF782D"
                    zIndex={20}
                    className="bg-bgBlue"
                  >
                    Total Penalty {userdata?.active_loan_id?.total_penalty_amount} Rs.
                  </MenuButton>
                </Menu>
              </div>

              <div className="w-full flex  gap-4 justify-end ">
                <Menu>
                  <MenuButton
                    as={Button}
                    colorScheme="#FF782D"
                    zIndex={20}
                    className="bg-bgBlue"
                  >
                    Total Pay {userdata?.active_loan_id?.total_amount} Rs.
                  </MenuButton>
                  <MenuButton
                    as={Button}
                    colorScheme="#FF782D"
                    zIndex={20}
                    className="bg-bgBlue"
                  >
                    Download
                  </MenuButton>

                  <Menu>
                    <Link to={`/dash/add-daily-collection/${userdata?._id}`}>
                      <MenuButton
                        as={Button}
                        colorScheme="#FF782D"
                        zIndex={20}
                        className="bg-purple"
                        //   ref={btnRef}  onClick={onOpen2}
                      >
                        Add Amount
                      </MenuButton>
                    </Link>
                  </Menu>

                  {/* <MenuList zIndex={20}>
                  <MenuItem>Download</MenuItem>
                  <MenuItem>Create a Copy</MenuItem>
                  <MenuItem>Mark as Draft</MenuItem>
                  <MenuItem>Delete</MenuItem>
                  <MenuItem>Attend a Workshop</MenuItem>
                </MenuList> */}
                </Menu>
              </div>
            </div>
            <Drawer
              isOpen={isOpen2}
              placement="right"
              onClose={onClose2}
              finalFocusRef={btnRef}
            >
              <DrawerOverlay />
              <DrawerContent>
                <DrawerCloseButton />
                <DrawerHeader>Create your account</DrawerHeader>

                <DrawerBody>
                  <Input placeholder="Type here..." />
                </DrawerBody>

                <DrawerFooter>
                  <Button variant="outline" mr={3} onClick={onClose2}>
                    Cancel
                  </Button>
                  <Button colorScheme="blue">Save</Button>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </div>
          <div className="mt-2 ">
            <Table
              // isLoading={isLoading}
              data={Dailydata || []}
              columns={columns}
              // total={data?.total}
            />
          </div>
        </div>
      </section>
    </div>
  );
}

export default ViewLoanUser;
