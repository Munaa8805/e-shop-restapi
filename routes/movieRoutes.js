const express = require('express');
const moviesController = require('../controllers/moviesController');
const router = express.Router();



router.route('/trending').get(moviesController.trendingMovies);
router.route('/').post(moviesController.createMovie).get(moviesController.getMovies);
router.route('/:id').get(moviesController.getMovie).put(moviesController.updateMovie).delete(moviesController.deleteMovie);

module.exports = router;