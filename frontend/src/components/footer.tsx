import { FC } from "react";

const Footer: FC = () => {
  return (
    <div className="text-white mt-20 bg-black w-full h-64 flex justify-between items-center p-16">
      <div className=" font-LOTTE">
        <div className="text-4xl">Cartoon NFT SHOP</div>
        <div className="text-4xl pt-8">KKS's Project</div>
      </div>
      <div className="font-gang text-2xl">
        <div className="mt-6">Likelion BlockChain School 4Th</div>
        <div className="mt-6">제출자 : 김경석</div>
        <div className="mt-6">제출일 : 2023.12.18</div>
      </div>
    </div>
  );
};

export default Footer;
