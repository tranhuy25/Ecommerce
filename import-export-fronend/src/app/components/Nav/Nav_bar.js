"use client";
import { useState } from 'react';
import Link from 'next/link';

export default function Nav_bar() {
  // const [isXuatDropdownOpen, setXuatDropdownOpen] = useState(false);
  // const [isNhapDropdownOpen, setNhapDropdownOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full bg-blue-800 text-white p-4 z-20">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-lg font-semibold px-2 hover:border-b-2 border-white">Home</Link>

        <div className="flex space-x-4">
          <div className="relative">
          <Link href="/ex_package/Summary">
            <button
              className="hover:border-b-2 border-white px-2 py-2 font-semibold"
            >
              Export
            </button>
            </Link>
            {/* <button
              onClick={() => setXuatDropdownOpen(!isXuatDropdownOpen)}
              className="hover:border-b-2 border-white px-2 py-2 font-semibold"
            >
              Export
            </button>
            {isXuatDropdownOpen && (
              <div className="absolute top-full mt-2 bg-blue-600 rounded shadow-lg z-10">
                <Link href="/xuat-hang/bill" className="block px-4 py-2 hover:bg-blue-700">
                  Bill Export
                </Link>
              </div>
            )} */}
          </div>

          <div className="relative">
            <Link href="/im_package/AddProduct">
            <button
              className="hover:border-b-2 border-white px-2 py-2 font-semibold"
            >
              Import
            </button>
            </Link>
          </div>

          <div className="relative">
            <Link href="/im_package/SearchProduct">
            <button className="hover:border-b-2 border-white px-2 py-2 font-semibold">
              Inventory
            </button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
