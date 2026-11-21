import express from 'express';
import { saveAddress, getAddresses } from '../controllers/addressContorller.js';

const router = express.Router();

router.post('/add', saveAddress);
router.post('/address', saveAddress);
router.get('/:userId', getAddresses);

export default router;
