import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { DataProvider } from './contexts/DataContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import DivisionPage from './pages/DivisionPage';
import ProjectPage from './pages/ProjectPage';
import TeamMemberPage from './pages/TeamMemberPage';
import CSRPage from './pages/CSRPage';
import AboutPage from './pages/AboutPage';
import TeamPage from './pages/TeamPage';
import ContactPage from './pages/ContactPage';
import ResourcesPage from './pages/ResourcesPage';
import BrandAssetsPage from './pages/BrandAssetsPage';
import AdminPage from './pages/AdminPage';
import AdminClientProjectPage from './pages/AdminClientProjectPage';
import ClientPortalPage from './pages/ClientPortalPage';
import { BRAND, LOGO_URL } from './constants';

// Loading Screen Component
const PageLoader = ({ isLoading }: { isLoading: boolean }) => {
  return (
    <div 
      className={`fixed inset-0 z-[100] bg-slate-900 flex flex-col items-center justify-center transition-opacity duration-500 ease-in-out ${
        isLoading ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-cindral-blue/30 blur-2xl rounded-full animate-pulse-slow"></div>
        <img src={LOGO_URL} alt="Loading..." className="h-16 w-auto relative z-10 animate-float" />
      </div>
    </div>
  );
};

// Main Content Wrapper to handle Scroll & Transitions
const MainContent = () => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [displayLocation, setDisplayLocation] = useState(location);

  useEffect(() => {
    if (location.pathname !== displayLocation.pathname) {
      setIsLoading(true);
      
      const timer = setTimeout(() => {
        setDisplayLocation(location);
        window.scrollTo(0, 0);
        
        setTimeout(() => {
          setIsLoading(false);
        }, 500); 
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [location, displayLocation]);

  return (
    <>
      <PageLoader isLoading={isLoading} />
      <div className={`transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
        <Routes location={displayLocation}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/division/:id" element={<DivisionPage />} />
          <Route path="/project/:id" element={<ProjectPage />} />
          <Route path="/team/:id" element={<TeamMemberPage />} />
          <Route path="/csr" element={<CSRPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/resources/brand-assets" element={<BrandAssetsPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/client-project/:id" element={<AdminClientProjectPage />} />
          <Route path="/client" element={<ClientPortalPage />} />
        </Routes>
      </div>
    </>
  );
};

const ThemeController = () => {
  React.useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--color-primary', BRAND.colors.primary);
    root.style.setProperty('--color-background', BRAND.colors.background);
    root.style.setProperty('--color-text', BRAND.colors.text);
  }, []);
  return null;
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <DataProvider>
        <ThemeController />
        <Layout>
          <MainContent />
        </Layout>
      </DataProvider>
    </HashRouter>
  );
};

export default App;
