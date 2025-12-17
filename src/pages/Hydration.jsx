import { useState, useEffect } from "react";
import { Droplets, Calendar, TrendingUp, Award, Flame } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Line, LineChart } from "recharts";

export default function Hydration() {
  const [historico, setHistorico] = useState([]);
  const [coposHoje, setCoposHoje] = useState(0);
  const [metaDiaria, setMetaDiaria] = useState(8);
  const [estatisticas, setEstatisticas] = useState({
    mediaCopos: 0,
    diasComMeta: 0,
    sequenciaAtual: 0,
    melhorSequencia: 0,
    totalCopos: 0
  });

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = () => {
    const historicoSalvo = localStorage.getItem("historicoHidratacao");
    const hidratacaoHoje = localStorage.getItem("hidratacao");
    const metaSalva = localStorage.getItem("metaHidratacao");

    if (historicoSalvo) {
      const dados = JSON.parse(historicoSalvo);
      setHistorico(dados);
      calcularEstatisticas(dados);
    }

    if (hidratacaoHoje) {
      setCoposHoje(JSON.parse(hidratacaoHoje).copos);
    }

    if (metaSalva) {
      setMetaDiaria(parseInt(metaSalva));
    }
  };

  const calcularEstatisticas = (dados) => {
    if (dados.length === 0) return;

    const totalCopos = dados.reduce((acc, d) => acc + d.copos, 0);
    const mediaCopos = (totalCopos / dados.length).toFixed(1);
    const diasComMeta = dados.filter(d => d.atingiuMeta).length;

    // Calcular sequência atual
    let sequenciaAtual = 0;
    for (let i = 0; i < dados.length; i++) {
      if (dados[i].atingiuMeta) {
        sequenciaAtual++;
      } else {
        break;
      }
    }

    // Calcular melhor sequência
    let melhorSequencia = 0;
    let sequenciaTemp = 0;
    dados.forEach(d => {
      if (d.atingiuMeta) {
        sequenciaTemp++;
        melhorSequencia = Math.max(melhorSequencia, sequenciaTemp);
      } else {
        sequenciaTemp = 0;
      }
    });

    setEstatisticas({
      mediaCopos,
      diasComMeta,
      sequenciaAtual,
      melhorSequencia,
      totalCopos
    });
  };

  const dadosGrafico = historico.slice(0, 14).reverse().map((item, index) => ({
    dia: new Date(item.data).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
    copos: item.copos,
    meta: item.meta
  }));

  const dadosLitros = historico.slice(0, 14).reverse().map((item, index) => ({
    dia: new Date(item.data).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
    litros: (item.copos * 0.25).toFixed(2)
  }));

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-gray-700 flex items-center gap-2">
        <Droplets className="text-blue-600" />
        Histórico de Hidratação
      </h2>

      {/* Estatísticas */}
      <div className="grid md:grid-cols-5 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-4 rounded-2xl shadow-md">
          <div className="flex items-center gap-3 mb-2">
            <Droplets className="w-6 h-6" />
            <h3 className="font-semibold">Hoje</h3>
          </div>
          <p className="text-3xl font-bold">{coposHoje}</p>
          <p className="text-sm opacity-90">copos ({(coposHoje * 0.25).toFixed(2)}L)</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-4 rounded-2xl shadow-md">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="w-6 h-6" />
            <h3 className="font-semibold">Média Diária</h3>
          </div>
          <p className="text-3xl font-bold">{estatisticas.mediaCopos}</p>
          <p className="text-sm opacity-90">copos por dia</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-4 rounded-2xl shadow-md">
          <div className="flex items-center gap-3 mb-2">
            <Award className="w-6 h-6" />
            <h3 className="font-semibold">Dias com Meta</h3>
          </div>
          <p className="text-3xl font-bold">{estatisticas.diasComMeta}</p>
          <p className="text-sm opacity-90">de {historico.length} dias</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-4 rounded-2xl shadow-md">
          <div className="flex items-center gap-3 mb-2">
            <Flame className="w-6 h-6" />
            <h3 className="font-semibold">Sequência Atual</h3>
          </div>
          <p className="text-3xl font-bold">{estatisticas.sequenciaAtual}</p>
          <p className="text-sm opacity-90">dias seguidos</p>
        </div>

        <div className="bg-gradient-to-br from-pink-500 to-pink-600 text-white p-4 rounded-2xl shadow-md">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-6 h-6" />
            <h3 className="font-semibold">Melhor Sequência</h3>
          </div>
          <p className="text-3xl font-bold">{estatisticas.melhorSequencia}</p>
          <p className="text-sm opacity-90">dias seguidos</p>
        </div>
      </div>

      {/* Gráfico de Copos vs Meta */}
      {historico.length > 0 && (
        <>
          <div className="bg-white p-6 rounded-2xl shadow-md mb-6">
            <h3 className="text-lg font-bold text-gray-700 mb-4">Copos de Água (Últimos 14 dias)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dadosGrafico}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="dia" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="copos" fill="#3b82f6" name="Copos bebidos" />
                <Bar dataKey="meta" fill="#10b981" name="Meta" opacity={0.3} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md mb-6">
            <h3 className="text-lg font-bold text-gray-700 mb-4">Litros Consumidos</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dadosLitros}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="dia" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="litros" stroke="#06b6d4" strokeWidth={3} name="Litros" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}

      {/* Histórico Detalhado */}
      <div className="bg-white p-6 rounded-2xl shadow-md">
        <h3 className="text-lg font-bold text-gray-700 mb-4">📅 Histórico Completo</h3>
        {historico.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>Nenhum histórico disponível ainda.</p>
            <p className="text-sm mt-2">Comece a registrar sua hidratação no painel principal!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {historico.map((dia, index) => (
              <div 
                key={index} 
                className={`flex justify-between items-center p-4 rounded-xl ${
                  dia.atingiuMeta ? "bg-green-50 border-2 border-green-200" : "bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    dia.atingiuMeta ? "bg-green-500" : "bg-gray-400"
                  } text-white font-bold`}>
                    {dia.atingiuMeta ? "✓" : "✗"}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">
                      {new Date(dia.data).toLocaleDateString("pt-BR", { 
                        weekday: "long", 
                        year: "numeric", 
                        month: "long", 
                        day: "numeric" 
                      })}
                    </p>
                    <p className="text-sm text-gray-600">
                      {dia.copos} de {dia.meta} copos • {(dia.copos * 0.25).toFixed(2)}L
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-800">
                    {Math.round((dia.copos / dia.meta) * 100)}%
                  </div>
                  <p className={`text-sm font-semibold ${
                    dia.atingiuMeta ? "text-green-600" : "text-gray-500"
                  }`}>
                    {dia.atingiuMeta ? "Meta atingida!" : "Abaixo da meta"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Dicas de Hidratação */}
      <div className="mt-6 bg-gradient-to-br from-cyan-50 to-blue-50 p-6 rounded-2xl shadow-md">
        <h3 className="text-lg font-bold text-gray-700 mb-3">💡 Dicas para se Manter Hidratado</h3>
        <ul className="space-y-2 text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span>Beba um copo de água ao acordar para ativar o metabolismo</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span>Mantenha uma garrafa de água sempre por perto</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span>Beba água antes, durante e depois dos exercícios</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span>Configure lembretes no celular para beber água regularmente</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span>Aumente a ingestão em dias quentes ou durante atividades físicas intensas</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
