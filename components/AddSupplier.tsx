import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Supplier } from '../types';

interface AddSupplierProps {
  onAdd: (s: Supplier) => void;
}

const AddSupplier: React.FC<AddSupplierProps> = ({ onAdd }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    country: '',
    industry: '',
    annualSpend: '',
  });

  const [flags, setFlags] = useState<string[]>([]);

  const toggleFlag = (flag: string) => {
    if (flags.includes(flag)) {
        setFlags(flags.filter(f => f !== flag));
    } else {
        setFlags([...flags, flag]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Enhanced weighted risk scoring logic
    let calculatedRisk = 10; // Base baseline risk

    if (flags.includes('High-risk country')) calculatedRisk += 30;
    if (flags.includes('High-risk industry')) calculatedRisk += 25;
    if (flags.includes('Politically exposed owner')) calculatedRisk += 25;
    if (flags.includes('Uses subcontractors')) calculatedRisk += 15;
    if (flags.includes('Sole-source vendor')) calculatedRisk += 10;
    
    // Cap at 99
    const riskScore = Math.min(calculatedRisk, 99);
    
    const newSupplier: Supplier = {
        id: Math.random().toString(36).substr(2, 9),
        name: formData.name,
        country: formData.country,
        industry: formData.industry,
        annualSpend: Number(formData.annualSpend),
        riskLevel: riskScore > 70 ? 'RED' : riskScore > 40 ? 'AMBER' : 'GREEN',
        riskScore: riskScore,
        baseRisk: riskScore,
        transactionRisk: 0,
        externalRisk: 0,
        workerRisk: 0,
        alerts: 0,
        flags: flags
    };

    onAdd(newSupplier);
    navigate('/admin/suppliers');
  };

  return (
    <div className="flex justify-center pt-8 animate-fade-in">
        <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
                <h2 className="text-lg font-bold text-slate-800">Add New Supplier</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Supplier Name</label>
                        <input 
                            required
                            type="text" 
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={formData.name}
                            onChange={e => setFormData({...formData, name: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Country</label>
                        <input 
                            required
                            type="text" 
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={formData.country}
                            onChange={e => setFormData({...formData, country: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Industry</label>
                        <input 
                            required
                            type="text" 
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={formData.industry}
                            onChange={e => setFormData({...formData, industry: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Annual Spend (USD)</label>
                        <input 
                            required
                            type="number" 
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={formData.annualSpend}
                            onChange={e => setFormData({...formData, annualSpend: e.target.value})}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-3">Risk Assessment Flags</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {[
                            'High-risk country',
                            'High-risk industry',
                            'Uses subcontractors',
                            'Politically exposed owner',
                            'Sole-source vendor'
                        ].map(flag => (
                            <label key={flag} className="flex items-center gap-3 cursor-pointer p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                                <input 
                                    type="checkbox" 
                                    checked={flags.includes(flag)}
                                    onChange={() => toggleFlag(flag)}
                                    className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                                />
                                <span className="text-sm text-slate-700 font-medium">{flag}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                    <button 
                        type="button" 
                        onClick={() => navigate('/admin/suppliers')}
                        className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit" 
                        className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-sm"
                    >
                        Save Supplier
                    </button>
                </div>
            </form>
        </div>
    </div>
  );
};

export default AddSupplier;