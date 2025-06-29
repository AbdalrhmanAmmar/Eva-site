"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Edit,
  Trash2,
  Package,
  AlertCircle,
  X,
  Save,
  Loader2,
  Star,
  DollarSign,
  BarChart3,
  GripVertical,
} from "lucide-react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";

// Interface definition
interface PointsPackage {
  _id: string;
  points: number;
  price: number;
  isActive: boolean;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
}

interface PointsFormData {
  points: string;
  price: string;
  isActive: boolean;
}

// Mock API - replace with real API
const pointsAPI = {
  getAllPointsPackages: async () => {
    return {
      data: [
        { _id: "1", points: 1000, price: 100, isActive: true, order: 1 },
        { _id: "2", points: 5000, price: 450, isActive: true, order: 2 },
        { _id: "3", points: 10000, price: 850, isActive: true, order: 3 },
      ],
    };
  },
  createPointsPackage: async (data: { pointsAmount: number; price: number; isActive: boolean }) => {
    return { data: { ...data, _id: Math.random().toString(), isActive: true } };
  },
  updatePointsPackage: async (id: string, data: { pointsAmount: number; price: number; isActive: boolean }) => {
    return { data: { ...data, _id: id } };
  },
  updatePackagesOrder: async (packages: PointsPackage[]) => {
    return { success: true };
  },
  deletePointsPackage: async (id: string) => {
    return { success: true };
  },
};

