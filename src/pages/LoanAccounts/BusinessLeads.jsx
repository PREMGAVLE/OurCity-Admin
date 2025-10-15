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

const BusinessLeads = () => {
  const { businessId } = useParams();
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [leadsLoading, setLeadsLoading] = useState(false);
  const [businessInfo, setBusinessInfo] = useState(null);
  const [search, setSearch] = useState("");
  const toast = useToast();

  // Fetch leads data
  const fetchLeads = async () => {
    if (!businessId) return;
    
    setLeadsLoading(true);
    try {
      const response = await axios.get(`/bussiness/leads/${businessId}`);
      console.log("Leads API response:", response);
      
      if (response?.data && response.status !== 404) {
        const leadsData = response.data.result?.leads || response.data.leads || [];
        const businessInfo = response.data.result || {};
        console.log("Leads for business:", businessId, leadsData);
        console.log("Business info:", businessInfo);
        setLeads(Array.isArray(leadsData) ? leadsData : []);
        setBusinessInfo(businessInfo);
      } else {
        console.log("No leads found for business:", businessId);
        setLeads([]);
        setBusinessInfo(null);
      }
    } catch (error) {
      console.error("Error fetching leads:", error);
      setLeads([]);
      toast({ title: "Error fetching leads", status: "error" });
    } finally {
      setLeadsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [businessId]);

  // Filter leads based on search
  const filteredLeads = leads.filter((lead) => {
    if (!search.trim()) return true;
    
    const searchTerm = search.toLowerCase();
    const leadData = lead._id || lead;
    const leadName = (leadData.name || lead.name || "").toLowerCase();
    const leadEmail = (leadData.email || lead.email || "").toLowerCase();
    const leadPhone = (leadData.phone || lead.phone || lead.contact || "").toLowerCase();
    const leadMessage = (leadData.message || leadData.description || lead.message || lead.description || "").toLowerCase();
    
    return leadName.includes(searchTerm) || 
           leadEmail.includes(searchTerm) || 
           leadPhone.includes(searchTerm) ||
           leadMessage.includes(searchTerm);
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
            colorScheme="purple"
            onClick={handleBack}
            className="hover:bg-purple-50"
          >
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Business Leads
            </h1>
            <p className="text-gray-600 mt-1">
              {businessInfo?.businessName || "Business"} - Lead Management
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
                placeholder="Search leads by name, email, phone, or message..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                border="1px solid #949494"
                _hover={{ borderColor: "gray.300" }}
                _focus={{ borderColor: "purple.500", boxShadow: "outline" }}
              />
              <InputRightAddon p={0} border="none">
                <Button
                  className="bg-purple"
                  colorScheme="purple"
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
              Total Leads: {leads.length}
            </Button>
            {businessInfo?.activeLeads !== undefined && (
              <Button colorScheme="blue" size="md" variant="outline">
                Active: {businessInfo.activeLeads}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Content Section */}
      {leadsLoading ? (
        <div className="flex flex-col justify-center items-center py-16 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200"></div>
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent absolute top-0 left-0"></div>
          </div>
          <div className="mt-6 text-center">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Loading Leads</h3>
            <p className="text-gray-500">Fetching lead data for this business...</p>
          </div>
        </div>
      ) : filteredLeads.length === 0 ? (
        <div className="flex flex-col justify-center items-center py-16 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            {search ? "No Matching Leads Found" : "No Leads Found"}
          </h3>
          <p className="text-gray-500 text-center max-w-md">
            {search 
              ? "Try adjusting your search terms to find leads."
              : "No leads have been generated for this business yet. Leads will appear here once customers start showing interest."
            }
          </p>
          {!search && (
            <div className="mt-6 bg-purple-50 border border-purple-200 rounded-lg p-4 max-w-md">
              <div className="flex items-center">
                <div className="text-2xl mr-3">💡</div>
                <div className="text-sm text-purple-700">
                  <strong>Tip:</strong> Encourage customers to contact this business to generate leads.
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Table Header */}
          <div className="px-6 py-4 bg-gradient-to-r from-purple-50 to-blue-50 border-b">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">Lead Details</h3>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full font-medium">
                  {filteredLeads.length} Records
                </span>
              </div>
            </div>
          </div>

          {/* Table Content */}
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gradient-to-r from-purple-50 to-blue-50 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Lead Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Message
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredLeads.map((lead, index) => {
                  // Handle the specific API response structure
                  const leadData = lead._id || lead;
                  const leadId = leadData._id || lead._id || index;
                  const leadName = leadData.name || lead.name || 'N/A';
                  const leadEmail = leadData.email || lead.email || 'N/A';
                  const leadPhone = leadData.phone || lead.phone || lead.contact || 'N/A';
                  const leadMessage = leadData.message || leadData.description || lead.message || lead.description || 'N/A';
                  const leadDate = leadData.createdAt || lead.createdAt || leadData.date || lead.date;
                  const leadStatus = leadData.status || lead.status || (leadData.isActive ? 'Active' : 'Inactive');
                  
                  return (
                    <tr 
                      key={leadId} 
                      className={`transition-all duration-200 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 hover:shadow-md group ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-left">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-500 to-purple-700 flex items-center justify-center text-white font-semibold text-sm shadow-lg">
                              {leadName.charAt(0).toUpperCase()}
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-semibold text-gray-900 group-hover:text-purple-700 transition-colors">
                              {leadName}
                            </div>
                            <div className="text-xs text-gray-500">Lead #{index + 1}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-left">
                        <div className="text-sm text-gray-600">
                          <a 
                            href={`mailto:${leadEmail}`}
                            className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                          >
                            {leadEmail}
                          </a>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-left">
                        <div className="text-sm text-gray-600">
                          {leadPhone !== 'N/A' ? (
                            <a 
                              href={`tel:${leadPhone}`}
                              className="text-green-600 hover:text-green-800 hover:underline transition-colors"
                            >
                              {leadPhone}
                            </a>
                          ) : (
                            <span className="text-gray-400">Not provided</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-xs text-left">
                        <div className="truncate group-hover:bg-white group-hover:shadow-sm group-hover:rounded group-hover:p-2 transition-all" title={leadMessage}>
                          {leadMessage}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-left">
                        <div className="flex items-center">
                          <span className="bg-purple-100 px-2 py-1 rounded text-xs text-purple-800">
                            {leadDate ? new Date(leadDate).toLocaleDateString() : 'N/A'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-left">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200 ${
                          leadStatus === 'New' || leadStatus === 'new' ? 'bg-blue-500 text-white shadow-lg' :
                          leadStatus === 'In Progress' || leadStatus === 'in_progress' ? 'bg-yellow-500 text-white shadow-lg' :
                          leadStatus === 'Converted' || leadStatus === 'converted' ? 'bg-green-500 text-white shadow-lg' :
                          leadStatus === 'Active' ? 'bg-green-500 text-white shadow-lg' :
                          leadStatus === 'Inactive' ? 'bg-gray-500 text-white shadow-lg' :
                          'bg-gray-500 text-white shadow-lg'
                        }`}>
                          {leadStatus}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  <span>Active Leads</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                  <span>Inactive Leads</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button 
                  variant="outline" 
                  colorScheme="purple"
                  className="hover:bg-purple-50 transition-colors border-purple-300"
                >
                  Export Data
                </Button>
                <Button 
                  colorScheme="purple" 
                  onClick={handleBack}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
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

export default BusinessLeads;
