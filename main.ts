document.addEventListener("DOMContentLoaded", () => {
  const r = document.documentElement as HTMLElement;
  const d = document.getElementById("drawer") as HTMLElement;
  const s = document.getElementById("themePreset") as HTMLSelectElement;  const wash = (): void => {["--lg-accent","--lg-accent2","--lg-accent3","--lg-bg0","--lg-sfc","--lg-text","--lg-muted","--lg-stroke"].forEach(p=>r.style.removeProperty(p))};  document.addEventListener("click", (e: MouseEvent) => {
    const t = e.target as HTMLElement;if(t.closest("#btnAppearance"))d.classList.add("open");if(t.closest("#closeDrawerBtn"))d.classList.remove("open");if(t.classList.contains("tab")){const tbs=document.querySelectorAll(".tab"),pns=document.querySelectorAll(".panel"),i=Array.from(tbs).indexOf(t);tbs.forEach(x=>x.classList.remove("active"));pns.forEach(x=>x.style.display="none");t.classList.add("active");if(pns[i])pns[i].style.display="flex"}});  s.onchange = (e: Event) => {
    wash();
    r.setAttribute("data-theme", (e.target as HTMLSelectElement).value);  const inp = (id: string, p: string): void => {
    const e = document.getElementById(id) as HTMLInputElement;
    if (e)
      e.oninput = (x: Event) =>
        r.style.setProperty(p, (x.target as HTMLInputElement).value);
  };inp("accentColor","--lg-accent");inp("accent2Color","--lg-accent2");inp("accent3Color","--lg-accent3");inp("bgBaseColor","--lg-bg0");inp("surfaceColor","--lg-sfc");inp("textColor","--lg-text");inp("mutedColor","--lg-muted");inp("strokeColor","--lg-stroke");});
