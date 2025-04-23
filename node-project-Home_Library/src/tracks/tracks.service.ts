import { NotFoundException, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { CreateTrackDto } from './dto/create-track.dto';
// import { UpdateTrackDto } from './dto/update-track.dto';

@Injectable()
export class TracksService {
  constructor(private readonly dbService: DatabaseService) {}

  async createTrack(createTrack: CreateTrackDto) {
    const id = uuidv4();
    const newTrack = {
      id: id,
      name: createTrack.name,
      artistId: createTrack.artistId ? createTrack.artistId : null,
      albumId: createTrack.albumId ? createTrack.albumId : null,
      duration: createTrack.duration,
    };
    await this.dbService.track.create({ data: newTrack });
    return newTrack;
  }

  async findAll() {
    return this.dbService.track.findMany();
  }

  async findOne(id: string) {
    const track = await this.dbService.track.findUnique({
      where: {
        id,
      },
    });
    if (!track) throw new NotFoundException('Track not found');
    return track;
  }

  async updateTrack(id: string, updateTrack: Prisma.TrackUpdateInput) {
    const theTrack = await this.findOne(id);
    if (!theTrack) throw new NotFoundException('Track not found');

    const updateData = {
      ...theTrack,
      ...updateTrack,
    };
    await this.dbService.track.update({
      where: {
        id,
      },
      data: updateData,
    });
    return this.findOne(id);
  }

  async deleteTrack(id: string) {
    const removedTrack = await this.findOne(id);
    if (!removedTrack) throw new NotFoundException('Track not found');
    await this.dbService.track.delete({
      where: {
        id,
      },
    });

    // update favorites
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
        tracks: tracksArr.tracks.filter((trk) => JSON.parse(trk).id !== id),
      },
    });
    return removedTrack;
  }
}
