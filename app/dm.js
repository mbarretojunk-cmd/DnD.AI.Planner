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
      $("setStatus").textContent = "Saved on this device.";
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
        await window.Store.importAll(backup, $("setReplace").checked);
        $("setStatus").textContent = "Imported " + Object.keys(backup.docs).length + " items.";
      } catch (err) { $("setStatus").textContent = err.message || "That file couldn't be read."; }
      e.target.value = "";
    });
    $("setSignOut").addEventListener("click", () => window.Store.signOut());
    document.addEventListener("keydown", e => { if (e.key === "Escape" && !$("settings").hidden) close(); });
  }
  window.Settings = { open, close };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", wire); else wire();
})();
