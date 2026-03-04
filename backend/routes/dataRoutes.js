import express from 'express';
import {
  addExpenseRevenue,
  getMonthlyData,
  getYearlyData,
  getAllMonthlyData,
  getAllYearlyData,
  getDashboardSummary,
  deleteExpenseRevenue,
  updateExpenseRevenue,
  bulkImportCSV,
} from '../controllers/dataController.js';
import { authenticateToken, authorizeUser, authorizeAdmin } from '../middleware/auth.js';

const router = express.Router();

router.post('/add', authenticateToken, authorizeUser, addExpenseRevenue);
router.put('/:id', authenticateToken, authorizeUser, updateExpenseRevenue);
router.delete('/:id', authenticateToken, authorizeUser, deleteExpenseRevenue);
router.post('/bulk-import', authenticateToken, authorizeUser, bulkImportCSV);
router.get('/monthly', authenticateToken, authorizeUser, getMonthlyData);
router.get('/yearly', authenticateToken, authorizeUser, getYearlyData);
router.get('/all-monthly', authenticateToken, authorizeAdmin, getAllMonthlyData);
router.get('/all-yearly', authenticateToken, authorizeAdmin, getAllYearlyData);
router.get('/summary', authenticateToken, getDashboardSummary);

export default router;
