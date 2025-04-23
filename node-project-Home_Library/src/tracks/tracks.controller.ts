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
import { TracksService } from './tracks.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('track')
export class TracksController {
  constructor(private readonly trackServise: TracksService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  createTrack(@Body(ValidationPipe) createTrack: CreateTrackDto) {
    return this.trackServise.createTrack(createTrack);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.trackServise.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOnde(@Param('id', ParseUUIDPipe) id: string) {
    return this.trackServise.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  updateTrack(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(ValidationPipe) updateTrack: UpdateTrackDto,
  ) {
    return this.trackServise.updateTrack(id, updateTrack);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(204)
  deleteTrack(@Param('id', ParseUUIDPipe) id: string) {
    return this.trackServise.deleteTrack(id);
  }
}
