/*
 * Evenings at Home — data store.
 *
 * Gives app.js the same small document API the original Claude artifact used
 * (collection / doc / onSnapshot / set / update / delete / add), backed by:
 *   - "local" mode: everything in this browser's localStorage (works offline, one device)
 *   - "synced" mode: a Supabase table `docs`, mirrored locally for offline start,
 *     with live updates from other devices.
 *
 * Every document lives at a path "collection/id" and holds plain JSON.
 */
(function () {
  "use strict";
  const CACHE_KEY = "eah-db-v1";
  const PENDING_KEY = "eah-pending-v1";
  const cfg = window.EAH_CONFIG || {};
  const synced = !!(cfg.supabaseUrl && cfg.supabaseAnonKey && window.supabase);

  const clone = v => (v === undefined ? undefined : JSON.parse(JSON.stringify(v)));
  function deepMerge(base, patch) {
    const out = Object.assign({}, base);
    Object.keys(patch).forEach(k => {
      const v = patch[k];
      if (v && typeof v === "object" && !Array.isArray(v) && out[k] && typeof out[k] === "object" && !Array.isArray(out[k])) out[k] = deepMerge(out[k], v);
      else out[k] = v;
    });
    return out;
  }
  function readJSON(key, fallback) { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch (e) { return fallback; } }
  function writeJSON(key, v) { try { localStorage.setItem(key, JSON.stringify(v)); } catch (e) {} }

  /* ---------- in-memory document map with listeners ---------- */
  const docs = new Map(Object.entries(readJSON(CACHE_KEY, {})));
  const colListeners = new Map(), docListeners = new Map();
  let saveTimer = null;
  function saveCache() { clearTimeout(saveTimer); saveTimer = setTimeout(() => writeJSON(CACHE_KEY, Object.fromEntries(docs)), 150); }
  function colOf(path) { return path.slice(0, path.lastIndexOf("/")); }
  function emit(path) {
    (colListeners.get(colOf(path)) || new Set()).forEach(fn => fn());
    (docListeners.get(path) || new Set()).forEach(fn => fn());
  }
  function emitAll() { colListeners.forEach(set => set.forEach(fn => fn())); docListeners.forEach(set => set.forEach(fn => fn())); }
  function snapDoc(path) {
    const d = docs.get(path);
    return { id: path.split("/").pop(), exists: d !== undefined, data: () => clone(d), metadata: { fromCache: false, hasPendingWrites: false } };
  }
  function colDocs(col) {
    const pre = col + "/", out = [];
    docs.forEach((d, p) => { if (p.startsWith(pre) && !p.slice(pre.length).includes("/")) out.push(snapDoc(p)); });
    return out;
  }
  function listen(map, key, fn) {
    if (!map.has(key)) map.set(key, new Set());
    map.get(key).add(fn);
    setTimeout(fn, 0);
    return () => map.get(key) && map.get(key).delete(fn);
  }

  /* ---------- remote (Supabase) ---------- */
  let sb = null, userId = null;
  const pending = readJSON(PENDING_KEY, []);
  async function pushRemote(op) {
    if (!synced || !userId) return;
    try {
      if (op.data === null) { const { error } = await sb.from("docs").delete().eq("user_id", userId).eq("path", op.path); if (error) throw error; }
      else { const { error } = await sb.from("docs").upsert({ user_id: userId, path: op.path, data: op.data, updated_at: new Date().toISOString() }, { onConflict: "user_id,path" }); if (error) throw error; }
    } catch (e) {
      pending.push(op); writeJSON(PENDING_KEY, pending);
      throw e;
    }
  }
  async function flushPending() {
    if (!synced || !userId || !pending.length) return;
    const ops = pending.splice(0, pending.length); writeJSON(PENDING_KEY, pending);
    for (const op of ops) { try { await pushRemote(op); } catch (e) { break; } }
  }
  async function pullRemote() {
    if (!synced || !userId) return;
    const all = []; let from = 0; const size = 1000;
    for (;;) {
      const { data, error } = await sb.from("docs").select("path,data").eq("user_id", userId).range(from, from + size - 1);
      if (error) throw error;
      all.push(...data); if (data.length < size) break; from += size;
    }
    // first sign-in on a fresh account: upload what's on this device instead of wiping it
    if (!all.length && docs.size) {
      const local = Array.from(docs.entries()); let i = 0;
      if (window.showProgress) window.showProgress("Uploading your data", 0, local.length);
      for (const [path, data] of local) { try { await pushRemote({ path, data }); } catch (e) {} i++; if (window.showProgress) window.showProgress("Uploading your data", i, local.length); }
      return;
    }
    const pendingPaths = new Set(pending.map(p => p.path));
    const remote = new Map(all.map(r => [r.path, r.data]));
    // keep local edits that haven't reached the server yet
    docs.forEach((v, p) => { if (!remote.has(p) && !pendingPaths.has(p)) docs.delete(p); });
    remote.forEach((v, p) => { if (!pendingPaths.has(p)) docs.set(p, v); });
    saveCache(); emitAll();
  }

  /* ---------- writes ---------- */
  async function write(path, data) {
    if (data === null) docs.delete(path); else docs.set(path, clone(data));
    saveCache(); emit(path);
    if (synced) { try { await pushRemote({ path, data: data === null ? null : clone(data) }); } catch (e) { /* queued, retried later */ } }
  }

  /* ---------- the API app.js uses ---------- */
  function docRef(path) {
    return {
      id: path.split("/").pop(), path,
      get: async () => snapDoc(path),
      set: data => write(path, data),
      update: async patch => { const cur = docs.get(path); if (cur === undefined) { const e = new Error("Document does not exist"); e.code = "invalid_argument"; throw e; } return write(path, deepMerge(cur, patch)); },
      delete: () => write(path, null),
      onSnapshot: (next) => listen(docListeners, path, () => next(snapDoc(path))),
      collection: sub => colRef(path + "/" + sub)
    };
  }
  function query(col, order, lim) {
    const run = () => {
      let list = colDocs(col);
      if (order) list.sort((a, b) => { const x = (a.data() || {})[order.f], y = (b.data() || {})[order.f]; const c = x === y ? 0 : x === undefined ? 1 : y === undefined ? -1 : x < y ? -1 : 1; return order.dir === "desc" ? -c : c; });
      else list.sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
      if (lim) list = list.slice(0, lim);
      return { docs: list, size: list.length, empty: !list.length, docChanges: () => [], metadata: { fromCache: false, hasPendingWrites: false } };
    };
    return {
      orderBy: (f, dir) => query(col, { f, dir: dir || "asc" }, lim),
      limit: n => query(col, order, n),
      where: () => query(col, order, lim),
      get: async () => run(),
      onSnapshot: (next) => listen(colListeners, col, () => next(run()))
    };
  }
  function colRef(col) {
    const q = query(col);
    return Object.assign(q, {
      path: col,
      doc: id => docRef(col + "/" + (id || (Date.now().toString(36) + Math.random().toString(36).slice(2, 7)))),
      add: async data => { const ref = docRef(col + "/" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7)); await ref.set(data); return ref; }
    });
  }
  const db = { collection: colRef, doc: docRef };

  /* ---------- sign-in screen (synced mode only) ---------- */
  function authScreen() {
    return new Promise(resolve => {
      const el = document.getElementById("auth"); el.hidden = false;
      const status = document.getElementById("authStatus");
      const go = async mode => {
        const email = document.getElementById("authEmail").value.trim(), password = document.getElementById("authPass").value;
        if (!email || password.length < 6) { status.textContent = "Enter your email and a password of at least 6 characters."; return; }
        status.textContent = mode === "up" ? "Creating your account…" : "Signing in…";
        const res = mode === "up" ? await sb.auth.signUp({ email, password }) : await sb.auth.signInWithPassword({ email, password });
        if (res.error) { status.textContent = res.error.message; return; }
        if (!res.data.session) { status.textContent = "Account created. Confirm the email Supabase just sent you, then come back and sign in."; return; }
        el.hidden = true; resolve(res.data.session);
      };
      document.getElementById("authIn").onclick = () => go("in");
      document.getElementById("authUp").onclick = () => go("up");
      document.getElementById("authForm").onsubmit = e => { e.preventDefault(); go("in"); };
    });
  }

  let readyPromise = null;
  async function start() {
    if (!synced) return db;
    sb = window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseAnonKey, { auth: { persistSession: true, autoRefreshToken: true } });
    let { data: { session } } = await sb.auth.getSession();
    if (!session) session = await authScreen();
    userId = session.user.id;
    try { await flushPending(); await pullRemote(); } catch (e) { console.warn("Sync failed, using the copy on this device", e); }
    sb.channel("docs-" + userId)
      .on("postgres_changes", { event: "*", schema: "public", table: "docs", filter: "user_id=eq." + userId }, payload => {
        const row = payload.new && payload.new.path ? payload.new : payload.old;
        if (!row || !row.path) return;
        if (payload.eventType === "DELETE") docs.delete(row.path); else docs.set(row.path, payload.new.data);
        saveCache(); emit(row.path);
      })
      .subscribe();
    document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible") flushPending().then(pullRemote).catch(() => {}); });
    window.addEventListener("online", () => flushPending().then(pullRemote).catch(() => {}));
    return db;
  }

  window.Store = {
    mode: synced ? "synced" : "local",
    ready: () => (readyPromise = readyPromise || start()),
    email: async () => { if (!sb) return null; const { data } = await sb.auth.getUser(); return data.user ? data.user.email : null; },
    signOut: async () => { if (sb) await sb.auth.signOut(); try { localStorage.removeItem(CACHE_KEY); localStorage.removeItem(PENDING_KEY); } catch (e) {} location.reload(); },
    pendingCount: () => pending.length,
    exportAll: () => ({ app: "evenings-at-home", version: 1, exportedAt: new Date().toISOString(), docs: Object.fromEntries(docs) }),
    importAll: async (backup, replace, onProgress) => {
      if (!backup || typeof backup.docs !== "object") throw new Error("This file isn't an Evenings at Home backup.");
      const entries = Object.entries(backup.docs).filter(([p, d]) => typeof p === "string" && p.split("/").length % 2 === 0 && d && typeof d === "object");
      const drop = replace ? Array.from(docs.keys()).filter(p => !(p in backup.docs)) : [];
      const total = entries.length + drop.length; let done = 0;
      const tick = async () => { done++; if (onProgress) { onProgress(done, total); await new Promise(r => setTimeout(r, 15)); } };
      if (onProgress) onProgress(0, total);
      for (const p of drop) { await write(p, null); await tick(); }
      for (const [p, d] of entries) { await write(p, d); await tick(); }
    }
  };
})();
