import React from 'react';
import { MapPin, Camera, Clock, Star } from 'lucide-react';

const NearbyAttractions = () => {
  const attractions = [
    {
      id: 1,
      name: "Charminar",
      description: "Historic monument and iconic symbol of Hyderabad",
      image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400&h=300&fit=crop",
      distance: "1.2 km away",
      icon: <Camera className="w-5 h-5 text-amber-600" />
    },
    {
      id: 2,
      name: "Golconda Fort",
      description: "Ancient fortress with stunning architecture and panoramic views",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
      distance: "8.5 km away",
      icon: <Star className="w-5 h-5 text-amber-600" />
    },
    {
      id: 3,
      name: "Ramoji Film City",
      description: "World's largest film studio complex and entertainment destination",
      image: "https://unsplash.com/photos/white-wooden-fence-on-green-grass-field-eoohqHDVEP0",
      distance: "25 km away",
      icon: <Camera className="w-5 h-5 text-amber-600" />
    },
    {
      id: 4,
      name: "Hussain Sagar Lake",
      description: "Beautiful lake with Buddha statue and boating facilities",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
      distance: "3.8 km away",
      icon: <MapPin className="w-5 h-5 text-amber-600" />
    }
  ];

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-fefce8 via-orange-50 to-amber-50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <MapPin className="w-8 h-8 text-teal-700" />
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800">
              Nearby Attractions
            </h2>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Discover the rich heritage and vibrant culture just moments away from your comfortable stay
          </p>
        </div>

        {/* Attractions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {attractions.map((attraction) => (
            <div
              key={attraction.id}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 overflow-hidden"
            >
              {/* Image Container */}
              <div className="relative overflow-hidden h-48">
                <img
                  src={attraction.image}
                  alt={attraction.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Distance Badge */}
                <div className="absolute top-3 right-3 bg-teal-700 text-white px-3 py-1 rounded-full shadow-lg">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span className="text-sm font-semibold">{attraction.distance}</span>
                  </div>
                </div>

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Icon and Name */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex-shrink-0 p-2 bg-amber-100 rounded-lg">
                    {attraction.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 group-hover:text-teal-700 transition-colors duration-300">
                    {attraction.name}
                  </h3>
                </div>

                {/* Description */}
                <p className="text-gray-600 leading-relaxed text-base mb-4">
                  {attraction.description}
                </p>

                {/* Action Button */}
                <button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-300 transform group-hover:scale-105 shadow-md hover:shadow-lg">
                  Get Directions
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        {/* <div className="mt-12 text-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-4">
              <MapPin className="w-6 h-6 text-teal-700" />
              <h3 className="text-2xl font-bold text-gray-800">
                Perfect Location for Exploration
              </h3>
            </div>
            <p className="text-gray-600 leading-relaxed text-lg">
              Our hotel is strategically located to give you easy access to Hyderabad's most cherished landmarks. 
              From historic monuments to modern entertainment, everything is within comfortable reach.
            </p>
            <button className="mt-6 bg-teal-700 hover:bg-teal-800 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
              View All Nearby Places
            </button>
          </div>
        </div> */}
      </div>
    </section>
  );
};

export default NearbyAttractions;