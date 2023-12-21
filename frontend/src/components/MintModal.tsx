import { Dispatch, FC, SetStateAction, useState } from "react";
import { NftMetadata, OutletContext } from "../types";
import { useOutletContext } from "react-router-dom";
import axios from "axios";

interface MintModalProps {
  setIsOpen: Dispatch<SetStateAction<Boolean>>;
  metadataArray: NftMetadata[];
  setMetadataArray: Dispatch<SetStateAction<NftMetadata[]>>;
}

const MintModal: FC<MintModalProps> = ({
  setIsOpen,
  metadataArray,
  setMetadataArray
}) => {
  const { mintNftContract, account } = useOutletContext<OutletContext>();

  const [metadata, setMetadata] = useState<NftMetadata>();

  const [isLoading, setIsLoading] = useState<boolean>();

  const onClickMint = async () => {
    try {
      if (!mintNftContract || !account) return;

      setIsLoading(true);

      await mintNftContract.methods.mintNFT().send({ from: account });

      // @ts-expect-error
      const balance = await mintNftContract.methods.balanceOf(account).call();

      const tokenId = await mintNftContract.methods
        // @ts-expect-error
        .tokenOfOwnerByIndex(account, Number(balance) - 1)
        .call();

      const metadataURI: string = await mintNftContract.methods
        // @ts-expect-error
        .tokenURI(Number(tokenId))
        .call();
      const response = await axios.get(metadataURI);

      setMetadata(response.data);
      setMetadataArray([response.data, ...metadataArray]);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };
  return (
    <div className="fixed top-8 left-0 w-full h-full bg-white bg-opacity-50 flex flex-col justify-center items-center">
      <div className="p-8 bg-white border-4 border-black">
        {metadata ? (
          <>
            <div className="w-72 text-center">
              <img
                className="w-72 h-72"
                src={metadata.image}
                alt={metadata.name}
              />
              <div className="font-semibold mt-4 text-center font-gang text-4xl">
                {metadata.name}
              </div>
              <div className="mx-2 text-center font-gang text-2xl mb-4">
                {metadata.description}
              </div>
              <ul className="mt-1 flex flex-wrap gap-1">
                {metadata.attributes.map((v, i) => (
                  <li className="font-gang text-2xl flex" key={i}>
                    <span className="font-semibold">{v.trait_type}</span>
                    <span> : {v.value}</span>
                  </li>
                ))}
              </ul>
              <button
                className="font-LOTTE text-3xl border-b-2 border-black mt-4 hover:text-yellow-400 active:text-black"
                onClick={() => setIsOpen(false)}
              >
                Close
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center">
            <div className="font-gang text-3xl">
              {isLoading
                ? "Loading..."
                : "Would you like to mint your own NFT?"}
            </div>

            <div
              className={`font-LOTTE text-3xl border-b-2 border-black mt-4 hover:text-yellow-400 active:text-black
            ${isLoading ? `hidden` : `visible`}
            `}
            >
              <button onClick={onClickMint}>Agree</button>
            </div>
            <div className="font-LOTTE text-3xl border-b-2 border-black mt-4 hover:text-yellow-400">
              <button onClick={() => setIsOpen(false)}>Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MintModal;
