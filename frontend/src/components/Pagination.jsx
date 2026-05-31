import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ page, pages, onPageChange }) => {
  if (pages <= 1) return null;

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginTop: '32px' }}>
      <button 
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        className="btn btn-secondary"
        style={{ padding: '8px 12px', opacity: page === 1 ? 0.5 : 1, cursor: page === 1 ? 'not-allowed' : 'pointer' }}
      >
        <ChevronLeft size={18} />
        <span>Prev</span>
      </button>

      <span style={{ fontSize: '15px', color: 'var(--text-sub)' }}>
        Page <strong style={{ color: 'var(--text-main)' }}>{page}</strong> of <strong style={{ color: 'var(--text-main)' }}>{pages}</strong>
      </span>

      <button 
        disabled={page === pages}
        onClick={() => onPageChange(page + 1)}
        className="btn btn-secondary"
        style={{ padding: '8px 12px', opacity: page === pages ? 0.5 : 1, cursor: page === pages ? 'not-allowed' : 'pointer' }}
      >
        <span>Next</span>
        <ChevronRight size={18} />
      </button>
    </div>
  );
};

export default Pagination;
