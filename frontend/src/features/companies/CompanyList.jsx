import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../shared/api';
import Loader from '../../components/Loader';
import EmptyState from '../../components/EmptyState';
import { Building2, ChevronRight, BarChart3, ThumbsUp } from 'lucide-react';

const CompanyList = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const res = await api.get('/companies');
      setCompanies(res.data);
    } catch (err) {
      console.error('Error fetching companies list:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  return (
    <div className="container animate-fade-in" style={{ padding: '24px 0' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 800 }}>Explore Companies</h1>
        <p style={{ color: 'var(--text-sub)', fontSize: '15px', marginTop: '4px' }}>Analyze selection metrics, difficulty levels, and logs for specific employers.</p>
      </div>

      {loading ? (
        <Loader />
      ) : companies.length === 0 ? (
        <EmptyState 
          title="No Companies Found" 
          description="There are currently no interview experiences shared on the platform to compile company profiles."
        />
      ) : (
        <div className="grid grid-cols-4">
          {companies.map((comp, idx) => (
            <Link 
              key={idx} 
              to={`/companies/${encodeURIComponent(comp.companyName)}`}
              className="glass-card"
              style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '180px', padding: '24px' }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px', color: 'var(--primary)' }}>
                  <Building2 size={24} />
                  <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-main)' }}>{comp.companyName}</h3>
                </div>
                
                <p style={{ fontSize: '13px', color: 'var(--text-sub)' }}>
                  Logs shared: <strong style={{ color: 'var(--text-main)' }}>{comp.experiencesCount}</strong>
                </p>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                  <BarChart3 size={14} style={{ color: 'var(--success)' }} />
                  <span style={{ fontSize: '13px', color: 'var(--text-sub)' }}>
                    Selection Rate: <strong style={{ color: 'var(--text-main)' }}>{comp.selectionRate}%</strong>
                  </span>
                </div>
              </div>

              <div>
                <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '12px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: 'var(--text-sub)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <ThumbsUp size={12} />
                    {comp.totalUpvotes} upvotes
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '2px', color: 'var(--primary)', fontWeight: 600 }}>
                    <span>Stats</span>
                    <ChevronRight size={12} />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

    </div>
  );
};

export default CompanyList;
