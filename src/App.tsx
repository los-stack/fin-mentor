import { useState, useEffect } from 'react';
import { 
  Wallet, 
  PieChart, 
  GraduationCap, 
  Settings, 
  Plus 
} from 'lucide-react';
import type { Transaction } from './types';
import { TransactionList } from './components/TransactionList';
import { AddTransactionModal } from './components/AddTransactionModal';
import { AnalyticsView } from './components/AnalyticsView';
import { LearnView } from './components/LearnView';
import { SmartBudgetCard } from './components/SmartBudgetCard';
import { calculateBudgetMetrics } from './utils/budget';
import { haptic } from './utils/haptics';

type TabType = 'dashboard' | 'analytics' | 'learn' | 'settings';

const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: '1', title: 'Виплата винагороди', amount: 42000, type: 'income', category: 'salary', date: '2026-09-01' },
  { id: '2', title: 'Супермаркет та запаси', amount: 2450, type: 'expense', category: 'food', date: '2026-09-02' },
  { id: '3', title: 'Пальне / Транспорт', amount: 1200, type: 'expense', category: 'transport', date: '2026-09-03' },
  { id: '4', title: 'Книги та софт', amount: 890, type: 'expense', category: 'fun', date: '2026-09-04' }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('finmentor_txs');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [monthlyLimit, setMonthlyLimit] = useState<number>(() => {
    const saved = localStorage.getItem('finmentor_budget_limit');
    return saved ? Number(saved) : 25000;
  });

  useEffect(() => {
    localStorage.setItem('finmentor_txs', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('finmentor_budget_limit', monthlyLimit.toString());
  }, [monthlyLimit]);

  const totals = transactions.reduce(
    (acc, tx) => {
      if (tx.type === 'income') {
        acc.income += tx.amount;
        acc.balance += tx.amount;
      } else {
        acc.expense += tx.amount;
        acc.balance -= tx.amount;
      }
      return acc;
    },
    { balance: 0, income: 0, expense: 0 }
  );

  const budgetMetrics = calculateBudgetMetrics(transactions, monthlyLimit);

  const handleAddTransaction = (newTx: Omit<Transaction, 'id'>) => {
    const transaction: Transaction = {
      ...newTx,
      id: crypto.randomUUID()
    };
    setTransactions(prev => [transaction, ...prev]);
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(tx => tx.id !== id));
  };

  const switchTab = (tab: TabType) => {
    haptic.light();
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen max-w-md mx-auto flex flex-col bg-[#080a0f] text-[#f1f5f9] relative">
      {/* Header */}
      <header className="pt-safe px-5 py-4 flex items-center justify-between border-b border-[#1e2638] bg-[#080a0f]/80 backdrop-blur-2xl sticky top-0 z-10">
        <div>
          <span className="text-[10px] font-bold tracking-[0.2em] text-[#38bdf8] uppercase">
            OBSIDIAN • LUXURY
          </span>
          <h1 className="text-lg font-bold tracking-tight text-[#f1f5f9]">Мій Капітал</h1>
        </div>
        <button 
          onClick={() => {
            haptic.light();
            setIsModalOpen(true);
          }}
          className="h-9 px-3.5 rounded-xl bg-[#181f30] hover:bg-[#202940] border border-[#26324a] text-[#38bdf8] font-bold text-xs flex items-center gap-1.5 active:scale-95 transition-all shadow-sm"
        >
          <Plus className="w-4 h-4 text-[#38bdf8] stroke-2" />
          <span>Запис</span>
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-4 py-5 pb-24">
        {activeTab === 'dashboard' && (
          <div className="space-y-5 animate-tab-enter">
            {/* Розумний віджет безпечного бюджету */}
            <SmartBudgetCard 
              metrics={budgetMetrics} 
              onUpdateLimit={setMonthlyLimit} 
            />

            {/* Компактний віджет загального балансу капіталу */}
            <div className="p-4 rounded-2xl bg-[#10141f] border border-[#1e2638] flex items-center justify-between shadow-md">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#818ea3] block">
                  Загальний залишок
                </span>
                <span className="text-base font-bold text-[#f1f5f9]">
                  ₴ {totals.balance.toLocaleString('uk-UA', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex gap-4 text-right">
                <div>
                  <span className="text-[10px] text-[#818ea3] block">Дохід</span>
                  <span className="text-xs font-bold text-[#34d399]">+₴ {totals.income.toLocaleString('uk-UA')}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#818ea3] block">Витрати</span>
                  <span className="text-xs font-bold text-[#fb7185]">-₴ {totals.expense.toLocaleString('uk-UA')}</span>
                </div>
              </div>
            </div>

            {/* Журнал операцій */}
            <TransactionList 
              transactions={transactions} 
              onDelete={handleDeleteTransaction} 
            />
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="animate-tab-enter">
            <AnalyticsView transactions={transactions} />
          </div>
        )}

        {activeTab === 'learn' && (
          <div className="animate-tab-enter">
            <LearnView />
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="p-6 rounded-3xl bg-[#10141f] border border-[#1e2638] text-center py-12 space-y-2 animate-tab-enter shadow-xl">
            <Settings className="w-8 h-8 mx-auto text-[#818ea3] stroke-2" />
            <h3 className="font-bold text-sm text-[#f1f5f9]">Параметри системи</h3>
            <p className="text-xs text-[#818ea3] max-w-xs mx-auto leading-relaxed">
              Автономне збереження даних у локальній базі браузера без передачі стороннім серверам.
            </p>
          </div>
        )}
      </main>

      {/* Шторка додавання транзакції */}
      <AddTransactionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAdd={handleAddTransaction} 
      />

      {/* Нижня навігаційна панель з канонічними класами Tailwind */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-[#080a0f]/85 backdrop-blur-2xl border-t border-[#1e2638] px-4 py-2 pb-safe z-20">
        <div className="flex justify-around items-center h-12">
          <button
            onClick={() => switchTab('dashboard')}
            className={`flex flex-col items-center justify-center flex-1 h-full min-h-11 transition-all ${
              activeTab === 'dashboard' ? 'text-[#38bdf8]' : 'text-[#4e5c73] hover:text-[#94a3b8]'
            }`}
          >
            <Wallet className="w-4 h-4 stroke-2" />
            <span className="text-[10px] mt-1 font-semibold tracking-tight">Журнал</span>
          </button>

          <button
            onClick={() => switchTab('analytics')}
            className={`flex flex-col items-center justify-center flex-1 h-full min-h-11 transition-all ${
              activeTab === 'analytics' ? 'text-[#38bdf8]' : 'text-[#4e5c73] hover:text-[#94a3b8]'
            }`}
          >
            <PieChart className="w-4 h-4 stroke-2" />
            <span className="text-[10px] mt-1 font-semibold tracking-tight">Аналітика</span>
          </button>

          <button
            onClick={() => switchTab('learn')}
            className={`flex flex-col items-center justify-center flex-1 h-full min-h-11 transition-all ${
              activeTab === 'learn' ? 'text-[#38bdf8]' : 'text-[#4e5c73] hover:text-[#94a3b8]'
            }`}
          >
            <GraduationCap className="w-4 h-4 stroke-2" />
            <span className="text-[10px] mt-1 font-semibold tracking-tight">Навчання</span>
          </button>

          <button
            onClick={() => switchTab('settings')}
            className={`flex flex-col items-center justify-center flex-1 h-full min-h-11 transition-all ${
              activeTab === 'settings' ? 'text-[#38bdf8]' : 'text-[#4e5c73] hover:text-[#94a3b8]'
            }`}
          >
            <Settings className="w-4 h-4 stroke-2" />
            <span className="text-[10px] mt-1 font-semibold tracking-tight">Опції</span>
          </button>
        </div>
      </nav>
    </div>
  );
}