import { OmitType } from '@nestjs/swagger';
import { CreateHangHoaDto } from './create-hang-hoa-body';

export class UpdateHangHoaDto extends OmitType(CreateHangHoaDto, [
  'ma',
  'ten',
]) {}
