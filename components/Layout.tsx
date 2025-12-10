import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { LOGO_URL } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { divisions } = useData();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDivisionsOpen, setIsDivisionsOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Close mobile menu when route changes
  React.useEffect(() => {
    setIsMenuOpen(false);
    setIsDivisionsOpen(false);
  }, [location]);

  return (
    <div className="flex flex-col min-h-screen font-sans text-gray-100 bg-slate-900 selection:bg-blue-500 selection:text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-lg border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <img src={LOGO_URL} alt="Cindral Logo" className="h-10 w-auto group-hover:drop-shadow-[0_0_8px_rgba(0,174,239,0.5)] transition-all" />
              <span className="text-xl font-display font-bold tracking-tight text-white">Cindral</span>
            </Link>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/" className="text-sm font-medium text-gray-300 hover:text-cindral-blue transition-colors">Home</Link>
              <Link to="/about" className="text-sm font-medium text-gray-300 hover:text-cindral-blue transition-colors">About</Link>
              
              <div className="relative group">
                <button className="flex items-center space-x-1 text-sm font-medium text-gray-300 hover:text-cindral-blue transition-colors focus:outline-none">
                  <span>Divisions</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                {/* Dropdown */}
                <div className="absolute left-0 mt-2 w-56 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-left overflow-hidden">
                  <div className="py-2">
                    {divisions.map(div => (
                      <Link 
                        key={div.id}
                        to={`/division/${div.id}`}
                        className="block px-4 py-3 text-sm text-gray-300 hover:bg-slate-800 hover:text-white transition-colors"
                      >
                        {div.title}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              <Link to="/team" className="text-sm font-medium text-gray-300 hover:text-cindral-blue transition-colors">Team</Link>
              <Link to="/csr" className="text-sm font-medium text-gray-300 hover:text-cindral-blue transition-colors">Impact</Link>
              <Link to="/resources" className="text-sm font-medium text-gray-300 hover:text-cindral-blue transition-colors">Resources</Link>
              <Link to="/client" className="text-sm font-medium text-gray-300 hover:text-cindral-blue transition-colors">Client Panel</Link>
              
              <Link to="/contact" className="ml-4 px-5 py-2 text-sm font-medium bg-white text-slate-900 rounded-full hover:bg-cindral-blue hover:text-white transition-all">
                Contact
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button onClick={toggleMenu} className="text-gray-300 hover:text-white p-2">
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-slate-900 border-b border-slate-700">
            <div className="px-4 pt-2 pb-6 space-y-2">
              <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-slate-800 hover:text-white">Home</Link>
              <Link to="/about" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-slate-800 hover:text-white">About</Link>
              
              <button 
                onClick={() => setIsDivisionsOpen(!isDivisionsOpen)}
                className="w-full text-left flex justify-between items-center px-3 py-2 rounded-md text-base font-medium hover:bg-slate-800 hover:text-white"
              >
                <span>Divisions</span>
                <ChevronDown className={`w-4 h-4 transform transition-transform ${isDivisionsOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isDivisionsOpen && (
                <div className="pl-6 space-y-1 border-l-2 border-slate-800 ml-3">
                  {divisions.map(div => (
                    <Link 
                      key={div.id}
                      to={`/division/${div.id}`}
                      className="block px-3 py-2 rounded-md text-sm font-medium text-gray-400 hover:text-white"
                    >
                      {div.title}
                    </Link>
                  ))}
                </div>
              )}

              <Link to="/team" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-slate-800 hover:text-white">Team</Link>
              <Link to="/csr" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-slate-800 hover:text-white">CSR & Impact</Link>
              <Link to="/resources" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-slate-800 hover:text-white">Resources</Link>
              <Link to="/client" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-slate-800 hover:text-white">Client Panel</Link>
              <Link to="/contact" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-slate-800 hover:text-white">Contact</Link>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-grow pt-20">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900/80 backdrop-blur-lg border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-2 space-y-4">
              <div className="flex items-center space-x-3">
                <img src={LOGO_URL} alt="Cindral" className="h-8 w-auto grayscale opacity-70" />
                <span className="text-xl font-display font-bold text-gray-400">Cindral</span>
              </div>
              <p className="text-gray-500 text-sm max-w-sm leading-relaxed">
                Building Humans, Not Machines. Cindral Studios is a collective of labs, studios, and creators shaping the digital frontier with empathy and innovation.
              </p>
            </div>
            
            <div>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">Divisions</h3>
              <ul className="space-y-3">
                {divisions.map(div => (
                  <li key={div.id}>
                    <Link to={`/division/${div.id}`} className="text-gray-400 hover:text-cindral-blue text-sm transition-colors">
                      {div.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">Company</h3>
              <ul className="space-y-3">
                <li><Link to="/about" className="text-gray-400 hover:text-cindral-blue text-sm transition-colors">About Us</Link></li>
                <li><Link to="/team" className="text-gray-400 hover:text-cindral-blue text-sm transition-colors">Our Team</Link></li>
                <li><Link to="/resources" className="text-gray-400 hover:text-cindral-blue text-sm transition-colors">Resources</Link></li>
                <li><Link to="/client" className="text-gray-400 hover:text-cindral-blue text-sm transition-colors">Client Panel</Link></li>
                <li><Link to="/contact" className="text-gray-400 hover:text-cindral-blue text-sm transition-colors">Contact</Link></li>
                <li><Link to="/admin" className="text-gray-400 hover:text-cindral-blue text-sm transition-colors">Admin</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-16 pt-8 border-t border-slate-800/50 flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
            <p>
              &copy; {new Date().getFullYear()} Cindral Studios OPC Pvt Ltd.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
               <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
               <a href="#" className="hover:text-white transition-colors">Twitter</a>
               <a href="#" className="hover:text-white transition-colors">Instagram</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
