'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';


  export default function BillExport() {
    const [receiptData, setReceiptData] = useState([]);

    useEffect(() => {
    const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:3000/phieu-xuat-hang-hoa/get-du-lieu');
      if (!response.ok) {
        throw new Error('Không thể lấy dữ liệu từ API');
      }

      const text = await response.text();  // Lấy phản hồi dưới dạng văn bản
      const data = text ? JSON.parse(text) : [];  // Kiểm tra nếu có dữ liệu

      const enrichedData = await Promise.all(
        data.map(async (item) => {
          const productResponse = await fetch(`http://localhost:3000/hanghoa/find/${item.maHangHoa}`);
          let productData = {};
          if (productResponse.ok) {
            const productText = await productResponse.text();
            productData = productText ? JSON.parse(productText) : {};  // Kiểm tra nếu có dữ liệu
          }

          return {
            ...item,
            ten: productData.ten || 'Tên không có sẵn',
            giaNhap: productData.giaNhap || 0,
          };
        })
      );

      setReceiptData(enrichedData);
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu:', error);
    }
  };

      fetchData();
    }, []);

    // Nhóm dữ liệu theo maPhieuXuat
    const groupedData = receiptData.reduce((acc, item) => {
      if (!acc[item.maPhieuXuat]) {
        acc[item.maPhieuXuat] = [];
      }
      acc[item.maPhieuXuat].push(item);
      return acc;
    }, {});

  return (
    <>
      <div className="flex flex-col space-y-4 mt-8 pt-16">
        <h1 className="text-2xl font-bold mr-4 text-center">Hóa đơn xuất hàng</h1>
        <div className="w-full flex justify-center">
          <div className="w-3/5 border-t-2 border-blue-700"></div>
        </div>
        <div className="w-[95%] mx-auto">

          {Object.keys(groupedData).length === 0 ? (
            <div className="mt-8 text-center">
              <p className="text-gray-500">Không có sản phẩm nào được nhập.</p>
            </div>
          ) : (
            Object.keys(groupedData).map((maPhieuXuat) => {
              const items = groupedData[maPhieuXuat];

              return (
                <div key={maPhieuXuat} className="mt-8 w-full overflow-x-auto shadow-2xl rounded-lg border border-gray-200 p-10">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}    // Trạng thái ban đầu: mờ và nhỏ
                    whileInView={{ opacity: 1, scale: 1 }}  // Khi vào tầm nhìn: rõ dần và to lên
                    transition={{ duration: 0.5, ease: "easeOut" }} // Tốc độ hiệu ứng
                    viewport={{}} // Hiệu ứng chỉ chạy một lần khi vào tầm nhìn (once:true)
                  >
                  <h2 className="text-xl font-bold text-blue-500 text-center">Phiếu xuất: {maPhieuXuat}</h2>
                  <p className="text-lg font-semibold text-blue-500">Thông tin hàng hóa</p>
                  <table className="min-w-full mt-4 border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-blue-200">
                        <th className="border border-gray-300 p-2">Số thứ tự</th>
                        <th className="border border-gray-300 p-2">Mã hàng hóa</th>
                        <th className="border border-gray-300 p-2">Tên hàng hóa</th>
                        <th className="border border-gray-300 p-2">Số lượng</th>
                        <th className="border border-gray-300 p-2">Giá nhập</th>
                        <th className="border border-gray-300 p-2">Tổng giá</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item, index) => {
                        const totalAmount = item.soLuong * item.giaNhap;
                        return (
                          <tr key={index} className="bg-gray-100">
                            <td className="border border-gray-300 p-2 text-center">{index + 1}</td>
                            <td className="border border-gray-300 p-2 text-center">{item.maHangHoa}</td>
                            <td className="border border-gray-300 p-2 text-center">{item.ten}</td>
                            <td className="border border-gray-300 p-2 text-center">{item.soLuong}</td>
                            <td className="border border-gray-300 p-2 text-center">{item.giaNhap}</td>
                            <td className="border border-gray-300 p-2 text-right">{totalAmount}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>

                  {/* Bảng thông tin đại lý */}
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold text-blue-500">Thông tin đại lý</h3>
                    <table className="min-w-full border-collapse border border-gray-300 mt-2">
                      <tbody>
                        <tr>
                          <td className="border border-gray-300 p-2 font-semibold">Mã đại lý</td>
                          <td className="border border-gray-300 p-2">{'Thông tin không có sẵn'}</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 p-2 font-semibold">Tên đại lý</td>
                          <td className="border border-gray-300 p-2">{'Thông tin không có sẵn'}</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 p-2 font-semibold">Địa chỉ</td>
                          <td className="border border-gray-300 p-2">{'Thông tin không có sẵn'}</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 p-2 font-semibold">Số điện thoại</td>
                          <td className="border border-gray-300 p-2">{'Thông tin không có sẵn'}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </motion.div>
                </div>
              );
            })
          )}
        </div>
      </div>
      
    </>
  );
}