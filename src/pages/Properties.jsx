import { useState } from "react";
import { Plus, Pencil, Trash2, MapPin, BedDouble, Bath, Ruler } from "lucide-react";
import { useCollection } from "../hooks/useCollection";
import { PageHeader, Button, Card, Badge, Modal, Field, inputClass, EmptyState } from "../components/ui";
import { PROPERTY_STATUS, PROPERTY_TYPES, formatCurrency } from "../utils/constants";

const emptyForm = {
  title: "", address: "", type: "venta", status: "disponible",
  price: "", bedrooms: "", bathrooms: "", area: "", notes: "",
};

export default function Properties() {
  const { data: properties, loading, add, update, remove } = useCollection("properties");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [filter, setFilter] = useState("todas");

  const openNew = () => { setEditing(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (p) => { setEditing(p); setForm({ ...emptyForm, ...p }); setModalOpen(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form, price: Number(form.price) || 0 };
    if (editing) await update(editing.id, payload);
    else await add(payload);
    setModalOpen(false);
  };

  const filtered = filter === "todas" ? properties : properties.filter((p) => p.status === filter);
  const statusMeta = (id) => PROPERTY_STATUS.find((s) => s.id === id) || PROPERTY_STATUS[0];

  return (
    <div>
      <PageHeader
        title="Propiedades"
        subtitle="Inventario de inmuebles en venta y renta"
        action={<Button onClick={openNew}><Plus className="w-4 h-4" /> Nueva propiedad</Button>}
      />

      <div className="flex gap-2 mb-5 flex-wrap">
        <button
          onClick={() => setFilter("todas")}
          className={`px-3 py-1.5 rounded-md text-xs font-medium border ${filter === "todas" ? "bg-ink text-white border-ink" : "border-line text-ink/60"}`}
        >
          Todas
        </button>
        {PROPERTY_STATUS.map((s) => (
          <button
            key={s.id}
            onClick={() => setFilter(s.id)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium border ${filter === s.id ? "bg-ink text-white border-ink" : "border-line text-ink/60"}`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-sm text-ink/50">Cargando…</p>
      ) : filtered.length === 0 ? (
        <EmptyState title="No hay propiedades" hint="Agrega un inmueble para comenzar a darle seguimiento." />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <Card key={p.id} className="p-4 flex flex-col">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-medium truncate">{p.title}</p>
                  <p className="text-xs text-ink/50 flex items-center gap-1 mt-0.5 truncate">
                    <MapPin className="w-3 h-3 shrink-0" /> {p.address}
                  </p>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button onClick={() => openEdit(p)} className="p-1.5 rounded hover:bg-paper-dim" aria-label="Editar">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => remove(p.id)} className="p-1.5 rounded hover:bg-danger/10 text-danger" aria-label="Eliminar">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <p className="font-display text-xl mt-3">{formatCurrency(p.price)}{p.type === "renta" && <span className="text-xs text-ink/40"> /mes</span>}</p>

              <div className="flex gap-3 text-xs text-ink/60 mt-2">
                {p.bedrooms && <span className="flex items-center gap-1"><BedDouble className="w-3.5 h-3.5" />{p.bedrooms}</span>}
                {p.bathrooms && <span className="flex items-center gap-1"><Bath className="w-3.5 h-3.5" />{p.bathrooms}</span>}
                {p.area && <span className="flex items-center gap-1"><Ruler className="w-3.5 h-3.5" />{p.area} m²</span>}
              </div>

              <div className="mt-3 flex gap-2">
                <Badge tone={statusMeta(p.status).tone}>{statusMeta(p.status).label}</Badge>
                <Badge>{PROPERTY_TYPES.find((t) => t.id === p.type)?.label}</Badge>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Editar propiedad" : "Nueva propiedad"}>
        <form onSubmit={handleSubmit}>
          <Field label="Título">
            <input required className={inputClass} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </Field>
          <Field label="Dirección">
            <input required className={inputClass} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Tipo">
              <select className={inputClass} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                {PROPERTY_TYPES.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
              </select>
            </Field>
            <Field label="Estado">
              <select className={inputClass} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                {PROPERTY_STATUS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
            </Field>
          </div>
          <Field label="Precio (MXN)">
            <input type="number" min="0" className={inputClass} value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
          </Field>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Recámaras">
              <input type="number" min="0" className={inputClass} value={form.bedrooms} onChange={(e) => setForm({ ...form, bedrooms: e.target.value })} />
            </Field>
            <Field label="Baños">
              <input type="number" min="0" className={inputClass} value={form.bathrooms} onChange={(e) => setForm({ ...form, bathrooms: e.target.value })} />
            </Field>
            <Field label="Área m²">
              <input type="number" min="0" className={inputClass} value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} />
            </Field>
          </div>
          <Field label="Notas">
            <textarea rows={3} className={inputClass} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </Field>
          <div className="flex justify-end gap-2 mt-2">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button type="submit">{editing ? "Guardar cambios" : "Crear propiedad"}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
