import { FC, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import { useSDK } from "@metamask/sdk-react";
import Web3, { Contract, ContractAbi } from "web3";
import saleNftAbi from "../abis/saleNftAbi.json";
import mintNftAbi from "../abis/mintNftAbi.json";
import "animate.css";
import { MINT_NFT_CONTRACT, SALE_NFT_CONTRACT } from "../abis/contractAddress";

const Layout: FC = () => {
  const [account, setAccount] = useState<string>("");
  const [web3, setWeb3] = useState<Web3>();

  const [mintNftContract, setMintNftContract] =
    useState<Contract<ContractAbi>>();

  const [saleNftContract, setSaleNftContract] =
    useState<Contract<ContractAbi>>();

  const { provider } = useSDK();

  useEffect(() => {
    if (!provider) return;

    setWeb3(new Web3(provider));
  }, [provider]);

  useEffect(() => {
    if (!web3) return;

    setMintNftContract(new web3.eth.Contract(mintNftAbi, MINT_NFT_CONTRACT));
    setSaleNftContract(new web3.eth.Contract(saleNftAbi, SALE_NFT_CONTRACT));
  }, [web3]);
  return (
    <div>
      <div className="fixed top-0 w-full z-10">
        <Header account={account} setAccount={setAccount} />
        <div className="bg-black h-24 text-5xl text-white text-center font-LOTTE">
          <div
            className="pt-8 animate__animated animate__shakeY animate__delay-2s animate__slower  3s 
          animate__infinite	infinite"
          >
            Cartoon NFT SHOP
          </div>
        </div>
      </div>
      <Outlet context={{ account, web3, mintNftContract, saleNftAbi }} />
    </div>
  );
};

export default Layout;
