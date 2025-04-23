import { NotFoundException, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { DatabaseService } from 'src/database/database.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';

@Injectable()
export class AlbumsService {
  constructor(private readonly dbService: DatabaseService) {}

  async createAlbum(createAlbum: CreateAlbumDto) {
    const id = uuidv4();
    const newAlbum = {
      id: id,
      name: createAlbum.name,
      year: createAlbum.year,
      artistId: createAlbum.artistId ? createAlbum.artistId : null,
    };
    await this.dbService.album.create({
      data: newAlbum,
    });
    return newAlbum;
  }

  async findAll() {
    return this.dbService.album.findMany();
  }

  async findOne(id: string) {
    const album = await this.dbService.album.findUnique({
      where: {
        id,
      },
    });
    if (!album) throw new NotFoundException('Album not found');
    return album;
  }

  async updateAlbum(id: string, updateAlbum: UpdateAlbumDto) {
    const theAlbum = await this.findOne(id);
    if (!theAlbum) throw new NotFoundException('Album not found');
    const updatedData = {
      ...theAlbum,
      ...updateAlbum,
    };
    await this.dbService.album.update({
      where: {
        id,
      },
      data: updatedData,
    });
    return this.findOne(id);
  }

  async deleteAlbum(id: string) {
    const removedAlbum = await this.findOne(id);
    if (!removedAlbum) throw new NotFoundException('Album not found');
    await this.dbService.album.delete({
      where: {
        id,
      },
    });

    // update tracks
    await this.dbService.track.updateMany({
      where: {
        albumId: id,
      },
      data: {
        albumId: null,
      },
    });

    // update favorites
    const albumsArr = await this.dbService.favorites.findFirst({
      select: {
        albums: true,
      },
    });

    await this.dbService.favorites.update({
      where: {
        id: 0,
      },
      data: {
        albums: albumsArr.albums.filter((alb) => JSON.parse(alb).id !== id),
      },
    });

    return removedAlbum;
  }
}
