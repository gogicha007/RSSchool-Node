import { IMessage } from '../interfaces';
import { Session } from '../ws_server/components/session';
import { v4 as uuidv4 } from 'uuid';
import { registerPlayer } from './playerController';
import {
  createRoom,
  getAvailableRooms,
  findRoomByUser,
} from './roomController';
import { WebSocket } from 'ws';
import { WinnerModel, RoomsModel, GamesModel } from '../models';
import { getMessage } from '../ws_server/components/messages';
import { updateWinners } from './winnerController';

export const handleMessage = (
  ws: WebSocket,
  message: IMessage,
  session: Session
) => {
  let response, winnerBuffer;
  switch (message.type) {
    case 'reg':
      const playerData = registerPlayer(message, session);
      const regBuffer = getMessage('reg', playerData);
      ws.send(regBuffer);

      const availableRooms = getAvailableRooms();
      const roomsBuffer = getMessage('update_room', availableRooms);
      ws.send(roomsBuffer);

      updateWinners(session.playerName);
      winnerBuffer = getMessage('update_winners', WinnerModel);
      ws.send(winnerBuffer);
      break;
    case 'create_room':
      const isUserInRoom = findRoomByUser(session);
      console.log(RoomsModel);
      if (isUserInRoom) {
        console.log('The Player already has a room...');
      } else {
        const roomData = createRoom(session);
        RoomsModel.push(roomData);
      }

      const rooms = getAvailableRooms();
      const theBuffer = getMessage('update_room', rooms);
      ws.send(theBuffer);

      updateWinners(session.playerName);
      winnerBuffer = getMessage('update_winners', WinnerModel);
      ws.send(winnerBuffer);
      break;
    case 'add_user_to_room':
      const sourceRoomId = JSON.parse(message.data).indexRoom;
      const sourceRoom = RoomsModel.find(
        (room) => room.roomId === sourceRoomId
      );
      if (
        sourceRoom?.roomUsers.find((user) => user.index === session.playerIndex)
      ) {
        console.log('Cannot add same player twice..');
        break;
      }
      if (sourceRoom?.roomUsers.length === 1) {
        RoomsModel.find((room) => room.roomId === sourceRoomId)?.roomUsers.push(
          {
            name: session.playerName,
            index: session.playerIndex,
          }
        );
        const idx = RoomsModel.findIndex(
          (room) =>
            room.roomUsers.length === 1 &&
            room.roomUsers.some((user) => user.index === session.playerIndex)
        );
        if (idx !== -1) RoomsModel.splice(idx, 1);
        console.log(RoomsModel);
        // start game
        const gameId = uuidv4();
        GamesModel.push(gameId);
        sourceRoom.roomUsers.forEach((user, idx) => {
          const msg = getMessage('create_game', {
            idGame: gameId,
            idPlayer: user.index,
          });
          console.log(msg);
          ws.send(msg);
        });
        // update rooms
        const rooms = getAvailableRooms();
        const theBuffer = getMessage('update_room', rooms);
        ws.send(theBuffer);
      } else {
        console.log('No room to add...');
        // update rooms
        const rooms = getAvailableRooms();
        const theBuffer = getMessage('update_room', rooms);
        ws.send(theBuffer);
      }
      
      updateWinners(session.playerName);
      winnerBuffer = getMessage('update_winners', WinnerModel);
      ws.send(winnerBuffer);
      break;
    case 'add_ships':
      console.log('add_ships');
      console.log(message);
      break;
    case 'attack':
      console.log('attack');
      break;
    case 'randomAttack':
      break;
    default:
      console.log('default');
      break;
  }
  return response;
};
