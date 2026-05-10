import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../../shared/api';
import Loader from '../../components/Loader';
import { useAuth } from '../../context/AuthContext';
import { useAppState } from '../../context/AppStateContext';
import { ThumbsUp, Bookmark, Calendar, User, ArrowLeft, Send, Trash2, Edit2, MessageSquare, BookOpen, AlertCircle } from 'lucide-react';

const ExperienceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin } = useAuth();
  const { triggerNotification } = useAppState();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/experiences/${id}`);
      setData(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const handleUpvote = async () => {
    if (!isAuthenticated) {
      triggerNotification('Please log in to upvote experiences.', 'error');
      return;
    }
    try {
      const res = await api.post(`/experiences/${id}/upvote`);
      setData(prev => ({
        ...prev,
        experience: {
          ...prev.experience,
          upvotesCount: res.data.upvotesCount
        },
        userState: {
          ...prev.userState,
          hasUpvoted: res.data.isUpvoted
        }
      }));
      triggerNotification(res.data.isUpvoted ? 'Upvoted experience!' : 'Removed upvote', 'success');
    } catch (err) {
      triggerNotification(err.message, 'error');
    }
  };

  const handleBookmark = async () => {
    if (!isAuthenticated) {
      triggerNotification('Please log in to bookmark experiences.', 'error');
      return;
    }
    try {
      const res = await api.post(`/experiences/${id}/bookmark`);
      setData(prev => ({
        ...prev,
        experience: {
          ...prev.experience,
          bookmarksCount: res.data.bookmarksCount
        },
        userState: {
          ...prev.userState,
          hasBookmarked: res.data.isBookmarked
        }
      }));
      triggerNotification(res.data.isBookmarked ? 'Added to Bookmarks!' : 'Removed from Bookmarks', 'success');
    } catch (err) {
      triggerNotification(err.message, 'error');
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      setSubmittingComment(true);
      const res = await api.post(`/experiences/${id}/comments`, { content: commentText.trim() });
      setData(prev => ({
        ...prev,
        comments: [...prev.comments, res.data],
        experience: {
          ...prev.experience,
          commentsCount: prev.experience.commentsCount + 1
        }
      }));
      setCommentText('');
      triggerNotification('Comment posted!', 'success');
    } catch (err) {
      triggerNotification(err.message, 'error');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;
    try {
      await api.delete(`/experiences/comments/${commentId}`);
      setData(prev => ({
        ...prev,
        comments: prev.comments.filter(c => c._id !== commentId),
        experience: {
          ...prev.experience,
          commentsCount: Math.max(0, prev.experience.commentsCount - 1)
        }
      }));
      triggerNotification('Comment deleted successfully.', 'success');
    } catch (err) {
      triggerNotification(err.message, 'error');
    }
  };

  const handleDeleteExperience = async () => {
    if (!window.confirm('CRITICAL: Are you sure you want to delete this entire interview log? This action is permanent.')) return;
    try {
      await api.delete(`/experiences/${id}`);
      triggerNotification('Interview experience deleted.', 'success');
      navigate('/dashboard');
    } catch (err) {
      triggerNotification(err.message, 'error');
    }
  };

  if (loading) return <Loader />;
  if (error) {
    return (
      <div className="container" style={{ padding: '40px 0', textAlign: 'center' }}>
        <div className="glass-card" style={{ maxWidth: '500px', margin: '0 auto', padding: '40px' }}>
          <AlertCircle size={40} style={{ color: 'var(--error)', marginBottom: '16px' }} />
          <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>Log Not Found</h3>
          <p style={{ color: 'var(--text-sub)' }}>{error}</p>
          <Link to="/experiences" className="btn btn-secondary" style={{ marginTop: '24px' }}>
            Back to Experiences
          </Link>
        </div>
      </div>
    );
  }

  const { experience, comments, userState } = data;
  const isAuthor = user && experience.author?._id === user._id;
  const showEditActions = isAuthor || isAdmin;

  return (
    <div className="container animate-fade-in" style={{ padding: '12px 0' }}>
      
      {/* Back Link & Admin Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <Link to="/experiences" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-sub)', fontWeight: 600 }}>
          <ArrowLeft size={16} />
          <span>Back to list</span>
        </Link>

        {showEditActions && (
          <div style={{ display: 'flex', gap: '12px' }}>
            <Link to={`/experiences/${id}/edit`} className="btn btn-secondary" style={{ display: 'flex', gap: '6px', padding: '8px 16px', fontSize: '14px' }}>
              <Edit2 size={14} />
              <span>Edit Log</span>
            </Link>
            <button onClick={handleDeleteExperience} className="btn btn-danger" style={{ display: 'flex', gap: '6px', padding: '8px 16px', fontSize: '14px' }}>
              <Trash2 size={14} />
              <span>Delete Log</span>
            </button>
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px', alignItems: 'flex-start' }}>
        {/* Main Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* Header Card */}
          <div className="glass-card" style={{ padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
              <div>
                <Link to={`/companies/${experience.companyName}`} style={{ fontSize: '32px', fontWeight: 800, color: 'var(--primary)', lineHeight: 1 }}>
                  {experience.companyName}
                </Link>
                <h2 style={{ fontSize: '20px', fontWeight: 600, marginTop: '8px', color: 'var(--text-main)' }}>{experience.roleApplied}</h2>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <span className={`badge badge-${experience.difficulty.toLowerCase()}`} style={{ fontSize: '14px', padding: '6px 12px' }}>{experience.difficulty}</span>
                <span className={`badge badge-${experience.resultStatus.toLowerCase()}`} style={{ fontSize: '14px', padding: '6px 12px' }}>{experience.resultStatus}</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', color: 'var(--text-sub)', fontSize: '14px', marginBottom: '24px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <User size={16} />
                <span>Shared by {experience.author?.name || 'Anonymous'}</span>
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Calendar size={16} />
                <span>Published on {new Date(experience.createdAt).toLocaleDateString()}</span>
              </span>
              <span>Level: <strong>{experience.experienceLevel}</strong></span>
            </div>

            {/* Tags */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {experience.tags.map((tag, idx) => (
                <span key={idx} style={{ fontSize: '13px', background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.15)', color: 'var(--primary)', padding: '4px 12px', borderRadius: '20px', fontWeight: 500 }}>
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Rounds Breakdown */}
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BookOpen size={20} style={{ color: 'var(--primary)' }} />
              <span>Interview Rounds Timeline</span>
            </h3>

            {experience.interviewRounds?.length === 0 ? (
              <p style={{ color: 'var(--text-sub)' }}>No structured rounds provided.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative', paddingLeft: '16px' }}>
                {/* Timeline vertical bar */}
                <div style={{ position: 'absolute', left: '4px', top: '16px', bottom: '16px', width: '2px', background: 'var(--border-color)' }}></div>
                
                {experience.interviewRounds.map((round, idx) => (
                  <div key={round._id} className="glass-card" style={{ padding: '20px', position: 'relative' }}>
                    {/* timeline bullet */}
                    <div style={{ position: 'absolute', left: '-20px', top: '24px', width: '10px', height: '10px', borderRadius: '50%', background: 'var(--primary)', border: '2px solid var(--bg-dark)' }}></div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <h4 style={{ fontSize: '16px', fontWeight: 700 }}>Round {idx + 1}: {round.roundName}</h4>
                      <span className={`badge badge-${round.difficulty.toLowerCase()}`} style={{ fontSize: '11px' }}>{round.difficulty}</span>
                    </div>
                    <p style={{ color: 'var(--text-sub)', fontSize: '14px', lineHeight: 1.5 }}>{round.description || 'No description provided.'}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Questions Asked */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>Questions Asked</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {experience.questionsAsked.map((q, idx) => (
                <div key={idx} style={{ background: 'var(--bg-input)', borderLeft: '3px solid var(--primary)', padding: '14px 16px', borderRadius: '0 8px 8px 0', fontFamily: 'var(--font-family)', fontSize: '14px', lineHeight: 1.5 }}>
                  "{q}"
                </div>
              ))}
            </div>
          </div>

          {/* Tips and Resources */}
          {experience.tipsResources && (
            <div className="glass-card" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>Tips &amp; Resources</h3>
              <p style={{ color: 'var(--text-sub)', fontSize: '15px', lineHeight: 1.6, whiteSpace: 'pre-line' }}>{experience.tipsResources}</p>
            </div>
          )}

          {/* Comments Section */}
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MessageSquare size={20} style={{ color: 'var(--secondary)' }} />
              <span>Discussion &amp; Comments ({experience.commentsCount})</span>
            </h3>

            {/* Comment Form */}
            {isAuthenticated ? (
              <form onSubmit={handleCommentSubmit} style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                <textarea 
                  className="form-control"
                  rows="2"
                  placeholder="Ask a question or add a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  style={{ resize: 'none', height: '60px' }}
                  required
                />
                <button type="submit" className="btn btn-primary" style={{ padding: '0 20px' }} disabled={submittingComment}>
                  <Send size={18} />
                </button>
              </form>
            ) : (
              <div className="glass-card" style={{ padding: '16px', textAlign: 'center', marginBottom: '24px', color: 'var(--text-sub)', fontSize: '14px' }}>
                Please <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>log in</Link> to post comments.
              </div>
            )}

            {/* Comments List */}
            {comments.length === 0 ? (
              <p style={{ color: 'var(--text-sub)', textAlign: 'center', padding: '20px' }}>No comments posted yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {comments.map((comment) => (
                  <div key={comment._id} className="glass-card" style={{ padding: '16px', background: 'rgba(255, 255, 255, 0.015)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <div>
                        <span style={{ fontWeight: 600, fontSize: '14px', color: 'var(--primary)' }}>{comment.author?.name}</span>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginLeft: '8px' }}>
                          {new Date(comment.createdAt).toLocaleString()}
                        </span>
                      </div>
                      
                      {/* Delete comment */}
                      {(user && (comment.author?._id === user._id || isAdmin)) && (
                        <button 
                          onClick={() => handleDeleteComment(comment._id)} 
                          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                          title="Delete Comment"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                    <p style={{ fontSize: '14px', color: 'var(--text-sub)', lineHeight: 1.5 }}>{comment.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Sidebar Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', position: 'sticky', top: '94px' }}>
          
          <div className="glass-card" style={{ padding: '24px', textAlign: 'center' }}>
            <h4 style={{ fontSize: '16px', marginBottom: '16px' }}>Support this log</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
              <button 
                onClick={handleUpvote} 
                className={`btn ${userState?.hasUpvoted ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '12px' }}
              >
                <ThumbsUp size={16} />
                <span>{experience.upvotesCount}</span>
              </button>

              <button 
                onClick={handleBookmark} 
                className={`btn ${userState?.hasBookmarked ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '12px' }}
              >
                <Bookmark size={16} />
                <span>Save</span>
              </button>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.4 }}>Upvote if you found this detailed walkthrough helpful, or bookmark to save for later revision.</p>
          </div>

          {/* Author Profile widget */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <h4 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '16px', color: 'var(--text-sub)' }}>About the Author</h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justify: 'center' }}>
                <User size={20} />
              </div>
              <div>
                <h5 style={{ fontSize: '15px', fontWeight: 600 }}>{experience.author?.name || 'Anonymous'}</h5>
                <span className="badge" style={{ background: 'rgba(255,255,255,0.05)', fontSize: '10px', padding: '2px 8px' }}>
                  {experience.author?.role === 'admin' ? 'Admin' : experience.author?.role === 'room_creator' ? 'Mentor' : 'Student'}
                </span>
              </div>
            </div>
            {experience.author?.profile?.bio && (
              <p style={{ fontSize: '13px', color: 'var(--text-sub)', lineHeight: 1.4, marginTop: '8px' }}>"{experience.author.profile.bio}"</p>
            )}
            
            {experience.author?._id && (
              <Link to={`/profile/${experience.author._id}`} className="btn btn-secondary" style={{ width: '100%', fontSize: '12px', padding: '6px', marginTop: '16px' }}>
                View Contributions
              </Link>
            )}
          </div>

        </div>
      </div>

    </div>
  );
};

export default ExperienceDetail;
