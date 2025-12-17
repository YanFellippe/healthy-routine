import { useState } from "react";
import { Scale } from "lucide-react";

export default function IMCCard({ imc, classificacao }) {
  const [mostrarTabela, setMostrarTabela] = useState(false);

  return (
    <div 
      className="bg-white p-4 rounded-2xl shadow-md w-64 text-center relative"
      onMouseEnter={() => setMostrarTabela(true)}
      onMouseLeave={() => setMostrarTabela(false)}
    >
      <div className="flex justify-center mb-2">
        <Scale className="text-green-600" size={32} />
      </div>
      <h3 className="text-lg font-semibold">IMC</h3>
      <p className="text-2xl font-bold text-green-700">
        {imc}
      </p>
      <p className={`text-sm font-semibold mt-1 ${classificacao.cor}`}>
        {classificacao.texto}
      </p>

      {mostrarTabela && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-xl p-4 z-10 w-72">
          <h4 className="font-bold text-gray-800 mb-3 text-sm">Tabela de Classificação IMC</h4>
          <div className="space-y-2 text-left text-xs">
            <div className="flex justify-between items-center p-2 bg-yellow-50 rounded">
              <span className="font-medium">Abaixo do peso</span>
              <span className="text-yellow-700 font-semibold">&lt; 18,5</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-green-50 rounded">
              <span className="font-medium">Peso normal</span>
              <span className="text-green-700 font-semibold">18,5 - 24,9</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-orange-50 rounded">
              <span className="font-medium">Sobrepeso</span>
              <span className="text-orange-700 font-semibold">25,0 - 29,9</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-red-50 rounded">
              <span className="font-medium">Obesidade Grau I</span>
              <span className="text-red-700 font-semibold">30,0 - 34,9</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-red-100 rounded">
              <span className="font-medium">Obesidade Grau II</span>
              <span className="text-red-800 font-semibold">35,0 - 39,9</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-red-200 rounded">
              <span className="font-medium">Obesidade Grau III</span>
              <span className="text-red-900 font-semibold">≥ 40,0</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
