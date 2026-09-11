import React from 'react';
import { Download, Moon, RotateCcw, SlidersHorizontal, Sparkles, Trash2, Sun, LogOut } from 'lucide-react';

interface Props {
  monthlyLimit: number;
  onUpdateLimit: (value: number) => void;
  transactionCount: number;
  onResetTransactions: () => void;
  theme: 'dark' | 'light';
  onThemeChange: (theme: 'dark' | 'light') => void;
  onSignOut: () => void;
}

export const OptionsView: React.FC<Props> = ({ monthlyLimit, onUpdateLimit, transactionCount, onResetTransactions, theme, onThemeChange, onSignOut }) => {
  const exportData = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      transactions: JSON.parse(localStorage.getItem('finmentor_txs') || '[]'),
      monthlyLimit,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'finmentor-backup.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const resetData = () => {
    if (!window.confirm('Очистити всі операції? Цю дію не можна скасувати.')) return;
    onResetTransactions();
  };

  return (
    <div className="space-y-4 animate-tab-enter">
      <div className="options-hero rounded-3xl p-5 border border-sky-300/15 overflow-hidden relative">
        <div className="relative z-[1]">
          <span className="eyebrow">Налаштування</span>
          <h2 className="text-xl font-bold tracking-tight text-slate-100 mt-2">Ваш FinMentor</h2>
          <p className="text-xs text-slate-400 leading-relaxed mt-1 max-w-[250px]">Налаштуйте бюджет і керуйте своїми даними в одному місці.</p>
        </div>
        <Sparkles className="absolute -right-2 -bottom-3 w-24 h-24 text-sky-300/10" />
      </div>

      <section className="settings-section">
        <div className="section-heading"><SlidersHorizontal className="w-4 h-4 text-sky-300" /><span>Бюджет</span></div>
        <label className="settings-row block">
          <span><strong>Місячний ліміт</strong><small>Для розрахунку безпечних витрат</small></span>
          <div className="limit-input"><span>₴</span><input aria-label="Місячний ліміт" type="number" min="0" value={monthlyLimit} onChange={(event) => onUpdateLimit(Number(event.target.value))} /></div>
        </label>
      </section>

      <section className="settings-section">
        <div className="section-heading"><Moon className="w-4 h-4 text-sky-300" /><span>Вигляд</span></div>
        <button className="settings-row theme-toggle" onClick={() => onThemeChange(theme === 'dark' ? 'light' : 'dark')}><span><strong>{theme === 'dark' ? 'Темна тема' : 'Світла тема'}</strong><small>Перемикайте вигляд під свій ритм</small></span><span className="theme-switch"><span className="theme-switch-knob">{theme === 'dark' ? <Moon size={12}/> : <Sun size={12}/>}</span></span></button>
      </section>

      <section className="settings-section">
        <div className="section-heading"><Download className="w-4 h-4 text-sky-300" /><span>Дані</span></div>
        <button className="settings-action" onClick={exportData}><span><strong>Експортувати дані</strong><small>{transactionCount} операцій · JSON-файл</small></span><Download className="w-4 h-4 text-slate-500" /></button>
        <button className="settings-action danger" onClick={resetData}><span><strong>Очистити журнал</strong><small>Видалити всі збережені операції</small></span><Trash2 className="w-4 h-4 text-rose-300/70" /></button>
      </section>

      <button className="settings-action signout" onClick={onSignOut}><span><strong>Вийти з акаунта</strong><small>Сесія буде завершена на цьому пристрої</small></span><LogOut className="w-4 h-4 text-slate-500" /></button>
      <div className="flex items-center justify-center gap-2 text-[10px] text-slate-600 pt-1"><RotateCcw className="w-3 h-3" /> Дані зберігаються у вашому акаунті</div>
    </div>
  );
};
