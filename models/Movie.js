const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
    },
    image: {
        type: String,
        required: [true, 'Image is required'],
    },
    durationMin: {
        type: Number,
        required: [true, 'Rating is required'],
    },
    publishedYear: {
        type: Number,
        required: [true, 'Published year is required'],
    },
    type: {
        type: String,
        required: [true, 'Genre is required'],
    },
    trending: {
        type: Boolean,
        default: false,
    }

}, { timestamps: true });

module.exports = mongoose.model('Movie', movieSchema);