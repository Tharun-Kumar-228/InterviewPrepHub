import React, { useEffect, useState } from 'react';
import { api } from '../../shared/api';
import Loader from '../../components/Loader';
import { useAuth } from '../../context/AuthContext';
import { useAppState } from '../../context/AppStateContext';
import { User, Mail, Github, Linkedin, Briefcase, GraduationCap, ThumbsUp, FileText, ChevronRight, Edit2, Link as LinkIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

const UserProfile = () => {
  const { user, updateProfile } = useAuth();
  const { triggerNotification } = useAppState();

  const [stats, setStats] = useState(null);
  const [myExperiences, setMyExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');

  // Profile Edit fields
  const [bio, setBio] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [skills, setSkills] = useState('');
  const [gradYear, setGradYear] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      // Fetch stats
      const statsRes = await api.get('/profile');
      setStats(statsRes.data);

      // Fetch user's shared logs
      const logsRes = await api.get('/profile/experiences');
      setMyExperiences(logsRes.data);

      // Populate edit fields
      if (statsRes.data.user) {
        const u = statsRes.data.user;
        setBio(u.profile?.bio || '');
        setGithubUrl(u.profile?.githubUrl || '');
        setLinkedinUrl(u.profile?.linkedinUrl || '');
        setSkills(u.profile?.skills ? u.profile.skills.join(', ') : '');
        setGradYear(u.profile?.graduationYear || '');
      }
    } catch (err) {
      console.error('Error fetching profile assets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setUpdating(true);
      const payload = {
        bio: bio.trim(),
        githubUrl: githubUrl.trim(),
        linkedinUrl: linkedinUrl.trim(),
        skills: skills.split(',').map(s => s.trim()).filter(s => s.length > 0),
        graduationYear: parseInt(gradYear, 10) || undefined
      };

      await updateProfile(payload);
      triggerNotification('Profile updated successfully!', 'success');
    } catch (err) {
      triggerNotification(err.message, 'error');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="container animate-fade-in" style={{ padding: '24px 0' }}>
      
      {/* Header Banner */}
      <div className="glass-card" style={{ padding: '32px', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(99,102,241,0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <User size={36} />
        </div>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 800 }}>{user?.name}</h1>
          <p style={{ color: 'var(--text-sub)', fontSize: '15px', marginTop: '4px' }}>
            {user?.email} &bull; <span style={{ textTransform: 'capitalize', fontWeight: 600 }}>{user?.role?.replace('_', ' ')}</span>
          </p>
        </div>
      </div>

      {/* Stats Widgets */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '24px' }}>
          <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(99,102,241,0.1)', color: 'var(--primary)' }}>
            <FileText size={28} />
          </div>
          <div>
            <span style={{ fontSize: '13px', color: 'var(--text-sub)' }}>Experiences Contributed</span>
            <h3 style={{ fontSize: '24px', fontWeight: 800, marginTop: '4px' }}>{stats?.experiencesCount || 0}</h3>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '24px' }}>
          <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(16,185,129,0.1)', color: 'var(--success)' }}>
            <ThumbsUp size={28} />
          </div>
          <div>
            <span style={{ fontSize: '13px', color: 'var(--text-sub)' }}>Total Upvotes Received</span>
            <h3 style={{ fontSize: '24px', fontWeight: 800, marginTop: '4px' }}>{stats?.totalUpvotesReceived || 0}</h3>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-container">
        <button 
          className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          Edit Profile Details
        </button>
        <button 
          className={`tab-btn ${activeTab === 'experiences' ? 'active' : ''}`}
          onClick={() => setActiveTab('experiences')}
        >
          My Contribution Logs ({myExperiences.length})
        </button>
      </div>

      {/* Tab Content */}
      <div style={{ marginTop: '24px' }}>
        {activeTab === 'profile' ? (
          <form onSubmit={handleUpdate} className="glass-card" style={{ maxWidth: '600px', margin: '0 auto', padding: '28px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px' }}>Career Info</h3>

            <div className="form-group">
              <label className="form-label" htmlFor="bioInput">Profile Bio</label>
              <textarea 
                id="bioInput" 
                className="form-control" 
                placeholder="Tell us about yourself (e.g. SDE Intern at Uber, interested in System Design)."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows="3"
                style={{ resize: 'vertical' }}
              />
            </div>

            <div className="grid grid-cols-2" style={{ gap: '16px' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="git">GitHub URL</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', display: 'flex' }}>
                    <Github size={16} />
                  </span>
                  <input 
                    type="url" 
                    id="git"
                    className="form-control"
                    placeholder="https://github.com/username"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    style={{ paddingLeft: '40px' }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="ln">LinkedIn URL</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', display: 'flex' }}>
                    <Linkedin size={16} />
                  </span>
                  <input 
                    type="url" 
                    id="ln"
                    className="form-control"
                    placeholder="https://linkedin.com/in/username"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    style={{ paddingLeft: '40px' }}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2" style={{ gap: '16px' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="gradY">Graduation Year</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', display: 'flex' }}>
                    <GraduationCap size={16} />
                  </span>
                  <input 
                    type="number" 
                    id="gradY"
                    className="form-control"
                    placeholder="2027"
                    value={gradYear}
                    onChange={(e) => setGradYear(e.target.value)}
                    style={{ paddingLeft: '40px' }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="skillsInput">Skills (comma separated)</label>
                <input 
                  type="text" 
                  id="skillsInput"
                  className="form-control"
                  placeholder="React, Node.js, Python"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '16px' }} disabled={updating}>
              {updating ? 'Saving...' : 'Update Profile'}
            </button>
          </form>
        ) : (
          <div>
            {myExperiences.length === 0 ? (
              <div className="glass-card" style={{ textAlign: 'center', padding: '40px' }}>
                <p style={{ color: 'var(--text-sub)' }}>You haven't contributed any experiences yet.</p>
                <Link to="/experiences/create" className="btn btn-primary" style={{ marginTop: '16px' }}>Share Your First Log</Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {myExperiences.map((exp) => (
                  <div key={exp._id} className="glass-card" style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Link to={`/experiences/${exp._id}`} style={{ fontSize: '18px', fontWeight: 700, color: 'var(--primary)' }}>
                            {exp.companyName}
                          </Link>
                          <span style={{ color: 'var(--text-muted)' }}>&bull;</span>
                          <span style={{ fontSize: '15px', fontWeight: 500 }}>{exp.roleApplied}</span>
                        </div>
                        <p style={{ fontSize: '12px', color: 'var(--text-sub)', marginTop: '4px' }}>
                          Shared on: {new Date(exp.createdAt).toLocaleDateString()} &bull; {exp.difficulty} &bull; {exp.resultStatus}
                        </p>
                      </div>

                      <div style={{ display: 'flex', gap: '10px' }}>
                        <Link to={`/experiences/${exp._id}/edit`} className="btn btn-secondary" style={{ display: 'flex', gap: '4px', padding: '6px 12px', fontSize: '12px' }}>
                          <Edit2 size={12} />
                          <span>Edit</span>
                        </Link>
                        <Link to={`/experiences/${exp._id}`} className="btn btn-accent" style={{ display: 'flex', gap: '4px', padding: '6px 12px', fontSize: '12px' }}>
                          <span>Read</span>
                          <ChevronRight size={12} />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
};

export default UserProfile;
