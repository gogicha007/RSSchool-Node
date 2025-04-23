import { WinnerModel } from '../models';

export const updateWinners = (name: string) => {
  const winnerExist = getWinner(name);
  if (!winnerExist) {
    WinnerModel.push({ name: name, wins: 0 });
  }
};

export const getWinner = (name: string) => {
  return WinnerModel.find((player) => player.name === name);
};

export const removeUserFromWinners = (name: string) => {
  const idx = WinnerModel.findIndex(user => user.name)
  WinnerModel.splice(idx,1)
}