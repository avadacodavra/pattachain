const { uploadToIPFS, uploadJSONToIPFS } = require('../utils/ipfs');
const fs = require('fs');

// Upload file to IPFS
const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
    }

    const ipfsHash = await uploadToIPFS(req.file.path);

    // Delete temporary file
    fs.unlinkSync(req.file.path);

    res.json({
      success: true,
      message: 'File uploaded to IPFS successfully',
      data: {
        ipfsHash,
        url: `https://gateway.pinata.cloud/ipfs/${ipfsHash}`,
      },
    });
  } catch (error) {
    console.error('Upload File Error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Upload JSON metadata to IPFS
const uploadMetadata = async (req, res) => {
  try {
    const metadata = req.body;
    const ipfsHash = await uploadJSONToIPFS(metadata);

    res.json({
      success: true,
      message: 'Metadata uploaded to IPFS successfully',
      data: {
        ipfsHash,
        url: `https://gateway.pinata.cloud/ipfs/${ipfsHash}`,
      },
    });
  } catch (error) {
    console.error('Upload Metadata Error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  uploadFile,
  uploadMetadata,
};