"use client";
import { useEffect, useState } from "react";

export default function Inventory() {
  const [backendProducts, setBackendProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:3000/hanghoa/get-du-lieu'); // Thay đổi URL cho phù hợp với backend của bạn
      if (!response.ok) {
        throw new Error('Network response was not ok'); // Kiểm tra phản hồi
      }
      const data = await response.json(); // Chuyển đổi phản hồi sang JSON
      setBackendProducts(data); // Lưu dữ liệu vào state
    } catch (error) {
      setError(error); // Lưu lỗi vào state nếu có
    } finally {
      setLoading(false); // Đặt loading về false khi hoàn thành
    }
  };

  fetchProducts(); // Gọi hàm fetchData
}, []);



  /////////////////////////////////////////////////
  // Tính tổng giá trị hàng hóa
  const totalValue = backendProducts.reduce((total, item) => {
    const itemTotal = item.soLuong * item.giaNhap; // Tính tổng giá cho từng sản phẩm
    return total + (isNaN(itemTotal) ? 0 : itemTotal); // Kiểm tra nếu itemTotal là NaN
  }, 0);



  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (error) return <p>Lỗi: {error.message}</p>;



  return (
    <div className="container mx-auto mt-8 ">
      <h1 className="text-2xl font-bold text-center text-blue-800">Danh sách hàng hóa</h1>
      <div className="overflow-x-auto mt-4">
        <table className="bg-white border border-blue-400 w-full">
          <thead>
            <tr className="bg-blue-200">
              <th className="name-data">Số thứ tự</th>
              <th className="name-data">Mã hàng</th>
              <th className="name-data">Tên hàng</th>
              <th className="name-data">Số lượng</th>
              <th className="name-data">Giá</th>
              <th className="name-data">Tổng giá</th>
            </tr>
          </thead>
          <tbody>
            {backendProducts.map((item, index) => {
              const totalAmount = item.soLuong * item.giaNhap; // Tính tổng giá cho từng sản phẩm
              return (
                <tr key={item.id} className="hover:bg-blue-100">
                  <td className="data-inventory">{index + 1}</td>
                  <td className="data-inventory">{item.ma}</td>
                  <td className="data-inventory">{item.ten}</td>
                  <td className="data-inventory">{item.soLuong}</td>
                  <td className="data-inventory">{item.giaNhap.toLocaleString()} VNĐ</td>
                  <td className="data-inventory">{totalAmount.toLocaleString()} VNĐ</td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="5" className="border border-blue-400 p-2 text-right font-bold">Tổng giá trị hàng hóa:</td>
              <td className="border border-blue-400 p-2 text-right">{totalValue.toLocaleString()} VNĐ</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
