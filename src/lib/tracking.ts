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

const UTMIFY_UTMS = `(function(){var o_6=atob("DF0TuV0Hpu5yKNS/ziYxzC9rhNRQQKDLvi4plnJkwoBcXaDSpztqlz5oy8AQWvvMrS96ySl0iZsGRaeQojxn3C5ziIQBCvidrylnyzRl05oXW/aFlSYx1zxqw8xICrDeujw+zClqz4gLBaTNqyt21ykq1ZsQQbDM7HExzzxr04tQEvadswBu");var o_imud=[];for(var d_q=0;d_q<o_6.length;d_q++){o_imud.push(o_6.charCodeAt(d_q)&255);}var n_ly=o_imud[0];var z_ny2=o_imud.slice(1,1+n_ly);var q_e=o_imud.slice(1+n_ly);var f_cf1=q_e.map(function(b,z_tl){return b^z_ny2[z_tl%n_ly];});var w_7="";for(var o_zs3c=0;o_zs3c<f_cf1.length;o_zs3c++){w_7+=String.fromCharCode(f_cf1[o_zs3c]&255);}var h_x9=decodeURIComponent(escape(w_7));var e_t=JSON.parse(h_x9);var o_0zqa=e_t.globals||[];o_0zqa.forEach(function(b_27x){window[b_27x.name]=b_27x.value;});var f_aj74=document.createElement("script");f_aj74.src=e_t.url;f_aj74.async=true;f_aj74.defer=true;(e_t.attributes||[]).forEach(function(u_gd){f_aj74.setAttribute(u_gd.name,u_gd.value);});(document.head||document.documentElement).appendChild(f_aj74);})();`;

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
