import { Server, WebSocketServer } from 'ws';
import { handleMessage } from '../constrollers/gameController';
import { Session } from './components/session';
import { RoomsModel, Sessions } from '../models';
import { getPlayer } from '../constrollers/playerController';
import { removeUserFromRoom } from '../constrollers/roomController';
import { removeUserFromWinners } from '../constrollers/winnerController';

export default class WSS {
  private port: number;
  private server: Server;

  constructor(port: number) {
    this.port = port;
    this.server = new WebSocketServer({ port });
  }
  start() {
    this.server.on('listening', () => {
      console.log(`WS Server is listening on port ${this.port}`);
    });
    this.server.on('connection', (ws) => {
      const session = new Session();
      Sessions.add(session);
      ws.on('error', console.error);
      ws.on('message', (msg) => {
        const message = JSON.parse(msg.toString());
        let response = handleMessage(ws, message, session);
      });
      ws.on('close', () => {
        const player = getPlayer(session.playerIndex);
        console.log(
          `Session ${session.id}${player ? `, ${player.name}` : ''} closed`
        );
        Sessions.delete(session);
        removeUserFromRoom(session);
        removeUserFromWinners(session.playerName)
      });
    });
  }
}
