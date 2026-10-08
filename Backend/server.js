import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoute from './routes/authRoutes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth' , authRoute);

app.get('/', (req, res) => {
  res.send('API is running...');
});

connectDB();

app.listen(3000, () => {
  console.log('Server is running on port 3000');
})