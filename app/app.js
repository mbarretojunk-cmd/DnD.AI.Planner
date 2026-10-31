(function () {
  "use strict";
  /* ================= constants ================= */
  const GROUPS = {
    cat: { label: "Cat care", color: "var(--cat)", member: "familiar" },
    house: { label: "House duties", color: "var(--house)", member: "fighter" },
    food: { label: "Food & home", color: "var(--food)", member: "cleric" },
    hobby: { label: "Free time", color: "var(--hobby)", member: "wizard" }
  };
  const PARTY_BASE = [
    { id: "cleric", name: "Brother Aldo", cls: "Cleric", color: "var(--food)", guards: "Food & home" },
    { id: "fighter", name: "Hilde", cls: "Fighter", color: "var(--house)", guards: "House duties" },
    { id: "familiar", name: "Your cat", cls: "Familiar", color: "var(--cat)", guards: "Cat care" },
    { id: "wizard", name: "Ismay", cls: "Wizard", color: "var(--hobby)", guards: "Free time" },
    { id: "rogue", name: "Wren", cls: "Rogue", color: "var(--rogue)", guards: "Lunch prep & quests" }
  ];
  let PARTY = PARTY_BASE.map(p => Object.assign({}, p));
  const PORTRAITS = {
    cleric: '<circle cx="32" cy="32" r="32" fill="var(--sunk)"/><path d="M8 64c2-13 11-20 24-20s22 7 24 20z" fill="var(--food)"/><path d="M22 46c4 4 16 4 20 0" fill="none" stroke="var(--surface)" stroke-width="2.5" stroke-linecap="round"/><circle cx="32" cy="54" r="3.5" fill="var(--lamp)"/><path d="M32 48.5v-2M32 61.5v-2M26.5 54h-2M39.5 54h-2" stroke="var(--lamp)" stroke-width="1.6" stroke-linecap="round"/><circle cx="32" cy="28" r="12" fill="var(--skin)"/><path d="M20.5 30c-1-5 0-8 3-10M43.5 30c1-5 0-8-3-10" fill="none" stroke="var(--hair-brown)" stroke-width="3.5" stroke-linecap="round"/><circle cx="27.5" cy="28.5" r="1.5" fill="var(--feature)"/><circle cx="36.5" cy="28.5" r="1.5" fill="var(--feature)"/><path d="M28 34q4 3 8 0" fill="none" stroke="var(--feature)" stroke-width="1.5" stroke-linecap="round"/><path d="M25 25.5l4-.8M39 25.5l-4-.8" stroke="var(--hair-brown)" stroke-width="1.4" stroke-linecap="round"/>',
    fighter: '<circle cx="32" cy="32" r="32" fill="var(--sunk)"/><path d="M8 64c2-13 11-20 24-20s22 7 24 20z" fill="var(--house)"/><path d="M12 54c3-6 7-9 12-10M52 54c-3-6-7-9-12-10" fill="none" stroke="var(--steel)" stroke-width="4" stroke-linecap="round"/><path d="M22 31c-2 6-3 11-2 16M42 31c2 6 3 11 2 16" fill="none" stroke="var(--hair-blond)" stroke-width="4.5" stroke-linecap="round"/><circle cx="32" cy="30" r="11.5" fill="var(--skin)"/><path d="M19.5 29a12.5 12.5 0 0 1 25 0v-1.5h-25z" fill="var(--steel)"/><path d="M19.5 28.5a12.5 12.5 0 0 1 25 0" fill="none" stroke="var(--feature)" stroke-opacity=".25" stroke-width="1"/><rect x="30.8" y="27" width="2.4" height="9" rx="1" fill="var(--steel)"/><circle cx="27" cy="31.5" r="1.5" fill="var(--feature)"/><circle cx="37" cy="31.5" r="1.5" fill="var(--feature)"/><path d="M29 37.5h6" stroke="var(--feature)" stroke-width="1.5" stroke-linecap="round"/>',
    familiar: '<circle cx="32" cy="32" r="32" fill="var(--sunk)"/><path d="M14 50c0-13 4-21 9-24l-2-14 10 9q1 0 2 0l10-9-2 14c5 3 9 11 9 24-7 6-29 6-36 0z" fill="var(--fur)"/><path d="M23 14l7 7M41 14l-7 7" stroke="var(--skin)" stroke-width="2" stroke-linecap="round" opacity=".6"/><ellipse cx="25.5" cy="35" rx="3.6" ry="4.4" fill="var(--lamp)"/><ellipse cx="38.5" cy="35" rx="3.6" ry="4.4" fill="var(--lamp)"/><ellipse cx="25.5" cy="35" rx="1.2" ry="3.4" fill="var(--feature)"/><ellipse cx="38.5" cy="35" rx="1.2" ry="3.4" fill="var(--feature)"/><path d="M30 41.5h4l-2 2.5z" fill="var(--skin2)"/><path d="M32 44v1.5M32 45.5q-2.5 2-4.5 .5M32 45.5q2.5 2 4.5 .5" fill="none" stroke="var(--feature)" stroke-width="1.2" stroke-linecap="round"/><path d="M8 40l13 2M8 46l13-1M56 40l-13 2M56 46l-13-1" stroke="var(--surface)" stroke-width="1" stroke-linecap="round"/><path d="M19 54q13 5 26 0" fill="none" stroke="var(--cat)" stroke-width="3" stroke-linecap="round"/><circle cx="32" cy="57.5" r="2.5" fill="var(--lamp)"/>',
    wizard: '<circle cx="32" cy="32" r="32" fill="var(--sunk)"/><path d="M8 64c2-13 11-20 24-20s22 7 24 20z" fill="var(--hobby)"/><path d="M20 26c-1 8-1 15 1 22M44 26c1 8 1 15-1 22" fill="none" stroke="var(--hair-dark)" stroke-width="6" stroke-linecap="round"/><circle cx="32" cy="31" r="11" fill="var(--skin)"/><path d="M18 24L36 2l9 22z" fill="var(--hobby)"/><ellipse cx="32" cy="24" rx="17" ry="3.5" fill="var(--hobby)"/><path d="M36 11l.9 2 2.2.3-1.6 1.5.4 2.2-1.9-1-1.9 1 .4-2.2-1.6-1.5 2.2-.3z" fill="var(--lamp)"/><circle cx="27.5" cy="31.5" r="1.5" fill="var(--feature)"/><circle cx="36.5" cy="31.5" r="1.5" fill="var(--feature)"/><path d="M29 37q3 2 6 0" fill="none" stroke="var(--feature)" stroke-width="1.4" stroke-linecap="round"/><circle cx="50" cy="50" r="3" fill="var(--lamp)" opacity=".85"/>',
    rogue: '<circle cx="32" cy="32" r="32" fill="var(--sunk)"/><path d="M8 64c2-13 11-20 24-20s22 7 24 20z" fill="var(--rogue)"/><path d="M17 40C15 18 24 11 32 11s17 7 15 29c-4 4-26 4-30 0z" fill="var(--rogue)"/><ellipse cx="32" cy="32" rx="9" ry="10" fill="var(--skin2)"/><path d="M22 27c3-5 17-5 20 0-3-2-17-2-20 0z" fill="var(--feature)" opacity=".55"/><path d="M26.5 30.5q1.5-1.4 3 0M34.5 30.5q1.5-1.4 3 0" fill="none" stroke="var(--feature)" stroke-width="1.6" stroke-linecap="round"/><path d="M24 37q8 9 16 0v6q-8 4-16 0z" fill="var(--feature)" opacity=".7"/><path d="M48 46l6-12" stroke="var(--steel)" stroke-width="2.5" stroke-linecap="round"/><path d="M46 49l5-2" stroke="var(--feature)" stroke-width="2.5" stroke-linecap="round"/>'
  };
  function applyNames() { const n = (game && game.names) || {}; PARTY = PARTY_BASE.map(p => Object.assign({}, p, { name: (typeof n[p.id] === "string" && n[p.id].trim()) ? n[p.id].trim().slice(0, 30) : p.name })); }
  function portrait(p, size) {
    if (window.ART && ART.pixel(p.id)) return '<span class="portrait pix"' + (size ? ' style="width:' + size + 'px;height:' + size + 'px"' : "") + ' role="img" aria-label="' + esc(p.name) + ', ' + p.cls + '"><img src="' + ART.pixel(p.id) + '" alt=""></span>';
    return portraitSvg(p, size);
  }
  function portraitSvg(p, size) { return '<svg class="portrait"' + (size ? ' style="width:' + size + 'px;height:' + size + 'px"' : "") + ' viewBox="0 0 64 64" role="img" aria-label="' + esc(p.name) + ', ' + p.cls + '"><defs><clipPath id="cp-' + p.id + (size || "") + '"><circle cx="32" cy="32" r="32"/></clipPath></defs><g clip-path="url(#cp-' + p.id + (size || "") + ')">' + PORTRAITS[p.id] + '</g></svg>'; }
  const MONSTERS = [
    ["Scroll Leech", "Feeds on endless feeds."], ["Couch Mimic", "Looks like a comfy seat. Isn't."],
    ["Dish Hydra", "Two plates grow back for every one."], ["Laundry Golem", "Built from last week's socks."],
    ["Procrastination Imp", "Whispers 'in five minutes'."], ["Glowscreen Siren", "Sings in notification tones."],
    ["Crumb Swarm", "Lives under the toaster."], ["Dust Wraith", "Drifts along the skirting boards."],
    ["Takeaway Ogre", "Smells of grease and regret."], ["Tab Hoarder", "Keeps 47 browser tabs open."],
    ["Snooze Basilisk", "One look and you're napping."], ["Clutter Troll", "Guards the chair of clothes."]
  ];
  const AISLES = ["Produce", "Meat & fish", "Dairy & eggs", "Bakery", "Pantry", "Frozen", "Other"];
  const PREP_STEPS = [
    ["plan", "Pick this week's lunches"],
    ["pantry", "Check the fridge and cupboards"],
    ["shop", "Do the shopping"],
    ["cook", "Cook"],
    ["portion", "Portion into 5 boxes and fridge them"]
  ];
  const LUNCHES = 5, DINNERS = 7, MAX_AHEAD = 14;
  const ICON = {
    heart: '<svg class="ic" viewBox="0 0 16 16" aria-hidden="true"><path d="M8 14s-5.5-3.4-5.5-7.2A3 3 0 0 1 8 4.6a3 3 0 0 1 5.5 2.2C13.5 10.6 8 14 8 14z" fill="var(--hurt)"/></svg>',
    sword: '<svg class="ic" viewBox="0 0 16 16" aria-hidden="true"><path d="M13.5 1.5l1 1-7.6 7.6-1-1zM5.2 9.4l1.4 1.4-1.2 1.2 1.1 1.1-.9.9-1.1-1.1-1.6 1.6-.9-.9 1.6-1.6-1.1-1.1.9-.9 1.1 1.1z" fill="currentColor"/></svg>',
    coin: '<svg class="ic" viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="6" fill="var(--lamp)"/><circle cx="8" cy="8" r="3.6" fill="none" stroke="var(--surface)" stroke-width="1.2"/></svg>',
    star: '<svg class="ic" viewBox="0 0 16 16" aria-hidden="true"><path d="M8 1.5l1.9 4 4.4.5-3.3 3 .9 4.3L8 11.2l-3.9 2.1.9-4.3-3.3-3 4.4-.5z" fill="var(--hobby)"/></svg>'
  };
  let lastHit = 0;
  const CHECK = '<svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8.5l3.2 3L13 4.5" fill="none" stroke="var(--on-accent)" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  /* ================= state ================= */
  let db = null, canWrite = true;
  let habitsAll = [];       // includes archived
  const days = {};          // date -> {done:{}}
  let recipes = [], plans = {}, quests = [], rewards = [], purchases = [], shop = { items: [], recent: [] };
  let game = { startDate: null };
  let viewDate = "";
  let skip = 0;
  let tab = "tonight";
  const openRecipe = {}, confirmBox = {};
  const chains = {};

  /* ================= dates ================= */
  const $ = id => document.getElementById(id);
  const pad = n => String(n).padStart(2, "0");
  function keyOf(d) { return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }
  function todayKey() { return keyOf(new Date()); }
  function parseKey(k) { const [y, m, d] = k.split("-").map(Number); return new Date(y, m - 1, d); }
  function addDays(k, n) { const d = parseKey(k); d.setDate(d.getDate() + n); return keyOf(d); }
  function dow(k) { return parseKey(k).getDay(); }
  function mondayOf(k) { return addDays(k, -((dow(k) + 6) % 7)); }
  viewDate = todayKey();
  function niceDate(k) { return parseKey(k).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" }); }
  function hash(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function esc(s) { return String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }

  /* ================= habit helpers ================= */
  function createdKey(h) { return (h.createdAt || "2000-01-01").slice(0, 10); }
  function activeOn(h, k) { return createdKey(h) <= k && (!h.archivedAt || h.archivedAt > k); }
  function isDone(hid, k) { return !!(days[k] && days[k].done && days[k].done[hid]); }
  function weekCountTo(hid, k) { const m = mondayOf(k); let c = 0; for (let d = m; d <= k; d = addDays(d, 1)) if (isDone(hid, d)) c++; return c; }
  function habitsOn(k) { return habitsAll.filter(h => activeOn(h, k)).sort((a, b) => (a.order || 0) - (b.order || 0)); }
  function visibleHabits() { return habitsAll.filter(h => !h.archivedAt).sort((a, b) => (a.order || 0) - (b.order || 0)); }
  const DAYNAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const WEEK_ORDER = [1, 2, 3, 4, 5, 6, 0];
  function everyDays(h) { const n = Number(h.everyDays) || 0; return n >= 2 ? n : 0; }
  function isScheduled(h) { return (Array.isArray(h.days) && h.days.length > 0) || everyDays(h) > 0; }
  function daysBetween(a, b) { return Math.round((parseKey(b) - parseKey(a)) / 86400000); }
  function scheduledOn(h, k) {
    const ed = everyDays(h);
    if (ed) { const n = daysBetween(h.anchor || k, k); return ((n % ed) + ed) % ed === 0; }
    if (!isScheduled(h) || !h.days.includes(dow(k))) return false;
    const ew = Number(h.everyWeeks) || 1; if (ew < 2) return true;
    return (((weekIndex(k) - (Number(h.weekOffset) || 0)) % ew) + ew) % ew === 0;
  }
  // "daily-like": a habit that must be done on day k or it hurts at midnight
  function isLab(k) { return !!(days[k] && days[k].lab); }
  // follow-up habits (e.g. hang / fold laundry) appear only after their parent was done
  function isAfter(h) { return !!h.after; }
  function afterDue(h, k) { return isDone(h.after, addDays(k, -(Number(h.afterDays) || 0))); }
  function mustDo(h, k) { if (isAfter(h)) return afterDue(h, k); if (isScheduled(h)) return (!isLab(k) || h.group === "cat") && scheduledOn(h, k); return h.perWeek >= 7; }
  function isWeekly(h) { return !isScheduled(h) && !isAfter(h) && h.perWeek < 7; }
  function dueOn(h, k) { if (isAfter(h)) return afterDue(h, k); if (isScheduled(h)) return (!isLab(k) || h.group === "cat") && scheduledOn(h, k); return h.perWeek >= 7 || weekCountTo(h.id, addDays(k, -1)) < h.perWeek || isDone(h.id, k); }
  function weekIndex(k) { return Math.round((parseKey(mondayOf(k)) - new Date(2026, 0, 5)) / 6048e5); }
  function displayName(h, k) { if (Array.isArray(h.rotation) && h.rotation.length) { const n = ((weekIndex(k) % h.rotation.length) + h.rotation.length) % h.rotation.length; return h.name + ": " + h.rotation[n]; } return h.name; }
  function daysText(ds) { return WEEK_ORDER.filter(d => ds.includes(d)).map(d => DAYNAMES[d]).join(" & "); }
  function freqText(h) { if (isAfter(h)) { const par = habitsAll.find(x => x.id === h.after); return (Number(h.afterDays) ? "the day after " : "after ") + (par ? par.name.toLowerCase() : "its parent task"); } if (everyDays(h)) return everyDays(h) === 2 ? "every other day" : "every " + everyDays(h) + " days"; if (isScheduled(h)) return daysText(h.days) + (h.everyWeeks > 1 ? ", every " + h.everyWeeks + " weeks" : ""); const p = h.perWeek; return p >= 7 ? "every day" : p === 1 ? "once a week" : p + "× a week"; }
  function streakOf(h, k) {
    let d = k, n = 0, guard = 0;
    if (!isDone(h.id, d)) d = addDays(d, -1);
    while (guard++ < 500) {
      if (!activeOn(h, d)) break;
      if (mustDo(h, d)) { if (isDone(h.id, d)) n++; else break; }
      d = addDays(d, -1);
    }
    return n;
  }

  /* ================= plans / quests helpers ================= */
  // the Monday right after the next prep Sunday (today if Sunday); skipped weeks roll forward
  function prepWeekKey(k) { let w = addDays(k, (7 - dow(k)) % 7 + 1); let g = 0; while (plans[w] && plans[w].skipped && g++ < 10) w = addDays(w, 7); return w; }
  function lastSkippedWeek(k) { const w = addDays(k, (7 - dow(k)) % 7 + 1); return plans[w] && plans[w].skipped ? w : null; }
  function planOf(week) { return plans[week] || { week, recipes: [], dinners: [], extras: [], got: {}, steps: {} }; }
  function milestonesDoneOn(k) {
    let n = 0;
    quests.forEach(q => (q.milestones || []).forEach(m => { if (m.doneAt === k) n++; }));
    Object.values(plans).forEach(p => Object.values(p.steps || {}).forEach(v => { if (v === k) n++; }));
    return n;
  }
  function questDoneDate(q) { const ms = q.milestones || []; if (!ms.length || ms.some(m => !m.doneAt)) return null; return ms.map(m => m.doneAt).sort().pop(); }
  function prepComplete(plan, byKey) { return PREP_STEPS.every(([id]) => plan.steps && plan.steps[id] && plan.steps[id] <= byKey); }

  /* ================= game engine ================= */
  const xpFor = n => 50 * n * (n - 1);          // total XP needed to reach level n
  const maxHp = lv => 30 + 5 * (lv - 1);
  function levelOf(xp) { let l = 1; while (xp >= xpFor(l + 1)) l++; return l; }

  const BONUS_GOLD = 5, BOSS_MAX = 6, MUST_MIN = 4;
  // damage: each party member is struck at most once a night
  const STRIKE = 4, LOSS_ALL = 2, WEEKLY_MISS = 3, WEEKLY_CAP = 6, ROGUE_MISS = 5;
  // which due tasks the monster is made of, most important first:
  // cat basics, then that day's scheduled chores and follow-ups, then food, then daily house, then free time
  // weekends: chores missed on weekdays (and weekly targets still short) come back first in line
  function catchUps(k) {
    const out = new Map(), w = dow(k), start = game.startDate;
    if ((w !== 6 && w !== 0) || !start) return out;
    const mon = mondayOf(k);
    habitsOn(k).forEach(h => {
      if (h.group === "cat" || h.group === FREE_GROUP || isAfter(h) || everyDays(h) || h.archivedAt) return;
      if (isScheduled(h)) {
        if (mustDo(h, k)) return;
        for (let i = 0; i < 5; i++) {
          const d = addDays(mon, i); if (d >= k || d < start || !activeOn(h, d)) continue;
          if (mustDo(h, d) && !isDone(h.id, d)) {
            let caught = false; for (let e = addDays(d, 1); e < k; e = addDays(e, 1)) if (isDone(h.id, e)) caught = true;
            if (!caught) { out.set(h.id, "missed " + DAYNAMES[dow(d)]); break; }
          }
        }
      } else if (isWeekly(h) && mon >= start) {
        const left = h.perWeek - weekCountTo(h.id, addDays(k, -1));
        if (left > 0) out.set(h.id, left + " still to do this week");
      }
    });
    return out;
  }
  function bossRank(h, cu) {
    if (cu && cu.has(h.id)) return 0.5;
    if (isScheduled(h) || isAfter(h)) return 1;
    return { cat: 0, food: 2, house: 3 }[h.group] ?? 4;
  }
  function bossTasks(hs, k, cu) {
    cu = cu || new Map();
    return hs.filter(h => mustDo(h, k) || cu.has(h.id)).sort((a, b) => bossRank(a, cu) - bossRank(b, cu) || (a.order || 0) - (b.order || 0) || (a.id < b.id ? -1 : 1));
  }
  function evaluateDay(k, level) {
    const hs = habitsOn(k), cu = catchUps(k);
    const due = bossTasks(hs, k, cu);
    const daily = due.slice(0, BOSS_MAX);               // the monster: these must be done
    const extraDue = due.slice(BOSS_MAX);               // due today but only bonus
    const weekly = hs.filter(h => isWeekly(h) && !cu.has(h.id));
    const doneDaily = daily.filter(h => isDone(h.id, k));
    const doneExtra = extraDue.filter(h => isDone(h.id, k));
    const doneWeekly = weekly.filter(h => isDone(h.id, k));
    const ms = milestonesDoneOn(k);
    const mon = MONSTERS[hash(k) % MONSTERS.length];
    // the monster takes 6 hits: at least 4 from tonight's must-dos, the rest from anything.
    // hits past that are bonus loot.
    const mustNeed = Math.min(MUST_MIN, daily.length);
    const need = Math.min(BOSS_MAX, daily.length + extraDue.length + weekly.length + ms);
    const anyNeed = need - mustNeed;
    const otherDone = doneExtra.length + doneWeekly.length + ms;
    const mustHits = Math.min(doneDaily.length, need);
    const anyHits = Math.min(anyNeed, Math.max(0, mustHits - mustNeed) + otherDone);
    const hits = Math.min(need, Math.min(mustHits, mustNeed) + anyHits);
    const win = hits >= need;
    const bonus = doneDaily.length + otherDone - hits;
    // if it survives, the highest-ranked open must-dos each strike back, one per missing hit
    const missedDaily = [];
    if (!win) { const struck = new Set(); daily.filter(h => !isDone(h.id, k)).forEach(h => { const m = GROUPS[h.group].member; if (missedDaily.length < need - hits && !struck.has(m)) { struck.add(m); missedDaily.push(h); } }); }
    return { k, daily, weekly, extraDue, doneExtra, doneDaily, missedDaily, doneWeekly, ms, bonus, mustNeed, anyNeed, need, hits, monster: mon[0], lore: mon[1], foeHp: 10 * need, dealt: 10 * hits, win };
  }

  function computeGame() {
    const today = todayKey();
    const start = game.startDate || today;
    const S = { xp: 0, gold: 0, level: 1, members: {}, log: [] };
    PARTY.forEach(p => S.members[p.id] = { hp: maxHp(1), ko: false, wins: 0, xp: 0, lv: 1, log: [] });
    const mMax = id => maxHp(S.level) + 3 * (S.members[id].lv - 1);
    const alive = () => PARTY.filter(p => !S.members[p.id].ko);
    function hurt(id, n, why) { const m = S.members[id]; if (m.ko || n <= 0) return; m.hp = Math.max(0, m.hp - n); why.push({ id, n }); }
    function heal(id, n) { const m = S.members[id]; if (m.ko) return; m.hp = Math.min(mMax(id), m.hp + n); }
    function gainXp(n) {
      const before = S.level; S.xp += n; S.level = levelOf(S.xp);
      if (S.level > before) { PARTY.forEach(p => { const m = S.members[p.id]; m.hp = mMax(p.id); m.ko = false; m.wins = 0; }); return true; }
      return false;
    }
    function spendOn(k) { purchases.filter(p => p.date === k).forEach(p => { S.gold = Math.max(0, S.gold - (Number(p.cost) || 0)); }); }

    for (let k = start; k < today; k = addDays(k, 1)) {
      if (days[k] && days[k].rest) { S.log.push({ k, restDay: true, monster: "", win: true, xp: 0, gold: 0, notes: ["Rest day. No fight, no damage, no XP."], dmg: [] }); spendOn(k); continue; }
      const r = evaluateDay(k, S.level);
      const dmg = [];
      const entry = { k, monster: r.monster, win: r.win, xp: 0, gold: 0, notes: [] };
      // XP and healing
      const gHrs = gameXpHours(k), gXp = Math.round(GAME_XP * gHrs);
      let xp = 10 * (r.doneDaily.length + r.doneExtra.length) + 15 * r.doneWeekly.length + 10 * r.ms + gXp;
      quests.forEach(q => { if (questDoneDate(q) === k) { xp += 40; entry.notes.push("Quest done: " + q.title); } });
      [...r.doneDaily, ...r.doneExtra, ...r.doneWeekly].forEach(h => heal(GROUPS[h.group].member, 3));
      for (let i = 0; i < r.ms; i++) heal("rogue", 3);
      if (r.win) {
        xp += 15; const g = 10 + 2 * S.level + (hash(k + "g") % 6) + BONUS_GOLD * r.bonus; S.gold += g; entry.gold = g;
        if (r.bonus) entry.notes.push("Bonus loot: " + r.bonus + " extra task" + (r.bonus === 1 ? "" : "s") + ", +" + BONUS_GOLD * r.bonus + " gold");
        alive().forEach(p => heal(p.id, 2));
      } else {
        const lost = Math.floor(S.gold * 0.25); S.gold -= lost; entry.gold = -lost;
        alive().forEach(p => hurt(p.id, LOSS_ALL, dmg));
      }
      // missed dailies
      r.missedDaily.forEach(h => hurt(GROUPS[h.group].member, STRIKE, dmg));
      // Sunday checks
      if (dow(k) === 0) {
        const mon = mondayOf(k);
        if (mon >= start && !isLab(k)) {
          habitsOn(k).filter(h => isWeekly(h) && createdKey(h) <= mon).forEach(h => {
            const short = h.perWeek - weekCountTo(h.id, k);
            if (short > 0) { hurt(GROUPS[h.group].member, Math.min(WEEKLY_CAP, WEEKLY_MISS * short), dmg); entry.notes.push(h.name + ": " + short + " short this week"); }
          });
        }
        const plan = planOf(addDays(k, 1));
        if (prepComplete(plan, k)) {
          xp += 60; entry.rest = true; entry.notes.push("Lunch prep done. Long rest.");
          PARTY.forEach(p => { const m = S.members[p.id]; m.ko = false; m.wins = 0; m.hp = mMax(p.id); });
        } else if (isLab(k)) { entry.notes.push("Lab Sunday: lunch prep excused"); }
        else if (k > start) { hurt("rogue", ROGUE_MISS, dmg); entry.notes.push("Lunch prep not finished"); }
      }
      if (isLab(k)) { xp += 15; entry.lab = true; entry.notes.push("Lab day: weekend chores excused, +15 XP overtime bonus"); }
      quests.forEach(q => { if (q.due === k && !(questDoneDate(q) && questDoneDate(q) <= k)) { hurt("rogue", ROGUE_MISS, dmg); entry.notes.push("Quest overdue: " + q.title); } });
      // XP loss on defeat (never below the current level's floor)
      if (!r.win) { const floor = xpFor(S.level); const take = Math.min(10, Math.max(0, S.xp - floor)); S.xp -= take; xp -= 0; entry.xpLost = take; }
      if (gainXp(xp)) entry.notes.push("Level up! Reached level " + S.level + ".");
      entry.xp = xp - (entry.xpLost || 0);
      // each member grows from their own kind of task, and keeps a personal log
      const mg = {}, did = {}, missed = {};
      PARTY.forEach(p => { mg[p.id] = 0; did[p.id] = []; missed[p.id] = []; });
      [...r.doneDaily, ...r.doneExtra].forEach(h => { const id = GROUPS[h.group].member; mg[id] += 10; did[id].push(displayName(h, k)); });
      r.doneWeekly.forEach(h => { const id = GROUPS[h.group].member; mg[id] += 15; did[id].push(displayName(h, k)); });
      r.missedDaily.forEach(h => missed[GROUPS[h.group].member].push(displayName(h, k)));
      if (r.ms) { mg.rogue += 10 * r.ms; did.rogue.push(r.ms + " milestone" + (r.ms === 1 ? "" : "s")); }
      quests.forEach(q => { if (questDoneDate(q) === k) { mg.rogue += 20; did.rogue.push("Quest: " + q.title); } });
      if (entry.rest) { mg.rogue += 30; did.rogue.push("Lunch prep"); }
      if (gXp) { mg.wizard += gXp; did.wizard.push(fmtHM(gameHours(k)) + " of game time"); }
      const hurtBy = {}; dmg.forEach(d => hurtBy[d.id] = (hurtBy[d.id] || 0) + d.n);
      PARTY.forEach(p => {
        const m = S.members[p.id]; const before = m.lv;
        m.xp += mg[p.id]; m.lv = levelOf(m.xp);
        const notes = [];
        if (m.lv > before) { notes.push("Reached level " + m.lv); m.hp = mMax(p.id); }
        if (mg[p.id] || hurtBy[p.id] || missed[p.id].length || notes.length) m.log.push({ k, xp: mg[p.id], dmg: hurtBy[p.id] || 0, did: did[p.id], missed: missed[p.id], notes });
      });
      // knock-outs and revivals
      PARTY.forEach(p => {
        const m = S.members[p.id];
        if (!m.ko && m.hp <= 0) { m.ko = true; m.wins = 0; entry.notes.push(p.name + " went down"); }
        else if (m.ko) {
          if (r.win) { m.wins++; if (m.wins >= 2) { m.ko = false; m.wins = 0; m.hp = Math.ceil(mMax(p.id) * 0.4); entry.notes.push(p.name + " is back on their feet"); } }
          else m.wins = 0;
        }
      });
      if (PARTY.every(p => S.members[p.id].ko)) {
        const lv = Math.max(1, S.level - 1); S.xp = xpFor(lv); S.level = lv; S.gold = Math.floor(S.gold / 2);
        PARTY.forEach(p => { const m = S.members[p.id]; m.ko = false; m.wins = 0; m.hp = Math.ceil(mMax(p.id) * 0.5); });
        entry.wipe = true; entry.notes.push("The whole party fell. Lost a level and half the gold.");
      }
      entry.dmg = dmg;
      spendOn(k);
      S.log.push(entry);
    }
    spendOn(today);
    PARTY.forEach(p => S.members[p.id].max = mMax(p.id));
    return S;
  }

  /* ================= rendering: shared ================= */
  function sigil(p) {
    return '<svg class="sigil" viewBox="0 0 26 30" aria-hidden="true"><path d="M13 1.5l10.5 4v9c0 7-4.6 11.5-10.5 14-5.9-2.5-10.5-7-10.5-14v-9z" fill="' + p.color + '" opacity=".16" stroke="' + p.color + '" stroke-width="1.5"/><path d="' + p.glyph + '" fill="none" stroke="' + p.color + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  }
  function bar(pct, color) { return '<div class="bar" style="--c:' + color + '"><span style="width:' + Math.max(0, Math.min(100, pct)) + '%"></span></div>'; }

  let G = null;
  function renderParty() {
    G = computeGame();
    const mh = maxHp(G.level);
    $("sLevel").textContent = G.level; $("sGold").textContent = G.gold;
    $("party").innerHTML = PARTY.map(p => {
      const m = G.members[p.id], mx = m.max || mh; const pct = m.hp / mx * 100;
      const low = pct <= 30;
      return '<button type="button" class="pm' + (m.ko ? " ko" : "") + (low && !m.ko ? " low" : "") + '" data-tip="' + esc(p.name) + ', ' + p.cls + ' level ' + m.lv + ': ' + (m.ko ? "knocked out, needs " + (2 - m.wins) + " won night" + (2 - m.wins === 1 ? "" : "s") + " to get up" : m.hp + "/" + mx + " HP") + '. Grows from ' + esc(p.guards) + '. Tap to open the Party." aria-label="' + esc(p.name) + ', ' + p.cls + ', level ' + m.lv + ', ' + (m.ko ? "down" : m.hp + " of " + mx + " HP") + '"><span class="pm-port">' + portrait(p) + '<span class="lvb">' + m.lv + '</span></span>' + bar(pct, low ? "var(--hurt)" : "var(--hp)") + '<span class="hpn">' + (m.ko ? "down" : m.hp + "/" + mx) + '</span></button>';
    }).join("");
    $("party").querySelectorAll(".pm").forEach(b => b.onclick = () => setTab("party"));
    const lo = xpFor(G.level), hi = xpFor(G.level + 1);
    $("xpLabel").textContent = (G.xp - lo) + " / " + (hi - lo) + " XP to level " + (G.level + 1);
    $("xpBar").style.width = ((G.xp - lo) / (hi - lo) * 100) + "%";
    const t = evaluateDay(todayKey(), G.level);
    const pendingXp = 10 * (t.doneDaily.length + t.doneExtra.length) + 15 * t.doneWeekly.length + 10 * t.ms + Math.round(GAME_XP * gameXpHours(todayKey()));
    $("xpToday").textContent = pendingXp ? "+" + pendingXp + " XP tonight, banked at midnight" : "";
  }

  function renderAll() {
    renderParty();
    if (tab === "tonight") renderTonight();
    if (tab === "party") renderPartyTab();
    if (tab === "lunch" || tab === "shop") renderLunch();
    if (tab === "shop") renderShop();
    renderShopBadge();
    if (tab === "quests") renderQuests();
  }

  /* ================= tonight ================= */
  const START = 18 * 60 + 30, FREE = 21 * 60 + 30, END = 24 * 60, SPAN = END - START;
  const NUDGES = [18 * 60 + 45, 19 * 60 + 45, 20 * 60 + 45];
  const FREE_GROUP = "hobby";
  (function drawTicks() {
    const tr = $("track");
    const band = document.createElement("div"); band.className = "freeband"; band.style.left = ((FREE - START) / SPAN * 100) + "%"; tr.appendChild(band);
    NUDGES.forEach(t => { const d = document.createElement("div"); d.className = "tick"; d.style.left = ((t - START) / SPAN * 100) + "%"; tr.appendChild(d); });
    const n = document.createElement("div"); n.className = "now"; n.id = "nowDot"; tr.appendChild(n);
    const sc = $("scale");
    [[START, "18:30"], [20 * 60, "20:00"], [FREE, "21:30 free time"], [23 * 60, "23:00"], [END, "00:00"]].forEach(([t, txt]) => {
      const s = document.createElement("span"); s.textContent = txt; const pct = (t - START) / SPAN * 100;
      s.style.left = pct + "%"; s.style.transform = pct >= 100 ? "translateX(-100%)" : pct > 0 ? "translateX(-50%)" : "none";
      if (t === FREE) s.className = "free"; sc.appendChild(s);
    });
  })();
  function nowMins() { const d = new Date(); return d.getHours() * 60 + d.getMinutes(); }
  function inFreeTime() { const m = nowMins(); return m >= FREE || m < 4 * 60; }
  /* ---------- weekend game time ---------- */
  const GAME_MIN = 7, GAME_MAX = 10, GAME_XP = 5, GAME_WEEKDAY_CAP = 2.5;
  function fmtHM(h) { const m = Math.round((Number(h) || 0) * 60); return m < 60 ? m + " min" : Math.floor(m / 60) + " h" + (m % 60 ? " " + (m % 60) + " min" : ""); }
  // game hours that earn XP: up to 2.5 h on a weekday, up to 10 h across a weekend
  function gameXpHours(k) {
    const h = gameHours(k), w = dow(k);
    if (w === 6) return Math.min(h, GAME_MAX);
    if (w === 0) return Math.min(h, Math.max(0, GAME_MAX - Math.min(gameHours(addDays(k, -1)), GAME_MAX)));
    return Math.min(h, GAME_WEEKDAY_CAP);
  }
  /* ---------- game session stopwatch (synced, so it runs on every device) ---------- */
  let gameSession = { startAt: null }, gameTicks = 0;
  function sessionMs() { return gameSession.startAt ? Math.max(0, Date.now() - gameSession.startAt) : 0; }
  function fmtStopwatch(ms) { const t = Math.floor(ms / 1000), h = Math.floor(t / 3600), m = Math.floor(t % 3600 / 60), sec = t % 60; return h + ":" + pad(m) + ":" + pad(sec); }
  function startGame() {
    if (!ready() || gameSession.startAt) return;
    gameSession = { startAt: Date.now() }; sfx("draw");
    queueSet("session", "game", { startAt: gameSession.startAt, startedOn: todayKey() }); renderAll();
  }
  function stopGame() {
    const s = gameSession.startAt; if (!s || !ready()) return;
    const end = Date.now(); let t = s; const added = [];
    while (t < end) {
      const d = new Date(t), k = keyOf(d), next = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1).getTime(), segEnd = Math.min(end, next);
      const hrs = (segEnd - t) / 3600000; added.push([k, hrs]);
      setGame(k, Math.min(24, Math.round((gameHours(k) + hrs) * 100) / 100)); t = segEnd;
    }
    gameSession = { startAt: null }; sfx("coins");
    queueSet("session", "game", { startAt: null, last: { start: s, end } });
    const mins = Math.round((end - s) / 60000);
    gameToast("Logged " + fmtHM(mins / 60) + " of game time" + (mins >= 6 ? " · Ismay gains XP at midnight" : ""));
    renderAll();
  }
  function gameToast(text) {
    let t = $("gameToast"); if (!t) { t = document.createElement("div"); t.id = "gameToast"; t.className = "gtoast"; t.setAttribute("role", "status"); document.body.appendChild(t); }
    t.textContent = text; t.classList.add("show"); clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove("show"), 3500);
  }
  function gameWidget(k) {
    const w = document.createElement("div"); w.className = "gsess" + (gameSession.startAt ? " on" : "");
    if (k !== todayKey()) return null;
    if (gameSession.startAt) {
      w.innerHTML = '<span class="gs-dot" aria-hidden="true"></span><div class="gs-main"><span class="gs-clock mono" data-gclock></span><small>Game session · started ' + new Date(gameSession.startAt).toTimeString().slice(0, 5) + '</small></div>';
      w.querySelector("[data-gclock]").textContent = fmtStopwatch(sessionMs());
      w.appendChild(mkBtn("■ Stop & log", "btn-main", stopGame));
    } else {
      w.innerHTML = '<div class="gs-main"><b>🎮 Game time</b><small>' + (gameHours(k) ? fmtHM(gameHours(k)) + " logged today" : "Start the timer when you start playing") + '</small></div>';
      w.appendChild(mkBtn("▶ Start", "btn-main", startGame));
    }
    return w;
  }
  setInterval(() => {
    const on = !!gameSession.startAt, pill = $("gamePill");
    if (pill) pill.hidden = !on;
    if (!on) return;
    document.querySelectorAll("[data-gclock]").forEach(e => { e.textContent = fmtStopwatch(sessionMs()); });
    if (++gameTicks % 60 === 0 && tab === "tonight" && document.visibilityState === "visible") renderAll();
  }, 1000);
  function isWeekend(k) { const w = dow(k); return w === 0 || w === 6; }
  function gameHours(k) { return Number(days[k] && days[k].game) || 0; }
  function renderWeekend() {
    const box = $("weekendCard");
    const wk = isWeekend(viewDate);
    box.hidden = !wk; $("timelineBox").hidden = wk;
    // weekdays: plan lab weekends ahead
    const lp = $("labPlan"); lp.innerHTML = "";
    if (!wk && viewDate === todayKey()) {
      const sat = addDays(viewDate, 6 - dow(viewDate)), sun = addDays(sat, 1);
      const lbl = document.createElement("span"); lbl.className = "small muted"; lbl.textContent = "Lab this weekend?";
      const chips = document.createElement("div"); chips.className = "daychips";
      [[sat, "Sat"], [sun, "Sun"]].forEach(([k, t]) => { const c = mkBtn(t, "", () => writeDay(k, { lab: !isLab(k) })); c.setAttribute("aria-pressed", String(isLab(k))); c.setAttribute("aria-label", "Lab day on " + niceDate(k)); chips.appendChild(c); });
      lp.append(lbl, chips);
      if (isLab(sat) || isLab(sun)) { const n = document.createElement("span"); n.className = "small muted"; n.textContent = "Weekend chores excused on the marked days."; lp.appendChild(n); }
    }
    if (!wk) return;
    const sat = dow(viewDate) === 6 ? viewDate : addDays(viewDate, -1), sun = addDays(sat, 1);
    const live = gameSession.startAt && viewDate === todayKey() ? sessionMs() / 3600000 : 0;
    const total = gameHours(sat) + gameHours(sun) + live, mine = gameHours(viewDate);
    const isSat = viewDate === sat;
    const choresLeft = habitsOn(viewDate).filter(h => dueOn(h, viewDate) && !isDone(h.id, viewDate) && h.group !== FREE_GROUP).length;
    const nextPlan = planOf(addDays(viewDate, 1));
    const lab = isLab(viewDate);
    const prepLeft = !isSat && !nextPlan.skipped && !lab ? PREP_STEPS.filter(([id]) => !(nextPlan.steps || {})[id]).length : 0;
    const pct = Math.min(100, total / GAME_MAX * 100), minPct = GAME_MIN / GAME_MAX * 100;
    let status;
    if (lab) status = "Lab day. Weekend chores" + (isSat ? "" : ", lunch prep") + " and weekly targets are excused. Only the daily basics count: " + choresLeft + " left. +15 XP overtime bonus at midnight.";
    else if (choresLeft || prepLeft) status = (choresLeft ? choresLeft + " chore" + (choresLeft === 1 ? "" : "s") : "") + (choresLeft && prepLeft ? " and " : "") + (prepLeft ? prepLeft + " lunch prep step" + (prepLeft === 1 ? "" : "s") : "") + " left before game time. Do them in one block, then you're free.";
    else status = "Duties done for today. The rest of the day is game time.";
    box.innerHTML =
      '<div class="eyebrow">Weekend · ' + (lab ? "Lab day: wild card played" : isSat ? "Saturday: chores block, then play" : "Sunday: lunch prep, then play") + '</div>' +
      '<div class="between"><h2>Game time</h2><span class="mono small muted">' + fmtHM(total) + ' this weekend · goal ' + GAME_MIN + '–' + GAME_MAX + ' h</span></div>' +
      '<div class="gamebar"><span class="gfill" style="width:' + pct + '%"></span><span class="gmin" style="left:' + minPct + '%"></span></div>' +
      '<p class="small muted"></p>' +
      '<div class="row"><span class="small">Played ' + (isSat ? "Saturday" : "Sunday") + ':</span><span class="stepper"><button type="button" id="gMinus" aria-label="Half an hour less">−</button><span class="mono small" style="min-width:4.5em;text-align:center">' + fmtHM(mine) + '</span><button type="button" id="gPlus" aria-label="Half an hour more">+</button></span><button type="button" class="btn-small" id="gPlus2">+2 h</button></div>';
    box.querySelector("p").textContent = status;
    const gw = gameWidget(viewDate); if (gw) box.insertBefore(gw, box.querySelector(".row"));
    const set = v => setGame(viewDate, Math.max(0, Math.min(16, Math.round(v * 100) / 100)));
    $("gMinus").onclick = () => set(mine - 0.5); $("gPlus").onclick = () => set(mine + 0.5); $("gPlus2").onclick = () => set(mine + 2);
    const lr = document.createElement("div"); lr.className = "row";
    const lk = "lab:" + viewDate;
    if (lab) lr.appendChild(mkBtn("Undo lab day", "btn-small", () => writeDay(viewDate, { lab: false })));
    else lr.appendChild(mkBtn(confirmBox[lk] ? "Confirm: I'm working today" : "Working in the lab today? Play the lab wild card", "btn-small" + (confirmBox[lk] ? " danger" : ""), () => confirmThen(lk, () => writeDay(viewDate, { lab: true }))));
    box.appendChild(lr);
    if (viewDate > addDays(todayKey(), 6)) box.querySelectorAll("button").forEach(b => b.disabled = true);
    else if (viewDate > todayKey()) [$("gMinus"), $("gPlus"), $("gPlus2")].forEach(b => b.disabled = true);
  }
  function setGame(k, v) {
    writeDay(k, { game: v });
  }

  function renderTimeline() {
    renderWeekend();
    const gb = $("gameSessBox"); if (gb) { gb.innerHTML = ""; const gw = !isWeekend(viewDate) ? gameWidget(viewDate) : null; if (gw) gb.appendChild(gw); }
    const isToday = viewDate === todayKey();
    const d = new Date(), mins = nowMins();
    const dot = $("nowDot"), fill = $("fill"), note = $("tlNote");
    const hm = pad(d.getHours()) + ":" + pad(d.getMinutes());
    if (viewDate > todayKey()) { dot.hidden = true; fill.style.width = "0"; note.textContent = "Preview of " + niceDate(viewDate) + ". Chores first from 18:30, free time from 21:30."; return; }
    if (!isToday) { dot.hidden = true; fill.style.width = "100%"; note.textContent = "Looking back at " + niceDate(viewDate) + ". Tick what you did; past nights are scored again from the new ticks."; return; }
    if (mins < START) { dot.hidden = true; fill.style.width = "0"; note.textContent = "Duty time starts when you get home at 18:30. Chores first, then free time from 21:30."; return; }
    const pct = (mins - START) / SPAN * 100; dot.hidden = false; dot.style.left = pct + "%"; fill.style.width = Math.min(pct, (FREE - START) / SPAN * 100) + "%";
    if (mins < FREE) { const left = FREE - mins; note.textContent = "It's " + hm + ". Duty time: " + Math.floor(left / 60) + " h " + pad(left % 60) + " min until free time at 21:30."; }
    else note.textContent = "It's " + hm + ". Free time: read your 30 minutes, then play. Tonight's fight is scored at midnight.";
  }

  function renderTodo(shownList, isToday, isFuture) {
    const box = $("todo"); box.innerHTML = "";
    const k = viewDate, gOrder = Object.keys(GROUPS), preStart = k < (game.startDate || todayKey());
    const isFree = h => h.group === FREE_GROUP;
    const sortFn = (a, b) => gOrder.indexOf(a.group) - gOrder.indexOf(b.group) || (a.order || 0) - (b.order || 0);
    const bossSet = new Set(evaluateDay(k, G.level).daily.map(h => h.id)), isBoss = h => bossSet.has(h.id);
    const CU = catchUps(k), isCu = h => CU.has(h.id);
    const catchList = shownList.filter(h => !isFree(h) && isCu(h)).sort((a, b) => (isBoss(b) - isBoss(a)) || sortFn(a, b));
    const must = shownList.filter(h => !isFree(h) && isBoss(h) && !isCu(h)).sort(sortFn);
    const opt = shownList.filter(h => !isFree(h) && !isBoss(h) && !isCu(h)).sort(sortFn);
    const free = shownList.filter(h => isFree(h)).sort(sortFn);
    const all = catchList.concat(must, opt, free);
    const doneN = all.filter(h => isDone(h.id, k)).length;
    $("count").textContent = all.length ? doneN + " / " + all.length + " done" : "";
    $("todoFill").style.width = (all.length ? doneN / all.length * 100 : 0) + "%";
    const R = evaluateDay(k, G.level);
    const mLeft = Math.max(0, R.mustNeed - Math.min(R.doneDaily.length, R.mustNeed));
    const aLeft = Math.max(0, R.need - R.hits - mLeft);
    const toWin = [mLeft ? mLeft + " more must-do" + (mLeft === 1 ? "" : "s") : "", aLeft ? aLeft + " of anything" : ""].filter(Boolean).join(" + ");
    let note = "";
    if (isFuture) note = "Preview. You can tick these on the day.";
    else if (preStart) note = "Setup day: nothing is scored yet. Have a look at how a normal evening will feel.";
    else if (!all.length) note = "Nothing due. Enjoy the evening.";
    else if (doneN === all.length) note = "Everything's done. Go read and play.";
    else if (R.win) note = "The monster is beaten. Anything else is bonus loot: XP and gold.";
    else if (isToday && !inFreeTime()) { const left = FREE - nowMins(); note = "To kill the monster: " + toWin + "." + (left > 0 && nowMins() >= START ? " " + Math.floor(left / 60) + " h " + pad(left % 60) + " min until free time." : "") + (mLeft ? " Start at the top." : " Pick any task, reading counts too."); }
    else note = "To kill the monster: " + toWin + ". If it survives midnight, open must-dos strike back: " + STRIKE + " HP, at most once per party member.";
    $("todoNote").textContent = note;
    let firstMarked = false; const riskShown = new Set();   // a member can only be struck once a night, so show their risk once
    const row = (h, kind) => {
      const done = isDone(h.id, k);
      const b = document.createElement("button"); b.type = "button";
      const first = !done && !firstMarked && !isFuture && kind !== "free"; if (first) firstMarked = true;
      b.className = "titem" + (done ? " done" : "") + (first ? " first" : ""); b.setAttribute("aria-pressed", String(done));
      b.style.setProperty("--c", GROUPS[h.group].color);
      b.innerHTML = '<span class="check">' + CHECK + '</span><span class="tname"></span><span class="tside"></span>';
      const nm = b.querySelector(".tname");
      if (first) { const sh = document.createElement("span"); sh.className = "starthere"; sh.textContent = "Start here"; sh.style.display = "block"; nm.appendChild(sh); }
      nm.appendChild(document.createTextNode(displayName(h, k)));
      if (h.note && !done) { const nt = document.createElement("span"); nt.className = "tnote"; nt.textContent = h.note.split(" · ").slice(0, 3).join(" · ") + (h.note.split(" · ").length > 3 ? " …" : ""); nm.appendChild(nt); }
      const meta = document.createElement("span"); meta.className = "tmeta";
      let mt = "";
      if (CU.has(h.id)) mt = "↩ " + CU.get(h.id);
      else if (isAfter(h)) mt = freqText(h);
      else if (isScheduled(h)) mt = freqText(h);
      else if (h.perWeek < 7) mt = weekCountTo(h.id, k) + "/" + h.perWeek + " this week";
      else { const st = streakOf(h, k); if (st > 1) mt = st + " in a row"; }
      meta.textContent = mt; if (mt) nm.appendChild(meta);
      const side = b.querySelector(".tside");
      const gp = PARTY.find(x => x.id === GROUPS[h.group].member);
      if (!done && kind === "must" && mLeft > 0 && !preStart && !riskShown.has(gp.id) && riskShown.add(gp.id)) { side.innerHTML = portrait(gp, 22) + '<span>' + ICON.heart + '−' + STRIKE + '</span>'; side.classList.add("risk"); side.dataset.tip = "Must-do: a hit on the monster and +10 XP for " + gp.name + ". The monster needs " + R.mustNeed + " must-dos tonight; if it survives midnight, " + gp.name + " (" + gp.cls + ") can take " + STRIKE + " damage (never more than once a night)."; }
      else if (!done) { side.innerHTML = portrait(gp, 22) + '<span>' + ICON.star + '+' + (h.perWeek < 7 && !isScheduled(h) ? 15 : 10) + '</span>'; side.dataset.tip = (kind === "must" ? "Must-do: a hit on the monster" : "Counts as one of the monster’s “anything” hits, or bonus loot (+" + BONUS_GOLD + " gold) once those are filled") + ". +" + (h.perWeek < 7 && !isScheduled(h) ? 15 : 10) + " XP for " + gp.name + " (" + gp.cls + ") and 3 HP of healing."; }
      const timed = h.minutes && !done && k === todayKey();
      if (timed) {
        const running = timer && timer.hid === h.id && timer.k === k;
        meta.textContent = running ? "⏱ " + (timerLeft() ? fmtClock(timerLeft()) + " left · tap to open" : "time's up") : "⏱ tap to start the " + h.minutes + "-min timer · counts when it ends";
        if (!mt) nm.appendChild(meta);
        b.classList.add("timed"); b.onclick = () => running ? showTimer() : startTimer(h, k);
      } else b.onclick = () => toggleDay(h.id, k);
      if (isFuture) b.disabled = true;
      return b;
    };
    const section = (title, sub, list, kind) => {
      const open = list.filter(h => !isDone(h.id, k));
      if (!open.length) return;
      const sec = document.createElement("div"); sec.className = "tsec";
      sec.innerHTML = '<div class="tsec-h"><span class="eyebrow"></span><span class="small muted"></span></div>';
      sec.querySelector(".eyebrow").textContent = title; sec.querySelector(".small").textContent = sub;
      open.forEach(h => { sec.appendChild(row(h, typeof kind === "function" ? kind(h) : kind)); if (h.link === "dinner" && !isFuture) { const pd = plannedDinners(k); if (pd.length) sec.appendChild(recipeChips(pd)); } });
      box.appendChild(sec);
    };
    section("Catch-up from the week", "missed on weekdays · first in line", catchList, h => isBoss(h) ? "must" : "opt");
    section("Must-dos", "the monster needs " + R.mustNeed + " of these", must, "must");
    // Sunday lunch prep shows up as part of the day's list
    const prepWeek = addDays(k, 1), prepPlan = planOf(prepWeek);
    if (dow(k) === 0 && !isLab(k) && !prepPlan.skipped && !isFuture) {
      const openSteps = PREP_STEPS.filter(([id]) => !(prepPlan.steps || {})[id]);
      if (openSteps.length) {
        const sec = document.createElement("div"); sec.className = "tsec";
        sec.innerHTML = '<div class="tsec-h"><span class="eyebrow">Lunch prep</span><span class="small muted">' + (5 - openSteps.length) + ' of 5 · long rest when done</span></div>';
        openSteps.forEach(([id, text]) => {
          const b = document.createElement("button"); b.type = "button"; b.className = "titem"; b.style.setProperty("--c", "var(--rogue)");
          b.innerHTML = '<span class="check">' + CHECK + '</span><span class="tname"></span><span class="tside">10 XP</span>';
          b.querySelector(".tname").textContent = text;
          b.onclick = () => { const p = clonePlan(prepWeek); p.steps[id] = todayKey(); savePlan(p); };
          sec.appendChild(b);
          if (id === "shop") sec.appendChild(mkBtn("Open the shopping list", "btn-small", () => setTab("shop")));
          if (id === "cook") { const lc = (prepPlan.recipes || []).map(r => ({ rc: recipes.find(x => x.id === r.id), kind: "lunch", count: r.portions, week: prepWeek })).filter(o => o.rc); if (lc.length) sec.appendChild(recipeChips(lc)); }
        });
        const go = mkBtn("Open recipes", "btn-small", () => setTab("lunch")); sec.appendChild(go);
        box.appendChild(sec);
      }
    }
    section("Extras", "hit the monster too, then bonus loot", opt, "opt");
    section("Free time", "from 21:30 · counts as anything", free, "free");
    const doneList = all.filter(h => isDone(h.id, k));
    if (doneList.length) {
      const d = document.createElement("details"); d.className = "done-box"; d.open = !!openRecipe.__doneOpen;
      d.addEventListener("toggle", () => { openRecipe.__doneOpen = d.open; });
      const sm = document.createElement("summary"); sm.textContent = "Done (" + doneList.length + ") · tap to undo"; d.appendChild(sm);
      const inner = document.createElement("div"); inner.className = "tsec"; inner.style.marginTop = "6px";
      doneList.forEach(h => inner.appendChild(row(h, "done")));
      d.appendChild(inner); box.appendChild(d);
    }
    if (!all.length) { const p = document.createElement("p"); p.className = "small muted"; p.textContent = visibleHabits().length ? "Nothing due on this day." : "No habits yet."; box.appendChild(p);
      if (!visibleHabits().length) { const sb = mkBtn("Load the starter habits and recipes", "btn-main", async () => { sb.disabled = true; sb.textContent = "Loading…"; try { await window.loadStarter(); } catch (e) { sb.disabled = false; sb.textContent = "Couldn't load. Try again"; } }); box.appendChild(sb); } }
  }

  function renderTonight() {
    const today = todayKey(), isToday = viewDate === today, isFuture = viewDate > today;
    const startK = game.startDate || today;
    $("dateLabel").textContent = isToday ? "Today, " + parseKey(viewDate).toLocaleDateString("en-GB", { day: "numeric", month: "short" }) : (viewDate === addDays(today, 1) ? "Tomorrow, " + parseKey(viewDate).toLocaleDateString("en-GB", { day: "numeric", month: "short" }) : niceDate(viewDate));
    $("next").disabled = viewDate >= addDays(today, MAX_AHEAD); $("prev").disabled = viewDate <= startK; $("todayBtn").hidden = isToday;
    $("listTitle").textContent = isToday ? "Tonight" : isFuture ? "Coming up" : "That evening";
    renderTimeline();
    setTimeout(maybeTale, 0);

    const list = visibleHabits();
    const cuShown = catchUps(viewDate);
    const shownList = habitsOn(viewDate).filter(h => dueOn(h, viewDate) || cuShown.has(h.id));
    const doneN = shownList.filter(h => isDone(h.id, viewDate)).length;
    $("count").textContent = shownList.length ? doneN + " of " + shownList.length + " done" : "";

    // encounter
    const r = evaluateDay(viewDate, G.level);
    const enc = $("encounter"); enc.classList.toggle("won", r.win && !isFuture);
    const left = Math.max(0, r.foeHp - r.dealt);
    const bonusXp = 10 * r.bonus;
    let threat = "";
    if (isToday && !r.win && viewDate >= startK) {
      let tot = r.missedDaily.length * STRIKE; PARTY.forEach(p => { if (!G.members[p.id].ko) tot += LOSS_ALL; });
      threat = '<div class="threat-line"><span class="tl-lbl" data-tip="What happens if the monster is still alive at midnight, counted as things stand right now.">At midnight:</span><span data-tip="Damage if it survives: for each missing hit, an open must-do strikes its guardian for ' + STRIKE + ' (each member at most once), plus ' + LOSS_ALL + ' to every member still standing.">' + ICON.heart + '−' + tot + '</span><span data-tip="XP lost if the night is lost.">' + ICON.star + '−10</span><span data-tip="Gold lost if the night is lost: a quarter of your purse.">' + ICON.coin + '−' + Math.floor(G.gold * 0.25) + '</span></div>';
    }
    const need = r.need, landed = r.hits;
    const mustLit = Math.min(r.doneDaily.length, r.mustNeed), anyLit = landed - mustLit;
    const swords = Array.from({ length: need }, (_, i) => { const any = i >= r.mustNeed; const on = any ? i - r.mustNeed < anyLit : i < mustLit; return '<span class="sw' + (any ? " any" : "") + (on ? " on" : "") + '">' + ICON.sword + '</span>'; }).join("");
    const mustLeft = r.mustNeed - mustLit, anyLeft = r.anyNeed - anyLit;
    const hitNow = isToday && Date.now() - lastHit < 1600;
    enc.innerHTML =
      '<div class="foe"><div class="foe-icon' + (hitNow ? " hit" : "") + (r.win ? " dead" : "") + '" data-tip="Tonight’s monster takes 6 hits: at least 4 must-dos, plus 2 of anything (extras, reading, weekly chores). Kill it and nobody takes damage; you get XP, gold and healing.">' + foeIcon(r.monster) + (hitNow ? '<span class="dmgfloat">−10</span>' : "") + '</div>' +
      '<div style="min-width:0;flex:1"><div class="eyebrow">' + (isToday ? "Tonight" : niceDate(viewDate)) + '</div><div class="foe-name">' + esc(r.monster) + '</div></div>' +
      '<div class="foe-hpbig" data-tip="Monster HP left: 10 for each hit still needed. At 0 the party wins the night: no damage, plus XP, gold and healing.">' + ICON.heart + '<b>' + left + '</b></div></div>' +
      '<div class="foe-hp">' + bar(r.foeHp ? left / r.foeHp * 100 : 0, "var(--hurt)") + '</div>' +
      '<div class="hits"><div class="swords" aria-label="' + landed + ' of ' + need + ' hits" data-tip="Solid swords need must-dos. Dashed swords take any task (extras, reading, more must-dos). Lit swords are hits landed. Light them all to win.">' + swords + '</div><span class="hitlbl">' + (r.win ? (need ? "Defeated! No damage tonight" : "A quiet night") : [mustLeft ? mustLeft + " must-do" + (mustLeft === 1 ? "" : "s") : "", anyLeft ? anyLeft + " of anything" : ""].filter(Boolean).join(" + ") + " to win") + '</span></div>' + threat +
      (r.win || r.bonus ? '<div class="loot-line" data-tip="Hits past the 6 the monster needs are bonus loot: their XP plus +' + BONUS_GOLD + ' gold each when the monster falls.">' + ICON.star + '<span>' + (r.bonus ? "Bonus loot: " + r.bonus + " extra hit" + (r.bonus === 1 ? "" : "s") + " · +" + bonusXp + " XP · +" + BONUS_GOLD * r.bonus + " gold" : "Want more loot? Every task past the kill adds XP and +" + BONUS_GOLD + " gold.") + '</span></div>' : "");
    if (isFuture) enc.innerHTML = '<div class="foe"><div class="foe-icon">' + foeIcon(r.monster) + '</div><div style="min-width:0;flex:1"><div class="eyebrow">' + (viewDate === addDays(today, 1) ? "Tomorrow" : niceDate(viewDate)) + '</div><div class="foe-name">' + esc(r.monster) + '</div></div><div class="foe-hpbig" data-tip="The monster’s HP: 10 per must-do that day.">' + ICON.heart + '<b>' + r.foeHp + '</b></div></div><div class="hits"><div class="swords" data-tip="Hits needed that night: solid ones must be must-dos, dashed ones can be anything.">' + Array.from({ length: r.need }, (_, i) => '<span class="sw' + (i >= r.mustNeed ? " any" : "") + '">' + ICON.sword + '</span>').join("") + '</div><span class="hitlbl">' + r.mustNeed + ' must-do' + (r.mustNeed === 1 ? "" : "s") + (r.anyNeed ? ' + ' + r.anyNeed + ' of anything' : "") + ' to kill</span></div>';
    if (viewDate < startK) { enc.classList.add("won"); enc.innerHTML = '<div class="eyebrow">Setup day</div><div class="foe-name">The adventure starts ' + (startK === addDays(today, 1) ? "tomorrow" : niceDate(startK)) + '</div><p class="small muted">Nothing today is scored. Tick things if you like, it costs nothing.</p>'; }
    // rest day
    const resting = !!(days[viewDate] && days[viewDate].rest);
    if (resting) {
      enc.classList.add("won");
      enc.innerHTML = '<div class="eyebrow">Rest day</div><div class="foe-name">The party is resting</div><p class="small muted">No monster, no damage and no XP for ' + (isToday ? "today" : niceDate(viewDate)) + '. Tick anything you still manage; it just won\'t be scored.</p>';
    }
    if (window.STORY && game.startDate && viewDate >= startK && !isFuture && !resting && r.need) {
      const lg = storyLog(viewDate), n = r.win ? lg.wins : lg.wins + 1, pg = storyPage(n, r.monster);
      const strip = document.createElement("button"); strip.type = "button"; strip.className = "chapter-strip"; strip.style.setProperty("--sc", pg.color);
      strip.innerHTML = '<span class="cs-emblem">' + ART.svg(pg.icon, 22, pg.color) + '</span><span class="cs-text"><small></small><b></b></span>' + storyDots(r.win ? pg : Object.assign({}, pg, { page: pg.page - 1 }));
      strip.querySelector("small").textContent = (pg.book === 1 ? "Chapter " + pg.chapter : "Chronicles") + (r.win ? " · page " + pg.page + " written" : " · tonight’s win writes page " + pg.page);
      strip.querySelector("b").textContent = pg.title;
      strip.dataset.tip = r.win ? "Tonight’s page of the story is written. Read it in the tale, or the whole story in Party." : "Every night you win turns a page of the story. Seven pages finish a chapter.";
      strip.onclick = () => { setTab("party"); setTimeout(() => { const sp = $("storyPanel"); if (sp) sp.scrollIntoView({ behavior: "smooth", block: "start" }); }, 50); };
      enc.prepend(strip);
    }
    if (r.win && r.need && !isFuture && !resting && viewDate >= startK) { const tb = mkBtn(isToday ? "Read tonight’s tale" : "Read that night’s tale", "btn-small tale-btn", () => openTale(viewDate)); enc.appendChild(tb); }
    if (viewDate <= addDays(today, MAX_AHEAD) && viewDate >= startK) {
      const rk = "rest:" + viewDate, rl = restLeft(viewDate);
      const rr = document.createElement("div"); rr.className = "row";
      if (resting) rr.appendChild(mkBtn("Cancel rest day", "btn-small", () => writeDay(viewDate, { rest: false })));
      else {
        const b = mkBtn(confirmBox[rk] ? "Confirm rest day" : "Sick or away? Take a rest day", "btn-small" + (confirmBox[rk] ? " danger" : ""), () => confirmThen(rk, () => writeDay(viewDate, { rest: true })));
        if (rl <= 0) { b.disabled = true; b.title = "No rest days left this month"; }
        const s = document.createElement("span"); s.className = "small muted"; s.textContent = rl + " of " + REST_PER_MONTH + " left this month";
        rr.append(b, s);
      }
      enc.appendChild(rr);
    }

    // to-do list: must-do first, then optional, then free time; done items fold away
    renderTodo(shownList, isToday, isFuture);

    // week grid
    const t = $("week"); t.innerHTML = "";
    if (list.length) {
      const cols = []; for (let i = 6; i >= 0; i--) cols.push(addDays(viewDate, -i));
      let html = "<tr><th></th>" + cols.map(k => "<th>" + parseKey(k).toLocaleDateString("en-GB", { weekday: "short" }).slice(0, 2) + "<br>" + parseKey(k).getDate() + "</th>").join("") + "</tr>";
      t.innerHTML = html;
      list.forEach(h => {
        const tr = document.createElement("tr"); tr.style.setProperty("--c", GROUPS[h.group].color);
        const nm = document.createElement("td"); nm.textContent = h.name; tr.appendChild(nm);
        cols.forEach(k => {
          const td = document.createElement("td"); const on = isDone(h.id, k);
          const c = document.createElement("button"); c.type = "button"; c.className = "cell" + (on ? " on" : "") + (k === viewDate ? " sel" : "");
          c.setAttribute("aria-label", h.name + ", " + niceDate(k) + (on ? ", done" : ", not done")); c.setAttribute("aria-pressed", String(on));
          if (k > today || !activeOn(h, k)) c.disabled = true;
          if (isScheduled(h) && !scheduledOn(h, k) && !on) c.style.opacity = "0.35";
          c.onclick = () => toggleDay(h.id, k);
          td.appendChild(c); tr.appendChild(td);
        });
        t.appendChild(tr);
      });
    }

    // day strip (last 7 days ending at the viewed day)
    const ds = $("dayStrip"); ds.innerHTML = "";
    const logBy = {}; (G.log || []).forEach(e => logBy[e.k] = e);
    for (let i = 6; i >= 0; i--) {
      const dk = addDays(viewDate, -i);
      const due = habitsOn(dk).filter(h => dueOn(h, dk)); const dn = due.filter(h => isDone(h.id, dk)).length;
      const t = document.createElement("button"); t.type = "button"; t.className = "dtile" + (dk === viewDate ? " sel" : "");
      const e = logBy[dk];
      let res = "", cls = "other";
      if (dk < (game.startDate || today)) res = "setup";
      else if (days[dk] && days[dk].rest) res = "rest";
      else if (dk === today) res = "today";
      else if (dk > today) res = "";
      else if (e) { res = e.win ? "won" : "lost"; cls = e.win ? "win" : "loss"; if (e.lab) res += "·lab"; }
      t.innerHTML = '<span class="dn">' + parseKey(dk).toLocaleDateString("en-GB", { weekday: "short" }) + '</span><span class="dd">' + parseKey(dk).getDate() + '</span><span class="dbar"><span style="width:' + (due.length ? dn / due.length * 100 : 0) + '%"></span></span><span class="dc">' + (due.length ? dn + "/" + due.length : "–") + '</span><span class="dr ' + cls + '">' + res + '</span>';
      t.setAttribute("aria-label", niceDate(dk) + ": " + dn + " of " + due.length + " done" + (res ? ", " + res : ""));
      if (dk < (game.startDate || today) || dk > addDays(today, MAX_AHEAD)) t.disabled = true;
      t.onclick = () => { viewDate = dk; skip = 0; renderTonight(); window.scrollTo({ top: 0, behavior: "smooth" }); };
      ds.appendChild(t);
    }

    // manage
    const ml = $("mlist"); ml.innerHTML = "";
    list.forEach((h, i) => {
      const r2 = document.createElement("div"); r2.className = "mrow";
      r2.innerHTML = '<span class="grow"></span><span class="small muted">' + esc(GROUPS[h.group].label) + " · " + esc(freqText(h)) + (h.rotation ? " · rotates weekly" : "") + '</span>';
      r2.querySelector(".grow").textContent = h.name;
      if (isScheduled(h) && !everyDays(h)) {
        const chips = document.createElement("div"); chips.className = "daychips"; chips.style.flexBasis = "100%";
        WEEK_ORDER.forEach(d => {
          const on = h.days.includes(d);
          const c = mkBtn(DAYNAMES[d], "", () => {
            const nd = on ? h.days.filter(x => x !== d) : h.days.concat(d);
            if (!nd.length) { $("hStatus").textContent = "Keep at least one day, or remove the habit."; return; }
            if (ready()) db.collection("habits").doc(h.id).update({ days: nd }).catch(writeErr);
          });
          c.setAttribute("aria-pressed", String(on)); c.setAttribute("aria-label", h.name + " on " + DAYNAMES[d]);
          chips.appendChild(c);
        });
        r2._chips = chips;
      }
      const up = mkBtn("↑", "btn-small", () => moveHabit(h, -1)); up.setAttribute("aria-label", "Move " + h.name + " up"); if (i === 0) up.disabled = true;
      const key = "h:" + h.id;
      const del = mkBtn(confirmBox[key] ? "Confirm remove" : "Remove", "btn-small" + (confirmBox[key] ? " danger" : ""), () => confirmThen(key, () => archiveHabit(h)));
      r2.append(up, del); if (r2._chips) r2.appendChild(r2._chips); ml.appendChild(r2);
    });
  }
  function memberName(group) { const p = PARTY.find(x => x.id === GROUPS[group].member); return p ? p.name : ""; }
  function foeIcon(name) {
    if (window.ART) return '<span class="foe-art" style="--mc:' + ART.monsterColor(name) + '">' + ART.monster(name, 34) + '</span>';
    const h = hash(name); const eyes = 2 + (h % 2);
    const tints = ["var(--hurt)", "var(--rogue)", "var(--hobby)", "var(--house)"];
    let s = '<svg width="34" height="34" viewBox="0 0 34 34" aria-hidden="true">';
    if ((h >> 3) % 2) s += '<path d="M9 12L6 3l7 6M25 12l3-9-7 6" fill="' + tints[h % 4] + '"/>';
    s += '<path d="M5 30c0-14 5-24 12-24s12 10 12 24l-4-3-4 3-4-3-4 3-4-3z" fill="' + tints[h % 4] + '" opacity=".88"/>';
    if ((h >> 5) % 2) s += '<path d="M12 23l2 2 2-2 2 2 2-2 2 2" fill="none" stroke="var(--surface)" stroke-width="1.4" stroke-linejoin="round"/>';
    for (let i = 0; i < eyes; i++) { const x = eyes === 2 ? 13 + i * 8 : 11 + i * 6; s += '<circle cx="' + x + '" cy="16" r="2.4" fill="var(--surface)"/><circle cx="' + x + '" cy="16.6" r="1.1" fill="var(--ink)"/>'; }
    return s + "</svg>";
  }
  function mkBtn(text, cls, fn) { const b = document.createElement("button"); b.type = "button"; b.className = cls; b.textContent = text; b.onclick = fn; return b; }
  function confirmThen(key, fn) {
    if (confirmBox[key]) { delete confirmBox[key]; fn(); return; }
    confirmBox[key] = true; renderAll();
    setTimeout(() => { if (confirmBox[key]) { delete confirmBox[key]; renderAll(); } }, 4000);
  }

  /* ================= party tab ================= */
  function renderPartyTab() {
    renderStoryPanel();
    $("members").innerHTML = "";
    PARTY.forEach(p => {
      const m = G.members[p.id], mx = m.max || maxHp(G.level);
      const lo = xpFor(m.lv), hi = xpFor(m.lv + 1);
      const card = document.createElement("div"); card.className = "panel mcard";
      card.innerHTML = '<div class="mhead"><span class="' + (m.ko ? "ko-portrait" : "") + '">' + portrait(p, 60) + '</span>' +
        '<div class="stack" style="gap:5px;min-width:0;flex:1"><div class="between"><h3>' + esc(p.name) + '</h3><span class="lvpill">' + p.cls + ' · Lv ' + m.lv + '</span></div>' +
        '<div class="statrow" data-tip="Health. Missed must-dos and lost nights hurt; finished tasks heal 3 each. At 0 they’re knocked out until the party wins two nights.">' + ICON.heart + bar(m.hp / mx * 100, m.hp / mx <= 0.3 ? "var(--hurt)" : "var(--hp)") + '<span class="mono small">' + (m.ko ? "down" : m.hp + "/" + mx) + '</span></div>' +
        '<div class="statrow" data-tip="XP toward ' + esc(p.name) + '’s next level, earned from ' + esc(p.guards) + ' tasks.">' + ICON.star + bar((m.xp - lo) / (hi - lo) * 100, "var(--hobby)") + '<span class="mono small">' + (m.xp - lo) + "/" + (hi - lo) + '</span></div>' +
        '<span class="small muted">Grows from: ' + esc(p.guards) + (m.ko ? ' · <b style="color:var(--hurt)">down, ' + (2 - m.wins) + ' win' + (2 - m.wins === 1 ? "" : "s") + ' to get up</b>' : "") + '</span></div></div>';
      const det = document.createElement("details"); det.className = "mlog"; det.open = !!openRecipe["log:" + p.id];
      det.addEventListener("toggle", () => { openRecipe["log:" + p.id] = det.open; });
      const sm = document.createElement("summary"); sm.textContent = p.name.split(" ").pop() + "'s log"; det.appendChild(sm);
      const list = document.createElement("div"); list.className = "log";
      const entries = (m.log || []).slice(-10).reverse();
      if (!entries.length) list.innerHTML = '<p class="small muted">Nothing yet. Their story starts tonight.</p>';
      entries.forEach(e => {
        const row = document.createElement("div"); row.className = "log-row";
        row.innerHTML = '<div class="log-date">' + niceDate(e.k) + '</div><div class="stack" style="gap:2px"><div class="row" style="gap:10px">' + (e.xp ? '<span class="chip">' + ICON.star + '+' + e.xp + '</span>' : "") + (e.dmg ? '<span class="chip bad">' + ICON.heart + '−' + e.dmg + '</span>' : "") + (e.notes.length ? '<span class="chip lvl">' + esc(e.notes.join(" · ")) + '</span>' : "") + '</div><div class="small muted lg-did"></div><div class="small lg-miss" style="color:var(--hurt)"></div></div>';
        row.querySelector(".lg-did").textContent = e.did.length ? "✓ " + e.did.join(", ") : "";
        row.querySelector(".lg-miss").textContent = e.missed.length ? "✗ " + e.missed.join(", ") : "";
        list.appendChild(row);
      });
      det.appendChild(list); card.appendChild(det);
      $("members").appendChild(card);
    });

    // rewards
    const rw = $("rewards"); rw.innerHTML = "";
    if (!rewards.length) rw.innerHTML = '<p class="small muted">No rewards yet. Add something you actually want, then earn it.</p>';
    rewards.slice().sort((a, b) => a.cost - b.cost).forEach(r => {
      const row = document.createElement("div"); row.className = "reward";
      row.innerHTML = '<span class="grow"></span><span class="cost">' + r.cost + ' g</span>';
      row.querySelector(".grow").textContent = r.name;
      const key = "buy:" + r.id;
      const buy = mkBtn(confirmBox[key] ? "Confirm" : "Claim", "btn-small", () => confirmThen(key, () => buyReward(r)));
      if (G.gold < r.cost) { buy.disabled = true; buy.title = "Not enough gold yet"; }
      const dkey = "rdel:" + r.id;
      const del = mkBtn(confirmBox[dkey] ? "Confirm remove" : "×", "btn-small" + (confirmBox[dkey] ? " danger" : ""), () => confirmThen(dkey, () => delDoc("rewards", r.id)));
      del.setAttribute("aria-label", "Remove " + r.name);
      row.append(buy, del); rw.appendChild(row);
    });
    const recent = purchases.slice().sort((a, b) => (b.date || "").localeCompare(a.date || "")).slice(0, 3);
    if (recent.length) { const p = document.createElement("p"); p.className = "small muted"; p.textContent = "Recently claimed: " + recent.map(x => x.name + " (" + niceDate(x.date) + ")").join(", "); rw.appendChild(p); }

    // log
    const lg = $("log");
    const entries = G.log.slice(-14).reverse();
    if (!entries.length) { lg.innerHTML = '<p class="small muted">Your first night is scored at midnight. Results show up here.</p>'; return; }
    lg.innerHTML = entries.map(e => {
      const dm = {}; (e.dmg || []).forEach(d => dm[d.id] = (dm[d.id] || 0) + d.n);
      const dmText = PARTY.filter(p => dm[p.id]).map(p => p.name + " −" + dm[p.id]).join(", ");
      if (e.restDay) return '<div class="log-row"><div class="log-date">' + niceDate(e.k) + '</div><div class="row"><span class="tag rest">Rest day</span> <span class="small muted">No fight, no damage, no XP.</span></div></div>';
      const tag = e.wipe ? '<span class="tag loss">Party fell</span>' : e.win ? '<span class="tag win">Won</span>' : '<span class="tag loss">Lost</span>';
      return '<div class="log-row"><div class="log-date">' + niceDate(e.k) + '</div><div class="stack" style="gap:3px"><div class="row">' + tag + (e.rest ? ' <span class="tag rest">Long rest</span>' : "") + (e.lab ? ' <span class="tag rest">Lab day</span>' : "") + ' <span>vs ' + esc(e.monster) + '</span></div>' +
        '<div class="small muted mono">' + (e.xp >= 0 ? "+" : "") + e.xp + ' XP · ' + (e.gold >= 0 ? "+" : "") + e.gold + ' gold' + (dmText ? " · " + esc(dmText) : "") + '</div>' +
        (e.notes.length ? '<div class="small muted">' + e.notes.map(esc).join(" · ") + '</div>' : "") + '</div></div>';
    }).join("");
  }

  /* ================= lunch tab ================= */
  const UNIT_WORDS = ["g", "kg", "ml", "l", "tbsp", "tsp", "can", "cans", "clove", "cloves", "bunch", "pack", "packs", "pcs"];
  function fmtQty(q, unit) {
    if (unit === "g" && q >= 1000) return (Math.round(q / 100) / 10) + " kg";
    if (unit === "ml" && q >= 1000) return (Math.round(q / 100) / 10) + " l";
    if (unit === "g" || unit === "ml") return Math.round(q / 10) * 10 + " " + unit;
    const r = Math.round(q * 2) / 2;
    if (unit === "pcs" || !unit) return String(r);
    return r + " " + unit;
  }
  function roundCount(q, unit) { return (unit === "g" || unit === "ml" || unit === "tbsp" || unit === "tsp") ? q : Math.ceil(q - 0.01); }

  function renderLunch() {
    const today = todayKey(), week = prepWeekKey(today), plan = planOf(week);
    const prepDay = addDays(week, -1);
    const start = game.startDate || today;
    $("prepEyebrow").textContent = "Quest · lunches for the week of " + niceDate(week);
    $("prepTitle").textContent = prepDay === today ? "Sunday lunch prep: today" : "Sunday lunch prep on " + niceDate(prepDay);
    const doneSteps = PREP_STEPS.filter(([id]) => plan.steps && plan.steps[id]).length;
    const penalty = prepDay > start ? " If it isn't finished by Sunday midnight, Wren takes 8 damage." : " No penalty this first week.";
    $("prepStakes").textContent = doneSteps + " of 5 done. Each step is 10 XP. Finish all five by Sunday midnight for a long rest (party fully healed) and 60 XP." + penalty;
    const ps = $("prepSteps"); ps.innerHTML = "";
    PREP_STEPS.forEach(([id, text]) => {
      const done = !!(plan.steps && plan.steps[id]);
      const b = document.createElement("button"); b.type = "button"; b.className = "ms" + (done ? " done" : ""); b.style.setProperty("--c", "var(--rogue)"); b.setAttribute("aria-pressed", String(done));
      b.innerHTML = '<span class="check">' + CHECK + '</span><span class="ms-text"></span>'; b.querySelector(".ms-text").textContent = text;
      if (done) b.querySelector(".check").style.background = "var(--rogue)";
      b.querySelector(".check").querySelector("svg").style.opacity = done ? 1 : 0;
      b.onclick = () => { const p = clonePlan(week); if (p.steps[id]) delete p.steps[id]; else p.steps[id] = today; savePlan(p); };
      ps.appendChild(b);
    });

    // skip / undo skip
    const sk = $("prepSkip"); sk.innerHTML = "";
    const skipped = lastSkippedWeek(today);
    if (skipped) {
      const p = document.createElement("span"); p.className = "small muted"; p.textContent = "You skipped prep on " + niceDate(addDays(skipped, -1)) + ". This quest is for the following Sunday.";
      sk.append(p, mkBtn("Undo skip", "btn-small", () => { if (!ready()) return; delete plans[skipped]; renderAll(); db.collection("plans").doc(skipped).delete().catch(writeErr); }));
    } else if (!doneSteps) {
      const key = "skip:" + week;
      const free = !(prepDay > start);
      sk.appendChild(mkBtn(confirmBox[key] ? "Confirm skip" : "Skip this Sunday", "btn-small" + (confirmBox[key] ? " danger" : ""), () => confirmThen(key, () => { if (!ready()) return; plans[week] = { week, recipes: [], got: {}, steps: {}, skipped: true }; renderAll(); queueSet("plans", week, { week, recipes: [], got: {}, steps: {}, skipped: true, updatedAt: new Date().toISOString() }); })));
      const p = document.createElement("span"); p.className = "small muted"; p.textContent = free ? "Skipping is free this first week." : "Skipping counts as not done: Wren takes 8 damage that night.";
      sk.appendChild(p);
    }

    // week menu
    const total = plan.recipes.reduce((s, r) => s + (r.portions || 0), 0);
    $("planCount").textContent = total + " of " + LUNCHES + " lunches";
    const pl = $("planList"); pl.innerHTML = "";
    if (!plan.recipes.length) pl.innerHTML = '<p class="small muted">Pick one or two recipes from the recipe book below. One recipe covers all five days; two give you some variety.</p>';
    plan.recipes.forEach(pr => {
      const rc = recipes.find(x => x.id === pr.id); if (!rc) return;
      const row = document.createElement("div"); row.className = "mrow";
      row.innerHTML = '<span class="grow"></span>';
      row.querySelector(".grow").textContent = shortName(rc);
      const st = document.createElement("span"); st.className = "stepper";
      const minus = mkBtn("−", "", () => setPortions(week, pr.id, pr.portions - 1)); minus.setAttribute("aria-label", "Fewer portions");
      const num = document.createElement("span"); num.className = "mono small"; num.textContent = pr.portions + " lunch" + (pr.portions === 1 ? "" : "es");
      const plus = mkBtn("+", "", () => setPortions(week, pr.id, pr.portions + 1)); plus.setAttribute("aria-label", "More portions");
      if (total >= LUNCHES) plus.disabled = true;
      st.append(minus, num, plus);
      const bb = mkBtn((plan.brewed || {})[pr.id] ? "Brewed ✓" : "Brew", "btn-small", () => openBrew(rc, "lunch", pr.portions, week));
      row.append(st, bb); pl.appendChild(row);
    });
    if (total > 0 && total < LUNCHES) { const p = document.createElement("p"); p.className = "small muted"; p.textContent = (LUNCHES - total) + " more lunch" + (LUNCHES - total === 1 ? "" : "es") + " to plan."; pl.appendChild(p); }

    // dinners
    const nights = (plan.dinners || []).reduce((s, d) => s + (d.nights || 0), 0);
    $("dinnerCount").textContent = nights + " of " + DINNERS + " nights";
    const dl = $("dinnerList"); dl.innerHTML = "";
    if (!(plan.dinners || []).length) dl.innerHTML = '<p class="small muted">Pick quick dinners from the recipe book. Each one covers two nights. Leave a night or two open for leftovers or eating out.</p>';
    (plan.dinners || []).forEach(pd => {
      const rc = recipes.find(x => x.id === pd.id); if (!rc) return;
      const row = document.createElement("div"); row.className = "mrow";
      row.innerHTML = '<span class="grow"></span>'; row.querySelector(".grow").textContent = shortName(rc);
      const st = document.createElement("span"); st.className = "stepper";
      const minus = mkBtn("−", "", () => setNights(week, pd.id, pd.nights - 1)); minus.setAttribute("aria-label", "Fewer nights");
      const num = document.createElement("span"); num.className = "mono small"; num.textContent = pd.nights + " night" + (pd.nights === 1 ? "" : "s");
      const plus = mkBtn("+", "", () => setNights(week, pd.id, pd.nights + 1)); plus.setAttribute("aria-label", "More nights");
      if (nights >= DINNERS) plus.disabled = true;
      st.append(minus, num, plus); row.append(st, mkBtn("Brew", "btn-small", () => openBrew(rc, "dinner", pd.nights, week))); dl.appendChild(row);
    });

    // shopping list (shown in the Shopping section)
    const { buy, extras, staples, got } = foodShop(week);
    $("shopFoodTitle").textContent = "Food for the week of " + niceDate(week);
    $("shopFoodNote").textContent = (plan.recipes.length || (plan.dinners || []).length) ? "From the lunches and dinners picked in Food. Fresh things are marked to buy on Saturday." : "";
    $("shopJumpCount").textContent = buy.length + extras.length ? buy.concat(extras).filter(i => !got[i.key]).length + " to buy" : "";
    const sl = $("shopList"); sl.innerHTML = "";
    const gotN = buy.concat(extras).filter(i => got[i.key]).length;
    $("shopCount").textContent = buy.length + extras.length ? gotN + " of " + (buy.length + extras.length) + " in the basket" : "";
    if (!buy.length && !extras.length) { sl.innerHTML = '<p class="small muted">This fills in as soon as you pick lunches and dinners in Food.</p>'; const g = mkBtn("Pick this week's food", "btn-small", () => setTab("lunch")); sl.appendChild(g); }
    if (extras.length) {
      const box = document.createElement("div"); box.className = "aisle";
      box.innerHTML = '<span class="eyebrow">Extras</span>';
      extras.forEach(i => box.appendChild(shopRow(i, got[i.key], week)));
      sl.appendChild(box);
    }
    AISLES.forEach(a => {
      const its = buy.filter(i => (AISLES.includes(i.aisle) ? i.aisle : "Other") === a).sort((x, y) => x.item.localeCompare(y.item));
      if (!its.length) return;
      const box = document.createElement("div"); box.className = "aisle";
      box.innerHTML = '<span class="eyebrow">' + esc(a) + '</span>';
      its.forEach(i => box.appendChild(shopRow(i, got[i.key], week)));
      sl.appendChild(box);
    });
    if (buy.some(i => i.fresh)) { const p = document.createElement("p"); p.className = "small muted"; p.textContent = "Items marked “buy Sat” won't keep a full week. Pick them up the day before you cook."; sl.appendChild(p); }
    if (staples.length) {
      const box = document.createElement("div"); box.className = "aisle";
      box.innerHTML = '<span class="eyebrow">Check you have</span>';
      staples.sort((x, y) => x.item.localeCompare(y.item)).forEach(i => box.appendChild(shopRow(i, got[i.key], week)));
      sl.appendChild(box);
    }

    // recipe book
    const rb = $("recipes"); rb.innerHTML = "";
    if (!recipes.length) rb.innerHTML = '<p class="small muted">No recipes yet. Add one below.</p>';
    const kindOf = rc => rc.kind === "dinner" ? "dinner" : "lunch";
    const sorted = recipes.slice().sort((a, b) => (kindOf(a) === kindOf(b) ? 0 : kindOf(a) === "lunch" ? -1 : 1) || a.name.localeCompare(b.name));
    let lastKind = null;
    sorted.forEach(rc => {
      const kind = kindOf(rc);
      if (kind !== lastKind) { const hd = document.createElement("div"); hd.className = "eyebrow"; hd.style.marginTop = lastKind ? "8px" : "0"; hd.textContent = kind === "lunch" ? "Lunch prep (batch cook)" : "Quick dinners (about 2 nights each)"; rb.appendChild(hd); lastKind = kind; }
      const inPlan = kind === "lunch" ? plan.recipes.some(p => p.id === rc.id) : (plan.dinners || []).some(p => p.id === rc.id);
      const div = document.createElement("div"); div.className = "recipe";
      const card = document.createElement("div"); card.className = "rcard";
      const img = safeUrl((rc.image && rc.image.url) || "");
      if (img) { const im = document.createElement("img"); im.className = "rimg"; im.loading = "lazy"; im.alt = shortName(rc); im.src = img; im.onerror = () => { im.replaceWith(placeholderImg(kind)); }; card.appendChild(im); }
      else card.appendChild(placeholderImg(kind));
      const info = document.createElement("div"); info.className = "stack"; info.style.gap = "3px"; info.style.minWidth = "0";
      info.innerHTML = '<h3></h3><div class="rfull"></div><div class="small muted mono">' + (rc.minutes || "?") + ' min · ' + (kind === "lunch" ? "makes " + (rc.portions || "?") : (rc.portions || 2) + " nights") + '</div>';
      info.querySelector("h3").textContent = shortName(rc);
      info.querySelector(".rfull").textContent = rc.short ? rc.name : "";
      const links = document.createElement("div"); links.className = "row"; links.style.gap = "10px";
      const link = (label, href) => { const a = document.createElement("a"); a.href = href; a.target = "_blank"; a.rel = "noopener"; a.className = "small"; a.style.color = "var(--lamp)"; a.textContent = label + " ↗"; links.appendChild(a); };
      (Array.isArray(rc.links) ? rc.links : []).forEach(l => { const u = safeUrl(l.url || ""); if (u) link(l.label || "Recipe", u); });
      const su = safeUrl(rc.url || ""); if (su) link("Source", su);
      link("Video", videoUrl(rc));
      info.appendChild(links);
      if (img && rc.image.credit) { const c = document.createElement("div"); c.className = "rcredit"; const src = safeUrl(rc.image.source || ""); c.innerHTML = "Photo: " + (src ? '<a target="_blank" rel="noopener"></a>' : "<span></span>"); const t = c.lastChild; t.textContent = rc.image.credit; if (src) t.href = src; info.appendChild(c); }
      card.appendChild(info); div.appendChild(card);
      const acts = document.createElement("div"); acts.className = "row";
      const add = mkBtn(inPlan ? "Remove from week" : "Add to week", inPlan ? "btn-small" : "btn-small", () => kind === "lunch" ? (inPlan ? removeFromPlan(week, rc.id) : addToPlan(week, rc)) : (inPlan ? setNights(week, rc.id, 0) : addDinner(week, rc)));
      if (!inPlan && kind === "lunch" && total >= LUNCHES) { add.disabled = true; add.title = "All five lunches are planned"; }
      if (!inPlan && kind === "dinner" && nights >= DINNERS) { add.disabled = true; add.title = "All seven nights are planned"; }
      const show = mkBtn(openRecipe[rc.id] ? "Hide recipe" : "Show recipe", "btn-small", () => { openRecipe[rc.id] = !openRecipe[rc.id]; renderLunch(); });
      const key = "rc:" + rc.id;
      const del = mkBtn(confirmBox[key] ? "Confirm delete" : "Delete", "btn-small" + (confirmBox[key] ? " danger" : ""), () => confirmThen(key, () => { if (kind === "lunch") removeFromPlan(week, rc.id, true); else setNights(week, rc.id, 0); delDoc("recipes", rc.id); }));
      const brewBtn = mkBtn("Brew", "btn-small", () => openBrew(rc, kind, rc.portions, null));
      acts.append(add, brewBtn, show, del); div.appendChild(acts);
      if (openRecipe[rc.id]) {
        const det = document.createElement("div"); det.className = "stack"; det.style.gap = "8px";
        det.innerHTML = '<div><span class="eyebrow">Ingredients</span><ul></ul></div>' + ((rc.steps || []).length ? '<div><span class="eyebrow">Steps</span><ol></ol></div>' : "") + (rc.notes ? '<p class="small muted"></p>' : "");
        const ul = det.querySelector("ul");
        (rc.ingredients || []).forEach(i => { const li = document.createElement("li"); li.textContent = fmtQty(Number(i.qty) || 0, i.unit || "pcs") + " " + i.item + (i.staple ? " (staple)" : ""); ul.appendChild(li); });
        const ol = det.querySelector("ol"); if (ol) (rc.steps || []).forEach(s => { const li = document.createElement("li"); li.textContent = s; ol.appendChild(li); });
        const np = det.querySelector("p"); if (np) np.textContent = rc.notes;
        div.appendChild(det);
      }
      rb.appendChild(div);
    });
  }
  function foodShop(week) {
    const agg = {};
    const addIngs = (rc, f) => (rc.ingredients || []).forEach(ing => {
      const unit = ing.unit || "pcs"; const k = (ing.item || "").toLowerCase().trim() + "|" + unit;
      if (!agg[k]) agg[k] = { key: k, item: ing.item, unit, qty: 0, aisle: ing.aisle || "Other", staple: !!ing.staple, fresh: false };
      if (ing.fresh) agg[k].fresh = true;
      agg[k].qty += (Number(ing.qty) || 0) * f;
    });
    const plan = planOf(week);
    plan.recipes.forEach(pr => { const rc = recipes.find(x => x.id === pr.id); if (rc) addIngs(rc, pr.portions / (rc.portions || LUNCHES)); });
    (plan.dinners || []).forEach(pd => { const rc = recipes.find(x => x.id === pd.id); if (rc) addIngs(rc, pd.nights / (rc.portions || 2)); });
    const items = Object.values(agg);
    const extras = (plan.extras || []).map(x => ({ key: "x:" + x.id, item: x.text, unit: "", qty: 0, aisle: "Extras", extra: x.id }));
    const buy = items.filter(i => !i.staple), staples = items.filter(i => i.staple);
    return { buy, extras, staples, got: planOf(week).got || {} };
  }
  /* ================= shopping: household list ================= */
  const QUICK_ITEMS = ["Cat litter", "Wet cat food", "Dry cat food", "Toilet paper", "Kitchen roll", "Dish soap", "Laundry detergent", "Bin bags", "Olive oil", "Eggs", "Milk", "Coffee"];
  function saveShop(next) { if (!ready()) return; shop = next; renderAll(); queueSet("shop", "list", Object.assign({}, next, { updatedAt: new Date().toISOString() })); }
  function cloneShop() { return { items: shop.items.map(i => Object.assign({}, i)), recent: shop.recent.slice() }; }
  function addShopItem(text) {
    text = String(text || "").trim().slice(0, 60); if (!text) return;
    const n = cloneShop(), low = text.toLowerCase();
    const same = n.items.find(i => i.text.toLowerCase() === low);
    if (same) same.got = false; else n.items.push({ id: Date.now().toString(36) + Math.random().toString(36).slice(2, 5), text, got: false });
    n.recent = [text].concat(n.recent.filter(r => r.toLowerCase() !== low)).slice(0, 16);
    saveShop(n);
  }
  function shopOpenCount() {
    const week = prepWeekKey(todayKey()); const f = foodShop(week);
    return shop.items.filter(i => !i.got).length + f.buy.concat(f.extras).filter(i => !f.got[i.key]).length;
  }
  function renderShopBadge() {
    const n = shopOpenCount(), b = $("shopBadge");
    b.hidden = !n; b.textContent = n; b.setAttribute("aria-label", n + " to buy");
  }
  function renderShop() {
    const list = $("hhList"); list.innerHTML = "";
    const open = shop.items.filter(i => !i.got), got = shop.items.filter(i => i.got);
    $("hhCount").textContent = shop.items.length ? got.length + " of " + shop.items.length + " in the basket" : "";
    if (!shop.items.length) { const p = document.createElement("p"); p.className = "small muted"; p.textContent = "Nothing on the list. Add an item or tap a quick add below."; list.appendChild(p); }
    open.concat(got).forEach(i => {
      const row = document.createElement("div"); row.className = "hh-row";
      const b = shopRow({ key: i.id, item: i.text, unit: "", qty: 0, extra: null, household: true }, i.got, null);
      b.onclick = () => { const n = cloneShop(); const it = n.items.find(x => x.id === i.id); if (it) it.got = !it.got; saveShop(n); };
      const x = mkBtn("×", "btn-small", () => { const n = cloneShop(); n.items = n.items.filter(e => e.id !== i.id); saveShop(n); });
      x.setAttribute("aria-label", "Remove " + i.text);
      row.append(b, x); list.appendChild(row);
    });
    $("hhClear").hidden = !got.length;
    $("hhClear").textContent = "Clear " + got.length + " ticked item" + (got.length === 1 ? "" : "s");
    const onList = new Set(shop.items.filter(i => !i.got).map(i => i.text.toLowerCase()));
    const seen = new Set(), chips = [];
    shop.recent.concat(QUICK_ITEMS).forEach(t => { const l = t.toLowerCase(); if (!onList.has(l) && !seen.has(l)) { seen.add(l); chips.push(t); } });
    const q = $("hhQuick"); q.innerHTML = "";
    chips.slice(0, 14).forEach(t => { const c = mkBtn(t, "qchip", () => addShopItem(t)); c.setAttribute("aria-label", "Add " + t); q.appendChild(c); });
  }
  $("hhClear").onclick = () => { const n = cloneShop(); n.items = n.items.filter(i => !i.got); saveShop(n); };
  $("goShop").onclick = () => setTab("shop");

  function shopRow(i, isGot, week) {
    const b = document.createElement("button"); b.type = "button"; b.className = "shop-item" + (isGot ? " done" : ""); b.style.setProperty("--c", "var(--lamp)"); b.setAttribute("aria-pressed", String(!!isGot));
    b.innerHTML = '<span class="check" style="' + (isGot ? "background:var(--lamp)" : "") + '">' + CHECK.replace('opacity', '') + '</span><span class="si-name"></span><span class="si-qty"></span>';
    b.querySelector("svg").style.opacity = isGot ? 1 : 0;
    b.querySelector(".si-name").textContent = i.item;
    if (i.fresh) { const f = document.createElement("span"); f.className = "fresh"; f.textContent = "buy Sat"; b.querySelector(".si-name").appendChild(f); }
    b.querySelector(".si-qty").textContent = i.staple || i.extra || i.household ? "" : fmtQty(roundCount(i.qty, i.unit), i.unit);
    b.onclick = () => { const p = clonePlan(week); if (p.got[i.key]) delete p.got[i.key]; else p.got[i.key] = true; savePlan(p); };
    if (i.extra) {
      const wrap = document.createElement("div"); wrap.style.cssText = "display:grid;grid-template-columns:1fr auto;gap:8px;align-items:center";
      const x = mkBtn("×", "btn-small", () => { const p = clonePlan(week); p.extras = p.extras.filter(e => e.id !== i.extra); delete p.got[i.key]; savePlan(p); });
      x.setAttribute("aria-label", "Remove " + i.item);
      wrap.append(b, x); return wrap;
    }
    return b;
  }
  function clonePlan(week) { const p = planOf(week); return { week, recipes: (p.recipes || []).map(r => ({ id: r.id, portions: r.portions })), dinners: (p.dinners || []).map(d => ({ id: d.id, nights: d.nights })), extras: (p.extras || []).map(e => ({ id: e.id, text: e.text })), brewed: Object.assign({}, p.brewed || {}), got: Object.assign({}, p.got || {}), steps: Object.assign({}, p.steps || {}) }; }
  function addDinner(week, rc) {
    const p = clonePlan(week); const n = p.dinners.reduce((s, d) => s + d.nights, 0);
    if (n >= DINNERS) return; p.dinners.push({ id: rc.id, nights: Math.min(rc.portions || 2, DINNERS - n) }); savePlan(p);
  }
  function setNights(week, id, n) {
    const p = clonePlan(week); const d = p.dinners.find(x => x.id === id); if (!d) return;
    if (n <= 0) p.dinners = p.dinners.filter(x => x.id !== id);
    else { const others = p.dinners.filter(x => x.id !== id).reduce((s, x) => s + x.nights, 0); d.nights = Math.min(n, DINNERS - others); }
    savePlan(p);
  }
  function addToPlan(week, rc) {
    const p = clonePlan(week); const total = p.recipes.reduce((s, r) => s + r.portions, 0);
    if (total >= LUNCHES) return; p.recipes.push({ id: rc.id, portions: LUNCHES - total }); savePlan(p);
  }
  function removeFromPlan(week, id, quiet) { const p = clonePlan(week); if (!p.recipes.some(r => r.id === id)) return; p.recipes = p.recipes.filter(r => r.id !== id); savePlan(p); }
  function setPortions(week, id, n) {
    const p = clonePlan(week); const r = p.recipes.find(x => x.id === id); if (!r) return;
    if (n <= 0) { p.recipes = p.recipes.filter(x => x.id !== id); }
    else { const others = p.recipes.filter(x => x.id !== id).reduce((s, x) => s + x.portions, 0); r.portions = Math.min(n, LUNCHES - others); }
    savePlan(p);
  }

  /* ================= recipe links ================= */
  function videoUrl(rc) { return "https://www.youtube.com/results?search_query=" + encodeURIComponent(rc.name + " receita"); }
  function safeUrl(u) { try { const x = new URL(u); return (x.protocol === "https:" || x.protocol === "http:") ? x.href : ""; } catch (e) { return ""; } }
  function placeholderImg(kind) { const d = document.createElement("div"); d.className = "rimg ph"; d.innerHTML = '<svg viewBox="0 0 24 24" width="34" height="34" aria-hidden="true"><path d="M4 11h16v2a6 6 0 0 1-6 6h-4a6 6 0 0 1-6-6zM8 8c0-2 2-2 2-4M13 8c0-2 2-2 2-4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>'; return d; }
  function shortName(rc) { return (rc.short && String(rc.short).trim()) || rc.name; }
  function recipeChips(list) {
    // list: [{rc, kind, count, week}]
    const wrap = document.createElement("div"); wrap.className = "rchips";
    list.forEach(o => { const b = mkBtn(shortName(o.rc), "rchip", () => openBrew(o.rc, o.kind, o.count, o.week)); b.title = "Open the recipe step by step"; wrap.appendChild(b); });
    return wrap;
  }
  function plannedDinners(k) {
    const weeks = [prepWeekKey(k), addDays(prepWeekKey(k), -7)]; const seen = {}, out = [];
    weeks.forEach(w => (planOf(w).dinners || []).forEach(d => { const rc = recipes.find(x => x.id === d.id); if (rc && !seen[rc.id]) { seen[rc.id] = 1; out.push({ rc, kind: "dinner", count: d.nights, week: w }); } }));
    return out;
  }

  /* ================= brewing (guided cooking) ================= */
  const EPITHETS = ["Draught of Hearty Resolve", "Elixir of the Long Shift", "Tonic of Iron Will", "Philter of Warm Bellies", "Brew of the Lab Rat's Feast", "Stew of Steady Hands", "Potion of Second Wind", "Decoction of Quiet Evenings"];
  let brew = null, brewTick = null, wakeLock = null;
  function stepMinutes(s) { const m = String(s).match(/(\d+)\s*(?:[–-]\s*(\d+))?\s*min/); return m ? Number(m[2] || m[1]) : 0; }
  function openBrew(rc, kind, count, week) {
    brew = { rid: rc.id, kind, count: Math.max(1, count || rc.portions || 1), week, idx: -1, got: {}, total: "", carb: "", tare: "", filled: {}, timer: null };
    $("brew").hidden = false; document.body.style.overflow = "hidden";
    try { if (navigator.wakeLock) navigator.wakeLock.request("screen").then(l => { wakeLock = l; }).catch(() => {}); } catch (e) {}
    if (!brewTick) brewTick = setInterval(renderBrewTimer, 1000);
    renderBrew();
  }
  function closeBrew() {
    brew = null; $("brew").hidden = true; document.body.style.overflow = "";
    try { if (wakeLock) wakeLock.release(); } catch (e) {} wakeLock = null;
    if (brewTick) { clearInterval(brewTick); brewTick = null; }
  }
  function beep() {
    try { const A = window.AudioContext || window.webkitAudioContext; const ctx = new A(); [0, 0.35, 0.7].forEach(t => { const o = ctx.createOscillator(), g = ctx.createGain(); o.frequency.value = 880; o.connect(g); g.connect(ctx.destination); g.gain.setValueAtTime(0.2, ctx.currentTime + t); g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + t + 0.3); o.start(ctx.currentTime + t); o.stop(ctx.currentTime + t + 0.3); }); } catch (e) {}
    try { if (navigator.vibrate) navigator.vibrate([300, 150, 300]); } catch (e) {}
  }
  function renderBrewTimer() {
    const el = $("brewTimer");
    if (!brew || !brew.timer) { el.hidden = true; return; }
    const left = Math.max(0, Math.round((brew.timer.endAt - Date.now()) / 1000));
    el.hidden = false; el.classList.toggle("done", left === 0);
    if (left === 0 && !brew.timer.rang) { brew.timer.rang = true; beep(); }
    el.innerHTML = '<span>' + (left === 0 ? "Time's up: " : "") + esc(brew.timer.label) + '</span><b>' + pad(Math.floor(left / 60)) + ":" + pad(left % 60) + '</b>';
    const stop = mkBtn(left === 0 ? "Done" : "Stop", "btn-small", () => { brew.timer = null; renderBrewTimer(); }); el.appendChild(stop);
  }
  function jarSvg(full) {
    return '<svg viewBox="0 0 54 64" aria-hidden="true"><rect x="16" y="3" width="22" height="7" rx="2" fill="var(--steel)"/><path d="M14 12h26v4c6 3 8 9 8 16v22a7 7 0 0 1-7 7H13a7 7 0 0 1-7-7V32c0-7 2-13 8-16z" fill="var(--surface)" stroke="var(--line)" stroke-width="2"/>' + (full ? '<path d="M8 34h38v20a5 5 0 0 1-5 5H13a5 5 0 0 1-5-5z" fill="var(--hobby)" opacity=".85"/><path d="M14 40q4-3 8 0M28 44q4-3 8 0" stroke="var(--surface)" stroke-width="2" fill="none" stroke-linecap="round"/>' : "") + '</svg>';
  }
  function renderBrew() {
    if (!brew) return;
    const rc = recipes.find(x => x.id === brew.rid); if (!rc) { closeBrew(); return; }
    const steps = rc.steps || [], n = steps.length, f = brew.count / (rc.portions || brew.count);
    const word = brew.kind === "dinner" ? "night" : "box";
    $("brewEyebrow").textContent = "Alchemy · " + EPITHETS[hash(rc.id) % EPITHETS.length];
    $("brewTitle").textContent = shortName(rc);
    $("brewSub").textContent = brew.count + " " + word + (brew.count === 1 ? "" : (word === "box" ? "es" : "s")) + " · about " + (rc.minutes || "?") + " min · ";
    const va = document.createElement("a"); va.href = safeUrl(rc.url || "") || videoUrl(rc); va.target = "_blank"; va.rel = "noopener"; va.textContent = safeUrl(rc.url || "") ? "source ↗" : "watch a video ↗"; $("brewSub").appendChild(va);
    // progress
    const total = n + 2; const cur = brew.idx + 1;
    $("brewDots").innerHTML = Array.from({ length: total }, (_, i) => '<span class="' + (i < cur ? "on" : i === cur ? "cur" : "") + '"></span>').join("");
    const body = $("brewBody"); body.innerHTML = "";
    const back = $("brewBack"), next = $("brewNext");
    back.disabled = brew.idx === -1;
    if (brew.idx === -1) {
      // reagents
      const hero = safeUrl((rc.image && rc.image.url) || "");
      body.innerHTML = (hero ? '<img class="brew-hero" alt="" src="' + esc(hero) + '">' : "") + '<h3>Gather your reagents</h3><p class="small muted">Weigh each one on the scale and tick it off. Amounts are already scaled to ' + brew.count + ' ' + word + (brew.count === 1 ? "" : (word === "box" ? "es" : "s")) + '.</p>';
      const list = document.createElement("div"); list.className = "stack"; list.style.gap = "6px";
      (rc.ingredients || []).forEach((ing, i) => {
        const done = !!brew.got[i];
        const b = document.createElement("button"); b.type = "button"; b.className = "reagent" + (done ? " done" : ""); b.style.setProperty("--c", "var(--hobby)"); b.setAttribute("aria-pressed", String(done));
        b.innerHTML = '<span class="check" style="' + (done ? "background:var(--hobby)" : "") + '">' + CHECK + '</span><span class="r-name"></span><span class="r-qty"></span>';
        b.querySelector("svg").style.opacity = done ? 1 : 0;
        b.querySelector(".r-name").textContent = ing.item + (ing.staple ? " (from the cupboard)" : "");
        const q = (Number(ing.qty) || 0) * f; const u = ing.unit || "pcs";
        b.querySelector(".r-qty").textContent = fmtQty(u === "g" || u === "ml" ? q : Math.round(q * 4) / 4, u);
        b.onclick = () => { brew.got[i] = !brew.got[i]; renderBrew(); };
        list.appendChild(b);
      });
      body.appendChild(list);
      const left = (rc.ingredients || []).filter((_, i) => !brew.got[i]).length;
      next.textContent = left ? "Begin brewing (" + left + " not ticked)" : "Begin brewing";
    } else if (brew.idx < n) {
      const s = steps[brew.idx];
      body.innerHTML = '<div class="brew-stepno">' + (brew.idx + 1) + '<span class="muted" style="font-size:1rem"> / ' + n + '</span></div><p class="brew-step"></p>';
      body.querySelector(".brew-step").textContent = s;
      const mins = stepMinutes(s);
      if (mins) {
        const tb = mkBtn("Start a " + mins + " min timer", "btn-quiet", () => { brew.timer = { endAt: Date.now() + mins * 60000, label: "Step " + (brew.idx + 1), rang: false }; renderBrewTimer(); });
        body.appendChild(tb);
      }
      if (rc.notes && brew.idx === n - 1) { const p = document.createElement("p"); p.className = "small muted"; p.textContent = rc.notes; body.appendChild(p); }
      next.textContent = brew.idx === n - 1 ? "To the bottling" : "Next step";
    } else {
      // bottling
      const k = brew.count;
      body.innerHTML = '<h3>Bottling</h3><p class="small muted">Weigh the empty pot before you start next time, or tip everything into a big bowl you have weighed. Then weigh it full and the potion splits itself.</p>';
      const form = document.createElement("div"); form.className = "stack";
      form.innerHTML = '<div class="weigh"><label class="f" for="bwTare">Empty pot or bowl (g)<input id="bwTare" type="number" inputmode="numeric" min="0" placeholder="e.g. 1450"></label><label class="f" for="bwFull">Full (g)<input id="bwFull" type="number" inputmode="numeric" min="0" placeholder="e.g. 3900"></label></div>' +
        '<label class="f" for="bwCarb">Cooked rice, bulgur or pasta, if kept separate (g)<input id="bwCarb" type="number" inputmode="numeric" min="0" placeholder="optional"></label><div id="bwOut" class="stack" style="gap:4px"></div>';
      body.appendChild(form);
      $("bwTare").value = brew.tare; $("bwFull").value = brew.total; $("bwCarb").value = brew.carb;
      const out = () => {
        const tare = Number($("bwTare").value) || 0, full = Number($("bwFull").value) || 0, carb = Number($("bwCarb").value) || 0;
        brew.tare = $("bwTare").value; brew.total = $("bwFull").value; brew.carb = $("bwCarb").value;
        const net = full - tare;
        let h = "";
        if (full && net > 0) h += '<div class="result">' + Math.round(net / k) + ' g per ' + word + '</div><div class="small muted">' + Math.round(net) + ' g of food ÷ ' + k + '</div>';
        else h += '<div class="small muted">Enter the weights to get the grams for each ' + word + '.</div>';
        if (carb > 0) h += '<div class="result" style="font-size:1.3rem;color:var(--lamp)">+ ' + Math.round(carb / k) + ' g of rice or pasta each</div>';
        $("bwOut").innerHTML = h;
      };
      ["bwTare", "bwFull", "bwCarb"].forEach(id => $(id).addEventListener("input", out)); out();
      const jl = document.createElement("div"); jl.className = "stack"; jl.style.gap = "6px";
      jl.innerHTML = '<span class="eyebrow">Tap each container as you fill it</span>';
      const jars = document.createElement("div"); jars.className = "jars";
      for (let i = 0; i < k; i++) {
        const j = document.createElement("button"); j.type = "button"; j.className = "jar"; j.setAttribute("aria-pressed", String(!!brew.filled[i])); j.setAttribute("aria-label", (word === "box" ? "Container " : "Night ") + (i + 1));
        j.innerHTML = jarSvg(brew.filled[i]); j.onclick = () => { brew.filled[i] = !brew.filled[i]; renderBrew(); };
        jars.appendChild(j);
      }
      jl.appendChild(jars);
      if (word === "box") { const p = document.createElement("p"); p.className = "small muted"; p.textContent = "Let it cool before closing the lids. Freeze the Thursday and Friday boxes; glass goes from freezer to fridge the night before, never straight into a hot oven."; jl.appendChild(p); }
      body.appendChild(jl);
      const filled = Object.values(brew.filled).filter(Boolean).length;
      next.textContent = filled >= k ? "Seal the batch" : "Seal the batch (" + filled + "/" + k + " filled)";
    }
  }
  $("brewBack").onclick = () => { if (brew && brew.idx > -1) { brew.idx--; renderBrew(); } };
  $("brewNext").onclick = () => {
    if (!brew) return;
    const rc = recipes.find(x => x.id === brew.rid); const n = (rc && rc.steps || []).length;
    if (brew.idx < n) { brew.idx++; renderBrew(); $("brew").scrollTop = 0; return; }
    // seal: record the brew; when every planned lunch is brewed, tick Cook and Portion
    if (brew.kind === "lunch" && brew.week && ready()) {
      const p = clonePlan(brew.week); p.brewed = Object.assign({}, planOf(brew.week).brewed || {}); p.brewed[brew.rid] = todayKey();
      if (p.recipes.length && p.recipes.every(r => p.brewed[r.id])) { const t = todayKey(); if (!p.steps.cook) p.steps.cook = t; if (!p.steps.portion) p.steps.portion = t; }
      savePlan(p);
    }
    closeBrew();
  };
  $("brewClose").onclick = closeBrew;
  document.addEventListener("keydown", e => { if (e.key === "Escape" && brew) closeBrew(); });

  /* ================= quests tab ================= */
  function renderQuests() {
    const today = todayKey();
    const qs = $("quests"); qs.innerHTML = "";
    const active = quests.filter(q => !q.archived).sort((a, b) => (a.createdAt || "").localeCompare(b.createdAt || ""));
    if (!active.length) qs.innerHTML = '<div class="notice">No quests yet. Got something big hanging over you? Break it into small steps below.</div>';
    active.forEach(q => {
      const ms = q.milestones || []; const n = ms.filter(m => m.doneAt).length; const complete = ms.length && n === ms.length;
      const box = document.createElement("div"); box.className = "panel quest";
      const overdue = q.due && q.due < today && !complete;
      box.innerHTML = '<div class="between"><h2></h2><span class="mono small muted">' + n + ' / ' + ms.length + '</span></div>' + bar(ms.length ? n / ms.length * 100 : 0, "var(--rogue)") +
        (q.due ? '<span class="small" style="color:' + (overdue ? "var(--hurt)" : "var(--muted)") + '">' + (overdue ? "Overdue since " : "Due ") + niceDate(q.due) + '</span>' : "");
      box.querySelector("h2").textContent = q.title;
      const list = document.createElement("div"); list.className = "milestones";
      ms.forEach(m => {
        const b = document.createElement("button"); b.type = "button"; b.className = "ms" + (m.doneAt ? " done" : ""); b.style.setProperty("--c", "var(--rogue)"); b.setAttribute("aria-pressed", String(!!m.doneAt));
        b.innerHTML = '<span class="check" style="' + (m.doneAt ? "background:var(--rogue)" : "") + '">' + CHECK + '</span><span class="ms-text"></span>';
        b.querySelector("svg").style.opacity = m.doneAt ? 1 : 0;
        b.querySelector(".ms-text").textContent = m.text;
        b.onclick = () => toggleMilestone(q, m.id);
        list.appendChild(b);
      });
      box.appendChild(list);
      const acts = document.createElement("div"); acts.className = "row";
      if (complete) { const p = document.createElement("span"); p.className = "small"; p.style.color = "var(--hp)"; p.textContent = "Quest complete. +40 XP at midnight."; acts.appendChild(p); }
      const key = "q:" + q.id;
      acts.appendChild(mkBtn(confirmBox[key] ? "Confirm close" : (complete ? "Close quest" : "Abandon"), "btn-small" + (confirmBox[key] ? " danger" : ""), () => confirmThen(key, () => saveQuest(Object.assign({}, q, { archived: true })))));
      box.appendChild(acts);
      qs.appendChild(box);
    });
  }
  function toggleMilestone(q, mid) {
    const nq = Object.assign({}, q, { milestones: (q.milestones || []).map(m => m.id === mid ? Object.assign({}, m, { doneAt: m.doneAt ? null : todayKey() }) : Object.assign({}, m)) });
    saveQuest(nq);
  }

  /* ================= writes ================= */
  function showNotice(msg) { const n = $("notice"); n.textContent = msg; n.hidden = false; }
  function writeErr(e) {
    if (e && e.code === "invalid_argument") { canWrite = false; showNotice("This view can't save changes."); }
    else if (e && e.code === "quota_exceeded") showNotice("Storage is full, so this change wasn't saved.");
    else showNotice("Couldn't save that change. Check your connection and try again.");
  }
  function ready() { if (!db || !canWrite) { showNotice("Changes can't be saved right now. Check Settings."); return false; } return true; }
  function queueSet(col, id, body) {
    const path = col + "/" + id;
    chains[path] = (chains[path] || Promise.resolve()).then(() => db.collection(col).doc(id).set(body)).catch(writeErr);
    return chains[path];
  }
  function delDoc(col, id) { if (!ready()) return; db.collection(col).doc(id).delete().catch(writeErr); }
  function toggleDay(hid, k) {
    if (!ready()) return;
    const cur = Object.assign({}, (days[k] && days[k].done) || {});
    if (cur[hid]) delete cur[hid]; else { cur[hid] = true; if (k === todayKey()) { lastHit = Date.now(); sfx("tick"); } }
    skip = 0; writeDay(k, { done: cur });
    if (lastHit && Date.now() - lastHit < 100) setTimeout(() => { if (tab === "tonight") renderTonight(); }, 1700);
  }
  function writeDay(k, patch) {
    if (!ready()) return;
    const c = days[k] || {};
    const next = { date: k, done: Object.assign({}, c.done || {}), game: Number(c.game) || 0, rest: !!c.rest, lab: !!c.lab };
    Object.assign(next, patch);
    days[k] = next; renderAll();
    queueSet("days", k, Object.assign({}, next, { updatedAt: new Date().toISOString() }));
  }
  const REST_PER_MONTH = 2;
  function restLeft(k) { const m = k.slice(0, 7); return REST_PER_MONTH - Object.keys(days).filter(d => d.slice(0, 7) === m && days[d].rest).length; }
  function savePlan(p) { if (!ready()) return; plans[p.week] = p; renderAll(); queueSet("plans", p.week, Object.assign({}, p, { updatedAt: new Date().toISOString() })); }
  function saveQuest(q) {
    if (!ready()) return;
    const i = quests.findIndex(x => x.id === q.id); if (i >= 0) quests[i] = q; else quests.push(q);
    renderAll();
    const body = Object.assign({}, q); delete body.id;
    queueSet("quests", q.id, body);
  }
  async function moveHabit(h, dir) {
    if (!ready()) return;
    const list = visibleHabits(); const i = list.findIndex(x => x.id === h.id), j = i + dir;
    if (j < 0 || j >= list.length) return;
    const a = list[i], b = list[j];
    try { await db.collection("habits").doc(a.id).update({ order: b.order || j }); await db.collection("habits").doc(b.id).update({ order: (a.order || i) === (b.order || j) ? (a.order || i) + 1 : (a.order || i) }); } catch (e) { writeErr(e); }
  }
  async function archiveHabit(h) { if (!ready()) return; try { await db.collection("habits").doc(h.id).update({ archivedAt: todayKey() }); $("hStatus").textContent = "Removed “" + h.name + "”. Past nights keep their scores."; } catch (e) { writeErr(e); } }
  async function buyReward(r) {
    if (!ready()) return;
    if (G.gold < r.cost) return;
    try { await db.collection("purchases").add({ rewardId: r.id, name: r.name, cost: r.cost, date: todayKey(), at: new Date().toISOString() }); $("rStatus").textContent = "Claimed “" + r.name + "”. Enjoy it."; } catch (e) { writeErr(e); }
  }

  $("addHabit").addEventListener("submit", async ev => {
    ev.preventDefault(); if (!ready()) return;
    const name = $("hName").value.trim(); if (!name) return;
    const maxOrder = habitsAll.reduce((m, h) => Math.max(m, h.order || 0), 0);
    const tv = $("hTarget").value;
    const body = { name, group: $("hGroup").value, order: maxOrder + 1, createdAt: todayKey() };
    if (tv === "days") {
      const ds = Array.from(document.querySelectorAll("#hDays input:checked")).map(i => Number(i.value));
      if (!ds.length) { $("hStatus").textContent = "Pick at least one day."; return; }
      body.days = ds; body.perWeek = ds.length;
    } else body.perWeek = Number(tv);
    try { await db.collection("habits").add(body); $("hName").value = ""; $("hStatus").textContent = "Added “" + name + "”."; } catch (e) { writeErr(e); }
  });
  WEEK_ORDER.forEach(d => { const l = document.createElement("label"); l.innerHTML = '<input type="checkbox" id="hDay' + d + '" value="' + d + '">' + DAYNAMES[d]; $("hDays").appendChild(l); });
  $("hTarget").addEventListener("change", () => { $("hDaysBox").hidden = $("hTarget").value !== "days"; });
  function renderRenameFields() {
    $("renameFields").innerHTML = "";
    PARTY.forEach(p => {
      const l = document.createElement("label"); l.className = "f"; l.setAttribute("for", "nm-" + p.id);
      l.textContent = p.cls + " · guards " + p.guards;
      const i = document.createElement("input"); i.id = "nm-" + p.id; i.maxLength = 30; i.value = p.name;
      l.appendChild(i); $("renameFields").appendChild(l);
    });
  }
  renderRenameFields();
  $("renameForm").addEventListener("submit", ev => {
    ev.preventDefault(); if (!ready()) return;
    const names = {}; PARTY.forEach(p => { const v = $("nm-" + p.id).value.trim(); if (v) names[p.id] = v.slice(0, 30); });
    game = Object.assign({}, game, { names }); applyNames(); renderAll();
    const body = Object.assign({}, game); queueSet("game", "state", body).then(() => { $("nStatus").textContent = "Names saved."; });
  });
  $("addReward").addEventListener("submit", async ev => {
    ev.preventDefault(); if (!ready()) return;
    const name = $("rName").value.trim(), cost = Math.round(Number($("rCost").value));
    if (!name || !(cost > 0)) return;
    try { await db.collection("rewards").add({ name, cost }); $("rName").value = ""; $("rStatus").textContent = "Added “" + name + "”."; } catch (e) { writeErr(e); }
  });
  $("addQuest").addEventListener("submit", ev => {
    ev.preventDefault(); if (!ready()) return;
    const title = $("qTitle").value.trim();
    const steps = $("qSteps").value.split("\n").map(s => s.trim()).filter(Boolean).slice(0, 30);
    if (!title || !steps.length) { $("qStatus").textContent = "Add a title and at least one milestone."; return; }
    const id = "q" + Date.now().toString(36);
    saveQuest({ id, title, due: $("qDue").value || null, createdAt: new Date().toISOString(), archived: false, milestones: steps.map((t, i) => ({ id: "m" + i, text: t, doneAt: null })) });
    $("qTitle").value = ""; $("qSteps").value = ""; $("qDue").value = ""; $("qStatus").textContent = "Quest started: " + title + ".";
  });
  $("addExtra").addEventListener("submit", ev => {
    ev.preventDefault(); if (!ready()) return;
    const text = $("exText").value.trim(); if (!text) return;
    addShopItem(text); $("exText").value = ""; $("exText").focus();
  });
  function parseIngredient(line) {
    let s = line.trim(); if (!s) return null;
    let aisle = "Other", staple = false, fresh = false;
    if (/,\s*fresh\s*$/i.test(s)) { fresh = true; s = s.replace(/,\s*fresh\s*$/i, ""); }
    const comma = s.lastIndexOf(",");
    if (comma > 0) {
      const tail = s.slice(comma + 1).trim().toLowerCase();
      if (tail === "staple") { staple = true; aisle = "Pantry"; s = s.slice(0, comma).trim(); }
      else { const a = AISLES.find(x => x.toLowerCase() === tail || x.toLowerCase().split(" ")[0] === tail.split(" ")[0]); if (a) { aisle = a; s = s.slice(0, comma).trim(); } }
    }
    const m = s.match(/^(\d+(?:[.,]\d+)?)\s*(.*)$/);
    let qty = 1, rest = s;
    if (m) { qty = Number(m[1].replace(",", ".")); rest = m[2]; }
    let unit = "pcs";
    const w = rest.split(/\s+/);
    if (w.length > 1 && UNIT_WORDS.includes(w[0].toLowerCase())) { unit = w[0].toLowerCase(); rest = w.slice(1).join(" "); }
    if (unit === "cans") unit = "can"; if (unit === "cloves") unit = "clove"; if (unit === "packs") unit = "pack";
    if (unit === "kg") { unit = "g"; qty *= 1000; } if (unit === "l") { unit = "ml"; qty *= 1000; }
    return { qty, unit, item: rest.trim() || s, aisle, staple, fresh };
  }
  $("addRecipe").addEventListener("submit", async ev => {
    ev.preventDefault(); if (!ready()) return;
    const name = $("rcName").value.trim();
    const ingredients = $("rcIngredients").value.split("\n").map(parseIngredient).filter(Boolean);
    const steps = $("rcSteps").value.split("\n").map(s => s.trim()).filter(Boolean);
    if (!name || !ingredients.length) { $("rcStatus").textContent = "Add a name and at least one ingredient."; return; }
    try {
      const imgUrl = safeUrl($("rcImage").value.trim());
      await db.collection("recipes").add({ name, short: $("rcShort").value.trim().slice(0, 28) || null, image: imgUrl ? { url: imgUrl } : null, kind: $("rcKind").value, portions: Number($("rcPortions").value) || 5, minutes: Number($("rcMinutes").value) || 45, ingredients, steps, url: safeUrl($("rcUrl").value.trim()), createdAt: new Date().toISOString() });
      ["rcName", "rcShort", "rcImage", "rcIngredients", "rcSteps", "rcUrl"].forEach(id => $(id).value = ""); $("rcStatus").textContent = "Added “" + name + "” to the recipe book.";
    } catch (e) { writeErr(e); }
  });

  /* ================= nav ================= */
  const TABS = ["tonight", "party", "lunch", "shop", "quests", "dm"];
  const TAB_TITLES = { tonight: "Tonight", party: "Party", lunch: "Food", shop: "Shopping", quests: "Quests", dm: "Dungeon Master" };
  function setTab(t, fromHash) {
    if (!TABS.includes(t)) t = "tonight";
    tab = t;
    TABS.forEach(x => { $("tab-" + x).setAttribute("aria-selected", String(x === t)); $("view-" + x).hidden = x !== t; });
    if (!fromHash) { try { history.replaceState(null, "", "#" + t); } catch (e) {} }
    $("sectionTitle").textContent = TAB_TITLES[t];
    closeDrawer();
    window.scrollTo(0, 0);
    renderAll();
    if (t === "dm" && window.DM) window.DM.render();
  }
  TABS.forEach(x => $("tab-" + x).addEventListener("click", () => setTab(x)));
  /* slide-out menu */
  function openDrawer() { $("drawer").classList.add("open"); $("scrim").classList.add("open"); $("menuBtn").setAttribute("aria-expanded", "true"); const sel = document.querySelector('.ditem[aria-selected="true"]'); if (sel) sel.focus(); }
  function closeDrawer() { if (!$("drawer").classList.contains("open")) return; $("drawer").classList.remove("open"); $("scrim").classList.remove("open"); $("menuBtn").setAttribute("aria-expanded", "false"); }
  $("menuBtn").addEventListener("click", () => $("drawer").classList.contains("open") ? closeDrawer() : openDrawer());
  $("scrim").addEventListener("click", closeDrawer);
  $("openSettings").addEventListener("click", closeDrawer);
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeDrawer(); });
  // swipe left on the open menu to close it
  (() => { let x0 = null; const d = $("drawer"); d.addEventListener("touchstart", e => { x0 = e.touches[0].clientX; }, { passive: true }); d.addEventListener("touchend", e => { if (x0 !== null && e.changedTouches[0].clientX - x0 < -50) closeDrawer(); x0 = null; }, { passive: true }); })();
  window.addEventListener("hashchange", () => setTab(location.hash.slice(1), true));
  $("prev").onclick = () => { if (viewDate > (game.startDate || todayKey())) { viewDate = addDays(viewDate, -1); skip = 0; renderTonight(); } };
  $("next").onclick = () => { if (viewDate < addDays(todayKey(), MAX_AHEAD)) { viewDate = addDays(viewDate, 1); skip = 0; renderTonight(); } };
  $("todayBtn").onclick = () => { viewDate = todayKey(); skip = 0; renderTonight(); };

  setTab(location.hash.slice(1) || "tonight", true);
  let lastDay = todayKey();
  setInterval(() => { if (todayKey() !== lastDay) { if (viewDate === lastDay) viewDate = todayKey(); lastDay = todayKey(); renderAll(); } else if (tab === "tonight") renderTimeline(); }, 60000);

  /* ================= hooks for the Dungeon Master and settings ================= */
  function dmContext() {
    const today = todayKey(), now = new Date();
    const lines = [];
    lines.push("Now: " + niceDate(today) + " " + pad(now.getHours()) + ":" + pad(now.getMinutes()) + (isWeekend(today) ? " (weekend)" : "") + (isLab(today) ? " (LAB DAY: he is working; weekend chores excused)" : "") + (days[today] && days[today].rest ? " (REST DAY)" : ""));
    lines.push("Game started: " + (game.startDate || today) + ". Party level " + G.level + ", " + G.gold + " gold, " + G.xp + " XP.");
    lines.push("Party: " + PARTY.map(p => { const m = G.members[p.id]; return p.name + " (" + p.cls + ", guards " + p.guards + ", Lv " + m.lv + ", " + (m.ko ? "DOWN" : m.hp + "/" + m.max + " HP") + ")"; }).join("; "));
    const r = evaluateDay(today, G.level);
    lines.push("Tonight's monster: " + r.monster + " (" + r.lore + "), " + Math.max(0, r.foeHp - r.dealt) + "/" + r.foeHp + " HP left" + (r.win ? ", already defeated" : "") + ". It takes " + r.need + " hits: at least " + r.mustNeed + " must-dos, the rest any task. Hits past that are bonus loot (+" + BONUS_GOLD + " gold each).");
    const due = habitsOn(today).filter(h => dueOn(h, today));
    const fmt = h => displayName(h, today) + " [" + GROUPS[h.group].label + (mustDo(h, today) ? ", must-do" : ", optional") + "]";
    lines.push("Done today: " + (due.filter(h => isDone(h.id, today)).map(fmt).join("; ") || "nothing yet"));
    lines.push("Still open today: " + (due.filter(h => !isDone(h.id, today)).map(fmt).join("; ") || "nothing"));
    const recent = (G.log || []).slice(-7).map(e => niceDate(e.k) + ": " + (e.restDay ? "rest day" : (e.win ? "won" : "lost") + " vs " + e.monster + (e.notes.length ? " (" + e.notes.join("; ") + ")" : ""))).join(" | ");
    if (recent) lines.push("Recent nights: " + recent);
    const pw = prepWeekKey(today), pp = planOf(pw);
    const lunchNames = (pp.recipes || []).map(x => (recipes.find(r => r.id === x.id) || {}).name).filter(Boolean);
    const dinNames = (pp.dinners || []).map(x => (recipes.find(r => r.id === x.id) || {}).name).filter(Boolean);
    lines.push("Next lunch prep: " + niceDate(addDays(pw, -1)) + (pp.skipped ? " (skipped)" : "") + ". Lunches: " + (lunchNames.join(", ") || "none picked") + ". Dinners: " + (dinNames.join(", ") || "none picked") + ". Prep steps done: " + Object.keys(pp.steps || {}).join(", ") + ".");
    const aq = quests.filter(q => !q.archived).map(q => q.title + " (" + (q.milestones || []).filter(m => m.doneAt).length + "/" + (q.milestones || []).length + ")");
    if (aq.length) lines.push("Active quests: " + aq.join("; "));
    return lines.join("\n");
  }
  window.EAH = {
    context: dmContext,
    db: () => db,
    party: () => PARTY,
    today: todayKey,
    addQuest: (title, steps) => saveQuest({ id: "q" + Date.now().toString(36), title, due: null, createdAt: new Date().toISOString(), archived: false, milestones: steps.map((t, i) => ({ id: "m" + i, text: t, doneAt: null })) }),
    notice: showNotice,
    day: k => evaluateDay(k, G.level)
  };

  /* ================= the campaign: one page per won night ================= */
  function partyNames() { const o = {}; PARTY.forEach(p => { o[p.id] = p.name; }); return o; }
  function storyLog(upTo) {
    const out = [], start = game.startDate; if (!start || !window.STORY) return { wins: 0, out };
    const today = todayKey(); let wins = 0;
    for (let k = start; k <= upTo && k <= today; k = addDays(k, 1)) {
      if (days[k] && days[k].rest) continue;
      const r = evaluateDay(k, G.level); if (!r.need) continue;
      if (r.win) { wins++; out.push({ k, win: true, n: wins, monster: r.monster }); }
      else if (k < today) out.push({ k, win: false, monster: r.monster });
    }
    return { wins, out };
  }
  function storyPage(n, monster) { return n > 0 && window.STORY ? STORY.page(n, partyNames(), monster) : null; }
  function storyDots(pg, animateLast) { return '<span class="sdots">' + Array.from({ length: pg.of }, (_, i) => '<i class="' + (i < pg.page ? "on" : "") + (animateLast && i === pg.page - 1 ? " new" : "") + '"></i>').join("") + '</span>'; }
  function renderStoryPanel() {
    const box = $("storyPanel"); if (!box || !window.STORY) return;
    const log = storyLog(todayKey()), cur = storyPage(Math.max(1, log.wins), (log.out.filter(e => e.win).slice(-1)[0] || {}).monster);
    const names = partyNames();
    box.innerHTML = '<div class="story-head"><span class="story-emblem" style="--sc:' + cur.color + '">' + ART.svg(cur.icon, 40, cur.color) + '</span><div><div class="eyebrow">' + (cur.book === 1 ? "Book one · Chapter " + cur.chapter + " of " + STORY.chapters : "Book two · Chronicles") + '</div><h2></h2>' + storyDots(log.wins ? cur : Object.assign({}, cur, { page: 0 })) + '</div></div><p class="story-latest"></p><details class="story-book"><summary>Read the story so far</summary><div class="story-pages"></div></details>';
    box.querySelector("h2").textContent = cur.title;
    box.querySelector(".story-latest").textContent = log.wins ? cur.text : STORY.prologue(names) + " The first page turns when the first monster falls.";
    const pages = box.querySelector(".story-pages");
    const add = (cls, text, meta) => { const p = document.createElement("p"); p.className = cls; p.textContent = text; if (meta) { const m = document.createElement("small"); m.textContent = meta; p.prepend(m); } pages.appendChild(p); };
    add("story-pro", STORY.prologue(names));
    let lastCh = "";
    log.out.forEach(e => {
      if (!e.win) { add("story-set", STORY.setback(hash(e.k), names, e.monster), niceDate(e.k)); return; }
      const pg = storyPage(e.n, e.monster), ch = pg.book + ":" + pg.chapter;
      if (ch !== lastCh) { const h = document.createElement("h3"); h.className = "story-ch"; h.innerHTML = ART.svg(pg.icon, 20, pg.color) + "<span></span>"; h.querySelector("span").textContent = (pg.book === 1 ? "Chapter " + pg.chapter + ": " : "") + pg.title; pages.appendChild(h); lastCh = ch; }
      add("story-page", pg.text, niceDate(e.k) + " · " + e.monster);
    });
  }

  /* ================= evening tale: victory recap at free time ================= */
  const slugOf = n => String(n).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  let taleWanted = location.hash === "#tale";
  const GERUND = { vacuum: "vacuuming", take: "taking", cook: "cooking", clean: "cleaning", read: "reading", fold: "folding", hang: "hanging", mop: "mopping", move: "moving", wash: "washing", do: "doing", prep: "prepping", tidy: "tidying", change: "changing", dust: "dusting", empty: "emptying", water: "watering", feed: "feeding", walk: "walking", buy: "buying", pay: "paying", sort: "sorting", put: "putting", wipe: "wiping" };
  function shortTask(h, k) {
    let n = displayName(h, k).replace(/\s*\(.*?\)/g, "").split(/[:,]| \+ /)[0].replace(/ (for|with) the cat$/i, "").replace(/ after .*$/i, "").trim();
    const w = n.split(" "), first = w[0].toLowerCase();
    if (GERUND[first]) return [GERUND[first]].concat(w.slice(1)).join(" ");
    n = n.charAt(0).toLowerCase() + n.slice(1);
    return /^(a|an|the|\d)/i.test(n) ? n : "the " + n;
  }
  function listJoin(a) { return a.length < 2 ? (a[0] || "") : a.slice(0, -1).join(", ") + " and " + a[a.length - 1]; }
  function pick(arr, seed) { return arr[hash(seed) % arr.length]; }
  function taleStats(k) {
    const r = evaluateDay(k, G.level);
    const doneAll = r.doneDaily.concat(r.doneExtra, r.doneWeekly);
    const total = r.daily.length + r.extraDue.length + r.weekly.filter(h => dueOn(h, k)).length;
    const xp = 10 * (r.doneDaily.length + r.doneExtra.length) + 15 * r.doneWeekly.length + 10 * r.ms + (r.win ? 15 : 0);
    const gold = r.win ? 10 + 2 * G.level + (hash(k + "g") % 6) + BONUS_GOLD * r.bonus : 0;
    return { r, doneAll, total, xp, gold };
  }
  function tomorrowInfo(k) {
    const t = addDays(k, 1), tr = evaluateDay(t, G.level), w = dow(t);
    const special = tr.daily.filter(h => isScheduled(h) || isAfter(h)).map(h => shortTask(h, t));
    const day = parseKey(t).toLocaleDateString("en-GB", { weekday: "long" });
    let plan = tr.need ? tr.mustNeed + " must-dos + " + tr.anyNeed + " of anything." : "No must-dos. A quiet night.";
    if (special.length) plan += " " + day + " brings " + listJoin(special) + ".";
    if (days[t] && days[t].rest) plan = "You've marked a rest day. No fight tomorrow.";
    else if (isLab(t)) plan = "Lab day: weekend chores are excused. Just the basics.";
    const cheer = w === 6 ? "Saturday: one chores block in the morning, then the day is yours. Rest well." : w === 0 ? "Sunday: lunch prep day. Cook once, eat well all week." : w === 5 ? "Friday's an easy one. You've earned a gentle night." : pick(["Rest well. The party will be ready at 18:30.", "Sleep well, recover your strength. Tomorrow we ride again.", "Enjoy your free time. You've earned every minute of it."], t);
    return { t, tr, day, plan, cheer };
  }
  let taleRun = 0, taleAudio = null;
  const SFX_FILES = ["slash", "dagger", "claw", "bell", "magic", "crit", "boom", "coins", "draw", "star", "tick"];
  const HIT_SOUND = { familiar: "claw", fighter: "slash", cleric: "bell", wizard: "magic", rogue: "dagger" };
  const sfxBuf = {}; let sfxLoading = null;
  function soundOn() { try { return localStorage.getItem("eah-sound") !== "0"; } catch (e) { return true; } }
  function audioCtx() {
    const A = window.AudioContext || window.webkitAudioContext; if (!A) return null;
    taleAudio = taleAudio || new A(); if (taleAudio.state === "suspended") taleAudio.resume().catch(() => {});
    if (!sfxLoading) sfxLoading = Promise.all(SFX_FILES.map(n => fetch("sfx/" + n + ".ogg").then(r => r.arrayBuffer()).then(b => new Promise((ok, no) => taleAudio.decodeAudioData(b, ok, no))).then(buf => { sfxBuf[n] = buf; }).catch(() => {})));
    return taleAudio;
  }
  function play(name, vol, rate, delay) {
    const ctx = audioCtx(); if (!ctx || ctx.state !== "running" || !sfxBuf[name]) return false;
    const src = ctx.createBufferSource(), g = ctx.createGain(); src.buffer = sfxBuf[name]; src.playbackRate.value = rate || 1; g.gain.value = vol == null ? 0.8 : vol;
    src.connect(g); g.connect(ctx.destination); src.start(ctx.currentTime + (delay || 0)); return true;
  }
  function sfx(kind, n, who) {
    if (!soundOn()) return;
    try {
      const ctx = audioCtx(); if (!ctx || ctx.state !== "running") return;
      const t0 = ctx.currentTime, tone = (f, at, d, type, vol) => { const o = ctx.createOscillator(), g = ctx.createGain(); o.type = type || "square"; o.frequency.setValueAtTime(f, t0 + at); g.gain.setValueAtTime(vol || 0.06, t0 + at); g.gain.exponentialRampToValueAtTime(0.0001, t0 + at + d); o.connect(g); g.connect(ctx.destination); o.start(t0 + at); o.stop(t0 + at + d + 0.02); };
      if (kind === "hit") { if (!play(HIT_SOUND[who] || "slash", 0.75, 0.95 + 0.04 * ((n || 0) % 4))) { tone(320 + 60 * (n || 0), 0, 0.09, "square", 0.05); tone(160 + 30 * (n || 0), 0.03, 0.1, "triangle", 0.06); } }
      if (kind === "crit") { if (!play("crit", 0.8)) { tone(880, 0, 0.08, "square", 0.05); tone(1320, 0.06, 0.12, "square", 0.05); } play("coins", 0.35, 1.2, 0.08); }
      if (kind === "draw") play("draw", 0.6);
      if (kind === "boom") { play("boom", 1, 0.6); const len = 0.6, buf = ctx.createBuffer(1, ctx.sampleRate * len, ctx.sampleRate), d = buf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 2.5); const src = ctx.createBufferSource(), g = ctx.createGain(); g.gain.value = 0.3; src.buffer = buf; src.connect(g); g.connect(ctx.destination); src.start(t0); }
      if (kind === "fanfare") [523, 659, 784, 1047].forEach((f, i) => { tone(f, i * 0.13, i === 3 ? 0.55 : 0.16, "triangle", 0.09); tone(f / 2, i * 0.13, i === 3 ? 0.55 : 0.16, "sine", 0.05); });
      if (kind === "star") { if (!play("star", 0.7, 1 + 0.15 * (n || 0))) tone(1200 + 200 * (n || 0), 0, 0.15, "sine", 0.07); }
      if (kind === "coins") play("coins", 0.7);
      if (kind === "tick") play("tick", 0.45);
    } catch (e) {}
  }
  function openTale(k) {
    k = k || todayKey();
    const st = taleStats(k); if (!st.r.win) return;
    try { localStorage.setItem("eah-tale-" + k, "1"); } catch (e) {}
    taleWanted = false; if (location.hash === "#tale") { try { history.replaceState(null, "", "#tonight"); } catch (e) {} }
    const r = st.r, tm = tomorrowInfo(k), run = ++taleRun;
    const nm = id => (PARTY.find(p => p.id === id) || {}).name || id;
    // every task done tonight is one strike, must-dos first
    const strikes = r.doneDaily.concat(r.doneExtra, r.doneWeekly).map(h => ({ who: GROUPS[h.group].member, what: shortTask(h, k).replace(/^the /, "") }));
    for (let i = 0; i < r.ms; i++) strikes.push({ who: "rogue", what: "quest step" });
    const heroes = PARTY.filter(p => strikes.some(x => x.who === p.id));
    const ratio = st.total ? st.doneAll.length / st.total : 1, stars = ratio >= 1 ? 3 : ratio >= 0.75 ? 2 : 1;
    const finalWho = strikes[Math.min(strikes.length, r.need) - 1] ? strikes[Math.min(strikes.length, r.need) - 1].who : "fighter";
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const el = $("tale");
    const tomorrowSwords = tm.tr.need ? Array.from({ length: tm.tr.need }, (_, i) => '<span class="sw' + (i >= tm.tr.mustNeed ? " any" : "") + '">' + ICON.sword + '</span>').join("") : "";
    const special = tm.tr.daily.filter(h => isScheduled(h) || isAfter(h)).map(h => shortTask(h, tm.t).replace(/^the /, ""));
    el.innerHTML =
      '<div class="tale-sky" aria-hidden="true">' + Array.from({ length: 30 }, (_, i) => '<b style="left:' + (hash("s" + i) % 100) + '%;top:' + (hash("t" + i) % 70) + '%;animation-delay:' + (hash("u" + i) % 3000) + 'ms"></b>').join("") + '</div>' +
      '<div class="tale-inner">' +
        '<div class="tale-top"><span class="eyebrow">Tonight’s fight</span><b></b></div>' +
        '<div class="arena">' +
          '<div class="tfoe" style="--mc:' + ART.monsterColor(r.monster) + '"><div class="tfoe-body"><span class="tfoe-ring"></span>' + ART.monster(r.monster, 112, "tfoe-art") + '</div><div class="tfoe-hp"><span></span></div></div>' +
          '<div class="tparty">' + heroes.map(p => '<span class="thero" data-id="' + p.id + '">' + portrait(p, 54) + '</span>').join("") + '</div>' +
        '</div>' +
        '<div class="tale-win" hidden>' +
          '<div class="tale-crown">' + ART.svg("laurel-crown", 64, "#ffd27a") + '</div><div class="tale-banner">Victory!</div>' +
          '<div class="tale-stars">' + [0, 1, 2].map(i => '<span class="tstar' + (i < stars ? " on" : "") + '">★</span>').join("") + '</div>' +
          '<div class="tale-loot"><span class="tl-xp">' + ART.svg("star-swirl", 26, "#9cdc8a") + '<b data-to="' + st.xp + '">0</b><small>XP</small></span><span class="tl-gold">' + ART.svg("two-coins", 26, "#ffd27a") + '<b data-to="' + st.gold + '">0</b><small>gold</small></span></div>' +
          (window.STORY ? '<div class="tale-chapter"></div>' : "") +
          '<div class="tale-final">' + portrait(PARTY.find(p => p.id === finalWho), 30) + '<span><small>Final blow</small><b></b></span><i>' + ART.attack(finalWho, 30) + '</i></div>' +
          '<div class="tale-next">' +
            '<div class="tn-head"><span class="eyebrow"></span></div>' +
            '<div class="tn-body"><span class="tn-foe" style="--mc:' + ART.monsterColor(tm.tr.monster) + '">' + ART.monster(tm.tr.monster, 56) + '</span><div><b class="tn-name"></b><div class="swords tn-swords">' + tomorrowSwords + '</div><div class="tn-chips"></div></div></div>' +
            '<p class="tale-cheer"></p>' +
          '</div>' +
          '<div class="tale-actions"><button type="button" class="btn-main" id="taleClose">On to free time</button><button type="button" class="btn-quiet" id="taleDm" hidden>📜 Let the DM tell the story</button><div class="tale-story"></div></div>' +
        '</div>' +
        '<button type="button" class="tale-skip" id="taleSkip">Skip ›</button>' +
      '</div>';
    el.querySelector(".tale-top b").textContent = r.monster;
    el.querySelector(".tale-final b").textContent = nm(finalWho);
    const chBox = el.querySelector(".tale-chapter"), sLog = window.STORY ? storyLog(k) : null, pg = sLog ? storyPage(sLog.wins, r.monster) : null;
    if (chBox && pg) {
      chBox.style.setProperty("--sc", pg.color);
      chBox.innerHTML = '<div class="tc-head"><span class="tc-emblem">' + ART.svg(pg.icon, 34, pg.color) + '</span><div><small></small><b></b></div></div>' + storyDots(pg, true) + '<p class="tc-text"></p>' + (pg.last ? '<div class="tc-done">' + (pg.finale ? "📖 The end of book one" : "Chapter complete!") + '</div>' : "");
      chBox.querySelector("small").textContent = (pg.book === 1 ? "Chapter " + pg.chapter : "Chronicles") + " · page " + pg.page + " of " + pg.of;
      chBox.querySelector("b").textContent = pg.title;
      chBox.dataset.text = pg.text;
      if (pg.last) chBox.classList.add("complete");
    }
    el.querySelector(".tn-head .eyebrow").textContent = "Tomorrow · " + tm.day;
    el.querySelector(".tn-name").textContent = tm.tr.monster;
    const chips = el.querySelector(".tn-chips");
    (days[tm.t] && days[tm.t].rest ? ["rest day 💤"] : isLab(tm.t) ? ["lab day 🧪"] : special).slice(0, 3).forEach(t => { const c = document.createElement("span"); c.textContent = t; chips.appendChild(c); });
    el.querySelector(".tale-cheer").textContent = tm.cheer.split(". ").slice(-1)[0];
    el.hidden = false; document.body.style.overflow = "hidden"; el.scrollTop = 0;
    $("taleClose").onclick = closeTale;
    const key = window.DM && window.DM.get && window.DM.get(window.DM.keys.KEY);
    if (key) { $("taleDm").hidden = false; $("taleDm").onclick = () => dmTale(k, st, tm, key); }
    let skip = reduce;
    $("taleSkip").onclick = () => { skip = true; };
    el.querySelector(".arena").onclick = () => { skip = true; };
    const wait = ms => new Promise(res => setTimeout(res, skip ? 0 : ms));
    const alive = () => run === taleRun && !el.hidden;
    const arena = el.querySelector(".arena"), foe = el.querySelector(".tfoe"), body = el.querySelector(".tfoe-body"), hp = el.querySelector(".tfoe-hp span");
    const center = node => { const a = arena.getBoundingClientRect(), b = node.getBoundingClientRect(); return { x: b.left - a.left + b.width / 2, y: b.top - a.top + b.height / 2 }; };
    const fx = (cls, html, x, y) => { const d = document.createElement("span"); d.className = cls; d.innerHTML = html; d.style.left = x + "px"; d.style.top = y + "px"; arena.appendChild(d); return d; };
    const anim = (node, frames, opts) => (node.animate && !skip) ? node.animate(frames, opts).finished.catch(() => {}) : Promise.resolve();
    (async () => {
      sfx("draw");
      await wait(500);
      let left = r.need;
      for (let i = 0; i < strikes.length && alive(); i++) {
        if (skip) break;
        const s = strikes[i], crit = i >= r.need, hero = el.querySelector('.thero[data-id="' + s.who + '"]');
        const from = hero ? center(hero) : { x: arena.clientWidth / 2, y: arena.clientHeight }, to = center(body);
        if (hero) anim(hero, [{ transform: "none" }, { transform: "translateY(-16px) scale(1.18)" }, { transform: "none" }], { duration: 360, easing: "ease-out" });
        const p = fx("tproj", ART.attack(s.who, 44), from.x, from.y); p.style.setProperty("--pc", ART.attackColor(s.who));
        await anim(p, [{ transform: "translate(-50%,-50%) scale(.5) rotate(0)" }, { transform: "translate(calc(-50% + " + (to.x - from.x) + "px), calc(-50% + " + (to.y - from.y) + "px)) scale(1.4) rotate(" + (crit ? 720 : 360) + "deg)" }], { duration: 340, easing: "cubic-bezier(.3,.6,.4,1)" });
        p.remove(); if (!alive()) return;
        sfx(crit ? "crit" : "hit", i, s.who); try { if (navigator.vibrate) navigator.vibrate(crit ? [20, 30, 20] : 18); } catch (e) {}
        anim(body, [{ transform: "translateX(0)", filter: "brightness(2.6)" }, { transform: "translateX(-10px) rotate(-5deg)" }, { transform: "translateX(8px) rotate(4deg)" }, { transform: "none", filter: "none" }], { duration: 300 });
        if (!crit) { left--; hp.style.width = Math.max(0, left / r.need * 100) + "%"; }
        const dn = fx("tdmg" + (crit ? " crit" : ""), (crit ? "CRIT +5g" : "−10") + "<small></small>", to.x + ((i % 3) - 1) * 34, to.y - 40);
        dn.querySelector("small").textContent = s.what;
        anim(dn, [{ transform: "translate(-50%,0) scale(.6)", opacity: 0 }, { transform: "translate(-50%,-18px) scale(1.15)", opacity: 1, offset: .25 }, { transform: "translate(-50%,-60px) scale(1)", opacity: 0 }], { duration: 1100, easing: "ease-out" }).then(() => dn.remove());
        await wait(crit ? 380 : 300);
      }
      if (!alive()) return;
      hp.style.width = "0%";
      // the monster bursts
      sfx("boom"); try { if (navigator.vibrate) navigator.vibrate([60, 40, 120]); } catch (e) {}
      const c = center(body);
      if (!skip) {
        const flash = fx("tflash", ART.svg("explosion-rays", 260, "#ffd27a"), c.x, c.y);
        anim(flash, [{ transform: "translate(-50%,-50%) scale(.2) rotate(0)", opacity: 0 }, { transform: "translate(-50%,-50%) scale(1.1) rotate(30deg)", opacity: 1, offset: .3 }, { transform: "translate(-50%,-50%) scale(1.5) rotate(60deg)", opacity: 0 }], { duration: 900, easing: "ease-out" }).then(() => flash.remove());
        await anim(body, [{ transform: "scale(1)", filter: "brightness(1)" }, { transform: "scale(1.25)", filter: "brightness(3) saturate(0)" }], { duration: 260, easing: "ease-in" });
        for (let i = 0; i < 22; i++) {
          const bit = fx("tbit", "", c.x, c.y), ang = (i / 22) * Math.PI * 2 + (hash(k + i) % 10) / 10, dist = 70 + (hash(k + "b" + i) % 90);
          bit.style.background = ["#ffd27a", "#e8604c", "#9b7bd6", "#7cc28a", "#fff"][i % 5];
          anim(bit, [{ transform: "translate(-50%,-50%) scale(1)", opacity: 1 }, { transform: "translate(calc(-50% + " + Math.cos(ang) * dist + "px), calc(-50% + " + Math.sin(ang) * dist + "px)) scale(.2)", opacity: 0 }], { duration: 700 + (hash(k + "t" + i) % 300), easing: "cubic-bezier(.1,.7,.3,1)" }).then(() => bit.remove());
        }
      }
      foe.classList.add("gone");
      await wait(450); if (!alive()) return;
      $("taleSkip").hidden = true; arena.classList.add("done");
      await wait(420); if (!alive()) return;
      const win = el.querySelector(".tale-win"); win.hidden = false; win.classList.toggle("instant", skip);
      sfx("fanfare");
      if (!skip) confettiBurst();
      const tc = el.querySelector(".tale-chapter .tc-text"), full = tc ? tc.parentNode.dataset.text : "";
      if (tc) { if (skip) tc.textContent = full; else setTimeout(() => { let i = 0; const tick = () => { if (!alive()) return; i = Math.min(full.length, i + 2); tc.textContent = full.slice(0, i); if (i < full.length) setTimeout(tick, 28); else if (tc.parentNode.classList.contains("complete")) { sfx("star", 3); setTimeout(confettiBurst, 200); } }; tick(); }, 2100); }
      // stars, then loot counting up
      el.querySelectorAll(".tstar").forEach((t, i) => setTimeout(() => { t.classList.add("pop"); if (t.classList.contains("on")) sfx("star", i); }, skip ? 0 : 500 + i * 260));
      setTimeout(() => sfx("coins"), skip ? 0 : 1300);
      setTimeout(() => el.querySelectorAll(".tale-loot b").forEach(b => { const to = Number(b.dataset.to), t0 = performance.now(), dur = skip ? 1 : 1000; let last = 0; const step = now => { const f = Math.min(1, (now - t0) / dur); const v = Math.round(to * f); b.textContent = v; last = v; if (f < 1 && alive()) requestAnimationFrame(step); }; requestAnimationFrame(step); }), skip ? 0 : 1300);
    })();
  }
  function confettiBurst() {
    const c = window.confetti; if (!c) return;
    const colors = ["#ffd27a", "#e8604c", "#9b7bd6", "#7cc28a", "#6fb3e0", "#ffffff"], z = 70;
    c({ particleCount: 90, spread: 80, startVelocity: 48, origin: { y: 0.32 }, colors, shapes: ["square", "circle", "star"], scalar: 1.1, zIndex: z });
    setTimeout(() => { c({ particleCount: 50, angle: 60, spread: 60, origin: { x: 0, y: 0.7 }, colors, zIndex: z }); c({ particleCount: 50, angle: 120, spread: 60, origin: { x: 1, y: 0.7 }, colors, zIndex: z }); }, 350);
    setTimeout(() => c({ particleCount: 40, spread: 120, startVelocity: 25, gravity: 0.6, origin: { y: 0.15 }, colors: ["#ffd27a", "#f5b942"], shapes: ["circle"], scalar: 1.5, zIndex: z }), 900);
  }
  function closeTale() { taleRun++; $("tale").hidden = true; $("tale").innerHTML = ""; document.body.style.overflow = ""; }
  async function dmTale(k, st, tm, key) {
    const dm = $("taleDm"); dm.disabled = true; dm.textContent = "The DM is writing…";
    const box = $("tale").querySelector(".tale-story"); box.hidden = false;
    const names = PARTY.map(p => p.name + " the " + p.cls).join(", ");
    const did = st.doneAll.map(h => displayName(h, k) + " (" + PARTY.find(p => p.id === GROUPS[h.group].member).name + ")").join("; ");
    const prompt = "Tonight the party (" + names + ") defeated the " + st.r.monster + " (" + st.r.lore + ") in my real evening at home. What I actually did: " + did + ". Write a short, warm, funny fantasy tale of the fight in 4 to 6 sentences, crediting the party members for the tasks they guard. End with one line foreshadowing tomorrow's foe, the " + tm.tr.monster + " (" + tm.tr.lore + "). Plain text, no title, no lists.";
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", { method: "POST", headers: { "content-type": "application/json", "x-api-key": key, "anthropic-version": "2023-06-01", "anthropic-dangerous-direct-browser-access": "true" }, body: JSON.stringify({ model: window.DM.get(window.DM.keys.MODEL) || "claude-haiku-5-5", max_tokens: 400, messages: [{ role: "user", content: prompt }] }) });
      if (!res.ok) throw new Error(res.status === 401 ? "The DM's key was rejected. Check it in Settings." : "The DM couldn't answer (" + res.status + ").");
      const data = await res.json(); const text = (data.content || []).filter(c => c.type === "text").map(c => c.text).join("\n").trim();
      if (!text) throw new Error("The DM had nothing to say.");
      box.innerHTML = ""; text.split(/\n+/).forEach(t => { const p = document.createElement("p"); p.textContent = t; p.style.animationDelay = "0ms"; box.appendChild(p); });
      dm.hidden = true;
    } catch (e) { dm.disabled = false; dm.textContent = (e && e.message && !/fetch/i.test(e.message)) ? e.message : "Couldn't reach the DM. Try again."; }
  }
  function maybeTale() {
    const k = todayKey(); if (!daysLoaded || !$("tale").hidden || tab !== "tonight") return;
    let seen = false; try { seen = localStorage.getItem("eah-tale-" + k) === "1"; } catch (e) {}
    const r = evaluateDay(k, G.level); if (!r.win || !r.need || k < (game.startDate || k)) return;
    if (taleWanted || (!seen && nowMins() >= FREE && !(days[k] && days[k].rest))) openTale(k);
  }
  window.addEventListener("hashchange", () => { if (location.hash === "#tale") { taleWanted = true; maybeTale(); } });
  if (navigator.serviceWorker) navigator.serviceWorker.addEventListener("message", e => { if (e.data && e.data.open === "tale") { taleWanted = true; maybeTale(); } });

  /* ================= focus timer for timed habits ================= */
  function timedMinutes(x) {
    const n = Number(x.minutes); if (n > 0) return Math.min(240, n);
    const m = /(\d{1,3})\s*-?\s*min/i.exec(String(x.name || "")); return m ? Math.min(240, Number(m[1])) : 0;
  }
  const TIMER_KEY = "eah-timer";
  var timer = null, timerTick = null, timerLock = null, daysLoaded = false;
  function loadTimer() { try { return JSON.parse(localStorage.getItem(TIMER_KEY) || "null"); } catch (e) { return null; } }
  function saveTimer() { try { if (timer) localStorage.setItem(TIMER_KEY, JSON.stringify(timer)); else localStorage.removeItem(TIMER_KEY); } catch (e) {} }
  function timerLeft() { if (!timer) return 0; return Math.max(0, timer.paused != null ? timer.paused : timer.endAt - Date.now()); }
  function fmtClock(ms) { const t = Math.ceil(ms / 1000), m = Math.floor(t / 60), sec = t % 60; return pad(m) + ":" + pad(sec); }
  function startTimer(h, k) {
    if (timer && timer.hid !== h.id && timerLeft() > 0) { showTimer(); $("focusSwap").hidden = false; return; }
    const total = h.minutes * 60000;
    timer = { hid: h.id, k, name: displayName(h, k), note: h.note || "", group: h.group, total, endAt: Date.now() + total, paused: null, warned: false, rang: false };
    saveTimer();
    try { if (window.Notification && Notification.permission === "default") Notification.requestPermission(); } catch (e) {}
    showTimer();
  }
  function showTimer() {
    if (!timer) return;
    $("focus").hidden = false; document.body.style.overflow = "hidden";
    $("focusTitle").textContent = timer.name;
    const fl = $("focusList"); fl.innerHTML = ""; fl.hidden = !timer.note;
    (timer.note || "").split(" · ").filter(Boolean).forEach(t => { const li = document.createElement("li"); li.textContent = t; fl.appendChild(li); });
    $("focusFill").style.background = GROUPS[timer.group] ? GROUPS[timer.group].color : "var(--lamp)";
    $("focusSwap").hidden = true;
    keepAwake($("focusAwake").checked);
    clearInterval(timerTick); timerTick = setInterval(paintTimer, 250); paintTimer();
  }
  function hideTimer() {
    $("focus").hidden = true; document.body.style.overflow = "";
    clearInterval(timerTick); timerTick = null; keepAwake(false);
    if (timer && timerLeft() > 0) timerTick = setInterval(backgroundCheck, 1000);
    renderAll();
  }
  function backgroundCheck() { if (!timer) { clearInterval(timerTick); return; } if (timerLeft() === 0 && !timer.rang) { ring(); showTimer(); } }
  function keepAwake(on) {
    try {
      if (on && navigator.wakeLock && !timerLock && document.visibilityState === "visible") navigator.wakeLock.request("screen").then(l => { timerLock = l; l.addEventListener("release", () => { timerLock = null; }); }).catch(() => {});
      if (!on && timerLock) { timerLock.release(); timerLock = null; }
    } catch (e) {}
  }
  function paintTimer() {
    if (!timer) return;
    const left = timerLeft(), frac = timer.total ? left / timer.total : 0, done = left === 0;
    $("focusTime").textContent = done ? "00:00" : fmtClock(left);
    $("focusFill").style.width = (frac * 100).toFixed(2) + "%";
    const warn = !done && left <= 60000;
    $("focus").classList.toggle("warn", warn); $("focus").classList.toggle("over", done);
    $("focusState").textContent = done ? "Time's up! It's ticked off and the XP is yours." : timer.paused != null ? "Paused. Points only count when the timer ends." : warn ? "Less than a minute left" : "Ends at " + new Date(timer.endAt).toTimeString().slice(0, 5) + " · points when it ends";
    if (warn && !timer.warned) { timer.warned = true; saveTimer(); try { if (navigator.vibrate) navigator.vibrate(200); } catch (e) {} }
    if (done && !timer.rang) ring();
    $("focusPause").hidden = done; $("focusPause").textContent = timer.paused != null ? "Resume" : "Pause";
    $("focusStop").hidden = done; $("focusDone").hidden = !done;
  }
  function ring() {
    timer.rang = true; saveTimer();
    creditTimer();
    beep(); setTimeout(beep, 1300); setTimeout(beep, 2600);
    try { if (navigator.vibrate) navigator.vibrate([500, 200, 500, 200, 800]); } catch (e) {}
    try {
      if (window.Notification && Notification.permission === "granted" && navigator.serviceWorker)
        navigator.serviceWorker.ready.then(r => r.showNotification("Time's up", { body: timer.name + " · " + Math.round(timer.total / 60000) + " minutes done. Tap to tick it off.", icon: "icons/icon-192.png", badge: "icons/badge.png", tag: "eah-timer", vibrate: [500, 200, 500], requireInteraction: true }));
    } catch (e) {}
  }
  function creditTimer(t) {
    t = t || timer; if (!t || t.credited) return;
    if (!db || !canWrite || !daysLoaded) { setTimeout(() => creditTimer(t), 1000); return; }
    if (!isDone(t.hid, t.k)) toggleDay(t.hid, t.k);
    t.credited = true; if (t === timer) saveTimer();
  }
  function endTimer() {
    timer = null; saveTimer();
    clearInterval(timerTick); timerTick = null;
    hideTimer();
  }
  try { $("soundOn").checked = soundOn(); } catch (e) {}
  $("soundOn").onchange = e => { try { localStorage.setItem("eah-sound", e.target.checked ? "1" : "0"); } catch (x) {} if (e.target.checked) { audioCtx(); setTimeout(() => sfx("tick"), 300); } };
  $("gamePill").onclick = () => { setTab("tonight"); setTimeout(() => { const g = document.querySelector(".gsess"); if (g) g.scrollIntoView({ behavior: "smooth", block: "center" }); }, 60); };
  $("focusPause").onclick = () => {
    if (!timer) return;
    if (timer.paused != null) { timer.endAt = Date.now() + timer.paused; timer.paused = null; } else timer.paused = timerLeft();
    saveTimer(); paintTimer();
  };
  $("focusDone").onclick = endTimer;
  $("focusStop").onclick = () => { if ($("focusStop").dataset.sure === "1" || timerLeft() === 0) endTimer(); else { $("focusStop").dataset.sure = "1"; $("focusStop").textContent = "Tap again to give up (no points)"; setTimeout(() => { $("focusStop").dataset.sure = ""; $("focusStop").textContent = "Give up"; }, 3000); } };
  $("focusHide").onclick = hideTimer;
  $("focusAwake").onchange = e => { try { localStorage.setItem("eah-awake", e.target.checked ? "1" : "0"); } catch (x) {} keepAwake(e.target.checked); };
  try { $("focusAwake").checked = localStorage.getItem("eah-awake") !== "0"; } catch (e) {}
  document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible" && timer && !$("focus").hidden) { keepAwake($("focusAwake").checked); paintTimer(); } else if (document.visibilityState === "visible" && timer && timerLeft() === 0 && !timer.rang) { ring(); showTimer(); } });
  timer = loadTimer();
  if (timer) setTimeout(showTimer, 400);

  /* ================= data ================= */
  (async () => {
    db = await window.Store.ready();
    if (!db) { showNotice("Your data couldn't load. Check Settings."); return; }

    const err = what => () => showNotice(what + " stopped updating. Reload the page.");
    db.doc("game/state").onSnapshot(s => { game = s.exists ? Object.assign({ startDate: null }, s.data()) : { startDate: null }; applyNames(); renderRenameFields(); renderAll(); }, err("Game data"));
    db.collection("habits").onSnapshot(s => {
      habitsAll = s.docs.map(d => { const x = d.data(); return { id: d.id, name: String(x.name || "Untitled"), group: GROUPS[x.group] ? x.group : "hobby", perWeek: Math.min(7, Math.max(1, Number(x.perWeek) || 7)), order: Number(x.order) || 0, createdAt: String(x.createdAt || ""), archivedAt: x.archivedAt || null, days: Array.isArray(x.days) ? x.days.map(Number).filter(n => n >= 0 && n <= 6) : null, rotation: Array.isArray(x.rotation) ? x.rotation.map(String).slice(0, 52) : null, everyWeeks: Number(x.everyWeeks) || 1, weekOffset: Number(x.weekOffset) || 0, after: x.after ? String(x.after) : null, afterDays: Number(x.afterDays) || 0, link: x.link ? String(x.link) : null, minutes: timedMinutes(x), note: String(x.note || "").slice(0, 400), everyDays: Number(x.everyDays) || 0, anchor: /^\d{4}-\d{2}-\d{2}$/.test(String(x.anchor || "")) ? String(x.anchor) : null }; });
      renderAll();
    }, err("Habits"));
    db.collection("days").orderBy("date", "desc").limit(500).onSnapshot(s => { s.docs.forEach(d => { const x = d.data(); days[d.id] = { date: d.id, done: Object.assign({}, x.done || {}), game: Number(x.game) || 0, rest: !!x.rest, lab: !!x.lab }; }); daysLoaded = true; renderAll(); }, err("Check-ins"));
    db.collection("recipes").onSnapshot(s => { recipes = s.docs.map(d => Object.assign({ id: d.id }, d.data(), { name: String(d.data().name || "Untitled") })); renderAll(); }, err("Recipes"));
    db.collection("plans").onSnapshot(s => { const p = {}; s.docs.forEach(d => { const x = d.data(); p[d.id] = { week: d.id, recipes: Array.isArray(x.recipes) ? x.recipes : [], dinners: Array.isArray(x.dinners) ? x.dinners : [], extras: Array.isArray(x.extras) ? x.extras : [], brewed: x.brewed || {}, got: x.got || {}, steps: x.steps || {}, skipped: !!x.skipped }; }); plans = p; renderAll(); }, err("Lunch plans"));
    db.doc("session/game").onSnapshot(s => { const x = s.exists ? s.data() : {}; gameSession = { startAt: Number(x.startAt) || null }; renderAll(); }, err("Game timer"));
    db.doc("shop/list").onSnapshot(s => { const x = s.exists ? s.data() : {}; shop = { items: Array.isArray(x.items) ? x.items.filter(i => i && i.id && i.text).map(i => ({ id: String(i.id), text: String(i.text), got: !!i.got })) : [], recent: Array.isArray(x.recent) ? x.recent.map(String).slice(0, 16) : [] }; renderAll(); }, err("Shopping list"));
    db.collection("quests").onSnapshot(s => { quests = s.docs.map(d => Object.assign({ id: d.id }, d.data(), { title: String(d.data().title || "Quest") })); renderAll(); }, err("Quests"));
    db.collection("rewards").onSnapshot(s => { rewards = s.docs.map(d => ({ id: d.id, name: String(d.data().name || "Reward"), cost: Number(d.data().cost) || 0 })); renderAll(); }, err("Rewards"));
    db.collection("purchases").onSnapshot(s => { purchases = s.docs.map(d => Object.assign({ id: d.id }, d.data())); renderAll(); }, err("Purchases"));
    fillRecipeMeta(db);
    migrateCats(db);
    migrateCatsV2(db);
  })();

  // one-time (v2): water and wet food are separate again, so the cat's care feels rewarding; the tidy gets a checklist
  async function migrateCatsV2(db, tries) {
    tries = tries || 0;
    if (!daysLoaded || !habitsAll.length) { if (tries < 40) setTimeout(() => migrateCatsV2(db, tries + 1), 500); return; }
    try {
      const flag = await db.doc("game/migrations").get(), m = flag.exists ? flag.data() : {};
      if (m.catsV2) return;
      if (!m.catsV1) { setTimeout(() => migrateCatsV2(db, tries + 1), 1500); return; }
      const h = id => habitsAll.find(x => x.id === id);
      if (h("cat-water")) await db.doc("habits/cat-water").update({ archivedAt: null, name: "Fresh water for the cat" });
      if (h("cat-wetfood")) await db.doc("habits/cat-wetfood").update({ name: "Wet food for the cat" });
      if (h("tidy-15") && !h("tidy-15").note) await db.doc("habits/tidy-15").update({ note: "Put things back where they live \u00b7 Clear the table, desk and sofa \u00b7 Cups and dishes to the kitchen \u00b7 Clothes to the basket or wardrobe \u00b7 Rubbish and recycling out \u00b7 Stop when the timer ends: no deep cleaning" });
      const cur = await db.doc("game/migrations").get();
      await db.doc("game/migrations").set(Object.assign({}, cur.exists ? cur.data() : {}, { catsV2: todayKey() }));
    } catch (e) { console.warn("Cat/tidy update failed", e); }
  }
  // one-time: feeding and water become one daily task, the litter box every other day
  async function migrateCats(db, tries) {
    tries = tries || 0;
    if (!daysLoaded || !habitsAll.length) { if (tries < 40) setTimeout(() => migrateCats(db, tries + 1), 500); return; }
    try {
      const flag = await db.doc("game/migrations").get(), m = flag.exists ? flag.data() : {};
      if (m.catsV1) return;
      const has = id => habitsAll.some(h => h.id === id && !h.archivedAt), today = todayKey();
      if (has("cat-wetfood")) await db.doc("habits/cat-wetfood").update({ name: "Fresh water + wet food for the cat" });
      if (has("cat-water") && has("cat-wetfood")) await db.doc("habits/cat-water").update({ archivedAt: today });
      if (has("cat-litter")) await db.doc("habits/cat-litter").update({ everyDays: 2, anchor: isDone("cat-litter", addDays(today, -1)) ? addDays(today, 1) : today });
      await db.doc("game/migrations").set(Object.assign({}, m, { catsV1: today }));
    } catch (e) { console.warn("Cat schedule update failed", e); }
  }

  // one-time: give recipes saved before short names and photos existed the starter set's extras
  async function fillRecipeMeta(db) {
    try {
      if (localStorage.getItem("eah-recipe-meta") === "1") return;
      const res = await fetch("starter.json", { cache: "no-store" }); if (!res.ok) return;
      const starter = (await res.json()).docs || {};
      for (const [path, src] of Object.entries(starter)) {
        if (!path.startsWith("recipes/")) continue;
        const cur = (await db.doc(path).get());
        if (!cur.exists) continue;
        const x = cur.data(), patch = {};
        ["short", "image", "links"].forEach(k => { if (x[k] === undefined && src[k] !== undefined) patch[k] = src[k]; });
        if (Object.keys(patch).length) await db.doc(path).update(patch);
      }
      localStorage.setItem("eah-recipe-meta", "1");
    } catch (e) { console.warn("Recipe photos not added", e); }
  }
})();
