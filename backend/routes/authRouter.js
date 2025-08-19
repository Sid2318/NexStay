//Core Module
const path = require('path');

//External Module
const express = require('express');
const authRouter = express.Router();

//Local Modules
const authController = require('../controllers/authController');

authRouter.get("/login", authController.getLogin);
authRouter.post("/login", authController.postLogin);
authRouter.post("/logout", authController.postLogout);
authRouter.post("/signup", authController.validateSignup, authController.postSignup);
authRouter.get("/signup", authController.getSignup);

module.exports = authRouter;