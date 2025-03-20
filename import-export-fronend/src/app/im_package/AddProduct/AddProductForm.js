"use client"; 
import { useState,useEffect } from 'react';
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AddProductForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [productList, setProductList] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null); 
  const [searchTerm, setSearchTerm] = useState(''); // Trạng thái tìm kiếm
  const [confirmationOpen, setConfirmationOpen] = useState(false);

  const [product, setProduct] = useState({
    ma: '',
    ten: '',
    description: '',
    soLuong: null,
    giaNhap: null,
    ngayNhapHang: '', 
  });

  const router = useRouter();


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct({
      ...product,
      [name]: name === "soLuong" || name === "giaNhap" ? Number(value) : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingIndex !== null) {
      const updatedProductList = [...productList];
      updatedProductList[editingIndex] = product;
      setProductList(updatedProductList);
      setEditingIndex(null); // Đặt lại chỉ số sau khi cập nhật
    } else {
      setProductList([...productList, product]);
    }
    resetForm();
    setIsOpen(false); // Đóng form sau khi lưu
  };

  const resetForm = () => {
    setProduct({
      ma: '',
      ten: '',
      description: '',
      soLuong: null,
      giaNhap: null,
      ngayNhapHang: '', 
      // nhaCungCap: {
      //   maNCC: '',
      //   tenNCC: '',
      //   diaChi: '',
      //   soDienThoai: ''
      // }
    });
  };

  const handleEdit = (index) => {
    setProduct(productList[index]);
    setEditingIndex(index);
    setIsOpen(true); // Mở form khi sửa
  };

  const handleDelete = (index) => {
    if (window.confirm("Bạn có chắc muốn xóa sản phẩm này không?")) {
      setProductList(productList.filter((_, i) => i !== index));
    }
  };

  // Hàm xử lý tìm kiếm
  const filteredProducts = productList.filter(item => 
    item.ten.toLowerCase().includes(searchTerm.toLowerCase()) || // Tìm theo tên hàng
    item.ma.toLowerCase().includes(searchTerm.toLowerCase())   // Tìm theo mã hàng
  );

  const handleConfirmSend = () => {
    localStorage.setItem('productList', JSON.stringify(productList));
    // Chuyển hướng đến trang billproduct và truyền dữ liệu sản phẩm
    router.push('/im_package/Supplier');
    setProductList([]);
  };

//   const handleConfirmSend = async () => {
//     // Lưu danh sách sản phẩm vào localStorage
//     localStorage.setItem('productList', JSON.stringify(productList));
//     console.log('Dữ liệu đã được lưu:', productList);
  
//     if (productList) {
//       // Tạo mảng products mới, bỏ qua trường không cần thiết
//       const products = productList.map(product => {
//         return {
//           ma: product.ma,
//           ten: product.ten,
//           description: product.moTa || "",
//           soLuong: Number(product.soLuong) || 0,
//           giaNhap: Number(product.giaNhap) || 0,
//         };
//       });
  
//       // Kiểm tra dữ liệu trước khi gửi
//       console.log('Dữ liệu gửi đi:', products);
  
//       try {
//         // Duyệt qua từng sản phẩm và gửi riêng từng sản phẩm
//         for (const product of products) {
//           const response = await fetch('http://localhost:3000/hanghoa/create-hang-hoa', {
//             method: 'POST',
//             headers: {
//               'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(product), // Gửi từng sản phẩm một
//           });
  
//           // Nếu phản hồi không thành công, ném lỗi để dừng việc gửi tiếp
//           if (!response.ok) {
//             throw new Error(`HTTP error! status: ${response.status}`);
//           }
  
//           // Lấy dữ liệu phản hồi từ API sau khi gửi thành công
//           const data = await response.json();
//           console.log('Dữ liệu đã được gửi thành công:', data);
//         }
        
