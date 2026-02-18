const FavoriteMovie = require('../models/FavoriteMovie');
const asyncHandler = require('../utils/asyncHandler');

const addFavoriteMovie = asyncHandler(async (req, res) => {
    const { movieId } = req.body;
    const favoriteMovie = await FavoriteMovie.create({ user: req.user._id, movie: movieId });
    res.status(201).json({ success: true, data: favoriteMovie });
});

const getFavoriteMovie = asyncHandler(async (req, res) => {
    const favoriteMovie = await FavoriteMovie.findById(req.params.id);
    if (!favoriteMovie) {
        const err = new Error('Favorite movie not found');
        err.statusCode = 404;
        throw err;
    }

    res.status(200).json({ success: true, data: favoriteMovie });
});

const myFavoriteMovies = asyncHandler(async (req, res) => {
    const favoriteMovies = await FavoriteMovie.find({ user: req.user._id }).populate('movie');
    if (!favoriteMovies) {
        const err = new Error('No favorite movies found');
        err.statusCode = 404;
        throw err;
    }
    res.status(200).json({ success: true, data: favoriteMovies });
});

const deleteFavoriteMovie = asyncHandler(async (req, res) => {
    const favoriteMovie = await FavoriteMovie.findByIdAndDelete(req.params.id);
    if (!favoriteMovie) {
        const err = new Error('Favorite movie not found');
        err.statusCode = 404;
        throw err;
    }
    if (req.user._id !== favoriteMovie.user) {
        const err = new Error('You are not authorized to delete this favorite movie');
        err.statusCode = 403;
        throw err;
    }
    await favoriteMovie.deleteOne();
    res.status(200).json({ success: true, data: {} });
});




module.exports = { addFavoriteMovie, getFavoriteMovie, deleteFavoriteMovie, myFavoriteMovies };