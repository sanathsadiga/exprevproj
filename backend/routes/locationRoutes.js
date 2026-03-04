import express from 'express';
import {
  createLocation,
  getLocations,
  deleteLocation,
} from '../controllers/locationController.js';
import { authenticateToken, authorizeAdmin } from '../middleware/auth.js';

const router = express.Router();

router.post('/create', authenticateToken, authorizeAdmin, createLocation);
router.get('/', authenticateToken, getLocations);
router.delete('/:id', authenticateToken, authorizeAdmin, deleteLocation);

export default router;
