"use client";
import React, { useState,useEffect } from "react";
import { useRouter } from "next/navigation";
import Nav_bar from "@/app/components/Nav/Nav_bar";
import Link from "next/link";

export default function ListDLC() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedDealerId, setSelectedDealerId] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [currentDealer, setCurrentDealer] = useState(null);
  const [backendDLC, setBackendDLC] = useState([]);
  const router = useRouter();

  const [exportedItems, setExportedItems] = useState([]);
  const [receiptCode, setReceiptCode] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  function generateRandomCode(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

  const [newDealer, setNewDealer] = useState({
    ten: "",
    ma: "",
    diaChi: "",
    phone: "",
  });
  const [selectedDealers, setSelectedDealers] = useState([]);

 

  useEffect(() => {
    // Lấy dữ liệu từ localStorage
    const items = localStorage.getItem('exportedItems');
    const code = localStorage.getItem('receiptCode');
    if (items) {
      setExportedItems(JSON.parse(items)); // Chuyển đổi từ JSON thành mảng
    }
    if (code) {
      setReceiptCode(code); // Cập nhật receiptCode vào state
    }
  }, []);

  useEffect(() => {
    const fetchDLC = async () => {
      try {
        const response = await fetch('http://localhost:3000/daily'); // Thay đổi URL cho phù hợp với backend của bạn
        if (!response.ok) {
          throw new Error('Network response was not ok'); // Kiểm tra phản hồi
        }
        const data = await response.json(); // Chuyển đổi phản hồi sang JSON
        setBackendDLC(data); // Lưu dữ liệu vào state
      } catch (error) {
        setError(error); // Lưu lỗi vào state nếu có
      } finally {
        setLoading(false); // Đặt loading về false khi hoàn thành
      }
    };
  
    fetchDLC(); // Gọi hàm fetchData
  }, []);

  const filteredPosts = backendDLC.filter(
    (item) =>
      item.ten.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.number?.includes(searchTerm) ||
      item.ma.includes(searchTerm) ||
      item.diaChi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.phone.includes(searchTerm)
  );

  const handleAddDealerSubmit = async (e) => {
    e.preventDefault();
    const maxNumber = backendDLC.length
      ? Math.max(...backendDLC.map((item) => parseInt(item.number, 10)))
      : 0;

      const newDealerData = {
        number: (maxNumber + 1).toString(),
        ten: newDealer.ten,
        ma: generateRandomCode(8), // Gọi hàm sinh mã ngẫu nhiên (độ dài mã là 8 ký tự)
        diaChi: newDealer.diaChi,
        phone: newDealer.phone,
        goods: [],
      };

    try {
      // Gửi yêu cầu POST đến API để lưu đại lý mới
      const response = await fetch('http://localhost:3000/daily/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newDealerData),
      });
  
      if (!response.ok) {
        throw new Error('Không thể thêm đại lý!');
      }
  
      // Nhận phản hồi từ API (nếu cần)
      const result = await response.json();
      console.log('Đại lý đã được lưu:', result);
      
    setBackendDLC((prevBackendDLC) => [...prevBackendDLC, newDealerData]);
    window.location.reload();
    setShowAddForm(false);
    setNewDealer({
      ten: "",
      diaChi: "",
      phone: "",
    });
  } catch (error) {
    console.error('Lỗi khi thêm đại lý:', error);
    alert('Đã xảy ra lỗi khi thêm đại lý!');
  }
  };

  const handleEditClick = (dealer) => {
    setCurrentDealer(dealer);
    setNewDealer({
      ten: dealer.ten,
      diaChi: dealer.diaChi,
      phone: dealer.phone,
    });
    setShowEditForm(true);
  };

  const handleEditDealerSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch(`http://localhost:3000/daily/edit/${currentDealer.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newDealer),
      });
      
      if (!response.ok) throw new Error('Unable to edit dealer!');
  
      setBackendDLC((prevBackendDLC) =>
        prevBackendDLC.map((dealer) =>
          dealer.id === currentDealer.id ? { ...dealer, ...newDealer } : dealer
        )
      );
      setShowEditForm(false);
      window.location.reload();
    } catch (error) {
      console.error('Error editing dealer:', error);
      alert('An error occurred while editing the dealer!');
    }
  };

  const handleDeleteClick = async (dealerId) => {
  if (window.confirm("Are you sure you want to delete this dealer?")) {
    try {
      const response = await fetch(`http://localhost:3000/daily/${dealerId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete dealer');

      setBackendDLC((prevBackendDLC) => prevBackendDLC.filter((dealer) => dealer.id !== dealerId));
    } catch (error) {
      console.error('Error deleting dealer:', error);
      alert('An error occurred while deleting the dealer');
    }
  }
};

  

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowAddForm(false);
      setShowEditForm(false);
    }
  };

  const handleDealerSelect = (id) => {
    // Nếu đã chọn đại lý này rồi thì bỏ chọn, nếu không thì chọn đại lý mới
    const newSelectedDealerId = selectedDealerId === id ? null : id;
    setSelectedDealerId(newSelectedDealerId);
};



  //////////////////////////////////////////////////////////////////////



  const handleExportGoods = () => {
    if (!selectedDealerId) {
      alert("Vui lòng chọn ít nhất một đại lý để xuất hàng.");
      return;
    }
    // Lấy thông tin của đại lý được chọn
    const selectedDealer = backendDLC.find(dealer => dealer.id === selectedDealerId);
    console.log('selectedDealer', selectedDealer);
    if (!selectedDealer) {
      alert("Không tìm thấy thông tin đại lý.");
      return;
    }
    const { ten, diaChi, phone } = selectedDealer;

    // Tạo mã dùng ngẫu nhiên
    const ma = generateRandomCode(8);
    console.log('ma', ma);

    // Lấy mã phiếu xuất từ receiptCode
    const maPhieuXuat = receiptCode;
    console.log('maPhieuXuat', maPhieuXuat);

    // Tạo dữ liệu để post API
    const data = {
      ma,
      ten,
      diaChi,
      phone,
      danhSachPhieuXuat: [
        {
          maPhieuXuat
        }
      ]
    };
    console.log('data', data);

    // Gửi yêu cầu post API
    fetch("http://localhost:3000/daily/add-dai-ly/-phieu-xuat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
    .then(response => {
      console.log("API response status:", response.status);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then(data => {
      console.log('API response', data);
          router.push("/ex_package/BillExport");
  })
  .catch(error => {
      console.error("Error:", error.message);
      alert("Lỗi hệ thống: " + error.message);
  });

    // Chuyển hướng đến form xuất hàng
    
  };
  return (
    <>
    <Nav_bar /> 
    <div className="pt-20">
      <h1 className="text-2xl text-blue-500 font-bold my-4 text-center">Danh sách hàng xuất</h1>
      {exportedItems.length === 0 ? (
        <p className="text-center">Không có hàng nào được xuất.</p>
      ) : (
        
        <table className="min-w-full border-collapse border border-gray-200 mx-auto">
          <thead>
            <tr>
              <th className="name-data-inventory">STT</th>
              <th className="name-data-inventory">Mã phiếu xuất</th>
              <th className="name-data-inventory">Mã hàng</th>
              <th className="name-data-inventory">Tên hàng</th>
              <th className="name-data-inventory">Số lượng</th>
              <th className="name-data-inventory">Giá</th>
              <th className="name-data-inventory">Tổng giá</th>
            </tr>
          </thead>
          <tbody>
            {exportedItems.map((item, index) => {
              const totalAmount = item.soLuong * item.giaNhap;
              return (
                <tr key={index}>
                  <td className="data-inventory">{index + 1}</td>
                  <td className="data-inventory">{receiptCode}</td>
                  <td className="data-inventory">{item.ma}</td>
                  <td className="data-inventory">{item.ten}</td>
                  <td className="data-inventory">{item.soLuong}</td>
                  <td className="data-inventory">{item.giaNhap.toLocaleString()} VNĐ</td>
                  <td className="data-inventory">{totalAmount.toLocaleString()} VNĐ</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
    <div className="pt-10">
      <h className="flex justify-center text-2xl text-blue-700 py-4 font-bold">Quản lý các đại lý con</h>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Tìm kiếm đại lý..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="box-input-export"
        />
      </div>

      <div className="mb-4 flex justify-center items-center space-x-4">
        <button
          onClick={() => setShowAddForm(true)}
          className="style-button w-[25%]"
        >
          Thêm đại lý
        </button>
        <button
          onClick={handleExportGoods}
          className="style-button w-[25%]"
        >
          Xuất hàng cho đại lý
        </button>
        <Link href="/ex_package/BillExport">
          <button className="style-button ">
            Xem hóa đơn xuất hàng tại đây
          </button>
        </Link>
      </div>

     

      {showAddForm && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10"
          onClick={handleOverlayClick}
        >
          <form
            onSubmit={handleAddDealerSubmit}
            className="bg-white p-6 rounded shadow-md w-[90%] max-w-md"
          >
            <h2 className="title-form">Thêm đại lý mới</h2>
            <div>
              <label className="title-input">Tên đại lý:</label>
              <input
                type="text"
                value={newDealer.ten}
                onChange={(e) =>
                  setNewDealer({ ...newDealer, ten: e.target.value })
                }
                className="box-input-export"
                required
              />
            </div>
            <div>
              <label className="title-input">Địa chỉ:</label>
              <input
                type="text"
                value={newDealer.diaChi}
                onChange={(e) =>
                  setNewDealer({ ...newDealer, diaChi: e.target.value })
                }
                className="box-input-export"
                required
              />
            </div>
            <div>
              <label className="title-input">Số điện thoại:</label>
              <input
                type="text"
                value={newDealer.phone}
                onChange={(e) =>
                  setNewDealer({ ...newDealer, phone: e.target.value })
                }
                className="box-input-export"
                required
              />
            </div>
            <div className="mt-4">
              <button type="submit" className="flex mx-auto justify-center style-button">
                Thêm đại lý
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
            onSubmit={handleEditDealerSubmit}
            className="bg-white p-6 rounded shadow-md w-[90%] max-w-md"
          >
            <h2 className="text-2xl font-bold mb-4 text-center">Sửa đại lý</h2>
            <div>
              <label className="block mb-1">Tên đại lý:</label>
              <input
                type="text"
                value={newDealer.ten}
                onChange={(e) =>
                  setNewDealer({ ...newDealer, ten: e.target.value })
                }
                className="box-input-export"
                required
              />
            </div>
            <div>
              <label className="block mb-1">Địa chỉ:</label>
              <input
                type="text"
                value={newDealer.diaChi}
                onChange={(e) =>
                  setNewDealer({ ...newDealer, diaChi: e.target.value })
                }
                className="box-input-export"
                required
              />
            </div>
            <div>
              <label className="block mb-1">Số điện thoại:</label>
              <input
                type="text"
                value={newDealer.phone}
                onChange={(e) =>
                  setNewDealer({ ...newDealer, phone: e.target.value })
                }
                className="box-input-export"
                required
              />
            </div>
            <div className="mt-4">
              <button type="submit" className="style-button">
                Cập nhật đại lý
              </button>
            </div>
          </form>
        </div>
      )}

      <table className="min-w-full border-collapse border border-gray-200">
        <thead>
          <tr>
            <th className="name-data-inventory">Chọn</th>
            <th className="name-data-inventory">STT</th>
            <th className="name-data-inventory">Tên đại lý</th>
            <th className="name-data-inventory">Địa chỉ</th>
            <th className="name-data-inventory">SĐT</th>
            <th className="name-data-inventory">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {filteredPosts.map((item, index) => (
            <tr key={item.number}>
              <td className="name-data-inventory text-center">
                <input
                  type="checkbox"
                  checked={selectedDealerId === item.id}
                  onChange={() => handleDealerSelect(item.id)}
                />
              </td>
              <td className="data-inventory">{index + 1}</td>
              <td className="data-inventory">{item.ten}</td>
              <td className="data-inventory">{item.diaChi}</td>
              <td className="data-inventory">{item.phone}</td>
              <td className="data-inventory">
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
          ))}
        </tbody>
      </table>
    </div>
    </>
  );
}
