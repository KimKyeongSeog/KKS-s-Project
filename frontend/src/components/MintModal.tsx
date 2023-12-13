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
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div>
      <div>
        {metadata ? (
          <div>
            <img src={metadata.image} alt={metadata.name} />
            <div>{metadata.name}</div>
            <div>{metadata.description}</div>
            <ul>
              {metadata.attributes.map((v, i) => (
                <li key={i}>
                  <span>{v.trait_type}</span>
                  <span> : {v.value}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div>{isLoading ? "Loading..." : "NFT를 민팅하시겠습니까?"}</div>
            <div className="border-orange-500 border-4 rounded-2xl text-center mt-4 w-16 ">
              <button onClick={onClickMint}>Agree</button>
            </div>
          </div>
        )}
        <div className="border-orange-500 border-4 rounded-2xl text-center mt-4 w-16 hover:text-gray-500 mx-auto">
          <button onClick={() => setIsOpen(false)}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default MintModal;
