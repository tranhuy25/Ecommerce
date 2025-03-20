import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
  HasMany,
} from 'sequelize-typescript';
import { Entity } from 'src/common/constants';
import { PhieuXuatDaiLy } from 'src/phieu-xuat-dai-ly/model/phieu-xuat-dai-ly.model';

@Table({ tableName: Entity.DAILY })
export class DaiLy extends Model {
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
  phone: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @HasMany(() => PhieuXuatDaiLy, {
    sourceKey: 'ma',
    foreignKey: 'maDaiLy',
  })
  listPhieuXuatDaLy: PhieuXuatDaiLy[];
}
