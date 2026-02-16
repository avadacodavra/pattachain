// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./LandNFT.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TaxEscrow is Ownable {
    LandNFT public landNFT;
    
    mapping(string => uint256) public circleRates;
    
    struct TransferRequest {
        uint256 tokenId;
        address seller;
        address buyer;
        uint256 salePrice;
        uint256 taxAmount;
        uint256 circleRate;
        bool sellerApproved;
        bool buyerApproved;
        bool registrarApproved;
        bool isCompleted;
        bool isCancelled;
        uint256 createdAt;
    }
    
    mapping(uint256 => TransferRequest) public transferRequests;
    uint256 public transferRequestCounter;
    
    address public registrar;
    
    uint256 public taxPercentage = 700;
    uint256 public constant BASIS_POINTS = 10000;
    
    event TransferRequested(uint256 indexed requestId, uint256 indexed tokenId, address seller, address buyer, uint256 salePrice);
    event ApprovalGiven(uint256 indexed requestId, address indexed approver, string role);
    event TransferCompleted(uint256 indexed requestId, uint256 indexed tokenId, address from, address to);
    event TransferCancelled(uint256 indexed requestId);
    event TaxPaid(uint256 indexed requestId, uint256 amount);
    event CircleRateUpdated(string location, uint256 rate);
    
    constructor(address _landNFTAddress, address _registrar) Ownable(msg.sender) {
        landNFT = LandNFT(_landNFTAddress);
        registrar = _registrar;
    }
    
    function updateCircleRate(string memory location, uint256 ratePerSqm) public {
        require(msg.sender == owner() || msg.sender == registrar, "Not authorized");
        circleRates[location] = ratePerSqm;
        emit CircleRateUpdated(location, ratePerSqm);
    }
    
    function updateRegistrar(address _registrar) public onlyOwner {
        registrar = _registrar;
    }
    
    function updateTaxPercentage(uint256 _taxPercentage) public onlyOwner {
        require(_taxPercentage <= 2000, "Tax cannot exceed 20%");
        taxPercentage = _taxPercentage;
    }
    
    function calculateMinimumPrice(uint256 tokenId) public view returns (uint256) {
        LandNFT.LandDetails memory details = landNFT.getLandDetails(tokenId);
        uint256 rate = circleRates[details.location];
        require(rate > 0, "Circle rate not set for this location");
        return details.area * rate;
    }
    
    function calculateTax(uint256 salePrice) public view returns (uint256) {
        return (salePrice * taxPercentage) / BASIS_POINTS;
    }
    
    function initiateTransfer(
        uint256 tokenId,
        address buyer,
        uint256 salePrice
    ) public payable returns (uint256) {
        require(landNFT.ownerOf(tokenId) == msg.sender, "Not the owner");
        
        LandNFT.LandDetails memory details = landNFT.getLandDetails(tokenId);
        
        uint256 minimumPrice = calculateMinimumPrice(tokenId);
        require(salePrice >= minimumPrice, "Sale price below circle rate");
        
        uint256 taxAmount = calculateTax(salePrice);
        
        require(msg.value >= taxAmount, "Insufficient tax payment");
        
        transferRequestCounter++;
        uint256 requestId = transferRequestCounter;
        
        transferRequests[requestId] = TransferRequest({
            tokenId: tokenId,
            seller: msg.sender,
            buyer: buyer,
            salePrice: salePrice,
            taxAmount: taxAmount,
            circleRate: circleRates[details.location],
            sellerApproved: true,
            buyerApproved: false,
            registrarApproved: false,
            isCompleted: false,
            isCancelled: false,
            createdAt: block.timestamp
        });
        
        emit TransferRequested(requestId, tokenId, msg.sender, buyer, salePrice);
        emit ApprovalGiven(requestId, msg.sender, "SELLER");
        emit TaxPaid(requestId, msg.value);
        
        return requestId;
    }
    
    function buyerApprove(uint256 requestId) public {
        TransferRequest storage request = transferRequests[requestId];
        require(!request.isCompleted, "Transfer already completed");
        require(!request.isCancelled, "Transfer cancelled");
        require(msg.sender == request.buyer, "Not the buyer");
        require(!request.buyerApproved, "Already approved");
        
        request.buyerApproved = true;
        emit ApprovalGiven(requestId, msg.sender, "BUYER");
        
        _checkAndExecuteTransfer(requestId);
    }
    
    function registrarApprove(uint256 requestId) public {
        TransferRequest storage request = transferRequests[requestId];
        require(!request.isCompleted, "Transfer already completed");
        require(!request.isCancelled, "Transfer cancelled");
        require(msg.sender == registrar, "Not the registrar");
        require(!request.registrarApproved, "Already approved");
        
        request.registrarApproved = true;
        emit ApprovalGiven(requestId, msg.sender, "REGISTRAR");
        
        _checkAndExecuteTransfer(requestId);
    }
    
    function _checkAndExecuteTransfer(uint256 requestId) private {
        TransferRequest storage request = transferRequests[requestId];
        
        if (request.sellerApproved && request.buyerApproved && request.registrarApproved) {
            landNFT.transferFrom(request.seller, request.buyer, request.tokenId);
            
            request.isCompleted = true;
            
            emit TransferCompleted(requestId, request.tokenId, request.seller, request.buyer);
        }
    }
    
    function cancelTransfer(uint256 requestId) public {
        TransferRequest storage request = transferRequests[requestId];
        require(!request.isCompleted, "Transfer already completed");
        require(!request.isCancelled, "Already cancelled");
        require(msg.sender == request.seller, "Only seller can cancel");
        
        request.isCancelled = true;
        
        payable(request.seller).transfer(request.taxAmount);
        
        emit TransferCancelled(requestId);
    }
    
    function getTransferRequest(uint256 requestId) public view returns (TransferRequest memory) {
        return transferRequests[requestId];
    }
    
    function withdrawTaxes() public onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
    
    function getApprovalStatus(uint256 requestId) public view returns (
        bool sellerApproved,
        bool buyerApproved,
        bool registrarApproved,
        bool isCompleted
    ) {
        TransferRequest memory request = transferRequests[requestId];
        return (
            request.sellerApproved,
            request.buyerApproved,
            request.registrarApproved,
            request.isCompleted
        );
    }
}