import React, { useMemo, useState } from 'react';
import { Award, CheckCircle2, XCircle, ArrowRight, RotateCcw, BookOpen, Clock3, ChevronDown, Search, Sparkles } from 'lucide-react';
import { GLOSSARY, LEARNING_ARTICLES, QUIZ_QUESTIONS } from '../data/lessons';
import type { LearningArticle } from '../data/lessons';

const accentStyles: Record<string, string> = {
  sky: 'bg-sky-400/10 text-sky-300 border-sky-300/15',
  emerald: 'bg-emerald-400/10 text-emerald-300 border-emerald-300/15',
  amber: 'bg-amber-400/10 text-amber-300 border-amber-300/15',
  violet: 'bg-violet-400/10 text-violet-300 border-violet-300/15',
  rose: 'bg-rose-400/10 text-rose-300 border-rose-300/15'
};

const ArticleReader: React.FC<{ article: LearningArticle; onBack: () => void }> = ({ article, onBack }) => (
  <article className="space-y-4">
    <button onClick={onBack} className="text-xs font-semibold text-sky-300 hover:text-sky-200">← Назад до бібліотеки</button>
    <div className={`rounded-3xl border p-5 ${accentStyles[article.accent]}`}>
      <span className="text-[10px] font-bold uppercase tracking-[0.18em]">{article.category}</span>
      <h2 className="mt-3 text-xl font-bold leading-tight text-slate-100">{article.title}</h2>
      <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-400"><Clock3 className="h-3.5 w-3.5" /> {article.readTime} читання</div>
    </div>
    <div className="rounded-2xl border border-[#212836] bg-[#131720] p-5 shadow-xl">
      <p className="mb-5 text-sm leading-relaxed text-slate-300">{article.summary}</p>
      <div className="space-y-5">
        {article.sections.map((section, index) => <section key={section.heading}>
          <div className="mb-2 flex items-center gap-2"><span className="flex h-5 w-5 items-center justify-center rounded-full bg-sky-400/10 text-[10px] font-bold text-sky-300">{index + 1}</span><h3 className="text-sm font-bold text-slate-100">{section.heading}</h3></div>
          <p className="pl-7 text-xs leading-6 text-slate-400">{section.body}</p>
        </section>)}
      </div>
    </div>
  </article>
);

