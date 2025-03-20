import {
  Table,
  Column,
  Model,
  ForeignKey,
  DataType,
  BeforeSave,
  BelongsTo,
} from 'sequelize-typescript';
import { Entity } from 'src/common/constants';
import { HangHoa } from 'src/hang-hoa/model/hang-hoa.model';
import { PhieuNhap } from 'src/phieu-nhap/model/phieu-nhap-model';
import { CreateBillNhaptDto } from '../dto/create-bill-nhap-body.dto';

@Table({ tableName: Entity.BILLNHAP })
export class BillNhap extends Model implements CreateBillNhaptDto {
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
  phieuNhapList?: PhieuNhap;

  @ForeignKey(() => HangHoa)
  @Column({ type: DataType.STRING, allowNull: false })
  maHangHoa: string; // Product code

  @BelongsTo(() => HangHoa, {
    targetKey: 'ma',
    foreignKey: 'maHangHoa',
  })
  hangHoaList?: HangHoa;

  @Column({ type: DataType.STRING, allowNull: false })
  productName: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  quantity: number;

  @Column({ type: DataType.DECIMAL(10, 2), allowNull: false })
  unitPrice: number;

  @Column({ type: DataType.DECIMAL(10, 2), allowNull: false })
  totalPrice: number;

  @BeforeSave
  static calculateTotalPrice(instance: BillNhap) {
    instance.totalPrice = instance.quantity * instance.unitPrice;
  }
}
