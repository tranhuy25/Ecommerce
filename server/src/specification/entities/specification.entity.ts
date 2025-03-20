import { Product } from 'src/product/entities/product.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Specification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  product_name: string; // Tên sản phẩm

  @Column({ nullable: true })
  refresh_rate: string; // Tần số quét (10-120Hz)

  @Column({ nullable: true })
  technology: string; // Công nghệ màn hình (Super Retina XDR)

  @Column({ nullable: true })
  resolution: string; // Độ phân giải (2868 x 1320)

  @Column({ nullable: true })
  size: string; // Kích thước màn hình (6.9")

  @Column({ nullable: true })
  brightness: string; // Độ sáng màn hình

  @Column({ nullable: true })
  features: string; // Các tính năng (VD: Chụp đêm, HDR, ...)

  @Column({ nullable: true })
  capacity: string; // Dung lượng pin (VD: 4500mAh)

  @Column({ nullable: true })
  fast_charge: string; // Công nghệ sạc nhanh

  @Column({ nullable: true })
  wireless_charge: string; // Hỗ trợ sạc không dây

  @Column({ nullable: true })
  chipset: string; // Loại chip (VD: Apple A17 Pro)

  @Column({ nullable: true })
  ram: string; // Dung lượng RAM (VD: 8GB)

  @Column({ nullable: true })
  storage: string; // Bộ nhớ trong (VD: 256GB)

  @Column({ nullable: true })
  name: string; // Hệ điều hành (VD: iOS 17)

  @Column({ nullable: true })
  version: string; // Phiên bản OS

  @Column({ nullable: true })
  sim: string; // Loại SIM (VD: Dual SIM, eSIM)

  @Column({ nullable: true })
  wifi: string; // Chuẩn Wi-Fi

  @Column({ nullable: true })
  bluetooth: string; // Phiên bản Bluetooth

  @Column({ nullable: true })
  gps: string; // Hỗ trợ GPS

  @Column({ nullable: true })
  nfc: string; // Hỗ trợ NFC

  @Column({ nullable: true })
  material: string; // Chất liệu khung máy

  @Column({ nullable: true })
  weight: string; // Trọng lượng (VD: 205g)

  @Column({ nullable: true })
  dimensions: string; // Kích thước tổng thể

  @Column({ nullable: true })
  waterproof: string; // Khả năng chống nước (VD: IP68)

  @Column({ nullable: true })
  speaker: string; // Loại loa (VD: Stereo)

  @Column({ nullable: true })
  jack: string; // Có jack 3.5mm không?

  @Column({ nullable: true })
  sensors: string; // Danh sách cảm biến (VD: Vân tay, Face ID, Gia tốc

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Product, (product) => product.Specifications, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  product: Product;

  @Column({ nullable: true })
  productId: number; // Thêm cột productId để tìm kiếm dễ dàng
}
