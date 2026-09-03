import { Route, Routes } from "react-router-dom";
import { AdminAuthProvider, useAdminAuth } from "./AdminAuthContext";
import AdminLoginPage from "./AdminLoginPage";
import AdminLayout from "./AdminLayout";
import AdminDashboardPage from "./AdminDashboardPage";
import AdminProductsPage from "./AdminProductsPage";
import AdminProductFormPage from "./AdminProductFormPage";
import AdminCategoriesPage from "./AdminCategoriesPage";
import AdminOrdersPage from "./AdminOrdersPage";
import AdminReviewsPage from "./AdminReviewsPage";
import AdminCouponsPage from "./AdminCouponsPage";
import AdminCouponFormPage from "./AdminCouponFormPage";

function AdminRoutes() {
  const { isAuthenticated, isLoading } = useAdminAuth();

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return <AdminLoginPage />;
  }

  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<AdminDashboardPage />} />
        <Route path="productos" element={<AdminProductsPage />} />
        <Route path="productos/nuevo" element={<AdminProductFormPage />} />
        <Route path="productos/:id" element={<AdminProductFormPage />} />
        <Route path="categorias" element={<AdminCategoriesPage />} />
        <Route path="pedidos" element={<AdminOrdersPage />} />
        <Route path="resenas" element={<AdminReviewsPage />} />
        <Route path="cupones" element={<AdminCouponsPage />} />
        <Route path="cupones/nuevo" element={<AdminCouponFormPage />} />
      </Route>
    </Routes>
  );
}

function AdminApp() {
  return (
    <AdminAuthProvider>
      <AdminRoutes />
    </AdminAuthProvider>
  );
}

export default AdminApp;
