import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Reports from './pages/Reports';
import WeeklyPlan from './pages/WeeklyPlan';
import Achievements from './pages/Achievements';
import Analytics from './pages/Analytics';
import Hydration from './pages/Hydration';
import Calories from './pages/Calories';
import Reminders from './pages/Reminders';
import Comparison from './pages/Comparison';
import Header from './components/Header';
import Footer from './components/Footer';
import { ArrowUp } from 'lucide-react';

// Componente para rolagem suave ao topo ao mudar de rota
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// Componente de botão flutuante para voltar ao topo
function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <button
        type="button"
        onClick={scrollToTop}
        className={`${
          isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
        } bg-emerald-600 hover:bg-emerald-700 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500`}
        aria-label="Voltar ao topo"
      >
        <ArrowUp className="w-6 h-6" />
      </button>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col transition-colors duration-200">
          <Header />
          <ScrollToTop />
          <main className="flex-grow px-4 sm:px-6 lg:px-8 py-6 max-w-7xl w-full mx-auto">
            <div className="w-full">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/perfil" element={<Profile />} />
                <Route path="/planejamento" element={<WeeklyPlan />} />
                <Route path="/conquistas" element={<Achievements />} />
                <Route path="/analises" element={<Analytics />} />
                <Route path="/hidratacao" element={<Hydration />} />
                <Route path="/calorias" element={<Calories />} />
                <Route path="/lembretes" element={<Reminders />} />
                <Route path="/comparacao" element={<Comparison />} />
                <Route path="/relatorios" element={<Reports />} />
              </Routes>
            </div>
          </main>
          <Footer />
          <ScrollToTopButton />
        </div>
      </Router>
    </ThemeProvider>
  );
}