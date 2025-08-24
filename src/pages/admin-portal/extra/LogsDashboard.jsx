import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, Search, ChevronLeft, ChevronRight, AlertCircle, CheckCircle } from 'lucide-react';

const ExtrasLogDashboard = () => {
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(10);
  
  const [formData, setFormData] = useState({
    id: '',
    extra_bed_cost: 0,
    extra_person_cost: 0,
    total_rooms: 0,
    total_rooms_booked: 0,
    total_rooms_available: 0,
    total_extra_beds: 0,
    total_extra_persons: 0,
    total_4bedrooms_available: 0,
    total_2bedrooms_available: 0,
    total_3bedrooms_available: 0
  });

  // API base URL - adjust this to match your backend
  const API_BASE_URL = 'https://hotel-backend-production-a5b0.up.railway.app/api/v1.hotel/extras'; // Change this to your actual API URL

  // Show message helper
  const showMessage = (message, type = 'success') => {
    if (type === 'success') {
      setSuccess(message);
      setError('');
      setTimeout(() => setSuccess(''), 5000);
    } else {
      setError(message);
      setSuccess('');
      setTimeout(() => setError(''), 5000);
    }
  };

  // Fetch all records from API
  const fetchRecords = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/all`);
      const result = await response.json();
      
      if (result.success) {
        setRecords(result.data);
        setFilteredRecords(result.data);
        showMessage('Records fetched successfully');
      } else {
        showMessage(result.message || 'Failed to fetch records', 'error');
      }
    } catch (error) {
      console.error('Error fetching records:', error);
      showMessage('Failed to connect to server', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Load records on component mount
  useEffect(() => {
    fetchRecords();
  }, []);

  // Filter records based on search term
  useEffect(() => {
    const filtered = records.filter(record =>
      (record.id && record.id.toLowerCase().includes(searchTerm.toLowerCase())) ||
      record.extra_bed_cost.toString().includes(searchTerm) ||
      record.extra_person_cost.toString().includes(searchTerm) ||
      record.total_rooms.toString().includes(searchTerm) ||
      record.total_rooms_booked.toString().includes(searchTerm) ||
      record.total_rooms_available.toString().includes(searchTerm)
    );
    setFilteredRecords(filtered);
    setCurrentPage(1); // Reset to first page when searching
  }, [searchTerm, records]);

  // Pagination calculations
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredRecords.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'id' ? value : Number(value) || 0
    }));
  };

  const resetForm = () => {
    setFormData({
      id: '',
      extra_bed_cost: 0,
      extra_person_cost: 0,
      total_rooms: 0,
      total_rooms_booked: 0,
      total_rooms_available: 0,
      total_extra_beds: 0,
      total_extra_persons: 0,
      total_4bedrooms_available: 0,
      total_2bedrooms_available: 0,
      total_3bedrooms_available: 0
    });
    setEditingRecord(null);
  };

  const openModal = (record = null) => {
    if (record) {
      setFormData({ ...record });
      setEditingRecord(record);
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleSubmit = async () => {
    // Basic validation
    if (!editingRecord && !formData.id) {
      showMessage('ID is required for new records', 'error');
      return;
    }
    
    setLoading(true);
    try {
      let response;
      let url;
      let method;
      let body;

      if (editingRecord) {
        // Update existing record
        url = `${API_BASE_URL}/update?id=${editingRecord.id}`;
        method = 'PUT';
        body = JSON.stringify({
          extra_bed_cost: formData.extra_bed_cost,
          extra_person_cost: formData.extra_person_cost,
          total_rooms: formData.total_rooms,
          total_rooms_booked: formData.total_rooms_booked,
          total_rooms_available: formData.total_rooms_available,
          total_extra_beds: formData.total_extra_beds,
          total_extra_persons: formData.total_extra_persons,
          total_4bedrooms_available: formData.total_4bedrooms_available,
          total_2bedrooms_available: formData.total_2bedrooms_available,
          total_3bedrooms_available: formData.total_3bedrooms_available
        });
      } else {
        // Add new record
        url = `${API_BASE_URL}/add`;
        method = 'POST';
        body = JSON.stringify(formData);
      }

      response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: body
      });

      const result = await response.json();
      
      if (result.success) {
        showMessage(editingRecord ? 'Record updated successfully' : 'Record created successfully');
        await fetchRecords(); // Refresh the data
        closeModal();
      } else {
        showMessage(result.message || 'Operation failed', 'error');
      }
    } catch (error) {
      console.error('Error saving record:', error);
      showMessage('Failed to save record', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this record?')) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/extraslog/delete?id=${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();
      
      if (result.success) {
        showMessage('Record deleted successfully');
        await fetchRecords(); // Refresh the data
      } else {
        showMessage(result.message || 'Failed to delete record', 'error');
      }
    } catch (error) {
      console.error('Error deleting record:', error);
      showMessage('Failed to delete record', 'error');
    } finally {
      setLoading(false);
    }
  };

  const formFields = [
    { name: 'extra_bed_cost', label: 'Extra Bed Cost', type: 'number' },
    { name: 'extra_person_cost', label: 'Extra Person Cost', type: 'number' },
    { name: 'total_rooms', label: 'Total Rooms', type: 'number' },
    { name: 'total_rooms_booked', label: 'Total Rooms Booked', type: 'number' },
    { name: 'total_rooms_available', label: 'Total Rooms Available', type: 'number' },
    { name: 'total_extra_beds', label: 'Total Extra Beds', type: 'number' },
    { name: 'total_extra_persons', label: 'Total Extra Persons', type: 'number' },
    { name: 'total_4bedrooms_available', label: '4-Bedroom Rooms Available', type: 'number' },
    { name: 'total_2bedrooms_available', label: '2-Bedroom Rooms Available', type: 'number' },
    { name: 'total_3bedrooms_available', label: '3-Bedroom Rooms Available', type: 'number' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Success/Error Messages */}
        {success && (
          <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center gap-2">
            <CheckCircle size={20} />
            {success}
          </div>
        )}
        
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center gap-2">
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        {/* Records Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {loading && (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Loading...</p>
            </div>
          )}
          
          {!loading && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bed Cost</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Person Cost</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Rooms</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booked</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Available</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Extra Beds</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Extra Persons</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">4BR</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">2BR</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">3BR</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentRecords.map((record) => (
                    <tr key={record._id || record.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 text-sm text-gray-900 font-mono">
                        {record.id ? (record.id.length > 8 ? `${record.id.slice(0, 8)}...` : record.id) : `${record?._id}`}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900">₹{record.extra_bed_cost}</td>
                      <td className="px-4 py-4 text-sm text-gray-900">₹{record.extra_person_cost}</td>
                      <td className="px-4 py-4 text-sm text-gray-900">{record.total_rooms}</td>
                      <td className="px-4 py-4 text-sm text-gray-900">{record.total_rooms_booked}</td>
                      <td className="px-4 py-4 text-sm text-gray-900">{record.total_rooms_available}</td>
                      <td className="px-4 py-4 text-sm text-gray-900">{record.total_extra_beds}</td>
                      <td className="px-4 py-4 text-sm text-gray-900">{record.total_extra_persons}</td>
                      <td className="px-4 py-4 text-sm text-gray-900">{record.total_4bedrooms_available}</td>
                      <td className="px-4 py-4 text-sm text-gray-900">{record.total_2bedrooms_available}</td>
                      <td className="px-4 py-4 text-sm text-gray-900">{record.total_3bedrooms_available}</td>
                      <td className="px-4 py-4 text-sm text-gray-900">
                        <div className="flex gap-2">
                          <button
                            onClick={() => openModal(record)}
                            disabled={loading}
                            className="text-blue-600 hover:text-blue-800 transition-colors disabled:opacity-50"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(record.id)}
                            disabled={loading}
                            className="text-red-600 hover:text-red-800 transition-colors disabled:opacity-50"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {filteredRecords.length === 0 && !loading && (
                <div className="text-center py-12">
                  <p className="text-gray-500">No records found</p>
                </div>
              )}
            </div>
          )}

          {/* Pagination */}
          {filteredRecords.length > recordsPerPage && (
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">{indexOfFirstRecord + 1}</span> to{' '}
                      <span className="font-medium">
                        {Math.min(indexOfLastRecord, filteredRecords.length)}
                      </span>{' '}
                      of <span className="font-medium">{filteredRecords.length}</span> results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      
                      {/* Page numbers */}
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            currentPage === page
                              ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                      
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Records</h3>
            <p className="text-3xl font-bold text-blue-600">{records.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Rooms</h3>
            <p className="text-3xl font-bold text-green-600">
              {records.reduce((sum, record) => sum + (record.total_rooms || 0), 0)}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Available Rooms</h3>
            <p className="text-3xl font-bold text-orange-600">
              {records.reduce((sum, record) => sum + (record.total_rooms_available || 0), 0)}
            </p>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingRecord ? 'Edit Record' : 'Add New Record'}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* ID Field */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ID {!editingRecord && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type="text"
                    name="id"
                    value={formData.id}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    readOnly={!!editingRecord}
                    placeholder={editingRecord ? "ID cannot be changed" : "Enter unique ID"}
                  />
                </div>

                {/* Dynamic Form Fields */}
                {formFields.map((field) => (
                  <div key={field.name}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="0"
                    />
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-4 mt-8">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={loading}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <Save size={20} />
                  )}
                  {loading ? 'Processing...' : (editingRecord ? 'Update' : 'Create')} Record
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExtrasLogDashboard;