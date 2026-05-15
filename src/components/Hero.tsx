import { motion } from 'motion/react';
import { Zap, Trophy, Target, Group } from 'lucide-react';
import { RegistrationForm } from './RegistrationForm';

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex flex-col lg:flex-row overflow-hidden pt-20">
      {/* Background decoration */}
      <div className="absolute top-1/4 left-10 w-64 h-64 bg-indigo-400/10 rounded-full blur-3xl -z-10" />

      {/* Left Content Column */}
      <div className="flex-1 p-8 md:p-16 lg:p-24 flex flex-col justify-center bg-slate-50">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-xl mx-auto lg:mx-0"
        >
          <div className="inline-block px-4 py-1.5 bg-amber-100 text-amber-700 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-8">
            🚀 100% en ligne • Dakar, Sénégal
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-[0.95] mb-8">
            Maîtrisez le <br />
            <span className="text-indigo-600 decoration-vibrant">Digital</span> <br />
            en un temps record.
          </h1>
          
          <p className="text-lg md:text-xl text-slate-600 mb-12 leading-relaxed">
            Formations accélérées avec attestation. Méthodologie 
            <span className="font-bold text-slate-900 italic"> "Learning by Doing"</span> pour 
            devenir opérationnel dès demain.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
            <FeaturePill 
              number="01" 
              text="Pratique Intensive" 
              color="bg-indigo-50 text-indigo-600 border-indigo-100" 
            />
            <FeaturePill 
              number="02" 
              text="Accompagnement" 
              color="bg-amber-50 text-amber-600 border-amber-100" 
            />
          </div>

          <div className="flex flex-wrap gap-10 border-t border-slate-200 pt-10">
            <StatItem label="Taux d'insertion" value="98%" />
            <StatItem label="Modules Experts" value="12" />
            <StatItem label="Alumni à Dakar" value="+500" />
          </div>
        </motion.div>
      </div>

      {/* Right Column with Registration Form */}
      <div className="flex-1 bg-indigo-950 p-8 md:p-16 lg:p-24 flex items-center justify-center relative">
        {/* Background texture/glow */}
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <div className="absolute -top-1/4 -right-1/4 w-full h-full bg-blue-500 rounded-full blur-[120px]" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="w-full max-w-lg z-10"
        >
          <RegistrationForm isHeroVariant={true} />
        </motion.div>
      </div>
    </section>
  );
}

function FeaturePill({ number, text, color }: { number: string, text: string, color: string }) {
  return (
    <div className={`p-4 bg-white rounded-2xl shadow-sm border flex items-center gap-4 group transition-all hover:shadow-md ${color.split(' ').pop() === 'border-indigo-100' ? 'border-zinc-100' : 'border-zinc-100'}`}>
      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black italic underline text-sm ${color}`}>
        {number}
      </div>
      <div className="text-xs font-black text-slate-800 uppercase tracking-wider">
        {text}
      </div>
    </div>
  );
}

function StatItem({ label, value }: { label: string, value: string }) {
  return (
    <div>
      <div className="text-4xl font-black text-indigo-600 tracking-tighter mb-1">{value}</div>
      <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{label}</div>
    </div>
  );
}

