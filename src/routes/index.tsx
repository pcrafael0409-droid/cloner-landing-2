import { createFileRoute } from "@tanstack/react-router";
import {
  Eye,
  ShieldCheck,
  Lock,
  ArrowRight,
  Star,
  CheckCircle2,
  Clock,
  MessageCircle,
  Heart,
  AlertTriangle,
  ChevronDown,
  Smartphone,
  Zap,
  Users,
  BarChart3,
  Check,
  RefreshCw,
  X,
  ChevronRight,
  Activity,
  Search,
} from "lucide-react";
import { useState, useEffect } from "react";
import { WhatsappLogo, InstagramLogo } from "@phosphor-icons/react";

// ─────────────────────────────────────────────────────────────────────────────
// 👇 URL de checkout
// ─────────────────────────────────────────────────────────────────────────────
const CHECKOUT_URL = "https://pay.cakto.com.br/zv5heyg_994345";

// ─────────────────────────────────────────────────────────────────────────────
// FUNNEL TRACKING SYSTEM (Local Storage & Analytics Dispatcher)
// ─────────────────────────────────────────────────────────────────────────────
type FunnelStep =
  | "quiz_step_1"
  | "quiz_step_2"
  | "quiz_step_3"
  | "quiz_step_4"
  | "analyzing"
  | "landing_page"
  | "checkout_click";

function trackFunnelEvent(step: FunnelStep, extraData?: Record<string, any>) {
  if (typeof window === "undefined") return;

  try {
    // Save to LocalStorage stats counter for live dashboard
    const storageKey = "esplao_funnel_metrics_v1";
    const raw = localStorage.getItem(storageKey);
    const data = raw
      ? JSON.parse(raw)
      : {
          quiz_step_1: 0,
          quiz_step_2: 0,
          quiz_step_3: 0,
          quiz_step_4: 0,
          analyzing: 0,
          landing_page: 0,
          checkout_click: 0,
          history: [],
        };

    data[step] = (data[step] || 0) + 1;
    data.history.push({
      step,
      timestamp: new Date().toISOString(),
      extraData: extraData || null,
    });

    // Keep history clean (last 100 events)
    if (data.history.length > 100) {
      data.history = data.history.slice(-100);
    }

    localStorage.setItem(storageKey, JSON.stringify(data));

    // Optional: Dispatch to window analytics if Google Analytics or Pixel exists
    if ((window as any).gtag) {
      (window as any).gtag("event", step, {
        event_category: "quiz_funnel",
        ...extraData,
      });
    }
  } catch (err) {
    console.error("Tracking error:", err);
  }
}

function getFunnelMetrics() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("esplao_funnel_metrics_v1");
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

function clearFunnelMetrics() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("esplao_funnel_metrics_v1");
}

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CloneX — Teste de Compatibilidade & Monitoramento" },
      {
        name: "description",
        content:
          "Descubra em 2 minutos se sua parceira apresenta sinais de conversas ocultas no WhatsApp e Instagram. 100% anônimo e seguro.",
      },
    ],
  }),
  component: LandingPage,
});

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENTE PRINCIPAL (GERENCIADOR DE ESTADOS DO FUNIL)
// ─────────────────────────────────────────────────────────────────────────────

