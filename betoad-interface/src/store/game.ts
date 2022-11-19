import { makeAutoObservable } from "mobx";
export default class GameStore {
  rootStore;
  game: number;
  constructor(root: any) {
    makeAutoObservable(this);
    this.rootStore = root;
    this.game = 0;
  }
}
