import { useState, useEffect } from "react";
import { Trophy, Target, Flame, Calendar, TrendingDown, Award, Lock } from "lucide-react";

export default function Achievements() {
  const [conquistas, setConquistas] = useState([]);
  const [estatisticas, setEstatisticas] = useState({
    diasConsecutivos: 0,
    totalRegistros: 0,
    pesoInicial: 0,
    pesoAtual: 0,
    metaPeso: 0,
    diasAteMeta: 0
  });

  useEffect(() => {
    calcularConquistas();
  }, []);

  const calcularConquistas = () => {
    const historico = JSON.parse(localStorage.getItem("historicoSaude") || "[]");
    const perfil = JSON.parse(localStorage.getItem("perfilUsuario") || "{}");
    const dadosSaude = JSON.parse(localStorage.getItem("dadosSaude") || "{}");

    // Calcular dias consecutivos
    const diasConsecutivos = calcularDiasConsecutivos(historico);
    
    // Calcular peso perdido
    const pesoInicial = historico.length > 0 ? historico[historico.length - 1].peso : 0;
    const pesoAtual = dadosSaude.peso || 0;
    const pesoPerdido = pesoInicial - pesoAtual;
    
    // Calcular progresso até a meta
    const metaPeso = perfil.meta || 0;
    const progressoMeta = pesoInicial > 0 && metaPeso > 0 
      ? ((pesoInicial - pesoAtual) / (pesoInicial - metaPeso)) * 100 
      : 0;

    setEstatisticas({
      diasConsecutivos,
      totalRegistros: historico.length,
      pesoInicial,
      pesoAtual,
      metaPeso,
      pesoPerdido,
      progressoMeta: Math.min(progressoMeta, 100)
    });

    // Definir conquistas
    const todasConquistas = [
      {
        id: 1,
        titulo: "Primeiro Passo",
        descricao: "Registre seus dados pela primeira vez",
        icone: <Target className="w-8 h-8" />,
        desbloqueada: historico.length >= 1,
        cor: "bg-blue-500"
      },
      {
        id: 2,
        titulo: "Consistência Iniciante",
        descricao: "Registre dados por 3 dias consecutivos",
        icone: <Calendar className="w-8 h-8" />,
        desbloqueada: diasConsecutivos >= 3,
        cor: "bg-green-500"
      },
      {
        id: 3,
        titulo: "Uma Semana Forte",
        descricao: "Registre dados por 7 dias consecutivos",
        icone: <Flame className="w-8 h-8" />,
        desbloqueada: diasConsecutivos >= 7,
        cor: "bg-orange-500"
      },
      {
        id: 4,
        titulo: "Mestre da Disciplina",
        descricao: "Registre dados por 30 dias consecutivos",
        icone: <Trophy className="w-8 h-8" />,
        desbloqueada: diasConsecutivos >= 30,
        cor: "bg-yellow-500"
      },
      {
        id: 5,
        titulo: "Primeiro Quilo",
        descricao: "Perca 1kg",
        icone: <TrendingDown className="w-8 h-8" />,
        desbloqueada: pesoPerdido >= 1,
        cor: "bg-purple-500"
      },
      {
        id: 6,
        titulo: "Progresso Notável",
        descricao: "Perca 5kg",
        icone: <Award className="w-8 h-8" />,
        desbloqueada: pesoPerdido >= 5,
        cor: "bg-pink-500"
      },
      {
        id: 7,
        titulo: "Transformação",
        descricao: "Perca 10kg",
        icone: <Trophy className="w-8 h-8" />,
        desbloqueada: pesoPerdido >= 10,
        cor: "bg-red-500"
      },
      {
        id: 8,
        titulo: "Meio Caminho",
        descricao: "Atinja 50% da sua meta de peso",
        icone: <Target className="w-8 h-8" />,
        desbloqueada: progressoMeta >= 50,
        cor: "bg-indigo-500"
      },
      {
        id: 9,
        titulo: "Quase Lá!",
        descricao: "Atinja 75% da sua meta de peso",
        icone: <Flame className="w-8 h-8" />,
        desbloqueada: progressoMeta >= 75,
        cor: "bg-teal-500"
      },
      {
        id: 10,
        titulo: "Meta Alcançada!",
        descricao: "Atinja 100% da sua meta de peso",
        icone: <Trophy className="w-8 h-8" />,
        desbloqueada: progressoMeta >= 100,
        cor: "bg-gradient-to-r from-yellow-400 to-orange-500"
      },
      {
        id: 11,
        titulo: "Colecionador de Dados",
        descricao: "Registre dados 50 vezes",
        icone: <Calendar className="w-8 h-8" />,
        desbloqueada: historico.length >= 50,
        cor: "bg-cyan-500"
      },
      {
        id: 12,
        titulo: "Veterano da Saúde",
        descricao: "Registre dados 100 vezes",
        icone: <Award className="w-8 h-8" />,
        desbloqueada: historico.length >= 100,
        cor: "bg-amber-500"
      }
    ];

    setConquistas(todasConquistas);
  };

  const calcularDiasConsecutivos = (historico) => {
    if (historico.length === 0) return 0;

    let consecutivos = 1;
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    // Verificar se o último registro foi hoje ou ontem
    const ultimoRegistro = new Date(historico[0].data.split(",")[0].split("/").reverse().join("-"));
    ultimoRegistro.setHours(0, 0, 0, 0);
    
    const diffDias = Math.floor((hoje - ultimoRegistro) / (1000 * 60 * 60 * 24));
    
    if (diffDias > 1) return 0; // Quebrou a sequência
    
    // Contar dias consecutivos
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

  const conquistasDesbloqueadas = conquistas.filter(c => c.desbloqueada);
  const conquistasBloqueadas = conquistas.filter(c => !c.desbloqueada);
  const porcentagemCompleta = conquistas.length > 0 
    ? Math.round((conquistasDesbloqueadas.length / conquistas.length) * 100) 
    : 0;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-gray-700">Metas e Conquistas</h2>

      {/* Estatísticas Gerais */}
      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-4 rounded-2xl shadow-md">
          <div className="flex items-center gap-3 mb-2">
            <Flame className="w-6 h-6" />
            <h3 className="font-semibold">Sequência Atual</h3>
          </div>
          <p className="text-3xl font-bold">{estatisticas.diasConsecutivos}</p>
          <p className="text-sm opacity-90">dias consecutivos</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-4 rounded-2xl shadow-md">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="w-6 h-6" />
            <h3 className="font-semibold">Total de Registros</h3>
          </div>
          <p className="text-3xl font-bold">{estatisticas.totalRegistros}</p>
          <p className="text-sm opacity-90">registros feitos</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-4 rounded-2xl shadow-md">
          <div className="flex items-center gap-3 mb-2">
            <TrendingDown className="w-6 h-6" />
            <h3 className="font-semibold">Peso Perdido</h3>
          </div>
          <p className="text-3xl font-bold">{estatisticas.pesoPerdido > 0 ? estatisticas.pesoPerdido.toFixed(1) : "0"}</p>
          <p className="text-sm opacity-90">kg perdidos</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-4 rounded-2xl shadow-md">
          <div className="flex items-center gap-3 mb-2">
            <Trophy className="w-6 h-6" />
            <h3 className="font-semibold">Conquistas</h3>
          </div>
          <p className="text-3xl font-bold">{conquistasDesbloqueadas.length}/{conquistas.length}</p>
          <p className="text-sm opacity-90">{porcentagemCompleta}% completo</p>
        </div>
      </div>

      {/* Progresso até a Meta */}
      {estatisticas.metaPeso > 0 && (
        <div className="bg-white p-6 rounded-2xl shadow-md mb-6">
          <h3 className="text-xl font-bold mb-4 text-gray-700 flex items-center gap-2">
            <Target className="text-green-600" />
            Progresso até a Meta
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Peso Inicial: {estatisticas.pesoInicial.toFixed(1)} kg</span>
              <span>Meta: {estatisticas.metaPeso} kg</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-green-500 to-green-600 h-full rounded-full transition-all duration-500 flex items-center justify-center text-white text-xs font-bold"
                style={{ width: `${estatisticas.progressoMeta}%` }}
              >
                {estatisticas.progressoMeta > 10 && `${estatisticas.progressoMeta.toFixed(0)}%`}
              </div>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Peso Atual: <strong>{estatisticas.pesoAtual} kg</strong></span>
              <span className="text-green-600 font-semibold">
                Faltam {Math.max(0, estatisticas.pesoAtual - estatisticas.metaPeso).toFixed(1)} kg
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Conquistas Desbloqueadas */}
      <div className="mb-6">
        <h3 className="text-xl font-bold mb-3 text-gray-700">🏆 Conquistas Desbloqueadas</h3>
        {conquistasDesbloqueadas.length === 0 ? (
          <div className="bg-gray-100 p-6 rounded-2xl text-center text-gray-500">
            Comece a registrar seus dados para desbloquear conquistas!
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {conquistasDesbloqueadas.map((conquista) => (
              <div 
                key={conquista.id} 
                className={`${conquista.cor} text-white p-4 rounded-2xl shadow-lg transform hover:scale-105 transition-transform`}
              >
                <div className="flex items-center gap-3 mb-2">
                  {conquista.icone}
                  <h4 className="font-bold text-lg">{conquista.titulo}</h4>
                </div>
                <p className="text-sm opacity-90">{conquista.descricao}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Conquistas Bloqueadas */}
      {conquistasBloqueadas.length > 0 && (
        <div>
          <h3 className="text-xl font-bold mb-3 text-gray-700">🔒 Conquistas Bloqueadas</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {conquistasBloqueadas.map((conquista) => (
              <div 
                key={conquista.id} 
                className="bg-gray-300 text-gray-600 p-4 rounded-2xl shadow-md opacity-60"
              >
                <div className="flex items-center gap-3 mb-2">
                  <Lock className="w-8 h-8" />
                  <h4 className="font-bold text-lg">{conquista.titulo}</h4>
                </div>
                <p className="text-sm">{conquista.descricao}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
