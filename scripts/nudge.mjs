// Evenings at Home: phone reminders.
// Runs every hour (GitHub Actions). At each reminder slot in Lisbon time it reads
// your progress from Supabase and sends ONE short web-push nudge to every phone
// that turned reminders on in the app.
//
// Secrets (GitHub → Settings → Secrets and variables → Actions):
//   SUPABASE_SECRET_KEY  Supabase secret key (sb_secret_…) or legacy service_role key
//   VAPID_PRIVATE_KEY    private half of the notification key pair
import { createClient } from "@supabase/supabase-js";
import webpush from "web-push";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SECRET = (process.env.SUPABASE_SECRET_KEY || "").trim().replace(/^["']|["']$/g, "");
const VAPID_PUBLIC = process.env.VAPID_PUBLIC_KEY;
const VAPID_PRIVATE = process.env.VAPID_PRIVATE_KEY;
const FORCE = process.env.FORCE_SLOT || ""; // "test", "weekday", "weekend-morning", "weekend-evening"
const TZ = "Europe/Lisbon";

// errors are printed as GitHub annotations so they show on the run's summary page
const fail = msg => { console.log("::error::" + String(msg).replace(/\n/g, " ")); process.exit(1); };
if (!SECRET) fail("The secret SUPABASE_SECRET_KEY is missing or empty. Add it under Settings → Secrets and variables → Actions.");
if (!VAPID_PRIVATE) fail("The secret VAPID_PRIVATE_KEY is missing or empty. Add it under Settings → Secrets and variables → Actions.");
if (!SUPABASE_URL || !VAPID_PUBLIC) fail("SUPABASE_URL or VAPID_PUBLIC_KEY is missing in the workflow file.");
webpush.setVapidDetails("https://github.com/mbarretojunk-cmd/DnD.AI.Planner", VAPID_PUBLIC, VAPID_PRIVATE);
const sb = createClient(SUPABASE_URL, SECRET, { auth: { persistSession: false } });

/* ---------- time in Lisbon ---------- */
function lisbonNow() {
  const parts = Object.fromEntries(new Intl.DateTimeFormat("en-GB", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", weekday: "short", hour12: false }).formatToParts(new Date()).map(p => [p.type, p.value]));
  const key = `${parts.year}-${parts.month}-${parts.day}`;
  const dow = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(parts.weekday);
  return { key, dow, mins: Number(parts.hour) % 24 * 60 + Number(parts.minute) };
}
const parseKey = k => { const [y, m, d] = k.split("-").map(Number); return new Date(Date.UTC(y, m - 1, d)); };
const keyOf = d => d.toISOString().slice(0, 10);
const addDays = (k, n) => { const d = parseKey(k); d.setUTCDate(d.getUTCDate() + n); return keyOf(d); };
const dowOf = k => parseKey(k).getUTCDay();
const mondayOf = k => addDays(k, -((dowOf(k) + 6) % 7));
const weekIndex = k => Math.round((parseKey(mondayOf(k)) - parseKey("2026-01-05")) / 6048e5);

/* reminder slots: [name, minute of day, applies on weekday?] */
const SLOTS = [
  ["weekday", 18 * 60 + 45, "wd"], ["weekday", 19 * 60 + 45, "wd"], ["weekday", 20 * 60 + 45, "wd"],
  ["weekend-morning", 10 * 60 + 45, "we"], ["weekend-evening", 18 * 60 + 45, "we"]
];
const WINDOW = 55; // GitHub may start the job late; still send if within 55 min of the slot

/* ---------- same monster list and hash as the app ---------- */
const MONSTERS = ["Scroll Leech", "Couch Mimic", "Dish Hydra", "Laundry Golem", "Procrastination Imp", "Glowscreen Siren", "Crumb Swarm", "Dust Wraith", "Takeaway Ogre", "Tab Hoarder", "Snooze Basilisk", "Clutter Troll"];
function hash(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }

const GUARD = { cat: "familiar", house: "fighter", food: "cleric", hobby: "wizard" };
const DEFAULT_NAMES = { cleric: "Brother Aldo", fighter: "Hilde", familiar: "your cat", wizard: "Ismay", rogue: "Wren" };
const GROUP_ORDER = ["cat", "house", "food"];

async function main() {
  const now = lisbonNow();
  const isWeekend = now.dow === 0 || now.dow === 6;
  let slot = null;
  if (FORCE) slot = { name: FORCE, at: now.mins, key: FORCE + "-" + Date.now() };
  else {
    for (const [name, at, when] of SLOTS) {
      if ((when === "wd") === isWeekend) continue;
      if (now.mins >= at && now.mins < at + WINDOW) { slot = { name, at, key: now.key + "@" + at }; break; }
    }
  }
  if (!slot) { console.log("No reminder slot right now (" + now.key + " " + Math.floor(now.mins / 60) + ":" + String(now.mins % 60).padStart(2, "0") + " Lisbon)."); return; }

  const { data: rows, error } = await sb.from("docs").select("user_id,path,data");
  if (error) fail("Supabase refused the read: " + (error.message || "") + " — the key on GitHub " + (SECRET.startsWith("sb_secret_") ? "does" : "does NOT") + " start with sb_secret_" + (/[•*]/.test(SECRET) ? " and contains hidden-mask characters (copy it again after revealing it)" : "") + ". Detail: " + (error.message || JSON.stringify(error)) + ". Check that SUPABASE_SECRET_KEY is the secret key (sb_secret_…), not the publishable one.");
  const nSubs = rows.filter(r => r.path.startsWith("push/")).length;
  console.log("::notice::Read " + rows.length + " documents for " + new Set(rows.map(r => r.user_id)).size + " account(s); phones with reminders on: " + nSubs + "; slot: " + slot.name);
  if (!rows.length) fail("No data came back from Supabase. SUPABASE_SECRET_KEY is probably the publishable key instead of the secret key (sb_secret_…).");
  const users = new Map();
  for (const r of rows) { if (!users.has(r.user_id)) users.set(r.user_id, new Map()); users.get(r.user_id).set(r.path, r.data); }

  for (const [uid, docs] of users) {
    const subs = [...docs.entries()].filter(([p]) => p.startsWith("push/"));
    if (!subs.length) { console.log("::warning::No phone has turned reminders on yet. In the app: gear → Phone reminders → Turn on reminders."); continue; }
    const log = docs.get("pushlog/state") || { sent: [] };
    if (!FORCE && log.sent.includes(slot.key)) { console.log("Already sent", slot.key); continue; }

    const msg = FORCE === "test" ? { title: "Evenings at Home", body: "Reminders are working. The party salutes you." } : compose(docs, now, slot);
    if (!msg) { console.log("Nothing to send for", slot.key); }
    else {
      for (const [path, sub] of subs) {
        try { const r = await webpush.sendNotification(sub.subscription, JSON.stringify(msg), { TTL: 3600, urgency: "high" }); console.log("::notice::Sent to " + path + " (" + r.statusCode + ")"); }
        catch (e) {
          console.log("::warning::Push failed for " + path + ": " + (e.statusCode || "") + " " + (e.body || e.message || ""));
          // gone, or made with an older notification key: forget it so the phone can subscribe again
          if (e.statusCode === 404 || e.statusCode === 410 || (e.statusCode === 403 && /VAPID/i.test(e.body || ""))) await sb.from("docs").delete().eq("user_id", uid).eq("path", path);
        }
      }
    }
    if (!FORCE) {
      const sent = log.sent.filter(k => k.slice(0, 10) >= addDays(now.key, -3)).concat(slot.key);
      await sb.from("docs").upsert({ user_id: uid, path: "pushlog/state", data: { sent }, updated_at: new Date().toISOString() }, { onConflict: "user_id,path" });
    }
  }
}

function compose(docs, now, slot) {
  const today = now.key, dow = now.dow;
  const game = docs.get("game/state") || {};
  if (game.startDate && today < game.startDate) return null;
  const day = docs.get("days/" + today) || {};
  if (day.rest) return null;
  const lab = !!day.lab;
  const done = (id, k) => !!((docs.get("days/" + k) || {}).done || {})[id];
  const names = Object.assign({}, DEFAULT_NAMES, game.names || {});
  const habits = [...docs.entries()].filter(([p]) => p.startsWith("habits/")).map(([p, h]) => Object.assign({ id: p.slice(7) }, h))
    .filter(h => String(h.createdAt || "2000-01-01").slice(0, 10) <= today && !(h.archivedAt && h.archivedAt <= today));
  const label = h => {
    if (Array.isArray(h.rotation) && h.rotation.length) { const n = ((weekIndex(today) % h.rotation.length) + h.rotation.length) % h.rotation.length; return h.name + ": " + h.rotation[n]; }
    return h.name;
  };
  const isDue = h => {
    if (h.group === "hobby") return false;
    if (h.after) return done(h.after, addDays(today, -(Number(h.afterDays) || 0)));
    if (Array.isArray(h.days) && h.days.length) {
      if (lab || !h.days.includes(dow)) return false;
      const ew = Number(h.everyWeeks) || 1;
      return ew < 2 || (((weekIndex(today) - (Number(h.weekOffset) || 0)) % ew) + ew) % ew === 0;
    }
    return Number(h.perWeek) >= 7;
  };
  const open = habits.filter(h => isDue(h) && !done(h.id, today))
    .sort((a, b) => GROUP_ORDER.indexOf(a.group) - GROUP_ORDER.indexOf(b.group) || (a.order || 0) - (b.order || 0));
  const doneCount = habits.filter(h => isDue(h) && done(h.id, today)).length;
  const monster = MONSTERS[hash(today) % MONSTERS.length];
  const first = open[0];
  const who = first ? names[GUARD[first.group]] : "";

  // Sunday lunch prep (not on a lab Sunday or a skipped week)
  let prepLeft = 0;
  if (dow === 0 && !lab) {
    const plan = docs.get("plans/" + addDays(today, 1));
    if (!plan || !plan.skipped) prepLeft = ["plan", "pantry", "shop", "cook", "portion"].filter(s => !(plan && plan.steps && plan.steps[s])).length;
  }

  if (slot.name === "weekend-morning") {
    if (!open.length && !prepLeft) return null;
    if (lab) return { title: "Lab day", body: first ? "Weekend chores are off. Just " + first.name.toLowerCase() + " when you're home." : "Weekend chores are off. Good luck in the lab." };
    const what = (open.length ? open.length + " chore" + (open.length === 1 ? "" : "s") : "") + (open.length && prepLeft ? " + " : "") + (prepLeft ? "lunch prep" : "");
    return { title: (dow === 6 ? "Saturday" : "Sunday") + " block", body: what + ". Start with " + (first ? label(first).toLowerCase() : "the lunch prep") + ", then the day is yours." };
  }
  if (slot.name === "weekend-evening") {
    if (!first) return null;
    return { title: monster + " is waiting", body: "Before you log in: " + label(first).toLowerCase() + ". " + who.charAt(0).toUpperCase() + who.slice(1) + " takes 6 damage at midnight otherwise." };
  }
  // weekday evening
  if (!first) return { title: "Duties done", body: "Everything's ticked. Free time can start early tonight." };
  if (slot.at === 18 * 60 + 45 && !doneCount) return { title: monster + " appears", body: "Home time. " + open.length + " chore" + (open.length === 1 ? "" : "s") + " tonight, start with " + label(first).toLowerCase() + "." };
  return { title: monster + " · " + open.length + " left", body: "Quick one: " + label(first).toLowerCase() + ". " + who.charAt(0).toUpperCase() + who.slice(1) + " takes 6 damage at midnight if it waits." };
}

main().catch(e => fail("Unexpected error: " + (e && e.message ? e.message : e)));
