import React from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { ArrowLeft } from 'lucide-react';

const ProjectPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { projects, divisions, team, isLoading } = useData();
  const project = projects.find(p => p.id === id);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Loading project...
      </div>
    );
  }

  if (!project) {
    return <Navigate to="/" />;
  }

  const division = divisions.find(d => d.id === project.divisionId);
  const teamMembers = team.filter(member => member.projectIds.includes(project.id));

  return (
    <article className="min-h-screen pb-24">
      {/* Hero Image */}
      <div className="w-full h-[60vh] relative">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent z-10"></div>
        <img 
          src={project.images[0]} 
          alt={project.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute top-24 left-4 sm:left-8 z-50">
           <Link to={`/division/${project.divisionId}`} className="inline-flex items-center text-white bg-black/50 hover:bg-black/70 px-4 py-2 rounded-full backdrop-blur transition-colors border border-white/10">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to {division?.title}
           </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-20">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 md:p-12 shadow-2xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <span className={`text-sm font-bold uppercase tracking-wider ${division?.color}`}>{division?.title}</span>
              <h1 className="text-3xl md:text-5xl font-display font-bold mt-2 text-white">{project.title}</h1>
            </div>
            <div className="text-right">
              <div className="text-2xl font-mono text-white">{project.year}</div>
              {project.client && <div className="text-gray-400 text-sm">{project.client}</div>}
            </div>
          </div>

          <div className="prose prose-invert prose-lg max-w-none">
            <h3 className="text-gray-200">Summary</h3>
            <p className="text-gray-400 border-l-4 border-slate-700 pl-4 italic">
              {project.summary}
            </p>
            
            <h3 className="text-gray-200 mt-8">The Challenge & Solution</h3>
            <p className="text-gray-400 leading-relaxed">
              {project.content}
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
            {project.images.slice(1).map((img, idx) => (
              <img 
                key={idx} 
                src={img} 
                alt={`${project.title} detail ${idx + 1}`} 
                className="rounded-lg border border-slate-800 hover:opacity-90 transition-opacity cursor-pointer"
              />
            ))}
          </div>

          {/* Built By Section */}
          {teamMembers.length > 0 && (
            <div className="mt-16 pt-12 border-t border-slate-800">
              <h3 className="text-xl font-bold text-white mb-6">Built by</h3>
              <div className="flex flex-wrap gap-6">
                {teamMembers.map(member => (
                  <Link key={member.id} to={`/team/${member.id}`} className="group flex items-center space-x-3 bg-slate-800 hover:bg-slate-700 p-2 pr-4 rounded-full transition-colors border border-slate-700 hover:border-slate-500">
                    <img src={member.image} alt={member.name} className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <p className="text-sm font-bold text-white group-hover:text-cindral-blue transition-colors">{member.name}</p>
                      <p className="text-xs text-gray-400">{member.role}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bonsai Integration Mention */}
        <div className="mt-8 bg-green-950/20 border border-green-900/50 rounded-xl p-6 flex items-start space-x-4">
          <div className="flex-shrink-0 bg-green-900/50 p-3 rounded-full">
            <span className="text-2xl">🌳</span>
          </div>
          <div>
            <h4 className="text-lg font-bold text-green-400 mb-1">Project Bonsai Planted</h4>
            <p className="text-sm text-green-200/70">
              A dedicated bonsai tree was planted at the inception of {project.title}. 
              It is currently growing in our Cindral Greenhouse, symbolizing the dedication required to bring this project to life.
            </p>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ProjectPage;
