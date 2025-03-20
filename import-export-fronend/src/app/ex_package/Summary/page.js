"use client";
import React, { useEffect, useState } from "react";
import InventoryTable from "./InventoryTable";
import Nav_bar from "@/app/components/Nav/Nav_bar";

export default function Summary() {
  return (
    <>
      <Nav_bar />
      <div className="flex flex-col space-y-4 mt-8 pt-16">
        <InventoryTable />
      </div>
    </>
  );
}
