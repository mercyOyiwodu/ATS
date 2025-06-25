const fs = require('fs');
const Application = require('../model/application');
const Job = require('../model/job');

const application= async (req, res) => {
  try {
    const { jobId } = req.params;

    const userId = req.user.id || req.user._id || null;
    if (!userId) {
      if (req.files) {
        if (req.files.resume) {
          req.files.resume.forEach(file => fs.unlinkSync(file.path));
        }
        if (req.files.coverLetter) {
          req.files.coverLetter.forEach(file => fs.unlinkSync(file.path));
        }
      }
      return res.status(400).json({ message: "Invalid user ID" });
    }

    if (!req.files || !req.files.resume || !req.files.coverLetter) {
      if (req.files) {
        if (req.files.resume) {
          req.files.resume.forEach(file => fs.unlinkSync(file.path));
        }
        if (req.files.coverLetter) {
          req.files.coverLetter.forEach(file => fs.unlinkSync(file.path));
        }
      }
      return res.status(400).json({
        message: "Resume and Cover Letter files are required"
      });
    }

    const resumePath = req.files.resume[0].path;
    const coverLetterPath = req.files.coverLetter[0].path;

    const job = await Job.findById(jobId);
    if (!job) {
      if (req.files) {
        if (req.files.resume) {
          req.files.resume.forEach(file => fs.unlinkSync(file.path));
        }
        if (req.files.coverLetter) {
          req.files.coverLetter.forEach(file => fs.unlinkSync(file.path));
        }
      }
      return res.status(404).json({
        message: "Job not found"
      });
    }
    const existingApplication = await Application.findOne({ jobId, userId });
    if (existingApplication) {
      if (req.files) {
        if (req.files.resume) {
          req.files.resume.forEach(file => fs.unlinkSync(file.path));
        }
        if (req.files.coverLetter) {
          req.files.coverLetter.forEach(file => fs.unlinkSync(file.path));
        }
      }
      return res.status(409).json({
        message: "You have already applied to this job"
      });
    }

    const application = new Application({
      jobId,
      userId,
      resume: resumePath,
      coverLetter: coverLetterPath
    });
    await application.save();
    res.status(201).json({
      message: "Application created successfully",
      data: application
    });
  } catch (error) {
    if (req.files) {
      if (req.files.resume) {
        req.files.resume.forEach(file => fs.unlinkSync(file.path));
      }
      if (req.files.coverLetter) {
        req.files.coverLetter.forEach(file => fs.unlinkSync(file.path));
      }
    }
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message
    });
  }
};

const getApplicationWithJobId= async (req, res) => {
  try {
    const { jobId } = req.params;
    const userId = req.user.id || req.user._id || null;
    if (!userId) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    const job =await Job.findById(jobId);
    
    if (!job){
      return res.status(404).json({ message: "Job not found" });    
    }

    const applications = await Application.find({ jobId })
      .select('resume coverLetter status userId jobId submittedAt')
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
}   

const myApplication = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id || null;
    if (!userId) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const applications = await Application.find({ userId })
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

module.exports = { 
  application,
  getApplicationWithJobId,
  myApplication
 };
