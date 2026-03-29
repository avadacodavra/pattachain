const express = require('express');
const router = express.Router();
const {
  initiateTransfer,
  buyerApprove,
  registrarApprove,
  getTransferByRequestId,
  getApprovalStatus,
} = require('../controllers/transferController');

router.post('/initiate', initiateTransfer);
router.post('/buyer-approve/:requestId', buyerApprove);
router.post('/registrar-approve/:requestId', registrarApprove);
router.get('/:requestId', getTransferByRequestId);
router.get('/status/:requestId', getApprovalStatus);

module.exports = router;