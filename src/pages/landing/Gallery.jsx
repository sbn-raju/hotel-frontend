import React from 'react';
import { Camera } from 'lucide-react';

const Gallery = () => {
  const galleryImages = [
    {
      id: 1,
      src: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop",
      alt: "Luxury Hotel Room",
      category: "Rooms"
    },
    {
      id: 2,
      src: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600&h=600&fit=crop",
      alt: "Hotel Restaurant",
      category: "Dining"
    },
    {
      id: 3,
      src: "https://images.unsplash.com/photo-1564501049912-74c90933906b?w=600&h=400&fit=crop",
      alt: "Hotel Lobby",
      category: "Lobby"
    },
    {
      id: 4,
      src: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=500&fit=crop",
      alt: "Mountain View",
      category: "Views"
    },
    {
      id: 5,
      src: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop",
      alt: "Premium Suite",
      category: "Rooms"
    },
    {
      id: 6,
      src: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600&h=600&fit=crop",
      alt: "Hotel Pool Area",
      category: "Amenities"
    },
    {
      id: 7,
      src: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&h=400&fit=crop",
      alt: "Conference Room",
      category: "Business"
    },
    {
      id: 8,
      src: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=500&fit=crop",
      alt: "Garden View",
      category: "Views"
    }
  ];

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-amber-50 to-fefce8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Camera className="w-8 h-8 text-amber-600" />
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800">
              Take a Look Inside
            </h2>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Experience the warmth and elegance of our spaces through these glimpses of comfort and luxury
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryImages.map((image, index) => (
            <div
              key={image.id}
              className={`group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 ${
                index === 1 || index === 5 ? 'md:row-span-2' : ''
              }`}
            >
              {/* Image Container */}
              <div className="relative overflow-hidden bg-gray-200 h-80 md:h-96">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Category Badge */}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                  <span className="text-sm font-semibold text-teal-700">
                    {image.category}
                  </span>
                </div>
                
                {/* Image Title on Hover */}
                <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 opacity-0 group-hover:opacity-100">
                  <h3 className="text-white font-semibold text-lg leading-tight">
                    {image.alt}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View More Button */}
        <div className="text-center mt-12">
          <button className="bg-teal-700 hover:bg-teal-800 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
            View All Photos
          </button>
        </div>
      </div>
    </section>
  );
};

export default Gallery;