# PattaChain

PattaChain is a land registration and transfer prototype built with:

- `frontend/`: Next.js 16 + React 19 + Wagmi/RainbowKit UI
- `backend/`: Express + MongoDB API + Pinata/IPFS upload service
- `blockchain/`: Hardhat + Solidity smart contracts for land NFTs, tax escrow, and registry history

This README focuses only on the main PattaChain project flow and intentionally ignores AWS-related work.

## Project Idea

PattaChain aims to digitize land records by:

- minting each land parcel as an NFT
- storing deed files and metadata on IPFS
- keeping searchable off-chain records in MongoDB
- using smart contracts to manage transfer approvals and tax escrow

## Current Architecture

### Frontend

- home page, dashboard, register, transfer, and property detail pages
- wallet connection through RainbowKit/Wagmi
- calls backend APIs for land registration, property fetch, and IPFS upload

### Backend

- stores land and transfer data in MongoDB
- uploads files/metadata to Pinata IPFS
- sends blockchain transactions using a server wallet from `.env`
- exposes REST APIs under `/api/land`, `/api/transfer`, and `/api/ipfs`

### Blockchain

- `LandNFT.sol`: mints the property NFT and stores land details
- `TaxEscrow.sol`: handles transfer requests, tax calculation, circle-rate enforcement, and approvals
- `LandRegistry.sol`: intended for ownership history / registry verification

## Important Current Behavior

These points matter before you run the project:

- land registration is triggered from the frontend, but the actual mint transaction is signed by the backend wallet
- `LandNFT.registerLand()` is `onlyOwner`, so the backend `PRIVATE_KEY` must belong to the contract owner/deployer
- the transfer page currently calls `TaxEscrow` directly from the user wallet instead of using the backend transfer API
- transfer initiation requires a circle rate to be set first in `TaxEscrow`, otherwise it will fail
- the frontend is configured for `Polygon Amoy Testnet` by default
- the backend also defaults to Amoy unless you override values for local Hardhat

## Tech Stack

- Node.js
- Next.js
- React
- Express
- MongoDB
- Mongoose
- Hardhat
- Solidity
- Ethers.js
- Wagmi / RainbowKit
- Pinata IPFS
- Polygon Amoy testnet

## Prerequisites

Install these first:

1. `Node.js 20+`
2. `npm` or `yarn` for package installation
3. `MongoDB` connection string
4. `MetaMask` browser extension
5. `Pinata` account for IPFS uploads
6. `POL` test tokens for Polygon Amoy if you want to use the live testnet flow

## Folder Structure

```text
pattachain/
|-- frontend/      # Next.js app
|-- backend/       # Express API + MongoDB + IPFS + blockchain server wallet
|-- blockchain/    # Hardhat contracts and deployment scripts
|-- shared/        # shared ABI/address artifacts
`-- README.md
```

## 1. Clone The Repository

```bash
git clone <your-repo-url>
cd pattachain
```

## 2. Install Dependencies

Install dependencies in all 3 project parts.

### Frontend

```bash
cd frontend
npm install
```

### Backend

```bash
cd ../backend
npm install
```

### Blockchain

```bash
cd ../blockchain
npm install
```

Return to the root whenever convenient:

```bash
cd ..
```

## 3. Environment Variables

Create separate `.env` files inside `backend/`, `frontend/`, and `blockchain/`.

## 3A. Backend `.env`

Create `backend/.env`:

```env
PORT=5000
NODE_ENV=development

MONGODB_URI=mongodb://127.0.0.1:27017/pattachain

PINATA_API_KEY=your_pinata_api_key
PINATA_SECRET_KEY=your_pinata_secret_key

PRIVATE_KEY=your_backend_signer_private_key

CHAIN_ID=80002
NETWORK_NAME=Polygon Amoy Testnet
POLYGON_AMOY_RPC=https://rpc-amoy.polygon.technology/
RPC_URL=https://rpc-amoy.polygon.technology/

LANDNFT_ADDRESS=your_landnft_contract_address
TAXESCROW_ADDRESS=your_taxescrow_contract_address
LANDREGISTRY_ADDRESS=your_landregistry_contract_address
```

### Backend env notes

- `MONGODB_URI` is required or the backend will keep retrying MongoDB connection
- `PRIVATE_KEY` is required for blockchain writes from the backend
- `PRIVATE_KEY` must match the deployed contract owner for land registration to work
- `LANDNFT_ADDRESS`, `TAXESCROW_ADDRESS`, and `LANDREGISTRY_ADDRESS` must match the deployment you want to use
- for local Hardhat, change `CHAIN_ID`, `NETWORK_NAME`, `RPC_URL`, and contract addresses accordingly

## 3B. Frontend `.env.local`

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
NEXT_PUBLIC_POLYGON_AMOY_RPC=https://rpc-amoy.polygon.technology/
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id

NEXT_PUBLIC_LANDNFT_ADDRESS=your_landnft_contract_address
NEXT_PUBLIC_TAXESCROW_ADDRESS=your_taxescrow_contract_address
NEXT_PUBLIC_LANDREGISTRY_ADDRESS=your_landregistry_contract_address
```

