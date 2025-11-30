import React, { useState } from 'react';
import { Supplier } from '../types';
import { useNavigate } from 'react-router-dom';
import { Plus, Eye, Sparkles } from 'lucide-react';
import { getQuickRiskSummary } from '../services/geminiService';

interface SupplierListProps {
  suppliers: Supplier[];
}

const SupplierList: React.FC<SupplierListProps> = ({ suppliers }) => {
  const navigate = useNavigate();
  const [aiSummaries, setAiSummaries] = useState<Record<string, string>>({});
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleAiScan = async (e: React.MouseEvent, supplier: Supplier) => {
      e.stopPropagation();
      if (aiSummaries[supplier.id]) return; // already loaded

      setLoadingId(supplier.id);
      const summary = await getQuickRiskSummary(supplier);
      setAiSummaries(prev => ({...prev, [supplier.id]: summary}));
      setLoadingId(null);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      <div className="flex justify-between items-center">
        <div>
            <h2 className="text-2xl font-bold text-slate-800">Suppliers</h2>
            <p className="text-slate-500">Monitor risk levels across your supply chain.</p>
        </div>
        <button 
          onClick={() => navigate('/admin/suppliers/new')}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-sm"
        >
          <Plus size={16} /> Add Supplier
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Country</th>
                <th className="px-6 py-4 font-medium">Risk Status</th>
                <th className="px-6 py-4 font-medium text-center bg-slate-100">Base</th>
                <th className="px-6 py-4 font-medium text-center bg-slate-100">Work</th>
                <th className="px-6 py-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {suppliers.map((s) => (
                <React.Fragment key={s.id}>
                    <tr 
                    className="hover:bg-slate-50 transition-colors"
                    >
                    <td 
                        onClick={() => navigate(`/admin/suppliers/${s.id}`)}
                        className="px-6 py-4 font-medium text-slate-900 cursor-pointer"
                    >
                        {s.name}
                        <div className="text-xs text-slate-500 font-normal">{s.industry}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{s.country}</td>
                    <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                             <span className={`px-2 py-1 rounded-full text-xs font-bold w-20 text-center
                            ${s.riskLevel === 'RED' ? 'bg-red-100 text-red-700' : 
                                s.riskLevel === 'AMBER' ? 'bg-amber-100 text-amber-700' : 
                                'bg-green-100 text-green-700'}`}>
                            {s.riskLevel}
                            </span>
                            <button 
                                onClick={(e) => handleAiScan(e, s)}
                                className="text-indigo-600 hover:text-indigo-800 p-1 rounded-full hover:bg-indigo-50 transition-colors"
                                title="Get AI Insight"
                            >
                                <Sparkles size={16} className={loadingId === s.id ? "animate-spin" : ""} />
                            </button>
                        </div>
                    </td>
                    <td className="px-6 py-4 text-center font-mono text-slate-500">{s.baseRisk}</td>
                    <td className="px-6 py-4 text-center font-mono text-slate-500">{s.workerRisk}</td>
                    <td className="px-6 py-4">
                        <button 
                            onClick={() => navigate(`/admin/suppliers/${s.id}`)}
                            className="flex items-center gap-1 text-slate-500 hover:text-indigo-600 transition-colors text-sm font-medium border border-slate-200 px-3 py-1.5 rounded-lg bg-white hover:border-indigo-200"
                        >
                            <Eye size={14} /> View Details
                        </button>
                    </td>
                    </tr>
                    {aiSummaries[s.id] && (
                        <tr className="bg-indigo-50/50">
                            <td colSpan={6} className="px-6 py-3">
                                <div className="flex items-start gap-2">
                                    <Sparkles size={14} className="text-indigo-600 mt-0.5 flex-shrink-0" />
                                    <p className="text-xs text-indigo-900 italic leading-relaxed">
                                        <span className="font-semibold not-italic text-indigo-700">AI Risk Insight:</span> {aiSummaries[s.id]}
                                    </p>
                                </div>
                            </td>
                        </tr>
                    )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SupplierList;