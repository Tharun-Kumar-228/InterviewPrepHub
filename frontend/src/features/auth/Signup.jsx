import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAppState } from '../../context/AppStateContext';
import { User, Mail, KeyRound, Briefcase, GraduationCap, AlertTriangle } from 'lucide-react';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [graduationYear, setGraduationYear] = useState(new Date().getFullYear());
  const [skills, setSkills] = useState('');
  const [formError, setFormError] = useState('');
  
  const { register, loading } = useAuth();
  const { triggerNotification } = useAppState();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!name || !email || !password) {
      setFormError('Please fill in all required fields.');
      return;
    }

    if (password.length < 6) {
      setFormError('Password must be at least 6 characters long.');
      return;
    }

    const userData = {
      name,
      email,
      password,
      role,
      profile: {
        graduationYear: parseInt(graduationYear, 10),
        skills: skills.split(',').map(s => s.trim()).filter(s => s.length > 0)
      }
    };

    try {
      await register(userData);
      triggerNotification('Welcome to PrepHub! Account created successfully.', 'success');
      navigate('/dashboard');
    } catch (err) {
      setFormError(err.message || 'Signup failed. Please try again.');
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', padding: '24px' }}>
      <div className="glass-card" style={{ maxWidth: '500px', width: '100%', padding: '40px 32px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '8px' }}>Create Account</h2>
          <p style={{ color: 'var(--text-sub)', fontSize: '15px' }}>Join the peer prep community today.</p>
        </div>

        {formError && (
          <div style={{ background: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.3)', padding: '12px 16px', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--error)', fontSize: '14px', marginBottom: '24px' }}>
            <AlertTriangle size={16} />
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="name">Full Name *</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', display: 'flex' }}>
                <User size={18} />
              </span>
              <input 
                type="text" 
                id="name" 
                className="form-control"
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ paddingLeft: '48px' }}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address *</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', display: 'flex' }}>
                <Mail size={18} />
              </span>
              <input 
                type="email" 
                id="email" 
                className="form-control"
                placeholder="jane@college.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ paddingLeft: '48px' }}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password * (min 6 chars)</label>
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

          <div className="grid grid-cols-2" style={{ gap: '16px' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="role">Desired Role</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', display: 'flex' }}>
                  <Briefcase size={18} />
                </span>
                <select 
                  id="role" 
                  className="form-control"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  style={{ paddingLeft: '48px', appearance: 'none', cursor: 'pointer' }}
                >
                  <option value="user">Regular User</option>
                  <option value="room_creator">Room Creator</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="grad">Graduation Year</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', display: 'flex' }}>
                  <GraduationCap size={18} />
                </span>
                <input 
                  type="number" 
                  id="grad" 
                  className="form-control"
                  value={graduationYear}
                  onChange={(e) => setGraduationYear(e.target.value)}
                  style={{ paddingLeft: '48px' }}
                  min="2000"
                  max="2100"
                />
              </div>
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '32px' }}>
            <label className="form-label" htmlFor="skills">Core Skills (comma separated)</label>
            <input 
              type="text" 
              id="skills" 
              className="form-control"
              placeholder="React, Javascript, Python, SQL"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', padding: '14px', borderRadius: 'var(--radius-sm)', fontSize: '15px' }}
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', color: 'var(--text-sub)', fontSize: '14px' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
