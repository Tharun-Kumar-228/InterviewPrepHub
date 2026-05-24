import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { api } from '../../shared/api';
import Loader from '../../components/Loader';
import EmptyState from '../../components/EmptyState';
import { Search, ThumbsUp, Users, Building2, HelpCircle } from 'lucide-react';

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [searchInput, setSearchInput] = useState(query);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('experiences');

  const executeSearch = async (searchTerm) => {
    if (!searchTerm.trim()) return;
    try {
      setLoading(true);
      const res = await api.get(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setResults(res.data);
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setSearchInput(query);
    if (query) {
      executeSearch(query);
    }
  }, [query]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchParams({ q: searchInput.trim() });
    }
  };

  const getResultsCount = (tab) => {
    if (!results) return 0;
    switch (tab) {
      case 'experiences': return results.experiences?.length || 0;
      case 'rooms': return results.rooms?.length || 0;
      case 'questions': return results.questions?.length || 0;
      case 'companies': return results.companies?.length || 0;
      default: return 0;
    }
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '24px 0' }}>
      
      {/* Header Search Field */}
      <div style={{ maxWidth: '600px', margin: '0 auto 40px auto' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, textAlign: 'center', marginBottom: '16px' }}>Global Search</h1>
        
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '12px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', display: 'flex' }}>
              <Search size={18} />
            </span>
            <input 
              type="text"
              className="form-control"
              placeholder="Search companies, tech, tags, questions..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              style={{ paddingLeft: '48px' }}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ padding: '0 24px' }}>Search</button>
        </form>
      </div>

      {!query ? (
        <EmptyState 
          title="Start Searching" 
          description="Type in a search query above to look up questions, companies, study rooms, and logs."
        />
      ) : loading ? (
        <Loader />
      ) : !results ? (
        <EmptyState title="No results" description="Run a query to fetch matching records." />
      ) : (
        <div>
          {/* Tabs */}
          <div className="tabs-container">
            <button 
              className={`tab-btn ${activeTab === 'experiences' ? 'active' : ''}`}
              onClick={() => setActiveTab('experiences')}
            >
              Experiences ({getResultsCount('experiences')})
            </button>
            <button 
              className={`tab-btn ${activeTab === 'rooms' ? 'active' : ''}`}
              onClick={() => setActiveTab('rooms')}
            >
              Study Rooms ({getResultsCount('rooms')})
            </button>
            <button 
              className={`tab-btn ${activeTab === 'questions' ? 'active' : ''}`}
              onClick={() => setActiveTab('questions')}
            >
              Questions ({getResultsCount('questions')})
            </button>
            <button 
              className={`tab-btn ${activeTab === 'companies' ? 'active' : ''}`}
              onClick={() => setActiveTab('companies')}
            >
              Companies ({getResultsCount('companies')})
            </button>
          </div>

          {/* Tab Content */}
          <div style={{ marginTop: '24px' }}>
            
            {/* Experiences Tab */}
            {activeTab === 'experiences' && (
              results.experiences?.length === 0 ? (
                <EmptyState title="No experiences found" description="Try searching for a different keyword." />
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {results.experiences.map((exp) => (
                    <div key={exp._id} className="glass-card" style={{ padding: '20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <Link to={`/experiences/${exp._id}`} style={{ fontSize: '18px', fontWeight: 700, color: 'var(--primary)' }}>
                            {exp.companyName} &bull; {exp.roleApplied}
                          </Link>
                          <p style={{ fontSize: '12px', color: 'var(--text-sub)', marginTop: '4px' }}>
                            Shared by {exp.author?.name || 'Student'} &bull; {exp.difficulty} &bull; {exp.resultStatus}
                          </p>
                        </div>
                        <div style={{ display: 'flex', gap: '8px', fontSize: '12px', color: 'var(--text-sub)' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <ThumbsUp size={12} />
                            {exp.upvotesCount}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}

            {/* Study Rooms Tab */}
            {activeTab === 'rooms' && (
              results.rooms?.length === 0 ? (
                <EmptyState title="No study rooms found" description="Try looking for MERN, Node, MongoDB, or DBMS." />
              ) : (
                <div className="grid grid-cols-3">
                  {results.rooms.map((room) => (
                    <div key={room._id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '8px' }}>{room.name}</h3>
                        <p style={{ fontSize: '13px', color: 'var(--text-sub)', lineHeight: 1.4 }}>{room.description}</p>
                      </div>
                      <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Users size={12} />
                          {room.memberCount} members
                        </span>
                        <Link to={`/rooms/${room._id}`} className="btn btn-accent" style={{ padding: '4px 10px', fontSize: '11px' }}>Enter</Link>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}

            {/* Questions Tab */}
            {activeTab === 'questions' && (
              results.questions?.length === 0 ? (
                <EmptyState title="No interview questions match" description="Try query words like LRU, promises, or algorithms." />
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {results.questions.map((item, idx) => (
                    <div key={idx} className="glass-card" style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <HelpCircle size={20} style={{ color: 'var(--accent)' }} />
                        <div>
                          <p style={{ fontSize: '14px', fontWeight: 600 }}>"{item.question}"</p>
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Asked at: {item.companies.join(', ')}</span>
                        </div>
                      </div>
                      <span className="badge" style={{ background: 'rgba(6,182,212,0.1)', color: 'var(--accent)', fontSize: '11px' }}>
                        {item.count} occurrences
                      </span>
                    </div>
                  ))}
                </div>
              )
            )}

            {/* Companies Tab */}
            {activeTab === 'companies' && (
              results.companies?.length === 0 ? (
                <EmptyState title="No companies match" description="Try looking for Google, Amazon, Microsoft, or Meta." />
              ) : (
                <div className="grid grid-cols-4">
                  {results.companies.map((comp, idx) => (
                    <Link key={idx} to={`/companies/${encodeURIComponent(comp.companyName)}`} className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <Building2 size={24} style={{ color: 'var(--primary)' }} />
                      <div>
                        <h4 style={{ fontSize: '15px', fontWeight: 700 }}>{comp.companyName}</h4>
                        <span style={{ fontSize: '12px', color: 'var(--text-sub)' }}>{comp.experiencesCount} logs</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )
            )}

          </div>
        </div>
      )}

    </div>
  );
};

export default SearchPage;
