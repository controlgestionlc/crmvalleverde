import { X } from "lucide-react";

export function PageHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-start justify-between gap-4 mb-8 flex-wrap">
      <div>
        <h1 className="font-display text-3xl text-ink">{title}</h1>
        {subtitle && <p className="text-ink/60 mt-1 text-sm">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function Button({ children, variant = "primary", className = "", ...props }) {
  const base = "inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-forest text-white hover:bg-forest-light",
    ghost: "bg-transparent text-ink hover:bg-paper-dim border border-line",
    danger: "bg-transparent text-danger hover:bg-danger/10 border border-danger/30",
  };
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}

export function Card({ children, className = "" }) {
  return (
    <div className={`bg-white border border-line rounded-lg ${className}`}>
      {children}
    </div>
  );
}

export function Badge({ children, tone = "neutral" }) {
  const tones = {
    neutral: "bg-paper-dim text-ink/70",
    forest: "bg-forest/10 text-forest",
    clay: "bg-clay/10 text-clay",
    danger: "bg-danger/10 text-danger",
  };
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${tones[tone]}`}>
      {children}
    </span>
  );
}

export function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink/40" onClick={onClose} />
      <div className="relative bg-white rounded-lg border border-line w-full max-w-lg max-h-[85vh] overflow-y-auto shadow-xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-line sticky top-0 bg-white">
          <h2 className="font-display text-lg">{title}</h2>
          <button onClick={onClose} aria-label="Cerrar" className="p-1 rounded hover:bg-paper-dim">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

export function Field({ label, children }) {
  return (
    <label className="block mb-4">
      <span className="block text-xs font-medium text-ink/60 mb-1.5">{label}</span>
      {children}
    </label>
  );
}

export const inputClass =
  "w-full px-3 py-2 rounded-md border border-line bg-paper focus:bg-white text-sm";

export function EmptyState({ title, hint }) {
  return (
    <Card className="py-16 text-center">
      <p className="font-display text-lg text-ink/70">{title}</p>
      {hint && <p className="text-sm text-ink/50 mt-1">{hint}</p>}
    </Card>
  );
}
