import { useState, useEffect, useRef, useCallback } from "react";

// ═══════════════════════════════════════════════════
// BRAND TOKENS
// ═══════════════════════════════════════════════════
const C = {
  night: "#0A0F0A", forest: "#0D1A0F", surface: "#111C13", card: "#152117",
  border: "#1E3222", borderLight: "#2a4a32", fox: "#F97316", foxLight: "#FB923C",
  foxDark: "#EA580C", cyan: "#06B6D4", green: "#22C55E", red: "#EF4444",
  amber: "#F59E0B", t1: "#F1F5F1", t2: "#A3B8A8", t3: "#5E7D65", t4: "#3a5440",
};

// ═══════════════════════════════════════════════════
// RESPONSIVE
// ═══════════════════════════════════════════════════
function useMobile(breakpoint = 768) {
  const [mobile, setMobile] = useState(typeof window !== "undefined" ? window.innerWidth < breakpoint : false);
  useEffect(() => { const h = () => setMobile(window.innerWidth < breakpoint); window.addEventListener("resize", h); return () => window.removeEventListener("resize", h); }, [breakpoint]);
  return mobile;
}

const RESPONSIVE_CSS = `
@media (max-width: 768px) {
  .fx-section { padding-left: 20px !important; padding-right: 20px !important; }
  .fx-grid-3 { grid-template-columns: 1fr !important; }
  .fx-grid-4 { grid-template-columns: 1fr !important; }
  .fx-grid-2 { grid-template-columns: 1fr !important; }
  .fx-grid-2-equal { grid-template-columns: 1fr !important; gap: 40px !important; }
  .fx-stat-grid { grid-template-columns: 1fr !important; gap: 20px !important; }
  .fx-hiw-line { display: none !important; }
  .fx-hero { padding: 120px 20px 60px !important; min-height: auto !important; }
  .fx-hero h1 { font-size: 36px !important; }
  .fx-hero-buttons { flex-direction: column !important; align-items: stretch !important; }
  .fx-hero-buttons a { text-align: center !important; }
  .fx-page-hero { padding: 140px 20px 60px !important; }
  .fx-page-hero h1 { font-size: 32px !important; }
  .fx-contact-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
  .fx-footer-cols { flex-direction: column !important; gap: 32px !important; }
  .fx-scroll-indicator { display: none !important; }
  .fx-cta-buttons { flex-direction: column !important; align-items: stretch !important; }
  .fx-cta-buttons a { text-align: center !important; }
}
`;

// ═══════════════════════════════════════════════════
// SHARED COMPONENTS
// ═══════════════════════════════════════════════════
const Mark = ({ size = 44, pupilColor = C.night }) => (
  <svg width={size} height={size} viewBox="0 0 44 44" fill="none">
    <circle cx="22" cy="22" r="18" stroke={C.fox} strokeWidth="0.4" opacity="0.12" />
    <path d="M22 4.5 L26 16 L22 13.5 L18 16 Z" fill={C.fox} opacity="0.95" />
    <path d="M22 39.5 L18 28 L22 30.5 L26 28 Z" fill={C.fox} opacity="0.85" />
    <path d="M37 10.5 L27 18.5 L28 14.5 Z" fill={C.foxLight} opacity="0.6" />
    <path d="M7 33.5 L17 25.5 L16 29.5 Z" fill={C.foxLight} opacity="0.55" />
    <path d="M37 33.5 L27.5 26 L29 21.5 Z" fill={C.fox} opacity="0.35" />
    <path d="M7 10.5 L16.5 18 L15 22.5 Z" fill={C.fox} opacity="0.3" />
    <circle cx="22" cy="22" r="4" fill={C.fox} />
    <circle cx="22" cy="22" r="2" fill={pupilColor} />
  </svg>
);

function useReveal(t = 0.15) {
  const ref = useRef(null); const [v, setV] = useState(false);
  useEffect(() => { const el = ref.current; if (!el) return; const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold: t }); o.observe(el); return () => o.disconnect(); }, [t]);
  return [ref, v];
}

const Reveal = ({ children, delay = 0, style = {} }) => {
  const [ref, v] = useReveal(0.1);
  return (<div ref={ref} style={{ opacity: v ? 1 : 0, transform: v ? "translateY(0)" : "translateY(32px)", transition: `opacity 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}s`, ...style }}>{children}</div>);
};

const StatNumber = ({ value, suffix = "", prefix = "", visible }) => {
  const [count, setCount] = useState(0);
  useEffect(() => { if (!visible) return; let s = 0; const end = parseInt(value), step = Math.max(1, Math.floor(end / 60)); const t = setInterval(() => { s += step; if (s >= end) { setCount(end); clearInterval(t); } else setCount(s); }, 30); return () => clearInterval(t); }, [visible, value]);
  return <span>{prefix}{visible ? count.toLocaleString() : "0"}{suffix}</span>;
};

const GridPattern = () => (<div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0, maxWidth: "100%" }}><div style={{ position: "absolute", inset: "-50%", backgroundImage: `linear-gradient(${C.border}15 1px, transparent 1px), linear-gradient(90deg, ${C.border}15 1px, transparent 1px)`, backgroundSize: "80px 80px", transform: "perspective(600px) rotateX(60deg)", transformOrigin: "center 40%", maskImage: "radial-gradient(ellipse 60% 50% at 50% 40%, black 20%, transparent 70%)", WebkitMaskImage: "radial-gradient(ellipse 60% 50% at 50% 40%, black 20%, transparent 70%)" }} /></div>);

const GlowOrb = ({ x = "50%", y = "50%", size = 600, color = C.fox, opacity = 0.06 }) => (<div style={{ position: "absolute", left: x, top: y, width: size, height: size, transform: "translate(-50%, -50%)", background: `radial-gradient(circle, ${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')} 0%, transparent 70%)`, pointerEvents: "none", zIndex: 0, maxWidth: "100vw" }} />);

