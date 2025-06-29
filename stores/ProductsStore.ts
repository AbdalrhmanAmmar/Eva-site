import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Product {
  _id: string;
  name: string;
  description: string;
  priceBeforeDiscount: number;
  priceAfterDiscount: number;
  quantity: number;
  images: string[];
  category: string;
  tag?: string;
  shortDescription?: string;
  showReviews: boolean;
  averageRating?: number;
  numberOfReviews?: number;
  createdBy: {
    _id: string;
    name: string;
    email?: string;
  };
  createdAt: string;
  updatedAt?: string;
  reviews?: Array<{
    _id: string;
    user: {
      _id: string;
      name: string;
      avatar?: string;
    };
    rating: number;
    comment?: string;
    createdAt: string;
  }>;
}

interface ProductsState {
  products: Product[];
  featuredProducts: Product[];
  isLoading: boolean;
  error: string | null;
  categories: string[];
  selectedCategory: string;
  searchTerm: string;
  sortOption: string;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  
  // Actions
  setProducts: (products: Product[]) => void;
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSelectedCategory: (category: string) => void;
  setSearchTerm: (term: string) => void;
  setSortOption: (option: string) => void;
  setPagination: (pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  }) => void;
  
  // API Actions
  fetchProducts: (params?: {
    page?: number;
    limit?: number;
    category?: string;
    tag?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    sortBy?: string;
  }) => Promise<void>;
  fetchFeaturedProducts: () => Promise<void>;
  fetchProductById: (id: string) => Promise<Product | null>;
  createProduct: (productData: FormData) => Promise<Product | null>;
  updateProductAPI: (id: string, productData: FormData) => Promise<Product | null>;
  deleteProductAPI: (id: string) => Promise<boolean>;
  fetchCategories: () => Promise<void>;
  
  // Computed values
  getTotalProducts: () => number;
  getTotalValue: () => number;
  getTotalQuantity: () => number;
  getLowStockProducts: () => Product[];
  getOutOfStockProducts: () => Product[];
  getAveragePrice: () => number;
  getDiscountedProducts: () => Product[];
  getProductsByCategory: (category: string) => Product[];
  searchProducts: (searchTerm: string) => Product[];
  getFilteredProducts: () => Product[];
}

const API_BASE_URL = "http://localhost:4000/api";

export const useProductsStore = create<ProductsState>()(
  persist(
    (set, get) => ({
      products: [],
      featuredProducts: [],
      isLoading: false,
      error: null,
      categories: [],
      selectedCategory: "الكل",
      searchTerm: "",
      sortOption: "الأحدث",
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        pages: 1,
      },

      // Basic actions
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
      setSelectedCategory: (category) => set({ selectedCategory: category }),
      setSearchTerm: (term) => set({ searchTerm: term }),
      setSortOption: (option) => set({ sortOption: option }),
      setPagination: (pagination) => set({ pagination }),

      // API Actions
      fetchProducts: async (params = {}) => {
        set({ isLoading: true, error: null });
        
        try {
          const queryParams = new URLSearchParams();
          
          // Add all provided params to the query
          Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined) {
              queryParams.append(key, String(value));
            }
          });
          
          const response = await fetch(`${API_BASE_URL}/products?${queryParams.toString()}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || "Failed to fetch products");
          }

          set({
            products: data.products,
            pagination: {
              page: data.page || 1,
              limit: data.limit || 10,
              total: data.total || 0,
              pages: data.pages || 1,
            },
            isLoading: false,
          });
        } catch (error: any) {
          set({ 
            error: error.message || "Failed to fetch products",
            isLoading: false,
          });
          throw error;
        }
      },

      fetchFeaturedProducts: async () => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await fetch(`${API_BASE_URL}/products?isFeatured=true&limit=4`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || "Failed to fetch featured products");
          }

          set({
            featuredProducts: data.products,
            isLoading: false,
          });
        } catch (error: any) {
          set({ 
            error: error.message || "Failed to fetch featured products",
            isLoading: false,
          });
        }
      },

      fetchProductById: async (id) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await fetch(`${API_BASE_URL}/products/${id}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || "Product not found");
          }

          set({ isLoading: false });
          return data.product;
        } catch (error: any) {
          set({ 
            error: error.message || "Failed to fetch product",
            isLoading: false,
          });
          return null;
        }
      },

      createProduct: async (formData) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await fetch(`${API_BASE_URL}/products`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: formData,
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || "Failed to create product");
          }

          const newProduct = data.product;
          set((state) => ({
            products: [newProduct, ...state.products],
            isLoading: false,
          }));

          return newProduct;
        } catch (error: any) {
          set({ 
            error: error.message || "Failed to create product",
            isLoading: false,
          });
          return null;
        }
      },

      updateProductAPI: async (id, formData) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await fetch(`${API_BASE_URL}/products/${id}`, {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: formData,
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || "Failed to update product");
          }

          const updatedProduct = data.product;
          set((state) => ({
            products: state.products.map(product =>
              product._id === id ? updatedProduct : product
            ),
            isLoading: false,
          }));

          return updatedProduct;
        } catch (error: any) {
          set({ 
            error: error.message || "Failed to update product",
            isLoading: false,
          });
          return null;
        }
      },

      deleteProductAPI: async (id) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await fetch(`${API_BASE_URL}/products/${id}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || "Failed to delete product");
          }

          set((state) => ({
            products: state.products.filter(product => product._id !== id),
            isLoading: false,
          }));

          return true;
        } catch (error: any) {
          set({ 
            error: error.message || "Failed to delete product",
            isLoading: false,
          });
          return false;
        }
      },

      fetchCategories: async () => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await fetch(`${API_BASE_URL}/products/categories`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || "Failed to fetch categories");
          }

          set({
            categories: data.categories || data,
            isLoading: false,
          });
        } catch (error: any) {
          set({ 
            error: error.message || "Failed to fetch categories",
            isLoading: false,
          });
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
      
      getDiscountedProducts: () => get().products.filter(
        product => product.priceBeforeDiscount && product.priceBeforeDiscount > product.priceAfterDiscount
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
          product.description?.toLowerCase().includes(term) ||
          product.category.toLowerCase().includes(term)
        );
      },
      
      getFilteredProducts: () => {
        const { products, selectedCategory, searchTerm, sortOption } = get();
        
        let filtered = [...products];
        
        // Filter by category
        if (selectedCategory && selectedCategory !== "الكل") {
          filtered = filtered.filter(p => p.category === selectedCategory);
        }
        
        // Filter by search term
        if (searchTerm) {
          const term = searchTerm.toLowerCase();
          filtered = filtered.filter(p =>
            p.name.toLowerCase().includes(term) ||
            p.description?.toLowerCase().includes(term) ||
            p.category.toLowerCase().includes(term)
          );
        }
        
        // Sort products
        switch (sortOption) {
          case "الأحدث":
            filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            break;
          case "الأقدم":
            filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
            break;
          case "الأعلى سعراً":
            filtered.sort((a, b) => b.priceAfterDiscount - a.priceAfterDiscount);
            break;
          case "الأقل سعراً":
            filtered.sort((a, b) => a.priceAfterDiscount - b.priceAfterDiscount);
            break;
          case "الأكثر مبيعاً":
            // You might need to add a salesCount field to your product model
            filtered.sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0));
            break;
          case "الأعلى تقييماً":
            filtered.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
            break;
          default:
            break;
        }
        
        return filtered;
      },
    }),
    {
      name: "products-store",
      partialize: (state) => 
        Object.fromEntries(
          Object.entries(state).filter(
            ([key]) => !["isLoading", "error"].includes(key)
          )
        ),
    }
  )
);