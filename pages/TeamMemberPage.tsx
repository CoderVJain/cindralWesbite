import React from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { Linkedin, Mail, Heart, Briefcase, Star, Sparkles, Quote, Zap, BookOpen, Clock, Activity, Flame, Trophy } from 'lucide-react';

const TeamMemberPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { team, projects, divisions, isLoading } = useData();
  const member = team.find(t => t.id === id);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Loading profile...
      </div>
    );
  }

  if (!member) {
    return <Navigate to="/" />;
  }

  // Get related projects
  const memberProjects = projects.filter(p => member.projectIds.includes(p.id));
  
  // Determine gradient colors based on divisions worked with
  const divisionIds = Array.from(new Set(memberProjects.map(p => p.divisionId)));
  const distinctDivisions = divisions.filter(d => divisionIds.includes(d.id));
  
  let gradientStyle = {};
  
  if (distinctDivisions.length > 0) {
    // Append '33' to hex color for ~20% opacity using hex alpha notation
    const colorStops = distinctDivisions.map(d => `${d.themeColor}33`).join(', ');
    
    // Create a linear gradient that transitions through all division colors
    gradientStyle = {
      background: `linear-gradient(135deg, ${colorStops}, rgba(15, 23, 42, 0) 80%)`,
    };
  } else {
    // Default fallback
    gradientStyle = {
      background: `radial-gradient(circle at 50% 0%, rgba(0, 174, 239, 0.15) 0%, rgba(15, 23, 42, 0) 70%)`
    };
  }

  return (
    <div className="min-h-screen pt-20 relative overflow-hidden" style={gradientStyle}>
      {/* Overlay mainly for blending the top edge */}
      <div className="absolute inset-0 bg-slate-900/40 pointer-events-none"></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <Link to="/team" className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors">
          &larr; Back to Team
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Left Column: Profile Card */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-slate-800/80 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 flex flex-col items-center text-center shadow-2xl">
              <div className="w-48 h-48 rounded-[2rem] overflow-hidden border-4 border-slate-700 mb-6 shadow-lg">
                <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
              </div>
              
              <h1 className="text-2xl font-bold text-white mb-2">{member.name}</h1>
              <p className="text-cindral-blue font-medium mb-6 uppercase tracking-wider text-sm">{member.role}</p>
              
              {member.quote && (
                <div className="mb-6 relative">
                  <Quote className="w-6 h-6 text-slate-600 absolute -top-3 -left-2 opacity-50" />
                  <p className="text-gray-300 italic text-sm px-4 relative z-10">"{member.quote}"</p>
                </div>
              )}

              <div className="flex space-x-4 w-full justify-center border-t border-slate-700 pt-6">
                <button className="p-3 bg-slate-700/50 rounded-xl hover:bg-blue-600 hover:text-white transition-all text-gray-400">
                  <Linkedin size={20} />
                </button>
                <button className="p-3 bg-slate-700/50 rounded-xl hover:bg-blue-600 hover:text-white transition-all text-gray-400">
                  <Mail size={20} />
                </button>
              </div>
            </div>

            {/* Continuous Learning Card */}
            {member.learningStats && (
              <div className="bg-slate-800/80 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 shadow-xl">
                 <h3 className="text-white font-bold mb-4 flex items-center">
                    <Zap className="w-5 h-5 mr-2 text-yellow-500 fill-yellow-500" /> Continuous Learning
                 </h3>
                 <div className="space-y-4">
                    <div className="flex justify-between items-center bg-slate-900/50 p-3 rounded-xl border border-slate-800">
                        <div className="flex items-center">
                            <Clock className="w-4 h-4 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-300">Total Hours</span>
                        </div>
                        <span className="font-mono text-white font-bold">{member.learningStats.totalHours}h</span>
                    </div>
                    <div className="flex justify-between items-center bg-slate-900/50 p-3 rounded-xl border border-slate-800">
                        <div className="flex items-center">
                            <BookOpen className="w-4 h-4 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-300">Daily Streak</span>
                        </div>
                        <span className="font-mono text-green-400 font-bold">{member.learningStats.currentStreak} Days 🔥</span>
                    </div>
                    <div className="pt-2">
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Currently Learning</p>
                        <p className="text-sm text-white font-medium">{member.learningStats.lastTopic}</p>
                    </div>
                 </div>
              </div>
            )}

            {/* Fueled By Cindral Card */}
            {member.fitnessStats && (
              <div className="bg-slate-800/80 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 shadow-xl">
                 <h3 className="text-white font-bold mb-4 flex items-center">
                    <Activity className="w-5 h-5 mr-2 text-red-500" /> Fueled By Cindral
                 </h3>
                 <div className="space-y-4">
                    <div className="flex justify-between items-center bg-slate-900/50 p-3 rounded-xl border border-slate-800">
                        <div className="flex items-center">
                            <Flame className="w-4 h-4 text-orange-500 mr-2" />
                            <span className="text-sm text-gray-300">Activity</span>
                        </div>
                        <span className="font-mono text-white font-bold">{member.fitnessStats.activityType}</span>
                    </div>
                    <div className="flex justify-between items-center bg-slate-900/50 p-3 rounded-xl border border-slate-800">
                        <div className="flex items-center">
                            <Clock className="w-4 h-4 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-300">Weekly Goal</span>
                        </div>
                        <span className="font-mono text-white font-bold">{member.fitnessStats.weeklyMinutes} mins</span>
                    </div>
                    <div className="pt-2">
                        <div className="flex items-center mb-1">
                           <Trophy className="w-3 h-3 text-yellow-500 mr-1" />
                           <p className="text-xs text-gray-500 uppercase tracking-wide">Personal Best</p>
                        </div>
                        <p className="text-sm text-white font-medium">{member.fitnessStats.personalBest}</p>
                    </div>
                 </div>
              </div>
            )}

            {/* Skills & Interests (Mobile Only view) */}
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-3xl p-6 md:hidden">
               <h3 className="text-white font-bold mb-3 flex items-center"><Star className="w-4 h-4 mr-2 text-yellow-500" /> Skills</h3>
               <div className="flex flex-wrap gap-2 mb-6">
                 {member.skills.map((skill, idx) => (
                   <span key={idx} className="px-3 py-1 bg-slate-700 rounded-full text-xs text-gray-300 border border-slate-600">{skill}</span>
                 ))}
               </div>
               <h3 className="text-white font-bold mb-3 flex items-center"><Sparkles className="w-4 h-4 mr-2 text-purple-500" /> Interests</h3>
               <div className="flex flex-wrap gap-2">
                 {member.interests.map((int, idx) => (
                   <span key={idx} className="px-3 py-1 bg-slate-900/50 rounded-full text-xs text-gray-400">{int}</span>
                 ))}
               </div>
            </div>
          </div>

          {/* Right Column: Details */}
          <div className="md:col-span-2 space-y-8">
            
            {/* Bio Section */}
            <div className="bg-slate-800/40 border border-slate-700/30 rounded-3xl p-8 backdrop-blur-sm">
              <h2 className="text-xl font-bold text-white mb-4">Biography</h2>
              <p className="text-gray-300 leading-relaxed text-lg font-light">{member.bio}</p>
            </div>

            {/* Skills & Interests (Desktop) */}
            <div className="hidden md:grid grid-cols-2 gap-6">
               <div className="bg-slate-800/40 border border-slate-700/30 rounded-3xl p-6">
                  <h3 className="text-white font-bold mb-4 flex items-center"><Star className="w-5 h-5 mr-2 text-yellow-500" /> Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {member.skills.map((skill, idx) => (
                      <span key={idx} className="px-3 py-1.5 bg-slate-700/50 hover:bg-slate-700 rounded-lg text-sm text-gray-200 border border-slate-600/50 transition-colors cursor-default">{skill}</span>
                    ))}
                  </div>
               </div>
               <div className="bg-slate-800/40 border border-slate-700/30 rounded-3xl p-6">
                  <h3 className="text-white font-bold mb-4 flex items-center"><Sparkles className="w-5 h-5 mr-2 text-purple-500" /> Interests</h3>
                  <div className="flex flex-wrap gap-2">
                    {member.interests.map((int, idx) => (
                      <span key={idx} className="px-3 py-1.5 bg-slate-900/50 rounded-lg text-sm text-gray-400 border border-transparent hover:border-slate-700 transition-colors cursor-default">{int}</span>
                    ))}
                  </div>
               </div>
            </div>

            {/* Projects */}
            <div className="bg-slate-800/40 border border-slate-700/30 rounded-3xl p-8">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                <Briefcase className="w-5 h-5 mr-3 text-cindral-blue" /> Contributions
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {memberProjects.length > 0 ? (
                  memberProjects.map(p => {
                    const division = divisions.find(d => d.id === p.divisionId);
                    return (
                      <Link key={p.id} to={`/project/${p.id}`} className="group block p-4 rounded-2xl bg-slate-900/60 hover:bg-slate-800 transition-all border border-slate-700/50 hover:border-cindral-blue/50">
                        <div className="flex items-start justify-between mb-2">
                           <span className={`text-xs font-bold uppercase tracking-wider ${division?.color}`}>{division?.title}</span>
                           <span className="text-xs text-gray-500">{p.year}</span>
                        </div>
                        <h4 className="font-bold text-white group-hover:text-cindral-blue transition-colors text-lg mb-1">{p.title}</h4>
                        <p className="text-sm text-gray-400 line-clamp-2">{p.summary}</p>
                      </Link>
                    );
                  })
                ) : (
                  <div className="col-span-2 text-center py-8 text-gray-500 bg-slate-900/30 rounded-2xl border border-dashed border-slate-800">
                    No public project case studies listed yet.
                  </div>
                )}
              </div>
            </div>

            {/* CSR */}
            {member.csrActivities.length > 0 && (
              <div className="bg-slate-800/40 border border-slate-700/30 rounded-3xl p-8">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                  <Heart className="w-5 h-5 mr-3 text-pink-500" /> CSR Impact
                </h3>
                <div className="space-y-4">
                  {member.csrActivities.map((activity, idx) => (
                    <div key={idx} className="flex items-start p-4 bg-slate-900/30 rounded-xl border border-slate-800/50">
                      <div className="w-2 h-2 bg-pink-500 rounded-full mt-2 mr-4 flex-shrink-0 shadow-[0_0_8px_rgba(236,72,153,0.5)]"></div>
                      <p className="text-gray-300">{activity}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamMemberPage;
