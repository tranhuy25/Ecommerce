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
import { CreatePhieuNhapHangHoaDto } from 'src/phieu-nhap-hang-hoa/dto/create-phieu-nhap-hang-hoa.dto';
import { PhieuNhapHangHoa } from 'src/phieu-nhap-hang-hoa/model/phieu-nhap-hang-hoa.model';

@Table({ tableName: Entity.PHIEUNHAP })
export class PhieuNhap extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @Column({ type: DataType.DECIMAL(10, 2), allowNull: false })
  totalAmount: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  ma: string;

  @HasMany(() => PhieuNhapHangHoa, {
    sourceKey: 'ma',
    foreignKey: 'maPhieuNhap',
  })
  listPhieuNhapHangHoa: CreatePhieuNhapHangHoaDto[];

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
