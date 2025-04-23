import {
  Body,
  Controller,
  Post,
  HttpCode,
  Req,
  ValidationPipe,
} from '@nestjs/common';

import { Request } from 'express';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginUserDto } from './dto/LoginUser.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @HttpCode(201)
  async signup(@Body() createUserDto: CreateUserDto) {
    return await this.authService.signup(createUserDto);
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body(ValidationPipe) loginUser: LoginUserDto) {
    return await this.authService.login(loginUser);
  }

  @Post('refresh')
  @HttpCode(200)
  async refresh(@Req() { body }: Request) {
    console.log(body);
    return await this.authService.refresh(body.refreshToken);
  }
}
