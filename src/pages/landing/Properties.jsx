import React from 'react';
import {
  Wifi,
  Snowflake,
  Tv,
  Coffee,
  Car,
  Utensils,
  Bath,
  Bed,
  Users,
  Star,
  ArrowRight,
  ThermometerSnowflake,
  Soup,
  Refrigerator,
  ShowerHead,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RoomsSection = ({ rooms }) => {
  const navigate = useNavigate();

  const handleBookNow = (roomName) => {
    navigate(`/room-details/${roomName}`)
  };

  // Map room_facilities keys to icon + label
  const facilityMap = {
    room_bed_count: {
      label: 'Beds',
      icon: Bed,
    },
    room_ac: {
      label: 'AC',
      icon: ThermometerSnowflake,
    },
    room_hotWater: {
      label: 'Hot Water',
      icon: ShowerHead,
    },
    room_minibar: {
      label: 'Mini Bar',
      icon: Refrigerator,
    },
  };

  return (
    <section id="rooms" className="py-16 lg:py-24 bg-gradient-to-b from-white to-amber-25">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Bed className="w-4 h-4" />
            Our Premium Rooms
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Choose Your Perfect{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">
              Stay
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            From comfortable deluxe rooms to luxurious royal suites, we offer accommodations
            tailored to your needs with world-class amenities and exceptional service.
          </p>
        </div>

        {/* Rooms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {rooms?.map((room) => {
            const mainImage = room?.room_images_metadata?.find((img) => img?.isMain);
            const imagePath = mainImage
              ? mainImage?.path
              : 'https://via.placeholder.com/400x300';


            return (
              <div
                key={room?._id}
                className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:-translate-y-2"
              >
                {/* Room Image */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={imagePath}
                    alt={room?.room_type}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />

                  {/* Price Badge */}
                  <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl px-3 py-2 shadow-lg">
                    <div className="text-right">
                      <div className="text-lg font-bold text-amber-600">₹{room?.room_price}</div>
                      <div className="text-xs text-gray-600">per night</div>
                    </div>
                  </div>

                  {/* Room Type */}
                  <div className="absolute top-4 left-4 bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {room?.room_type}
                  </div>
                </div>

                {/* Room Details */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{room?.room_type}</h3>

                  {/* Facilities */}
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-800 mb-3">Room Facilities</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries(room.room_facilities).map(([key, value]) => {
                        const item = facilityMap[key];
                        if (!item) return null;

                        const show =
                          typeof value === 'boolean' ? value : value !== 'non-ac'; // hide non-ac

                        return show ? (
                          <div
                            key={key}
                            className="flex items-center gap-2 text-sm text-gray-600"
                          >
                            <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
                              <item.icon className="w-4 h-4 text-teal-600" />
                            </div>
                            <span>
                              {item.label}
                              {key === 'room_bed_count' ? `: ${value}` : ''}
                            </span>
                          </div>
                        ) : null;
                      })}
                    </div>
                  </div>

                  {/* Book Now Button */}
                  <button
                    onClick={() => handleBookNow(room?._id)}
                    className="w-full group bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-4 px-6 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3"
                  >
                    Book Now
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </button>

                  {/* Additional Info */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>Free cancellation until 24 hours</span>
                      <span>Instant confirmation</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        {/* <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-2xl p-8 border border-teal-100">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Can't decide? Let us help you choose!
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Our hospitality experts are ready to recommend the perfect room based on your
              preferences and requirements.
            </p>
            <button className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
              Get Personal Recommendation
            </button>
          </div>
        </div> */}
      </div>
    </section>
  );
};

export default RoomsSection;
