import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../shared/api';
import Loader from '../../components/Loader';
import EmptyState from '../../components/EmptyState';
import { BookMarked, ThumbsUp, MessageSquare, ChevronRight } from 'lucide-react';

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookmarks = async () => {
    try {
      setLoading(true);
      const res = await api.get('/profile/bookmarks');
      setBookmarks(res.data);
    } catch (err) {
      console.error('Error fetching bookmarks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  return (
    <div className="container animate-fade-in" style={{ padding: '24px 0' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BookMarked size={28} style={{ color: 'var(--primary)' }} />
          <span>Saved Bookmarks</span>
        </h1>
        <p style={{ color: 'var(--text-sub)', fontSize: '15px', marginTop: '4px' }}>Access your saved interview logs for quick revision.</p>
      </div>

      {loading ? (
        <Loader />
      ) : bookmarks.length === 0 ? (
        <EmptyState 
          title="No Bookmarked Logs" 
          description="Click the Bookmark button inside any interview log page to save them here."
          actionText="Browse Experiences"
          onAction={() => window.location.href = '/experiences'}
        />
      ) : (
        <div className="grid grid-cols-3">
          {bookmarks.map((b) => {
            const exp = b.experience;
            if (!exp) return null;
            
            return (
              <div key={b._id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '200px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div>
                      <Link to={`/companies/${exp.companyName}`} style={{ fontSize: '18px', fontWeight: 700, color: 'var(--primary)' }}>
                        {exp.companyName}
                      </Link>
                      <h4 style={{ fontSize: '14px', fontWeight: 500, marginTop: '2px' }}>{exp.roleApplied}</h4>
                    </div>
                    <span className={`badge badge-${exp.difficulty.toLowerCase()}`}>{exp.difficulty}</span>
                  </div>
                  
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Saved on: {new Date(b.createdAt).toLocaleDateString()}</p>
                </div>

                <div>
                  <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '12px 0' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: 'var(--text-sub)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <ThumbsUp size={12} />
                        {exp.upvotesCount}
                      </span>
                    </div>

                    <Link to={`/experiences/${exp._id}`} className="btn btn-accent" style={{ padding: '6px 12px', fontSize: '12px' }}>
                      Read Details
                      <ChevronRight size={12} />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};

export default Bookmarks;
