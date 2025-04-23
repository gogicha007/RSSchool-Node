import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTrackDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  duration: number;

  @ApiProperty()
  @IsOptional()
  artistId: string | null;

  @ApiProperty()
  @IsOptional()
  albumId: string | null;
}
