import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Activity, Moon, Sun, Menu, X } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function Header() {
  const { darkMode, toggleDarkMode } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  // Fechar o menu ao mudar de rota
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  // Fechar o menu ao clicar fora dele
  useEffect(() => {
    const handleClickOutside = (event) => {
      const header = document.querySelector('header');
      if (isMenuOpen && !header.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  const navLinks = [
    { to: "/", label: "Início" },
    { to: "/perfil", label: "Perfil" },
    { to: "/planejamento", label: "Planejamento" },
    { to: "/conquistas", label: "Conquistas" },
    { to: "/analises", label: "Análises" },
    { to: "/hidratacao", label: "Hidratação" },
    { to: "/calorias", label: "Calorias" },
    { to: "/lembretes", label: "Lembretes" },
    { to: "/comparacao", label: "Comparação" },
    { to: "/relatorios", label: "Relatórios" },
  ];

  return (
    <header className="bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-gray-800 dark:to-gray-900 text-white shadow-lg transition-colors duration-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Activity className="w-7 h-7 md:w-8 md:h-8" />
            <h1 className="text-xl md:text-2xl font-bold tracking-tight">Saúde em Dia</h1>
          </div>
          
          {/* Botão do menu mobile */}
          <div className="md:hidden flex items-center gap-4">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
              aria-label="Alternar tema"
            >
              {darkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
              aria-label="Menu"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Navegação para desktop */}
          <div className="hidden md:flex items-center gap-6">
            <nav className="flex items-center gap-4 lg:gap-6">
              {navLinks.slice(0, 5).map((link) => (
                <Link 
                  key={link.to}
                  to={link.to}
                  className="hover:text-emerald-100 transition-colors font-medium text-sm lg:text-base"
                >
                  {link.label}
                </Link>
              ))}
              <div className="relative group">
                <button className="flex items-center gap-1 hover:text-emerald-100 transition-colors font-medium text-sm lg:text-base">
                  Mais
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 hidden group-hover:block">
                  {navLinks.slice(5).map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            </nav>
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-white/10 transition-colors hidden md:block"
              aria-label="Alternar tema"
            >
              {darkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Menu mobile */}
        <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'} mt-4 pb-4`}>
          <nav className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="block px-3 py-2 rounded-md hover:bg-white/10 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
