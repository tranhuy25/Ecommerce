"use client";
import { Inter } from 'next/font/google';
import Nav_bar from "./components/Nav/Nav_bar";
import Link  from "next/link";

// Import font Montserrat từ Google Fonts
const montserrat = Inter({ subsets: ['latin'] });

export default function Home() {
    return(
<main className="h-screen"> {/* Đặt chiều cao cho phần tử cha */}
<Nav_bar />
        <div className="flex">
            <div className={`bg-white rounded-b-2xl w-[35%] ml-[15%] mt-[8%] h-[10%] font-bold text-center text-7xl p-4 mr-16 text-blue-800 ${montserrat.className}`}>Management</div>
        <div className={`bg-gray-300 rounded-t-2xl w-[35%] mt-[8%] h-[10%] font-bold text-center text-7xl p-4 text-white ${montserrat.className}`}>Packages</div>
        </div>
        <div className="bg-gray-300 rounded-b-2xl rounded-l-2xl w-[80%] mx-auto h-[60%] relative">
      {/* Div con ở đáy với chiều rộng bằng cha */}
      <div className="bg-white rounded-tr-xl h-[30%] w-[30%] absolute bottom-0 left-0 pt-2 pr-2">
        <div className="bg-white shadow-xl rounded-tr-xl rounded-bl-xl pl-4 pt-2 pb-2 h-full border-gray-50 border-2">
          <h1 className="text-lg text-blue-800 font-bold">Management Packages</h1>
          <p className="text-black text-sm mb-4">
            This platform is designed to simplify stock control, optimize order
            processing, ensure accuracy for seamless business operations.
          </p>
        </div>
      </div>
      <Link href="/im_package/SearchProduct">
      <button className="bg-white rounded-xl w-[20%] h-[10%] absolute bottom-4 right-4 flex items-center justify-center shadow-lg">
        <p className="text-blue-800 font-semibold">View More</p>
      </button>
      </Link>
    </div>
</main>
    );
}