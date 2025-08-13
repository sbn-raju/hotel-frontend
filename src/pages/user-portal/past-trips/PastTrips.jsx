import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  MapPin, 
  Calendar, 
  Users, 
  CreditCard, 
  ArrowUpRight, 
  ArrowDownLeft, 
  User,
  Search,
  Filter,
  Star,
  Heart,
  Share,
  MoreHorizontal,
  Eye,
  RotateCcw
} from 'lucide-react';

const PastTrips = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'
  const bookingsPerPage = 6;

  // Sample bookings data with enhanced properties
  const allBookings = [
    {
      id: 1,
      title: 'Cozy Downtown Apartment',
      location: 'New York, NY',
      dates: 'Jul 20-23, 2024',
      guests: 2,
      price: 245,
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop',
      host: 'Sarah M.',
      rating: 4.9,
      reviews: 127,
      status: 'completed',
      category: 'Apartment'
    },
    {
      id: 2,
      title: 'Beachfront Villa',
      location: 'Malibu, CA',
      dates: 'Jul 10-17, 2024',
      guests: 4,
      price: 450,
      image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop',
      host: 'Michael K.',
      rating: 4.8,
      reviews: 89,
      status: 'completed',
      category: 'Villa'
    },
    {
      id: 3,
      title: 'Mountain Cabin Retreat',
      location: 'Aspen, CO',
      dates: 'Jun 28 - Jul 5, 2024',
      guests: 6,
      price: 320,
      image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop',
      host: 'Emma L.',
      rating: 5.0,
      reviews: 156,
      status: 'completed',
      category: 'Cabin'
    },
    {
      id: 4,
      title: 'Urban Loft',
      location: 'San Francisco, CA',
      dates: 'Jun 15-18, 2024',
      guests: 2,
      price: 180,
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop',
      host: 'David R.',
      rating: 4.7,
      reviews: 94,
      status: 'completed',
      category: 'Loft'
    },
    {
      id: 5,
      title: 'Historic Brownstone',
      location: 'Boston, MA',
      dates: 'Jun 8-12, 2024',
      guests: 3,
      price: 210,
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop',
      host: 'Lisa P.',
      rating: 4.6,
      reviews: 73,
      status: 'completed',
      category: 'Townhouse'
    },
    {
      id: 6,
      title: 'Desert Oasis',
      location: 'Phoenix, AZ',
      dates: 'May 25-30, 2024',
      guests: 4,
      price: 275,
      image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop',
      host: 'Carlos M.',
      rating: 4.9,
      reviews: 112,
      status: 'completed',
      category: 'Villa'
    },
    {
      id: 7,
      title: 'Lakeside Cottage',
      location: 'Lake Tahoe, CA',
      dates: 'May 18-22, 2024',
      guests: 5,
      price: 380,
      image: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=400&h=300&fit=crop',
      host: 'Jennifer S.',
      rating: 4.8,
      reviews: 145,
      status: 'completed',
      category: 'Cottage'
    }
  ];

  // Filter and sort bookings
  const filteredBookings = allBookings
    .filter(booking => 
      booking.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.location.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-high':
          return b.price - a.price;
        case 'price-low':
          return a.price - b.price;
        case 'rating':
          return b.rating - a.rating;
        default:
          return b.id - a.id; // recent first
      }
    });

  // Pagination logic
  const totalPages = Math.ceil(filteredBookings.length / bookingsPerPage);
  const startIndex = (currentPage - 1) * bookingsPerPage;
  const currentBookings = filteredBookings.slice(startIndex, startIndex + bookingsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const formatDate = (dateString) => {
    return dateString;
  };

  // Grid Card Component
  const GridCard = ({ booking }) => (
    <div className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:border-gray-200 transition-all duration-300">
      <div className="relative">
        <img
          src={booking.image}
          alt={booking.title}
          className="w-full h-48 sm:h-56 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3 flex space-x-2">
          <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors">
            <Heart className="w-4 h-4 text-gray-600" />
          </button>
          <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors">
            <Share className="w-4 h-4 text-gray-600" />
          </button>
        </div>
        <div className="absolute top-3 left-3">
          <span className="px-2 py-1 bg-emerald-500 text-white text-xs font-medium rounded-full">
            {booking.category}
          </span>
        </div>
      </div>
      
      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-bold text-gray-900 text-base sm:text-lg truncate pr-2">
            {booking.title}
          </h3>
          <div className="text-right flex-shrink-0">
            <p className="font-bold text-gray-900 text-lg">${booking.price}</p>
            <p className="text-xs text-gray-500">total</p>
          </div>
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="truncate">{booking.location}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
            <span>{booking.dates}</span>
          </div>
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-2" />
              <span>{booking.guests} guests</span>
            </div>
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 mr-1" />
              <span className="font-medium">{booking.rating}</span>
              <span className="text-gray-400 ml-1">({booking.reviews})</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <button className="flex-1 bg-gradient-to-r from-rose-500 to-pink-600 text-white py-2.5 px-4 rounded-xl font-medium hover:from-rose-600 hover:to-pink-700 transition-all mr-2">
            Book Again
          </button>
          <button className="p-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
            <Eye className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );

  // List Card Component
  const ListCard = ({ booking }) => (
    <div className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:border-gray-200 transition-all duration-300">
      <div className="flex flex-col sm:flex-row">
        <div className="relative sm:w-48 sm:flex-shrink-0">
          <img
            src={booking.image}
            alt={booking.title}
            className="w-full h-48 sm:h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 right-3 sm:top-3 sm:right-3">
            <span className="px-2 py-1 bg-emerald-500 text-white text-xs font-medium rounded-full">
              {booking.category}
            </span>
          </div>
        </div>
        
        <div className="flex-1 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3">
            <div className="mb-3 sm:mb-0">
              <h3 className="font-bold text-gray-900 text-lg sm:text-xl mb-2">
                {booking.title}
              </h3>
              <div className="flex items-center text-sm text-gray-500 mb-2">
                <User className="w-4 h-4 mr-1" />
                <span>Hosted by {booking.host}</span>
                <div className="flex items-center ml-4">
                  <Star className="w-4 h-4 text-yellow-400 mr-1" />
                  <span className="font-medium text-gray-900">{booking.rating}</span>
                  <span className="text-gray-400 ml-1">({booking.reviews} reviews)</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-gray-900 text-xl">${booking.price}</p>
              <p className="text-sm text-gray-500">total</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="w-4 h-4 mr-2 text-gray-400" />
              <span>{booking.location}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="w-4 h-4 mr-2 text-gray-400" />
              <span>{booking.dates}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Users className="w-4 h-4 mr-2 text-gray-400" />
              <span>{booking.guests} guests</span>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
            <button className="flex-1 bg-gradient-to-r from-rose-500 to-pink-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-rose-600 hover:to-pink-700 transition-all">
              <RotateCcw className="w-4 h-4 mr-2 inline" />
              Book Again
            </button>
            <button className="flex-1 border border-gray-200 py-3 px-6 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
              <Eye className="w-4 h-4 mr-2 inline" />
              View Details
            </button>
            <button className="sm:w-auto px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
              <MoreHorizontal className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-sm">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Past Trips</h2>
              <p className="text-gray-600">Your travel memories</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-xl">
              <span className="font-semibold">{allBookings.length}</span>
              <span className="text-blue-100 ml-1">trips</span>
            </div>
          </div>
        </div>

        {/* Search and Controls */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search trips by location or property name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
            />
          </div>
          
          <div className="flex gap-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent bg-white min-w-0"
            >
              <option value="recent">Most Recent</option>
              <option value="price-high">Price: High to Low</option>
              <option value="price-low">Price: Low to High</option>
              <option value="rating">Highest Rated</option>
            </select>
            
            <div className="flex border border-gray-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-3 ${viewMode === 'list' ? 'bg-rose-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'} transition-colors`}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 16a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-3 ${viewMode === 'grid' ? 'bg-rose-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'} transition-colors`}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      {currentBookings.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No trips found</h3>
          <p className="text-gray-600">Try adjusting your search or filters</p>
        </div>
      ) : (
        <>
          {/* Bookings Grid/List */}
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8"
            : "space-y-6 mb-8"
          }>
            {currentBookings.map((booking) => (
              viewMode === 'grid' 
                ? <GridCard key={booking.id} booking={booking} />
                : <ListCard key={booking.id} booking={booking} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                Showing {startIndex + 1} to {Math.min(startIndex + bookingsPerPage, filteredBookings.length)} of {filteredBookings.length} trips
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                
                {[...Array(totalPages)].map((_, index) => {
                  const page = index + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                        currentPage === page
                          ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-sm'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8 pt-8 border-t border-gray-200">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Total Trips</p>
              <p className="text-2xl font-bold text-blue-900">{allBookings.length}</p>
            </div>
            <Calendar className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Total Spent</p>
              <p className="text-2xl font-bold text-green-900">
                ${allBookings.reduce((sum, booking) => sum + booking.price, 0)}
              </p>
            </div>
            <CreditCard className="w-8 h-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-violet-100 p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium">Avg Rating</p>
              <p className="text-2xl font-bold text-purple-900">
                {(allBookings.reduce((sum, booking) => sum + booking.rating, 0) / allBookings.length).toFixed(1)}
              </p>
            </div>
            <Star className="w-8 h-8 text-purple-500" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-orange-50 to-amber-100 p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600 font-medium">Total Guests</p>
              <p className="text-2xl font-bold text-orange-900">
                {allBookings.reduce((sum, booking) => sum + booking.guests, 0)}
              </p>
            </div>
            <Users className="w-8 h-8 text-orange-500" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PastTrips;