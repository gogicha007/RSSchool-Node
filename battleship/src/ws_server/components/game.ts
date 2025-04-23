import { IPlayer } from '../../interfaces';
import { v4 as uuidv4 } from 'uuid';

export class Room {
  roomId: string;
  roomUsers: IPlayer[];

  constructor() {
    (this.roomId = uuidv4()), (this.roomUsers = []);
  }
}
