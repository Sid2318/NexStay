const express = require('express');
const router = express.Router();

const storeController = require('../controllers/storeController');
const pdfController = require('../controllers/pdfController');

router.get('/homes', storeController.apiGetHomes);
router.get('/homes/:homeId', storeController.apiGetHomeDetails);
router.get('/homes/:homeId/pdf', pdfController.downloadHomePDF);

router.get('/favourites', storeController.apiGetFavourites);
router.post('/favourites', storeController.apiAddToFavourites);
router.delete('/favourites/:homeId', storeController.apiRemoveFromFavourites);

router.post('/book/:homeId', storeController.apiPostBooking);

module.exports = router;


