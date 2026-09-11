import React from 'react';
import { 
  Utensils, 
  Car, 
  Home, 
  Gamepad2, 
  Briefcase, 
  HelpCircle, 
  ArrowDownLeft, 
  ArrowUpRight 
} from 'lucide-react';
import type { Transaction, Category } from '../types';

interface Props {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

const CATEGORY_ICONS: Record<Category, React.ReactNode> = {
  food: <Utensils className="w-3.5 h-3.5 text-[#fbbf24]" />,
  transport: <Car className="w-3.5 h-3.5 text-[#38bdf8]" />,
  housing: <Home className="w-3.5 h-3.5 text-[#818cf8]" />,
  fun: <Gamepad2 className="w-3.5 h-3.5 text-[#f472b6]" />,
  salary: <Briefcase className="w-3.5 h-3.5 text-[#34d399]" />,
  other: <HelpCircle className="w-3.5 h-3.5 text-[#94a3b8]" />
};

export const TransactionList: React.FC<Props> = ({ transactions, onDelete }) => {
  if (transactions.length === 0) {
    return (
      <div className="text-center py-10 text-[#5d6a80] text-xs">
        Журнал порожній. Додайте перший запис.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-[11px] font-bold tracking-wider text-[#818ea3] uppercase px-1">
        Останні транзакції
      </h3>
      <div className="space-y-2">
        {transactions.map((tx) => {
          const isIncome = tx.type === 'income';
          return (
            <div
              key={tx.id}
              className="flex items-center justify-between p-3.5 bg-[#131720] hover:bg-[#181e2a] border border-[#212836] rounded-xl transition-all"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-lg bg-[#1a202c] border border-[#283347]">
                  {CATEGORY_ICONS[tx.category]}
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#f1f5f9]">{tx.title}</p>
                  <p className="text-[10px] text-[#6b7991] mt-0.5">{tx.date}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span className={`text-xs font-bold flex items-center ${
                  isIncome ? 'text-[#34d399]' : 'text-[#fb7185]'
                }`}>
                  {isIncome ? <ArrowDownLeft className="w-3 h-3 mr-0.5" /> : <ArrowUpRight className="w-3 h-3 mr-0.5" />}
                  {isIncome ? '+' : '-'}₴ {tx.amount.toLocaleString('uk-UA')}
                </span>
                
                <button
                  onClick={() => onDelete(tx.id)}
                  aria-label="Видалити транзакцію"
                  className="p-1 text-[#4f5a6d] hover:text-[#fb7185] text-[11px] transition-colors ml-1"
                >
                  ✕
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};