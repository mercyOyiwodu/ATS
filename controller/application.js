const fs = require('fs');
const Application = require('../model/application');
const Job = require('../model/job');
const Employer =require('../model/employer');

const application = async (req, res) => {
  try {
    const { jobId } = req.params;
    const userId = req.user.id || req.user._id || null;

    if (!userId) {
      cleanupFiles(req);
      return res.status(400).json({ message: "Invalid user ID" });
    }

    if (!req.files || !req.files.resume || !req.files.coverLetter) {
      cleanupFiles(req);
      return res.status(400).json({
        message: "Resume and Cover Letter files are required"
      });
    }

    const resumePath = req.files.resume[0].path;
    const coverLetterPath = req.files.coverLetter[0].path;

    const job = await Job.findById(jobId);
    if (!job) {
      cleanupFiles(req);
      return res.status(404).json({ message: "Job not found" });
    }

    const existingApplication = await Application.findOne({ jobId, userId });
    if (existingApplication) {
      cleanupFiles(req);
      return res.status(409).json({
        message: "You have already applied to this job"
      });
    }

    const application = new Application({
      jobId,
      userId,
      resumePath: resumePath,          
      coverLetterPath: coverLetterPath 
    });

    await application.save();
    
    console.log('Saved application:', {
      _id: application._id,
      resumePath: application.resumePath,
      coverLetterPath: application.coverLetterPath
    });

    res.status(201).json({
      message: "Application created successfully",
      data: application
    });
  } catch (error) {
    cleanupFiles(req);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message
    });
  }
};

const getApplicationWithJobId = async (req, res) => {
  try {
    const { jobId } = req.params;
    const employerId = req.user.id;
    
    const employerExists = await Employer.findById(employerId);
    if (!employerExists) {
      return res.status(404).json({ message: "Employer not found" });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });    
    }

    const applications = await Application.find({ jobId })
      .select('resumePath coverLetterPath status userId jobId submittedAt')
      .populate('jobId', 'title company')
      .populate('userId', 'name email') // Added user details
      .lean();

    if (!applications.length) {
      return res.status(404).json({ message: "No applications found" });
    }

    res.status(200).json({
      message: "Applications retrieved successfully",
      data: applications.map(app => ({
        ...app,
        resumePath: app.resumePath || null, 
        coverLetterPath: app.coverLetterPath || null
      }))
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message
    });
  }
};

const myApplication = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id || null;
    if (!userId) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const applications = await Application.find({ userId })
      .select('resumePath coverLetterPath status jobId submittedAt')
      .populate('jobId', 'title company')
      .exec();

    if (!applications.length) {
      return res.status(404).json({ message: "No applications found" });
    }

    res.status(200).json({
      message: "Applications retrieved successfully",
      data: applications
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message
    });
  }
};

// Helper function for cleaning up uploaded files
function cleanupFiles(req) {
  if (req.files) {
    if (req.files.resume) {
      req.files.resume.forEach(file => {
        try { fs.unlinkSync(file.path); } catch (e) {}
      });
    }
    if (req.files.coverLetter) {
      req.files.coverLetter.forEach(file => {
        try { fs.unlinkSync(file.path); } catch (e) {}
      });
    }
  }
}

module.exports = { 
  application,
  getApplicationWithJobId,
  myApplication
};