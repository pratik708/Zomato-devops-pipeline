require('dotenv').config();
const express=require('express');
const bodyParser=require('body-parser');
const cors=require('cors');
const {sequelize,Restaurant,MenuItem}=require('./models');
const restaurantData=require('./data/restaurants.json');

const app=express();

// CORS configuration
app.use(cors({
  origin: ['https://foodhub.sbs', 'http://localhost:3000', 'http://localhost:4000', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.json());
app.use('/api/auth',require('./routes/auth'));
app.use('/api/restaurants',require('./routes/restaurants'));
app.use('/api/search',require('./routes/search'));
app.use('/api/offers',require('./routes/offers'));
app.use('/api/help',require('./routes/help'));
app.use('/api/orders',require('./routes/orders'));
app.use('/api/chat',require('./routes/chat'));
app.get('/healthz',(req,res)=>res.json({status:'ok'}));

async function init(){
  try {
    await sequelize.sync({alter:true});
    const restaurantCount = await Restaurant.count();
    console.log(`📊 Existing restaurants: ${restaurantCount}`);
    
    if(restaurantCount === 0){
      // Seed from JSON file
      console.log('🌱 Seeding restaurants...');
      for(const restaurantInfo of restaurantData.restaurants){
        const restaurant = await Restaurant.create({
          name: restaurantInfo.name,
          cuisine: restaurantInfo.cuisine,
          rating: restaurantInfo.rating,
          location: restaurantInfo.location,
          image: restaurantInfo.image,
          deliveryTime: restaurantInfo.deliveryTime
        });
        
        // Create menu items for this restaurant
        const menuItems = restaurantInfo.menu.map(item => ({
          name: item.name,
          price: item.price,
          description: item.description,
          image: item.image,
          category: item.category,
          isVeg: item.isVeg !== undefined ? item.isVeg : true,
          isBestseller: item.isBestseller || false,
          RestaurantId: restaurant.id
        }));
        
        await MenuItem.bulkCreate(menuItems);
      }
      console.log(`✅ Seeded ${restaurantData.restaurants.length} restaurants with menus`);
    }
  } catch(err) {
    console.error('❌ Database initialization error:', err);
    throw err;
  }
}

init()
  .then(() => {
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`📝 Database: ${process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/zomato'}`);
    });
  })
  .catch(err => {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  });