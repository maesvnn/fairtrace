import React, { useState } from 'react';
import { Supplier, Transaction, WorkerSurveyResponse } from '../types';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, Flag, AlertTriangle, CheckCircle, ExternalLink, Copy } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { analyzeSupplierRisks, analyzeWorkerFeedback } from '../services/geminiService';

interface SupplierDetailProps {
  suppliers: Supplier[];
  transactions: Transaction[];
  surveyResponses: WorkerSurveyResponse[];
}

const SupplierDetail: React.FC<SupplierDetailProps> = ({ suppliers, transactions, surveyResponses }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'worker' | 'external'>('overview');
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const supplier = suppliers.find((s) => s.id === id);
  const supplierTransactions = transactions.filter(t => t.supplierId === id);
  const supplierSurveys = surveyResponses.filter(r => r.supplierId === id);

  if (!supplier) {
    return <div className="p-8">Supplier not found.</div>;
  }

  const handleAiAnalysis = async () => {
    setIsAnalyzing(true);
    const result = await analyzeSupplierRisks(supplier);
    setAiAnalysis(result);
    setIsAnalyzing(false);
  };

  const copySurveyLink = () => {
      // In a real app this would be the actual URL
      navigator.clipboard.writeText(`${window.location.origin}/#/worker/survey?sid=${supplier.id}`);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
  }

  // Worker stats
  const totalResponses = supplierSurveys.length;
  const forcedOvertimeCount = supplierSurveys.filter(r => r.forcedOvertime).length;
  const underpaidCount = supplierSurveys.filter(r => !r.paidMinimumWage).length;
  
  const workerChartData = [
    { name: 'Forced OT', yes: forcedOvertimeCount, no: totalResponses - forcedOvertimeCount },
    { name: 'Underpaid', yes: underpaidCount, no: totalResponses - underpaidCount },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      {/* Header */}
      <button onClick={() => navigate('/admin/suppliers')} className="flex items-center text-sm text-slate-500 hover:text-slate-800 transition-colors mb-2">
        <ArrowLeft size={16} className="mr-1" /> Back to Suppliers
      </button>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
              {supplier.name}
              <span className={`px-3 py-1 text-sm rounded-full ${supplier.riskLevel === 'RED' ? 'bg-red-100 text-red-700' : supplier.riskLevel === 'AMBER' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                {supplier.riskLevel}
              </span>
            </h1>
            <p className="text-slate-500 mt-1">{supplier.industry} • {supplier.country} • Spend: ${supplier.annualSpend.toLocaleString()}</p>
          </div>
          <div className="text-right">
             <div className="text-4xl font-black text-slate-800">{supplier.riskScore}</div>
             <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">Risk Score</div>
          </div>
        </div>

        {/* Risk Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {[
                { label: 'Base Risk', val: supplier.baseRisk },
                { label: 'Tx Risk', val: supplier.transactionRisk },
                { label: 'Ext Risk', val: supplier.externalRisk },
                { label: 'Worker Risk', val: supplier.workerRisk },
            ].map((item) => (
                <div key={item.label} className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <div className="text-xs text-slate-500 font-medium">{item.label}</div>
                    <div className={`text-xl font-bold ${item.val > 60 ? 'text-red-600' : item.val > 30 ? 'text-amber-600' : 'text-green-600'}`}>{item.val}</div>
                </div>
            ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 flex space-x-6">
        {['overview', 'worker', 'external'].map((tab) => (
            <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`pb-3 text-sm font-medium capitalize transition-colors border-b-2 ${activeTab === tab ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
            >
                {tab}
            </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col - Main Content */}
        <div className="lg:col-span-2 space-y-6">
            
            {activeTab === 'overview' && (
                <>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-slate-800">Recent Transactions</h3>
                            {supplierTransactions.some(t => t.flags.length > 0) && (
                                <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded font-bold">Suspicious Activity Detected</span>
                            )}
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="text-slate-500 bg-slate-50">
                                    <tr>
                                        <th className="px-4 py-2 text-left">Date</th>
                                        <th className="px-4 py-2 text-left">PO #</th>
                                        <th className="px-4 py-2 text-right">Amount</th>
                                        <th className="px-4 py-2 text-left">Flags</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {supplierTransactions.length === 0 ? (
                                        <tr><td colSpan={4} className="p-4 text-center text-slate-400">No recent transactions</td></tr>
                                    ) : (
                                        supplierTransactions.map(t => (
                                            <tr key={t.id}>
                                                <td className="px-4 py-3 text-slate-600">{t.date}</td>
                                                <td className="px-4 py-3 font-mono text-slate-800">{t.poNumber}</td>
                                                <td className="px-4 py-3 text-right">${t.amount.toLocaleString()}</td>
                                                <td className="px-4 py-3">
                                                    <div className="flex gap-1 flex-wrap">
                                                        {t.flags.map(f => (
                                                            <span key={f} className="text-xs bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded">{f}</span>
                                                        ))}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}

            {activeTab === 'worker' && (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h3 className="font-bold text-slate-800 mb-6">Worker Voice Survey Results</h3>
                    
                    {totalResponses === 0 ? (
                        <div className="text-center py-10 text-slate-400">
                            <p>No survey responses yet.</p>
                            <p className="text-sm">Share the link with the supplier to gather data.</p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 gap-8">
                            <div>
                                <h4 className="text-sm font-semibold text-slate-500 mb-3">Key Issues</h4>
                                <ul className="space-y-3">
                                    <li className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-100">
                                        <span className="text-sm text-red-800 font-medium">Forced Overtime</span>
                                        <span className="text-lg font-bold text-red-800">{((forcedOvertimeCount / totalResponses) * 100).toFixed(0)}%</span>
                                    </li>
                                    <li className="flex justify-between items-center p-3 bg-amber-50 rounded-lg border border-amber-100">
                                        <span className="text-sm text-amber-800 font-medium">Underpaid</span>
                                        <span className="text-lg font-bold text-amber-800">{((underpaidCount / totalResponses) * 100).toFixed(0)}%</span>
                                    </li>
                                </ul>
                                <div className="mt-6">
                                    <h4 className="text-sm font-semibold text-slate-500 mb-2">AI Sentiment Analysis</h4>
                                    <div className="bg-slate-50 p-3 rounded text-sm text-slate-600 italic">
                                        "Workers are consistently reporting unpaid overtime and harsh conditions on the night shift." (Simulated AI Summary)
                                    </div>
                                </div>
                            </div>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={workerChartData}>
                                        <XAxis dataKey="name" fontSize={12} />
                                        <YAxis fontSize={12} />
                                        <Tooltip />
                                        <Bar dataKey="yes" fill="#ef4444" name="Yes (Bad)" stackId="a" />
                                        <Bar dataKey="no" fill="#cbd5e1" name="No (Good)" stackId="a" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    )}

                    <div className="mt-8 border-t border-slate-100 pt-6">
                        <label className="block text-sm font-medium text-slate-700 mb-2">Survey Link for Workers</label>
                        <div className="flex gap-2">
                            <input 
                                readOnly 
                                value={`${window.location.origin}/#/worker/survey?sid=${supplier.id}`}
                                className="flex-1 bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-600"
                            />
                            <button onClick={copySurveyLink} className="bg-white border border-slate-300 px-3 py-2 rounded-lg hover:bg-slate-50">
                                {copiedLink ? <CheckCircle size={18} className="text-green-600"/> : <Copy size={18} className="text-slate-500"/>}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'external' && (
                <div className="space-y-4">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <Sparkles className="text-indigo-500" size={18} />
                            AI Risk Assessment
                        </h3>
                        {aiAnalysis ? (
                            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100 text-sm text-indigo-900 leading-relaxed whitespace-pre-line">
                                {aiAnalysis}
                            </div>
                        ) : (
                            <div className="text-center py-6">
                                <p className="text-sm text-slate-500 mb-4">Generate a real-time risk analysis using Gemini.</p>
                                <button 
                                    onClick={handleAiAnalysis} 
                                    disabled={isAnalyzing}
                                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
                                >
                                    {isAnalyzing ? 'Analyzing...' : 'Generate Analysis'}
                                </button>
                            </div>
                        )}
                    </div>
                    
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                         <h3 className="font-bold text-slate-800 mb-4">External Incidents</h3>
                         <div className="space-y-3">
                             {/* Mock Incident */}
                             <div className="p-3 border-l-4 border-l-red-500 bg-white shadow-sm border border-slate-100 rounded-r-md">
                                 <div className="flex justify-between items-start">
                                     <h4 className="text-sm font-bold text-slate-800">NGO Report: Forced Labor Allegations</h4>
                                     <span className="text-xs text-slate-400">2025-05-01</span>
                                 </div>
                                 <p className="text-xs text-slate-500 mt-1">Source: Watchdog International</p>
                             </div>
                         </div>
                    </div>
                </div>
            )}

        </div>

        {/* Right Col - Quick Actions/Info */}
        <div className="space-y-6">
             <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
                <h3 className="font-bold text-slate-800 mb-4">Corrective Actions</h3>
                <div className="space-y-3">
                    <div className="flex items-center justify-between p-2 bg-slate-50 rounded border border-slate-100">
                        <span className="text-xs font-medium text-slate-700">Audit Requested</span>
                        <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-bold">OPEN</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-slate-50 rounded border border-slate-100">
                        <span className="text-xs font-medium text-slate-700">Safety Training</span>
                        <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-bold">DONE</span>
                    </div>
                    <button className="w-full mt-2 text-xs text-indigo-600 hover:text-indigo-800 font-medium">+ Add Action Plan</button>
                </div>
             </div>

             <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
                <h3 className="font-bold text-slate-800 mb-4">Compliance Documents</h3>
                <ul className="text-sm space-y-2 text-slate-600">
                    <li className="flex items-center gap-2"><CheckCircle size={14} className="text-green-500"/> Business License</li>
                    <li className="flex items-center gap-2"><AlertTriangle size={14} className="text-amber-500"/> Fire Safety Cert (Expiring)</li>
                    <li className="flex items-center gap-2"><CheckCircle size={14} className="text-green-500"/> ISO 9001</li>
                </ul>
             </div>
        </div>

      </div>
    </div>
  );
};

export default SupplierDetail;