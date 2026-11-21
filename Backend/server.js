import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoute from './routes/authRoutes.js';
import productsRoutes from './routes/productRoutes.js'
import cartRoutes from './routes/cart.js'
import orderRoutes from './routes/order.js'

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth' , authRoute);
app.use('/api/products', productsRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/order', orderRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

connectDB();

app.listen(3000, () => {
  console.log('Server is running on port 3000');
})