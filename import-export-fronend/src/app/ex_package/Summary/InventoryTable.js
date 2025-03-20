"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';


export default function InventoryTable() {
  // Khởi tạo các state cần thiết
  const [isOpen, setIsOpen] = useState(false); // Trạng thái của popup xuất hàng
  const [selectedItem, setSelectedItem] = useState(null); // Mặt hàng được chọn để xuất
  const [quantity, setQuantity] = useState(''); // Số lượng hàng xuất
  const [searchTerm, setSearchTerm] = useState(''); // Từ khóa tìm kiếm
  const [exportedItems, setExportedItems] = useState([]); // Danh sách hàng đã xuất
  const [isEditing, setIsEditing] = useState(false); // Trạng thái chỉnh sửa
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [posts, setPosts] = useState([]); // Dữ liệu gốc từ API
  const [receiptCode, setReceiptCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const router = useRouter();

  // Hàm xử lý khi nhấn nút "Xuất hàng"
  const handleExportClick = (item) => {
    setSelectedItem(item); // Lưu mặt hàng được chọn
    setIsOpen(true); // Mở popup
    setIsEditing(false); // Thiết lập chế độ thêm mới
  };

  // Hàm xử lý khi đóng popup
  const handleClose = () => {
    setIsOpen(false); // Đóng popup
    setQuantity(''); // Đặt lại giá trị số lượng
    setSelectedItem(null); // Xóa mặt hàng đã chọn
  };

  // Hàm xử lý khi gửi thông tin xuất hàng
  const handleSubmit = (e) => {
    e.preventDefault(); // Ngăn chặn hành vi mặc định của form
  
    const exportedQuantity = parseInt(quantity); // Chuyển đổi số lượng xuất sang số nguyên
  
    if (isNaN(exportedQuantity)|| exportedQuantity <= 0) {
      alert('Số lượng phải là số dương.');
      return;
    }

    if(!isEditing){
    const currentPost = posts.find(post => post.id === selectedItem.id);
  if (exportedQuantity > currentPost.soLuong) {
    alert(`Số lượng xuất không được vượt quá ${currentPost.soLuong}.`);
    return;
  }
}

const currentPost = posts.find(post => post.id === selectedItem.id);

    const updatedItem = {
      id: selectedItem.id,
      ma: selectedItem.ma,
      ten: selectedItem.ten,
      soLuong: exportedQuantity,
      giaNhap: currentPost.giaNhap,
    };
  
    if (isEditing) {
      // Tìm hàng đã xuất trước đó
      const previousItem = exportedItems.find(item => item.id === selectedItem.id);
      const previousQuantity = previousItem ? previousItem.soLuong : 0;
  
      // Tính sự thay đổi số lượng
      const quantityDifference = previousQuantity - exportedQuantity;
  
      // Cập nhật số lượng trong danh sách hàng hóa
      const newPosts = posts.map(post =>
        post.id === selectedItem.id
          ? { ...post, soLuong: post.soLuong + quantityDifference }
          : post
      );
      setPosts(newPosts); // Cập nhật danh sách hàng hóa
  
      // Cập nhật danh sách hàng đã xuất
      setExportedItems(exportedItems.map(item =>
        item.id === selectedItem.id ? updatedItem : item
      ));
    } else {
      // Thêm mới vào danh sách hàng đã xuất
      setExportedItems([...exportedItems, updatedItem]);
  
      // Trừ số lượng xuất khỏi danh sách hàng hóa
      const newPosts = posts.map(post =>
        post.id === selectedItem.id
          ? { ...post, soLuong: post.soLuong - exportedQuantity }
          : post
      );
      setPosts(newPosts);
    }
  
    handleClose(); // Đóng popup
  };
  
  // Hàm xử lý khi nhấn nút "Sửa" trên mục đã xuất
  const handleEdit = (item) => {
    setSelectedItem(item); // Lưu mặt hàng được chọn
    setQuantity(item.soLuong); // Đặt số lượng hiện có vào input
    setIsOpen(true); // Mở popup
    setIsEditing(true); // Kích hoạt chế độ chỉnh sửa
  };

  // Hàm xử lý khi nhấn nút "Xóa" trên mục đã xuất
  const handleDelete = (id) => {
    const itemToDelete = exportedItems.find(item => item.id === id); // Tìm mục cần xóa

  if (window.confirm('Bạn có chắc chắn muốn xóa không?')) {
    // Cập nhật lại số lượng trong danh sách hàng hóa
    setPosts(posts.map(post =>
      post.id === id ? { ...post, soLuong: post.soLuong + itemToDelete.soLuong } : post
    ));
      setExportedItems(exportedItems.filter(item => item.id !== id)); // Lọc và xóa mục
    }
  };

  // Lọc danh sách hàng hóa theo từ khóa tìm kiếm
  const filteredPosts = posts.filter(item =>
    item.ten.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.ma.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleConfirmSend = async () => {
    try {
       // Hàm tạo mã ngẫu nhiên
    function generateRandomCode(length) {
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let result = '';
      for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
      }
      return result;
    }

    // Tạo mã phiếu xuất ngẫu nhiên
    const receiptCode = generateRandomCode(4);

      const receiptData = {
        ma: receiptCode, // Đổi tên trường thành maPhieuXuat
        danhSachHangHoa: exportedItems.map(item => ({
          maHangHoa: item.ma, // Đổi tên trường thành maHangHoa
          soLuong: item.soLuong // Giữ nguyên trường soLuong
        })),
      };

      console.log('Dữ liệu phiếu xuất sẽ được gửi:', JSON.stringify(receiptData));

      if (!Array.isArray(exportedItems)) {
        throw new Error('exportedItems is not an array');
      }

      const response = await fetch('http://localhost:3000/phieu-xuat/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(receiptData), // Gửi dữ liệu phiếu xuất
      });
  
      if (!response.ok) {
        throw new Error('Không thể tạo phiếu xuất!');
      }

      // Lưu danh sách hàng đã xuất vào localStorage
    localStorage.setItem('exportedItems', JSON.stringify(exportedItems));
    localStorage.setItem('receiptCode', receiptCode);



      const updatedPosts = posts.map(post => {
        const exportedItem = exportedItems.find(item => item.id === post.id);
        // if (exportedItem) {
        //   return { ...post, soLuong: post.soLuong - exportedItem.soLuong };
        // }
        return post;
      });
  
      // Gửi yêu cầu PUT cho từng mặt hàng
      for (const item of updatedPosts) {
        const updateResponse = await fetch(`http://localhost:3000/hanghoa/update/${item.ma}`, {
          method: 'PUT', // Sử dụng PUT để cập nhật
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ soLuong: item.soLuong }), // Gửi số lượng đã cập nhật cho từng mặt hàng
        });
  
        if (!updateResponse.ok) {
          throw new Error(`Không thể cập nhật số lượng hàng hóa với ID ${item.ma}!`);
        }
      }
  
      // Nếu mọi thứ đều ổn, điều hướng tới trang ListDLC
      router.push('/ex_package/ListDLC');
    } catch (error) {
      console.error('Lỗi khi gửi dữ liệu:', error);
      alert('Đã xảy ra lỗi khi gửi dữ liệu!');
    }
  };

  useEffect(() => {
    const fetchHangHoa = async () => {
      try {
        const response = await fetch('http://localhost:3000/hanghoa/get-du-lieu'); 
        if (!response.ok) {
          throw new Error('Lỗi khi tải dữ liệu');
        }
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHangHoa();
  }, []);

  const handleGoToDealerPage = () => {
    if (exportedItems.length === 0) {
      alert('Vui lòng chọn hàng xuất trước khi đi tới trang đại lý!');
      return;
    }
    setConfirmationOpen(true); // Mở popup xác nhận
  };

  return (
    <div> 
      
      <h1 className="text-2xl text-blue-500 font-bold my-4 text-center">Danh sách hàng hóa</h1>

      <div className="flex gap-x-4 my-4 items-center justify-center w-[95%] mx-auto">
      {/* <Link href="/ex_package/ListDLC">
      <button className="style-button">
        Quay lại trang đại lý 
      </button>
      </Link> */}
      <input
        type="text"
        placeholder="Tìm kiếm theo mã hàng hoặc tên hàng"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)} // Cập nhật từ khóa tìm kiếm
        className="border border-gray-300 p-2 w-[80%] rounded-lg"
      />
      <Link href="/ex_package/BillExport">
      <button className="style-button">
        Xem hóa đơn xuất hàng
      </button>
      </Link>
      </div>
     
      {/* Input tìm kiếm */}
      

      {/* Bảng danh sách hàng hóa */}
      <table className="min-w-full border-collapse border border-gray-200">
        <thead>
          <tr>
            <th className="border border-gray-200 p-2">STT</th>
            <th className="border border-gray-200 p-2">Mã hàng</th>
            <th className="border border-gray-200 p-2">Tên hàng</th>
            <th className="border border-gray-200 p-2">Số lượng</th>
            <th className="border border-gray-200 p-2">Giá</th>
            <th className="border border-gray-200 p-2">Chức năng</th>
          </tr>
        </thead>
        <tbody>
          {filteredPosts.map((item, index) => (
            <tr key={item.id}>
              <td className="border border-gray-200 p-2 text-center">{index + 1}</td>
              <td className="border border-gray-200 p-2 text-center">{item.ma}</td>
              <td className="border border-gray-200 p-2 text-center">{item.ten}</td>
              <td className="border border-gray-200 p-2 text-center">{item.soLuong}</td>
              <td className="border border-gray-200 p-2 text-center">{item.giaNhap.toLocaleString()} VNĐ</td>
              <td className="border border-gray-200 p-2 text-center">
                <button
                  onClick={() => handleExportClick(item)} // Gọi hàm xuất hàng khi nhấn nút
                  className="style-button"
                  disabled={item.soLuong === 0} // Vô hiệu hóa nút nếu không còn hàng
                >
                  Xuất hàng
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Bảng danh sách hàng đã xuất */}
      <div className="flex items-center w-[92%] mx-auto">
      <h2 className="text-xl font-bold my-4 text-blue-500">Danh sách hàng được xuất</h2>
      <button
            className="ml-auto text-white bg-blue-600 hover:bg-blue-700 font-bold py-2 px-4 rounded-lg mr-4"
            onClick={handleGoToDealerPage}>
            Đi tới trang đại lý
          </button>
        </div>
      <table className="min-w-full border-collapse border border-gray-200">
        <thead>
          <tr>
            <th className="border border-gray-200 p-2">STT</th>
            <th className="border border-gray-200 p-2">Mã hàng</th>
            <th className="border border-gray-200 p-2">Tên hàng</th>
            <th className="border border-gray-200 p-2">Số lượng</th>
            <th className="border border-gray-200 p-2">Giá</th>
            <th className="border border-gray-200 p-2">Tổng giá</th>
            <th className="border border-gray-200 p-2">Chức năng</th>

          </tr>
        </thead>
        <tbody>
          {exportedItems.map((item, index)=> {
                        const totalAmount = item.soLuong * item.giaNhap; 
                        return (
            <tr key={item.id}>
              <td className="border border-gray-200 p-2 text-center">{index + 1}</td>
              <td className="border border-gray-200 p-2 text-center">{item.ma}</td>
              <td className="border border-gray-200 p-2 text-center">{item.ten}</td>
              <td className="border border-gray-200 p-2 text-center">{item.soLuong}</td>
              <td className="border border-gray-200 p-2 text-center">{item.giaNhap} VNĐ</td>
              <td className="border border-gray-200 p-2 text-center">{totalAmount.toLocaleString()} VNĐ</td>
              <td className="border border-gray-200 p-2 text-center">
                <button
                  onClick={() => handleEdit(item)} // Gọi hàm chỉnh sửa khi nhấn nút
                  className="style-button"
                >
                  Sửa
                </button>
                <button
                  onClick={() => handleDelete(item.id)} // Gọi hàm xóa khi nhấn nút
                  className="style-button ml-2"
                >
                  Xóa
                </button>
              </td>
            </tr>
          )})}
        </tbody>
      </table>

      {/* Popup nhập thông tin xuất hàng */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50">
          <div className="bg-white p-5 rounded shadow-lg">
            <h2 className="text-lg font-bold mb-4">
              Nhập thông tin xuất hàng cho {selectedItem.ten}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block mb-1">Số lượng:</label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)} // Cập nhật số lượng
                  className="border border-gray-300 p-2 w-full"
                  required
                />
              </div>
              {/* <div className="mb-4">
                <label className="block mb-1">Giá:</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)} // Cập nhật giá
                  className="border border-gray-300 p-2 w-full"
                  required
                />
              </div> */}
              <div className="flex justify-between">
                <button type="submit" className="style-button">
                  Xác nhận
                </button>
                <button type="button" onClick={handleClose} className="style-button">
                  Hủy
                </button>
              </div>
            </form>
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
};

