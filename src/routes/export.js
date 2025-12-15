const express = require('express');
const {
  exportAsPDF,
  exportAsMarketingDeck,
  exportAsVideo,
  generateWebLink,
  getExportHistory
} = require('../controllers/export');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

// All export routes require authentication
router.use(protect);
router.use(authorize('user', 'author', 'admin'));

router.post('/:vehicleId/pdf', exportAsPDF);
router.post('/:vehicleId/deck', exportAsMarketingDeck);
router.post('/:vehicleId/video', exportAsVideo);
router.post('/:vehicleId/weblink', generateWebLink);
router.get('/:vehicleId', getExportHistory);

module.exports = router;
