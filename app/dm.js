/*
 * The Dungeon Master: a chat with Claude that knows tonight's game state.
 * The Claude API key is stored only on this device (localStorage) and sent
 * straight to api.anthropic.com. It is never written to the database.
 */
(function () {
  "use strict";
  const $ = id => document.getElementById(id);
  const KEY = "eah-claude-key", MODEL = "eah-dm-model", STYLE = "eah-dm-style";
  const get = k => { try { return localStorage.getItem(k) || ""; } catch (e) { return ""; } };
  const set = (k, v) => { try { v ? localStorage.setItem(k, v) : localStorage.removeItem(k); } catch (e) {} };
  const STYLES = {
    classic: "You speak like a warm, classic fantasy narrator: vivid but brief, encouraging, a little epic.",
    cheeky: "You are a cheeky, sarcastic tavern-style DM. You tease him lightly when chores slip (never cruel, never about his worth), and you celebrate wins loudly."
  };
  let messages = [], busy = false, loaded = false;

  function systemPrompt() {
    const style = STYLES[get(STYLE) || "classic"];
    const party = (window.EAH && window.EAH.party ? window.EAH.party() : []).map(p => p.name + " the " + p.cls).join(", ");
    return [
      "You are the Dungeon Master of \"Evenings at Home\", a personal habit tracker turned into a fantasy RPG for one player, Márcio, a researcher in Portugal who gets home around 18:30, does chores until 21:30, then has free time (reading, World of Warcraft) until midnight.",
      "His party (" + party + ") gets stronger when he does real-life tasks and takes damage when daily tasks are missed. Each task done hits tonight's monster for 10 HP.",
      style,
      "Rules: keep replies short (2 to 5 sentences unless he asks for more). Ground everything in the game state below; never claim a task is done if it isn't listed as done. When he feels overwhelmed, shrink the next step to one tiny concrete action and be kind. Never shame him. Respond in the language he writes in.",
      "If he asks for a side quest, or a big task should be broken down, end your reply with exactly one line in this format: QUEST: <short title> | <step 1> ; <step 2> ; <step 3> (3 to 6 small concrete steps). Otherwise never output QUEST lines.",
      "Current game state:\n" + (window.EAH ? window.EAH.context() : "unavailable")
    ].join("\n\n");
  }

  async function load() {
    if (loaded) return; loaded = true;
    const db = window.EAH && window.EAH.db();
    if (!db) return;
    db.doc("dm/chat").onSnapshot(s => { const d = s.exists ? s.data() : null; messages = d && Array.isArray(d.messages) ? d.messages : []; draw(); });
  }
  function save() { const db = window.EAH && window.EAH.db(); if (db) db.doc("dm/chat").set({ messages: messages.slice(-60), updatedAt: new Date().toISOString() }); }

  function parseQuest(text) {
    const m = text.match(/^QUEST:\s*(.+?)\s*\|\s*(.+)$/m);
    if (!m) return { text, quest: null };
    const steps = m[2].split(";").map(s => s.trim()).filter(Boolean).slice(0, 8);
    return { text: text.replace(m[0], "").trim(), quest: steps.length ? { title: m[1].slice(0, 80), steps } : null };
  }

  function draw() {
    const log = $("dmLog"); if (!log) return;
    const hasKey = !!get(KEY);
    $("dmNoKey").hidden = hasKey;
    log.innerHTML = "";
    if (!messages.length) {
      const p = document.createElement("p"); p.className = "small muted";
      p.textContent = "Ask for tonight's battle story, a gentle nudge, or a side quest. The DM sees your to-do list, the monster and your party.";
      log.appendChild(p);
    }
    messages.forEach((m, i) => {
      const b = document.createElement("div"); b.className = "dmmsg " + (m.role === "user" ? "me" : "dm");
      const { text, quest } = m.role === "assistant" ? parseQuest(m.content) : { text: m.content, quest: null };
      const t = document.createElement("div"); t.textContent = text; b.appendChild(t);
      if (quest && !m.questTaken) {
        const card = document.createElement("div"); card.className = "dmquest";
        const h = document.createElement("b"); h.textContent = "Quest: " + quest.title; card.appendChild(h);
        const ol = document.createElement("ol"); quest.steps.forEach(s => { const li = document.createElement("li"); li.textContent = s; ol.appendChild(li); }); card.appendChild(ol);
        const btn = document.createElement("button"); btn.type = "button"; btn.className = "btn-small"; btn.textContent = "Accept quest";
        btn.onclick = () => { window.EAH.addQuest(quest.title, quest.steps); m.questTaken = true; save(); draw(); };
        card.appendChild(btn); b.appendChild(card);
      } else if (quest) { const s = document.createElement("div"); s.className = "small muted"; s.textContent = "Quest accepted. It's in the Quests tab."; b.appendChild(s); }
      log.appendChild(b);
    });
    if (busy) { const d = document.createElement("div"); d.className = "dmmsg dm typing"; d.textContent = "The DM rolls a d20…"; log.appendChild(d); }
    log.scrollTop = log.scrollHeight;
    $("dmSend").disabled = busy || !hasKey;
  }

  async function ask(text) {
    text = (text || "").trim(); if (!text || busy) return;
    const key = get(KEY); if (!key) { draw(); return; }
    messages.push({ role: "user", content: text, at: new Date().toISOString() });
    busy = true; draw(); save();
    try {
      const convo = messages.slice(-16).map(m => ({ role: m.role, content: m.content }));
      while (convo.length && convo[0].role !== "user") convo.shift();
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "content-type": "application/json", "x-api-key": key, "anthropic-version": "2023-06-01", "anthropic-dangerous-direct-browser-access": "true" },
        body: JSON.stringify({ model: get(MODEL) || "claude-haiku-5-5", max_tokens: 500, system: systemPrompt(), messages: convo })
      });
      if (!res.ok) {
        const msg = res.status === 401 ? "Your Claude API key was rejected. Check it in Settings." : res.status === 429 || res.status === 529 ? "The DM is busy right now. Try again in a minute." : res.status === 400 ? "The request was refused (" + res.status + "). Check the model and your credit in the Anthropic console." : "Something went wrong (" + res.status + ").";
        throw new Error(msg);
      }
      const data = await res.json();
      const out = (data.content || []).filter(c => c.type === "text").map(c => c.text).join("\n").trim() || "…";
      messages.push({ role: "assistant", content: out, at: new Date().toISOString() });
    } catch (e) {
      messages.push({ role: "assistant", content: (e && e.message && !/Failed to fetch/i.test(e.message)) ? e.message : "I couldn't reach the DM. Check your connection.", error: true, at: new Date().toISOString() });
    }
    busy = false; save(); draw();
  }

  function wire() {
    $("dmForm").addEventListener("submit", e => { e.preventDefault(); const v = $("dmInput").value; $("dmInput").value = ""; ask(v); });
    document.querySelectorAll("[data-dm]").forEach(b => b.addEventListener("click", () => ask(b.getAttribute("data-dm"))));
    $("dmClear").addEventListener("click", () => { messages = []; save(); draw(); });
    $("dmOpenSettings").addEventListener("click", () => window.Settings && window.Settings.open());
  }

  window.DM = {
    render: () => { load(); draw(); },
    keys: { KEY, MODEL, STYLE }, get, set
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", wire); else wire();
})();

