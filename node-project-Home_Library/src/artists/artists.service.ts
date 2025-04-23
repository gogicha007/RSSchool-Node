import { NotFoundException, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { DatabaseService } from 'src/database/database.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';

@Injectable()
export class ArtistsService {
  constructor(private readonly dbService: DatabaseService) {}

  async createArtist(createArtist: CreateArtistDto) {
    const id = uuidv4();
    const newArtist = {
      id: id,
      name: createArtist.name,
      grammy: createArtist.grammy,
    };
    await this.dbService.artist.create({
      data: newArtist,
    });
    return newArtist;
  }

  async findAll() {
    return this.dbService.artist.findMany();
  }

  async findOne(id: string) {
    const artist = await this.dbService.artist.findUnique({
      where: {
        id,
      },
    });
    if (!artist) throw new NotFoundException('Artist not found');
    return artist;
  }

  async updateArtist(id: string, updateArtist: UpdateArtistDto) {
    const theArtist = await this.findOne(id);
    if (!theArtist) throw new NotFoundException('Artist not found');
    const updateData = {
      ...theArtist,
      ...updateArtist,
    };
    await this.dbService.artist.update({
      where: {
        id,
      },
      data: updateData,
    });
    return this.findOne(id);
  }

  async deleteArtist(id: string) {
    const removedArtist = await this.findOne(id);
    if (!removedArtist) throw new NotFoundException('Artist not found');
    await this.dbService.artist.delete({
      where: {
        id,
      },
    });

    // update tracks
    await this.dbService.track.updateMany({
      where: {
        artistId: id,
      },
      data: {
        artistId: null,
      },
    });

    // update albums
    await this.dbService.album.updateMany({
      where: {
        artistId: id,
      },
      data: {
        artistId: null,
      },
    });
    // update favorites
    const artistsArr = await this.dbService.favorites.findFirst({
      select: {
        artists: true,
      },
    });

    await this.dbService.favorites.update({
      where: {
        id: 0,
      },
      data: {
        artists: artistsArr.artists.filter(
          (arts) => JSON.parse(arts).id !== id,
        ),
      },
    });
    return removedArtist;
  }
}
