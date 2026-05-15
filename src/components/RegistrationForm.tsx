import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Course } from '@/types';
import { candidateService } from '@/services/candidateService';
import { courseService } from '@/services/courseService';
import { toast } from 'sonner';
import { Send, CheckCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

const formSchema = z.object({
  fullName: z.string().min(2, { message: "Le nom doit comporter au moins 2 caractères." }),
  email: z.string().email({ message: "Email invalide." }),
  phone: z.string().min(9, { message: "Numéro de téléphone invalide." }),
  course: z.string().min(1, { message: "Veuillez choisir une formation." }),
  motivation: z.string().min(10, { message: "Dites-nous en un peu plus sur vous." }),
});

export function RegistrationForm({ isHeroVariant }: { isHeroVariant?: boolean }) {
  const [submitted, setSubmitted] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    const fetchCourses = async () => {
      const data = await courseService.getCourses(true);
      setCourses(data);
    };
    fetchCourses();
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      course: "",
      motivation: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await candidateService.apply(values);
      toast.success("Candidature envoyée avec succès !");
      setSubmitted(true);
      form.reset();
    } catch (error) {
      toast.error("Une erreur est survenue lors de l'envoi.");
      console.error(error);
    }
  }

  if (submitted) {
    return (
      <div className={`${isHeroVariant ? '' : 'container mx-auto px-4 py-20'} max-w-2xl text-center flex flex-col items-center`}>
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-10 rounded-[40px] border border-slate-200 shadow-2xl"
        >
          <div className="bg-green-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/20">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-4">Candidature Reçue !</h2>
          <p className="text-slate-600 mb-8">
            Merci {form.getValues('fullName')}, votre demande a bien été enregistrée. 
            Notre équipe vous contactera sous 24h.
          </p>
          <Button onClick={() => setSubmitted(false)} variant="outline" className="rounded-xl border-slate-200">
            Envoyer une autre demande
          </Button>
        </motion.div>
      </div>
    );
  }

  if (isHeroVariant) {
    return (
      <div className="bg-white rounded-[32px] p-8 md:p-10 shadow-2xl relative">
        <div className="absolute -top-4 -right-4 bg-amber-400 text-indigo-900 px-4 py-2 rounded-xl font-black text-xs rotate-6 shadow-lg uppercase tracking-tighter">
          SESSION 2026
        </div>

        <h3 className="text-2xl font-black text-slate-900 mb-2 italic">Prêt à décoller ?</h3>
        <p className="text-slate-500 mb-8 text-sm">Postulez pour rejoindre l'élite du digital à Dakar.</p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-[10px] font-black text-indigo-600 uppercase tracking-tighter">Nom Complet</FormLabel>
                  <FormControl>
                    <Input placeholder="Abdoulaye Diop" {...field} className="h-12 bg-slate-50 border-slate-200 rounded-xl text-sm" />
                  </FormControl>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-[10px] font-black text-indigo-600 uppercase tracking-tighter">Email Professionnel</FormLabel>
                  <FormControl>
                    <Input placeholder="abdou@example.com" {...field} className="h-12 bg-slate-50 border-slate-200 rounded-xl text-sm" />
                  </FormControl>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="course"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-[10px] font-black text-indigo-600 uppercase tracking-tighter">Choix de la formation</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-12 bg-slate-50 border-slate-200 rounded-xl text-sm">
                        <SelectValue placeholder="Choisir un cours" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {courses.map(course => (
                        <SelectItem key={course.id} value={course.title}>{course.title}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )}
            />

            <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-[10px] font-black text-indigo-600 uppercase tracking-tighter">Téléphone</FormLabel>
                    <FormControl>
                      <Input placeholder="+221 ..." {...field} className="h-12 bg-slate-50 border-slate-200 rounded-xl text-sm" />
                    </FormControl>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />

            <Button 
              type="submit" 
              className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-widest rounded-xl shadow-xl shadow-indigo-100 transition-all mt-4"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Envoi..." : "REJOINDRE L'ACADEMY"}
            </Button>
          </form>
        </Form>
        <p className="mt-6 text-center text-[10px] text-slate-400 italic font-medium uppercase tracking-tighter pb-1">
          * Réponse garantie sous 24h par notre équipe
        </p>
      </div>
    );
  }

  return (
    <div id="register" className="container mx-auto px-4 py-24">
      <div className="flex flex-col lg:flex-row gap-20 items-center">
        <div className="flex-1 lg:max-w-lg">
          <h2 className="text-4xl md:text-6xl font-black mb-8 leading-[0.9] text-indigo-950">VOTRE CARRIÈRE DIGITALE COMMENCE ICI.</h2>
          <p className="text-lg text-slate-600 mb-10 leading-relaxed">
            Remplissez ce formulaire pour postuler à l'une de nos formations accélérées. 
            Places limitées par session pour garantir un suivi personnalisé.
          </p>
          
          <div className="space-y-8">
            <FeatureItem title="Accès Immédiat" description="Commencez dès validation de votre inscription." />
            <FeatureItem title="Accompagnement" description="Coachs experts disponibles 7j/7." />
            <FeatureItem title="Réseau Professionnel" description="Mise en relation directe avec des entreprises locales." />
          </div>
        </div>

        <div className="flex-1 bg-white text-slate-900 p-8 md:p-12 rounded-[40px] shadow-2xl border border-slate-100">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-indigo-600 font-bold uppercase text-[10px] tracking-wider">Nom Complet</FormLabel>
                      <FormControl>
                        <Input placeholder="Prénom et Nom" {...field} className="h-12 bg-slate-50 border-slate-200 rounded-xl" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-indigo-600 font-bold uppercase text-[10px] tracking-wider">Email</FormLabel>
                      <FormControl>
                        <Input placeholder="votre@email.com" {...field} className="h-12 bg-slate-50 border-slate-200 rounded-xl" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-indigo-600 font-bold uppercase text-[10px] tracking-wider">Téléphone</FormLabel>
                      <FormControl>
                        <Input placeholder="+221 ..." {...field} className="h-12 bg-slate-50 border-slate-200 rounded-xl" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="course"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-indigo-600 font-bold uppercase text-[10px] tracking-wider">Formation Souhaitée</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12 bg-slate-50 border-slate-200 rounded-xl">
                            <SelectValue placeholder="Choisir un cours" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {courses.map(course => (
                            <SelectItem key={course.id} value={course.title}>{course.title}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="motivation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-indigo-600 font-bold uppercase text-[10px] tracking-wider">Pourquoi nous rejoindre ?</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Parlez-nous de vos objectifs..." 
                        {...field} 
                        className="bg-slate-50 border-slate-200 rounded-xl min-h-[120px] resize-none"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="w-full h-14 text-lg font-black uppercase tracking-widest rounded-xl bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-100"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "Envoi..." : "Envoyer ma candidature"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}

function FeatureItem({ title, description }: { title: string, description: string }) {
  return (
    <div className="flex gap-4">
      <div className="bg-indigo-600/10 p-2.5 rounded-xl h-fit border border-indigo-100">
        <CheckCircle className="w-5 h-5 text-indigo-600" />
      </div>
      <div>
        <h4 className="font-black text-slate-900 uppercase tracking-wider text-sm mb-1">{title}</h4>
        <p className="text-sm text-slate-500 leading-relaxed font-medium">{description}</p>
      </div>
    </div>
  );
}
