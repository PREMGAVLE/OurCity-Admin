import React, { useEffect, useState } from 'react';
import axios from '../../../axios';
import { useParams } from 'react-router-dom';
import { useToast } from '@chakra-ui/react'

const AddQuestion = () => {
    const {id}=useParams()
    console.log(id)
    const toast = useToast()
    const initialFormState = {
      
        question: '',
        options: '',
        answer: '',
        quesType: '',
        questionHin: '',
        optionsHin: '',
        answerHin: '',
    };

    const [formData, setFormData] = useState(initialFormState);
    const [product, setProduct] = useState({});

    useEffect(() => {
        axios
            .get("getAllCoursesForAdmin")
            .then((res) => {
                if (res.data) {
                    console.log(res.data);
                    const predata = res.data?.result.find((el) => el._id == id);
                    console.log(predata);
                    const { _id, __v, createdOn, ...filteredPredata } = predata;

                    setProduct(filteredPredata);
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        formData.course = id;
        const processedFormData = {
            ...formData,
            options: formData.options.split(',').map((option) => option.trim()),
            optionsHin: formData.optionsHin.split(',').map((option) => option.trim()),
        };
        console.log(processedFormData);

        axios.post('addQuestion', processedFormData)
            .then((res) => {
                if (res.data) {
                    toast({
                        title: `Success! Question Added successfully`,
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

    return (
        <div className="m-6 py-8">
            <form onSubmit={handleSubmit}>
                <div className="bg-white shadow rounded-lg">
                    <div className="px-4 py-5 sm:px-6">
                        <h3 className="text-xl font-bold text-purple">Add Question  ( <span className='text-bgBlue'>{product.planName}</span>)</h3>
                    </div>
                    <div className="px-4 py-5 sm:p-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-start font-medium text-gray-700">Question</label>
                                <input
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    name="question"
                                    value={formData.question}
                                    type="text"
                                    required
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-start font-medium text-gray-700">Question (Hindi)</label>
                                <input
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    name="questionHin"
                                    value={formData.questionHin}
                                    type="text"
                                    required
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-start font-medium text-gray-700">Options (comma separated)</label>
                                <input
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    name="options"
                                    value={formData.options}
                                    type="text"
                                    required
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-start font-medium text-gray-700">Options (Hindi, comma separated)</label>
                                <input
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    name="optionsHin"
                                    value={formData.optionsHin}
                                    type="text"
                                    required
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-start font-medium text-gray-700">Answer</label>
                                <input
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    name="answer"
                                    value={formData.answer}
                                    type="text"
                                    required
                                    onChange={handleChange}
                                />
                            </div>
                           
                           
                            <div>
                                <label className="block text-sm text-start font-medium text-gray-700">Answer (Hindi)</label>
                                <input
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    name="answerHin"
                                    value={formData.answerHin}
                                    type="text"
                                    required
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-start font-medium text-gray-700">Question Type</label>
                                <select
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    name="quesType"
                                    value={formData.quesType}
                                    required
                                    onChange={handleChange}
                                >
                                    <option value="" disabled>Select question type</option>
                                    <option value="gk">GK</option>
                                    <option value="maths">MATHS</option>
                                    <option value="reasoning">REASONING</option>
                                   
                                </select>
                            </div>
                           
                        </div>
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple "
                            >
                                Submit Question
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AddQuestion;