function LandingPage() {
  const [currentStep, setCurrentStep] = useState<"quiz" | "analyzing" | "landing">("quiz");
  const [targetInput, setTargetInput] = useState("");
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [showMetricsModal, setShowMetricsModal] = useState(false);

  useEffect(() => {
    // Initial tracking event when landing
    trackFunnelEvent("quiz_step_1");
  }, []);

  const handleQuizComplete = (target: string, userAnswers: Record<number, any>) => {
    setTargetInput(target);
    setAnswers(userAnswers);
    setCurrentStep("analyzing");
    trackFunnelEvent("analyzing", { target });
  };

  const handleAnalysisFinish = () => {
    setCurrentStep("landing");
    trackFunnelEvent("landing_page");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCheckoutClick = () => {
    trackFunnelEvent("checkout_click");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "oklch(0.08 0.01 20)",
        color: "oklch(0.97 0.005 30)",
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      {/* Botão flutuante discreto para ver Métricas do Funil (Admin / Dono do site) */}
      <button
        onClick={() => setShowMetricsModal(true)}
        title="Ver Métricas de Conversão & Abandono"
        style={{
          position: "fixed",
          bottom: "16px",
          right: "16px",
          zIndex: 9999,
          background: "rgba(20, 20, 20, 0.85)",
          border: "1px solid oklch(0.57 0.26 22 / 0.4)",
          color: "oklch(0.85 0.12 22)",
          borderRadius: "999px",
          padding: "8px 14px",
          fontSize: "12px",
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          gap: "6px",
          backdropFilter: "blur(10px)",
          cursor: "pointer",
          boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
        }}
      >
        <BarChart3 size={14} color="oklch(0.57 0.26 22)" />
        Métricas do Funil
      </button>

      {showMetricsModal && (
        <MetricsModal onClose={() => setShowMetricsModal(false)} />
      )}

      {currentStep === "quiz" && (
        <QuizFunnel onComplete={handleQuizComplete} />
      )}

      {currentStep === "analyzing" && (
        <AnalyzingScreen target={targetInput} onFinish={handleAnalysisFinish} />
      )}

      {currentStep === "landing" && (
        <>
          {/* Banner de resultado personalizado pós-quiz */}
          <div
            style={{
              background: "linear-gradient(90deg, oklch(0.57 0.26 22), oklch(0.40 0.18 15))",
              color: "white",
              padding: "14px 20px",
              textAlign: "center",
              fontSize: "clamp(13px, 2.5vw, 15px)",
              fontWeight: 700,
              boxShadow: "0 4px 20px oklch(0.57 0.26 22 / 0.4)",
              position: "sticky",
              top: 0,
              zIndex: 100,
            }}
          >
            <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
              <AlertTriangle size={18} />
              ANÁLISE CONCLUÍDA PARA:{" "}
              <span style={{ textDecoration: "underline", textTransform: "uppercase" }}>
                {targetInput || "PERFIL SELECIONADO"}
              </span>
              {" "}— 89% de probabilidade de conversas ocultas. Acesso liberado abaixo!
            </span>
          </div>

          <UrgencyTicker />
          <main onClick={(e) => {
            const targetEl = e.target as HTMLElement;
            if (targetEl.closest(`a[href="${CHECKOUT_URL}"]`)) {
              handleCheckoutClick();
            }
          }}>
            <Hero />
            <SocialProof />
            <HowItWorks />
            <WhatYouWillSee />
            <Testimonials />
            <UrgencyBanner />
            <Pricing />
            <FAQ />
            <FinalCTA />
          </main>
          <Footer />
        </>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// QUIZ FUNNEL COMPONENT (ALTA CONVERSÃO)
// ─────────────────────────────────────────────────────────────────────────────

function QuizFunnel({
  onComplete,
}: {
  onComplete: (target: string, answers: Record<number, any>) => void;
}) {
  const [stepIndex, setStepIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, any>>({});
  const [selectedMulti, setSelectedMulti] = useState<string[]>([]);
  const [targetInput, setTargetInput] = useState("");
  const [inputError, setInputError] = useState("");

  const quizSteps = [
    {
      id: 1,
      title: "Qual é a sua principal suspeita com a sua parceira?",
      subtitle: "Selecione a situação que mais se aproxima da sua realidade atual.",
      options: [
        {
          icon: "📱",
          text: "Esconde o celular, vira a tela ou trocou a senha recentemente",
          badge: "Alta Freqüência",
        },
        {
          icon: "💬",
          text: "Passa horas no WhatsApp ou Instagram em horários estranhos",
          badge: "Suspeita Online",
        },
        {
          icon: "⚡",
          text: "O comportamento dela mudou e ela está mais fria ou distante comigo",
          badge: "Mudança Repentina",
        },
        {
          icon: "🚨",
          text: "Tenho quase certeza que ela conversa com outro, só preciso de provas",
          badge: "Urgente",
        },
      ],
    },
    {
      id: 2,
      title: "Quais destas atitudes você notou nela recentemente?",
      subtitle: "Você pode selecionar mais de uma opção antes de avançar.",
      isMulti: true,
      options: [
        { icon: "🔒", text: "Apaga conversas e limpa o histórico de mensagens" },
        { icon: "🌙", text: "Deixa o celular no modo silencioso ou virado para baixo" },
        { icon: "📸", text: "Recebe notificações e fecha o aplicativo quando eu chego perto" },
        { icon: "📍", text: "Demora a responder e dá desculpas vagas sobre onde estava" },
      ],
    },
    {
      id: 3,
      title: "Qual aplicativo você deseja investigar primeiro?",
      subtitle: "Nossa tecnologia analisa múltiplos canais de comunicação.",
      options: [
        {
          icon: "🟢",
          text: "WhatsApp (conversas privadas, áudios e mensagens apagadas)",
          badge: "Mais Procurado",
        },
        {
          icon: "📸",
          text: "Instagram (DMs secretas, conversas temporárias e seguidores)",
          badge: "Populares",
        },
        {
          icon: "📍",
          text: "Localização em tempo real & histórico de lugares freqüentados",
          badge: "GPS Oculto",
        },
        {
          icon: "🔥",
          text: "Varredura Completa (Acesso a todas as redes simultaneamente)",
          badge: "Recomendado",
        },
      ],
    },
  ];

  const currentQ = quizSteps[stepIndex];
  const progressPercent = Math.round(((stepIndex + 1) / 4) * 100);

  const handleSingleSelect = (optionText: string) => {
    const updated = { ...userAnswers, [currentQ.id]: optionText };
    setUserAnswers(updated);

    if (stepIndex < quizSteps.length - 1) {
      const nextStep = stepIndex + 1;
      setStepIndex(nextStep);
      trackFunnelEvent(`quiz_step_${nextStep + 1}` as FunnelStep);
    } else {
      setStepIndex(3); // Go to step 4 (Input target)
      trackFunnelEvent("quiz_step_4");
    }
  };

  const handleMultiToggle = (optionText: string) => {
    if (selectedMulti.includes(optionText)) {
      setSelectedMulti(selectedMulti.filter((item) => item !== optionText));
    } else {
      setSelectedMulti([...selectedMulti, optionText]);
    }
  };

  const handleMultiSubmit = () => {
    if (selectedMulti.length === 0) {
      return;
    }
    const updated = { ...userAnswers, [currentQ.id]: selectedMulti };
    setUserAnswers(updated);
    setStepIndex(stepIndex + 1);
    trackFunnelEvent(`quiz_step_${stepIndex + 2}` as FunnelStep);
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetInput.trim() || targetInput.trim().length < 3) {
      setInputError("Digite o @ do Instagram ou número de WhatsApp válido.");
      return;
    }
    setInputError("");
    onComplete(targetInput.trim(), userAnswers);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        maxWidth: "600px",
        margin: "0 auto",
        padding: "24px 20px 40px",
      }}
    >
      {/* Quiz Top Header */}
      <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "20px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Eye size={22} color="oklch(0.57 0.26 22)" />
            <span
              style={{
                fontFamily: "'Sora', system-ui, sans-serif",
                fontWeight: 800,
                fontSize: "18px",
                letterSpacing: "-0.02em",
              }}
            >
              Clone<span style={{ color: "oklch(0.57 0.26 22)" }}>X</span>
            </span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              background: "oklch(0.14 0.015 20)",
              border: "1px solid oklch(1 0 0 / 10%)",
              borderRadius: "999px",
              padding: "4px 12px",
              fontSize: "12px",
              color: "oklch(0.65 0.03 30)",
            }}
          >
            <span
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "#22c55e",
                boxShadow: "0 0 10px #22c55e",
                display: "inline-block",
              }}
            />
            <span>342 análises ativas</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{ marginBottom: "28px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "12px",
              color: "oklch(0.60 0.03 30)",
              marginBottom: "8px",
              fontWeight: 600,
            }}
          >
            <span>Passo {stepIndex + 1} de 4</span>
            <span style={{ color: "oklch(0.57 0.26 22)" }}>{progressPercent}% Concluído</span>
          </div>
          <div
            style={{
              width: "100%",
              height: "8px",
              background: "oklch(0.14 0.015 20)",
              borderRadius: "999px",
              overflow: "hidden",
              border: "1px solid oklch(1 0 0 / 6%)",
            }}
          >
            <div
              style={{
                width: `${progressPercent}%`,
                height: "100%",
                background: "linear-gradient(90deg, oklch(0.57 0.26 22), oklch(0.70 0.20 22))",
                boxShadow: "0 0 15px oklch(0.57 0.26 22)",
                transition: "width 0.3s ease",
              }}
            />
          </div>
        </div>

        {/* QUIZ STEP CONTENT (Steps 1, 2, 3) */}
        {stepIndex < 3 && (
          <div>
            <div style={{ marginBottom: "24px" }}>
              <h1
                style={{
                  fontFamily: "'Sora', system-ui, sans-serif",
                  fontSize: "clamp(1.4rem, 4vw, 1.8rem)",
                  fontWeight: 800,
                  lineHeight: 1.25,
                  marginBottom: "8px",
                  letterSpacing: "-0.02em",
                }}
              >
                {currentQ.title}
              </h1>
              <p style={{ fontSize: "14px", color: "oklch(0.65 0.03 30)", lineHeight: 1.5 }}>
                {currentQ.subtitle}
              </p>
            </div>

            {/* SINGLE CHOICE OPTIONS */}
            {!currentQ.isMulti && (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {currentQ.options.map((opt) => (
                  <button
                    key={opt.text}
                    onClick={() => handleSingleSelect(opt.text)}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      background: "oklch(0.11 0.015 20)",
                      border: "1px solid oklch(1 0 0 / 10%)",
                      borderRadius: "14px",
                      padding: "18px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "14px",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "oklch(0.57 0.26 22 / 0.6)";
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.background = "oklch(0.14 0.02 22)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "oklch(1 0 0 / 10%)";
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.background = "oklch(0.11 0.015 20)";
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                      <span style={{ fontSize: "24px" }}>{opt.icon}</span>
                      <span
                        style={{
                          fontSize: "14px",
                          fontWeight: 600,
                          color: "oklch(0.95 0.005 30)",
                          lineHeight: 1.4,
                        }}
                      >
                        {opt.text}
                      </span>
                    </div>
                    {opt.badge && (
                      <span
                        style={{
                          fontSize: "10px",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                          background: "oklch(0.57 0.26 22 / 0.18)",
                          color: "oklch(0.80 0.14 22)",
                          border: "1px solid oklch(0.57 0.26 22 / 0.3)",
                          borderRadius: "999px",
                          padding: "4px 8px",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {opt.badge}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* MULTI CHOICE OPTIONS (Step 2) */}
            {currentQ.isMulti && (
              <div>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "24px" }}>
                  {currentQ.options.map((opt) => {
                    const isSelected = selectedMulti.includes(opt.text);
                    return (
                      <button
                        key={opt.text}
                        onClick={() => handleMultiToggle(opt.text)}
                        style={{
                          width: "100%",
                          textAlign: "left",
                          background: isSelected
                            ? "oklch(0.57 0.26 22 / 0.15)"
                            : "oklch(0.11 0.015 20)",
                          border: isSelected
                            ? "1px solid oklch(0.57 0.26 22 / 0.7)"
                            : "1px solid oklch(1 0 0 / 10%)",
                          borderRadius: "14px",
                          padding: "18px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: "14px",
                          cursor: "pointer",
                          transition: "all 0.15s ease",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                          <span style={{ fontSize: "22px" }}>{opt.icon}</span>
                          <span
                            style={{
                              fontSize: "14px",
                              fontWeight: 600,
                              color: isSelected ? "white" : "oklch(0.92 0.005 30)",
                              lineHeight: 1.4,
                            }}
                          >
                            {opt.text}
                          </span>
                        </div>
                        <div
                          style={{
                            width: "22px",
                            height: "22px",
                            borderRadius: "6px",
                            border: isSelected
                              ? "none"
                              : "2px solid oklch(0.40 0.02 30)",
                            background: isSelected ? "oklch(0.57 0.26 22)" : "transparent",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          {isSelected && <Check size={14} color="white" strokeWidth={3} />}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={handleMultiSubmit}
                  disabled={selectedMulti.length === 0}
                  style={{
                    width: "100%",
                    background:
                      selectedMulti.length > 0
                        ? "oklch(0.57 0.26 22)"
                        : "oklch(0.20 0.015 20)",
                    color: selectedMulti.length > 0 ? "white" : "oklch(0.45 0.02 30)",
                    padding: "16px",
                    borderRadius: "12px",
                    fontSize: "15px",
                    fontWeight: 700,
                    border: "none",
                    cursor: selectedMulti.length > 0 ? "pointer" : "not-allowed",
                    boxShadow:
                      selectedMulti.length > 0
                        ? "0 0 30px oklch(0.57 0.26 22 / 0.5)"
                        : "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    transition: "all 0.2s",
                  }}
                >
                  Continuar Análise <ArrowRight size={18} />
                </button>
              </div>
            )}
          </div>
        )}

        {/* STEP 4: TARGET INPUT & FINAL QUALIFICATION */}
        {stepIndex === 3 && (
          <div>
            <div style={{ textAlign: "center", marginBottom: "28px" }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "56px",
                  height: "56px",
                  borderRadius: "50%",
                  background: "oklch(0.57 0.26 22 / 0.15)",
                  border: "1px solid oklch(0.57 0.26 22 / 0.4)",
                  marginBottom: "16px",
                  boxShadow: "0 0 30px oklch(0.57 0.26 22 / 0.3)",
                }}
              >
                <Search size={28} color="oklch(0.57 0.26 22)" />
              </div>
              <h1
                style={{
                  fontFamily: "'Sora', system-ui, sans-serif",
                  fontSize: "clamp(1.4rem, 4vw, 1.8rem)",
                  fontWeight: 800,
                  lineHeight: 1.25,
                  marginBottom: "10px",
                }}
              >
                Informe o perfil ou WhatsApp para consultar a disponibilidade:
              </h1>
              <p style={{ fontSize: "14px", color: "oklch(0.65 0.03 30)", lineHeight: 1.5 }}>
                A consulta é <strong style={{ color: "white" }}>100% anônima e segura</strong>. A sua parceira JAMAIS saberá que esta busca foi realizada.
              </p>
            </div>

            <form onSubmit={handleFinalSubmit}>
              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "oklch(0.80 0.02 30)",
                    marginBottom: "8px",
                  }}
                >
                  @ do Instagram ou número de WhatsApp dela:
                </label>
                <input
                  type="text"
                  placeholder="Ex: @nome_dela ou (11) 99887-6655"
                  value={targetInput}
                  onChange={(e) => setTargetInput(e.target.value)}
                  style={{
                    width: "100%",
                    background: "oklch(0.12 0.015 20)",
                    border: inputError
                      ? "1px solid oklch(0.65 0.25 22)"
                      : "1px solid oklch(0.57 0.26 22 / 0.4)",
                    borderRadius: "12px",
                    padding: "16px",
                    fontSize: "15px",
                    color: "white",
                    outline: "none",
                    boxShadow: "0 0 20px oklch(0.57 0.26 22 / 0.15)",
                  }}
                />
                {inputError && (
                  <div style={{ color: "oklch(0.65 0.25 22)", fontSize: "12px", marginTop: "6px" }}>
                    {inputError}
                  </div>
                )}
              </div>

              <button
                type="submit"
                style={{
                  width: "100%",
                  background: "oklch(0.57 0.26 22)",
                  color: "white",
                  padding: "18px",
                  borderRadius: "12px",
                  fontSize: "16px",
                  fontWeight: 800,
                  border: "none",
                  cursor: "pointer",
                  boxShadow:
                    "0 0 40px oklch(0.57 0.26 22 / 0.6), 0 10px 30px rgba(0,0,0,0.5)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  marginBottom: "20px",
                }}
              >
                ⚡ INICIAR VARREDURA E VERIFICAR AGORA
                <ArrowRight size={18} />
              </button>

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "16px",
                  fontSize: "12px",
                  color: "oklch(0.55 0.03 30)",
                }}
              >
                <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <ShieldCheck size={14} color="oklch(0.57 0.26 22)" /> 100% Discreto
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <Lock size={14} color="oklch(0.57 0.26 22)" /> Sem registro no aparelho
                </span>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Footer Disclaimer */}
      <div style={{ textAlign: "center", marginTop: "32px", fontSize: "11px", color: "oklch(0.40 0.02 30)" }}>
        🔒 Conexão Criptografada SSL 256-Bit • Consulta anônima e confidencial
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ANALYZING SCREEN COMPONENT (TENSÃO & PERSUASÃO VISUAL)
// ─────────────────────────────────────────────────────────────────────────────

function AnalyzingScreen({
  target,
  onFinish,
}: {
  target: string;
  onFinish: () => void;
}) {
  const [progress, setProgress] = useState(0);
  const [statusLog, setStatusLog] = useState("Iniciando varredura nos servidores...");

  useEffect(() => {
    const logs = [
      { p: 15, msg: "🛰️ Conectando aos servidores de varredura segura..." },
      { p: 40, msg: `📱 Localizando registros de WhatsApp para ${target}...` },
      { p: 70, msg: "📸 Analisando DMs secretas e conversas recentes no Instagram..." },
      { p: 90, msg: "⚠️ ALERTA: 3 conversas com alto grau de suspeita detectadas!" },
      { p: 100, msg: "✅ Relatório gerado com sucesso! Carregando resultados..." },
    ];

    let current = 0;
    const interval = setInterval(() => {
      current += 2;
      if (current > 100) {
        current = 100;
        clearInterval(interval);
        setTimeout(() => {
          onFinish();
        }, 800);
      }

      setProgress(current);

      const matchingLog = logs.find((l) => current >= l.p && current < l.p + 25);
      if (matchingLog) {
        setStatusLog(matchingLog.msg);
      }
    }, 80);

    return () => clearInterval(interval);
  }, [target, onFinish]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        textAlign: "center",
        maxWidth: "500px",
        margin: "0 auto",
      }}
    >
      {/* Animated Glowing Loader */}
      <div
        style={{
          position: "relative",
          width: "120px",
          height: "120px",
          marginBottom: "32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            border: "4px solid oklch(0.57 0.26 22 / 0.2)",
            borderTopColor: "oklch(0.57 0.26 22)",
            animation: "spin 1s linear infinite",
            boxShadow: "0 0 30px oklch(0.57 0.26 22 / 0.5)",
          }}
        />
        <Zap size={44} color="oklch(0.57 0.26 22)" />
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

      <h2
        style={{
          fontFamily: "'Sora', system-ui, sans-serif",
          fontSize: "24px",
          fontWeight: 800,
          marginBottom: "12px",
        }}
      >
        Analisando dados de <span style={{ color: "oklch(0.57 0.26 22)" }}>{target}</span>
      </h2>

      <p
        style={{
          fontSize: "14px",
          color: "oklch(0.70 0.03 30)",
          marginBottom: "32px",
          minHeight: "44px",
          lineHeight: 1.4,
          fontWeight: 600,
        }}
      >
        {statusLog}
      </p>

      {/* Progress Bar */}
      <div style={{ width: "100%", marginBottom: "16px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "13px",
            color: "oklch(0.60 0.03 30)",
            marginBottom: "8px",
            fontWeight: 700,
          }}
        >
          <span>Progresso da varredura</span>
          <span style={{ color: "oklch(0.57 0.26 22)" }}>{progress}%</span>
        </div>
        <div
          style={{
            width: "100%",
            height: "10px",
            background: "oklch(0.14 0.015 20)",
            borderRadius: "999px",
            overflow: "hidden",
            border: "1px solid oklch(1 0 0 / 10%)",
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: "100%",
              background: "oklch(0.57 0.26 22)",
              boxShadow: "0 0 20px oklch(0.57 0.26 22)",
              transition: "width 0.1s linear",
            }}
          />
        </div>
      </div>

      <div style={{ fontSize: "12px", color: "oklch(0.50 0.02 30)", marginTop: "20px" }}>
        🔒 Por favor não feche esta página enquanto o relatório está sendo montado.
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// METRICS & DROP-OFF DASHBOARD MODAL
// ─────────────────────────────────────────────────────────────────────────────

function MetricsModal({ onClose }: { onClose: () => void }) {
  const metrics = getFunnelMetrics() || {
    quiz_step_1: 0,
    quiz_step_2: 0,
    quiz_step_3: 0,
    quiz_step_4: 0,
    analyzing: 0,
    landing_page: 0,
    checkout_click: 0,
  };

  const step1 = metrics.quiz_step_1 || 0;
  const step2 = metrics.quiz_step_2 || 0;
  const step3 = metrics.quiz_step_3 || 0;
  const step4 = metrics.quiz_step_4 || 0;
  const analyzing = metrics.analyzing || 0;
  const landing = metrics.landing_page || 0;
  const checkout = metrics.checkout_click || 0;

  const calcDrop = (prev: number, curr: number) => {
    if (prev === 0) return "0%";
    const drop = ((prev - curr) / prev) * 100;
    return `${Math.max(0, drop).toFixed(1)}% abandono`;
  };

  const calcConv = (prev: number, curr: number) => {
    if (prev === 0) return "0%";
    const conv = (curr / prev) * 100;
    return `${conv.toFixed(1)}% avanço`;
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        background: "rgba(0,0,0,0.85)",
        backdropFilter: "blur(12px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          background: "oklch(0.11 0.015 20)",
          border: "1px solid oklch(0.57 0.26 22 / 0.4)",
          borderRadius: "20px",
          padding: "28px",
          maxWidth: "540px",
          width: "100%",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 0 60px oklch(0.57 0.26 22 / 0.3)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
            borderBottom: "1px solid oklch(1 0 0 / 8%)",
            paddingBottom: "14px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <BarChart3 color="oklch(0.57 0.26 22)" size={24} />
            <h3 style={{ fontFamily: "'Sora', system-ui, sans-serif", fontSize: "18px", fontWeight: 800 }}>
              Métricas do Funil & Abandono
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "#aaa",
              cursor: "pointer",
              padding: "4px",
            }}
          >
            <X size={20} />
          </button>
        </div>

        <p style={{ fontSize: "13px", color: "oklch(0.65 0.03 30)", marginBottom: "20px", lineHeight: 1.5 }}>
          Acompanhamento em tempo real de acessos, avanço por etapa do quiz e taxa de conversão final do checkout neste dispositivo/sessão:
        </p>

        {/* Funnel Flow Table */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "24px" }}>
          {[
            { label: "1. Iniciaram Quiz (Pergunta 1)", count: step1, drop: "-" },
            { label: "2. Responderam Pergunta 2", count: step2, drop: calcDrop(step1, step2), conv: calcConv(step1, step2) },
            { label: "3. Responderam Pergunta 3", count: step3, drop: calcDrop(step2, step3), conv: calcConv(step2, step3) },
            { label: "4. Preencheram Alvo (Etapa 4)", count: step4, drop: calcDrop(step3, step4), conv: calcConv(step3, step4) },
            { label: "5. Tela de Varredura (Analyzing)", count: analyzing, drop: calcDrop(step4, analyzing), conv: calcConv(step4, analyzing) },
            { label: "6. Chegaram na Landing Page", count: landing, drop: calcDrop(analyzing, landing), conv: calcConv(analyzing, landing) },
            { label: "7. Clicaram no Checkout (Venda)", count: checkout, drop: calcDrop(landing, checkout), conv: calcConv(landing, checkout) },
          ].map((item, idx) => (
            <div
              key={idx}
              style={{
                background: "oklch(0.14 0.015 20)",
                border: "1px solid oklch(1 0 0 / 6%)",
                borderRadius: "10px",
                padding: "14px 16px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: "13px",
              }}
            >
              <div>
                <div style={{ fontWeight: 700, color: "white" }}>{item.label}</div>
                {item.conv && (
                  <div style={{ fontSize: "11px", color: "#22c55e", marginTop: "2px" }}>
                    ✓ {item.conv} do passo anterior
                  </div>
                )}
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "16px", fontWeight: 800, color: "oklch(0.57 0.26 22)" }}>
                  {item.count} acessos
                </div>
                {item.drop !== "-" && (
                  <div style={{ fontSize: "11px", color: "oklch(0.65 0.25 22)" }}>
                    📉 {item.drop}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Global Funnel Conversion Rate */}
        <div
          style={{
            background: "oklch(0.57 0.26 22 / 0.15)",
            border: "1px solid oklch(0.57 0.26 22 / 0.4)",
            borderRadius: "12px",
            padding: "16px",
            textAlign: "center",
            marginBottom: "20px",
          }}
        >
          <div style={{ fontSize: "12px", color: "oklch(0.70 0.03 30)", textTransform: "uppercase", fontWeight: 700 }}>
            Taxa Geral de Conversão do Funil (Quiz ➔ Checkout)
          </div>
          <div style={{ fontSize: "28px", fontWeight: 800, color: "white", marginTop: "4px" }}>
            {step1 > 0 ? ((checkout / step1) * 100).toFixed(1) : 0}%
          </div>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={() => {
              clearFunnelMetrics();
              window.location.reload();
            }}
            style={{
              flex: 1,
              background: "oklch(0.16 0.02 20)",
              border: "1px solid oklch(1 0 0 / 10%)",
              color: "oklch(0.80 0.02 30)",
              padding: "12px",
              borderRadius: "10px",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
            }}
          >
            <RefreshCw size={14} /> Zerar Métricas
          </button>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              background: "oklch(0.57 0.26 22)",
              color: "white",
              padding: "12px",
              borderRadius: "10px",
              fontSize: "13px",
              fontWeight: 700,
              border: "none",
              cursor: "pointer",
            }}
          >
            Fechar Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// URGENCY TICKER
// ─────────────────────────────────────────────────────────────────────────────

function UrgencyTicker() {
  const items = [
    "🔥 VAGAS LIMITADAS — apenas 47 disponíveis hoje",
    "⚠️ Oferta encerra em breve",
    "✅ +47.000 homens já se libertaram da dúvida",
    "🔒 100% anônimo — ela nunca saberá",
    "⚡ Acesso instantâneo após o pagamento",
  ];
  const doubled = [...items, ...items];

  return (
    <div
      style={{
        background: "oklch(0.57 0.26 22)",
        overflow: "hidden",
        padding: "8px 0",
      }}
    >
      <div className="ticker-inner">
        {doubled.map((item, i) => (
          <span
            key={i}
            style={{
              fontSize: "12px",
              fontWeight: 600,
              color: "white",
              whiteSpace: "nowrap",
              letterSpacing: "0.02em",
            }}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HERO
// ─────────────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section
      style={{
        width: "100%",
        minHeight: "750px",
        position: "relative",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        padding: "80px 24px",
      }}
    >
      {/* Background Image of Couple */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage: "url(/couple-bg.png)",
          backgroundSize: "cover",
          backgroundPosition: "center right",
          zIndex: 0,
        }}
      />
      {/* Dark gradient overlay for text readability */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background:
            "linear-gradient(to right, #050505 30%, transparent 90%), linear-gradient(to top, #050505 5%, transparent 40%)",
          zIndex: 1,
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: "1100px",
          margin: "0 auto",
          width: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "40px",
          flexWrap: "wrap",
        }}
      >
        {/* Left Column: Text & CTA */}
        <div style={{ flex: "1 1 450px", maxWidth: "600px", textAlign: "left" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "oklch(0.57 0.26 22 / 0.15)",
              border: "1px solid oklch(0.57 0.26 22 / 0.4)",
              borderRadius: "999px",
              padding: "6px 14px",
              fontSize: "12px",
              fontWeight: 600,
              color: "oklch(0.80 0.15 22)",
              marginBottom: "24px",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
          >
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "oklch(0.57 0.26 22)",
                boxShadow: "0 0 8px oklch(0.57 0.26 22)",
              }}
            />
            Monitoramento 100% Anônimo
          </div>

          <h1
            style={{
              fontFamily: "'Sora', system-ui, sans-serif",
              fontSize: "clamp(2.4rem, 6vw, 4.5rem)",
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
              marginBottom: "20px",
            }}
          >
            Ela está te{" "}
            <span
              style={{
                color: "oklch(0.57 0.26 22)",
                textShadow: "0 0 40px oklch(0.57 0.26 22 / 0.5)",
              }}
            >
              traindo?
            </span>
          </h1>

          <p
            style={{
              fontSize: "clamp(1.1rem, 2.5vw, 1.3rem)",
              color: "oklch(0.72 0.03 30)",
              lineHeight: 1.6,
              marginBottom: "40px",
              maxWidth: "520px",
            }}
          >
            Descubra toda a verdade no WhatsApp e Instagram da sua parceira —{" "}
            <strong style={{ color: "oklch(0.97 0.005 30)" }}>
              antes que seja tarde demais.
            </strong>
          </p>

          <a
            href={CHECKOUT_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              background: "oklch(0.57 0.26 22)",
              color: "white",
              padding: "18px 40px",
              borderRadius: "12px",
              fontSize: "17px",
              fontWeight: 700,
              textDecoration: "none",
              boxShadow:
                "0 0 40px oklch(0.57 0.26 22 / 0.55), 0 20px 60px -20px oklch(0.57 0.26 22 / 0.4)",
              transition: "transform 0.2s, box-shadow 0.2s",
              marginBottom: "24px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow =
                "0 0 60px oklch(0.57 0.26 22 / 0.7), 0 20px 60px -20px oklch(0.57 0.26 22 / 0.5)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 0 40px oklch(0.57 0.26 22 / 0.55), 0 20px 60px -20px oklch(0.57 0.26 22 / 0.4)";
            }}
          >
            ⚡ Descobrir a Verdade — Acesso Imediato
            <ArrowRight size={18} />
          </a>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "20px",
              fontSize: "13px",
              color: "oklch(0.60 0.03 30)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <ShieldCheck size={14} color="oklch(0.57 0.26 22)" /> 100% discreto
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <Lock size={14} color="oklch(0.57 0.26 22)" /> Sem notificações
            </div>
          </div>
        </div>

        {/* Right Column: Phone Mockup */}
        <div
          style={{
            flex: "1 1 300px",
            display: "flex",
            justifyContent: "center",
            perspective: "1200px",
          }}
        >
          <div
            style={{
              width: "280px",
              height: "560px",
              background: "#090909",
              borderRadius: "44px",
              border: "5px solid #222",
              boxShadow:
                "0 0 60px oklch(0.57 0.26 22 / 0.4), inset 0 0 20px rgba(0,0,0,0.8), inset 0 0 4px rgba(255,255,255,0.2)",
              position: "relative",
              padding: "20px 16px",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              transform: "rotateY(-15deg) rotateX(5deg)",
              transformStyle: "preserve-3d",
              overflow: "hidden",
            }}
          >
            {/* Screen Glare */}
            <div
              style={{
                position: "absolute",
                top: "-50%",
                left: "-50%",
                width: "200%",
                height: "200%",
                background: "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0) 40%, rgba(255,255,255,0) 100%)",
                transform: "rotate(25deg)",
                pointerEvents: "none",
                zIndex: 20,
              }}
            />

            {/* Dynamic Island Notch */}
            <div
              style={{
                position: "absolute",
                top: "14px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "90px",
                height: "24px",
                background: "#000",
                borderRadius: "12px",
                zIndex: 10,
                boxShadow: "inset 0 0 4px rgba(255,255,255,0.1)",
              }}
            />

            {/* Glowing Red Eye background inside phone */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                opacity: 0.25,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                filter: "drop-shadow(0 0 20px oklch(0.57 0.26 22))",
              }}
            >
              <Eye size={120} color="oklch(0.57 0.26 22)" strokeWidth={1} />
            </div>

            {/* WhatsApp Notification */}
            <div
              style={{
                background: "rgba(30, 30, 30, 0.75)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                borderRadius: "20px",
                padding: "16px",
                display: "flex",
                gap: "12px",
                alignItems: "flex-start",
                marginTop: "48px",
                position: "relative",
                zIndex: 10,
                boxShadow: "0 15px 35px rgba(0,0,0,0.6)",
                transform: "translateZ(30px)",
              }}
            >
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  background: "#25D366",
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  boxShadow: "0 4px 10px rgba(37, 211, 102, 0.4)",
                }}
              >
                <WhatsappLogo size={22} weight="fill" color="white" />
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "12px",
                    color: "#aaa",
                    marginBottom: "4px",
                  }}
                >
                  <span>WhatsApp</span>
                  <span>agora</span>
                </div>
                <div style={{ fontSize: "14px", fontWeight: 700, color: "white", marginBottom: "2px" }}>
                  Amor ❤️
                </div>
                <div style={{ fontSize: "13px", color: "#ccc", lineHeight: 1.3 }}>
                  Pode vir, ele já dormiu...
                </div>
              </div>
            </div>

            {/* Instagram Notification */}
            <div
              style={{
                background: "rgba(30, 30, 30, 0.75)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                borderRadius: "20px",
                padding: "16px",
                display: "flex",
                gap: "12px",
                alignItems: "flex-start",
                position: "relative",
                zIndex: 10,
                boxShadow: "0 15px 35px rgba(0,0,0,0.6)",
                transform: "translateZ(40px)",
              }}
            >
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  background:
                    "linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  boxShadow: "0 4px 10px rgba(220, 39, 67, 0.4)",
                }}
              >
                <InstagramLogo size={22} weight="regular" color="white" />
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "12px",
                    color: "#aaa",
                    marginBottom: "4px",
                  }}
                >
                  <span>Instagram</span>
                  <span>2 min</span>
                </div>
                <div style={{ fontSize: "14px", fontWeight: 700, color: "white", marginBottom: "2px" }}>
                  @pedro_alves
                </div>
                <div style={{ fontSize: "13px", color: "#ccc", lineHeight: 1.3 }}>
                  Você vem me ver hoje à noite? 🔥
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SOCIAL PROOF — STATS
// ─────────────────────────────────────────────────────────────────────────────

function SocialProof() {
  const stats = [
    { value: "+47.000", label: "homens libertos" },
    { value: "4.9★", label: "avaliação média" },
    { value: "100%", label: "anônimo e seguro" },
    { value: "<2 min", label: "para ter acesso" },
  ];

  return (
    <section
      style={{
        maxWidth: "1100px",
        margin: "0 auto 80px",
        padding: "0 24px",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        {stats.map((s) => (
          <div
            key={s.label}
            style={{
              background: "oklch(0.11 0.015 20)",
              border: "1px solid oklch(1 0 0 / 8%)",
              borderRadius: "14px",
              padding: "20px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontFamily: "'Sora', system-ui, sans-serif",
                fontSize: "26px",
                fontWeight: 700,
                color: "oklch(0.57 0.26 22)",
                textShadow: "0 0 20px oklch(0.57 0.26 22 / 0.4)",
              }}
            >
              {s.value}
            </div>
            <div style={{ fontSize: "12px", color: "oklch(0.60 0.03 30)", marginTop: "4px" }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* DADO ESTATÍSTICO DE IMPACTO */}
      <div
        style={{
          background: "linear-gradient(135deg, oklch(0.57 0.26 22 / 0.15), oklch(0.12 0.02 20))",
          border: "1px solid oklch(0.57 0.26 22 / 0.35)",
          borderRadius: "16px",
          padding: "24px clamp(16px, 4vw, 32px)",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: "20px",
          boxShadow: "0 10px 30px -10px oklch(0.57 0.26 22 / 0.2)",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            fontFamily: "'Sora', system-ui, sans-serif",
            fontSize: "clamp(2rem, 5vw, 3rem)",
            fontWeight: 800,
            color: "oklch(0.57 0.26 22)",
            textShadow: "0 0 25px oklch(0.57 0.26 22 / 0.5)",
            lineHeight: 1,
            flexShrink: 0,
            margin: "0 auto",
          }}
        >
          +70%
        </div>
        <div style={{ flex: "1 1 240px", textAlign: "left" }}>
          <div
            style={{
              fontFamily: "'Sora', system-ui, sans-serif",
              fontSize: "clamp(15px, 2.5vw, 17px)",
              fontWeight: 700,
              color: "oklch(0.97 0.005 30)",
              marginBottom: "4px",
              lineHeight: 1.3,
            }}
          >
            Estudos revelam: mais de 70% das mulheres já conversaram em segredo com outro homem estando em um relacionamento.
          </div>
          <div style={{ fontSize: "13px", color: "oklch(0.65 0.03 30)", lineHeight: 1.4 }}>
            A maioria esconde conversas no WhatsApp e DMs do Instagram. Não viva na dúvida.
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HOW IT WORKS
// ─────────────────────────────────────────────────────────────────────────────

function HowItWorks() {
  const steps = [
    {
      num: "1",
      icon: <Smartphone size={28} color="oklch(0.57 0.26 22)" />,
      title: "Você compra o acesso",
      body: "Processo 100% seguro. Em menos de 2 minutos você recebe suas credenciais de acesso por e-mail.",
    },
    {
      num: "2",
      icon: <Eye size={28} color="oklch(0.57 0.26 22)" />,
      title: "Informe o número ou @",
      body: "Digite o número de WhatsApp ou o @ do Instagram da sua parceira. Não precisa de acesso ao celular dela.",
    },
    {
      num: "3",
      icon: <MessageCircle size={28} color="oklch(0.57 0.26 22)" />,
      title: "Veja tudo em tempo real",
      body: "Conversas, fotos, vídeos, histórico — tudo aparece no seu painel. Ela nunca saberá que você está vendo.",
    },
  ];

  return (
    <section
      id="como-funciona"
      style={{
        maxWidth: "1100px",
        margin: "0 auto 80px",
        padding: "0 24px",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "48px" }}>
        <SectionBadge>Como Funciona</SectionBadge>
        <h2
          style={{
            fontFamily: "'Sora', system-ui, sans-serif",
            fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
            fontWeight: 700,
            marginTop: "12px",
            letterSpacing: "-0.02em",
          }}
        >
          Simples. Rápido.{" "}
          <span style={{ color: "oklch(0.57 0.26 22)" }}>Em segredo.</span>
        </h2>
        <p style={{ color: "oklch(0.60 0.03 30)", marginTop: "12px", fontSize: "15px" }}>
          Você não precisa ser especialista e nem pegar no celular dela. Nós fazemos o trabalho difícil para você.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "20px",
        }}
      >
        {steps.map((s) => (
          <div
            key={s.num}
            style={{
              background: "oklch(0.11 0.015 20)",
              border: "1px solid oklch(1 0 0 / 8%)",
              borderRadius: "16px",
              padding: "28px",
              position: "relative",
              transition: "border-color 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.borderColor = "oklch(0.57 0.26 22 / 0.5)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.borderColor = "oklch(1 0 0 / 8%)")
            }
          >
            <div
              style={{
                position: "absolute",
                top: "20px",
                right: "20px",
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                background: "oklch(0.57 0.26 22 / 0.15)",
                border: "1px solid oklch(0.57 0.26 22 / 0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "12px",
                fontWeight: 700,
                color: "oklch(0.57 0.26 22)",
              }}
            >
              {s.num}
            </div>
            <div
              style={{
                width: "52px",
                height: "52px",
                borderRadius: "12px",
                background: "oklch(0.57 0.26 22 / 0.12)",
                border: "1px solid oklch(0.57 0.26 22 / 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "16px",
              }}
            >
              {s.icon}
            </div>
            <h3
              style={{
                fontFamily: "'Sora', system-ui, sans-serif",
                fontSize: "17px",
                fontWeight: 700,
                marginBottom: "10px",
              }}
            >
              {s.title}
            </h3>
            <p style={{ fontSize: "14px", color: "oklch(0.62 0.03 30)", lineHeight: 1.6 }}>
              {s.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// WHAT YOU WILL SEE
// ─────────────────────────────────────────────────────────────────────────────

function WhatYouWillSee() {
  const features = [
    {
      emoji: "💬",
      title: "Conversas do WhatsApp",
      body: "Todas as mensagens, enviadas e recebidas, mesmo as deletadas.",
    },
    {
      emoji: "📸",
      title: "Fotos e Vídeos",
      body: "Mídias trocadas em conversas privadas, grupos e status.",
    },
    {
      emoji: "📍",
      title: "Histórico de Localização",
      body: "Veja onde ela esteve nas últimas 24h no mapa.",
    },
    {
      emoji: "👤",
      title: "Seguidores Secretos do Instagram",
      body: "Perfis que ela segue em sigilo e quem interage com ela.",
    },
    {
      emoji: "🔍",
      title: "Conversas do Instagram",
      body: "DMs do Instagram, incluindo mensagens apagadas.",
    },
    {
      emoji: "📞",
      title: "Chamadas e Ligações",
      body: "Registro de todas as chamadas de voz e vídeo.",
    },
  ];

  return (
    <section
      style={{
        maxWidth: "1100px",
        margin: "0 auto 80px",
        padding: "0 24px",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "48px" }}>
        <SectionBadge>O que você vai ver</SectionBadge>
        <h2
          style={{
            fontFamily: "'Sora', system-ui, sans-serif",
            fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
            fontWeight: 700,
            marginTop: "12px",
            letterSpacing: "-0.02em",
          }}
        >
          A verdade que a sua{" "}
          <span style={{ color: "oklch(0.57 0.26 22)" }}>intuição já sabe</span>
        </h2>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "16px",
        }}
      >
        {features.map((f) => (
          <div
            key={f.title}
            style={{
              background: "oklch(0.11 0.015 20)",
              border: "1px solid oklch(1 0 0 / 8%)",
              borderRadius: "14px",
              padding: "24px",
              display: "flex",
              gap: "16px",
              alignItems: "flex-start",
              transition: "border-color 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.borderColor = "oklch(0.57 0.26 22 / 0.4)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.borderColor = "oklch(1 0 0 / 8%)")
            }
          >
            <div style={{ fontSize: "28px", lineHeight: 1 }}>{f.emoji}</div>
            <div>
              <div
                style={{
                  fontFamily: "'Sora', system-ui, sans-serif",
                  fontWeight: 700,
                  fontSize: "15px",
                  marginBottom: "6px",
                }}
              >
                {f.title}
              </div>
              <div style={{ fontSize: "13px", color: "oklch(0.60 0.03 30)", lineHeight: 1.5 }}>
                {f.body}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ textAlign: "center", marginTop: "36px" }}>
        <a
          href={CHECKOUT_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: "oklch(0.57 0.26 22)",
            color: "white",
            padding: "16px 36px",
            borderRadius: "10px",
            fontSize: "15px",
            fontWeight: 700,
            textDecoration: "none",
            boxShadow: "0 0 30px oklch(0.57 0.26 22 / 0.4)",
          }}
        >
          Quero Minha Paz de Volta <ArrowRight size={16} />
        </a>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TESTIMONIALS
// ─────────────────────────────────────────────────────────────────────────────

function Testimonials() {
  const items = [
    {
      name: "Ricardo M.",
      city: "São Paulo, SP",
      stars: 5,
      text: "Eu não conseguia mais dormir com a minha intuição gritando. Em menos de 10 minutos vi tudo. A dor de ver foi grande, mas a libertação de não ser mais enganado foi maior. Valeu cada centavo.",
      time: "há 2 dias",
    },
    {
      name: "Lucas B.",
      city: "Belo Horizonte, MG",
      stars: 5,
      text: "Achei que eu estava ficando louco, ela sempre dizia que era paranoia da minha cabeça. Ver a verdade com meus próprios olhos me devolveu a paz e o controle da minha vida.",
      time: "há 5 dias",
    },
    {
      name: "Fernando C.",
      city: "Curitiba, PR",
      stars: 5,
      text: "Um amigo me indicou. Fiz o login, coloquei o número dela e em 2 minutos estava vendo as conversas dela. Simples demais. Recomendo para todo homem que tem dúvida.",
      time: "há 1 semana",
    },
    {
      name: "Paulo L.",
      city: "Rio de Janeiro, RJ",
      stars: 5,
      text: "Foram meses desconfiado achando que o problema era comigo. Descobri tudo. Doeu muito, mas pelo menos pude tomar uma decisão com base na verdade e seguir em frente.",
      time: "há 1 semana",
    },
    {
      name: "Carlos S.",
      city: "Recife, PE",
      stars: 5,
      text: "Funcionou perfeitamente no Instagram dela. Vi os DMs que ela achava que eram secretos. A interface é muito fácil, qualquer um consegue usar.",
      time: "há 2 semanas",
    },
    {
      name: "Rodrigo O.",
      city: "Porto Alegre, RS",
      stars: 5,
      text: "Fiquei em paz depois de ver. Ela realmente não estava me traindo, só conversando sobre assuntos de trabalho. Mas eu precisava ter certeza. Serviço 100% anônimo, recomendo sem medo.",
      time: "há 2 semanas",
    },
  ];

  return (
    <section
      id="depoimentos"
      style={{
        maxWidth: "1100px",
        margin: "0 auto 80px",
        padding: "0 24px",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "48px" }}>
        <SectionBadge>Depoimentos Reais</SectionBadge>
        <h2
          style={{
            fontFamily: "'Sora', system-ui, sans-serif",
            fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
            fontWeight: 700,
            marginTop: "12px",
            letterSpacing: "-0.02em",
          }}
        >
          Mais de 47 mil homens já{" "}
          <span style={{ color: "oklch(0.57 0.26 22)" }}>recuperaram sua paz</span>
        </h2>
        <div style={{ display: "flex", justifyContent: "center", gap: "4px", marginTop: "16px" }}>
          {[1, 2, 3, 4, 5].map((i) => (
            <Star key={i} size={18} fill="oklch(0.57 0.26 22)" color="oklch(0.57 0.26 22)" />
          ))}
          <span style={{ fontSize: "14px", color: "oklch(0.60 0.03 30)", marginLeft: "8px" }}>
            4.9/5 · +3.200 avaliações
          </span>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "16px",
        }}
      >
        {items.map((t) => (
          <div
            key={t.name}
            style={{
              background: "oklch(0.11 0.015 20)",
              border: "1px solid oklch(1 0 0 / 8%)",
              borderRadius: "14px",
              padding: "24px",
            }}
          >
            {/* Stars */}
            <div style={{ display: "flex", gap: "3px", marginBottom: "12px" }}>
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} size={14} fill="oklch(0.57 0.26 22)" color="oklch(0.57 0.26 22)" />
              ))}
            </div>

            {/* Quote */}
            <p
              style={{
                fontSize: "14px",
                color: "oklch(0.78 0.02 30)",
                lineHeight: 1.65,
                marginBottom: "20px",
              }}
            >
              "{t.text}"
            </p>

            {/* Identity */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderTop: "1px solid oklch(1 0 0 / 6%)",
                paddingTop: "16px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                {/* Avatar */}
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    background: "oklch(0.57 0.26 22 / 0.25)",
                    border: "1px solid oklch(0.57 0.26 22 / 0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "14px",
                    fontWeight: 700,
                    color: "oklch(0.80 0.12 22)",
                  }}
                >
                  {t.name[0]}
                </div>
                <div>
                  <div style={{ fontSize: "13px", fontWeight: 600 }}>{t.name}</div>
                  <div style={{ fontSize: "11px", color: "oklch(0.55 0.02 30)" }}>{t.city}</div>
                </div>
              </div>
              <div style={{ fontSize: "11px", color: "oklch(0.50 0.02 30)" }}>{t.time}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// URGENCY BANNER WITH COUNTDOWN
// ─────────────────────────────────────────────────────────────────────────────

function UrgencyBanner() {
  const [time, setTime] = useState({ h: 2, m: 47, s: 33 });

  useEffect(() => {
    const id = setInterval(() => {
      setTime((prev) => {
        let { h, m, s } = prev;
        s--;
        if (s < 0) { s = 59; m--; }
        if (m < 0) { m = 59; h--; }
        if (h < 0) { h = 2; m = 59; s = 59; } // loop
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <section style={{ maxWidth: "1100px", margin: "0 auto 80px", padding: "0 24px" }}>
      <div
        style={{
          background:
            "linear-gradient(135deg, oklch(0.57 0.26 22 / 0.18), oklch(0.50 0.22 15 / 0.10))",
          border: "1px solid oklch(0.57 0.26 22 / 0.4)",
          borderRadius: "16px",
          padding: "32px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: "oklch(0.57 0.26 22)",
            color: "white",
            padding: "6px 14px",
            borderRadius: "999px",
            fontSize: "12px",
            fontWeight: 700,
            marginBottom: "16px",
            letterSpacing: "0.05em",
          }}
        >
          <AlertTriangle size={12} /> OFERTA EXPIRA EM
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: "12px", marginBottom: "20px" }}>
          {[
            { v: pad(time.h), l: "horas" },
            { v: pad(time.m), l: "minutos" },
            { v: pad(time.s), l: "segundos" },
          ].map(({ v, l }, i) => (
            <div key={l} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ textAlign: "center" }}>
                <div
                  className="countdown-digit"
                  key={v}
                  style={{
                    fontFamily: "'Sora', system-ui, sans-serif",
                    fontSize: "clamp(2rem, 6vw, 3.5rem)",
                    fontWeight: 800,
                    color: "oklch(0.57 0.26 22)",
                    textShadow: "0 0 30px oklch(0.57 0.26 22 / 0.6)",
                    minWidth: "70px",
                    display: "block",
                  }}
                >
                  {v}
                </div>
                <div style={{ fontSize: "11px", color: "oklch(0.55 0.03 30)", marginTop: "4px" }}>
                  {l}
                </div>
              </div>
              {i < 2 && (
                <span
                  style={{
                    fontFamily: "'Sora', system-ui",
                    fontSize: "2rem",
                    fontWeight: 800,
                    color: "oklch(0.57 0.26 22 / 0.6)",
                    marginBottom: "16px",
                  }}
                >
                  :
                </span>
              )}
            </div>
          ))}
        </div>

        <p style={{ color: "oklch(0.72 0.03 30)", fontSize: "15px", marginBottom: "24px" }}>
          <strong style={{ color: "white" }}>Restam apenas 47 vagas</strong> com o preço especial de lançamento.
          <br />
          Quando esgotar, o preço volta ao normal.
        </p>

        <a
          href={CHECKOUT_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: "oklch(0.57 0.26 22)",
            color: "white",
            padding: "16px 40px",
            borderRadius: "10px",
            fontSize: "16px",
            fontWeight: 700,
            textDecoration: "none",
            boxShadow: "0 0 40px oklch(0.57 0.26 22 / 0.5)",
          }}
        >
          Garantir Minha Vaga Agora <ArrowRight size={16} />
        </a>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PRICING
// ─────────────────────────────────────────────────────────────────────────────

function Pricing() {
  const features = [
    "Monitoramento completo do WhatsApp",
    "Conversas e DMs do Instagram",
    "Histórico de localização em tempo real",
    "Fotos e vídeos trocados",
    "Registro de chamadas e ligações",
    "✨ Acesso VITALÍCIO — pague uma vez, use para sempre",
    "Suporte via WhatsApp",
    "Garantia de 7 dias ou seu dinheiro de volta",
  ];

  return (
    <section
      id="planos"
      style={{
        maxWidth: "1100px",
        margin: "0 auto 80px",
        padding: "0 24px",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "48px" }}>
        <SectionBadge>Preço</SectionBadge>
        <h2
          style={{
            fontFamily: "'Sora', system-ui, sans-serif",
            fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
            fontWeight: 700,
            marginTop: "12px",
            letterSpacing: "-0.02em",
          }}
        >
          Quero descobrir{" "}
          <span style={{ color: "oklch(0.57 0.26 22)" }}>toda a verdade</span>
        </h2>
        <p style={{ color: "oklch(0.60 0.03 30)", marginTop: "10px" }}>
          O valor para descobrir a verdade e voltar a dormir em paz.
        </p>
      </div>

      <div style={{ maxWidth: "480px", margin: "0 auto" }}>
        <div
          style={{
            background: "oklch(0.11 0.015 20)",
            border: "2px solid oklch(0.57 0.26 22 / 0.5)",
            borderRadius: "20px",
            padding: "40px",
            boxShadow: "0 0 60px oklch(0.57 0.26 22 / 0.15), 0 20px 60px -20px oklch(0 0 0 / 0.6)",
            position: "relative",
          }}
        >
          {/* Popular badge */}
          <div
            style={{
              position: "absolute",
              top: "-14px",
              left: "50%",
              transform: "translateX(-50%)",
              background: "oklch(0.57 0.26 22)",
              color: "white",
              padding: "6px 20px",
              borderRadius: "999px",
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.05em",
              whiteSpace: "nowrap",
            }}
          >
            🔥 MAIS VENDIDO — OFERTA DE LANÇAMENTO
          </div>

          <div style={{ textAlign: "center", marginBottom: "28px" }}>
            <div style={{ fontSize: "14px", color: "oklch(0.55 0.03 30)", marginBottom: "4px" }}>
              ♾️ Acesso Vitalício — Pague uma vez, use para sempre
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              <span
                style={{
                  fontSize: "16px",
                  color: "oklch(0.50 0.03 30)",
                  textDecoration: "line-through",
                }}
              >
                R$97
              </span>
              <span
                style={{
                  fontFamily: "'Sora', system-ui, sans-serif",
                  fontSize: "58px",
                  fontWeight: 800,
                  color: "oklch(0.97 0.005 30)",
                  lineHeight: 1,
                }}
              >
                R$19,90
              </span>
            </div>
            <div
              style={{
                display: "inline-block",
                background: "oklch(0.57 0.26 22 / 0.15)",
                color: "oklch(0.80 0.15 22)",
                padding: "4px 12px",
                borderRadius: "999px",
                fontSize: "12px",
                fontWeight: 700,
                marginTop: "8px",
              }}
            >
              −70% DE DESCONTO
            </div>
          </div>

          <ul style={{ listStyle: "none", padding: 0, margin: "0 0 28px", display: "flex", flexDirection: "column", gap: "12px" }}>
            {features.map((f) => (
              <li
                key={f}
                style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px" }}
              >
                <CheckCircle2 size={16} color="oklch(0.57 0.26 22)" style={{ flexShrink: 0 }} />
                <span style={{ color: "oklch(0.82 0.02 30)" }}>{f}</span>
              </li>
            ))}
          </ul>

          <a
            href={CHECKOUT_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              background: "oklch(0.57 0.26 22)",
              color: "white",
              padding: "18px",
              borderRadius: "12px",
              fontSize: "16px",
              fontWeight: 700,
              textDecoration: "none",
              boxShadow: "0 0 40px oklch(0.57 0.26 22 / 0.5)",
              marginBottom: "14px",
              transition: "transform 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
          >
            ⚡ Quero a Minha Paz de Volta — R$19,90 <ArrowRight size={16} />
          </a>

          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: "12px", color: "oklch(0.55 0.02 30)", lineHeight: 1.6 }}>
              🔒 Pagamento 100% seguro · Garantia de 7 dias
              <br />
              Acesso imediato após confirmação do pagamento
            </p>
          </div>
        </div>

        {/* Payment methods */}
        <div
          style={{
            textAlign: "center",
            marginTop: "20px",
            fontSize: "12px",
            color: "oklch(0.50 0.02 30)",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "8px",
            alignItems: "center",
          }}
        >
          <span>Aceita:</span>
          {["💳 Cartão de crédito", "📱 Pix", "🏦 Boleto"].map((p) => (
            <span
              key={p}
              style={{
                background: "oklch(0.14 0.015 20)",
                border: "1px solid oklch(1 0 0 / 8%)",
                borderRadius: "6px",
                padding: "3px 8px",
                fontSize: "11px",
              }}
            >
              {p}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FAQ
// ─────────────────────────────────────────────────────────────────────────────

function FAQ() {
  const items = [
    {
      q: "Ela vai saber que estou monitorando?",
      a: "Não. O monitoramento é 100% invisível. Não aparece nenhuma notificação no celular dela, não muda nada no aplicativo dela e não deixa rastros. Ela nunca saberá.",
    },
    {
      q: "Preciso ter acesso ao celular dela para instalar algo?",
      a: "Não! É exatamente por isso que o serviço é tão poderoso. Você só precisa informar o número de WhatsApp ou o @ do Instagram. Nada mais.",
    },
    {
      q: "Em quanto tempo tenho acesso?",
      a: "Após a confirmação do pagamento (Pix é instantâneo), você recebe o acesso por e-mail em menos de 2 minutos.",
    },
    {
      q: "E se não funcionar?",
      a: "Temos garantia de 7 dias. Se por qualquer motivo você não ficar satisfeito, devolvemos 100% do seu dinheiro. Sem perguntas.",
    },
    {
      q: "Funciona com qualquer operadora?",
      a: "Sim. Funciona com qualquer número de celular brasileiro, de qualquer operadora, e com qualquer conta do Instagram.",
    },
    {
      q: "Meus dados estão seguros?",
      a: "Sim. Todas as informações são criptografadas e você é o único com acesso ao painel. Não compartilhamos seus dados com ninguém.",
    },
  ];

  const [open, setOpen] = useState<number | null>(null);

  return (
    <section
      id="faq"
      style={{
        maxWidth: "1100px",
        margin: "0 auto 80px",
        padding: "0 24px",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "48px" }}>
        <SectionBadge>Dúvidas Frequentes</SectionBadge>
        <h2
          style={{
            fontFamily: "'Sora', system-ui, sans-serif",
            fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
            fontWeight: 700,
            marginTop: "12px",
            letterSpacing: "-0.02em",
          }}
        >
          Perguntas <span style={{ color: "oklch(0.57 0.26 22)" }}>frequentes</span>
        </h2>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
          gap: "12px",
          maxWidth: "900px",
          margin: "0 auto",
        }}
      >
        {items.map((it, i) => (
          <div
            key={it.q}
            style={{
              background: "oklch(0.11 0.015 20)",
              border: `1px solid ${open === i ? "oklch(0.57 0.26 22 / 0.4)" : "oklch(1 0 0 / 8%)"}`,
              borderRadius: "12px",
              overflow: "hidden",
              transition: "border-color 0.2s",
            }}
          >
            <button
              onClick={() => setOpen(open === i ? null : i)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "18px 20px",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "oklch(0.97 0.005 30)",
                textAlign: "left",
                gap: "12px",
              }}
            >
              <span
                style={{
                  fontFamily: "'Sora', system-ui, sans-serif",
                  fontSize: "14px",
                  fontWeight: 600,
                }}
              >
                {it.q}
              </span>
              <ChevronDown
                size={18}
                color="oklch(0.57 0.26 22)"
                style={{
                  transform: open === i ? "rotate(180deg)" : "rotate(0)",
                  transition: "transform 0.2s",
                  flexShrink: 0,
                }}
              />
            </button>
            {open === i && (
              <div
                style={{
                  padding: "0 20px 18px",
                  fontSize: "14px",
                  color: "oklch(0.62 0.03 30)",
                  lineHeight: 1.65,
                  borderTop: "1px solid oklch(1 0 0 / 6%)",
                  paddingTop: "14px",
                }}
              >
                {it.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FINAL CTA
// ─────────────────────────────────────────────────────────────────────────────

function FinalCTA() {
  return (
    <section
      style={{
        maxWidth: "1100px",
        margin: "0 auto 80px",
        padding: "0 24px",
      }}
    >
      <div
        style={{
          background:
            "linear-gradient(135deg, oklch(0.57 0.26 22 / 0.20), oklch(0.50 0.22 15 / 0.12))",
          border: "1px solid oklch(0.57 0.26 22 / 0.4)",
          borderRadius: "20px",
          padding: "clamp(32px, 6vw, 60px)",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-60px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "400px",
            height: "400px",
            background:
              "radial-gradient(circle, oklch(0.57 0.26 22 / 0.12), transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div style={{ position: "relative" }}>
          <div className="eye-neon" style={{ marginBottom: "16px", display: "inline-block" }}>
            <Zap size={48} color="oklch(0.57 0.26 22)" fill="oklch(0.57 0.26 22 / 0.3)" />
          </div>

          <h2
            style={{
              fontFamily: "'Sora', system-ui, sans-serif",
              fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
              fontWeight: 800,
              marginBottom: "16px",
              letterSpacing: "-0.03em",
            }}
          >
            Você merece saber a{" "}
            <span style={{ color: "oklch(0.57 0.26 22)" }}>verdade.</span>
          </h2>

          <p
            style={{
              color: "oklch(0.68 0.03 30)",
              fontSize: "clamp(14px, 2vw, 17px)",
              lineHeight: 1.65,
              maxWidth: "560px",
              margin: "0 auto 32px",
            }}
          >
            Não fique mais acordado de madrugada com dúvida. Não viva mais na
            incerteza. Em menos de 2 minutos você terá as respostas que precisa —
            de forma segura, anônima e definitiva.
          </p>

          <a
            href={CHECKOUT_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              background: "oklch(0.57 0.26 22)",
              color: "white",
              padding: "20px 48px",
              borderRadius: "12px",
              fontSize: "17px",
              fontWeight: 700,
              textDecoration: "none",
              boxShadow:
                "0 0 50px oklch(0.57 0.26 22 / 0.55), 0 20px 60px -20px oklch(0.57 0.26 22 / 0.4)",
              marginBottom: "16px",
            }}
          >
            ⚡ Descobrir a Verdade Agora — R$19,90 <ArrowRight size={18} />
          </a>

          <div style={{ fontSize: "13px", color: "oklch(0.50 0.02 30)" }}>
            Garantia de 7 dias · Acesso imediato · Pagamento seguro
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FOOTER
// ─────────────────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid oklch(1 0 0 / 6%)",
        padding: "32px 24px",
        maxWidth: "1100px",
        margin: "0 auto",
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "16px",
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Eye size={16} color="oklch(0.57 0.26 22)" />
          <span
            style={{
              fontFamily: "'Sora', system-ui, sans-serif",
              fontWeight: 700,
              fontSize: "15px",
            }}
          >
            Clone<span style={{ color: "oklch(0.57 0.26 22)" }}>X</span>
          </span>
        </div>

        {/* Links */}
        <div style={{ display: "flex", gap: "20px", fontSize: "12px", color: "oklch(0.50 0.02 30)" }}>
          <a href="#" style={{ color: "inherit", textDecoration: "none" }}>
            Política de Privacidade
          </a>
          <a href="#" style={{ color: "inherit", textDecoration: "none" }}>
            Termos de Uso
          </a>
          <a href="#" style={{ color: "inherit", textDecoration: "none" }}>
            Suporte
          </a>
        </div>

        <span style={{ fontSize: "11px", color: "oklch(0.40 0.02 30)" }}>
          © {new Date().getFullYear()} CloneX. Todos os direitos reservados.
        </span>
      </div>

      <p
        style={{
          marginTop: "20px",
          fontSize: "11px",
          color: "oklch(0.38 0.02 30)",
          lineHeight: 1.6,
          maxWidth: "700px",
        }}
      >
        Este serviço é fornecido apenas para fins informativos e de monitoramento parental ou de
        dispositivos que você possui. O uso desta ferramenta para monitorar pessoas sem
        consentimento pode ser ilegal em sua jurisdição. O usuário é o único responsável pelo uso
        do serviço.
      </p>
    </footer>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PRIMITIVES
// ─────────────────────────────────────────────────────────────────────────────

function SectionBadge({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        background: "oklch(0.57 0.26 22 / 0.12)",
        border: "1px solid oklch(0.57 0.26 22 / 0.3)",
        borderRadius: "999px",
        padding: "5px 14px",
        fontSize: "12px",
        fontWeight: 600,
        color: "oklch(0.78 0.14 22)",
        letterSpacing: "0.05em",
        textTransform: "uppercase",
      }}
    >
      {children}
    </span>
  );
}

