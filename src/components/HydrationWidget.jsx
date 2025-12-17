import { useState, useEffect } from "react";
import { Droplets, Plus, Minus, RotateCcw } from "lucide-react";

export default function HydrationWidget() {
  const [coposHoje, setCoposHoje] = useState(0);
  const [metaDiaria, setMetaDiaria] = useState(8);
  const [editandoMeta, setEditandoMeta] = useState(false);
  const [novaMeta, setNovaMeta] = useState(8);
  const [historico, setHistorico] = useState([]);

  useEffect(() => {
    carregarDados();
    verificarNovoDia();
  }, []);

  const carregarDados = () => {
    const hidratacaoSalva = localStorage.getItem("hidratacao");
    const metaSalva = localStorage.getItem("metaHidratacao");
    const historicoSalvo = localStorage.getItem("historicoHidratacao");

    if (hidratacaoSalva) {
      const dados = JSON.parse(hidratacaoSalva);
      setCoposHoje(dados.copos);
    }

    if (metaSalva) {
      const meta = parseInt(metaSalva);
      setMetaDiaria(meta);
      setNovaMeta(meta);
    }

    if (historicoSalvo) {
      setHistorico(JSON.parse(historicoSalvo));
    }
  };

  const verificarNovoDia = () => {
    const ultimaData = localStorage.getItem("ultimaDataHidratacao");
    const hoje = new Date().toDateString();

    if (ultimaData !== hoje) {
      // Salvar dados do dia anterior no histórico
      const hidratacaoAnterior = localStorage.getItem("hidratacao");
      if (hidratacaoAnterior) {
        const dados = JSON.parse(hidratacaoAnterior);
        const historicoSalvo = JSON.parse(localStorage.getItem("historicoHidratacao") || "[]");
        
        const novoRegistro = {
          data: ultimaData || hoje,
          copos: dados.copos,
          meta: metaDiaria,
          atingiuMeta: dados.copos >= metaDiaria
        };

        const novoHistorico = [novoRegistro, ...historicoSalvo].slice(0, 30);
        localStorage.setItem("historicoHidratacao", JSON.stringify(novoHistorico));
        setHistorico(novoHistorico);
      }

      // Resetar contador para novo dia
      setCoposHoje(0);
      localStorage.setItem("hidratacao", JSON.stringify({ copos: 0 }));
      localStorage.setItem("ultimaDataHidratacao", hoje);
    }
  };

  const adicionarCopo = () => {
    const novosCopos = coposHoje + 1;
    setCoposHoje(novosCopos);
    salvarDados(novosCopos);
  };

  const removerCopo = () => {
    if (coposHoje > 0) {
      const novosCopos = coposHoje - 1;
      setCoposHoje(novosCopos);
      salvarDados(novosCopos);
    }
  };

  const resetarDia = () => {
    if (window.confirm("Deseja resetar o contador de hoje?")) {
      setCoposHoje(0);
      salvarDados(0);
    }
  };

  const salvarDados = (copos) => {
    localStorage.setItem("hidratacao", JSON.stringify({ copos }));
    localStorage.setItem("ultimaDataHidratacao", new Date().toDateString());
  };

  const salvarMeta = () => {
    setMetaDiaria(novaMeta);
    localStorage.setItem("metaHidratacao", novaMeta.toString());
    setEditandoMeta(false);
  };

  const porcentagem = Math.min((coposHoje / metaDiaria) * 100, 100);
  const litros = (coposHoje * 0.25).toFixed(2);
  const atingiuMeta = coposHoje >= metaDiaria;

  const getCorProgresso = () => {
    if (porcentagem >= 100) return "from-green-500 to-emerald-500";
    if (porcentagem >= 75) return "from-blue-500 to-cyan-500";
    if (porcentagem >= 50) return "from-yellow-500 to-orange-500";
    return "from-red-500 to-pink-500";
  };

  const getMensagem = () => {
    if (atingiuMeta) return "Meta atingida! Parabéns!";
    if (porcentagem >= 75) return "Quase lá! Continue assim!";
    if (porcentagem >= 50) return "Você está no caminho certo!";
    if (porcentagem >= 25) return "Beba mais água!";
    return "Comece a se hidratar!";
  };

  return (
    <div className={`bg-gradient-to-br ${getCorProgresso()} text-white p-6 rounded-2xl shadow-lg`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Droplets className="w-6 h-6" />
            Hidratação Diária
          </h3>
          <p className="text-sm opacity-90 mt-1">{getMensagem()}</p>
        </div>
        <button
          onClick={resetarDia}
          className="bg-white/20 hover:bg-white/30 transition p-2 rounded-lg"
          title="Resetar contador"
        >
          <RotateCcw size={18} />
        </button>
      </div>

      {/* Progresso Visual */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="font-semibold">{coposHoje} de {metaDiaria} copos</span>
          <span className="font-semibold">{litros}L</span>
        </div>
        <div className="w-full bg-white/30 rounded-full h-4 overflow-hidden">
          <div 
            className="bg-white h-full rounded-full transition-all duration-500 flex items-center justify-center"
            style={{ width: `${porcentagem}%` }}
          >
            {porcentagem > 15 && (
              <span className="text-xs font-bold text-blue-600">{Math.round(porcentagem)}%</span>
            )}
          </div>
        </div>
      </div>

      {/* Controles */}
      <div className="flex gap-3 mb-4">
        <button
          onClick={removerCopo}
          disabled={coposHoje === 0}
          className="flex-1 bg-white/20 hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed transition py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
        >
          <Minus size={20} />
          Remover
        </button>
        <button
          onClick={adicionarCopo}
          className="flex-1 bg-white hover:bg-white/90 text-blue-600 transition py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
        >
          <Plus size={20} />
          Adicionar Copo
        </button>
      </div>

      {/* Meta */}
      <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl">
        {editandoMeta ? (
          <div className="flex gap-2">
            <input
              type="number"
              min="1"
              max="20"
              value={novaMeta}
              onChange={(e) => setNovaMeta(parseInt(e.target.value) || 1)}
              className="flex-1 px-3 py-2 rounded-lg text-gray-800 font-semibold"
            />
            <button
              onClick={salvarMeta}
              className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-white/90 transition"
            >
              Salvar
            </button>
            <button
              onClick={() => {
                setEditandoMeta(false);
                setNovaMeta(metaDiaria);
              }}
              className="bg-white/20 text-white px-4 py-2 rounded-lg font-semibold hover:bg-white/30 transition"
            >
              Cancelar
            </button>
          </div>
        ) : (
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs opacity-90">Meta diária</p>
              <p className="font-bold">{metaDiaria} copos ({(metaDiaria * 0.25).toFixed(2)}L)</p>
            </div>
            <button
              onClick={() => setEditandoMeta(true)}
              className="bg-white/20 hover:bg-white/30 transition px-3 py-1 rounded-lg text-sm font-semibold"
            >
              Editar
            </button>
          </div>
        )}
      </div>

      {/* Histórico Resumido */}
      {historico.length > 0 && (
        <div className="mt-4 bg-white/10 backdrop-blur-sm p-3 rounded-xl">
          <p className="text-xs opacity-90 mb-2">Últimos 7 dias</p>
          <div className="flex gap-1">
            {historico.slice(0, 7).reverse().map((dia, index) => (
              <div
                key={index}
                className={`flex-1 h-8 rounded ${
                  dia.atingiuMeta ? "bg-green-400" : "bg-white/30"
                }`}
                title={`${new Date(dia.data).toLocaleDateString("pt-BR")}: ${dia.copos}/${dia.meta} copos`}
              />
            ))}
          </div>
          <p className="text-xs opacity-90 mt-2 text-center">
            {historico.filter(d => d.atingiuMeta).length} de {historico.length} dias com meta atingida
          </p>
        </div>
      )}
    </div>
  );
}
