import React, { useEffect, useState } from 'react';
import axios from '../../../axios';
import { useToast } from '@chakra-ui/react'

const CreateCourses = () => {

    const toast = useToast()
  const [alljobs, setData] = useState([]);
  const initialFormState = {
    planName: '',
    planNameHin: '',
    desc: '',
    descHin: '',
    price: '',
    priceHin: '',
    offerPrice: '',
    offerPriceHin: '',
    planValidity: '',
    planValidityHin: '',
    planImage: '',
    planImageHin: '',
    isRight: '',
    isWrong: '',
    isSkip: '',
    rightLimit: '',
    rightLimitHin: '',
    wrongLimit: '',
    wrongLimitHin: '',
    exams: [],
    examsHin: [],
    subCourses: [],
    isActive: false,
  };

  const [formData, setFormData] = useState(initialFormState);
  const [file, setFile] = useState(null);

  useEffect(() => {
    axios
      .get('getAllInActiveCourses')
      .then((res) => {
        if (res.data) {
          console.log(res.data);
          setData(res.data.result);
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
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData((prevData) => ({
        ...prevData,
        [name]: checked ? [...prevData[name], value] : prevData[name].filter((item) => item !== value),
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
    setFormData((prevData) => ({
      ...prevData,
      planImage: URL.createObjectURL(file),
    }));
  };

  const handleFileChangeHin = (e) => {
    const file = e.target.files[0];
    setFile(file);
    setFormData((prevData) => ({
      ...prevData,
      planImageHin: URL.createObjectURL(file),
    }));
  };

  const handleExamsChange = (e) => {
    const examsArray = e.target.value.split(',').map((exam) => exam.trim());
    setFormData((prevData) => ({
      ...prevData,
      exams: examsArray,
    }));
  };

  const handleExamsChangeHin = (e) => {
    const examsArray = e.target.value.split(',').map((exam) => exam.trim());
    setFormData((prevData) => ({
      ...prevData,
      examsHin: examsArray,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('addCourse', formData)
      .then((res) => {
        if (res.data) {
            toast({
                title: `Added! New Course has been Added Succesfully`,
                
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
  console.log(formData)

  return (
    <div>
    
      <div className="m-6 py-8">
        <form onSubmit={handleSubmit}>
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-xl font-bold text-purple">Create Course</h3>
            </div>
        
            <div className="px-4 py-5 sm:p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-start font-medium text-gray-700">Plan Name</label>
                  <input
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    name="planName"
                    value={formData.planName}
                    type="text"
                    required
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm text-start font-medium text-gray-700">Plan Name (Hindi)</label>
                  <input
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    name="planNameHin"
                    value={formData.planNameHin}
                    type="text"
                    required
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm text-start font-medium text-gray-700">Description</label>
                  <input
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    name="desc"
                    value={formData.desc}
                    type="text"
                    required
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm text-start font-medium text-gray-700">Description (Hindi)</label>
                  <input
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    name="descHin"
                    value={formData.descHin}
                    type="text"
                    required
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm text-start font-medium text-gray-700">Price</label>
                  <input
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    name="price"
                    value={formData.price}
                    type="number"
                    required
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm text-start font-medium text-gray-700">Price (Hindi)</label>
                  <input
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    name="priceHin"
                    value={formData.priceHin}
                    type="number"
                    required
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm text-start font-medium text-gray-700">Offer Price</label>
                  <input
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    name="offerPrice"
                    value={formData.offerPrice}
                    type="number"
                    required
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm text-start font-medium text-gray-700">Offer Price (Hindi)</label>
                  <input
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    name="offerPriceHin"
                    value={formData.offerPriceHin}
                    type="number"
                    required
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm text-start font-medium text-gray-700">Plan Validity</label>
                  <input
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    name="planValidity"
                    value={formData.planValidity}
                    type="text"
                    required
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm text-start font-medium text-gray-700">Plan Validity (Hindi)</label>
                  <input
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    name="planValidityHin"
                    value={formData.planValidityHin}
                    type="text"
                    required
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm text-start font-medium text-gray-700">Plan Image</label>
                  <input
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    name="planImage"
                    value={formData.planImage}
                    type="text"
                    required
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm text-start font-medium text-gray-700">Plan Image (Hindi)</label>
                  <input
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    name="planImageHin"
                    value={formData.planImageHin}
                    type="text"
                    required
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm text-start font-medium text-gray-700">Right Answer Bonus</label>
                  <input
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    name="isRight"
                    value={formData.isRight}
                    type="text"
                    required
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm text-start font-medium text-gray-700">Wrong Answer Penalty</label>
                  <input
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    name="isWrong"
                    value={formData.isWrong}
                    type="text"
                    required
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm text-start font-medium text-gray-700">Skipped Answer Penalty</label>
                  <input
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    name="isSkip"
                    value={formData.isSkip}
                    type="text"
                    required
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm text-start font-medium text-gray-700">Right Answer Limit</label>
                  <input
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    name="rightLimit"
                    value={formData.rightLimit}
                    type="text"
                    required
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm text-start font-medium text-gray-700">Right Answer Limit (Hindi)</label>
                  <input
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    name="rightLimitHin"
                    value={formData.rightLimitHin}
                    type="text"
                    required
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm  text-start font-medium text-gray-700">Wrong Answer Limit</label>
                  <input
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    name="wrongLimit"
                    value={formData.wrongLimit}
                    type="text"
                    required
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm text-start font-medium text-gray-700">Wrong Answer Limit (Hindi)</label>
                  <input
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    name="wrongLimitHin"
                    value={formData.wrongLimitHin}
                    type="text"
                    required
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm text-start font-medium text-gray-700">Exams</label>
                  <input
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    name="exams"
                    value={formData.exams.join(', ')}
                    type="text"
                    required
                    onChange={handleExamsChange}
                  />
                </div>
                <div>
                  <label className="block text-sm text-start font-medium text-gray-700">Exams (Hindi)</label>
                  <input
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    name="examsHin"
                    value={formData.examsHin.join(', ')}
                    type="text"
                    required
                    onChange={handleExamsChangeHin}
                  />
                </div>
                <div className="text-start">
                  <label className=" text-sm text-start font-medium text-gray-700">Select SubCourses</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {alljobs.map((job) => (
                      <div key={job._id} className="flex items-center">
                        <input
                          type="checkbox"
                          name="subCourses"
                          value={job._id}
                          checked={formData.subCourses.includes(job._id)}
                          onChange={handleChange}
                          className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                        />
                        <label className="ml-2 text-sm text-start text-gray-700">{job.planName}</label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Submit Course
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCourses;
