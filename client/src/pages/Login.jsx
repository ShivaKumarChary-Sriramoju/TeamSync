import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-soft-bg p-4">
      <div className="card w-full max-w-md">
        <div className="text-center mb-6">
          <p className="text-xs font-mono uppercase tracking-widest text-text-muted mb-2">Welcome Back</p>
          <h1 className="text-2xl font-bold">Sign in to <span className="text-accent">TeamSync</span></h1>
        </div>
        
        {error && <div className="mb-4 p-3 bg-danger/10 text-danger rounded-button text-sm">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              className="input-field w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              className="input-field w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn-primary w-full">Sign In</button>
        </form>
        <p className="mt-4 text-center text-sm text-text-muted">
          Don't have an account? <Link to="/register" className="text-text-main hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
