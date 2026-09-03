import { Link } from "react-router-dom";
import { Users, Home, KanbanSquare, CheckSquare, ArrowUpRight } from "lucide-react";
import { useCollection } from "../hooks/useCollection";
import { Card, Badge } from "../components/ui";
import { formatCurrency, formatDate, DEAL_STAGES } from "../utils/constants";

export default function Dashboard() {
  const { data: contacts } = useCollection("contacts");
  const { data: properties } = useCollection("properties");
  const { data: deals } = useCollection("deals");
  const { data: tasks } = useCollection("tasks", "dueDate");

  const activeDeals = deals.filter((d) => !["cerrado", "perdido"].includes(d.stage));
  const pipelineValue = activeDeals.reduce((s, d) => s + (Number(d.value) || 0), 0);
  const upcomingTasks = tasks
    .filter((t) => t.status !== "completada")
    .sort((a, b) => (a.dueDate || "").localeCompare(b.dueDate || ""))
    .slice(0, 5);

  const stats = [
    { label: "Contactos", value: contacts.length, icon: Users, to: "/contactos" },
    { label: "Propiedades activas", value: properties.filter((p) => p.status === "disponible").length, icon: Home, to: "/propiedades" },
    { label: "Negociaciones abiertas", value: activeDeals.length, icon: KanbanSquare, to: "/pipeline" },
    { label: "Tareas pendientes", value: tasks.filter((t) => t.status !== "completada").length, icon: CheckSquare, to: "/tareas" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl text-ink">Bienvenido de vuelta</h1>
        <p className="text-ink/60 mt-1 text-sm">Esto es lo que está pasando en tu cartera hoy.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map(({ label, value, icon: Icon, to }) => (
          <Link key={label} to={to}>
            <Card className="p-5 hover:border-forest transition-colors h-full">
              <div className="flex items-center justify-between">
                <Icon className="w-5 h-5 text-forest" strokeWidth={1.75} />
                <ArrowUpRight className="w-4 h-4 text-ink/20" />
              </div>
              <p className="font-display text-3xl mt-4">{value}</p>
              <p className="text-xs text-ink/50 mt-1">{label}</p>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg">Valor en pipeline</h2>
            <Link to="/pipeline" className="text-xs text-forest hover:underline">Ver todo</Link>
          </div>
          <p className="font-display text-3xl mb-4">{formatCurrency(pipelineValue)}</p>
          <div className="space-y-2">
            {DEAL_STAGES.filter((s) => !["cerrado", "perdido"].includes(s.id)).map((stage) => {
              const count = deals.filter((d) => d.stage === stage.id).length;
              return (
                <div key={stage.id} className="flex items-center justify-between text-sm">
                  <span className="text-ink/60">{stage.label}</span>
                  <span className="font-medium">{count}</span>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg">Próximas tareas</h2>
            <Link to="/tareas" className="text-xs text-forest hover:underline">Ver todo</Link>
          </div>
          {upcomingTasks.length === 0 ? (
            <p className="text-sm text-ink/40">No tienes tareas pendientes. 🎉</p>
          ) : (
            <div className="space-y-3">
              {upcomingTasks.map((t) => (
                <div key={t.id} className="flex items-center justify-between text-sm">
                  <span className="truncate">{t.title}</span>
                  <Badge>{formatDate(t.dueDate)}</Badge>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