export default function PointsClient() {
  const [packages, setPackages] = useState<PointsPackage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<PointsPackage | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [formData, setFormData] = useState<PointsFormData>({
    points: "",
    price: "",
    isActive: true,
  });
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await pointsAPI.getAllPointsPackages();
      // Sort packages by order if exists
      const sortedPackages = response.data.sort((a, b) => (a.order || 0) - (b.order || 0));
      setPackages(sortedPackages);
    } catch (error: any) {
      setError(error.message || "حدث خطأ أثناء جلب البيانات");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      points: "",
      price: "",
      isActive: true,
    });
    setFormErrors({});
    setEditingPackage(null);
  };

  const openModal = (pkg?: PointsPackage) => {
    if (pkg) {
      setEditingPackage(pkg);
      setFormData({
        points: pkg.points.toString(),
        price: pkg.price.toString(),
        isActive: pkg.isActive,
      });
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

const validateForm = (): boolean => {
  const newErrors: { [key: string]: string } = {};

  if (!formData.points.trim()) {
    newErrors.points = "عدد النقاط مطلوب";
  } else if (isNaN(Number(formData.points))) {
    newErrors.points = "عدد النقاط يجب أن يكون رقماً";
  } else if (Number(formData.points) <= 0) {
    newErrors.points = "عدد النقاط يجب أن يكون رقماً موجباً";
  }

  if (!formData.price.trim()) {
    newErrors.price = "السعر مطلوب";
  } else if (isNaN(Number(formData.price))) {
    newErrors.price = "السعر يجب أن يكون رقماً";
  } else if (Number(formData.price) <= 0) {
    newErrors.price = "السعر يجب أن يكون رقماً موجباً";
  }

  setFormErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const packageData = {
      pointsAmount: Number(formData.points),
      price: Number(formData.price),
      isActive: formData.isActive,
    };

    try {
      setIsLoading(true);
      if (editingPackage) {
        await pointsAPI.updatePointsPackage(editingPackage._id, packageData);
      } else {
        await pointsAPI.createPointsPackage(packageData);
      }
      await fetchPackages();
      closeModal();
    } catch (error: any) {
      setError(error.message || "حدث خطأ أثناء الحفظ");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setIsLoading(true);
      await pointsAPI.deletePointsPackage(id);
      await fetchPackages();
      setShowDeleteConfirm(null);
    } catch (error: any) {
      setError(error.message || "حدث خطأ أثناء الحذف");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof PointsFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  // Handle drag and drop reordering
  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(packages);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update order property based on new index
    const updatedPackages = items.map((item, index) => ({
      ...item,
      order: index + 1
    }));

    setPackages(updatedPackages);

    try {
      await pointsAPI.updatePackagesOrder(updatedPackages);
    } catch (error: any) {
      setError(error.message || "حدث خطأ أثناء حفظ الترتيب الجديد");
      // Revert to previous state if API call fails
      fetchPackages();
    }
  };

  // Calculate stats
  const totalPackages = packages.length;
  const activePackages = packages.filter(pkg => pkg.isActive).length;
  const totalPoints = packages.reduce((sum, pkg) => sum + pkg.points, 0);
  const totalValue = packages.reduce((sum, pkg) => sum + pkg.price, 0);
  const avgPointValue = totalPoints > 0 ? (totalValue / totalPoints).toFixed(2) : "0";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">إدارة حزم النقاط</h1>
          <p className="text-muted-foreground mt-1">
            قم بإدارة عروض النقاط والأسعار
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors text-sm"
        >
          <Plus className="w-4 h-4" />
          إضافة حزمة جديدة
        </motion.button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border/10 rounded-xl p-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Package className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">إجمالي الحزم</p>
              <h3 className="text-2xl font-bold">{totalPackages}</h3>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">{activePackages} حزمة نشطة</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border/10 rounded-xl p-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Star className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">إجمالي النقاط</p>
              <h3 className="text-2xl font-bold">{totalPoints.toLocaleString()}</h3>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">في جميع الحزم</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card border border-border/10 rounded-xl p-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <DollarSign className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">إجمالي القيمة</p>
              <h3 className="text-2xl font-bold">{totalValue.toLocaleString()} ريال</h3>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">قيمة جميع الحزم</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card border border-border/10 rounded-xl p-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <BarChart3 className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">متوسط قيمة النقطة</p>
              <h3 className="text-2xl font-bold">{avgPointValue} ريال</h3>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">لكل نقطة</p>
        </motion.div>
      </div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-lg p-4 flex items-start gap-3"
        >
          <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400 mt-0.5 flex-shrink-0" />
          <span className="text-red-600 dark:text-red-400 text-sm">{error}</span>
          <button
            onClick={() => setError(null)}
            className="mr-auto p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"
          >
            <X className="w-3 h-3 text-red-500 dark:text-red-400" />
          </button>
        </motion.div>
      )}

      {/* Packages Table */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
        {isLoading && packages.length === 0 ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : packages.length === 0 ? (
          <div className="text-center p-8">
            <Package className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium mb-2">لا توجد حزم نقاط</h3>
            <p className="text-gray-500 mb-4">قم بإضافة حزمة نقاط جديدة لتبدأ</p>
            <button
              onClick={() => openModal()}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors text-sm"
            >
              إضافة حزمة نقاط
            </button>
          </div>
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="packages">
              {(provided) => (
                <div className="overflow-x-auto" ref={provided.innerRef} {...provided.droppableProps}>
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          الترتيب
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          النقاط
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          السعر (ريال سعودي)
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          قيمة النقطة
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          الإجراءات
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                      {packages.map((pkg, index) => (
                        <Draggable key={pkg._id} draggableId={pkg._id} index={index}>
                          {(provided) => (
                            <tr
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
                            >
                              <td className="px-6 py-4 whitespace-nowrap" {...provided.dragHandleProps}>
                                <div className="flex items-center justify-end gap-2">
                                  <span className="text-sm text-gray-500">{index + 1}</span>
                                  <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                {pkg.points?.toLocaleString() || '0'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                {pkg.price?.toLocaleString() || '0'} ر.س
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                {pkg.price && pkg.points ? (pkg.price / pkg.points).toFixed(2) : '0.00'} ر.س
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                <div className="flex justify-end space-x-2">
                                  <button
                                    onClick={() => openModal(pkg)}
                                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 p-1"
                                    title="تعديل"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => setShowDeleteConfirm(pkg._id)}
                                    className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 p-1"
                                    title="حذف"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </tbody>
                  </table>
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6 w-full max-w-md z-50"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">
                  {editingPackage ? "تعديل حزمة النقاط" : "إضافة حزمة جديدة"}
                </h3>
                <button
                  onClick={closeModal}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">عدد النقاط *</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.points}
                    onChange={(e) => handleInputChange("points", e.target.value)}
                    placeholder="أدخل عدد النقاط"
                    className={`w-full px-3 py-2 bg-white dark:bg-gray-900 border rounded-md focus:outline-none focus:ring-1 ${
                      formErrors.points 
                        ? "border-red-500 focus:ring-red-500" 
                        : "border-gray-300 dark:border-gray-700 focus:ring-primary"
                    }`}
                  />
                  {formErrors.points && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {formErrors.points}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">السعر (ريال سعودي) *</label>
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    placeholder="أدخل السعر"
                    className={`w-full px-3 py-2 bg-white dark:bg-gray-900 border rounded-md focus:outline-none focus:ring-1 ${
                      formErrors.price 
                        ? "border-red-500 focus:ring-red-500" 
                        : "border-gray-300 dark:border-gray-700 focus:ring-primary"
                    }`}
                  />
                  {formErrors.price && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {formErrors.price}
                    </p>
                  )}
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 py-2 px-4 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 py-2 px-4 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    {editingPackage ? "حفظ التعديلات" : "إضافة الحزمة"}
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDeleteConfirm(null)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6 w-full max-w-md z-50"
            >
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/50 mb-4">
                  <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-lg font-medium mb-2">تأكيد الحذف</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">
                  هل أنت متأكد من رغبتك في حذف هذه الحزمة؟ سيتم حذفها نهائياً ولا يمكن استرجاعها.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDeleteConfirm(null)}
                    className="flex-1 py-2 px-4 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    إلغاء
                  </button>
                  <button
                    onClick={() => handleDelete(showDeleteConfirm)}
                    disabled={isLoading}
                    className="flex-1 py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                    حذف
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}