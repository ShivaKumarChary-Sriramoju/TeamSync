import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import useAuthStore from '../store/authStore';
import usePermissions from '../hooks/usePermissions';
import { ArrowLeft } from 'lucide-react';

export default function WorkspaceSettings() {
  const { id } = useParams();
  const [ws, setWs] = useState(null);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('member');
  const user = useAuthStore(s => s.user);

  useEffect(() => {
    api.get(`/workspaces/${id}`).then(res => setWs(res.data)).catch(() => {});
  }, [id]);

  if (!ws) return <div className="p-6 text-center text-text-muted font-mono text-sm">Loading...</div>;

  const myRole = ws.members.find(m => m.userId === user._id)?.role;
  const perms = usePermissions(myRole);

  const invite = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post(`/workspaces/${id}/invite`, { email, role });
      setWs(res.data);
      setEmail('');
    } catch(err) { alert(err.response?.data?.message || 'Error'); }
  };

  const updateRole = async (uid, newRole) => {
    try {
      const res = await api.patch(`/workspaces/${id}/members/${uid}`, { role: newRole });
      setWs(res.data);
    } catch(err) { alert(err.response?.data?.message || 'Failed'); }
  };

  const remove = async (uid) => {
    try {
      const res = await api.delete(`/workspaces/${id}/members/${uid}`);
      setWs(res.data);
    } catch(err) { alert(err.response?.data?.message || 'Failed'); }
  };

  return (
    <div className="min-h-screen bg-soft-bg">
      <header className="bg-white border-b border-border px-6 py-4 flex items-center gap-4">
        <Link to="/" className="text-text-muted hover:text-text-main"><ArrowLeft size={20} /></Link>
        <h1 className="font-bold text-xl">{ws.name}</h1>
        <span className="px-2 py-0.5 bg-soft-bg border border-border text-xs uppercase tracking-widest font-mono rounded">{myRole}</span>
      </header>
      <main className="p-6 max-w-4xl mx-auto space-y-6">
        <div className="card">
          <h2 className="font-bold mb-4">Members</h2>
          <div className="space-y-3">
            {ws.members.map(m => (
              <div key={m.userId} className="flex justify-between items-center pb-3 border-b border-border last:border-0 last:pb-0">
                <span className="font-medium text-sm">{m.userId} <span className="text-text-muted ml-1 font-mono text-xs">({m.role})</span></span>
                {perms.canManageMembers && (
                  <div className="flex gap-2">
                    <select value={m.role} onChange={e => updateRole(m.userId, e.target.value)} className="input-field py-1 px-2 text-sm h-8">
                      <option value="admin">Admin</option>
                      <option value="manager">Manager</option>
                      <option value="member">Member</option>
                    </select>
                    <button onClick={() => remove(m.userId)} className="btn-secondary py-1 px-3 text-sm text-danger h-8">Remove</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        {perms.canManageMembers && (
          <form onSubmit={invite} className="card max-w-md">
            <h2 className="font-bold mb-3">Invite Member</h2>
            <div className="flex gap-2 mb-3">
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} className="input-field w-full h-10" placeholder="User Email" required />
              <select value={role} onChange={e=>setRole(e.target.value)} className="input-field h-10">
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="member">Member</option>
              </select>
            </div>
            <button type="submit" className="btn-primary">Send Invite</button>
          </form>
        )}
      </main>
    </div>
  );
}
