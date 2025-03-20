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
import { PhieuXuat } from 'src/phieu-xuat/model/phieu-xuat-model';
import { CreateBillXuatDto } from '../dto/create-bill-xuat-body.dto';

@Table({ tableName: Entity.BILLXUAT })
export class BillXuat extends Model implements CreateBillXuatDto {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => PhieuXuat)
  @Column({ type: DataType.STRING, allowNull: false })
  maPhieuXuat: string;

  @BelongsTo(() => PhieuXuat, {
    targetKey: 'ma',
    foreignKey: 'maPhieuXuat',
  })
  phieuXuatList?: PhieuXuat;

  @ForeignKey(() => HangHoa)
  @Column({ type: DataType.STRING, allowNull: false })
  maHangHoa: string;

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
  //
  @BeforeSave
  static calculateTotalPrice(instance: BillXuat) {
    instance.totalPrice = instance.quantity * instance.unitPrice;
  }
}
