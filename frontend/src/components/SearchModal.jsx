import React, { useState, useEffect } from 'react';
import { API_BASE } from '../api';
import { currentUser } from '../auth';

export default function SearchModal({ isOpen, onClose }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState({cuisines:[],dishes:[],categories:[]});
  const [results, setResults] = useState([]);
  const [filters, setFilters] = useState({category:'',location:'',minRating:'',maxDeliveryTime:''});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchTerm.length > 2) {
      fetchSuggestions();
    } else {
      setSuggestions({cuisines:[],dishes:[],categories:[]});
    }
  }, [searchTerm]);

  const fetchSuggestions = async () => {
    try {
      const res = await fetch(`${API_BASE}/search/suggestions?q=${searchTerm}`);
      const data = await res.json();
      setSuggestions(data.suggestions||{});
    } catch (e) {
      console.error('Suggestions failed', e);
    }
  };

  const performSearch = async () => {
    if (!searchTerm) return;
    setLoading(true);
    try {
      const params = new URLSearchParams({q:searchTerm,...filters}).toString();
      const res = await fetch(`${API_BASE}/search?${params}`);
      const data = await res.json();
      setResults(data.results||[]);
    } catch (e) {
      console.error('Search failed', e);
      setResults([]);
    }
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-lg" onClick={e=>e.stopPropagation()}>
        <div className="modal-header">
          <h2>🔍 Search Restaurants & Dishes</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="search-input-group">
            <input
              type="text"
              placeholder="Search for cuisines, dishes, or restaurants..."
              className="search-input"
              value={searchTerm}
              onChange={e=>setSearchTerm(e.target.value)}
              onKeyPress={e=>e.key==='Enter'&&performSearch()}
              autoFocus
            />
            <button className="btn btn-primary" onClick={performSearch}>{loading?'Searching...':'Search'}</button>
          </div>

          {suggestions.cuisines.length > 0 && (
            <div className="suggestions-section">
              <h4>Popular Cuisines</h4>
              <div className="suggestion-tags">
                {suggestions.cuisines.map(c=>(
                  <button key={c} className="tag" onClick={()=>{setSearchTerm(c);setFilters({...filters,category:c});}}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {suggestions.dishes.length > 0 && (
            <div className="suggestions-section">
              <h4>Trending Dishes</h4>
              <div className="suggestion-tags">
                {suggestions.dishes.map(d=>(
                  <button key={d} className="tag" onClick={()=>setSearchTerm(d)}>
                    {d}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="filters-section">
            <label>💰 Minimum Rating: <input type="number" min="0" max="5" step="0.5" value={filters.minRating} onChange={e=>setFilters({...filters,minRating:e.target.value})} /></label>
            <label>⏱️ Max Delivery Time: <input type="number" min="0" max="60" value={filters.maxDeliveryTime} onChange={e=>setFilters({...filters,maxDeliveryTime:e.target.value})} /></label>
          </div>

          {results.length > 0 && (
            <div className="results-section">
              <h4>Results ({results.length} found)</h4>
              {results.map(r=>(
                <div key={r.id} className="result-item">
                  <img src={r.image} alt={r.name} />
                  <div className="result-info">
                    <h5>{r.name}</h5>
                    <p>{r.cuisine} • ⭐{r.rating}</p>
                    <span className="delivery-badge">{r.deliveryTime} mins</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {searchTerm && results.length === 0 && !loading && (
            <div className="empty-state">
              <p>😕 No restaurants found</p>
              <small>Try different search terms or adjust filters</small>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
