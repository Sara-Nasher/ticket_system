import React, { useState, useRef } from 'react';
import {
  CustomerServiceOutlined,
  LineChartOutlined,
  SafetyOutlined,
  TeamOutlined,
  CloudOutlined,
  ApiOutlined,
  ThunderboltOutlined,
  TrophyOutlined,
  CalendarOutlined,
  StarOutlined,
  FireOutlined,
  CrownOutlined,
  RocketOutlined,
  ArrowRightOutlined,
  GlobalOutlined,
  RightOutlined,
  ArrowUpOutlined,
} from '@ant-design/icons';
import { AreaChart, Area } from 'recharts';
import { ResponsiveContainer } from 'recharts';
import { useApp } from '../context/AppContext';
import { Btn, GBtn, Logo } from '../components/Layouts';
import { TICKETS, C_TREND } from '../data/mockData';

const Landing: React.FC = () => {
  const { i, lang, setLang, navigate, isRTL } = useApp();
  const [faq, setFaq] = useState<number | null>(null);
  const ff = "var(--av-font-display)";
  const body = "var(--av-font-body)";

  const featuresRef = useRef<HTMLDivElement>(null);
  const howRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);
  const faqRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref.current) {
      const yOffset = -80;
      const y = ref.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const feats = [
    { icon: <CustomerServiceOutlined />, t: i.f1t, d: i.f1d, c: "#3b82f6" },
    { icon: <LineChartOutlined />, t: i.f2t, d: i.f2d, c: "#14b8a6" },
    { icon: <SafetyOutlined />, t: i.f3t, d: i.f3d, c: "#d97706" },
    { icon: <TeamOutlined />, t: i.f4t, d: i.f4d, c: "#8b5cf6" },
    { icon: <CloudOutlined />, t: i.f5t, d: i.f5d, c: "#10b981" },
    { icon: <ApiOutlined />, t: i.f6t, d: i.f6d, c: "#f472b6" },
  ];

  const faqs = [
    { q: i.q1, a: i.a1 },
    { q: i.q2, a: i.a2 },
    { q: i.q3, a: i.a3 },
    { q: i.q4, a: i.a4 },
    { q: i.q5, a: i.a5 },
  ];

  const tess = [
    { q: i.tq1, n: i.tn1, r: i.tr1, a: "P", c: "hsl(210,70%,50%)" },
    { q: i.tq2, n: i.tn2, r: i.tr2, a: "M", c: "hsl(250,65%,55%)" },
    { q: i.tq3, n: i.tn3, r: i.tr3, a: "L", c: "hsl(180,65%,40%)" },
  ];

  return (
    <div style={{ background: "var(--av-bg)", minHeight: "100vh", color: "var(--av-text)", fontFamily: body, direction: isRTL ? "rtl" : "ltr" }}>
      {/* Nav */}
      <nav
        style={{
          position: "fixed",
          inset: "0 0 auto",
          zIndex: 100,
          height: 60,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 40px",
          background: "var(--av-nav)",
          backdropFilter: "blur(24px)",
          borderBottom: "1px solid var(--av-border2)",
        }}
      >
        <div onClick={() => navigate("landing")} style={{ cursor: "pointer" }}>
          <Logo size={28} isRTL={isRTL} />
        </div>
        <div style={{ display: "flex", gap: 28, alignItems: "center" }}>
          {([
            { key: "features", label: i.nav.features, ref: featuresRef },
            { key: "how", label: i.nav.how, ref: howRef },
            { key: "testimonials", label: i.nav.testimonials || "Testimonials", ref: testimonialsRef },
            { key: "faq", label: i.nav.faq || "FAQ", ref: faqRef },
          ]).map((item) => (
            <span
              key={item.key}
              onClick={() => {
                if (item.ref) {
                  scrollToSection(item.ref);
                }
              }}
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "var(--av-text3)",
                cursor: "pointer",
                transition: ".2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#93c5fd")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--av-text3)")}
            >
              {item.label}
            </span>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button
            onClick={() => setLang(lang === "en" ? "fa" : "en")}
            style={{
              background: "var(--av-border2)",
              border: "1px solid rgba(255,255,255,.08)",
              color: "var(--av-text3)",
              borderRadius: 8,
              padding: "5px 12px",
              cursor: "pointer",
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            <GlobalOutlined style={{ marginRight: 5 }} />
            {lang === "en" ? "فارسی" : "English"}
          </button>
          <button
            onClick={() => navigate("login")}
            style={{
              background: "none",
              border: "none",
              color: "var(--av-text2)",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              padding: "5px 12px",
            }}
          >
            {i.nav.login}
          </button>
          <Btn sz="sm" onClick={() => navigate("login")}>
            {i.nav.signup}
          </Btn>
          <button
            onClick={() => navigate("login")}
            style={{
              background: "rgba(217,119,6,.08)",
              border: "1px solid rgba(217,119,6,.2)",
              color: "#fcd34d",
              borderRadius: 8,
              padding: "5px 11px",
              cursor: "pointer",
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            <CrownOutlined style={{ marginRight: 4 }} />
            {i.adminPortalBtn}
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
          paddingTop: 60,
        }}
      >
        <div className="av-orb-1" />
        <div className="av-orb-2" />
        <div className="av-orb-3" />
        <div className="av-grid" style={{ position: "absolute", inset: 0, opacity: 0.5 }} />
        <div
          style={{
            position: "relative",
            zIndex: 2,
            maxWidth: 1080,
            width: "100%",
            padding: "60px 40px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 64,
            alignItems: "center",
          }}
        >
          {/* Copy */}
          <div>
            <div
              className="av-u0"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "rgba(59,130,246,.1)",
                border: "1px solid rgba(59,130,246,.25)",
                borderRadius: 100,
                padding: "5px 14px",
                marginBottom: 28,
                fontSize: 12,
                color: "#93c5fd",
                fontWeight: 700,
                letterSpacing: ".04em",
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#3b82f6",
                  boxShadow: "0 0 8px #3b82f6",
                  display: "inline-block",
                }}
              />
              {i.heroChip}
            </div>
            <h1
              className="av-u1"
              style={{
                fontSize: "clamp(36px,5vw,62px)",
                fontWeight: 900,
                lineHeight: 1.05,
                margin: "0 0 20px",
                fontFamily: ff,
                letterSpacing: "-0.035em",
              }}
            >
              <span style={{ color: "var(--av-text)" }}>{i.h1a}</span>
              <br />
              <span className="av-grad-text">{i.h1b}</span>
            </h1>
            <p
              className="av-u2"
              style={{
                fontSize: 17,
                color: "var(--av-text3)",
                lineHeight: 1.75,
                marginBottom: 36,
                maxWidth: 480,
              }}
            >
              {i.heroSub}
            </p>
            <div className="av-u3" style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Btn sz="lg" onClick={() => navigate("login")} icon={<RocketOutlined />}>
                {i.getStarted}
              </Btn>
              <GBtn sz="lg" onClick={() => navigate("login")}>
                {i.watchDemo} <ArrowRightOutlined />
              </GBtn>
            </div>
            <div className="av-u4" style={{ display: "flex", gap: 16, marginTop: 40, alignItems: "center" }}>
              <div style={{ display: "flex" }}>
                {["P", "K", "L", "A", "N"].map((a, idx) => (
                  <div
                    key={idx}
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      background: `hsl(${idx * 55 + 200},65%,50%)`,
                      border: "2px solid var(--av-bg)",
                      marginLeft: idx > 0 ? -9 : 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 10,
                      fontWeight: 800,
                      color: "#fff",
                    }}
                  >
                    {a}
                  </div>
                ))}
              </div>
              <span style={{ fontSize: 12, color: "var(--av-text3)" }}>
                <span style={{ fontWeight: 700, color: "var(--av-text)" }}>18,400+</span> {i.teamsUsing}
              </span>
            </div>
          </div>
          {/* Dashboard mockup */}
          <div className="av-u5 av-float" style={{ position: "relative" }}>
            <div
              style={{
                background: "var(--av-surface2)",
                backdropFilter: "blur(28px)",
                border: "1px solid rgba(59,130,246,.2)",
                borderRadius: 20,
                overflow: "hidden",
                boxShadow: "0 40px 120px rgba(0,0,0,.6),0 0 60px rgba(59,130,246,.1)",
              }}
            >
              {/* Titlebar */}
              <div
                style={{
                  height: 38,
                  background: "var(--av-surface3)",
                  borderBottom: "1px solid var(--av-border2)",
                  display: "flex",
                  alignItems: "center",
                  padding: "0 14px",
                  gap: 6,
                }}
              >
                {["#ef4444", "#fbbf24", "#10b981"].map((c, i) => (
                  <div
                    key={i}
                    style={{
                      width: 9,
                      height: 9,
                      borderRadius: "50%",
                      background: c,
                      opacity: 0.75,
                    }}
                  />
                ))}
                <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
                  <div
                    style={{
                      background: "var(--av-border2)",
                      borderRadius: 5,
                      padding: "2px 20px",
                      fontSize: 11,
                      color: "var(--av-text4)",
                    }}
                  >
                    app.avesta.io/dashboard
                  </div>
                </div>
              </div>
              <div style={{ position: "relative", height: 3, overflow: "hidden" }}>
                <div className="av-scan" />
              </div>
              <div style={{ padding: 18 }}>
                {/* Mini stats */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3,1fr)",
                    gap: 9,
                    marginBottom: 14,
                  }}
                >
                  {[
                    { l: "Open", v: "87", c: "#3b82f6" },
                    { l: "Resolved", v: "1,053", c: "#10b981" },
                    { l: "CSAT", v: "98%", c: "#d97706" },
                  ].map((s, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: `${s.c}0f`,
                        border: `1px solid ${s.c}22`,
                        borderRadius: 10,
                        padding: "9px 10px",
                        textAlign: "center",
                      }}
                    >
                      <div
                        style={{
                          fontSize: 17,
                          fontWeight: 800,
                          color: s.c,
                          fontFamily: "var(--av-font-display)",
                        }}
                      >
                        {s.v}
                      </div>
                      <div style={{ fontSize: 9, color: "var(--av-text3)", marginTop: 2, fontWeight: 600 }}>
                        {s.l}
                      </div>
                    </div>
                  ))}
                </div>
                {/* Mini chart */}
                <div style={{ height: 80, marginBottom: 13 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={C_TREND} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
                      <defs>
                        <linearGradient id="hg" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.32} />
                          <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <Area type="monotone" dataKey="res" stroke="#3b82f6" strokeWidth={2} fill="url(#hg)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                {/* Mini table */}
                {TICKETS.slice(0, 2).map((t, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "6px 0",
                      borderBottom: "1px solid var(--av-border2)",
                      fontSize: 11,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--av-font-mono)",
                        color: "#3b82f6",
                        background: "rgba(59,130,246,.1)",
                        padding: "1px 6px",
                        borderRadius: 4,
                        fontSize: 10,
                      }}
                    >
                      {t.id}
                    </span>
                    <span
                      style={{
                        flex: 1,
                        color: "var(--av-text2)",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {t.subject}
                    </span>
                    <span
                      style={{
                        color: t.priority === "urgent" ? "#ef4444" : "#f59e0b",
                        fontWeight: 800,
                        fontSize: 9,
                      }}
                    >
                      {t.priority.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            {/* Float cards */}
            <div
              className="av-float2"
              style={{
                position: "absolute",
                top: -24,
                right: -28,
                background: "var(--av-surface3)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(20,184,166,.25)",
                borderRadius: 14,
                padding: "12px 16px",
                boxShadow: "0 20px 50px rgba(0,0,0,.4)",
              }}
            >
              <div
                style={{
                  fontSize: 9.5,
                  color: "var(--av-text3)",
                  fontWeight: 700,
                  marginBottom: 4,
                  letterSpacing: ".08em",
                }}
              >
                CSAT RATE
              </div>
              <div
                style={{
                  fontSize: 24,
                  fontWeight: 900,
                  color: "#34d399",
                  fontFamily: "var(--av-font-display)",
                }}
              >
                98.2%
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 4 }}>
                <ArrowUpOutlined style={{ color: "#34d399", fontSize: 10 }} />
                <span style={{ color: "#34d399", fontSize: 10, fontWeight: 700 }}>
                  +3.1% vs last month
                </span>
              </div>
            </div>
            <div
              className="av-float3"
              style={{
                position: "absolute",
                bottom: -18,
                left: -24,
                background: "var(--av-surface3)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(217,119,6,.25)",
                borderRadius: 14,
                padding: "11px 15px",
                boxShadow: "0 20px 50px rgba(0,0,0,.4)",
              }}
            >
              <div
                style={{
                  fontSize: 9.5,
                  color: "var(--av-text3)",
                  fontWeight: 700,
                  marginBottom: 4,
                  letterSpacing: ".08em",
                }}
              >
                AVG RESPONSE
              </div>
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 900,
                  color: "#fbbf24",
                  fontFamily: "var(--av-font-display)",
                }}
              >
                1.4 hrs
              </div>
              <div style={{ fontSize: 9, color: "var(--av-text4)", marginTop: 2 }}>SLA target: 4 hrs ✓</div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <div
        style={{
          padding: "24px 40px",
          borderTop: "1px solid var(--av-border2)",
          borderBottom: "1px solid var(--av-border2)",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: 10.5,
            color: "var(--av-text4)",
            fontWeight: 700,
            letterSpacing: ".12em",
            textTransform: "uppercase",
            marginBottom: 18,
          }}
        >
          {i.trustedBy}
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 48, flexWrap: "wrap" }}>
          {["Digirama", "Nexvault", "Meridian", "Orbstack", "Qubix", "Aethon"].map((n, idx) => (
            <span
              key={idx}
              style={{
                fontSize: 14,
                fontWeight: 800,
                color: "var(--av-text4)",
                letterSpacing: "-0.02em",
                fontFamily: ff,
              }}
            >
              {n}
            </span>
          ))}
        </div>
      </div>

      {/* Features */}
      <section
        id="features"
        ref={featuresRef}
        style={{ padding: "100px 40px", scrollMarginTop: "80px" }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                background: "rgba(59,130,246,.08)",
                border: "1px solid rgba(59,130,246,.2)",
                borderRadius: 100,
                padding: "5px 14px",
                marginBottom: 18,
                fontSize: 11,
                color: "#60a5fa",
                fontWeight: 700,
                letterSpacing: ".06em",
                textTransform: "uppercase",
              }}
            >
              <ThunderboltOutlined />
              {i.featTag}
            </div>
            <h2
              style={{
                fontSize: "clamp(28px,4vw,48px)",
                fontWeight: 900,
                color: "var(--av-text)",
                margin: "0 0 14px",
                fontFamily: ff,
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
              }}
            >
              {i.featTitle}
              <br />
              <span className="av-blue-text">{i.featAcc}</span>
            </h2>
            <p style={{ color: "var(--av-text3)", fontSize: 16, maxWidth: 500, margin: "0 auto" }}>
              {i.featSub}
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 18 }}>
            {feats.map((f, idx) => (
              <div key={idx} className="av-feat">
                <div
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 14,
                    background: `${f.c}14`,
                    border: `1px solid ${f.c}22`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 22,
                    color: f.c,
                    marginBottom: 18,
                    boxShadow: `0 0 20px ${f.c}12`,
                  }}
                >
                  {f.icon}
                </div>
                <h3
                  style={{
                    fontSize: 16,
                    fontWeight: 800,
                    color: "var(--av-text)",
                    marginBottom: 8,
                    fontFamily: ff,
                  }}
                >
                  {f.t}
                </h3>
                <p style={{ fontSize: 13.5, color: "var(--av-text3)", lineHeight: 1.65, margin: 0 }}>{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section
        id="stats"
        style={{ padding: "80px 40px", position: "relative", overflow: "hidden" }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(ellipse 80% 60% at 50% 50%,rgba(59,130,246,.06),transparent)",
          }}
        />
        <div style={{ maxWidth: 880, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                background: "rgba(59,130,246,.08)",
                border: "1px solid rgba(59,130,246,.2)",
                borderRadius: 100,
                padding: "5px 14px",
                fontSize: 11,
                color: "#60a5fa",
                fontWeight: 700,
                letterSpacing: ".06em",
                textTransform: "uppercase",
              }}
            >
              <TrophyOutlined />
              {i.statsTag}
            </div>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
              gap: 32,
              textAlign: "center",
              position: "relative",
            }}
          >
            {[
              { v: i.s1v, l: i.s1l, c: "#3b82f6" },
              { v: i.s2v, l: i.s2l, c: "#14b8a6" },
              { v: i.s3v, l: i.s3l, c: "#10b981" },
              { v: i.s4v, l: i.s4l, c: "#d97706" },
            ].map((s, idx) => (
              <div key={idx}>
                <div
                  style={{
                    fontSize: "clamp(30px,4vw,52px)",
                    fontWeight: 900,
                    fontFamily: ff,
                    color: s.c,
                    textShadow: `0 0 30px ${s.c}40`,
                    letterSpacing: "-0.03em",
                    whiteSpace: "nowrap",
                  }}
                >
                  {s.v}
                </div>
                <div style={{ color: "var(--av-text3)", fontSize: 13, fontWeight: 500, marginTop: 8 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section
        id="how"
        ref={howRef}
        style={{ padding: "100px 40px", scrollMarginTop: "80px" }}
      >
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                background: "rgba(20,184,166,.08)",
                border: "1px solid rgba(20,184,166,.2)",
                borderRadius: 100,
                padding: "5px 14px",
                marginBottom: 18,
                fontSize: 11,
                color: "#2dd4bf",
                fontWeight: 700,
                letterSpacing: ".06em",
                textTransform: "uppercase",
              }}
            >
              <CalendarOutlined />
              {i.howTag}
            </div>
            <h2
              style={{
                fontSize: "clamp(28px,4vw,46px)",
                fontWeight: 900,
                color: "var(--av-text)",
                margin: 0,
                fontFamily: ff,
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
              }}
            >
              {i.howT}
              <br />
              <span className="av-blue-text">{i.howAcc}</span>
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 20 }}>
            {[
              { n: "01", t: i.st1, d: i.st1d, c: "#3b82f6" },
              { n: "02", t: i.st2, d: i.st2d, c: "#14b8a6" },
              { n: "03", t: i.st3, d: i.st3d, c: "#d97706" },
            ].map((s, idx) => (
              <div
                key={idx}
                style={{
                  padding: 28,
                  background: "var(--av-surface)",
                  border: "1px solid rgba(255,255,255,.06)",
                  borderRadius: 18,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 16,
                    right: 16,
                    fontSize: 44,
                    fontWeight: 900,
                    color: `${s.c}10`,
                    fontFamily: ff,
                    lineHeight: 1,
                  }}
                >
                  {s.n}
                </div>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 11,
                    background: `${s.c}15`,
                    border: `1px solid ${s.c}22`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: s.c,
                    fontWeight: 800,
                    fontSize: 13,
                    marginBottom: 18,
                    fontFamily: ff,
                  }}
                >
                  {s.n}
                </div>
                <h3
                  style={{
                    fontSize: 15,
                    fontWeight: 800,
                    color: "var(--av-text)",
                    marginBottom: 8,
                    fontFamily: ff,
                  }}
                >
                  {s.t}
                </h3>
                <p style={{ fontSize: 13.5, color: "var(--av-text3)", lineHeight: 1.65, margin: 0 }}>{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section
        id="testimonials"
        ref={testimonialsRef}
        style={{ padding: "100px 40px", scrollMarginTop: "80px" }}
      >
        <div style={{ maxWidth: 1060, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                background: "rgba(139,92,246,.08)",
                border: "1px solid rgba(139,92,246,.2)",
                borderRadius: 100,
                padding: "5px 14px",
                marginBottom: 18,
                fontSize: 11,
                color: "#c4b5fd",
                fontWeight: 700,
                letterSpacing: ".06em",
                textTransform: "uppercase",
              }}
            >
              <StarOutlined />
              {i.tesTag}
            </div>
            <h2
              style={{
                fontSize: "clamp(26px,3.5vw,42px)",
                fontWeight: 900,
                color: "var(--av-text)",
                margin: 0,
                fontFamily: ff,
                letterSpacing: "-0.02em",
              }}
            >
              {i.tesT}
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(290px,1fr))", gap: 18 }}>
            {tess.map((t, idx) => (
              <div
                key={idx}
                style={{
                  background: "var(--av-surface)",
                  border: "1px solid var(--av-border)",
                  borderRadius: 20,
                  padding: 26,
                  transition: "all .3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "rgba(59,130,246,.25)";
                  e.currentTarget.style.transform = "translateY(-4px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--av-border)";
                  e.currentTarget.style.transform = "";
                }}
              >
                <div style={{ display: "flex", gap: 2, marginBottom: 14 }}>
                  {[...Array(5)].map((_, i) => (
                    <StarOutlined key={i} style={{ color: "#d97706", fontSize: 12 }} />
                  ))}
                </div>
                <p style={{ fontSize: 14.5, color: "var(--av-text2)", lineHeight: 1.75, marginBottom: 20 }}>
                  "{t.q}"
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: "50%",
                      background: t.c,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 800,
                      color: "#fff",
                      fontSize: 15,
                      fontFamily: ff,
                    }}
                  >
                    {t.a}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: "var(--av-text)", fontFamily: ff }}>
                      {t.n}
                    </div>
                    <div style={{ fontSize: 11.5, color: "var(--av-text3)" }}>{t.r}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section
        id="faq"
        ref={faqRef}
        style={{ padding: "80px 40px", scrollMarginTop: "80px" }}
      >
        <div style={{ maxWidth: 660, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 46 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                background: "rgba(59,130,246,.08)",
                border: "1px solid rgba(59,130,246,.2)",
                borderRadius: 100,
                padding: "5px 14px",
                marginBottom: 18,
                fontSize: 11,
                color: "#60a5fa",
                fontWeight: 700,
                letterSpacing: ".06em",
                textTransform: "uppercase",
              }}
            >
              {i.faqTag}
            </div>
            <h2
              style={{
                fontSize: "clamp(24px,3.5vw,40px)",
                fontWeight: 900,
                color: "var(--av-text)",
                margin: 0,
                fontFamily: ff,
                letterSpacing: "-0.02em",
              }}
            >
              {i.faqT}
            </h2>
          </div>
          {faqs.map((f, idx) => (
            <div
              key={idx}
              onClick={() => setFaq(faq === idx ? null : idx)}
              style={{ borderBottom: "1px solid var(--av-border2)", padding: "18px 0", cursor: "pointer" }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: "var(--av-text)", fontFamily: ff }}>
                  {f.q}
                </span>
                <RightOutlined
                  style={{
                    color: "#3b82f6",
                    transform: faq === idx ? "rotate(90deg)" : "none",
                    transition: ".2s",
                    fontSize: 11,
                    flexShrink: 0,
                  }}
                />
              </div>
              {faq === idx && (
                <p style={{ fontSize: 13.5, color: "var(--av-text3)", margin: "10px 0 0", lineHeight: 1.7 }}>
                  {f.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "100px 40px", position: "relative", overflow: "hidden" }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(ellipse 70% 90% at 50% 50%,rgba(59,130,246,.07),transparent)",
          }}
        />
        <div className="av-dots" style={{ position: "absolute", inset: 0, opacity: 0.14 }} />
        <div style={{ maxWidth: 680, margin: "0 auto", textAlign: "center", position: "relative" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: "rgba(217,119,6,.08)",
              border: "1px solid rgba(217,119,6,.2)",
              borderRadius: 100,
              padding: "5px 14px",
              marginBottom: 26,
              fontSize: 11,
              color: "#fcd34d",
              fontWeight: 700,
              letterSpacing: ".06em",
              textTransform: "uppercase",
            }}
          >
            <FireOutlined />
            Limited early access open
          </div>
          <h2
            style={{
              fontSize: "clamp(28px,4.5vw,52px)",
              fontWeight: 900,
              color: "var(--av-text)",
              margin: "0 0 16px",
              fontFamily: ff,
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
            }}
          >
            {i.ctaT}
          </h2>
          <p style={{ color: "var(--av-text3)", fontSize: 16, marginBottom: 38 }}>{i.ctaSub}</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Btn sz="lg" onClick={() => navigate("login")} icon={<RocketOutlined />}>
              {i.ctaBtn}
            </Btn>
            <GBtn sz="lg" onClick={() => navigate("login")}>
              <CrownOutlined /> {i.adminPanel}
            </GBtn>
          </div>
        </div>
      </section>

      <footer
        style={{
          borderTop: "1px solid var(--av-border2)",
          padding: "22px 40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <Logo size={24} isRTL={isRTL} />
        <span style={{ color: "var(--av-text4)", fontSize: 12 }}>{i.footer}</span>
      </footer>
    </div>
  );
};

export default Landing;