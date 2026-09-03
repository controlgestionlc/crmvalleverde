import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  eachDayOfInterval, format, isSameMonth, isSameDay, addMonths, subMonths,
} from "date-fns";
import { es } from "date-fns/locale";
import { useCollection } from "../hooks/useCollection";
import { PageHeader, Card, Badge } from "../components/ui";

export default function CalendarView() {
  const { data: tasks, loading } = useCollection("tasks", "dueDate");
  const [cursor, setCursor] = useState(new Date());

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(cursor), { weekStartsOn: 1 });
    const end = endOfWeek(endOfMonth(cursor), { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  }, [cursor]);

  const tasksFor = (day) =>
    tasks.filter((t) => t.dueDate && isSameDay(new Date(t.dueDate + "T00:00:00"), day));

  return (
    <div>
      <PageHeader
        title="Calendario"
        subtitle="Vista mensual de tareas y seguimientos"
        action={
          <div className="flex items-center gap-2">
            <button onClick={() => setCursor(subMonths(cursor, 1))} className="p-2 rounded border border-line hover:bg-paper-dim" aria-label="Mes anterior">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-display text-lg w-40 text-center capitalize">{format(cursor, "MMMM yyyy", { locale: es })}</span>
            <button onClick={() => setCursor(addMonths(cursor, 1))} className="p-2 rounded border border-line hover:bg-paper-dim" aria-label="Mes siguiente">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        }
      />

      {loading ? (
        <p className="text-sm text-ink/50">Cargando…</p>
      ) : (
        <div className="grid grid-cols-7 gap-1.5 text-xs">
          {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((d) => (
            <div key={d} className="text-center text-ink/40 font-medium pb-1">{d}</div>
          ))}
          {days.map((day) => {
            const dayTasks = tasksFor(day);
            return (
              <Card
                key={day.toISOString()}
                className={`min-h-[90px] p-1.5 ${!isSameMonth(day, cursor) ? "opacity-35" : ""} ${
                  isSameDay(day, new Date()) ? "border-forest" : ""
                }`}
              >
                <p className="text-[11px] text-ink/50 mb-1">{format(day, "d")}</p>
                <div className="space-y-1">
                  {dayTasks.slice(0, 3).map((t) => (
                    <div key={t.id} className="truncate">
                      <Badge tone={t.status === "completada" ? "neutral" : "forest"}>{t.title}</Badge>
                    </div>
                  ))}
                  {dayTasks.length > 3 && <p className="text-[10px] text-ink/40">+{dayTasks.length - 3} más</p>}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
