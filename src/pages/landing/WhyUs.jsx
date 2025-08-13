import React from 'react';
import { 
  Headphones, 
  ChefHat, 
  MapPin, 
  Shield, 
  Clock, 
  Heart, 
  Award, 
  CheckCircle 
} from 'lucide-react';

const WhyChooseUsSection = () => {
  const features = [
    {
      id: 1,
      icon: Headphones,
      title: "24/7 Customer Support",
      description: "Round-the-clock assistance for all your needs. Our dedicated support team is always ready to help you.",
      bgColor: "bg-amber-50",
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
      borderColor: "border-amber-200"
    },
    {
      id: 2,
      icon: ChefHat,
      title: "Authentic Telugu Cuisine",
      description: "Savor traditional Telugu delicacies prepared by expert chefs using authentic recipes and fresh ingredients.",
      bgColor: "bg-teal-50",
      iconBg: "bg-teal-100",
      iconColor: "text-teal-600",
      borderColor: "border-teal-200"
    },
    {
      id: 3,
      icon: MapPin,
      title: "Prime Location",
      description: "Strategically located in the heart of the city with easy access to major attractions and business centers.",
      bgColor: "bg-orange-50",
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
      borderColor: "border-orange-200"
    },
    {
      id: 4,
      icon: Shield,
      title: "100% Hygiene Guarantee",
      description: "Maintaining the highest standards of cleanliness and safety with regular sanitization and quality checks.",
      bgColor: "bg-emerald-50",
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
      borderColor: "border-emerald-200"
    }
  ];

  const stats = [
    { number: "500+", label: "Happy Guests", icon: Heart },
    { number: "15+", label: "Years Experience", icon: Clock },
    { number: "98%", label: "Satisfaction Rate", icon: Award },
    { number: "24/7", label: "Service Available", icon: CheckCircle }
  ];

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-b from-amber-25 to-white" id='whyus'>
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-teal-100 text-teal-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Award className="w-4 h-4" />
            Why Choose Heritage Palace
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Experience the{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">
              Difference
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Discover what makes us the preferred choice for travelers seeking comfort, 
            authenticity, and exceptional service in the heart of the city.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature) => (
            <div
              key={feature.id}
              className={`group ${feature.bgColor} ${feature.borderColor} border-2 rounded-3xl p-8 hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105`}
            >
              {/* Icon */}
              <div className={`${feature.iconBg} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className={`w-8 h-8 ${feature.iconColor}`} />
              </div>

              {/* Content */}
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4 group-hover:text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed group-hover:text-gray-700">
                  {feature.description}
                </p>
              </div>

              {/* Hover Effect Decoration */}
              <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className={`w-12 h-1 ${feature.iconColor.replace('text-', 'bg-')} rounded-full`}></div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-3xl p-8 lg:p-12 text-white">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">Our Numbers Speak</h3>
            <p className="text-gray-300 max-w-2xl mx-auto">
              These achievements reflect our commitment to providing exceptional hospitality 
              and creating memorable experiences for every guest.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="bg-white/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-white/20 transition-colors duration-300">
                  <stat.icon className="w-8 h-8 text-amber-400" />
                </div>
                <div className="text-3xl lg:text-4xl font-bold text-amber-400 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-300 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Trust Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Heritage Promise */}
          <div className="text-center p-6 bg-amber-50 rounded-2xl border border-amber-200">
            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-6 h-6 text-amber-600" />
            </div>
            <h4 className="text-lg font-bold text-gray-800 mb-2">Heritage Promise</h4>
            <p className="text-gray-600 text-sm">
              Blending traditional hospitality with modern comfort for an unforgettable stay.
            </p>
          </div>

          {/* Local Experience */}
          <div className="text-center p-6 bg-teal-50 rounded-2xl border border-teal-200">
            <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-6 h-6 text-teal-600" />
            </div>
            <h4 className="text-lg font-bold text-gray-800 mb-2">Local Experience</h4>
            <p className="text-gray-600 text-sm">
              Immerse yourself in local culture with our curated experiences and recommendations.
            </p>
          </div>

          {/* Quality Assurance */}
          <div className="text-center p-6 bg-emerald-50 rounded-2xl border border-emerald-200">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-6 h-6 text-emerald-600" />
            </div>
            <h4 className="text-lg font-bold text-gray-800 mb-2">Quality Assurance</h4>
            <p className="text-gray-600 text-sm">
              Every detail is carefully monitored to ensure the highest standards of service.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUsSection;