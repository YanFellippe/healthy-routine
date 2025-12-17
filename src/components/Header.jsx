import { Link } from "react-router-dom";
import { Activity, Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function Header() {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <header className="bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-gray-800 dark:to-gray-900 text-white shadow-lg transition-colors duration-200">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Activity className="w-8 h-8" />
            <h1 className="text-2xl font-bold tracking-tight">Saúde em Dia</h1>
          </div>
          <div className="flex items-center gap-6">
            <nav className="flex gap-6">
            <Link to="/" className="hover:text-emerald-100 transition-colors font-medium">
              Início
            </Link>
            <Link to="/perfil" className="hover:text-emerald-100 transition-colors font-medium">
              Perfil
            </Link>
            <Link to="/planejamento" className="hover:text-emerald-100 transition-colors font-medium">
              Planejamento
            </Link>
            <Link to="/conquistas" className="hover:text-emerald-100 transition-colors font-medium">
              Conquistas
            </Link>
            <Link to="/analises" className="hover:text-emerald-100 transition-colors font-medium">
              Análises
            </Link>
            <Link to="/hidratacao" className="hover:text-emerald-100 transition-colors font-medium">
              Hidratação
            </Link>
            <Link to="/calorias" className="hover:text-emerald-100 transition-colors font-medium">
              Calorias
            </Link>
            <Link to="/lembretes" className="hover:text-emerald-100 transition-colors font-medium">
              Lembretes
            </Link>
            <Link to="/comparacao" className="hover:text-emerald-100 transition-colors font-medium">
              Comparação
            </Link>
            <Link to="/relatorios" className="hover:text-emerald-100 transition-colors font-medium">
              Relatórios
            </Link>
            </nav>
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
              title={darkMode ? "Modo Claro" : "Modo Escuro"}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
