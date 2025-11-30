import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  UploadCloud, 
  LogOut, 
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { User } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // If worker, use a simplified layout (usually handled by routing, but for safety)
  if (user?.role === 'worker') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center">
         <header className="w-full bg-white shadow-sm p-4 flex justify-between items-center sticky top-0 z-50">
            <div className="flex items-center gap-2">
                <ShieldCheck className="h-6 w-6 text-indigo-600" />
                <h1 className="font-bold text-xl text-slate-800">FairTrace <span className="text-xs font-normal text-slate-500">Worker Voice</span></h1>
            </div>
            <button onClick={onLogout} className="text-sm text-slate-500 hover:text-slate-800">Logout</button>
         </header>
         <main className="w-full max-w-md p-4 flex-1">
            {children}
         </main>
      </div>
    );
  }

  // Admin Layout
  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(`${path}/`);

  return (
    <div className="flex min-h-screen bg-slate-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex-shrink-0 hidden md:flex flex-col fixed h-full z-20">
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
          <ShieldCheck className="h-8 w-8 text-indigo-400" />
          <div>
            <h1 className="text-xl font-bold tracking-tight">FairTrace</h1>
            <p className="text-xs text-slate-400">Compliance Monitor</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          <Link to="/admin" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/admin') && location.pathname === '/admin' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            <LayoutDashboard size={20} />
            Dashboard
          </Link>
          <Link to="/admin/suppliers" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/admin/suppliers') ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            <Users size={20} />
            Suppliers
          </Link>
          <Link to="/admin/upload" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/admin/upload') ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            <UploadCloud size={20} />
            Upload Transactions
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-800">
            <div className="flex items-center gap-3 px-4 py-2 mb-2">
                <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center text-sm font-bold">JD</div>
                <div className="overflow-hidden">
                    <p className="text-sm font-medium truncate">{user?.name}</p>
                    <p className="text-xs text-slate-400">Admin</p>
                </div>
            </div>
          <button onClick={onLogout} className="flex items-center gap-3 px-4 py-2 w-full text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors text-sm">
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default Layout;