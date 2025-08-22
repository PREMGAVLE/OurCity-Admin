import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../../../../axios";
import { Atom } from "react-loading-indicators";
import { Info, Mail, Phone } from "lucide-react";


const ChildSubcategoryPage = () => {
  const { subcategoryId } = useParams();
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchBusiness = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/subcategory/getSubCategory/${subcategoryId}`);
    //   setBusinesses(res.data.result || []);
    setBusinesses(res?.data?.result?.businesses || []);
    console.log(res)
    } catch (err) {
      console.error("Error fetching businesses", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusiness();
  }, [subcategoryId]);

  return (
     <div className="p-4">
      <h2 className="text-lg font-semibold text-center mb-4">Businesses</h2>

      {loading ? (
        <div className="flex justify-center items-center h-32">
          <Atom color="#333" size="medium" />
        </div>
      ) : businesses.length === 0 ? (
        <p className="text-center text-gray-500">No businesses found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {businesses.map((sub) => (
            <div
              key={sub._id}
              className="bg-white rounded-2xl shadow-md p-4 border border-gray-200 hover:shadow-lg transition"
            >
              <img
                src={sub.images}
                alt={sub.name}
                className="w-full h-36 object-cover rounded-lg mb-3"
              />
              <h3 className="text-lg font-bold mb-1 text-blue-800">{sub.name}</h3>
              <p className="text-gray-600 text-sm mb-2">{sub.description}</p>
              {sub.address && (
                <p className="text-gray-700 text-sm mb-4">
                  {sub.address.street}, {sub.address.city}, {sub.address.state} -{" "}
                  {sub.address.pincode}
                </p>
              )}

              <div className="flex flex-wrap gap-2">
                <button className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition">
                  <Phone size={16} /> Call Now
                </button>
                <button className="flex items-center gap-2 px-3 py-1.5 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition">
                  <Info size={16} /> Learn More
                </button>
                <button className="flex items-center gap-2 px-3 py-1.5 bg-blue-400 text-white text-sm rounded-lg hover:bg-blue-500 transition">
                  <Mail size={16} /> Enquiry
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>

  );
};

export default ChildSubcategoryPage;
