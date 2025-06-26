const Job = require('../model/job');    
const Employer = require('../model/employer');


const createJob = async (req, res) => {
    try {
        const { title, description, company, location, salary, jobType } = req.body;
        const employerId = req.user.id
        const employerExists = await Employer.findById(employerId);
        if (!employerExists) {
            return res.status(404).json({
                message: "Employer not found",
            });
        }
        const job = new Job({
            title,
            description,
            company,
            location,
            salary,
            jobType,
            postedBy: employerExists._id
        });
        await job.save();
        res.status(201).json({
            message: "Job created successfully",
            data: job
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
            sortBy = 'date'
                } = req.query;

        const filter = {};
        if (jobType) {
            filter.jobType = jobType;
        }
        if (location) {
            filter.location = { $regex: new RegExp(location, 'i') }; 
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

        let sortOption = {};
        if (sortBy === 'salary') {
            sortOption.salary = -1; 
        } else if (sortBy === 'date') {
            sortOption.createdAt = -1; 
        }

        const pageNumber = parseInt(page, 10) || 1;
        const limitNumber = parseInt(limit, 10) || 10;
        const skip = (pageNumber - 1) * limitNumber;

        const totalJobs = await Job.countDocuments(filter);

        const totalPages = Math.ceil(totalJobs / limitNumber);
        const jobs = await Job.find(filter)
            .sort(sortOption)
            .skip(skip)
            .limit(limitNumber)
            .populate('postedBy', 'name email');

        res.status(200).json({
            message: "Jobs fetched successfully",
            data: jobs,
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
            data:job
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
            data:job
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
            data: jobs
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