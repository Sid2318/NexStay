const express = require('express');
const router = express.Router();

const hostController = require('../controllers/hostController');

// Simple role guard middleware
router.use((req, res, next) => {
  if (!req.session || !req.session.user || req.session.user.userType !== 'host') {
    return res.status(403).json({ message: 'Forbidden: host only' });
  }
  next();
});

router.get('/homes', hostController.apiGetHostHomes);
router.post('/homes', hostController.apiPostAddHome);
router.put('/homes/:homeId', hostController.apiPostEditHome);
router.delete('/homes/:homeId', hostController.apiPostDeleteHome);

module.exports = router;


