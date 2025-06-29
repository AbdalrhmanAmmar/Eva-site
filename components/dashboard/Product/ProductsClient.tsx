"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Search, Edit, Trash2, Loader } from "lucide-react";
import { useProductsStore } from "@/stores/ProductsStore";
import ProductForm from "./ProductForm";
import { Product } from "@/stores/ProductsStore";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

export default function ProductsClient() {
  const {
    products,
    isLoading,
    error,
    fetchProducts,
    deleteProductAPI,
    categories,
    fetchCategories,
    pagination,
    setPagination,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    sortOption,
    setSortOption,
  } = useProductsStore();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  // Fetch initial data
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // Handle pagination change
  const handlePageChange = (page: number) => {
    setPagination({ ...pagination, page });
    fetchProducts({ page });
  };

  // Handle product deletion
  const handleDelete = async (id: string) => {
    setIsDeleting(id);
    try {
      const success = await deleteProductAPI(id);
      if (success) {
        toast.success("تم حذف المنتج بنجاح");
      } else {
        toast.error("فشل في حذف المنتج");
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء حذف المنتج");
    } finally {
      setIsDeleting(null);
    }
  };

  // Handle form submission
  const handleSave = async (productData: Partial<Product>) => {
    try {
      if (currentProduct) {
        // Update existing product
        await updateProductAPI(currentProduct._id, productData);
        toast.success("تم تحديث المنتج بنجاح");
      } else {
        // Create new product
        await createProduct(productData);
        toast.success("تم إضافة المنتج بنجاح");
      }
      setIsFormOpen(false);
      fetchProducts();
    } catch (error) {
      toast.error("حدث خطأ أثناء حفظ المنتج");
    }
  };

  // Render loading state
  if (isLoading && !products.length) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="animate-spin h-8 w-8" />
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header and Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold">إدارة المنتجات</h1>
        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
          <Button onClick={() => {
            setCurrentProduct(null);
            setIsFormOpen(true);
          }}>
            <Plus className="ml-2 h-4 w-4" />
            إضافة منتج جديد
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="بحث..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-4 pr-10"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border rounded-md px-3 py-2 text-sm"
        >
          <option value="الكل">الكل</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="justify-start">
              {sortOption}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setSortOption("الأحدث")}>
              الأحدث
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortOption("الأقدم")}>
              الأقدم
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortOption("الأعلى سعراً")}>
              الأعلى سعراً
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortOption("الأقل سعراً")}>
              الأقل سعراً
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Products Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>الصورة</TableHead>
              <TableHead>الاسم</TableHead>
              <TableHead>الفئة</TableHead>
              <TableHead>السعر</TableHead>
              <TableHead>الكمية</TableHead>
              <TableHead>الحالة</TableHead>
              <TableHead>الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product._id}>
                <TableCell>
                  {product.images?.length > 0 ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="h-10 w-10 object-cover rounded"
                    />
                  ) : (
                    <div className="h-10 w-10 bg-gray-100 rounded flex items-center justify-center">
                      <span className="text-xs text-gray-500">لا توجد صورة</span>
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>
                  {product.priceAfterDiscount !== product.priceBeforeDiscount ? (
                    <div className="flex items-center gap-2">
                      <span className="line-through text-gray-500">
                        {product.priceBeforeDiscount} ر.س
                      </span>
                      <span className="text-primary">
                        {product.priceAfterDiscount} ر.س
                      </span>
                    </div>
                  ) : (
                    <span>{product.priceAfterDiscount} ر.س</span>
                  )}
                </TableCell>
                <TableCell>{product.quantity}</TableCell>
                <TableCell>
                  {product.quantity > 0 ? (
                    <Badge variant="default">متوفر</Badge>
                  ) : (
                    <Badge variant="destructive">غير متوفر</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setCurrentProduct(product);
                        setIsFormOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(product._id)}
                      disabled={isDeleting === product._id}
                    >
                      {isDeleting === product._id ? (
                        <Loader className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4 text-red-500" />
                      )}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(Math.max(1, pagination.page - 1))}
                isActive={pagination.page > 1}
              />
            </PaginationItem>

            {Array.from({ length: Math.min(5, pagination.pages) }).map((_, i) => {
              const pageNumber = i + 1;
              return (
                <PaginationItem key={pageNumber}>
                  <PaginationLink
                    isActive={pageNumber === pagination.page}
                    onClick={() => handlePageChange(pageNumber)}
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              );
            })}

            {pagination.pages > 5 && (
              <>
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink
                    isActive={pagination.pages === pagination.page}
                    onClick={() => handlePageChange(pagination.pages)}
                  >
                    {pagination.pages}
                  </PaginationLink>
                </PaginationItem>
              </>
            )}

            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  handlePageChange(Math.min(pagination.pages, pagination.page + 1))
                }
                isActive={pagination.page < pagination.pages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      {/* Product Form Modal */}
      <ProductForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        product={currentProduct}
        onSave={handleSave}
        isLoading={false}
      />
    </div>
  );
}