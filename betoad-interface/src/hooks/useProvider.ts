import React, { useEffect, useState, useRef } from "react";
import { ethers } from "ethers";

function useProvider() {
  const ref = useRef(new ethers.providers.Web3Provider(ethereum));
  return ref.current;
}

export default useProvider;
