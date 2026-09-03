export const storeInfo = {
  address: "Gómez Morín 100, Plaza Borrego, Cd. Juárez",
  hours: [
    { days: "Lun - Vie", time: "12:00 pm - 8:00 pm" },
    { days: "Sáb", time: "12:00 pm - 4:00 pm" },
  ],
  whatsappNumber: "526562492803",
};

export function getWhatsAppUrl(message: string) {
  return `https://wa.me/${storeInfo.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
