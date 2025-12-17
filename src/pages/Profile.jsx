import { useState, useEffect } from "react";

export default function Profile() {
  const [usuario, setUsuario] = useState({
    nome: "Yan Fellippe",
    idade: 24,
    altura: 1.70,
    pesoAtual: 0,
    meta: 78,
  });

  const [editando, setEditando] = useState(false);
  const [formData, setFormData] = useState(usuario);

  useEffect(() => {
    const perfilSalvo = localStorage.getItem("perfilUsuario");
    const dadosSaude = localStorage.getItem("dadosSaude");
    
    if (perfilSalvo) {
      const perfil = JSON.parse(perfilSalvo);
      setUsuario(perfil);
      setFormData(perfil);
    }
    
    if (dadosSaude) {
      const dados = JSON.parse(dadosSaude);
      setUsuario(prev => ({ ...prev, pesoAtual: dados.peso, altura: dados.altura }));
    }
  }, []);

  const salvarPerfil = (e) => {
    e.preventDefault();
    setUsuario(formData);
    localStorage.setItem("perfilUsuario", JSON.stringify(formData));
    setEditando(false);
  };

  const calcularIMC = () => {
    if (!usuario.pesoAtual || !usuario.altura) return 0;
    return (usuario.pesoAtual / (usuario.altura * usuario.altura)).toFixed(1);
  };

  const imc = calcularIMC();

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md max-w-lg mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-700">Perfil do Usuário</h2>
        <button
          onClick={() => setEditando(!editando)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
        >
          {editando ? "Cancelar" : "Editar"}
        </button>
      </div>

      {editando ? (
        <form onSubmit={salvarPerfil} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
            <input
              type="text"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Idade</label>
            <input
              type="number"
              value={formData.idade}
              onChange={(e) => setFormData({ ...formData, idade: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Altura (m)</label>
            <input
              type="number"
              step="0.01"
              value={formData.altura}
              onChange={(e) => setFormData({ ...formData, altura: parseFloat(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Peso atual (kg)</label>
            <input
              type="number"
              step="0.1"
              value={formData.pesoAtual}
              onChange={(e) => setFormData({ ...formData, pesoAtual: parseFloat(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Meta de peso (kg)</label>
            <input
              type="number"
              step="0.1"
              value={formData.meta}
              onChange={(e) => setFormData({ ...formData, meta: parseFloat(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition font-semibold"
          >
            Salvar Alterações
          </button>
        </form>
      ) : (
        <div className="space-y-3">
          <p><strong>Nome:</strong> {usuario.nome}</p>
          <p><strong>Idade:</strong> {usuario.idade} anos</p>
          <p><strong>Altura:</strong> {usuario.altura} m</p>
          <p><strong>Peso atual:</strong> {usuario.pesoAtual > 0 ? `${usuario.pesoAtual} kg` : "Não registrado"}</p>
          <p><strong>Meta de peso:</strong> {usuario.meta} kg</p>
          {usuario.pesoAtual > 0 && (
            <>
              <p><strong>IMC atual:</strong> {imc}</p>
              <p className="mt-4 text-green-600 font-semibold">
                {usuario.pesoAtual > usuario.meta 
                  ? `Você está a ${(usuario.pesoAtual - usuario.meta).toFixed(1)} kg da sua meta!`
                  : usuario.pesoAtual < usuario.meta
                  ? `Você ultrapassou sua meta em ${(usuario.meta - usuario.pesoAtual).toFixed(1)} kg!`
                  : "Você atingiu sua meta!"}
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}