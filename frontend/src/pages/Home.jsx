import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

// Food categories with images (using emojis as placeholders)
const FOOD_CATEGORIES = [
  { name: 'Biryani', emoji: '🍛', color: '#fef3c7' },
  { name: 'Pizza', emoji: '🍕', color: '#fee2e2' },
  { name: 'Burger', emoji: '🍔', color: '#fef3c7' },
  { name: 'Chinese', emoji: '🥡', color: '#dbeafe' },
  { name: 'Pasta', emoji: '🍝', color: '#fce7f3' },
  { name: 'Noodles', emoji: '🍜', color: '#e0e7ff' },
  { name: 'Rolls', emoji: '🌯', color: '#d1fae5' },
  { name: 'Desserts', emoji: '🍰', color: '#fce7f3' },
];

export default function Home() {
  const [restaurants, setRestaurants] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    setLoading(true);
    api.get('/api/restaurants')
      .then(res => {
        console.log('✅ Restaurants loaded:', res.data.length);
        setRestaurants(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('❌ Failed to fetch restaurants:', err.message);
        if(err.response) {
          console.error('Response status:', err.response.status);
          console.error('Response data:', err.response.data);
        }
        setLoading(false);
      });
  }, []);

  // Filter restaurants by search or category
  const filtered = restaurants.filter(r => {
    const matchesSearch = r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.cuisine.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !selectedCategory || 
      r.cuisine.toLowerCase().includes(selectedCategory.toLowerCase()) ||
      r.name.toLowerCase().includes(selectedCategory.toLowerCase());
    return matchesSearch && matchesCategory;
  });

  // Get random discount text
  const getDiscount = (index) => {
    const discounts = ['₹150 OFF ABOVE ₹299', 'ITEMS AT ₹99', 'FREE DELIVERY', '20% OFF', 'ITEMS AT ₹149'];
    return discounts[index % discounts.length];
  };

  // Get delivery time
  const getDeliveryTime = (rating) => {
    const base = Math.round(20 + (5 - rating) * 5);
    return `${base}-${base + 10} mins`;
  };

  const handleCategoryClick = (categoryName) => {
    if (selectedCategory === categoryName) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(categoryName);
      setSearch('');
    }
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="home-container">
        <div className="categories-section">
          <h2 className="section-title">What's on your mind?</h2>
          <div className="categories-scroll">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="category-item">
                <div className="category-icon skeleton"></div>
                <div className="skeleton" style={{ width: '60px', height: '14px', marginTop: '8px' }}></div>
              </div>
            ))}
          </div>
        </div>
        <div className="restaurants-section">
          <h2 className="section-title">Top restaurant chains</h2>
          <div className="restaurants-scroll">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="restaurant-card-horizontal skeleton-card">
                <div className="skeleton" style={{ width: '100%', height: '180px', borderRadius: '16px' }}></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="home-container">
      {/* Search Bar */}
      <div className="search-section">
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search for restaurants and food"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setSelectedCategory(null);
            }}
          />
          {search && (
            <button className="search-clear" onClick={() => setSearch('')}>✕</button>
          )}
        </div>
      </div>

      {/* Categories Section */}
      <div className="categories-section">
        <div className="section-header">
          <h2 className="section-title">What's on your mind?</h2>
          <div className="scroll-arrows">
            <button className="scroll-arrow">←</button>
            <button className="scroll-arrow">→</button>
          </div>
        </div>
        <div className="categories-scroll">
          {FOOD_CATEGORIES.map((cat, index) => (
            <button
              key={cat.name}
              className={`category-item ${selectedCategory === cat.name ? 'active' : ''}`}
              onClick={() => handleCategoryClick(cat.name)}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="category-icon" style={{ background: cat.color }}>
                <span>{cat.emoji}</span>
              </div>
              <span className="category-name">{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="section-divider"></div>

      {/* Top Restaurant Chains */}
      <div className="restaurants-section">
        <div className="section-header">
          <h2 className="section-title">
            {selectedCategory ? `${selectedCategory} Restaurants` : 'Top restaurant chains'}
          </h2>
          {selectedCategory && (
            <button className="clear-filter" onClick={() => setSelectedCategory(null)}>
              Clear filter ✕
            </button>
          )}
        </div>
        
        <div className="restaurants-scroll">
          {filtered.length > 0 ? (
            filtered.map((restaurant, index) => (
              <Link
                to={`/r/${restaurant.id}`}
                key={restaurant.id}
                className="restaurant-card-horizontal"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="card-image-wrapper">
                  <div className="card-image" style={{
                    background: `linear-gradient(135deg, ${
                      ['#ff6b6b', '#ffa502', '#ff6348', '#5f27cd', '#00d2d3', '#ff9ff3'][index % 6]
                    } 0%, ${
                      ['#ffa502', '#ff6348', '#5f27cd', '#00d2d3', '#ff9ff3', '#ff6b6b'][index % 6]
                    } 100%)`
                  }}>
                    <span className="card-emoji">
                      {['🍛', '🍕', '🍜', '🍔', '🌮', '🍣', '🥘', '🍝'][index % 8]}
                    </span>
                  </div>
                  <div className="discount-badge">{getDiscount(index)}</div>
                </div>
                
                <div className="card-content">
                  <h3 className="card-title">{restaurant.name}</h3>
                  <div className="card-rating">
                    <span className="rating-badge">★ {restaurant.rating}</span>
                    <span className="delivery-time">{getDeliveryTime(restaurant.rating)}</span>
                  </div>
                  <p className="card-cuisine">{restaurant.cuisine}</p>
                  <p className="card-location">{restaurant.location}</p>
                </div>
              </Link>
            ))
          ) : (
            <div className="no-results">
              <span className="no-results-emoji">🔍</span>
              <p>No restaurants found</p>
              <button onClick={() => { setSearch(''); setSelectedCategory(null); }}>
                Show all restaurants
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="section-divider"></div>

      {/* All Restaurants Grid */}
      <div className="all-restaurants-section">
        <div className="section-header">
          <h2 className="section-title">Restaurants with online food delivery</h2>
          <div className="sort-filter">
            <span>Sort By</span>
            <span className="sort-icon">▼</span>
          </div>
        </div>

        <div className="filter-chips">
          <button className="filter-chip active">Relevance</button>
          <button className="filter-chip">Delivery Time</button>
          <button className="filter-chip">Rating</button>
          <button className="filter-chip">Cost: Low to High</button>
        </div>

        <div className="restaurants-grid-new">
          {filtered.map((restaurant, index) => (
            <Link
              to={`/r/${restaurant.id}`}
              key={restaurant.id}
              className="restaurant-card-new"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="card-image-new" style={{
                background: `linear-gradient(135deg, ${
                  ['#ff6b6b', '#ffa502', '#ff6348', '#5f27cd', '#00d2d3', '#ff9ff3', '#1dd1a1', '#feca57'][index % 8]
                } 0%, ${
                  ['#ffa502', '#ff6348', '#5f27cd', '#00d2d3', '#ff9ff3', '#ff6b6b', '#feca57', '#1dd1a1'][index % 8]
                } 100%)`
              }}>
                <span className="card-emoji-new">
                  {['🍛', '🍕', '🍜', '🍔', '🌮', '🍣', '🥘', '🍝', '🍰'][index % 9]}
                </span>
                <div className="discount-badge-new">{getDiscount(index)}</div>
              </div>
              
              <div className="card-info-new">
                <h3>{restaurant.name}</h3>
                <div className="rating-row">
                  <span className="rating-circle">★ {restaurant.rating}</span>
                  <span className="dot">•</span>
                  <span>{getDeliveryTime(restaurant.rating)}</span>
                </div>
                <p className="cuisine-location">{restaurant.cuisine}</p>
                <p className="cuisine-location">{restaurant.location}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
