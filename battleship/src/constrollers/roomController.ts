import { IPlayer, IRoom } from '../interfaces';
import { RoomsModel, GamesModel } from '../models';
import { getMessage } from '../ws_server/components/messages';
import { Room } from '../ws_server/components/room';
import { Session } from '../ws_server/components/session';

export const createRoom = (session: Session) => {
  const newRoom = new Room();
  newRoom.roomUsers.push({
    name: session.playerName,
    index: session.playerIndex,
  });
  return newRoom;
};

export const manageRooms = (session: Session) => {
  let result: IRoom[] = [];
  const availableRooms = getAvailableRooms();
  if (availableRooms.length !== 0) {
    RoomsModel.find(
      (room) => room.roomId === availableRooms[0].roomId
    )?.roomUsers.push({
      name: session.playerName,
      index: session.playerIndex,
    });
  }
  return result;
};

export const getAvailableRooms = () => {
  let data: IRoom[] = [];
  RoomsModel.forEach((room: IRoom) => {
    if (room.roomUsers.length === 1) {
      data.push(room);
    }
  });
  return data;
};

export const findRoomByUser = (session: Session) => {
  let result;
  if (RoomsModel.length !== 0) {
    result = RoomsModel.find((room: IRoom) =>
      room.roomUsers.some((user) => user.index === session.playerIndex)
    );
  }
  return result;
};

export const removeUserFromRoom = (session: Session) => {
  const usersRoom = findRoomByUser(session);
  if (usersRoom) {
    const userIdx = usersRoom.roomUsers.findIndex(
      (user) => user.index === session.playerIndex
    );
    const roomIdx = RoomsModel.findIndex(
      (room) => room.roomId === usersRoom.roomId
    );
    RoomsModel[roomIdx].roomUsers.splice(userIdx, 1);
    if (RoomsModel[roomIdx].roomUsers.length === 0)
      RoomsModel.splice(roomIdx, 1);
    console.log('removed', RoomsModel[roomIdx]);
  }
};
