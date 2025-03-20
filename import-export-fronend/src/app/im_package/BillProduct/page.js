"use client";
import Nav_bar from '@/app/components/Nav/Nav_bar';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export default function BillProduct() {
  const [productList, setProductList] = useState([]);
  const [selectedNCC, setSelectedNCC] = useState(null);

  useEffect(() => {
    // Lấy danh sách sản phẩm từ localStorage
    const storedProducts = localStorage.getItem('productList');
    if (storedProducts) {
      setProductList(JSON.parse(storedProducts));
    }

    const storedNCC = localStorage.getItem('selectedNCCData');
    if (storedNCC) {
      const parsedNCC = JSON.parse(storedNCC);
      setSelectedNCC(parsedNCC.length > 0 ? parsedNCC[0] : null);
    }
  }, []);


  // Tính tổng số tiền cần thanh toán
  const totalPayment = productList.reduce((total, item) => {
    return total + item.soLuong * item.giaNhap;
  }, 0);

  return (
    <>
    <Nav_bar />
    
    <div className="flex flex-col space-y-4 mt-8 pt-16">
      <h1 className="text-2xl font-bold mr-4 text-center">Danh sách sản phẩm đã nhập</h1>
      <div className="w-full flex justify-center">
        <div className="w-3/5 border-t-2 border-blue-700"></div>
      </div>

      <div className="mx-auto">
      <Link href="/im_package/AddProduct">
      <button className="style-button">
        Quay lại trang nhập hàng 
      </button>
      </Link>
      </div>
      <p className="font-bold text-blue-700 text-xl">Phiếu hàng đã nhập 1</p>
      <div className="w-[95%] mx-auto">
      {selectedNCC && (
          <div className="mt-4">
            <h2 className="text-xl font-bold text-blue-500">Thông tin nhà cung cấp</h2>
            <table className="min-w-full mt-4 border-collapse border border-gray-300">
              <thead>
                <tr className="bg-blue-200">
                  <th className="border border-gray-300 p-2">Mã</th>
                  <th className="border border-gray-300 p-2">Tên</th>
                  <th className="border border-gray-300 p-2">Địa chỉ</th>
                  <th className="border border-gray-300 p-2">Số điện thoại</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-gray-100">
                  <td className="border border-gray-300 p-2 text-center">{selectedNCC.ma}</td>
                  <td className="border border-gray-300 p-2 text-center">{selectedNCC.ten}</td>
                  <td className="border border-gray-300 p-2 text-center">{selectedNCC.diaChi}</td>
                  <td className="border border-gray-300 p-2 text-center">{selectedNCC.soDienThoai}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

      {productList.length === 0 ? (
        <div className="mt-8 text-center">
          <p className="text-gray-500">Không có sản phẩm nào được nhập.</p>
        </div>
      ) : (
        <div className="mt-8 w-full overflow-x-auto">
          <h2 className="text-xl font-bold ml-4 text-blue-500">Danh sách sản phẩm</h2>
          <table className="min-w-full mt-4 border-collapse border border-gray-300">
            <thead>
              <tr className="bg-blue-200">
                <th className="border border-gray-300 p-2">Số thứ tự</th>
                <th className="border border-gray-300 p-2">Mã hàng</th>
                <th className="border border-gray-300 p-2">Tên hàng</th>
                <th className="border border-gray-300 p-2">Số lượng</th>
                <th className="border border-gray-300 p-2">Giá</th>
                <th className="border border-gray-300 p-2">Tổng giá</th>
              </tr>
            </thead>
            <tbody>
              {productList.map((item, index) => {
                const totalAmount = item.soLuong * item.giaNhap;
                return (
                  <tr key={index} className="bg-gray-100">
                    <td className="border border-gray-300 p-2 text-center">{index + 1}</td>
                    <td className="border border-gray-300 p-2 text-center">{item.ma}</td>
                    <td className="border border-gray-300 p-2 text-center">{item.ten}</td>
                    <td className="border border-gray-300 p-2 text-center">{item.soLuong}</td>
                    <td className="border border-gray-300 p-2 text-right">{item.giaNhap}</td>
                    <td className="border border-gray-300 p-2 text-right">{totalAmount}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="5" className="border border-gray-300 p-2 text-right font-bold">Tổng số tiền cần thanh toán:</td>
                <td className="border border-gray-300 p-2 text-right">{totalPayment}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
    </div>
    </>
  );
}
