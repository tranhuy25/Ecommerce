'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Nav_bar from '@/app/components/Nav/Nav_bar';

export default function CombinedBillDealerData() {
  const [combinedData, setCombinedData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [goodsResponse, dealersResponse] = await Promise.all([
          fetch('http://localhost:3000/phieu-xuat-hang-hoa/get-du-lieu'),
          fetch('http://localhost:3000/phieu-xuat-dai-ly/get-du-lieu'),
        ]);

        if (!goodsResponse.ok || !dealersResponse.ok) {
          throw new Error('Không thể lấy dữ liệu từ một trong các API');
        }

        const goodsData = await goodsResponse.json();
        const dealersData = await dealersResponse.json();

        console.log("Dữ liệu từ API phieu-xuat-hang-hoa/get-du-lieu:", goodsData);

        const enrichedGoodsData = await Promise.all(
          goodsData.map(async (goodsItem) => {
            const goodsDetailResponse = await fetch(`http://localhost:3000/hanghoa/find/${goodsItem.maHangHoa}`);
            const goodsDetailData = goodsDetailResponse.ok ? await goodsDetailResponse.json() : {};
            return { 
              ...goodsItem, 
              tenHangHoa: goodsDetailData.ten || 'Tên không có sẵn',
              giaNhap: goodsDetailData.giaNhap || 0,
            };
          })
        );

        const enrichedDealersData = await Promise.all(
          dealersData.map(async (dealerItem) => {
            const dealerDetailResponse = await fetch(`http://localhost:3000/daily/get-by-ma/${dealerItem.maDaiLy}`);
            const dealerDetailData = dealerDetailResponse.ok ? await dealerDetailResponse.json() : {};
            return { ...dealerItem, ...dealerDetailData };
          })
        );

        const combinedData = enrichedGoodsData.map((goodsItem) => {
          const dealer = enrichedDealersData.find((dealerItem) => dealerItem.maPhieuXuat === goodsItem.maPhieuXuat) || {};
          return { ...goodsItem, ...dealer };
        });

        setCombinedData(combinedData);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
    <Nav_bar />
    <div className="flex flex-col space-y-4 mt-8 pt-16">
      <h1 className="text-2xl font-bold mr-4 text-center">Hóa đơn xuất hàng</h1>
      <div className="w-full flex justify-center">
        <div className="w-3/5 border-t-2 border-blue-700"></div>
      </div>
      <div className="flex justify-center my-4">
          <Link href="/ex_package/Summary">
            <button className="style-button">
              Quay lại trang hàng hóa
            </button>
          </Link>
        </div>

      <div className="w-[95%] mx-auto">
        {combinedData.length === 0 ? (
          <div className="mt-8 text-center">
            <p className="text-gray-500">Không có dữ liệu để hiển thị.</p>
          </div>
        ) : (
          combinedData.map((item, index) => (
            <div key={index} className="mt-8 w-full overflow-x-auto shadow-2xl rounded-lg border border-gray-200 p-10">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                viewport={{}}
              >
                <h2 className="text-xl font-bold text-blue-500 text-center">Phiếu xuất: {item.maPhieuXuat}</h2>
                
                <div className="mt-4">
                  <h3 className="text-lg font-semibold text-blue-500">Thông tin Hàng hóa</h3>
                  <table className="min-w-full mt-4 border-collapse border border-gray-300">
  <thead>
    <tr className="bg-blue-200">
      <th className="border border-gray-300 p-2 font-semibold">Tên hàng hóa</th>
      <th className="border border-gray-300 p-2 font-semibold">Số lượng</th>
      <th className="border border-gray-300 p-2 font-semibold">Giá nhập</th>
      <th className="border border-gray-300 p-2 font-semibold">Tổng giá</th>
    </tr>
  </thead>
  <tbody>
    <tr className="bg-gray-100">
      <td className="border border-gray-300 p-2 text-center">{item.tenHangHoa || 'Tên không có sẵn'}</td>
      <td className="border border-gray-300 p-2 text-center">{item.soLuong}</td>
      <td className="border border-gray-300 p-2 text-center">{item.giaNhap}</td>
      <td className="border border-gray-300 p-2 text-center">{item.soLuong * item.giaNhap}</td>
    </tr>
  </tbody>
</table>
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-semibold text-blue-500">Thông tin Đại lý</h3>
                  <table className="min-w-full mt-2 border-collapse border border-gray-300">
                    <tbody>
                      <tr>
                        <td className="border border-gray-300 p-2 font-semibold">Tên đại lý</td>
                        <td className="border border-gray-300 p-2">{item.ten || 'Thông tin không có sẵn'}</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 p-2 font-semibold">Địa chỉ</td>
                        <td className="border border-gray-300 p-2">{item.diaChi || 'Thông tin không có sẵn'}</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 p-2 font-semibold">Số điện thoại</td>
                        <td className="border border-gray-300 p-2">{item.phone || 'Thông tin không có sẵn'}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </motion.div>
            </div>
          ))
        )}
      </div>
    </div>
    </>
  );
}
