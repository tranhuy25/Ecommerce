import {
  Table,
  Column,
  Model,
  ForeignKey,
  DataType,
  BelongsTo,
} from 'sequelize-typescript';
import { Entity } from 'src/common/constants';
import { DaiLy } from 'src/dai-ly/model/dai-ly-model';
import { CreatePhieuXuatDto } from 'src/phieu-xuat/dto/create-phieu-xuat.body.dto';
import { CreatePhieuNhapNhaCungCapDto } from '../dto/phieu-nhap-nha-cung-cap.dto';
import { CreateNhaCungCapDto } from 'src/nha-cung-cap/dto/create-nha-cung-cap.dto';
import { NhaCungCap } from 'src/nha-cung-cap/model/nha-cung-cap.model';
import { PhieuNhap } from 'src/phieu-nhap/model/phieu-nhap-model';

@Table({ tableName: Entity.PHIEUNHAPNHACUNGCAP })
export class PhieuNhapNhaCungCap
  extends Model
  implements CreatePhieuNhapNhaCungCapDto
{
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => PhieuNhap)
  @Column({ type: DataType.STRING, allowNull: false })
  maPhieuNhap: string;

  @BelongsTo(() => PhieuNhap, {
    targetKey: 'ma',
    foreignKey: 'maPhieuNhap',
  })
  phieuNhapList?: CreatePhieuXuatDto;

  @ForeignKey(() => DaiLy)
  @Column({ type: DataType.STRING, allowNull: false })
  maNhaCungCap: string;

  @BelongsTo(() => NhaCungCap, {
    targetKey: 'ma',
    foreignKey: 'maNhaCungCap',
  })
  nhaCungCapList?: CreateNhaCungCapDto;

  @Column({})
  ma: string;
}
