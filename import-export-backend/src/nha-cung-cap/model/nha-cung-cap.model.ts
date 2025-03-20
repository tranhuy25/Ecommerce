import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';
import { Entity } from 'src/common/constants';
import { CreateNhaCungCapDto } from '../dto/create-nha-cung-cap.dto';

@Table({ tableName: Entity.NHACUNGCAP })
export class NhaCungCap extends Model implements CreateNhaCungCapDto {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  ma: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  ten: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  diaChi: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  soDienThoai: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
