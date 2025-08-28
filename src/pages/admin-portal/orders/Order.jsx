import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit, 
  Trash2, 
  Package, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  RefreshCw,
  Calendar,
  DollarSign,
  User,
  MapPin,
  X,
  Users,
  Phone,
  Mail,
  CreditCard,
  Info
} from 'lucide-react';

const OrderDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [checkInStartDate, setCheckInStartDate] = useState('');
  const [checkInEndDate, setCheckInEndDate] = useState('');
  const [checkOutStartDate, setCheckOutStartDate] = useState('');
  const [checkOutEndDate, setCheckOutEndDate] = useState('');

  // Base API URL - Updated to match your API endpoint
  const API_BASE_URL = 'https://hotel-backend-production-a5b0.up.railway.app/api/v1.hotel/payment';

  // Fetch orders from API
  const fetchOrders = async (page = 1, limit = 10, status = '', search = '', startDate = '', endDate = '', checkInStart = '', checkInEnd = '', checkOutStart = '', checkOutEnd = '') => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      // Add filters to params
      if (status && status !== 'all' && status !== '') {
        params.append('status', status);
      }

      if (search && search.trim() !== '') {
        params.append('search', search.trim());
      }

      if (startDate) {
        params.append('startDate', startDate);
      }

      if (endDate) {
        params.append('endDate', endDate);
      }

      if (checkInStart) {
        params.append('checkInStart', checkInStart);
      }

      if (checkInEnd) {
        params.append('checkInEnd', checkInEnd);
      }

      if (checkOutStart) {
        params.append('checkOutStart', checkOutStart);
      }

      if (checkOutEnd) {
        params.append('checkOutEnd', checkOutEnd);
      }

      const url = `${API_BASE_URL}/fetch?${params.toString()}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setOrders(data.data);
        setTotalOrders(data.meta.total);
        setTotalPages(data.meta.pages);
      } else {
        throw new Error(data.message || 'Failed to fetch orders');
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err.message || 'Failed to load orders');
      setOrders([]);
      setTotalOrders(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  // Initial load and when filters change
  useEffect(() => {
    fetchOrders(currentPage, itemsPerPage, statusFilter, searchTerm, startDate, endDate, checkInStartDate, checkInEndDate, checkOutStartDate, checkOutEndDate);
  }, [currentPage, itemsPerPage, statusFilter]);

  // Search with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (currentPage === 1) {
        fetchOrders(1, itemsPerPage, statusFilter, searchTerm, startDate, endDate, checkInStartDate, checkInEndDate, checkOutStartDate, checkOutEndDate);
      } else {
        setCurrentPage(1);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Status styling
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'success': return 'bg-green-100 text-green-800';
      case 'created': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'failed': return <XCircle className="h-4 w-4" />;
      case 'success': return <CheckCircle className="h-4 w-4" />;
      case 'created': return <Info className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  // Format order data for display
  const formatOrderData = (order) => {
    const orderResponse = order.order_response || {};
    const amount = orderResponse.amount ? (orderResponse.amount / 100) : 0;
    
    return {
      id: order.order_id,
      customer: {
        name: order.user_id?.name || 'N/A',
        email: order.user_id?.email || 'N/A',
      },
      total: amount,
      status: order.status,
      orderDate: new Date(order.createdAt).toLocaleDateString(),
      orderResponse: orderResponse,
      rawOrder: order
    };
  };

  // Handle refresh
  const handleRefresh = () => {
    fetchOrders(currentPage, itemsPerPage, statusFilter, searchTerm, startDate, endDate, checkInStartDate, checkInEndDate, checkOutStartDate, checkOutEndDate);
  };

  // Handle status filter change
  const handleStatusFilterChange = (newStatus) => {
    setStatusFilter(newStatus);
    setCurrentPage(1);
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // Handle items per page change
  const handleItemsPerPageChange = (newLimit) => {
    setItemsPerPage(newLimit);
    setCurrentPage(1);
  };

  // Handle filter submit
  const handleFilterSubmit = () => {
    setCurrentPage(1);
    fetchOrders(1, itemsPerPage, statusFilter, searchTerm, startDate, endDate, checkInStartDate, checkInEndDate, checkOutStartDate, checkOutEndDate);
  };

  // Handle clear filters
  const handleClearFilters = () => {
    setStartDate('');
    setEndDate('');
    setCheckInStartDate('');
    setCheckInEndDate('');
    setCheckOutStartDate('');
    setCheckOutEndDate('');
    setStatusFilter('');
    setSearchTerm('');
    setCurrentPage(1);
    setTimeout(() => {
      fetchOrders(1, itemsPerPage, '', '', '', '', '', '', '', '');
    }, 100);
  };

  // Export orders
  const handleExport = async () => {
    try {
      const dataStr = JSON.stringify(orders, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `orders_${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    } catch (err) {
      setError('Failed to export orders');
    }
  };

  // Order details modal handler
  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  // Format currency
  const formatCurrency = (amount) => {
    return `₹${(amount / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      {/* Backdrop blur when modal is open */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40"></div>
      )}

      {/* Header */}
      <div className="">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex space-x-3">
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <button 
                onClick={handleExport}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
              <button
                onClick={() => setError(null)}
                className="ml-auto text-red-400 hover:text-red-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="bg-white shadow rounded-xl p-4 mb-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Filters</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {/* Status Filter */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-600 mb-1">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => handleStatusFilterChange(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="success">Success</option>
                  <option value="failed">Failed</option>
                  <option value="created">Created</option>
                </select>
              </div>

              {/* Order Date Range */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-600 mb-1">Order From</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-600 mb-1">Order To</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Check-in Date Range */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-600 mb-1">Check-in From</label>
                <input
                  type="date"
                  value={checkInStartDate}
                  onChange={(e) => setCheckInStartDate(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-600 mb-1">Check-in To</label>
                <input
                  type="date"
                  value={checkInEndDate}
                  onChange={(e) => setCheckInEndDate(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Check-out Date Range - NEW */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-600 mb-1">Check-out From</label>
                <input
                  type="date"
                  value={checkOutStartDate}
                  onChange={(e) => setCheckOutStartDate(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Second row for check-out end date */}
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mt-4">
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-600 mb-1">Check-out To</label>
                <input
                  type="date"
                  value={checkOutEndDate}
                  onChange={(e) => setCheckOutEndDate(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={handleClearFilters}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                Clear
              </button>
              <button
                onClick={handleFilterSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Apply
              </button>
            </div>

            {/* Active Filters */}
            {(startDate || endDate || checkInStartDate || checkInEndDate || checkOutStartDate || checkOutEndDate || statusFilter) && (
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="text-sm text-gray-600">Active filters:</span>
                {startDate && (
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                    Order From: {new Date(startDate).toLocaleDateString()}
                  </span>
                )}
                {endDate && (
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                    Order To: {new Date(endDate).toLocaleDateString()}
                  </span>
                )}
                {checkInStartDate && (
                  <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">
                    Check-in From: {new Date(checkInStartDate).toLocaleDateString()}
                  </span>
                )}
                {checkInEndDate && (
                  <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">
                    Check-in To: {new Date(checkInEndDate).toLocaleDateString()}
                  </span>
                )}
                {checkOutStartDate && (
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                    Check-out From: {new Date(checkOutStartDate).toLocaleDateString()}
                  </span>
                )}
                {checkOutEndDate && (
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                    Check-out To: {new Date(checkOutEndDate).toLocaleDateString()}
                  </span>
                )}
                {statusFilter && (
                  <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs">
                    Status: {statusFilter}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Orders Table */}
        <div className="mt-6 overflow-hidden">
          {orders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No orders found</p>
              {(startDate || endDate || checkInStartDate || checkInEndDate || checkOutStartDate || checkOutEndDate || statusFilter || searchTerm) && (
                <button
                  onClick={handleClearFilters}
                  className="mt-2 text-blue-600 hover:text-blue-800"
                >
                  Clear all filters
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 bg-white rounded-lg shadow">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Check-in Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Check-out Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created Date
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders?.map((order) => {
                    const formattedOrder = formatOrderData(order);
                    const checkInDate = order.order_response?.notes?.[0]?.checkIn;
                    const checkOutDate = order.order_response?.notes?.[0]?.checkOut;
                    return (
                      <tr key={order._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {formattedOrder.id}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {/* <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <User className="h-5 w-5 text-gray-500" />
                            </div> */}
                            <div >
                              <div className="text-sm font-medium text-gray-900">
                                {formattedOrder.customer.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {formattedOrder.customer.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(formattedOrder.status)}`}>
                            {getStatusIcon(formattedOrder.status)}
                            <span className="ml-1 capitalize">{formattedOrder.status}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="text-sm font-medium text-gray-900">
                              ₹{formattedOrder.total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                            <span className="text-sm text-gray-900">
                              {checkInDate ? new Date(checkInDate).toLocaleDateString() : 'N/A'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 text-green-400 mr-1" />
                            <span className="text-sm text-gray-900">
                              {checkOutDate ? new Date(checkOutDate).toLocaleDateString() : 'N/A'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                            <span className="text-sm text-gray-900">{formattedOrder.orderDate}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <button 
                              onClick={() => handleViewOrder(order)}
                              className="text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-50"
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-4 rounded-b-lg">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing page <span className="font-medium">{currentPage}</span> of{' '}
                    <span className="font-medium">{totalPages}</span> ({totalOrders} total orders)
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    
                    {/* Page numbers */}
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            pageNum === currentPage
                              ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

                    <button
                      onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 backdrop-blur-md bg-black/40 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="">
              <div className="absolute inset-0" onClick={closeModal}></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              {/* Modal Header */}
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Order Details - {selectedOrder.order_id}
                  </h3>
                  <button
                    onClick={closeModal}
                    className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Modal Content */}
                <div className="mt-4 space-y-6">
                  {/* Order Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Basic Order Info */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <CreditCard className="h-5 w-5 mr-2" />
                        Order Information
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Order ID:</span>
                          <span className="font-medium">{selectedOrder.order_id}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Status:</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.status)}`}>
                            {selectedOrder.status}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Receipt:</span>
                          <span className="font-medium">{selectedOrder.order_response?.receipt || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Created:</span>
                          <span className="font-medium">{formatDate(selectedOrder.createdAt)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Updated:</span>
                          <span className="font-medium">{formatDate(selectedOrder.updatedAt)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Customer Info */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <User className="h-5 w-5 mr-2" />
                        Customer Information
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Name:</span>
                          <span className="font-medium">{selectedOrder.user_id?.name || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Email:</span>
                          <span className="font-medium">{selectedOrder.user_id?.email || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Customer ID:</span>
                          <span className="font-medium">{selectedOrder.user_id?._id || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment Details */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <DollarSign className="h-5 w-5 mr-2" />
                      Payment Details
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600 block">Total Amount:</span>
                        <span className="font-semibold text-lg text-green-600">
                          {formatCurrency(selectedOrder.order_response?.amount || 0)}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600 block">Amount Due:</span>
                        <span className="font-medium text-red-600">
                          {formatCurrency(selectedOrder.order_response?.amount_due || 0)}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600 block">Amount Paid:</span>
                        <span className="font-medium text-green-600">
                          {formatCurrency(selectedOrder.order_response?.amount_paid || 0)}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600 block">Currency:</span>
                        <span className="font-medium">{selectedOrder.order_response?.currency || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-gray-600 block">Attempts:</span>
                        <span className="font-medium">{selectedOrder.order_response?.attempts || 0}</span>
                      </div>
                      <div>
                        <span className="text-gray-600 block">Entity:</span>
                        <span className="font-medium">{selectedOrder.order_response?.entity || 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Booking Details */}
                  {selectedOrder.order_response?.notes?.[0] && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <Calendar className="h-5 w-5 mr-2" />
                        Booking Details
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600 block">Check-in Date:</span>
                          <span className="font-medium">
                            {new Date(selectedOrder.order_response.notes[0].checkIn).toLocaleDateString()}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600 block">Check-out Date:</span>
                          <span className="font-medium">
                            {new Date(selectedOrder.order_response.notes[0].checkOut).toLocaleDateString()}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600 block">Room ID:</span>
                          <span className="font-medium">{selectedOrder.order_response.notes[0].roomId}</span>
                        </div>
                        <div>
                          <span className="text-gray-600 block">Mobile Number:</span>
                          <span className="font-medium flex items-center">
                            <Phone className="h-4 w-4 mr-1" />
                            {selectedOrder.order_response.notes[0].mobileNo}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600 block">Booking Email:</span>
                          <span className="font-medium flex items-center">
                            <Mail className="h-4 w-4 mr-1" />
                            {selectedOrder.order_response.notes[0].userEmail}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600 block">Guest Name:</span>
                          <span className="font-medium">{selectedOrder.order_response.notes[0].userName}</span>
                        </div>
                      </div>

                      {/* Guest Information */}
                      {selectedOrder.order_response.notes[0].guests && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <h5 className="font-medium text-gray-900 mb-2 flex items-center">
                            <Users className="h-4 w-4 mr-2" />
                            Guest Information
                          </h5>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                            <div className="bg-white p-2 rounded border">
                              <span className="text-gray-600 block">Adults:</span>
                              <span className="font-semibold text-blue-600">
                                {selectedOrder.order_response.notes[0].guests.adults}
                              </span>
                            </div>
                            <div className="bg-white p-2 rounded border">
                              <span className="text-gray-600 block">Children:</span>
                              <span className="font-semibold text-green-600">
                                {selectedOrder.order_response.notes[0].guests.children}
                              </span>
                            </div>
                            <div className="bg-white p-2 rounded border">
                              <span className="text-gray-600 block">Infants:</span>
                              <span className="font-semibold text-purple-600">
                                {selectedOrder.order_response.notes[0].guests.infants}
                              </span>
                            </div>
                            <div className="bg-white p-2 rounded border">
                              <span className="text-gray-600 block">Total:</span>
                              <span className="font-semibold text-gray-900">
                                {selectedOrder.order_response.notes[0].guests.total}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Duration and Pricing */}
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <h5 className="font-medium text-gray-900 mb-2">Stay Duration</h5>
                        <div className="text-sm text-gray-600">
                          {(() => {
                            const checkIn = new Date(selectedOrder.order_response.notes[0].checkIn);
                            const checkOut = new Date(selectedOrder.order_response.notes[0].checkOut);
                            const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
                            return (
                              <span className="font-medium text-indigo-600">
                                {nights} night{nights !== 1 ? 's' : ''}
                              </span>
                            );
                          })()}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Raw Order Data (Collapsible) */}
                  <details className="bg-gray-50 p-4 rounded-lg">
                    <summary className="font-semibold text-gray-900 cursor-pointer hover:text-gray-700">
                      Raw Order Data (Click to expand)
                    </summary>
                    <div className="mt-3">
                      <pre className="text-xs bg-white p-3 rounded border overflow-auto max-h-60">
                        {JSON.stringify(selectedOrder, null, 2)}
                      </pre>
                    </div>
                  </details>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={closeModal}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const dataStr = JSON.stringify(selectedOrder, null, 2);
                    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
                    const exportFileDefaultName = `order_${selectedOrder.order_id}.json`;
                    const linkElement = document.createElement('a');
                    linkElement.setAttribute('href', dataUri);
                    linkElement.setAttribute('download', exportFileDefaultName);
                    linkElement.click();
                  }}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDashboard;