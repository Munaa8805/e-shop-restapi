const express = require('express');
const reviewController = require('../controllers/reviewController');

const router = express.Router(
    {
        mergeParams: true
    }
);

router.post('/', reviewController.createReview);
router.get('/', reviewController.getAllReviews);
router.get('/:id', reviewController.getReview);
router.put('/:id', reviewController.updateReview);
router.delete('/:id', reviewController.deleteReview);

module.exports = router;