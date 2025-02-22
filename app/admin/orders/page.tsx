// import AdminOrders from "@/components/admin/AdminOrders";

import AdminOrders from "@/components/admin/AdminOrders";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function AdminPanel() {
  return (
    <ProtectedRoute>
    <div>
      <h1 className="text-3xl font-bold text-center mt-6">Admin Dashboard</h1>
      <AdminOrders />
    </div>
  </ProtectedRoute>
  );
}
