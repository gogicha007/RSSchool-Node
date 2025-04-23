import { v4 as uuidv4 } from 'uuid';

export class Player {
  name: string;
  password: string;
  index: string;

  constructor(name: string, password: string) {
    this.name = name;
    this.password = password;
    this.index = uuidv4();
  }
}
