export interface IPlayer {
  name: string;
  password?: string;
  index: string;
}

export interface IMessage {
  type: string;
  data: any;
  id: number;
}

export interface IWinner {
  name: string;
  wins: number;
}

export interface IRoom {
  roomId: string;
  roomUsers: IPlayer[];
}

export interface IPosition {
  x: number;
  y: number;
}

export enum IShipType {
  Small = 'small',
  Medium = 'medium',
  Large = 'large',
  huge = 'huge',
}

export interface IShip {
  position: IPosition;
  direction: boolean;
  length: number;
  type: IShipType;
}
