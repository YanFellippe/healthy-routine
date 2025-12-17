import jsPDF from "jspdf";
import "jspdf-autotable";

// Exportar para CSV
export const exportToCSV = (data, filename = "dados_saude.csv") => {
  if (!data || data.length === 0) {
    alert("Não há dados para exportar!");
    return;
  }

  // Criar cabeçalhos
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(","),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Escapar vírgulas e aspas
        if (typeof value === "string" && (value.includes(",") || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(",")
    )
  ].join("\n");

  // Adicionar BOM para UTF-8
  const BOM = "\uFEFF";
  const blob = new Blob([BOM + csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Exportar histórico de saúde para PDF
export const exportHealthToPDF = () => {
  const historico = JSON.parse(localStorage.getItem("historicoSaude") || "[]");
  const perfil = JSON.parse(localStorage.getItem("perfilUsuario") || "{}");

  if (historico.length === 0) {
    alert("Não há dados para exportar!");
    return;
  }

  const doc = new jsPDF();
  
  // Título
  doc.setFontSize(20);
  doc.setTextColor(22, 163, 74); // Verde
  doc.text("Relatório de Saúde", 105, 20, { align: "center" });
  
  // Informações do perfil
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(`Nome: ${perfil.nome || "Não informado"}`, 20, 35);
  doc.text(`Idade: ${perfil.idade || "N/A"} anos`, 20, 42);
  doc.text(`Altura: ${perfil.altura || "N/A"} m`, 20, 49);
  doc.text(`Meta de Peso: ${perfil.meta || "N/A"} kg`, 20, 56);
  
  // Data do relatório
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Gerado em: ${new Date().toLocaleString("pt-BR")}`, 20, 63);
  
  // Tabela de dados
  const tableData = historico.map(item => [
    new Date(item.data.split(",")[0].split("/").reverse().join("-")).toLocaleDateString("pt-BR"),
    item.peso,
    item.pressao,
    item.frequencia,
    item.imc
  ]);

  doc.autoTable({
    startY: 70,
    head: [["Data", "Peso (kg)", "Pressão (mmHg)", "Frequência (bpm)", "IMC"]],
    body: tableData,
    theme: "grid",
    headStyles: { fillColor: [22, 163, 74] },
    styles: { fontSize: 9 },
    margin: { top: 70 }
  });

  // Estatísticas
  const pesoMedio = (historico.reduce((acc, d) => acc + d.peso, 0) / historico.length).toFixed(1);
  const freqMedia = Math.round(historico.reduce((acc, d) => acc + d.frequencia, 0) / historico.length);
  const imcMedio = (historico.reduce((acc, d) => acc + d.imc, 0) / historico.length).toFixed(1);

  const finalY = doc.lastAutoTable.finalY + 10;
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text("Estatísticas Gerais:", 20, finalY);
  doc.setFontSize(10);
  doc.text(`• Total de registros: ${historico.length}`, 20, finalY + 7);
  doc.text(`• Peso médio: ${pesoMedio} kg`, 20, finalY + 14);
  doc.text(`• Frequência cardíaca média: ${freqMedia} bpm`, 20, finalY + 21);
  doc.text(`• IMC médio: ${imcMedio}`, 20, finalY + 28);

  // Salvar PDF
  doc.save(`relatorio_saude_${new Date().toISOString().split("T")[0]}.pdf`);
};

// Exportar histórico de hidratação para PDF
export const exportHydrationToPDF = () => {
  const historico = JSON.parse(localStorage.getItem("historicoHidratacao") || "[]");

  if (historico.length === 0) {
    alert("Não há dados de hidratação para exportar!");
    return;
  }

  const doc = new jsPDF();
  
  doc.setFontSize(20);
  doc.setTextColor(59, 130, 246); // Azul
  doc.text("Relatório de Hidratação", 105, 20, { align: "center" });
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Gerado em: ${new Date().toLocaleString("pt-BR")}`, 20, 30);
  
  const tableData = historico.map(item => [
    new Date(item.data).toLocaleDateString("pt-BR"),
    item.copos,
    item.meta,
    (item.copos * 0.25).toFixed(2),
    item.atingiuMeta ? "Sim" : "Não"
  ]);

  doc.autoTable({
    startY: 40,
    head: [["Data", "Copos", "Meta", "Litros", "Meta Atingida"]],
    body: tableData,
    theme: "grid",
    headStyles: { fillColor: [59, 130, 246] },
    styles: { fontSize: 9 }
  });

  const mediaCopos = (historico.reduce((acc, d) => acc + d.copos, 0) / historico.length).toFixed(1);
  const diasComMeta = historico.filter(d => d.atingiuMeta).length;

  const finalY = doc.lastAutoTable.finalY + 10;
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text("Estatísticas:", 20, finalY);
  doc.setFontSize(10);
  doc.text(`• Total de dias registrados: ${historico.length}`, 20, finalY + 7);
  doc.text(`• Média de copos por dia: ${mediaCopos}`, 20, finalY + 14);
  doc.text(`• Dias com meta atingida: ${diasComMeta} (${((diasComMeta/historico.length)*100).toFixed(0)}%)`, 20, finalY + 21);

  doc.save(`relatorio_hidratacao_${new Date().toISOString().split("T")[0]}.pdf`);
};

// Exportar relatório completo
export const exportCompletePDF = () => {
  const historico = JSON.parse(localStorage.getItem("historicoSaude") || "[]");
  const perfil = JSON.parse(localStorage.getItem("perfilUsuario") || "{}");
  const hidratacao = JSON.parse(localStorage.getItem("historicoHidratacao") || "[]");

  const doc = new jsPDF();
  
  // Página 1: Informações Gerais
  doc.setFontSize(24);
  doc.setTextColor(22, 163, 74);
  doc.text("Relatório Completo de Saúde", 105, 30, { align: "center" });
  
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text("Informações Pessoais", 20, 50);
  doc.setFontSize(10);
  doc.text(`Nome: ${perfil.nome || "Não informado"}`, 20, 60);
  doc.text(`Idade: ${perfil.idade || "N/A"} anos`, 20, 67);
  doc.text(`Altura: ${perfil.altura || "N/A"} m`, 20, 74);
  doc.text(`Peso Atual: ${perfil.pesoAtual || "N/A"} kg`, 20, 81);
  doc.text(`Meta de Peso: ${perfil.meta || "N/A"} kg`, 20, 88);
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Relatório gerado em: ${new Date().toLocaleString("pt-BR")}`, 20, 100);

  // Resumo Geral
  if (historico.length > 0) {
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text("Resumo de Saúde", 20, 115);
    doc.setFontSize(10);
    doc.text(`• Total de registros: ${historico.length}`, 20, 125);
    
    const pesoMedio = (historico.reduce((acc, d) => acc + d.peso, 0) / historico.length).toFixed(1);
    const freqMedia = Math.round(historico.reduce((acc, d) => acc + d.frequencia, 0) / historico.length);
    const imcMedio = (historico.reduce((acc, d) => acc + d.imc, 0) / historico.length).toFixed(1);
    
    doc.text(`• Peso médio: ${pesoMedio} kg`, 20, 132);
    doc.text(`• Frequência cardíaca média: ${freqMedia} bpm`, 20, 139);
    doc.text(`• IMC médio: ${imcMedio}`, 20, 146);
  }

  if (hidratacao.length > 0) {
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text("Resumo de Hidratação", 20, 161);
    doc.setFontSize(10);
    
    const mediaCopos = (hidratacao.reduce((acc, d) => acc + d.copos, 0) / hidratacao.length).toFixed(1);
    const diasComMeta = hidratacao.filter(d => d.atingiuMeta).length;
    
    doc.text(`• Dias registrados: ${hidratacao.length}`, 20, 171);
    doc.text(`• Média de copos/dia: ${mediaCopos}`, 20, 178);
    doc.text(`• Taxa de sucesso: ${((diasComMeta/hidratacao.length)*100).toFixed(0)}%`, 20, 185);
  }

  // Página 2: Histórico de Saúde
  if (historico.length > 0) {
    doc.addPage();
    doc.setFontSize(16);
    doc.setTextColor(22, 163, 74);
    doc.text("Histórico de Saúde", 20, 20);
    
    const tableData = historico.slice(0, 30).map(item => [
      new Date(item.data.split(",")[0].split("/").reverse().join("-")).toLocaleDateString("pt-BR"),
      item.peso,
      item.pressao,
      item.frequencia,
      item.imc
    ]);

    doc.autoTable({
      startY: 30,
      head: [["Data", "Peso (kg)", "Pressão", "Freq (bpm)", "IMC"]],
      body: tableData,
      theme: "grid",
      headStyles: { fillColor: [22, 163, 74] },
      styles: { fontSize: 8 }
    });
  }

  // Página 3: Histórico de Hidratação
  if (hidratacao.length > 0) {
    doc.addPage();
    doc.setFontSize(16);
    doc.setTextColor(59, 130, 246);
    doc.text("Histórico de Hidratação", 20, 20);
    
    const tableData = hidratacao.slice(0, 30).map(item => [
      new Date(item.data).toLocaleDateString("pt-BR"),
      item.copos,
      item.meta,
      (item.copos * 0.25).toFixed(2),
      item.atingiuMeta ? "✓" : "✗"
    ]);

    doc.autoTable({
      startY: 30,
      head: [["Data", "Copos", "Meta", "Litros", "Atingiu"]],
      body: tableData,
      theme: "grid",
      headStyles: { fillColor: [59, 130, 246] },
      styles: { fontSize: 8 }
    });
  }

  doc.save(`relatorio_completo_${new Date().toISOString().split("T")[0]}.pdf`);
};

// Exportar histórico de saúde para CSV
export const exportHealthToCSV = () => {
  const historico = JSON.parse(localStorage.getItem("historicoSaude") || "[]");
  
  if (historico.length === 0) {
    alert("Não há dados para exportar!");
    return;
  }

  const data = historico.map(item => ({
    Data: item.data,
    "Peso (kg)": item.peso,
    "Pressão (mmHg)": item.pressao,
    "Frequência (bpm)": item.frequencia,
    IMC: item.imc,
    "Altura (m)": item.altura
  }));

  exportToCSV(data, `historico_saude_${new Date().toISOString().split("T")[0]}.csv`);
};

// Exportar hidratação para CSV
export const exportHydrationToCSV = () => {
  const historico = JSON.parse(localStorage.getItem("historicoHidratacao") || "[]");
  
  if (historico.length === 0) {
    alert("Não há dados de hidratação para exportar!");
    return;
  }

  const data = historico.map(item => ({
    Data: new Date(item.data).toLocaleDateString("pt-BR"),
    Copos: item.copos,
    Meta: item.meta,
    "Litros": (item.copos * 0.25).toFixed(2),
    "Meta Atingida": item.atingiuMeta ? "Sim" : "Não"
  }));

  exportToCSV(data, `historico_hidratacao_${new Date().toISOString().split("T")[0]}.csv`);
};
