import {
  Table,
  Column,
  Model,
  ForeignKey,
  DataType,
  BelongsTo,
} from 'sequelize-typescript';
import { Entity } from 'src/common/constants';
import { HangHoa } from 'src/hang-hoa/model/hang-hoa.model';
import { CreateHangHoaDto } from 'src/hang-hoa/dto/create-hang-hoa-body';
import { CreatePhieuNhapDto } from 'src/phieu-nhap/dto/create-phieu-nhap.dto';
import { PhieuNhap } from 'src/phieu-nhap/model/phieu-nhap-model';
import { CreatePhieuNhapHangHoaDto } from '../dto/create-phieu-nhap-hang-hoa.dto';

@Table({ tableName: Entity.PHIEUNHAPHANGHOA })
export class PhieuNhapHangHoa
  extends Model
  implements CreatePhieuNhapHangHoaDto
{
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => PhieuNhap)
  @Column({ type: DataType.STRING, allowNull: false })
  maPhieuNhap?: string;

  @BelongsTo(() => PhieuNhap, {
    targetKey: 'ma',
    foreignKey: 'maPhieuNhap',
  })
  phieuNhapList?: CreatePhieuNhapDto;

  @ForeignKey(() => HangHoa)
  @Column({ type: DataType.STRING, allowNull: false })
  maHangHoa: string;

  @BelongsTo(() => HangHoa, {
    targetKey: 'ma',
    foreignKey: 'maHangHoa',
  })
  hangHoaList?: CreateHangHoaDto;
}
