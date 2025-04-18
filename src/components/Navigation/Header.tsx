import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, BookOpen } from 'lucide-react';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const isAdmin = location.pathname.includes('/admin');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navClasses = `
    fixed top-0 left-0 right-0 z-50 transition-all duration-300
    ${isScrolled || isAdmin ? 'bg-white shadow-md' : 'bg-transparent'}
  `;

  const linkClasses = `
    transition-colors duration-200 px-4 py-2 rounded
    ${isScrolled || isAdmin ? 'text-gray-700 hover:text-blue-900' : 'text-white hover:text-gray-200'}
  `;

  const logoClasses = `
    font-serif text-xl font-bold transition-colors duration-200
    ${isScrolled || isAdmin ? 'text-blue-900' : 'text-white'}
  `;

  return (
    <header className={navClasses}>
      <div className="container mx-auto px-4 py-3">
        <nav className="flex items-center justify-between">
          <Link to={isAdmin ? "/admin" : "/"} className="flex items-center space-x-2">
            <BookOpen className={logoClasses} size={28} />
            <span className={logoClasses}>Captured Thinkings</span>
          </Link>

          {/* Mobile menu button */}
          <button 
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className={isScrolled || isAdmin ? "text-gray-700" : "text-white"} />
            ) : (
              <Menu className={isScrolled || isAdmin ? "text-gray-700" : "text-white"} />
            )}
          </button>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {isAdmin ? (
              <>
                <Link to="/admin" className={linkClasses}>Dashboard</Link>
                <Link to="/admin/upload" className={linkClasses}>Upload Poem</Link>
                <Link to="/admin/manage" className={linkClasses}>Manage Poems</Link>
              </>
            ) : (
              <>
                <Link to="/" className={linkClasses}>Home</Link>
                <Link to="/about" className={linkClasses}>About</Link>
                <Link to="/contact" className={linkClasses}>Contact</Link>
              </>
            )}
          </div>
        </nav>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white mt-2 rounded-lg shadow-lg p-4 absolute left-4 right-4 transition-all duration-300">
            {isAdmin ? (
              <div className="flex flex-col space-y-2">
                <Link 
                  to="/admin" 
                  className="text-gray-700 hover:text-blue-900 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/admin/upload" 
                  className="text-gray-700 hover:text-blue-900 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Upload Poem
                </Link>
                <Link 
                  to="/admin/manage" 
                  className="text-gray-700 hover:text-blue-900 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Manage Poems
                </Link>

              </div>
            ) : (
              <div className="flex flex-col space-y-2">
                <Link 
                  to="/" 
                  className="text-gray-700 hover:text-blue-900 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
                <Link 
                  to="/about" 
                  className="text-gray-700 hover:text-blue-900 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  About
                </Link>
                <Link 
                  to="/contact" 
                  className="text-gray-700 hover:text-blue-900 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact
                </Link>

              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;