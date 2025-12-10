import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sprout, FlaskConical, Briefcase, Glasses, Gamepad2 } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { LOGO_URL } from '../constants';

const getIcon = (name: string) => {
  switch (name) {
    case 'FlaskConical': return <FlaskConical className="w-8 h-8" />;
    case 'Briefcase': return <Briefcase className="w-8 h-8" />;
    case 'Glasses': return <Glasses className="w-8 h-8" />;
    case 'Gamepad2': return <Gamepad2 className="w-8 h-8" />;
    default: return null;
  }
};

const Home: React.FC = () => {
  const { divisions, team } = useData();

  return (
    <div className="space-y-32 pb-32">
      {/* Modern Hero Section */}
      <section className="relative min-h-[95vh] flex items-center justify-center overflow-hidden">
        {/* Subtle Background Elements */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        <div className="absolute top-1/4 -left-24 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[150px] -z-10 animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 -right-24 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[150px] -z-10"></div>

        <div className="text-center px-4 max-w-5xl mx-auto z-10 animate-fade-in-up">
          <div className="flex justify-center mb-12">
             <div className="relative">
                <div className="absolute inset-0 bg-cindral-blue/30 blur-3xl rounded-full"></div>
                <img src={LOGO_URL} alt="Cindral" className="relative w-40 h-auto animate-float" />
             </div>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-display font-bold mb-16 leading-tight tracking-tight text-white">
            Building Humans,<br />
            <span className="text-white">Not Machines.</span>
          </h1>
          
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <a href="#divisions" className="group px-8 py-4 bg-white text-slate-900 font-bold rounded-full transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] flex items-center justify-center">
              Explore Our World <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <Link to="/about" className="px-8 py-4 bg-transparent border border-gray-600 hover:border-white text-white font-medium rounded-full transition-all hover:bg-white/5">
              Our Philosophy
            </Link>
          </div>
        </div>
      </section>

      {/* Divisions Section - Glass Cards */}
      <section id="divisions" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-gray-800 pb-8 animate-fade-in-up delay-100">
          <div>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">Our Ecosystem</h2>
            <p className="text-gray-400 text-lg">Specialized divisions, united by a singular vision.</p>
          </div>
          <div className="hidden md:block text-right">
             <span className="text-gray-600 font-mono text-sm">01 — 0{divisions.length}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in-up delay-200">
          {divisions.map((division) => (
            <Link 
              key={division.id} 
              to={`/division/${division.id}`}
              className="group relative bg-slate-900 border border-slate-800 rounded-3xl p-10 hover:border-slate-600 transition-all duration-500 overflow-hidden"
            >
              <div className={`absolute -right-10 -top-10 w-64 h-64 bg-gradient-to-br ${division.color === 'text-cyan-400' ? 'from-cyan-900/40' : division.color === 'text-blue-500' ? 'from-blue-900/40' : division.color === 'text-purple-400' ? 'from-purple-900/40' : 'from-pink-900/40'} to-transparent rounded-full blur-3xl group-hover:blur-2xl transition-all duration-700`}></div>
              
              <div className="relative z-10">
                <div className={`mb-6 p-4 rounded-2xl bg-slate-950/50 inline-block border border-slate-800 ${division.color}`}>
                  {getIcon(division.iconName)}
                </div>
                <h3 className="text-3xl font-bold text-white mb-2">{division.title}</h3>
                <p className="text-sm font-bold text-gray-500 mb-6 uppercase tracking-wider">{division.tagline}</p>
                <p className="text-gray-400 mb-8 leading-relaxed max-w-md">{division.description}</p>
                <div className="flex items-center text-sm font-bold text-white group-hover:text-cindral-blue transition-colors">
                  EXPLORE <ArrowRight className="ml-2 w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Modern Bonsai Section */}
      <section className="py-24 relative overflow-hidden animate-fade-in-up delay-300">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-black z-0"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-slate-900/50 border border-slate-800 rounded-[2.5rem] p-8 md:p-16 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1599598425947-d3368270183b?auto=format&fit=crop&q=80&w=1200')] bg-cover bg-center opacity-10 mix-blend-luminosity"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
               <div className="md:w-1/2">
                 <div className="inline-flex items-center space-x-2 text-green-400 mb-6 bg-green-900/30 px-4 py-1.5 rounded-full border border-green-800/50">
                    <Sprout className="w-4 h-4" />
                    <span className="text-sm font-bold tracking-wide uppercase">The Bonsai Initiative</span>
                 </div>
                 <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6 leading-tight">
                   Patience is our<br />Proof of Work.
                 </h2>
                 <p className="text-lg text-gray-400 mb-8 leading-relaxed">
                   We plant a physical Bonsai tree for every project. It’s a commitment to the long game—growing with care, pruning for perfection, and creating something that stands the test of time.
                 </p>
                 <Link to="/csr" className="inline-flex items-center justify-center px-6 py-3 bg-green-600/20 hover:bg-green-600/30 text-green-400 font-semibold rounded-full border border-green-600/50 transition-all">
                    View Our CSR Impact
                 </Link>
               </div>
               <div className="md:w-1/2 flex justify-center">
                  <div className="relative w-64 h-64 md:w-80 md:h-80 group">
                     <div className="absolute inset-0 bg-green-500 rounded-full blur-[100px] opacity-20 animate-pulse-slow"></div>
                     <img 
                      src="https://images.unsplash.com/photo-1599598425947-d3368270183b?auto=format&fit=crop&q=80&w=600" 
                      alt="Bonsai" 
                      className="relative w-full h-full object-cover rounded-[2rem] border-2 border-slate-700 shadow-2xl rotate-3 group-hover:rotate-0 transition-transform duration-700"
                     />
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Grid Section - Squaricles */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in-up delay-400">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-display font-bold text-white mb-4">Humans of Cindral</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">{team.length} minds, infinite possibilities. Meet the people behind the pixels.</p>
        </div>

        {/* 20 Member Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-6">
          {team.map((member) => (
            <Link key={member.id} to={`/team/${member.id}`} className="group block text-center">
              <div className="relative aspect-square mb-4 overflow-hidden rounded-[1.5rem] bg-slate-800 border border-slate-700 group-hover:border-cindral-blue/50 transition-colors">
                {/* Skeleton Loader placeholder behind image */}
                <div className="absolute inset-0 skeleton"></div>
                <img 
                  src={member.image} 
                  alt={member.name} 
                  loading="lazy"
                  className="relative z-10 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 transform group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-4 z-20">
                  <span className="text-white text-xs font-bold uppercase tracking-wider">{member.role.split(' ')[0]}</span>
                </div>
              </div>
              <h3 className="text-sm font-bold text-gray-300 group-hover:text-white transition-colors">{member.name}</h3>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
           <Link to="/team" className="inline-flex items-center text-gray-400 hover:text-white border-b border-gray-600 hover:border-white pb-1 transition-all">
             Meet the whole team <ArrowRight className="ml-2 w-4 h-4" />
           </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;