const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favoriteController');
const { protect } = require('../middlewares/auth');

router.route("/me").get(protect, favoriteController.myFavoriteMovies);
router.route('/').post(protect, favoriteController.addFavoriteMovie).get(favoriteController.myFavoriteMovies);
router.route('/:id').delete(protect, favoriteController.deleteFavoriteMovie).get(favoriteController.getFavoriteMovie);

module.exports = router;