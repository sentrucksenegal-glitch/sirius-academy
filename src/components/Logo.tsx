import { Link } from 'react-router-dom';
import { Compass, BookOpen, Star } from 'lucide-react';

export function Logo({ className = "", isLight = false }: { className?: string, isLight?: boolean }) {
  return (
    <Link to="/" className={`flex items-center gap-3 ${className} hover:opacity-90 transition-opacity`}>
      <div className="relative group">
        {/* Orbit Ring */}
        <div className={`w-12 h-12 rounded-full border-[1.5px] transform group-hover:rotate-12 transition-transform duration-700 flex items-center justify-center ${isLight ? 'border-indigo-200' : 'border-slate-300'}`}>
          {/* Small Dots on Orbit */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-amber-400 rounded-full" />
          <div className="absolute top-[10%] right-[10%] w-2 h-2 bg-emerald-400 rounded-full" />
        </div>
        
        {/* The North Star (Custom spikes) */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            {/* Vertical Spike */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0.5 h-10 bg-amber-400 rounded-full" />
            {/* Horizontal Spike */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-0.5 bg-amber-400 rounded-full" />
            {/* Center Star */}
            <Star className="w-5 h-5 fill-amber-400 rotate-45 text-amber-400 relative z-10" />
            
            {/* Small decorative star elements */}
            <div className="absolute -top-3 -left-3">
              <Star className="w-1 h-1 fill-amber-400 text-amber-400" />
            </div>
            <div className="absolute top-2 -right-4">
              <Star className="w-1 h-1 fill-amber-400 text-amber-400" />
            </div>
            <div className="absolute -bottom-4 left-0">
               <Star className="w-1 h-1 fill-amber-400 text-amber-400" />
            </div>
          </div>
        </div>

        {/* Book at Base */}
        <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 bg-white px-0.5">
          <div className={`flex flex-col items-center ${isLight ? 'text-indigo-200' : 'text-slate-900 focus-none'}`}>
            <div className="flex gap-[1px]">
               <div className="w-2.5 h-1.5 bg-indigo-900 rounded-bl-sm" />
               <div className="w-2.5 h-1.5 bg-indigo-900 rounded-br-sm" />
            </div>
            <div className="w-7 h-[1.5px] bg-emerald-500 rounded-full mt-[1px]" />
            <div className="w-5 h-[1px] bg-indigo-900/40 rounded-full mt-[1px]" />
          </div>
        </div>
      </div>

      <div className="flex flex-col leading-none">
        <span className={`text-2xl font-black tracking-tighter ${isLight ? 'text-white' : 'text-[#0a1e3d]'} uppercase`}>
          Sirius
        </span>
        <span className={`text-[10px] font-black tracking-[0.4em] uppercase text-amber-500 ml-0.5`}>
          ACADEMY
        </span>
      </div>
    </Link>
  );
}
