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
} from '@chakra-ui/react'

import { MdEdit, MdDelete } from "react-icons/md";
import { HiStatusOnline } from "react-icons/hi";
import { GrOverview } from "react-icons/gr";
function DemoUser() {
  const [data, setData] = useState([]);
  const [newID, setNewID] = useState(null);
  console.log(data);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpen2,
    onOpen: onOpen2,
    onClose: onClose2,
  } = useDisclosure();
  const cancelRef = React.useRef();
  const btnRef = React.useRef()


  useEffect(() => {
    async function fetchData() {
      axios.get("getDemoUsers").then((response) => {
        console.log(response?.data);
        if (response?.data) {
          setData(response?.data?.result);
          localStorage.setItem("plans", JSON.stringify(response?.data?.result));
        }
      });
    }
    fetchData();
  }, []);
  const columns = React.useMemo(
    () => [
      {
        Header: "Sr No.",
        accessor: "srNo",
        Cell: ({ value, row: { index } }) => <Cell text={index + 1} />,
      },
      {
        Header: "User",
        accessor: "name",
        Cell: ({ value, row: { original } }) => (
          <>
            <Cell
              text={`${value} - ${original?.planName}`}
              bold={"bold"}
              //   onClick={() => history.push(`/d/order-history/${original?._id}`)}
            />
            <Cell subtext={`${original?.email}`} />
            <div className="flex items-center justify-center gap-2 text-13 mt-2">
              <div className="flex gap-2 ">
                <div className="flex justify-center items-center gap-2">
                  <div className="w-10 bg-green-600 rounded-full p-1 h-1 "></div>
                  <h1 className="text-md font-bold text-green">
                    {original?.rightCount}
                  </h1>
                </div>
                <div className="flex justify-center items-center gap-2">
                  <div className="w-10 bg-redC rounded-full p-1 h-1 "></div>
                  <h1 className="text-md font-bold text-red">
                    {original?.wrongCount}
                  </h1>
                </div>
                <div className="flex justify-center items-center gap-2">
                  <div className="w-10 bg-yellow-400 rounded-full p-1 h-1 "></div>
                  <h1 className="text-md font-bold text-yellow-500">
                    {original?.skipCount}
                  </h1>
                </div>
              </div>
              {/* <div className="py-1 shadow-md px-2 bg-bgWhite text-black border-1 border-coolGray rounded-lg flex flex-col-2 gap-2 items-center justify-items-center">
                <Image
                  alt="Rate"
                  src={rateIcon}
                  width={20}
                  height={20}
                  layout="fixed"
                />

                <div className="text-center">
                  {original?.planName === "Silver"
                    ? 3000
                    : original?.planName === "Silver Plus"
                    ? 2000
                    : original?.planName === "Gold"
                    ? 1500
                    : original?.planName === "Platinum"
                    ? 1000
                    : 3000}
                  /1$
                </div>
              </div> */}
            </div>
          </>
        ),
      },

      {
        Header: "Ammount Paid",
        accessor: "amount",
        Cell: ({ value, row: { original } }) => (
          <>
            <Cell text={`Rs. ${value}`} />
          </>
        ),
      },
      {
        Header: "Remaining Balance",
        accessor: "remaining",
        Cell: ({ value, row: { original } }) => (
          <>
            <Cell text={`Rs. ${Math.ceil(value)}`} />
          </>
        ),
      },
      // {
      //   Header: "PaymentMethod",
      //   accessor: "paymentMethod",
      //   Cell: ({ value, row: { original } }) => (
      //     <>
      //       <Cell text={value==null?"Other":`${value}`} />
      //     </>
      //   ),
      // },
      {
        Header: "Platform",
        accessor: "platform",
        Cell: ({ value, row: { original } }) => <Cell text={value} />,
      },

      {
        Header: "Created On",
        accessor: "createdOn",
        Cell: ({ value, row: { original } }) => (
          <Cell text={dayjs(value).format("D MMM, YYYY h:mm A")} />
        ),
      },
      {
        Header: "Total Earning (Rs)",
        accessor: "totalEarning",
        Cell: ({ value, row: { original } }) => (
          <Cell text={`Rs. ${Math.ceil(value)}`} />
        ),
      },
      {
        Header: "Wallet Balance (Rs.)",
        accessor: "currentEarning",
        Cell: ({
          value,
          row: {
            original: { rate, rightCount },
          },
        }) => {
          return <Cell text={`Rs. ${Math.round(rightCount * rate)}`} />;
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
                      <MdEdit className="mr-4" /> Edit
                    </MenuItem>
                  </Link>

                  <MenuItem onClick={onOpen2}>
                    {" "}
                    <HiStatusOnline className="mr-4" /> Hold User
                  </MenuItem>

                  {/* <MenuItem onClick={onOpen}>
                    {" "}
                    <MdDelete className="mr-4" />
                    Delete
                  </MenuItem> */}
                  <Link to={`/dash/view-question/${original._id}`}>
                  <MenuItem>
                    <GrOverview className="mr-4" /> Change Plan
                  </MenuItem>
                  </Link>
                </MenuList>
              </Menu>
            </>
          );
        },
      },
    
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data]
  );

  return (
    <div
      className="lg:py-8 py-4 bg-bgWhite"
      // style={{
      //   backgroundImage: `url('${bgImage}')`,
      //   backgroundSize: "cover",
      //   backgroundRepeat: "no-repeat",
      //   backgroundPosition: "center",
      // }}
    >
      <section class=" md:p-1 ">
        <div class="py-4 ">
          <div class="flex  justify-between items-center">
            <div>
              <h2 class="text-xl font-bold  mb-4 text-purple text-oswald">
                Demo User
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
                  ref={btnRef}  onClick={onOpen2}
                >
                  Filter By
                </MenuButton>
              
              </Menu>
            </div>
            <Drawer
        isOpen={isOpen2}
        placement='right'
        onClose={onClose2}
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
            <Button variant='outline' mr={3} onClick={onClose2}>
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
      </section>
    </div>
  );
}

export default DemoUser;
