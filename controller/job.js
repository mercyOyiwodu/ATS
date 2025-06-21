const Job = require('../model/job');    
const User = require('../model/user');


const createJob = async (req, res) => {
    try {
        const { title, description, company, location, salary, jobType } = req.body;
        const userId = req.user.id || req.user; // extract user id string
        const userExists = await User.findById(userId);
        if (!userExists) {
            return res.status(404).json({
                message: "User not found",
            });
        }
        // Remove the incorrect check for userExists that returns 400
        const job = new Job({
            title,
            description,
            company,
            location,
            salary,
            jobType,
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
        error:  error.message
       })
    }
};

const getJobs = async (req, res) => {
    try {
        const {
            jobType,
            location,
            minSalary,
            maxSalary,
            page = 1,
            limit = 10,
            sortBy = 'date' // default sort by date
        } = req.query;

        // Build filter object
        const filter = {};
        if (jobType) {
            filter.jobType = jobType;
        }
        if (location) {
            filter.location = { $regex: new RegExp(location, 'i') }; // case-insensitive match
        }
        if (minSalary || maxSalary) {
            filter.salary = {};
            if (minSalary) {
                filter.salary.$gte = Number(minSalary);
            }
            if (maxSalary) {
                filter.salary.$lte = Number(maxSalary);
            }
        }

        // Determine sorting
        let sortOption = {};
        if (sortBy === 'salary') {
            sortOption.salary = -1; // descending salary
        } else if (sortBy === 'date') {
            sortOption.createdAt = -1; // newest first
        }

        // Pagination calculations
        const pageNumber = parseInt(page, 10) || 1;
        const limitNumber = parseInt(limit, 10) || 10;
        const skip = (pageNumber - 1) * limitNumber;

        // Get total count for pagination metadata
        const totalJobs = await Job.countDocuments(filter);

        // Calculate total pages
        const totalPages = Math.ceil(totalJobs / limitNumber);
        const jobs = await Job.find(filter)
            .sort(sortOption)
            .skip(skip)
            .limit(limitNumber)
            .populate('postedBy', 'name email');

        // Return response with metadata
        res.status(200).json({
            message: "Jobs fetched successfully",
            jobs,
            metadata: {
                totalJobs,
                totalPages,
                currentPage: pageNumber
            }
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
const searchJobs = async (req, res) => {
    try {
        const { query } = req.query;
        const jobs = await Job.find({
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } },
                { company: { $regex: query, $options: 'i' } }
            ]
        });
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
module.exports = {
    createJob,
    getJobs,
    getJobById,
    editJob,
    deleteJob,
    searchJobs
};