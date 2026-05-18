import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../shared/api';
import Loader from '../../components/Loader';
import { ArrowLeft, Sparkles, Building2, HelpCircle, BarChart3, Bookmark, MessageSquare, ThumbsUp, ChevronRight } from 'lucide-react';

const CompanyDetail = () => {
  const { name } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/companies/${name}`);
      setData(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [name]);

  if (loading) return <Loader />;
  if (error) {
    return (
      <div className="container" style={{ padding: '40px 0', textAlign: 'center' }}>
        <div className="glass-card" style={{ maxWidth: '500px', margin: '0 auto', padding: '40px' }}>
          <Building2 size={40} style={{ color: 'var(--error)', marginBottom: '16px' }} />
          <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>Company Profile Not Found</h3>
          <p style={{ color: 'var(--text-sub)' }}>{error}</p>
          <Link to="/companies" className="btn btn-secondary" style={{ marginTop: '24px' }}>
            Back to Companies
          </Link>
        </div>
      </div>
    );
  }

  const { companyName, totalExperiences, selectionRate, difficultyBreakdown, bookmarks, mostAskedQuestions, isTrending, experiences } = data;

  const totalDiff = (difficultyBreakdown.Easy || 0) + (difficultyBreakdown.Medium || 0) + (difficultyBreakdown.Hard || 0) || 1;
  const easyPct = Math.round(((difficultyBreakdown.Easy || 0) / totalDiff) * 100);
  const medPct = Math.round(((difficultyBreakdown.Medium || 0) / totalDiff) * 100);
  const hardPct = Math.round(((difficultyBreakdown.Hard || 0) / totalDiff) * 100);

  return (
    <div className="container animate-fade-in" style={{ padding: '12px 0' }}>
      
      {/* Back Link */}
      <div style={{ marginBottom: '24px' }}>
        <Link to="/companies" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-sub)', fontWeight: 600 }}>
          <ArrowLeft size={16} />
          <span>Back to Companies</span>
        </Link>
      </div>

      {/* Header Banner */}
      <div className="glass-card" style={{ padding: '32px', marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '16px', borderRadius: 'var(--radius-md)', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)' }}>
            <Building2 size={40} />
          </div>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: 800 }}>{companyName}</h1>
            <p style={{ color: 'var(--text-sub)', fontSize: '15px', marginTop: '4px' }}>
              Compiled analytics from <strong style={{ color: 'var(--text-main)' }}>{totalExperiences}</strong> student interview logs.
            </p>
          </div>
        </div>

        {isTrending && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', background: 'rgba(168, 85, 247, 0.1)', color: 'var(--secondary)', borderRadius: '30px', fontSize: '13px', fontWeight: 700 }}>
            <Sparkles size={14} />
            <span>Trending Company</span>
          </div>
        )}
      </div>

      {/* Analytics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px', marginBottom: '32px' }}>
        {/* Selection Rate */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '32px' }}>
          <span style={{ fontSize: '14px', color: 'var(--text-sub)', fontWeight: 600, marginBottom: '16px' }}>Selection Rate</span>
          <div style={{ position: 'relative', width: '120px', height: '120px', borderRadius: '50%', background: 'var(--bg-input)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {/* Simple circular background progress using border */}
            <div style={{ position: 'absolute', width: '100%', height: '100%', borderRadius: '50%', border: '6px solid var(--border-color)' }}></div>
            <div style={{ position: 'absolute', width: '100%', height: '100%', borderRadius: '50%', border: '6px solid var(--success)', clipPath: `polygon(50% 50%, 50% 0%, ${selectionRate > 25 ? '100% 0%,' : ''} ${selectionRate > 50 ? '100% 100%,' : ''} ${selectionRate > 75 ? '0% 100%,' : ''} 50% 100%)` }}></div>
            <span style={{ fontSize: '28px', fontWeight: 800 }}>{selectionRate}%</span>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '16px', lineHeight: 1.4 }}>Percentage of shared experiences resulting in selected status.</p>
        </div>

        {/* Difficulty Breakdown */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-sub)', marginBottom: '20px', textAlign: 'center' }}>Difficulty Breakdown</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Easy */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                <span style={{ fontWeight: 600, color: '#34d399' }}>Easy</span>
                <span style={{ color: 'var(--text-sub)' }}>{difficultyBreakdown.Easy || 0} ({easyPct}%)</span>
              </div>
              <div style={{ height: '6px', background: 'var(--bg-input)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${easyPct}%`, height: '100%', background: '#34d399' }}></div>
              </div>
            </div>

            {/* Medium */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                <span style={{ fontWeight: 600, color: '#facc15' }}>Medium</span>
                <span style={{ color: 'var(--text-sub)' }}>{difficultyBreakdown.Medium || 0} ({medPct}%)</span>
              </div>
              <div style={{ height: '6px', background: 'var(--bg-input)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${medPct}%`, height: '100%', background: '#facc15' }}></div>
              </div>
            </div>

            {/* Hard */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                <span style={{ fontWeight: 600, color: '#fb7185' }}>Hard</span>
                <span style={{ color: 'var(--text-sub)' }}>{difficultyBreakdown.Hard || 0} ({hardPct}%)</span>
              </div>
              <div style={{ height: '6px', background: 'var(--bg-input)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${hardPct}%`, height: '100%', background: '#fb7185' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Global Stats */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around', padding: '24px' }}>
          <div>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Community Bookmarks</span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '6px' }}>
              <span style={{ fontSize: '32px', fontWeight: 800, color: 'var(--primary)' }}>{bookmarks}</span>
              <span style={{ fontSize: '14px', color: 'var(--text-sub)' }}>saved times</span>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Interview Experiences Logged</span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '6px' }}>
              <span style={{ fontSize: '32px', fontWeight: 800, color: 'var(--secondary)' }}>{totalExperiences}</span>
              <span style={{ fontSize: '14px', color: 'var(--text-sub)' }}>contributed entries</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: '32px', alignItems: 'flex-start' }}>
        {/* Left: Most Asked Questions */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <HelpCircle size={18} style={{ color: 'var(--accent)' }} />
            <span>Most Asked Questions</span>
          </h3>

          {mostAskedQuestions.length === 0 ? (
            <p style={{ color: 'var(--text-sub)', fontSize: '14px' }}>No questions logged yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {mostAskedQuestions.map((item, idx) => (
                <div key={idx} style={{ background: 'var(--bg-input)', padding: '12px 16px', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--accent)' }}>
                  <p style={{ fontSize: '13px', fontWeight: 500, lineHeight: 1.4 }}>"{item.question}"</p>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginTop: '6px', textAlign: 'right' }}>
                    Asked {item.count} times
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Experiences List */}
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BarChart3 size={18} style={{ color: 'var(--primary)' }} />
            <span>Interview Logs for {companyName}</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {experiences.map((exp) => (
              <div key={exp._id} className="glass-card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '12px' }}>
                  <div>
                    <h4 style={{ fontSize: '16px', fontWeight: 700 }}>{exp.roleApplied}</h4>
                    <p style={{ fontSize: '12px', color: 'var(--text-sub)', marginTop: '2px' }}>
                      Shared by {exp.author?.name || 'Anonymous'} &bull; {new Date(exp.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <span className={`badge badge-${exp.difficulty.toLowerCase()}`} style={{ fontSize: '11px' }}>{exp.difficulty}</span>
                    <span className={`badge badge-${exp.resultStatus.toLowerCase()}`} style={{ fontSize: '11px' }}>{exp.resultStatus}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: 'var(--text-sub)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                      <ThumbsUp size={12} />
                      {exp.upvotesCount}
                    </span>
                  </div>

                  <Link to={`/experiences/${exp._id}`} className="btn btn-accent" style={{ padding: '6px 12px', fontSize: '12px' }}>
                    Read Log
                    <ChevronRight size={12} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};

export default CompanyDetail;
