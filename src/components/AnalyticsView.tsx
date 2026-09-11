import React from 'react';
import { 
  PieChart as RechartsPie, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip 
} from 'recharts';
import type { Transaction, Category } from '../types';

interface Props {
  transactions: Transaction[];
}

const CATEGORY_NAMES: Record<Category, string> = {
  food: 'Їжа та продукти',
  transport: 'Транспорт / Авто',
  housing: 'Житло / Комуналка',
  fun: 'Розваги / Підписки',
  salary: 'Дохід / Зарплата',
  other: 'Інше'
};

const CATEGORY_COLORS: Record<Category, string> = {
  food: '#fbbf24',      
  transport: '#38bdf8', 
  housing: '#818cf8',  
  fun: '#f472b6',       
  salary: '#34d399',    
  other: '#94a3b8'      
};

export const AnalyticsView: React.FC<Props> = ({ transactions }) => {
  const expenses = transactions.filter(t => t.type === 'expense');
  const totalExpense = expenses.reduce((acc, curr) => acc + curr.amount, 0);

  const categoryDataMap = expenses.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
    return acc;
  }, {} as Partial<Record<Category, number>>);

  const chartData = Object.entries(categoryDataMap).map(([cat, amount]) => ({
    category: cat as Category,
    name: CATEGORY_NAMES[cat as Category],
    value: amount,
    percentage: totalExpense > 0 ? Math.round((amount / totalExpense) * 100) : 0,
    color: CATEGORY_COLORS[cat as Category]
  })).sort((a, b) => b.value - a.value);

  if (expenses.length === 0) {
    return (
      <div className="p-8 text-center bg-[#131720] rounded-2xl border border-[#212836] mt-4">
        <p className="text-[#818ea3] text-xs">Немає витрат для формування графіків.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="bg-[#131720] border border-[#212836] rounded-2xl p-5 shadow-xl">
        <h3 className="text-[11px] font-bold tracking-wider text-[#818ea3] uppercase text-center mb-1">
          Аналітика витрат
        </h3>
        <p className="text-center text-xs text-[#6b7991] mb-2">
          Всього списано: <span className="font-bold text-[#f1f5f9]">₴ {totalExpense.toLocaleString('uk-UA')}</span>
        </p>

        <div className="w-full h-56">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsPie>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {chartData.map((entry) => (
                  <Cell key={`cell-${entry.category}`} fill={entry.color} stroke="#131720" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1a202c', 
                  borderColor: '#2e384d',
                  borderRadius: '0.75rem',
                  color: '#f1f5f9',
                  fontSize: '11px',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)'
                }}
                formatter={(value: unknown) => [
                  `₴ ${typeof value === 'number' ? value.toLocaleString('uk-UA') : value}`, 
                  'Сума'
                ]}
              />
            </RechartsPie>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="text-[11px] font-bold tracking-wider text-[#818ea3] uppercase px-1">
          Статті витрат
        </h4>
        
        <div className="space-y-2">
          {chartData.map((item) => (
            <div 
              key={item.category} 
              className="p-3 bg-[#131720] border border-[#212836] rounded-xl flex flex-col gap-2"
            >
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2">
                  <span 
                    className="w-2 h-2 rounded-full" 
                    style={{ backgroundColor: item.color }} 
                  />
                  <span className="font-semibold text-[#e2e8f0]">{item.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#f1f5f9]">
                    ₴ {item.value.toLocaleString('uk-UA')}
                  </span>
                  <span className="text-[11px] text-[#6b7991] w-8 text-right">
                    {item.percentage}%
                  </span>
                </div>
              </div>

              <div className="w-full bg-[#0b0d11] rounded-full h-1.5 overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-500" 
                  style={{ 
                    width: `${item.percentage}%`, 
                    backgroundColor: item.color 
                  }} 
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
