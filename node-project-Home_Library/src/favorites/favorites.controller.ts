import {
  Get,
  Post,
  Delete,
  Controller,
  ParseUUIDPipe,
  Param,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { FavoritesService } from './favorites.service';

@Controller('favs')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getAll() {
    return this.favoritesService.getAllFavs();
  }

  @UseGuards(JwtAuthGuard)
  @Post('track/:id')
  @HttpCode(201)
  addTrack(@Param('id', ParseUUIDPipe) id: string) {
    return this.favoritesService.addTrack(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('track/:id')
  @HttpCode(204)
  removeTrack(@Param('id', ParseUUIDPipe) id: string) {
    return this.favoritesService.removeTrack(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('album/:id')
  addAlbum(@Param('id', ParseUUIDPipe) id: string) {
    return this.favoritesService.addAlbum(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('album/:id')
  @HttpCode(204)
  removeAlbum(@Param('id', ParseUUIDPipe) id: string) {
    return this.favoritesService.removeAlbum(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('artist/:id')
  addArtist(@Param('id', ParseUUIDPipe) id: string) {
    return this.favoritesService.addArtist(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('artist/:id')
  @HttpCode(204)
  removeArtist(@Param('id', ParseUUIDPipe) id: string) {
    return this.favoritesService.removeArtist(id);
  }
}
