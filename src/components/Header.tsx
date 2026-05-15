import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Logo } from './Logo';
import { Menu, X, LayoutDashboard, Home } from 'lucide-react';

interface HeaderProps {
  onAdminClick: () => void;
  isAdmin: boolean;
  isLoggedIn: boolean;
}

export function Header({ onAdminClick, isAdmin, isLoggedIn }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <a href="#" className="hover:opacity-90 transition-opacity">
          <Logo />
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-10">
          {!isAdmin ? (
            <>
              <Link to="/" className="text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-indigo-600 transition-colors">Accueil</Link>
              <a href="/#courses" className="text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-indigo-600 transition-colors">Formations</a>
              <a href="/#register" className="text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-indigo-600 transition-colors">Inscription</a>
            </>
          ) : null}
          <Button 
            variant={isAdmin ? "default" : "outline"} 
            size="sm" 
            onClick={onAdminClick}
            className="gap-2 rounded-full px-6 font-bold uppercase text-[10px] tracking-wider"
          >
            {isAdmin ? <Home className="w-3 h-3" /> : <LayoutDashboard className="w-3 h-3" />}
            {isAdmin ? "Retour au Site" : "Dashboard Candidat"}
          </Button>
        </nav>

        {/* Mobile Toggle */}
        <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden absolute top-full left-0 right-0 bg-white border-b shadow-lg p-4 flex flex-col gap-4"
        >
          {!isAdmin ? (
            <>
              <a href="#" onClick={() => setIsMenuOpen(false)} className="text-lg font-medium">Accueil</a>
              <a href="#courses" onClick={() => setIsMenuOpen(false)} className="text-lg font-medium">Formations</a>
              <a href="#register" onClick={() => setIsMenuOpen(false)} className="text-lg font-medium px-4 py-2 bg-slate-900 text-white rounded-lg text-center">Inscription</a>
            </>
          ) : null}
          <Button variant="outline" onClick={() => { onAdminClick(); setIsMenuOpen(false); }}>
            {isAdmin ? "Retour au Site" : "Espace Admin"}
          </Button>
        </motion.div>
      )}
    </header>
  );
}
