import React from 'react';
import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { ArrowDownRight, ArrowUpRight, BarChart3, TrendingDown } from 'lucide-react';
import type { Transaction, Category } from '../types';

interface Props { transactions: Transaction[]; }
const CATEGORY_NAMES: Record<Category, string> = { food: 'Їжа та продукти', transport: 'Транспорт / Авто', housing: 'Житло / Комуналка', fun: 'Розваги / Підписки', salary: 'Дохід / Зарплата', other: 'Інше' };
const CATEGORY_COLORS: Record<Category, string> = { food: '#fbbf24', transport: '#38bdf8', housing: '#818cf8', fun: '#f472b6', salary: '#34d399', other: '#94a3b8' };
const money = (value: number) => `₴ ${value.toLocaleString('uk-UA')}`;

export const AnalyticsView: React.FC<Props> = ({ transactions }) => {
  const expenses = transactions.filter((transaction) => transaction.type === 'expense');
  const income = transactions.filter((transaction) => transaction.type === 'income').reduce((sum, transaction) => sum + transaction.amount, 0);
  const totalExpense = expenses.reduce((sum, transaction) => sum + transaction.amount, 0);
  const balance = income - totalExpense;
  const categoryData = Object.entries(expenses.reduce((acc, transaction) => ({ ...acc, [transaction.category]: (acc[transaction.category] || 0) + transaction.amount }), {} as Record<string, number>)).map(([category, value]) => ({ category: category as Category, name: CATEGORY_NAMES[category as Category], value, percentage: totalExpense ? Math.round((value / totalExpense) * 100) : 0, color: CATEGORY_COLORS[category as Category] })).sort((a, b) => b.value - a.value);

  if (!expenses.length) return <div className="empty-state"><BarChart3 className="w-8 h-8 text-sky-300 mx-auto" /><h3>Аналітика зʼявиться тут</h3><p>Додайте першу витрату, щоб побачити структуру бюджету.</p></div>;

  return <div className="space-y-4">
    <div className="analytics-heading"><div><span className="eyebrow">Огляд місяця</span><h2 className="text-xl font-bold text-slate-100 mt-2">Ваші фінанси</h2></div><TrendingDown className="w-6 h-6 text-sky-300" /></div>
    <div className="grid grid-cols-3 gap-2">
      <div className="metric-card"><ArrowUpRight className="w-3.5 h-3.5 text-emerald-300" /><small>Доходи</small><strong>{money(income)}</strong></div>
      <div className="metric-card"><ArrowDownRight className="w-3.5 h-3.5 text-rose-300" /><small>Витрати</small><strong>{money(totalExpense)}</strong></div>
      <div className="metric-card"><BarChart3 className="w-3.5 h-3.5 text-sky-300" /><small>Баланс</small><strong className={balance >= 0 ? 'text-emerald-300' : 'text-rose-300'}>{money(balance)}</strong></div>
    </div>
    <div className="analytics-card"><div className="flex justify-between items-center"><div><span className="eyebrow">Структура витрат</span><p className="text-xs text-slate-400 mt-1">Найбільша категорія: <b className="text-slate-200">{categoryData[0]?.name}</b></p></div><b className="text-sm text-slate-100">{money(totalExpense)}</b></div><div className="w-full h-52"><ResponsiveContainer width="100%" height="100%"><RechartsPie><Pie data={categoryData} cx="50%" cy="50%" innerRadius={52} outerRadius={78} paddingAngle={3} dataKey="value">{categoryData.map((entry) => <Cell key={entry.category} fill={entry.color} stroke="#131720" strokeWidth={2} />)}</Pie><Tooltip contentStyle={{ backgroundColor: '#1a202c', borderColor: '#2e384d', borderRadius: '0.75rem', color: '#f1f5f9', fontSize: '11px' }} formatter={(value: unknown) => [money(typeof value === 'number' ? value : 0), 'Сума']} /></RechartsPie></ResponsiveContainer></div></div>
    <div className="space-y-2"><div className="section-heading px-1"><span>Категорії</span><span className="text-[10px] text-slate-500">% від витрат</span></div>{categoryData.map((item) => <div key={item.category} className="analytics-row"><div className="flex justify-between items-center text-xs"><div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} /><span className="font-semibold text-slate-200">{item.name}</span></div><span className="font-bold text-slate-100">{money(item.value)} <em className="not-italic text-slate-500 ml-1">{item.percentage}%</em></span></div><div className="progress-track"><div className="progress-fill" style={{ width: `${item.percentage}%`, backgroundColor: item.color }} /></div></div>)}</div>
  </div>;
};
