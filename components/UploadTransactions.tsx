import React, { useState } from 'react';
import { UploadCloud, FileText, CheckCircle, AlertTriangle } from 'lucide-react';

const UploadTransactions: React.FC = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);

  const handleUpload = () => {
    setIsUploading(true);
    // Simulate processing delay
    setTimeout(() => {
        setIsUploading(false);
        setUploadComplete(true);
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200 text-center">
        {!uploadComplete ? (
            <>
                <div className="h-16 w-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <UploadCloud size={32} />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Upload Transaction Log</h2>
                <p className="text-slate-500 mb-8 max-w-md mx-auto">Upload a CSV file containing PO numbers, amounts, supplier names, and dates to analyze purchasing patterns.</p>
                
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-12 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer group mb-6">
                    <p className="text-slate-600 font-medium group-hover:text-indigo-600">Click to browse or drag file here</p>
                    <p className="text-xs text-slate-400 mt-2">CSV, XLS up to 10MB</p>
                </div>

                <button 
                    onClick={handleUpload}
                    disabled={isUploading}
                    className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto"
                >
                    {isUploading ? 'Analyzing...' : 'Upload and Analyze'}
                </button>
            </>
        ) : (
            <div className="py-8">
                <div className="h-16 w-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                    <CheckCircle size={32} />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Analysis Complete</h2>
                <p className="text-slate-500 mb-8">We found 152 transactions. 3 patterns flagged.</p>
                
                <div className="text-left bg-slate-50 rounded-lg border border-slate-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-200">
                        <h3 className="font-bold text-slate-800">Suspicious Findings</h3>
                    </div>
                    <div className="divide-y divide-slate-100">
                        <div className="p-4 flex gap-4 items-start">
                             <AlertTriangle className="text-red-500 flex-shrink-0 mt-1" size={18} />
                             <div>
                                 <p className="text-sm font-bold text-slate-800">Split Purchase Orders (Structuring)</p>
                                 <p className="text-sm text-slate-600">Supplier <span className="font-semibold">Sunrise Textiles</span> had 3 POs just under $100k limit within 4 days.</p>
                             </div>
                        </div>
                        <div className="p-4 flex gap-4 items-start">
                             <AlertTriangle className="text-amber-500 flex-shrink-0 mt-1" size={18} />
                             <div>
                                 <p className="text-sm font-bold text-slate-800">Round Number Invoicing</p>
                                 <p className="text-sm text-slate-600">Multiple invoices for exactly $50,000.00 found for <span className="font-semibold">GreenLeaf Agro</span>.</p>
                             </div>
                        </div>
                    </div>
                </div>
                
                <button 
                    onClick={() => setUploadComplete(false)}
                    className="mt-8 text-indigo-600 hover:text-indigo-800 font-medium text-sm"
                >
                    Upload another file
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default UploadTransactions;