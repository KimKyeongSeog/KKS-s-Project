import { FC, useState } from "react";
import { Link } from "react-router-dom";

export interface NftCardProps {
  image: string;
  name: string;
  tokenId: number;
}

const NftCard: FC<NftCardProps> = ({ image, name, tokenId }) => {
  const [isHover, setIsHover] = useState<boolean>(false);

  const onMouseEnter = () => {
    setIsHover(true);
  };

  const onMouseLeave = () => {
    setIsHover(false);
  };
  return (
    <Link to={`/detail/${tokenId}`}>
      <li
        className="relative"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <div className="border-4 w-64  bg-white bg-opacity-90 m-8 p-4 border-black border-opacity-90">
          <img className="" src={image} alt={name} />
          <div className="font-semibold font-gang text-2xl text-center mt-4">
            {name}
          </div>
          {isHover && (
            <div className="absolute top-0 ml-8 left-0 w-64 h-full bg-white bg-opacity-70 text-center text-2xl py-32 font-LOTTE">
              Detail...
            </div>
          )}
        </div>
      </li>
    </Link>
  );
};

export default NftCard;
