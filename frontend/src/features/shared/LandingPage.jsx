import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Sparkles, Users, Award, BookOpen, ChevronRight, BarChart } from 'lucide-react';

const LandingPage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="animate-fade-in" style={{ padding: '40px 0' }}>
      {/* Hero Section */}
      <div className="container" style={{ textAlign: 'center', padding: '60px 0 80px 0', maxWidth: '800px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', borderRadius: '30px', fontSize: '14px', fontWeight: 600, marginBottom: '24px' }}>
          <Sparkles size={16} />
          <span>The Ultimate Student Interview Platform</span>
        </div>
        
        <h1 style={{ fontSize: '56px', fontWeight: 800, lineHeight: 1.1, marginBottom: '24px', letterSpacing: '-0.03em' }}>
          Supercharge Your <span style={{ background: 'linear-gradient(90deg, #6366f1, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Interview Prep</span>, Together.
        </h1>
        
        <p style={{ color: 'var(--text-sub)', fontSize: '20px', lineHeight: 1.6, marginBottom: '40px', fontWeight: 400 }}>
          Join peer-led study rooms, explore real interview experiences from top-tier companies, and collaborate with classmates to ace your dream job.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
          {isAuthenticated ? (
            <Link to="/dashboard" className="btn btn-primary" style={{ padding: '14px 28px', borderRadius: 'var(--radius-sm)', fontSize: '16px' }}>
              Go to Dashboard
              <ChevronRight size={18} />
            </Link>
          ) : (
            <>
              <Link to="/signup" className="btn btn-primary" style={{ padding: '14px 28px', borderRadius: 'var(--radius-sm)', fontSize: '16px' }}>
                Join PrepHub Free
                <ChevronRight size={18} />
              </Link>
              <Link to="/experiences" className="btn btn-secondary" style={{ padding: '14px 28px', borderRadius: 'var(--radius-sm)', fontSize: '16px' }}>
                Browse Experiences
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Feature Section */}
      <div style={{ background: 'rgba(255, 255, 255, 0.02)', borderY: '1px solid var(--border-color)', padding: '80px 0' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', fontSize: '32px', marginBottom: '48px' }}>
            Built for collaborative interview success
          </h2>
          
          <div className="grid grid-cols-3">
            {/* Feature 1 */}
            <div className="glass-card">
              <div style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', padding: '12px', borderRadius: '12px', width: 'fit-content', marginBottom: '20px' }}>
                <Award size={24} />
              </div>
              <h3 style={{ fontSize: '20px', marginBottom: '12px' }}>Real Interview Logs</h3>
              <p style={{ color: 'var(--text-sub)', fontSize: '15px', lineHeight: 1.6 }}>
                Read authentic questions, rounds breakdown, and difficulty reviews from students who recently interviewed at Google, Amazon, Meta, and others.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="glass-card">
              <div style={{ background: 'rgba(168, 85, 247, 0.1)', color: 'var(--secondary)', padding: '12px', borderRadius: '12px', width: 'fit-content', marginBottom: '20px' }}>
                <Users size={24} />
              </div>
              <h3 style={{ fontSize: '20px', marginBottom: '12px' }}>Peer Study Rooms</h3>
              <p style={{ color: 'var(--text-sub)', fontSize: '15px', lineHeight: 1.6 }}>
                Create or join dedicated revision rooms like MERN Prep, DBMS Revision, or System Design. Post discussion logs, ask questions, and chat live.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="glass-card">
              <div style={{ background: 'rgba(6, 182, 212, 0.1)', color: 'var(--accent)', padding: '12px', borderRadius: '12px', width: 'fit-content', marginBottom: '20px' }}>
                <BarChart size={24} />
              </div>
              <h3 style={{ fontSize: '20px', marginBottom: '12px' }}>Company Analytics</h3>
              <p style={{ color: 'var(--text-sub)', fontSize: '15px', lineHeight: 1.6 }}>
                View selection rate percentages, difficulty curves, top asked coding questions, and trending parameters for specific employers.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Banner */}
      <div className="container" style={{ padding: '80px 0 40px 0' }}>
        <div className="glass-card" style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '30px', textAlign: 'center', padding: '40px' }}>
          <div>
            <div style={{ fontSize: '40px', fontWeight: 800, color: 'var(--primary)' }}>50+</div>
            <p style={{ color: 'var(--text-sub)', fontSize: '15px', marginTop: '6px' }}>Top Companies</p>
          </div>
          <div>
            <div style={{ fontSize: '40px', fontWeight: 800, color: 'var(--secondary)' }}>200+</div>
            <p style={{ color: 'var(--text-sub)', fontSize: '15px', marginTop: '6px' }}>Interview Logs</p>
          </div>
          <div>
            <div style={{ fontSize: '40px', fontWeight: 800, color: 'var(--accent)' }}>15+</div>
            <p style={{ color: 'var(--text-sub)', fontSize: '15px', marginTop: '6px' }}>Study Groups</p>
          </div>
          <div>
            <div style={{ fontSize: '40px', fontWeight: 800, color: 'var(--success)' }}>85%</div>
            <p style={{ color: 'var(--text-sub)', fontSize: '15px', marginTop: '6px' }}>Success Rate</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
