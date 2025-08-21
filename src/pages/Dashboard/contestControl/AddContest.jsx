import React, { useEffect, useState } from 'react';
import axios from '../../../axios';
import { useParams } from 'react-router-dom';
import { useToast } from '@chakra-ui/react';

const AddContest = () => {
    const { id } = useParams();
    const toast = useToast();

    const initialFormState = {
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
    };

    
    const [formData, setFormData] = useState(initialFormState);
    const [timeDate, setTimeDate] = useState({
      
        startTimeHrs:"",
        endTimeHrs:"",
        startDate:"",
        endDate:"",
    
    });
    const [product, setProduct] = useState({});

    // useEffect(() => {
    //     axios
    //         .get("getAllCoursesForAdmin")
    //         .then((res) => {
    //             if (res.data) {
    //                 const predata = res.data?.result.find((el) => el._id === id);
    //                 const { _id, __v, createdOn, ...filteredPredata } = predata;
    //                 setProduct(filteredPredata);
    //             }
    //         })
    //         .catch((err) => {
    //             toast({
    //                 title: "Something Went Wrong!",
    //                 status: "error",
    //                 duration: 4000,
    //                 isClosable: true,
    //                 position: "top"
    //             });
    //         });
    // }, [id, toast]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const handleChangeTime = (e) => {
        const { name, value } = e.target;
        setTimeDate((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
console.log(timeDate)
    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setTimeDate((prevData) => ({
            ...prevData,
            [name]: checked,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
       
        const processedFormData = {
            ...formData,
            startTime :`${timeDate.startDate}T${timeDate.startTimeHrs}:00`,
            endTime:`${timeDate.endDate}T${timeDate.endTimeHrs}:00`,
            winersPrize: formData.winersPrize.split(',').map((prize) => prize.trim())
        };
    console.log(processedFormData);
        axios.post('addNewContest', processedFormData)
            .then((res) => {
                if (res.data) {
                    toast({
                        title: "Success! Contest Added successfully",
                        status: "success",
                        duration: 4000,
                        isClosable: true,
                        position: "top"
                    });
                    window.location.reload();
                }
            })
            .catch((err) => {
                toast({
                    title: "Something Went Wrong!",
                    status: "error",
                    duration: 4000,
                    isClosable: true,
                    position: "top"
                });
            });
    };

    return (
        <div className="m-6 py-8">
            <form onSubmit={handleSubmit}>
                <div className="bg-white shadow rounded-lg">
                    <div className="px-4 py-5 sm:px-6">
                        <h3 className="text-xl font-bold text-purple">Add Contest</h3>
                    </div>
                    <div className="px-4 py-5 sm:p-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-start font-medium text-gray-700">Contest Name</label>
                                <input
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    name="contestName"
                                    value={formData.contestName}
                                    type="text"
                                    required
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-start font-medium text-gray-700">Contest Name (Hindi)</label>
                                <input
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    name="contestNameHin"
                                    value={formData.contestNameHin}
                                    type="text"
                                    required
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-start font-medium text-gray-700">Start Date</label>
                                <input
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    name="startDate"
                                    value={timeDate.startDate}
                                    type="date"
                                    required
                                    onChange={handleChangeTime}
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-start font-medium text-gray-700">End Date</label>
                                <input
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    name="endDate"
                                    value={timeDate.endDate}
                                    type="date"
                                    required
                                    onChange={handleChangeTime}
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-start font-medium text-gray-700">Start Time</label>
                                <input
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    name="startTimeHrs"
                                    value={timeDate.startTimeHrs}
                                    type="time"
                                    required
                                    onChange={handleChangeTime}
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-start font-medium text-gray-700">End Time</label>
                                <input
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    name="endTimeHrs"
                                    value={timeDate.endTimeHrs}
                                    type="time"
                                    required
                                    onChange={handleChangeTime}
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-start font-medium text-gray-700">Prize Pool</label>
                                <input
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    name="prizePool"
                                    value={formData.prizePool}
                                    type="text"
                                    required
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-start font-medium text-gray-700">Duration</label>
                                <input
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    name="duration"
                                    value={formData.duration}
                                    type="text"
                                    required
                                    onChange={handleChange}
                                />
                            </div>
                           
                            <div>
                                <label className="block text-sm text-start font-medium text-gray-700">Entry Fees</label>
                                <input
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    name="entryFees"
                                    value={formData.entryFees}
                                    type="text"
                                    required
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-start font-medium text-gray-700">Winners</label>
                                <input
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    name="winers"
                                    value={formData.winers}
                                    type="text"
                                    required
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-start font-medium text-gray-700">Total Slots</label>
                                <input
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    name="totalSlot"
                                    value={formData.totalSlot}
                                    type="text"
                                    required
                                    onChange={handleChange}
                                />
                                
                            </div>
                            
                            <div className="col-span-2">
                                <label className="block text-sm text-start font-medium text-gray-700">Winners Prize (comma separated)</label>
                                <input
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    name="winersPrize"
                                    value={formData.winersPrize}
                                    type="text"
                                    required
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple"
                            >
                                Submit Contest
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AddContest;
