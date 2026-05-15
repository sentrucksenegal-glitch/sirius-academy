import { Link } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import { Course } from '@/types';
import { courseService } from '@/services/courseService';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Clock, 
  Tag, 
  ArrowRight, 
  Eye, 
  Loader2, 
  Search, 
  SlidersHorizontal,
  TrendingUp,
  ArrowUpDown,
  CalendarDays,
  LayoutGrid
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type SortOption = 'popularity' | 'price-asc' | 'price-desc' | 'duration' | 'category';

export function CourseList() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('popularity');

  useEffect(() => {
    const fetchCourses = async () => {
      const data = await courseService.getCourses(true);
      setCourses(data);
      setLoading(false);
    };
    fetchCourses();
  }, []);

  const categories = useMemo(() => {
    const cats = new Set(courses.map(c => c.category));
    return ['all', ...Array.from(cats)].filter(Boolean);
  }, [courses]);

  const filteredAndSortedCourses = useMemo(() => {
    let result = courses.filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(search.toLowerCase()) || 
                           course.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === 'all' || course.category === category;
      return matchesSearch && matchesCategory;
    });

    result.sort((a, b) => {
      switch (sortBy) {
        case 'price-asc': return a.priceAmount - b.priceAmount;
        case 'price-desc': return b.priceAmount - a.priceAmount;
        case 'duration': return a.durationWeeks - b.durationWeeks;
        case 'popularity': return b.popularity - a.popularity;
        case 'category': return a.category.localeCompare(b.category) || a.title.localeCompare(b.title);
        default: return 0;
      }
    });

    return result;
  }, [courses, search, category, sortBy]);

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
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-black text-indigo-950 mb-4 tracking-tighter italic"
        >
          NOS FORMATIONS
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-slate-500 max-w-2xl mx-auto font-medium"
        >
          Préparez-vous aux métiers les plus demandés du marché digital avec nos cursus intensifs.
        </motion.p>
      </div>

      {/* Filters & Sorting Controls */}
      <div className="mb-12 flex flex-col lg:flex-row gap-6 items-center justify-between bg-white p-6 rounded-[32px] border border-slate-100 shadow-xl shadow-slate-100/50">
        <div className="relative w-full lg:max-w-md group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
          <Input 
            placeholder="Rechercher une formation..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-12 h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-indigo-100 transition-all font-medium"
          />
        </div>

        <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
          <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-2xl w-full sm:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl font-black uppercase text-[9px] tracking-widest transition-all ${
                  category === cat 
                    ? "bg-white text-indigo-600 shadow-sm" 
                    : "text-slate-400 hover:text-indigo-600"
                }`}
              >
                {cat === 'all' ? 'Toutes' : cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-[220px]">
            <SlidersHorizontal className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <Select value={sortBy} onValueChange={(val) => setSortBy(val as SortOption)}>
              <SelectTrigger className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 font-bold uppercase text-[10px] tracking-widest text-slate-600">
                <SelectValue placeholder="Trier par" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-slate-100 shadow-xl font-bold uppercase text-[10px] tracking-widest">
                <SelectItem value="popularity" className="flex items-center gap-2">
                  <TrendingUp className="w-3 h-3 mr-2 inline" /> Popularité
                </SelectItem>
                <SelectItem value="price-asc" className="flex items-center gap-2">
                  <ArrowUpDown className="w-3 h-3 mr-2 inline" /> Prix croissant
                </SelectItem>
                <SelectItem value="price-desc" className="flex items-center gap-2"> Prix décroissant</SelectItem>
                <SelectItem value="duration" className="flex items-center gap-2">
                  <CalendarDays className="w-3 h-3 mr-2 inline" /> Durée
                </SelectItem>
                <SelectItem value="category" className="flex items-center gap-2">
                  <LayoutGrid className="w-3 h-3 mr-2 inline" /> Catégorie
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="min-h-[400px]">
        <AnimatePresence mode="popLayout">
          {filteredAndSortedCourses.length > 0 ? (
            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {filteredAndSortedCourses.map((course, index) => (
                <motion.div
                  key={course.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card className="h-full flex flex-col overflow-hidden border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-indigo-100 transition-all duration-500 group rounded-[32px]">
                    <div className="relative h-56 overflow-hidden">
                      <img 
                        src={course.image} 
                        alt={course.title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute top-5 left-5 flex flex-col gap-2">
                        <Badge className="bg-white/90 text-indigo-900 border-none hover:bg-white font-black uppercase text-[10px] tracking-widest px-3 py-1 shadow-sm w-fit">
                          {course.category}
                        </Badge>
                        <Badge className="bg-indigo-600 text-white border-none font-black uppercase text-[10px] tracking-widest px-3 py-1 shadow-sm w-fit">
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
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="bg-slate-100 p-6 rounded-full mb-6">
                <Search className="w-10 h-10 text-slate-300" />
              </div>
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter mb-2">Aucun résultat</h3>
              <p className="text-slate-500 font-medium">Nous n'avons trouvé aucune formation correspondant à votre recherche.</p>
              <Button 
                variant="ghost" 
                onClick={() => {setSearch(''); setCategory('all');}}
                className="mt-4 text-indigo-600 font-bold uppercase text-[10px] tracking-widest"
              >
                Réinitialiser les filtres
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

