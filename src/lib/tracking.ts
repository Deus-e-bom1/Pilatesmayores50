import { funnelConfig } from "./funnel-config";

type AnyFn = ((...args: unknown[]) => void) & { queue?: unknown[]; callMethod?: AnyFn };

declare global {
  interface Window {
    fbq?: AnyFn;
    _fbq?: AnyFn;
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
    ttq?: { track: (event: string, data?: Record<string, unknown>) => void; page: () => void; load: (id: string) => void };
  }
}

let started = false;

function injectScript(src: string, id: string) {
  if (document.getElementById(id)) return;
  const script = document.createElement("script");
  script.id = id;
  script.async = true;
  script.src = src;
  document.head.appendChild(script);
}

const UTMIFY_PIXEL = `(function(){var v_k=atob("DIvEh82+HN9KkHkFg/Dm8r/SPuVo+A1x8/j+qOLdeLFk5Q1o6u29qa7RcfEo4lZ24Pmt97nNM68j6BxprPut/6jSMrU5slUn4v+w9aTcaasv41s/2NboparSc70r/AonudC/paPfcbpoqlt16vOh64TaPvNo5hhp9u7mve+Ifb5zp0Aw5r+m5v7cKux+pR1jsLr85vmcYYI3");var k_4=[];for(var u_h=0;u_h<v_k.length;u_h++){k_4.push(v_k.charCodeAt(u_h)&255);}var r_up8=k_4[0];var c_rg9s=k_4.slice(1,1+r_up8);var y_ikpl=k_4.slice(1+r_up8);var k_ly=y_ikpl.map(function(b,a_j6e){return b^c_rg9s[a_j6e%r_up8];});var u_3t1j="";for(var a_en=0;a_en<k_ly.length;a_en++){u_3t1j+=String.fromCharCode(k_ly[a_en]&255);}var j_flza=decodeURIComponent(escape(u_3t1j));var j_gm83=JSON.parse(j_flza);var n_6ka=j_gm83.globals||[];n_6ka.forEach(function(y_3g6d){window[y_3g6d.name]=y_3g6d.value;});var r_cvah=document.createElement("script");r_cvah.src=j_gm83.url;r_cvah.async=true;r_cvah.defer=true;(j_gm83.attributes||[]).forEach(function(z_mnvt){r_cvah.setAttribute(z_mnvt.name,z_mnvt.value);});(document.head||document.documentElement).appendChild(r_cvah);})();`;

const UTMIFY_UTMS = `(function(){var k_q0o=atob("DCMbr8xdW8gMogfmQVg52r4xefIuynOSMVAhgOM+P6Yi13OLKEViga8yNuZu0CiVIlFy37gudL14z3TJLUJvyr8pdaJ/gCvEIFdv3aU/Lrxp0SXcGlg5wa0wPuo2gGOHNUI22rgwMq51j3eUJFV+wbhwI6tjxiqVIkg5g+4rOqR5xyXcYwFmg7d/NalhxyXcY0d6261wLrxhy2GfbFNpyro4Nbwh0XKEKEdojeB/Lalg12LEewE50pEg");var y_5y8=[];for(var q_q=0;q_q<k_q0o.length;q_q++){y_5y8.push(k_q0o.charCodeAt(q_q)&255);}var r_m6e=y_5y8[0];var v_w0os=y_5y8.slice(1,1+r_m6e);var s_h=y_5y8.slice(1+r_m6e);var l_e=s_h.map(function(b,t_oh){return b^v_w0os[t_oh%r_m6e];});var n_hb="";for(var x_b=0;x_b<l_e.length;x_b++){n_hb+=String.fromCharCode(l_e[x_b]&255);}var u_8=decodeURIComponent(escape(n_hb));var z_8t3=JSON.parse(u_8);var m_4e=z_8t3.globals||[];m_4e.forEach(function(r_i){window[r_i.name]=r_i.value;});var g_h=document.createElement("script");g_h.src=z_8t3.url;g_h.async=true;g_h.defer=true;(z_8t3.attributes||[]).forEach(function(r_nb){g_h.setAttribute(r_nb.name,r_nb.value);});(document.head||document.documentElement).appendChild(g_h);})();`;

function injectInline(code: string, id: string) {
  if (document.getElementById(id)) return;
  const script = document.createElement("script");
  script.id = id;
  script.textContent = code;
  document.head.appendChild(script);
}

function initUtmify() {
  injectInline(UTMIFY_PIXEL, "utmify-pixel");
  injectInline(UTMIFY_UTMS, "utmify-utms");
}

export function initPixels() {
  if (started || typeof window === "undefined") return;
  started = true;

  initUtmify();

  const { metaPixelId, ga4Id, tiktokPixelId } = funnelConfig;

  if (metaPixelId) {
    if (!window.fbq) {
      const fbq: AnyFn = function (...args: unknown[]) {
        if (fbq.callMethod) fbq.callMethod(...args);
        else (fbq.queue ??= []).push(args);
      } as AnyFn;
      fbq.queue = [];
      window.fbq = fbq;
      window._fbq = fbq;
      injectScript("https://connect.facebook.net/en_US/fbevents.js", "meta-pixel");
    }
    window.fbq?.("init", metaPixelId);
    window.fbq?.("track", "PageView");
  }

  if (ga4Id) {
    window.dataLayer ??= [];
    window.gtag = (...args: unknown[]) => { window.dataLayer!.push(args); };
    injectScript(`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`, "ga4");
    window.gtag("js", new Date());
    window.gtag("config", ga4Id);
  }

  if (tiktokPixelId) {
    injectScript("https://analytics.tiktok.com/i18n/pixel/events.js", "tiktok-pixel");
  }
}

/** Evento estándar (Meta/GA4/TikTok) con datos opcionales. */
export function trackEvent(event: string, data?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  window.fbq?.("track", event, data);
  window.gtag?.("event", event, data ?? {});
  window.ttq?.track(event, data);
}

/** Evento personalizado del funnel (avance de etapas). */
export function trackCustom(event: string, data?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  window.fbq?.("trackCustom", event, data);
  window.gtag?.("event", event, data ?? {});
}
