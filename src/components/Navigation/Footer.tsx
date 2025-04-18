import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Facebook, Twitter, Instagram } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and About */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <BookOpen className="text-white" size={24} />
              <span className="font-serif text-xl font-bold text-white">Captured Thinkings</span>
            </div>
            <p className="mb-4 text-sm">
              A sanctuary for poetic expression, Captured Thinkings showcases beautiful poetry in both English and Kannada. 
              Our mission is to preserve and celebrate the art of poetry across languages.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                <Instagram size={20} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-white font-medium mb-4 text-lg">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition-colors duration-200">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Admin Login
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Languages */}
          <div>
            <h3 className="text-white font-medium mb-4 text-lg">Languages</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/?language=english" className="text-gray-400 hover:text-white transition-colors duration-200">
                  English Poems
                </Link>
              </li>
              <li>
                <Link to="/?language=kannada" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Kannada Poems
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
          <p>&copy; {currentYear} Captured Thinkings. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;