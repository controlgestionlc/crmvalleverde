import { useState } from "react";
import { Plus, Trash2, Check } from "lucide-react";
import { useCollection } from "../hooks/useCollection";
import { PageHeader, Button, Card, Modal, Field, inputClass, EmptyState } from "../components/ui";
import { formatDate } from "../utils/constants";

const emptyForm = { title: "", dueDate: "", relatedTo: "", status: "pendiente" };

export default function Tasks() {
  const { data: tasks, loading, add, update, remove } = useCollection("tasks", "dueDate");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [showDone, setShowDone] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await add(form);
    setModalOpen(false);
    setForm(emptyForm);
  };

  const toggle = (task) => update(task.id, { status: task.status === "completada" ? "pendiente" : "completada" });

  const visible = tasks
    .filter((t) => showDone || t.status !== "completada")
    .sort((a, b) => (a.dueDate || "").localeCompare(b.dueDate || ""));

  const isOverdue = (t) => t.status !== "completada" && t.dueDate && t.dueDate < new Date().toISOString().slice(0, 10);

  return (
    <div>
      <PageHeader
        title="Tareas"
        subtitle="Seguimientos, llamadas y pendientes"
        action={<Button onClick={() => setModalOpen(true)}><Plus className="w-4 h-4" /> Nueva tarea</Button>}
      />

      <label className="flex items-center gap-2 text-sm text-ink/60 mb-5">
        <input type="checkbox" checked={showDone} onChange={(e) => setShowDone(e.target.checked)} />
        Mostrar completadas
      </label>

      {loading ? (
        <p className="text-sm text-ink/50">Cargando…</p>
      ) : visible.length === 0 ? (
        <EmptyState title="No hay tareas" hint="Agrega un pendiente para no perder seguimiento de tus clientes." />
      ) : (
        <div className="space-y-2 max-w-2xl">
          {visible.map((t) => (
            <Card key={t.id} className="p-3 flex items-center gap-3">
              <button
                onClick={() => toggle(t)}
                aria-label="Marcar completada"
                className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 ${
                  t.status === "completada" ? "bg-forest border-forest text-white" : "border-line"
                }`}
              >
                {t.status === "completada" && <Check className="w-3.5 h-3.5" />}
              </button>
              <div className="flex-1 min-w-0">
                <p className={`text-sm truncate ${t.status === "completada" ? "line-through text-ink/40" : ""}`}>{t.title}</p>
                {t.relatedTo && <p className="text-xs text-ink/40 truncate">{t.relatedTo}</p>}
              </div>
              <span className={`text-xs shrink-0 ${isOverdue(t) ? "text-danger font-medium" : "text-ink/50"}`}>
                {formatDate(t.dueDate)}
              </span>
              <button onClick={() => remove(t.id)} className="text-ink/30 hover:text-danger shrink-0" aria-label="Eliminar">
                <Trash2 className="w-4 h-4" />
              </button>
            </Card>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Nueva tarea">
        <form onSubmit={handleSubmit}>
          <Field label="Descripción">
            <input required className={inputClass} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </Field>
          <Field label="Fecha límite">
            <input type="date" required className={inputClass} value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
          </Field>
          <Field label="Relacionado con (contacto o propiedad)">
            <input className={inputClass} value={form.relatedTo} onChange={(e) => setForm({ ...form, relatedTo: e.target.value })} />
          </Field>
          <div className="flex justify-end gap-2 mt-2">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button type="submit">Crear tarea</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