/* ---------------- Settings ---------------- */
(function () {
  "use strict";
  const $ = id => document.getElementById(id);
  function open() {
    $("settings").hidden = false; document.body.style.overflow = "hidden";
    const d = window.DM;
    $("setKey").value = d.get(d.keys.KEY);
    $("setModel").value = d.get(d.keys.MODEL) || "claude-haiku-5-5";
    $("setStyle").value = d.get(d.keys.STYLE) || "classic";
    const mode = window.Store.mode;
    $("setMode").textContent = mode === "synced" ? "Synced with your Supabase account" : "Stored on this device only";
    $("setSignOut").hidden = mode !== "synced";
    if (mode === "synced") window.Store.email().then(e => { if (e) $("setMode").textContent = "Synced as " + e + (window.Store.pendingCount() ? " · " + window.Store.pendingCount() + " change(s) waiting to upload" : ""); });
    $("setStatus").textContent = "";
    $("setVersion").textContent = "App version " + (window.EAH_VERSION || "?");
  }
  function close() { $("settings").hidden = true; document.body.style.overflow = ""; if (window.DM) window.DM.render(); }
  function wire() {
    $("openSettings").addEventListener("click", open);
    $("setClose").addEventListener("click", close);
    $("setSave").addEventListener("click", () => {
      const d = window.DM;
      d.set(d.keys.KEY, $("setKey").value.trim());
      d.set(d.keys.MODEL, $("setModel").value);
      d.set(d.keys.STYLE, $("setStyle").value);
      // the DM's style also goes to the reminders, so they speak the same way
      window.Store.ready().then(db => db && db.doc("settings/dm").set({ style: $("setStyle").value })).catch(() => {});
      $("setStatus").textContent = "Saved. The key stays on this device; the DM style also applies to your reminders.";
    });
    $("setExport").addEventListener("click", () => {
      const data = JSON.stringify(window.Store.exportAll(), null, 1);
      const a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([data], { type: "application/json" }));
      a.download = "evenings-at-home-backup-" + new Date().toISOString().slice(0, 10) + ".json";
      document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
      $("setStatus").textContent = "Backup downloaded.";
    });
    $("setImportFile").addEventListener("change", async e => {
      const f = e.target.files && e.target.files[0]; if (!f) return;
      try {
        const backup = JSON.parse(await f.text());
        await window.Store.importAll(backup, $("setReplace").checked, (d, t) => window.showProgress("Importing your backup", d, t));
        $("setStatus").textContent = "Imported " + Object.keys(backup.docs).length + " items.";
      } catch (err) { $("setStatus").textContent = err.message || "That file couldn't be read."; }
      e.target.value = "";
    });
    $("setSignOut").addEventListener("click", () => window.Store.signOut());
    $("setStarter").addEventListener("click", async () => {
      $("setStatus").textContent = "Loading…";
      try { const n = await window.loadStarter(); $("setStatus").textContent = "Loaded " + n + " items. Rename your party in the Party tab."; }
      catch (e) { $("setStatus").textContent = "Couldn't load the starter set. Check your connection."; }
    });
    document.addEventListener("keydown", e => { if (e.key === "Escape" && !$("settings").hidden) close(); });
  }
  window.Settings = { open, close };
  // green progress bar at the bottom of the screen
  window.showProgress = (label, done, total) => {
    let el = document.getElementById("progressToast");
    if (!el) {
      el = document.createElement("div"); el.id = "progressToast"; el.className = "ptoast"; el.setAttribute("role", "status");
      el.innerHTML = '<div class="ptoast-row"><span class="ptoast-label"></span><span class="ptoast-num"></span></div><div class="ptoast-bar"><span></span></div>';
      document.body.appendChild(el);
    }
    clearTimeout(el._t); el.hidden = false; el.classList.remove("done");
    const pct = total ? Math.round(done / total * 100) : 0;
    el.querySelector(".ptoast-bar span").style.width = pct + "%";
    if (total && done >= total) {
      el.classList.add("done");
      el.querySelector(".ptoast-label").textContent = "Done";
      el.querySelector(".ptoast-num").textContent = "✓ " + total + " items";
      el._t = setTimeout(() => { el.hidden = true; }, 2500);
    } else {
      el.querySelector(".ptoast-label").textContent = label + "…";
      el.querySelector(".ptoast-num").textContent = done + " / " + total;
    }
  };
  window.loadStarter = async () => {
    const res = await fetch("starter.json", { cache: "no-store" });
    if (!res.ok) throw new Error("not found");
    const data = await res.json();
    await window.Store.importAll(data, false, (d, t) => window.showProgress("Loading the starter set", d, t));
    return Object.keys(data.docs).length;
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", wire); else wire();
})();

