import type { Transaction } from '../types';

export interface BudgetMetrics {
  monthlyLimit: number;
  monthSpent: number;
  monthRemaining: number;
  daysRemaining: number;
  dailyAllowance: number;
  spentToday: number;
  todayRemaining: number;
  progressPercent: number;
  status: 'optimal' | 'warning' | 'danger';
}

export function calculateBudgetMetrics(
  transactions: Transaction[],
  monthlyLimit: number
): BudgetMetrics {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0-11
  const todayStr = now.toISOString().split('T')[0];

  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const currentDay = now.getDate();
  const daysRemaining = Math.max(1, lastDayOfMonth - currentDay + 1);

  const currentMonthExpenses = transactions.filter(t => {
    if (t.type !== 'expense') return false;
    const txDate = new Date(t.date);
    return txDate.getFullYear() === currentYear && txDate.getMonth() === currentMonth;
  });

  const monthSpent = currentMonthExpenses.reduce((sum, t) => sum + t.amount, 0);
  const monthRemaining = Math.max(0, monthlyLimit - monthSpent);

  const spentToday = currentMonthExpenses
    .filter(t => t.date === todayStr)
    .reduce((sum, t) => sum + t.amount, 0);

  const dailyAllowance = Math.round(monthRemaining / daysRemaining);
  const todayRemaining = dailyAllowance - spentToday;

  const progressPercent = Math.min(100, Math.round((monthSpent / (monthlyLimit || 1)) * 100));

  const expectedPace = (currentDay / lastDayOfMonth) * 100;
  let status: 'optimal' | 'warning' | 'danger' = 'optimal';

  if (progressPercent > expectedPace + 15 || monthRemaining === 0) {
    status = 'danger';
  } else if (progressPercent > expectedPace + 5) {
    status = 'warning';
  }

  return {
    monthlyLimit,
    monthSpent,
    monthRemaining,
    daysRemaining,
    dailyAllowance,
    spentToday,
    todayRemaining,
    progressPercent,
    status
  };
}