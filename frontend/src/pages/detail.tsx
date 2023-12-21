import { FC, useEffect, useState } from "react";
import { NftMetadata, OutletContext } from "../types";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import axios from "axios";

const Detail: FC = () => {
  const { tokenId } = useParams();

  const [metadata, setMetadata] = useState<NftMetadata>();

  const { mintNftContract } = useOutletContext<OutletContext>();

  const navigate = useNavigate();

  const getMyNFT = async () => {
    try {
      if (!mintNftContract) return;

      const metadataURI: string = await mintNftContract.methods
        // @ts-expect-error
        .tokenURI(tokenId)
        .call();

      const response = await axios.get(metadataURI);

      setMetadata(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getMyNFT();
  }, [mintNftContract]);

  return (
    <div className="">
      <div>
        <button
          className="mt-48 ml-8 h-16 w-36 text-2xl font-LOTTE bg-gray-500 bg-opacity-70 hover:text-yellow-400 rounded-full"
          onClick={() => navigate(-1)}
        >
          Back
        </button>
      </div>
      <div className="mt-4">
        {metadata && (
          <div>
            <div className=" w-[360px] mx-auto text-center border-black border-4">
              <img
                className="w-full p-8 bg-white bg-opacity-90"
                src={metadata.image}
                alt={metadata.name}
              />
              <div className="bg-white bg-opacity-90 border-t-4 border-black text-3xl font-bold font-gang pb-2">
                {metadata.description}
              </div>
              <ul className="bg-white bg-opacity-90">
                {metadata.attributes.map((v, i) => (
                  <li className="semi-bold font-gang text-2xl" key={i}>
                    <span>{v.trait_type}</span>
                    <span>{v.value}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="w-full mt-12 text-center text-white text-4xl font-LOTTE p-4 bg-gradient-to-r from-red-500 via-green-500 to-blue-500">
              {metadata.name}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Detail;

// 이미지 클릭 시 디테일 정보 확인 + 클릭한 NFT만 불러오기
// 이미지 클릭 시 useParams를 사용하여 tokenId 출력
// 뒤로버튼 사용하면 돌아가게 함 useNavigate
// 맵함수를 통한 NFT의 정보 확인 예정