const SectionLabel = ({ children }) => (<div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase", color: C.fox, marginBottom: 16, display: "flex", alignItems: "center", gap: 12 }}><div style={{ width: 24, height: 1, background: C.fox, opacity: 0.5 }} />{children}</div>);

const PageHero = ({ label, title, subtitle, children }) => (
  <section className="fx-page-hero" style={{ position: "relative", padding: "160px 48px 100px", overflow: "hidden", textAlign: "center" }}>
    <GridPattern />
    <GlowOrb x="50%" y="40%" size={700} color={C.fox} opacity={0.035} />
    <div style={{ position: "relative", zIndex: 1, maxWidth: 700, margin: "0 auto" }}>
      <Reveal>
        <SectionLabel>{label}</SectionLabel>
        <h1 style={{ fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 20 }}>{title}</h1>
        {subtitle && <p style={{ fontSize: "clamp(15px, 1.8vw, 18px)", color: C.t2, maxWidth: 520, margin: "0 auto", lineHeight: 1.7 }}>{subtitle}</p>}
      </Reveal>
      {children}
    </div>
  </section>
);

const APP_URL = "https://app.foxtailai.com.au";

// ═══════════════════════════════════════════════════
// NAV
// ═══════════════════════════════════════════════════
function Nav({ page, setPage }) {
  const [scrollY, setScrollY] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const mobile = useMobile();
  useEffect(() => { const h = () => setScrollY(window.scrollY); window.addEventListener("scroll", h, { passive: true }); return () => window.removeEventListener("scroll", h); }, []);

  const links = [
    { label: "Product", page: "home" },
    { label: "Pricing", page: "pricing" },
    { label: "About", page: "about" },
    { label: "Find a Distributor", page: "distributors" },
    { label: "Become a Distributor", page: "become-distributor" },
    { label: "Contact", page: "contact" },
  ];

  const nav = (pg) => { setPage(pg); window.scrollTo(0, 0); setMenuOpen(false); };

  return (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, padding: mobile ? "0 20px" : "0 48px", height: 72, display: "flex", alignItems: "center", justifyContent: "space-between", background: scrollY > 50 || menuOpen ? `${C.night}ee` : "transparent", backdropFilter: scrollY > 50 || menuOpen ? "blur(20px)" : "none", borderBottom: scrollY > 50 ? `1px solid ${C.border}` : "1px solid transparent", transition: "all 0.4s ease" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }} onClick={() => nav("home")}>
        <Mark size={28} /><span style={{ fontSize: 18, fontWeight: 600, letterSpacing: "-0.02em" }}>Foxtail</span>
      </div>

      {mobile ? (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <a href={APP_URL} target="_blank" rel="noopener noreferrer" style={{ background: C.fox, color: C.night, padding: "6px 14px", borderRadius: 6, fontSize: 12, fontWeight: 600, textDecoration: "none" }}>Login</a>
            <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={C.t1} strokeWidth="2" strokeLinecap="round">
                {menuOpen ? <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></> : <><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></>}
              </svg>
            </button>
          </div>
          {menuOpen && (
            <div style={{ position: "absolute", top: 72, left: 0, right: 0, background: `${C.night}f5`, backdropFilter: "blur(20px)", borderBottom: `1px solid ${C.border}`, padding: "16px 20px", display: "flex", flexDirection: "column", gap: 4 }}>
              {links.map(l => (
                <a key={l.page} onClick={(e) => { e.preventDefault(); nav(l.page); }} href="#" style={{ color: page === l.page ? C.fox : C.t2, fontSize: 15, fontWeight: 500, textDecoration: "none", padding: "10px 0", borderBottom: `1px solid ${C.border}20` }}>{l.label}</a>
              ))}
            </div>
          )}
        </>
      ) : (
        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          {links.map(l => (
            <a key={l.page} onClick={(e) => { e.preventDefault(); nav(l.page); }} href="#" style={{ color: page === l.page ? C.t1 : C.t3, fontSize: 13, fontWeight: 500, textDecoration: "none", letterSpacing: "0.02em", transition: "color 0.2s", cursor: "pointer" }} onMouseOver={e => e.target.style.color = C.t1} onMouseOut={e => { if (page !== l.page) e.target.style.color = C.t3; }}>{l.label}</a>
          ))}
          <a href={APP_URL} target="_blank" rel="noopener noreferrer" style={{ background: C.fox, color: C.night, padding: "8px 20px", borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: "none", transition: "background 0.2s" }} onMouseOver={e => e.target.style.background = C.foxLight} onMouseOut={e => e.target.style.background = C.fox}>Login</a>
        </div>
      )}
    </nav>
  );
}

// ═══════════════════════════════════════════════════
// FOOTER
// ═══════════════════════════════════════════════════
function Footer({ setPage }) {
  const mobile = useMobile();
  const nl = (pg) => (e) => { e.preventDefault(); setPage(pg); window.scrollTo(0, 0); };
  return (
    <footer style={{ padding: mobile ? "48px 20px" : "64px 48px", borderTop: `1px solid ${C.border}`, background: C.night }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", flexDirection: mobile ? "column" : "row", justifyContent: "space-between", alignItems: mobile ? "flex-start" : "flex-start", gap: mobile ? 40 : 0 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, cursor: "pointer" }} onClick={nl("home")}>
            <Mark size={24} /><span style={{ fontSize: 16, fontWeight: 600 }}>Foxtail</span>
          </div>
          <div style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 300, fontSize: 9, letterSpacing: "0.3em", textTransform: "uppercase", color: C.t4 }}>Detect · Alert · Protect</div>
        </div>
        <div style={{ display: "flex", gap: mobile ? 32 : 48, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: C.t3, letterSpacing: "0.08em", marginBottom: 16 }}>PRODUCT</div>
            {[["Product", "home"], ["Pricing", "pricing"], ["Find a Distributor", "distributors"]].map(([t, p]) => (
              <a key={p} href="#" onClick={nl(p)} style={{ display: "block", fontSize: 13, color: C.t2, textDecoration: "none", marginBottom: 10, transition: "color 0.2s" }} onMouseOver={e => e.target.style.color = C.t1} onMouseOut={e => e.target.style.color = C.t2}>{t}</a>
            ))}
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: C.t3, letterSpacing: "0.08em", marginBottom: 16 }}>COMPANY</div>
            {[["About", "about"], ["Contact", "contact"], ["Become a Distributor", "become-distributor"]].map(([t, p]) => (
              <a key={p} href="#" onClick={nl(p)} style={{ display: "block", fontSize: 13, color: C.t2, textDecoration: "none", marginBottom: 10, transition: "color 0.2s" }} onMouseOver={e => e.target.style.color = C.t1} onMouseOut={e => e.target.style.color = C.t2}>{t}</a>
            ))}
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: C.t3, letterSpacing: "0.08em", marginBottom: 16 }}>CONNECT</div>
            <a href="mailto:admin@foxtailai.com.au" style={{ display: "block", fontSize: 13, color: C.t2, textDecoration: "none", marginBottom: 10 }}>admin@foxtailai.com.au</a>
            <a href={APP_URL} target="_blank" rel="noopener noreferrer" style={{ display: "block", fontSize: 13, color: C.t2, textDecoration: "none", marginBottom: 10 }}>Dashboard Login</a>
          </div>
        </div>
      </div>
      <div style={{ maxWidth: 1100, margin: "48px auto 0", paddingTop: 32, borderTop: `1px solid ${C.border}`, display: "flex", flexDirection: mobile ? "column" : "row", justifyContent: "space-between", gap: mobile ? 8 : 0, fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: C.t4 }}>
        <span>© 2026 Foxtail. All rights reserved.</span>
        <span>Brisbane, Australia</span>
      </div>
    </footer>
  );
}


