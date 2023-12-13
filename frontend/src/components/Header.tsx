import { useSDK } from "@metamask/sdk-react";
import { Dispatch, FC, SetStateAction } from "react";
import { Link } from "react-router-dom";

interface HeaderProps {
  account: string;
  setAccount: Dispatch<SetStateAction<string>>;
}

const Header: FC<HeaderProps> = ({ account, setAccount }) => {
  const { sdk } = useSDK();

  const onClickMetaMask = async () => {
    try {
      const accounts: any = await sdk?.connect();

      setAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <header className="p-2 flex justify-between">
      <div className="flex gap-4">
        <Link to="/">Home</Link>
        <Link to="/my">My</Link>
        <Link to="/sale">Sale</Link>
      </div>
      <div className="bg-red-100">
        {account ? (
          <div>
            <span>
              {account.substring(0, 7)}...
              {account.substring(account.length - 5)}
            </span>
            <button onClick={() => setAccount("")}>Log out</button>
          </div>
        ) : (
          <div>
            <button onClick={onClickMetaMask}>MetaMask Login</button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
