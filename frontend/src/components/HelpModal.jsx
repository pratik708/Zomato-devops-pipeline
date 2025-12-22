import React, { useState } from 'react';
import { API_BASE } from '../api';
import { currentUser } from '../auth';

export default function HelpModal({ isOpen, onClose }) {
  const [step, setStep] = useState(0);
  const [category, setCategory] = useState(null);
  const [issue, setIssue] = useState(null);
  const [solution, setSolution] = useState(null);
  const [topics, setTopics] = useState([]);
  const [issues, setIssues] = useState([]);
  const [escalating, setEscalating] = useState(false);
  const [description, setDescription] = useState('');
  const user = currentUser();

  const categories = {
    order: { icon: '📦', label: 'Order Issues' },
    payment: { icon: '💳', label: 'Payment Help' },
    delivery: { icon: '🚗', label: 'Delivery Issues' },
    account: { icon: '👤', label: 'Account & Login' }
  };

  const handleSelectCategory = (cat) => {
    setCategory(cat);
    setIssues(categories[cat]?Object.keys(categories[cat]).filter(k=>k!=='icon'&&k!=='label'):[]);
    setStep(1);
  };

  const handleSelectIssue = async (iss) => {
    setIssue(iss);
    try {
      const res = await fetch(`${API_BASE}/help/solution/${category}/${iss}`);
      const data = await res.json();
      setSolution(data.solution);
      setStep(data.escalate?3:2);
    } catch (e) {
      console.error('Solution fetch failed', e);
    }
  };

  const handleEscalate = async () => {
    if (!user) {
      alert('Please sign in to escalate');
      return;
    }
    setEscalating(true);
    try {
      const res = await fetch(`${API_BASE}/help/escalate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ category, issue, description })
      });
      const data = await res.json();
      setStep(4);
    } catch (e) {
      console.error('Escalate failed', e);
    }
    setEscalating(false);
  };

  const resetFlow = () => {
    setStep(0);
    setCategory(null);
    setIssue(null);
    setSolution(null);
    setDescription('');
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-md" onClick={e=>e.stopPropagation()}>
        <div className="modal-header">
          <h2>❓ Help & Support</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          {step === 0 && (
            <>
              <p className="help-intro">What can we help you with?</p>
              <div className="help-categories">
                {Object.entries(categories).map(([key, {icon, label}]) => (
                  <button key={key} className="help-category-btn" onClick={() => handleSelectCategory(key)}>
                    <span className="icon">{icon}</span>
                    <span className="label">{label}</span>
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 1 && category && (
            <>
              <p className="help-intro">What's the issue?</p>
              <div className="help-issues">
                {issues.map(iss => (
                  <button key={iss} className="help-issue-btn" onClick={() => handleSelectIssue(iss)}>
                    {iss}
                  </button>
                ))}
              </div>
              <button className="btn btn-link" onClick={resetFlow}>← Back</button>
            </>
          )}

          {step === 2 && solution && (
            <>
              <div className="solution-container">
                <h4>✓ Solution</h4>
                <p className="solution-text">{solution}</p>
                <div className="solution-actions">
                  <button className="btn btn-secondary" onClick={resetFlow}>Ask another question</button>
                  <button className="btn btn-link" onClick={onClose}>Close</button>
                </div>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className="escalate-form">
                <h4>📞 Escalate to Support</h4>
                <p className="form-help">Our team will contact you within 2 hours</p>
                {user ? (
                  <>
                    <textarea
                      placeholder="Describe your issue in detail..."
                      className="form-textarea"
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      rows={4}
                    />
                    <button className="btn btn-primary" onClick={handleEscalate} disabled={!description}>
                      {escalating ? 'Creating ticket...' : 'Create Support Ticket'}
                    </button>
                  </>
                ) : (
                  <p className="auth-prompt">🔐 Please sign in to escalate</p>
                )}
              </div>
              <button className="btn btn-link" onClick={resetFlow}>← Back</button>
            </>
          )}

          {step === 4 && (
            <div className="success-state">
              <div className="success-icon">✓</div>
              <h4>Support Ticket Created!</h4>
              <p>Reference ID will be sent to your email. Our team will reach out shortly.</p>
              <button className="btn btn-primary" onClick={onClose}>Got it</button>
            </div>
          )}

          <div className="help-footer">
            <p className="micro-copy">📞 Can't wait? Call us 24/7</p>
          </div>
        </div>
      </div>
    </div>
  );
}
