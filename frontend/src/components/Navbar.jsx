import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAppState } from '../context/AppStateContext';
import { Terminal, Search, LogOut, User as UserIcon, BookMarked, Shield, Users } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const { globalSearch, setGlobalSearch } = useAppState();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchInput, setSearchInput] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setGlobalSearch(searchInput.trim());
      navigate(`/search?q=${encodeURIComponent(searchInput.trim())}`);
      setSearchInput('');
    }
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="navbar">
      <div className="container nav-container">
        <Link to="/" className="nav-logo">
          <Terminal size={24} style={{ color: 'var(--primary)' }} />
          <span>PrepHub</span>
        </Link>

        {/* Global Search Bar */}
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-input)', borderRadius: '24px', padding: '6px 16px', border: '1px solid var(--border-color)', maxWidth: '320px', width: '100%', margin: '0 16px' }}>
          <input 
            type="text" 
            placeholder="Search company, tech, question..." 
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            style={{ background: 'none', border: 'none', outline: 'none', color: '#fff', fontSize: '14px', width: '100%' }}
          />
          <button type="submit" style={{ background: 'none', border: 'none', color: 'var(--text-sub)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <Search size={16} />
          </button>
        </form>

        <div className="nav-links">
          <Link to="/dashboard" className={`nav-link ${isActive('/dashboard')}`}>Dashboard</Link>
          <Link to="/experiences" className={`nav-link ${isActive('/experiences')}`}>Experiences</Link>
          <Link to="/rooms" className={`nav-link ${isActive('/rooms')}`}>Study Rooms</Link>
          <Link to="/companies" className={`nav-link ${isActive('/companies')}`}>Companies</Link>
          
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              {/* Bookmarks link */}
              <Link to="/bookmarks" className={`nav-link ${isActive('/bookmarks')}`} title="Bookmarks" style={{ display: 'flex', alignItems: 'center' }}>
                <BookMarked size={20} />
              </Link>
              
              {/* Admin Panel link */}
              {isAdmin && (
                <Link to="/admin" className={`nav-link ${isActive('/admin')}`} title="Admin Panel" style={{ display: 'flex', alignItems: 'center', color: 'var(--error)' }}>
                  <Shield size={20} />
                </Link>
              )}

              {/* Profile Link */}
              <Link to="/profile" className={`nav-link ${isActive('/profile')}`} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255, 255, 255, 0.05)', padding: '6px 12px', borderRadius: '20px', border: '1px solid var(--border-color)' }}>
                <UserIcon size={16} />
                <span style={{ fontSize: '14px', fontWeight: 600 }}>{user.name.split(' ')[0]}</span>
              </Link>

              {/* Logout */}
              <button 
                onClick={() => { logout(); navigate('/'); }} 
                style={{ background: 'none', border: 'none', color: 'var(--text-sub)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '6px' }}
                title="Log Out"
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Link to="/login" className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '14px' }}>Log In</Link>
              <Link to="/signup" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '14px' }}>Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
