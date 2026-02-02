import { DailyData, OpenMeteoResponse, TeleportCategory, TeleportResponse } from '../../types';

function el<T extends HTMLElement>(sel: string, root?: Document | HTMLElement): T | null {
  return (root || document).querySelector<T>(sel);
}

function esc(s: string | null | undefined): string {
  return String(s || "").replace(/[&<>"']/g, (c) =>
    (({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" } as { [key: string]: string })[c])
  );
}

function setText(node: HTMLElement | null, html: string): void {
  if (!node) return;
  node.innerHTML = html;
}

function fmt(n: number): number | string {
  if (typeof n !== "number" || !isFinite(n)) return "—";
  return Math.round(n);
}

function initUnsplash(): void {
  const img = el<HTMLImageElement>("img.lg-live-photo[data-unsplash]");
  if (!img) return;
  const q: string = img.getAttribute("data-unsplash") || "travel";
  const w: string = img.getAttribute("data-unsplash-w") || "1600";
  const h: string = img.getAttribute("data-unsplash-h") || "900";
  // "source.unsplash.com" provides free, unauthenticated context imagery.
  const url: string = "https://source.unsplash.com/" + w + "x" + h + "/?" + encodeURIComponent(q);
  img.src = url;
}

  function initMap(): void {
  const mapNode = el<HTMLDivElement>("#lg-map");
  if (!mapNode) return;

  const lat: number = parseFloat(document.body.getAttribute("data-lg-lat") || "");
  const lon: number = parseFloat(document.body.getAttribute("data-lg-lon") || "");
  const zoom: number = parseInt(document.body.getAttribute("data-lg-zoom") || "6", 10);

  if (!isFinite(lat) || !isFinite(lon)) {
    setText(mapNode, "<div class='lg-fallback muted'>Map unavailable (missing coordinates).</div>");
    return;
  }

  // Declare L as any for now, assuming Leaflet is loaded globally.
  // In a full TS project, you would import Leaflet types.
  if (!(window as any).L) {
    setText(mapNode, "<div class='lg-fallback muted'>Map library not loaded.</div>");
    return;
  }

  try {
    const L = (window as any).L;
    const m = L.map(mapNode, { zoomControl: true, scrollWheelZoom: false }).setView([lat, lon], zoom);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 18,
      attribution: "&copy; OpenStreetMap contributors"
    }).addTo(m);
    L.circleMarker([lat, lon], { radius: 7 }).addTo(m);
  } catch (e: unknown) {
    setText(mapNode, "<div class='lg-fallback muted'>Map failed to initialize.</div>");
  }
}



async function initWeather(): Promise<void> {
  const out = el<HTMLElement>("[data-role='weather']");
  if (!out) return;

  const lat: number = parseFloat(document.body.getAttribute("data-lg-lat") || "");
  const lon: number = parseFloat(document.body.getAttribute("data-lg-lon") || "");
  if (!isFinite(lat) || !isFinite(lon)) {
    setText(out, "<span class='muted'>Weather context unavailable (missing coordinates).</span>");
    return;
  }

  // Open-Meteo forecast API (no key). We use it as a lightweight "reality check" preview.
  const url: string =
    "https://api.open-meteo.com/v1/forecast?latitude=" +
    encodeURIComponent(lat) +
    "&longitude=" +
    encodeURIComponent(lon) +
    "&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto";
  try {
    const r: Response = await fetch(url, { cache: "no-store" });
    if (!r.ok) throw new Error("HTTP " + r.status);
    const data: OpenMeteoResponse = await r.json();

    const t: string[] = data && data.daily && data.daily.time ? data.daily.time : [];
    const tmax: number[] = data && data.daily && data.daily.temperature_2m_max ? data.daily.temperature_2m_max : [];
    const tmin: number[] = data && data.daily && data.daily.temperature_2m_min ? data.daily.temperature_2m_min : [];
    const psum: number[] = data && data.daily && data.daily.precipitation_sum ? data.daily.precipitation_sum : [];

    const rows: string[] = [];
    const n: number = Math.min(7, t.length, tmax.length, tmin.length);
    for (let i = 0; i < n; i++) {
      rows.push(
        `<tr><td class='muted'>${esc(t[i])}</td><td>${fmt(tmin[i])}° / ${fmt(
          tmax[i]
        )}°</td><td class='muted'>${fmt(psum[i])} mm</td></tr>`
      );
    }

    if (!rows.length) {
      setText(out, "<span class='muted'>Weather context unavailable.</span>");
      return;
    }

    setText(
      out,
      "<div class='muted' style='margin-bottom:8px;'>7‑day sample (planning reality check, not availability).</div>" +
        "<table class='lg-mini-table'><thead><tr><th>Date</th><th>Temp</th><th>Precip</th></tr></thead><tbody>" +
        rows.join("") +
        "</tbody></table>"
    );
  } catch (e: unknown) {
    setText(out, "<span class='muted'>Weather context could not be loaded right now.</span>");
  }
}



async function initTeleport(): Promise<void> {
  const out = el<HTMLElement>("[data-role='teleport']");
  if (!out) return;

  const slug: string = document.body.getAttribute("data-lg-teleport") || "";
  if (!slug) {
    setText(out, "<span class='muted'>City signals: not available for this page (country/region view).</span>");
    return;
  }

  const url: string = "https://api.teleport.org/api/urban_areas/slug:" + encodeURIComponent(slug) + "/scores/";
  try {
    const r: Response = await fetch(url, { cache: "no-store" });
    if (!r.ok) throw new Error("HTTP " + r.status);
    const data: TeleportResponse = await r.json();

    let summary: string = (data && data.summary) ? String(data.summary) : "";
    summary = summary.replace(/<[^>]+>/g, ""); // strip HTML
    summary = summary.trim();

    const cats: TeleportCategory[] = (data && data.categories) ? data.categories.slice(0) : [];
    cats.sort(function (a: TeleportCategory, b: TeleportCategory) { return (b.score_out_of_10 || 0) - (a.score_out_of_10 || 0); });
    const top: string[] = cats.slice(0, 4).map(function (c: TeleportCategory) {
      const name: string = c && c.name ? c.name : "Signal";
      const score: number = (c && typeof c.score_out_of_10 === "number") ? (c.score_out_of_10 * 10) : NaN;
      return `<li><span class='muted'>${esc(name)}:</span> ${fmt(score)}/100</li>`;
    });

    let html: string = "";
    if (summary) html += `<div class='muted' style='margin-bottom:8px;'>${esc(summary)}</div>`;
    if (top.length) html += `<ul class='lg-signal-list'>${top.join("")}</ul>`;
    if (!html) html = "<span class='muted'>City signals unavailable.</span>";
    setText(out, html);
  } catch (e: unknown) {
    setText(out, "<span class='muted'>City signals could not be loaded right now.</span>");
  }
}

function boot(): void {
  initUnsplash();
  initMap();
  initWeather();
  initTeleport();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}
