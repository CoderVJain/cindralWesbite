import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { INITIAL_CSR_STATS, PARTNERS } from '../constants';
import { Heart, BookOpen, Sprout, ArrowUpRight, Globe } from 'lucide-react';

const CSRPage: React.FC = () => {
  // Simulate live stats updating
  const [stats, setStats] = useState(INITIAL_CSR_STATS);

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prevStats => 
        prevStats.map(stat => {
          if (stat.name === 'Volunteer Hours') {
             return { ...stat, value: stat.value + Math.floor(Math.random() * 2) };
          }
          return stat;
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const SDGs = [
    {
      id: '04',
      title: 'Quality Education',
      target: 'Target 4.4',
      description: 'Ensuring inclusive and equitable quality education and promoting lifelong learning opportunities through our "Tech for Future" bootcamps.'
    },
    {
      id: '08',
      title: 'Decent Work & Growth',
      target: 'Target 8.2',
      description: 'Promoting sustained, inclusive economic growth, full and productive employment and decent work for all via our "Building Humans" philosophy.'
    },
    {
      id: '09',
      title: 'Industry & Innovation',
      target: 'Target 9.5',
      description: 'Building resilient infrastructure, promoting inclusive and sustainable industrialization and fostering innovation at Cindral Labs.'
    },
    {
      id: '15',
      title: 'Life on Land',
      target: 'Target 15.2',
      description: 'Protect, restore and promote sustainable use of terrestrial ecosystems through our dedicated Bonsai reforestation and awareness initiatives.'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 py-24 px-4 sm:px-6 lg:px-8 border-b border-slate-700 animate-fade-in-up">
        <div className="max-w-7xl mx-auto text-center">
           <div className="inline-flex items-center justify-center p-3 bg-pink-500/10 rounded-full mb-6">
             <Heart className="w-8 h-8 text-pink-500" />
           </div>
           <h1 className="text-5xl font-display font-bold text-white mb-6">Impact Beyond Code</h1>
           <p className="text-xl text-gray-400 max-w-2xl mx-auto">
             At Cindral, we believe technology should empower humanity. Our CSR initiatives focus on education, environmental sustainability, and community support.
           </p>
        </div>
      </div>

      {/* Live Statistics */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-fade-in-up delay-100">
        <div className="flex items-center mb-8">
            <span className="flex h-3 w-3 relative mr-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <h2 className="text-xl font-bold text-white tracking-wide uppercase">Live Impact Tracker</h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Stats Cards */}
            <div className="lg:col-span-1 grid grid-cols-1 gap-4">
              {stats.map((stat, idx) => (
                <div key={idx} className="bg-slate-800 p-6 rounded-xl border border-slate-700 flex justify-between items-center hover:bg-slate-750 transition-colors">
                  <div>
                    <p className="text-gray-400 text-sm font-medium uppercase">{stat.name}</p>
                    <p className="text-3xl font-bold text-white mt-1">
                      {stat.value.toLocaleString()}<span className="text-sm text-gray-500 ml-1">{stat.unit}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Chart */}
            <div className="lg:col-span-2 bg-slate-800 p-6 rounded-xl border border-slate-700 h-[400px]">
              <h3 className="text-gray-400 text-sm font-medium uppercase mb-4">Impact Distribution</h3>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats}>
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                    cursor={{fill: '#334155'}}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {stats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={['#00AEEF', '#22c55e', '#a855f7', '#ec4899'][index % 4]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
        </div>
      </div>

      {/* Initiatives */}
      <div className="bg-slate-900 py-16 border-t border-slate-800 animate-fade-in-up delay-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <h2 className="text-3xl font-display font-bold text-white mb-12 text-center">Key Initiatives</h2>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Education */}
              <div className="flex gap-6 group">
                <div className="flex-shrink-0">
                  <div className="p-4 bg-blue-500/10 rounded-2xl text-blue-400 group-hover:bg-blue-500/20 group-hover:scale-110 transition-all duration-300">
                    <BookOpen size={32} />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">Tech For Future</h3>
                  <p className="text-gray-400 leading-relaxed mb-4">
                    We partner with rural schools to provide coding bootcamps and hardware kits. Our goal is to bridge the digital divide by equipping the next generation with the tools they need to succeed in a digital economy.
                  </p>
                </div>
              </div>

              {/* Bonsai */}
              <div className="flex gap-6 group">
                <div className="flex-shrink-0">
                  <div className="p-4 bg-green-500/10 rounded-2xl text-green-400 group-hover:bg-green-500/20 group-hover:scale-110 transition-all duration-300">
                    <Sprout size={32} />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-green-400 transition-colors">The Bonsai Project</h3>
                  <p className="text-gray-400 leading-relaxed mb-4">
                    For every completed commercial project, Cindral plants a Bonsai tree. This isn't just about greenery; it's a commitment to patience, long-term thinking, and nurturing growth—values that are central to both nature and software development.
                  </p>
                  <ul className="text-sm text-gray-500 space-y-2 list-disc list-inside">
                    <li>45+ Trees currently in our greenhouse</li>
                    <li>Species include Juniper, Ficus, and Maple</li>
                    <li>Each client receives a quarterly photo update of their tree</li>
                  </ul>
                </div>
              </div>
           </div>
        </div>
      </div>

      {/* SDG Alignment Section */}
      <div className="py-24 bg-slate-950 relative overflow-hidden border-t border-slate-900 animate-fade-in-up delay-300">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              
              <div className="text-center mb-16">
                <h2 className="text-4xl font-display font-bold text-white mb-6">Alignment with UN SDGs</h2>
                <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-green-500 mx-auto rounded-full"></div>
              </div>

              {/* Informative Block */}
              <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-3xl p-8 md:p-12 mb-16 shadow-2xl">
                 <div className="flex flex-col md:flex-row gap-12 items-center">
                    <div className="md:w-1/2">
                       <div className="flex items-center space-x-3 mb-6">
                         <Globe className="w-6 h-6 text-cindral-blue" />
                         <span className="text-cindral-blue font-bold uppercase tracking-wider text-sm">Global Goals 2030</span>
                       </div>
                       <h3 className="text-3xl font-bold text-white mb-4 leading-tight">A Shared Blueprint for Peace and Prosperity</h3>
                       <p className="text-gray-300 leading-relaxed mb-6 text-lg">
                         The Sustainable Development Goals (SDGs) are a universal call to action to end poverty, protect the planet, and ensure that by 2030 all people enjoy peace and prosperity.
                       </p>
                       <p className="text-gray-400 leading-relaxed">
                         At Cindral, we don't operate in a vacuum. We recognize that our work in technology, education, and innovation has ripples that extend far beyond our immediate client projects. We have strategically aligned our CSR initiatives to contribute directly to these global goals.
                       </p>
                    </div>
                    <div className="md:w-1/2 flex justify-center w-full">
                       <div className="grid grid-cols-3 gap-3 sm:gap-4 p-6 bg-slate-800/50 rounded-2xl border border-slate-700/50">
                          {/* Abstract visual representation of SDGs grid */}
                          {[...Array(9)].map((_, i) => (
                             <div key={i} className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl shadow-lg ${[
                               'bg-[#E5243B]', 'bg-[#DDA63A]', 'bg-[#4C9F38]', 
                               'bg-[#C5192D]', 'bg-[#FF3A21]', 'bg-[#26BDE2]', 
                               'bg-[#FCC30B]', 'bg-[#A21942]', 'bg-[#FD6925]'
                             ][i]} animate-pulse`} style={{animationDelay: `${i * 0.3}s`}}></div>
                          ))}
                       </div>
                    </div>
                 </div>
              </div>

              {/* SDG Cards Grid - Restored Styling */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {SDGs.map((sdg) => (
                    <div key={sdg.id} className="bg-[#0F172A] rounded-2xl p-8 border border-slate-800 flex flex-col h-full hover:border-slate-600 transition-colors duration-300">
                        <div className="flex justify-between items-start mb-6">
                            <h3 className="text-xl font-black text-white uppercase tracking-wide w-2/3 leading-tight">
                              {sdg.title.split(' ').map((word, i) => (
                                <span key={i} className="block">{word}</span>
                              ))}
                              {sdg.title.includes('&') && !sdg.title.includes(' ') && <span className="block">{sdg.title}</span>}
                            </h3>
                            <span className="text-5xl font-bold text-slate-800/80">{sdg.id}</span>
                        </div>
                        <p className="text-gray-400 text-sm font-medium leading-relaxed flex-grow">
                          {sdg.description}
                        </p>
                        <div className="mt-8 pt-6 border-t border-slate-800">
                          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{sdg.target}</span>
                        </div>
                    </div>
                  ))}
              </div>
          </div>
      </div>

      {/* Partners */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center animate-fade-in-up delay-400">
         <h2 className="text-2xl font-bold text-gray-400 mb-12 uppercase tracking-widest">Our CSR Partners</h2>
         <div className="flex flex-wrap justify-center gap-12 items-center opacity-70 hover:opacity-100 transition-opacity">
            {PARTNERS.map((partner, idx) => (
              <div key={idx} className="group flex flex-col items-center space-y-4">
                 <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center border border-slate-700 group-hover:border-cindral-blue transition-colors group-hover:scale-110 duration-300">
                    <span className="text-xl font-bold text-gray-500 group-hover:text-white">{partner.name.charAt(0)}</span>
                 </div>
                 <span className="text-sm font-medium text-gray-400">{partner.name}</span>
              </div>
            ))}
         </div>
         <div className="mt-16">
            <a href="mailto:partnerships@cindral.com" className="inline-flex items-center text-cindral-blue hover:text-white font-semibold transition-colors">
              Become a Partner <ArrowUpRight className="ml-2 w-4 h-4" />
            </a>
         </div>
      </div>
    </div>
  );
};

export default CSRPage;