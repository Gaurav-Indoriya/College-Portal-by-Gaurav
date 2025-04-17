const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,  // Fixed 'Required' to 'required'
    },
    email: {
        type: String,
        required: true,  // Fixed 'Required' to 'required'
    },
    phone: {
        type: String,
        required: true,  // Fixed 'Required' to 'required'
    },
    dob: {
        type: String,
        required: true,  // Fixed 'Required' to 'required'
    },
    address: {
        type: String,
        required: true,  // Fixed 'Required' to 'required'
    },
    gender: {
        type: String,
        required: true,  // Fixed 'Required' to 'required'
    },
    education: {
        type: String,
        required: true,  // Fixed 'Required' to 'required'
    },
    course: {
        type: String,
        required: true,  // Fixed 'Required' to 'required'
    },
    user_id: {
        type: String,
        required: true,  // Fixed 'Required' to 'required'
    },
    status: {
        type: String,
        default: "Pending for approval"
    },
    comment: {
        type: String,
        default: "Pending"
    }
}, { timestamps: true }); // The timestamps option automatically adds createdAt and updatedAt fields

const CourseModel = mongoose.model('course', CourseSchema);
module.exports = CourseModel;
