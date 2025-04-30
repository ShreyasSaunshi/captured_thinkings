import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, BookOpen, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { session, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isAdmin = location.pathname.includes('/admin');

  // Detect scroll position
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Run initially
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsMenuOpen(false);
    }
   };

  if (isMenuOpen) {
    document.addEventListener('mousedown', handleClickOutside);
  }

  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };
}, [isMenuOpen]);

  const navClasses = `
    fixed top-0 left-0 right-0 z-50 transition-colors duration-300
    ${isAdmin || scrolled ? 'bg-gray-900 shadow-md' : 'bg-transparent'}
  `;

  const linkClasses = `
    transition-colors duration-200 px-4 py-2 rounded
    ${isAdmin || scrolled ? 'text-gray-300 hover:text-white' : 'text-white hover:text-gray-200'}
  `;

  const logoClasses = `
    font-serif text-xl font-bold transition-colors duration-200
    ${isAdmin || scrolled ? 'text-white' : 'text-white'}
  `;

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  return (
    <header className={navClasses}>
      <div className="container mx-auto px-4 py-3">
        <nav className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to={isAdmin ? "/admin" : "/"} className="flex items-center space-x-2">
              <BookOpen className={logoClasses} size={28} />
              <span className={logoClasses}>
                {isAdmin ? "Admin Panel" : "Captured Thinkings"}
              </span>
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <button 
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="text-white" />
            ) : (
              <Menu className="text-white" />
            )}
          </button>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {isAdmin ? (
              <>
                <Link to="/admin" className={linkClasses}>Dashboard</Link>
                <Link to="/admin/upload" className={linkClasses}>Upload Poem</Link>
                <Link to="/admin/manage" className={linkClasses}>Manage Poems</Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-gray-300 hover:text-white transition-colors duration-200 px-4 py-2 rounded"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/" className={linkClasses}>Home</Link>
                <Link to="/about" className={linkClasses}>About</Link>
                <Link to="/contact" className={linkClasses}>Contact</Link>
                {session && (
                  <Link to="/admin" className={linkClasses}>Admin Panel</Link>
                )}
              </>
            )}
          </div>
        </nav>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div 
            ref={dropdownRef}
            className="md:hidden bg-gray-900 mt-2 rounded-lg shadow-lg p-4 absolute left-4 right-4"
          >
            {isAdmin ? (
              <div className="flex flex-col space-y-2">
                <Link to="/admin" className="text-gray-300 hover:text-white py-2" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
                <Link to="/admin/upload" className="text-gray-300 hover:text-white py-2" onClick={() => setIsMenuOpen(false)}>Upload Poem</Link>
                <Link to="/admin/manage" className="text-gray-300 hover:text-white py-2" onClick={() => setIsMenuOpen(false)}>Manage Poems</Link>
                <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="flex items-center space-x-1 text-gray-300 hover:text-white py-2">
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col space-y-2">
                <Link to="/" className="text-gray-300 hover:text-white py-2" onClick={() => setIsMenuOpen(false)}>Home</Link>
                <Link to="/about" className="text-gray-300 hover:text-white py-2" onClick={() => setIsMenuOpen(false)}>About</Link>
                <Link to="/contact" className="text-gray-300 hover:text-white py-2" onClick={() => setIsMenuOpen(false)}>Contact</Link>
                {session && (
                  <Link to="/admin" className="text-gray-300 hover:text-white py-2" onClick={() => setIsMenuOpen(false)}>Admin Panel</Link>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
