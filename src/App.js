import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Spinner from "./components/Spinner";
import { useWeb3React } from "@web3-react/core";
import { connectorsByName } from "./utils/web3React";
import getErrorMessage from "./utils/error";
import { useEagerConnect, useInactiveListener } from "./hooks";

function App() {
  const { connector, chainId, activate, deactivate, active, error } =
    useWeb3React();

  const [activatingConnector, setActivatingConnector] = useState();

  useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined);
    }
  }, [activatingConnector, connector]);

  // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
  const triedEager = useEagerConnect();

  // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
  useInactiveListener(!triedEager || !!activatingConnector);

  return (
    <>
      <Header />
      <hr style={{ margin: "2rem" }} />
      <div
        style={{
          display: "grid",
          gridGap: "1rem",
          gridTemplateColumns: "1fr 1fr",
          maxWidth: "20rem",
          margin: "auto",
        }}
      >
        {Object.keys(connectorsByName).map((name) => {
          const currentConnector = connectorsByName[name];
          const activating = currentConnector === activatingConnector;
          const connected = currentConnector === connector;
          const disabled =
            !triedEager || !!activatingConnector || connected || !!error;

          return (
            <button
              style={{
                height: "3rem",
                borderRadius: "1rem",
                borderColor: activating
                  ? "orange"
                  : connected
                  ? "green"
                  : "unset",
                cursor: disabled ? "unset" : "pointer",
                position: "relative",
              }}
              disabled={disabled}
              key={name}
              onClick={() => {
                setActivatingConnector(currentConnector);
                activate(connectorsByName[name]);
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "0",
                  left: "0",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  color: "black",
                  margin: "0 0 0 1rem",
                }}
              >
                {activating && (
                  <Spinner
                    color={"black"}
                    style={{ height: "25%", marginLeft: "-1rem" }}
                  />
                )}
                {connected && (
                  <span role="img" aria-label="check">
                    ✅
                  </span>
                )}
              </div>
              {name}
            </button>
          );
        })}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {(active || error) && (
          <button
            style={{
              height: "3rem",
              marginTop: "2rem",
              borderRadius: "1rem",
              borderColor: "red",
              cursor: "pointer",
            }}
            onClick={() => {
              deactivate();
            }}
          >
            Deactivate
          </button>
        )}

        {!!error && (
          <h4 style={{ marginTop: "1rem", marginBottom: "0" }}>
            {getErrorMessage(error)}
          </h4>
        )}
      </div>

      <hr style={{ margin: "2rem" }} />

      <div
        style={{
          display: "grid",
          gridGap: "1rem",
          gridTemplateColumns: "fit-content",
          maxWidth: "20rem",
          margin: "auto",
        }}
      >
        {!!(connector === connectorsByName["Network"] && chainId) && (
          <button
            style={{
              height: "3rem",
              borderRadius: "1rem",
              cursor: "pointer",
            }}
            onClick={() => {
              connector.changeChainId(chainId === 1 ? 4 : 1);
            }}
          >
            Switch Networks
          </button>
        )}
        {connector === connectorsByName["WalletConnect"] && (
          <button
            style={{
              height: "3rem",
              borderRadius: "1rem",
              cursor: "pointer",
            }}
            onClick={() => {
              connector.close();
            }}
          >
            Kill WalletConnect Session
          </button>
        )}
      </div>
    </>
  );
}

export default App;
