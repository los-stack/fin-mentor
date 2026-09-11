import { useEffect, useState } from 'react';
import { Wallet, PieChart, GraduationCap, Settings, Plus, UserRound } from 'lucide-react';
import type { Transaction } from './types';
import { TransactionList } from './components/TransactionList';
import { AddTransactionModal } from './components/AddTransactionModal';
import { AnalyticsView } from './components/AnalyticsView';
import { LearnView } from './components/LearnView';
import { OptionsView } from './components/OptionsView';
import { SmartBudgetCard } from './components/SmartBudgetCard';
import { AuthScreen } from './components/AuthScreen';
import { calculateBudgetMetrics } from './utils/budget';
import { haptic } from './utils/haptics';
import { supabase } from './lib/supabase';

type TabType = 'dashboard' | 'analytics' | 'learn' | 'settings';
export default function App() {
  const [session, setSession] = useState<any>(null); const [profile, setProfile] = useState<any>(null); const [activeTab, setActiveTab] = useState<TabType>('dashboard'); const [isModalOpen, setIsModalOpen] = useState(false); const [loading, setLoading] = useState(true); const [theme, setTheme] = useState<'dark'|'light'>('dark');
  const [transactions, setTransactions] = useState<Transaction[]>([]); const [monthlyLimit, setMonthlyLimit] = useState(25000);

  useEffect(() => { let mounted = true; supabase.auth.getSession().then(({ data }) => { if (mounted) { setSession(data.session); setLoading(false); } }); const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => setSession(nextSession)); return () => { mounted = false; listener.subscription.unsubscribe(); }; }, []);
  useEffect(() => { if (!session?.user) return; (async () => { const [{ data: p }, { data: rows }] = await Promise.all([supabase.from('profiles').select('id,display_name,budget_limit,theme').eq('id', session.user.id).maybeSingle(), supabase.from('transactions').select('id,type,amount,category,description,occurred_at').eq('user_id', session.user.id).order('occurred_at', { ascending: false })]); setProfile(p); setMonthlyLimit(Number(p?.budget_limit || 25000)); setTheme(p?.theme === 'light' ? 'light' : 'dark'); setTransactions((rows || []).map(row => ({ id: row.id, title: row.description || 'Операція', amount: Number(row.amount), type: row.type, category: row.category, date: row.occurred_at }))); })(); }, [session]);
  useEffect(() => { document.documentElement.dataset.theme = theme; }, [theme]);
  if (loading) return <div className="loading-screen">Завантаження FinMentor…</div>;
  if (!session) return <AuthScreen />;
  const totals = transactions.reduce((acc, tx) => { tx.type === 'income' ? (acc.income += tx.amount, acc.balance += tx.amount) : (acc.expense += tx.amount, acc.balance -= tx.amount); return acc; }, { balance: 0, income: 0, expense: 0 });
  const budgetMetrics = calculateBudgetMetrics(transactions, monthlyLimit);
  const updateLimit = async (value: number) => { setMonthlyLimit(value); await supabase.from('profiles').update({ budget_limit: value, updated_at: new Date().toISOString() }).eq('id', session.user.id); };
  const handleAddTransaction = async (newTx: Omit<Transaction, 'id'>) => { const { data } = await supabase.from('transactions').insert({ user_id: session.user.id, type: newTx.type, amount: newTx.amount, category: newTx.category, description: newTx.title, occurred_at: newTx.date }).select('id').single(); setTransactions(prev => [{ ...newTx, id: data?.id || crypto.randomUUID() }, ...prev]); };
  const handleDeleteTransaction = async (id: string) => { await supabase.from('transactions').delete().eq('id', id).eq('user_id', session.user.id); setTransactions(prev => prev.filter(tx => tx.id !== id)); };
  const switchTab = (tab: TabType) => { haptic.light(); setActiveTab(tab); };
  return <div className="min-h-screen max-w-md mx-auto flex flex-col app-shell text-slate-100 relative">
    <header className="pt-safe px-5 py-4 flex items-center justify-between border-b border-white/[0.06] app-header sticky top-0 z-10"><div className="flex items-center gap-3"><div className="h-9 w-9 rounded-xl brand-mark flex items-center justify-center"><Wallet className="w-4 h-4" /></div><div><span className="text-[10px] font-semibold tracking-[0.16em] text-slate-500 uppercase">FinMentor</span><h1 className="text-[17px] font-bold tracking-tight">Мій капітал</h1></div></div><div className="flex items-center gap-2"><span className="user-chip"><UserRound size={12}/>{profile?.display_name || session.user.email?.split('@')[0]}</span><button onClick={() => setIsModalOpen(true)} aria-label="Додати операцію" className="add-button"><Plus className="w-4 h-4" /><span>Додати</span></button></div></header>
    <main className="flex-1 overflow-y-auto px-4 py-5 pb-24">{activeTab === 'dashboard' && <div className="space-y-5 animate-tab-enter"><SmartBudgetCard metrics={budgetMetrics} onUpdateLimit={updateLimit} /><div className="balance-card"><div><span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">Загальний залишок</span><span className="text-base font-bold">₴ {totals.balance.toLocaleString('uk-UA', { minimumFractionDigits: 2 })}</span></div><div className="flex gap-4 text-right"><div><span className="text-[10px] text-slate-400 block">Дохід</span><span className="text-xs font-bold text-emerald-300">+₴ {totals.income.toLocaleString('uk-UA')}</span></div><div><span className="text-[10px] text-slate-400 block">Витрати</span><span className="text-xs font-bold text-rose-300">-₴ {totals.expense.toLocaleString('uk-UA')}</span></div></div></div><TransactionList transactions={transactions} onDelete={handleDeleteTransaction} /></div>}{activeTab === 'analytics' && <AnalyticsView transactions={transactions} />}{activeTab === 'learn' && <LearnView />}{activeTab === 'settings' && <OptionsView monthlyLimit={monthlyLimit} onUpdateLimit={updateLimit} transactionCount={transactions.length} onResetTransactions={async () => { await supabase.from('transactions').delete().eq('user_id', session.user.id); setTransactions([]); }} theme={theme} onThemeChange={async value => { setTheme(value); await supabase.from('profiles').update({ theme: value, updated_at: new Date().toISOString() }).eq('id', session.user.id); }} onSignOut={() => supabase.auth.signOut()} />}</main>
    <AddTransactionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAdd={handleAddTransaction} /><nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto app-nav border-t px-4 py-2 pb-safe z-20"><div className="flex justify-around items-center h-12">{([['dashboard', Wallet, 'Журнал'], ['analytics', PieChart, 'Аналітика'], ['learn', GraduationCap, 'Навчання'], ['settings', Settings, 'Опції']] as const).map(([tab, Icon, label]) => <button key={tab} onClick={() => switchTab(tab)} className={`flex flex-col items-center justify-center flex-1 h-full min-h-11 transition-all ${activeTab === tab ? 'active-nav' : 'inactive-nav'}`}><Icon className="w-4 h-4" /><span className="text-[10px] mt-1 font-semibold tracking-tight">{label}</span></button>)}</div></nav>
  </div>;
}
