import React, { createContext, useContext } from "react";
import { StoreContext } from "../store";

const useStore = () => {
  let store = useContext(StoreContext);
  return store;
};

export default useStore;
