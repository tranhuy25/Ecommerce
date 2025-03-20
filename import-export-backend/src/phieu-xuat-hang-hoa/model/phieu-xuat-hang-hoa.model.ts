import {
  Table,
  Column,
  Model,
  DataType,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { Entity } from 'src/common/constants';
import { CreateHangHoaDto } from 'src/hang-hoa/dto/create-hang-hoa-body';
import { HangHoa } from 'src/hang-hoa/model/hang-hoa.model';
import { CreatePhieuXuatDto } from 'src/phieu-xuat/dto/create-phieu-xuat.body.dto';
import { PhieuXuat } from 'src/phieu-xuat/model/phieu-xuat-model';

@Table({ tableName: Entity.PHIEUXUATHANGHOA })
export class PhieuXuatHangHoa extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => PhieuXuat)
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  maPhieuXuat: string;

  @BelongsTo(() => PhieuXuat, {
    targetKey: 'ma',
    foreignKey: 'maPhieuXuat',
  })
  phieuXuatList?: CreatePhieuXuatDto;

  @ForeignKey(() => HangHoa)
  @Column({ type: DataType.STRING, allowNull: false })
  maHangHoa?: string;

  @BelongsTo(() => HangHoa, {
    targetKey: 'ma',
    foreignKey: 'maHangHoa',
  })
  hangHoaList?: CreateHangHoaDto;

  @Column({ type: DataType.STRING, allowNull: false })
  soLuong: number;
}
//
