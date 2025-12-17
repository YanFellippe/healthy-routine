import { useState, useEffect } from "react";
import { GitCompare, TrendingUp, TrendingDown, Minus, Calendar } from "lucide-react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from "recharts";

export default function Comparison() {
  const [historico, setHistorico] = useState([]);
  const [periodo1, setPeriodo1] = useState("semana-atual");
  const [periodo2, setPeriodo2] = useState("semana-anterior");
  const [comparacao, setComparacao] = useState(null);

  useEffect(() => {
    const historicoSalvo = localStorage.getItem("historicoSaude");
    if (historicoSalvo) {
      setHistorico(JSON.parse(historicoSalvo));
    }
  }, []);

  useEffect(() => {
    if (historico.length > 0) {
      calcularComparacao();
    }
  }, [historico, periodo1, periodo2]);

  const getDadosPeriodo = (periodo) => {
    const hoje = new Date();
    let dataInicio, dataFim;

    switch (periodo) {
      case "semana-atual":
        dataInicio = new Date(hoje);
        dataInicio.setDate(hoje.getDate() - 7);
        dataFim = hoje;
        break;
      case "semana-anterior":
        dataInicio = new Date(hoje);
        dataInicio.setDate(hoje.getDate() - 14);
        dataFim = new Date(hoje);
        dataFim.setDate(hoje.getDate() - 7);
        break;
      case "mes-atual":
        dataInicio = new Date(hoje);
        dataInicio.setDate(hoje.getDate() - 30);
        dataFim = hoje;
        break;
      case "mes-anterior":
        dataInicio = new Date(hoje);
        dataInicio.setDate(hoje.getDate() - 60);
        dataFim = new Date(hoje);
        dataFim.setDate(hoje.getDate() - 30);
        break;
      case "ultimos-7":
        dataInicio = new Date(hoje);
        dataInicio.setDate(hoje.getDate() - 7);
        dataFim = hoje;
        break;
      case "ultimos-14":
        dataInicio = new Date(hoje);
        dataInicio.setDate(hoje.getDate() - 14);
        dataFim = hoje;
        break;
      case "ultimos-30":
        dataInicio = new Date(hoje);
        dataInicio.setDate(hoje.getDate() - 30);
        dataFim = hoje;
        break;
      default:
        return [];
    }

    return historico.filter(item => {
      const dataItem = new Date(item.data.split(",")[0].split("/").reverse().join("-"));
      return dataItem >= dataInicio && dataItem <= dataFim;
    });
  };

  const calcularEstatisticas = (dados) => {
    if (dados.length === 0) {
      return {
        pesoMedio: 0,
        pesoMin: 0,
        pesoMax: 0,
        imcMedio: 0,
        frequenciaMedia: 0,
        registros: 0,
        variacao: 0
      };
    }

    const pesoMedio = dados.reduce((acc, d) => acc + d.peso, 0) / dados.length;
    const pesoMin = Math.min(...dados.map(d => d.peso));
    const pesoMax = Math.max(...dados.map(d => d.peso));
    const imcMedio = dados.reduce((acc, d) => acc + d.imc, 0) / dados.length;
    const frequenciaMedia = dados.reduce((acc, d) => acc + d.frequencia, 0) / dados.length;
    const variacao = dados.length > 1 ? dados[0].peso - dados[dados.length - 1].peso : 0;

    return {
      pesoMedio: pesoMedio.toFixed(1),
      pesoMin: pesoMin.toFixed(1),
      pesoMax: pesoMax.toFixed(1),
      imcMedio: imcMedio.toFixed(1),
      frequenciaMedia: Math.round(frequenciaMedia),
      registros: dados.length,
      variacao: variacao.toFixed(1)
    };
  };

  const calcularComparacao = () => {
    const dados1 = getDadosPeriodo(periodo1);
    const dados2 = getDadosPeriodo(periodo2);

    const stats1 = calcularEstatisticas(dados1);
    const stats2 = calcularEstatisticas(dados2);

    const diferencas = {
      peso: (parseFloat(stats1.pesoMedio) - parseFloat(stats2.pesoMedio)).toFixed(1),
      imc: (parseFloat(stats1.imcMedio) - parseFloat(stats2.imcMedio)).toFixed(1),
      frequencia: stats1.frequenciaMedia - stats2.frequenciaMedia,
      registros: stats1.registros - stats2.registros
    };

    setComparacao({
      periodo1: { nome: getNomePeriodo(periodo1), stats: stats1, dados: dados1 },
      periodo2: { nome: getNomePeriodo(periodo2), stats: stats2, dados: dados2 },
      diferencas
    });
  };

  const getNomePeriodo = (periodo) => {
    const nomes = {
      "semana-atual": "Última Semana",
      "semana-anterior": "Semana Anterior",
      "mes-atual": "Último Mês",
      "mes-anterior": "Mês Anterior",
      "ultimos-7": "Últimos 7 Dias",
      "ultimos-14": "Últimos 14 Dias",
      "ultimos-30": "Últimos 30 Dias"
    };
    return nomes[periodo] || periodo;
  };

  const getIndicador = (valor) => {
    const num = parseFloat(valor);
    if (num > 0) return { icon: <TrendingUp className="text-red-600" />, cor: "text-red-600", texto: "Aumentou" };
    if (num < 0) return { icon: <TrendingDown className="text-green-600" />, cor: "text-green-600", texto: "Diminuiu" };
    return { icon: <Minus className="text-gray-600" />, cor: "text-gray-600", texto: "Manteve" };
  };

  const dadosGraficoComparativo = () => {
    if (!comparacao) return [];

    const maxLength = Math.max(comparacao.periodo1.dados.length, comparacao.periodo2.dados.length);
    const dados = [];

    for (let i = 0; i < maxLength; i++) {
      dados.push({
        dia: i + 1,
        [comparacao.periodo1.nome]: comparacao.periodo1.dados[i]?.peso || null,
        [comparacao.periodo2.nome]: comparacao.periodo2.dados[i]?.peso || null
      });
    }

    return dados.reverse();
  };

  const dadosGraficoIMC = () => {
    if (!comparacao) return [];

    const maxLength = Math.max(comparacao.periodo1.dados.length, comparacao.periodo2.dados.length);
    const dados = [];

    for (let i = 0; i < maxLength; i++) {
      dados.push({
        dia: i + 1,
        [comparacao.periodo1.nome]: comparacao.periodo1.dados[i]?.imc || null,
        [comparacao.periodo2.nome]: comparacao.periodo2.dados[i]?.imc || null
      });
    }

    return dados.reverse();
  };

  if (historico.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-md text-center">
        <p className="text-gray-500 dark:text-gray-400 text-lg">Não há dados suficientes para comparação.</p>
        <p className="text-gray-400 dark:text-gray-500 mt-2">Registre seus dados de saúde para começar a comparar períodos.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-gray-700 dark:text-gray-200 flex items-center gap-2">
        <GitCompare className="text-indigo-600" />
        Comparação de Períodos
      </h2>

      {/* Seleção de Períodos */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md mb-6">
        <h3 className="text-lg font-bold text-gray-700 dark:text-gray-200 mb-4 flex items-center gap-2">
          <Calendar className="text-indigo-600" />
          Selecione os Períodos para Comparar
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Período 1</label>
            <select
              value={periodo1}
              onChange={(e) => setPeriodo1(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100 font-semibold"
            >
              <option value="semana-atual">Última Semana</option>
              <option value="semana-anterior">Semana Anterior</option>
              <option value="mes-atual">Último Mês</option>
              <option value="mes-anterior">Mês Anterior</option>
              <option value="ultimos-7">Últimos 7 Dias</option>
              <option value="ultimos-14">Últimos 14 Dias</option>
              <option value="ultimos-30">Últimos 30 Dias</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Período 2</label>
            <select
              value={periodo2}
              onChange={(e) => setPeriodo2(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100 font-semibold"
            >
              <option value="semana-atual">Última Semana</option>
              <option value="semana-anterior">Semana Anterior</option>
              <option value="mes-atual">Último Mês</option>
              <option value="mes-anterior">Mês Anterior</option>
              <option value="ultimos-7">Últimos 7 Dias</option>
              <option value="ultimos-14">Últimos 14 Dias</option>
              <option value="ultimos-30">Últimos 30 Dias</option>
            </select>
          </div>
        </div>
      </div>

      {comparacao && (
        <>
          {/* Cards de Comparação */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Período 1 */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-2xl shadow-lg">
              <h3 className="text-xl font-bold mb-4">{comparacao.periodo1.nome}</h3>
              <div className="space-y-3">
                <div className="bg-white/10 backdrop-blur-sm p-3 rounded-lg">
                  <p className="text-sm opacity-90">Peso Médio</p>
                  <p className="text-2xl font-bold">{comparacao.periodo1.stats.pesoMedio} kg</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-3 rounded-lg">
                  <p className="text-sm opacity-90">IMC Médio</p>
                  <p className="text-2xl font-bold">{comparacao.periodo1.stats.imcMedio}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-3 rounded-lg">
                  <p className="text-sm opacity-90">Frequência Média</p>
                  <p className="text-2xl font-bold">{comparacao.periodo1.stats.frequenciaMedia} bpm</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-3 rounded-lg">
                  <p className="text-sm opacity-90">Registros</p>
                  <p className="text-2xl font-bold">{comparacao.periodo1.stats.registros}</p>
                </div>
              </div>
            </div>

            {/* Período 2 */}
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-2xl shadow-lg">
              <h3 className="text-xl font-bold mb-4">{comparacao.periodo2.nome}</h3>
              <div className="space-y-3">
                <div className="bg-white/10 backdrop-blur-sm p-3 rounded-lg">
                  <p className="text-sm opacity-90">Peso Médio</p>
                  <p className="text-2xl font-bold">{comparacao.periodo2.stats.pesoMedio} kg</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-3 rounded-lg">
                  <p className="text-sm opacity-90">IMC Médio</p>
                  <p className="text-2xl font-bold">{comparacao.periodo2.stats.imcMedio}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-3 rounded-lg">
                  <p className="text-sm opacity-90">Frequência Média</p>
                  <p className="text-2xl font-bold">{comparacao.periodo2.stats.frequenciaMedia} bpm</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-3 rounded-lg">
                  <p className="text-sm opacity-90">Registros</p>
                  <p className="text-2xl font-bold">{comparacao.periodo2.stats.registros}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Diferenças */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md mb-6">
            <h3 className="text-lg font-bold text-gray-700 dark:text-gray-200 mb-4">Análise Comparativa</h3>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/20 p-4 rounded-xl border-2 border-orange-200 dark:border-orange-700">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Peso</p>
                  {getIndicador(comparacao.diferencas.peso).icon}
                </div>
                <p className={`text-2xl font-bold ${getIndicador(comparacao.diferencas.peso).cor}`}>
                  {comparacao.diferencas.peso > 0 ? "+" : ""}{comparacao.diferencas.peso} kg
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {getIndicador(comparacao.diferencas.peso).texto}
                </p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/20 p-4 rounded-xl border-2 border-blue-200 dark:border-blue-700">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">IMC</p>
                  {getIndicador(comparacao.diferencas.imc).icon}
                </div>
                <p className={`text-2xl font-bold ${getIndicador(comparacao.diferencas.imc).cor}`}>
                  {comparacao.diferencas.imc > 0 ? "+" : ""}{comparacao.diferencas.imc}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {getIndicador(comparacao.diferencas.imc).texto}
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/20 p-4 rounded-xl border-2 border-purple-200 dark:border-purple-700">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Frequência</p>
                  {getIndicador(comparacao.diferencas.frequencia).icon}
                </div>
                <p className={`text-2xl font-bold ${getIndicador(comparacao.diferencas.frequencia).cor}`}>
                  {comparacao.diferencas.frequencia > 0 ? "+" : ""}{comparacao.diferencas.frequencia} bpm
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {getIndicador(comparacao.diferencas.frequencia).texto}
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/20 p-4 rounded-xl border-2 border-green-200 dark:border-green-700">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Consistência</p>
                  {getIndicador(comparacao.diferencas.registros).icon}
                </div>
                <p className={`text-2xl font-bold ${getIndicador(comparacao.diferencas.registros).cor}`}>
                  {comparacao.diferencas.registros > 0 ? "+" : ""}{comparacao.diferencas.registros}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  registros
                </p>
              </div>
            </div>
          </div>

          {/* Gráfico Comparativo de Peso */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md mb-6">
            <h3 className="text-lg font-bold text-gray-700 dark:text-gray-200 mb-4">Comparação de Peso</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dadosGraficoComparativo()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="dia" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey={comparacao.periodo1.nome} stroke="#3b82f6" strokeWidth={3} />
                <Line type="monotone" dataKey={comparacao.periodo2.nome} stroke="#a855f7" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Gráfico Comparativo de IMC */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md mb-6">
            <h3 className="text-lg font-bold text-gray-700 dark:text-gray-200 mb-4">Comparação de IMC</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dadosGraficoIMC()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="dia" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey={comparacao.periodo1.nome} fill="#3b82f6" />
                <Bar dataKey={comparacao.periodo2.nome} fill="#a855f7" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Conclusão */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 p-6 rounded-2xl shadow-md border-2 border-indigo-200 dark:border-indigo-700">
            <h3 className="text-lg font-bold text-gray-700 dark:text-gray-200 mb-3">💡 Conclusão</h3>
            <div className="space-y-2 text-gray-700 dark:text-gray-300">
              {parseFloat(comparacao.diferencas.peso) < 0 && (
                <p className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Você perdeu {Math.abs(comparacao.diferencas.peso)} kg entre os períodos! Continue assim!</span>
                </p>
              )}
              {parseFloat(comparacao.diferencas.peso) > 0 && (
                <p className="flex items-start gap-2">
                  <span className="text-orange-600 font-bold">⚠</span>
                  <span>Você ganhou {comparacao.diferencas.peso} kg. Revise sua dieta e exercícios.</span>
                </p>
              )}
              {parseFloat(comparacao.diferencas.imc) < 0 && (
                <p className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Seu IMC melhorou em {Math.abs(comparacao.diferencas.imc)} pontos!</span>
                </p>
              )}
              {comparacao.diferencas.registros > 0 && (
                <p className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span>Você está mais consistente! {comparacao.diferencas.registros} registros a mais.</span>
                </p>
              )}
              {comparacao.diferencas.registros < 0 && (
                <p className="flex items-start gap-2">
                  <span className="text-orange-600 font-bold">⚠</span>
                  <span>Tente ser mais consistente nos registros para melhor acompanhamento.</span>
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
