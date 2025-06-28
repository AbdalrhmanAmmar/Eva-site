import { create } from "zustand";

export interface PointsPackage {
  _id: string;
  points: number;
  price: number;
  currency: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface PointsState {
  packages: PointsPackage[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setPackages: (packages: PointsPackage[]) => void;
  addPackage: (pkg: PointsPackage) => void;
  updatePackage: (id: string, updates: Partial<PointsPackage>) => void;
  deletePackage: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // API Actions
  fetchPackages: () => Promise<void>;
  createPackage: (packageData: Partial<PointsPackage>) => Promise<PointsPackage | null>;
  updatePackageAPI: (id: string, packageData: Partial<PointsPackage>) => Promise<PointsPackage | null>;
  deletePackageAPI: (id: string) => Promise<boolean>;
  
  // Computed values
  getTotalPackages: () => number;
  getActivePackages: () => PointsPackage[];
  getInactivePackages: () => PointsPackage[];
}

const API_BASE_URL = "http://localhost:4000/api";

export const usePointsStore = create<PointsState>((set, get) => ({
  packages: [],
  isLoading: false,
  error: null,

  // Actions
  setPackages: (packages) => set({ packages }),
  
  addPackage: (pkg) => set((state) => ({
    packages: [pkg, ...state.packages]
  })),
  
  updatePackage: (id, updates) => set((state) => ({
    packages: state.packages.map(pkg =>
      pkg._id === id ? { ...pkg, ...updates } : pkg
    )
  })),
  
  deletePackage: (id) => set((state) => ({
    packages: state.packages.filter(pkg => pkg._id !== id)
  })),
  
  setLoading: (loading) => set({ isLoading: loading }),
  
  setError: (error) => set({ error }),

  // API Actions
  fetchPackages: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await fetch(`${API_BASE_URL}/points`, {
        method: "GET",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "حدث خطأ في جلب حزم النقاط");
      }

      set({ packages: data.packages || data, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.message || "حدث خطأ في الاتصال بالخادم",
        isLoading: false 
      });
    }
  },

  createPackage: async (packageData) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await fetch(`${API_BASE_URL}/points`, {
        method: "POST",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(packageData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "حدث خطأ في إضافة حزمة النقاط");
      }

      const newPackage = data.package || data;
      set((state) => ({
        packages: [newPackage, ...state.packages],
        isLoading: false
      }));

      return newPackage;
    } catch (error: any) {
      set({ 
        error: error.message || "حدث خطأ في الاتصال بالخادم",
        isLoading: false 
      });
      return null;
    }
  },

  updatePackageAPI: async (id, packageData) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await fetch(`${API_BASE_URL}/points/${id}`, {
        method: "PUT",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(packageData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "حدث خطأ في تحديث حزمة النقاط");
      }

      const updatedPackage = data.package || data;
      set((state) => ({
        packages: state.packages.map(pkg =>
          pkg._id === id ? updatedPackage : pkg
        ),
        isLoading: false
      }));

      return updatedPackage;
    } catch (error: any) {
      set({ 
        error: error.message || "حدث خطأ في الاتصال بالخادم",
        isLoading: false 
      });
      return null;
    }
  },

  deletePackageAPI: async (id) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await fetch(`${API_BASE_URL}/points/${id}`, {
        method: "DELETE",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "حدث خطأ في حذف حزمة النقاط");
      }

      set((state) => ({
        packages: state.packages.filter(pkg => pkg._id !== id),
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
  getTotalPackages: () => get().packages.length,
  getActivePackages: () => get().packages.filter(pkg => pkg.isActive),
  getInactivePackages: () => get().packages.filter(pkg => !pkg.isActive),
}));