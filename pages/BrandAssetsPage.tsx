import React from 'react';
import { Download, Copy, Check } from 'lucide-react';
import { BRAND } from '../constants';

const ColorCard = ({ name, value }: { name: string; value: string }) => {
  const [copied, setCopied] = React.useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group cursor-pointer" onClick={copyToClipboard}>
      <div 
        className="h-32 rounded-2xl mb-3 shadow-lg border border-slate-700/50 group-hover:scale-[1.02] transition-transform relative flex items-center justify-center"
        style={{ backgroundColor: value }}
      >
        <div className="opacity-0 group-hover:opacity-100 absolute bg-black/30 backdrop-blur-sm rounded-full p-2 transition-opacity">
          {copied ? <Check className="w-6 h-6 text-white" /> : <Copy className="w-6 h-6 text-white" />}
        </div>
      </div>
      <div className="flex justify-between items-center px-1">
        <span className="font-bold text-white capitalize">{name}</span>
        <span className="font-mono text-xs text-gray-500 uppercase">{value}</span>
      </div>
    </div>
  );
};

const BrandAssetsPage: React.FC = () => {
  return (
    <div className="min-h-screen py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-24 text-center">
          <h1 className="text-5xl font-display font-bold text-white mb-6">Brand Assets</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Our visual identity is a reflection of our values. Use these assets to maintain consistency across all communications.
          </p>
        </div>

        {/* Logo Section */}
        <section className="mb-24">
          <h2 className="text-2xl font-bold text-white mb-8 border-l-4 border-cindral-blue pl-4">Logomark</h2>
          <div className="bg-slate-800 rounded-3xl p-12 border border-slate-700 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-slate-900/50 p-12 rounded-2xl flex-grow flex justify-center w-full md:w-auto">
              <img src={BRAND.logo.url} alt={BRAND.logo.alt} className="h-24 w-auto" />
            </div>
            <div className="flex flex-col gap-4 w-full md:w-auto min-w-[200px]">
              <h3 className="text-lg font-bold text-white">Official Logo</h3>
              <p className="text-gray-400 text-sm mb-4">Use on dark backgrounds. Ensure clear space around the mark.</p>
              <button className="flex items-center justify-center w-full px-6 py-3 bg-white text-slate-900 font-bold rounded-xl hover:bg-gray-200 transition-colors">
                <Download className="w-4 h-4 mr-2" /> PNG (High Res)
              </button>
              <button className="flex items-center justify-center w-full px-6 py-3 bg-slate-700 text-white font-bold rounded-xl hover:bg-slate-600 transition-colors">
                <Download className="w-4 h-4 mr-2" /> SVG (Vector)
              </button>
            </div>
          </div>
        </section>

        {/* Colors Section */}
        <section className="mb-24">
          <h2 className="text-2xl font-bold text-white mb-8 border-l-4 border-cindral-blue pl-4">Color Palette</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <ColorCard name="Primary Blue" value={BRAND.colors.primary} />
            <ColorCard name="Secondary Purple" value={BRAND.colors.secondary} />
            <ColorCard name="Accent Green" value={BRAND.colors.accent} />
            <ColorCard name="Surface Dark" value={BRAND.colors.surface} />
          </div>
        </section>

        {/* Typography Section */}
        <section className="mb-24">
          <h2 className="text-2xl font-bold text-white mb-8 border-l-4 border-cindral-blue pl-4">Typography</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Display Font */}
            <div className="bg-slate-800 rounded-3xl p-8 border border-slate-700">
              <div className="flex justify-between items-start mb-8">
                <div>
                   <span className="text-xs font-bold text-cindral-blue uppercase tracking-wider mb-1 block">Headings & Display</span>
                   <h3 className="text-3xl text-white font-display">{BRAND.typography.display}</h3>
                </div>
                <div className="text-4xl text-gray-600 font-display">Aa</div>
              </div>
              <div className="space-y-4">
                 <p className="text-5xl font-display font-bold text-white">Building Humans.</p>
                 <p className="text-4xl font-display font-semibold text-white">Not Machines.</p>
                 <p className="text-2xl font-display font-medium text-white">The curious fox jumps.</p>
              </div>
            </div>

            {/* Body Font */}
            <div className="bg-slate-800 rounded-3xl p-8 border border-slate-700">
              <div className="flex justify-between items-start mb-8">
                <div>
                   <span className="text-xs font-bold text-green-500 uppercase tracking-wider mb-1 block">Body Copy</span>
                   <h3 className="text-3xl text-white font-sans">{BRAND.typography.sans}</h3>
                </div>
                <div className="text-4xl text-gray-600 font-sans">Aa</div>
              </div>
              <div className="space-y-4">
                 <p className="text-base text-gray-300 leading-relaxed">
                   Inter is a typeface carefully crafted & designed for computer screens. It features a tall x-height to aid in readability of mixed-case and lower-case text.
                 </p>
                 <p className="text-sm text-gray-400">
                   abcdefghijklmnopqrstuvwxyz<br/>
                   ABCDEFGHIJKLMNOPQRSTUVWXYZ<br/>
                   0123456789 (!@#$%^&*)
                 </p>
              </div>
            </div>

          </div>
        </section>

      </div>
    </div>
  );
};

export default BrandAssetsPage;