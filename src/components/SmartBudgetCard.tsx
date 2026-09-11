import React, { useState } from 'react';
import { SlidersHorizontal, Sparkles, AlertCircle, CheckCircle2, TrendingUp } from 'lucide-react';
import type { BudgetMetrics } from '../utils/budget';
import { haptic } from '../utils/haptics';

interface Props {
  metrics: BudgetMetrics;
  onUpdateLimit: (newLimit: number) => void;
}

export const SmartBudgetCard: React.FC<Props> = ({ metrics, onUpdateLimit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempLimit, setTempLimit] = useState(metrics.monthlyLimit.toString());

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(tempLimit);
    if (!isNaN(parsed) && parsed > 0) {
      haptic.success();
      onUpdateLimit(parsed);
      setIsEditing(false);
    }
  };

  const statusConfig = {
    optimal: {
      badge: 'bg-emerald-950/60 text-emerald-400 border-emerald-800/50',
      glow: 'from-emerald-500/10 via-transparent to-transparent',
      bar: 'bg-gradient-to-r from-emerald-500 to-teal-400',
      dot: 'bg-emerald-400',
      label: 'Темп під контролем'
    },
    warning: {
      badge: 'bg-amber-950/60 text-amber-400 border-amber-800/50',
      glow: 'from-amber-500/10 via-transparent to-transparent',
      bar: 'bg-gradient-to-r from-amber-500 to-yellow-400',
      dot: 'bg-amber-400',
      label: 'Підвищена швидкість витрат'
    },
    danger: {
      badge: 'bg-rose-950/60 text-rose-400 border-rose-800/50',
      glow: 'from-rose-500/15 via-transparent to-transparent',
      bar: 'bg-gradient-to-r from-rose-500 to-pink-500',
      dot: 'bg-rose-400',
      label: 'Вичерпання ліміту'
    }
  }[metrics.status];

  return (
    <div className="relative rounded-[1.75rem] bg-[#11161e] border border-white/[0.08] p-5 shadow-2xl shadow-black/20 overflow-hidden transition-all">
      {/* Світловий градієнтний бекдроп */}
      <div className={`absolute inset-0 bg-linear-to-br ${statusConfig.glow} pointer-events-none`} />

      {/* Верхній блок статусу */}
      <div className="relative flex justify-between items-center mb-4">
        <div className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase border flex items-center gap-1.5 shadow-sm ${statusConfig.badge}`}>
          <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${statusConfig.dot}`} />
          {metrics.status === 'optimal' ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
          <span>{statusConfig.label}</span>
        </div>

        <button
          onClick={() => {
            haptic.light();
            setIsEditing(!isEditing);
          }}
          className="p-2 rounded-xl bg-[#181f30] hover:bg-[#202940] text-[#818ea3] hover:text-[#f1f5f9] border border-[#26324a] active:scale-95 transition-all"
          aria-label="Змінити ліміт"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Форма зміни ліміту */}
      {isEditing && (
        <form onSubmit={handleSave} className="relative mb-4 p-3 bg-[#080a0f] border border-[#26324a] rounded-2xl space-y-2 animate-tab-enter">
          <label className="text-[11px] font-medium text-[#818ea3] block">Встанови новий місячний ліміт (₴):</label>
          <div className="flex gap-2">
            <input
              type="number"
              value={tempLimit}
              onChange={(e) => setTempLimit(e.target.value)}
              className="flex-1 bg-[#10141f] border border-[#26324a] rounded-xl px-3 py-2 text-xs text-[#f1f5f9] focus:outline-none focus:border-[#38bdf8]"
              autoFocus
            />
            <button
              type="submit"
              className="px-4 py-2 bg-[#38bdf8] text-[#080a0f] font-bold text-xs rounded-xl active:scale-95 transition-transform"
            >
              Зберегти
            </button>
          </div>
        </form>
      )}

      {/* Центральна цифра Safe-to-Spend */}
      <div className="relative space-y-1">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-[#818ea3]">
          <Sparkles className="w-3.5 h-3.5 text-[#38bdf8]" />
          <span>Безпечно витратити сьогодні</span>
        </div>

        <div className="flex items-baseline justify-between pt-0.5">
          <div className="text-3xl font-extrabold tracking-tight text-[#f1f5f9] flex items-baseline gap-1">
            <span className="text-xl text-[#38bdf8] font-bold">₴</span>
            <span>{Math.max(0, metrics.todayRemaining).toLocaleString('uk-UA')}</span>
          </div>
          <div className="text-right">
            <span className="text-[11px] text-[#5d6a80] block font-mono">Базовий ліміт</span>
            <span className="text-xs font-semibold text-[#94a3b8]">₴ {metrics.dailyAllowance} / день</span>
          </div>
        </div>
      </div>

      {/* Лінійний прогрес-бар */}
      <div className="relative mt-5 space-y-2 pt-2 border-t border-[#1e2638]">
        <div className="flex justify-between text-[11px]">
          <span className="text-[#818ea3] flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-[#5d6a80]" />
            Витрачено <strong className="text-[#f1f5f9] font-semibold">₴ {metrics.monthSpent.toLocaleString('uk-UA')}</strong>
          </span>
          <span className="text-[#818ea3]">
            з ₴ {metrics.monthlyLimit.toLocaleString('uk-UA')}
          </span>
        </div>

        <div className="w-full bg-[#080a0f] h-2.5 rounded-full overflow-hidden p-0.5 border border-[#1e2638]">
          <div
            className={`h-full rounded-full transition-all duration-700 ${statusConfig.bar}`}
            style={{ width: `${metrics.progressPercent}%` }}
          />
        </div>

        <div className="flex justify-between text-[10px] font-mono text-[#5d6a80]">
          <span>{metrics.progressPercent}% місячного плану</span>
          <span>Залишилося {metrics.daysRemaining} дн.</span>
        </div>
      </div>
    </div>
  );
};
