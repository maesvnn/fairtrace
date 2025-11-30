import { Supplier, Transaction, Alert } from './types';

export const INITIAL_SUPPLIERS: Supplier[] = [
  {
    id: '1',
    name: 'Sunrise Textiles',
    country: 'Bangladesh',
    industry: 'Textiles',
    annualSpend: 1000000,
    riskLevel: 'RED',
    riskScore: 82,
    baseRisk: 70,
    transactionRisk: 80,
    externalRisk: 25,
    workerRisk: 65,
    alerts: 5,
    flags: ['High-risk country', 'Politically exposed owner']
  },
  {
    id: '2',
    name: 'Aurora Mining',
    country: 'Chile',
    industry: 'Mining',
    annualSpend: 750000,
    riskLevel: 'AMBER',
    riskScore: 58,
    baseRisk: 55,
    transactionRisk: 40,
    externalRisk: 10,
    workerRisk: 20,
    alerts: 2,
    flags: ['Environmental concerns']
  },
  {
    id: '3',
    name: 'BrightOffice Supplies',
    country: 'Germany',
    industry: 'Office',
    annualSpend: 120000,
    riskLevel: 'GREEN',
    riskScore: 21,
    baseRisk: 20,
    transactionRisk: 10,
    externalRisk: 0,
    workerRisk: 0,
    alerts: 0,
    flags: []
  },
  {
    id: '4',
    name: 'TechComponent Inc',
    country: 'Taiwan',
    industry: 'Electronics',
    annualSpend: 2500000,
    riskLevel: 'GREEN',
    riskScore: 15,
    baseRisk: 10,
    transactionRisk: 5,
    externalRisk: 5,
    workerRisk: 10,
    alerts: 0,
    flags: []
  },
  {
    id: '5',
    name: 'GreenLeaf Agro',
    country: 'Brazil',
    industry: 'Agriculture',
    annualSpend: 600000,
    riskLevel: 'AMBER',
    riskScore: 62,
    baseRisk: 60,
    transactionRisk: 30,
    externalRisk: 40,
    workerRisk: 50,
    alerts: 3,
    flags: ['Labor disputes']
  }
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 't1', date: '2025-01-10', poNumber: 'PO-1001', amount: 100000, department: 'Procurement', flags: ['Round Amount', 'Split PO'], supplierId: '1' },
  { id: 't2', date: '2025-01-12', poNumber: 'PO-1002', amount: 95000, department: 'Procurement', flags: ['Split PO'], supplierId: '1' },
  { id: 't3', date: '2025-01-14', poNumber: 'PO-1003', amount: 98000, department: 'Procurement', flags: ['Split PO'], supplierId: '1' },
  { id: 't4', date: '2025-02-01', poNumber: 'PO-2055', amount: 12500, department: 'IT', flags: [], supplierId: '3' },
];

export const MOCK_ALERTS: Alert[] = [
  { id: 'a1', message: '2 suppliers moved from AMBER to RED this month', severity: 'high', date: '2025-05-12' },
  { id: 'a2', message: '10 suspicious purchase patterns flagged', severity: 'medium', date: '2025-05-10' },
  { id: 'a3', message: 'New NGO report available for Sunrise Textiles', severity: 'high', date: '2025-05-08' },
];