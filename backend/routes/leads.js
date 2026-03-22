const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getLeads, getLead, createLead, updateLead, deleteLead, addNote, getAnalytics
} = require('../controllers/leadController');

router.get('/analytics', protect, getAnalytics);
router.route('/').get(protect, getLeads).post(protect, createLead);
router.route('/:id').get(protect, getLead).put(protect, updateLead).delete(protect, deleteLead);
router.post('/:id/notes', protect, addNote);

module.exports = router;
