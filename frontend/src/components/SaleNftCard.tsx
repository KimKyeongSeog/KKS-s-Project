import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import NftCard, { NftCardProps } from "./NftCard";
import { NftMetadata, OutletContext } from "../types";
import { useOutletContext } from "react-router-dom";
import { MINT_NFT_CONTRACT } from "../abis/contractAddress";

interface saleNftCardProps extends NftCardProps {
  metadataArray: NftMetadata[];
  setMetadataArray: Dispatch<SetStateAction<NftMetadata[]>>;
}
const SaleNftCard: FC<saleNftCardProps> = ({
  tokenId,
  image,
  name,
  metadataArray,
  setMetadataArray
}) => {
  const [registedPrice, setRegistedPrice] = useState<number>(0);

  const { saleNftContract, account, web3, mintNftContract } =
    useOutletContext<OutletContext>();

  const onClickPurchase = async () => {
    try {
      const nftOwner: string = await mintNftContract.methods
        //@ts-expect-error
        .ownerOf(tokenId)
        .call();

      if (!account || nftOwner.toLowerCase() === account.toLowerCase()) return;

      const response = await saleNftContract.methods
        //@ts-expect-error
        .purchaseNFT(MINT_NFT_CONTRACT, tokenId)
        .send({
          from: account,
          value: web3.utils.toWei(registedPrice, "ether")
        });

      const temp = metadataArray.filter((v) => {
        if (v.tokenId !== tokenId) {
          return v;
        }
      });

      setMetadataArray(temp);
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
      console.error(error);
    }
  };

  useEffect(() => {
    if (!saleNftContract) return;

    getRegistedPrice();
  }, [saleNftContract]);

  return (
    <div className="flex flex-col items-center font-LOTTE">
      <NftCard tokenId={tokenId} image={image} name={name} />
      <div>
        <div className="text-center pt-[10px] mb-4 h-12 w-36 text-xl bg-white rounded-2xl bg-opacity-90">
          {registedPrice} ETH
        </div>
        <button
          className="w-36 h-12 mb-4  bg-black text-white rounded-2xl  hover:bg-gradient-to-r from-red-500 via-green-500 to-blue-500 font-semibold active:bg-black"
          onClick={onClickPurchase}
        >
          BUY IT!
        </button>
      </div>
    </div>
  );
};

export default SaleNftCard;
//가격 등록
//구매클릭버튼 (오너오브, nft 구매, 필터함수를 통해 판매된 nft카드는 최신화되도록)
//등록가격 가져오기
