const mongoose = require('mongoose')

const applicationSchema = new mongoose.Schema({
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    resume: {
        type: String,
    },
    coverLetter: {
        type: String,
    },
    submittedAt: {
        type: Date,
        default: Date.now
    }
})

// Add unique compound index on jobId and userId to prevent duplicate applications
applicationSchema.index({ jobId: 1, userId: 1 }, { unique: true });

const Application = mongoose.model('Application', applicationSchema);

module.exports = Application;
