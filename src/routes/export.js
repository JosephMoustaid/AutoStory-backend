const express = require('express');
const {
  exportAsPDF,
  exportAsMarketingDeck,
  exportAsVideo,
  generateWebLink,
  getExportHistory,
  generateComparisonReport,
  exportAsMarkdown,
  exportAsJSON,
  downloadFile
} = require('../controllers/export');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

// Public export routes (new enhanced exports)
router.post('/comparison-report', generateComparisonReport);
router.post('/markdown', exportAsMarkdown);
router.post('/json', exportAsJSON);
router.get('/download/:filename', downloadFile);

// Protected export routes (legacy vehicle story exports)
router.use(protect);
router.use(authorize('user', 'author', 'admin'));

router.post('/:vehicleId/pdf', exportAsPDF);
router.post('/:vehicleId/deck', exportAsMarketingDeck);
router.post('/:vehicleId/video', exportAsVideo);
router.post('/:vehicleId/weblink', generateWebLink);
router.get('/:vehicleId', getExportHistory);

module.exports = router;
