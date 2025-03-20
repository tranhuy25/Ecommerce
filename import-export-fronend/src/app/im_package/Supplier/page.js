"use client";
import Nav_bar from '@/app/components/Nav/Nav_bar';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Supplier() {
  const [productList, setProductList] = useState([]);
  const [backendNCC, setBackendNCC] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedNCC, setSelectedNCC] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [currentNCC, setCurrentNCC] = useState(null);
  const [isTableVisible, setIsTableVisible] = useState(false);

  const router = useRouter();

  const handleToggleTable = () => {
    setIsTableVisible(!isTableVisible);
  };
  const [newNCC, setNewNCC] = useState({
    ten: "",
    ma: "",
    diaChi: "",
    soDienThoai: "",
  });

  useEffect(() => {
    // Lấy danh sách sản phẩm từ localStorage
    const storedProducts = localStorage.getItem('productList');
    if (storedProducts) {
      setProductList(JSON.parse(storedProducts));
    }
  }, []);

  const filteredNCC = backendNCC.filter(
    (item) =>
      item.ten.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.number?.includes(searchTerm) ||
      item.ma.includes(searchTerm) ||
      item.diaChi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.soDienThoai.includes(searchTerm)
  );

  const saveDataToDatabase = async () => {
    // Lấy danh sách sản phẩm từ localStorage
    const storedProductList = localStorage.getItem('productList');
    console.log('Dữ liệu lấy từ localStorage:', storedProductList);
    if (!storedProductList) {
      console.log('Không có sản phẩm nào trong localStorage.');
      return;
    }
  
    // Parse dữ liệu từ JSON trong localStorage
    const productList = JSON.parse(storedProductList);
    console.log('Dữ liệu đã lấy từ localStorage:', productList);
  
    // Kiểm tra nếu productList tồn tại và không rỗng
    if (productList.length > 0) {
      if (!selectedNCC) {
        alert('Vui lòng chọn một nhà cung cấp trước khi gửi hóa đơn!'); // Hiển thị thông báo
        return; // Dừng hàm nếu không có nhà cung cấp nào được chọn
      }
      // Tạo mảng products mới, bỏ qua trường không cần thiết
      const products = productList.map(product => {
        return {
          ma: product.ma,
          ten: product.ten,
          description: product.moTa || "",
          soLuong: Number(product.soLuong) || 0,
          giaNhap: Number(product.giaNhap) || 0,
        };
      });
  
      // Kiểm tra dữ liệu trước khi gửi
      console.log('Dữ liệu gửi đi:', products);
  
      try {
        // Duyệt qua từng sản phẩm và gửi riêng từng sản phẩm
        for (const product of products) {
          const response = await fetch('http://localhost:3000/hanghoa/create-hang-hoa', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(product), // Gửi từng sản phẩm một
          });
  
          // Nếu phản hồi không thành công, ném lỗi để dừng việc gửi tiếp
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
  
          // Lấy dữ liệu phản hồi từ API sau khi gửi thành công
          const data = await response.json();
          console.log('Dữ liệu đã được gửi thành công:', data);
        }
        
        // Điều hướng đến trang khác sau khi gửi thành công
        router.push('/im_package/BillProduct');
      } catch (error) {
        // Xử lý lỗi khi gửi dữ liệu vào cơ sở dữ liệu
        console.error('Lỗi khi gửi dữ liệu vào cơ sở dữ liệu:', error);
      }
    } else {
      console.log('Danh sách sản phẩm trống.');
    }
  };

  const handleSelectNCC = (id) => {
    // Nếu đã chọn nhà cung cấp này rồi thì bỏ chọn, nếu không thì chọn nhà cung cấp mới
    const newSelectedNCCId = selectedNCC && selectedNCC.id === id ? null : id;
    setSelectedNCC(newSelectedNCCId ? backendNCC.find(item => item.id === newSelectedNCCId) : null); // Cập nhật state

    // Lưu vào localStorage
    if (newSelectedNCCId) {
        const selectedNCCData = backendNCC.filter(item => item.id === newSelectedNCCId);
        localStorage.setItem('selectedNCCData', JSON.stringify(selectedNCCData));
        console.log('Nhà cung cấp đã được lưu vào localStorage:', selectedNCCData);
    } else {
        // Nếu không có nhà cung cấp nào được chọn thì xóa dữ liệu trong localStorage
        localStorage.removeItem('selectedNCCData');
        console.log('Đã xóa nhà cung cấp khỏi localStorage.');
    }
};

  const handleAddNCCSubmit = async (e) => {
    e.preventDefault();
    const maxNumber = backendNCC.length
      ? Math.max(...backendNCC.map((item) => parseInt(item.number, 10)))
      : 0;

    const newNCCData = {
      number: (maxNumber + 1).toString(),
      ...newNCC,
    };

    try {
      // Gửi yêu cầu POST đến API để lưu đại lý mới
      const response = await fetch('http://localhost:3000/nha-cung-cap/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newNCCData),
      });
  
      if (!response.ok) {
        throw new Error('Không thể thêm đại lý!');
      }
  
      // Nhận phản hồi từ API (nếu cần)
      const result = await response.json();
      console.log('Đại lý đã được lưu:', result);
      
    setBackendNCC((prevBackendNCC) => [...prevBackendNCC, newNCCData],
    );

    setShowAddForm(false);
    setNewNCC({
      ten: "",
      ma: "",
      diaChi: "",
      soDienThoai: "",
    });
    window.location.reload();
  } catch (error) {
    console.error('Lỗi khi thêm đại lý:', error);
    alert('Đã xảy ra lỗi khi thêm đại lý!');
  }
  };


  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowAddForm(false);
      setShowEditForm(false);
    }
  };

  const handleEditClick = (NCC) => {
    setCurrentNCC(NCC);
    setNewNCC({
      ten: NCC.ten,
      ma: NCC.ma,
      diaChi: NCC.diaChi,
      soDienThoai: NCC.soDienThoai
    });
    setShowEditForm(true);
  };

  const handleEditNCCSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch(`http://localhost:3000/nha-cung-cap/${currentNCC.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newNCC),
      });
      
      if (!response.ok) throw new Error('Unable to edit dealer!');
  
      setBackendNCC((prevBackendNCC) =>
        prevBackendNCC.map((NCC) =>
          NCC.id === currentNCC.id ? { ...NCC, ...newNCC } : NCC
        )
      );
      setShowEditForm(false);
      window.location.reload();
    } catch (error) {
      console.error('Error editing dealer:', error);
      alert('An error occurred while editing the dealer!');
    }
  };


  useEffect(() => {
  const fetchNCC = async () => {
      try {
        const response = await fetch('http://localhost:3000/nha-cung-cap'); 
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json(); // Chuyển đổi phản hồi sang JSON
        setBackendNCC(data); // Lưu dữ liệu vào state
      } catch (error) {
        setError(error); // Lưu lỗi vào state nếu có
      } finally {
        setLoading(false); // Đặt loading về false khi hoàn thành
      }
    };
  
    fetchNCC(); // Gọi hàm fetchData
  }, []);

 

  const handleDeleteClick = async (NCCId) => {
    if (window.confirm("Are you sure you want to delete this dealer?")) {
      try {
        const response = await fetch(`http://localhost:3000/nha-cung-cap/${NCCId}`, {
          method: 'DELETE',
        });
  
        if (!response.ok) throw new Error('Failed to delete dealer');
  
        setBackendNCC((prevBackendNCC) => prevBackendNCC.filter((NCC) => NCC.id !== NCCId));
      } catch (error) {
        console.error('Error deleting dealer:', error);
        alert('An error occurred while deleting the dealer');
      }
    }
  };

  if (loading) {
      return <div className="text-center">Đang tải dữ liệu...</div>; // Thông báo tải dữ liệu
  }

  if (error) {
      return <div className="text-red-500 text-center">Lỗi: {error}</div>; // Hiển thị thông báo lỗi
  }
  

  const totalPayment = productList.reduce((total, item) => {
    return total + item.soLuong * item.giaNhap;
  }, 0);
  return (
    <>
    <Nav_bar />
    
    <div className="flex flex-col space-y-4 mt-8 pt-16">
      <h1 className="text-2xl font-bold mr-4 text-center">Nhà cung cấp</h1>
      <div className="w-full flex justify-center">
        <div className="w-3/5 border-t-2 border-blue-700"></div>
      </div>

      <div className="mx-auto flex gap-x-2">
      <Link href="/im_package/AddProduct">
        <button className="style-button">
          Quay lại trang thêm hàng cần nhập
        </button>
      </Link>
      <Link href="/im_package/BillProduct">
          <button className="style-button ">
            Xem hóa đơn nhập hàng tại đây
          </button>
      </Link>
      </div>
      {productList.length === 0 ? (
        <div className="mt-8 text-center">
          <p className="text-gray-500">Không có sản phẩm nào cần được nhập.</p>
        </div>
      ) : (
        <div className="mt-8 w-full overflow-x-auto">
          <h2 className="text-xl font-bold ml-4 text-blue-500">Danh sách sản phẩm cần nhập</h2>
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




      {/* //////////////////////<ListNCC />/////////////////////////////////////////// */}



    <div className="flex flex-col space-y-4">
      {backendNCC.length === 0 ? (
        <div className="mt-8 text-center">
          <p className="text-gray-500">Không có nhà cung cấp nào.</p>
        </div>
      ) : (
        <div className="mt-8 w-full overflow-x-auto">
          <h2 className="text-xl font-bold ml-4 text-blue-500">Danh sách nhà cung cấp</h2>
          <div className="mb-4 ml-4">
            <input
              type="text"
              placeholder="Tìm kiếm nhà cung cấp..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 p-2 rounded w-full"
            />
          </div>
          <div className="mb-4 flex justify-center items-center space-x-4">
          <button
        onClick={handleToggleTable}
        className="style-button w-[25%]"
      >
        {isTableVisible ? 'Ẩn Danh Sách' : 'Hiện Danh Sách Nhà Cung Cấp'}
      </button>
        <button
          onClick={() => setShowAddForm(true)}
          className="style-button w-[25%]"
        >
          Thêm nhà cung cấp
        </button>
        <button
          onClick={saveDataToDatabase}
          className="style-button w-[25%]"
        >
          Gửi hóa đơn nhập hàng
        </button>
        {/* <button
          onClick={handleExportGoods}
          className="style-button w-[25%]"
        >
          Xuất hàng cho đại lý
        </button> */}
        </div>
        {showAddForm && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10"
          onClick={handleOverlayClick}
        >
          <form
            onSubmit={handleAddNCCSubmit}
            className="bg-white p-6 rounded shadow-md w-[90%] max-w-md"
          >
            <h2 className="text-2xl font-bold mb-4">Thêm nhà cung cấp mới</h2>
            <div>
              <label className="block mb-1">Tên nhà cung cấp:</label>
              <input
                type="text"
                value={newNCC.ten}
                onChange={(e) =>
                  setNewNCC({ ...newNCC, ten: e.target.value })
                }
                className="border border-gray-300 p-2 rounded w-full"
                required
              />
            </div>
            <div>
              <label className="block mb-1">Mã nhà cung cấp:</label>
              <input
                type="text"
                value={newNCC.ma}
                onChange={(e) =>
                  setNewNCC({ ...newNCC, ma: e.target.value })
                }
                className="border border-gray-300 p-2 rounded w-full"
                required
              />
            </div>
            <div>
              <label className="block mb-1">Địa chỉ:</label>
              <input
                type="text"
                value={newNCC.diaChi}
                onChange={(e) =>
                  setNewNCC({ ...newNCC, diaChi: e.target.value })
                }
                className="border border-gray-300 p-2 rounded w-full"
                required
              />
            </div>
            <div>
              <label className="block mb-1">Số điện thoại:</label>
              <input
                type="text"
                value={newNCC.soDienThoai}
                onChange={(e) =>
                  setNewNCC({ ...newNCC, soDienThoai: e.target.value })
                }
                className="border border-gray-300 p-2 rounded w-full"
                required
              />
            </div>
            <div className="mt-4">
              <button type="submit" className="bg-blue-500 text-white font-bold py-2 px-4 rounded w-full">
                Thêm nhà cung cấp
              </button>
            </div>
          </form>
        </div>
      )}
      {showEditForm && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10"
          onClick={handleOverlayClick}
        >
          <form
            onSubmit={handleEditNCCSubmit}
            className="bg-white p-6 rounded shadow-md w-[90%] max-w-md"
          >
            <h2 className="text-2xl font-bold mb-4 text-center">Sửa đại lý</h2>
            <div>
              <label className="block mb-1">Tên nhà cung cấp:</label>
              <input
                type="text"
                value={newNCC.ten}
                onChange={(e) =>
                  setNewNCC({ ...newNCC, ten: e.target.value })
                }
                className="border border-gray-300 p-2 rounded w-full"
                required
              />
            </div>
            <div>
              <label className="block mb-1">Mã nhà cung cấp:</label>
              <input
                type="text"
                value={newNCC.ma}
                onChange={(e) =>
                  setNewNCC({ ...newNCC, ma: e.target.value })
                }
                className="border border-gray-300 p-2 rounded w-full"
                required
              />
            </div>
            <div>
              <label className="block mb-1">Địa chỉ:</label>
              <input
                type="text"
                value={newNCC.diaChi}
                onChange={(e) =>
                  setNewNCC({ ...newNCC, diaChi: e.target.value })
                }
                className="border border-gray-300 p-2 rounded w-full"
                required
              />
            </div>
            <div>
              <label className="block mb-1">Số điện thoại:</label>
              <input
                type="text"
                value={newNCC.soDienThoai}
                onChange={(e) =>
                  setNewNCC({ ...newNCC, soDienThoai: e.target.value })
                }
                className="border border-gray-300 p-2 rounded w-full"
                required
              />
            </div>
            <div className="mt-4">
              <button type="submit" className="bg-blue-500 text-white font-bold py-2 px-4 rounded w-full">
                Cập nhật nhà cung cấp
              </button>
            </div>
          </form>
        </div>
      )}
          {isTableVisible && (
          <table className="min-w-full mt-4 border-collapse border border-gray-300">
            <thead>
              <tr className="bg-blue-200">
                <th className="border border-gray-300 p-2">Chọn</th>
                <th className="border border-gray-300 p-2">Số thứ tự</th>
                <th className="border border-gray-300 p-2">Mã nhà cung cấp</th>
                <th className="border border-gray-300 p-2">Tên nhà cung cấp</th>
                <th className="border border-gray-300 p-2">Địa chỉ</th>
                <th className="border border-gray-300 p-2">Số điện thoại</th>
                <th className="border border-gray-200 p-2">Chức năng</th>
              </tr>
            </thead>
            <tbody>
              {filteredNCC.map((item, index) =>(
                  <tr key={index} className="bg-gray-100">
                        <td className="border border-gray-300 p-2 text-center">
                            <input
                                type="checkbox"
                                checked={selectedNCC  && selectedNCC.id === item.id} // Kiểm tra xem có được chọn hay không
                                onChange={() => handleSelectNCC(item.id)} // Xử lý khi checkbox được chọn
                            />
                        </td>                                  
                    <td className="border border-gray-300 p-2 text-center">{index + 1}</td>
                    <td className="border border-gray-300 p-2 text-center">{item.ma}</td>
                    <td className="border border-gray-300 p-2 text-center">{item.ten}</td>
                    <td className="border border-gray-300 p-2 text-center">{item.diaChi}</td>
                    <td className="border border-gray-300 p-2 text-right">{item.soDienThoai}</td>
                    <td className="border border-gray-200 p-2">
                <div className="flex justify-center space-x-2">
                <button
                  onClick={() => handleEditClick(item)}
                  className="style-button"
                >
                  Sửa
                </button>
                <button
                  onClick={() => handleDeleteClick(item.id)}
                  className="style-button"
                >
                  Xóa
                </button>
                </div>
              </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
          )}
        </div>
      )}
    </div>
    </>
  );
}
