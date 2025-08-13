import React from 'react';
import { MapPin, Phone, Mail, Facebook, Twitter, Instagram, Youtube, Star } from 'lucide-react';

const App = () => {
  // This is the main component that renders the footer.
  // In a real application, you would have other content here.
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        {/* Your page content goes here */}
        <div className="h-96 p-8">
          <h1 className="text-3xl font-bold">Page Content</h1>
          <p>Scroll down to see the footer.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

const Footer = () => {
  // Data for navigation and social links
  const navigationLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Rooms', href: '#rooms' },
    { name: 'About Us', href: '#about' },
    { name: 'Contact', href: '#contact' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Amenities', href: '#amenities' },
  ];

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: '#' },
    { name: 'Twitter', icon: Twitter, href: '#' },
    { name: 'Instagram', icon: Instagram, href: '#' },
    { name: 'Youtube', icon: Youtube, href: '#' }
  ];

  return (
    <footer className="bg-gray-900 text-white z-41">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Hotel Info & Logo */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-2 rounded-lg">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Mannars Lodge</h3>
                <p className="text-amber-400 text-xs font-medium">Experience Royal Comfort</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-md">
              A blend of traditional hospitality and modern luxury in the heart of Hyderabad.
            </p>
          </div>

          {/* Links and Contact Info */}
          <div className="grid grid-cols-2 gap-8">
             <div>
                <h4 className="text-md font-semibold text-white mb-4">Quick Links</h4>
                <ul className="space-y-2">
                  {navigationLinks.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        className="text-gray-400 hover:text-amber-400 transition-colors duration-300 text-sm"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
             </div>
             <div>
                <h4 className="text-md font-semibold text-white mb-4">Contact Us</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-amber-400 flex-shrink-0 mt-1" />
                    <span className="text-gray-400">123 Heritage St, Hyderabad</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    <span className="text-gray-400">+91 40 1234 5678</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    <span className="text-gray-400">info@heritage.com</span>
                  </div>
                </div>
             </div>
          </div>
          
          {/* Social Media & Newsletter */}
          <div>
            <h4 className="text-md font-semibold text-white mb-4">Stay Connected</h4>
            <div className="flex gap-3 mb-4">
              {socialLinks.map((social) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    className="bg-gray-800 hover:bg-gradient-to-br hover:from-amber-500 hover:to-orange-600 p-2 rounded-lg transition-all duration-300"
                    aria-label={`Follow us on ${social.name}`}
                  >
                    <IconComponent className="w-5 h-5 text-gray-400" />
                  </a>
                );
              })}
            </div>
            
            {/* <p className="text-gray-400 text-sm mb-2">Get our special offers.</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 bg-gray-800 border border-gray-700 rounded-md px-3 py-1.5 text-sm text-white placeholder-gray-500 focus:ring-1 focus:ring-amber-500 focus:border-transparent transition-all"
              />
              <button className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 px-3 py-1.5 rounded-md text-white text-sm font-medium transition-all">
                Sub
              </button>
            </div> */}
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
            <div className="text-gray-500 text-xs">
              © 2025 Heritage Palace Hotel. All rights reserved.
            </div>
            <div className="flex items-center gap-4 text-xs">
              <a href="#" className="text-gray-500 hover:text-amber-400 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-500 hover:text-amber-400 transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
