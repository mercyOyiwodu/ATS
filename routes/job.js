const { createJob, getJobs, getJobById, editJob } = require('../controller/job');

const router = require('express').Router()

router.post("/createJob", createJob);
router.get("/getJobs", getJobs);    
router.get("/getJob/:id",getJobById)
router.put('/editJob/:id', editJob)

module.exports = router;