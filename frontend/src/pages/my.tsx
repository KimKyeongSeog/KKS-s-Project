import { FC, useState } from "react";
import MintModal from "../components/MintModal";
import { NftMetadata, OutletContext } from "../types";
import { useOutletContext } from "react-router-dom";

const My: FC = () => {
  const [isOpen, setIsOpen] = useState<Boolean>(false);
  const [metadataArray, setMetadataArray] = useState<NftMetadata[]>([]);
  const { mintNftContract, account } = useOutletContext<OutletContext>();

  const onClickMintModal = () => {
    if (!account) return;

    setIsOpen(true);
  };

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
