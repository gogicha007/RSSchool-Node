import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class FavoritesService {
  constructor(private readonly dbService: DatabaseService) {}

  async getAllFavs() {
    const allFavs = await this.dbService.favorites.findMany();
    const result = Object.keys(allFavs[0])
      .filter((key) => key !== 'id')
      .reduce((acc, val) => {
        const array = allFavs[0][val].map((e: any) => {
          const eCopy = JSON.parse(e);
          return eCopy;
        });
        acc[val] = array;
        return acc;
      }, {});
    return result;
  }

  async addTrack(id: string) {
    const trackToAdd = await this.dbService.track.findUnique({
      where: {
        id,
      },
    });
    if (!trackToAdd) throw new UnprocessableEntityException('Track not found');
    await this.dbService.favorites.update({
      where: {
        id: 0,
      },
      data: {
        tracks: {
          push: JSON.stringify(trackToAdd),
        },
      },
    });
    return trackToAdd;
  }

  async removeTrack(id: string) {
    const trackToRemove = await this.dbService.track.findUnique({
      where: {
        id,
      },
    });
    if (!trackToRemove) throw new NotFoundException('Track not found');

    const tracksArr = await this.dbService.favorites.findFirst({
      select: {
        tracks: true,
      },
    });

    await this.dbService.favorites.update({
      where: {
        id: 0,
      },
      data: {
        tracks: tracksArr.tracks.filter((track) => JSON.parse(track).id !== id),
      },
    });
    return trackToRemove;
  }

  async addAlbum(id: string) {
    const albumToAdd = await this.dbService.album.findUnique({
      where: {
        id,
      },
    });
    if (!albumToAdd) throw new UnprocessableEntityException('Album not found');
    await this.dbService.favorites.update({
      where: {
        id: 0,
      },
      data: {
        albums: {
          push: JSON.stringify(albumToAdd),
        },
      },
    });
    return albumToAdd;
  }

  async removeAlbum(id: string) {
    const albumToRemove = this.dbService.album.findUnique({
      where: {
        id,
      },
    });
    if (!albumToRemove) throw new NotFoundException('Album not found');
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
        albums: albumsArr.albums.filter((album) => JSON.parse(album).id !== id),
      },
    });
    return albumToRemove;
  }

  async addArtist(id: string) {
    const artistToAdd = await this.dbService.artist.findUnique({
      where: {
        id,
      },
    });
    if (!artistToAdd)
      throw new UnprocessableEntityException('Artist not found');
    await this.dbService.favorites.update({
      where: {
        id: 0,
      },
      data: {
        artists: {
          push: JSON.stringify(artistToAdd),
        },
      },
    });
    return artistToAdd;
  }

  async removeArtist(id: string) {
    const artistToRemove = await this.dbService.artist.findUnique({
      where: {
        id,
      },
    });
    if (!artistToRemove) throw new NotFoundException('Artist not found');
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
          (artist) => JSON.parse(artist).id !== id,
        ),
      },
    });
    return artistToRemove;
  }
}
