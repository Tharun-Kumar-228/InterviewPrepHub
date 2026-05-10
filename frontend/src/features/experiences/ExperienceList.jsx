import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../shared/api';
import Loader from '../../components/Loader';
import EmptyState from '../../components/EmptyState';
import Pagination from '../../components/Pagination';
import { SlidersHorizontal, Search, ArrowUpDown, ThumbsUp, MessageSquare, Plus, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const ExperienceList = () => {
  const [experiences, setExperiences] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [level, setLevel] = useState('');
  const [status, setStatus] = useState('');
  const [sort, setSort] = useState('recent');
  const [page, setPage] = useState(1);
  
  const { isAuthenticated } = useAuth();

  const fetchExperiences = async () => {
    try {
      setLoading(true);
      // Build query string
      const params = new URLSearchParams();
      params.append('page', page);
      params.append('limit', 6);
      if (company) params.append('companyName', company);
      if (role) params.append('roleApplied', role);
      if (difficulty) params.append('difficulty', difficulty);
      if (level) params.append('experienceLevel', level);
      if (status) params.append('resultStatus', status);
      if (sort) params.append('sort', sort);

      const res = await api.get(`/experiences?${params.toString()}`);
      setExperiences(res.data);
      setPagination(res.meta);
    } catch (err) {
      console.error('Error fetching experiences:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiences();
  }, [page, sort]);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    setPage(1); // reset to first page
    fetchExperiences();
  };

  const handleClearFilters = () => {
    setCompany('');
    setRole('');
    setDifficulty('');
    setLevel('');
    setStatus('');
    setPage(1);
    // Trigger list fetch
    setTimeout(() => fetchExperiences(), 0);
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '24px 0' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 800 }}>Interview Experiences</h1>
          <p style={{ color: 'var(--text-sub)', fontSize: '15px', marginTop: '4px' }}>Browse logs written by students detailing actual technical interviews.</p>
        </div>
        
        {isAuthenticated && (
          <Link to="/experiences/create" className="btn btn-primary">
            <Plus size={18} />
            <span>Share Log</span>
          </Link>
        )}
      </div>

      {/* Filter bar */}
      <form onSubmit={handleFilterSubmit} className="glass-card" style={{ padding: '20px', marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', color: 'var(--text-sub)', fontSize: '14px', fontWeight: 600 }}>
          <SlidersHorizontal size={16} />
          <span>Filter Logs</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '20px' }}>
          <div>
            <label className="form-label" style={{ fontSize: '12px' }}>Company</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="e.g. Google" 
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              style={{ padding: '8px 12px', fontSize: '14px' }}
            />
          </div>

          <div>
            <label className="form-label" style={{ fontSize: '12px' }}>Role</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="e.g. SDE-1" 
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={{ padding: '8px 12px', fontSize: '14px' }}
            />
          </div>

          <div>
            <label className="form-label" style={{ fontSize: '12px' }}>Difficulty</label>
            <select 
              className="form-control"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              style={{ padding: '8px 12px', fontSize: '14px' }}
            >
              <option value="">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          <div>
            <label className="form-label" style={{ fontSize: '12px' }}>Level</label>
            <select 
              className="form-control"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              style={{ padding: '8px 12px', fontSize: '14px' }}
            >
              <option value="">All Levels</option>
              <option value="Intern">Intern</option>
              <option value="Entry-Level">Entry-Level</option>
              <option value="Mid-Level">Mid-Level</option>
              <option value="Senior-Level">Senior-Level</option>
            </select>
          </div>

          <div>
            <label className="form-label" style={{ fontSize: '12px' }}>Result Status</label>
            <select 
              className="form-control"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              style={{ padding: '8px 12px', fontSize: '14px' }}
            >
              <option value="">All Results</option>
              <option value="Selected">Selected</option>
              <option value="Rejected">Rejected</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          {/* Sorting */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ArrowUpDown size={14} style={{ color: 'var(--text-muted)' }} />
            <select 
              className="form-control"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              style={{ padding: '8px 12px', fontSize: '14px', width: 'auto', background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer' }}
            >
              <option value="recent">Sort by: Recent</option>
              <option value="popular">Sort by: Upvotes</option>
              <option value="comments">Sort by: Comments</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button type="button" onClick={handleClearFilters} className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '14px' }}>
              Clear
            </button>
            <button type="submit" className="btn btn-primary" style={{ padding: '8px 20px', fontSize: '14px' }}>
              Apply Filters
            </button>
          </div>
        </div>
      </form>

      {/* Experience Cards Grid */}
      {loading ? (
        <Loader />
      ) : experiences.length === 0 ? (
        <EmptyState 
          title="No Experiences Found" 
          description="We couldn't find any interview experiences matching your filters."
          actionText="Clear Filters"
          onAction={handleClearFilters}
        />
      ) : (
        <>
          <div className="grid grid-cols-3">
            {experiences.map((exp) => (
              <div key={exp._id} className="glass-card animate-fade-in" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '260px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px', marginBottom: '14px' }}>
                    <div>
                      <Link to={`/companies/${exp.companyName}`} style={{ fontSize: '18px', fontWeight: 700, color: 'var(--primary)' }}>
                        {exp.companyName}
                      </Link>
                      <h4 style={{ fontSize: '15px', fontWeight: 500, color: 'var(--text-main)', marginTop: '2px' }}>{exp.roleApplied}</h4>
                    </div>
                    <span className={`badge badge-${exp.difficulty.toLowerCase()}`}>{exp.difficulty}</span>
                  </div>

                  <p style={{ fontSize: '13px', color: 'var(--text-sub)', marginBottom: '12px' }}>
                    Level: <strong style={{ color: 'var(--text-main)' }}>{exp.experienceLevel}</strong> &bull; Result: <strong style={{ color: 'var(--text-main)' }}>{exp.resultStatus}</strong>
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                    {exp.tags.slice(0, 3).map((tag, idx) => (
                      <span key={idx} style={{ fontSize: '11px', background: 'rgba(255, 255, 255, 0.04)', border: '1px solid var(--border-color)', padding: '2px 8px', borderRadius: '4px', color: 'var(--text-sub)' }}>
                        #{tag}
                      </span>
                    ))}
                    {exp.tags.length > 3 && <span style={{ fontSize: '11px', color: 'var(--text-muted)', alignSelf: 'center' }}>+{exp.tags.length - 3}</span>}
                  </div>
                </div>

                <div>
                  <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '12px 0' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: 'var(--text-sub)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <ThumbsUp size={12} />
                        {exp.upvotesCount}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MessageSquare size={12} />
                        {exp.commentsCount}
                      </span>
                    </div>

                    <Link to={`/experiences/${exp._id}`} className="btn btn-accent" style={{ padding: '6px 12px', fontSize: '12px' }}>
                      Read Log
                      <ChevronRight size={12} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <Pagination 
            page={pagination.page}
            pages={pagination.pages}
            onPageChange={(p) => setPage(p)}
          />
        </>
      )}
    </div>
  );
};

export default ExperienceList;
