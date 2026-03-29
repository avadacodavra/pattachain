const Transfer = require('../models/Transfer');
const Land = require('../models/Land');
const { getTaxEscrowContract } = require('../utils/web3');
const { ethers } = require('ethers');

// Initiate transfer
const initiateTransfer = async (req, res) => {
  try {
    const { tokenId, buyer, salePrice } = req.body;

    const taxEscrow = getTaxEscrowContract();

    // Calculate tax
    const taxAmount = await taxEscrow.calculateTax(ethers.parseEther(salePrice));

    // Initiate transfer on blockchain
    const tx = await taxEscrow.initiateTransfer(
      tokenId,
      buyer,
      ethers.parseEther(salePrice),
      { value: taxAmount }
    );

    console.log('Transfer initiated:', tx.hash);
    const receipt = await tx.wait();

    // Extract requestId from event
    const event = receipt.logs.find(log => {
      try {
        return taxEscrow.interface.parseLog(log).name === 'TransferRequested';
      } catch (e) {
        return false;
      }
    });

    const parsedEvent = taxEscrow.interface.parseLog(event);
    const requestId = Number(parsedEvent.args.requestId);

    // Get seller from land
    const land = await Land.findOne({ tokenId });

    // Save to database
    const transfer = await Transfer.create({
      requestId,
      tokenId,
      seller: land.owner,
      buyer,
      salePrice: ethers.parseEther(salePrice).toString(),
      taxAmount: taxAmount.toString(),
      sellerApproved: true,
      transactionHash: receipt.hash,
    });

    res.status(201).json({
      success: true,
      message: 'Transfer initiated successfully',
      data: {
        requestId,
        transactionHash: receipt.hash,
        transfer,
      },
    });
  } catch (error) {
    console.error('Initiate Transfer Error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Buyer approve
const buyerApprove = async (req, res) => {
  try {
    const { requestId } = req.params;

    const taxEscrow = getTaxEscrowContract();
    const tx = await taxEscrow.buyerApprove(requestId);
    
    console.log('Buyer approval sent:', tx.hash);
    const receipt = await tx.wait();

    // Update database
    await Transfer.findOneAndUpdate(
      { requestId },
      { buyerApproved: true }
    );

    res.json({
      success: true,
      message: 'Buyer approved successfully',
      transactionHash: receipt.hash,
    });
  } catch (error) {
    console.error('Buyer Approve Error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Registrar approve
const registrarApprove = async (req, res) => {
  try {
    const { requestId } = req.params;

    const taxEscrow = getTaxEscrowContract();
    const tx = await taxEscrow.registrarApprove(requestId);
    
    console.log('Registrar approval sent:', tx.hash);
    const receipt = await tx.wait();

    // Update database
    const transfer = await Transfer.findOneAndUpdate(
      { requestId },
      { registrarApproved: true },
      { new: true }
    );

    // Check if all approved - update land owner
    if (transfer.sellerApproved && transfer.buyerApproved && transfer.registrarApproved) {
      await Land.findOneAndUpdate(
        { tokenId: transfer.tokenId },
        { owner: transfer.buyer }
      );
      
      await Transfer.findOneAndUpdate(
        { requestId },
        { isCompleted: true }
      );
    }

    res.json({
      success: true,
      message: 'Registrar approved successfully',
      transactionHash: receipt.hash,
    });
  } catch (error) {
    console.error('Registrar Approve Error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get transfer by request ID
const getTransferByRequestId = async (req, res) => {
  try {
    const { requestId } = req.params;
    const transfer = await Transfer.findOne({ requestId });

    if (!transfer) {
      return res.status(404).json({
        success: false,
        message: 'Transfer not found',
      });
    }

    res.json({
      success: true,
      data: transfer,
    });
  } catch (error) {
    console.error('Get Transfer Error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get approval status
const getApprovalStatus = async (req, res) => {
  try {
    const { requestId } = req.params;
    const taxEscrow = getTaxEscrowContract();
    
    const status = await taxEscrow.getApprovalStatus(requestId);

    res.json({
      success: true,
      data: {
        sellerApproved: status[0],
        buyerApproved: status[1],
        registrarApproved: status[2],
        isCompleted: status[3],
      },
    });
  } catch (error) {
    console.error('Get Approval Status Error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  initiateTransfer,
  buyerApprove,
  registrarApprove,
  getTransferByRequestId,
  getApprovalStatus,
};