// ═══════════════════════════════════════════════════
// HOME PAGE
// ═══════════════════════════════════════════════════
function HomePage({ setPage }) {
  const [scrollY, setScrollY] = useState(0);
  const mobile = useMobile();
  useEffect(() => { const h = () => setScrollY(window.scrollY); window.addEventListener("scroll", h, { passive: true }); return () => window.removeEventListener("scroll", h); }, []);
  const heroOpacity = Math.max(0, 1 - scrollY / 600);
  const [statsRef, statsVisible] = useReveal(0.2);
  const px = mobile ? "20px" : "48px";

  const features = [
    { icon: (<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={C.fox} strokeWidth="1.2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>), title: "AI-Powered Detection", desc: "Computer vision watches both sides of every door. Whether someone tailgates, gets let in from inside, or walks through an unsecured entrance — Foxtail counts every person and flags every unauthorised entry instantly." },
    { icon: (<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={C.fox} strokeWidth="1.2" strokeLinecap="round"><path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" /></svg>), title: "Video Evidence on Every Alert", desc: "Every alert comes with a 20-second dual-camera video clip and snapshot. See exactly what happened — not just that something happened." },
    { icon: (<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={C.fox} strokeWidth="1.2" strokeLinecap="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>), title: "Alerts Straight to Your Inbox", desc: "Get an email within seconds of an incident — complete with camera footage. No app to check, no dashboard to watch. It comes to you." },
    { icon: (<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={C.fox} strokeWidth="1.2" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>), title: "Detects Propped Doors", desc: "Door left open or wedged? Foxtail recognises the pattern of continuous unscanned entries and sends a separate door-ajar alert." },
    { icon: (<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={C.fox} strokeWidth="1.2" strokeLinecap="round"><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>), title: "Manage All Your Sites", desc: "One dashboard for every location. See which sites are online, review alerts, check live camera feeds, and manage everything from anywhere." },
    { icon: (<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={C.fox} strokeWidth="1.2" strokeLinecap="round"><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></svg>), title: "Complete Turnkey System", desc: "Cameras, hardware, software, and cloud dashboard — all included. Your local distributor handles the installation. You just review the alerts." },
  ];

  return (
    <>
      {/* HERO */}
      <section className="fx-hero" style={{ position: "relative", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "120px 24px 80px", overflow: "hidden" }}>
        <GridPattern />
        <GlowOrb x="50%" y="35%" size={900} color={C.fox} opacity={0.04} />
        <GlowOrb x="30%" y="65%" size={600} color={C.green} opacity={0.02} />
        <div style={{ position: "relative", zIndex: 1, opacity: heroOpacity, transform: `scale(${1 + scrollY * 0.0002})` }}>
          <Reveal><div style={{ marginBottom: 32 }}><Mark size={64} /></div></Reveal>
          <Reveal delay={0.15}>
            <h1 style={{ fontSize: "clamp(44px, 6.5vw, 80px)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.05, marginBottom: 24, maxWidth: 780 }}>
              Stop losing revenue<br />to <span style={{ color: C.fox }}>tailgating.</span>
            </h1>
          </Reveal>
          <Reveal delay={0.3}>
            <p style={{ fontSize: "clamp(16px, 2vw, 20px)", color: C.t2, fontWeight: 400, maxWidth: 540, margin: "0 auto 40px", lineHeight: 1.7 }}>
              AI-powered detection that watches your doors 24/7 — catching tailgaters, people being let in from inside, and every other unauthorised entry. With video evidence sent straight to your inbox.
            </p>
          </Reveal>
          <Reveal delay={0.45}>
            <div className="fx-hero-buttons" style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
              <a href="#" onClick={e => { e.preventDefault(); document.getElementById("hiw")?.scrollIntoView({ behavior: "smooth" }); }} style={{ background: C.fox, color: C.night, padding: "14px 32px", borderRadius: 10, fontSize: 15, fontWeight: 600, textDecoration: "none", transition: "all 0.25s", boxShadow: `0 0 40px ${C.fox}30` }} onMouseOver={e => { e.target.style.background = C.foxLight; e.target.style.boxShadow = `0 0 60px ${C.fox}50`; }} onMouseOut={e => { e.target.style.background = C.fox; e.target.style.boxShadow = `0 0 40px ${C.fox}30`; }}>See How It Works</a>
              <a href="#" onClick={e => { e.preventDefault(); setPage("pricing"); window.scrollTo(0, 0); }} style={{ background: "transparent", color: C.t1, padding: "14px 32px", borderRadius: 10, fontSize: 15, fontWeight: 500, textDecoration: "none", border: `1px solid ${C.border}`, transition: "all 0.25s" }} onMouseOver={e => { e.target.style.borderColor = C.t3; e.target.style.background = C.surface; }} onMouseOut={e => { e.target.style.borderColor = C.border; e.target.style.background = "transparent"; }}>View Pricing</a>
            </div>
          </Reveal>
        </div>
        <div className="fx-scroll-indicator" style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, opacity: heroOpacity * 0.5 }}>
          <div style={{ width: 1, height: 40, background: `linear-gradient(to bottom, transparent, ${C.t3})` }} />
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: C.t3, letterSpacing: "0.15em" }}>SCROLL</span>
        </div>
      </section>

      {/* THE PROBLEM */}
      <section className="fx-section" style={{ position: "relative", padding: "120px 48px", borderTop: `1px solid ${C.border}`, background: C.forest, overflow: "hidden" }}>
        <GlowOrb x="70%" y="40%" size={600} color={C.red} opacity={0.025} />
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Reveal>
            <SectionLabel>The Problem</SectionLabel>
            <h2 style={{ fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 20, maxWidth: 600, lineHeight: 1.1 }}>Your access control has a blind spot.</h2>
            <p style={{ fontSize: 16, color: C.t2, marginBottom: 24, maxWidth: 560, lineHeight: 1.8 }}>Someone scans their card and holds the door. Two, three, four people walk through on a single scan. Your system records one entry. You have no idea the others were even there.</p>
            <p style={{ fontSize: 16, color: C.t2, marginBottom: 64, maxWidth: 560, lineHeight: 1.8 }}>But it gets worse. A member walks up to the door from <em style={{ color: C.t1, fontStyle: "italic" }}>inside</em>, opens it, and lets someone in. No card scan ever happens. Your access control system sees nothing — because nothing triggered it. <span style={{ color: C.fox, fontWeight: 500 }}>Foxtail sees everything.</span></p>
          </Reveal>
          <div className="fx-grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {[
              { stat: "47%", label: "of gym members have witnessed tailgating at their club" },
              { stat: "3–5×", label: "revenue lost per tailgated entry vs a monthly membership" },
              { stat: "0", label: "existing systems that detect someone being let in from inside" },
            ].map((p, i) => (
              <Reveal key={i} delay={i * 0.12}>
                <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: "40px 32px", textAlign: "center", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 44, fontWeight: 700, color: i === 2 ? C.red : C.fox, marginBottom: 12, lineHeight: 1 }}>{p.stat}</div>
                  <div style={{ fontSize: 14, color: C.t2, lineHeight: 1.6 }}>{p.label}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* DIFFERENTIATOR */}
      <section className="fx-section" style={{ position: "relative", padding: "100px 48px", borderTop: `1px solid ${C.border}`, overflow: "hidden" }}>
        <GlowOrb x="50%" y="50%" size={700} color={C.fox} opacity={0.035} />
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              <SectionLabel>The Difference</SectionLabel>
              <h2 style={{ fontSize: "clamp(28px, 3.5vw, 42px)", fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 16, lineHeight: 1.15 }}>Other systems watch the card reader.<br /><span style={{ color: C.fox }}>Foxtail watches the door.</span></h2>
              <p style={{ fontSize: 16, color: C.t2, maxWidth: 560, margin: "0 auto", lineHeight: 1.8 }}>Traditional anti-tailgating solutions only trigger when a card is scanned. If no scan happens, they see nothing. Foxtail uses AI cameras on both sides of the door — so it catches every unauthorised entry, regardless of how they got in.</p>
            </div>
          </Reveal>
          <div className="fx-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <Reveal>
              <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: "36px 32px", height: "100%" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={C.red} strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 600, color: C.red, letterSpacing: "0.08em" }}>TRADITIONAL SYSTEMS</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {[
                    "Rely on card reader events as the trigger",
                    "Blind to entries where no card is scanned",
                    "Can't detect someone being let in from inside",
                    "Only count scans — not actual people",
                  ].map((item, i) => (
                    <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                      <span style={{ color: C.red, fontSize: 14, marginTop: 1, flexShrink: 0 }}>—</span>
                      <span style={{ fontSize: 13, color: C.t2, lineHeight: 1.6 }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.15}>
              <div style={{ background: C.surface, border: `1px solid ${C.fox}30`, borderRadius: 16, padding: "36px 32px", height: "100%", position: "relative", overflow: "hidden" }}>
                <GlowOrb x="80%" y="20%" size={200} color={C.fox} opacity={0.08} />
                <div style={{ position: "relative", zIndex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                    <Mark size={24} />
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 600, color: C.fox, letterSpacing: "0.08em" }}>FOXTAIL AI</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    {[
                      "AI cameras watch both sides of the door",
                      "Detects every person — scanned or not",
                      "Catches people being let in from inside",
                      "Counts actual bodies, not card swipes",
                    ].map((item, i) => (
                      <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ marginTop: 2, flexShrink: 0 }}><path d="M5 8 L7 10 L11 6" stroke={C.fox} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        <span style={{ fontSize: 13, color: C.t1, lineHeight: 1.6, fontWeight: 500 }}>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* WHAT YOU GET */}
      <section className="fx-section" style={{ position: "relative", padding: "120px 48px", overflow: "hidden" }}>
        <GlowOrb x="80%" y="20%" size={700} color={C.fox} opacity={0.03} />
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Reveal>
            <SectionLabel>What You Get</SectionLabel>
            <h2 style={{ fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 12, maxWidth: 550 }}>A complete detection system.<br /><span style={{ color: C.fox }}>Ready to go.</span></h2>
            <p style={{ fontSize: 16, color: C.t2, marginBottom: 64, maxWidth: 480, lineHeight: 1.7 }}>Dedicated AI cameras, on-site hardware, cloud dashboard, and real-time alerts — everything included in one package.</p>
          </Reveal>
          <div className="fx-grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {features.map((f, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: "32px 28px", transition: "border-color 0.3s, background 0.3s", height: "100%", display: "flex", flexDirection: "column" }} onMouseOver={e => { e.currentTarget.style.borderColor = C.borderLight; e.currentTarget.style.background = C.card; }} onMouseOut={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = C.surface; }}>
                  <div style={{ marginBottom: 20, opacity: 0.8 }}>{f.icon}</div>
                  <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 10 }}>{f.title}</h3>
                  <p style={{ fontSize: 13, color: C.t2, lineHeight: 1.7, flex: 1 }}>{f.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="hiw" className="fx-section" style={{ position: "relative", padding: "120px 48px", background: `linear-gradient(180deg, ${C.night} 0%, ${C.forest} 50%, ${C.night} 100%)`, borderTop: `1px solid ${C.border}`, overflow: "hidden" }}>
        <GlowOrb x="20%" y="50%" size={800} color={C.cyan} opacity={0.025} />
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Reveal>
            <SectionLabel>How It Works</SectionLabel>
            <h2 style={{ fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 12, maxWidth: 550 }}>AI that counts people,<br /><span style={{ color: C.fox }}>not just the card reader.</span></h2>
            <p style={{ fontSize: 16, color: C.t2, marginBottom: 80, maxWidth: 520, lineHeight: 1.7 }}>Two dedicated cameras are installed at each door — one watching the outside, one watching the inside. An on-site AI processor analyses both feeds in real-time, counting every person who enters and comparing that to legitimate scans. If someone tailgates, gets let in from inside, or walks through an unsecured door — you get an alert with video proof.</p>
          </Reveal>
          <div className="fx-grid-4" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0, position: "relative" }}>
            <div className="fx-hiw-line" style={{ position: "absolute", top: 28, left: "12.5%", right: "12.5%", height: 1, background: `linear-gradient(90deg, transparent, ${C.border} 10%, ${C.border} 90%, transparent)`, zIndex: 0 }} />
            {[
              { num: "01", title: "Cameras watch the door", desc: "Two dedicated AI cameras are installed at each access point — one on each side of the door." },
              { num: "02", title: "AI counts every person", desc: "Computer vision detects and tracks every individual who passes through, in real-time." },
              { num: "03", title: "Compares to card scans", desc: "The system knows how many people should have entered — and catches entries where no card was scanned at all, like someone being let in from inside." },
              { num: "04", title: "You get the evidence", desc: "An alert with video and a snapshot is emailed to you within seconds. Review it in the dashboard or your inbox." },
            ].map((s, i) => (
              <Reveal key={i} delay={i * 0.15}>
                <div style={{ position: "relative", zIndex: 1, textAlign: "center", padding: "0 12px" }}>
                  <div style={{ width: 56, height: 56, borderRadius: "50%", background: C.surface, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", fontFamily: "'JetBrains Mono', monospace", fontSize: 14, fontWeight: 600, color: C.fox }}>{s.num}</div>
                  <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 10 }}>{s.title}</h3>
                  <p style={{ fontSize: 12, color: C.t2, lineHeight: 1.7 }}>{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* DASHBOARD PREVIEW */}
      <section className="fx-section" style={{ position: "relative", padding: "120px 48px", borderTop: `1px solid ${C.border}` }}>
        <div className="fx-grid-2-equal" style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
          <Reveal>
            <div>
              <SectionLabel>Your Dashboard</SectionLabel>
              <h2 style={{ fontSize: "clamp(28px, 3.5vw, 40px)", fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 20, lineHeight: 1.15 }}>Everything in one place.</h2>
              <p style={{ fontSize: 15, color: C.t2, lineHeight: 1.8, marginBottom: 36 }}>Review alerts, watch video evidence, check live camera feeds, and monitor device health — all from a single dashboard.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {[
                  { label: "Real-time alert feed", desc: "See incidents as they happen across all your sites" },
                  { label: "Video evidence playback", desc: "Watch the dual-camera clip attached to every alert" },
                  { label: "Live camera snapshots", desc: "Check what your cameras see right now, from anywhere" },
                  { label: "Multi-site management", desc: "One login for every location in your portfolio" },
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.fox, marginTop: 7, flexShrink: 0 }} />
                    <div><div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{item.label}</div><div style={{ fontSize: 12, color: C.t3 }}>{item.desc}</div></div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: 32, position: "relative", overflow: "hidden" }}>
              <GlowOrb x="50%" y="50%" size={300} color={C.fox} opacity={0.06} />
              <div style={{ position: "relative", zIndex: 1 }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: C.t3, marginBottom: 20, display: "flex", justifyContent: "space-between" }}>
                  <span>ALERT FEED — LIVE</span><span style={{ color: C.green }}>● 3 SITES ONLINE</span>
                </div>
                {[
                  { time: "10:31 PM", site: "Melbourne CBD", event: "Unauthorised entry — Front Door", type: "alert" },
                  { time: "10:14 PM", site: "Melbourne CBD", event: "Video evidence uploaded", type: "info" },
                  { time: "9:52 PM", site: "Southbank", event: "All clear — no incidents", type: "ok" },
                  { time: "8:41 PM", site: "Richmond", event: "Door held open — 4 unscanned entries", type: "alert" },
                  { time: "8:41 PM", site: "Richmond", event: "Email alert sent to manager", type: "info" },
                  { time: "7:15 PM", site: "Southbank", event: "Unauthorised entry — Side Door", type: "alert" },
                  { time: "6:00 PM", site: "All sites", event: "Monitoring active", type: "ok" },
                ].map((e, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "10px 0", borderBottom: i < 6 ? `1px solid ${C.border}` : "none", fontSize: 12 }}>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", color: C.t4, width: 64, flexShrink: 0, fontSize: 11 }}>{e.time}</span>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", marginTop: 5, flexShrink: 0, background: e.type === "alert" ? C.red : e.type === "ok" ? C.green : C.t3 }} />
                    <div><div style={{ color: e.type === "alert" ? C.t1 : C.t2, fontWeight: e.type === "alert" ? 500 : 400 }}>{e.event}</div><div style={{ fontSize: 10, color: C.t4, marginTop: 2 }}>{e.site}</div></div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* STATS */}
      <section ref={statsRef} className="fx-section" style={{ padding: "56px 48px", borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, background: C.forest }}>
        <div className="fx-stat-grid" style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 32, textAlign: "center" }}>
          {[
            { val: 25, suf: " seconds", label: "From incident to your inbox" },
            { val: 24, suf: "/7", label: "Continuous AI monitoring" },
            { val: 99, suf: "", pre: "$", label: "Per door, per month" },
          ].map((s, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 36, fontWeight: 600, color: C.fox, marginBottom: 4 }}><StatNumber value={s.val} suffix={s.suf} prefix={s.pre || ""} visible={statsVisible} /></div>
                <div style={{ fontSize: 12, color: C.t3, letterSpacing: "0.08em", fontWeight: 500 }}>{s.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="fx-section" style={{ position: "relative", padding: "100px 48px", textAlign: "center", overflow: "hidden", background: `linear-gradient(180deg, ${C.night} 0%, ${C.forest} 50%, ${C.night} 100%)` }}>
        <GlowOrb x="50%" y="50%" size={600} color={C.fox} opacity={0.04} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 550, margin: "0 auto" }}>
          <Reveal>
            <Mark size={44} />
            <h2 style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 700, letterSpacing: "-0.02em", marginTop: 20, marginBottom: 14, lineHeight: 1.15 }}>Ready to protect your doors?</h2>
            <p style={{ fontSize: 15, color: C.t2, marginBottom: 32, lineHeight: 1.7 }}>Find a local distributor or get in touch to learn more.</p>
            <div className="fx-hero-buttons" style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
              <a href="#" onClick={e => { e.preventDefault(); setPage("distributors"); window.scrollTo(0, 0); }} style={{ background: C.fox, color: C.night, padding: "14px 32px", borderRadius: 10, fontSize: 15, fontWeight: 600, textDecoration: "none", transition: "all 0.25s", boxShadow: `0 0 40px ${C.fox}30` }} onMouseOver={e => { e.target.style.background = C.foxLight; }} onMouseOut={e => { e.target.style.background = C.fox; }}>Find a Distributor</a>
              <a href="#" onClick={e => { e.preventDefault(); setPage("contact"); window.scrollTo(0, 0); }} style={{ background: "transparent", color: C.t1, padding: "14px 32px", borderRadius: 10, fontSize: 15, fontWeight: 500, textDecoration: "none", border: `1px solid ${C.border}`, transition: "all 0.25s" }} onMouseOver={e => { e.target.style.borderColor = C.t3; e.target.style.background = C.surface; }} onMouseOut={e => { e.target.style.borderColor = C.border; e.target.style.background = "transparent"; }}>Contact Us</a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}


