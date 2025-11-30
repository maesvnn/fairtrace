import React, { useState } from 'react';
import { User } from '../types';
import { ShieldCheck, HardHat, Briefcase, User as UserIcon } from 'lucide-react';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [activeTab, setActiveTab] = useState<'admin' | 'worker'>('admin');
  
  // Admin State
  const [adminUsername, setAdminUsername] = useState('admin');
  const [adminPassword, setAdminPassword] = useState('password');

  // Worker State
  const [workerName, setWorkerName] = useState('');
  const [workerId, setWorkerId] = useState('');
  const [workerPassword, setWorkerPassword] = useState('');

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate auth check
    if (adminUsername && adminPassword) {
        onLogin({ id: 'u1', name: 'Alex Manager', role: 'admin' });
    }
  };

  const handleWorkerLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (workerName && workerId && workerPassword) {
        onLogin({ id: `w-${workerId}`, name: workerName, role: 'worker', workerId });
    } else {
        alert("Please fill in all fields.");
    }
  };

  const handleAnonymousWorkerLogin = () => {
    onLogin({ 
        id: `anon-${Math.random().toString(36).substr(2, 5)}`, 
        name: 'Anonymous Worker', 
        role: 'worker', 
        workerId: 'ANON',
        isAnonymous: true 
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        
        {/* Header with Logo */}
        <div className="bg-slate-900 p-8 text-center">
            <div className="flex justify-center mb-4">
                <ShieldCheck className="h-12 w-12 text-indigo-500" />
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">FairTrace</h1>
            <p className="text-slate-400 mt-2">Supply Chain Integrity Platform</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200">
            <button 
                onClick={() => setActiveTab('admin')}
                className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${activeTab === 'admin' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50' : 'text-slate-500 hover:text-slate-700'}`}
            >
                <Briefcase size={18} /> Admin Access
            </button>
            <button 
                onClick={() => setActiveTab('worker')}
                className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${activeTab === 'worker' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50' : 'text-slate-500 hover:text-slate-700'}`}
            >
                <HardHat size={18} /> Worker Portal
            </button>
        </div>

        {/* Form */}
        <div className="p-8">
            {activeTab === 'admin' ? (
                <form onSubmit={handleAdminLogin} className="space-y-6 animate-fade-in">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
                        <input 
                            type="text" 
                            value={adminUsername}
                            onChange={(e) => setAdminUsername(e.target.value)}
                            className="w-full border border-slate-300 rounded-lg px-4 py-3 text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            placeholder="Enter username"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                        <input 
                            type="password" 
                            value={adminPassword}
                            onChange={(e) => setAdminPassword(e.target.value)}
                            className="w-full border border-slate-300 rounded-lg px-4 py-3 text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            placeholder="••••••••"
                        />
                    </div>
                    <button 
                        type="submit" 
                        className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition-colors shadow-lg"
                    >
                        Login to Dashboard
                    </button>
                    <p className="text-center text-xs text-slate-400 mt-4">
                        Secure Corporate Access
                    </p>
                </form>
            ) : (
                <div className="space-y-6 animate-fade-in">
                     <form onSubmit={handleWorkerLogin} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                            <input 
                                type="text" 
                                value={workerName}
                                onChange={(e) => setWorkerName(e.target.value)}
                                className="w-full border border-slate-300 rounded-lg px-4 py-3 text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                placeholder="e.g. John Doe"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Worker ID</label>
                            <input 
                                type="text" 
                                value={workerId}
                                onChange={(e) => setWorkerId(e.target.value)}
                                className="w-full border border-slate-300 rounded-lg px-4 py-3 text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                placeholder="e.g. 8842-B"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                            <input 
                                type="password" 
                                value={workerPassword}
                                onChange={(e) => setWorkerPassword(e.target.value)}
                                className="w-full border border-slate-300 rounded-lg px-4 py-3 text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                placeholder="••••••••"
                            />
                        </div>

                        <button 
                            type="submit" 
                            className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition-colors shadow-lg"
                        >
                            Login
                        </button>
                    </form>
                    
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-slate-500">Or</span>
                        </div>
                    </div>

                    <button 
                        onClick={handleAnonymousWorkerLogin}
                        className="w-full bg-slate-100 text-slate-600 font-semibold py-3 rounded-lg hover:bg-slate-200 transition-colors border border-slate-200 flex items-center justify-center gap-2"
                    >
                        <UserIcon size={16} /> Proceed Anonymously
                    </button>
                </div>
            )}
        </div>

      </div>
    </div>
  );
};

export default LoginPage;