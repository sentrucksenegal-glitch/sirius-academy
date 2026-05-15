import { Logo } from './Logo';
import { Mail, Phone, MapPin, Instagram, Linkedin, Twitter, Facebook } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-white text-slate-500 py-24 px-4 border-t border-slate-100">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
          <div className="col-span-1 md:col-span-2">
            <div className="mb-8">
              <Logo />
            </div>
            <p className="max-w-md text-slate-500 mb-10 leading-relaxed font-medium">
              Le premier centre de formation accélérée aux métiers du digital à Dakar. 
              Pratique Intensive. Coaching Expert. Insertion Garantie.
            </p>
            <div className="flex gap-3">
              <SocialLink icon={<Instagram />} />
              <SocialLink icon={<Linkedin />} />
              <SocialLink icon={<Twitter />} />
              <SocialLink icon={<Facebook />} />
            </div>
          </div>

          <div>
            <h4 className="text-slate-900 font-black uppercase text-[10px] tracking-[0.2em] mb-8 italic underline decoration-amber-400 decoration-2 underline-offset-4">LIENS RAPIDES</h4>
            <ul className="space-y-4 font-bold text-sm">
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Accueil</a></li>
              <li><a href="#courses" className="hover:text-indigo-600 transition-colors">Formations</a></li>
              <li><a href="#register" className="hover:text-indigo-600 transition-colors">Inscription</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Notre Blog</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-slate-900 font-black uppercase text-[10px] tracking-[0.2em] mb-8 italic underline decoration-amber-400 decoration-2 underline-offset-4">CONTACT & ADRESSE</h4>
            <ul className="space-y-6 text-sm font-medium">
              <li className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center flex-none">
                  <MapPin className="w-4 h-4 text-indigo-600" />
                </div>
                <span>Liberté 6 Extension, Dakar, Sénégal</span>
              </li>
              <li className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center flex-none">
                  <Phone className="w-4 h-4 text-indigo-600" />
                </div>
                <span className="font-bold">+221 77 000 00 00</span>
              </li>
              <li className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center flex-none">
                  <Mail className="w-4 h-4 text-indigo-600" />
                </div>
                <span className="font-bold underline decoration-indigo-200">contact@sirius-academy.sn</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-10 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-black uppercase tracking-[0.1em] text-slate-400">
          <p>© {new Date().getFullYear()} SIRIUS ACADEMY. TOUS DROITS RÉSERVÉS.</p>
          <div className="flex gap-10">
            <a href="#" className="hover:text-indigo-600 transition-colors">Mentions Légales</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Confidentialité</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({ icon }: { icon: React.ReactNode }) {
  return (
    <a href="#" className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-indigo-600 hover:text-white transition-all duration-300 hover:-translate-y-1">
      {cloneIcon(icon)}
    </a>
  );
}

function cloneIcon(icon: React.ReactNode) {
  if (React.isValidElement(icon)) {
    return React.cloneElement(icon as React.ReactElement<any>, { className: "w-5 h-5" });
  }
  return icon;
}
import React from 'react';
