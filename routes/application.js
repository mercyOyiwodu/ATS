const router= require('express').Router()

const { apply } = require('../controller/application');
const { protect } = require('../middleware/authentication');
const { uploadApplicationFiles } = require('../utils/multer');

router.post('/apply/:jobId',uploadApplicationFiles,protect, apply);

module.exports = router

