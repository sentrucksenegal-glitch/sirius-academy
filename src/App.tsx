import * as React from 'react';
import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Toaster } from '@/components/ui/sonner';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { CourseList } from '@/components/CourseList';
import { RegistrationForm } from '@/components/RegistrationForm';
import { AdminDashboard } from '@/components/AdminDashboard';
import { Footer } from '@/components/Footer';
import { CourseDetailPage } from '@/components/CourseDetailPage';
import { candidateService } from '@/services/candidateService';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function HomePage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Hero />
      <div id="courses" className="py-32">
        <CourseList />
      </div>
      <div id="register" className="py-10 bg-white border-t border-slate-50">
        <RegistrationForm />
      </div>
    </motion.div>
  );
}

export default function App() {
  const [isAdminView, setIsAdminView] = React.useState(false);
  const [user, setUser] = React.useState<User | null>(null);

  useEffect(() => {
    candidateService.testConnection();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900 overflow-x-hidden">
        <Header 
          onAdminClick={() => setIsAdminView(!isAdminView)} 
          isAdmin={isAdminView}
          isLoggedIn={!!user}
        />
        
        <main>
          <AnimatePresence mode="wait">
            {isAdminView ? (
              <motion.div
                key="admin"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <AdminDashboard />
              </motion.div>
            ) : (
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/course/:courseId" element={<CourseDetailPage />} />
              </Routes>
            )}
          </AnimatePresence>
        </main>

        <Footer />
        <Toaster position="top-center" />
      </div>
    </Router>
  );
}
