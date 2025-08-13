import React, { useState, useEffect } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight, MapPin, Calendar } from 'lucide-react';

const GuestReviewsSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const reviews = [
    {
      id: 1,
      name: "Priya Sharma",
      location: "Mumbai, Maharashtra",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80",
      rating: 5,
      date: "2 weeks ago",
      testimonial: "Absolutely wonderful experience! The Telugu cuisine was authentic and delicious. The staff went above and beyond to make our stay memorable. The room was spotless and the location perfect for exploring the city.",
      roomType: "Deluxe Room"
    },
    {
      id: 2,
      name: "Rajesh Kumar",
      location: "Hyderabad, Telangana",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80",
      rating: 5,
      date: "1 month ago",
      testimonial: "Heritage Palace exceeded all expectations. The royal suite was luxurious and the 24/7 service was impeccable. Perfect for business travelers. Will definitely recommend to colleagues.",
      roomType: "Royal Suite"
    },
    {
      id: 3,
      name: "Anitha Reddy",
      location: "Bangalore, Karnataka",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80",
      rating: 4,
      date: "3 weeks ago",
      testimonial: "Lovely hotel with great ambiance. The hygiene standards are exceptional and the Telugu breakfast was a delightful surprise. Staff was very courteous and helpful throughout our stay.",
      roomType: "Executive Suite"
    },
    {
      id: 4,
      name: "Vikram Patel",
      location: "Chennai, Tamil Nadu",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80",
      rating: 5,
      date: "1 week ago",
      testimonial: "Outstanding service and premium amenities. The location is perfect and the traditional hospitality combined with modern comfort made our family vacation unforgettable.",
      roomType: "Premium Deluxe"
    },
    {
      id: 5,
      name: "Meera Agarwal",
      location: "Pune, Maharashtra",
      avatar: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80",
      rating: 5,
      date: "2 months ago",
      testimonial: "The authentic Telugu cuisine was the highlight of our stay. Every dish was prepared to perfection. The room service was prompt and the overall experience was truly memorable.",
      roomType: "Deluxe Room"
    },
    {
      id: 6,
      name: "Suresh Nair",
      location: "Kochi, Kerala",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80",
      rating: 4,
      date: "5 days ago",
      testimonial: "Clean, comfortable, and well-located hotel. The staff was incredibly helpful and the 24/7 support really came in handy. Great value for money with excellent facilities.",
      roomType: "Executive Suite"
    }
  ];

  // Auto slide functionality
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % Math.ceil(reviews.length / 3));
    }, 5000);

    return () => clearInterval(timer);
  }, [reviews.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.ceil(reviews.length / 3));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + Math.ceil(reviews.length / 3)) % Math.ceil(reviews.length / 3));
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-amber-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const getVisibleReviews = () => {
    const startIndex = currentSlide * 3;
    return reviews.slice(startIndex, startIndex + 3);
  };

  return (
    <section id="reviews" className="py-16 lg:py-24 bg-gradient-to-b from-white via-teal-25 to-amber-25">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-teal-100 text-teal-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Quote className="w-4 h-4" />
            Guest Testimonials
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            What Our{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600">
              Guests Say
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Read authentic reviews from our valued guests who have experienced 
            the warmth of our hospitality and the comfort of our accommodations.
          </p>
        </div>

        {/* Overall Rating Summary */}
        {/* <div className="bg-white rounded-3xl shadow-lg p-8 mb-12 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-center">
            <div className="text-center md:text-left">
              <div className="text-5xl font-bold text-gray-800 mb-2">4.8</div>
              <div className="flex justify-center md:justify-start gap-1 mb-2">
                {renderStars(5)}
              </div>
              <div className="text-gray-600">Average Rating</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-teal-600 mb-2">500+</div>
              <div className="text-gray-600">Total Reviews</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-600 mb-2">98%</div>
              <div className="text-gray-600">Recommend Us</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600 mb-2">4.9</div>
              <div className="text-gray-600">Service Rating</div>
            </div>
          </div>
        </div> */}

        {/* Reviews Carousel Container */}
        <div className="relative">
          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white shadow-lg rounded-full p-3 hover:bg-gray-50 transition-colors duration-300 hidden lg:block"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white shadow-lg rounded-full p-3 hover:bg-gray-50 transition-colors duration-300 hidden lg:block"
          >
            <ChevronRight className="w-6 h-6 text-gray-600" />
          </button>

          {/* Reviews Grid - Desktop Carousel */}
          <div className="hidden lg:block overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {Array.from({ length: Math.ceil(reviews.length / 3) }).map((_, slideIndex) => (
                <div key={slideIndex} className="w-full flex-shrink-0">
                  <div className="grid grid-cols-3 gap-8">
                    {reviews.slice(slideIndex * 3, slideIndex * 3 + 3).map((review) => (
                      <ReviewCard key={review.id} review={review} renderStars={renderStars} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews Grid - Mobile Stack */}
          <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} renderStars={renderStars} />
            ))}
          </div>
        </div>

        {/* Carousel Indicators */}
        <div className="flex justify-center gap-3 mt-8 lg:block">
          {Array.from({ length: Math.ceil(reviews.length / 3) }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                currentSlide === index ? 'bg-teal-600' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        {/* <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-8 border border-amber-200">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Share Your Experience
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              We'd love to hear about your stay! Your feedback helps us continue 
              providing exceptional service to all our guests.
            </p>
            <button className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
              Write a Review
            </button>
          </div>
        </div> */}
      </div>
    </section>
  );
};

// Review Card Component
const ReviewCard = ({ review, renderStars }) => (
  <div className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 p-8 border border-gray-100 transform hover:-translate-y-2">
    {/* Quote Icon */}
    <div className="mb-6">
      <Quote className="w-8 h-8 text-teal-200" />
    </div>

    {/* Review Content */}
    <div className="mb-6">
      <p className="text-gray-700 leading-relaxed text-base">
        "{review.testimonial}"
      </p>
    </div>

    {/* Rating */}
    <div className="flex items-center gap-2 mb-6">
      <div className="flex gap-1">
        {renderStars(review.rating)}
      </div>
      <span className="text-sm text-gray-500">({review.rating}/5)</span>
    </div>

    {/* Guest Info */}
    <div className="flex items-center gap-4">
      <img
        src={review.avatar}
        alt={review.name}
        className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
      />
      <div className="flex-1">
        <h4 className="font-semibold text-gray-800">{review.name}</h4>
        <div className="flex items-center gap-1 text-sm text-gray-500">
          <MapPin className="w-3 h-3" />
          {review.location}
        </div>
      </div>
    </div>

    {/* Additional Info */}
    <div className="mt-4 pt-4 border-t border-gray-100">
      <div className="flex justify-between items-center text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {review.date}
        </span>
        <span className="bg-gray-100 px-2 py-1 rounded-full">
          {review.roomType}
        </span>
      </div>
    </div>
  </div>
);

export default GuestReviewsSection;