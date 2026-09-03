import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Home,
  KanbanSquare,
  CheckSquare,
  CalendarDays,
  BarChart3,
  Building2,
  LogOut,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const links = [
  { to: "/", label: "Panel", icon: LayoutDashboard, end: true },
  { to: "/contactos", label: "Contactos", icon: Users },
  { to: "/propiedades", label: "Propiedades", icon: Home },
  { to: "/pipeline", label: "Pipeline", icon: KanbanSquare },
  { to: "/tareas", label: "Tareas", icon: CheckSquare },
  { to: "/calendario", label: "Calendario", icon: CalendarDays },
  { to: "/reportes", label: "Reportes", icon: BarChart3 },
];

export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth();

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-30 md:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed md:static z-40 top-0 left-0 h-full w-64 shrink-0 bg-ink text-paper flex flex-col
        transition-transform duration-200 ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <div className="flex items-center gap-2 px-6 py-6 border-b border-white/10">
          <Building2 className="w-6 h-6 text-clay" strokeWidth={1.75} />
          <span className="font-display text-xl tracking-tight">Casa&nbsp;Base</span>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors ${
                  isActive
                    ? "bg-forest text-white"
                    : "text-paper/70 hover:bg-white/5 hover:text-paper"
                }`
              }
            >
              <Icon className="w-4 h-4" strokeWidth={1.75} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="px-6 py-4 border-t border-white/10">
          {user && (
            <p className="text-xs text-paper/60 truncate mb-2" title={user.email}>
              {user.email}
            </p>
          )}
          <button
            onClick={logout}
            className="flex items-center gap-2 text-xs text-paper/40 hover:text-paper transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" /> Cerrar sesión
          </button>
        </div>
      </aside>
    </>
  );
}
