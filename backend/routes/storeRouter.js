//Core Module
const path = require('path');

//External Module
const express = require('express');
const storeRouter = express.Router();

//Local Modules
const storeController = require('../controllers/storeController');
const pdfController = require('../controllers/pdfController');

storeRouter.get("/homes", storeController.getHome);
storeRouter.get("/", storeController.getIndex);
storeRouter.get("/bookings", storeController.getBookings);
storeRouter.get("/favourites", storeController.getFavouritesList);
storeRouter.get("/book/:homeId", storeController.getBookingPage);
storeRouter.post("/book/:homeId", storeController.postBooking);
storeRouter.post("/add-to-favourites", storeController.addToFavourites);
storeRouter.get("/homes/:homeId", storeController.getHomeDetails);
storeRouter.get("/homes/:homeId/pdf", pdfController.downloadHomePDF);
storeRouter.post("/remove-from-favourites", storeController.removeFromFavourites);

module.exports = storeRouter;