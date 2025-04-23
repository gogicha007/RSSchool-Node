import { IPlayer, IMessage } from '../interfaces';
import { Player } from '../ws_server/components/player';
import { PlayerModel } from '../models';
import { playerExistInSession } from './sessionController';
import { Session } from '../ws_server/components/session';
import { Sessions } from '../models';
import { updateWinners } from './winnerController';

export const registerPlayer = (message: IMessage, session: Session) => {
  const { name, password } = JSON.parse(message.data);
  const playerExist = PlayerModel.find(
    ({ name: existingName }) => existingName === name
  );
  let result = {};
  if (playerExist) {
    const { name, index } = playerExist;
    if (playerExist.password === password) {
      if (playerExistInSession(Sessions as Set<Session>, index)) {
        console.log('have session');
        result = {
          name,
          index,
          error: true,
          errorText: 'Player active in current session',
        };
      } else {
        session.playerName = name;
        session.playerIndex = index;
        result = {
          name,
          index,
          error: false,
          errorText: '',
        };
      }
    } else {
      result = {
        name,
        index,
        error: true,
        errorText: 'Wrong password!',
      };
    }
  } else {
    const player = new Player(name, password) as IPlayer;
    session.playerName = player.name;
    session.playerIndex = player.index;
    PlayerModel.push(player as IPlayer);
    updateWinners(name);
    result = {
      name: player.name,
      index: player.index,
      error: false,
      errorText: '',
    };
  }
  return result;
};

export const getPlayer = (id: string) => {
  return PlayerModel.find((player) => player.index === id);
};
