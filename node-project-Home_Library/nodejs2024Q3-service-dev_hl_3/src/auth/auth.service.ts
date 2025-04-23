import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginUserDto } from './dto/LoginUser.dto';
import { UserService } from 'src/users/users.service';
import { DatabaseService } from 'src/database/database.service';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly dbService: DatabaseService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(createUserDto: CreateUserDto) {
    createUserDto.password = await this.hashData(createUserDto.password);
    return await this.userService.create(createUserDto);
  }

  async login(user: LoginUserDto) {
    const usersArr = await this.dbService.user.findMany({
      where: {
        login: user.login,
      },
    });
    if (usersArr.length === 0)
      throw new HttpException(
        'no user with such login, password match actual one',
        HttpStatus.FORBIDDEN,
      );

    const promisePasswords = async (arr: User[]) => {
      const results = await Promise.all(
        arr.map((val: User) =>
          this.comparePasswords(user.password, val.password),
        ),
      );
      return arr.filter((_, idx) => results[idx]);
    };

    const matchingPasswordsArr = await promisePasswords(usersArr);
    if (matchingPasswordsArr.length === 0)
      throw new HttpException(
        'no user with such login, password match actual one',
        HttpStatus.FORBIDDEN,
      );
    const logUser = matchingPasswordsArr[0];

    //generate tokens
    const tokens = await this.generateJwt(logUser.id, logUser.login);
    await this.updateRtHash(logUser.id, tokens.refreshToken);
    return tokens;
  }

  async refresh(token: string) {
    const payload = this.jwtService.verify(token, {
      secret: process.env.JWT_SECRET_REFRESH_KEY,
    });
    const { login, sub } = payload;

    const tokens = await this.generateJwt(sub, login);
    await this.updateRtHash(sub, tokens.refreshToken);

    return tokens;
  }

  async updateRtHash(userId: string, rt: string) {
    const hash = await this.hashData(rt);
    await this.dbService.user.update({
      where: {
        id: userId,
      },
      data: {
        refresh_token: hash,
      },
    });
  }

  async generateJwt(id: string, login: string) {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: id,
          username: login,
        },
        {
          secret: process.env.JWT_SECRET_KEY,
          expiresIn: process.env.TOKEN_EXPIRE_TIME,
        },
      ),
      this.jwtService.signAsync(
        {
          sub: id,
          username: login,
        },
        {
          secret: process.env.JWT_SECRET_REFRESH_KEY,
          expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME,
        },
      ),
    ]);
    return {
      accessToken: at,
      refreshToken: rt,
    };
  }

  async hashData(data: string) {
    const salt = await bcrypt.genSalt(+process.env.CRYPT_SALT);
    const hashedPass = await bcrypt.hash(data, salt);
    return hashedPass;
  }

  async comparePasswords(password: string, storedPasswordHash: string) {
    const result = await bcrypt.compare(password, storedPasswordHash);
    return result;
  }
}
