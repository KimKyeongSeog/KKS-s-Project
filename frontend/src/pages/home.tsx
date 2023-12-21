import { FC, useEffect, useRef, useState } from "react";
import { NftMetadata, OutletContext } from "../types";
import { useOutletContext } from "react-router-dom";
import axios from "axios";
import NftCard from "../components/NftCard";

const GET_AMOUNT = 6;

const Home: FC = () => {
  const [searchTokenId, setSearchTokenId] = useState<number>(0);
  const [totalNFT, setTotalNFT] = useState<number>(0);
  const [metadataArray, setMetadataArray] = useState<NftMetadata[]>([]);

  const { mintNftContract } = useOutletContext<OutletContext>();

  const detectRef = useRef<HTMLDivElement>(null);
  const observer = useRef<IntersectionObserver>();

  const observe = () => {
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && metadataArray.length !== 0) {
        getNFTs();
      }
    });

    if (!detectRef.current) return;

    observer.current.observe(detectRef.current);
  };

  const getTotalSupply = async () => {
    try {
      if (!mintNftContract) return;

      const totalSupply = await mintNftContract.methods.totalSupply().call();

      setTotalNFT(Number(totalSupply));
      setSearchTokenId(Number(totalSupply));
    } catch (error) {
      console.log(error);
    }
  };

  const getNFTs = async () => {
    try {
      if (!mintNftContract || searchTokenId <= 0) return;

      let temp: NftMetadata[] = [];

      for (let i = 0; i < GET_AMOUNT; i++) {
        if (searchTokenId - i > 0) {
          const metadataURI: string = await mintNftContract.methods
            // @ts-expect-error
            .tokenURI(searchTokenId - i)
            .call();

          const response = await axios.get(metadataURI);

          temp.push({ ...response.data, tokenId: searchTokenId });
        }
      }
      setSearchTokenId(searchTokenId - GET_AMOUNT);
      setMetadataArray([...metadataArray, ...temp]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getTotalSupply();
  }, [mintNftContract]);

  useEffect(() => {
    if (totalNFT === 0) return;

    getNFTs();
  }, [totalNFT]);

  useEffect(() => {
    observe();

    return () => observer.current?.disconnect();
  }, [metadataArray]);

  return (
    <div className=" w-full h-full">
      <div className="max-w-screen">
        <div className="bg-black py-8 h-36 mt-32 z-10">
          <h1 className="mt-6 font-LOTTE text-2xl text-white text-center border-2 w-48 mx-auto">
            Home
          </h1>
        </div>
        <ul className=" max-w-screen-lg mx-auto">
          <li className="grid gap-8 grid-cols-3">
            {metadataArray?.map((v, i) => (
              <NftCard
                key={i}
                image={v.image}
                name={v.name}
                tokenId={v.tokenId!}
              />
            ))}
          </li>
        </ul>
      </div>
      <div ref={detectRef} className="bg-white h-2"></div>
    </div>
  );
};

export default Home;

// getTotalSupply를 가져와야 함 필요한 것 mintNftContract, TotalNFT를 쓰기위한 useState
// NFT 전체를 얻어야함 getNFTs 함수 만들 예정, 필요한 것 MetadataArray(), metadataURI => 찾기위해 searchTokenId 사용
//
