import { FC } from "react";

const My: FC = () => {
  return (
    <div className="">
      <div className="grow">
        <div className="text-right p-2">
          <button className="bg-blue-100 grow py-2 px-4">Mint</button>
        </div>
        <div className="bg-green-300 text-center py-8">
          <h1 className=" font-bold text-2xl">My NFTs</h1>
        </div>
      </div>
    </div>
  );
};

export default My;
