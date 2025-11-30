export type RiskLevel = 'RED' | 'AMBER' | 'GREEN';

export interface Supplier {
  id: string;
  name: string;
  country: string;
  industry: string;
  annualSpend: number;
  riskLevel: RiskLevel;
  riskScore: number;
  baseRisk: number;
  transactionRisk: number;
  externalRisk: number;
  workerRisk: number;
  alerts: number;
  flags: string[]; // e.g., "High-risk country", "Political exposure"
}

export interface Transaction {
  id: string;
  date: string;
  poNumber: string;
  amount: number;
  department: string;
  flags: string[]; // "Round Amount", "Split PO"
  supplierId: string;
}

export interface WorkerSurveyResponse {
  id: string;
  supplierId: string;
  paidMinimumWage: boolean;
  forcedOvertime: boolean;
  feesCharged: boolean;
  comments: string;
  timestamp: string;
}

export interface Alert {
  id: string;
  message: string;
  severity: 'high' | 'medium' | 'low';
  date: string;
}

export interface User {
  id: string;
  name: string;
  role: 'admin' | 'worker';
  workerId?: string; // Only for workers
  supplierId?: string; // Only for workers (which factory they belong to)
  isAnonymous?: boolean;
}