### Frontend env notes

- `NEXT_PUBLIC_BACKEND_URL` must point to the running backend
- wallet connection works best if you set your own WalletConnect project ID
- the contract addresses must match the same network as the user wallet

## 3C. Blockchain `.env`

Create `blockchain/.env`:

```env
PRIVATE_KEY=your_deployer_private_key
```

### Blockchain env notes

- this wallet is used by Hardhat for `deploy:amoy`
- if you want the backend to perform `onlyOwner` land registration, use the same deployer/owner wallet in backend `PRIVATE_KEY`

## 4. Choose A Network

You have 2 realistic ways to run this project.

## Option A: Polygon Amoy Testnet

Use this when you want wallet-based testing close to the intended real flow.

### You need

- Amoy contract deployment
- Amoy contract addresses in backend and frontend env files
- MetaMask connected to Polygon Amoy
- test `POL` in both:
  - the deployer/backend wallet
  - user wallets used in the frontend

## Option B: Local Hardhat Node

Use this when you want fast local contract testing.

### You need

- Hardhat node running
- local contract deployment
- backend and frontend env files updated to local addresses and local RPC
- MetaMask connected to local chain if you want wallet UI testing

## 5. Compile And Deploy Contracts

Go to the blockchain folder:

```bash
cd blockchain
```

### Compile

```bash
npm run compile
```

### Run local blockchain

```bash
npm run node
```

In another terminal:

```bash
cd blockchain
npm run deploy:local
```

### Deploy to Polygon Amoy

```bash
cd blockchain
npm run deploy:amoy
```

After deployment:

1. open `blockchain/deployment.json`
2. copy the deployed contract addresses
3. paste them into:
   - `backend/.env`
   - `frontend/.env.local`

## 6. Set Circle Rate Before Transfers

This is mandatory for transfer flow.

`TaxEscrow.initiateTransfer()` checks `calculateMinimumPrice()`, and that depends on a circle rate being set for the property location. If no circle rate exists, transfer initiation will fail.

Current contract behavior:

- tax percentage default = `700` basis points = `7%`
- transfer tax is paid in native chain token
- on Polygon Amoy that token is `POL`

### Practical example

If sale price is `10 POL`, current transfer tax is:

```text
0.7 POL
```

The seller wallet initiating the transfer must have enough `POL` for:

- the transfer tax value sent to the contract
- gas fees for the transaction

### How to set circle rate

This must be done by the contract owner or registrar wallet. Right now there is no dedicated UI for it, so it is still a manual blockchain/admin step.

## 7. Start The Backend

```bash
cd backend
npm run dev
```

Expected backend base URL:

```text
http://localhost:5000
```

Health check:

```text
GET http://localhost:5000/health
```

## 8. Start The Frontend

```bash
cd frontend
npm run dev
```

Expected frontend URL:

```text
http://localhost:3000
```

## 9. Typical End-To-End Run Flow

### Land registration flow

1. start MongoDB
2. start blockchain network or use Amoy
3. deploy contracts
4. copy contract addresses into backend and frontend env files
5. start backend
6. start frontend
7. connect wallet in frontend
8. open `/register`
9. upload deed PDF or provide IPFS hash
10. submit registration
11. backend uploads the file to IPFS if needed
12. backend signs the mint transaction
13. land details are stored:
   - on-chain in `LandNFT`
   - off-chain in MongoDB

### Transfer flow

1. make sure the property already exists
2. make sure circle rate is set for that property location
3. connect seller wallet in frontend
4. open `/transfer`
5. choose property, buyer address, and sale price
6. seller wallet initiates transfer on-chain and pays tax in `POL`
7. buyer approval and registrar approval are still mostly a backend/contract capability, not a complete frontend workflow yet

## 10. Available Backend APIs

### Land

- `POST /api/land/register`
- `GET /api/land/token/:tokenId`
- `GET /api/land/ulpin/:ulpin`
- `GET /api/land/owner/:owner`
- `GET /api/land/verify/:ulpin`

### Transfer

- `POST /api/transfer/initiate`
- `POST /api/transfer/buyer-approve/:requestId`
- `POST /api/transfer/registrar-approve/:requestId`
- `GET /api/transfer/:requestId`
- `GET /api/transfer/status/:requestId`

### IPFS

- `POST /api/ipfs/upload-file`
- `POST /api/ipfs/upload-metadata`

## 11. Token / Gas Requirement Situation

