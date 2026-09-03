export function formatPrice(price: number): string {
  const formatted = price.toLocaleString("es-MX", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `$ ${formatted}`;
}
