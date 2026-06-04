interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, totalPages, total, pageSize, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const from = (page - 1) * pageSize + 1;
  const to   = Math.min(page * pageSize, total);

  const btn = (label: string | number, target: number, disabled: boolean, active = false) => (
    <button
      key={label}
      onClick={() => onPageChange(target)}
      disabled={disabled}
      aria-current={active ? "page" : undefined}
      style={{
        minWidth: 34,
        height: 34,
        padding: "0 0.5rem",
        border: `1.5px solid ${active ? "var(--sage-500)" : "var(--linen)"}`,
        borderRadius: 6,
        background: active ? "var(--sage-500)" : "transparent",
        color: active ? "white" : disabled ? "var(--stone-300)" : "var(--stone-700)",
        fontSize: "0.875rem",
        fontFamily: "var(--font-body)",
        cursor: disabled ? "default" : "pointer",
        transition: "all 150ms",
      }}
    >
      {label}
    </button>
  );

  const pages: number[] = [];
  const delta = 1;
  for (let i = Math.max(1, page - delta); i <= Math.min(totalPages, page + delta); i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-between flex-wrap gap-3" style={{ marginTop: "1.25rem" }}>
      <span style={{ fontSize: "0.8125rem", color: "var(--stone-500)" }}>
        Showing {from}–{to} of {total}
      </span>
      <div className="flex items-center gap-1">
        {btn("←", page - 1, page === 1)}
        {pages[0] > 1 && (
          <>
            {btn(1, 1, false)}
            {pages[0] > 2 && <span style={{ color: "var(--stone-400)", padding: "0 0.25rem" }}>…</span>}
          </>
        )}
        {pages.map((p) => btn(p, p, false, p === page))}
        {pages[pages.length - 1] < totalPages && (
          <>
            {pages[pages.length - 1] < totalPages - 1 && (
              <span style={{ color: "var(--stone-400)", padding: "0 0.25rem" }}>…</span>
            )}
            {btn(totalPages, totalPages, false)}
          </>
        )}
        {btn("→", page + 1, page === totalPages)}
      </div>
    </div>
  );
}
