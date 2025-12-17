import { useState, useEffect } from "react";
import { Calculator, Flame, Target, TrendingDown, Apple, Dumbbell, Plus, Trash2 } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

export default function Calories() {
  const [perfil, setPerfil] = useState({
    peso: 0,
    altura: 0,
    idade: 0,
    sexo: "masculino",
    nivelAtividade: "sedentario"
  });

  const [tmb, setTmb] = useState(0);
  const [caloriasDiarias, setCaloriasDiarias] = useState(0);
  const [objetivo, setObjetivo] = useState("manter");
  const [caloriasRecomendadas, setCaloriasRecomendadas] = useState(0);

  const [refeicoes, setRefeicoes] = useState([]);
  const [novaRefeicao, setNovaRefeicao] = useState({
    nome: "",
    calorias: "",
    tipo: "cafe"
  });

  const [exercicios, setExercicios] = useState([]);
  const [novoExercicio, setNovoExercicio] = useState({
    nome: "",
    calorias: "",
    duracao: ""
  });

  useEffect(() => {
    carregarDados();
  }, []);

  useEffect(() => {
    if (perfil.peso > 0 && perfil.altura > 0 && perfil.idade > 0) {
      calcularTMB();
    }
  }, [perfil, objetivo]);

  const carregarDados = () => {
    const perfilSalvo = localStorage.getItem("perfilUsuario");
    const dadosSaude = localStorage.getItem("dadosSaude");
    const refeicoesHoje = localStorage.getItem("refeicoesHoje");
    const exerciciosHoje = localStorage.getItem("exerciciosHoje");
    const ultimaData = localStorage.getItem("ultimaDataCalorias");

    const hoje = new Date().toDateString();

    // Reset se for um novo dia
    if (ultimaData !== hoje) {
      localStorage.setItem("refeicoesHoje", JSON.stringify([]));
      localStorage.setItem("exerciciosHoje", JSON.stringify([]));
      localStorage.setItem("ultimaDataCalorias", hoje);
      setRefeicoes([]);
      setExercicios([]);
    } else {
      if (refeicoesHoje) setRefeicoes(JSON.parse(refeicoesHoje));
      if (exerciciosHoje) setExercicios(JSON.parse(exerciciosHoje));
    }

    if (perfilSalvo) {
      const perfilData = JSON.parse(perfilSalvo);
      setPerfil(prev => ({
        ...prev,
        peso: perfilData.pesoAtual || 0,
        altura: perfilData.altura || 0,
        idade: perfilData.idade || 0
      }));
    }

    if (dadosSaude) {
      const dados = JSON.parse(dadosSaude);
      setPerfil(prev => ({
        ...prev,
        peso: dados.peso || prev.peso,
        altura: dados.altura || prev.altura
      }));
    }
  };

  const calcularTMB = () => {
    let tmbCalculado = 0;

    // Fórmula de Harris-Benedict
    if (perfil.sexo === "masculino") {
      tmbCalculado = 88.362 + (13.397 * perfil.peso) + (4.799 * perfil.altura * 100) - (5.677 * perfil.idade);
    } else {
      tmbCalculado = 447.593 + (9.247 * perfil.peso) + (3.098 * perfil.altura * 100) - (4.330 * perfil.idade);
    }

    setTmb(Math.round(tmbCalculado));

    // Multiplicadores de atividade
    const multiplicadores = {
      sedentario: 1.2,
      leve: 1.375,
      moderado: 1.55,
      intenso: 1.725,
      muitoIntenso: 1.9
    };

    const caloriasMantencao = Math.round(tmbCalculado * multiplicadores[perfil.nivelAtividade]);
    setCaloriasDiarias(caloriasMantencao);

    // Ajustar baseado no objetivo
    let caloriasObjetivo = caloriasMantencao;
    if (objetivo === "perder") {
      caloriasObjetivo = caloriasMantencao - 500; // Déficit de 500 cal
    } else if (objetivo === "ganhar") {
      caloriasObjetivo = caloriasMantencao + 500; // Superávit de 500 cal
    }

    setCaloriasRecomendadas(caloriasObjetivo);
  };

  const adicionarRefeicao = () => {
    if (novaRefeicao.nome && novaRefeicao.calorias) {
      const refeicao = {
        id: Date.now(),
        nome: novaRefeicao.nome,
        calorias: parseInt(novaRefeicao.calorias),
        tipo: novaRefeicao.tipo,
        hora: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
      };

      const novasRefeicoes = [...refeicoes, refeicao];
      setRefeicoes(novasRefeicoes);
      localStorage.setItem("refeicoesHoje", JSON.stringify(novasRefeicoes));
      setNovaRefeicao({ nome: "", calorias: "", tipo: "cafe" });
    }
  };

  const removerRefeicao = (id) => {
    const novasRefeicoes = refeicoes.filter(r => r.id !== id);
    setRefeicoes(novasRefeicoes);
    localStorage.setItem("refeicoesHoje", JSON.stringify(novasRefeicoes));
  };

  const adicionarExercicio = () => {
    if (novoExercicio.nome && novoExercicio.calorias) {
      const exercicio = {
        id: Date.now(),
        nome: novoExercicio.nome,
        calorias: parseInt(novoExercicio.calorias),
        duracao: novoExercicio.duracao,
        hora: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
      };

      const novosExercicios = [...exercicios, exercicio];
      setExercicios(novosExercicios);
      localStorage.setItem("exerciciosHoje", JSON.stringify(novosExercicios));
      setNovoExercicio({ nome: "", calorias: "", duracao: "" });
    }
  };

  const removerExercicio = (id) => {
    const novosExercicios = exercicios.filter(e => e.id !== id);
    setExercicios(novosExercicios);
    localStorage.setItem("exerciciosHoje", JSON.stringify(novosExercicios));
  };

  const totalCaloriasConsumidas = refeicoes.reduce((acc, r) => acc + r.calorias, 0);
  const totalCaloriasQueimadas = exercicios.reduce((acc, e) => acc + e.calorias, 0);
  const saldoCalorico = totalCaloriasConsumidas - totalCaloriasQueimadas;
  const caloriasRestantes = caloriasRecomendadas - saldoCalorico;

  const porcentagemMeta = caloriasRecomendadas > 0 
    ? Math.min((saldoCalorico / caloriasRecomendadas) * 100, 150) 
    : 0;

  const dadosPizza = [
    { name: "Consumidas", value: totalCaloriasConsumidas, color: "#ef4444" },
    { name: "Queimadas", value: totalCaloriasQueimadas, color: "#10b981" },
    { name: "Restantes", value: Math.max(0, caloriasRestantes), color: "#94a3b8" }
  ];

  const dadosRefeicoesPorTipo = [
    { tipo: "Café", calorias: refeicoes.filter(r => r.tipo === "cafe").reduce((acc, r) => acc + r.calorias, 0) },
    { tipo: "Almoço", calorias: refeicoes.filter(r => r.tipo === "almoco").reduce((acc, r) => acc + r.calorias, 0) },
    { tipo: "Jantar", calorias: refeicoes.filter(r => r.tipo === "jantar").reduce((acc, r) => acc + r.calorias, 0) },
    { tipo: "Lanche", calorias: refeicoes.filter(r => r.tipo === "lanche").reduce((acc, r) => acc + r.calorias, 0) }
  ].filter(d => d.calorias > 0);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-gray-700 flex items-center gap-2">
        <Calculator className="text-orange-600" />
        Calculadora de Calorias
      </h2>

      {/* Calculadora TMB */}
      <div className="bg-white p-6 rounded-2xl shadow-md mb-6">
        <h3 className="text-xl font-bold text-gray-700 mb-4 flex items-center gap-2">
          <Flame className="text-orange-600" />
          Calcular Taxa Metabólica Basal (TMB)
        </h3>
        
        <div className="grid md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Peso (kg)</label>
            <input
              type="number"
              step="0.1"
              value={perfil.peso || ""}
              onChange={(e) => setPerfil({ ...perfil, peso: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Altura (m)</label>
            <input
              type="number"
              step="0.01"
              value={perfil.altura || ""}
              onChange={(e) => setPerfil({ ...perfil, altura: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Idade</label>
            <input
              type="number"
              value={perfil.idade || ""}
              onChange={(e) => setPerfil({ ...perfil, idade: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sexo</label>
            <select
              value={perfil.sexo}
              onChange={(e) => setPerfil({ ...perfil, sexo: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            >
              <option value="masculino">Masculino</option>
              <option value="feminino">Feminino</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nível de Atividade</label>
            <select
              value={perfil.nivelAtividade}
              onChange={(e) => setPerfil({ ...perfil, nivelAtividade: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            >
              <option value="sedentario">Sedentário (pouco ou nenhum exercício)</option>
              <option value="leve">Leve (1-3 dias/semana)</option>
              <option value="moderado">Moderado (3-5 dias/semana)</option>
              <option value="intenso">Intenso (6-7 dias/semana)</option>
              <option value="muitoIntenso">Muito Intenso (2x por dia)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Objetivo</label>
            <select
              value={objetivo}
              onChange={(e) => setObjetivo(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            >
              <option value="perder">Perder Peso</option>
              <option value="manter">Manter Peso</option>
              <option value="ganhar">Ganhar Peso</option>
            </select>
          </div>
        </div>

        {tmb > 0 && (
          <div className="grid md:grid-cols-3 gap-4 mt-6">
            <div className="bg-blue-50 p-4 rounded-xl text-center">
              <p className="text-sm text-gray-600 mb-1">TMB (Repouso)</p>
              <p className="text-3xl font-bold text-blue-600">{tmb}</p>
              <p className="text-xs text-gray-500">calorias/dia</p>
            </div>
            <div className="bg-green-50 p-4 rounded-xl text-center">
              <p className="text-sm text-gray-600 mb-1">Manutenção</p>
              <p className="text-3xl font-bold text-green-600">{caloriasDiarias}</p>
              <p className="text-xs text-gray-500">calorias/dia</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-xl text-center">
              <p className="text-sm text-gray-600 mb-1">Meta ({objetivo === "perder" ? "Perder" : objetivo === "ganhar" ? "Ganhar" : "Manter"})</p>
              <p className="text-3xl font-bold text-orange-600">{caloriasRecomendadas}</p>
              <p className="text-xs text-gray-500">calorias/dia</p>
            </div>
          </div>
        )}
      </div>

      {/* Resumo do Dia */}
      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-red-500 to-red-600 text-white p-4 rounded-2xl shadow-md">
          <div className="flex items-center gap-3 mb-2">
            <Apple className="w-6 h-6" />
            <h3 className="font-semibold">Consumidas</h3>
          </div>
          <p className="text-3xl font-bold">{totalCaloriasConsumidas}</p>
          <p className="text-sm opacity-90">calorias</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-4 rounded-2xl shadow-md">
          <div className="flex items-center gap-3 mb-2">
            <Dumbbell className="w-6 h-6" />
            <h3 className="font-semibold">Queimadas</h3>
          </div>
          <p className="text-3xl font-bold">{totalCaloriasQueimadas}</p>
          <p className="text-sm opacity-90">calorias</p>
        </div>

        <div className={`bg-gradient-to-br ${saldoCalorico > caloriasRecomendadas ? "from-orange-500 to-orange-600" : "from-blue-500 to-blue-600"} text-white p-4 rounded-2xl shadow-md`}>
          <div className="flex items-center gap-3 mb-2">
            <Target className="w-6 h-6" />
            <h3 className="font-semibold">Saldo</h3>
          </div>
          <p className="text-3xl font-bold">{saldoCalorico}</p>
          <p className="text-sm opacity-90">calorias</p>
        </div>

        <div className={`bg-gradient-to-br ${caloriasRestantes < 0 ? "from-red-500 to-red-600" : "from-purple-500 to-purple-600"} text-white p-4 rounded-2xl shadow-md`}>
          <div className="flex items-center gap-3 mb-2">
            <TrendingDown className="w-6 h-6" />
            <h3 className="font-semibold">Restantes</h3>
          </div>
          <p className="text-3xl font-bold">{Math.abs(caloriasRestantes)}</p>
          <p className="text-sm opacity-90">{caloriasRestantes < 0 ? "acima da meta" : "para a meta"}</p>
        </div>
      </div>

      {/* Barra de Progresso */}
      {caloriasRecomendadas > 0 && (
        <div className="bg-white p-6 rounded-2xl shadow-md mb-6">
          <h3 className="text-lg font-bold text-gray-700 mb-3">Progresso Diário</h3>
          <div className="w-full bg-gray-200 rounded-full h-8 overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 flex items-center justify-center text-white text-sm font-bold ${
                porcentagemMeta > 100 ? "bg-gradient-to-r from-orange-500 to-red-500" : "bg-gradient-to-r from-green-500 to-blue-500"
              }`}
              style={{ width: `${porcentagemMeta}%` }}
            >
              {porcentagemMeta > 10 && `${porcentagemMeta.toFixed(0)}%`}
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-2 text-center">
            {porcentagemMeta > 100 
              ? `Você ultrapassou sua meta em ${(saldoCalorico - caloriasRecomendadas)} calorias`
              : `Faltam ${caloriasRestantes} calorias para atingir sua meta`
            }
          </p>
        </div>
      )}

      {/* Gráficos */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h3 className="text-lg font-bold text-gray-700 mb-4">Distribuição de Calorias</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={dadosPizza}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {dadosPizza.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {dadosRefeicoesPorTipo.length > 0 && (
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h3 className="text-lg font-bold text-gray-700 mb-4">Calorias por Refeição</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={dadosRefeicoesPorTipo}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="tipo" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="calorias" fill="#f97316" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Adicionar Refeições */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h3 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
            <Apple className="text-red-600" />
            Adicionar Refeição
          </h3>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Nome da refeição"
              value={novaRefeicao.nome}
              onChange={(e) => setNovaRefeicao({ ...novaRefeicao, nome: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
            />
            <input
              type="number"
              placeholder="Calorias"
              value={novaRefeicao.calorias}
              onChange={(e) => setNovaRefeicao({ ...novaRefeicao, calorias: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
            />
            <select
              value={novaRefeicao.tipo}
              onChange={(e) => setNovaRefeicao({ ...novaRefeicao, tipo: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
            >
              <option value="cafe">Café da Manhã</option>
              <option value="lanche">Lanche</option>
              <option value="almoco">Almoço</option>
              <option value="jantar">Jantar</option>
            </select>
            <button
              onClick={adicionarRefeicao}
              className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition font-semibold flex items-center justify-center gap-2"
            >
              <Plus size={20} />
              Adicionar Refeição
            </button>
          </div>

          <div className="mt-4 space-y-2">
            {refeicoes.map((refeicao) => (
              <div key={refeicao.id} className="flex justify-between items-center bg-red-50 p-3 rounded-lg">
                <div>
                  <p className="font-semibold text-gray-800">{refeicao.nome}</p>
                  <p className="text-sm text-gray-600">{refeicao.calorias} cal • {refeicao.hora}</p>
                </div>
                <button
                  onClick={() => removerRefeicao(refeicao.id)}
                  className="text-red-600 hover:text-red-800 transition"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Adicionar Exercícios */}
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h3 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
            <Dumbbell className="text-green-600" />
            Adicionar Exercício
          </h3>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Nome do exercício"
              value={novoExercicio.nome}
              onChange={(e) => setNovoExercicio({ ...novoExercicio, nome: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            />
            <input
              type="number"
              placeholder="Calorias queimadas"
              value={novoExercicio.calorias}
              onChange={(e) => setNovoExercicio({ ...novoExercicio, calorias: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            />
            <input
              type="text"
              placeholder="Duração (ex: 30min)"
              value={novoExercicio.duracao}
              onChange={(e) => setNovoExercicio({ ...novoExercicio, duracao: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            />
            <button
              onClick={adicionarExercicio}
              className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition font-semibold flex items-center justify-center gap-2"
            >
              <Plus size={20} />
              Adicionar Exercício
            </button>
          </div>

          <div className="mt-4 space-y-2">
            {exercicios.map((exercicio) => (
              <div key={exercicio.id} className="flex justify-between items-center bg-green-50 p-3 rounded-lg">
                <div>
                  <p className="font-semibold text-gray-800">{exercicio.nome}</p>
                  <p className="text-sm text-gray-600">-{exercicio.calorias} cal • {exercicio.duracao} • {exercicio.hora}</p>
                </div>
                <button
                  onClick={() => removerExercicio(exercicio.id)}
                  className="text-green-600 hover:text-green-800 transition"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
