import React from 'react';
import { 
  Utensils, 
  Car, 
  Home, 
  Gamepad2, 
  Briefcase, 
  HelpCircle, 
  ArrowDownLeft, 
  ArrowUpRight,
  Trash2
} from 'lucide-react';
import type { Transaction, Category } from '../types';
import { haptic } from '../utils/haptics';

interface Props {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

const CATEGORY_ICONS: Record<Category, React.ReactNode> = {
  food: <Utensils className="w-4 h-4 text-[#fbbf24]" />,
  transport: <Car className="w-4 h-4 text-[#38bdf8]" />,
  housing: <Home className="w-4 h-4 text-[#818cf8]" />,
  fun: <Gamepad2 className="w-4 h-4 text-[#f472b6]" />,
  salary: <Briefcase className="w-4 h-4 text-[#34d399]" />,
  other: <HelpCircle className="w-4 h-4 text-[#94a3b8]" />
};

export const TransactionList: React.FC<Props> = ({ transactions, onDelete }) => {
  if (transactions.length === 0) {
    return (
      <div className="text-center py-12 px-4 rounded-2xl bg-[#10141f] border border-[#1e2638] text-[#5d6a80] text-xs">
        <p className="font-medium text-[#818ea3]">Журнал поки що чистий</p>
        <p className="text-[11px] text-[#5d6a80] mt-1">Додайте перший дохід чи витрату зверху</p>
      </div>
    );
  }

  const formatGroupDate = (dateStr: string) => {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    if (dateStr === today) return 'Сьогодні';
    if (dateStr === yesterday) return 'Вчора';

    const [year, month, day] = dateStr.split('-');
    return `${day}.${month}.${year}`;
  };

  // Групуємо транзакції за днями
  const grouped = transactions.reduce((acc, tx) => {
    const dateKey = tx.date;
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(tx);
    return acc;
  }, {} as Record<string, Transaction[]>);

  const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  return (
    <div className="space-y-4">
      {sortedDates.map((dateKey) => (
        <div key={dateKey} className="space-y-2">
          {/* Дата-роздільник */}
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-bold tracking-wider text-[#818ea3] uppercase">
              {formatGroupDate(dateKey)}
            </span>
            <span className="text-[10px] font-mono text-[#4a5568]">
              {grouped[dateKey].length} оп.
            </span>
          </div>

          <div className="space-y-2">
            {grouped[dateKey].map((tx) => {
              const isIncome = tx.type === 'income';
              return (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-3.5 bg-[#10141f] hover:bg-[#141a29] active:scale-[0.99] border border-[#1e2638] rounded-2xl transition-all shadow-sm group"
                >
                  <div className="flex items-center space-x-3.5">
                    <div className="p-2.5 rounded-xl bg-[#181f30] border border-[#26324a] shrink-0">
                      {CATEGORY_ICONS[tx.category]}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#f1f5f9] leading-tight">{tx.title}</p>
                      <span className="text-[10px] font-medium text-[#606d82] mt-0.5 inline-block capitalize">
                        {tx.category}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className="text-right">
                      <span className={`text-xs font-bold flex items-center justify-end ${
                        isIncome ? 'text-[#34d399]' : 'text-[#fb7185]'
                      }`}>
                        {isIncome ? <ArrowDownLeft className="w-3 h-3 mr-0.5" /> : <ArrowUpRight className="w-3 h-3 mr-0.5" />}
                        {isIncome ? '+' : '-'}₴ {tx.amount.toLocaleString('uk-UA')}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        haptic.warning();
                        onDelete(tx.id);
                      }}
                      aria-label="Видалити запис"
                      className="p-2 text-[#475569] hover:text-[#fb7185] active:scale-90 transition-all rounded-lg"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};