export const LearnView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'library' | 'quiz' | 'glossary'>('library');
  const [selectedArticle, setSelectedArticle] = useState<LearningArticle | null>(null);
  const [query, setQuery] = useState('');
  const [openTerm, setOpenTerm] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(() => Number(localStorage.getItem('finmentor_xp') || 0));
  const question = QUIZ_QUESTIONS[currentIndex];
  const filteredArticles = useMemo(() => LEARNING_ARTICLES.filter(article => `${article.title} ${article.category} ${article.summary}`.toLowerCase().includes(query.toLowerCase())), [query]);
  const isAnswered = selectedOption !== null;
  const isFinished = currentIndex >= QUIZ_QUESTIONS.length;

  const handleSelectOption = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    if (index === question.correctIndex) { const newScore = score + 50; setScore(newScore); localStorage.setItem('finmentor_xp', newScore.toString()); }
  };

  if (selectedArticle) return <ArticleReader article={selectedArticle} onBack={() => setSelectedArticle(null)} />;

  return <div className="space-y-4">
    <div className="learn-hero rounded-3xl border border-sky-300/15 p-5">
      <div className="flex items-start justify-between gap-4"><div><span className="eyebrow">Фінансова грамотність</span><h2 className="mt-2 text-xl font-bold text-slate-100">Вчіться керувати грошима</h2><p className="mt-1 text-xs leading-relaxed text-slate-400">Статті, короткі підказки та тести для сильніших фінансових рішень.</p></div><Sparkles className="h-6 w-6 shrink-0 text-sky-300" /></div>
      <div className="mt-4 grid grid-cols-3 gap-2"><div className="rounded-xl bg-black/15 p-2.5"><p className="text-lg font-bold text-slate-100">{LEARNING_ARTICLES.length}</p><p className="text-[10px] text-slate-400">статей</p></div><div className="rounded-xl bg-black/15 p-2.5"><p className="text-lg font-bold text-slate-100">{GLOSSARY.length}</p><p className="text-[10px] text-slate-400">термінів</p></div><div className="rounded-xl bg-black/15 p-2.5"><p className="text-lg font-bold text-slate-100">{score}</p><p className="text-[10px] text-slate-400">XP зароблено</p></div></div>
    </div>

    <div className="flex gap-1 rounded-xl border border-[#212836] bg-[#0f131b] p-1">
      {([['library', 'Бібліотека'], ['quiz', 'Тест'], ['glossary', 'Словник']] as const).map(([tab, label]) => <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 rounded-lg px-2 py-2.5 text-[11px] font-bold transition-colors ${activeTab === tab ? 'bg-[#243244] text-sky-300' : 'text-slate-500 hover:text-slate-300'}`}>{label}</button>)}
    </div>

    {activeTab === 'library' && <div className="space-y-3">
      <label className="flex items-center gap-2 rounded-xl border border-[#212836] bg-[#131720] px-3 py-2.5"><Search className="h-4 w-4 text-slate-500" /><span className="sr-only">Пошук статей</span><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Знайти тему або статтю..." className="w-full bg-transparent text-xs text-slate-200 outline-none placeholder:text-slate-600" /></label>
      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-500"><BookOpen className="h-3.5 w-3.5" /> Добірка для вас</div>
      {filteredArticles.map(article => <button key={article.id} onClick={() => setSelectedArticle(article)} className="w-full rounded-2xl border border-[#212836] bg-[#131720] p-4 text-left transition-all hover:border-sky-300/30 active:scale-[.99]"><div className="flex items-start justify-between gap-3"><div><span className={`rounded-md border px-2 py-1 text-[10px] font-bold ${accentStyles[article.accent]}`}>{article.category}</span><h3 className="mt-3 text-sm font-bold text-slate-100">{article.title}</h3></div><ArrowRight className="mt-1 h-4 w-4 shrink-0 text-slate-600" /></div><p className="mt-2 text-xs leading-relaxed text-slate-400">{article.summary}</p><div className="mt-3 flex items-center gap-1.5 text-[10px] text-slate-500"><Clock3 className="h-3.5 w-3.5" /> {article.readTime}</div></button>)}
      {!filteredArticles.length && <p className="rounded-xl border border-dashed border-[#2b3444] p-5 text-center text-xs text-slate-500">Нічого не знайдено. Спробуйте іншу тему.</p>}
    </div>}

    {activeTab === 'glossary' && <div className="space-y-2">{GLOSSARY.map(item => <div key={item.term} className="rounded-xl border border-[#212836] bg-[#131720]"><button onClick={() => setOpenTerm(openTerm === item.term ? null : item.term)} className="flex w-full items-center justify-between p-4 text-left"><span className="text-sm font-bold text-slate-100">{item.term}</span><ChevronDown className={`h-4 w-4 text-slate-500 transition-transform ${openTerm === item.term ? 'rotate-180' : ''}`} /></button>{openTerm === item.term && <p className="px-4 pb-4 text-xs leading-relaxed text-slate-400">{item.definition}</p>}</div>)}</div>}

    {activeTab === 'quiz' && (isFinished ? <div className="rounded-2xl border border-[#212836] bg-[#131720] p-6 text-center shadow-xl"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-emerald-300/20 bg-emerald-400/10 text-emerald-300"><Award className="h-7 w-7" /></div><h3 className="mt-4 text-base font-bold text-slate-100">Модуль засвоєно</h3><p className="mt-2 text-xs leading-relaxed text-slate-400">Всі питання пройдено. Зароблено досвіду: <span className="font-bold text-emerald-300">{score} XP</span>.</p><button onClick={() => { setSelectedOption(null); setCurrentIndex(0); }} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-[#2e384d] bg-[#1a202c] py-2.5 text-xs font-semibold text-sky-300"><RotateCcw className="h-3.5 w-3.5" /> Пройти ще раз</button></div> : <div className="space-y-3"><div className="flex items-center justify-between rounded-xl border border-[#212836] bg-[#131720] p-3 text-xs"><span className="text-slate-400">Питання <b className="text-slate-100">{currentIndex + 1}</b> / {QUIZ_QUESTIONS.length}</span><span className="font-bold text-sky-300">{score} XP</span></div><div className="rounded-2xl border border-[#212836] bg-[#131720] p-5 shadow-xl"><span className="text-[10px] font-bold uppercase tracking-wider text-sky-300">{question.topic}</span><h3 className="mt-3 text-sm font-bold leading-relaxed text-slate-100">{question.question}</h3><div className="mt-4 space-y-2">{question.options.map((option, idx) => { const correct = idx === question.correctIndex; const selected = selectedOption === idx; const style = !isAnswered ? 'border-[#212836] bg-[#0b0d11] text-slate-300' : correct ? 'border-emerald-300/30 bg-emerald-400/10 text-emerald-300' : selected ? 'border-rose-300/30 bg-rose-400/10 text-rose-300' : 'border-[#1a202c] bg-[#0b0d11]/40 text-slate-600'; return <button key={option} disabled={isAnswered} onClick={() => handleSelectOption(idx)} className={`flex min-h-12 w-full items-center justify-between rounded-xl border p-3 text-left text-xs font-medium ${style}`}><span>{option}</span>{isAnswered && correct && <CheckCircle2 className="h-4 w-4 shrink-0" />}{isAnswered && selected && !correct && <XCircle className="h-4 w-4 shrink-0" />}</button>; })}</div>{isAnswered && <div className="mt-4 rounded-xl border border-[#212836] bg-[#0b0d11] p-3.5"><p className="text-[11px] font-bold text-sky-300">Коментар ментора</p><p className="mt-2 text-xs leading-relaxed text-slate-400">{question.explanation}</p><button onClick={() => { setSelectedOption(null); setCurrentIndex(prev => prev + 1); }} className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg border border-[#2e384d] bg-[#1a202c] py-2.5 text-xs font-bold text-sky-300">Далі <ArrowRight className="h-3.5 w-3.5" /></button></div>}</div></div>)}
  </div>;
};
