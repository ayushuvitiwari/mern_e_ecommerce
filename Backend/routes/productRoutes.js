import express from 'express';
import { createProducts, getProducts, updateProducts, deleteProduct} from '../controllers/productControllers.js';


const router = express.Router();