const express = require('express');
const router = express.Router();
const { registerEmployer, loginEmployer } = require('../controller/employer');

router.post('/register-employer', registerEmployer);
router.post('/login-employer', loginEmployer);

module.exports = router;
