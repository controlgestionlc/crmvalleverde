export const DEAL_STAGES = [
  { id: "nuevo", label: "Nuevo" },
  { id: "contactado", label: "Contactado" },
  { id: "visita", label: "Visita agendada" },
  { id: "negociacion", label: "Negociación" },
  { id: "cerrado", label: "Cerrado ganado" },
  { id: "perdido", label: "Perdido" },
];

export const PROPERTY_STATUS = [
  { id: "disponible", label: "Disponible", tone: "forest" },
  { id: "reservada", label: "Reservada", tone: "clay" },
  { id: "vendida", label: "Vendida", tone: "neutral" },
  { id: "rentada", label: "Rentada", tone: "neutral" },
];

export const PROPERTY_TYPES = [
  { id: "venta", label: "Venta" },
  { id: "renta", label: "Renta" },
];

export const CONTACT_TYPES = [
  { id: "lead", label: "Prospecto" },
  { id: "cliente", label: "Cliente" },
  { id: "propietario", label: "Propietario" },
];

export const TASK_STATUS = [
  { id: "pendiente", label: "Pendiente" },
  { id: "completada", label: "Completada" },
];

export function formatCurrency(value) {
  if (value === undefined || value === null || value === "") return "—";
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(value) {
  if (!value) return "—";
  const date = value.toDate ? value.toDate() : new Date(value);
  return new Intl.DateTimeFormat("es-MX", { day: "2-digit", month: "short", year: "numeric" }).format(date);
}
