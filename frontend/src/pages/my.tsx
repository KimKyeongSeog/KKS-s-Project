import { FC, useEffect, useState } from "react";
import MintModal from "../components/MintModal";
import { NftMetadata, OutletContext } from "../types";
import { useNavigate, useOutletContext } from "react-router-dom";
import axios from "axios";
import MyNftCard from "../components/MyNftCard";
import { SALE_NFT_CONTRACT } from "../abis/contractAddress";

const My: FC = () => {
  const [isOpen, setIsOpen] = useState<Boolean>(false);
  const [metadataArray, setMetadataArray] = useState<NftMetadata[]>([]);
  const [saleStatus, setSaleStatus] = useState<boolean>(false);

  const { mintNftContract, account } = useOutletContext<OutletContext>();

  const navigate = useNavigate();

  const [lightHover, setLightHover] = useState<boolean>(false);
  const onMouseEnter = () => {
    setLightHover(true);
  };

  const onMouseLeave = () => {
    setLightHover(false);
  };

  const onClickMintModal = () => {
    if (!account) return;

    setIsOpen(true);
  };

  const getMyNFTs = async () => {
    try {
      if (!account || !mintNftContract) return;

      const balance = await mintNftContract.methods
        // @ts-expect-error
        .balanceOf(account)
        .call();

      let temp: NftMetadata[] = [];

      for (let i = 0; i < Number(balance); i++) {
        const tokenId = await mintNftContract.methods
          // @ts-expect-error
          .tokenOfOwnerByIndex(account, i)
          .call();

        const metadataURI: string = await mintNftContract.methods
          // @ts-expect-error
          .tokenURI(Number(tokenId))
          .call();
        const response = await axios.get(metadataURI);

        temp.push({ ...response.data, tokenId: Number(tokenId) });
      }

      setMetadataArray(temp);
    } catch (error) {
      console.log(error);
    }
  };

  const getSaleStatus = async () => {
    try {
      const isApproved: boolean = await mintNftContract.methods
        //@ts-expect-error
        .isApprovedForAll(account, SALE_NFT_CONTRACT)
        .call();

      setSaleStatus(isApproved);
    } catch (error) {
      console.log(error);
    }
  };

  const onClickSaleStatus = async () => {
    try {
      const response = await mintNftContract.methods
        //@ts-expect-error
        .setApprovalForAll(SALE_NFT_CONTRACT, !saleStatus)
        .send({ from: account });

      setSaleStatus(!saleStatus);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getMyNFTs();
  }, [mintNftContract, account]);

  useEffect(() => {
    if (account) return;

    navigate("/");
  }, [account]);

  useEffect(() => {
    if (!account) return;

    getSaleStatus();
  }, [account]);

  return (
    <div>
      <div className="bg-black py-8 h-36 w-full mt-32 z-10">
        <h1 className="mt-6 font-LOTTE text-2xl text-white text-center border-2 w-48 mx-auto">
          MY NFTs
        </h1>
      </div>

      <div>
        <div className="flex justify-between">
          <div
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            className=" h-16 w-36 m-12 font-LOTTE bg-gray-500 bg-opacity-70 rounded-full"
          >
            {lightHover ? (
              <div className="flex">
                <img
                  className="h-16"
                  src={`./images/Lighton.png`}
                  alt="light"
                />
                <button
                  className="text-2xl text-yellow-400"
                  onClick={onClickMintModal}
                >
                  Mint
                </button>
              </div>
            ) : (
              <div className="flex">
                <img
                  className="h-16"
                  src={`./images/Lightoff.png`}
                  alt="light"
                />
                <button className="text-2xl " onClick={onClickMintModal}>
                  Mint
                </button>
              </div>
            )}
          </div>

          <div className=" h-16 w-32 m-12 font-LOTTE bg-gray-500 bg-opacity-70 rounded-full">
            <button
              onClick={onClickSaleStatus}
              className={`pt-[6px] hover:text-yellow-400 active:text-black ${
                saleStatus ? `text-yellow-400` : `text-black`
              }`}
            >
              Sale Approved
            </button>
          </div>
        </div>
        <ul className="px-8 grid grid-cols-3 gap-8 max-w-screen-lg mx-auto">
          {metadataArray?.map((v, i) => (
            <MyNftCard
              key={i}
              image={v.image}
              name={v.name}
              tokenId={v.tokenId!}
              saleStatus={saleStatus}
            />
          ))}
        </ul>
        <div>
          {isOpen && (
            <MintModal
              setIsOpen={setIsOpen}
              metadataArray={metadataArray}
              setMetadataArray={setMetadataArray}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default My;
