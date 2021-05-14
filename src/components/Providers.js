import React from "react";
import { Web3ReactProvider } from "@web3-react/core";
import { getLibrary } from "../utils/web3React";

export default function Providers({ children }) {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>{children}</Web3ReactProvider>
  );
}
