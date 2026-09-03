import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu } from "lucide-react";
import Sidebar from "./Sidebar";

export default function Layout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-paper">
      <Sidebar open={open} onClose={() => setOpen(false)} />

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="md:hidden flex items-center gap-3 px-4 py-3 border-b border-line bg-paper sticky top-0 z-20">
          <button
            onClick={() => setOpen(true)}
            aria-label="Abrir menú"
            className="p-2 -ml-2 rounded-md hover:bg-paper-dim"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-display text-lg">Casa Base</span>
        </header>

        <main className="flex-1 min-w-0 px-4 py-6 md:px-10 md:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