/* ---------------- Phone reminders (web push) ---------------- */
(function () {
  "use strict";
  const $ = id => document.getElementById(id);
  const cfg = window.EAH_CONFIG || {};
  const supported = "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
  function b64ToUint8(b64) { const pad = "=".repeat((4 - b64.length % 4) % 4); const s = atob((b64 + pad).replace(/-/g, "+").replace(/_/g, "/")); return Uint8Array.from(s, c => c.charCodeAt(0)); }
  async function subId(sub) { const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(sub.endpoint)); return Array.from(new Uint8Array(buf)).slice(0, 8).map(b => b.toString(16).padStart(2, "0")).join(""); }
  async function current() { if (!supported) return null; const reg = await navigator.serviceWorker.ready; return reg.pushManager.getSubscription(); }
  async function refresh() {
    const st = $("pushState"); if (!st) return;
    if (!supported) { st.textContent = "This browser can't receive reminders. Install the app from Chrome on Android."; $("pushOn").hidden = true; return; }
    if (window.Store.mode !== "synced") { st.textContent = "Reminders need sync to be set up first."; $("pushOn").disabled = true; return; }
    const sub = await current().catch(() => null);
    const perm = Notification.permission;
    if (perm === "denied") st.textContent = "Notifications are blocked for this app. Allow them in Android settings → Apps → Evenings → Notifications.";
    else st.textContent = sub ? "On for this phone." : "Off for this phone.";
    $("pushOn").hidden = !!sub; $("pushOff").hidden = !sub;
  }
  async function turnOn() {
    $("pushState").textContent = "Asking for permission…";
    try {
      const perm = await Notification.requestPermission();
      if (perm !== "granted") { await refresh(); return; }
      const reg = await navigator.serviceWorker.ready;
      let sub = await reg.pushManager.getSubscription();
      const keyNow = b64ToUint8(cfg.vapidPublicKey);
      if (sub && sub.options && sub.options.applicationServerKey) {
        const old = new Uint8Array(sub.options.applicationServerKey);
        if (old.length !== keyNow.length || old.some((v, i) => v !== keyNow[i])) { await sub.unsubscribe(); sub = null; }
      }
      if (!sub) sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: b64ToUint8(cfg.vapidPublicKey) });
      const db = await window.Store.ready();
      await db.doc("push/" + await subId(sub)).set({ subscription: sub.toJSON(), device: navigator.userAgent.slice(0, 120), createdAt: new Date().toISOString() });
      $("pushState").textContent = "On for this phone. The first nudge comes at the next reminder time.";
      $("pushOn").hidden = true; $("pushOff").hidden = false;
    } catch (e) { $("pushState").textContent = "Couldn't turn reminders on: " + (e && e.message ? e.message : e); }
  }
  async function turnOff() {
    try {
      const sub = await current(); if (!sub) return refresh();
      const db = await window.Store.ready(); await db.doc("push/" + await subId(sub)).delete();
      await sub.unsubscribe(); await refresh();
    } catch (e) { $("pushState").textContent = "Couldn't turn reminders off: " + (e && e.message ? e.message : e); }
  }
  async function test() {
    try {
      if (Notification.permission !== "granted") { const p = await Notification.requestPermission(); if (p !== "granted") return refresh(); }
      const reg = await navigator.serviceWorker.ready;
      await reg.showNotification("Dish Hydra appears", { body: "This is what a reminder looks like.", icon: "icons/monsters/dish-hydra.png", badge: "icons/badge.png", tag: "evenings-test" });
    } catch (e) { $("pushState").textContent = "Couldn't show a notification: " + (e && e.message ? e.message : e); }
  }
  function wire() {
    $("pushOn").addEventListener("click", turnOn);
    $("pushOff").addEventListener("click", turnOff);
    $("pushTest").addEventListener("click", test);
    $("openSettings").addEventListener("click", () => setTimeout(refresh, 0));
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", wire); else wire();
})();
