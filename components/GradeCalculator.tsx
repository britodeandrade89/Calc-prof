import React, { useState, useRef, useEffect } from 'react';
import { Plus, Save, RotateCcw } from 'lucide-react';
import { HistoryItem, StudentGrade } from '../types';

interface GradeCalculatorProps {
  turma: string;
  setTurma: (value: string) => void;
  onSaveStudent: (grade: StudentGrade) => void;
}

export const GradeCalculator: React.FC<GradeCalculatorProps> = ({
  turma,
  setTurma,
  onSaveStudent,
}) => {
  const [inputValue, setInputValue] = useState<string>('');
  const [studentName, setStudentName] = useState<string>('');
  const [currentSum, setCurrentSum] = useState<number>(0);
  const [currentHistory, setCurrentHistory] = useState<HistoryItem[]>([]);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const studentNameRef = useRef<HTMLInputElement>(null);

  // Keep focus on grade input when adding items
  useEffect(() => {
    if (currentHistory.length > 0 && inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentHistory]);

  // Initial focus
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const processInput = () => {
    if (!inputValue) return;

    let rawValue = inputValue.replace(',', '.');
    let number = parseFloat(rawValue);

    if (isNaN(number)) {
      setInputValue('');
      return;
    }

    // Logic: If integer (no dot/comma), divide by 10.
    // E.g., 78 -> 7.8, 100 -> 10.0, 5 -> 0.5
    // If user explicitly types dot/comma (7.5), respect it.
    if (!inputValue.includes(',') && !inputValue.includes('.')) {
      number = number / 10;
    }

    const newHistoryItem: HistoryItem = {
      id: Date.now(),
      value: number,
      originalInput: inputValue,
    };

    setCurrentHistory((prev) => [...prev, newHistoryItem]);
    // Fix float precision issues by re-parsing fixed string
    setCurrentSum((prev) => parseFloat((prev + number).toFixed(2)));
    setInputValue('');
  };

  const handleSave = () => {
    if (currentSum === 0 && currentHistory.length === 0) return;

    const newGrade: StudentGrade = {
      id: Date.now(),
      studentName: studentName.trim() || undefined,
      total: currentSum,
      details: currentHistory.map((h) => h.value).join(' + '),
      timestamp: new Date().toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    onSaveStudent(newGrade);
    
    // Check if user was using name input to decide focus for next turn
    const wasUsingName = studentName.trim().length > 0;
    resetCurrent(wasUsingName);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Plus keys (Desktop/Numpad) - Enter is handled by form submit now
    if (e.key === '+' || e.key === 'NumpadAdd') {
      e.preventDefault();
      processInput();
    }

    // Space shortcut to save (only if input is empty and we have a sum)
    if (e.key === ' ' && inputValue === '' && currentSum > 0) {
      e.preventDefault();
      handleSave();
    }
  };

  const handleNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  const resetCurrent = (focusName: boolean = false) => {
    setCurrentSum(0);
    setCurrentHistory([]);
    setInputValue('');
    setStudentName('');
    
    // Defer focus slightly to ensure render updates are processed
    setTimeout(() => {
        if (focusName && studentNameRef.current) {
            studentNameRef.current.focus();
        } else if (inputRef.current) {
            inputRef.current.focus();
        }
    }, 0);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 flex flex-col h-full border border-slate-200">
      {/* Inputs Header */}
      <div className="flex flex-col gap-4 mb-6">
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
            Turma / Disciplina
          </label>
          <input
            type="text"
            value={turma}
            onChange={(e) => setTurma(e.target.value)}
            placeholder="Ex: 8º Ano B"
            className="w-full text-lg font-semibold text-slate-700 placeholder-slate-300 border-b-2 border-slate-200 focus:border-blue-500 outline-none transition-colors bg-transparent pb-1"
          />
        </div>
        
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
            Nome do Aluno <span className="text-slate-300 font-normal normal-case">(Opcional)</span>
          </label>
          <input
            ref={studentNameRef}
            type="text"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            onKeyDown={handleNameKeyDown}
            placeholder="Ex: João Silva"
            className="w-full text-lg text-slate-700 placeholder-slate-300 border-b-2 border-slate-200 focus:border-blue-500 outline-none transition-colors bg-transparent pb-1"
          />
        </div>
      </div>

      {/* Main Display */}
      <div className="flex-1 flex flex-col items-center justify-center py-6 bg-slate-50 rounded-xl border border-slate-100 mb-6">
        <span className="text-sm text-slate-500 font-medium mb-2">
          Nota Atual (Soma)
        </span>
        <div className="text-7xl font-bold text-blue-600 tracking-tight">
          {currentSum.toLocaleString('pt-BR', {
            minimumFractionDigits: 1,
            maximumFractionDigits: 2,
          })}
        </div>
        {currentHistory.length > 0 && (
          <div className="mt-4 text-sm text-slate-400 font-mono text-center px-4 max-h-20 overflow-y-auto custom-scrollbar">
            {currentHistory.map((h, idx) => (
              <span key={h.id}>
                {idx > 0 && ' + '}
                {h.value.toLocaleString('pt-BR')}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Input Area */}
      <form
        className="relative mb-4"
        onSubmit={(e) => {
          e.preventDefault();
          processInput();
        }}
      >
        <input
          ref={inputRef}
          type="number"
          inputMode="decimal"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Nota (ex: 78 = 7.8)"
          className="w-full h-20 pl-6 pr-20 text-4xl font-mono bg-white border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all placeholder:text-slate-200"
        />
        <button
          type="submit"
          className="absolute right-3 top-3 bottom-3 aspect-square bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center transition-colors shadow-sm"
          title="Adicionar (Enter ou +)"
        >
          <Plus size={32} />
        </button>
      </form>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3 mt-auto">
        <button
          onClick={() => resetCurrent(false)}
          className="flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold text-slate-500 bg-slate-100 hover:bg-slate-200 hover:text-slate-700 transition-colors"
        >
          <RotateCcw size={18} />
          Zerar
        </button>
        <button
          onClick={handleSave}
          disabled={currentSum === 0}
          className={`flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold text-white transition-all shadow-md
            ${
              currentSum > 0
                ? 'bg-green-600 hover:bg-green-700 hover:scale-[1.02]'
                : 'bg-slate-300 cursor-not-allowed'
            }
          `}
        >
          <Save size={18} />
          Salvar
        </button>
      </div>
    </div>
  );
};
