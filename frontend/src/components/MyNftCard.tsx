import { FC, useEffect, useState } from "react";
import NftCard, { NftCardProps } from "./NftCard";
import { useOutletContext } from "react-router-dom";
import { OutletContext } from "../types";

interface MyNftCardProps extends NftCardProps {
  saleStatus: boolean;
}

const MyNftCard: FC<MyNftCardProps> = ({
  tokenId,
  image,
  name,
  saleStatus
}) => {
  const [price, setPrice] = useState<string>("");
  const [registedPrice, setRegistedPrice] = useState<number>(0);
  const { saleNftContract, account, web3 } = useOutletContext<OutletContext>();

  const getRegistedPrice = async () => {
    try {
      const response = await saleNftContract.methods
        //@ts-expect-error
        .nftPrice(tokenId)
        .call();

      setRegistedPrice(Number(web3.utils.fromWei(Number(response), "ether")));
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (!saleNftContract) return;

    getRegistedPrice();
  }, [saleNftContract]);

  return (
    <div className="border-4 bg-gray-200 bg-opacity-90 border-dashed m-12 p-4 border-black border-opacity-90">
      <NftCard tokenId={tokenId} image={image} name={name} />
      <div>{registedPrice}ETH</div>
    </div>
  );
};

export default MyNftCard;
