import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { api } from '../../shared/api';
import Loader from '../../components/Loader';
import { useAppState } from '../../context/AppStateContext';
import { Plus, Trash, Save, ArrowLeft, HelpCircle, Layers, AlertCircle } from 'lucide-react';

const CreateExperience = () => {
  const { id } = useParams(); // undefined for create, contains ID for edit
  const isEditMode = !!id;
  const navigate = useNavigate();
  const { triggerNotification } = useAppState();

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form Fields
  const [companyName, setCompanyName] = useState('');
  const [roleApplied, setRoleApplied] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('Entry-Level');
  const [difficulty, setDifficulty] = useState('Medium');
  const [resultStatus, setResultStatus] = useState('Selected');
  const [tipsResources, setTipsResources] = useState('');
  const [tags, setTags] = useState('');
  const [questionsAsked, setQuestionsAsked] = useState(['']);
  const [interviewRounds, setInterviewRounds] = useState([
    { roundName: '', description: '', difficulty: 'Medium' }
  ]);

  // Load experience details if in Edit Mode
  useEffect(() => {
    if (!isEditMode) return;

    const fetchExperience = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/experiences/${id}`);
        const exp = res.data.experience;

        setCompanyName(exp.companyName);
        setRoleApplied(exp.roleApplied);
        setExperienceLevel(exp.experienceLevel);
        setDifficulty(exp.difficulty);
        setResultStatus(exp.resultStatus);
        setTipsResources(exp.tipsResources || '');
        setTags(exp.tags ? exp.tags.join(', ') : '');
        setQuestionsAsked(exp.questionsAsked || ['']);
        setInterviewRounds(
          exp.interviewRounds && exp.interviewRounds.length > 0
            ? exp.interviewRounds.map(r => ({
                roundName: r.roundName,
                description: r.description || '',
                difficulty: r.difficulty || 'Medium'
              }))
            : [{ roundName: '', description: '', difficulty: 'Medium' }]
        );
      } catch (err) {
        triggerNotification(`Error loading experience: ${err.message}`, 'error');
        navigate('/experiences');
      } finally {
        setLoading(false);
      }
    };

    fetchExperience();
  }, [id, isEditMode]);

  // Questions Handlers
  const handleAddQuestion = () => {
    setQuestionsAsked([...questionsAsked, '']);
  };

  const handleRemoveQuestion = (idx) => {
    const updated = questionsAsked.filter((_, i) => i !== idx);
    setQuestionsAsked(updated.length > 0 ? updated : ['']);
  };

  const handleQuestionChange = (val, idx) => {
    const updated = [...questionsAsked];
    updated[idx] = val;
    setQuestionsAsked(updated);
  };

  // Rounds Handlers
  const handleAddRound = () => {
    setInterviewRounds([...interviewRounds, { roundName: '', description: '', difficulty: 'Medium' }]);
  };

  const handleRemoveRound = (idx) => {
    const updated = interviewRounds.filter((_, i) => i !== idx);
    setInterviewRounds(updated.length > 0 ? updated : [{ roundName: '', description: '', difficulty: 'Medium' }]);
  };

  const handleRoundChange = (field, val, idx) => {
    const updated = [...interviewRounds];
    updated[idx] = {
      ...updated[idx],
      [field]: val
    };
    setInterviewRounds(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validations
    if (!companyName.trim()) {
      triggerNotification('Company name is required', 'error');
      return;
    }
    if (!roleApplied.trim()) {
      triggerNotification('Role applied is required', 'error');
      return;
    }

    const filteredQuestions = questionsAsked.map(q => q.trim()).filter(q => q.length > 0);
    if (filteredQuestions.length === 0) {
      triggerNotification('Please add at least one interview question.', 'error');
      return;
    }

    const filteredRounds = interviewRounds.filter(r => r.roundName.trim().length > 0);

    const payload = {
      companyName: companyName.trim(),
      roleApplied: roleApplied.trim(),
      experienceLevel,
      difficulty,
      resultStatus,
      tipsResources: tipsResources.trim(),
      tags: tags.split(',').map(t => t.trim()).filter(t => t.length > 0),
      questionsAsked: filteredQuestions,
      interviewRounds: filteredRounds
    };

    try {
      setSubmitting(true);
      if (isEditMode) {
        await api.put(`/experiences/${id}`, payload);
        triggerNotification('Interview experience updated successfully!', 'success');
        navigate(`/experiences/${id}`);
      } else {
        const res = await api.post('/experiences', payload);
        triggerNotification('Interview experience shared successfully!', 'success');
        navigate(`/experiences/${res.data._id}`);
      }
    } catch (err) {
      triggerNotification(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="container animate-fade-in" style={{ padding: '12px 0', maxWidth: '800px' }}>
      
      {/* Back Header */}
      <div style={{ marginBottom: '24px' }}>
        <Link to={isEditMode ? `/experiences/${id}` : '/experiences'} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--text-sub)', fontWeight: 600 }}>
          <ArrowLeft size={16} />
          <span>Cancel</span>
        </Link>
      </div>

      <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '8px' }}>
        {isEditMode ? 'Edit Interview Log' : 'Share Interview Experience'}
      </h1>
      <p style={{ color: 'var(--text-sub)', fontSize: '15px', marginBottom: '32px' }}>
        Help other students prepare by sharing your interview process, rounds, questions asked, and prep strategies.
      </p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Core details card */}
        <div className="glass-card" style={{ padding: '28px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px' }}>General Details</h3>
          
          <div className="grid grid-cols-2" style={{ gap: '16px' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="compName">Company Name *</label>
              <input 
                type="text" 
                id="compName"
                className="form-control"
                placeholder="e.g. Google"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="roleName">Role Applied *</label>
              <input 
                type="text" 
                id="roleName"
                className="form-control"
                placeholder="e.g. Software Engineer-1"
                value={roleApplied}
                onChange={(e) => setRoleApplied(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3" style={{ gap: '16px' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="expLevel">Experience Level</label>
              <select 
                id="expLevel"
                className="form-control"
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
              >
                <option value="Intern">Intern</option>
                <option value="Entry-Level">Entry-Level</option>
                <option value="Mid-Level">Mid-Level</option>
                <option value="Senior-Level">Senior-Level</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="diff">Difficulty Level</label>
              <select 
                id="diff"
                className="form-control"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="result">Result Status</label>
              <select 
                id="result"
                className="form-control"
                value={resultStatus}
                onChange={(e) => setResultStatus(e.target.value)}
              >
                <option value="Selected">Selected</option>
                <option value="Rejected">Rejected</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" htmlFor="tagsInput">Tags (comma separated)</label>
            <input 
              type="text" 
              id="tagsInput"
              className="form-control"
              placeholder="e.g. Graph, Frontend, React, Leetcode-Medium"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>Comma separated values, help categorize logs.</span>
          </div>
        </div>

        {/* Questions Asked card */}
        <div className="glass-card" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <HelpCircle size={18} style={{ color: 'var(--primary)' }} />
              <span>Questions Asked *</span>
            </h3>
            <button type="button" onClick={handleAddQuestion} className="btn btn-accent" style={{ padding: '6px 12px', fontSize: '13px' }}>
              <Plus size={14} />
              <span>Add Question</span>
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {questionsAsked.map((question, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)', minWidth: '24px' }}>Q{idx + 1}.</span>
                <input 
                  type="text" 
                  className="form-control"
                  placeholder="e.g. Implement a custom debounce function in vanilla JS."
                  value={question}
                  onChange={(e) => handleQuestionChange(e.target.value, idx)}
                  required
                />
                <button 
                  type="button" 
                  onClick={() => handleRemoveQuestion(idx)} 
                  style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer', display: 'flex', padding: '6px' }}
                >
                  <Trash size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Interview Rounds card */}
        <div className="glass-card" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Layers size={18} style={{ color: 'var(--secondary)' }} />
              <span>Interview Rounds Timeline</span>
            </h3>
            <button type="button" onClick={handleAddRound} className="btn btn-accent" style={{ padding: '6px 12px', fontSize: '13px' }}>
              <Plus size={14} />
              <span>Add Round</span>
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {interviewRounds.map((round, idx) => (
              <div key={idx} style={{ background: 'rgba(255, 255, 255, 0.01)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '16px', position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--primary)' }}>Round #{idx + 1}</span>
                  
                  <button 
                    type="button" 
                    onClick={() => handleRemoveRound(idx)} 
                    style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer', display: 'flex', padding: '4px' }}
                  >
                    <Trash size={14} />
                  </button>
                </div>

                <div className="grid grid-cols-2" style={{ gap: '16px', marginBottom: '16px' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontSize: '12px' }}>Round Name *</label>
                    <input 
                      type="text" 
                      className="form-control"
                      placeholder="e.g. Technical Coding Round"
                      value={round.roundName}
                      onChange={(e) => handleRoundChange('roundName', e.target.value, idx)}
                      required
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontSize: '12px' }}>Difficulty</label>
                    <select 
                      className="form-control"
                      value={round.difficulty}
                      onChange={(e) => handleRoundChange('difficulty', e.target.value, idx)}
                    >
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '12px' }}>Description &amp; Key Focus Topics</label>
                  <textarea 
                    className="form-control"
                    rows="2"
                    placeholder="Describe what they evaluated, focus topics, interview environment..."
                    value={round.description}
                    onChange={(e) => handleRoundChange('description', e.target.value, idx)}
                    style={{ resize: 'vertical' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tips and resources */}
        <div className="glass-card" style={{ padding: '28px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px' }}>Tips &amp; Preparation Resources</h3>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <textarea 
              className="form-control"
              rows="4"
              placeholder="What topics should applicants study? Share links, resources, video recommendations, or cheat sheets."
              value={tipsResources}
              onChange={(e) => setTipsResources(e.target.value)}
              style={{ resize: 'vertical' }}
            />
          </div>
        </div>

        {/* Submit */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
          <Link to={isEditMode ? `/experiences/${id}` : '/experiences'} className="btn btn-secondary">
            Cancel
          </Link>
          <button type="submit" className="btn btn-primary" style={{ padding: '12px 24px' }} disabled={submitting}>
            <Save size={18} />
            <span>{submitting ? 'Saving...' : 'Save Experience Log'}</span>
          </button>
        </div>

      </form>
    </div>
  );
};

export default CreateExperience;
