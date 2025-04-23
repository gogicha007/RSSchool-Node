import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseUUIDPipe,
  ValidationPipe,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { AlbumsService } from './albums.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('album')
export class AlbumsController {
  constructor(private readonly albumsService: AlbumsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  createAlbum(@Body(ValidationPipe) createAlbum: CreateAlbumDto) {
    return this.albumsService.createAlbum(createAlbum);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.albumsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOnde(@Param('id', ParseUUIDPipe) id: string) {
    return this.albumsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  updateAlbum(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(ValidationPipe) updateAlbum: UpdateAlbumDto,
  ) {
    return this.albumsService.updateAlbum(id, updateAlbum);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(204)
  deleteAlbum(@Param('id', ParseUUIDPipe) id: string) {
    return this.albumsService.deleteAlbum(id);
  }
}
