import React, { createContext } from "react";
import RootStore from "./root";

const store = new RootStore();
export const StoreContext = createContext(store);

const StoreProvider = ({ children, rpc }) => {
  const store = new RootStore(rpc);
  return (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  );
};
export default StoreProvider;
