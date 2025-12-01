import React, { useState } from 'react';
import { History, Trash2, Calculator, Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { StudentGrade } from '../types';

interface ClassHistoryProps {
  savedGrades: StudentGrade[];
  onClearHistory: () => void;
  turmaName?: string;
}

export const ClassHistory: React.FC<ClassHistoryProps> = ({
  savedGrades,
  onClearHistory,
  turmaName = "Turma",
}) => {
  const [analysis, setAnalysis] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [aiError, setAiError] = useState<string>('');

  const calculateAverage = () => {
    if (savedGrades.length === 0) return 0;
    const total = savedGrades.reduce((acc, curr) => acc + curr.total, 0);
    return total / savedGrades.length;
  };

  const confirmClear = () => {
    if (window.confirm('Tem certeza que deseja apagar todo o histórico da turma?')) {
      onClearHistory();
      setAnalysis('');
      setAiError('');
    }
  };

  const handleGenerateAnalysis = async () => {
    if (savedGrades.length === 0) return;

    setIsAnalyzing(true);
    setAiError('');
    setAnalysis('');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const gradesSummary = savedGrades.map(g => ({
        nome: g.studentName || "Aluno Anônimo",
        nota: g.total
      }));

      const average = calculateAverage().toFixed(1);
      const prompt = `
        Atue como um coordenador pedagógico experiente.
        Analise os dados desta turma: "${turmaName}".
        Média da turma: ${average}.
        Total de alunos: ${savedGrades.length}.
        Lista de notas: ${JSON.stringify(gradesSummary)}.

        Forneça um "Resumo Pedagógico" breve (máximo 3 frases) sobre o desempenho geral da turma. 
        Seja construtivo e destaque se o desempenho está acima, na média ou abaixo do esperado, sugerindo um ponto de atenção se necessário.
        Não use markdown ou formatação complexa, apenas texto corrido.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      setAnalysis(response.text || 'Não foi possível gerar a análise.');
    } catch (error) {
      console.error("Erro na análise IA:", error);
      setAiError('Falha ao conectar com a IA. Verifique sua chave API.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="bg-slate-800 text-slate-100 rounded-2xl shadow-xl p-6 flex flex-col h-[500px] md:h-auto border border-slate-700">
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
            <History size={24} />
          </div>
          <div>
            <h2 className="font-bold text-lg">Histórico</h2>
            <p className="text-xs text-slate-400">
              {savedGrades.length}{' '}
              {savedGrades.length === 1 ? 'aluno somado' : 'alunos somados'}
            </p>
          </div>
        </div>
        <button
          onClick={confirmClear}
          className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
          title="Limpar Histórico"
        >
          <Trash2 size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
        {savedGrades.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-600 gap-3 opacity-50">
            <Calculator size={48} />
            <p className="text-sm">As notas salvas aparecerão aqui.</p>
          </div>
        ) : (
          savedGrades.map((grade, index) => (
            <div
              key={grade.id}
              className="bg-slate-700/50 p-4 rounded-xl border border-slate-700 hover:border-slate-600 transition-colors group"
            >
              <div className="flex flex-col gap-1 mb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                      #{savedGrades.length - index}
                    </span>
                    {grade.studentName && (
                      <span className="font-semibold text-slate-200 text-sm">
                        {grade.studentName}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-slate-500">{grade.timestamp}</span>
                </div>
              </div>
              
              <div className="flex justify-between items-end">
                <div
                  className="text-xs text-slate-400 font-mono truncate max-w-[140px]"
                  title={grade.details}
                >
                  {grade.details}
                </div>
                <div className="text-2xl font-bold text-green-400">
                  {grade.total.toLocaleString('pt-BR', {
                    minimumFractionDigits: 1,
                  })}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* AI Analysis Section */}
      {savedGrades.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-700">
            {aiError && (
                <div className="mb-3 p-2 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-xs text-red-300">
                    <AlertCircle size={14} />
                    {aiError}
                </div>
            )}
            
            {analysis && (
                <div className="mb-4 p-3 bg-indigo-500/10 border border-indigo-500/30 rounded-lg">
                    <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold mb-1 uppercase tracking-wide">
                        <Sparkles size={12} />
                        Análise IA
                    </div>
                    <p className="text-sm text-indigo-100 leading-relaxed italic">
                        "{analysis}"
                    </p>
                </div>
            )}

            <div className="flex justify-between items-center text-sm text-slate-400 mb-3">
                <span>Média da Turma:</span>
                <span className="text-white font-bold">
                {calculateAverage().toLocaleString('pt-BR', {
                    maximumFractionDigits: 1,
                })}
                </span>
            </div>

            <button
                onClick={handleGenerateAnalysis}
                disabled={isAnalyzing}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-semibold text-white text-sm bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 transition-all shadow-lg shadow-indigo-900/20 disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {isAnalyzing ? (
                    <>
                        <Loader2 size={16} className="animate-spin" />
                        Analisando...
                    </>
                ) : (
                    <>
                        <Sparkles size={16} />
                        Gerar Análise Pedagógica
                    </>
                )}
            </button>
        </div>
      )}
    </div>
  );
};