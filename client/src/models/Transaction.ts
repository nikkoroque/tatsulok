export interface Transaction {
  transaction_id: number;
  product_id: number;
  quantity: number;
  transaction_type: string;
  transaction_date: Date;
  remarks: string;
}