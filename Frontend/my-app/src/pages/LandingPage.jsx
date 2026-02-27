import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import LandingPageImage from "../assets/ChatGPT Image Sep 1, 2025, 07_19_28 PM.png";
import LandingPageImage2 from "../assets/Gemini_Generated_Image_5zs6x95zs6x95zs6.png"
import LandingPageImage3 from "../assets/Gemini_Generated_Image_d5o3u1d5o3u1d5o3.png"
import LandingPageImage4 from "../assets/Gemini_Generated_Image_rnrobxrnrobxrnro.png"
import LeavesLogo from "../assets/icons/icons8-leaves (1).svg";


function LandingPage() {
  const blobWrap1Ref = useRef(null);
  const blobWrap2Ref = useRef(null);

  // Scroll-reveal
  useEffect(() => {
    const els = document.querySelectorAll("[data-reveal]");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    els.forEach((el) => {
      el.classList.add("reveal-init");
      io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  // Count-up animation
  useEffect(() => {
    const formatter = new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 });
    const els = document.querySelectorAll("[data-count-target]");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const target = parseInt(el.getAttribute("data-count-target") || "0", 10);
          const suffix = el.getAttribute("data-count-suffix") || "";
          const duration = 1200;
          const start = performance.now();
          const tick = (now) => {
            const p = Math.min((now - start) / duration, 1);
            const current = Math.floor(target * p);
            el.textContent = formatter.format(current) + suffix;
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          io.unobserve(el);
        });
      },
      { threshold: 0.3 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Tilt effect
  useEffect(() => {
    const cards = document.querySelectorAll("[data-tilt]");
    const handlers = [];
    cards.forEach((card) => {
      const onMove = (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        const rx = (0.5 - y) * 6;
        const ry = (x - 0.5) * 8;
        card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
      };
      const onLeave = () => {
        card.style.transform = "";
      };
      card.addEventListener("mousemove", onMove);
      card.addEventListener("mouseleave", onLeave);
      handlers.push({ card, onMove, onLeave });
    });
    return () => {
      handlers.forEach(({ card, onMove, onLeave }) => {
        card.removeEventListener("mousemove", onMove);
        card.removeEventListener("mouseleave", onLeave);
      });
    };
  }, []);

  // Magnetic hover for buttons
  useEffect(() => {
    const mags = document.querySelectorAll("[data-magnet]");
    const handlers = [];
    mags.forEach((el) => {
      const strength = parseFloat(el.getAttribute("data-magnet") || "10");
      const onMove = (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - (rect.left + rect.width / 2);
        const y = e.clientY - (rect.top + rect.height / 2);
        el.style.transform = `translate(${(x / rect.width) * strength}px, ${(y / rect.height) * strength}px)`;
      };
      const onLeave = () => {
        el.style.transform = "";
      };
      el.addEventListener("mousemove", onMove);
      el.addEventListener("mouseleave", onLeave);
      handlers.push({ el, onMove, onLeave });
    });
    return () => {
      handlers.forEach(({ el, onMove, onLeave }) => {
        el.removeEventListener("mousemove", onMove);
        el.removeEventListener("mouseleave", onLeave);
      });
    };
  }, []);

  // Mouse parallax for blobs
  const handleMouseMove = (e) => {
    const dx = (e.clientX / window.innerWidth - 0.5) * 2;
    const dy = (e.clientY / window.innerHeight - 0.5) * 2;
    if (blobWrap1Ref.current) {
      blobWrap1Ref.current.style.transform = `translate3d(${dx * 12}px, ${dy * 10}px, 0)`;
    }
    if (blobWrap2Ref.current) {
      blobWrap2Ref.current.style.transform = `translate3d(${dx * -16}px, ${dy * -14}px, 0)`;
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden" onMouseMove={handleMouseMove}>
      {/* Background Gradient */}
      <div className="absolute inset-0 -z-10">
        <div
            className="h-full w-full bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 bg-[length:200%_200%]"
          style={{ animation: "bgPan 18s linear infinite" }}
        />
      </div>

      {/* Decorative Blobs */}
      <div ref={blobWrap1Ref} className="pointer-events-none absolute -top-24 -left-20 w-80 h-80">
        <div className="w-full h-full bg-purple-500/30 rounded-full blur-3xl" style={{ animation: "blobFloat 18s ease-in-out infinite alternate" }} />
      </div>
      <div ref={blobWrap2Ref} className="pointer-events-none absolute -bottom-24 -right-24 w-[28rem] h-[28rem]">
        <div className="w-full h-full bg-indigo-500/30 rounded-full blur-3xl" style={{ animation: "blobFloat 22s ease-in-out infinite alternate", animationDelay: "1s" }} />
      </div>

      {/* Content */}
      <main className="relative z-10 mx-auto max-w-7xl px-6 sm:px-10 py-16 md:py-24">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <span className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 shadow flex items-center justify-center">
            <img src={LeavesLogo} alt="ImpactLog logo" className="h-6 w-6" />
          </span>
          <span className="text-xl font-bold tracking-tight text-white">ImpactLog</span>
        </div>

        {/* Hero */}
        <section className="mt-12 min-h-[60vh] grid place-items-center">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight text-white">
              Track Your Impact.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400" style={{ backgroundSize: "200% 200%", animation: "gradientShift 8s ease-in-out infinite" }}>
                Build a Better Tomorrow.
              </span>
            </h1>
            <p className="mt-6 text-lg text-gray-300 max-w-prose mx-auto" style={{ animation: "fadeUp .8s ease both", animationDelay: ".05s" }}>
              Connect citizens, NGOs, and governments on one platform. Join events, volunteer, and showcase your contributions with verified impact points.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 items-center justify-center" style={{ animation: "fadeUp .8s ease both", animationDelay: ".15s" }}>
              <Link
                to="/login"
                className="inline-flex justify-center items-center rounded-xl px-7 py-3 text-base font-semibold text-white bg-gradient-to-r from-purple-500 to-indigo-500 shadow-md hover:from-purple-600 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-purple-400 transition will-change-transform"
                data-magnet="10"
              >
                Log In
              </Link>
              <Link
                to="/signup"
                className="inline-flex justify-center items-center rounded-xl px-7 py-3 text-base font-semibold text-purple-300 border-2 border-purple-300/70 hover:bg-purple-900/20 transition will-change-transform"
                data-magnet="10"
              >
                Create Account
              </Link>
            </div>
          </div>
        </section>

        {/* Gallery */}
        <section className="mt-16 md:mt-24">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[LandingPageImage, LandingPageImage2, LandingPageImage3, LandingPageImage4].map((src, i) => (
                <div key={i} data-reveal data-tilt className="group rounded-2xl overflow-hidden ring-1 ring-white/10 bg-gray-800/70 backdrop-blur shadow-sm hover:shadow-md transition will-change-transform">
                  <img src={src} alt={`ImpactLog visual ${i+1}`} className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="mt-20 md:mt-28 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: "🌱", title: "Join community events", desc: "Discover local clean-ups, tree-planting, and civic activities tailored to your interests." },
            { icon: "✅", title: "Earn verified impact points", desc: "Showcase your contributions with badges and points verified by trusted partners." },
            { icon: "🤝", title: "Connect with NGOs & cities", desc: "Collaborate with organizations and local government to create lasting change." }
          ].map((f, i) => (
            <div key={i} data-reveal className="rounded-2xl bg-gray-800/80 backdrop-blur border border-gray-700/60 p-6 shadow-sm hover:shadow-md transition transform-gpu hover:-translate-y-1">
              <div className="h-12 w-12 rounded-xl bg-purple-900/50 text-purple-300 grid place-items-center text-xl font-bold">{f.icon}</div>
              <h3 className="mt-4 text-lg font-semibold text-white">{f.title}</h3>
              <p className="mt-2 text-gray-400">{f.desc}</p>
            </div>
          ))}
        </section>

        {/* Impact stats */}
        <section className="mt-16 md:mt-24 rounded-3xl bg-gray-800/60 backdrop-blur border border-gray-700/60 p-8 sm:p-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { label: "Active citizens", target: 25000, suffix: "+" },
              { label: "NGO partners", target: 1200, suffix: "+" },
              { label: "Verified events", target: 8400, suffix: "+" },
              { label: "Impact points issued", target: 3100000, suffix: "+" }
            ].map((s, i) => (
              <div key={i} data-reveal>
                <div className="text-3xl font-extrabold text-white" data-count-target={s.target} data-count-suffix={s.suffix}>0</div>
                <div className="mt-1 text-sm text-gray-400">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="mt-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-white text-center">How ImpactLog works</h2>
          <p className="text-gray-400 text-center mt-2 max-w-2xl mx-auto">Three simple steps to turn your actions into measurable change.</p>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {[
              { step: "Discover", desc: "Find nearby events and causes that match your interests." },
              { step: "Participate", desc: "Join activities, volunteer, and log your contributions." },
              { step: "Get verified", desc: "Earn points and badges verified by event organizers." }
            ].map((s, i) => (
              <div key={i} data-reveal className="rounded-2xl bg-gray-800/80 backdrop-blur border border-gray-700/60 p-6 shadow-sm hover:shadow-md transition transform-gpu hover:-translate-y-1">
                <div className="h-10 w-10 rounded-xl bg-purple-900/50 text-purple-300 grid place-items-center text-base font-bold">{i+1}</div>
                <h3 className="mt-3 font-semibold text-white">{s.step}</h3>
                <p className="mt-1 text-gray-400">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section className="mt-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-white text-center">What people say</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[
              { text: "“Our cleanup drew record volunteers thanks to ImpactLog.”", author: "Aisha, NGO Lead" },
              { text: "“I love tracking impact points—it keeps me motivated.”", author: "Ravi, Volunteer" },
              { text: "“Great bridge between citizens and our city programs.”", author: "City Coordinator" }
            ].map((t, i) => (
              <div key={i} data-reveal className="rounded-2xl bg-gray-800/80 backdrop-blur border border-gray-700/60 p-6 shadow-sm">
                <p className="text-gray-200">{t.text}</p>
                <div className="mt-4 text-sm text-gray-400">— {t.author}</div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Band */}
        <section className="mt-16 md:mt-24">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-500 to-indigo-500 p-8 sm:p-10">
            <div className="absolute -left-8 -top-8 h-32 w-32 rounded-full bg-white/20 blur-2xl" />
            <div className="relative z-10 grid gap-4 md:grid-cols-2 md:items-center">
              <div>
                <h3 className="text-2xl font-extrabold text-white">Ready to make your impact?</h3>
                <p className="text-gray-200 mt-1">Create an account in minutes and join upcoming events.</p>
              </div>
              <div className="flex gap-3 md:justify-end">
                <Link to="/signup" className="inline-flex justify-center items-center rounded-xl px-6 py-3 text-base font-semibold text-white bg-gray-900 hover:bg-gray-800 shadow will-change-transform" data-magnet="12">Get Started</Link>
                <Link to="/login" className="inline-flex justify-center items-center rounded-xl px-6 py-3 text-base font-semibold text-white bg-purple-600/70 hover:bg-purple-600 shadow will-change-transform" data-magnet="12">Log In</Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-24 md:mt-32 border-t border-gray-700/60 bg-gray-800/70 backdrop-blur">
        <div className="mx-auto max-w-7xl px-6 sm:px-10 py-12">
          <div className="flex items-center justify-center gap-3">
            <span className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 shadow flex items-center justify-center">
              <img src={LeavesLogo} alt="ImpactLog logo" className="h-6 w-6" />
            </span>
            <span className="text-lg font-semibold text-white">ImpactLog</span>
          </div>
          <nav className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-gray-400">
            <a href="#" className="hover:text-white">About</a>
            <a href="#" className="hover:text-white">Blog</a>
            <a href="#" className="hover:text-white">Privacy</a>
            <a href="#" className="hover:text-white">Terms</a>
            <a href="#" className="hover:text-white">Contact</a>
          </nav>
          <p className="mt-4 text-xs text-gray-500 text-center">© {new Date().getFullYear()} ImpactLog. All rights reserved.</p>
        </div>
      </footer>

      {/* Keyframes */}
      <style>{`
        @keyframes bgPan { 0% { background-position: 0% 0% } 50% { background-position: 100% 100% } 100% { background-position: 0% 0% } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(10px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes gradientShift { 0% { background-position: 0% 50% } 50% { background-position: 100% 50% } 100% { background-position: 0% 50% } }
        @keyframes blobFloat { 0% { transform: translateY(0) scale(1) } 50% { transform: translateY(-8px) scale(1.02) } 100% { transform: translateY(0) scale(1) } }
        .reveal-init { opacity: 0; transform: translateY(12px); }
        .revealed { opacity: 1; transform: translateY(0); transition: opacity .6s ease, transform .6s ease; }
        @media (prefers-reduced-motion: reduce) {
          [data-tilt], [data-magnet] { transform: none !important; }
          .reveal-init, .revealed { opacity: 1; transform: none; transition: none; }
        }
      `}</style>
    </div>
  );
}

export default LandingPage;