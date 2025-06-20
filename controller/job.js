const Job = require('../model/job');    
const User = require('../model/user');


const createJob = async (req, res) => {
    try {
        const { title, description, company, location, salary } = req.body;
        const userExists = await User.findOne({email: email.toLowerCase()})
        if (!userExists) {
            return res.status(404).json({
                message: "User not found",
            });
        }
        if(userExists){
            return res.status(400).json({
                message: 'user already exists'
            })
        }
        const job = new Job({
            title,
            description,
            company,
            location,
            salary,
            postedBy: userExists._id
        });
        await job.save();
        res.status(201).json({
            message: "Job created successfully",
            job
        }); 
    } catch (error) {
       res.status(500).json({
        message: "Internal Server Error",
       })
    }
};

const getJobs = async (req, res) => {
    try {
        const jobs = await Job.find().populate('postedBy', 'name email');
        res.status(200).json({
            message: "Jobs fetched successfully",
            jobs
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
}

const getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id).populate('postedBy', 'name email');
        if (!job) {
            return res.status(404).json({
                message: "Job not found"
            });
        }
        res.status(200).json({
            message: "Job fetched successfully",
            job
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
};  

const editJob = async (req, res) => {
    try {
        const { title, description, company, location, salary } = req.body;
        const job = await Job.findById(req.params.id);
        if (!job) {
            return res.status(404).json({
                message: "Job not found"
            });
        }
        job.title = title || job.title;
        job.description= description || job.description;
        job.company = company || job.company
        job.location = location || job.location;
        job.salary = salary || job.salary;
        await job.save();
        res.status(200).json({
            message: "Job updated successfully",
            job
        });
    } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        })
    }
}

const deleteJob = async (req, res) => {
    try {
        const job = await Job.findByIdAndDelete(req.params.id);
        if (!job) {
            return res.status(404).json({
                message: "Job not found"
            });
        }
        res.status(200).json({
            message: "Job deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }   
}

module.exports = {
    createJob,
    getJobs,
    getJobById,
    editJob,
    deleteJob
};