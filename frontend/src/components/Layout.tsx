import { FC, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import { useSDK } from "@metamask/sdk-react";
import Web3, { Contract, ContractAbi } from "web3";
import mintNftAbi from "../abis/mintNftAbi.json";

const Layout: FC = () => {
  const [account, setAccount] = useState<string>("");
  const [web3, setWeb3] = useState<Web3>();
  const [mintNftContract, setMintNftContract] =
    useState<Contract<ContractAbi>>();

  const { provider } = useSDK();

  useEffect(() => {
    if (!provider) return;

    setWeb3(new Web3(provider));
  }, [provider]);

  useEffect(() => {
    if (!web3) return;

    setMintNftContract(
      new web3.eth.Contract(
        mintNftAbi,
        "0x8Fcc590FcdDBB0BdDD53f2af18939122e6444015"
      )
    );
  }, [web3]);

  return (
    <div className="bg-red-100">
      <Header account={account} setAccount={setAccount} />
      <Outlet context={{ account, web3, mintNftContract }} />
    </div>
  );
};

export default Layout;
