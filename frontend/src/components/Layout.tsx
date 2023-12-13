import { FC, useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import { useSDK } from "@metamask/sdk-react";

const Layout: FC = () => {
  const [account, setAccount] = useState<string>("");

  const { sdk } = useSDK();
  return (
    <div className="bg-red-100">
      <Header account={account} setAccount={setAccount} />
      <Outlet />
    </div>
  );
};

export default Layout;
