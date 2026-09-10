import { Link } from "react-router-dom";
import { useOrders, type OrderStatus } from "../context/OrdersContext";
import { formatPrice } from "../utils/format";
import { TrashIcon } from "../components/home/icons";
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
  const { orders, archivedOrders, updateOrderStatus, archiveOrder } = useOrders();

  const handleDelete = (id: string, label: string) => {
    if (!window.confirm(`¿Eliminar el pedido de ${label}? Se moverá al baúl de pedidos eliminados.`)) return;
    archiveOrder(id).catch(() => {
      window.alert("No se pudo eliminar el pedido. Intenta de nuevo.");
    });
  };

  return (
    <div className="admin-orders container">
      <div className="admin-orders__header">
        <div>
          <span className="eyebrow">Padelbros</span>
          <h1 className="admin-orders__title">Pedidos</h1>
        </div>
        <Link to="/admin/pedidos/baul" className="admin-orders__vault-link">
          Baúl ({archivedOrders.length})
        </Link>
      </div>

      {orders.length === 0 ? (
        <p className="admin-orders__empty">Todavía no hay pedidos.</p>
      ) : (
        <ul className="admin-orders__list">
          {orders.map((order) => (
            <li key={order.id} className="admin-order-card">
              <div className="admin-order-card__header">
                <span className="admin-order-card__date">{formatDate(order.createdAt)}</span>
                <div className="admin-order-card__header-actions">
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
                  <button
                    type="button"
                    className="admin-order-card__delete"
                    onClick={() => handleDelete(order.id, `${order.customer.nombre} ${order.customer.apellido}`)}
                    aria-label="Eliminar pedido"
                  >
                    <TrashIcon />
                  </button>
                </div>
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
