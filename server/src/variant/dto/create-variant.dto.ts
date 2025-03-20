import { PartialType } from '@nestjs/mapped-types';
import { Variant } from '../entities/variant.entity';

export class CreateVariantDto extends PartialType(Variant) {}
