import React from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { ArrowRight, FlaskConical, Briefcase, Glasses, Gamepad2 } from 'lucide-react';

const getIcon = (name: string) => {
  switch (name) {
    case 'FlaskConical': return <FlaskConical className="w-12 h-12" />;
    case 'Briefcase': return <Briefcase className="w-12 h-12" />;
    case 'Glasses': return <Glasses className="w-12 h-12" />;
    case 'Gamepad2': return <Gamepad2 className="w-12 h-12" />;
    default: return null;
  }
};

const DivisionPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { divisions, projects, isLoading } = useData();
  const division = divisions.find(d => d.id === id);
  const divisionProjects = projects.filter(p => p.divisionId === id);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Loading division...
      </div>
    );
  }

  if (!division) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="relative bg-slate-900 border-b border-slate-800 overflow-hidden">
        {/* Banner Background */}
        {division.bannerImage && (
          <div className="absolute inset-0 z-0">
            <img 
              src={division.bannerImage} 
              alt={division.title} 
              className="w-full h-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-slate-900/60"></div>
          </div>
        )}
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className={`inline-block p-4 rounded-2xl bg-slate-800/80 backdrop-blur mb-6 ${division.color}`}>
            {getIcon(division.iconName)}
          </div>
          <h1 className="text-5xl md:text-6xl font-display font-bold text-white mb-4 drop-shadow-lg">{division.title}</h1>
          <p className="text-2xl font-light text-gray-200 mb-8 max-w-2xl drop-shadow-md">{division.tagline}</p>
          <p className="text-lg text-gray-300 max-w-3xl leading-relaxed drop-shadow-sm">{division.description}</p>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold mb-12 border-l-4 border-cindral-blue pl-4">Selected Works</h2>
        
        {divisionProjects.length === 0 ? (
          <p className="text-gray-500">No projects currently listed for this division.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {divisionProjects.map(project => (
              <Link key={project.id} to={`/project/${project.id}`} className="group block">
                <div className="relative aspect-video bg-slate-800 rounded-xl overflow-hidden mb-6">
                  <div className="absolute inset-0 bg-slate-900/50 group-hover:bg-transparent transition-colors z-10"></div>
                  <img 
                    src={project.images[0]} 
                    alt={project.title} 
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" 
                  />
                  <div className="absolute bottom-4 left-4 z-20">
                    <span className="bg-black/70 backdrop-blur text-xs font-mono px-2 py-1 rounded text-white border border-gray-700">
                      {project.year}
                    </span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-cindral-blue transition-colors">
                  {project.title}
                </h3>
                {project.client && (
                  <p className="text-sm text-gray-500 mb-2 uppercase tracking-wide">Client: {project.client}</p>
                )}
                <p className="text-gray-400 mb-4 line-clamp-2">{project.summary}</p>
                <div className="flex items-center text-sm font-semibold text-cindral-blue">
                  Read Case Study <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DivisionPage;
