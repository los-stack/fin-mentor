export type TransactionType = 'expense' | 'income';

export type Category = 
  | 'food'        
  | 'transport'   
  | 'housing'     
  | 'fun'         
  | 'salary'     
  | 'other';     

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  category: Category;
  date: string; 
}