import { useState, useEffect } from "react";
import HealthCard from "../components/HealthCard";
import ChartCard from "../components/ChartCard";
import IMCCard from "../components/IMCCard";
import AchievementWidget from "../components/AchievementWidget";
import HydrationWidget from "../components/HydrationWidget";
import { HeartPulse, Weight, Dumbbell, Apple, Activity } from "lucide-react";

export default function Dashboard() {
  const [peso, setPeso] = useState("");
  const [pressaoSistolica, setPressaoSistolica] = useState("");
  const [pressaoDiastolica, setPressaoDiastolica] = useState("");
  const [frequencia, setFrequencia] = useState("");
  const [altura, setAltura] = useState("");
  
  const [dadosAtuais, setDadosAtuais] = useState({
    peso: 0,
    pressao: "0/0",
    frequencia: 0,
    imc: 0,
    altura: 1.70
  });

  const [historico, setHistorico] = useState([]);

  useEffect(() => {
    const dadosSalvos = localStorage.getItem("dadosSaude");
    const historicoSalvo = localStorage.getItem("historicoSaude");
    const alturaSalva = localStorage.getItem("altura");
    
    if (dadosSalvos) {
      setDadosAtuais(JSON.parse(dadosSalvos));
    }
    if (historicoSalvo) {
      setHistorico(JSON.parse(historicoSalvo));
    }
    if (alturaSalva) {
      setAltura(alturaSalva);
      setDadosAtuais(prev => ({ ...prev, altura: parseFloat(alturaSalva) }));
    }
  }, []);

  const calcularIMC = (pesoKg, alturaM) => {
    if (!pesoKg || !alturaM || alturaM === 0) return 0;
    return (pesoKg / (alturaM * alturaM)).toFixed(1);
  };

  const getClassificacaoIMC = (imc) => {
    if (imc < 18.5) return { texto: "Abaixo do peso", cor: "text-yellow-600" };
    if (imc < 25) return { texto: "Peso normal", cor: "text-green-600" };
    if (imc < 30) return { texto: "Sobrepeso", cor: "text-orange-600" };
    return { texto: "Obesidade", cor: "text-red-600" };
  };

  const salvarDados = (e) => {
    e.preventDefault();
    
    const pesoNum = parseFloat(peso);
    const alturaNum = parseFloat(altura) || dadosAtuais.altura;
    const pressaoCompleta = `${pressaoSistolica}/${pressaoDiastolica}`;
    const frequenciaNum = parseInt(frequencia);
    const imcCalculado = calcularIMC(pesoNum, alturaNum);

    const novosDados = {
      peso: pesoNum,
      pressao: pressaoCompleta,
      frequencia: frequenciaNum,
      imc: parseFloat(imcCalculado),
      altura: alturaNum
    };

    const novoRegistro = {
      data: new Date().toLocaleString("pt-BR"),
      ...novosDados
    };

    const novoHistorico = [novoRegistro, ...historico].slice(0, 30);

    setDadosAtuais(novosDados);
    setHistorico(novoHistorico);
    
    localStorage.setItem("dadosSaude", JSON.stringify(novosDados));
    localStorage.setItem("historicoSaude", JSON.stringify(novoHistorico));
    if (altura) {
      localStorage.setItem("altura", altura);
    }

    setPeso("");
    setPressaoSistolica("");
    setPressaoDiastolica("");
    setFrequencia("");
    setAltura("");
  };

  const dadosGraficoPeso = historico
    .slice(0, 7)
    .reverse()
    .map((item, index) => ({
      dia: index + 1,
      valor: item.peso
    }));

  const dadosGraficoFrequencia = historico
    .slice(0, 7)
    .reverse()
    .map((item, index) => ({
      dia: index + 1,
      valor: item.frequencia
    }));

  const classificacaoIMC = getClassificacaoIMC(dadosAtuais.imc);

  const treinoHoje = {
    tipo: "Treino de força (peito e tríceps)",
    duracao: "1h 15min",
    calorias: 450,
  };

  const refeicaoHoje = {
    cafe: "Pão integral, ovo cozido e café preto",
    almoco: "Frango grelhado, arroz integral e salada",
    jantar: "Omelete e abacate",
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-gray-700">Painel de Saúde</h2>

      {/* Formulário de entrada */}
      <div className="bg-white p-6 rounded-2xl shadow-md mb-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">Registrar Dados de Hoje</h3>
        <form onSubmit={salvarDados} className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Peso (kg)</label>
            <input
              type="number"
              step="0.1"
              value={peso}
              onChange={(e) => setPeso(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Altura (m)</label>
            <input
              type="number"
              step="0.01"
              value={altura}
              onChange={(e) => setAltura(e.target.value)}
              placeholder={dadosAtuais.altura.toFixed(2)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pressão Sistólica</label>
            <input
              type="number"
              value={pressaoSistolica}
              onChange={(e) => setPressaoSistolica(e.target.value)}
              placeholder="120"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pressão Diastólica</label>
            <input
              type="number"
              value={pressaoDiastolica}
              onChange={(e) => setPressaoDiastolica(e.target.value)}
              placeholder="80"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Frequência (bpm)</label>
            <input
              type="number"
              value={frequencia}
              onChange={(e) => setFrequencia(e.target.value)}
              placeholder="72"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>

          <div className="md:col-span-2 lg:col-span-5">
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition font-semibold"
            >
              Salvar Dados
            </button>
          </div>
        </form>
      </div>

      {/* Cartões principais */}
      <div className="flex flex-wrap gap-4 mb-6">
        <HealthCard title="Peso" value={dadosAtuais.peso} unit="kg" icon={<Weight />} />
        <HealthCard title="Pressão Arterial" value={dadosAtuais.pressao} unit="mmHg" icon={<HeartPulse />} />
        <HealthCard title="Frequência Cardíaca" value={dadosAtuais.frequencia} unit="bpm" icon={<Activity />} />
        <IMCCard imc={dadosAtuais.imc} classificacao={classificacaoIMC} />
      </div>

      {/* Widgets */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <AchievementWidget />
        <HydrationWidget />
      </div>

      {/* Gráficos */}
      {historico.length > 0 && (
        <div className="flex flex-wrap gap-4 mb-6">
          <ChartCard title="Variação de Peso" data={dadosGraficoPeso} dataKey="valor" color="#16a34a" />
          <ChartCard title="Frequência Cardíaca" data={dadosGraficoFrequencia} dataKey="valor" color="#ef4444" />
        </div>
      )}

      {/* Treino e Alimentação */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-2xl shadow-md">
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <Dumbbell className="text-green-600" /> Treino de Hoje
          </h3>
          <p><strong>Tipo:</strong> {treinoHoje.tipo}</p>
          <p><strong>Duração:</strong> {treinoHoje.duracao}</p>
          <p><strong>Calorias queimadas:</strong> {treinoHoje.calorias} kcal</p>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-md">
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <Apple className="text-green-600" /> Alimentação de Hoje
          </h3>
          <p><strong>Café da manhã:</strong> {refeicaoHoje.cafe}</p>
          <p><strong>Almoço:</strong> {refeicaoHoje.almoco}</p>
          <p><strong>Jantar:</strong> {refeicaoHoje.jantar}</p>
        </div>
      </div>
    </div>
  );
}
