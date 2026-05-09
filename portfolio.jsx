import { useState, useEffect, useRef, useCallback } from "react";

// ─── Utility: useInView hook ───────────────────────────────────────────────
function useInView(options = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setInView(true); obs.disconnect(); }
    }, { threshold: 0.15, ...options });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

// ─── Utility: useCounter ──────────────────────────────────────────────────
function useCounter(target, duration = 1800, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (ts) => {
      if (!startTime) startTime = ts;
      const prog = Math.min((ts - startTime) / duration, 1);
      setCount(Math.floor(prog * target));
      if (prog < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return count;
}

// ─── Typing Effect ────────────────────────────────────────────────────────
function TypingText({ strings }) {
  const [idx, setIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [text, setText] = useState("");

  useEffect(() => {
    const current = strings[idx];
    const speed = deleting ? 40 : 80;
    const timer = setTimeout(() => {
      if (!deleting) {
        setText(current.slice(0, charIdx + 1));
        if (charIdx + 1 === current.length) {
          setTimeout(() => setDeleting(true), 1800);
        } else setCharIdx(c => c + 1);
      } else {
        setText(current.slice(0, charIdx - 1));
        if (charIdx - 1 === 0) {
          setDeleting(false);
          setIdx(i => (i + 1) % strings.length);
          setCharIdx(0);
        } else setCharIdx(c => c - 1);
      }
    }, speed);
    return () => clearTimeout(timer);
  }, [charIdx, deleting, idx, strings]);

  return (
    <span className="typing-text">
      {text}
      <span className="cursor">|</span>
    </span>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────
function Navbar({ darkMode, setDarkMode }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const links = ["About", "Skills", "Projects", "Achievements", "Testimonials", "Contact"];

  const scrollTo = (id) => {
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <nav className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
      <div className="navbar__inner">
        <div className="navbar__logo" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <span className="logo-bracket">&lt;</span>
          <span className="logo-name">BS</span>
          <span className="logo-bracket">/&gt;</span>
        </div>
        <div className={`navbar__links ${menuOpen ? "navbar__links--open" : ""}`}>
          {links.map(l => (
            <button key={l} className="nav-link" onClick={() => scrollTo(l)}>{l}</button>
          ))}
          <button className="btn-cv" onClick={() => alert("CV download would trigger here!")}>
            ↓ Resume
          </button>
        </div>
        <div className="navbar__actions">
          <button className="theme-toggle" onClick={() => setDarkMode(d => !d)} aria-label="Toggle theme">
            {darkMode ? "☀" : "☾"}
          </button>
          <button className="hamburger" onClick={() => setMenuOpen(m => !m)} aria-label="Menu">
            <span /><span /><span />
          </button>
        </div>
      </div>
    </nav>
  );
}

// ─── Hero ────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero__bg-gradient" />
      <div className="hero__orb hero__orb--1" />
      <div className="hero__orb hero__orb--2" />
      <div className="hero__orb hero__orb--3" />
      <div className="hero__content">
        <div className="hero__badge fade-in-up" style={{ animationDelay: "0.1s" }}>
          <span className="badge-dot" />
          Available for Freelance Projects
        </div>
        <h1 className="hero__name fade-in-up" style={{ animationDelay: "0.2s" }}>
          Hi, I'm <span className="gradient-text">Bhavnoor Singh</span>
        </h1>
        <h2 className="hero__role fade-in-up" style={{ animationDelay: "0.35s" }}>
          <TypingText strings={[
            "Forex Market Analyst",
            "Blockchain & AI Engineer",
            "Game Developer",
            "Full-Stack Developer",
          ]} />
        </h2>
        <p className="hero__desc fade-in-up" style={{ animationDelay: "0.5s" }}>
          5+ years building scalable applications, analyzing crypto markets,
          and crafting immersive game experiences. I bridge finance, blockchain,
          and AI into production-grade systems.
        </p>
        <div className="hero__cta fade-in-up" style={{ animationDelay: "0.65s" }}>
          <button className="btn-primary" onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}>
            View My Work
          </button>
          <button className="btn-outline" onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}>
            Let's Talk →
          </button>
        </div>
        <div className="hero__socials fade-in-up" style={{ animationDelay: "0.8s" }}>
          {[
            { label: "GitHub", href: "#" },
            { label: "LinkedIn", href: "#" },
            { label: "Twitter", href: "#" },
          ].map(s => (
            <a key={s.label} href={s.href} className="social-link" target="_blank" rel="noreferrer">
              {s.label}
            </a>
          ))}
        </div>
      </div>
      <div className="hero__scroll-hint">
        <div className="scroll-mouse"><div className="scroll-wheel" /></div>
        <span>Scroll to explore</span>
      </div>
    </section>
  );
}

// ─── About ───────────────────────────────────────────────────────────────
function About() {
  const [ref, inView] = useInView();
  const timeline = [
    { year: "2019", role: "Junior Developer", desc: "Started building REST APIs and web applications using Python and Java." },
    { year: "2020", role: "Blockchain Engineer", desc: "Entered the crypto space — smart contracts, DeFi analytics, and blockchain infrastructure." },
    { year: "2021", role: "Game Developer", desc: "Built multiplayer game backends and real-time systems for indie game studios." },
    { year: "2022", role: "Forex Analyst", desc: "Integrated algorithmic trading strategies with custom Python bots and real-time data feeds." },
    { year: "2024", role: "AI & Blockchain Lead", desc: "Leading AI-powered crypto analysis systems and cross-chain blockchain solutions." },
  ];

  return (
    <section className="section" id="about" ref={ref}>
      <div className="container">
        <div className={`section-header ${inView ? "fade-in-up" : "invisible"}`}>
          <span className="section-tag">Who I Am</span>
          <h2 className="section-title">About <span className="gradient-text">Me</span></h2>
        </div>
        <div className="about__grid">
          <div className={`about__bio ${inView ? "fade-in-up" : "invisible"}`} style={{ animationDelay: "0.2s" }}>
            <p>
              I'm a multi-disciplinary engineer with 5+ years of experience across
              <strong> blockchain development</strong>, <strong>forex trading analysis</strong>,
              <strong> game development</strong>, and <strong>AI engineering</strong>.
            </p>
            <p>
              My work sits at the intersection of finance and technology — I build
              tools that process real-time market data, deploy smart contracts on
              multiple chains, and engineer AI models that bring market intelligence
              to non-technical users.
            </p>
            <p>
              When I'm not shipping production code, I'm analyzing candlestick
              patterns, contributing to open-source DeFi protocols, or prototyping
              game mechanics in Unity.
            </p>
            <div className="about__stats">
              {[
                { val: "5+", label: "Years Experience" },
                { val: "30+", label: "Projects Shipped" },
                { val: "10+", label: "Chains Integrated" },
              ].map(s => (
                <div key={s.label} className="about-stat">
                  <div className="about-stat__val">{s.val}</div>
                  <div className="about-stat__label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className={`about__timeline ${inView ? "fade-in-up" : "invisible"}`} style={{ animationDelay: "0.4s" }}>
            {timeline.map((item, i) => (
              <div key={i} className="timeline-item" style={{ animationDelay: `${0.1 * i}s` }}>
                <div className="timeline-dot" />
                <div className="timeline-content">
                  <span className="timeline-year">{item.year}</span>
                  <strong className="timeline-role">{item.role}</strong>
                  <p className="timeline-desc">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Skills ──────────────────────────────────────────────────────────────
function Skills() {
  const [ref, inView] = useInView();
  const categories = [
    {
      name: "Languages",
      icon: "⚡",
      skills: [
        { name: "Python", pct: 92 },
        { name: "Java", pct: 80 },
        { name: "JavaScript / TypeScript", pct: 85 },
        { name: "Solidity", pct: 78 },
      ],
    },
    {
      name: "Databases",
      icon: "🗄",
      skills: [
        { name: "MongoDB", pct: 88 },
        { name: "MySQL", pct: 82 },
        { name: "Redis", pct: 70 },
        { name: "PostgreSQL", pct: 75 },
      ],
    },
    {
      name: "Blockchain & Finance",
      icon: "₿",
      skills: [
        { name: "Blockchain & Crypto Analysis", pct: 90 },
        { name: "Smart Contracts (EVM)", pct: 82 },
        { name: "Forex Algorithmic Trading", pct: 85 },
        { name: "DeFi Protocol Integration", pct: 78 },
      ],
    },
    {
      name: "Backend & AI",
      icon: "🤖",
      skills: [
        { name: "REST APIs & JWT Auth", pct: 93 },
        { name: "AI / ML Engineering", pct: 80 },
        { name: "Game Development (Unity)", pct: 74 },
        { name: "Docker & CI/CD", pct: 72 },
      ],
    },
  ];

  return (
    <section className="section section--alt" id="skills" ref={ref}>
      <div className="container">
        <div className={`section-header ${inView ? "fade-in-up" : "invisible"}`}>
          <span className="section-tag">Expertise</span>
          <h2 className="section-title">My <span className="gradient-text">Skills</span></h2>
        </div>
        <div className="skills__grid">
          {categories.map((cat, ci) => (
            <div key={ci} className={`skill-card glass-card ${inView ? "fade-in-up" : "invisible"}`} style={{ animationDelay: `${0.15 * ci}s` }}>
              <div className="skill-card__header">
                <span className="skill-icon">{cat.icon}</span>
                <h3 className="skill-category">{cat.name}</h3>
              </div>
              {cat.skills.map((s, si) => (
                <div key={si} className="skill-bar-wrap">
                  <div className="skill-bar-label">
                    <span>{s.name}</span>
                    <span className="skill-pct">{s.pct}%</span>
                  </div>
                  <div className="skill-bar-track">
                    <div
                      className="skill-bar-fill"
                      style={{ width: inView ? `${s.pct}%` : "0%", transitionDelay: `${0.15 * ci + 0.08 * si}s` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Projects ─────────────────────────────────────────────────────────────
function Projects() {
  const [ref, inView] = useInView();
  const projects = [
    {
      title: "CryptoSentinel",
      desc: "Real-time blockchain analytics dashboard with AI-powered price prediction models. Integrates 12+ CEX/DEX data feeds.",
      tech: ["Python", "FastAPI", "MongoDB", "TensorFlow", "React"],
      tag: "AI + Blockchain",
      color: "#6366f1",
    },
    {
      title: "ForexBot Pro",
      desc: "Algorithmic Forex trading bot with custom backtesting engine. Supports MT4/MT5 integration and multi-currency pair analysis.",
      tech: ["Python", "MySQL", "REST API", "JWT Auth"],
      tag: "Fintech",
      color: "#8b5cf6",
    },
    {
      title: "ChainBridge SDK",
      desc: "Cross-chain token bridge library enabling seamless asset transfers across EVM-compatible networks.",
      tech: ["Solidity", "Java", "Web3.js", "MongoDB"],
      tag: "Blockchain",
      color: "#06b6d4",
    },
    {
      title: "NexusRealm",
      desc: "Multiplayer browser RPG with real-time combat system. Custom game server handling 500+ concurrent players.",
      tech: ["Java", "WebSocket", "MySQL", "Redis"],
      tag: "Game Dev",
      color: "#10b981",
    },
    {
      title: "TradeIQ Platform",
      desc: "SaaS platform delivering AI-generated Forex signals to retail traders. Includes backtesting, paper trading, and live alerts.",
      tech: ["Python", "FastAPI", "PostgreSQL", "React", "JWT"],
      tag: "SaaS",
      color: "#f59e0b",
    },
    {
      title: "DeFi Yield Optimizer",
      desc: "Automated yield farming protocol that dynamically reallocates assets across liquidity pools for maximum APY.",
      tech: ["Solidity", "Python", "Web3.py", "MongoDB"],
      tag: "DeFi",
      color: "#ec4899",
    },
  ];

  return (
    <section className="section" id="projects" ref={ref}>
      <div className="container">
        <div className={`section-header ${inView ? "fade-in-up" : "invisible"}`}>
          <span className="section-tag">Portfolio</span>
          <h2 className="section-title">Featured <span className="gradient-text">Projects</span></h2>
        </div>
        <div className="projects__grid">
          {projects.map((p, i) => (
            <div key={i} className={`project-card glass-card ${inView ? "fade-in-up" : "invisible"}`} style={{ animationDelay: `${0.1 * i}s`, "--accent": p.color }}>
              <div className="project-card__top">
                <div className="project-tag" style={{ color: p.color, borderColor: p.color + "44", background: p.color + "11" }}>
                  {p.tag}
                </div>
                <div className="project-links">
                  <a href="#" className="project-link" title="GitHub">↗</a>
                </div>
              </div>
              <h3 className="project-title">{p.title}</h3>
              <p className="project-desc">{p.desc}</p>
              <div className="project-tech">
                {p.tech.map(t => <span key={t} className="tech-pill">{t}</span>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Achievements ─────────────────────────────────────────────────────────
function Achievements() {
  const [ref, inView] = useInView();
  const stats = [
    { target: 30, suffix: "+", label: "Projects Completed" },
    { target: 5, suffix: "+", label: "Years Experience" },
    { target: 10, suffix: "+", label: "Chains Integrated" },
    { target: 98, suffix: "%", label: "Client Satisfaction" },
    { target: 500, suffix: "K+", label: "Lines of Code Written" },
    { target: 15, suffix: "+", label: "Trading Bots Deployed" },
  ];

  return (
    <section className="section section--alt" id="achievements" ref={ref}>
      <div className="container">
        <div className={`section-header ${inView ? "fade-in-up" : "invisible"}`}>
          <span className="section-tag">Impact</span>
          <h2 className="section-title">By The <span className="gradient-text">Numbers</span></h2>
        </div>
        <div className="achievements__grid">
          {stats.map((s, i) => (
            <AchievementCard key={i} {...s} start={inView} delay={0.1 * i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function AchievementCard({ target, suffix, label, start, delay }) {
  const count = useCounter(target, 1800, start);
  return (
    <div className={`achievement-card glass-card ${start ? "fade-in-up" : "invisible"}`} style={{ animationDelay: `${delay}s` }}>
      <div className="achievement-number">
        <span className="counter">{count}</span>
        <span className="counter-suffix">{suffix}</span>
      </div>
      <div className="achievement-label">{label}</div>
    </div>
  );
}

// ─── Testimonials ─────────────────────────────────────────────────────────
function Testimonials() {
  const [ref, inView] = useInView();
  const [active, setActive] = useState(0);
  const testimonials = [
    {
      name: "Arjun Mehta",
      role: "CTO, CryptoVentures Ltd",
      avatar: "AM",
      text: "Bhavnoor delivered a world-class blockchain analytics system that exceeded our expectations. His deep understanding of DeFi protocols and smart contract architecture is unmatched. Highly recommended.",
    },
    {
      name: "Sarah Williams",
      role: "Head of Trading, FX Capital Group",
      avatar: "SW",
      text: "The algorithmic trading bot Bhavnoor built for us generates consistent alpha. His ability to translate complex Forex strategies into robust Python code is extraordinary.",
    },
    {
      name: "Marcus Chen",
      role: "Founder, NexusGames Studio",
      avatar: "MC",
      text: "Our multiplayer game backend handles 500+ concurrent users flawlessly. Bhavnoor's game dev expertise combined with his scalable architecture knowledge made this possible.",
    },
    {
      name: "Priya Sharma",
      role: "VP Engineering, TradeAI",
      avatar: "PS",
      text: "Bhavnoor's AI models for market sentiment analysis improved our signal accuracy by 34%. He's a rare engineer who understands both finance and cutting-edge machine learning.",
    },
  ];

  useEffect(() => {
    if (!inView) return;
    const t = setInterval(() => setActive(a => (a + 1) % testimonials.length), 5000);
    return () => clearInterval(t);
  }, [inView, testimonials.length]);

  return (
    <section className="section" id="testimonials" ref={ref}>
      <div className="container">
        <div className={`section-header ${inView ? "fade-in-up" : "invisible"}`}>
          <span className="section-tag">Social Proof</span>
          <h2 className="section-title">What Clients <span className="gradient-text">Say</span></h2>
        </div>
        <div className={`testimonials__wrap ${inView ? "fade-in-up" : "invisible"}`} style={{ animationDelay: "0.2s" }}>
          <div className="testimonial-card glass-card">
            <div className="testimonial-stars">★★★★★</div>
            <p className="testimonial-text">"{testimonials[active].text}"</p>
            <div className="testimonial-author">
              <div className="testimonial-avatar">{testimonials[active].avatar}</div>
              <div>
                <div className="testimonial-name">{testimonials[active].name}</div>
                <div className="testimonial-role">{testimonials[active].role}</div>
              </div>
            </div>
          </div>
          <div className="testimonial-dots">
            {testimonials.map((_, i) => (
              <button key={i} className={`dot ${i === active ? "dot--active" : ""}`} onClick={() => setActive(i)} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Contact ──────────────────────────────────────────────────────────────
function Contact() {
  const [ref, inView] = useInView();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) { setStatus("error"); return; }
    setLoading(true);
    // Simulate send
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    setStatus("success");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <section className="section section--alt" id="contact" ref={ref}>
      <div className="container">
        <div className={`section-header ${inView ? "fade-in-up" : "invisible"}`}>
          <span className="section-tag">Get In Touch</span>
          <h2 className="section-title">Let's <span className="gradient-text">Connect</span></h2>
        </div>
        <div className="contact__grid">
          <div className={`contact__info ${inView ? "fade-in-up" : "invisible"}`} style={{ animationDelay: "0.2s" }}>
            <p className="contact__blurb">
              Whether you need a blockchain solution, trading bot, or a full-stack application — I'm ready to help. Let's build something great together.
            </p>
            <div className="contact__items">
              {[
                { icon: "📧", label: "Email", val: "bhavnoor@example.com" },
                { icon: "📍", label: "Location", val: "Ludhiana, Punjab, India" },
                { icon: "💼", label: "Availability", val: "Open to Freelance & Remote" },
              ].map(c => (
                <div key={c.label} className="contact-item">
                  <span className="contact-icon">{c.icon}</span>
                  <div>
                    <div className="contact-label">{c.label}</div>
                    <div className="contact-val">{c.val}</div>
                  </div>
                </div>
              ))}
            </div>
            <a
              href="https://wa.me/91XXXXXXXXXX"
              className="btn-whatsapp"
              target="_blank"
              rel="noreferrer"
            >
              💬 Chat on WhatsApp
            </a>
          </div>
          <div className={`contact__form-wrap ${inView ? "fade-in-up" : "invisible"}`} style={{ animationDelay: "0.35s" }}>
            <form className="contact-form glass-card" onSubmit={handleSubmit} noValidate>
              <div className="form-group">
                <label>Name</label>
                <input name="name" value={form.name} onChange={handleChange} placeholder="Your full name" />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="your@email.com" />
              </div>
              <div className="form-group">
                <label>Message</label>
                <textarea name="message" value={form.message} onChange={handleChange} rows={5} placeholder="Tell me about your project..." />
              </div>
              {status === "error" && <p className="form-error">Please fill in all fields.</p>}
              {status === "success" && <p className="form-success">Message sent! I'll get back to you shortly.</p>}
              <button type="submit" className="btn-primary btn-full" disabled={loading}>
                {loading ? "Sending..." : "Send Message →"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__logo">
          <span className="logo-bracket">&lt;</span>
          <span className="logo-name">BS</span>
          <span className="logo-bracket">/&gt;</span>
        </div>
        <p className="footer__copy">© 2024 Bhavnoor Singh. Crafted with passion.</p>
        <div className="footer__links">
          {["GitHub", "LinkedIn", "Twitter"].map(l => (
            <a key={l} href="#" className="footer-link">{l}</a>
          ))}
        </div>
      </div>
    </footer>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle("light", !darkMode);
  }, [darkMode]);

  return (
    <div className={`app ${darkMode ? "dark" : "light"}`}>
      <style>{CSS}</style>
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Achievements />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

// ─── CSS ──────────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0f172a;
    --bg-alt: #0d1526;
    --surface: rgba(255,255,255,0.04);
    --surface-hover: rgba(255,255,255,0.07);
    --border: rgba(255,255,255,0.08);
    --border-hover: rgba(255,255,255,0.16);
    --text-primary: #f1f5f9;
    --text-secondary: #94a3b8;
    --text-muted: #475569;
    --accent-1: #6366f1;
    --accent-2: #8b5cf6;
    --accent-3: #06b6d4;
    --grad: linear-gradient(135deg, #6366f1, #8b5cf6, #06b6d4);
    --font-display: 'Syne', sans-serif;
    --font-body: 'DM Sans', sans-serif;
    --radius: 16px;
    --radius-sm: 8px;
    --transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
  }

  .light {
    --bg: #f8fafc;
    --bg-alt: #f1f5f9;
    --surface: rgba(0,0,0,0.03);
    --surface-hover: rgba(0,0,0,0.06);
    --border: rgba(0,0,0,0.08);
    --border-hover: rgba(0,0,0,0.16);
    --text-primary: #0f172a;
    --text-secondary: #475569;
    --text-muted: #94a3b8;
  }

  html { scroll-behavior: smooth; }
  body { font-family: var(--font-body); background: var(--bg); color: var(--text-primary); line-height: 1.6; }

  .app { min-height: 100vh; transition: background 0.3s, color 0.3s; }

  /* ── Animations ── */
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes gradientShift {
    0%,100% { background-position: 0% 50%; }
    50%      { background-position: 100% 50%; }
  }
  @keyframes orbFloat {
    0%,100% { transform: translate(0,0) scale(1); }
    33%      { transform: translate(30px,-20px) scale(1.05); }
    66%      { transform: translate(-20px,15px) scale(0.97); }
  }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
  @keyframes scrollBounce {
    0%,100% { transform: translateY(0); }
    50%      { transform: translateY(6px); }
  }
  @keyframes pulse { 0%,100%{opacity:1; transform:scale(1)} 50%{opacity:0.6; transform:scale(0.85)} }

  .fade-in-up { animation: fadeInUp 0.6s both ease-out; }
  .invisible  { opacity: 0; transform: translateY(28px); }

  /* ── Layout ── */
  .container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
  .section { padding: 100px 0; }
  .section--alt { background: var(--bg-alt); }

  .section-header { text-align: center; margin-bottom: 64px; }
  .section-tag {
    display: inline-block; font-family: var(--font-body); font-size: 12px; font-weight: 600;
    letter-spacing: 0.12em; text-transform: uppercase; color: var(--accent-1);
    background: rgba(99,102,241,0.12); border: 1px solid rgba(99,102,241,0.25);
    padding: 6px 18px; border-radius: 100px; margin-bottom: 16px;
  }
  .section-title {
    font-family: var(--font-display); font-size: clamp(2rem, 4vw, 3rem);
    font-weight: 700; color: var(--text-primary); line-height: 1.15;
  }

  .gradient-text {
    background: var(--grad); background-size: 200% auto;
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    background-clip: text; animation: gradientShift 4s ease infinite;
  }

  .glass-card {
    background: var(--surface); backdrop-filter: blur(20px);
    border: 1px solid var(--border); border-radius: var(--radius);
    transition: var(--transition);
    will-change: transform;
  }
  .glass-card:hover {
    background: var(--surface-hover); border-color: var(--border-hover);
    transform: translateY(-4px);
    box-shadow: 0 20px 60px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.04);
  }

  /* ── Buttons ── */
  .btn-primary {
    display: inline-flex; align-items: center; gap: 8px;
    background: var(--grad); background-size: 200% auto;
    color: #fff; font-family: var(--font-body); font-weight: 600;
    font-size: 15px; padding: 14px 32px; border-radius: 100px;
    border: none; cursor: pointer; transition: var(--transition);
    animation: gradientShift 4s ease infinite;
    will-change: transform;
  }
  .btn-primary:hover { transform: scale(1.04); box-shadow: 0 0 30px rgba(99,102,241,0.5); }
  .btn-primary:active { transform: scale(0.98); }
  .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
  .btn-full { width: 100%; justify-content: center; }

  .btn-outline {
    display: inline-flex; align-items: center; gap: 8px;
    background: transparent; color: var(--text-primary);
    font-family: var(--font-body); font-weight: 500; font-size: 15px;
    padding: 13px 32px; border-radius: 100px;
    border: 1px solid var(--border-hover); cursor: pointer;
    transition: var(--transition); will-change: transform;
  }
  .btn-outline:hover { background: var(--surface); border-color: var(--accent-1); color: var(--accent-1); transform: scale(1.03); }

  .btn-cv {
    background: linear-gradient(135deg,#6366f1,#8b5cf6); color:#fff;
    font-weight:600; font-size:13px; padding:8px 20px; border-radius:100px;
    border:none; cursor:pointer; transition:var(--transition); will-change:transform;
    font-family: var(--font-body);
  }
  .btn-cv:hover { transform:scale(1.05); box-shadow:0 0 20px rgba(99,102,241,0.5); }

  .btn-whatsapp {
    display: inline-flex; align-items: center; gap: 10px;
    background: linear-gradient(135deg,#25d366,#128c7e);
    color: #fff; font-weight: 600; font-size: 15px;
    padding: 14px 28px; border-radius: 100px; text-decoration: none;
    transition: var(--transition); margin-top: 8px; will-change: transform;
  }
  .btn-whatsapp:hover { transform: scale(1.04); box-shadow: 0 0 24px rgba(37,211,102,0.4); }

  /* ── Navbar ── */
  .navbar {
    position: fixed; top: 0; left: 0; right: 0; z-index: 999;
    padding: 16px 0; transition: var(--transition);
  }
  .navbar--scrolled {
    background: rgba(15,23,42,0.85); backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--border);
    padding: 10px 0;
  }
  .light .navbar--scrolled { background: rgba(248,250,252,0.85); }
  .navbar__inner {
    max-width: 1200px; margin: 0 auto; padding: 0 24px;
    display: flex; align-items: center; justify-content: space-between;
  }
  .navbar__logo {
    font-family: var(--font-display); font-size: 22px; font-weight: 700;
    cursor: pointer; user-select: none;
  }
  .logo-bracket { color: var(--accent-1); }
  .logo-name { background: var(--grad); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
  .navbar__links {
    display: flex; align-items: center; gap: 8px;
  }
  .nav-link {
    background: none; border: none; color: var(--text-secondary);
    font-family: var(--font-body); font-size: 14px; font-weight: 500;
    padding: 8px 14px; border-radius: var(--radius-sm); cursor: pointer;
    transition: var(--transition);
  }
  .nav-link:hover { color: var(--text-primary); background: var(--surface); }
  .navbar__actions { display: flex; align-items: center; gap: 12px; }
  .theme-toggle {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 50%; width: 38px; height: 38px;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; font-size: 16px; transition: var(--transition);
    color: var(--text-primary);
  }
  .theme-toggle:hover { border-color: var(--accent-1); background: var(--surface-hover); }
  .hamburger { display: none; flex-direction: column; gap: 5px; background: none; border: none; cursor: pointer; padding: 4px; }
  .hamburger span { display: block; width: 22px; height: 2px; background: var(--text-primary); border-radius: 2px; transition: var(--transition); }

  /* ── Hero ── */
  .hero {
    min-height: 100vh; display: flex; align-items: center; justify-content: center;
    position: relative; overflow: hidden; padding: 120px 24px 80px;
  }
  .hero__bg-gradient {
    position: absolute; inset: 0;
    background: radial-gradient(ellipse 80% 80% at 50% -20%, rgba(99,102,241,0.18) 0%, transparent 70%),
                radial-gradient(ellipse 60% 50% at 80% 80%, rgba(6,182,212,0.1) 0%, transparent 60%);
  }
  .hero__orb {
    position: absolute; border-radius: 50%; filter: blur(80px);
    animation: orbFloat ease-in-out infinite; will-change: transform;
  }
  .hero__orb--1 { width:500px; height:500px; top:-200px; right:-100px; background: rgba(99,102,241,0.15); animation-duration:14s; }
  .hero__orb--2 { width:350px; height:350px; bottom:-100px; left:-50px;  background: rgba(139,92,246,0.12); animation-duration:18s; animation-delay:-5s; }
  .hero__orb--3 { width:250px; height:250px; top:40%; left:30%;          background: rgba(6,182,212,0.08);  animation-duration:22s; animation-delay:-10s; }

  .hero__content { position:relative; z-index:1; text-align:center; max-width:800px; }
  .hero__badge {
    display: inline-flex; align-items: center; gap: 10px;
    font-size: 13px; font-weight: 500; color: var(--text-secondary);
    background: var(--surface); border: 1px solid var(--border);
    padding: 8px 20px; border-radius: 100px; margin-bottom: 28px;
    backdrop-filter: blur(12px);
  }
  .badge-dot { width:8px; height:8px; border-radius:50%; background:#10b981; animation: pulse 2s ease-in-out infinite; }
  .hero__name {
    font-family: var(--font-display); font-size: clamp(2.4rem, 6vw, 4.5rem);
    font-weight: 800; line-height: 1.1; color: var(--text-primary); margin-bottom: 16px;
  }
  .hero__role {
    font-family: var(--font-display); font-size: clamp(1.3rem, 3vw, 2rem);
    font-weight: 600; color: var(--text-secondary); margin-bottom: 24px; min-height: 2.5rem;
  }
  .typing-text { color: var(--accent-1); }
  .cursor { animation: blink 1s step-end infinite; color: var(--accent-1); }
  .hero__desc {
    font-size: 17px; color: var(--text-secondary); max-width: 560px;
    margin: 0 auto 36px; line-height: 1.75;
  }
  .hero__cta { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; margin-bottom: 36px; }
  .hero__socials { display: flex; gap: 24px; justify-content: center; }
  .social-link {
    font-size: 13px; font-weight: 500; color: var(--text-muted);
    text-decoration: none; transition: var(--transition);
    padding: 4px 0; border-bottom: 1px solid transparent;
  }
  .social-link:hover { color: var(--accent-1); border-bottom-color: var(--accent-1); }
  .hero__scroll-hint {
    position: absolute; bottom: 40px; left: 50%; transform: translateX(-50%);
    display: flex; flex-direction: column; align-items: center; gap: 10px;
    color: var(--text-muted); font-size: 12px;
  }
  .scroll-mouse {
    width: 22px; height: 36px; border: 2px solid var(--border-hover);
    border-radius: 100px; display: flex; justify-content: center; padding-top: 6px;
  }
  .scroll-wheel { width: 3px; height: 8px; background: var(--accent-1); border-radius: 2px; animation: scrollBounce 1.8s ease-in-out infinite; }

  /* ── About ── */
  .about__grid { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: start; }
  .about__bio p { color: var(--text-secondary); margin-bottom: 16px; font-size: 16px; line-height: 1.8; }
  .about__bio strong { color: var(--text-primary); }
  .about__stats { display: flex; gap: 32px; margin-top: 32px; flex-wrap: wrap; }
  .about-stat__val { font-family: var(--font-display); font-size: 2.2rem; font-weight: 800; background: var(--grad); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
  .about-stat__label { font-size: 13px; color: var(--text-muted); margin-top: 4px; }

  .about__timeline { position: relative; padding-left: 28px; }
  .about__timeline::before { content:''; position:absolute; left:7px; top:8px; bottom:8px; width:2px; background: linear-gradient(to bottom, var(--accent-1), var(--accent-2), transparent); border-radius:1px; }
  .timeline-item { position: relative; margin-bottom: 32px; }
  .timeline-item:last-child { margin-bottom: 0; }
  .timeline-dot { position:absolute; left:-24px; top:4px; width:14px; height:14px; border-radius:50%; background: var(--grad); box-shadow: 0 0 12px rgba(99,102,241,0.5); }
  .timeline-content {}
  .timeline-year { font-size: 11px; font-weight: 700; letter-spacing: 0.1em; color: var(--accent-1); text-transform: uppercase; }
  .timeline-role { display:block; font-family: var(--font-display); font-size:16px; font-weight:700; color:var(--text-primary); margin:4px 0 6px; }
  .timeline-desc { font-size:14px; color:var(--text-secondary); line-height:1.7; }

  /* ── Skills ── */
  .skills__grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; }
  .skill-card { padding: 28px; }
  .skill-card__header { display:flex; align-items:center; gap:12px; margin-bottom:24px; }
  .skill-icon { font-size: 24px; }
  .skill-category { font-family: var(--font-display); font-size:17px; font-weight:700; color:var(--text-primary); }
  .skill-bar-wrap { margin-bottom: 16px; }
  .skill-bar-label { display:flex; justify-content:space-between; font-size:13px; color:var(--text-secondary); margin-bottom:8px; }
  .skill-pct { color:var(--accent-1); font-weight:600; }
  .skill-bar-track { height:5px; background:rgba(255,255,255,0.06); border-radius:100px; overflow:hidden; }
  .skill-bar-fill { height:100%; background: var(--grad); background-size:200% auto; border-radius:100px; transition: width 1s cubic-bezier(0.4,0,0.2,1); will-change:transform; }

  /* ── Projects ── */
  .projects__grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 24px; }
  .project-card { padding: 28px; position:relative; overflow:hidden; }
  .project-card::before { content:''; position:absolute; top:0; left:0; right:0; height:2px; background: linear-gradient(90deg, var(--accent, #6366f1), transparent); opacity:0; transition:var(--transition); }
  .project-card:hover::before { opacity:1; }
  .project-card__top { display:flex; align-items:center; justify-content:space-between; margin-bottom:16px; }
  .project-tag { font-size:11px; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; padding:4px 12px; border-radius:100px; border:1px solid; }
  .project-link { font-size:20px; color:var(--text-muted); text-decoration:none; transition:var(--transition); }
  .project-link:hover { color:var(--accent-1); }
  .project-title { font-family:var(--font-display); font-size:20px; font-weight:700; color:var(--text-primary); margin-bottom:10px; }
  .project-desc { font-size:14px; color:var(--text-secondary); line-height:1.75; margin-bottom:20px; }
  .project-tech { display:flex; flex-wrap:wrap; gap:8px; }
  .tech-pill { font-size:11px; font-weight:600; padding:4px 12px; border-radius:100px; background:rgba(99,102,241,0.1); color:var(--accent-1); border:1px solid rgba(99,102,241,0.2); }

  /* ── Achievements ── */
  .achievements__grid { display:grid; grid-template-columns:repeat(auto-fit, minmax(160px, 1fr)); gap:20px; }
  .achievement-card { padding:32px 24px; text-align:center; }
  .achievement-number { font-family:var(--font-display); font-size:clamp(2rem,4vw,3rem); font-weight:800; line-height:1; margin-bottom:8px; }
  .counter { background:var(--grad); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; background-size:200% auto; animation:gradientShift 4s ease infinite; }
  .counter-suffix { background:var(--grad); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; background-size:200% auto; animation:gradientShift 4s ease infinite; }
  .achievement-label { font-size:13px; color:var(--text-muted); font-weight:500; }

  /* ── Testimonials ── */
  .testimonials__wrap { max-width:680px; margin:0 auto; }
  .testimonial-card { padding:48px; text-align:center; }
  .testimonial-stars { font-size:22px; color:#f59e0b; margin-bottom:24px; letter-spacing:4px; }
  .testimonial-text { font-size:17px; color:var(--text-secondary); line-height:1.85; margin-bottom:32px; font-style:italic; }
  .testimonial-author { display:flex; align-items:center; justify-content:center; gap:14px; }
  .testimonial-avatar { width:48px; height:48px; border-radius:50%; background:var(--grad); display:flex; align-items:center; justify-content:center; font-weight:700; font-size:14px; color:#fff; flex-shrink:0; }
  .testimonial-name { font-weight:700; color:var(--text-primary); font-family:var(--font-display); }
  .testimonial-role { font-size:13px; color:var(--text-muted); }
  .testimonial-dots { display:flex; gap:8px; justify-content:center; margin-top:28px; }
  .dot { width:8px; height:8px; border-radius:50%; background:var(--border-hover); border:none; cursor:pointer; transition:var(--transition); }
  .dot--active { background:var(--accent-1); width:24px; border-radius:100px; }

  /* ── Contact ── */
  .contact__grid { display:grid; grid-template-columns:1fr 1.4fr; gap:64px; align-items:start; }
  .contact__blurb { font-size:16px; color:var(--text-secondary); line-height:1.8; margin-bottom:32px; }
  .contact__items { display:flex; flex-direction:column; gap:20px; margin-bottom:32px; }
  .contact-item { display:flex; align-items:flex-start; gap:16px; }
  .contact-icon { font-size:20px; margin-top:2px; }
  .contact-label { font-size:11px; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; color:var(--text-muted); margin-bottom:4px; }
  .contact-val { font-size:15px; color:var(--text-primary); font-weight:500; }
  .contact-form { padding:36px; }
  .form-group { margin-bottom:20px; }
  .form-group label { display:block; font-size:12px; font-weight:600; letter-spacing:0.08em; text-transform:uppercase; color:var(--text-muted); margin-bottom:8px; }
  .form-group input, .form-group textarea {
    width:100%; background:rgba(255,255,255,0.04); border:1px solid var(--border);
    border-radius:var(--radius-sm); padding:12px 16px; color:var(--text-primary);
    font-family:var(--font-body); font-size:15px; transition:var(--transition); resize:vertical;
  }
  .light .form-group input, .light .form-group textarea { background: rgba(0,0,0,0.03); }
  .form-group input:focus, .form-group textarea:focus { outline:none; border-color:var(--accent-1); box-shadow:0 0 0 3px rgba(99,102,241,0.15); }
  .form-group input::placeholder, .form-group textarea::placeholder { color:var(--text-muted); }
  .form-error { color:#f87171; font-size:13px; margin-bottom:16px; }
  .form-success { color:#4ade80; font-size:13px; margin-bottom:16px; }

  /* ── Footer ── */
  .footer { border-top:1px solid var(--border); padding:40px 0; }
  .footer__inner { display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:20px; }
  .footer__copy { font-size:13px; color:var(--text-muted); }
  .footer__links { display:flex; gap:20px; }
  .footer-link { font-size:13px; color:var(--text-muted); text-decoration:none; transition:var(--transition); }
  .footer-link:hover { color:var(--accent-1); }

  /* ── Responsive ── */
  @media (max-width: 900px) {
    .about__grid { grid-template-columns:1fr; gap:40px; }
    .contact__grid { grid-template-columns:1fr; gap:32px; }
    .navbar__links { display:none; }
    .navbar__links--open {
      display:flex; flex-direction:column; position:fixed; top:70px; left:0; right:0;
      background:rgba(15,23,42,0.96); backdrop-filter:blur(20px); border-bottom:1px solid var(--border);
      padding:24px; gap:12px; z-index:998;
    }
    .hamburger { display:flex; }
    .hero__cta { flex-direction:column; align-items:center; }
  }
  @media (max-width:600px) {
    .section { padding:72px 0; }
    .projects__grid, .skills__grid { grid-template-columns:1fr; }
    .achievements__grid { grid-template-columns:repeat(2,1fr); }
    .testimonial-card { padding:28px 20px; }
    .footer__inner { flex-direction:column; text-align:center; }
    .about__stats { justify-content:center; }
  }
`;
