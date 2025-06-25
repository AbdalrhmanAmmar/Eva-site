import { create } from "zustand";

export interface Product {
  _id: string;
  name: string;
  description: string;
  priceBeforeDiscount?: number;
  priceAfterDiscount: number;
  quantity: number;
  points: number;
  image?: string;
  category: string;
  createdBy: {
    _id: string;
    name: string;
  };
  createdAt: string;
}

interface ProductsState {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setProducts: (products: Product[]) => void;
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // API Actions
  fetchProducts: () => Promise<void>;
  createProduct: (productData: Partial<Product>) => Promise<Product | null>;
  updateProductAPI: (id: string, productData: Partial<Product>) => Promise<Product | null>;
  deleteProductAPI: (id: string) => Promise<boolean>;
  
  // Computed values
  getTotalProducts: () => number;
  getTotalValue: () => number;
  getTotalQuantity: () => number;
  getLowStockProducts: () => Product[];
  getOutOfStockProducts: () => Product[];
  getAveragePrice: () => number;
  getTotalPoints: () => number;
  getDiscountedProducts: () => Product[];
  getProductsByCategory: (category: string) => Product[];
  searchProducts: (searchTerm: string) => Product[];
}

const API_BASE_URL = "http://localhost:4000/api";

export const useProductsStore = create<ProductsState>((set, get) => ({
  products: [],
  isLoading: false,
  error: null,

  // Actions
  setProducts: (products) => set({ products }),
  
  addProduct: (product) => set((state) => ({
    products: [product, ...state.products]
  })),
  
  updateProduct: (id, updates) => set((state) => ({
    products: state.products.map(product =>
      product._id === id ? { ...product, ...updates } : product
    )
  })),
  
  deleteProduct: (id) => set((state) => ({
    products: state.products.filter(product => product._id !== id)
  })),
  
  setLoading: (loading) => set({ isLoading: loading }),
  
  setError: (error) => set({ error }),

  // API Actions
  fetchProducts: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: "GET",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "حدث خطأ في جلب المنتجات");
      }

      set({ products: data.products || data, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.message || "حدث خطأ في الاتصال بالخادم",
        isLoading: false 
      });
    }
  },

  createProduct: async (productData) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: "POST",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "حدث خطأ في إضافة المنتج");
      }

      const newProduct = data.product || data;
      set((state) => ({
        products: [newProduct, ...state.products],
        isLoading: false
      }));

      return newProduct;
    } catch (error: any) {
      set({ 
        error: error.message || "حدث خطأ في الاتصال بالخادم",
        isLoading: false 
      });
      return null;
    }
  },

  updateProductAPI: async (id, productData) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: "PUT",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "حدث خطأ في تحديث المنتج");
      }

      const updatedProduct = data.product || data;
      set((state) => ({
        products: state.products.map(product =>
          product._id === id ? updatedProduct : product
        ),
        isLoading: false
      }));

      return updatedProduct;
    } catch (error: any) {
      set({ 
        error: error.message || "حدث خطأ في الاتصال بالخادم",
        isLoading: false 
      });
      return null;
    }
  },

  deleteProductAPI: async (id) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: "DELETE",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "حدث خطأ في حذف المنتج");
      }

      set((state) => ({
        products: state.products.filter(product => product._id !== id),
        isLoading: false
      }));

      return true;
    } catch (error: any) {
      set({ 
        error: error.message || "حدث خطأ في الاتصال بالخادم",
        isLoading: false 
      });
      return false;
    }
  },

  // Computed values
  getTotalProducts: () => get().products.length,
  
  getTotalValue: () => get().products.reduce(
    (sum, product) => sum + (product.priceAfterDiscount * product.quantity), 0
  ),
  
  getTotalQuantity: () => get().products.reduce(
    (sum, product) => sum + product.quantity, 0
  ),
  
  getLowStockProducts: () => get().products.filter(
    product => product.quantity < 10 && product.quantity > 0
  ),
  
  getOutOfStockProducts: () => get().products.filter(
    product => product.quantity === 0
  ),
  
  getAveragePrice: () => {
    const products = get().products;
    if (products.length === 0) return 0;
    return products.reduce((sum, product) => sum + product.priceAfterDiscount, 0) / products.length;
  },
  
  getTotalPoints: () => get().products.reduce(
    (sum, product) => sum + product.points, 0
  ),
  
  getDiscountedProducts: () => get().products.filter(
    product => product.priceBeforeDiscount
  ),
  
  getProductsByCategory: (category) => {
    if (category === "الكل") return get().products;
    return get().products.filter(product => product.category === category);
  },
  
  searchProducts: (searchTerm) => {
    if (!searchTerm.trim()) return get().products;
    const term = searchTerm.toLowerCase();
    return get().products.filter(product =>
      product.name.toLowerCase().includes(term) ||
      product.description.toLowerCase().includes(term) ||
      product.category.toLowerCase().includes(term)
    );
  },
}));