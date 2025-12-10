import React from 'react';
import { FileText, Image, Newspaper, Book, Wrench, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ResourceCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
  isComingSoon?: boolean;
}

const ResourceCard: React.FC<ResourceCardProps> = ({ title, description, icon, link, isComingSoon = false }) => (
  <Link 
    to={isComingSoon ? '#' : link}
    className={`block p-8 bg-slate-800 rounded-3xl border border-slate-700 transition-all ${isComingSoon ? 'opacity-70 cursor-not-allowed' : 'hover:border-cindral-blue hover:-translate-y-1 hover:shadow-xl'}`}
  >
    <div className="flex items-start justify-between mb-6">
      <div className={`p-4 rounded-2xl ${isComingSoon ? 'bg-slate-700 text-gray-400' : 'bg-slate-900 text-cindral-blue'}`}>
        {icon}
      </div>
      {isComingSoon && (
        <span className="px-3 py-1 bg-slate-700 text-gray-300 text-xs font-bold rounded-full uppercase tracking-wider">Coming Soon</span>
      )}
    </div>
    <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
    <p className="text-gray-400 mb-6 line-clamp-2">{description}</p>
    {!isComingSoon && (
      <div className="flex items-center text-sm font-bold text-white group">
        Access Resource <ArrowRight className="ml-2 w-4 h-4" />
      </div>
    )}
  </Link>
);

const ResourcesPage: React.FC = () => {
  return (
    <div className="min-h-screen py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-display font-bold text-white mb-6">Resources</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Everything you need to know about Cindral. Assets, stories, guides, and tools for our partners and community.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <ResourceCard 
            title="Brand Assets"
            description="Download official logos, color palettes, typography guides, and brand usage guidelines."
            icon={<Image size={32} />}
            link="/resources/brand-assets"
            isComingSoon={false}
          />
          <ResourceCard 
            title="Media & Press Kit"
            description="High-resolution images, executive bios, and press releases for media coverage."
            icon={<Newspaper size={32} />}
            link="#"
            isComingSoon={true}
          />
          <ResourceCard 
            title="Stories"
            description="Deep dives into our projects, behind-the-scenes content, and team spotlights."
            icon={<Book size={32} />}
            link="#"
            isComingSoon={true}
          />
          <ResourceCard 
            title="Documentation"
            description="Company handbook, policies, and technical documentation for open-source initiatives."
            icon={<FileText size={32} />}
            link="#"
            isComingSoon={true}
          />
          <ResourceCard 
            title="Tools"
            description="Internal tools and utilities we are opening up to the community."
            icon={<Wrench size={32} />}
            link="#"
            isComingSoon={true}
          />
        </div>
      </div>
    </div>
  );
};

export default ResourcesPage;