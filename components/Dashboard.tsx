import React from 'react';
import { Supplier, Alert } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowUpRight, CheckCircle, ShieldAlert } from 'lucide-react';

interface DashboardProps {
  suppliers: Supplier[];
  alerts: Alert[];
}

const Dashboard: React.FC<DashboardProps> = ({ suppliers, alerts }) => {
  const navigate = useNavigate();

  const totalSuppliers = suppliers.length;
  const highRisk = suppliers.filter(s => s.riskLevel === 'RED').length;
  const medRisk = suppliers.filter(s => s.riskLevel === 'AMBER').length;
  const lowRisk = suppliers.filter(s => s.riskLevel === 'GREEN').length;

  const data = [
    { name: 'High Risk', value: highRisk, color: '#ef4444' },
    { name: 'Medium Risk', value: medRisk, color: '#f59e0b' },
    { name: 'Low Risk', value: lowRisk, color: '#22c55e' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h2 className="text-3xl font-bold text-slate-800">Dashboard</h2>
           <p className="text-slate-500">Overview of supplier integrity & compliance status.</p>
        </div>
        <div className="flex gap-2">
            <button 
                onClick={() => navigate('/admin/upload')}
                className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm"
            >
                Upload CSV
            </button>
            <button 
                onClick={() => navigate('/admin/suppliers/new')}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-md"
            >
                Add Supplier
            </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <p className="text-sm font-medium text-slate-500">Total Suppliers</p>
          <p className="text-3xl font-bold text-slate-800 mt-2">{totalSuppliers}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-l-4 border-l-red-500 border-slate-100">
          <p className="text-sm font-medium text-red-600 flex items-center gap-2">
            <ShieldAlert size={16} /> High Risk
          </p>
          <p className="text-3xl font-bold text-slate-800 mt-2">{highRisk}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-l-4 border-l-amber-500 border-slate-100">
          <p className="text-sm font-medium text-amber-600 flex items-center gap-2">
            <AlertCircle size={16} /> Medium Risk
          </p>
          <p className="text-3xl font-bold text-slate-800 mt-2">{medRisk}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-l-4 border-l-green-500 border-slate-100">
          <p className="text-sm font-medium text-green-600 flex items-center gap-2">
            <CheckCircle size={16} /> Low Risk
          </p>
          <p className="text-3xl font-bold text-slate-800 mt-2">{lowRisk}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Supplier Table */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-semibold text-slate-800">Top Risky Suppliers</h3>
            <button onClick={() => navigate('/admin/suppliers')} className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1">
                View All <ArrowUpRight size={14} />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-6 py-3 font-medium">Name</th>
                  <th className="px-6 py-3 font-medium">Country</th>
                  <th className="px-6 py-3 font-medium">Risk Score</th>
                  <th className="px-6 py-3 font-medium">Level</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {suppliers.sort((a, b) => b.riskScore - a.riskScore).slice(0, 5).map((s) => (
                  <tr 
                    key={s.id} 
                    onClick={() => navigate(`/admin/suppliers/${s.id}`)}
                    className="hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-slate-900">{s.name}</td>
                    <td className="px-6 py-4 text-slate-500">{s.country}</td>
                    <td className="px-6 py-4 font-bold text-slate-800">{s.riskScore}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold 
                        ${s.riskLevel === 'RED' ? 'bg-red-100 text-red-700' : 
                          s.riskLevel === 'AMBER' ? 'bg-amber-100 text-amber-700' : 
                          'bg-green-100 text-green-700'}`}>
                        {s.riskLevel}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Alerts & Chart */}
        <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                 <h3 className="font-semibold text-slate-800 mb-4">Risk Distribution</h3>
                 <div className="h-48 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data}>
                            <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis hide />
                            <Tooltip cursor={{fill: 'transparent'}} />
                            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                 </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                <h3 className="font-semibold text-slate-800 mb-4">Recent Alerts</h3>
                <div className="space-y-4">
                    {alerts.map(alert => (
                        <div key={alert.id} className="flex gap-3 items-start">
                            <div className={`mt-1 h-2 w-2 rounded-full flex-shrink-0 ${alert.severity === 'high' ? 'bg-red-500' : 'bg-amber-400'}`} />
                            <div>
                                <p className="text-sm text-slate-700 leading-tight">{alert.message}</p>
                                <p className="text-xs text-slate-400 mt-1">{alert.date}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;