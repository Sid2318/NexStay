//External Module
const express = require('express');
const router = express.Router();

//Local Modules
const authController = require('../controllers/authController');

router.post('/login', authController.postLoginApi);
router.post('/logout', authController.postLogoutApi);
router.post('/signup', authController.validateSignup, authController.postSignupApi);
router.get('/me', (req, res) => {
  if (!req.session || !req.session.user) {
    return res.json({ isLoggedIn: false, user: null });
  }
  res.json({ isLoggedIn: true, user: req.session.user });
});

module.exports = router;


