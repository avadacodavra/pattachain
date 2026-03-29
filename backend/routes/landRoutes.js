const express = require('express');
const router = express.Router();
const {
  registerLand,
  getLandByTokenId,
  getLandByULPIN,
  getLandsByOwner,
  verifyULPIN,
} = require('../controllers/landController');

router.post('/register', registerLand);
router.get('/token/:tokenId', getLandByTokenId);
router.get('/ulpin/:ulpin', getLandByULPIN);
router.get('/owner/:owner', getLandsByOwner);
router.get('/verify/:ulpin', verifyULPIN);

module.exports = router;