// ═══════════════════════════════════════════════════
// PRICING PAGE
// ═══════════════════════════════════════════════════
function PricingPage({ setPage }) {
  return (
    <>
      <PageHero label="Pricing" title={<>Simple, transparent<br /><span style={{ color: C.fox }}>pricing.</span></>} subtitle="Hardware kit upfront, monthly monitoring ongoing. No hidden fees. No lock-in contracts. Installation quoted separately by your local distributor." />

      <section style={{ position: "relative", padding: "0 48px 120px", overflow: "hidden" }}>
        <div style={{ maxWidth: 480, margin: "0 auto" }}>
          <Reveal>
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 20, padding: "56px 48px", position: "relative", overflow: "hidden" }}>
              <GlowOrb x="50%" y="0%" size={400} color={C.fox} opacity={0.05} />
              <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
                <div style={{ fontSize: 13, color: C.t3, fontWeight: 500, marginBottom: 8, letterSpacing: "0.05em" }}>PER DOOR, PER MONTH</div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 56, fontWeight: 700, color: C.fox, marginBottom: 6 }}>$99</div>
                <div style={{ fontSize: 13, color: C.t3, marginBottom: 24 }}>ongoing monitoring & software</div>
                <div style={{ background: C.night, border: `1px solid ${C.border}`, borderRadius: 10, padding: "16px 20px", marginBottom: 32, textAlign: "center" }}>
                  <div style={{ fontSize: 11, color: C.t3, letterSpacing: "0.05em", marginBottom: 4 }}>ONE-TIME HARDWARE KIT</div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 24, fontWeight: 600, color: C.t1 }}>$1,699 <span style={{ fontSize: 12, fontWeight: 400, color: C.t3 }}>+ GST</span></div>
                  <div style={{ fontSize: 11, color: C.t4, marginTop: 4 }}>Includes two AI cameras, processing hardware & software license</div>
                </div>
                <div style={{ textAlign: "left", display: "flex", flexDirection: "column", gap: 14, marginBottom: 40 }}>
                  {["Two dedicated AI cameras per door", "On-site AI processing hardware", "Cloud dashboard access", "Email alerts with video evidence", "Live camera snapshots", "24/7 continuous monitoring", "Remote system management", "All software updates included"].map((item, i) => (
                    <div key={i} style={{ display: "flex", gap: 12, alignItems: "center" }}>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke={C.fox} strokeWidth="1" opacity="0.3" /><path d="M5 8 L7 10 L11 6" stroke={C.fox} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      <span style={{ fontSize: 14, color: C.t2 }}>{item}</span>
                    </div>
                  ))}
                </div>
                <a href="#" onClick={e => { e.preventDefault(); setPage("distributors"); window.scrollTo(0, 0); }} style={{ display: "block", background: C.fox, color: C.night, padding: "14px 32px", borderRadius: 10, fontSize: 15, fontWeight: 600, textDecoration: "none", transition: "all 0.25s", boxShadow: `0 0 40px ${C.fox}25` }} onMouseOver={e => { e.target.style.background = C.foxLight; }} onMouseOut={e => { e.target.style.background = C.fox; }}>Find a Distributor</a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="fx-section" style={{ padding: "80px 48px 120px", borderTop: `1px solid ${C.border}`, background: C.forest }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <Reveal><SectionLabel>FAQ</SectionLabel></Reveal>
          {[
            { q: "What's included in the $1,699 hardware kit?", a: "Two AI cameras, the on-site AI processing hardware, and a proprietary software license. Cabling and installation are handled separately — either by you, or your local Foxtail distributor can assist." },
            { q: "Are there any lock-in contracts?", a: "No. The $99/month monitoring fee is ongoing with no minimum term. If you stop paying, the system goes offline — but there's no cancellation fee or penalty." },
            { q: "What happens if I add more doors later?", a: "Each additional door requires its own camera pair and adds another $99/month to your monitoring. Your distributor can install additional doors at any time." },
            { q: "Do I need an internet connection at the site?", a: "Yes. The system needs a standard internet connection to send alerts and sync with the cloud dashboard. The AI processing itself happens on-site — video is never uploaded to the cloud." },
            { q: "How is Foxtail different from turnstiles or speed gates?", a: "Turnstiles and speed gates physically block entry, but they're expensive, intrusive, and impractical for most facilities. More importantly, they still rely on a card scan as the trigger. If someone opens the door from inside and lets a friend in — no scan, no detection. Foxtail uses AI cameras on both sides of the door, so it catches every unauthorised entry regardless of how they got in." },
            { q: "Does it work with my existing CCTV?", a: "Foxtail uses its own dedicated camera system optimised for AI detection. This ensures consistent accuracy and means we don't interfere with your existing security setup." },
            { q: "What if I have multiple locations?", a: "The dashboard supports unlimited sites under a single login. You can manage your entire portfolio from one place." },
          ].map((faq, i) => (
            <Reveal key={i} delay={i * 0.06}>
              <div style={{ padding: "24px 0", borderBottom: `1px solid ${C.border}` }}>
                <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 8 }}>{faq.q}</div>
                <div style={{ fontSize: 13, color: C.t2, lineHeight: 1.7 }}>{faq.a}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}


// ═══════════════════════════════════════════════════
// ABOUT PAGE
// ═══════════════════════════════════════════════════
function AboutPage() {
  return (
    <>
      <PageHero label="About" title={<>Built by people who<br /><span style={{ color: C.fox }}>know access control.</span></>} subtitle="Foxtail was born from years of hands-on experience installing access control systems in gyms and facilities across Australia. We saw the gap — and built the solution." />

      <section className="fx-section" style={{ padding: "0 48px 120px" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <Reveal>
            <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
              {[
                { title: "The problem we kept seeing", body: "After years of working in access control, one thing was clear: the hardware works perfectly, but people don't always play by the rules. Tailgating, door holding, and members letting people in from inside — these are the gaps that no access control system was designed to catch. We built Foxtail to close them." },
                { title: "Why AI, and why on-site", body: "Cloud-based video processing means sending footage off-premises, which raises privacy concerns and adds latency. Foxtail processes everything locally at the site. The AI runs on a compact device right next to the cameras. Your video never leaves the building — and alerts arrive in seconds, not minutes." },
                { title: "A product, not a project", body: "Foxtail isn't a one-off custom build. It's a product designed for scale — from a single-door gym to a franchise with hundreds of locations. The dashboard manages your entire fleet. The hardware is standardised. The software updates itself. We're building the standard for anti-tailgating detection." },
              ].map((s, i) => (
                <div key={i}>
                  <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 10 }}>{s.title}</h3>
                  <p style={{ fontSize: 14, color: C.t2, lineHeight: 1.8 }}>{s.body}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="fx-section" style={{ padding: "80px 48px 100px", borderTop: `1px solid ${C.border}`, background: C.forest }}>
        <div style={{ maxWidth: 680, margin: "0 auto", textAlign: "center" }}>
          <Reveal>
            <SectionLabel>Company</SectionLabel>
            <h2 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 20 }}>Foxtail</h2>
            <p style={{ fontSize: 14, color: C.t2, lineHeight: 1.8, marginBottom: 8 }}>AI-Powered Anti-Tailgating Detection</p>
            <p style={{ fontSize: 13, color: C.t3 }}>Brisbane, Queensland, Australia</p>
          </Reveal>
        </div>
      </section>
    </>
  );
}


// ═══════════════════════════════════════════════════
// FIND A DISTRIBUTOR PAGE
// ═══════════════════════════════════════════════════
function DistributorsPage() {
  const [query, setQuery] = useState("");
  const [searched, setSearched] = useState(false);

  // Add distributors here as they sign up
  const distributors = [
    // { name: "SecureTech Solutions", address: "123 George St, Sydney NSW 2000", phone: "02 9000 0000", region: "Sydney" },
  ];

  return (
    <>
      <PageHero label="Find a Distributor" title={<>Get Foxtail installed<br /><span style={{ color: C.fox }}>at your facility.</span></>} subtitle="Foxtail systems are installed by authorised distributors. Enter your location to find the closest one." />

      <section className="fx-section" style={{ padding: "0 48px 120px" }}>
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          <Reveal>
            <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
              <div style={{ flex: 1, position: "relative" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.t3} strokeWidth="1.5" strokeLinecap="round" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }}>
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                </svg>
                <input type="text" placeholder="Enter your suburb or postcode" value={query} onChange={e => { setQuery(e.target.value); setSearched(false); }} onKeyDown={e => e.key === "Enter" && query.trim() && setSearched(true)} style={{ width: "100%", padding: "14px 16px 14px 44px", borderRadius: 10, background: C.surface, border: `1px solid ${C.border}`, color: C.t1, fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, outline: "none", transition: "border-color 0.2s" }} onFocus={e => e.target.style.borderColor = C.fox} onBlur={e => e.target.style.borderColor = C.border} />
              </div>
              <button onClick={() => query.trim() && setSearched(true)} style={{ background: C.fox, color: C.night, padding: "14px 24px", borderRadius: 10, border: "none", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "'Space Grotesk', sans-serif", transition: "background 0.2s", whiteSpace: "nowrap" }} onMouseOver={e => e.target.style.background = C.foxLight} onMouseOut={e => e.target.style.background = C.fox}>Search</button>
            </div>

            {searched && (
              <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: "32px 28px", textAlign: "center" }}>
                {distributors.length === 0 ? (
                  <div>
                    <div style={{ fontSize: 15, color: C.t2, marginBottom: 12 }}>We're currently onboarding distributors in your area.</div>
                    <div style={{ fontSize: 13, color: C.t3, marginBottom: 20 }}>Leave your details and we'll connect you with a local distributor as soon as one is available.</div>
                    <a href={`mailto:admin@foxtailai.com.au?subject=Distributor%20enquiry%20—%20${encodeURIComponent(query)}`} style={{ display: "inline-block", background: "transparent", color: C.fox, padding: "10px 24px", borderRadius: 8, border: `1px solid ${C.fox}40`, fontSize: 13, fontWeight: 600, textDecoration: "none", transition: "all 0.2s" }} onMouseOver={e => { e.target.style.background = `${C.fox}15`; e.target.style.borderColor = C.fox; }} onMouseOut={e => { e.target.style.background = "transparent"; e.target.style.borderColor = `${C.fox}40`; }}>Contact Us</a>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 16, textAlign: "left" }}>
                    {distributors.map((d, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 0", borderBottom: i < distributors.length - 1 ? `1px solid ${C.border}` : "none" }}>
                        <div><div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{d.name}</div><div style={{ fontSize: 12, color: C.t3 }}>{d.address}</div></div>
                        <a href={`tel:${d.phone}`} style={{ fontSize: 13, color: C.fox, textDecoration: "none", fontWeight: 500 }}>{d.phone}</a>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </Reveal>
        </div>
      </section>

      {/* Become a distributor */}
      <section className="fx-section" style={{ position: "relative", padding: "80px 48px 100px", borderTop: `1px solid ${C.border}`, background: C.forest, textAlign: "center", overflow: "hidden" }}>
        <GlowOrb x="50%" y="50%" size={500} color={C.fox} opacity={0.03} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 500, margin: "0 auto" }}>
          <Reveal>
            <h2 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 12 }}>Interested in becoming a distributor?</h2>
            <p style={{ fontSize: 15, color: C.t2, marginBottom: 28, lineHeight: 1.7 }}>We're building a network of security and access control professionals to sell and install Foxtail. Full training and ongoing support provided.</p>
            <a href="mailto:admin@foxtailai.com.au?subject=Distributor%20enquiry" style={{ display: "inline-block", background: "transparent", color: C.t1, padding: "12px 28px", borderRadius: 10, fontSize: 14, fontWeight: 500, textDecoration: "none", border: `1px solid ${C.border}`, transition: "all 0.25s" }} onMouseOver={e => { e.target.style.borderColor = C.fox; e.target.style.background = C.surface; }} onMouseOut={e => { e.target.style.borderColor = C.border; e.target.style.background = "transparent"; }}>Learn More</a>
          </Reveal>
        </div>
      </section>
    </>
  );
}


