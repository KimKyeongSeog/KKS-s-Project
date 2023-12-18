import { FC, FormEvent, useEffect, useState } from "react";
import NftCard, { NftCardProps } from "./NftCard";
import { useOutletContext } from "react-router-dom";
import { OutletContext } from "../types";
import { MINT_NFT_CONTRACT } from "../abis/contractAddress";

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

  const onSubmitForSale = async (e: FormEvent) => {
    try {
      e.preventDefault();

      if (isNaN(+price)) return;

      const response = await saleNftContract.methods
        .setForSaleNFT(
          // @ts-expect-error
          MINT_NFT_CONTRACT,
          tokenId,
          web3.utils.toWei(Number(price), "ether")
        )
        .send({ from: account });

      setRegistedPrice(+price);
      setPrice("");
    } catch (error) {
      console.log(error);
    }
  };

  const getRegistedPrice = async () => {
    try {
      const response = await saleNftContract.methods
        //@ts-expect-error
        .nftPrices(tokenId)
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
    <div className="flex flex-col items-center">
      <NftCard tokenId={tokenId} image={image} name={name} />
      {registedPrice ? (
        <div className=" text-center font-LOTTE rounded-2xl pt-[10px] text-white text-xl pyauto w-36 h-12 bg-gradient-to-r from-red-500 via-green-500 to-blue-500 bg-white bg-opacity-90">
          {registedPrice}(ETH)
        </div>
      ) : (
        saleStatus && (
          <form
            className="flex flex-col items-center"
            onSubmit={onSubmitForSale}
          >
            <div className="items-center flex flex-col">
              <input
                placeholder="Enter the price(ETH)"
                type="text"
                className="border-4 px-2 mb-4 h-12 border-black outline-none font-gang text-2xl"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />

              <input
                className="w-36 h-12 bg-black text-white rounded-2xl hover:bg-gradient-to-r from-red-500 via-green-500 to-blue-500 font-semibold active:bg-black"
                type="submit"
                value="Regist NOW !!!"
              />
            </div>
          </form>
        )
      )}
    </div>
  );
};

export default MyNftCard;
