NFT DASHBOARD
├── contracts                               # Solidity folder
│   ├── MintNFT.sol                         # Smartcontract for minting NFTs
│   └── SaleNFT.sol                         # Smartcontract for selling NFTs
└── frontend                                # React frontend folder
    ├── public                              # Logo image
    └── src                                 # Source files
        ├── abis                            # Abi folder
        │   └── contractAddress.tsx         # Smartcontract address file
        ├── components                      # Components
        │   ├── Footer.tsx                
        │   ├── Header.tsx
        │   ├── Layout.tsx
        │   ├── MintModal.tsx
        │   ├── MyNftCard.tsx
        │   ├── NftCard.tsx
        │   └── SaleNftCard.tsx
        ├── pages                           # Pages
        │   ├── detail.tsx
        │   ├── home.tsx
        │   ├── my.tsx
        │   └── sale.tsx     
        ├── types                           # Typescript interface file
        └── App.tsx         
