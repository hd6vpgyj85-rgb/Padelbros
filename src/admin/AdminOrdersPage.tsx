import { useOrders, type OrderStatus } from "../context/OrdersContext";
import { formatPrice } from "../utils/format";
import "./AdminOrdersPage.css";

const statusOptions: OrderStatus[] = ["pendiente", "en proceso", "completado", "cancelado"];

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function AdminOrdersPage() {
  const { orders, updateOrderStatus } = useOrders();

  return (
    <div className="admin-orders container">
      <span className="eyebrow">Padelbros</span>
      <h1 className="admin-orders__title">Pedidos</h1>

      {orders.length === 0 ? (
        <p className="admin-orders__empty">Todavía no hay pedidos.</p>
      ) : (
        <ul className="admin-orders__list">
          {orders.map((order) => (
            <li key={order.id} className="admin-order-card">
              <div className="admin-order-card__header">
                <span className="admin-order-card__date">{formatDate(order.createdAt)}</span>
                <select
                  className={`admin-order-card__status admin-order-card__status--${order.status.replace(" ", "-")}`}
                  value={order.status}
                  onChange={(event) => updateOrderStatus(order.id, event.target.value as OrderStatus)}
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <p className="admin-order-card__customer">
                {order.customer.nombre} {order.customer.apellido}
              </p>
              <p className="admin-order-card__contact">
                {order.customer.telefono} · {order.customer.correo}
              </p>

              <ul className="admin-order-card__items">
                {order.items.map((item) => (
                  <li key={item.productId}>
                    {item.name} x{item.quantity}
                  </li>
                ))}
              </ul>

              <p className="admin-order-card__total">Total: {formatPrice(order.total)}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AdminOrdersPage;
