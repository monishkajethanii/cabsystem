import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 text-black">
      <div className="max-w-7xl mx-auto py-12 px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-6">
            <a to="/" className="text-2xl font-bold flex items-center">
              <span className="text-blue-500">Cab</span>Fleet
            </a>
            <p className="text-gray-400 max-w-xs">
              Premium cab management system for efficient transportation solutions and luxury travel experiences.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="text-gray-400 hover:text-white transition-all-200"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-white transition-all-200"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-white transition-all-200"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-white transition-all-200"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-4">
              <li>
                <a 
                  to="/" 
                  className="text-gray-400 hover:text-white transition-all-200"
                >
                  Home
                </a>
              </li>
              <li>
                <a 
                  to="/booking" 
                  className="text-gray-400 hover:text-white transition-all-200"
                >
                  Book a Ride
                </a>
              </li>
              <li>
                <a 
                  to="/drivers" 
                  className="text-gray-400 hover:text-white transition-all-200"
                >
                  Our Drivers
                </a>
              </li>
              <li>
                <a 
                  to="/trips" 
                  className="text-gray-400 hover:text-white transition-all-200"
                >
                  Trip History
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-6">Services</h3>
            <ul className="space-y-4">
              <li>
                <a 
                  href="/booking" 
                  className="text-gray-400 hover:text-white transition-all-200"
                >
                  Airport Transfers
                </a>
              </li>
              <li>
                <a 
                  href="/booking" 
                  className="text-gray-400 hover:text-white transition-all-200"
                >
                  Business Travel
                </a>
              </li>
              <li>
                <a 
                  href="/booking" 
                  className="text-gray-400 hover:text-white transition-all-200"
                >
                  Event Transportation
                </a>
              </li>
              <li>
                <a 
                  href="/booking" 
                  className="text-gray-400 hover:text-white transition-all-200"
                >
                  Hourly Hire
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <Phone size={18} className="text-blue-500 mr-3 mt-0.5" />
                <span className="text-gray-400">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start">
                <Mail size={18} className="text-blue-500 mr-3 mt-0.5" />
                <span className="text-gray-400">info@cabfleet.com</span>
              </li>
              <li className="flex items-start">
                <MapPin size={18} className="text-blue-500 mr-3 mt-0.5" />
                <span className="text-gray-400">123 Business Avenue,<br />Suite 100, San Francisco, CA 94107</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            &copy; {year} CabFleet. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a 
              href="#" 
              className="text-gray-500 hover:text-gray-400 text-sm transition-all-200"
            >
              Privacy Policy
            </a>
            <a 
              href="#" 
              className="text-gray-500 hover:text-gray-400 text-sm transition-all-200"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;