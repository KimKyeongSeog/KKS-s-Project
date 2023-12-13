import { FC, useEffect, useState } from "react";
import MintModal from "../components/MintModal";
import { NftMetadata, OutletContext } from "../types";
import { useOutletContext } from "react-router-dom";
import axios from "axios";

const My: FC = () => {
  const [isOpen, setIsOpen] = useState<Boolean>(false);
  const [metadataArray, setMetadataArray] = useState<NftMetadata[]>([]);
  const { mintNftContract, account } = useOutletContext<OutletContext>();

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

      for (let i = 0; Number(balance); i++) {
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

  useEffect(() => {
    getMyNFTs();
  }, [mintNftContract, account]);
  return (
    <div className="">
      <div className="grow">
        <div className="text-right p-2">
          <button
            className="bg-blue-100 grow py-2 px-4"
            onClick={onClickMintModal}
          >
            Mint
          </button>
        </div>
        <div className="bg-green-300 text-center py-8">
          <h1 className=" font-bold text-2xl">My NFTs</h1>
        </div>
        <ul>card</ul>
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
