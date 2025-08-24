import React, { useState, useEffect } from 'react';
import { Edit2, Save, X, AlertCircle, CheckCircle, Bed, Users, Home, DollarSign, RefreshCw } from 'lucide-react';

const ExtrasLogDashboard = () => {
  const [record, setRecord] = useState({
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
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedRecord, setEditedRecord] = useState({...record});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [hasData, setHasData] = useState(false);

  // API base URL
  const API_BASE_URL = 'https://hotel-backend-production-a5b0.up.railway.app/api/v1.hotel/extras';

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

  // Fetch the single record
  const fetchRecord = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/all`);
      const result = await response.json();
      
      if (result.success && result.data && result.data.length > 0) {
        const data = result.data[0]; // Get the first (and presumably only) record
        setRecord(data);
        setEditedRecord(data);
        setHasData(true);
        showMessage('Data loaded successfully');
      } else {
        setHasData(false);
        showMessage('No data found - you can create initial data', 'info');
      }
    } catch (error) {
      console.error('Error fetching record:', error);
      showMessage('Failed to connect to server', 'error');
      setHasData(false);
    } finally {
      setLoading(false);
    }
  };

  // Load record on component mount
  useEffect(() => {
    fetchRecord();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedRecord(prev => ({
      ...prev,
      [name]: name === 'id' ? value : Number(value) || 0
    }));
  };

  const startEditing = () => {
    setEditedRecord({...record});
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setEditedRecord({...record});
    setIsEditing(false);
  };

  const handleSave = async () => {
    // Basic validation
    if (!hasData && !editedRecord.id) {
      showMessage('ID is required for new records', 'error');
      return;
    }
    
    setLoading(true);
    try {
      let response;
      let url;
      let method;
      let body;

      if (hasData && record.id) {
        // Update existing record
        url = `${API_BASE_URL}/update?id=${record.id}`;
        method = 'PUT';
        body = JSON.stringify({
          extra_bed_cost: editedRecord.extra_bed_cost,
          extra_person_cost: editedRecord.extra_person_cost,
          total_rooms: editedRecord.total_rooms,
          total_rooms_booked: editedRecord.total_rooms_booked,
          total_rooms_available: editedRecord.total_rooms_available,
          total_extra_beds: editedRecord.total_extra_beds,
          total_extra_persons: editedRecord.total_extra_persons,
          total_4bedrooms_available: editedRecord.total_4bedrooms_available,
          total_2bedrooms_available: editedRecord.total_2bedrooms_available,
          total_3bedrooms_available: editedRecord.total_3bedrooms_available
        });
      } else {
        // Add new record
        url = `${API_BASE_URL}/add`;
        method = 'POST';
        body = JSON.stringify(editedRecord);
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
        showMessage(hasData ? 'Record updated successfully' : 'Record created successfully');
        setRecord(editedRecord);
        setHasData(true);
        setIsEditing(false);
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

  const tileData = [
    {
      title: 'Extra Bed Cost',
      value: record.extra_bed_cost,
      editValue: editedRecord.extra_bed_cost,
      name: 'extra_bed_cost',
      icon: Bed,
      color: 'blue',
      prefix: '₹'
    },
    {
      title: 'Extra Person Cost',
      value: record.extra_person_cost,
      editValue: editedRecord.extra_person_cost,
      name: 'extra_person_cost',
      icon: Users,
      color: 'green',
      prefix: '₹'
    },
    {
      title: 'Total Rooms',
      value: record.total_rooms,
      editValue: editedRecord.total_rooms,
      name: 'total_rooms',
      icon: Home,
      color: 'purple'
    },
    {
      title: 'Rooms Booked',
      value: record.total_rooms_booked,
      editValue: editedRecord.total_rooms_booked,
      name: 'total_rooms_booked',
      icon: CheckCircle,
      color: 'red'
    },
    {
      title: 'Rooms Available',
      value: record.total_rooms_available,
      editValue: editedRecord.total_rooms_available,
      name: 'total_rooms_available',
      icon: Home,
      color: 'orange'
    },
    {
      title: 'Extra Beds',
      value: record.total_extra_beds,
      editValue: editedRecord.total_extra_beds,
      name: 'total_extra_beds',
      icon: Bed,
      color: 'indigo'
    },
    {
      title: 'Extra Persons',
      value: record.total_extra_persons,
      editValue: editedRecord.total_extra_persons,
      name: 'total_extra_persons',
      icon: Users,
      color: 'pink'
    },
    {
      title: '4-Bedroom Available',
      value: record.total_4bedrooms_available,
      editValue: editedRecord.total_4bedrooms_available,
      name: 'total_4bedrooms_available',
      icon: Home,
      color: 'teal'
    },
    {
      title: '3-Bedroom Available',
      value: record.total_3bedrooms_available,
      editValue: editedRecord.total_3bedrooms_available,
      name: 'total_3bedrooms_available',
      icon: Home,
      color: 'cyan'
    },
    {
      title: '2-Bedroom Available',
      value: record.total_2bedrooms_available,
      editValue: editedRecord.total_2bedrooms_available,
      name: 'total_2bedrooms_available',
      icon: Home,
      color: 'amber'
    }
  ];

  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-600',
    green: 'bg-green-50 border-green-200 text-green-600',
    purple: 'bg-purple-50 border-purple-200 text-purple-600',
    red: 'bg-red-50 border-red-200 text-red-600',
    orange: 'bg-orange-50 border-orange-200 text-orange-600',
    indigo: 'bg-indigo-50 border-indigo-200 text-indigo-600',
    pink: 'bg-pink-50 border-pink-200 text-pink-600',
    teal: 'bg-teal-50 border-teal-200 text-teal-600',
    cyan: 'bg-cyan-50 border-cyan-200 text-cyan-600',
    amber: 'bg-amber-50 border-amber-200 text-amber-600'
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            {/* <div>
              <h1 className="text-3xl font-bold text-gray-900">Hotel Extras Management</h1>
              <p className="text-gray-600 mt-2">Manage your hotel's extra services and room availability</p>
            </div> */}
            <div className="flex gap-3">
              <button
                onClick={fetchRecord}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
              >
                <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                Refresh
              </button>
              {/* {!isEditing ? (
                <button
                  onClick={startEditing}
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  <Edit2 size={20} />
                  {hasData ? 'Edit' : 'Create'}
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={cancelEditing}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
                  >
                    <X size={20} />
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <Save size={20} />
                    )}
                    Save
                  </button>
                </div>
              )} */}
            </div>
          </div>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center gap-2">
            <CheckCircle size={20} />
            {success}
          </div>
        )}
        
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center gap-2">
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        {/* ID Card */}
        {/* {(hasData || isEditing) && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-200">
            <div className="flex items-center gap-3">
              <DollarSign className="text-gray-600" size={24} />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">Record ID</h3>
                {isEditing && !hasData ? (
                  <input
                    type="text"
                    name="id"
                    value={editedRecord.id}
                    onChange={handleInputChange}
                    placeholder="Enter unique ID"
                    className="mt-1 w-full max-w-md px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-2xl font-mono text-gray-700 mt-1">
                    {record.id || 'Not set'}
                  </p>
                )}
              </div>
            </div>
          </div>
        )} */}

        {/* Loading State */}
        {loading && !isEditing && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600 text-lg">Loading data...</p>
          </div>
        )}

        {/* No Data State */}
        {!loading && !hasData && !isEditing && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <AlertCircle className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Data Found</h3>
            <p className="text-gray-600 mb-6">There are no extras records in the system yet.</p>
            <button
              onClick={startEditing}
              className="flex items-center gap-2 mx-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Edit2 size={20} />
              Create Initial Record
            </button>
          </div>
        )}

        {hasData && !loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">Occupancy Rate</h3>
              <p className="text-3xl font-bold">
                {record.total_rooms > 0 
                  ? `${Math.round((record.total_rooms_booked / record.total_rooms) * 100)}%`
                  : '0%'
                }
              </p>
              <p className="text-blue-100 mt-1">
                {record.total_rooms_booked} / {record.total_rooms} rooms
              </p>
            </div>

            <div className="bg-gradient-to-br from-red-400 to-red-600 rounded-lg shadow-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">Total Revenue</h3>
              <p className="text-3xl font-bold">
                ₹{(record.total_extra_beds * record.extra_bed_cost) + (record.total_extra_persons * record.extra_person_cost)}
              </p>
              <p className="text-green-100 mt-1">
                From bookings
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">Extra Revenue</h3>
              <p className="text-3xl font-bold">
                ₹{(record.total_extra_beds * record.extra_bed_cost) + (record.total_extra_persons * record.extra_person_cost)}
              </p>
              <p className="text-green-100 mt-1">
                From extras
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">Total Available</h3>
              <p className="text-3xl font-bold">
                {record.total_4bedrooms_available + record.total_3bedrooms_available + record.total_2bedrooms_available}
              </p>
              <p className="text-purple-100 mt-1">
                All bedroom types
              </p>
            </div>
          </div>
        )}

        {/* Data Tiles */}
        {(hasData || isEditing) && !loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {tileData.map((tile) => {
              const IconComponent = tile.icon;
              const colorClass = colorClasses[tile.color];
              
              return (
                <div key={tile.name} className={`bg-white rounded-lg shadow-sm border-2 ${colorClass} p-6`}>
                  <div className="flex items-center justify-between mb-4">
                    <IconComponent className="text-current" size={24} />
                    {isEditing && (
                      <Edit2 className="text-gray-400" size={16} />
                    )}
                  </div>
                  
                  <h3 className="text-sm font-medium text-gray-700 mb-2">{tile.title}</h3>
                  
                  {isEditing ? (
                    <input
                      type="number"
                      name={tile.name}
                      value={tile.editValue}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full text-2xl font-bold bg-transparent border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-2xl font-bold text-current">
                      {tile.prefix}{tile.value}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Summary Statistics */}
        
      </div>
    </div>
  );
};

export default ExtrasLogDashboard;