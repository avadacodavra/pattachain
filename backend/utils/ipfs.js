const pinataSDK = require('@pinata/sdk');
const fs = require('fs');

const pinata = new pinataSDK(
  process.env.PINATA_API_KEY,
  process.env.PINATA_SECRET_KEY
);

const uploadToIPFS = async (filePath) => {
  try {
    const readableStream = fs.createReadStream(filePath);
    const options = {
      pinataMetadata: {
        name: `Land-Deed-${Date.now()}`,
      },
    };

    const result = await pinata.pinFileToIPFS(readableStream, options);
    return result.IpfsHash;
  } catch (error) {
    console.error('IPFS Upload Error:', error);
    throw error;
  }
};

const uploadJSONToIPFS = async (jsonData) => {
  try {
    const options = {
      pinataMetadata: {
        name: `Land-Metadata-${Date.now()}`,
      },
    };

    const result = await pinata.pinJSONToIPFS(jsonData, options);
    return result.IpfsHash;
  } catch (error) {
    console.error('IPFS JSON Upload Error:', error);
    throw error;
  }
};

module.exports = { uploadToIPFS, uploadJSONToIPFS };