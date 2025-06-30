"use client";

import { useState } from "react";
import ProductsClient from './../../../components/dashboard/Product/ProductsClient';

export default function ProductsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleSaveProduct = async (formData: FormData) => {
    // Implement your save logic here
    console.log("Saving product:", formData);
    // You would typically call an API here
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">إدارة المنتجات</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          إضافة منتج جديد
        </button>
      </div>

      {/* Your products list/table would go here */}

      {/* Product Modal */}
      <ProductsClient
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={selectedProduct}
        onSave={handleSaveProduct}
      />
    </div>
  );
}