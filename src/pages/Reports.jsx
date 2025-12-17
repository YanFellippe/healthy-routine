import { useState, useEffect } from "react";
import { Trash2, Download, FileText, FileSpreadsheet } from "lucide-react";
import { 
  exportHealthToPDF, 
  exportHealthToCSV, 
  exportHydrationToPDF, 
  exportHydrationToCSV,
  exportCompletePDF 
} from "../utils/exportData";

export default function Reports() {
  const [historico, setHistorico] = useState([]);

  useEffect(() => {
    const historicoSalvo = localStorage.getItem("historicoSaude");
    if (historicoSalvo) {
      setHistorico(JSON.parse(historicoSalvo));
    }
  }, []);

  const limparHistorico = () => {
    if (window.confirm("Tem certeza que deseja limpar todo o histórico?")) {
      localStorage.removeItem("historicoSaude");
      setHistorico([]);
    }
  };

  const excluirRegistro = (index) => {
    const novoHistorico = historico.filter((_, i) => i !== index);
    setHistorico(novoHistorico);
    localStorage.setItem("historicoSaude", JSON.stringify(novoHistorico));
  };

  const getClassificacaoIMC = (imc) => {
    if (imc < 18.5) return { texto: "Abaixo do peso", cor: "text-yellow-600" };
    if (imc < 25) return { texto: "Peso normal", cor: "text-green-600" };
    if (imc < 30) return { texto: "Sobrepeso", cor: "text-orange-600" };
    return { texto: "Obesidade", cor: "text-red-600" };
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-200">Histórico de Registros</h2>
        <div className="flex gap-2">
          {historico.length > 0 && (
            <button
              onClick={limparHistorico}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition flex items-center gap-2"
            >
              <Trash2 size={18} />
              Limpar
            </button>
          )}
        </div>
      </div>

      {/* Botões de Exportação */}
      {historico.length > 0 && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md mb-6">
          <h3 className="text-lg font-bold text-gray-700 dark:text-gray-200 mb-4 flex items-center gap-2">
            <Download className="text-green-600" />
            Exportar Dados
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <button
              onClick={exportCompletePDF}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-4 rounded-xl hover:from-green-600 hover:to-emerald-700 transition flex items-center justify-center gap-3 font-semibold shadow-lg"
            >
              <FileText size={24} />
              <div className="text-left">
                <div>Relatório Completo</div>
                <div className="text-xs opacity-90">PDF com todos os dados</div>
              </div>
            </button>

            <button
              onClick={exportHealthToPDF}
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-4 rounded-xl hover:from-blue-600 hover:to-blue-700 transition flex items-center justify-center gap-3 font-semibold shadow-lg"
            >
              <FileText size={24} />
              <div className="text-left">
                <div>Saúde (PDF)</div>
                <div className="text-xs opacity-90">Peso, pressão, IMC</div>
              </div>
            </button>

            <button
              onClick={exportHealthToCSV}
              className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-4 rounded-xl hover:from-purple-600 hover:to-purple-700 transition flex items-center justify-center gap-3 font-semibold shadow-lg"
            >
              <FileSpreadsheet size={24} />
              <div className="text-left">
                <div>Saúde (CSV)</div>
                <div className="text-xs opacity-90">Excel/Planilhas</div>
              </div>
            </button>

            <button
              onClick={exportHydrationToPDF}
              className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-white px-6 py-4 rounded-xl hover:from-cyan-600 hover:to-cyan-700 transition flex items-center justify-center gap-3 font-semibold shadow-lg"
            >
              <FileText size={24} />
              <div className="text-left">
                <div>Hidratação (PDF)</div>
                <div className="text-xs opacity-90">Histórico de água</div>
              </div>
            </button>

            <button
              onClick={exportHydrationToCSV}
              className="bg-gradient-to-r from-teal-500 to-teal-600 text-white px-6 py-4 rounded-xl hover:from-teal-600 hover:to-teal-700 transition flex items-center justify-center gap-3 font-semibold shadow-lg"
            >
              <FileSpreadsheet size={24} />
              <div className="text-left">
                <div>Hidratação (CSV)</div>
                <div className="text-xs opacity-90">Excel/Planilhas</div>
              </div>
            </button>

            <div className="bg-gradient-to-r from-orange-100 to-orange-50 dark:from-orange-900/30 dark:to-orange-800/20 p-4 rounded-xl border-2 border-orange-200 dark:border-orange-700">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <strong>💡 Dica:</strong> Use CSV para abrir no Excel ou Google Sheets. Use PDF para relatórios impressos.
              </p>
            </div>
          </div>
        </div>
      )}

      {historico.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl shadow-md text-center">
          <p className="text-gray-500 text-lg">Nenhum registro encontrado.</p>
          <p className="text-gray-400 mt-2">Adicione seus dados de saúde no painel principal.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {historico.map((registro, index) => {
            const classificacao = getClassificacaoIMC(registro.imc);
            return (
              <div key={index} className="bg-white p-4 rounded-2xl shadow-md">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-gray-600 text-sm font-semibold mb-2">{registro.data}</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div>
                        <p className="text-xs text-gray-500">Peso</p>
                        <p className="font-semibold text-gray-800">{registro.peso} kg</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Pressão</p>
                        <p className="font-semibold text-gray-800">{registro.pressao} mmHg</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Frequência</p>
                        <p className="font-semibold text-gray-800">{registro.frequencia} bpm</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">IMC</p>
                        <p className="font-semibold text-gray-800">{registro.imc}</p>
                        <p className={`text-xs font-semibold ${classificacao.cor}`}>
                          {classificacao.texto}
                        </p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => excluirRegistro(index)}
                    className="ml-4 text-red-500 hover:text-red-700 transition"
                    title="Excluir registro"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {historico.length > 0 && (
        <div className="mt-6 bg-blue-50 p-4 rounded-2xl">
          <h3 className="font-semibold text-gray-700 mb-2">Estatísticas</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">Total de registros</p>
              <p className="text-xl font-bold text-blue-600">{historico.length}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Peso médio</p>
              <p className="text-xl font-bold text-blue-600">
                {(historico.reduce((acc, r) => acc + r.peso, 0) / historico.length).toFixed(1)} kg
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Frequência média</p>
              <p className="text-xl font-bold text-blue-600">
                {Math.round(historico.reduce((acc, r) => acc + r.frequencia, 0) / historico.length)} bpm
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
