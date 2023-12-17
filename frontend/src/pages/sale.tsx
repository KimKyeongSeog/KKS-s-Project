import { FC } from "react";
import SaleNftCard from "../components/SaleNftCard";

const Sale: FC = () => {
  return (
    <div className="bg-red-100">
      <div className="bg-black py-8 h-36 w-full mt-32 z-10">
        <h1 className="mt-6 font-LOTTE text-2xl text-white text-center border-2 w-48 mx-auto">
          Sale
        </h1>
        <ul>
          <SaleNftCard />
        </ul>
      </div>
    </div>
  );
};

export default Sale;
