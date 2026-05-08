import React from 'react';

const Loader = ({ fullPage = false }) => {
  const content = (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px', padding: '40px' }}>
      <div className="spinner"></div>
      <p style={{ color: 'var(--text-sub)', fontSize: '15px', fontWeight: 500 }}>Loading data, please wait...</p>
    </div>
  );

  if (fullPage) {
    return (
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'var(--bg-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
        {content}
      </div>
    );
  }

  return content;
};

export default Loader;
