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
    <div>
      <header className=" py-6 px-12 flex justify-between bg-black font-LOTTE">
        <div className="flex text-white text-xl gap-4 ">
          <Link to="/">Home</Link>
          <div className="mt-[3px] w-1 rounded-2xl h-6 bg-white"></div>
          <Link to="/my">My</Link>
          <div className="mt-[3px] w-1 rounded-2xl h-6 bg-white"></div>
          <Link to="/sale">Sale</Link>
        </div>

        <div className="text-semibold text-white text-xl">
          {account ? (
            <div>
              <span>
                {account.substring(0, 7)}...
                {account.substring(account.length - 5)}
              </span>
              <button onClick={() => setAccount("")}>: Log out</button>
            </div>
          ) : (
            <div>
              <button onClick={onClickMetaMask}>MetaMask Login</button>
            </div>
          )}
        </div>
      </header>
    </div>
  );
};

export default Header;