//         // Điều hướng đến trang khác sau khi gửi thành công
//         router.push('/im_package/Supplier');
//         setProductList([]); // Xóa danh sách sản phẩm sau khi gửi
//       } catch (error) {
//         // Xử lý lỗi khi gửi dữ liệu vào cơ sở dữ liệu
//         console.error('Lỗi khi gửi dữ liệu vào cơ sở dữ liệu:', error);
//       }
//     }
// };


  return (
    <div className="flex flex-col space-y-4 mt-8">
        <h1 className="text-2xl font-bold mr-4 text-center">Hãy thêm hàng hóa bạn cần nhập tại đây</h1> 
        <div class="w-full flex justify-center">
          <div class="w-3/5 border-t-2 border-blue-700"></div>
        </div>
      {/* Ô tìm kiếm */}
      <input
        type="text"
        placeholder="Tìm kiếm sản phẩm..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border border-gray-300 p-2 rounded w-full mt-4 shadow-sm focus:outline-none focus:border-blue-500 focus:border-2"
      />

      <div className="flex mx-auto gap-x-4">
      <button
          className="style-button"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? 'Quay lại' : 'Hãy thêm sản phẩm tại đây'}
      </button>
      <Link href="/im_package/BillProduct">
      <button className="style-button">
        Xem hóa đơn nhập hàng tại đây
      </button>
      </Link>
      </div>

      {isOpen && (
        <div className="mt-4 bg-gray-100 p-4 rounded-md shadow-md">
          <h2 className="text-xl font-bold mb-4 text-blue-500">Thêm sản phẩm</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">Mã hàng</label>
                <input
                  type="text"
                  name="ma"
                  value={product.ma}
                  onChange={handleInputChange}
                  className="border border-gray-300 p-2 rounded w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Tên hàng</label>
                <input
                  type="text"
                  name="ten"
                  value={product.ten}
                  onChange={handleInputChange}
                  className="border border-gray-300 p-2 rounded w-full"
                  required
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium">Mô tả</label>
                <textarea
                  name="description"
                  value={product.description}
                  onChange={handleInputChange}
                  className="border border-gray-300 p-2 rounded w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Số lượng</label>
                <input
                  type="number"
                  name="soLuong"
                  value={product.soLuong}
                  onChange={handleInputChange}
                  className="border border-gray-300 p-2 rounded w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Giá</label>
                <input
                  type="number"
                  name="giaNhap"
                  value={product.giaNhap}
                  onChange={handleInputChange}
                  className="border border-gray-300 p-2 rounded w-full"
                  required
                />
              </div>
            </div>
            <div className="mt-4 flex justify-between items-center">
               <div>
                  <label className="block text-sm font-medium">Ngày nhập hàng</label>
                  <input
                    type="date"
                    name="ngayNhapHang"
                    value={product.ngayNhapHang}
                    onChange={handleInputChange}
                    className="border border-gray-300 p-2 rounded w-full"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="style-button"
                >
                  {editingIndex !== null ? 'Cập nhật' : 'Lưu thông tin '}
                </button>
            </div>
          </form>
        </div>
      )}
      {filteredProducts.length === 0 && (
        <div className="mt-8 text-center">
          <p className="text-gray-500">Không có sản phẩm phù hợp với tìm kiếm của bạn.</p>
        </div>
      )}
      {filteredProducts.length > 0 && ( // Sử dụng danh sách đã lọc
        <div className="mt-8 w-full">
          <div className="flex items-center">
          <h2 className="text-xl font-bold ml-4 text-blue-500">Danh sách sản phẩm</h2>
          <button
            className="ml-auto text-white bg-blue-500 hover:bg-blue-700 font-bold py-2 px-4 rounded-lg mr-4"
            onClick={() => setConfirmationOpen(true)}>
            Gửi đơn hàng tới nhà cung cấp
          </button>
          </div>
          <div className="mt-4 overflow-x-auto">
  <table className="min-w-full bg-white border border-gray-200">
    <thead>
      <tr>
        <th className="px-4 py-2 border-b">Ngày nhập hàng</th>
        <th className="px-4 py-2 border-b">Mã hàng</th>
        <th className="px-4 py-2 border-b">Tên hàng</th>
        <th className="px-4 py-2 border-b">Mô tả</th>
        <th className="px-4 py-2 border-b">Số lượng</th>
        <th className="px-4 py-2 border-b">Giá</th>
        {/* <th className="px-4 py-2 border-b">Nhà cung cấp</th> */}
        <th className="px-4 py-2 border-b">Tổng số tiền</th>
        <th className="px-4 py-2 border-b">Chức năng</th>
      </tr>
    </thead>
    <tbody>
      {filteredProducts.map((item, index) => {
        const totalAmount = item.soLuong * item.giaNhap; // Tính tổng số tiền
        return (
          <tr key={index} className="text-center">
            <td className="px-4 py-2 border-b">{item.ngayNhapHang}</td>
            <td className="px-4 py-2 border-b">{item.ma}</td>
            <td className="px-4 py-2 border-b">{item.ten}</td>
            <td className="px-4 py-2 border-b">{item.description}</td>
            <td className="px-4 py-2 border-b">{item.soLuong}</td>
            <td className="px-4 py-2 border-b">{item.giaNhap}</td>
            <td className="px-4 py-2 border-b">{totalAmount}</td>
            <td className="px-4 py-2 border-b">
              <div className="flex justify-center space-x-2">
                <button
                  className="style-button"
                  onClick={() => handleEdit(index)}
                >
                  Sửa
                </button>
                <button
                  className="style-button"
                  onClick={() => handleDelete(index)}
                >
                  Xóa
                </button>
              </div>
            </td>
          </tr>
        );
      })}
    </tbody>
  </table>
</div>

        </div>
      )}
      {confirmationOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-5 rounded-lg shadow-md">
            <h2 className="text-lg font-bold mb-4">Bạn có chắc chắn với thông tin của mình không?</h2>
            <div className="flex justify-end">
              <button 
                className="style-button mr-4" 
                onClick={() => setConfirmationOpen(false)}
              >
                Không
              </button>
              {/* <Link href={{ pathname: '/billproduct', query: { products: JSON.stringify(productList) } }}> */}

            <button 
              className="style-button"
              onClick={handleConfirmSend}
            >
              Có
            </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
