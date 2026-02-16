// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract LandNFT is ERC721, ERC721URIStorage, Ownable {
    uint256 private _tokenIdCounter;

    mapping(bytes32 => uint256) public ulpinToTokenId;
    mapping(uint256 => bytes32) public tokenIdToUlpin;
    mapping(uint256 => LandDetails) public landDetails;
    
    event LandRegistered(uint256 indexed tokenId, bytes32 indexed ulpinHash, address indexed owner);
    event LandTransferred(uint256 indexed tokenId, address indexed from, address indexed to);

    struct LandDetails {
        bytes32 ulpinHash;
        string ipfsDocumentHash;
        uint256 area;
        string location;
        uint256 registrationDate;
        bool isActive;
    }

    constructor() ERC721("PattaChain Land NFT", "LAND") Ownable(msg.sender) {}

    function registerLand(
        address to,
        string memory ulpin,
        string memory ipfsHash,
        uint256 area,
        string memory location
    ) public onlyOwner returns (uint256) {
        bytes32 ulpinHash = keccak256(abi.encodePacked(ulpin));
        
        require(ulpinToTokenId[ulpinHash] == 0, "ULPIN already registered");
        
        _tokenIdCounter++;
        uint256 tokenId = _tokenIdCounter;
        
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, ipfsHash);
        
        ulpinToTokenId[ulpinHash] = tokenId;
        tokenIdToUlpin[tokenId] = ulpinHash;
        
        landDetails[tokenId] = LandDetails({
            ulpinHash: ulpinHash,
            ipfsDocumentHash: ipfsHash,
            area: area,
            location: location,
            registrationDate: block.timestamp,
            isActive: true
        });
        
        emit LandRegistered(tokenId, ulpinHash, to);
        
        return tokenId;
    }

    function isUlpinRegistered(string memory ulpin) public view returns (bool) {
        bytes32 ulpinHash = keccak256(abi.encodePacked(ulpin));
        return ulpinToTokenId[ulpinHash] != 0;
    }

    function getTokenIdByUlpin(string memory ulpin) public view returns (uint256) {
        bytes32 ulpinHash = keccak256(abi.encodePacked(ulpin));
        uint256 tokenId = ulpinToTokenId[ulpinHash];
        require(tokenId != 0, "ULPIN not registered");
        return tokenId;
    }

    function getLandDetails(uint256 tokenId) public view returns (LandDetails memory) {
        require(ownerOf(tokenId) != address(0), "Token does not exist");
        return landDetails[tokenId];
    }

    function _update(address to, uint256 tokenId, address auth) 
        internal 
        override(ERC721) 
        returns (address) 
    {
        address from = _ownerOf(tokenId);
        address previousOwner = super._update(to, tokenId, auth);
        
        if (from != address(0) && to != address(0)) {
            emit LandTransferred(tokenId, from, to);
        }
        
        return previousOwner;
    }

    function getTotalLands() public view returns (uint256) {
        return _tokenIdCounter;
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}