import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../axios";
import {
  Button,
  useToast,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightAddon,
} from "@chakra-ui/react";
import { MdSearch, MdArrowBack } from "react-icons/md";

const BusinessBookings = () => {
  const { businessId } = useParams();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [bookingInfo, setBookingInfo] = useState(null);
  const [search, setSearch] = useState("");
  const toast = useToast();

  // Fetch bookings data
  const fetchBookings = async () => {
    if (!businessId) return;
    
    setBookingsLoading(true);
    try {
      const response = await axios.get(`/bookings/business/${businessId}`);
      console.log("Booking API response", response);
      
      if (response?.data && response.status !== 404) {
        const bookingsData = response.data?.data || [];
        setBookings(Array.isArray(bookingsData) ? bookingsData : []);
        setBookingInfo(response.data);
      } else {
        console.log("No bookings found for business:", businessId);
        setBookings([]);
        setBookingInfo(null);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setBookings([]);
      toast({ title: "Error fetching bookings", status: "error" });
    } finally {
      setBookingsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [businessId]);

  // Filter bookings based on search
  const filteredBookings = bookings.filter((booking) => {
    if (!search.trim()) return true;
    
    const searchTerm = search.toLowerCase();
    const customerName = (booking.extra_details?.customer_name || booking.user_id?.name || "").toLowerCase();
    const customerPhone = (booking.extra_details?.customer_phone || booking.user_id?.phone || "").toLowerCase();
    const serviceName = (booking.extra_details?.service_name || booking.product_id?.name || "").toLowerCase();
    const status = (booking.status || "").toLowerCase();
    
    return customerName.includes(searchTerm) || 
           customerPhone.includes(searchTerm) || 
           serviceName.includes(searchTerm) ||
           status.includes(searchTerm);
  });

  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  return (
    <div className="p-6 pt-20">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            leftIcon={<MdArrowBack />}
            variant="outline"
            colorScheme="blue"
            onClick={handleBack}
            className="hover:bg-blue-50"
          >
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Business Bookings
            </h1>
            <p className="text-gray-600 mt-1">
              {bookingInfo?.businessName || "Business"} - Booking Management
            </p>
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-4">
          {/* Search Section - Moved above badges */}
          <div className="w-96">
            <InputGroup size="md">
              <InputLeftElement pointerEvents="none">
                <MdSearch color="gray.400" />
              </InputLeftElement>
              <Input
                placeholder="Search bookings by customer, service, or status..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                border="1px solid #949494"
                _hover={{ borderColor: "gray.300" }}
                _focus={{ borderColor: "blue.500", boxShadow: "outline" }}
              />
              <InputRightAddon p={0} border="none">
                <Button
                  className="bg-blue"
                  colorScheme="blue"
                  size="md"
                  borderLeftRadius={0}
                  borderRightRadius={3.3}
                  border="1px solid #949494"
                >
                  Search
                </Button>
              </InputRightAddon>
            </InputGroup>
          </div>
          
          {/* Stats badges */}
          <div className="flex items-center gap-4">
            <Button colorScheme="green" size="md">
              Total Bookings: {bookings.length}
            </Button>
            <Button colorScheme="blue" size="md" variant="outline">
              Active: {bookings.filter(b => b.status === 'confirmed').length}
            </Button>
            <Button colorScheme="purple" size="md" variant="outline">
              Revenue: ₹{bookings.reduce((sum, b) => sum + (b.amount || 0), 0).toLocaleString()}
            </Button>
          </div>
        </div>
      </div>

      {/* Content Section */}
      {bookingsLoading ? (
        <div className="flex flex-col justify-center items-center py-16 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200"></div>
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent absolute top-0 left-0"></div>
          </div>
          <div className="mt-6 text-center">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Loading Bookings</h3>
            <p className="text-gray-500">Fetching booking data for this business...</p>
          </div>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="flex flex-col justify-center items-center py-16 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
          <div className="text-6xl mb-4">📅</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            {search ? "No Matching Bookings Found" : "No Bookings Found"}
          </h3>
          <p className="text-gray-500 text-center max-w-md">
            {search 
              ? "Try adjusting your search terms to find bookings."
              : "No bookings have been made for this business yet. Bookings will appear here once customers start making reservations."
            }
          </p>
          {!search && (
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md">
              <div className="flex items-center">
                <div className="text-2xl mr-3">💡</div>
                <div className="text-sm text-blue-700">
                  <strong>Tip:</strong> Encourage customers to make bookings for this business.
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Table Header */}
          <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">Booking Details</h3>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                  {filteredBookings.length} Records
                </span>
              </div>
            </div>
          </div>

          {/* Table Content */}
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                    Customer
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                    Service
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                    Scheduled
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                    Payment
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBookings.map((booking, index) => {
                  const bookingId = booking.booking_id;
                  const customerName = booking.extra_details?.customer_name || booking.user_id?.name || 'N/A';
                  const customerPhone = booking.extra_details?.customer_phone || booking.user_id?.phone || 'N/A';
                  const serviceName = booking.extra_details?.service_name || booking.product_id?.name || 'N/A';
                  const amount = booking.amount || 0;
                  const bookingDate = booking.booking_date;
                  const scheduledDate = booking.scheduled_date;
                  const startTime = booking.start_time || 'N/A';
                  const status = booking.status || 'pending';
                  const paymentStatus = booking.payment_status || 'pending';
                  
                  return (
                    <tr 
                      key={booking._id} 
                      className={`transition-all duration-200 hover:bg-blue-50 hover:shadow-sm group border-b border-gray-100 ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      }`}
                    >
                      <td className="px-4 py-3 whitespace-nowrap text-left">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8">
                            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-700 flex items-center justify-center text-white font-semibold text-xs shadow-lg">
                              {customerName.charAt(0).toUpperCase()}
                            </div>
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                              {customerName}
                            </div>
                            {customerPhone !== 'N/A' && (
                              <a 
                                href={`tel:${customerPhone}`}
                                className="text-xs text-green-600 hover:text-green-800 hover:underline transition-colors"
                              >
                                {customerPhone}
                              </a>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 text-left">
                        <div className="truncate max-w-xs" title={serviceName}>
                          {serviceName}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 font-semibold text-left">
                        ₹{amount.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-left">
                        <div className="flex flex-col">
                          <span className="bg-blue-100 px-2 py-1 rounded text-xs text-blue-800 mb-1">
                            {scheduledDate ? new Date(scheduledDate).toLocaleDateString() : 'N/A'}
                          </span>
                          {startTime !== 'N/A' && (
                            <span className="bg-gray-100 px-2 py-1 rounded text-xs text-gray-600">
                              {startTime}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-left">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wide transition-all duration-200 ${
                          status === 'Confirmed' || status === 'confirmed' ? 'bg-green-500 text-white shadow-md' :
                          status === 'Pending' || status === 'pending' ? 'bg-amber-500 text-white shadow-md' :
                          status === 'Cancelled' || status === 'cancelled' ? 'bg-red-500 text-white shadow-md' :
                          status === 'Completed' || status === 'completed' ? 'bg-blue-500 text-white shadow-md' :
                          'bg-gray-500 text-white shadow-md'
                        }`}>
                          {status}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-left">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wide transition-all duration-200 ${
                          paymentStatus === 'Paid' || paymentStatus === 'paid' ? 'bg-green-500 text-white shadow-md' :
                          paymentStatus === 'Pending' || paymentStatus === 'pending' ? 'bg-amber-500 text-white shadow-md' :
                          paymentStatus === 'Failed' || paymentStatus === 'failed' ? 'bg-red-500 text-white shadow-md' :
                          paymentStatus === 'Refunded' || paymentStatus === 'refunded' ? 'bg-purple-500 text-white shadow-md' :
                          'bg-gray-500 text-white shadow-md'
                        }`}>
                          {paymentStatus}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              {/* Summary Stats */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                  <span className="font-medium">Confirmed: {bookings.filter(b => b.status === 'confirmed').length}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="w-3 h-3 bg-amber-500 rounded-full"></span>
                  <span className="font-medium">Pending: {bookings.filter(b => b.status === 'pending').length}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                  <span className="font-medium">Cancelled: {bookings.filter(b => b.status === 'cancelled').length}</span>
                </div>
                <div className="text-sm text-gray-600 border-l border-gray-300 pl-4">
                  <span className="font-semibold">Total: ₹{bookings.reduce((sum, b) => sum + (b.amount || 0), 0).toLocaleString()}</span>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <Button 
                  variant="outline" 
                  colorScheme="blue"
                  className="hover:bg-blue-50 transition-colors border-blue-300"
                >
                  Export Data
                </Button>
                <Button 
                  colorScheme="blue" 
                  onClick={handleBack}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessBookings;
