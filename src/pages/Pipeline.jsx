import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useCollection } from "../hooks/useCollection";
import { PageHeader, Button, Card, Modal, Field, inputClass, EmptyState } from "../components/ui";
import { DEAL_STAGES, formatCurrency } from "../utils/constants";

const emptyForm = { contactName: "", propertyTitle: "", value: "", stage: "nuevo" };

export default function Pipeline() {
  const { data: deals, loading, add, update, remove } = useCollection("deals");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await add({ ...form, value: Number(form.value) || 0 });
    setModalOpen(false);
    setForm(emptyForm);
  };

  const moveStage = (deal, direction) => {
    const idx = DEAL_STAGES.findIndex((s) => s.id === deal.stage);
    const nextIdx = idx + direction;
    if (nextIdx < 0 || nextIdx >= DEAL_STAGES.length) return;
    update(deal.id, { stage: DEAL_STAGES[nextIdx].id });
  };

  return (
    <div>
      <PageHeader
        title="Pipeline de ventas"
        subtitle="Da seguimiento a tus negociaciones por etapa"
        action={<Button onClick={() => setModalOpen(true)}><Plus className="w-4 h-4" /> Nueva negociación</Button>}
      />

      {loading ? (
        <p className="text-sm text-ink/50">Cargando…</p>
      ) : deals.length === 0 ? (
        <EmptyState title="Sin negociaciones activas" hint="Crea una para empezar a mover prospectos por el embudo." />
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 md:mx-0 md:px-0">
          {DEAL_STAGES.map((stage) => {
            const stageDeals = deals.filter((d) => d.stage === stage.id);
            return (
              <div key={stage.id} className="w-64 shrink-0">
                <div className="flex items-center justify-between mb-2 px-1">
                  <h3 className="text-sm font-medium text-ink/70">{stage.label}</h3>
                  <span className="text-xs text-ink/40">{stageDeals.length}</span>
                </div>
                <div className="space-y-2 min-h-[80px]">
                  {stageDeals.map((deal) => (
                    <Card key={deal.id} className="p-3">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-medium text-sm truncate">{deal.contactName}</p>
                        <button onClick={() => remove(deal.id)} className="text-ink/30 hover:text-danger shrink-0" aria-label="Eliminar">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      {deal.propertyTitle && <p className="text-xs text-ink/50 truncate mt-0.5">{deal.propertyTitle}</p>}
                      <p className="text-sm font-display mt-2">{formatCurrency(deal.value)}</p>
                      <div className="flex justify-between mt-2 text-xs">
                        <button
                          disabled={stage.id === DEAL_STAGES[0].id}
                          onClick={() => moveStage(deal, -1)}
                          className="text-ink/40 hover:text-ink disabled:opacity-20"
                        >
                          ← Atrás
                        </button>
                        <button
                          disabled={stage.id === DEAL_STAGES[DEAL_STAGES.length - 1].id}
                          onClick={() => moveStage(deal, 1)}
                          className="text-forest hover:text-forest-light disabled:opacity-20"
                        >
                          Avanzar →
                        </button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Nueva negociación">
        <form onSubmit={handleSubmit}>
          <Field label="Nombre del contacto">
            <input required className={inputClass} value={form.contactName} onChange={(e) => setForm({ ...form, contactName: e.target.value })} />
          </Field>
          <Field label="Propiedad de interés">
            <input className={inputClass} value={form.propertyTitle} onChange={(e) => setForm({ ...form, propertyTitle: e.target.value })} />
          </Field>
          <Field label="Valor estimado (MXN)">
            <input type="number" min="0" className={inputClass} value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} />
          </Field>
          <Field label="Etapa inicial">
            <select className={inputClass} value={form.stage} onChange={(e) => setForm({ ...form, stage: e.target.value })}>
              {DEAL_STAGES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
            </select>
          </Field>
          <div className="flex justify-end gap-2 mt-2">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button type="submit">Crear</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
