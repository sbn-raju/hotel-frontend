import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { secureFetch } from '../../helpers/secureFetch';
import { BASE_URI, SELF_URI } from '../../utils/BaseUrl.utils';
import toast from 'react-hot-toast';
import Razorpay from 'razorpay';
import useAuth from '../../hooks/AuthHooks';
import Footer from '../landing/Footer';

export default function HotelCheckout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { authState } = useAuth();
  
  const [checkoutData, setCheckoutData] = useState(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    email: '',
    phone: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
      const storedData = sessionStorage.getItem('checkoutData');
      console.log("This is the Stored data of the checkout: ", storedData);
      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData);
          console.log('Checkout data from sessionStorage:', parsedData);
          setCheckoutData(parsedData);
          setIsDataLoaded(true);
        } catch (error) {
          console.error('Error parsing stored checkout data:', error);
          toast.error('Invalid checkout data. Please start booking again.');
          navigate('/');
        }
      }else{
        navigate('/');
      }
  }, [navigate]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const getRoomFeatures = () => {
    if (!checkoutData?.roomData?.room_facilities) return [];
    
    const facilities = checkoutData.roomData.room_facilities;
    const features = [];
    
    if (facilities.room_ac === 'ac') features.push('AC');
    if (facilities.room_bed_count) features.push(`${facilities.room_bed_count} Bed${facilities.room_bed_count > 1 ? 's' : ''}`);
    if (facilities.room_hotWater) features.push('Hot Water');
    if (facilities.room_minibar) features.push('Minibar');
    
    return features;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    
    if (!isFormValid) {
      setIsLoading(false);
      return;
    }

    if (!checkoutData) {
      toast.error('Booking data is missing. Please try again.');
      setIsLoading(false);
      return;
    }

    try {
      const orderPayload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        room_id: checkoutData.roomId,
        user_id: authState?.id,
        check_in: checkoutData.bookingDetails.checkInDate,
        check_out: checkoutData.bookingDetails.checkOutDate,
        guests: checkoutData.bookingDetails.guests,
        pricing: checkoutData.pricing,
        room_facilities: checkoutData.roomData.room_facilities,
        food_inclusions: checkoutData.foodInclusions,
        rooms: checkoutData?.bookingDetails?.rooms
      };

      console.log('Order payload:', orderPayload);

      const result = await fetch(`${BASE_URI}/payment/get-order`, {
        method: "POST",
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify(orderPayload)
      });

      const response = await result.json();

      if (response?.success && response?.data) {
        const orderDetails = response.data;
        
        if (!orderDetails) {
          toast.error("Failed to create payment order");
          return;
        }

        const options = {
          "key": `${import.meta.env.VITE_RAZORPAY_CLIENT_ID}`,
          "amount": orderDetails.amount,
          "currency": "INR",
          "name": "Hotel Booking",
          "description": `Booking for ${checkoutData?.roomData?.room_type}`,
          "image": "/images/logo.PNG",
          "order_id": orderDetails?.id,  
          "callback_url": `${SELF_URI}/payment-success?order_id=${orderDetails.id}`,
          "prefill": {
            "name": formData.name,
            "email": formData.email,
            "contact": formData.phone,
          },
          "notes": {
            "room_id": checkoutData.roomId,
            "check_in": checkoutData.bookingDetails.checkInDate,
            "check_out": checkoutData.bookingDetails.checkOutDate,
            "guests": JSON.stringify(checkoutData.bookingDetails.guests)
          },
          "theme": {
            "color": "#3399cc",
          },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
        
      } else {
        toast.error(response?.message || "Failed to create payment order");
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = formData.name.trim() && formData.address.trim() && formData.phone.trim() && formData.email.trim();

  if (!isDataLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-12 h-12 border-3 border-blue-200 rounded-full animate-pulse"></div>
            <div className="w-12 h-12 border-3 border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
          </div>
          <p className="text-slate-600 mt-4 text-base font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="max-w-5xl mx-auto mb-4">
        <div className="grid lg:grid-cols-5 gap-4 lg:gap-6">
          {/* Room Details Card */}
          <div className="lg:col-span-3 flex flex-col">
            <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-4 h-full transition-all duration-300 hover:shadow-xl flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold text-gray-900">Your Booking</h2>
              </div>
              
              {/* Room Image */}
              <div className="relative mb-3 group">
                <img 
                  src={checkoutData.images?.[0] || "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=400&h=200&fit=crop"}
                  alt={checkoutData.roomData.room_type}
                  className="w-full h-28 object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=400&h=200&fit=crop";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-lg"></div>
                <div className="absolute bottom-2 left-2 text-white">
                  <h3 className="text-sm font-bold drop-shadow-lg">{checkoutData.roomData.room_type}</h3>
                </div>
              </div>

              {/* Booking Details */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="flex items-center space-x-2 p-2 bg-blue-50 rounded-lg">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-blue-600 text-xs font-medium">Check-in</p>
                    <p className="font-semibold text-gray-900 text-xs">{formatDate(checkoutData.bookingDetails.checkInDate)}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 p-2 bg-purple-50 rounded-lg">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-purple-600 text-xs font-medium">Check-out</p>
                    <p className="font-semibold text-gray-900 text-xs">{formatDate(checkoutData.bookingDetails.checkOutDate)}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 p-2 bg-green-50 rounded-lg">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-green-600 text-xs font-medium">Guests</p>
                    <p className="font-semibold text-gray-900 text-xs">
                      {checkoutData.bookingDetails.guests.adults} Adult{checkoutData.bookingDetails.guests.adults > 1 ? 's' : ''}
                      {checkoutData.bookingDetails.guests.children > 0 && `, ${checkoutData.bookingDetails.guests.children} Child${checkoutData.bookingDetails.guests.children > 1 ? 'ren' : ''}`}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 p-2 bg-orange-50 rounded-lg">
                  <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-orange-600 text-xs font-medium">Duration</p>
                    <p className="font-semibold text-gray-900 text-xs">{checkoutData.pricing.nights} nights</p>
                  </div>
                </div>
              </div>

              {/* Room Features */}
              {getRoomFeatures().length > 0 && (
                <div className="mb-3">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Features</h3>
                  <div className="flex flex-wrap gap-1">
                    {getRoomFeatures().map((feature, index) => (
                      <div key={index} className="flex items-center space-x-1 px-2 py-1 bg-blue-50 rounded-md border border-blue-100">
                        <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                        <span className="text-blue-900 font-medium text-xs">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Food Inclusions */}
              {checkoutData.foodInclusions.length > 0 && (
                <div className="mb-3">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Meals</h3>
                  <div className="flex flex-wrap gap-1">
                    {checkoutData.foodInclusions.map((meal, index) => (
                      <div key={index} className="flex items-center space-x-1 px-2 py-1 bg-green-100 rounded-md border border-green-200">
                        <svg className="w-2 h-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-green-800 font-medium text-xs">{meal}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Price Breakdown */}
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Price</h3>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">₹{checkoutData.pricing.basePrice.toLocaleString()} × {checkoutData.pricing.nights} nights</span>
                    <span className="font-semibold text-gray-900">₹{checkoutData.pricing.subtotal.toLocaleString()}</span>
                  </div>
                  {checkoutData.pricing.cleaningFee > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Cleaning fee</span>
                      <span className="font-semibold text-gray-900">₹{checkoutData.pricing.cleaningFee.toLocaleString()}</span>
                    </div>
                  )}
                  {checkoutData.pricing.serviceFee > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Service fee</span>
                      <span className="font-semibold text-gray-900">₹{checkoutData.pricing.serviceFee.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Taxes ({checkoutData.pricing.taxRate}%)</span>
                    <span className="font-semibold text-gray-900">₹{checkoutData.pricing.taxes.toLocaleString()}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-1 mt-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-gray-900">Total</span>
                      <span className="font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">₹{checkoutData.pricing.totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Guest Details Form */}
          <div className="lg:col-span-2 flex flex-col">
            <div className="flex-1 bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-4 sticky top-4 transition-all duration-300 hover:shadow-xl flex flex-col">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h2 className="text-lg font-bold text-gray-900">Guest Details</h2>
              </div>
              
              <div className="space-y-3">
                {/* Name Field */}
                <div className="space-y-1">
                  <label htmlFor="name" className="block text-xs font-semibold text-gray-700">
                    Full Name *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 pl-8 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-900 placeholder-gray-400 text-sm bg-white/50"
                      placeholder="Enter your full name"
                      required
                    />
                    <svg className="absolute left-2 top-2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>

                {/* Email Field */}
                <div className="space-y-1">
                  <label htmlFor="email" className="block text-xs font-semibold text-gray-700">
                    Email Address *
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 pl-8 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-900 placeholder-gray-400 text-sm bg-white/50"
                      placeholder="Enter your email"
                      required
                    />
                    <svg className="absolute left-2 top-2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                </div>

                {/* Address Field */}
                <div className="space-y-1">
                  <label htmlFor="address" className="block text-xs font-semibold text-gray-700">
                    Address *
                  </label>
                  <div className="relative">
                    <textarea
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows={2}
                      className="w-full px-3 py-2 pl-8 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-900 placeholder-gray-400 resize-none text-sm bg-white/50"
                      placeholder="Enter your address"
                      required
                    />
                    <svg className="absolute left-2 top-2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                  </div>
                </div>

                {/* Phone Field */}
                <div className="space-y-1">
                  <label htmlFor="phone" className="block text-xs font-semibold text-gray-700">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 pl-8 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-900 placeholder-gray-400 text-sm bg-white/50"
                      placeholder="+91 98765 43210"
                      required
                    />
                    <svg className="absolute left-2 top-2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!isFormValid || isLoading}
                  className={`w-full py-3 px-4 rounded-lg font-bold text-white transition-all transform ${
                    isFormValid && !isLoading
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl'
                      : 'bg-gray-300 cursor-not-allowed'
                  } relative overflow-hidden text-sm`}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Processing...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <span>Pay ₹{checkoutData.pricing.totalAmount.toLocaleString()}</span>
                    </div>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer/>

      <style jsx>{`
        .border-3 {
          border-width: 3px;
        }
      `}</style>
    </div>
  );
}