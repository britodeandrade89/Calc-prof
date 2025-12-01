import React from 'react';
import { History, Trash2, Calculator } from 'lucide-react';
import { StudentGrade } from '../types';

interface ClassHistoryProps {
  savedGrades: StudentGrade[];
  onClearHistory: () => void;
}

export const ClassHistory: React.FC<ClassHistoryProps> = ({
  savedGrades,
  onClearHistory,
}) => {
  const calculateAverage = () => {
    if (savedGrades.length === 0) return 0;
    const total = savedGrades.reduce((acc, curr) => acc + curr.total, 0);
    return total / savedGrades.length;
  };

  const confirmClear = () => {
    if (window.confirm('Tem certeza que deseja apagar todo o histórico da turma?')) {
      onClearHistory();
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

      <div className="mt-4 pt-4 border-t border-slate-700 flex justify-between items-center text-sm text-slate-400">
        <span>Média da Turma:</span>
        <span className="text-white font-bold">
          {savedGrades.length > 0
            ? calculateAverage().toLocaleString('pt-BR', {
                maximumFractionDigits: 1,
              })
            : '-'}
        </span>
      </div>
    </div>
  );
};
