import React from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { Users, Briefcase, Zap, BookOpen, Activity } from 'lucide-react';

const TeamPage: React.FC = () => {
  const { team, divisions } = useData();

  // Calculate total learning hours
  const totalLearningHours = team.reduce((acc, curr) => acc + (curr.learningStats?.totalHours || 0), 0);
  // Calculate total activity minutes
  const totalActivityMinutes = team.reduce((acc, curr) => acc + (curr.fitnessStats?.weeklyMinutes || 0), 0);

  return (
    <div className="min-h-screen">
      <div className="py-24 bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-display font-bold text-white mb-6">Our Team</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            A diverse group of {team.length} dreamers, doers, and creators working together to build the future.
          </p>
        </div>
      </div>

      {/* Enhanced Statistics Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl -mr-8 -mt-8 group-hover:bg-blue-500/20 transition-all"></div>
                <Users className="w-8 h-8 text-cindral-blue mb-3" />
                <div className="relative z-10">
                  <span className="text-3xl font-black text-white block mb-1">{team.length}</span>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Active Creators</span>
                </div>
            </div>

            <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl -mr-8 -mt-8 group-hover:bg-purple-500/20 transition-all"></div>
                <Briefcase className="w-8 h-8 text-purple-500 mb-3" />
                <div className="relative z-10">
                  <span className="text-3xl font-black text-white block mb-1">{divisions.length}</span>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Divisions</span>
                </div>
            </div>

            <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/10 rounded-full blur-2xl -mr-8 -mt-8 group-hover:bg-yellow-500/20 transition-all"></div>
                <Zap className="w-8 h-8 text-yellow-500 mb-3" />
                <div className="relative z-10">
                  <span className="text-3xl font-black text-white block mb-1">{totalLearningHours}+</span>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Hours Upskilled</span>
                </div>
                <p className="text-[10px] text-gray-500 mt-1">Continuous Learning</p>
            </div>

            <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/10 rounded-full blur-2xl -mr-8 -mt-8 group-hover:bg-green-500/20 transition-all"></div>
                <BookOpen className="w-8 h-8 text-green-500 mb-3" />
                <div className="relative z-10">
                  <span className="text-3xl font-black text-white block mb-1">Daily</span>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Sprints</span>
                </div>
                <p className="text-[10px] text-gray-500 mt-1">15-30 mins/day</p>
            </div>
            
            <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/10 rounded-full blur-2xl -mr-8 -mt-8 group-hover:bg-red-500/20 transition-all"></div>
                <Activity className="w-8 h-8 text-red-500 mb-3" />
                <div className="relative z-10">
                  <span className="text-3xl font-black text-white block mb-1">{(totalActivityMinutes/60).toFixed(0)}h+</span>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Weekly Movement</span>
                </div>
                <p className="text-[10px] text-gray-500 mt-1">Fueled By Cindral</p>
            </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <h2 className="text-2xl font-bold text-white mb-8 border-l-4 border-cindral-blue pl-4">Meet the Collective</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {team.map((member) => (
              <Link key={member.id} to={`/team/${member.id}`} className="group relative bg-slate-800/50 rounded-3xl p-6 hover:-translate-y-2 transition-transform duration-300 overflow-hidden shadow-lg border border-white/5 hover:bg-slate-800">
                <div className="flex flex-col items-center relative z-10">
                  <div className="w-32 h-32 mb-6 rounded-2xl overflow-hidden shadow-xl ring-4 ring-white/5 group-hover:ring-white/20 transition-all">
                    <img 
                      src={member.image} 
                      alt={member.name} 
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 transform group-hover:scale-110"
                    />
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-cindral-blue transition-colors text-center">{member.name}</h3>
                  <p className="text-sm text-gray-300 font-medium mb-4 text-center opacity-80">{member.role}</p>
                  
                  {/* Mini Stats Grid */}
                  <div className="grid grid-cols-2 gap-2 w-full mt-2">
                    {member.learningStats && (
                        <div className="px-2 py-1.5 bg-black/30 rounded-lg flex flex-col items-center justify-center">
                            <Zap className="w-3 h-3 text-yellow-500 mb-1" />
                            <span className="text-[10px] text-gray-400 font-mono leading-none">{member.learningStats.currentStreak} day</span>
                        </div>
                    )}
                    {member.fitnessStats && (
                        <div className="px-2 py-1.5 bg-black/30 rounded-lg flex flex-col items-center justify-center">
                            <Activity className="w-3 h-3 text-red-500 mb-1" />
                            <span className="text-[10px] text-gray-400 font-mono leading-none">{member.fitnessStats.activityType}</span>
                        </div>
                    )}
                  </div>

                  <div className="mt-6 pt-4 w-full border-t border-white/10">
                    <p className="text-xs text-gray-300 text-center line-clamp-2 italic opacity-70">"{member.quote}"</p>
                  </div>
                </div>
              </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamPage;