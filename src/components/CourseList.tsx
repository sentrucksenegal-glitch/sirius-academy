import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Course } from '@/types';
import { courseService } from '@/services/courseService';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Tag, ArrowRight, Eye, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';

export function CourseList() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      const data = await courseService.getCourses(true);
      setCourses(data);
      setLoading(false);
    };
    fetchCourses();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
        <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Chargement des formations...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-6xl font-black text-indigo-950 mb-4 tracking-tighter italic">NOS FORMATIONS</h2>
        <p className="text-slate-500 max-w-2xl mx-auto font-medium">
          Préparez-vous aux métiers les plus demandés du marché digital avec nos cursus intensifs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {courses.map((course, index) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <Card className="h-full flex flex-col overflow-hidden border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-indigo-100 transition-all duration-500 group rounded-[32px]">
              <div className="relative h-56 overflow-hidden">
                <img 
                  src={course.image} 
                  alt={course.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-5 left-5">
                  <Badge className="bg-white/90 text-indigo-900 border-none hover:bg-white font-black uppercase text-[10px] tracking-widest px-3 py-1 shadow-sm">
                    {course.paymentType === 'unique' ? 'FLASH' : 'INTENSIF'}
                  </Badge>
                </div>
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button 
                    asChild
                    className="rounded-full bg-white text-slate-900 hover:bg-white/90 font-bold uppercase text-[10px] tracking-wider"
                  >
                    <Link to={`/course/${course.id}`}>
                      <Eye className="w-4 h-4 mr-2" />
                      Détails
                    </Link>
                  </Button>
                </div>
              </div>
              <CardHeader className="flex-none pt-6 pb-2">
                <div className="flex items-center gap-2 text-indigo-600 font-bold text-[10px] uppercase tracking-widest mb-2">
                  <Clock className="w-3 h-3" />
                  <span>{course.duration}</span>
                </div>
                <h3 className="text-xl font-black leading-none text-slate-900 uppercase tracking-tighter">{course.title}</h3>
              </CardHeader>
              <CardContent className="flex-grow pt-2">
                <p className="text-sm text-slate-500 leading-relaxed line-clamp-3">
                  {course.description}
                </p>
              </CardContent>
              <CardFooter className="flex flex-col gap-4 border-t border-slate-50 pt-5">
                <div className="flex justify-between items-center w-full">
                  <div className="flex items-center gap-1.5 text-indigo-600 font-black text-lg tracking-tighter">
                    <Tag className="w-4 h-4" />
                    <span>{course.price}</span>
                  </div>
                  {course.paymentType === 'monthly' && (
                    <div className="text-[9px] font-black uppercase text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                      En {course.installments} fois
                    </div>
                  )}
                </div>
                <Button className="w-full rounded-2xl h-12 bg-indigo-600 hover:bg-indigo-700 font-bold uppercase text-[10px] tracking-widest shadow-lg shadow-indigo-100" asChild>
                  <Link to={`/course/${course.id}`}>
                    Postuler maintenant
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