This project needs native chain tokens.

### On Polygon Amoy

- native token used for gas = `POL`
- transfer tax is also paid in `POL`
- backend wallet needs `POL` for land registration transactions
- deployer wallet needs `POL` for contract deployment
- seller wallet needs `POL` for transfer initiation and gas
- buyer and registrar wallets also need some `POL` for their approval transactions if those approvals are done directly on-chain from their wallets

### On local Hardhat

- local accounts come pre-funded with test ETH on the local node
- these are only for local testing

## 12. Current Project Status

### Working / mostly present

- smart contracts for NFT minting, tax escrow, and registry module exist
- backend land registration flow exists
- backend MongoDB persistence for land and transfer records exists
- Pinata IPFS upload flow exists
- frontend wallet connection exists
- frontend pages for register, dashboard, property details, and transfer exist
- property fetch from backend exists

### Partially integrated

- frontend transfer page interacts directly with `TaxEscrow`, while backend transfer APIs also exist
- `LandRegistry` contract is deployed conceptually but not fully wired into the active user flow
- approval lifecycle is defined in the contracts and backend, but the frontend does not yet provide a full buyer/registrar approval dashboard

### Not yet production ready

- no full role-based auth/admin flow is wired end-to-end
- no robust error recovery / transaction reconciliation
- no full test coverage
- no production deployment setup documented here
- secrets are managed through local `.env` files only

## 13. Pending Work / Remaining Integration

These are the main next steps for the project.

### High-priority integration work

1. fully connect frontend, backend, and blockchain around one consistent transfer flow
2. decide whether transfers should be:
   - backend-mediated through REST APIs
   - wallet-direct from frontend
3. wire buyer approval and registrar approval into frontend screens
4. connect `LandRegistry` ownership history updates into the actual transfer completion flow
5. add an admin/registrar interface to set circle rates

### Backend improvements

1. add input validation for wallet addresses, ULPIN, area, and location
2. add better duplicate handling and cleaner API error responses
3. secure and validate file uploads more strictly
4. add transaction indexing / reconciliation jobs
5. add real tests for controllers, models, and contract interactions

### Frontend improvements

1. add transfer status tracking by `requestId`
2. add buyer and registrar approval pages
3. show transaction hashes and explorer links across all key actions
4. improve empty/error/loading states around blockchain failures
5. show tax estimate and circle-rate validation before user submits transfer

### Smart contract improvements

1. integrate `LandRegistry.recordOwnership()` during registration and completed transfers
2. review whether `transferFrom()` will always succeed under the current ownership/approval pattern
3. add stronger events and helper view functions for frontend tracking
4. add tests for:
   - duplicate ULPIN prevention
   - circle-rate enforcement
   - tax collection
   - buyer approval
   - registrar approval
   - cancellation/refund

## 14. Recommended Implementation Order

If you want to continue building the project in the cleanest order, do it like this:

1. finalize one target network for development: local Hardhat or Polygon Amoy
2. deploy fresh contracts and lock the addresses
3. make backend and frontend use the same addresses and RPC
4. add circle-rate admin flow
5. finish transfer approvals in the frontend
6. integrate `LandRegistry` updates
7. add tests across backend and blockchain
8. then polish UI and deployment

## 15. Common Problems

### Registration fails with contract owner error

Cause:

- backend `PRIVATE_KEY` is not the owner of `LandNFT`

Fix:

- use the deployer/owner wallet in backend `.env`

### Transfer fails with circle rate error

Cause:

- no circle rate set for the property location

Fix:

- update the circle rate on `TaxEscrow` using owner/registrar wallet

### Frontend loads but API calls fail

Cause:

- wrong `NEXT_PUBLIC_BACKEND_URL`
- backend not running

Fix:

- verify backend runs on `http://localhost:5000`

### Backend cannot talk to blockchain

Cause:

- wrong RPC URL
- wrong chain
- wrong contract addresses

Fix:

- verify `.env` values match the network where contracts were deployed

### Wallet connected but transactions fail

Cause:

- wallet on wrong network
- insufficient `POL`

Fix:

- switch wallet to Polygon Amoy
- fund the wallet with enough test `POL`

## 16. Suggested Future Additions

- `.env.example` files for each app
- contract ABI/address sync script between `blockchain`, `backend`, and `frontend`
- seed script for test properties and circle rates
- Docker setup for backend + MongoDB
- CI for linting, contract tests, and backend tests

## Summary

PattaChain already has the core building blocks for a blockchain-based land registry:

- NFT land registration
- MongoDB persistence
- IPFS deed storage
- transfer escrow logic

The main remaining work is integration quality:

- unify transfer flow
- complete admin and approval screens
- wire `LandRegistry` into the final lifecycle
- improve validation, testing, and deployment readiness
