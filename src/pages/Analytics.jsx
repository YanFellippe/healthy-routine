import { useState, useEffect } from "react";
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend, ComposedChart } from "recharts";
import { TrendingDown, TrendingUp, Activity, Calendar } from "lucide-react";

export default function Analytics() {
  const [historico, setHistorico] = useState([]);
  const [periodo, setPeriodo] = useState("7"); // 7, 14, 30 dias
  const [tendencias, setTendencias] = useState({
    peso: "estável",
    pressao: "estável",
    frequencia: "estável",
    imc: "estável"
  });

  useEffect(() => {
    const historicoSalvo = localStorage.getItem("historicoSaude");
    if (historicoSalvo) {
      const dados = JSON.parse(historicoSalvo);
      setHistorico(dados);
      calcularTendencias(dados);
    }
  }, []);

  const calcularTendencias = (dados) => {
    if (dados.length < 2) return;

    const recentes = dados.slice(0, 5);
    const antigos = dados.slice(5, 10);

    const mediaPesoRecente = recentes.reduce((acc, d) => acc + d.peso, 0) / recentes.length;
    const mediaPesoAntiga = antigos.length > 0 ? antigos.reduce((acc, d) => acc + d.peso, 0) / antigos.length : mediaPesoRecente;

    const mediaFreqRecente = recentes.reduce((acc, d) => acc + d.frequencia, 0) / recentes.length;
    const mediaFreqAntiga = antigos.length > 0 ? antigos.reduce((acc, d) => acc + d.frequencia, 0) / antigos.length : mediaFreqRecente;

    const mediaIMCRecente = recentes.reduce((acc, d) => acc + d.imc, 0) / recentes.length;
    const mediaIMCAntiga = antigos.length > 0 ? antigos.reduce((acc, d) => acc + d.imc, 0) / antigos.length : mediaIMCRecente;

    setTendencias({
      peso: mediaPesoRecente < mediaPesoAntiga - 0.5 ? "diminuindo" : mediaPesoRecente > mediaPesoAntiga + 0.5 ? "aumentando" : "estável",
      frequencia: mediaFreqRecente < mediaFreqAntiga - 3 ? "diminuindo" : mediaFreqRecente > mediaFreqAntiga + 3 ? "aumentando" : "estável",
      imc: mediaIMCRecente < mediaIMCAntiga - 0.3 ? "diminuindo" : mediaIMCRecente > mediaIMCAntiga + 0.3 ? "aumentando" : "estável",
      pressao: "estável"
    });
  };

  const dadosFiltrados = historico.slice(0, parseInt(periodo)).reverse();

  // Dados para gráfico de evolução do IMC
  const dadosIMC = dadosFiltrados.map((item, index) => ({
    dia: index + 1,
    imc: item.imc,
    data: new Date(item.data.split(",")[0].split("/").reverse().join("-")).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })
  }));

  // Dados para gráfico de peso e IMC combinados
  const dadosPesoIMC = dadosFiltrados.map((item, index) => ({
    dia: index + 1,
    peso: item.peso,
    imc: item.imc,
    data: new Date(item.data.split(",")[0].split("/").reverse().join("-")).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })
  }));

  // Dados para gráfico de pressão arterial
  const dadosPressao = dadosFiltrados.map((item, index) => {
    const [sistolica, diastolica] = item.pressao.split("/").map(Number);
    return {
      dia: index + 1,
      sistolica,
      diastolica,
      data: new Date(item.data.split(",")[0].split("/").reverse().join("-")).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })
    };
  });

  // Dados para gráfico de frequência cardíaca com área
  const dadosFrequencia = dadosFiltrados.map((item, index) => ({
    dia: index + 1,
    frequencia: item.frequencia,
    data: new Date(item.data.split(",")[0].split("/").reverse().join("-")).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })
  }));

  // Calcular médias
  const mediaPeso = dadosFiltrados.length > 0 
    ? (dadosFiltrados.reduce((acc, d) => acc + d.peso, 0) / dadosFiltrados.length).toFixed(1)
    : 0;
  
  const mediaIMC = dadosFiltrados.length > 0
    ? (dadosFiltrados.reduce((acc, d) => acc + d.imc, 0) / dadosFiltrados.length).toFixed(1)
    : 0;

  const mediaFrequencia = dadosFiltrados.length > 0
    ? Math.round(dadosFiltrados.reduce((acc, d) => acc + d.frequencia, 0) / dadosFiltrados.length)
    : 0;

  const getTendenciaIcon = (tendencia) => {
    if (tendencia === "diminuindo") return <TrendingDown className="text-green-600" size={20} />;
    if (tendencia === "aumentando") return <TrendingUp className="text-red-600" size={20} />;
    return <Activity className="text-gray-600" size={20} />;
  };

  const getTendenciaTexto = (tendencia) => {
    if (tendencia === "diminuindo") return { texto: "Em queda", cor: "text-green-600" };
    if (tendencia === "aumentando") return { texto: "Em alta", cor: "text-red-600" };
    return { texto: "Estável", cor: "text-gray-600" };
  };

  if (historico.length === 0) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-md text-center">
        <p className="text-gray-500 text-lg">Nenhum dado disponível para análise.</p>
        <p className="text-gray-400 mt-2">Comece a registrar seus dados de saúde no painel principal.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-700">Análises Avançadas</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setPeriodo("7")}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              periodo === "7" ? "bg-green-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            7 dias
          </button>
          <button
            onClick={() => setPeriodo("14")}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              periodo === "14" ? "bg-green-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            14 dias
          </button>
          <button
            onClick={() => setPeriodo("30")}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              periodo === "30" ? "bg-green-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            30 dias
          </button>
        </div>
      </div>

      {/* Cards de Tendências */}
      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-2xl shadow-md">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-sm font-semibold text-gray-600">Peso Médio</h3>
            {getTendenciaIcon(tendencias.peso)}
          </div>
          <p className="text-2xl font-bold text-gray-800">{mediaPeso} kg</p>
          <p className={`text-sm font-semibold ${getTendenciaTexto(tendencias.peso).cor}`}>
            {getTendenciaTexto(tendencias.peso).texto}
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-md">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-sm font-semibold text-gray-600">IMC Médio</h3>
            {getTendenciaIcon(tendencias.imc)}
          </div>
          <p className="text-2xl font-bold text-gray-800">{mediaIMC}</p>
          <p className={`text-sm font-semibold ${getTendenciaTexto(tendencias.imc).cor}`}>
            {getTendenciaTexto(tendencias.imc).texto}
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-md">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-sm font-semibold text-gray-600">Frequência Média</h3>
            {getTendenciaIcon(tendencias.frequencia)}
          </div>
          <p className="text-2xl font-bold text-gray-800">{mediaFrequencia} bpm</p>
          <p className={`text-sm font-semibold ${getTendenciaTexto(tendencias.frequencia).cor}`}>
            {getTendenciaTexto(tendencias.frequencia).texto}
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-md">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-sm font-semibold text-gray-600">Período</h3>
            <Calendar className="text-blue-600" size={20} />
          </div>
          <p className="text-2xl font-bold text-gray-800">{dadosFiltrados.length}</p>
          <p className="text-sm font-semibold text-gray-600">registros</p>
        </div>
      </div>

      {/* Gráfico de Evolução do IMC */}
      <div className="bg-white p-6 rounded-2xl shadow-md mb-6">
        <h3 className="text-lg font-bold text-gray-700 mb-4">Evolução do IMC</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={dadosIMC}>
            <defs>
              <linearGradient id="colorIMC" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="data" />
            <YAxis domain={['dataMin - 1', 'dataMax + 1']} />
            <Tooltip />
            <Area type="monotone" dataKey="imc" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorIMC)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Gráfico Combinado: Peso e IMC */}
      <div className="bg-white p-6 rounded-2xl shadow-md mb-6">
        <h3 className="text-lg font-bold text-gray-700 mb-4">Peso vs IMC</h3>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={dadosPesoIMC}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="data" />
            <YAxis yAxisId="left" orientation="left" stroke="#16a34a" />
            <YAxis yAxisId="right" orientation="right" stroke="#8b5cf6" />
            <Tooltip />
            <Legend />
            <Bar yAxisId="left" dataKey="peso" fill="#16a34a" name="Peso (kg)" />
            <Line yAxisId="right" type="monotone" dataKey="imc" stroke="#8b5cf6" strokeWidth={3} name="IMC" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Gráfico de Pressão Arterial */}
      <div className="bg-white p-6 rounded-2xl shadow-md mb-6">
        <h3 className="text-lg font-bold text-gray-700 mb-4">💓 Pressão Arterial (Sistólica vs Diastólica)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={dadosPressao}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="data" />
            <YAxis domain={[60, 160]} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="sistolica" stroke="#ef4444" strokeWidth={2} name="Sistólica" />
            <Line type="monotone" dataKey="diastolica" stroke="#3b82f6" strokeWidth={2} name="Diastólica" />
          </LineChart>
        </ResponsiveContainer>
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div className="bg-red-50 p-3 rounded-lg">
            <p className="font-semibold text-red-700">Sistólica Média</p>
            <p className="text-2xl font-bold text-red-800">
              {dadosPressao.length > 0 
                ? Math.round(dadosPressao.reduce((acc, d) => acc + d.sistolica, 0) / dadosPressao.length)
                : 0} mmHg
            </p>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="font-semibold text-blue-700">Diastólica Média</p>
            <p className="text-2xl font-bold text-blue-800">
              {dadosPressao.length > 0
                ? Math.round(dadosPressao.reduce((acc, d) => acc + d.diastolica, 0) / dadosPressao.length)
                : 0} mmHg
            </p>
          </div>
        </div>
      </div>

      {/* Gráfico de Frequência Cardíaca */}
      <div className="bg-white p-6 rounded-2xl shadow-md mb-6">
        <h3 className="text-lg font-bold text-gray-700 mb-4">Frequência Cardíaca</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={dadosFrequencia}>
            <defs>
              <linearGradient id="colorFreq" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="data" />
            <YAxis domain={['dataMin - 5', 'dataMax + 5']} />
            <Tooltip />
            <Area type="monotone" dataKey="frequencia" stroke="#ef4444" fillOpacity={1} fill="url(#colorFreq)" name="BPM" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Comparação de Períodos */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-2xl shadow-md">
        <h3 className="text-lg font-bold text-gray-700 mb-4">📈 Resumo do Período</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-600 mb-1">Variação de Peso</p>
            <p className="text-2xl font-bold text-gray-800">
              {dadosFiltrados.length > 1
                ? (dadosFiltrados[dadosFiltrados.length - 1].peso - dadosFiltrados[0].peso).toFixed(1)
                : "0.0"} kg
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {dadosFiltrados.length > 1 && dadosFiltrados[dadosFiltrados.length - 1].peso < dadosFiltrados[0].peso
                ? "✅ Perdeu peso"
                : dadosFiltrados.length > 1 && dadosFiltrados[dadosFiltrados.length - 1].peso > dadosFiltrados[0].peso
                ? "⚠️ Ganhou peso"
                : "➖ Manteve o peso"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Variação de IMC</p>
            <p className="text-2xl font-bold text-gray-800">
              {dadosFiltrados.length > 1
                ? (dadosFiltrados[dadosFiltrados.length - 1].imc - dadosFiltrados[0].imc).toFixed(1)
                : "0.0"}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {dadosFiltrados.length > 1 && dadosFiltrados[dadosFiltrados.length - 1].imc < dadosFiltrados[0].imc
                ? "✅ IMC melhorou"
                : dadosFiltrados.length > 1 && dadosFiltrados[dadosFiltrados.length - 1].imc > dadosFiltrados[0].imc
                ? "⚠️ IMC aumentou"
                : "➖ IMC estável"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Consistência</p>
            <p className="text-2xl font-bold text-gray-800">{dadosFiltrados.length}</p>
            <p className="text-xs text-gray-500 mt-1">
              {dadosFiltrados.length >= parseInt(periodo) * 0.8
                ? "✅ Excelente"
                : dadosFiltrados.length >= parseInt(periodo) * 0.5
                ? "👍 Bom"
                : "⚠️ Pode melhorar"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
