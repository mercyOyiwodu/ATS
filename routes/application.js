const router= require('express').Router()
const { application, getApplicationWithJobId, myApplication } = require('../controller/application');
const { protect } = require('../middleware/authentication');
const { uploadApplicationFiles } = require('../utils/multer');

router.post('/apply/:jobId',uploadApplicationFiles,protect, application);
router.get('/jobs/:jobId/applications',protect, getApplicationWithJobId);
router.get('/my-applications',protect ,myApplication);

module.exports = router

