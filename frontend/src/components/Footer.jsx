import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
        <p style={{ fontWeight: 600, color: 'var(--text-sub)' }}>InterviewPrep Hub &copy; {new Date().getFullYear()}</p>
        <p style={{ fontSize: '13px', maxWidth: '600px', lineHeight: 1.5 }}>
          A community platform built for students to prepare for tech interviews together. Share real experiences, join study rooms, revise concepts, and help each other succeed.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
