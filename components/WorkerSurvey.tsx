import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, Shield } from 'lucide-react';
import { User } from '../types';

interface WorkerSurveyProps {
    user?: User | null;
}

const WorkerSurvey: React.FC<WorkerSurveyProps> = ({ user }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  
  // Mock supplier info based on ID in URL, purely visual
  const supplierName = "Sunrise Textiles (Factory A)";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // In a real app, post to API
  };

  if (submitted) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 animate-fade-in">
            <div className="h-20 w-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                <CheckCircle size={40} />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Thank You</h2>
            <p className="text-slate-600 mb-8">Your answers have been recorded anonymously.</p>
            <button onClick={() => navigate('/')} className="text-indigo-600 font-medium">Return to Home</button>
        </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden animate-fade-in mb-8">
      <div className="bg-indigo-600 p-6 text-white">
        <h2 className="text-xl font-bold">{supplierName}</h2>
        <p className="text-indigo-100 text-sm mt-1">Worker Wellbeing Survey</p>
      </div>

      <div className="bg-indigo-50 px-6 py-3 flex items-center gap-2 border-b border-indigo-100">
         <Shield size={14} className="text-indigo-600"/>
         <span className="text-xs font-medium text-indigo-900">
            Logged in as: {user?.isAnonymous ? 'Anonymous' : user?.name || 'Worker'}
         </span>
      </div>
      
      <div className="p-6">
        <p className="text-sm text-slate-500 mb-6 bg-slate-50 p-3 rounded border border-slate-100">
            This survey is <strong>100% anonymous</strong>. Your manager will not see your individual answers.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="space-y-3">
                <label className="block text-slate-800 font-medium">1. Are you paid at least the legal minimum wage?</label>
                <div className="flex gap-4">
                    <label className="flex items-center gap-2 p-3 border border-slate-200 rounded-lg flex-1 cursor-pointer hover:bg-slate-50">
                        <input type="radio" name="q1" className="h-4 w-4 text-indigo-600" required />
                        <span>Yes</span>
                    </label>
                    <label className="flex items-center gap-2 p-3 border border-slate-200 rounded-lg flex-1 cursor-pointer hover:bg-slate-50">
                        <input type="radio" name="q1" className="h-4 w-4 text-indigo-600" />
                        <span>No</span>
                    </label>
                </div>
            </div>

            <div className="space-y-3">
                <label className="block text-slate-800 font-medium">2. Do you feel forced to work overtime?</label>
                <div className="flex gap-4">
                    <label className="flex items-center gap-2 p-3 border border-slate-200 rounded-lg flex-1 cursor-pointer hover:bg-slate-50">
                        <input type="radio" name="q2" className="h-4 w-4 text-indigo-600" required />
                        <span>Yes</span>
                    </label>
                    <label className="flex items-center gap-2 p-3 border border-slate-200 rounded-lg flex-1 cursor-pointer hover:bg-slate-50">
                        <input type="radio" name="q2" className="h-4 w-4 text-indigo-600" />
                        <span>No</span>
                    </label>
                </div>
            </div>

            <div className="space-y-3">
                <label className="block text-slate-800 font-medium">3. Are your identity documents held by the employer?</label>
                <div className="flex gap-4">
                    <label className="flex items-center gap-2 p-3 border border-slate-200 rounded-lg flex-1 cursor-pointer hover:bg-slate-50">
                        <input type="radio" name="q3" className="h-4 w-4 text-indigo-600" required />
                        <span>Yes</span>
                    </label>
                    <label className="flex items-center gap-2 p-3 border border-slate-200 rounded-lg flex-1 cursor-pointer hover:bg-slate-50">
                        <input type="radio" name="q3" className="h-4 w-4 text-indigo-600" />
                        <span>No</span>
                    </label>
                </div>
            </div>

            <div className="space-y-3">
                <label className="block text-slate-800 font-medium">4. Any other concerns? (Optional)</label>
                <textarea 
                    className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    rows={3}
                    placeholder="Type here..."
                ></textarea>
            </div>

            <button 
                type="submit" 
                className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition-colors shadow-lg mt-4"
            >
                Submit Survey
            </button>

        </form>
      </div>
    </div>
  );
};

export default WorkerSurvey;