/*
 * Tap-for-info tooltips.
 * Any element with data-tip (or a title) shows a small bubble:
 *  - tap it, when it isn't itself a button or link;
 *  - press and hold it, when it is (so a tap still does its normal job).
 */
(function () {
  "use strict";
  const HOLD_MS = 450;
  let bubble = null, hideTimer = null, holdTimer = null, start = null, swallowClick = false, shownFor = null;

  function ensure() {
    if (bubble) return bubble;
    bubble = document.createElement("div");
    bubble.className = "tip"; bubble.setAttribute("role", "tooltip"); bubble.hidden = true;
    document.body.appendChild(bubble);
    return bubble;
  }
  function tipOf(el) { return el.getAttribute("data-tip") || el.getAttribute("title") || ""; }
  function target(node) { return node && node.closest ? node.closest("[data-tip],[title]") : null; }
  function interactive(el) { return !!el.closest("button,a,input,select,textarea,summary,label,[role=tab]"); }

  function show(el) {
    const text = tipOf(el); if (!text) return false;
    const b = ensure(); b.textContent = text; b.hidden = false; b.classList.remove("below");
    const r = el.getBoundingClientRect(), vw = document.documentElement.clientWidth;
    b.style.left = "0px"; b.style.top = "0px"; b.style.maxWidth = Math.min(300, vw - 24) + "px";
    const bw = b.offsetWidth, bh = b.offsetHeight;
    let left = r.left + r.width / 2 - bw / 2; left = Math.max(12, Math.min(vw - bw - 12, left));
    let top = r.top - bh - 10;
    if (top < 8) { top = r.bottom + 10; b.classList.add("below"); }
    b.style.left = left + "px"; b.style.top = top + "px";
    b.style.setProperty("--ax", Math.max(14, Math.min(bw - 14, r.left + r.width / 2 - left)) + "px");
    shownFor = el;
    clearTimeout(hideTimer); hideTimer = setTimeout(hide, Math.min(9000, 2500 + text.length * 45));
    return true;
  }
  function hide() { if (bubble) bubble.hidden = true; shownFor = null; clearTimeout(hideTimer); }

  // press and hold: works on buttons too
  document.addEventListener("pointerdown", e => {
    clearTimeout(holdTimer); swallowClick = false;
    const el = target(e.target); if (!el) return;
    start = { x: e.clientX, y: e.clientY };
    holdTimer = setTimeout(() => { if (show(el)) { swallowClick = true; try { if (navigator.vibrate) navigator.vibrate(15); } catch (x) {} } }, HOLD_MS);
  }, true);
  document.addEventListener("pointermove", e => { if (start && Math.hypot(e.clientX - start.x, e.clientY - start.y) > 10) clearTimeout(holdTimer); }, true);
  ["pointerup", "pointercancel"].forEach(t => document.addEventListener(t, () => { clearTimeout(holdTimer); start = null; }, true));

  document.addEventListener("click", e => {
    if (swallowClick) { swallowClick = false; e.preventDefault(); e.stopPropagation(); return; }
    const el = target(e.target);
    if (el && !interactive(el)) {
      if (shownFor === el) hide(); else show(el);
      return;
    }
    hide();
  }, true);
  // a long press opens the phone's context menu on some elements; skip it where a tip exists
  document.addEventListener("contextmenu", e => { if (target(e.target)) e.preventDefault(); }, true);
  window.addEventListener("scroll", hide, { passive: true });
  window.addEventListener("resize", hide);
  document.addEventListener("keydown", e => { if (e.key === "Escape") hide(); });
})();
