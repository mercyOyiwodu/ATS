const { createJob, getJobs, getJobById, editJob, deleteJob, searchJobs } = require('../controller/job');
const { protect, isEmployer } = require('../middleware/authentication');

const router = require('express').Router()

router.post("/createJob", protect, isEmployer, createJob);
router.get("/getJobs", getJobs);    
router.get("/getJob/:id", getJobById);
router.put('/editJob/:id', protect, isEmployer, editJob);
router.delete('/deleteJob/:id', protect, isEmployer, deleteJob);
router.get('/searchJobs', searchJobs);

module.exports = router;
