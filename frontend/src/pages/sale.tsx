import { FC, useEffect, useState } from "react";
import SaleNftCard from "../components/SaleNftCard";
import { NftMetadata, OutletContext } from "../types";
import { useOutletContext } from "react-router-dom";
import axios from "axios";

const Sale: FC = () => {
  const [metadataArray, setMetadataArray] = useState<NftMetadata[]>([]);

  const { saleNftContract, mintNftContract } =
    useOutletContext<OutletContext>();

  const getSaleNFTs = async () => {
    try {
      const onSaleNFTs: bigint[] = await saleNftContract.methods
        .getOnSaleNFTs()
        .call();
      console.log(onSaleNFTs);
      let temp: NftMetadata[] = [];

      for (let i = 0; i < onSaleNFTs.length; i++) {
        const metadataURI: string = await mintNftContract.methods
          //@ts-expect-error
          .tokenURI(Number(onSaleNFTs[i]))
          .call();
        console.log(metadataURI);
        const response = await axios.get(metadataURI);

        temp.push({ ...response.data, tokenId: Number(onSaleNFTs[i]) });
      }

      console.log(temp);
      setMetadataArray(temp);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!saleNftContract) return;

    getSaleNFTs();
  }, [saleNftContract]);

  useEffect(() => console.log(metadataArray), [metadataArray]);

  return (
    <>
      <div>
        <div className="bg-black py-8 h-36 w-full mt-32 z-10">
          <h1 className="mt-6 font-LOTTE text-2xl text-white text-center border-2 w-48 mx-auto">
            Sale
          </h1>
        </div>
      </div>
      <div className=" max-w-screen-lg mx-auto">
        <ul className="grid grid-cols-3">
          {metadataArray?.map((v, i) => (
            <SaleNftCard
              key={i}
              image={v.image}
              name={v.name}
              tokenId={v.tokenId!}
              metadataArray={metadataArray}
              setMetadataArray={setMetadataArray}
            />
          ))}
        </ul>
      </div>
    </>
  );
};

export default Sale;

//1. 판매할 nft 불러오기
//1.1 bigint를 사용하여 결과값이 중간에 짤리지 않도록함
//1.2 세일된 품목을 sale탭에서 출력되지 않도록하기 위해 URI를 읽어온 뒤
//1.3 temp라는 임시파일을 만들어 읽어온 url를 Array의 맨 뒷단으로 설정
//1.4 push기능을 통해 맨 뒷단에 있는 url를 제거
