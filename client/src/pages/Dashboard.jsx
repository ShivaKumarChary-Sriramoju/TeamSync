import useAuthStore from '../store/authStore';
import { LogOut } from 'lucide-react';

export default function Dashboard() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  return (
    <div className="min-h-screen bg-soft-bg">
      <header className="bg-white border-b border-border px-6 py-4 flex justify-between items-center">
        <h1 className="font-bold text-xl">TeamSync</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium">{user?.name || 'User'}</span>
          <button onClick={logout} className="btn-secondary flex items-center gap-2">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </header>
      <main className="p-6">
        <div className="card max-w-2xl mx-auto text-center py-12">
          <h2 className="text-2xl font-bold mb-2">Welcome to your Dashboard</h2>
          <p className="text-text-muted">Phase 1 complete! You are logged in.</p>
        </div>
      </main>
    </div>
  );
}
