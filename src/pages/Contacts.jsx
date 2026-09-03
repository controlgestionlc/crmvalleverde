import { useState } from "react";
import { Plus, Pencil, Trash2, Mail, Phone, Search } from "lucide-react";
import { useCollection } from "../hooks/useCollection";
import { PageHeader, Button, Card, Badge, Modal, Field, inputClass, EmptyState } from "../components/ui";
import { CONTACT_TYPES } from "../utils/constants";

const emptyForm = { name: "", email: "", phone: "", type: "lead", source: "", notes: "" };

export default function Contacts() {
  const { data: contacts, loading, add, update, remove } = useCollection("contacts");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState("");

  const openNew = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (contact) => {
    setEditing(contact);
    setForm({ ...emptyForm, ...contact });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editing) {
      await update(editing.id, form);
    } else {
      await add(form);
    }
    setModalOpen(false);
  };

  const filtered = contacts.filter((c) =>
    `${c.name} ${c.email} ${c.phone}`.toLowerCase().includes(search.toLowerCase())
  );

  const toneFor = (type) => (type === "cliente" ? "forest" : type === "propietario" ? "clay" : "neutral");
  const labelFor = (type) => CONTACT_TYPES.find((t) => t.id === type)?.label || type;

  return (
    <div>
      <PageHeader
        title="Contactos"
        subtitle="Prospectos, clientes y propietarios"
        action={
          <Button onClick={openNew}>
            <Plus className="w-4 h-4" /> Nuevo contacto
          </Button>
        }
      />

      <div className="relative mb-5 max-w-sm">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" />
        <input
          className={`${inputClass} pl-9`}
          placeholder="Buscar por nombre, correo o teléfono"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <p className="text-sm text-ink/50">Cargando…</p>
      ) : filtered.length === 0 ? (
        <EmptyState title="Aún no hay contactos" hint="Agrega tu primer prospecto o cliente para comenzar." />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => (
            <Card key={c.id} className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-medium truncate">{c.name}</p>
                  <Badge tone={toneFor(c.type)}>{labelFor(c.type)}</Badge>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button onClick={() => openEdit(c)} className="p-1.5 rounded hover:bg-paper-dim" aria-label="Editar">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => remove(c.id)}
                    className="p-1.5 rounded hover:bg-danger/10 text-danger"
                    aria-label="Eliminar"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <div className="mt-3 space-y-1.5 text-sm text-ink/70">
                {c.email && (
                  <p className="flex items-center gap-2 truncate">
                    <Mail className="w-3.5 h-3.5 shrink-0" /> {c.email}
                  </p>
                )}
                {c.phone && (
                  <p className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 shrink-0" /> {c.phone}
                  </p>
                )}
              </div>
              {c.notes && <p className="mt-3 text-xs text-ink/50 line-clamp-2">{c.notes}</p>}
            </Card>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Editar contacto" : "Nuevo contacto"}>
        <form onSubmit={handleSubmit}>
          <Field label="Nombre completo">
            <input required className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </Field>
          <Field label="Correo">
            <input type="email" className={inputClass} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </Field>
          <Field label="Teléfono">
            <input className={inputClass} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </Field>
          <Field label="Tipo de contacto">
            <select className={inputClass} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              {CONTACT_TYPES.map((t) => (
                <option key={t.id} value={t.id}>{t.label}</option>
              ))}
            </select>
          </Field>
          <Field label="Fuente (referido, portal, redes...)">
            <input className={inputClass} value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} />
          </Field>
          <Field label="Notas">
            <textarea rows={3} className={inputClass} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </Field>

          <div className="flex justify-end gap-2 mt-2">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button type="submit">{editing ? "Guardar cambios" : "Crear contacto"}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
