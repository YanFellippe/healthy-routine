import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Reports from "./pages/Reports";
import WeeklyPlan from "./pages/WeeklyPlan";
import Achievements from "./pages/Achievements";
import Analytics from "./pages/Analytics";
import Hydration from "./pages/Hydration";
import Calories from "./pages/Calories";
import Reminders from "./pages/Reminders";
import Comparison from "./pages/Comparison";
import Header from "./components/Header";
import Footer from "./components/Footer";

export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col transition-colors duration-200">
          <Header />
          <main className="flex-grow p-4">
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
          </main>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
}