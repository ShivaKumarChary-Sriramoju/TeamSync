import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { LogOut } from 'lucide-react';
import useAuthStore from '../store/authStore';

export default function Workspaces() {
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const { user, logout } = useAuthStore();

  useEffect(() => {
    api.get('/workspaces').then(res => {
      setWorkspaces(res.data);
      setLoading(false);
    });
  }, []);

  const create = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/workspaces', { name });
      setWorkspaces([...workspaces, res.data]);
      setName('');
    } catch(err) { setError('Failed to create workspace'); }
  };

  if (loading) return <div className="p-6 text-center text-text-muted font-mono text-sm">Loading...</div>;

  return (
    <div className="min-h-screen bg-soft-bg">
      <header className="bg-white border-b border-border px-6 py-4 flex justify-between items-center">
        <h1 className="font-bold text-xl">TeamSync</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium">{user?.name || 'User'}</span>
          <button onClick={logout} className="btn-secondary flex items-center gap-2 px-3 py-1 text-sm">
            <LogOut size={14} /> Logout
          </button>
        </div>
      </header>
      <main className="p-6 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Your Workspaces</h2>
        {error && <div className="text-danger mb-4 text-sm font-medium bg-danger/10 p-3 rounded-button">{error}</div>}
        <div className="grid gap-4 md:grid-cols-2 mb-8">
          {workspaces.map(w => (
            <Link key={w._id} to={`/workspaces/${w._id}/settings`} className="card block hover:border-accent transition-colors">
              <h3 className="font-bold">{w.name}</h3>
              <p className="text-xs text-text-muted mt-2 font-mono uppercase tracking-widest">{w.members.length} member(s)</p>
            </Link>
          ))}
          {workspaces.length === 0 && <p className="text-text-muted col-span-2">No workspaces yet.</p>}
        </div>
        <form onSubmit={create} className="card max-w-sm">
          <p className="text-xs font-mono uppercase tracking-widest text-text-muted mb-2">New Workspace</p>
          <input value={name} onChange={e=>setName(e.target.value)} className="input-field w-full mb-3" required placeholder="Workspace name" />
          <button type="submit" className="btn-primary w-full">Create</button>
        </form>
      </main>
    </div>
  );
}
