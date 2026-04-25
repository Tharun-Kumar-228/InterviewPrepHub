import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../shared/api';
import Loader from '../../components/Loader';
import { TrendingUp, Users, Clock, Award, HelpCircle, ChevronRight, Plus, ThumbsUp, MessageSquare, Briefcase } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await api.get('/dashboard');
      setData(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) return <Loader />;
  if (error) {
    return (
      <div className="container" style={{ padding: '40px 0', textAlign: 'center' }}>
        <p style={{ color: 'var(--error)' }}>Error loading dashboard: {error}</p>
        <button onClick={fetchDashboard} className="btn btn-secondary" style={{ marginTop: '16px' }}>Retry</button>
      </div>
    );
  }

  const { trendingCompanies, activeRooms, recentExperiences, topContributors, popularQuestions } = data;

  return (
    <div className="container animate-fade-in" style={{ padding: '24px 0' }}>
      {/* Header section with CTA */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 800 }}>Community Dashboard</h1>
          <p style={{ color: 'var(--text-sub)', fontSize: '15px', marginTop: '4px' }}>Real-time interview insights and active peer groups.</p>
        </div>
        
        {isAuthenticated && (
          <Link to="/experiences/create" className="btn btn-primary">
            <Plus size={18} />
            <span>Share Experience</span>
          </Link>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
        {/* Left Side: Recent Experiences */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <Clock size={20} style={{ color: 'var(--primary)' }} />
            <h2 style={{ fontSize: '20px', fontWeight: 700 }}>Recent Interview Experiences</h2>
          </div>

          {recentExperiences.length === 0 ? (
            <div className="glass-card" style={{ textAlign: 'center', padding: '40px' }}>
              <p style={{ color: 'var(--text-sub)' }}>No interview experiences shared yet.</p>
              {isAuthenticated && (
                <Link to="/experiences/create" className="btn btn-primary" style={{ marginTop: '16px' }}>Share Yours first!</Link>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {recentExperiences.map((exp) => (
                <div key={exp._id} className="glass-card" style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '12px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Link to={`/companies/${exp.companyName}`} style={{ fontSize: '18px', fontWeight: 700, color: 'var(--primary)' }}>
                          {exp.companyName}
                        </Link>
                        <span style={{ color: 'var(--text-muted)' }}>&bull;</span>
                        <span style={{ fontSize: '15px', fontWeight: 500 }}>{exp.roleApplied}</span>
                      </div>
                      <p style={{ fontSize: '13px', color: 'var(--text-sub)', marginTop: '4px' }}>
                        Shared by {exp.author?.name || 'Anonymous'} &bull; {new Date(exp.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <span className={`badge badge-${exp.difficulty.toLowerCase()}`}>{exp.difficulty}</span>
                      <span className={`badge badge-${exp.resultStatus.toLowerCase()}`}>{exp.resultStatus}</span>
                    </div>
                  </div>

                  <p style={{ fontSize: '14px', color: 'var(--text-sub)', lineHeight: 1.5, marginBottom: '16px' }}>
                    <strong>Key topics asked:</strong> {exp.questionsAsked.map(q => `"${q}"`).join(', ')}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '16px', color: 'var(--text-sub)', fontSize: '13px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <ThumbsUp size={14} />
                        {exp.upvotesCount} upvotes
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MessageSquare size={14} />
                        {exp.commentsCount} comments
                      </span>
                    </div>

                    <Link to={`/experiences/${exp._id}`} className="btn btn-accent" style={{ padding: '6px 12px', fontSize: '13px' }}>
                      Read Details
                      <ChevronRight size={14} />
                    </Link>
                  </div>
                </div>
              ))}
              
              <div style={{ textAlign: 'center', marginTop: '12px' }}>
                <Link to="/experiences" className="btn btn-secondary" style={{ width: '100%' }}>
                  View All Experiences
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Sidebar Widgets */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Trending Companies */}
          <div className="glass-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <TrendingUp size={18} style={{ color: 'var(--primary)' }} />
              <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Trending Companies</h3>
            </div>
            {trendingCompanies.length === 0 ? (
              <p style={{ fontSize: '13px', color: 'var(--text-sub)' }}>No company trends found.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {trendingCompanies.map((comp, idx) => (
                  <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                      <Link to={`/companies/${comp.companyName}`} style={{ fontWeight: 600 }}>{comp.companyName}</Link>
                      <span style={{ color: 'var(--text-sub)' }}>{comp.count} logs</span>
                    </div>
                    {/* Selection rate progress bar */}
                    <div style={{ height: '4px', background: 'var(--bg-input)', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{ width: `${comp.selectionRate}%`, height: '100%', background: 'var(--success)' }}></div>
                    </div>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Selection Rate: {comp.selectionRate}%</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Active Study Rooms */}
          <div className="glass-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <Users size={18} style={{ color: 'var(--secondary)' }} />
              <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Active Study Rooms</h3>
            </div>
            {activeRooms.length === 0 ? (
              <p style={{ fontSize: '13px', color: 'var(--text-sub)' }}>No active rooms.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {activeRooms.map((room) => (
                  <div key={room._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <Link to={`/rooms/${room._id}`} style={{ fontSize: '14px', fontWeight: 600 }}>{room.name}</Link>
                      <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>by {room.creator?.name}</p>
                    </div>
                    <span className="badge" style={{ background: 'rgba(168, 85, 247, 0.1)', color: 'var(--secondary)', fontSize: '11px' }}>
                      {room.memberCount} members
                    </span>
                  </div>
                ))}
                <Link to="/rooms" className="btn btn-secondary" style={{ padding: '6px', fontSize: '12px', width: '100%', marginTop: '6px' }}>
                  Browse Rooms
                </Link>
              </div>
            )}
          </div>

          {/* Popular Questions */}
          <div className="glass-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <HelpCircle size={18} style={{ color: 'var(--accent)' }} />
              <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Popular Questions</h3>
            </div>
            {popularQuestions.length === 0 ? (
              <p style={{ fontSize: '13px', color: 'var(--text-sub)' }}>No questions indexed yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {popularQuestions.map((q, idx) => (
                  <div key={idx} style={{ fontSize: '13px' }}>
                    <p style={{ fontWeight: 500, color: 'var(--text-main)', lineHeight: 1.4 }}>"{q.question}"</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '11px', marginTop: '4px' }}>
                      <span>Asked at: {q.companies.join(', ')}</span>
                      <span style={{ fontWeight: 600, color: 'var(--accent)' }}>{q.count}x times</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Top Contributors */}
          <div className="glass-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <Award size={18} style={{ color: 'var(--success)' }} />
              <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Top Contributors</h3>
            </div>
            {topContributors.length === 0 ? (
              <p style={{ fontSize: '13px', color: 'var(--text-sub)' }}>No contributors listed.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {topContributors.map((c, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ fontSize: '14px', fontWeight: 600 }}>{c.name}</span>
                      <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{c.bio || 'MERN Student'}</p>
                    </div>
                    <span className="badge" style={{ background: 'var(--success-glow)', color: 'var(--success)', fontSize: '11px' }}>
                      {c.experienceCount} logs
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
