import React, { useState } from 'react';
import { GradeCalculator } from './components/GradeCalculator';
import { ClassHistory } from './components/ClassHistory';
import { StudentGrade } from './types';
import { GraduationCap } from 'lucide-react';

export default function App() {
  const [turma, setTurma] = useState<string>('');
  const [savedGrades, setSavedGrades] = useState<StudentGrade[]>([]);

  const handleSaveStudent = (newGrade: StudentGrade) => {
    setSavedGrades((prev) => [newGrade, ...prev]);
  };

  const handleClearHistory = () => {
    setSavedGrades([]);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans p-4 md:p-8">
      {/* Header / Logo Section */}
      <div className="max-w-4xl mx-auto mb-4 md:mb-8 flex items-center gap-4">
        <div className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-600/20 text-white transform rotate-3">
          <GraduationCap size={32} strokeWidth={2.5} />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">
            Calculadora de Professores
          </h1>
          <p className="text-slate-500 font-medium text-sm">
            Fechamento de notas ágil e simples
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 h-auto md:h-[600px]">
        
        {/* LEFT SIDE: CALCULATOR */}
        <GradeCalculator 
          turma={turma} 
          setTurma={setTurma} 
          onSaveStudent={handleSaveStudent} 
        />

        {/* RIGHT SIDE: HISTORY */}
        <ClassHistory 
          savedGrades={savedGrades} 
          onClearHistory={handleClearHistory}
          turmaName={turma}
        />

      </div>
    </div>
  );
}