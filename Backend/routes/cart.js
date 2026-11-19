import express from 'express'
import { addToCart, removeItem,updateQuanttity,getCart } from '../controllers/cartController.js'

const router = express.Router();


router.post('/add',addToCart);

router.post('/remove',removeItem);

router.post('/update', updateQuanttity);

router.get('/:userid', getCart);

export default router