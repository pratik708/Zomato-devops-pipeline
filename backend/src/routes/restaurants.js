const express=require('express');
const router=express.Router();
const {Restaurant,MenuItem}=require('../models');

router.get('/', async(req, res) => {
  try {
    console.log('📥 GET /api/restaurants');
    const restaurants = await Restaurant.findAll({include: MenuItem});
    console.log(`✅ Found ${restaurants.length} restaurants`);
    res.json(restaurants);
  } catch(err) {
    console.error('❌ Error fetching restaurants:', err);
    res.status(500).json({error: 'Failed to fetch restaurants', details: err.message});
  }
});

router.get('/:id', async(req, res) => {
  try {
    const r = await Restaurant.findByPk(req.params.id, {include: MenuItem});
    if(!r) return res.status(404).json({error: 'Not found'});
    res.json(r);
  } catch(err) {
    console.error('❌ Error fetching restaurant:', err);
    res.status(500).json({error: 'Failed to fetch restaurant', details: err.message});
  }
});

module.exports=router;