const Land = require('../models/Land');
const { getLandNFTContract } = require('../utils/web3');
const { ethers } = require('ethers');

const parseContractEvent = (contract, receipt, eventName) => {
  const contractAddress = contract.target?.toLowerCase();

  for (const log of receipt.logs ?? []) {
    if (contractAddress && log.address?.toLowerCase() !== contractAddress) {
      continue;
    }

    try {
      const parsedLog = contract.interface.parseLog(log);

      if (parsedLog?.name === eventName) {
        return parsedLog;
      }
    } catch (error) {
      // Ignore logs emitted by other contracts or unmatched signatures.
    }
  }

  return null;
};

const assertContractDeployed = async (contract, contractName) => {
  const provider = contract.runner?.provider;

  if (!provider) {
    throw new Error(`${contractName} provider is not available.`);
  }

  const code = await provider.getCode(contract.target);

  if (!code || code === '0x') {
    throw new Error(
      `${contractName} is not deployed at ${contract.target} on the configured network. Restart the backend if you changed .env, and verify the address matches the live Amoy deployment.`
    );
  }
};

// Register new land
const registerLand = async (req, res) => {
  try {
    const { owner, ulpin, ipfsHash, area, location } = req.body;

    // Get contract
    const landNFT = getLandNFTContract();
    await assertContractDeployed(landNFT, 'LandNFT');

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
    const transactionHash = receipt.hash ?? tx.hash;
    console.log('Transaction confirmed:', transactionHash);

    // Extract tokenId from event
    const parsedEvent = parseContractEvent(landNFT, receipt, 'LandRegistered');
    let tokenId;

    if (parsedEvent) {
      tokenId = Number(parsedEvent.args.tokenId);
    } else {
      // Some RPCs return receipts without logs parsed as expected, so fall back
      // to querying the contract state by ULPIN after the transaction succeeds.
      try {
        tokenId = Number(await landNFT.getTokenIdByUlpin(ulpin));
      } catch (fallbackError) {
        throw new Error(
          `Transaction confirmed, but backend could not read the token from ${landNFT.target}. This usually means the request was sent to the wrong address/network or the backend needs a restart after .env changes. Original fallback error: ${fallbackError.shortMessage || fallbackError.message}`
        );
      }
    }

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
      transactionHash,
    });

    res.status(201).json({
      success: true,
      message: 'Land registered successfully',
      data: {
        tokenId,
        transactionHash,
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
