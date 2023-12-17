import { FC, useEffect, useState } from "react";
import { NftMetadata, OutletContext } from "../types";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import axios from "axios";

const Detail: FC = () => {
  const [metadata, setMetadata] = useState<NftMetadata>();

  const { tokenId } = useParams();

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
    <div className="bg-set">
      <div>
        <button
          className="mt-40 ml-8 h-16 w-36 text-2xl font-LOTTE bg-gray-500 bg-opacity-70 hover:text-yellow-400 rounded-full"
          onClick={() => navigate(-1)}
        >
          Back
        </button>
      </div>
      <div className="mt-4">
        {metadata && (
          <div>
            <div className=" w-[480px] mx-auto text-center border-black border-dashed border-4">
              <img
                className="w-full p-8"
                src={metadata.image}
                alt={metadata.name}
              />
              <div className="bg-gray-200 bg-opacity-90 border-t-4 border-dashed border-black text-xl font-bold pb-2">
                {metadata.description}
              </div>
              <ul className="bg-gray-200 bg-opacity-90">
                {metadata.attributes.map((v, i) => (
                  <li className="semi-bold" key={i}>
                    <span>{v.trait_type}</span>
                    <span>{v.value}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="w-full bottom-0 text-center text-white text-4xl font-LOTTE bg-black p-4">
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
