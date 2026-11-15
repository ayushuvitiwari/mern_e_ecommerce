import express from 'express';
import { createProducts, getProducts, updateProducts, deleteProduct} from '../controllers/productControllers.js';


const router = express.Router();

// Route created new products 

router.post('/add', createProducts);

// Route to get all products 

router.get('/',getProducts);

// Route to updated products by ID

router.put('/update/:id', updateProducts);

//  Route to delete a products by ID

router.delete('/delete/:id', deleteProduct)

export default router;