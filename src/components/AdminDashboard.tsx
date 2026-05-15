import * as React from 'react';
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { candidateService } from '@/services/candidateService';
import { Candidate, CandidateStatus, Course } from '@/types';
import { courseService } from '@/services/courseService';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { 
  Users, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Mail, 
  Phone, 
  BookOpen, 
  LogIn, 
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  Plus,
  Trash2,
  Edit,
  Eye,
  EyeOff
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { auth } from '@/lib/firebase';
import { signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { toast } from 'sonner';

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'candidates' | 'courses'>('candidates');
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditingCourse, setIsEditingCourse] = useState(false);
  const [currentCourse, setCurrentCourse] = useState<Partial<Course> | null>(null);
  const itemsPerPage = 10;

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      if (user && user.email === 'sentruck.senegal@gmail.com') {
        setIsAuth(true);
        fetchCandidates();
        fetchCourses();
      } else {
        setIsAuth(false);
        setLoading(false);
      }
    });
    return unsub;
  }, []);

  const fetchCandidates = async () => {
    setLoading(true);
    const data = await candidateService.getCandidates();
    setCandidates(data);
    if (activeTab === 'candidates') setCurrentPage(1);
    setLoading(false);
  };

  const fetchCourses = async () => {
    setLoading(true);
    const data = await courseService.getCourses(false);
    setCourses(data);
    if (activeTab === 'courses') setCurrentPage(1);
    setLoading(false);
  };

  const handleStatusChange = async (id: string, status: CandidateStatus) => {
    try {
      await candidateService.updateStatus(id, status);
      setCandidates(prev => prev.map(c => c.id === id ? { ...c, status } : c));
      toast.success('Statut mis à jour');
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const handleToggleVisibility = async (course: Course) => {
    try {
      await courseService.toggleVisibility(course.id, course.visible);
      setCourses(prev => prev.map(c => c.id === course.id ? { ...c, visible: !c.visible } : c));
      toast.success(course.visible ? 'Formation masquée' : 'Formation affichée');
    } catch (error) {
      toast.error('Erreur lors de la modification');
    }
  };

  const handleDeleteCourse = async (id: string) => {
    if (!confirm('Voulez-vous vraiment supprimer cette formation ?')) return;
    try {
      await courseService.deleteCourse(id);
      setCourses(prev => prev.filter(c => c.id !== id));
      toast.success('Formation supprimée');
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCourse) return;

    try {
      const courseData = currentCourse as Omit<Course, 'id'>;
      if (currentCourse.id) {
        await courseService.updateCourse(currentCourse.id, courseData);
        setCourses(prev => prev.map(c => c.id === currentCourse.id ? { ...c, ...courseData } : c));
        toast.success('Formation mise à jour');
      } else {
        const id = await courseService.addCourse({
          ...courseData,
          visible: true,
          order: courses.length + 1
        } as Omit<Course, 'id'>);
        setCourses(prev => [...prev, { id, ...courseData, visible: true, order: courses.length + 1 } as Course]);
        toast.success('Formation ajoutée');
      }
      setIsEditingCourse(false);
      setCurrentCourse(null);
    } catch (error) {
      toast.error('Erreur lors de l\'enregistrement');
    }
  };

  const openAddCourse = () => {
    setCurrentCourse({
      title: '',
      description: '',
      detailedDescription: '',
      objective: '',
      prerequisites: [],
      targetAudience: [],
      duration: '',
      price: '',
      priceAmount: 0,
      durationWeeks: 0,
      popularity: 50,
      category: 'Développement',
      paymentType: 'monthly',
      installments: 1,
      image: '',
      curriculum: [],
      visible: true,
      order: courses.length + 1
    });
    setIsEditingCourse(true);
  };

  const openEditCourse = (course: Course) => {
    setCurrentCourse(course);
    setIsEditingCourse(true);
  };

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      toast.error('Échec de la connexion');
    }
  };

  if (!isAuth) {
    return (
      <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="bg-indigo-600 p-6 rounded-3xl text-white mb-8 shadow-2xl shadow-indigo-100">
          <Users className="w-12 h-12" />
        </div>
        <h2 className="text-4xl font-black italic tracking-tighter mb-4 text-slate-900">Accès Administrateur</h2>
        <p className="text-slate-500 mb-10 text-center max-w-sm font-medium">
          Cette section est protégée. Connectez-vous avec un compte autorisé pour gérer les candidatures.
        </p>
        <Button onClick={handleLogin} className="gap-3 h-14 px-8 rounded-2xl bg-indigo-600 hover:bg-indigo-700 font-black uppercase text-xs tracking-widest shadow-xl shadow-indigo-100">
          <LogIn className="w-4 h-4" />
          Se connecter avec Google
        </Button>
      </div>
    );
  }

  const sortedCandidates = [...candidates].sort((a, b) => b.createdAt - a.createdAt);
  const totalPages = Math.ceil(sortedCandidates.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentCandidates = sortedCandidates.slice(startIndex, startIndex + itemsPerPage);

  const getStatusBadge = (status: CandidateStatus) => {
    switch (status) {
      case 'pending': return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 font-black uppercase text-[10px]">En attente</Badge>;
      case 'contacted': return <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200 font-black uppercase text-[10px]">Contacté</Badge>;
      case 'accepted': return <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 font-black uppercase text-[10px]">Accepté</Badge>;
      case 'rejected': return <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200 font-black uppercase text-[10px]">Refusé</Badge>;
    }
  };

  return (
    <div className="container mx-auto px-4 py-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black tracking-tighter italic text-slate-900 mb-2 uppercase">
            SIRIUS <span className="text-indigo-600">ACADEMY</span> ADMIN
          </h1>
          <p className="text-slate-500 font-medium tracking-tight">Gestion des candidatures et du catalogue de formations.</p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={() => activeTab === 'candidates' ? fetchCandidates() : fetchCourses()} 
            disabled={loading} 
            className="rounded-xl border-slate-200 font-bold uppercase text-[10px] tracking-widest h-11 px-6"
          >
            Actualiser
          </Button>
          <Button variant="ghost" onClick={() => signOut(auth)} className="text-rose-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl font-bold uppercase text-[10px] tracking-widest h-11 px-6">
            <LogOut className="w-4 h-4 mr-2" />
            Quitter
          </Button>
        </div>
      </div>

      <div className="flex gap-2 mb-10 bg-slate-100 p-1.5 rounded-2xl w-fit">
        <button
          onClick={() => setActiveTab('candidates')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all ${
            activeTab === 'candidates' 
              ? "bg-white text-indigo-600 shadow-sm" 
              : "text-slate-500 hover:text-indigo-600"
          }`}
        >
          <Users className="w-4 h-4" />
          Candidatures
        </button>
        <button
          onClick={() => setActiveTab('courses')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all ${
            activeTab === 'courses' 
              ? "bg-white text-indigo-600 shadow-sm" 
              : "text-slate-500 hover:text-indigo-600"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Formations
        </button>
      </div>

      {activeTab === 'candidates' ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <StatCard title="Total" value={candidates.length} icon={<Users />} color="bg-indigo-600" />
            <StatCard title="En attente" value={candidates.filter(c => c.status === 'pending').length} icon={<Clock />} color="bg-amber-500" />
            <StatCard title="Acceptés" value={candidates.filter(c => c.status === 'accepted').length} icon={<CheckCircle2 />} color="bg-emerald-500" />
            <StatCard title="Refusés" value={candidates.filter(c => c.status === 'rejected').length} icon={<XCircle />} color="bg-rose-500" />
          </div>

          <Card className="rounded-[32px] border-slate-100 shadow-xl overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 px-8 py-6">
              <CardTitle className="text-xl font-black italic tracking-tight uppercase">Liste des Candidatures</CardTitle>
              <CardDescription className="font-medium text-slate-500">Visualisez et gérez les demandes de formation.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-slate-50/30">
                  <TableRow className="hover:bg-transparent border-slate-100">
                    <TableHead className="font-black uppercase text-[10px] tracking-widest py-6 px-8">Candidat</TableHead>
                    <TableHead className="font-black uppercase text-[10px] tracking-widest">Formation</TableHead>
                    <TableHead className="font-black uppercase text-[10px] tracking-widest">Date</TableHead>
                    <TableHead className="font-black uppercase text-[10px] tracking-widest">Statut</TableHead>
                    <TableHead className="font-black uppercase text-[10px] tracking-widest text-right px-8">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-20 text-slate-400 font-medium">Chargement des données...</TableCell>
                    </TableRow>
                  ) : currentCandidates.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-20 text-slate-400 font-medium italic">Aucun candidat pour le moment.</TableCell>
                    </TableRow>
                  ) : currentCandidates.map((candidate) => (
                    <TableRow key={candidate.id} className="border-slate-50 hover:bg-slate-50/30 transition-colors">
                      <TableCell className="px-8 py-6">
                        <div className="font-black text-slate-900 uppercase tracking-tighter mb-1">{candidate.fullName}</div>
                        <div className="text-xs text-slate-500 flex flex-col gap-1">
                          <span className="flex items-center gap-1.5 opacity-70"><Mail className="w-3 h-3"/> {candidate.email}</span>
                          <span className="flex items-center gap-1.5 opacity-70"><Phone className="w-3 h-3"/> {candidate.phone}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-indigo-50 border-none text-indigo-700 font-bold uppercase text-[9px] tracking-widest px-2 py-0.5 rounded-lg">
                          {candidate.course}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs font-bold text-slate-400 uppercase tracking-tighter text-[10px]">
                        {format(candidate.createdAt, 'dd MMMM yyyy', { locale: fr })}
                      </TableCell>
                      <TableCell>{getStatusBadge(candidate.status)}</TableCell>
                      <TableCell className="text-right px-8">
                        <Select
                          defaultValue={candidate.status}
                          onValueChange={(val) => handleStatusChange(candidate.id!, val as CandidateStatus)}
                        >
                          <SelectTrigger className="w-[140px] ml-auto h-10 rounded-xl border-slate-200 font-bold text-[10px] uppercase tracking-widest">
                            <SelectValue placeholder="Changer" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl border-slate-100 shadow-xl font-bold uppercase text-[10px] tracking-widest">
                            <SelectItem value="pending">En attente</SelectItem>
                            <SelectItem value="contacted">Contacté</SelectItem>
                            <SelectItem value="accepted">Accepté</SelectItem>
                            <SelectItem value="rejected">Refusé</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {candidates.length > itemsPerPage && (
                <div className="bg-slate-50/30 border-t border-slate-100 px-8 py-4 flex items-center justify-between">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Affichage de {startIndex + 1} à {Math.min(startIndex + itemsPerPage, candidates.length)} sur {candidates.length}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="rounded-lg h-9 w-9 p-0 border-slate-200"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "ghost"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className={`h-9 w-9 rounded-lg font-black text-xs ${
                            currentPage === page 
                              ? "bg-indigo-600 hover:bg-indigo-700 font-white" 
                              : "text-slate-500 hover:text-indigo-600 hover:bg-indigo-50"
                          }`}
                        >
                          {page}
                        </Button>
                      ))}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="rounded-lg h-9 w-9 p-0 border-slate-200"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      ) : (
        <>
          <div className="flex justify-between items-center mb-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full md:w-auto">
              <StatCard title="Formations" value={courses.length} icon={<BookOpen />} color="bg-indigo-600" />
              <StatCard title="Visibles" value={courses.filter(c => c.visible).length} icon={<Eye />} color="bg-emerald-500" />
              <StatCard title="Masquées" value={courses.filter(c => !c.visible).length} icon={<EyeOff />} color="bg-slate-400" />
            </div>
            <Button onClick={openAddCourse} className="gap-2 h-14 px-8 rounded-2xl bg-indigo-600 hover:bg-indigo-700 font-black uppercase text-xs tracking-widest shadow-xl shadow-indigo-100">
              <Plus className="w-4 h-4" />
              Nouvelle Formation
            </Button>
          </div>

          <Card className="rounded-[32px] border-slate-100 shadow-xl overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 px-8 py-6">
              <CardTitle className="text-xl font-black italic tracking-tight uppercase">Catalogue de Formations</CardTitle>
              <CardDescription className="font-medium text-slate-500">Ajoutez, modifiez ou masquez vos cursus de formation.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-slate-50/30">
                  <TableRow className="hover:bg-transparent border-slate-100">
                    <TableHead className="font-black uppercase text-[10px] tracking-widest py-6 px-8">Formation</TableHead>
                    <TableHead className="font-black uppercase text-[10px] tracking-widest">Durée & Prix</TableHead>
                    <TableHead className="font-black uppercase text-[10px] tracking-widest">Visibilité</TableHead>
                    <TableHead className="font-black uppercase text-[10px] tracking-widest text-right px-8">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-20 text-slate-400 font-medium">Chargement des formations...</TableCell>
                    </TableRow>
                  ) : courses.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-20 text-slate-400 font-medium italic">Aucune formation créée.</TableCell>
                    </TableRow>
                  ) : courses.map((course) => (
                    <TableRow key={course.id} className="border-slate-50 hover:bg-slate-50/30 transition-colors">
                      <TableCell className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <img src={course.image} className="w-12 h-12 rounded-xl object-cover shadow-sm" />
                          <div>
                            <div className="font-black text-slate-900 uppercase tracking-tighter mb-1">{course.title}</div>
                            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{course.id}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm font-bold text-slate-700">{course.duration}</div>
                        <div className="text-xs font-black text-indigo-600">{course.price}</div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={course.visible ? "default" : "secondary"}
                          className={`uppercase text-[9px] font-black tracking-widest ${
                            course.visible ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-slate-100 text-slate-400"
                          }`}
                        >
                          {course.visible ? "Visible" : "Masquée"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right px-8">
                        <div className="flex gap-2 justify-end">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleToggleVisibility(course)}
                            title={course.visible ? "Masquer" : "Afficher"}
                            className="rounded-lg hover:bg-slate-100"
                          >
                            {course.visible ? <EyeOff className="w-4 h-4 text-slate-500" /> : <Eye className="w-4 h-4 text-emerald-500" />}
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => openEditCourse(course)}
                            className="rounded-lg hover:bg-indigo-50 hover:text-indigo-600"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleDeleteCourse(course.id)}
                            className="rounded-lg hover:bg-rose-50 hover:text-rose-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}

      {/* Course Editor Modal */}
      {isEditingCourse && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-[40px] shadow-2xl flex flex-col"
          >
            <div className="px-10 py-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h2 className="text-3xl font-black italic tracking-tighter uppercase text-slate-900">
                  {currentCourse?.id ? 'Modifier' : 'Nouvelle'} <span className="text-indigo-600">Formation</span>
                </h2>
                <p className="text-slate-500 font-medium">Remplissez les détails du programme.</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsEditingCourse(false)} className="rounded-full">
                <XCircle className="w-8 h-8 text-slate-300 hover:text-slate-900 transition-colors" />
              </Button>
            </div>

            <form onSubmit={handleSaveCourse} className="flex-1 overflow-y-auto p-10 space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Titre de la formation</label>
                  <input
                    required
                    value={currentCourse?.title}
                    onChange={e => setCurrentCourse({...currentCourse!, title: e.target.value})}
                    className="w-full h-14 bg-slate-50 rounded-2xl px-6 border border-slate-100 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 outline-none transition-all font-bold text-slate-900"
                    placeholder="ex: Master en Marketing Digital"
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Catégorie</label>
                  <Select 
                    value={currentCourse?.category} 
                    onValueChange={(val) => setCurrentCourse({...currentCourse!, category: val})}
                  >
                    <SelectTrigger className="h-14 rounded-2xl bg-slate-50 border-slate-100 font-bold">
                      <SelectValue placeholder="Catégorie" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl">
                      <SelectItem value="Développement">Développement</SelectItem>
                      <SelectItem value="Design">Design</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="Data">Data Science & IA</SelectItem>
                      <SelectItem value="Bureautique">Bureautique</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Durée (Libellé)</label>
                  <input
                    required
                    value={currentCourse?.duration}
                    onChange={e => setCurrentCourse({...currentCourse!, duration: e.target.value})}
                    className="w-full h-14 bg-slate-50 rounded-2xl px-6 border border-slate-100 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 outline-none transition-all font-bold text-slate-900"
                    placeholder="ex: 12 semaines"
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Durée (Nombre de semaines - pour le tri)</label>
                  <input
                    required
                    type="number"
                    step="0.1"
                    value={currentCourse?.durationWeeks}
                    onChange={e => setCurrentCourse({...currentCourse!, durationWeeks: parseFloat(e.target.value)})}
                    className="w-full h-14 bg-slate-50 rounded-2xl px-6 border border-slate-100 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 outline-none transition-all font-bold text-slate-900"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Description courte</label>
                <textarea
                  required
                  value={currentCourse?.description}
                  onChange={e => setCurrentCourse({...currentCourse!, description: e.target.value})}
                  className="w-full h-24 p-6 bg-slate-50 rounded-2xl border border-slate-100 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 outline-none transition-all font-bold text-slate-900 resize-none"
                  placeholder="Apparaît sur les cartes de la page d'accueil..."
                />
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Description détaillée</label>
                <textarea
                  required
                  value={currentCourse?.detailedDescription}
                  onChange={e => setCurrentCourse({...currentCourse!, detailedDescription: e.target.value})}
                  className="w-full h-40 p-6 bg-slate-50 rounded-2xl border border-slate-100 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 outline-none transition-all font-bold text-slate-900 resize-none"
                  placeholder="Objectifs pédagogiques, méthodologie..."
                />
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Objectif principal</label>
                <textarea
                  required
                  value={currentCourse?.objective}
                  onChange={e => setCurrentCourse({...currentCourse!, objective: e.target.value})}
                  className="w-full h-24 p-6 bg-slate-50 rounded-2xl border border-slate-100 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 outline-none transition-all font-bold text-slate-900 resize-none"
                  placeholder="L'objectif majeur de cette formation..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Prix (Libellé)</label>
                  <input
                    required
                    value={currentCourse?.price}
                    onChange={e => setCurrentCourse({...currentCourse!, price: e.target.value})}
                    className="w-full h-14 bg-slate-50 rounded-2xl px-6 border border-slate-100 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 outline-none transition-all font-bold text-slate-900"
                    placeholder="ex: 250.000 FCFA"
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Prix (Montant - pour le tri)</label>
                  <input
                    required
                    type="number"
                    value={currentCourse?.priceAmount}
                    onChange={e => setCurrentCourse({...currentCourse!, priceAmount: parseInt(e.target.value)})}
                    className="w-full h-14 bg-slate-50 rounded-2xl px-6 border border-slate-100 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 outline-none transition-all font-bold text-slate-900"
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Popularité (0-100)</label>
                  <input
                    required
                    type="number"
                    min="0"
                    max="100"
                    value={currentCourse?.popularity}
                    onChange={e => setCurrentCourse({...currentCourse!, popularity: parseInt(e.target.value)})}
                    className="w-full h-14 bg-slate-50 rounded-2xl px-6 border border-slate-100 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 outline-none transition-all font-bold text-slate-900"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Modalités de paiement</label>
                <Select 
                  value={currentCourse?.paymentType} 
                  onValueChange={(val) => setCurrentCourse({...currentCourse!, paymentType: val as 'unique' | 'monthly'})}
                >
                  <SelectTrigger className="h-14 rounded-2xl bg-slate-50 border-slate-100 font-bold">
                    <SelectValue placeholder="Type de paiement" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl">
                    <SelectItem value="unique">Paiement unique</SelectItem>
                    <SelectItem value="monthly">Mensualités</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {currentCourse?.paymentType === 'monthly' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Nombre d'échéances</label>
                    <input
                      type="number"
                      value={currentCourse?.installments}
                      onChange={e => setCurrentCourse({...currentCourse!, installments: parseInt(e.target.value)})}
                      className="w-full h-14 bg-slate-50 rounded-2xl px-6 border border-slate-100 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 outline-none transition-all font-bold text-slate-900"
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Prix par mois</label>
                    <input
                      value={currentCourse?.monthlyPrice}
                      onChange={e => setCurrentCourse({...currentCourse!, monthlyPrice: e.target.value})}
                      className="w-full h-14 bg-slate-50 rounded-2xl px-6 border border-slate-100 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 outline-none transition-all font-bold text-slate-900"
                      placeholder="ex: 85.000 FCFA"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Image URL</label>
                <input
                  required
                  value={currentCourse?.image}
                  onChange={e => setCurrentCourse({...currentCourse!, image: e.target.value})}
                  className="w-full h-14 bg-slate-50 rounded-2xl px-6 border border-slate-100 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 outline-none transition-all font-bold text-slate-900"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              <div className="grid grid-cols-1 gap-10 pt-6">
                <ArrayEditor 
                  title="Programme (Curriculum)" 
                  items={currentCourse?.curriculum || []} 
                  onChange={(items) => setCurrentCourse({...currentCourse!, curriculum: items})} 
                />
                <ArrayEditor 
                  title="Prérequis" 
                  items={currentCourse?.prerequisites || []} 
                  onChange={(items) => setCurrentCourse({...currentCourse!, prerequisites: items})} 
                />
                <ArrayEditor 
                  title="Cible" 
                  items={currentCourse?.targetAudience || []} 
                  onChange={(items) => setCurrentCourse({...currentCourse!, targetAudience: items})} 
                />
              </div>
            </form>

            <div className="p-10 border-t border-slate-100 bg-slate-50/50 flex gap-4">
              <Button 
                variant="outline" 
                onClick={() => setIsEditingCourse(false)}
                className="flex-1 h-14 rounded-2xl font-black uppercase text-xs tracking-widest border-slate-200"
              >
                Annuler
              </Button>
              <Button 
                onClick={handleSaveCourse}
                className="flex-[2] h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 font-black uppercase text-xs tracking-widest shadow-xl shadow-indigo-100"
              >
                {currentCourse?.id ? 'Mettre à jour' : 'Créer la formation'}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

function ArrayEditor({ title, items, onChange }: { title: string, items: string[], onChange: (items: string[]) => void }) {
  const [newValue, setNewValue] = useState('');

  const handleAdd = () => {
    if (newValue.trim()) {
      onChange([...items, newValue.trim()]);
      setNewValue('');
    }
  };

  const handleRemove = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    onChange(newItems);
  };

  return (
    <div className="space-y-4">
      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">{title}</label>
      <div className="flex gap-2">
        <input
          value={newValue}
          onChange={e => setNewValue(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAdd())}
          className="flex-1 h-12 bg-slate-50 rounded-xl px-4 border border-slate-100 outline-none font-bold text-sm"
          placeholder={`Ajouter à : ${title}`}
        />
        <Button 
          type="button"
          onClick={handleAdd}
          className="h-12 w-12 rounded-xl bg-slate-900 p-0"
        >
          <Plus className="w-5 h-5" />
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map((item, i) => (
          <Badge key={i} className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-none px-3 py-1.5 rounded-lg flex items-center gap-2 font-bold text-xs font-sans">
            {item}
            <button onClick={() => handleRemove(i)} className="hover:text-rose-500">
              <XCircle className="w-3.5 h-3.5" />
            </button>
          </Badge>
        ))}
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }: { title: string, value: number, icon: React.ReactNode, color: string }) {
  return (
    <Card className="rounded-[24px] border-none shadow-lg shadow-slate-100">
      <CardContent className="p-6">
        <div className="flex items-center gap-5">
          <div className={`${color} w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-current/20`}>
            {icon}
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{title}</p>
            <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{value}</h3>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
