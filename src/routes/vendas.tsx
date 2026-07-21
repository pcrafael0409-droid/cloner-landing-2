import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Eye } from "lucide-react";

export const Route = createFileRoute("/vendas")({
  head: () => ({
    meta: [
      { title: "Espião — Checkout" },
      { name: "description", content: "Finalize seu acesso ao Espião." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: VendasPage,
});

// URL do checkout
const CHECKOUT_URL = "https://pay.cakto.com.br/zv5heyg_994345";

function VendasPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#050505",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      <div style={{ textAlign: "center", maxWidth: "480px" }}>
        <div
          style={{
            width: "64px",
            height: "64px",
            borderRadius: "50%",
            background: "#dc2626",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 24px",
            boxShadow: "0 0 30px #dc2626aa",
          }}
        >
          <Eye size={28} color="white" />
        </div>
        <h1
          style={{
            fontFamily: "'Sora', system-ui, sans-serif",
            fontSize: "24px",
            fontWeight: 700,
            marginBottom: "12px",
          }}
        >
          Redirecionando para o checkout...
        </h1>
        <p style={{ color: "#666", fontSize: "14px", marginBottom: "32px" }}>
          Você será redirecionado automaticamente. Se não for, clique no botão abaixo.
        </p>

        <a
          href={CHECKOUT_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-block",
            background: "#dc2626",
            color: "white",
            padding: "16px 40px",
            borderRadius: "10px",
            fontSize: "16px",
            fontWeight: 700,
            textDecoration: "none",
            boxShadow: "0 0 30px #dc262666",
            marginBottom: "20px",
          }}
        >
          Ir para o Checkout
        </a>

        <div>
          <Link
            to="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "13px",
              color: "#555",
              textDecoration: "none",
            }}
          >
            <ArrowLeft size={14} /> Voltar
          </Link>
        </div>
      </div>
    </div>
  );
}
