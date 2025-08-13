import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Clock, XCircle, Car, Heart } from 'lucide-react';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      id: 1,
      question: "What is the check-in/check-out time?",
      answer: "Check-in time is 2:00 PM and check-out time is 12:00 PM. Early check-in and late check-out are subject to availability and may incur additional charges. We recommend contacting us in advance to arrange these services.",
      icon: <Clock className="w-5 h-5 text-amber-600" />
    },
    {
      id: 2,
      question: "Can I cancel my booking?",
      answer: "Yes, you can cancel your booking up to 24 hours before your arrival date without any charges. Cancellations made within 24 hours of arrival are subject to a one-night charge. For group bookings or special packages, different cancellation policies may apply.",
      icon: <XCircle className="w-5 h-5 text-amber-600" />
    },
    {
      id: 3,
      question: "Do you offer parking facilities?",
      answer: "Yes, we provide complimentary parking for all our guests. Our secure parking area can accommodate cars, motorcycles, and bicycles. Valet parking service is also available upon request for your convenience.",
      icon: <Car className="w-5 h-5 text-amber-600" />
    },
    {
      id: 4,
      question: "Are pets allowed in the hotel?",
      answer: "We welcome well-behaved pets in designated pet-friendly rooms. A pet fee of ₹500 per night applies, and advance notice is required. Pets must be supervised at all times and are not allowed in restaurant areas.",
      icon: <Heart className="w-5 h-5 text-amber-600" />
    },
    {
      id: 5,
      question: "What amenities are included in the room?",
      answer: "All rooms include complimentary Wi-Fi, air conditioning, flat-screen TV, mini-fridge, tea/coffee maker, and 24-hour room service. Premium rooms also feature a work desk, safe, and premium toiletries.",
      icon: <HelpCircle className="w-5 h-5 text-amber-600" />
    },
    {
      id: 6,
      question: "Do you provide airport transportation?",
      answer: "Yes, we offer airport pickup and drop-off services for a nominal fee. Please inform us at least 24 hours in advance with your flight details. The journey typically takes 45-60 minutes depending on traffic conditions.",
      icon: <Car className="w-5 h-5 text-amber-600" />
    },
    {
      id: 7,
      question: "Is breakfast included in the room rate?",
      answer: "Complimentary breakfast is included for all room bookings. We serve a variety of South Indian, North Indian, and Continental dishes from 7:00 AM to 10:30 AM. Special dietary requirements can be accommodated with advance notice.",
      icon: <HelpCircle className="w-5 h-5 text-amber-600" />
    },
    {
      id: 8,
      question: "What COVID-19 safety measures are in place?",
      answer: "We follow all government-mandated safety protocols including regular sanitization, contactless check-in options, temperature screening, and social distancing measures. Hand sanitizers are available throughout the property for guest convenience.",
      icon: <Heart className="w-5 h-5 text-amber-600" />
    }
  ];

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id='faqs' className="py-16 px-4 bg-gradient-to-b from-amber-50 to-orange-50">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <HelpCircle className="w-8 h-8 text-teal-700" />
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800">
              Frequently Asked Questions
            </h2>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Find quick answers to common questions about your stay with us
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={faq.id}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl"
            >
              {/* Question Header */}
              <button
                onClick={() => toggleAccordion(index)}
                className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-inset"
              >
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 p-2 bg-amber-100 rounded-lg">
                    {faq.icon}
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold text-gray-800 pr-4">
                    {faq.question}
                  </h3>
                </div>
                <ChevronDown
                  className={`w-6 h-6 text-teal-700 transition-transform duration-300 flex-shrink-0 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Answer Content */}
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === index 
                    ? 'max-h-96 opacity-100' 
                    : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-6 pb-6">
                  <div className="pl-16 border-l-2 border-amber-200">
                    <p className="text-gray-600 leading-relaxed text-base">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Section */}
        {/* <div className="mt-12 text-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Still Have Questions?
            </h3>
            <p className="text-gray-600 leading-relaxed text-lg mb-6">
              Our friendly staff is available 24/7 to assist you with any additional queries
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-teal-700 hover:bg-teal-800 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                Call Us Now
              </button>
              <button className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                Live Chat
              </button>
            </div>
          </div>
        </div> */}
      </div>
    </section>
  );
};

export default FAQ;