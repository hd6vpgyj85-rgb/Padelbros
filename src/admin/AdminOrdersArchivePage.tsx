import { Link } from "react-router-dom";
import { useOrders, type Order } from "../context/OrdersContext";
import { formatPrice } from "../utils/format";
import "./AdminOrdersArchivePage.css";

function formatDayLabel(iso: string): string {
  return new Date(iso).toLocaleDateString("es-MX", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

interface DateGroup {
  dateKey: string;
  label: string;
  orders: Order[];
}

function groupByDate(orders: Order[]): DateGroup[] {
  const groups = new Map<string, Order[]>();
  orders.forEach((order) => {
    const dateKey = order.createdAt.slice(0, 10);
    const group = groups.get(dateKey);
    if (group) group.push(order);
    else groups.set(dateKey, [order]);
  });

  return Array.from(groups.entries()).map(([dateKey, group]) => ({
    dateKey,
    label: formatDayLabel(group[0].createdAt),
    orders: group,
  }));
}

function AdminOrdersArchivePage() {
  const { archivedOrders, restoreOrder } = useOrders();
  const groups = groupByDate(archivedOrders);

  const handleRestore = (id: string) => {
    restoreOrder(id).catch(() => {
      window.alert("No se pudo restaurar el pedido. Intenta de nuevo.");
    });
  };

  return (
    <div className="admin-orders-archive container">
      <div className="admin-orders-archive__header">
        <div>
          <span className="eyebrow">Padelbros</span>
          <h1 className="admin-orders-archive__title">Baúl de pedidos</h1>
        </div>
        <Link to="/admin/pedidos" className="admin-orders-archive__back">
          Volver a Pedidos
        </Link>
      </div>

      <p className="admin-orders-archive__hint">
        Registro de todos los pedidos eliminados, organizados por fecha del pedido. Útil para consultar datos
        ante una solicitud de reembolso o cambio por artículo defectuoso.
      </p>

      {archivedOrders.length === 0 ? (
        <p className="admin-orders-archive__empty">El baúl está vacío por el momento.</p>
      ) : (
        groups.map((group) => (
          <section className="admin-orders-archive__group" key={group.dateKey}>
            <h2 className="admin-orders-archive__group-title">{group.label}</h2>

            <ul className="admin-orders-archive__list">
              {group.orders.map((order) => (
                <li key={order.id} className="admin-order-archive-card">
                  <div className="admin-order-archive-card__header">
                    <span className={`admin-order-archive-card__status admin-order-archive-card__status--${order.status.replace(" ", "-")}`}>
                      {order.status}
                    </span>
                    <button
                      type="button"
                      className="admin-order-archive-card__restore"
                      onClick={() => handleRestore(order.id)}
                    >
                      Restaurar
                    </button>
                  </div>

                  <p className="admin-order-archive-card__customer">
                    {order.customer.nombre} {order.customer.apellido}
                  </p>
                  <p className="admin-order-archive-card__contact">
                    {order.customer.telefono} · {order.customer.correo}
                  </p>

                  <ul className="admin-order-archive-card__items">
                    {order.items.map((item) => (
                      <li key={item.productId}>
                        {item.name} x{item.quantity}
                      </li>
                    ))}
                  </ul>

                  <p className="admin-order-archive-card__total">Total: {formatPrice(order.total)}</p>

                  <p className="admin-order-archive-card__meta">
                    Pedido el {formatDateTime(order.createdAt)}
                    {order.archivedAt && <> · Eliminado el {formatDateTime(order.archivedAt)}</>}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        ))
      )}
    </div>
  );
}

export default AdminOrdersArchivePage;
