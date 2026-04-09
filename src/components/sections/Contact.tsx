import { motion } from "framer-motion";
import { useState, useRef } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// BACKEND: Web3Forms — free, zero-server, scales later
//
// Setup (2 min):
//   1. https://web3forms.com → enter your email → get Access Key
//   2. Replace the string below with your key
//   3. Deploy. Done. Leads land in your inbox instantly.
//
// Free tier: 250 submissions/month
// Scale path: swap fetch URL → Resend API / your own Next.js route / Supabase Edge Function
// ─────────────────────────────────────────────────────────────────────────────
const W3F_KEY = "f1763ff1-6e8d-4117-a089-189ef4aeb5be";

type State = "idle" | "submitting" | "success" | "error";

interface Fields {
  name: string;
  email: string;
  company: string;
  service: string;
  budget: string;
  details: string;
}

const BLANK: Fields = { name: "", email: "", company: "", service: "", budget: "", details: "" };

export function Contact() {
  const [fields, setFields] = useState<Fields>(BLANK);
  const [uiState, setUiState] = useState<State>("idle");
  const [errMsg, setErrMsg] = useState("");
  const honeypot = useRef<HTMLInputElement>(null);

  const set = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setFields((p) => ({ ...p, [e.target.name]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot.current?.value) return; // silent bot drop
    setUiState("submitting");
    setErrMsg("");

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: W3F_KEY,
          subject: `New inquiry — ${fields.service || "General"} — ${fields.name}`,
          from_name: "Creatif Nexus Website",
          Name: fields.name,
          Email: fields.email,
          "Company / Organisation": fields.company || "Not provided",
          "Service Needed": fields.service,
          "Budget Range": fields.budget || "Not provided",
          "Project Details": fields.details,
          botcheck: "",
        }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message || "Submission failed");
      setUiState("success");
      setFields(BLANK);
      // Fire conversion event if you add GA4 later:
      // window.gtag?.("event", "generate_lead", { event_category: "contact_form" });
    } catch (err) {
      setUiState("error");
      setErrMsg(err instanceof Error ? err.message : "Something went wrong. Email us directly.");
    }
  };

  const base =
    "w-full bg-transparent border-b border-primary-foreground/30 py-3 sm:py-4 text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:border-primary-foreground transition-colors font-medium text-base sm:text-lg";

  return (
    <section
      id="contact"
      className="py-20 sm:py-32 bg-primary relative z-20 overflow-hidden text-primary-foreground"
    >
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="flex flex-col lg:flex-row gap-12 sm:gap-16 justify-between">

          {/* ── Left ── */}
          <div className="w-full lg:max-w-xl">
            <motion.h2
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-display font-bold uppercase tracking-tighter mb-6 sm:mb-8 leading-[0.9]"
            >
              Start a<br /> Project.
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: 0.1 }}
              className="text-primary-foreground/80 text-base sm:text-xl md:text-2xl font-medium max-w-md mb-8 sm:mb-12 text-balance"
            >
              We're currently taking on new projects. Let's build something exceptional together.
            </motion.p>

            <motion.a
              href="mailto:hello@creatifnexus.com"
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 sm:gap-4 text-base sm:text-2xl md:text-3xl font-display font-bold border-b-2 border-primary-foreground pb-2 hover:opacity-70 transition-opacity break-all"
              data-testid="link-email"
            >
              <span>hello@creatifnexus.com</span>
              <span className="text-xl flex-shrink-0">&rarr;</span>
            </motion.a>

            {/* Trust micro-signals */}
            <motion.ul
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
              viewport={{ once: true }} transition={{ delay: 0.4 }}
              className="mt-10 sm:mt-16 space-y-3"
            >
              {[
                "Average first response within 4 hours",
                "NDA available on request",
                "No retainer lock-in — project-based engagements",
              ].map((line) => (
                <li key={line} className="flex items-center gap-3 text-xs sm:text-sm text-primary-foreground/60 font-mono tracking-wide">
                  <span className="w-1 h-1 rounded-full bg-primary-foreground/40 flex-shrink-0" />
                  {line}
                </li>
              ))}
            </motion.ul>
          </div>

          {/* ── Right: Form ── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ delay: 0.3 }}
            className="w-full lg:flex-1 lg:max-w-md lg:ml-auto"
          >
            {uiState === "success" ? (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-start gap-6 py-8"
              >
                <div className="w-12 h-12 border-2 border-primary-foreground flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M3 10l5 5 9-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-display font-bold mb-2">Message received.</h3>
                  <p className="text-primary-foreground/70 font-light leading-relaxed">
                    We'll review your inquiry and respond within 4 hours on business days.
                    Expect a short scoping reply — we like to understand before we quote.
                  </p>
                </div>
                <button
                  onClick={() => setUiState("idle")}
                  className="text-xs font-mono uppercase tracking-widest text-primary-foreground/50 hover:text-primary-foreground transition-colors border-b border-current pb-0.5"
                >
                  Send another inquiry
                </button>
              </motion.div>
            ) : (
              <form onSubmit={submit} noValidate className="space-y-5 sm:space-y-6">

                {/* Honeypot — invisible to humans, bots fill it */}
                <input ref={honeypot} type="text" name="botcheck"
                  className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />

                <input type="text" name="name" value={fields.name} onChange={set}
                  required placeholder="Your name *" autoComplete="name"
                  className={base} data-testid="input-name" />

                <input type="email" name="email" value={fields.email} onChange={set}
                  required placeholder="Email address *" autoComplete="email"
                  className={base} data-testid="input-email" />

                <input type="text" name="company" value={fields.company} onChange={set}
                  placeholder="Company / Organisation" autoComplete="organization"
                  className={base} />

                <select name="service" value={fields.service} onChange={set}
                  required className={`${base} appearance-none cursor-pointer`}
                  data-testid="select-service"
                >
                  <option value="" disabled>Service needed *</option>
                  <option value="Marketing Strategy">Marketing Strategy</option>
                  <option value="Design & Creative">Design & Creative</option>
                  <option value="Web / App Development">Web / App Development</option>
                  <option value="AI Solutions & Automation">AI Solutions & Automation</option>
                  <option value="Full Partnership">Full Partnership (Multiple Services)</option>
                </select>

                {/* Budget — surfaces deal-size intent without scaring small leads */}
                <select name="budget" value={fields.budget} onChange={set}
                  className={`${base} appearance-none cursor-pointer`}
                >
                  <option value="" disabled>Approximate budget</option>
                  <option value="Under $5K">Under $5,000</option>
                  <option value="$5K–$15K">$5,000 – $15,000</option>
                  <option value="$15K–$50K">$15,000 – $50,000</option>
                  <option value="$50K+">$50,000+</option>
                  <option value="Let's discuss">Let's discuss</option>
                </select>

                <textarea name="details" value={fields.details} onChange={set}
                  required placeholder="Tell us about your project *" rows={4}
                  className={`${base} resize-none`} data-testid="input-details" />

                {uiState === "error" && (
                  <p className="text-sm text-primary-foreground/70 font-mono">⚠ {errMsg}</p>
                )}

                <button type="submit" disabled={uiState === "submitting"}
                  className="w-full bg-primary-foreground text-primary font-bold uppercase tracking-widest py-4 sm:py-5 hover:bg-white transition-colors disabled:opacity-60 text-sm sm:text-base relative overflow-hidden group"
                  data-testid="btn-submit-contact"
                >
                  <span className="relative z-10">
                    {uiState === "submitting" ? "Sending…" : "Send Inquiry →"}
                  </span>
                  <motion.div className="absolute inset-0 bg-black/5"
                    initial={{ x: "-100%" }} whileHover={{ x: 0 }}
                    transition={{ duration: 0.3 }} />
                </button>

                <p className="text-[10px] text-primary-foreground/40 font-mono leading-relaxed">
                  We'll respond within 4 hours on business days. Your data is never sold or shared.
                </p>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