// ═══════════════════════════════════════════════════
// CONTACT PAGE
// ═══════════════════════════════════════════════════
function ContactPage({ setPage }) {
  const [form, setForm] = useState({ name: "", email: "", type: "general", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = () => {
    const subject = encodeURIComponent(`Website enquiry — ${form.type}`);
    const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\nType: ${form.type}\n\n${form.message}`);
    window.location.href = `mailto:admin@foxtailai.com.au?subject=${subject}&body=${body}`;
    setSent(true);
  };

  const inputStyle = { width: "100%", padding: "12px 16px", borderRadius: 10, background: C.surface, border: `1px solid ${C.border}`, color: C.t1, fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, outline: "none", transition: "border-color 0.2s" };

  return (
    <>
      <PageHero label="Contact" title={<>Get in touch.</>} subtitle="Whether you're a facility owner looking for a quote, or a security professional interested in distributing Foxtail — we'd love to hear from you." />

      <section className="fx-section" style={{ padding: "0 48px 120px" }}>
        <div className="fx-contact-grid" style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64 }}>
          <Reveal>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 24 }}>Send us a message</h3>
              {sent ? (
                <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 32, textAlign: "center" }}>
                  <div style={{ fontSize: 15, color: C.t2, marginBottom: 8 }}>Your email client should have opened with the message pre-filled.</div>
                  <div style={{ fontSize: 13, color: C.t3 }}>If it didn't, email us directly at admin@foxtailai.com.au</div>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <input type="text" placeholder="Your name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={inputStyle} onFocus={e => e.target.style.borderColor = C.fox} onBlur={e => e.target.style.borderColor = C.border} />
                  <input type="email" placeholder="Your email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={inputStyle} onFocus={e => e.target.style.borderColor = C.fox} onBlur={e => e.target.style.borderColor = C.border} />
                  <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} style={{ ...inputStyle, cursor: "pointer", appearance: "none", backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%235E7D65' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 16px center" }} onFocus={e => e.target.style.borderColor = C.fox} onBlur={e => e.target.style.borderColor = C.border}>
                    <option value="general" style={{ background: C.surface }}>General enquiry</option>
                    <option value="quote" style={{ background: C.surface }}>I want a quote</option>
                    <option value="distributor" style={{ background: C.surface }}>I want to become a distributor</option>
                    <option value="support" style={{ background: C.surface }}>Existing customer support</option>
                  </select>
                  <textarea placeholder="Your message" rows={5} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} style={{ ...inputStyle, resize: "vertical", minHeight: 120 }} onFocus={e => e.target.style.borderColor = C.fox} onBlur={e => e.target.style.borderColor = C.border} />
                  <button onClick={handleSubmit} style={{ background: C.fox, color: C.night, padding: "14px 32px", borderRadius: 10, border: "none", fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "'Space Grotesk', sans-serif", transition: "background 0.2s", alignSelf: "flex-start" }} onMouseOver={e => e.target.style.background = C.foxLight} onMouseOut={e => e.target.style.background = C.fox}>Send Message</button>
                </div>
              )}
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 24 }}>Other ways to reach us</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: C.t3, letterSpacing: "0.08em", marginBottom: 8 }}>EMAIL</div>
                  <a href="mailto:admin@foxtailai.com.au" style={{ fontSize: 15, color: C.fox, textDecoration: "none" }}>admin@foxtailai.com.au</a>
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: C.t3, letterSpacing: "0.08em", marginBottom: 8 }}>WEBSITE</div>
                  <span style={{ fontSize: 15, color: C.t2 }}>foxtailai.com.au</span>
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: C.t3, letterSpacing: "0.08em", marginBottom: 8 }}>LOCATION</div>
                  <span style={{ fontSize: 15, color: C.t2 }}>Brisbane, Queensland, Australia</span>
                </div>
                <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: "24px 20px", marginTop: 8 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Looking for a distributor?</div>
                  <div style={{ fontSize: 12, color: C.t3, marginBottom: 14 }}>Use our distributor finder to locate a Foxtail distributor near you.</div>
                  <a href="#" onClick={e => { e.preventDefault(); setPage("distributors"); window.scrollTo(0, 0); }} style={{ fontSize: 13, color: C.fox, textDecoration: "none", fontWeight: 600 }}>Find a Distributor →</a>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}


// ═══════════════════════════════════════════════════
// BECOME A DISTRIBUTOR PAGE
// ═══════════════════════════════════════════════════
function BecomeDistributorPage({ setPage }) {
  return (
    <>
      <PageHero label="Become a Distributor" title={<>Grow your business with<br /><span style={{ color: C.fox }}>recurring revenue.</span></>} subtitle="Join the Foxtail distributor network. Install our AI anti-tailgating systems for your clients and earn ongoing monthly income from every door." />

      <section className="fx-section" style={{ padding: "0 48px 100px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div className="fx-grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginBottom: 80 }}>
            {[
              { icon: (<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={C.fox} strokeWidth="1.2" strokeLinecap="round"><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></svg>), title: "Turnkey Product", desc: "Everything is built for you — hardware kits, software, cloud platform, setup wizard. You sell it, we handle the tech." },
              { icon: (<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={C.fox} strokeWidth="1.2" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><path d="M16 8l-4 4-4-4" /><path d="M16 16l-4-4-4 4" /></svg>), title: "New Revenue Stream", desc: "Add AI anti-tailgating to your offering. Unlike turnstiles or speed gates, Foxtail catches entries that other systems can't — including people being let in from inside. That's a conversation starter your competitors don't have." },
              { icon: (<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={C.fox} strokeWidth="1.2" strokeLinecap="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" /></svg>), title: "Full Training & Support", desc: "We train your team on installation and provide ongoing technical support. You're never on your own." },
            ].map((f, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: "32px 28px", height: "100%", display: "flex", flexDirection: "column" }}>
                  <div style={{ marginBottom: 20, opacity: 0.8 }}>{f.icon}</div>
                  <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 10 }}>{f.title}</h3>
                  <p style={{ fontSize: 13, color: C.t2, lineHeight: 1.7, flex: 1 }}>{f.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <div style={{ maxWidth: 680, margin: "0 auto" }}>
              <SectionLabel>What You Get</SectionLabel>
              <div style={{ display: "flex", flexDirection: "column", gap: 20, marginBottom: 60 }}>
                {[
                  { label: "A proven product to sell", desc: "The only anti-tailgating system that catches people being let in from inside — not just traditional tailgating. A real differentiator your clients haven't seen before." },
                  { label: "We handle the platform", desc: "Cloud dashboard, monitoring, software updates, and technical support — all managed by us" },
                  { label: "Pre-staged hardware option", desc: "We can ship hardware kits pre-loaded with software — your techs just mount cameras and run the setup wizard" },
                  { label: "Sales and marketing support", desc: "Co-branded collateral, product sheets, and sales resources to help you close deals" },
                  { label: "Full training", desc: "We train your team on the product, installation process, and how to demo it to clients" },
                  { label: "Priority technical support", desc: "Direct access to our engineering team for any installation or product questions" },
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.fox, marginTop: 7, flexShrink: 0 }} />
                    <div><div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{item.label}</div><div style={{ fontSize: 12, color: C.t3 }}>{item.desc}</div></div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal>
            <div style={{ maxWidth: 680, margin: "0 auto" }}>
              <SectionLabel>Ideal Partners</SectionLabel>
              <p style={{ fontSize: 15, color: C.t2, lineHeight: 1.8, marginBottom: 32 }}>
                Foxtail is a natural add-on for businesses already working in security, access control, CCTV, or gym and facility management. If your team is already on-site installing or servicing equipment, adding Foxtail to your product range is a straightforward way to offer more value to your clients.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="fx-section" style={{ position: "relative", padding: "80px 48px 100px", borderTop: `1px solid ${C.border}`, background: C.forest, textAlign: "center", overflow: "hidden" }}>
        <GlowOrb x="50%" y="50%" size={600} color={C.fox} opacity={0.04} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 520, margin: "0 auto" }}>
          <Reveal>
            <Mark size={44} />
            <h2 style={{ fontSize: "clamp(24px, 3.5vw, 36px)", fontWeight: 700, letterSpacing: "-0.02em", marginTop: 20, marginBottom: 14, lineHeight: 1.15 }}>Ready to join the network?</h2>
            <p style={{ fontSize: 15, color: C.t2, marginBottom: 28, lineHeight: 1.7 }}>Get in touch and we'll walk you through the distributor program, pricing, and next steps.</p>
            <a href="mailto:admin@foxtailai.com.au?subject=Distributor%20programme%20enquiry" style={{ display: "inline-block", background: C.fox, color: C.night, padding: "14px 32px", borderRadius: 10, fontSize: 15, fontWeight: 600, textDecoration: "none", transition: "all 0.25s", boxShadow: `0 0 40px ${C.fox}30` }} onMouseOver={e => { e.target.style.background = C.foxLight; e.target.style.boxShadow = `0 0 60px ${C.fox}50`; }} onMouseOut={e => { e.target.style.background = C.fox; e.target.style.boxShadow = `0 0 40px ${C.fox}30`; }}>admin@foxtailai.com.au</a>
          </Reveal>
        </div>
      </section>
    </>
  );
}


// ═══════════════════════════════════════════════════
// APP SHELL
// ═══════════════════════════════════════════════════
export default function FoxtailWebsite() {
  const [page, setPage] = useState("home");

  const renderPage = () => {
    switch (page) {
      case "pricing": return <PricingPage setPage={setPage} />;
      case "about": return <AboutPage />;
      case "distributors": return <DistributorsPage />;
      case "become-distributor": return <BecomeDistributorPage setPage={setPage} />;
      case "contact": return <ContactPage setPage={setPage} />;
      default: return <HomePage setPage={setPage} />;
    }
  };

  return (
    <div style={{ background: C.night, color: C.t1, fontFamily: "'Space Grotesk', sans-serif", overflowX: "hidden", minHeight: "100vh", maxWidth: "100vw" }}>
      <style>{RESPONSIVE_CSS}{`html, body { overflow-x: hidden; max-width: 100vw; }`}</style>
      <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@300;400;500;600&family=Manrope:wght@200;300;400;500;600&display=swap" rel="stylesheet" />
      <Nav page={page} setPage={setPage} />
      {renderPage()}
      <Footer setPage={setPage} />
    </div>
  );
}
