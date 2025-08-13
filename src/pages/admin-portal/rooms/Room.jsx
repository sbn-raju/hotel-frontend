import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  Bed, 
  Snowflake, 
  Droplets, 
  Wine, 
  Coffee, 
  Utensils, 
  Moon,
  X,
  Save,
  Eye,
  EyeOff,
  Upload,
  Image as ImageIcon,
  Star,
  AlertCircle,
} from 'lucide-react';
import Loader from '../../../components/loaders/Loader';
import { BASE_URI } from '../../../utils/BaseUrl.utils';
import { secureFetch } from '../../../helpers/secureFetch';

const Room = () => {
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [roomsPerPage] = useState(4); // Match API limit
  const [totalRooms, setTotalRooms] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState(null);
  const [imagePreviewModal, setImagePreviewModal] = useState({ show: false, images: [], currentIndex: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // API Base URL - adjust this to match your backend
  const API_BASE_URL = BASE_URI

  

  // Fetch rooms from API
  const fetchRooms = async (page = 1, limit = 4) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await secureFetch(`/room/fetch?page=${page}&limit=${limit}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        setRooms(result.data);
        setFilteredRooms(result.data);
        // If your API returns total count, use it. Otherwise estimate from current data
        if (result.total) {
          setTotalRooms(result.total);
        } else {
          // Estimate total based on current page data
          setTotalRooms(result.data.length === limit ? page * limit : (page - 1) * limit + result.data.length);
        }
      } else {
        throw new Error(result.message || 'Failed to fetch rooms');
      }
    } catch (error) {
      console.error('Error fetching rooms:', error);
      setError(error.message);
      // Fallback to sample data for demonstration
      const sampleRooms = [
        {
          _id: '1',
          room_type: 'Deluxe Suite',
          room_facilities: {
            room_bed_count: 2,
            room_ac: 'ac',
            room_hotWater: true,
            room_minibar: true
          },
          room_food: {
            breakfast: 'included',
            lunch: 'not-included',
            dinner: 'included'
          },
          room_price: 299,
          room_images_metadata: [
            { id: 1, url: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400', name: 'deluxe-1.jpg', isMain: true, isThumbnail: true },
            { id: 2, url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400', name: 'deluxe-2.jpg', isMain: false, isThumbnail: false }
          ]
        },
        {
          _id: '2',
          room_type: 'Standard Room',
          room_facilities: {
            room_bed_count: 1,
            room_ac: 'non-ac',
            room_hotWater: true,
            room_minibar: false
          },
          room_food: {
            breakfast: 'included',
            lunch: 'not-included',
            dinner: 'not-included'
          },
          room_price: 149,
          room_images_metadata: [
            { id: 4, url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400', name: 'standard-1.jpg', isMain: true, isThumbnail: true }
          ]
        }
      ];
      setRooms(sampleRooms);
      setFilteredRooms(sampleRooms);
      setTotalRooms(sampleRooms.length);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchRooms(currentPage, roomsPerPage);
  }, [currentPage, roomsPerPage]);

  const [formData, setFormData] = useState({
    room_type: '',
    room_facilities: {
      room_bed_count: 1,
      room_ac: 'non-ac',
      room_hotWater: false,
      room_minibar: false
    },
    room_food: {
      breakfast: 'not-included',
      lunch: 'not-included',
      dinner: 'not-included'
    },
    room_price: '',
    room_images: []
  });

  // Filter and search logic (client-side for now)
  useEffect(() => {
    let filtered = rooms;

    if (searchTerm) {
      filtered = filtered.filter(room => 
        room.room_type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterType !== 'all') {
      filtered = filtered.filter(room => room.room_facilities.room_ac === filterType);
    }

    setFilteredRooms(filtered);
  }, [searchTerm, filterType, rooms]);

  // Calculate pagination
  const totalPages = Math.ceil(totalRooms / roomsPerPage);

  const handlePageChange = async (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages && pageNumber !== currentPage) {
      setCurrentPage(pageNumber);
      // Fetch new data for the page
      await fetchRooms(pageNumber, roomsPerPage);
    }
  };

  const openModal = (mode, room = null) => {
    setModalMode(mode);
    setSelectedRoom(room);
    if (room) {
      // Handle both room_images and room_images_metadata
      const roomImages = room.room_images_metadata || room.room_images || [];
      // Convert API format to component format if needed
      const formattedImages = roomImages.map((img, index) => ({
        id: img._id || img.id || `img-${index}`,
        url: img.url || img.path || img,
        name: img.name || img.filename || `image-${index}.jpg`,
        isMain: img.isMain || index === 0,
        isThumbnail: img.isThumbnail || index === 0,
        file: null // Existing images don't have file objects
      }));
      
      setFormData({
        ...room,
        room_images: formattedImages
      });
    } else {
      setFormData({
        room_type: '',
        room_facilities: {
          room_bed_count: 1,
          room_ac: 'non-ac',
          room_hotWater: false,
          room_minibar: false
        },
        room_food: {
          breakfast: 'not-included',
          lunch: 'not-included',
          dinner: 'not-included'
        },
        room_price: '',
        room_images: []
      });
    }
    setShowModal(true);
  };

  // Image handling functions
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    files.forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const newImage = {
            id: Date.now() + Math.random(),
            url: event.target.result,
            name: file.name,
            file: file,
            isMain: formData.room_images.length === 0,
            isThumbnail: formData.room_images.length === 0
          };
          
          setFormData(prev => ({
            ...prev,
            room_images: [...prev.room_images, newImage]
          }));
        };
        reader.readAsDataURL(file);
      }
    });
    
    e.target.value = '';
  };

  const removeImage = (imageId) => {
    setFormData(prev => {
      const updatedImages = prev.room_images.filter(img => img.id !== imageId);
      const removedImage = prev.room_images.find(img => img.id === imageId);
      
      if (updatedImages.length > 0) {
        if (removedImage && (removedImage.isMain || removedImage.isThumbnail)) {
          updatedImages[0] = {
            ...updatedImages[0],
            isMain: removedImage.isMain ? true : updatedImages[0].isMain,
            isThumbnail: removedImage.isThumbnail ? true : updatedImages[0].isThumbnail
          };
        }
      }
      
      return {
        ...prev,
        room_images: updatedImages
      };
    });
  };

  const setAsMainImage = (imageId) => {
    setFormData(prev => ({
      ...prev,
      room_images: prev.room_images.map(img => ({
        ...img,
        isMain: img.id === imageId
      }))
    }));
  };

  const setAsThumbnail = (imageId) => {
    setFormData(prev => ({
      ...prev,
      room_images: prev.room_images.map(img => ({
        ...img,
        isThumbnail: img.id === imageId
      }))
    }));
  };

  const openImagePreview = (images, currentIndex = 0) => {
    setImagePreviewModal({
      show: true,
      images,
      currentIndex
    });
  };

  const handleSubmit = async () => {
    if (!formData.room_type || !formData.room_price) {
      alert('Please fill in all required fields');
      return;
    }

    if (formData.room_images.length === 0) {
      alert('Please upload at least one room image');
      return;
    }

    const hasThumbnail = formData.room_images.some(img => img.isThumbnail);
    if (!hasThumbnail) {
      alert('Please set at least one image as thumbnail');
      return;
    }
    
    const senderFormData = new FormData();

    senderFormData.append('room_type', formData.room_type);
    senderFormData.append('room_price', formData.room_price.toString());

    senderFormData.append('room_facilities[room_bed_count]', formData.room_facilities.room_bed_count.toString());
    senderFormData.append('room_facilities[room_ac]', formData.room_facilities.room_ac);
    senderFormData.append('room_facilities[room_hotWater]', formData.room_facilities.room_hotWater.toString());
    senderFormData.append('room_facilities[room_minibar]', formData.room_facilities.room_minibar.toString());

    senderFormData.append('room_food[breakfast]', formData.room_food.breakfast);
    senderFormData.append('room_food[lunch]', formData.room_food.lunch);
    senderFormData.append('room_food[dinner]', formData.room_food.dinner);

    // Handle images - only append new files, not existing ones
    const newImages = formData.room_images.filter(img => img.file !== null);
    const existingImages = formData.room_images.filter(img => img.file === null);
    
    newImages.forEach((imageData, index) => {
      if (imageData.file) {
        senderFormData.append('room_images', imageData.file);
        senderFormData.append(`image_metadata[${index}][name]`, imageData.name);
        senderFormData.append(`image_metadata[${index}][isMain]`, imageData.isMain.toString());
        senderFormData.append(`image_metadata[${index}][isThumbnail]`, imageData.isThumbnail.toString());
      }
    });

    // Send metadata for all images (new and existing)
    const imageMetadata = formData.room_images.map(img => ({
      id: img.id,
      name: img.name,
      isMain: img.isMain,
      isThumbnail: img.isThumbnail,
      url: img.url,
      isExisting: img.file === null
    }));
    senderFormData.append('image_metadata_json', JSON.stringify(imageMetadata));

    if (modalMode === 'edit' && selectedRoom) {
      senderFormData.append('room_id', selectedRoom._id || selectedRoom.id);
    }

    try {
      if (modalMode === 'create') {
        const response = await secureFetch(`/room/add`, {
          method: 'POST',
          body: senderFormData
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('Room added successfully:', result);
        
        // Refresh the current page data
        await fetchRooms(currentPage, roomsPerPage);
        
      } else {
        const roomId = selectedRoom._id || selectedRoom.id;
        const response = await secureFetch(`/room/update/${roomId}`, {
          method: 'PUT',
          body: senderFormData
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('Room updated successfully:', result);
        
        // Refresh the current page data
        await fetchRooms(currentPage, roomsPerPage);
      }
      
      setShowModal(false);
      
    } catch (error) {
      console.error('Error submitting room:', error);
      alert(`Failed to ${modalMode === 'create' ? 'add' : 'update'} room. Please try again.`);
    }
  };

  const handleDelete = (room) => {
    setRoomToDelete(room);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      const roomId = roomToDelete._id || roomToDelete.id;
      const response = await secureFetch(`/room/delete/${roomId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Refresh the current page data
      await fetchRooms(currentPage, roomsPerPage);
      
    } catch (error) {
      console.error('Error deleting room:', error);
      alert('Failed to delete room. Please try again.');
    }
    
    setShowDeleteConfirm(false);
    setRoomToDelete(null);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value
      }));
    }
  };

  const RoomCard = ({ room }) => {
    // Handle both room_images and room_images_metadata for backward compatibility
    const roomImages = room.room_images_metadata || room.room_images || [];
    const thumbnailImage = roomImages.find(img => img.isThumbnail) || roomImages[0];
    
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
        <div className="relative h-48 overflow-hidden rounded-t-xl">
          <img 
            src={thumbnailImage?.url || thumbnailImage?.path || 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400'} 
            alt={room.room_type}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-200 cursor-pointer"
            onClick={() => openImagePreview(roomImages, 0)}
          />
          {roomImages && roomImages.length > 1 && (
            <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-xs">
              +{roomImages.length - 1} more
            </div>
          )}
        </div>
        
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{room.room_type}</h3>
              <div className="text-3xl font-bold text-blue-600">${room.room_price}</div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => openModal('edit', room)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Edit size={16} />
              </button>
              <button
                onClick={() => handleDelete(room)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Bed size={16} className="text-gray-600" />
                <span className="text-sm text-gray-600">{room.room_facilities.room_bed_count} Bed(s)</span>
              </div>
              <div className="flex items-center space-x-2">
                <Snowflake size={16} className={room.room_facilities.room_ac === 'ac' ? 'text-blue-500' : 'text-gray-400'} />
                <span className="text-sm text-gray-600">{room.room_facilities.room_ac === 'ac' ? 'AC' : 'Non-AC'}</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Droplets size={16} className={room.room_facilities.room_hotWater ? 'text-blue-500' : 'text-gray-400'} />
                <span className="text-sm text-gray-600">Hot Water</span>
              </div>
              <div className="flex items-center space-x-2">
                <Wine size={16} className={room.room_facilities.room_minibar ? 'text-purple-500' : 'text-gray-400'} />
                <span className="text-sm text-gray-600">Minibar</span>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-100">
              <div className="text-sm text-gray-600 mb-2">Meals Included:</div>
              <div className="flex space-x-4">
                <div className="flex items-center space-x-1">
                  <Coffee size={14} className={room.room_food.breakfast === 'included' ? 'text-green-500' : 'text-gray-400'} />
                  <span className="text-xs">Breakfast</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Utensils size={14} className={room.room_food.lunch === 'included' ? 'text-green-500' : 'text-gray-400'} />
                  <span className="text-xs">Lunch</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Moon size={14} className={room.room_food.dinner === 'included' ? 'text-green-500' : 'text-gray-400'} />
                  <span className="text-xs">Dinner</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };


  if(loading){
    return <Loader message='Loading room details...'/>
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
    
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => openModal('create')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-colors"
            >
              <Plus size={20} />
              <span>Add Room</span>
            </button>
          
        </div>
     

      {/* Filters and Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex-1 max-w-lg">
              <div className="relative">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search rooms..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Filter size={16} className="text-gray-500" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="ac">AC Rooms</option>
                <option value="non-ac">Non-AC Rooms</option>
              </select>
            </div>
          </div>
        </div> */}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
              <p className="text-red-700">Error loading rooms: {error}</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <Loader className="animate-spin h-8 w-8 text-blue-600" />
            <span className="ml-2 text-gray-600">Loading rooms...</span>
          </div>
        )}

        {/* Room Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {filteredRooms.map(room => (
              <RoomCard key={room._id || room.id} room={room} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredRooms.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No rooms found</p>
            <p className="text-gray-400">Try adjusting your search or filters</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 0 && (
          <div className="flex justify-center items-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || loading}
              className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <ChevronLeft size={20} />
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                disabled={loading}
                className={`px-4 py-2 rounded-lg ${
                  currentPage === page
                    ? 'bg-blue-600 text-white'
                    : 'border border-gray-300 hover:bg-gray-50'
                } disabled:opacity-50`}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || loading}
              className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}

        {/* Pagination Info */}
        {totalRooms > 0 && (
          <div className="text-center mt-4 text-sm text-gray-600">
            Showing {((currentPage - 1) * roomsPerPage) + 1} to {Math.min(currentPage * roomsPerPage, totalRooms)} of {totalRooms} rooms
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white bg-opacity-95 backdrop-blur-md rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-white border-opacity-20">
            <div className="p-6 border-b border-gray-200 bg-white bg-opacity-90">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">
                  {modalMode === 'create' ? 'Add New Room' : 'Edit Room'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6 bg-white bg-opacity-90">
              {/* Room Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Room Type *
                </label>
                <input
                  type="text"
                  name="room_type"
                  value={formData.room_type}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Deluxe Suite"
                />
              </div>

              {/* Room Images Section */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Room Images *</h3>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Room Images
                  </label>
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-2 text-gray-500" />
                        <p className="text-sm text-gray-500">Click to upload room images</p>
                        <p className="text-xs text-gray-500">PNG, JPG, JPEG up to 10MB each</p>
                      </div>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {formData.room_images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                    {formData.room_images.map((image, index) => (
                      <div key={image.id} className="relative group">
                        <img
                          src={image.url}
                          alt={`Room ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                        />
                        
                        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center space-x-2">
                          <button
                            onClick={() => setAsMainImage(image.id)}
                            className={`p-2 rounded-full ${image.isMain ? 'bg-yellow-500 text-white' : 'bg-white text-gray-700'} hover:bg-yellow-400 hover:text-white transition-colors`}
                            title="Set as main image"
                          >
                            <Star size={16} />
                          </button>
                          <button
                            onClick={() => setAsThumbnail(image.id)}
                            className={`p-2 rounded-full ${image.isThumbnail ? 'bg-green-500 text-white' : 'bg-white text-gray-700'} hover:bg-green-400 hover:text-white transition-colors`}
                            title="Set as thumbnail"
                          >
                            <ImageIcon size={16} />
                          </button>
                          <button
                            onClick={() => removeImage(image.id)}
                            className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                            title="Remove image"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        
                        <div className="absolute top-2 left-2 space-y-1">
                          {image.isMain && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              <Star size={12} className="mr-1" />
                              Main
                            </span>
                          )}
                          {image.isThumbnail && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-1">
                              <ImageIcon size={12} className="mr-1" />
                              Thumbnail
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Room Facilities */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Room Facilities</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bed Count
                    </label>
                    <input
                      type="number"
                      name="room_facilities.room_bed_count"
                      min={1}
                      value={formData.room_facilities.room_bed_count}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      AC Type
                    </label>
                    <select
                      name="room_facilities.room_ac"
                      value={formData.room_facilities.room_ac}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="ac">AC</option>
                      <option value="non-ac">Non-AC</option>
                    </select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="room_facilities.room_hotWater"
                      checked={formData.room_facilities.room_hotWater}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                    <label className="text-sm font-medium text-gray-700">
                      Hot Water
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="room_facilities.room_minibar"
                      checked={formData.room_facilities.room_minibar}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                    <label className="text-sm font-medium text-gray-700">
                      Minibar
                    </label>
                  </div>
                </div>
              </div>

              {/* Meals */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Meals</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Breakfast
                    </label>
                    <select
                      name="room_food.breakfast"
                      value={formData.room_food.breakfast}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="included">Included</option>
                      <option value="not-included">Not Included</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Lunch
                    </label>
                    <select
                      name="room_food.lunch"
                      value={formData.room_food.lunch}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="included">Included</option>
                      <option value="not-included">Not Included</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dinner
                    </label>
                    <select
                      name="room_food.dinner"
                      value={formData.room_food.dinner}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="included">Included</option>
                      <option value="not-included">Not Included</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price per Night (USD) *
                </label>
                <input
                  type="number"
                  name="room_price"
                  value={formData.room_price}
                  onChange={handleInputChange}
                  required
                  min={1}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="e.g., 299"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-4 bg-white bg-opacity-90">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-6 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 flex items-center space-x-2"
              >
                <Save size={18} />
                <span>{modalMode === 'create' ? 'Add Room' : 'Save Changes'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {imagePreviewModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-lg w-full relative">
            <button
              onClick={() => setImagePreviewModal({ ...imagePreviewModal, show: false })}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
            <img
              src={imagePreviewModal.images[imagePreviewModal.currentIndex]?.path}
              alt="Room Preview"
              className="w-full h-80 object-contain rounded-lg mb-4"
            />
            <div className="flex justify-between items-center">
              <button
                onClick={() =>
                  setImagePreviewModal((prev) => ({
                    ...prev,
                    currentIndex:
                      prev.currentIndex === 0
                        ? prev.images.length - 1
                        : prev.currentIndex - 1,
                  }))
                }
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
                disabled={imagePreviewModal.images.length <= 1}
              >
                <ChevronLeft size={20} />
              </button>
              <span className="text-sm text-gray-600">
                {imagePreviewModal.currentIndex + 1} / {imagePreviewModal.images.length}
              </span>
              <button
                onClick={() =>
                  setImagePreviewModal((prev) => ({
                    ...prev,
                    currentIndex:
                      prev.currentIndex === prev.images.length - 1
                        ? 0
                        : prev.currentIndex + 1,
                  }))
                }
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
                disabled={imagePreviewModal.images.length <= 1}
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6">
            <div className="flex items-center space-x-3 mb-4">
              <AlertCircle size={28} className="text-red-500" />
              <h3 className="text-lg font-bold text-gray-900">Delete Room</h3>
            </div>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete the room{' '}
              <span className="font-semibold">{roomToDelete?.room_type}</span>? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700"
              >
                Delete Room
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Room;