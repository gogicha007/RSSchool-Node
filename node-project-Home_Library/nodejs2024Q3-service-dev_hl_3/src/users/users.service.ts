import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class UserService {
  constructor(private readonly dbService: DatabaseService) {}

  async create(createUser: CreateUserDto) {
    const id = uuidv4();
    const createTime = new Date().getTime();
    const newUser = {
      id: id,
      login: createUser.login,
      password: createUser.password,
      version: 1,
      createdAt: createTime.toString(),
      updatedAt: createTime.toString(),
    };
    await this.dbService.user.create({
      data: newUser,
    });

    const res = {
      id: id,
      login: newUser.login,
      version: newUser.version,
      createdAt: +newUser.createdAt,
      updatedAt: +newUser.updatedAt,
    };
    return res;
  }

  async findAll() {
    const allUsers = await this.dbService.user.findMany();
    const result = allUsers.map((user) => {
      const userCopy = JSON.parse(JSON.stringify(user));
      delete userCopy.password;
      return userCopy;
    });
    return result;
  }

  async findOne(id: string) {
    const user = await this.dbService.user.findUnique({
      where: {
        id,
      },
    });
    if (!user) throw new NotFoundException('User not found');
    const res = {
      id: user.id,
      login: user.login,
      version: user.version,
      createdAt: +user.createdAt,
      updatedAt: +user.updatedAt,
    };
    return res;
  }

  async update(id: string, updatedPassword: UpdatePasswordDto) {
    const theUser = await this.dbService.user.findUnique({
      where: {
        id,
      },
    });
    if (!theUser) throw new NotFoundException('User not found');
    if (theUser.password !== updatedPassword.oldPassword)
      throw new HttpException('Old password is wrong', HttpStatus.FORBIDDEN);
    const theNow = new Date().getTime();
    await this.dbService.user.update({
      where: {
        id,
      },
      data: {
        password: updatedPassword.newPassword,
        version: theUser.version + 1,
        updatedAt: theNow.toString(),
      },
    });

    return this.findOne(id);
  }

  async delete(id: string) {
    const removedUser = await this.findOne(id);
    if (!removedUser) throw new NotFoundException('User not found');
    await this.dbService.user.delete({
      where: {
        id,
      },
    });
    return removedUser;
  }
}
