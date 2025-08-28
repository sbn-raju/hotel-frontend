import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, User } from "lucide-react";
import Loader from "../../../components/loaders/Loader";
import { secureFetch } from "../../../helpers/secureFetch";
import toast from "react-hot-toast";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [meta, setMeta] = useState({
    limit: 10,
    page: 1,
    totalPages: 1,
  });
  const limit = 10;

  // Simulate API call
  const fetchCustomers = async (page = 1, limit = 10) => {
    setLoading(true);
    //Trying the API for getting the customers data.
    try {
      const response = await secureFetch(
        `/auth/customers?page=${page}&limit=${limit}`
      );
      const result = await response.json();
      setCustomers(result.data);
      setMeta({
        limit: result?.meta?.limit,
        page: page, // <-- use the current page state, not result?.meta?.page
        totalPages: result?.meta?.totalPages,
      });
    } catch (error) {
      toast.error(error.message || "Something went wrong !!");
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchCustomers(currentPage, limit);
  }, [currentPage, limit]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getVerificationBadge = (verification) => {
    const badges = {
      email: "bg-blue-100 text-blue-800",
      mobile: "bg-green-100 text-green-800",
      Both: "bg-purple-100 text-purple-800",
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          badges[verification] || "bg-gray-100 text-gray-800"
        }`}
      >
        {verification}
      </span>
    );
  };

  const getAuthProviderBadge = (provider) => {
    const colors = {
      google: "bg-red-50 text-red-700 border border-red-200",
      facebook: "bg-blue-50 text-blue-700 border border-blue-200",
      apple: "bg-gray-50 text-gray-700 border border-gray-200",
      email: "bg-yellow-50 text-yellow-700 border border-yellow-200",
    };

    return (
      <span
        className={`px-2 py-1 rounded text-xs font-medium ${
          colors[provider] || "bg-gray-50 text-gray-700 border border-gray-200"
        }`}
      >
        {provider}
      </span>
    );
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(meta.totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-2 text-sm font-medium rounded-md ${
            currentPage === i
              ? "bg-blue-600 text-white"
              : "text-gray-700 hover:bg-gray-50 border border-gray-300"
          }`}
        >
          {i}
        </button>
      );
    }

    return pages;
  };

  if (loading) {
    return <Loader message="Loading customers details..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Auth Provider
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Verified Through
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {customers?.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          {/* {customer?.profile ? (
                            <img
                              className="h-12 w-12 rounded-full object-cover"
                              src={customer?.profile}
                              alt={customer?.name}
                              onError={(e) => {
                                e.target.style.display = "none";
                                e.target.nextSibling.style.display = "flex";
                              }}
                            />
                          ) : <div
                            className={`h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center ${
                              customer.profilePicture ? "hidden" : "flex"
                            }`}
                          >
                           <User className="h-6 w-6 text-gray-500" />
                          </div> } */}
                           <div
                            className={`h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center ${
                              customer.profilePicture ? "hidden" : "flex"
                            }`}
                          >

                          <User className="h-6 w-6 text-gray-500" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {customer?.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {customer.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getAuthProviderBadge(customer.authProvider)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getVerificationBadge(customer.is_verified_through)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty state */}
          {customers?.length === 0 && (
            <div className="text-center py-12">
              <User className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No customers
              </h3>
              <p className="mt-1 text-sm text-gray-500">No customers found.</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {meta?.totalPages >= 1 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-700">
              <span>
                Showing page {currentPage} of {meta?.totalPages}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </button>

              <div className="flex space-x-1">{renderPagination()}</div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === meta?.totalPages}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Customers;
