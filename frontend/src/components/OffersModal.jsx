import React, { useState, useEffect } from 'react';
import { API_BASE } from '../api';
import { currentUser } from '../auth';

export default function OffersModal({ isOpen, onClose }) {
  const [offers, setOffers] = useState([]);
  const [applied, setApplied] = useState(null);
  const [loading, setLoading] = useState(false);
  const user = currentUser();

  useEffect(() => {
    if (isOpen) {
      fetchOffers();
    }
  }, [isOpen]);

  const fetchOffers = async () => {
    setLoading(true);
    try {
      const endpoint = user ? '/api/offers/personalized' : '/api/offers';
      const opts = user ? { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } } : {};
      const res = await fetch(API_BASE + endpoint, opts);
      const data = await res.json();
      setOffers(data.offers || data.personalized || []);
    } catch (e) {
      console.error('Offers failed', e);
    }
    setLoading(false);
  };

  const applyOffer = (offer) => {
    setApplied(offer);
    setTimeout(() => {
      setApplied(null);
    }, 3000);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-lg" onClick={e=>e.stopPropagation()}>
        <div className="modal-header">
          <h2>🏷️ Available Offers</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          {!user && (
            <div className="info-banner">
              📱 Sign in to unlock personalized offers & auto-apply savings!
            </div>
          )}

          {loading ? (
            <div className="loading">Loading offers...</div>
          ) : offers.length > 0 ? (
            <div className="offers-grid">
              {offers.map(o=>(
                <div key={o.id} className="offer-card">
                  <div className="offer-badge">{o.type.toUpperCase()}</div>
                  <h4>{o.discount}% OFF</h4>
                  <p className="offer-desc">{o.desc}</p>
                  <div className="offer-details">
                    <span className="code">Code: <strong>{o.code}</strong></span>
                    <span className="min">Min ₹{o.minOrder}</span>
                  </div>
                  <div className="offer-features">
                    <small>💰 Save up to ₹{o.maxDiscount}</small>
                  </div>
                  <button className="btn btn-primary" onClick={()=>applyOffer(o)}>
                    Copy Code
                  </button>
                  {applied?.id === o.id && <div className="copy-success">✓ Copied!</div>}
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>😢 No offers available</p>
              <small>Check back soon for new deals!</small>
            </div>
          )}

          <div className="offers-info">
            <h5>ℹ️ How Offers Work</h5>
            <ul>
              <li><strong>First Order:</strong> New users get 50% off</li>
              <li><strong>Bank Offers:</strong> Extra discounts with partner banks</li>
              <li><strong>Restaurant Specials:</strong> Exclusive deals from restaurants</li>
              <li><strong>Seasonal:</strong> Limited-time promotions</li>
            </ul>
            <p className="micro-copy">💡 Pro tip: Use multiple offers at checkout if available. Maximum savings applied automatically.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
