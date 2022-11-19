import React, { createContext, useContext } from "react";
import { StoreContext } from "../store";

// @ts-ignore
import WinSound from "assets/sounds/win.mp3";
// @ts-ignore
import LoseSound from "assets/sounds/lose.mp3";

import useSound from "use-sound";

const useSounds = () => {
  const [winPlay] = useSound(WinSound);
  const [losePlay] = useSound(LoseSound);
  const playGameResult = (result: boolean) => {
    if (result) {
      winPlay();
    } else {
      losePlay();
    }
  };
  return playGameResult;
};

export default useSounds;
