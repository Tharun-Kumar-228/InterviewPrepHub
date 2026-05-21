import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../shared/api';
import Loader from '../../components/Loader';
import { useAuth } from '../../context/AuthContext';
import { useAppState } from '../../context/AppStateContext';
import { Users, Plus, MessageSquare, ShieldAlert, X } from 'lucide-react';

const RoomList = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, isRoomCreator } = useAuth();
  const { triggerNotification } = useAppState();
  const navigate = useNavigate();

  // Create Room Modal state
  const [showModal, setShowModal] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [roomDesc, setRoomDesc] = useState('');
  const [creating, setCreating] = useState(false);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const res = await api.get('/rooms');
      setRooms(res.data);
    } catch (err) {
      console.error('Error fetching rooms:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleJoin = async (roomId) => {
    if (!isAuthenticated) {
      triggerNotification('Please log in to join study rooms.', 'error');
      navigate('/login');
      return;
    }
    try {
      await api.post(`/rooms/${roomId}/join`);
      triggerNotification('Joined study room successfully!', 'success');
      navigate(`/rooms/${roomId}`);
    } catch (err) {
      triggerNotification(err.message, 'error');
    }
  };

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    if (!roomName.trim() || !roomDesc.trim()) {
      triggerNotification('Please provide room name and description.', 'error');
      return;
    }

    try {
      setCreating(true);
      const res = await api.post('/rooms', { name: roomName.trim(), description: roomDesc.trim() });
      triggerNotification(`Study room "${res.data.name}" created!`, 'success');
      setShowModal(false);
      setRoomName('');
      setRoomDesc('');
      fetchRooms(); // Refresh
      navigate(`/rooms/${res.data._id}`);
    } catch (err) {
      triggerNotification(err.message, 'error');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '24px 0' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 800 }}>Study Rooms</h1>
          <p style={{ color: 'var(--text-sub)', fontSize: '15px', marginTop: '4px' }}>Join interactive circles to review concepts, ask questions, and share study resources.</p>
        </div>

        {isRoomCreator && (
          <button onClick={() => setShowModal(true)} className="btn btn-primary">
            <Plus size={18} />
            <span>Create Room</span>
          </button>
        )}
      </div>

      {loading ? (
        <Loader />
      ) : rooms.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '60px 40px' }}>
          <ShieldAlert size={40} style={{ color: 'var(--primary)', marginBottom: '16px' }} />
          <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>No Study Rooms Found</h3>
          <p style={{ color: 'var(--text-sub)', fontSize: '14px' }}>There are currently no active study circles.</p>
          {isRoomCreator && (
            <button onClick={() => setShowModal(true)} className="btn btn-primary" style={{ marginTop: '16px' }}>
              Create first room
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-3">
          {rooms.map((room) => (
            <div key={room._id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '220px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 700 }}>{room.name}</h3>
                  <span className="badge" style={{ background: 'rgba(168, 85, 247, 0.1)', color: 'var(--secondary)', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Users size={12} />
                    {room.memberCount} members
                  </span>
                </div>
                <p style={{ color: 'var(--text-sub)', fontSize: '14px', lineHeight: 1.5, marginBottom: '20px' }}>{room.description}</p>
              </div>

              <div>
                <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '12px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Created by {room.creator?.name || 'Mentor'}</span>
                  
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                      onClick={() => handleJoin(room._id)} 
                      className="btn btn-primary" 
                      style={{ padding: '6px 12px', fontSize: '12px' }}
                    >
                      Enter Room
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Room Modal */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '24px' }}>
          <div className="glass-card" style={{ maxWidth: '500px', width: '100%', padding: '32px', position: 'relative' }}>
            <button 
              onClick={() => setShowModal(false)} 
              style={{ position: 'absolute', right: '20px', top: '20px', background: 'none', border: 'none', color: 'var(--text-sub)', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>

            <h3 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '24px' }}>Create New Study Room</h3>

            <form onSubmit={handleCreateRoom}>
              <div className="form-group">
                <label className="form-label" htmlFor="rName">Room Name *</label>
                <input 
                  type="text" 
                  id="rName" 
                  className="form-control"
                  placeholder="e.g. MERN Interview Prep"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: '32px' }}>
                <label className="form-label" htmlFor="rDesc">Description *</label>
                <textarea 
                  id="rDesc" 
                  className="form-control"
                  rows="3"
                  placeholder="What will students discuss in this study room?"
                  value={roomDesc}
                  onChange={(e) => setRoomDesc(e.target.value)}
                  style={{ resize: 'vertical' }}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={creating}>
                  {creating ? 'Creating...' : 'Create Room'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default RoomList;
