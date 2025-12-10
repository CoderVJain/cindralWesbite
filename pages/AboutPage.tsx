import React from 'react';
import { Target, Globe, Lightbulb, Users, HandHeart, TrendingUp } from 'lucide-react';

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="py-24 bg-slate-900 border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-8">Our Philosophy</h1>
          <p className="text-xl text-gray-400 leading-relaxed">
            Technology is not just about efficiency; it's about extending human capability. 
            At Cindral, we don't just write code—we craft experiences that resonate on a human level.
          </p>
        </div>
      </div>

      {/* Human Centric Growth */}
      <div className="bg-slate-950 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-3xl p-8 md:p-16 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-cindral-blue/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div>
                        <div className="inline-flex items-center space-x-2 text-purple-400 mb-6 bg-purple-900/30 px-4 py-1.5 rounded-full border border-purple-800/50">
                            <HandHeart className="w-4 h-4" />
                            <span className="text-sm font-bold tracking-wide uppercase">Culture First</span>
                        </div>
                        <h2 className="text-4xl font-bold text-white mb-6">We don't just hire.<br/>We hand-hold.</h2>
                        <p className="text-gray-400 text-lg leading-relaxed mb-6">
                            Growth at Cindral isn't accidental. It's engineered. We believe in the potential of every individual team member. 
                        </p>
                        <ul className="space-y-4">
                            <li className="flex items-start">
                                <div className="mt-1 bg-green-500/20 p-1 rounded">
                                    <TrendingUp className="w-4 h-4 text-green-400" />
                                </div>
                                <div className="ml-4">
                                    <h4 className="text-white font-bold">Daily Upskilling</h4>
                                    <p className="text-sm text-gray-400">Every member dedicates 15-30 minutes daily to learn something new, tracked and celebrated.</p>
                                </div>
                            </li>
                            <li className="flex items-start">
                                <div className="mt-1 bg-blue-500/20 p-1 rounded">
                                    <Users className="w-4 h-4 text-blue-400" />
                                </div>
                                <div className="ml-4">
                                    <h4 className="text-white font-bold">Mentorship Circles</h4>
                                    <p className="text-sm text-gray-400">Senior leads don't just manage; they mentor. We ensure no one feels lost in the code.</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=400" className="rounded-2xl border border-slate-700 transform translate-y-8" alt="Team collaboration" />
                        <img src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=400" className="rounded-2xl border border-slate-700" alt="Mentorship" />
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
             <h2 className="text-3xl font-bold text-white mb-6">Building Humans, Not Machines.</h2>
             <p className="text-gray-400 mb-6 leading-relaxed">
               In an age of automation, we prioritize the human element. Our mission is to leverage cutting-edge technology—whether it's AI, XR, or Web—to solve real human problems, foster connection, and educate the next generation.
             </p>
             <p className="text-gray-400 leading-relaxed">
               We believe that digital tools should be intuitive, accessible, and beautiful. They should serve us, not the other way around.
             </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
                <Lightbulb className="w-8 h-8 text-yellow-400 mb-4" />
                <h3 className="text-white font-bold mb-2">Innovation</h3>
                <p className="text-sm text-gray-500">Pushing boundaries in Labs and R&D.</p>
             </div>
             <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 mt-8">
                <Users className="w-8 h-8 text-blue-400 mb-4" />
                <h3 className="text-white font-bold mb-2">Empathy</h3>
                <p className="text-sm text-gray-500">Design that understands the user.</p>
             </div>
             <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
                <Target className="w-8 h-8 text-red-400 mb-4" />
                <h3 className="text-white font-bold mb-2">Impact</h3>
                <p className="text-sm text-gray-500">Tangible results through CSR.</p>
             </div>
             <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 mt-8">
                <Globe className="w-8 h-8 text-green-400 mb-4" />
                <h3 className="text-white font-bold mb-2">Sustainability</h3>
                <p className="text-sm text-gray-500">Growth with conscience.</p>
             </div>
          </div>
        </div>
      </div>

      {/* UN SDGs */}
      <div className="bg-slate-950 py-24 border-t border-slate-900">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
               <h2 className="text-3xl font-display font-bold text-white mb-4">Aligned with United Nations SDGs</h2>
               <p className="text-gray-400">Our work directly contributes to global sustainable development goals.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {/* SDG 4 */}
               <div className="bg-[#C5192D] rounded-xl overflow-hidden group">
                  <div className="p-8 h-full flex flex-col justify-between">
                     <div>
                        <span className="text-white/50 text-6xl font-black absolute top-4 right-4 opacity-20 group-hover:opacity-40 transition-opacity">04</span>
                        <h3 className="text-2xl font-black text-white uppercase mb-4 relative z-10">Quality<br/>Education</h3>
                        <p className="text-white/90 text-sm font-medium relative z-10">
                           Through our "Tech for Future" initiative, we provide coding resources and mentorship to under-served communities.
                        </p>
                     </div>
                  </div>
               </div>

               {/* SDG 9 */}
               <div className="bg-[#FD6925] rounded-xl overflow-hidden group">
                  <div className="p-8 h-full flex flex-col justify-between">
                     <div>
                        <span className="text-white/50 text-6xl font-black absolute top-4 right-4 opacity-20 group-hover:opacity-40 transition-opacity">09</span>
                        <h3 className="text-2xl font-black text-white uppercase mb-4 relative z-10">Industry,<br/>Innovation</h3>
                        <p className="text-white/90 text-sm font-medium relative z-10">
                           Cindral Labs constantly experiments with new tech infrastructure to build resilient digital pathways.
                        </p>
                     </div>
                  </div>
               </div>

               {/* SDG 15 */}
               <div className="bg-[#56C02B] rounded-xl overflow-hidden group">
                  <div className="p-8 h-full flex flex-col justify-between">
                     <div>
                        <span className="text-white/50 text-6xl font-black absolute top-4 right-4 opacity-20 group-hover:opacity-40 transition-opacity">15</span>
                        <h3 className="text-2xl font-black text-white uppercase mb-4 relative z-10">Life on<br/>Land</h3>
                        <p className="text-white/90 text-sm font-medium relative z-10">
                           Our Bonsai Initiative promotes awareness of terrestrial ecosystems and the importance of patience in growth.
                        </p>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default AboutPage;