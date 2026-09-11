import React, { useState } from 'react';
import { Award, CheckCircle2, XCircle, ArrowRight, RotateCcw } from 'lucide-react';
import { QUIZ_QUESTIONS } from '../data/lessons';

export const LearnView: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(() => {
    return Number(localStorage.getItem('finmentor_xp') || 0);
  });

  const question = QUIZ_QUESTIONS[currentIndex];
  const isAnswered = selectedOption !== null;
  const isFinished = currentIndex >= QUIZ_QUESTIONS.length;

  const handleSelectOption = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);

    if (index === question.correctIndex) {
      const newScore = score + 50;
      setScore(newScore);
      localStorage.setItem('finmentor_xp', newScore.toString());
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setCurrentIndex(prev => prev + 1);
  };

  const handleRestart = () => {
    setSelectedOption(null);
    setCurrentIndex(0);
  };

  if (isFinished) {
    return (
      <div className="bg-[#131720] border border-[#212836] rounded-2xl p-6 text-center space-y-4 my-4 shadow-xl">
        <div className="w-14 h-14 bg-[#122b22] text-[#34d399] border border-[#1d4d3c] rounded-full flex items-center justify-center mx-auto">
          <Award className="w-7 h-7 stroke-2" />
        </div>
        <h3 className="text-base font-bold text-[#f1f5f9]">Модуль засвоєно</h3>
        <p className="text-xs text-[#818ea3] leading-relaxed">
          Всі тестові модулі пройдено. Зароблено досвіду: <span className="font-bold text-[#34d399]">{score} XP</span>.
        </p>
        <button
          onClick={handleRestart}
          className="w-full py-2.5 bg-[#1a202c] hover:bg-[#232b3b] text-[#38bdf8] text-xs font-semibold rounded-xl flex items-center justify-center gap-2 border border-[#2e384d] active:scale-95 transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Пройти ще раз</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="learn-hero rounded-3xl p-5 border border-sky-300/15">
        <div className="flex items-start justify-between gap-4">
          <div><span className="eyebrow">Фінансова грамотність</span><h2 className="text-xl font-bold text-slate-100 mt-2">Вчіться керувати грошима</h2><p className="text-xs text-slate-400 mt-1 leading-relaxed">Короткі модулі, які допомагають приймати сильні фінансові рішення.</p></div>
          <Award className="w-6 h-6 text-sky-300 shrink-0" />
        </div>
      </div>
      {/* Індикатор прогресу */}
      <div className="flex items-center justify-between p-3 bg-[#131720] border border-[#212836] rounded-xl">
        <div className="text-xs text-[#818ea3]">
          Модуль <span className="font-bold text-[#f1f5f9]">{currentIndex + 1}</span> / {QUIZ_QUESTIONS.length}
        </div>
        <div className="flex items-center gap-1.5 text-xs font-bold text-[#38bdf8] bg-[#102433] px-2.5 py-1 rounded-lg border border-[#1c4461]">
          <Award className="w-3.5 h-3.5" />
          <span>{score} XP</span>
        </div>
      </div>

      {/* Питання */}
      <div className="bg-[#131720] border border-[#212836] rounded-2xl p-5 space-y-4 shadow-xl">
        <span className="text-[10px] font-bold tracking-wider text-[#38bdf8] uppercase">
          {question.topic}
        </span>
        <h3 className="text-sm font-bold text-[#f1f5f9] leading-relaxed">
          {question.question}
        </h3>

        {/* Варіанти */}
        <div className="space-y-2 pt-1">
          {question.options.map((option, idx) => {
            const isSelected = selectedOption === idx;
            const isCorrect = idx === question.correctIndex;

            let buttonStyle = 'bg-[#0b0d11] border-[#212836] text-[#cbd5e1] hover:bg-[#161c27]';

            if (isAnswered) {
              if (isCorrect) {
                buttonStyle = 'bg-[#122b22] border-[#25634b] text-[#6ee7b7]';
              } else if (isSelected) {
                buttonStyle = 'bg-[#2d151c] border-[#5e2735] text-[#fca5a5]';
              } else {
                buttonStyle = 'bg-[#0b0d11]/40 border-[#1a202c] text-[#475569] opacity-50';
              }
            }

            return (
              <button
                key={idx}
                disabled={isAnswered}
                onClick={() => handleSelectOption(idx)}
                className={`w-full min-h-12 p-3 rounded-xl border text-left text-xs font-medium flex items-center justify-between transition-all ${buttonStyle}`}
              >
                <span>{option}</span>
                {isAnswered && isCorrect && <CheckCircle2 className="w-4 h-4 text-[#34d399] shrink-0 ml-2" />}
                {isAnswered && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-[#fb7185] shrink-0 ml-2" />}
              </button>
            );
          })}
        </div>

        {/* Пояснення */}
        {isAnswered && (
          <div className="p-3.5 bg-[#0b0d11] border border-[#212836] rounded-xl space-y-2 mt-3">
            <p className="text-[11px] font-bold text-[#38bdf8]">Коментар ментора:</p>
            <p className="text-xs text-[#94a3b8] leading-relaxed">
              {question.explanation}
            </p>
            <button
              onClick={handleNext}
              className="w-full mt-2 py-2.5 bg-[#1a202c] hover:bg-[#232b3b] border border-[#2e384d] text-[#38bdf8] font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all"
            >
              <span>Далі</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
