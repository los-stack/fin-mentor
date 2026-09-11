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

  useEffect(() => {
    localStorage.setItem('finmentor_txs', JSON.stringify(transactions));
  }, [transactions]);

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

  return (
    <div className="min-h-screen max-w-md mx-auto flex flex-col bg-[#0b0d11] text-[#f1f5f9] relative">
      {/* Header */}
      <header className="pt-safe px-5 py-4 flex items-center justify-between border-b border-[#212836] bg-[#0b0d11]/85 backdrop-blur-xl sticky top-0 z-10">
        <div>
          <span className="text-[10px] font-bold tracking-[0.2em] text-[#38bdf8] uppercase">
            OBSIDIAN • FIN
          </span>
          <h1 className="text-lg font-bold tracking-tight text-[#f1f5f9]">Огляд активів</h1>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="h-9 px-3.5 rounded-xl bg-[#1a202c] hover:bg-[#232b3b] border border-[#2e384d] text-[#38bdf8] font-semibold text-xs flex items-center gap-1.5 active:scale-95 transition-all shadow-sm"
        >
          <Plus className="w-4 h-4 text-[#38bdf8]" />
          <span>Запис</span>
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-4 py-5 pb-24">
        {activeTab === 'dashboard' && (
          <div className="space-y-5">
            {/* Балансова картка в стилі Nordic Obsidian */}
            <div className="p-6 rounded-2xl bg-[#131720] border border-[#212836] shadow-xl relative overflow-hidden">
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-semibold tracking-wider text-[#818ea3] uppercase">
                  Поточний залишок
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#1a202c] text-[#38bdf8] border border-[#283347]">
                  SECURE • LOCAL
                </span>
              </div>
              
              <div className="text-3xl font-extrabold mt-2 tracking-tight text-[#f1f5f9]">
                ₴ {totals.balance.toLocaleString('uk-UA', { minimumFractionDigits: 2 })}
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3 pt-4 border-t border-[#212836]">
                <div>
                  <span className="text-[11px] text-[#818ea3] block">Надходження</span>
                  <span className="text-sm font-bold text-[#34d399]">
                    +₴ {totals.income.toLocaleString('uk-UA')}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-[#818ea3] block">Витрати</span>
                  <span className="text-sm font-bold text-[#fb7185]">
                    -₴ {totals.expense.toLocaleString('uk-UA')}
                  </span>
                </div>
              </div>
            </div>

            {/* Список транзакцій */}
            <TransactionList 
              transactions={transactions} 
              onDelete={handleDeleteTransaction} 
            />
          </div>
        )}

        {activeTab === 'analytics' && (
          <AnalyticsView transactions={transactions} />
        )}

        {activeTab === 'learn' && (
          <LearnView />
        )}

        {activeTab === 'settings' && (
          <div className="p-6 rounded-2xl bg-[#131720] border border-[#212836] text-center py-12 space-y-2">
            <Settings className="w-8 h-8 mx-auto text-[#818ea3] stroke-[1.75]" />
            <h3 className="font-semibold text-sm text-[#f1f5f9]">Конфігурація</h3>
            <p className="text-xs text-[#818ea3] max-w-xs mx-auto leading-relaxed">
              Автономне збереження даних у локальній базі браузера без передачі третім сторонам.
            </p>
          </div>
        )}
      </main>

      {/* Шторка додавання */}
      <AddTransactionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAdd={handleAddTransaction} 
      />

      {/* Нижня навігація */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-[#0b0d11]/90 backdrop-blur-xl border-t border-[#212836] px-4 py-2 pb-safe z-20">
        <div className="flex justify-around items-center h-12">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex flex-col items-center justify-center flex-1 h-full min-h-11 transition-all ${
              activeTab === 'dashboard' ? 'text-[#38bdf8]' : 'text-[#5d6a80] hover:text-[#94a3b8]'
            }`}
          >
            <Wallet className="w-4 h-4 stroke-2" />
            <span className="text-[10px] mt-1 font-semibold tracking-tight">Журнал</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex flex-col items-center justify-center flex-1 h-full min-h-11 transition-all ${
              activeTab === 'analytics' ? 'text-[#38bdf8]' : 'text-[#5d6a80] hover:text-[#94a3b8]'
            }`}
          >
            <PieChart className="w-4 h-4 stroke-2" />
            <span className="text-[10px] mt-1 font-semibold tracking-tight">Аналітика</span>
          </button>

          <button
            onClick={() => setActiveTab('learn')}
            className={`flex flex-col items-center justify-center flex-1 h-full min-h-11 transition-all ${
              activeTab === 'learn' ? 'text-[#38bdf8]' : 'text-[#5d6a80] hover:text-[#94a3b8]'
            }`}
          >
            <GraduationCap className="w-4 h-4 stroke-2" />
            <span className="text-[10px] mt-1 font-semibold tracking-tight">Навчання</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex flex-col items-center justify-center flex-1 h-full min-h-11 transition-all ${
              activeTab === 'settings' ? 'text-[#38bdf8]' : 'text-[#5d6a80] hover:text-[#94a3b8]'
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