"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";

type ActivePage = "overview" | "appointments" | "messages" | "medications" | "records" | "billing";

interface PortalHeaderProps {
  activePage?: ActivePage;
}

const NAV_ITEMS: {
  label: string;
  href: string;
  id: ActivePage;
  badge?: number;
  icon: React.ReactNode;
}[] = [
  {
    label: "Overview",
    href: "/portal",
    id: "overview",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12 12 4l9 8" /><path d="M5 10v10h14V10" />
      </svg>
    ),
  },
  {
    label: "Appointments",
    href: "/portal/appointments",
    id: "appointments",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 9h18" /><path d="M8 3v4M16 3v4" />
      </svg>
    ),
  },
  {
    label: "Messages",
    href: "#",
    id: "messages",
    badge: 2,
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8z" />
      </svg>
    ),
  },
  {
    label: "Medications",
    href: "#",
    id: "medications",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 4H7a5 5 0 0 0 0 10h10a5 5 0 0 0 0-10z" /><line x1="12" y1="4" x2="12" y2="14" />
      </svg>
    ),
  },
  {
    label: "Records",
    href: "#",
    id: "records",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /><path d="M9 13h6M9 17h4" />
      </svg>
    ),
  },
  {
    label: "Billing",
    href: "#",
    id: "billing",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="6" width="20" height="13" rx="2" /><path d="M2 11h20" />
      </svg>
    ),
  },
];

export function PortalHeader({ activePage }: PortalHeaderProps) {
  const router = useRouter();

  const handleSignOut = () => {
    if (confirm("Sign out of the patient portal?")) {
      router.push("/login");
    }
  };

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: "rgba(248,246,242,.97)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        borderBottom: "1px solid var(--linen)",
      }}
    >
      <div
        className="flex items-center"
        style={{
          maxWidth: 1320,
          marginInline: "auto",
          padding: "0 clamp(1.25rem,4vw,2.5rem)",
          height: 62,
          gap: "1.5rem",
        }}
      >
        {/* Brand */}
        <Link
          href="/portal"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.625rem",
            color: "var(--ink)",
            fontFamily: "var(--font-display)",
            fontSize: "0.95rem",
            textDecoration: "none",
            flexShrink: 0,
          }}
        >
          <span className="brand-mark">M</span>
          <span className="hidden sm:inline">Minded Connections</span>
        </Link>

        {/* Nav — desktop only */}
        <nav className="hidden lg:flex items-center gap-0.5 flex-1" aria-label="Portal navigation">
          {NAV_ITEMS.map((item) => {
            const isActive = activePage === item.id;
            return (
              <Link
                key={item.id}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.375rem",
                  padding: "0.45rem 0.75rem",
                  fontSize: "0.875rem",
                  color: isActive ? "var(--sage-600)" : "var(--stone-700)",
                  fontFamily: "var(--font-body)",
                  textDecoration: "none",
                  borderRadius: 6,
                  background: isActive ? "var(--sage-50)" : "transparent",
                  transition: "background 150ms, color 150ms",
                }}
              >
                {item.icon}
                {item.label}
                {item.badge != null && (
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 17,
                      height: 17,
                      borderRadius: "50%",
                      background: "var(--sage-500)",
                      color: "white",
                      fontSize: "0.6875rem",
                      fontWeight: 600,
                      fontFamily: "var(--font-body)",
                      lineHeight: 1,
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Actions — ml-auto keeps right-aligned on mobile when nav is hidden */}
        <div className="flex items-center gap-2 ml-auto">
          {/* Notification bell */}
          <button
            aria-label="Notifications"
            style={{
              position: "relative",
              width: 38,
              height: 38,
              background: "none",
              border: "none",
              borderRadius: 6,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--stone-700)",
              cursor: "pointer",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
              <path d="M10 21a2 2 0 0 0 4 0" />
            </svg>
            {/* Green dot */}
            <span
              style={{
                position: "absolute",
                top: 7,
                right: 7,
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "var(--sage-500)",
                border: "2px solid var(--warm-white)",
              }}
            />
          </button>

          {/* Avatar pill */}
          <button
            onClick={handleSignOut}
            title="Sign out"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.375rem 0.75rem 0.375rem 0.375rem",
              background: "none",
              border: "1.5px solid var(--linen)",
              borderRadius: 100,
              cursor: "pointer",
            }}
          >
            <span
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: "var(--sage-100)",
                color: "var(--sage-700)",
                fontFamily: "var(--font-display)",
                fontSize: "0.875rem",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              S
            </span>
            <span
              className="hidden sm:inline"
              style={{ fontSize: "0.875rem", color: "var(--ink)", fontFamily: "var(--font-body)" }}
            >
              Sarah C.
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
