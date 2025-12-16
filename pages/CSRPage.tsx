import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { PARTNERS, FEATURED_STATS } from '../constants';
import * as LucideIcons from 'lucide-react';
import { Heart, BookOpen, Sprout, ArrowUpRight, Globe, Laptop, ArrowRight, Activity, Users, Leaf, School, HandHeart, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useData } from '../contexts/DataContext';

const CSRPage: React.FC = () => {
  const { initiatives } = useData();

  // Aggregate stats from all initiatives using featured list
  const [liveStats, setLiveStats] = useState(() => {
    const allStats = initiatives.flatMap(init => init.stats);

    // Normalize and filter based on FEATURED_STATS
    return FEATURED_STATS.map(featuredTitle => {
      // Normalize by removing 's' from the end of any word
      const normalize = (str: string) => str.toLowerCase().replace(/s\b/g, '').trim();
      const normalizedFeatured = normalize(featuredTitle);

      const totalValue = allStats.reduce((sum, stat) => {
        const normalizedStat = normalize(stat.label);
        if (normalizedStat === normalizedFeatured) {
          return sum + (Number(stat.value) || 0);
        }
        return sum;
      }, 0);

      if (totalValue > 0) {
        return { label: featuredTitle, value: totalValue };
      }
      return null;
    }).filter(Boolean) as { label: string, value: number }[];
  });

  // Update live stats when initiatives change
  useEffect(() => {
    const allStats = initiatives.flatMap(init => init.stats);

    const aggregated = FEATURED_STATS.map(featuredTitle => {
      // Normalize by removing 's' from the end of any word
      const normalize = (str: string) => str.toLowerCase().replace(/s\b/g, '').trim();
      const normalizedFeatured = normalize(featuredTitle);

      const totalValue = allStats.reduce((sum, stat) => {
        const normalizedStat = normalize(stat.label);
        if (normalizedStat === normalizedFeatured) {
          return sum + (Number(stat.value) || 0);
        }
        return sum;
      }, 0);

      if (totalValue > 0) {
        return { label: featuredTitle, value: totalValue };
      }
      return null;
    }).filter(Boolean) as { label: string, value: number }[];

    setLiveStats(aggregated);
  }, [initiatives]);



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

  // Helper to get icon by name (dynamic icon selection for cards)
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'BookOpen': return <BookOpen size={24} />;
      case 'Sprout': return <Sprout size={24} />;
      case 'Laptop': return <Laptop size={24} />;
      default: return <Heart size={24} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-pink-500/30">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-slate-900 border-b border-slate-800">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        <div className="absolute top-0 right-0 p-32 bg-blue-500/10 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 p-32 bg-purple-500/10 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-slate-800 ring-1 ring-slate-700 rounded-full mb-8 shadow-lg backdrop-blur-md">
            <Heart className="w-6 h-6 text-pink-500 mr-2" />
            <span className="text-pink-500 font-bold uppercase tracking-widest text-xs">Cindral Cares</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-8 tracking-tight">
            Impact <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Beyond Code</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Technology finds its true purpose when it serves humanity.
            We measure our success not just by lines of code, but by lives improved.
          </p>
        </div>
      </div>

      {/* Live Statistics Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl">
          <div className="flex items-center justify-between mb-8 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <h2 className="text-sm font-bold text-slate-300 uppercase tracking-widest">Global Impact Tracker</h2>
            </div>
            <span className="text-xs text-slate-500 font-mono">UPDATED: JUST NOW</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {liveStats.map((stat, idx) => (
              <div key={idx} className="flex flex-col p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:bg-slate-800 transition-all duration-300 group">
                <span className="text-slate-400 text-xs font-semibold uppercase mb-2 group-hover:text-white transition-colors">{stat.label}</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-display font-bold text-white tabular-nums tracking-tight group-hover:scale-105 transition-transform origin-left">
                    {stat.value.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Dynamic Bar Chart */}
          {/* <div className="h-[300px] w-full mt-8 pt-8 border-t border-slate-800">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Real-time Impact Visualization</h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={liveStats} layout="vertical" margin={{ left: 20, right: 20 }}>
                <XAxis type="number" scale="log" domain={[1, 'auto']} hide />
                <YAxis
                  type="category"
                  dataKey="label"
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  width={140}
                  tick={{ fill: '#94a3b8', fontWeight: 500 }}
                />
                <Tooltip
                  cursor={{ fill: '#1e293b', opacity: 0.5 }}
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#f8fafc', fontWeight: 600 }}
                  labelStyle={{ color: '#94a3b8', marginBottom: '0.5rem', fontSize: '0.75rem', textTransform: 'uppercase' }}
                  formatter={(value: number) => [value.toLocaleString(), 'Value']}
                />
                <Bar dataKey="value" radius={[0, 6, 6, 0]} animationDuration={1000} barSize={24}>
                  {liveStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#3b82f6', '#10b981', '#a855f7', '#ec4899', '#f59e0b'][index % 5]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div> */}
        </div>
      </div>

      {/* Initiatives Feed */}
      <div className="py-32 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">Our Initiatives</h2>
              <p className="text-slate-400 max-w-xl">
                Strategic programs designed to create sustainable, long-term value for our communities and the planet.
              </p>
            </div>
            <button className="text-cindral-blue font-semibold flex items-center hover:text-white transition-colors">
              View Annual Report <ArrowUpRight className="ml-2 w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {initiatives.map((initiative) => {
              // Dynamic icon lookup
              // Dynamic icon lookup
              const getIcon = (name: string) => {
                // Normalize input to PascalCase (e.g. "rain" -> "Rain", "book-open" -> "BookOpen")
                const normalized = name.split(/[-_ ]/)
                  .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
                  .join('');

                // @ts-ignore - Dynamic lookup from LucideIcons
                const Icon = LucideIcons[normalized] || LucideIcons[name] || LucideIcons.HelpCircle;
                return Icon;
              };

              const IconComponent = getIcon(initiative.iconName);

              return (
                <Link
                  key={initiative.id}
                  to={`/csr/${initiative.id}`}
                  className="group relative bg-slate-800 rounded-3xl overflow-hidden border border-slate-700 hover:border-slate-500 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-2"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/50 pointer-events-none" />
                  <div className="relative h-64 overflow-hidden">
                    <div className={`absolute inset-0 bg-blue-600/20 mix-blend-overlay z-10 ${initiative.bgHover} transition-colors duration-500`} />
                    <img
                      src={initiative.image}
                      alt={initiative.title}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-6 left-6 bg-slate-900/90 backdrop-blur-md p-3 rounded-2xl border border-slate-700 shadow-xl">
                      <IconComponent className={`w-6 h-6 ${initiative.color}`} />
                    </div>
                  </div>

                  <div className="p-8 relative">
                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                      {initiative.title}
                    </h3>
                    <p className="text-slate-400 mb-6 line-clamp-2">
                      {initiative.description}
                    </p>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      {initiative.stats.slice(0, 2).map((stat, idx) => (
                        <div key={idx}>
                          <p className="text-2xl font-bold text-white">
                            {stat.value.toLocaleString()}
                          </p>
                          <p className="text-xs text-slate-500 uppercase tracking-wider">{stat.label}</p>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center text-sm font-bold text-white group-hover:translate-x-2 transition-transform duration-300">
                      Explore Initiative <ArrowRight className="w-4 h-4 ml-2 text-blue-400" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* SDG Alignment Section (Preserved) */}
      <div className="py-24 bg-slate-900 relative overflow-hidden border-t border-slate-800">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold text-white mb-6">Alignment with UN SDGs</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-green-500 mx-auto rounded-full"></div>
          </div>

          {/* Informative Block */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-3xl p-8 md:p-12 mb-16 shadow-lg">
            <div className="flex flex-col md:flex-row gap-12 items-center">
              <div className="md:w-1/2">
                <div className="flex items-center space-x-3 mb-6">
                  <Globe className="w-6 h-6 text-blue-400" />
                  <span className="text-blue-400 font-bold uppercase tracking-wider text-sm">Global Goals 2030</span>
                </div>
                <h3 className="text-3xl font-bold text-white mb-4 leading-tight">A Shared Blueprint for Peace and Prosperity</h3>
                <p className="text-slate-300 leading-relaxed mb-6 text-lg">
                  The Sustainable Development Goals (SDGs) are a universal call to action to end poverty, protect the planet, and ensure that by 2030 all people enjoy peace and prosperity.
                </p>
                <p className="text-slate-400 leading-relaxed">
                  At Cindral, we don't operate in a vacuum. We recognize that our work in technology, education, and innovation has ripples that extend far beyond our immediate client projects. We have strategically aligned our CSR initiatives to contribute directly to these global goals.
                </p>
              </div>
              <div className="md:w-1/2 flex justify-center w-full">
                <div className="grid grid-cols-3 gap-3 sm:gap-4 p-6 bg-slate-900/50 rounded-2xl border border-slate-800">
                  {/* Abstract visual representation of SDGs grid */}
                  {[...Array(9)].map((_, i) => (
                    <div key={i} className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl shadow-lg opacity-80 hover:opacity-100 transition-opacity ${[
                      'bg-[#E5243B]', 'bg-[#DDA63A]', 'bg-[#4C9F38]',
                      'bg-[#C5192D]', 'bg-[#FF3A21]', 'bg-[#26BDE2]',
                      'bg-[#FCC30B]', 'bg-[#A21942]', 'bg-[#FD6925]'
                    ][i]} animate-pulse`} style={{ animationDelay: `${i * 0.3}s` }}></div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* SDG Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {SDGs.map((sdg) => (
              <div key={sdg.id} className="bg-slate-900 rounded-2xl p-8 border border-slate-800 flex flex-col h-full hover:border-slate-600 transition-colors duration-300 hover:bg-slate-800">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-xl font-black text-white uppercase tracking-wide w-2/3 leading-tight">
                    {sdg.title.split(' ').map((word, i) => (
                      <span key={i} className="block">{word}</span>
                    ))}
                    {sdg.title.includes('&') && !sdg.title.includes(' ') && <span className="block">{sdg.title}</span>}
                  </h3>
                  <span className="text-5xl font-bold text-slate-800">{sdg.id}</span>
                </div>
                <p className="text-slate-400 text-sm font-medium leading-relaxed flex-grow">
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

      {/* Partners (Preserved) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <h2 className="text-2xl font-bold text-slate-500 mb-12 uppercase tracking-widest">Our CSR Partners</h2>
        <div className="flex flex-wrap justify-center gap-12 items-center opacity-70 hover:opacity-100 transition-opacity">
          {PARTNERS.map((partner, idx) => (
            <div key={idx} className="group flex flex-col items-center space-y-4">
              <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center border border-slate-700 group-hover:border-blue-500 transition-colors group-hover:scale-110 duration-300">
                <span className="text-xl font-bold text-slate-500 group-hover:text-white">{partner.name.charAt(0)}</span>
              </div>
              <span className="text-sm font-medium text-slate-400">{partner.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CSRPage;

/* 
================================================================================
EXISTING CODE COMMENTED OUT AS REQUESTED
================================================================================
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-fade-in-up delay-100">
        <div className="flex items-center mb-8">
            <span className="flex h-3 w-3 relative mr-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <h2 className="text-xl font-bold text-white tracking-wide uppercase">Live Impact Tracker</h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
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

      <div className="bg-slate-900 py-16 border-t border-slate-800 animate-fade-in-up delay-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <h2 className="text-3xl font-display font-bold text-white mb-12 text-center">Key Initiatives</h2>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
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

      <div className="py-24 bg-slate-950 relative overflow-hidden border-t border-slate-900 animate-fade-in-up delay-300">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              
              <div className="text-center mb-16">
                <h2 className="text-4xl font-display font-bold text-white mb-6">Alignment with UN SDGs</h2>
                <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-green-500 mx-auto rounded-full"></div>
              </div>

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
*/