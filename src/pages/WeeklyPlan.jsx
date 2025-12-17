import { useState, useEffect } from "react";
import { Utensils, Dumbbell, ChevronDown, ChevronUp, Calendar, CheckCircle, Edit2, Save, X, RotateCcw } from "lucide-react";

const diasSemana = [
  { nome: "Segunda", cor: "from-blue-500 to-blue-600" },
  { nome: "Terça", cor: "from-green-500 to-green-600" },
  { nome: "Quarta", cor: "from-yellow-500 to-yellow-600" },
  { nome: "Quinta", cor: "from-orange-500 to-orange-600" },
  { nome: "Sexta", cor: "from-red-500 to-red-600" },
  { nome: "Sábado", cor: "from-purple-500 to-purple-600" },
  { nome: "Domingo", cor: "from-pink-500 to-pink-600" }
];

const planoInicial = {
  Segunda: {
    dieta: {
      cafeManha: "Pão integral com queijo branco e café sem açúcar",
      lanche1: "1 maçã",
      almoco: "Arroz integral, feijão, frango grelhado e salada verde",
      lanche2: "Iogurte natural com granola",
      jantar: "Omelete de 2 ovos com legumes e salada"
    },
    treino: {
      tipo: "Peito e Tríceps",
      exercicios: [
        "Supino reto - 4x12",
        "Supino inclinado - 3x12",
        "Crucifixo - 3x15",
        "Tríceps testa - 3x12",
        "Tríceps corda - 3x15"
      ]
    },
    concluido: false
  },
  Terça: {
    dieta: {
      cafeManha: "Tapioca com ovo e queijo",
      lanche1: "Banana com aveia",
      almoco: "Batata doce, carne moída e brócolis",
      lanche2: "Mix de castanhas",
      jantar: "Sopa de legumes com frango desfiado"
    },
    treino: {
      tipo: "Costas e Bíceps",
      exercicios: [
        "Barra fixa - 4x10",
        "Remada curvada - 4x12",
        "Pulldown - 3x12",
        "Rosca direta - 3x12",
        "Rosca martelo - 3x12"
      ]
    },
    concluido: false
  },
  Quarta: {
    dieta: {
      cafeManha: "Mingau de aveia com frutas",
      lanche1: "Vitamina de frutas",
      almoco: "Macarrão integral, atum e salada",
      lanche2: "Queijo cottage com tomate",
      jantar: "Peixe grelhado com legumes no vapor"
    },
    treino: {
      tipo: "Pernas",
      exercicios: [
        "Agachamento livre - 4x15",
        "Leg press - 4x15",
        "Cadeira extensora - 3x15",
        "Cadeira flexora - 3x15",
        "Panturrilha - 4x20"
      ]
    },
    concluido: false
  },
  Quinta: {
    dieta: {
      cafeManha: "Crepioca com frango desfiado",
      lanche1: "Mamão com linhaça",
      almoco: "Arroz integral, feijão, carne e salada",
      lanche2: "Barra de proteína",
      jantar: "Frango grelhado com batata doce"
    },
    treino: {
      tipo: "Ombros e Abdômen",
      exercicios: [
        "Desenvolvimento com halteres - 4x12",
        "Elevação lateral - 3x15",
        "Elevação frontal - 3x12",
        "Abdominal supra - 4x20",
        "Prancha - 3x1min"
      ]
    },
    concluido: false
  },
  Sexta: {
    dieta: {
      cafeManha: "Panqueca de banana com aveia",
      lanche1: "Abacate com mel",
      almoco: "Quinoa, salmão e aspargos",
      lanche2: "Smoothie de frutas vermelhas",
      jantar: "Wrap integral com frango e salada"
    },
    treino: {
      tipo: "Treino Funcional",
      exercicios: [
        "Burpees - 4x15",
        "Mountain climbers - 4x20",
        "Agachamento com salto - 3x15",
        "Flexão - 4x15",
        "Prancha lateral - 3x45s cada lado"
      ]
    },
    concluido: false
  },
  Sábado: {
    dieta: {
      cafeManha: "Ovos mexidos com torrada integral",
      lanche1: "Uvas",
      almoco: "Risoto de frango com legumes",
      lanche2: "Pasta de amendoim com banana",
      jantar: "Pizza integral caseira com vegetais"
    },
    treino: {
      tipo: "Cardio e Mobilidade",
      exercicios: [
        "Corrida leve - 30min",
        "Alongamento completo - 15min",
        "Yoga - 20min"
      ]
    },
    concluido: false
  },
  Domingo: {
    dieta: {
      cafeManha: "Café da manhã livre (moderado)",
      lanche1: "Frutas variadas",
      almoco: "Almoço em família (equilibrado)",
      lanche2: "Chá com biscoito integral",
      jantar: "Salada completa com proteína"
    },
    treino: {
      tipo: "Descanso Ativo",
      exercicios: [
        "Caminhada leve - 40min",
        "Alongamento - 15min"
      ]
    },
    concluido: false
  }
};

