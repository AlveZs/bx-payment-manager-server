export interface CustomerFilter {
  onlyDebtors?: boolean;
  onlyActives?: boolean;
  onlyPaid?: boolean;
  nameContains?: string;
}