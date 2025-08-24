import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  Calendar,
  MapPin,
  Users,
  Wifi,
  Car,
  Coffee,
  ChevronLeft,
  ChevronRight,
  User,
  Heart,
  Share2,
  Grid3x3,
  X,
  Shield,
  Home,
  Medal,
  Thermometer,
  Droplets,
  Wine,
  Bed,
  Heater,
  RefrigeratorIcon,
  CoffeeIcon,
  Sparkles,
  CheckCircle,
  Building,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { BASE_FILE_URI, BASE_URI } from "../../utils/BaseUrl.utils";
import Loader from "../../components/loaders/Loader";
import toast from "react-hot-toast";
import Footer from "../landing/Footer";

const RoomDetailsPage = () => {
  const [selectedImages, setSelectedImages] = useState(0);
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [selectedDates, setSelectedDates] = useState({
    startDate: null,
    endDate: null,
  });
  const [guests, setGuests] = useState({ adults: 2, children: 0, infants: 0 });
  const [rooms, setRooms] = useState(1);
  const [showGuestPicker, setShowGuestPicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [roomData, setRoomData] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  // Default fallback images if no images are available
  const fallbackImages = [
    "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&h=500&fit=crop",
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=500&fit=crop",
    "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&h=500&fit=crop",
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=500&fit=crop",
    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=500&fit=crop",
  ];

  // Convert image paths to display URLs - Fixed the URL construction
  const getImageUrls = (imageMetadata) => {
    if (!imageMetadata || imageMetadata.length === 0) {
      return fallbackImages;
    }

    // Sort images to put main/thumbnail first
    const sortedImages = [...imageMetadata].sort((a, b) => {
      if (a.isMain) return -1;
      if (b.isMain) return 1;
      if (a.isThumbnail) return -1;
      if (b.isThumbnail) return 1;
      return 0;
    });

    // Convert file paths to URLs - Fixed the logic here
    const imageUrls = sortedImages.map((img) => {
      // Extract filename from path - handle both Windows and Unix paths
      let filename;
      if (img.path.includes("uploads\\")) {
        filename = img.path.split("uploads\\")[1];
      } else if (img.path.includes("/uploads/")) {
        filename = img.path.split("/uploads/")[1];
      } else {
        filename = img.path.split("/").pop();
      }

      // Fixed the localhost typo and URL construction
      return `${BASE_FILE_URI}/${filename}`;
    });

    // Fill with fallback images if we don't have enough
    while (imageUrls.length < 5) {
      imageUrls.push(fallbackImages[imageUrls.length % fallbackImages.length]);
    }

    return imageUrls.slice(0, 5);
  };

  // Getting the room information from the data
  const fetchRoomDetails = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${BASE_URI}/room/get?id=${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch room details");
      }
      const data = await response.json();
      console.log("Room data:", data);

      if (data.success && data.data) {
        setRoomData(data.data);
      } else {
        toast.error("Room not found");
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRoomDetails();
  }, [id]);

  const [images, setImages] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [basePrice, setBasePrice] = useState(100);
  // Removed weekend pricing since all days have same price
  const [cleaningFee, setCleaningFee] = useState(0);
  const [serviceFee, setServiceFee] = useState(0);
  const [cgst, setCgst] = useState(9);
  const [sgst, setSgst] = useState(9);
  const [totalTax, setTotalTax] = useState(18);

  useEffect(() => {
    if (!roomData) return;

    console.log("Setting up room data:", roomData);

    setImages(getImageUrls(roomData?.room_images_metadata));
  }, [roomData]);

  // Add debugging and click-outside functionality for guest picker
  useEffect(() => {
    console.log("Guest picker state:", showGuestPicker);
    console.log("Current guests:", guests);

    const handleClickOutside = (event) => {
      // Check if click is outside the guest picker
      if (showGuestPicker && !event.target.closest(".guest-picker-container")) {
        setShowGuestPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showGuestPicker, guests]);

  // Helper function to check if food is included
  const getFoodInclusions = () => {
    if (!roomData?.room_food) return [];

    const inclusions = [];
    const food = roomData.room_food;

    if (
      food.breakfast === "included" ||
      food.breakfast === true ||
      food.breakfast === "yes"
    ) {
      inclusions.push("Breakfast");
    }
    if (
      food.lunch === "included" ||
      food.lunch === true ||
      food.lunch === "yes"
    ) {
      inclusions.push("Lunch");
    }
    if (
      food.dinner === "included" ||
      food.dinner === true ||
      food.dinner === "yes"
    ) {
      inclusions.push("Dinner");
    }

    return inclusions;
  };

  // Booking validation and submission
  const validateBookingForm = () => {
    if (!selectedDates.startDate || !selectedDates.endDate) {
      toast.error("Please select check-in and check-out dates");
      return false;
    }

    if (selectedDates.startDate >= selectedDates.endDate) {
      toast.error("Check-out date must be after check-in date");
      return false;
    }

    if (guests.adults < 1) {
      toast.error("At least one adult is required");
      return false;
    }

    if (rooms < 1) {
      toast.error("At least one room is required");
      return false;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (new Date(selectedDates.startDate) < today) {
      toast.error("Check-in date cannot be in the past");
      return false;
    }

    return true;
  };

  // Handle date changes
  const handleDateChange = (field, value) => {
    setSelectedDates(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Get minimum date (today)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Get minimum checkout date (day after checkin)
  const getMinCheckoutDate = () => {
    if (!selectedDates.startDate) return getMinDate();
    const checkin = new Date(selectedDates.startDate);
    checkin.setDate(checkin.getDate() + 1);
    return checkin.toISOString().split('T')[0];
  };

  // Alternative approach: Store data in sessionStorage (if you need to persist across page refreshes)
  const handleBookNowWithSessionStorage = async () => {
    if (!validateBookingForm()) {
      return;
    }

    setIsBooking(true);

    try {
      const checkoutData = {
        roomId: id,
        roomData: {
          room_type: roomData.room_type,
          room_facilities: roomData.room_facilities,
          room_food: roomData.room_food,
          room_images_metadata: roomData.room_images_metadata,
        },
        bookingDetails: {
          checkInDate: selectedDates.startDate,
          checkOutDate: selectedDates.endDate,
          guests: {
            adults: guests.adults,
            children: guests.children,
            infants: guests.infants,
            total: guests.adults + guests.children,
          },
          rooms: rooms,
        },
        pricing: {
          basePrice: roomData?.room_price,
          nights: getDaysBetween(),
          subtotal: calculateSubtotal(),
          cleaningFee: cleaningFee,
          serviceFee: serviceFee,
          taxes: calculateTaxes(),
          cgst: Math.round(calculateTaxes() / 2),
          sgst: Math.round(calculateTaxes() / 2),
          taxRate: totalTax,
          totalAmount: calculateTotal(),
        },
        foodInclusions: getFoodInclusions(),
        images: images,
        timestamp: new Date().toISOString(),
      };

      // Store checkout data in sessionStorage
      sessionStorage.setItem("checkoutData", JSON.stringify(checkoutData));

      // Navigate to checkout page
      navigate("/room/checkout");
    } catch (error) {
      console.error("Checkout navigation error:", error);
      toast.error("Failed to proceed to checkout. Please try again.");
    } finally {
      setIsBooking(false);
    }
  };

  if (isLoading) {
    return <Loader message="Loading room details..." />;
  }

  if (!roomData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center p-6 bg-white rounded-xl shadow-lg border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Room not found
          </h2>
          <p className="text-gray-600">
            The room you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </div>
    );
  };

  // Fixed calculation - simple multiplication of nights by room price
  const calculateSubtotal = () => {
    if (
      !selectedDates.startDate ||
      !selectedDates.endDate ||
      !roomData?.room_price
    )
      return 0;

    const nights = getDaysBetween();
    const roomPrice = roomData.room_price;
    const subtotal = nights * roomPrice * rooms;

    console.log(`Calculation: ${nights} nights × ₹${roomPrice} × ${rooms} rooms = ₹${subtotal}`);
    return subtotal;
  };

  const getDaysBetween = () => {
    if (!selectedDates.startDate || !selectedDates.endDate) return 0;
    const start = new Date(selectedDates.startDate);
    const end = new Date(selectedDates.endDate);
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  };

  const calculateTaxes = () => {
    const subtotal = calculateSubtotal();
    return Math.round((subtotal + cleaningFee + serviceFee) * (totalTax / 100));
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const taxes = calculateTaxes();
    return subtotal + cleaningFee + serviceFee + taxes;
  };

  // Updated updateGuests function with better logic and debugging
  const updateGuests = (type, operation) => {
    console.log(`Updating ${type} ${operation}`); // Debug log

    setGuests((prev) => {
      const newGuests = { ...prev };

      if (operation === "increment") {
        // Set reasonable limits
        const limits = { adults: 10, children: 8, infants: 4 };
        if (newGuests[type] < limits[type]) {
          newGuests[type] = prev[type] + 1;
        }
      } else if (operation === "decrement") {
        if (type === "adults" && prev[type] > 1) {
          // Minimum 1 adult required
          newGuests[type] = prev[type] - 1;
        } else if (type !== "adults" && prev[type] > 0) {
          // Children and infants can go to 0
          newGuests[type] = prev[type] - 1;
        }
      }

      console.log("New guests:", newGuests); // Debug log
      return newGuests;
    });
  };

  // Function to format guest display with split numbers
  const formatGuestDisplay = () => {
    const parts = [];
    if (guests.adults > 0) {
      parts.push(`${guests.adults} Adult${guests.adults > 1 ? 's' : ''}`);
    }
    if (guests.children > 0) {
      parts.push(`${guests.children} Child${guests.children > 1 ? 'ren' : ''}`);
    }
    if (guests.infants > 0) {
      parts.push(`${guests.infants} Infant${guests.infants > 1 ? 's' : ''}`);
    }
    return parts.join(', ') || '0 Guests';
  };

  return (
    <div className="min-h-screen">
      {/* Photo Gallery Modal */}
      <AnimatePresence>
        {showAllPhotos && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center"
          >
            <div className="max-w-4xl mx-auto p-4">
              <button
                onClick={() => setShowAllPhotos(false)}
                className="absolute top-4 right-4 text-white p-2 hover:bg-white/20 rounded-full transition-colors duration-200"
              >
                <X size={20} />
              </button>
              <div className="grid gap-3">
                {images.map((image, index) => (
                  <motion.img
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    src={image}
                    alt={`Room ${index + 1}`}
                    className="w-full max-h-80 object-cover rounded-xl shadow-2xl"
                    onError={(e) => {
                      e.target.src =
                        fallbackImages[index % fallbackImages.length];
                    }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4"
        >
          <h1 className="text-3xl font-bold mb-1">{roomData.room_type}</h1>
        </motion.div>

        {/* Photo Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="grid grid-cols-4 gap-2 h-80 rounded-xl overflow-hidden shadow-xl">
            <div className="col-span-2 row-span-2">
              <img
                src={images[0]}
                alt="Main room"
                className="w-full h-full object-cover cursor-pointer hover:brightness-90 transition-all duration-300"
                onClick={() => setShowAllPhotos(true)}
                onError={(e) => {
                  e.target.src = fallbackImages[0];
                }}
              />
            </div>
            <div className="grid gap-2">
              <img
                src={images[1]}
                alt="Room view"
                className="w-full h-full object-cover cursor-pointer hover:brightness-90 transition-all duration-300"
                onClick={() => setShowAllPhotos(true)}
                onError={(e) => {
                  e.target.src = fallbackImages[1];
                }}
              />
              <img
                src={images[2]}
                alt="Room detail"
                className="w-full h-full object-cover cursor-pointer hover:brightness-90 transition-all duration-300"
                onClick={() => setShowAllPhotos(true)}
                onError={(e) => {
                  e.target.src = fallbackImages[2];
                }}
              />
            </div>
            <div className="grid gap-2">
              <img
                src={images[3]}
                alt="Room amenity"
                className="w-full h-full object-cover cursor-pointer hover:brightness-90 transition-all duration-300"
                onClick={() => setShowAllPhotos(true)}
                onError={(e) => {
                  e.target.src = fallbackImages[3];
                }}
              />
              <div className="relative">
                <img
                  src={images[4]}
                  alt="Room feature"
                  className="w-full h-full object-cover cursor-pointer hover:brightness-90 transition-all duration-300"
                  onClick={() => setShowAllPhotos(true)}
                  onError={(e) => {
                    e.target.src = fallbackImages[4];
                  }}
                />
                <button
                  onClick={() => setShowAllPhotos(true)}
                  className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-center justify-center text-white font-semibold hover:from-black/60 transition-all duration-300"
                >
                  <Grid3x3 className="mr-2" size={14} />
                  Show all photos
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Enhanced Amenities */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="py-2 border-b border-gray-200"
            >
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-purple-500" />
                <h3 className="text-xl font-bold text-gray-800">
                  Room Features
                </h3>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {/* AC Status */}
                {roomData?.room_facilities?.room_ac === "ac" && (
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center gap-3 p-3 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg border border-cyan-200 shadow-sm"
                  >
                    <div className="p-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full">
                      <Thermometer className="text-white" size={16} />
                    </div>
                    <div>
                      <span className="font-semibold text-gray-800 text-sm">
                        Air Conditioned
                      </span>
                      <p className="text-xs text-gray-600">
                        Climate controlled comfort
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Bed Count */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200 shadow-sm"
                >
                  <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
                    <Bed className="text-white" size={16} />
                  </div>
                  <div>
                    <span className="font-semibold text-gray-800 text-sm">
                      {roomData?.room_facilities?.room_bed_count > 1
                        ? `${roomData?.room_facilities?.room_bed_count} Beds`
                        : `${roomData?.room_facilities?.room_bed_count} Bed`}
                    </span>
                    <p className="text-xs text-gray-600">
                      Comfortable sleeping arrangement
                    </p>
                  </div>
                </motion.div>

                {/* Hot Water */}
                {roomData?.room_facilities?.room_hotWater && (
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center gap-3 p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border border-orange-200 shadow-sm"
                  >
                    <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full">
                      <Heater className="text-white" size={16} />
                    </div>
                    <div>
                      <span className="font-semibold text-gray-800 text-sm">
                        Hot Water
                      </span>
                      <p className="text-xs text-gray-600">
                        24/7 hot water supply
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Minibar */}
                {roomData?.room_facilities?.room_minibar && (
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center gap-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200 shadow-sm"
                  >
                    <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full">
                      <RefrigeratorIcon className="text-white" size={16} />
                    </div>
                    <div>
                      <span className="font-semibold text-gray-800 text-sm">
                        Minibar
                      </span>
                      <p className="text-xs text-gray-600">
                        Refreshments & beverages
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Room Type Badge */}
              <div className="mt-3">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border border-blue-200">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  {roomData?.room_facilities?.room_ac === "ac"
                    ? "Premium AC Room"
                    : "Comfort Non-AC Room"}
                </span>
              </div>
            </motion.div>

            {/* Enhanced Food Section */}
            {(roomData?.room_food?.breakfast !== "not-included" ||
              roomData?.room_food?.lunch !== "not-included" ||
              roomData?.room_food?.dinner !== "not-included") && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="py-4 border-b border-gray-200"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Coffee className="w-5 h-5 text-amber-500" />
                  <h3 className="text-xl font-bold text-gray-800">
                    Dining Options
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {roomData?.room_food?.breakfast !== "not-included" && (
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="flex flex-col items-center gap-2 p-3 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg border border-yellow-200 shadow-sm"
                    >
                      <div className="p-2 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-full">
                        <CoffeeIcon className="text-white" size={16} />
                      </div>
                      <div className="text-center">
                        <span className="font-semibold text-gray-800 text-sm">
                          Breakfast
                        </span>
                        <p className="text-xs text-gray-600">
                          Fresh morning meals
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {roomData?.room_food?.lunch !== "not-included" && (
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="flex flex-col items-center gap-2 p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border border-orange-200 shadow-sm"
                    >
                      <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full">
                        <CoffeeIcon className="text-white" size={16} />
                      </div>
                      <div className="text-center">
                        <span className="font-semibold text-gray-800 text-sm">
                          Lunch
                        </span>
                        <p className="text-xs text-gray-600">
                          Delicious afternoon cuisine
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {roomData?.room_food?.dinner !== "not-included" && (
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="flex flex-col items-center gap-2 p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200 shadow-sm"
                    >
                      <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full">
                        <Wine className="text-white" size={16} />
                      </div>
                      <div className="text-center">
                        <span className="font-semibold text-gray-800 text-sm">
                          Dinner
                        </span>
                        <p className="text-xs text-gray-600">
                          Exquisite evening dining
                        </p>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
<div className="py-4">
               {selectedDates.startDate && selectedDates.endDate && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-2 bg-gradient-to-r from-gray-50 to-blue-50 p-3 rounded-lg border border-gray-200"
                >
                  <div className="flex justify-between text-gray-700 text-sm">
                    <span className="underline font-medium">
                      ₹{roomData?.room_price?.toLocaleString()} x{" "}
                      {getDaysBetween()} nights x {rooms} room{rooms > 1 ? 's' : ''}
                    </span>
                    <span className="font-semibold">
                      ₹{calculateSubtotal().toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-700 text-sm">
                    <span className="underline font-medium">Cleaning fee</span>
                    <span className="font-semibold">
                      ₹{cleaningFee.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-700 text-sm">
                    <span className="underline font-medium">Service fee</span>
                    <span className="font-semibold">
                      ₹{serviceFee.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-700 text-sm">
                    <span className="underline font-medium">
                      Taxes ({totalTax}%)
                    </span>
                    <span className="font-semibold">
                      ₹{calculateTaxes().toLocaleString()}
                    </span>
                  </div>
                  <hr className="border-gray-300" />
                  <div className="flex justify-between font-bold text-lg text-gray-800">
                    <span>Total</span>
                    <span>₹{calculateTotal().toLocaleString()}</span>
                  </div>

                  {/* Enhanced Tax Breakdown */}
                  <div className="text-xs text-gray-500 mt-2 pt-2 border-t border-gray-200">
                    <div className="flex justify-between mb-1">
                      <span>CGST ({cgst}%)</span>
                      <span>
                        ₹{Math.round(calculateTaxes() / 2).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>SGST ({sgst}%)</span>
                      <span>
                        ₹{Math.round(calculateTaxes() / 2).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          
            
             
            </div>
            

          {/* Enhanced Booking Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-8 bg-white border border-gray-200 rounded-xl p-4 shadow-xl backdrop-blur-sm">
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-2xl font-bold">
                  ₹{roomData?.room_price}
                </span>
                <span className="text-gray-600 font-medium">/ night</span>
              </div>

              {/* Enhanced Date Inputs with HTML date picker */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="w-4 h-4 text-blue-500" />
                  <h4 className="font-semibold text-gray-800 text-sm">Select Dates</h4>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  {/* Check-in Date */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-700 block uppercase tracking-wide">
                      Check-In
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={selectedDates.startDate || ''}
                        min={getMinDate()}
                        onChange={(e) => handleDateChange('startDate', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm font-medium bg-gradient-to-r from-blue-50 to-white"
                      />
                    </div>
                  </div>

                  {/* Check-out Date */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-700 block uppercase tracking-wide">
                      Check-Out
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={selectedDates.endDate || ''}
                        min={getMinCheckoutDate()}
                        onChange={(e) => handleDateChange('endDate', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-sm font-medium bg-gradient-to-r from-purple-50 to-white"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Guest and Rooms Section */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <Users className="w-4 h-4 text-green-500" />
                  <h4 className="font-semibold text-gray-800 text-sm">Guests & Rooms</h4>
                </div>

                <div className="space-y-3">
                  {/* Guest Picker */}
                  <div className="relative guest-picker-container">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setShowGuestPicker(!showGuestPicker);
                      }}
                      className="w-full p-3 text-left hover:bg-gradient-to-r hover:from-green-50 hover:to-blue-50 transition-all duration-200 border border-gray-300 rounded-lg"
                    >
                      <label className="text-xs font-bold text-gray-700 block mb-1 uppercase tracking-wide">
                        Guests
                      </label>
                      <div className="text-sm font-semibold text-gray-800 flex items-center justify-between">
                        <span className="text-green-700">
                          {formatGuestDisplay()}
                        </span>
                        <ChevronRight
                          size={14}
                          className={`transform transition-transform duration-200 text-green-600 ${
                            showGuestPicker ? "rotate-90" : ""
                          }`}
                        />
                      </div>
                    </button>

                    <AnimatePresence>
                      {showGuestPicker && (
                        <motion.div
                          initial={{ opacity: 0, y: -20, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -20, scale: 0.95 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                          className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-xl p-4 mt-1 z-50"
                          style={{
                            boxShadow: "0 20px 40px -12px rgba(0, 0, 0, 0.25)",
                            minWidth: "280px",
                            maxWidth: "100%",
                          }}
                        >
                          <div className="space-y-4">
                            {[
                              {
                                type: "adults",
                                label: "Adults",
                                subtitle: "Ages 13 or above",
                                min: 1,
                                color: "blue"
                              },
                              {
                                type: "children",
                                label: "Children",
                                subtitle: "Ages 2–12",
                                min: 0,
                                color: "green"
                              },
                              {
                                type: "infants",
                                label: "Infants",
                                subtitle: "Under 2",
                                min: 0,
                                color: "purple"
                              },
                            ].map(({ type, label, subtitle, min, color }) => (
                              <div
                                key={type}
                                className="flex items-center justify-between py-2"
                              >
                                <div>
                                  <div className="font-semibold text-gray-800 text-sm">
                                    {label}
                                  </div>
                                  <div className="text-xs text-gray-600">
                                    {subtitle}
                                  </div>
                                </div>

                                <div className="flex items-center gap-3">
                                  <motion.button
                                    whileHover={{
                                      scale: guests[type] > min ? 1.1 : 1,
                                    }}
                                    whileTap={{
                                      scale: guests[type] > min ? 0.95 : 1,
                                    }}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      updateGuests(type, "decrement");
                                    }}
                                    className={`w-8 h-8 rounded-full border flex items-center justify-center font-bold text-sm transition-all duration-200 ${
                                      guests[type] > min
                                        ? `border-${color}-300 text-${color}-600 hover:border-${color}-500 hover:bg-${color}-50 cursor-pointer`
                                        : "border-gray-200 text-gray-300 cursor-not-allowed"
                                    }`}
                                    disabled={guests[type] <= min}
                                  >
                                    -
                                  </motion.button>

                                  <span className="w-6 text-center font-bold text-sm text-gray-800">
                                    {guests[type]}
                                  </span>

                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      updateGuests(type, "increment");
                                    }}
                                    className={`w-8 h-8 rounded-full border border-${color}-300 flex items-center justify-center hover:border-${color}-500 hover:bg-${color}-50 transition-all duration-200 font-bold text-sm text-${color}-600 cursor-pointer`}
                                  >
                                    +
                                  </motion.button>
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="pt-3 mt-3 border-t border-gray-200 flex justify-between items-center">
                            <div className="text-xs text-gray-600">
                              {formatGuestDisplay()}
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setShowGuestPicker(false);
                              }}
                              className="px-4 py-1 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-md hover:from-green-600 hover:to-blue-600 transition-all duration-200 font-semibold shadow-md text-sm"
                            >
                              Done
                            </motion.button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Rooms Selector */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-700 block uppercase tracking-wide">
                      Rooms
                    </label>
                    <div className="relative">
                      <select
                        value={rooms}
                        onChange={(e) => setRooms(parseInt(e.target.value))}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-sm font-medium bg-gradient-to-r from-orange-50 to-white appearance-none cursor-pointer"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                          <option key={num} value={num}>
                            {num} Room{num > 1 ? 's' : ''}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <Building className="w-4 h-4 text-orange-500" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Reserve Button */}
              <motion.button
                whileHover={{ scale: isBooking ? 1 : 1.02 }}
                whileTap={{ scale: isBooking ? 1 : 0.98 }}
                onClick={handleBookNowWithSessionStorage}
                disabled={isBooking}
                className={`w-full py-3 rounded-lg font-bold text-base transition-all duration-300 mb-4 shadow-lg ${
                  isBooking
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 text-white hover:from-pink-600 hover:via-red-600 hover:to-orange-600 hover:shadow-xl transform hover:-translate-y-0.5"
                }`}
              >
                {isBooking ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </div>
                ) : (
                  <>
                    <Sparkles className="inline mr-2" size={16} />
                    Book Now
                  </>
                )}
              </motion.button>

              <p className="text-center text-xs text-gray-600 mb-4 font-medium">
                ✨ Secure booking • No charges yet
              </p>

              {/* Enhanced Pricing Breakdown */}
              {/* {selectedDates.startDate && selectedDates.endDate && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-2 bg-gradient-to-r from-gray-50 to-blue-50 p-3 rounded-lg border border-gray-200"
                >
                  <div className="flex justify-between text-gray-700 text-sm">
                    <span className="underline font-medium">
                      ₹{roomData?.room_price?.toLocaleString()} x{" "}
                      {getDaysBetween()} nights x {rooms} room{rooms > 1 ? 's' : ''}
                    </span>
                    <span className="font-semibold">
                      ₹{calculateSubtotal().toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-700 text-sm">
                    <span className="underline font-medium">Cleaning fee</span>
                    <span className="font-semibold">
                      ₹{cleaningFee.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-700 text-sm">
                    <span className="underline font-medium">Service fee</span>
                    <span className="font-semibold">
                      ₹{serviceFee.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-700 text-sm">
                    <span className="underline font-medium">
                      Taxes ({totalTax}%)
                    </span>
                    <span className="font-semibold">
                      ₹{calculateTaxes().toLocaleString()}
                    </span>
                  </div>
                  <hr className="border-gray-300" />
                  <div className="flex justify-between font-bold text-lg text-gray-800">
                    <span>Total</span>
                    <span>₹{calculateTotal().toLocaleString()}</span>
                  </div>

               
                  <div className="text-xs text-gray-500 mt-2 pt-2 border-t border-gray-200">
                    <div className="flex justify-between mb-1">
                      <span>CGST ({cgst}%)</span>
                      <span>
                        ₹{Math.round(calculateTaxes() / 2).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>SGST ({sgst}%)</span>
                      <span>
                        ₹{Math.round(calculateTaxes() / 2).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )} */}

              {/* Enhanced Room Details Summary */}
              {/* <div className="mt-4 pt-3 border-t border-gray-200">
                <h4 className="font-bold mb-2 text-gray-800 flex items-center gap-2 text-sm">
                  <Home className="w-4 h-4 text-blue-500" />
                  Room Summary
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center p-2 bg-blue-50 rounded-md">
                    <span className="text-gray-600 text-xs">Room Type:</span>
                    <span className="font-semibold text-blue-700 text-xs">
                      {roomData.room_type}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-purple-50 rounded-md">
                    <span className="text-gray-600 text-xs">AC:</span>
                    <span className="font-semibold text-purple-700 capitalize text-xs">
                      {roomData.room_facilities?.room_ac === "ac"
                        ? "AC"
                        : "Non-AC"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-pink-50 rounded-md">
                    <span className="text-gray-600 text-xs">Beds:</span>
                    <span className="font-semibold text-pink-700 text-xs">
                      {roomData.room_facilities?.room_bed_count ||
                        roomData.room_facilities?.bedCount ||
                        roomData.room_facilities?.bed_count ||
                        1}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-orange-50 rounded-md">
                    <span className="text-gray-600 text-xs">Rooms:</span>
                    <span className="font-semibold text-orange-700 text-xs">
                      {rooms}
                    </span>
                  </div>
                  {(roomData.room_facilities?.room_hotWater ||
                    roomData.room_facilities?.hotWater ||
                    roomData.room_facilities?.hot_water) && (
                    <div className="flex justify-between items-center p-2 bg-red-50 rounded-md">
                      <span className="text-gray-600 text-xs">Hot Water:</span>
                      <span className="font-semibold text-red-700 text-xs">
                        Available
                      </span>
                    </div>
                  )}
                  {(roomData.room_facilities?.room_minibar ||
                    roomData.room_facilities?.minibar ||
                    roomData.room_facilities?.mini_bar) && (
                    <div className="flex justify-between items-center p-2 bg-green-50 rounded-md">
                      <span className="text-gray-600 text-xs">Minibar:</span>
                      <span className="font-semibold text-green-700 text-xs">
                        Available
                      </span>
                    </div>
                  )}
                </div>
              </div>

              
              {getFoodInclusions().length > 0 && (
                <div className="mt-4 pt-3 border-t border-gray-200">
                  <h4 className="font-bold mb-2 text-gray-800 flex items-center gap-2 text-sm">
                    <Coffee className="w-4 h-4 text-amber-500" />
                    Included Meals
                  </h4>
                  <div className="space-y-1">
                    {getFoodInclusions().map((meal, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ scale: 1.02 }}
                        className="flex items-center gap-2 p-2 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-md border border-amber-200"
                      >
                        <div className="p-1 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full">
                          <CoffeeIcon size={10} className="text-white" />
                        </div>
                        <span className="font-semibold text-amber-800 text-xs">
                          {meal}
                        </span>
                        <CheckCircle className="w-3 h-3 text-green-500 ml-auto" />
                      </motion.div>
                    ))}
                  </div>
                </div>
              )} */}
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default RoomDetailsPage;