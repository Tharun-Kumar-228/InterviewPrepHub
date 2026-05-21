import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../../shared/api';
import Loader from '../../components/Loader';
import { useAuth } from '../../context/AuthContext';
import { useAppState } from '../../context/AppStateContext';
import { ArrowLeft, Send, Users, LogOut, Trash2, Heart, Award, ShieldAlert } from 'lucide-react';

const RoomDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const { triggerNotification } = useAppState();

  const [room, setRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isMember, setIsMember] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
  
  const chatEndRef = useRef(null);

  const fetchRoomDetails = async () => {
    try {
      const res = await api.get(`/rooms/${id}`);
      setRoom(res.data.room);
      setMessages(res.data.messages);
      setIsMember(res.data.isMember);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoomDetails();
  }, [id]);

  // Scroll to bottom on load/new message
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handlePostMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    try {
      setSending(true);
      const res = await api.post(`/rooms/${id}/messages`, { content: inputText.trim() });
      setMessages(prev => [...prev, res.data]);
      setInputText('');
    } catch (err) {
      triggerNotification(err.message, 'error');
    } finally {
      setSending(false);
    }
  };

  const handleLikeMessage = async (msgId) => {
    try {
      const res = await api.post(`/rooms/messages/${msgId}/like`);
      setMessages(prev =>
        prev.map(m =>
          m._id === msgId ? { ...m, likesCount: res.data.likesCount } : m
        )
      );
    } catch (err) {
      triggerNotification(err.message, 'error');
    }
  };

  const handleDeleteMessage = async (msgId) => {
    if (!window.confirm('Delete this message?')) return;
    try {
      await api.delete(`/rooms/messages/${msgId}`);
      setMessages(prev => prev.filter(m => m._id !== msgId));
      triggerNotification('Message deleted.', 'success');
    } catch (err) {
      triggerNotification(err.message, 'error');
    }
  };

  const handleLeaveRoom = async () => {
    if (room.creator?._id === user._id) {
      triggerNotification('As the creator, you cannot leave the room. You can archive it via moderation controls.', 'warning');
      return;
    }

    if (!window.confirm(`Are you sure you want to leave "${room.name}"?`)) return;

    try {
      await api.post(`/rooms/${id}/leave`);
      triggerNotification(`Left study room: ${room.name}`, 'success');
      navigate('/rooms');
    } catch (err) {
      triggerNotification(err.message, 'error');
    }
  };

  if (loading) return <Loader />;
  if (error) {
    return (
      <div className="container" style={{ padding: '40px 0', textAlign: 'center' }}>
        <div className="glass-card" style={{ maxWidth: '500px', margin: '0 auto', padding: '40px' }}>
          <ShieldAlert size={40} style={{ color: 'var(--error)', marginBottom: '16px' }} />
          <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>Room Blocked</h3>
          <p style={{ color: 'var(--text-sub)' }}>{error}</p>
          <Link to="/rooms" className="btn btn-secondary" style={{ marginTop: '24px' }}>
            Back to Study Rooms
          </Link>
        </div>
      </div>
    );
  }

  const isRoomCreator = room.creator?._id === user?._id;

  return (
    <div className="container animate-fade-in" style={{ padding: '12px 0' }}>
      
      {/* Header Back & Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <Link to="/rooms" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-sub)', fontWeight: 600 }}>
          <ArrowLeft size={16} />
          <span>Back to rooms</span>
        </Link>

        {isMember && (
          <button onClick={handleLeaveRoom} className="btn btn-secondary" style={{ color: 'var(--error)', border: '1px solid rgba(244,63,94,0.2)', display: 'flex', gap: '6px', fontSize: '14px', padding: '8px 16px' }}>
            <LogOut size={16} />
            <span>Leave Room</span>
          </button>
        )}
      </div>

      {/* Main Room Layout Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2.5fr 1fr', gap: '32px', height: '650px', alignItems: 'stretch' }}>
        
        {/* Chat / Discussion logs Column */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', padding: '24px', overflow: 'hidden' }}>
          {/* Room Header Info */}
          <div style={{ paddingBottom: '16px', borderBottom: '1px solid var(--border-color)', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: 800 }}>{room.name}</h2>
            <p style={{ color: 'var(--text-sub)', fontSize: '14px', marginTop: '4px', lineHeight: 1.4 }}>{room.description}</p>
          </div>

          {/* Chat message box (scrollable) */}
          <div style={{ flex: 1, overflowY: 'auto', paddingRight: '8px', display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '16px' }}>
            {messages.length === 0 ? (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', margin: 'auto', fontSize: '14px' }}>
                <Users size={32} style={{ margin: '0 auto 8px auto', opacity: 0.5 }} />
                <p>Welcome! No discussion messages posted yet.</p>
                <p style={{ fontSize: '12px', marginTop: '4px' }}>Be the first one to start the prep circle chat!</p>
              </div>
            ) : (
              messages.map((msg) => {
                const isMsgAuthor = msg.author?._id === user?._id;
                const canDelete = isMsgAuthor || isRoomCreator || isAdmin;
                
                return (
                  <div key={msg._id} style={{ display: 'flex', gap: '12px', alignSelf: isMsgAuthor ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
                    
                    {/* Avatar */}
                    {!isMsgAuthor && (
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(99,102,241,0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, flexShrink: 0 }}>
                        {msg.author?.name?.charAt(0) || 'U'}
                      </div>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: isMsgAuthor ? 'flex-end' : 'flex-start' }}>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <span style={{ fontWeight: 600, color: isMsgAuthor ? 'var(--primary)' : 'var(--text-sub)' }}>
                          {isMsgAuthor ? 'You' : msg.author?.name}
                        </span>
                        <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>

                      <div style={{ background: isMsgAuthor ? 'var(--primary)' : 'var(--bg-input)', color: '#fff', padding: '10px 14px', borderRadius: isMsgAuthor ? '12px 12px 0 12px' : '12px 12px 12px 0', border: '1px solid var(--border-color)', fontSize: '14px', lineHeight: 1.5, wordBreak: 'break-word' }}>
                        {msg.content}
                      </div>

                      {/* Msg Actions */}
                      <div style={{ display: 'flex', gap: '12px', marginTop: '4px', fontSize: '11px', color: 'var(--text-muted)' }}>
                        <button 
                          onClick={() => handleLikeMessage(msg._id)} 
                          style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px', color: msg.likes?.includes(user?._id) ? 'var(--error)' : 'inherit' }}
                        >
                          <Heart size={12} fill={msg.likes?.includes(user?._id) ? 'currentColor' : 'none'} />
                          <span>{msg.likesCount || 0}</span>
                        </button>
                        
                        {canDelete && (
                          <button 
                            onClick={() => handleDeleteMessage(msg._id)} 
                            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '2px', color: 'var(--error)' }}
                          >
                            <Trash2 size={12} />
                            <span>Delete</span>
                          </button>
                        )}
                      </div>
                    </div>

                  </div>
                );
              })
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Form input */}
          <form onSubmit={handlePostMessage} style={{ display: 'flex', gap: '12px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
            <input 
              type="text" 
              className="form-control"
              placeholder={isMember ? "Ask a question, post a concept review..." : "You must be a member of this room."}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={!isMember || sending}
              style={{ flex: 1 }}
              required
            />
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={!isMember || sending}
              style={{ padding: '0 20px' }}
            >
              <Send size={16} />
            </button>
          </form>

        </div>

        {/* Sidebar: Creator & Members */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', overflowY: 'auto' }}>
          
          {/* Creator Widget */}
          <div className="glass-card" style={{ padding: '20px' }}>
            <h4 style={{ fontSize: '14px', color: 'var(--text-sub)', fontWeight: 600, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Award size={16} style={{ color: 'var(--primary)' }} />
              <span>Room Host / Creator</span>
            </h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(99,102,241,0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 600 }}>
                {room.creator?.name?.charAt(0) || 'M'}
              </div>
              <div>
                <span style={{ fontSize: '14px', fontWeight: 600 }}>{room.creator?.name || 'Mentor'}</span>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{room.creator?.email}</p>
              </div>
            </div>
          </div>

          {/* Members list */}
          <div className="glass-card" style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <h4 style={{ fontSize: '14px', color: 'var(--text-sub)', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Users size={16} style={{ color: 'var(--secondary)' }} />
              <span>Room Members ({room.memberCount})</span>
            </h4>

            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {room.members?.map((member) => (
                <div key={member._id} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px' }}>
                    {member.name?.charAt(0)}
                  </div>
                  <div>
                    <span style={{ fontSize: '13px', fontWeight: 500 }}>{member.name}</span>
                    <p style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                      {member.profile?.graduationYear ? `Grad: ${member.profile.graduationYear}` : member.role}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default RoomDetail;
