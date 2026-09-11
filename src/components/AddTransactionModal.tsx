import React, { useState } from 'react';
import { X } from 'lucide-react';
import type { Category, Transaction, TransactionType } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (transaction: Omit<Transaction, 'id'>) => void;
}

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

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/75 backdrop-blur-sm transition-all">
      <div 
        className="w-full max-w-md bg-[#131720] border-t border-[#2e384d] rounded-t-3xl p-5 pb-safe animate-in slide-in-from-bottom duration-200 shadow-2xl"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-bold tracking-tight text-[#f1f5f9]">Нова операція</h2>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-full bg-[#1a202c] text-[#818ea3] hover:text-[#f1f5f9] border border-[#283347]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Перемикач типів */}
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#0b0d11] border border-[#212836] rounded-xl mb-4">
          <button
            type="button"
            onClick={() => setType('expense')}
            className={`py-2 text-xs font-semibold rounded-lg transition-all ${
              type === 'expense' 
                ? 'bg-[#2b171f] text-[#fb7185] border border-[#4d2331]' 
                : 'text-[#6b7991]'
            }`}
          >
            Витрата
          </button>
          <button
            type="button"
            onClick={() => setType('income')}
            className={`py-2 text-xs font-semibold rounded-lg transition-all ${
              type === 'income' 
                ? 'bg-[#122b22] text-[#34d399] border border-[#1d4d3c]' 
                : 'text-[#6b7991]'
            }`}
          >
            Дохід
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-[11px] font-semibold text-[#818ea3] mb-1">Сума (₴)</label>
            <input
              type="number"
              step="any"
              inputMode="decimal"
              placeholder="0.00"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-[#0b0d11] border border-[#212836] rounded-xl px-4 py-3 text-lg font-bold text-[#f1f5f9] focus:outline-none focus:border-[#38bdf8]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#818ea3] mb-1">Опис</label>
            <input
              type="text"
              placeholder="Наприклад: Продукти, пальне, підписка..."
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#0b0d11] border border-[#212836] rounded-xl px-4 py-2.5 text-xs text-[#f1f5f9] focus:outline-none focus:border-[#38bdf8]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#818ea3] mb-1">Категорія</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className="w-full bg-[#0b0d11] border border-[#212836] rounded-xl px-4 py-2.5 text-xs text-[#f1f5f9] focus:outline-none focus:border-[#38bdf8]"
            >
              <option value="food">Їжа та продукти</option>
              <option value="transport">Транспорт / Авто</option>
              <option value="housing">Оренда / Комуналка</option>
              <option value="fun">Розваги / Підписки</option>
              <option value="salary">Дохід / Заробітна плата</option>
              <option value="other">Інше</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full mt-2 py-3 bg-[#1e293b] hover:bg-[#28354b] border border-[#334155] active:scale-[0.99] text-[#38bdf8] font-bold rounded-xl text-xs transition-all shadow-md"
          >
            Зберегти транзакцію
          </button>
        </form>
      </div>
    </div>
  );
};