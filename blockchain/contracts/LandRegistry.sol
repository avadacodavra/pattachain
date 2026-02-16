// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./LandNFT.sol";
import "./TaxEscrow.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract LandRegistry is Ownable {
    LandNFT public landNFT;
    TaxEscrow public taxEscrow;

    struct OwnershipRecord {
        address owner;
        uint256 timestamp;
        uint256 transferRequestId;
    }

    mapping(uint256 => OwnershipRecord[]) public ownershipHistory;
    mapping(address => bool) public verifiedUsers;

    // ✅ Custom Errors (cheaper than strings)
    error InvalidAddress();
    error Unauthorized();
    error UserAlreadyVerified();
    error UserNotVerified();
    error NoOwnershipHistory();

    event UserVerified(address indexed user);
    event UserRevoked(address indexed user);
    event OwnershipRecorded(uint256 indexed tokenId, address indexed owner, uint256 timestamp);

    constructor(address _landNFTAddress, address _taxEscrowAddress)
        Ownable(msg.sender)
    {
        if (_landNFTAddress == address(0)) revert InvalidAddress();
        if (_taxEscrowAddress == address(0)) revert InvalidAddress();

        landNFT = LandNFT(_landNFTAddress);
        taxEscrow = TaxEscrow(_taxEscrowAddress);
    }

    function verifyUser(address user) external onlyOwner {
        if (user == address(0)) revert InvalidAddress();
        if (verifiedUsers[user]) revert UserAlreadyVerified();

        verifiedUsers[user] = true;
        emit UserVerified(user);
    }

    function revokeUser(address user) external onlyOwner {
        if (!verifiedUsers[user]) revert UserNotVerified();

        verifiedUsers[user] = false;
        emit UserRevoked(user);
    }

    function batchVerifyUsers(address[] calldata users) external onlyOwner {
        uint256 length = users.length;

        for (uint256 i; i < length; ) {
            address user = users[i];

            if (user != address(0) && !verifiedUsers[user]) {
                verifiedUsers[user] = true;
                emit UserVerified(user);
            }

            unchecked { ++i; }
        }
    }

    function recordOwnership(
        uint256 tokenId,
        address newOwner,
        uint256 transferRequestId
    ) external {
        if (
            msg.sender != address(landNFT) &&
            msg.sender != address(taxEscrow) &&
            msg.sender != owner()
        ) revert Unauthorized();

        if (newOwner == address(0)) revert InvalidAddress();

        ownershipHistory[tokenId].push(
            OwnershipRecord({
                owner: newOwner,
                timestamp: block.timestamp,
                transferRequestId: transferRequestId
            })
        );

        emit OwnershipRecorded(tokenId, newOwner, block.timestamp);
    }

    function getOwnershipHistory(uint256 tokenId)
        external
        view
        returns (OwnershipRecord[] memory)
    {
        return ownershipHistory[tokenId];
    }

    function getOwnershipCount(uint256 tokenId)
        external
        view
        returns (uint256)
    {
        return ownershipHistory[tokenId].length;
    }

    function getLatestOwner(uint256 tokenId)
        external
        view
        returns (address)
    {
        uint256 length = ownershipHistory[tokenId].length;
        if (length == 0) revert NoOwnershipHistory();

        return ownershipHistory[tokenId][length - 1].owner;
    }

    function updateLandNFT(address _landNFTAddress) external onlyOwner {
        if (_landNFTAddress == address(0)) revert InvalidAddress();
        landNFT = LandNFT(_landNFTAddress);
    }

    function updateTaxEscrow(address _taxEscrowAddress) external onlyOwner {
        if (_taxEscrowAddress == address(0)) revert InvalidAddress();
        taxEscrow = TaxEscrow(_taxEscrowAddress);
    }
}
