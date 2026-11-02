import { useEffect, useRef, useState } from "react";
import {
  ArrowRight, ArrowUpRight, HandHeart, Recycle, School, Stethoscope, Eye, Sprout, Trophy,
  Bike, PackageCheck, Truck, Mail, MapPin, Building2, Landmark, HandCoins, BookOpen,
  Scissors, Shirt, BadgeCheck, Handshake, ChevronUp,
} from "lucide-react";
import {FaYoutube,FaFacebookF   } from "react-icons/fa";

/* ---------- helpers ---------- */
const prefersReduced = () =>
  typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

function useInView(threshold = 0.2) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined" || prefersReduced()) return setSeen(true);
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setSeen(true); io.disconnect(); }
    }, { threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, seen];
}

function Reveal({ children, delay = 0, className = "" }) {
  const [ref, seen] = useInView(0.15);
  return (
    <div ref={ref} style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-[900ms] ease-out motion-reduce:transition-none ${seen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`}>
      {children}
    </div>
  );
}

function Counter({ end, suffix = "", duration = 1800 }) {
  const [ref, seen] = useInView(0.4);
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!seen) return;
    if (prefersReduced()) return setV(end);
    let raf, t0;
    const tick = (t) => {
      t0 ??= t;
      const p = Math.min((t - t0) / duration, 1);
      setV(Math.round(end * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [seen, end, duration]);
  return <span ref={ref}>{v.toLocaleString("da-DK")}{suffix}</span>;
}

/* Image with graceful fallback (broken remote URLs no longer leave a blank hole) */
function Img({ src, alt = "", className = "", ...rest }) {
  const [failed, setFailed] = useState(false);
  if (failed) return <div role={alt ? "img" : undefined} aria-label={alt || undefined} className={`${className} bg-gradient-to-br from-[#174F46] to-[#102E29]`} />;
  return <img src={src} alt={alt} loading="lazy" decoding="async" onError={() => setFailed(true)} className={className} {...rest} />;
}

const Eyebrow = ({ children, light }) => (
  <span className={`inline-flex items-center gap-3 text-[13px] font-semibold tracking-wide ${light ? "text-[#F0A176]" : "text-[#B4521F]"}`}>
    <span className="w-8 h-px bg-current" />{children}
  </span>
);

const H2 = ({ children, className = "" }) => (
  <h2 className={`font-display text-[34px] sm:text-5xl lg:text-6xl font-semibold tracking-[-1.5px] leading-[1.1] mt-6 ${className}`}>{children}</h2>
);

/* ---------- data ---------- */
const img = {
  hero: "	https://www.dkrelief.dk/images/ghana-school.jpg",
  school: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=85",
  community: "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&w=1200&q=85",
  warehouse: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=85",
};

const stats = [
  { end: 36, label: "års erfaring" },
  { end: 29, label: "samarbejdslande" },
  { end: 500000, suffix: "*", label: "mennesker nået" },
  { end: 1990, label: "etableret", plain: true },
];

const transforms = [
  { from: "Et bord", to: "bliver undervisning", icon: BookOpen, text: "Skolemøbler fra Næstved giver elever bedre rammer for at lære – som i projektet i Marokko." },
  { from: "En symaskine", to: "bliver en arbejdsplads", icon: Scissors, text: "Udstyr og ressourcer bliver til værktøjer for nye arbejdspladser og lokalt iværksætteri." },
  { from: "Et par briller", to: "giver adgang til uddannelse", icon: Eye, text: "Briller og andet udstyr giver bedre muligheder for uddannelse, arbejde og hverdagsliv." },
  { from: "En cykel", to: "skaber mobilitet", icon: Bike, text: "Cykler styrker mobiliteten på landet og skaber fællesskab i lokalsamfundet." },
  { from: "Sportstøj", to: "styrker fællesskab", icon: Shirt, text: "Sportsudstyr bliver til aktivitet og muligheder for børn og unge." },
];

const areas = [
  { icon: School, title: "Uddannelse", text: "Skolemøbler får nyt liv og styrker rammerne for læring." },
  { icon: Stethoscope, title: "Sundhed", text: "Udstyr bliver til bedre muligheder for behandling." },
  { icon: Eye, title: "Syn", text: "Briller giver adgang til uddannelse, arbejde og hverdag." },
  { icon: Sprout, title: "Iværksætteri", text: "Udstyr bliver til værktøjer for nye arbejdspladser." },
  { icon: Trophy, title: "Sport", text: "Aktivitet og fællesskab for børn og unge." },
  { icon: Bike, title: "Community på landet", text: "Cykler styrker mobilitet og lokalt fællesskab." },
];

const steps = [
  { icon: PackageCheck, title: "Indsamling", text: "Brugbart udstyr fra virksomheder, kommuner og institutioner." },
  { icon: Recycle, title: "Klargøring", text: "Kvalitetstjek og klargøring i Globus-værkstedet." },
  { icon: Truck, title: "Transport", text: "Sendes via partnere – shipping finansieres af projektet eller partneren." },
  { icon: HandHeart, title: "Lokal værdi", text: "Udstyret skaber kapacitet hos lokale organisationer." },
];

const partners = [
  { icon: Building2, title: "Virksomheder", text: "Donationer, finansiering af transport, medarbejderengagement og længerevarende partnerskaber." },
  { icon: Landmark, title: "Kommuner & institutioner", text: "Genanvendelse af udstyr, cirkulær ressourceanvendelse og konkrete udviklingsprojekter." },
  { icon: HandCoins, title: "Fonde & donorer", text: "Støtte til udviklingsprogrammer, kapacitetsopbygning og organisationsudvikling." },
];

const sponsors = ["UFF Humana", "Frivilligcenter Næstved", "Genbrug til Syd", "Lions Suså", "Mærk Næstved", "Svend Aages Varetrans", "Mindbee ApS", "Garant Næstved", "Sjællandske Medier", "Røde Kors Næstved-Fuglebjerg", "Næstved Kommune"];

/* every id here exists in the page (the old "platform" link pointed nowhere) */
const LINKS = [
  ["Effekt", "impact"],
  ["Om DRG", "about"],
  ["Aktiviteter", "areas"],
  ["Samarbejde", "partners"],
  ["Kontakt", "contact"],
];

const MAIL = "dkrelief@dkrelief.dk";

/* ---------- header ---------- */
function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState("");
  const openRef = useRef(open);
  openRef.current = open;

  useEffect(() => {
    let last = window.scrollY, ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        setScrolled(y > 40);
        setProgress(max > 0 ? Math.min(y / max, 1) : 0);
        if (Math.abs(y - last) > 6) setHidden(y > last && y > 240 && !openRef.current);
        last = y;
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const els = LINKS.map(([, id]) => document.getElementById(id)).filter(Boolean);
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    const onResize = () => window.innerWidth >= 1024 && setOpen(false);
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  const solid = scrolled && !open;

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ease-out motion-reduce:transition-none
          ${hidden ? "-translate-y-full" : "translate-y-0"}
          ${solid ? "bg-[#F7F5EF]/90 backdrop-blur-xl shadow-[0_8px_30px_-18px_rgba(16,46,41,.5)] text-[#202923]" : "text-white"}`}
      >
        <div className={`max-w-[1440px] mx-auto px-5 lg:px-12 flex items-center justify-between transition-all duration-500 ${solid ? "h-[64px]" : "h-[80px]"}`}>
          <a href="#home" onClick={() => setOpen(false)} className="group flex items-center gap-3 rounded-full">
            <span className="relative w-11 h-11 rounded-full bg-[#E77B45] flex items-center justify-center text-white transition-all duration-500 group-hover:bg-[#174F46] group-hover:rotate-[360deg]">
              <HandHeart size={22} />
            </span>
            <span className="leading-tight">
              <span className="block font-black text-[15px] tracking-tight">DANISH RELIEF GROUP</span>
              <span className="block text-[10px] tracking-[3px] opacity-80 font-semibold">NØDHJÆLPSDEPOTET</span>
            </span>
          </a>

          <nav className="hidden lg:flex items-center gap-9" aria-label="Hovedmenu">
            {LINKS.map(([label, id]) => {
              const on = active === id;
              return (
                <a key={id} href={`#${id}`} aria-current={on ? "true" : undefined}
                  className={`group relative py-2 text-[13px] font-medium transition-colors duration-300 ${on ? "text-[#E77B45]" : "hover:text-[#E77B45]"}`}>
                  {label}
                  <span className={`absolute left-0 -bottom-0.5 h-[2px] bg-[#E77B45] transition-all duration-300 ${on ? "w-full" : "w-0 group-hover:w-full"}`} />
                </a>
              );
            })}
          </nav>

          <a href="#contact"
            className="group relative hidden lg:inline-flex items-center gap-2 overflow-hidden bg-[#C8561F] text-white pl-6 pr-5 py-3 rounded-full text-xs font-bold">
            <span className="absolute inset-0 bg-[#174F46] -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out" />
            <span className="relative">Bliv partner</span>
            <ArrowUpRight size={15} className="relative transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>

          <button
            onClick={() => setOpen(!open)}
            aria-label={open ? "Luk menu" : "Åbn menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="lg:hidden relative w-11 h-11 flex items-center justify-center rounded-full hover:bg-white/10 transition"
          >
            <span className={`absolute w-6 h-[2px] bg-current rounded transition-all duration-300 ${open ? "rotate-45" : "-translate-y-[7px]"}`} />
            <span className={`absolute w-6 h-[2px] bg-current rounded transition-all duration-300 ${open ? "opacity-0 scale-x-0" : "opacity-100"}`} />
            <span className={`absolute w-6 h-[2px] bg-current rounded transition-all duration-300 ${open ? "-rotate-45" : "translate-y-[7px]"}`} />
          </button>
        </div>

        <span
          className="absolute bottom-0 left-0 h-[2px] w-full bg-[#E77B45] origin-left"
          style={{ transform: `scaleX(${progress})`, opacity: solid ? 1 : 0 }}
        />
      </header>

      {/* Mobile menu: hidden from keyboard/screen readers when closed */}
      <div
        id="mobile-menu"
        aria-hidden={!open}
        className={`lg:hidden fixed inset-0 z-40 bg-[#102E29] text-white flex flex-col justify-between px-6 pt-28 pb-10 overflow-y-auto ${open ? "pointer-events-auto" : "pointer-events-none"}`}
        style={{
          clipPath: open ? "circle(150% at calc(100% - 44px) 40px)" : "circle(0% at calc(100% - 44px) 40px)",
          visibility: open ? "visible" : "hidden",
          transition: `clip-path 700ms cubic-bezier(.7,0,.2,1), visibility 0s linear ${open ? "0s" : "700ms"}`,
        }}
      >
        <nav className="flex flex-col" aria-label="Mobilmenu">
          {LINKS.map(([label, id], n) => (
            <a key={id} href={`#${id}`} onClick={() => setOpen(false)}
              style={{ transitionDelay: open ? `${250 + n * 80}ms` : "0ms" }}
              className={`group flex items-center justify-between border-b border-white/10 py-5 transition-all duration-700 ${open ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
              <span className={`font-display text-3xl font-semibold tracking-tight transition-all duration-300 group-hover:translate-x-2 ${active === id ? "text-[#F0A176]" : ""}`}>{label}</span>
              <ArrowUpRight className="text-white/40 group-hover:text-[#E77B45] transition" size={22} />
            </a>
          ))}
        </nav>

        <div style={{ transitionDelay: open ? "700ms" : "0ms" }}
          className={`space-y-4 mt-10 transition-all duration-700 ${open ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <a href={`mailto:${MAIL}`} className="flex items-center gap-3 text-sm text-white/80 hover:text-white transition">
            <Mail size={18} className="text-[#F0A176]" /> {MAIL}
          </a>
          <p className="flex items-center gap-3 text-sm text-white/80"><MapPin size={18} className="text-[#F0A176]" /> Herlufmagle, Danmark</p>
          <a href="#contact" onClick={() => setOpen(false)}
            className="flex items-center justify-center gap-2 bg-[#C8561F] rounded-full py-4 text-sm font-bold active:scale-[.98] transition">
            Bliv partner <ArrowUpRight size={17} />
          </a>
        </div>
      </div>
    </>
  );
}

/* ---------- sections ---------- */
function Hero() {
  return (
    <section id="home" className="relative min-h-[100svh] flex flex-col justify-end overflow-hidden bg-[#102E29]">
      <Img src={img.hero} alt="" className="drg-zoom absolute inset-0 w-full h-full object-cover opacity-40" loading="eager" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#102E29] via-[#102E29]/70 to-[#102E29]/30" />
      <div className="relative z-10 max-w-[1440px] mx-auto w-full px-6 lg:px-20 pt-40 pb-14">
        <div className="drg-rise inline-flex items-center gap-3 border border-white/30 rounded-full px-4 py-2 text-white/90 text-xs mb-8">
          <span className="w-2 h-2 rounded-full bg-[#E77B45] motion-safe:animate-pulse" /> Siden 1990 · Medlem af CISU
        </div>
        <h1 className="drg-rise font-display text-white text-[36px] sm:text-6xl lg:text-[84px] leading-[1.04] tracking-[-2px] font-semibold max-w-[1000px] [overflow-wrap:anywhere] sm:[overflow-wrap:normal]" style={{ animationDelay: "120ms" }}>
          Overskudsressourcer.<br />
          <span className="text-[#F0A176] italic font-normal">Lokale behov.</span><br />
          Internationale partnerskaber.
        </h1>
        <p className="drg-rise text-white/85 text-base lg:text-lg max-w-[560px] leading-8 mt-8" style={{ animationDelay: "260ms" }}>
          DRG forbinder overskydende ressourcer i Danmark med dokumenterede behov hos lokale organisationer – og skaber varig værdi på tværs af 29 lande.
        </p>
        <div className="drg-rise flex flex-wrap gap-4 mt-10" style={{ animationDelay: "380ms" }}>
          <a href="#partners" className="inline-flex items-center gap-1 bg-[#C8561F] text-white px-7 py-4 rounded-full font-bold text-sm hover:bg-white hover:text-[#174F46] transition">
            Bliv samarbejdspartner <ArrowUpRight size={17} />
          </a>
          <a href="#impact" className="border border-white/50 text-white px-7 py-4 rounded-full font-bold text-sm hover:bg-white hover:text-[#174F46] transition">Se vores effekt</a>
        </div>

        <dl className="mt-16 grid grid-cols-2 lg:grid-cols-4 border-t border-white/20">
          {stats.map((s, i) => (
            <div key={s.label} className={`py-7 ${i % 2 ? "pl-6 border-l border-white/20 lg:border-l-0" : ""} ${i > 1 ? "border-t border-white/20 lg:border-t-0" : ""} ${i > 0 ? "lg:border-l lg:border-white/20 lg:pl-8" : ""}`}>
              <dd className="order-1 text-white text-4xl lg:text-5xl font-semibold tracking-tight font-display">
                {s.plain ? s.end : <Counter end={s.end} suffix={s.suffix} />}
              </dd>
              <dt className="text-white/70 text-sm mt-2">{s.label}</dt>
            </div>
          ))}
        </dl>
        <p className="text-white/60 text-xs mt-2">* Estimat baseret på organisationens mangeårige aktiviteter og internationale samarbejder.</p>
      </div>
    </section>
  );
}

function Impact() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused || prefersReduced()) return;
    const t = setInterval(() => setI((x) => (x + 1) % transforms.length), 4500);
    return () => clearInterval(t);
  }, [paused]);
  const cur = transforms[i];
  const Icon = cur.icon;
  return (
    <section id="impact" className="scroll-mt-16 bg-[#F7F5EF] py-24 lg:py-32 px-6 lg:px-12">
      <div className="max-w-[1280px] mx-auto">
        <Reveal>
          <Eyebrow>Ressourcerne er ikke målet</Eyebrow>
          <H2 className="max-w-[820px]">
            Vi måler ikke antal transporter. Vi måler <span className="text-[#174F46] italic font-normal">de muligheder, der opstår.</span>
          </H2>
        </Reveal>
        <div className="mt-14 grid lg:grid-cols-[1fr_1.2fr] gap-6"
          onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
          <div className="flex flex-col">
            {transforms.map((t, n) => (
              <button key={t.from} onClick={() => setI(n)} aria-pressed={n === i}
                className={`text-left flex items-center justify-between py-5 border-b border-[#202923]/10 transition-all duration-300 ${n === i ? "text-[#174F46] pl-4" : "text-[#202923]/60 hover:text-[#202923]"}`}>
                <span className="text-xl lg:text-2xl font-semibold tracking-tight">{t.from}</span>
                <ArrowRight size={20} className={`transition-all ${n === i ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-3"}`} />
              </button>
            ))}
          </div>
          <div key={i} aria-live="polite" className="drg-rise relative bg-[#174F46] text-white p-8 lg:p-14 min-h-[340px] flex flex-col justify-between overflow-hidden">
            <Icon size={180} strokeWidth={0.6} aria-hidden className="absolute -right-8 -bottom-8 text-white/10" />
            <Icon className="text-[#F0A176]" size={36} aria-hidden />
            <div className="relative">
              <div className="text-white/70 text-sm">{cur.from}</div>
              <div className="font-display text-3xl lg:text-5xl font-semibold tracking-[-1px] mt-2 italic text-[#F0A176]">{cur.to}.</div>
              <p className="text-white/80 leading-7 mt-5 max-w-[460px] text-sm">{cur.text}</p>
            </div>
            <div className="relative flex gap-2 mt-8" aria-hidden>
              {transforms.map((_, n) => <span key={n} className={`h-1 rounded-full transition-all duration-500 ${n === i ? "w-10 bg-[#E77B45]" : "w-4 bg-white/25"}`} />)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="scroll-mt-16 bg-[#EEECE4] py-24 lg:py-32 px-6 lg:px-12">
      <div className="max-w-[1280px] mx-auto grid lg:grid-cols-2 gap-16 items-center">
        <Reveal className="relative mb-6 lg:mb-0">
          <Img src={img.warehouse} alt="Lager i Nødhjælpsdepotet" className="w-full h-[380px] lg:h-[560px] object-cover" />
          <div className="absolute -bottom-6 right-0 lg:-right-8 bg-[#B4521F] text-white p-6 lg:p-7 max-w-[240px]">
            <BadgeCheck size={32} className="mb-3" aria-hidden />
            <p className="text-lg font-semibold leading-snug">Det eneste tilbageværende Globus-værksted i Danmark.</p>
          </div>
        </Reveal>
        <Reveal delay={150}>
          <Eyebrow>Om Danish Relief Group</Eyebrow>
          <H2>Fra nødhjælp til <span className="text-[#174F46] italic font-normal">partnerorganisation.</span></H2>
          <p className="text-[#4F5851] leading-8 mt-7 text-base max-w-[560px]">
            DRG er en international partnerorganisation, der forbinder overskudsressourcer i Danmark med dokumenterede behov hos lokale organisationer.
          </p>
          <div className="mt-10 grid sm:grid-cols-2 gap-4">
            <div className="border border-[#202923]/20 p-6">
              <div className="text-sm text-[#5E665F] font-semibold">Før</div>
              <div className="font-semibold text-lg mt-2">Logistikorganisation</div>
              <p className="text-sm text-[#5E665F] mt-2 leading-6">Fokus på at sende udstyr afsted.</p>
            </div>
            <div className="bg-[#174F46] text-white p-6">
              <div className="text-sm text-[#F0A176] font-semibold">Nu</div>
              <div className="font-semibold text-lg mt-2">Partnerorganisation</div>
              <p className="text-sm text-white/80 mt-2 leading-6">Ressourcer, relationer og partnerskaber der skaber varig lokal værdi.</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Areas() {
  return (
    <section id="areas" className="scroll-mt-16 py-24 lg:py-32 px-6 lg:px-12">
      <div className="max-w-[1280px] mx-auto">
        <Reveal className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-14">
          <div>
            <Eyebrow>Projektområder</Eyebrow>
            <H2>Fra genbrug <span className="italic text-[#174F46] font-normal">til udvikling.</span></H2>
          </div>
          <p className="text-[#4F5851] text-sm leading-7 max-w-[380px]">Seks områder, hvor udstyr bliver til uddannelse, sundhed, arbejde og fællesskab.</p>
        </Reveal>
        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[#202923]/10 border border-[#202923]/10">
          {areas.map((a, n) => {
            const Icon = a.icon;
            return (
              <Reveal key={a.title} delay={n * 70} className="bg-[#F7F5EF]">
                <li className="group p-8 lg:p-10 h-full list-none transition-colors duration-500 hover:bg-[#174F46] hover:text-white">
                  <Icon size={34} aria-hidden className="text-[#C8561F] group-hover:text-[#F0A176] transition-colors" />
                  <h3 className="font-display text-2xl font-semibold mt-12">{a.title}</h3>
                  <p className="text-sm leading-7 mt-3 text-[#5E665F] group-hover:text-white/80 transition-colors">{a.text}</p>
                </li>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

function Process() {
  const [ref, seen] = useInView(0.3);
  return (
    <section id="process" className="scroll-mt-16 bg-[#102E29] text-white py-24 lg:py-32 px-6 lg:px-12">
      <div className="max-w-[1280px] mx-auto" ref={ref}>
        <Reveal className="max-w-[640px]">
          <Eyebrow light>Sådan arbejder vi</Eyebrow>
          <H2>Fra donation til <span className="italic font-normal text-[#F0A176]">lokal kapacitet.</span></H2>
        </Reveal>
        <ol className="relative mt-20 grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="hidden lg:block absolute top-[27px] left-0 right-0 h-px bg-white/15" aria-hidden>
            <div className="h-full bg-[#E77B45] transition-all duration-[2200ms] ease-out" style={{ width: seen ? "100%" : "0%" }} />
          </div>
          {steps.map((s, n) => {
            const Icon = s.icon;
            return (
              <Reveal key={s.title} delay={n * 200}>
                <li className="list-none">
                  <div className="relative w-14 h-14 rounded-full bg-[#102E29] border border-[#E77B45] flex items-center justify-center text-[#F0A176]"><Icon size={22} aria-hidden /></div>
                  <div className="text-[#F0A176] text-sm font-semibold mt-6">Trin {n + 1}</div>
                  <h3 className="font-display text-2xl font-semibold mt-2">{s.title}</h3>
                  <p className="text-white/75 text-sm leading-7 mt-3">{s.text}</p>
                </li>
              </Reveal>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

function Partners() {
  return (
    <section id="partners" className="scroll-mt-16 py-24 lg:py-32 px-6 lg:px-12">
      <div className="max-w-[1280px] mx-auto">
        <Reveal className="max-w-[720px]">
          <Eyebrow>Samarbejdspartnere</Eyebrow>
          <H2>Sammen kan vi skabe <span className="italic text-[#174F46] font-normal">mere værdi.</span></H2>
        </Reveal>
        <div className="grid lg:grid-cols-3 gap-5 mt-14">
          {partners.map((p, n) => {
            const Icon = p.icon;
            return (
              <Reveal key={p.title} delay={n * 120}>
                <div className="h-full border border-[#202923]/20 p-8 hover:-translate-y-2 hover:border-[#E77B45] transition-all duration-500 motion-reduce:hover:translate-y-0">
                  <Icon className="text-[#C8561F]" size={30} aria-hidden />
                  <h3 className="font-display text-xl font-semibold mt-8">{p.title}</h3>
                  <p className="text-sm text-[#5E665F] leading-7 mt-3">{p.text}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
        <Reveal className="mt-8">
          <div className="grid lg:grid-cols-[1fr_1.1fr] bg-[#174F46] text-white overflow-hidden">
            <Img src={img.school} alt="Skoleudstyr til internationale projekter" className="w-full h-64 lg:h-full object-cover" />
            <div className="p-8 lg:p-14">
              <Eyebrow light>For projektpartnere i det globale syd</Eyebrow>
              <h3 className="font-display text-3xl lg:text-4xl font-semibold tracking-[-1px] mt-5">Har jeres projekt behov for udstyr?</h3>
              <p className="text-white/80 text-sm leading-7 mt-5">
                Vi leverer kvalitetsudstyr til skoler, hospitaler og plejehjem. DRG undersøger gerne mulighederne, forudsat at shipping og transport finansieres af projektet eller en samarbejdspartner.
              </p>
              <a href={`mailto:${MAIL}?subject=Udstyrsbehov`} className="inline-flex items-center gap-2 mt-8 bg-[#C8561F] px-7 py-4 rounded-full text-sm font-bold hover:bg-white hover:text-[#174F46] transition">
                Beskriv jeres behov <ArrowUpRight size={17} />
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Trust() {
  return (
    <section className="py-20 px-6 lg:px-12 overflow-hidden">
      <div className="max-w-[1280px] mx-auto">
        <Reveal className="grid lg:grid-cols-[1fr_2fr] gap-10 items-center">
          <div>
            <Eyebrow>Tillid & støtte</Eyebrow>
            <p className="text-sm text-[#5E665F] leading-7 mt-5">Medlem af CISU – Civilsamfund i Udvikling. Støttet af Globus Puljen til værksted og internationale humanitære projekter. CVR 27384870.</p>
          </div>
          <div className="group relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
            <ul className="drg-marquee flex gap-12 w-max group-hover:[animation-play-state:paused]" aria-label="Samarbejdspartnere og støtter">
              {[...sponsors, ...sponsors].map((s, n) => (
                <li key={n} aria-hidden={n >= sponsors.length} className="list-none whitespace-nowrap text-lg font-semibold text-[#202923]/65">{s}</li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="scroll-mt-16 px-6 lg:px-12 pb-24">
      <Reveal>
        <div className="max-w-[1280px] mx-auto relative bg-[#174F46] text-white p-8 lg:p-16 grid lg:grid-cols-2 gap-12 items-center overflow-hidden">
          <Img src={img.community} className="absolute inset-0 w-full h-full object-cover opacity-10" />
          <div className="relative">
            <Eyebrow light>Lad os samarbejde</Eyebrow>
            <H2>Har du en idé til <span className="italic font-normal text-[#F0A176]">et samarbejde?</span></H2>
            <a href={`mailto:${MAIL}`} className="inline-flex items-center gap-2 bg-[#C8561F] px-7 py-4 rounded-full mt-9 text-sm font-bold hover:bg-white hover:text-[#174F46] transition">Kontakt DRG <ArrowUpRight size={17} /></a>
          </div>
          <div className="relative space-y-7">
            <div className="flex gap-5"><Mail className="text-[#F0A176] shrink-0" size={23} aria-hidden /><div><div className="text-sm text-white/70 mb-1">E-mail</div><a href={`mailto:${MAIL}`} className="font-semibold break-all underline-offset-4 hover:underline">{MAIL}</a></div></div>
            <div className="flex gap-5"><MapPin className="text-[#F0A176] shrink-0" size={23} aria-hidden /><div><div className="text-sm text-white/70 mb-1">Adresse</div><p className="font-semibold">Herlufmagle, Danmark</p></div></div>
            <div className="flex gap-5"><Handshake className="text-[#F0A176] shrink-0" size={23} aria-hidden /><p className="text-sm text-white/80 leading-7">Virksomheder, kommuner, fonde, skoler, sportsklubber og andre organisationer er velkomne.</p></div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-[#102E29] text-white px-6 lg:px-12 py-12">
      <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row justify-between gap-8">
        <div>
          <div className="font-black tracking-tight">DANISH RELIEF GROUP</div>
          <p className="text-white/70 text-sm mt-3 max-w-[340px] leading-6">Nødhjælpsdepotet · CVR 27384870 · Overskudsressourcer, lokale behov, internationale partnerskaber.</p>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/80 md:max-w-[300px]">
          {LINKS.map(([l, id]) => <a key={id} href={`#${id}`} className="hover:text-[#F0A176] transition">{l}</a>)}
        </nav>
        <div className="flex gap-3 items-start">
          <a href="https://www.facebook.com/DRGLCS" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-10 h-10 rounded-full border border-white/25 flex items-center justify-center hover:bg-[#E77B45] hover:border-[#E77B45] transition"><FaFacebookF size={18} /></a>
          <a href="https://www.youtube.com/@mohamedbelhaiba5629" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="w-10 h-10 rounded-full border border-white/25 flex items-center justify-center hover:bg-[#E77B45] hover:border-[#E77B45] transition"><FaYoutube size={18} /></a>
        </div>
      </div>
      <p className="max-w-[1280px] mx-auto text-xs text-white/60 mt-10">© {new Date().getFullYear()} Danish Relief Group. Alle rettigheder forbeholdes.</p>
    </footer>
  );
}

function ToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const on = () => setShow(window.scrollY > 900);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <a href="#home" aria-label="Til toppen" tabIndex={show ? 0 : -1}
      className={`fixed bottom-5 right-5 z-40 w-12 h-12 rounded-full bg-[#174F46] text-white flex items-center justify-center shadow-lg transition-all duration-300 hover:bg-[#C8561F] ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}>
      <ChevronUp size={22} />
    </a>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-[#F7F5EF] text-[#202923] font-body antialiased selection:bg-[#E77B45] selection:text-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600&family=Inter:wght@400;500;600;700;900&display=swap');
        html{scroll-behavior:smooth}
        .font-body{font-family:Inter,system-ui,sans-serif}
        .font-display{font-family:Fraunces,Georgia,serif}
        a:focus-visible,button:focus-visible{outline:3px solid #E77B45;outline-offset:3px}
        @keyframes drgRise{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:none}}
        @keyframes drgZoom{from{transform:scale(1)}to{transform:scale(1.12)}}
        @keyframes drgMarquee{to{transform:translateX(-50%)}}
        .drg-rise{animation:drgRise .9s cubic-bezier(.2,.7,.2,1) both}
        .drg-zoom{animation:drgZoom 22s ease-out both}
        .drg-marquee{animation:drgMarquee 40s linear infinite}
        @media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}.drg-rise,.drg-zoom,.drg-marquee{animation:none}}
      `}</style>
      <a href="#impact" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:bg-white focus:text-[#174F46] focus:px-4 focus:py-2 focus:rounded-full">
        Gå til indhold
      </a>
      <Header />
      <main>
        <Hero />
        <Impact />
        <About />
        <Areas />
        <Process />
        <Partners />
        <Trust />
        <Contact />
      </main>
      <Footer />
      <ToTop />
    </div>
  );
}