import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { useCollection } from "../hooks/useCollection";
import { PageHeader, Card } from "../components/ui";
import { DEAL_STAGES, PROPERTY_STATUS, formatCurrency } from "../utils/constants";

const COLORS = ["#23543f", "#2f6f52", "#b5652f", "#8a8163", "#a6402f", "#5a6b63"];

export default function Reports() {
  const { data: deals, loading: loadingDeals } = useCollection("deals");
  const { data: properties, loading: loadingProps } = useCollection("properties");
  const { data: tasks, loading: loadingTasks } = useCollection("tasks");

  const loading = loadingDeals || loadingProps || loadingTasks;

  const dealsByStage = DEAL_STAGES.map((s) => ({
    name: s.label,
    total: deals.filter((d) => d.stage === s.id).length,
  }));

  const valueWon = deals.filter((d) => d.stage === "cerrado").reduce((sum, d) => sum + (Number(d.value) || 0), 0);
  const valuePipeline = deals
    .filter((d) => !["cerrado", "perdido"].includes(d.stage))
    .reduce((sum, d) => sum + (Number(d.value) || 0), 0);

  const propsByStatus = PROPERTY_STATUS.map((s) => ({
    name: s.label,
    value: properties.filter((p) => p.status === s.id).length,
  })).filter((s) => s.value > 0);

  const completedTasks = tasks.filter((t) => t.status === "completada").length;
  const pendingTasks = tasks.length - completedTasks;

  return (
    <div>
      <PageHeader title="Reportes" subtitle="Panorama general de tu operación" />

      {loading ? (
        <p className="text-sm text-ink/50">Cargando…</p>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="p-5">
              <p className="text-xs text-ink/50">Valor cerrado</p>
              <p className="font-display text-2xl mt-1">{formatCurrency(valueWon)}</p>
            </Card>
            <Card className="p-5">
              <p className="text-xs text-ink/50">Valor en pipeline</p>
              <p className="font-display text-2xl mt-1">{formatCurrency(valuePipeline)}</p>
            </Card>
            <Card className="p-5">
              <p className="text-xs text-ink/50">Propiedades activas</p>
              <p className="font-display text-2xl mt-1">{properties.length}</p>
            </Card>
            <Card className="p-5">
              <p className="text-xs text-ink/50">Tareas pendientes</p>
              <p className="font-display text-2xl mt-1">{pendingTasks} <span className="text-sm text-ink/40 font-body">/ {completedTasks} listas</span></p>
            </Card>
          </div>

          <Card className="p-5">
            <h3 className="text-sm font-medium text-ink/70 mb-4">Negociaciones por etapa</h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={dealsByStage}>
                <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-15} textAnchor="end" height={60} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="total" fill="#23543f" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-5">
            <h3 className="text-sm font-medium text-ink/70 mb-4">Propiedades por estado</h3>
            {propsByStatus.length === 0 ? (
              <p className="text-sm text-ink/40">Sin datos aún.</p>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={propsByStatus} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                    {propsByStatus.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
