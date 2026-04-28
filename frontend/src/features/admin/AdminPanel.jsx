import React, { useEffect, useState } from 'react';
import { api } from '../../shared/api';
import Loader from '../../components/Loader';
import { useAppState } from '../../context/AppStateContext';
import { Users, FileText, MessageSquare, ShieldAlert, Award, Trash2, ArrowRight } from 'lucide-react';

const AdminPanel = () => {
  const { triggerNotification } = useAppState();
  
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const statsRes = await api.get('/admin/stats');
      setStats(statsRes.data);

      const usersRes = await api.get('/admin/users');
      setUsers(usersRes.data);
    } catch (err) {
      triggerNotification(`Error fetching admin data: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.put(`/admin/users/${userId}/role`, { role: newRole });
      triggerNotification(`User role updated to "${newRole}"`, 'success');
      setUsers(prev =>
        prev.map(u => (u._id === userId ? { ...u, role: newRole } : u))
      );
    } catch (err) {
      triggerNotification(err.message, 'error');
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`CRITICAL: Are you sure you want to delete user "${userName}"? This will delete all of their interview experiences, comments, and messages permanently.`)) return;

    try {
      await api.delete(`/admin/users/${userId}`);
      triggerNotification(`Deleted user account: ${userName}`, 'success');
      setUsers(prev => prev.filter(u => u._id !== userId));
      // Refresh stats
      const statsRes = await api.get('/admin/stats');
      setStats(statsRes.data);
    } catch (err) {
      triggerNotification(err.message, 'error');
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="container animate-fade-in" style={{ padding: '24px 0' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--error)' }}>Admin Moderation Controls</h1>
        <p style={{ color: 'var(--text-sub)', fontSize: '15px', marginTop: '4px' }}>Monitor platform health metrics, manage user roles, and moderate contributions.</p>
      </div>

      {/* Metrics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '40px' }}>
        
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px' }}>
          <div style={{ padding: '10px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)' }}>
            <Users size={24} />
          </div>
          <div>
            <span style={{ fontSize: '12px', color: 'var(--text-sub)' }}>Total Users</span>
            <h3 style={{ fontSize: '20px', fontWeight: 800 }}>{stats?.usersCount}</h3>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px' }}>
          <div style={{ padding: '10px', borderRadius: '10px', background: 'rgba(168, 85, 247, 0.1)', color: 'var(--secondary)' }}>
            <FileText size={24} />
          </div>
          <div>
            <span style={{ fontSize: '12px', color: 'var(--text-sub)' }}>Experiences Shared</span>
            <h3 style={{ fontSize: '20px', fontWeight: 800 }}>{stats?.experiencesCount}</h3>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px' }}>
          <div style={{ padding: '10px', borderRadius: '10px', background: 'rgba(6, 182, 212, 0.1)', color: 'var(--accent)' }}>
            <MessageSquare size={24} />
          </div>
          <div>
            <span style={{ fontSize: '12px', color: 'var(--text-sub)' }}>Total Comments</span>
            <h3 style={{ fontSize: '20px', fontWeight: 800 }}>{stats?.commentsCount}</h3>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px' }}>
          <div style={{ padding: '10px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)' }}>
            <Award size={24} />
          </div>
          <div>
            <span style={{ fontSize: '12px', color: 'var(--text-sub)' }}>Active Study Rooms</span>
            <h3 style={{ fontSize: '20px', fontWeight: 800 }}>{stats?.roomsCount}</h3>
          </div>
        </div>

      </div>

      {/* Users Moderation List */}
      <div className="glass-card" style={{ padding: '24px', overflowX: 'auto' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px' }}>User Registration &amp; Role Management</h3>
        
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-sub)', fontSize: '13px' }}>
              <th style={{ padding: '12px 16px' }}>Name</th>
              <th style={{ padding: '12px 16px' }}>Email</th>
              <th style={{ padding: '12px 16px' }}>Joined Date</th>
              <th style={{ padding: '12px 16px' }}>Role</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((item) => (
              <tr key={item._id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.03)', fontSize: '14px' }}>
                <td style={{ padding: '16px', fontWeight: 600 }}>{item.name}</td>
                <td style={{ padding: '16px', color: 'var(--text-sub)' }}>{item.email}</td>
                <td style={{ padding: '16px', color: 'var(--text-muted)' }}>{new Date(item.createdAt).toLocaleDateString()}</td>
                <td style={{ padding: '16px' }}>
                  <select 
                    value={item.role} 
                    onChange={(e) => handleRoleChange(item._id, e.target.value)}
                    style={{ background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '4px', padding: '4px 8px', color: '#fff', fontSize: '13px', cursor: 'pointer' }}
                  >
                    <option value="user">User</option>
                    <option value="room_creator">Room Creator</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td style={{ padding: '16px', textAlign: 'right' }}>
                  <button 
                    onClick={() => handleDeleteUser(item._id, item.name)} 
                    className="btn" 
                    style={{ background: 'rgba(244, 63, 94, 0.1)', color: 'var(--error)', padding: '6px 10px', fontSize: '12px', border: '1px solid rgba(244,63,94,0.2)' }}
                    title="Delete User & Footprint"
                  >
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default AdminPanel;
