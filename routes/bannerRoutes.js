const express = require('express');
const bannerController = require('../controllers/bannerController');
const { protect, restrictTo } = require('../middlewares/auth');
const uploadBannerImage = require('../utils/multerBannerConfig');

const router = express.Router();

router.get('/', bannerController.getBanners);
router.get('/:id', bannerController.getBanner);
router.post('/', uploadBannerImage.single('image'), bannerController.createBanner);
router.put('/:id', bannerController.updateBanner);
router.delete('/:id', bannerController.deleteBanner);

module.exports = router;