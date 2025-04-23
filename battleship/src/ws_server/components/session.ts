import { v4 as uuidv4 } from 'uuid';

export class Session {
  id: string;
  playerName: string;
  playerIndex: string;

  constructor() {
    this.id = uuidv4();
    this.playerName = '';
    this.playerIndex = ''
  }
}
