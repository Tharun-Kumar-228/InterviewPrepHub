import React from 'react';
import { Database } from 'lucide-react';

const EmptyState = ({ title = 'No results found', description = 'Try adjusting your search terms or filters.', actionText, onAction }) => {
  return (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '60px 40px', gap: '16px', maxWidth: '500px', margin: '40px auto' }}>
      <div style={{ padding: '16px', borderRadius: '50%', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)' }}>
        <Database size={40} />
      </div>
      <h3 style={{ fontSize: '20px', fontWeight: 700 }}>{title}</h3>
      <p style={{ color: 'var(--text-sub)', fontSize: '15px', lineHeight: 1.5 }}>{description}</p>
      {actionText && onAction && (
        <button onClick={onAction} className="btn btn-primary" style={{ marginTop: '8px' }}>
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
