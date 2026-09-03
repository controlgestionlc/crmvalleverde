import { useRef } from "react";
import { Upload, FileText, Trash2, Download } from "lucide-react";
import { useDocuments } from "../hooks/useDocuments";
import { Button } from "./ui";

function formatBytes(bytes) {
  if (!bytes) return "";
  const units = ["B", "KB", "MB", "GB"];
  let i = 0;
  let n = bytes;
  while (n >= 1024 && i < units.length - 1) {
    n /= 1024;
    i++;
  }
  return `${n.toFixed(n < 10 && i > 0 ? 1 : 0)} ${units[i]}`;
}

export default function DocumentsPanel({ parentType, parentId }) {
  const { docs, loading, uploading, upload, remove } = useDocuments(parentType, parentId);
  const inputRef = useRef(null);

  const handleFiles = (e) => {
    const files = Array.from(e.target.files || []);
    files.forEach((f) => upload(f));
    e.target.value = "";
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-medium text-ink/60">Documentos</p>
        <Button type="button" variant="ghost" onClick={() => inputRef.current?.click()} disabled={uploading}>
          <Upload className="w-3.5 h-3.5" /> {uploading ? "Subiendo…" : "Subir archivo"}
        </Button>
        <input ref={inputRef} type="file" multiple className="hidden" onChange={handleFiles} />
      </div>

      {loading ? (
        <p className="text-xs text-ink/40">Cargando…</p>
      ) : docs.length === 0 ? (
        <p className="text-xs text-ink/40">Sin documentos todavía. Sube contratos, identificaciones u otros archivos.</p>
      ) : (
        <div className="space-y-1.5">
          {docs.map((d) => (
            <div key={d.id} className="flex items-center gap-2 px-3 py-2 rounded-md border border-line bg-paper text-sm">
              <FileText className="w-4 h-4 text-ink/40 shrink-0" />
              <a href={d.url} target="_blank" rel="noreferrer" className="flex-1 min-w-0 truncate hover:underline">
                {d.name}
              </a>
              <span className="text-xs text-ink/40 shrink-0">{formatBytes(d.size)}</span>
              <a
                href={d.url}
                target="_blank"
                rel="noreferrer"
                download
                className="p-1 rounded hover:bg-paper-dim shrink-0"
                aria-label="Descargar"
              >
                <Download className="w-3.5 h-3.5" />
              </a>
              <button
                type="button"
                onClick={() => remove(d)}
                className="p-1 rounded hover:bg-danger/10 text-danger shrink-0"
                aria-label="Eliminar"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
