import React, { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { fromWei } from "web3-utils";

export default function Balance() {
  const { account, library, chainId } = useWeb3React();

  const [balance, setBalance] = useState();

  useEffect(() => {
    console.log(account, library);
    if (!!account && !!library) {
      let stale = false;

      library// .getBalance(account)
      .eth
        .getBalance(account)
        .then((balance) => {
          if (!stale) {
            setBalance(balance);
          }
        })
        .catch(() => {
          if (!stale) {
            setBalance(null);
          }
        });

      return () => {
        stale = true;
        setBalance(undefined);
      };
    }
  }, [account, library, chainId]);

  return (
    <>
      <span>Balance</span>
      <span role="img" aria-label="gold">
        💰
      </span>
      <span>
        {balance === null
          ? "Error"
          : balance
          ? `Ξ${fromWei(String(balance))}`
          : ""}
      </span>
    </>
  );
}
