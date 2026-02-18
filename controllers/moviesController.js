const asyncHandler = require('../utils/asyncHandler');
const Movie = require('../models/Movie');

const createMovie = asyncHandler(async (req, res) => {
    const { title, description, image, durationMin, publishedYear, type, trending } = req.body;
    const movie = await Movie.create({ title, description, image, durationMin, publishedYear, type, trending });
    res.status(201).json({ success: true, data: movie });
});

const getMovies = asyncHandler(async (req, res) => {
    const movies = await Movie.find();
    res.status(200).json({ success: true, data: movies });
});
const getMovie = asyncHandler(async (req, res) => {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
        const err = new Error('Movie not found');
        err.statusCode = 404;
        throw err;
    }
    res.status(200).json({ success: true, data: movie });
});


const updateMovie = asyncHandler(async (req, res) => {
    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!movie) {
        const err = new Error('Movie not found');
        err.statusCode = 404;
        throw err;
    }
    res.status(200).json({ success: true, data: movie });
});

const deleteMovie = asyncHandler(async (req, res) => {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) {
        const err = new Error('Movie not found');
        err.statusCode = 404;
        throw err;
    }
    res.status(200).json({ success: true, data: {} });
});

const trendingMovies = asyncHandler(async (req, res) => {
    const trendingMovies = await Movie.find({ trending: true });
    if (!trendingMovies) {
        const err = new Error('No trending movies found');
        err.statusCode = 404;
        throw err;
    }
    res.status(200).json({ success: true, data: trendingMovies });
});


module.exports = { createMovie, getMovies, getMovie, updateMovie, deleteMovie, trendingMovies };