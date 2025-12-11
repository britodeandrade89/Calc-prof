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
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col">
      {/* Main Content Area with Padding */}
      <div className="flex-grow p-4 md:p-8">
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

      {/* Footer - Full Width Dark Theme */}
      <footer className="w-full bg-[#1a1a1a] text-slate-400 mt-8 pt-12 pb-8 border-t border-slate-800">
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-2 md:grid-cols-3 gap-8 mb-10 text-xs tracking-wide">
          <div>
            <h3 className="text-white font-bold mb-4 uppercase tracking-wider">Calculadora</h3>
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-white transition-colors">Sobre nós</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Novidades</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-bold mb-4 uppercase tracking-wider">Termos</h3>
            <ul className="space-y-3">
               <li><a href="#" className="hover:text-white transition-colors">Política de Privacidade</a></li>
               <li><a href="#" className="hover:text-white transition-colors">Termos e Condições</a></li>
            </ul>
          </div>

          <div>
             <h3 className="text-white font-bold mb-4 uppercase tracking-wider">Ajuda</h3>
             <ul className="space-y-3">
               <li><a href="#" className="hover:text-white transition-colors">Fale Conosco</a></li>
               <li><a href="#" className="hover:text-white transition-colors">Suporte</a></li>
             </ul>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 pt-8 border-t border-slate-800/50 flex flex-col items-center text-center">
            <p className="text-slate-300 text-sm font-medium mb-1">
              Desenvolvido por: <strong className="text-white">André Brito</strong>
            </p>
            <p className="text-xs text-slate-500 mb-4">Versão: 1.0</p>
            
            <div className="flex flex-col items-center gap-1 text-sm mb-6 text-slate-300">
                <a href="mailto:britodeandrade@gmail.com" className="hover:text-white transition-colors">Contato: britodeandrade@gmail.com</a>
                <span className="hover:text-white transition-colors">+55 21 994 527 694</span>
            </div>

            <p className="text-[10px] text-slate-600 uppercase tracking-wider">© 2025 Calculadora de Professores.</p>
        </div>
      </footer>
    </div>
  );
}