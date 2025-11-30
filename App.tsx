import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import SupplierList from './components/SupplierList';
import SupplierDetail from './components/SupplierDetail';
import AddSupplier from './components/AddSupplier';
import UploadTransactions from './components/UploadTransactions';
import WorkerSurvey from './components/WorkerSurvey';
import { INITIAL_SUPPLIERS, MOCK_TRANSACTIONS, MOCK_ALERTS } from './constants';
import { User, Supplier } from './types';

// Mock Worker Responses
const MOCK_SURVEYS = [
    { id: 's1', supplierId: '1', paidMinimumWage: false, forcedOvertime: true, feesCharged: true, comments: 'Boss takes passport', timestamp: '2025-01-01' },
    { id: 's2', supplierId: '1', paidMinimumWage: true, forcedOvertime: true, feesCharged: false, comments: '', timestamp: '2025-01-02' },
    { id: 's3', supplierId: '1', paidMinimumWage: true, forcedOvertime: true, feesCharged: false, comments: '', timestamp: '2025-01-02' },
    { id: 's4', supplierId: '1', paidMinimumWage: false, forcedOvertime: true, feesCharged: true, comments: '', timestamp: '2025-01-03' },
];

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [suppliers, setSuppliers] = useState<Supplier[]>(INITIAL_SUPPLIERS);

  const handleAddSupplier = (newSupplier: Supplier) => {
    setSuppliers([...suppliers, newSupplier]);
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return <LoginPage onLogin={setUser} />;
  }

  return (
    <Router>
      <Layout user={user} onLogout={handleLogout}>
        <Routes>
          {/* Admin Routes */}
          {user.role === 'admin' && (
            <>
                <Route path="/" element={<Navigate to="/admin" replace />} />
                <Route path="/admin" element={<Dashboard suppliers={suppliers} alerts={MOCK_ALERTS} />} />
                <Route path="/admin/suppliers" element={<SupplierList suppliers={suppliers} />} />
                <Route path="/admin/suppliers/new" element={<AddSupplier onAdd={handleAddSupplier} />} />
                <Route path="/admin/suppliers/:id" element={<SupplierDetail suppliers={suppliers} transactions={MOCK_TRANSACTIONS} surveyResponses={MOCK_SURVEYS} />} />
                <Route path="/admin/upload" element={<UploadTransactions />} />
            </>
          )}

          {/* Worker Routes */}
          {user.role === 'worker' && (
             <>
                <Route path="/" element={<Navigate to="/worker/survey" replace />} />
                <Route path="/worker/survey" element={<WorkerSurvey user={user} />} />
                <Route path="*" element={<Navigate to="/worker/survey" replace />} />
             </>
          )}

          {/* Catch all */}
          <Route path="*" element={<Navigate to={user.role === 'admin' ? "/admin" : "/worker/survey"} replace />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;