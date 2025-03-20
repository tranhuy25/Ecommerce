import { PartialType } from '@nestjs/swagger';
import { CreateDaiLyDto } from './create-dai-ly.dto';

export class UpdateDaiLyDto extends PartialType(CreateDaiLyDto) {}
