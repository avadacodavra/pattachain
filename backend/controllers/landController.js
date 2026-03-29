const Land = require('../models/Land');
const { getLandNFTContract } = require('../utils/web3');
const { ethers } = require('ethers');

// Register new land
const registerLand = async (req, res) => {
  try {
    const { owner, ulpin, ipfsHash, area, location } = req.body;

    // Get contract
    const landNFT = getLandNFTContract();

    // Register on blockchain
    const tx = await landNFT.registerLand(
      owner,
      ulpin,
      ipfsHash,
      BigInt(area),
      location
    );

    console.log('Transaction sent:', tx.hash);
    const receipt = await tx.wait();
    console.log('Transaction confirmed:', receipt.hash);

    // Extract tokenId from event
    const event = receipt.logs.find(log => {
      try {
        return landNFT.interface.parseLog(log).name === 'LandRegistered';
      } catch (e) {
        return false;
      }
    });

    const parsedEvent = landNFT.interface.parseLog(event);
    const tokenId = Number(parsedEvent.args.tokenId);

    // Hash ULPIN
    const ulpinHash = ethers.keccak256(ethers.toUtf8Bytes(ulpin));

    // Save to database
    const land = await Land.create({
      tokenId,
      ulpin,
      ulpinHash,
      owner,
      ipfsDocumentHash: ipfsHash,
      area,
      location,
      transactionHash: receipt.hash,
    });

    res.status(201).json({
      success: true,
      message: 'Land registered successfully',
      data: {
        tokenId,
        transactionHash: receipt.hash,
        land,
      },
    });
  } catch (error) {
    console.error('Register Land Error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get land by token ID
const getLandByTokenId = async (req, res) => {
  try {
    const { tokenId } = req.params;
    const land = await Land.findOne({ tokenId });

    if (!land) {
      return res.status(404).json({
        success: false,
        message: 'Land not found',
      });
    }

    // Get blockchain data
    const landNFT = getLandNFTContract();
    const details = await landNFT.getLandDetails(tokenId);

    res.json({
      success: true,
      data: {
        database: land,
        blockchain: {
          ulpinHash: details.ulpinHash,
          ipfsDocumentHash: details.ipfsDocumentHash,
          area: details.area.toString(),
          location: details.location,
          registrationDate: new Date(Number(details.registrationDate) * 1000),
          isActive: details.isActive,
        },
      },
    });
  } catch (error) {
    console.error('Get Land Error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get land by ULPIN
const getLandByULPIN = async (req, res) => {
  try {
    const { ulpin } = req.params;
    const land = await Land.findOne({ ulpin });

    if (!land) {
      return res.status(404).json({
        success: false,
        message: 'Land not found',
      });
    }

    res.json({
      success: true,
      data: land,
    });
  } catch (error) {
    console.error('Get Land by ULPIN Error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all lands by owner
const getLandsByOwner = async (req, res) => {
  try {
    const { owner } = req.params;
    const lands = await Land.find({ owner, isActive: true });

    res.json({
      success: true,
      count: lands.length,
      data: lands,
    });
  } catch (error) {
    console.error('Get Lands by Owner Error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Verify ULPIN
const verifyULPIN = async (req, res) => {
  try {
    const { ulpin } = req.params;
    const landNFT = getLandNFTContract();
    
    const isRegistered = await landNFT.isUlpinRegistered(ulpin);

    res.json({
      success: true,
      data: {
        ulpin,
        isRegistered,
      },
    });
  } catch (error) {
    console.error('Verify ULPIN Error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  registerLand,
  getLandByTokenId,
  getLandByULPIN,
  getLandsByOwner,
  verifyULPIN,
};
