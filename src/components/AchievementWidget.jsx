import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Trophy, Flame, TrendingDown, ChevronRight } from "lucide-react";

export default function AchievementWidget() {
  const [stats, setStats] = useState({
    diasConsecutivos: 0,
    totalConquistas: 0,
    conquistasDesbloqueadas: 0,
    pesoPerdido: 0
  });

  useEffect(() => {
    calcularStats();
  }, []);

  const calcularStats = () => {
    const historico = JSON.parse(localStorage.getItem("historicoSaude") || "[]");
    
    // Calcular dias consecutivos
    const diasConsecutivos = calcularDiasConsecutivos(historico);
    
    // Calcular peso perdido
    const pesoInicial = historico.length > 0 ? historico[historico.length - 1].peso : 0;
    const dadosSaude = JSON.parse(localStorage.getItem("dadosSaude") || "{}");
    const pesoAtual = dadosSaude.peso || 0;
    const pesoPerdido = Math.max(0, pesoInicial - pesoAtual);

    // Calcular conquistas desbloqueadas
    let conquistasDesbloqueadas = 0;
    const totalConquistas = 12;

    if (historico.length >= 1) conquistasDesbloqueadas++;
    if (diasConsecutivos >= 3) conquistasDesbloqueadas++;
    if (diasConsecutivos >= 7) conquistasDesbloqueadas++;
    if (diasConsecutivos >= 30) conquistasDesbloqueadas++;
    if (pesoPerdido >= 1) conquistasDesbloqueadas++;
    if (pesoPerdido >= 5) conquistasDesbloqueadas++;
    if (pesoPerdido >= 10) conquistasDesbloqueadas++;
    if (historico.length >= 50) conquistasDesbloqueadas++;
    if (historico.length >= 100) conquistasDesbloqueadas++;

    setStats({
      diasConsecutivos,
      totalConquistas,
      conquistasDesbloqueadas,
      pesoPerdido: pesoPerdido.toFixed(1)
    });
  };

  const calcularDiasConsecutivos = (historico) => {
    if (historico.length === 0) return 0;

    let consecutivos = 1;
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const ultimoRegistro = new Date(historico[0].data.split(",")[0].split("/").reverse().join("-"));
    ultimoRegistro.setHours(0, 0, 0, 0);
    
    const diffDias = Math.floor((hoje - ultimoRegistro) / (1000 * 60 * 60 * 24));
    
    if (diffDias > 1) return 0;
    
    for (let i = 1; i < historico.length; i++) {
      const dataAtual = new Date(historico[i - 1].data.split(",")[0].split("/").reverse().join("-"));
      const dataAnterior = new Date(historico[i].data.split(",")[0].split("/").reverse().join("-"));
      
      dataAtual.setHours(0, 0, 0, 0);
      dataAnterior.setHours(0, 0, 0, 0);
      
      const diff = Math.floor((dataAtual - dataAnterior) / (1000 * 60 * 60 * 24));
      
      if (diff === 1) {
        consecutivos++;
      } else {
        break;
      }
    }

    return consecutivos;
  };

  return (
    <div className="bg-gradient-to-br from-purple-500 to-pink-500 text-white p-6 rounded-2xl shadow-lg">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Trophy className="w-6 h-6" />
            Suas Conquistas
          </h3>
          <p className="text-sm opacity-90 mt-1">Continue assim!</p>
        </div>
        <Link 
          to="/conquistas"
          className="bg-white/20 hover:bg-white/30 transition px-3 py-2 rounded-lg flex items-center gap-1 text-sm font-semibold"
        >
          Ver Todas
          <ChevronRight size={16} />
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl text-center">
          <Flame className="w-6 h-6 mx-auto mb-1" />
          <p className="text-2xl font-bold">{stats.diasConsecutivos}</p>
          <p className="text-xs opacity-90">dias seguidos</p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl text-center">
          <Trophy className="w-6 h-6 mx-auto mb-1" />
          <p className="text-2xl font-bold">{stats.conquistasDesbloqueadas}/{stats.totalConquistas}</p>
          <p className="text-xs opacity-90">conquistas</p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl text-center">
          <TrendingDown className="w-6 h-6 mx-auto mb-1" />
          <p className="text-2xl font-bold">{stats.pesoPerdido}</p>
          <p className="text-xs opacity-90">kg perdidos</p>
        </div>
      </div>
    </div>
  );
}
