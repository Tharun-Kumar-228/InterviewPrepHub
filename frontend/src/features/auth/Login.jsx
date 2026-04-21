import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAppState } from '../../context/AppStateContext';
import { KeyRound, Mail, AlertTriangle } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  const { login, loading } = useAuth();
  const { triggerNotification } = useAppState();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!email || !password) {
      setFormError('Please enter both email and password.');
      return;
    }

    try {
      await login(email, password);
      triggerNotification('Welcome back to PrepHub!', 'success');
      navigate('/dashboard');
    } catch (err) {
      setFormError(err.message || 'Login failed. Please check credentials.');
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '70vh', padding: '0 24px' }}>
      <div className="glass-card" style={{ maxWidth: '440px', width: '100%', padding: '40px 32px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '8px' }}>Welcome Back</h2>
          <p style={{ color: 'var(--text-sub)', fontSize: '15px' }}>Log in to access study rooms and interview logs.</p>
        </div>

        {formError && (
          <div style={{ background: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.3)', padding: '12px 16px', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--error)', fontSize: '14px', marginBottom: '24px' }}>
            <AlertTriangle size={16} />
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', display: 'flex' }}>
                <Mail size={18} />
              </span>
              <input 
                type="email" 
                id="email" 
                className="form-control"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ paddingLeft: '48px' }}
                required
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label className="form-label" htmlFor="password" style={{ marginBottom: 0 }}>Password</label>
            </div>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', display: 'flex' }}>
                <KeyRound size={18} />
              </span>
              <input 
                type="password" 
                id="password" 
                className="form-control"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: '48px' }}
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', padding: '14px', borderRadius: 'var(--radius-sm)', fontSize: '15px' }}
            disabled={loading}
          >
            {loading ? 'Logging In...' : 'Log In'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', color: 'var(--text-sub)', fontSize: '14px' }}>
          Don't have an account?{' '}
          <Link to="/signup" style={{ color: 'var(--primary)', fontWeight: 600 }}>Sign up</Link>
        </p>

        {/* Demo Credentials Alert */}
        <div style={{ marginTop: '24px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '12px 16px', fontSize: '12px', color: 'var(--text-sub)' }}>
          <p style={{ fontWeight: 600, color: 'var(--text-main)', marginBottom: '4px' }}>Demo Accounts (Password: password123):</p>
          <ul style={{ paddingLeft: '16px', listStyleType: 'disc' }}>
            <li>Admin: <span style={{ fontFamily: 'monospace' }}>admin@prep.com</span></li>
            <li>Creator: <span style={{ fontFamily: 'monospace' }}>creator@prep.com</span></li>
            <li>User: <span style={{ fontFamily: 'monospace' }}>user@prep.com</span></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Login;
