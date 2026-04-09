import { motion } from "framer-motion";
import { useState } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// LEAD MAGNET BACKEND: Buttondown (free tier, 100 subscribers, zero friction)
//
// Setup (5 min):
//   1. https://buttondown.com → create free account
//   2. Settings → Integrations → grab your API key
//   3. Replace the key below
//
// Scale path: swap for ConvertKit / Loops / Resend Audiences later.
// The shape of the fetch call stays the same.
// ─────────────────────────────────────────────────────────────────────────────
const BUTTONDOWN_API_KEY = "51779777-9d91-44e1-bc82-78f8000eb280";

type AuditState = "idle" | "submitting" | "success" | "error";

export function CTA() {
  const [auditEmail, setAuditEmail] = useState("");
  const [auditState, setAuditState] = useState<AuditState>("idle");

  const handleAuditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auditEmail) return;
    setAuditState("submitting");

    try {
      // Buttondown subscribe endpoint — adds the lead to your list
      // tagged "audit-request" so you know which CTA converted
      const res = await fetch("https://api.buttondown.email/v1/subscribers", {
        method: "POST",
        headers: {
          Authorization: `Token ${BUTTONDOWN_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email_address: auditEmail,
          tags: ["audit-request", "website-cta"],
          referrer_url: window.location.href,
        }),
      });

      if (res.status === 201 || res.status === 200) {
        setAuditState("success");
        setAuditEmail("");
        // Fire GA4 lead event if you later add analytics:
        // window.gtag?.("event", "generate_lead", { event_category: "audit_cta" });
      } else {
        const json = await res.json();
        // 400 + "already subscribed" is fine — still a qualified lead
        if (json?.email_address?.includes("already subscribed")) {
          setAuditState("success");
        } else {
          throw new Error("Could not subscribe. Please try again.");
        }
      }
    } catch {
      setAuditState("error");
    }
  };

  return (
    <section className="py-20 sm:py-32 relative overflow-hidden bg-background border-y border-border">

      {/* Animated dot grid */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: "radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        >
          <motion.div
            className="w-full h-full bg-gradient-to-r from-transparent via-background to-transparent"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          />
        </div>
      </div>

      {/* Radial glow */}
      <motion.div
        animate={{ scale: [1, 1.05, 1], opacity: [0.08, 0.12, 0.08] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[600px] md:w-[800px] h-[400px] sm:h-[600px] md:h-[800px] bg-primary rounded-full blur-[120px] pointer-events-none z-0"
      />

      <div className="container mx-auto px-4 sm:px-6 relative z-10 flex flex-col items-center text-center">

        {/* Availability badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-background/50 backdrop-blur-sm mb-6 sm:mb-8"
        >
          <motion.div
            animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 2, repeat: Infinity }}
            className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"
          />
          <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
            Currently Accepting Projects
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }} transition={{ delay: 0.1 }}
          className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-display font-bold tracking-tight text-foreground max-w-4xl text-balance mb-4 sm:mb-6"
        >
          Ready to Build Something the World Has Never Seen?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }} transition={{ delay: 0.2 }}
          className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl font-light mb-8 sm:mb-10 text-balance"
        >
          We're looking for ambitious partners ready to challenge the status quo. Let's design the future of your brand.
        </motion.p>

        {/* ── PRIMARY CTAs: High-intent buyers ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }} transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mb-10 sm:mb-14 w-full max-w-xs sm:max-w-none"
        >
          <a
            href="#contact"
            data-testid="btn-cta-start"
            className="px-6 sm:px-8 py-3.5 sm:py-4 bg-primary text-primary-foreground font-bold uppercase tracking-widest text-xs sm:text-sm hover:bg-primary/90 transition-colors w-full sm:w-auto text-center"
          >
            Start a Project →
          </a>
          <a
            href="#contact"
            data-testid="btn-cta-schedule"
            className="px-6 sm:px-8 py-3.5 sm:py-4 bg-transparent border border-border text-foreground font-bold uppercase tracking-widest text-xs sm:text-sm hover:bg-border/50 transition-colors w-full sm:w-auto text-center"
          >
            Schedule a Discovery Call
          </a>
        </motion.div>

        {/* ── DIVIDER ── */}
        <motion.div
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: true }} transition={{ delay: 0.4 }}
          className="flex items-center gap-4 w-full max-w-lg mb-10 sm:mb-14"
        >
          <div className="flex-1 h-px bg-border" />
          <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground/50 whitespace-nowrap">
            Not ready yet?
          </span>
          <div className="flex-1 h-px bg-border" />
        </motion.div>

        {/* ── SECONDARY CTA: Lead magnet — free brand/AI audit ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ delay: 0.5 }}
          className="w-full max-w-xl mb-6"
        >
          <p className="text-sm sm:text-base text-muted-foreground font-light mb-4 sm:mb-6 text-balance">
            Get a <span className="text-foreground font-medium">free 15-point brand & AI readiness audit</span> — we'll review your current digital presence and tell you exactly where you're leaving money on the table.
          </p>

          {auditState === "success" ? (
            <motion.div
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 justify-center text-sm text-foreground font-mono py-3"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M2.5 8l4 4 7-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>You're on the list. Expect your audit within 48 hours.</span>
            </motion.div>
          ) : (
            <form
              onSubmit={handleAuditSubmit}
              className="flex flex-col sm:flex-row items-stretch gap-2 sm:gap-0"
            >
              <input
                type="email"
                value={auditEmail}
                onChange={(e) => setAuditEmail(e.target.value)}
                required
                placeholder="your@email.com"
                className="flex-1 bg-card border border-border text-foreground placeholder:text-muted-foreground/50 px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors font-medium"
              />
              <button
                type="submit"
                disabled={auditState === "submitting"}
                className="px-5 sm:px-6 py-3 bg-foreground text-background font-bold uppercase tracking-widest text-[10px] sm:text-xs hover:bg-foreground/90 transition-colors disabled:opacity-50 whitespace-nowrap"
              >
                {auditState === "submitting" ? "…" : "Get Free Audit"}
              </button>
            </form>
          )}

          {auditState === "error" && (
            <p className="text-xs text-muted-foreground font-mono mt-2">
              Something went wrong. Email us at hello@creatifnexus.com
            </p>
          )}

          <p className="text-[10px] text-muted-foreground/40 font-mono mt-3">
            No spam. Unsubscribe any time. We audit and reply personally — not a template.
          </p>
        </motion.div>

        {/* Response time signal */}
        <motion.div
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: true }} transition={{ delay: 0.6 }}
          className="flex items-center gap-2 text-xs text-muted-foreground font-mono"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <span>Average project response time: 4 hours</span>
        </motion.div>
      </div>
    </section>
  );
}
