import express from 'express'
import {saveAddress, getAddresses} from '../controllers/addressContorller.js'

const route = express.Router()

router.post('/address', saveAddress)
router.get('/:userId', getAddresses)

export default router