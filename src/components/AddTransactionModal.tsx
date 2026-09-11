import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import type { Category, Transaction, TransactionType } from '../types';
import { haptic } from '../utils/haptics';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (transaction: Omit<Transaction, 'id'>) => void;
}

const QUICK_AMOUNTS = [100, 200, 500, 1000];

export const AddTransactionModal: React.FC<Props> = ({ isOpen, onClose, onAdd }) => {
  const [type, setType] = useState<TransactionType>('expense');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<Category>('food');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (!title.trim() || isNaN(parsedAmount) || parsedAmount <= 0) return;

    haptic.success();
    onAdd({
      title: title.trim(),
      amount: parsedAmount,
      type,
      category,
      date: new Date().toISOString().split('T')[0]
    });

    setTitle('');
    setAmount('');
    onClose();
  };

  const handleQuickAdd = (value: number) => {
    haptic.light();
    const current = parseFloat(amount) || 0;
    setAmount((current + value).toString());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-md transition-all">
      <div 
        className="w-full max-w-md bg-[#10141f] border-t border-[#26324a] rounded-t-4xl p-6 pb-safe animate-tab-enter shadow-2xl space-y-4"
      >
        {/* Заголовок */}
        <div className="flex justify-between items-center pb-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#38bdf8]" />
            <h2 className="text-sm font-bold tracking-tight text-[#f1f5f9]">Створення запису</h2>
          </div>
          <button 
            onClick={() => {
              haptic.light();
              onClose();
            }} 
            className="p-1.5 rounded-full bg-[#181f30] text-[#818ea3] hover:text-[#f1f5f9] border border-[#26324a] active:scale-90 transition-transform"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Перемикач типу */}
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#080a0f] border border-[#1e2638] rounded-2xl">
          <button
            type="button"
            onClick={() => {
              haptic.light();
              setType('expense');
            }}
            className={`py-2.5 text-xs font-semibold rounded-xl transition-all ${
              type === 'expense' 
                ? 'bg-[#2b141c] text-[#fb7185] border border-[#4d2232] shadow-sm' 
                : 'text-[#6b7991]'
            }`}
          >
            Витрата
          </button>
          <button
            type="button"
            onClick={() => {
              haptic.light();
              setType('income');
            }}
            className={`py-2.5 text-xs font-semibold rounded-xl transition-all ${
              type === 'income' 
                ? 'bg-[#102a20] text-[#34d399] border border-[#1b4d38] shadow-sm' 
                : 'text-[#6b7991]'
            }`}
          >
            Дохід
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Поле введення суми */}
          <div>
            <label className="block text-[11px] font-semibold text-[#818ea3] mb-1">Сума операції</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-[#38bdf8]">₴</span>
              <input
                type="number"
                step="any"
                inputMode="decimal"
                placeholder="0.00"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-[#080a0f] border border-[#1e2638] rounded-2xl pl-9 pr-4 py-3.5 text-xl font-bold text-[#f1f5f9] focus:outline-none focus:border-[#38bdf8] transition-colors"
              />
            </div>

            {/* Швидкі кнопки додавання сум */}
            <div className="flex gap-2 mt-2">
              {QUICK_AMOUNTS.map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => handleQuickAdd(val)}
                  className="flex-1 py-1.5 rounded-xl bg-[#181f30] hover:bg-[#202940] border border-[#26324a] text-[11px] font-mono text-[#38bdf8] active:scale-95 transition-all"
                >
                  +{val}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#818ea3] mb-1">Призначення</label>
            <input
              type="text"
              placeholder="Наприклад: Продукти, транспорт, кава..."
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#080a0f] border border-[#1e2638] rounded-2xl px-4 py-2.5 text-xs text-[#f1f5f9] focus:outline-none focus:border-[#38bdf8] transition-colors"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#818ea3] mb-1">Категорія</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className="w-full bg-[#080a0f] border border-[#1e2638] rounded-2xl px-4 py-2.5 text-xs text-[#f1f5f9] focus:outline-none focus:border-[#38bdf8] transition-colors"
            >
              <option value="food">Їжа та продукти</option>
              <option value="transport">Транспорт / Авто</option>
              <option value="housing">Оселя / Комунальне</option>
              <option value="fun">Розваги / Підписки</option>
              <option value="salary">Дохід / Зарплата</option>
              <option value="other">Інше</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-linear-to-r from-[#38bdf8] to-[#0284c7] hover:from-[#0284c7] hover:to-[#0369a1] active:scale-[0.99] text-[#080a0f] font-bold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-sky-950/40 transition-all"
          >
            <Check className="w-4 h-4 stroke-2" />
            <span>Підтвердити операцію</span>
          </button>
        </form>
      </div>
    </div>
  );
};