export default function WeeklyPlan() {
  const [planoSemanal, setPlanoSemanal] = useState(planoInicial);
  const [diasExpandidos, setDiasExpandidos] = useState([]);
  const [editando, setEditando] = useState({ dia: null, tipo: null });
  const [formData, setFormData] = useState({});
  const [visualizacao, setVisualizacao] = useState("cards"); // cards ou lista

  useEffect(() => {
    const planoSalvo = localStorage.getItem("planoSemanal");
    if (planoSalvo) {
      setPlanoSemanal(JSON.parse(planoSalvo));
    }
  }, []);

  const salvarPlano = () => {
    localStorage.setItem("planoSemanal", JSON.stringify(planoSemanal));
  };

  const toggleDia = (dia) => {
    if (diasExpandidos.includes(dia)) {
      setDiasExpandidos(diasExpandidos.filter(d => d !== dia));
    } else {
      setDiasExpandidos([...diasExpandidos, dia]);
    }
  };

  const toggleConcluido = (dia) => {
    const novoPlano = {
      ...planoSemanal,
      [dia]: {
        ...planoSemanal[dia],
        concluido: !planoSemanal[dia].concluido
      }
    };
    setPlanoSemanal(novoPlano);
    localStorage.setItem("planoSemanal", JSON.stringify(novoPlano));
  };

  const iniciarEdicao = (dia, tipo) => {
    setEditando({ dia, tipo });
    setFormData(planoSemanal[dia][tipo]);
  };

  const salvarEdicao = () => {
    const novoPlano = {
      ...planoSemanal,
      [editando.dia]: {
        ...planoSemanal[editando.dia],
        [editando.tipo]: formData
      }
    };
    setPlanoSemanal(novoPlano);
    localStorage.setItem("planoSemanal", JSON.stringify(novoPlano));
    setEditando({ dia: null, tipo: null });
  };

  const restaurarPadrao = () => {
    if (window.confirm("Deseja restaurar o plano padrão? Isso apagará suas personalizações.")) {
      setPlanoSemanal(planoInicial);
      localStorage.setItem("planoSemanal", JSON.stringify(planoInicial));
    }
  };

  const diasConcluidos = diasSemana.filter(d => planoSemanal[d.nome]?.concluido).length;
  const progresso = (diasConcluidos / diasSemana.length) * 100;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-200 flex items-center gap-2">
          <Calendar className="text-indigo-600" />
          Planejamento Semanal
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setVisualizacao(visualizacao === "cards" ? "lista" : "cards")}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition text-sm font-semibold"
          >
            {visualizacao === "cards" ? "Ver Lista" : "Ver Cards"}
          </button>
          <button
            onClick={restaurarPadrao}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition text-sm font-semibold flex items-center gap-2"
          >
            <RotateCcw size={16} />
            Restaurar
          </button>
        </div>
      </div>

      {/* Progresso Semanal */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 rounded-2xl shadow-lg mb-6">
        <div className="flex justify-between items-center mb-3">
          <div>
            <h3 className="text-xl font-bold">Progresso da Semana</h3>
            <p className="text-sm opacity-90">{diasConcluidos} de {diasSemana.length} dias concluídos</p>
          </div>
          <div className="text-4xl font-bold">{Math.round(progresso)}%</div>
        </div>
        <div className="w-full bg-white/30 rounded-full h-4 overflow-hidden">
          <div 
            className="bg-white h-full rounded-full transition-all duration-500"
            style={{ width: `${progresso}%` }}
          />
        </div>
      </div>

      {/* Visualização em Cards */}
      {visualizacao === "cards" && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {diasSemana.map((diaInfo) => {
            const dia = diaInfo.nome;
            const plano = planoSemanal[dia];
            const expandido = diasExpandidos.includes(dia);

            return (
              <div 
                key={dia} 
                className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transition-all ${
                  plano?.concluido ? "ring-4 ring-green-500" : ""
                }`}
              >
                <div className={`bg-gradient-to-r ${diaInfo.cor} text-white p-4`}>
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-xl font-bold">{dia}</h3>
                      <p className="text-sm opacity-90">{plano?.treino.tipo}</p>
                    </div>
                    <button
                      onClick={() => toggleConcluido(dia)}
                      className={`p-2 rounded-full transition ${
                        plano?.concluido ? "bg-white text-green-600" : "bg-white/20 hover:bg-white/30"
                      }`}
                    >
                      <CheckCircle size={24} />
                    </button>
                  </div>
                </div>

                <div className="p-4">
                  <button
                    onClick={() => toggleDia(dia)}
                    className="w-full flex justify-between items-center text-gray-700 dark:text-gray-200 font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded-lg transition"
                  >
                    <span>Ver Detalhes</span>
                    {expandido ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>

                  {expandido && (
                    <div className="mt-4 space-y-4">
                      {/* Dieta */}
                      <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-xl">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-bold text-green-800 dark:text-green-300 flex items-center gap-2 text-sm">
                            <Utensils size={16} />
                            Dieta
                          </h4>
                          <button
                            onClick={() => iniciarEdicao(dia, "dieta")}
                            className="text-green-600 hover:text-green-800 dark:text-green-400"
                          >
                            <Edit2 size={14} />
                          </button>
                        </div>
                        {editando.dia === dia && editando.tipo === "dieta" ? (
                          <div className="space-y-2">
                            <input type="text" placeholder="Café" value={formData.cafeManha || ""} onChange={(e) => setFormData({ ...formData, cafeManha: e.target.value })} className="w-full px-2 py-1 border rounded text-xs dark:bg-gray-700 dark:border-gray-600" />
                            <input type="text" placeholder="Lanche 1" value={formData.lanche1 || ""} onChange={(e) => setFormData({ ...formData, lanche1: e.target.value })} className="w-full px-2 py-1 border rounded text-xs dark:bg-gray-700 dark:border-gray-600" />
                            <input type="text" placeholder="Almoço" value={formData.almoco || ""} onChange={(e) => setFormData({ ...formData, almoco: e.target.value })} className="w-full px-2 py-1 border rounded text-xs dark:bg-gray-700 dark:border-gray-600" />
                            <input type="text" placeholder="Lanche 2" value={formData.lanche2 || ""} onChange={(e) => setFormData({ ...formData, lanche2: e.target.value })} className="w-full px-2 py-1 border rounded text-xs dark:bg-gray-700 dark:border-gray-600" />
                            <input type="text" placeholder="Jantar" value={formData.jantar || ""} onChange={(e) => setFormData({ ...formData, jantar: e.target.value })} className="w-full px-2 py-1 border rounded text-xs dark:bg-gray-700 dark:border-gray-600" />
                            <div className="flex gap-2">
                              <button onClick={salvarEdicao} className="flex-1 bg-green-600 text-white py-1 rounded text-xs flex items-center justify-center gap-1"><Save size={12} />Salvar</button>
                              <button onClick={() => setEditando({ dia: null, tipo: null })} className="flex-1 bg-gray-400 text-white py-1 rounded text-xs flex items-center justify-center gap-1"><X size={12} />Cancelar</button>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-1 text-xs text-gray-700 dark:text-gray-300">
                            <p><strong>Café:</strong> {plano.dieta.cafeManha}</p>
                            <p><strong>Lanche 1:</strong> {plano.dieta.lanche1}</p>
                            <p><strong>Almoço:</strong> {plano.dieta.almoco}</p>
                            <p><strong>Lanche 2:</strong> {plano.dieta.lanche2}</p>
                            <p><strong>Jantar:</strong> {plano.dieta.jantar}</p>
                          </div>
                        )}
                      </div>

                      {/* Treino */}
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-xl">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-bold text-blue-800 dark:text-blue-300 flex items-center gap-2 text-sm">
                            <Dumbbell size={16} />
                            Treino
                          </h4>
                          <button
                            onClick={() => iniciarEdicao(dia, "treino")}
                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
                          >
                            <Edit2 size={14} />
                          </button>
                        </div>
                        {editando.dia === dia && editando.tipo === "treino" ? (
                          <div className="space-y-2">
                            <input type="text" placeholder="Tipo" value={formData.tipo || ""} onChange={(e) => setFormData({ ...formData, tipo: e.target.value })} className="w-full px-2 py-1 border rounded text-xs font-semibold dark:bg-gray-700 dark:border-gray-600" />
                            {formData.exercicios?.map((ex, i) => (
                              <input key={i} type="text" value={ex} onChange={(e) => { const novosEx = [...formData.exercicios]; novosEx[i] = e.target.value; setFormData({ ...formData, exercicios: novosEx }); }} className="w-full px-2 py-1 border rounded text-xs dark:bg-gray-700 dark:border-gray-600" />
                            ))}
                            <div className="flex gap-2">
                              <button onClick={salvarEdicao} className="flex-1 bg-blue-600 text-white py-1 rounded text-xs flex items-center justify-center gap-1"><Save size={12} />Salvar</button>
                              <button onClick={() => setEditando({ dia: null, tipo: null })} className="flex-1 bg-gray-400 text-white py-1 rounded text-xs flex items-center justify-center gap-1"><X size={12} />Cancelar</button>
                            </div>
                          </div>
                        ) : (
                          <ul className="space-y-1 text-xs text-gray-700 dark:text-gray-300">
                            {plano.treino.exercicios.map((exercicio, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="text-blue-600 font-bold">•</span>
                                <span>{exercicio}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Visualização em Lista */}
      {visualizacao === "lista" && (
        <div className="space-y-3">
          {diasSemana.map((diaInfo) => {
            const dia = diaInfo.nome;
            const plano = planoSemanal[dia];
            const expandido = diasExpandidos.includes(dia);

            return (
              <div key={dia} className={`bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden ${plano?.concluido ? "ring-2 ring-green-500" : ""}`}>
                <button
                  onClick={() => toggleDia(dia)}
                  className={`w-full p-4 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700 transition bg-gradient-to-r ${diaInfo.cor} text-white`}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-left">
                      <h3 className="text-xl font-bold">{dia}</h3>
                      <p className="text-sm opacity-90">{plano?.treino.tipo}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleConcluido(dia); }}
                      className={`p-2 rounded-full transition ${plano?.concluido ? "bg-white text-green-600" : "bg-white/20 hover:bg-white/30"}`}
                    >
                      <CheckCircle size={20} />
                    </button>
                    {expandido ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                  </div>
                </button>

                {expandido && (
                  <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="grid md:grid-cols-2 gap-4">
                      {/* Dieta */}
                      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="font-bold text-green-800 dark:text-green-300 flex items-center gap-2">
                            <Utensils size={20} />
                            Dieta do Dia
                          </h4>
                          <button
                            onClick={() => iniciarEdicao(dia, "dieta")}
                            className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                          >
                            Editar
                          </button>
                        </div>

                        {editando.dia === dia && editando.tipo === "dieta" ? (
                          <div className="space-y-2">
                            <input type="text" placeholder="Café da manhã" value={formData.cafeManha || ""} onChange={(e) => setFormData({ ...formData, cafeManha: e.target.value })} className="w-full px-2 py-1 border rounded text-sm dark:bg-gray-700 dark:border-gray-600" />
                            <input type="text" placeholder="Lanche 1" value={formData.lanche1 || ""} onChange={(e) => setFormData({ ...formData, lanche1: e.target.value })} className="w-full px-2 py-1 border rounded text-sm dark:bg-gray-700 dark:border-gray-600" />
                            <input type="text" placeholder="Almoço" value={formData.almoco || ""} onChange={(e) => setFormData({ ...formData, almoco: e.target.value })} className="w-full px-2 py-1 border rounded text-sm dark:bg-gray-700 dark:border-gray-600" />
                            <input type="text" placeholder="Lanche 2" value={formData.lanche2 || ""} onChange={(e) => setFormData({ ...formData, lanche2: e.target.value })} className="w-full px-2 py-1 border rounded text-sm dark:bg-gray-700 dark:border-gray-600" />
                            <input type="text" placeholder="Jantar" value={formData.jantar || ""} onChange={(e) => setFormData({ ...formData, jantar: e.target.value })} className="w-full px-2 py-1 border rounded text-sm dark:bg-gray-700 dark:border-gray-600" />
                            <div className="flex gap-2">
                              <button onClick={salvarEdicao} className="flex-1 bg-green-600 text-white py-1 rounded text-sm">Salvar</button>
                              <button onClick={() => setEditando({ dia: null, tipo: null })} className="flex-1 bg-gray-400 text-white py-1 rounded text-sm">Cancelar</button>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                            <p><strong>Café:</strong> {plano.dieta.cafeManha}</p>
                            <p><strong>Lanche 1:</strong> {plano.dieta.lanche1}</p>
                            <p><strong>Almoço:</strong> {plano.dieta.almoco}</p>
                            <p><strong>Lanche 2:</strong> {plano.dieta.lanche2}</p>
                            <p><strong>Jantar:</strong> {plano.dieta.jantar}</p>
                          </div>
                        )}
                      </div>

                      {/* Treino */}
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="font-bold text-blue-800 dark:text-blue-300 flex items-center gap-2">
                            <Dumbbell size={20} />
                            {plano.treino.tipo}
                          </h4>
                          <button
                            onClick={() => iniciarEdicao(dia, "treino")}
                            className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                          >
                            Editar
                          </button>
                        </div>

                        {editando.dia === dia && editando.tipo === "treino" ? (
                          <div className="space-y-2">
                            <input type="text" placeholder="Tipo de treino" value={formData.tipo || ""} onChange={(e) => setFormData({ ...formData, tipo: e.target.value })} className="w-full px-2 py-1 border rounded text-sm font-semibold dark:bg-gray-700 dark:border-gray-600" />
                            {formData.exercicios?.map((ex, i) => (
                              <input key={i} type="text" value={ex} onChange={(e) => { const novosEx = [...formData.exercicios]; novosEx[i] = e.target.value; setFormData({ ...formData, exercicios: novosEx }); }} className="w-full px-2 py-1 border rounded text-sm dark:bg-gray-700 dark:border-gray-600" />
                            ))}
                            <div className="flex gap-2">
                              <button onClick={salvarEdicao} className="flex-1 bg-blue-600 text-white py-1 rounded text-sm">Salvar</button>
                              <button onClick={() => setEditando({ dia: null, tipo: null })} className="flex-1 bg-gray-400 text-white py-1 rounded text-sm">Cancelar</button>
                            </div>
                          </div>
                        ) : (
                          <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                            {plano.treino.exercicios.map((exercicio, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="text-blue-600 font-bold">•</span>
                                <span>{exercicio}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
