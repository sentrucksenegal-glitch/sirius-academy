import * as React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Course } from '@/types';
import { courseService } from '@/services/courseService';
import { Button } from '@/components/ui/button';
import { RegistrationForm } from './RegistrationForm';
import { Clock, CheckCircle2, Target, GraduationCap, ChevronLeft, CreditCard, Loader2 } from 'lucide-react';

export function CourseDetailPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = React.useState<Course | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchCourse = async () => {
      if (courseId) {
        const data = await courseService.getCourse(courseId);
        setCourse(data);
      }
      setLoading(false);
    };
    fetchCourse();
    window.scrollTo(0, 0);
  }, [courseId]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-32 flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
        <p className="text-slate-500 font-bold uppercase text-xs tracking-widest">Chargement des détails...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <h1 className="text-4xl font-black text-slate-900 mb-6">Formation non trouvée</h1>
        <Button onClick={() => navigate('/')}>Retour à l'accueil</Button>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pt-24">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-50 py-20 px-4">
        <div className="container mx-auto">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="mb-8 font-bold uppercase text-[10px] tracking-widest text-slate-500 hover:text-indigo-600"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>

          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="flex-1">
              <div className="inline-block px-4 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                Formation Intégrale • {course.duration}
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-[0.95] mb-8 uppercase tracking-tighter italic">
                {course.title}
              </h1>
              <p className="text-xl text-slate-600 leading-relaxed font-medium mb-10 max-w-2xl">
                {course.detailedDescription}
              </p>
              
              <div className="flex flex-wrap gap-8 items-center border-t border-slate-200 pt-8">
                <div>
                  <div className="text-sm font-black text-indigo-600 uppercase tracking-widest mb-1">Durée</div>
                  <div className="text-xl font-black text-slate-900">{course.duration}</div>
                </div>
                <div className="w-px h-10 bg-slate-200" />
                <div>
                  <div className="text-sm font-black text-indigo-600 uppercase tracking-widest mb-1">Prix</div>
                  <div className="text-xl font-black text-slate-900">{course.price}</div>
                </div>
              </div>
            </div>

            <div className="flex-1 w-full max-w-lg">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative rounded-[40px] overflow-hidden shadow-2xl skew-y-1"
              >
                <img src={course.image} alt={course.title} className="w-full aspect-[4/3] object-cover" />
                <div className="absolute inset-0 bg-indigo-900/20" />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-24 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">
            {/* Main Info */}
            <div className="lg:col-span-2 space-y-20">
              {/* Objectives */}
              <div>
                <h2 className="text-3xl font-black text-indigo-950 mb-8 uppercase tracking-tighter">Objectif de la Formation</h2>
                <div className="bg-indigo-50 p-8 rounded-[32px] border border-indigo-100">
                  <p className="text-xl text-indigo-900 font-bold leading-relaxed italic">
                    "{course.objective}"
                  </p>
                </div>
              </div>

              {/* Curriculum */}
              <div>
                <h2 className="text-3xl font-black text-indigo-950 mb-8 uppercase tracking-tighter underline decoration-amber-400 decoration-8 underline-offset-4">Au Programme</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {course.curriculum.map((item, i) => (
                    <div key={i} className="flex gap-4 p-6 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                      <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shrink-0 font-black italic text-xs">
                        {i + 1}
                      </div>
                      <span className="font-bold text-slate-700 leading-tight">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Prerequisites & Target */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <GraduationCap className="w-6 h-6 text-indigo-600" />
                    <h3 className="text-xl font-black text-indigo-950 uppercase tracking-widest">Prérequis</h3>
                  </div>
                  <ul className="space-y-4">
                    {course.prerequisites.map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                        <span className="text-sm font-medium text-slate-600">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <Target className="w-6 h-6 text-indigo-600" />
                    <h3 className="text-xl font-black text-indigo-950 uppercase tracking-widest">Cible</h3>
                  </div>
                  <ul className="space-y-4">
                    {course.targetAudience.map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0" />
                        <span className="text-sm font-medium text-slate-600">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Payment Details */}
              <div className="pt-20 border-t border-slate-100">
                <h2 className="text-3xl font-black text-indigo-950 mb-8 uppercase tracking-tighter">Modalités de Paiement</h2>
                <div className="bg-slate-900 text-white rounded-[40px] p-10 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-10 opacity-10">
                    <CreditCard className="w-40 h-40" />
                  </div>
                  <div className="relative z-10 flex flex-col md:flex-row gap-10 items-center justify-between">
                    <div>
                      <div className="text-amber-400 font-black uppercase text-xs tracking-widest mb-2">Investissement</div>
                      <div className="text-5xl font-black tracking-tighter">{course.price}</div>
                      <p className="mt-4 text-slate-400 font-medium max-w-sm">
                        {course.paymentDetails}
                      </p>
                    </div>
                    {course.paymentType === 'monthly' && (
                      <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20 text-center">
                        <div className="text-white/60 font-bold text-[10px] uppercase tracking-widest mb-2">Mensualités</div>
                        <div className="text-3xl font-black text-amber-400">{course.monthlyPrice}</div>
                        <div className="text-xs font-bold text-white/40 mt-1">Sur {course.installments} mois</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Sticky Form */}
            <div className="lg:col-span-1">
              <div className="sticky top-32">
                <RegistrationForm isHeroVariant={true} />
                <div className="mt-8 p-6 bg-indigo-50 rounded-2xl border border-indigo-100">
                  <h4 className="font-black text-[10px] text-indigo-600 uppercase tracking-widest mb-3">Besoin d'aide ?</h4>
                  <p className="text-xs text-slate-500 font-medium mb-4">
                    Nos conseillers sont disponibles pour répondre à toutes vos questions sur cette formation.
                  </p>
                  <Button variant="outline" className="w-full text-[10px] font-black uppercase tracking-widest border-indigo-200 text-indigo-600">
                    Calculer le financement
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
