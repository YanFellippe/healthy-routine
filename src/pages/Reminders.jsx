import { useState, useEffect } from "react";
import { Bell, Clock, Droplets, Activity, Apple, Plus, Trash2, BellOff } from "lucide-react";

export default function Reminders() {
  const [notificacoesAtivadas, setNotificacoesAtivadas] = useState(false);
  const [permissao, setPermissao] = useState("default");
  const [lembretes, setLembretes] = useState([]);
  const [novoLembrete, setNovoLembrete] = useState({
    tipo: "agua",
    horario: "",
    mensagem: "",
    ativo: true
  });

  useEffect(() => {
    carregarLembretes();
    verificarPermissao();
    iniciarVerificacaoLembretes();
  }, []);

  const carregarLembretes = () => {
    const lembretesSalvos = localStorage.getItem("lembretes");
    if (lembretesSalvos) {
      setLembretes(JSON.parse(lembretesSalvos));
    } else {
      // Lembretes padrão
      const lembretesPadrao = [
        { id: 1, tipo: "agua", horario: "09:00", mensagem: "Hora de beber água!", ativo: true },
        { id: 2, tipo: "agua", horario: "12:00", mensagem: "Lembre-se de se hidratar!", ativo: true },
        { id: 3, tipo: "agua", horario: "15:00", mensagem: "Beba água agora!", ativo: true },
        { id: 4, tipo: "agua", horario: "18:00", mensagem: "Hora da água!", ativo: true },
        { id: 5, tipo: "dados", horario: "21:00", mensagem: "Registre seus dados de saúde hoje!", ativo: true },
        { id: 6, tipo: "treino", horario: "07:00", mensagem: "Hora do treino!", ativo: true }
      ];
      setLembretes(lembretesPadrao);
      localStorage.setItem("lembretes", JSON.stringify(lembretesPadrao));
    }
  };

  const verificarPermissao = () => {
    if ("Notification" in window) {
      setPermissao(Notification.permission);
      setNotificacoesAtivadas(Notification.permission === "granted");
    }
  };

  const solicitarPermissao = async () => {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission();
      setPermissao(permission);
      setNotificacoesAtivadas(permission === "granted");
      
      if (permission === "granted") {
        mostrarNotificacao("Notificações Ativadas!", "Você receberá lembretes nos horários configurados.");
      }
    } else {
      alert("Seu navegador não suporta notificações.");
    }
  };

  const mostrarNotificacao = (titulo, mensagem) => {
    if (Notification.permission === "granted") {
      const notification = new Notification(titulo, {
        body: mensagem,
        icon: "/vite.svg",
        badge: "/vite.svg",
        tag: "saude-em-dia",
        requireInteraction: false
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      // Fechar automaticamente após 5 segundos
      setTimeout(() => notification.close(), 5000);
    }
  };

  const iniciarVerificacaoLembretes = () => {
    // Verificar lembretes a cada minuto
    const intervalo = setInterval(() => {
      verificarLembretes();
    }, 60000); // 60 segundos

    // Verificar imediatamente também
    verificarLembretes();

    return () => clearInterval(intervalo);
  };

  const verificarLembretes = () => {
    const agora = new Date();
    const horaAtual = `${String(agora.getHours()).padStart(2, "0")}:${String(agora.getMinutes()).padStart(2, "0")}`;
    
    const lembretesSalvos = JSON.parse(localStorage.getItem("lembretes") || "[]");
    const ultimasNotificacoes = JSON.parse(localStorage.getItem("ultimasNotificacoes") || "{}");
    const hoje = agora.toDateString();

    lembretesSalvos.forEach(lembrete => {
      if (lembrete.ativo && lembrete.horario === horaAtual) {
        const chave = `${lembrete.id}-${hoje}`;
        
        // Verificar se já foi enviada hoje
        if (!ultimasNotificacoes[chave]) {
          mostrarNotificacao("Saúde em Dia", lembrete.mensagem);
          ultimasNotificacoes[chave] = true;
          localStorage.setItem("ultimasNotificacoes", JSON.stringify(ultimasNotificacoes));
        }
      }
    });
  };

  const adicionarLembrete = () => {
    if (novoLembrete.horario && novoLembrete.mensagem) {
      const lembrete = {
        id: Date.now(),
        ...novoLembrete
      };

      const novosLembretes = [...lembretes, lembrete];
      setLembretes(novosLembretes);
      localStorage.setItem("lembretes", JSON.stringify(novosLembretes));
      setNovoLembrete({ tipo: "agua", horario: "", mensagem: "", ativo: true });
    }
  };

  const removerLembrete = (id) => {
    const novosLembretes = lembretes.filter(l => l.id !== id);
    setLembretes(novosLembretes);
    localStorage.setItem("lembretes", JSON.stringify(novosLembretes));
  };

  const toggleLembrete = (id) => {
    const novosLembretes = lembretes.map(l => 
      l.id === id ? { ...l, ativo: !l.ativo } : l
    );
    setLembretes(novosLembretes);
    localStorage.setItem("lembretes", JSON.stringify(novosLembretes));
  };

  const testarNotificacao = () => {
    mostrarNotificacao("Teste de Notificação", "Se você viu isso, as notificações estão funcionando! ✅");
  };

  const getTipoIcon = (tipo) => {
    switch (tipo) {
      case "agua": return <Droplets className="text-blue-600" size={20} />;
      case "dados": return <Activity className="text-green-600" size={20} />;
      case "treino": return <Apple className="text-orange-600" size={20} />;
      default: return <Bell className="text-gray-600" size={20} />;
    }
  };

  const getTipoNome = (tipo) => {
    switch (tipo) {
      case "agua": return "Hidratação";
      case "dados": return "Registrar Dados";
      case "treino": return "Treino";
      default: return "Outro";
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-gray-700 dark:text-gray-200 flex items-center gap-2">
        <Bell className="text-purple-600" />
        Lembretes e Notificações
      </h2>

      {/* Status das Notificações */}
      <div className={`p-6 rounded-2xl shadow-md mb-6 ${
        notificacoesAtivadas 
          ? "bg-gradient-to-r from-green-500 to-emerald-600" 
          : "bg-gradient-to-r from-gray-500 to-gray-600"
      } text-white`}>
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
              {notificacoesAtivadas ? <Bell size={24} /> : <BellOff size={24} />}
              Status das Notificações
            </h3>
            <p className="text-sm opacity-90">
              {permissao === "granted" && "Notificações ativadas e funcionando"}
              {permissao === "denied" && "Notificações bloqueadas pelo navegador"}
              {permissao === "default" && "Permissão de notificações não concedida"}
            </p>
          </div>
          <div className="flex gap-2">
            {!notificacoesAtivadas && (
              <button
                onClick={solicitarPermissao}
                className="bg-white text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
              >
                Ativar Notificações
              </button>
            )}
            {notificacoesAtivadas && (
              <button
                onClick={testarNotificacao}
                className="bg-white/20 hover:bg-white/30 px-6 py-3 rounded-lg font-semibold transition"
              >
                Testar Notificação
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Adicionar Novo Lembrete */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md mb-6">
        <h3 className="text-lg font-bold text-gray-700 dark:text-gray-200 mb-4 flex items-center gap-2">
          <Plus className="text-purple-600" />
          Adicionar Novo Lembrete
        </h3>
        <div className="grid md:grid-cols-4 gap-4">
          <select
            value={novoLembrete.tipo}
            onChange={(e) => setNovoLembrete({ ...novoLembrete, tipo: e.target.value })}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-100"
          >
            <option value="agua">Hidratação</option>
            <option value="dados">Registrar Dados</option>
            <option value="treino">Treino</option>
            <option value="outro">Outro</option>
          </select>

          <input
            type="time"
            value={novoLembrete.horario}
            onChange={(e) => setNovoLembrete({ ...novoLembrete, horario: e.target.value })}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-100"
          />

          <input
            type="text"
            placeholder="Mensagem do lembrete"
            value={novoLembrete.mensagem}
            onChange={(e) => setNovoLembrete({ ...novoLembrete, mensagem: e.target.value })}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-100"
          />

          <button
            onClick={adicionarLembrete}
            className="bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition font-semibold flex items-center justify-center gap-2"
          >
            <Plus size={20} />
            Adicionar
          </button>
        </div>
      </div>

      {/* Lista de Lembretes */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md">
        <h3 className="text-lg font-bold text-gray-700 dark:text-gray-200 mb-4 flex items-center gap-2">
          <Clock className="text-purple-600" />
          Meus Lembretes ({lembretes.filter(l => l.ativo).length} ativos)
        </h3>

        {lembretes.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p>Nenhum lembrete configurado.</p>
            <p className="text-sm mt-2">Adicione lembretes para receber notificações!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {lembretes.map((lembrete) => (
              <div 
                key={lembrete.id} 
                className={`flex justify-between items-center p-4 rounded-xl border-2 transition ${
                  lembrete.ativo 
                    ? "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-700" 
                    : "bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 opacity-60"
                }`}
              >
                <div className="flex items-center gap-4 flex-1">
                  {getTipoIcon(lembrete.tipo)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-800 dark:text-gray-100">
                        {lembrete.horario}
                      </span>
                      <span className="text-xs bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 px-2 py-1 rounded">
                        {getTipoNome(lembrete.tipo)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      {lembrete.mensagem}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleLembrete(lembrete.id)}
                    className={`px-4 py-2 rounded-lg font-semibold transition ${
                      lembrete.ativo
                        ? "bg-green-500 text-white hover:bg-green-600"
                        : "bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-400 dark:hover:bg-gray-500"
                    }`}
                  >
                    {lembrete.ativo ? "Ativo" : "Inativo"}
                  </button>
                  <button
                    onClick={() => removerLembrete(lembrete.id)}
                    className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 p-2 transition"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Informações */}
      <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 p-6 rounded-2xl shadow-md border-2 border-blue-200 dark:border-blue-700">
        <h3 className="text-lg font-bold text-gray-700 dark:text-gray-200 mb-3">Como Funcionam as Notificações</h3>
        <ul className="space-y-2 text-gray-700 dark:text-gray-300 text-sm">
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span>As notificações aparecem no horário exato configurado</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span>Você receberá apenas uma notificação por lembrete por dia</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span>Mantenha a aba do navegador aberta para receber notificações</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span>Você pode ativar/desativar lembretes individuais sem excluí-los</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span>Use o botão "Testar" para verificar se as notificações estão funcionando</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
