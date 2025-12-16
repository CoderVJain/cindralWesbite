import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { PageLoader } from '../App';
import { ArrowLeft, Share2, Calendar, Users, Target, ArrowUpRight, BookOpen } from 'lucide-react';

const CSRInitiativePage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { initiatives, isLoading } = useData();
    const initiative = initiatives.find(i => i.id === id);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    if (isLoading) {
        return <PageLoader isLoading={true} />;
    }

    if (!initiative) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Initiative Not Found</h2>
                    <button onClick={() => navigate('/csr')} className="text-blue-400 hover:text-blue-300">
                        Back to CSR Page
                    </button>
                </div>
            </div>
        );
    }

    // Dummy images for gallery (using initiative image as placeholder or fallbacks)
    // Use dynamic gallery or fallback
    const galleryImages = (initiative.gallery && initiative.gallery.length > 0)
        ? initiative.gallery
        : [initiative.image]; // Fallback to just cover image if empty

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
            {/* Hero Section */}
            <div className="relative h-[80vh] w-full overflow-hidden">
                <div className="absolute inset-0 bg-slate-900/20 z-10" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent z-10" />
                <img src={initiative.image} alt={initiative.title} className="w-full h-full object-cover" />

                <div className="absolute bottom-0 left-0 w-full z-20 pb-24 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        <Link to="/csr" className="inline-flex items-center text-slate-300 hover:text-white mb-8 group transition-colors">
                            <div className="w-10 h-10 rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center mr-3 group-hover:bg-white/10 transition-all">
                                <ArrowLeft className="w-5 h-5" />
                            </div>
                            <span className="font-medium tracking-wide text-sm uppercase">Back to Initiatives</span>
                        </Link>
                        <h1 className="text-6xl md:text-8xl font-display font-bold text-white mb-8 leading-[0.9] tracking-tighter">
                            {initiative.title}
                        </h1>
                        <p className="text-xl md:text-2xl text-slate-300 max-w-3xl font-light leading-relaxed">
                            {initiative.description}
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-30 -mt-20 pb-32">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                    {/* Main Content Column */}
                    <div className="lg:col-span-2 space-y-12">
                        {/* Description Box */}
                        {/* Description Box */}
                        <div className="bg-slate-900/50 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-slate-800/50 shadow-xl">
                            <div className="flex items-center gap-4 mb-8">
                                <span className="p-3 rounded-2xl bg-blue-500/10 text-blue-400">
                                    <BookOpen className="w-6 h-6" />
                                </span>
                                <h2 className="text-3xl md:text-4xl font-display font-bold text-white tracking-tight">
                                    The Initiative
                                </h2>
                            </div>
                            <div className="prose prose-invert prose-lg max-w-none text-slate-300 prose-headings:font-display prose-headings:tracking-tight prose-p:leading-loose prose-p:font-light">
                                {initiative.fullContent.split('\n\n').map((paragraph, idx) => (
                                    <p key={idx}>{paragraph}</p>
                                ))}
                            </div>
                        </div>

                        {/* Recent Milestones Timeline */}
                        <div className="bg-slate-900 rounded-3xl p-8 md:p-12 border border-slate-800 shadow-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
                            <h3 className="text-2xl font-bold text-white mb-8 flex items-center">
                                <Calendar className="w-6 h-6 mr-3 text-green-400" />
                                Project Milestones
                            </h3>
                            <div className="space-y-8 pl-4 border-l-2 border-slate-800">
                                {(initiative.milestones || []).map((milestone, idx) => (
                                    <div key={idx} className="relative pl-8">
                                        <div className={`absolute -left-[9px] top-2 w-4 h-4 rounded-full bg-slate-900 border-2 ${milestone.status === 'completed' ? 'border-blue-500' : milestone.status === 'ongoing' ? 'border-green-500' : 'border-slate-600'}`}></div>
                                        <span className={`font-mono text-sm mb-1 block uppercase ${milestone.status === 'completed' ? 'text-blue-400' : 'text-slate-500'}`}>{milestone.date}</span>
                                        <h4 className={`text-lg font-bold ${milestone.status === 'completed' ? 'text-white' : 'text-slate-300'}`}>{milestone.title}</h4>
                                        <p className="text-slate-400 text-sm mt-1">{milestone.description}</p>
                                    </div>
                                ))}
                                {(!initiative.milestones || initiative.milestones.length === 0) && (
                                    <p className="text-slate-500 italic">No milestones recorded yet.</p>
                                )}
                            </div>
                        </div>

                        {/* Gallery Grid */}
                        <div>
                            <h3 className="text-2xl font-bold text-white mb-6">Impact Gallery</h3>
                            <div className="grid grid-cols-2 gap-4">
                                {galleryImages.map((img, i) => (
                                    <div key={i} className={`relative rounded-xl overflow-hidden group ${i === 0 ? 'col-span-2 h-64' : 'h-48'}`}>
                                        <img src={img} alt="Gallery" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Stats Widget */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl p-8 border border-slate-800 sticky top-24 shadow-2xl">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                                    Live Metrics
                                </h3>
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                            </div>

                            <div className="space-y-4">
                                {initiative.stats.map((stat, idx) => (
                                    <div key={idx} className="bg-slate-950/50 p-5 rounded-2xl border border-slate-800/50 group hover:border-blue-500/30 transition-all duration-300">
                                        <div className="flex items-center justify-between mb-2">
                                            <p className="text-sm text-slate-400 font-medium group-hover:text-blue-300 transition-colors uppercase tracking-wide">{stat.label}</p>
                                            <Target className="w-4 h-4 text-slate-600 group-hover:text-blue-400 transition-colors" />
                                        </div>
                                        <div className="text-4xl font-display font-bold text-white tracking-tight tabular-nums">
                                            {stat.value.toLocaleString()}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8 pt-8 border-t border-slate-800 space-y-3">
                                <button className="w-full py-4 bg-white text-slate-950 font-bold rounded-xl hover:bg-slate-200 transition-colors flex items-center justify-center transform active:scale-[0.98] duration-200 text-sm tracking-wide uppercase">
                                    Download Report <ArrowUpRight className="ml-2 w-4 h-4" />
                                </button>
                                <button className="w-full py-4 bg-slate-800/50 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors flex items-center justify-center text-sm tracking-wide uppercase border border-slate-700 hover:border-slate-600">
                                    Share Initiative <Share2 className="ml-2 w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default CSRInitiativePage;
