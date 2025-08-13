import React, { useState, useEffect } from 'react';
import { HotelIcon, MapPin } from 'lucide-react';

const StickyHeader = () => {
  const [activeSection, setActiveSection] = useState('home');

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'rooms', label: 'Rooms' },
    { id: 'whyus', label: "Why Us"},
    { id: 'reviews', label: 'Reviews' },
    { id: 'faqs', label: 'FAQs' },
  ];

  // Scroll spy functionality
  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map(item => document.getElementById(item.id));
      const scrollPosition = window.scrollY + 100; // Offset for header height

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(navItems[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth scroll to section
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerHeight = 80; // Account for sticky header
      const elementPosition = element.offsetTop - headerHeight;
      
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <>
      {/* Sticky Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Hotel Logo/Name */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
                <HotelIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Mannars Lodge</h1>
                <p className="text-xs text-teal-600 font-medium">Luxury & Comfort</p>
              </div>
            </div>

            {/* Navigation Menu */}
            <nav className="hidden md:flex">
              <ul className="flex items-center gap-8">
                {navItems.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => scrollToSection(item.id)}
                      className={`
                        relative px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 ease-in-out
                        hover:bg-amber-50 hover:text-amber-600 hover:shadow-sm
                        ${activeSection === item.id 
                          ? 'text-amber-600 bg-amber-50 shadow-sm' 
                          : 'text-gray-700 hover:text-amber-600'
                        }
                      `}
                    >
                      {item.label}
                      {activeSection === item.id && (
                        <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-amber-500 rounded-full"></span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Mobile Menu Button */}
            <button className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="w-6 h-6 flex flex-col justify-center gap-1">
                <span className="w-full h-0.5 bg-gray-600 rounded"></span>
                <span className="w-full h-0.5 bg-gray-600 rounded"></span>
                <span className="w-full h-0.5 bg-gray-600 rounded"></span>
              </div>
            </button>
          </div>
        </div>
      </header>

    </>
  );
};

export default StickyHeader;