import { InjectedConnector } from "@web3-react/injected-connector";
import { NetworkConnector } from "@web3-react/network-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { LedgerConnector } from "@web3-react/ledger-connector";
import Web3 from "web3";
import getNodeUrl from "./getRpcUrl";

const POLLING_INTERVAL = 12000;
const rpcUrl = getNodeUrl();
const chainId = process.env.REACT_APP_CHAIN_ID;

const RPC_URLS = {
  137: rpcUrl,
  80001: process.env.REACT_APP_TESTNET_NODE,
};

export const injected = new InjectedConnector({
  supportedChainIds: [137, 80001],
});

export const walletconnect = new WalletConnectConnector({
  rpc: { [chainId]: rpcUrl },
  qrcode: true,
  pollingInterval: POLLING_INTERVAL,
});

export const network = new NetworkConnector({
  urls: { 137: RPC_URLS[137], 80001: RPC_URLS[80001] },
  defaultChainId: 137,
});

export const ledger = new LedgerConnector({
  chainId,
  url: rpcUrl,
  pollingInterval: POLLING_INTERVAL,
});

export const connectorsByName = {
  Injected: injected,
  WalletConnect: walletconnect,
  Ledger: ledger,
  Network: network,
};

export const getLibrary = (provider) => {
  return new Web3(provider);
};
