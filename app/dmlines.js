/*
 * The Dungeon Master's voice: pre-written lines for the in-app pop-ups and the phone reminders.
 * Placeholders: {M} monster · {T} suggested task · {N} its minutes · {H} hits left · {G} who guards the task
 * {K} the cat · {C} cleric · {F} fighter · {W} wizard · {R} rogue · {D} dinner · {DM} dinner minutes
 * {S} shopping items · {L} minutes until free time · {X} catch-up count
 * Works in the browser (window.DMLINES) and in Node (module.exports) for the reminder job.
 */
(function (root) {
  "use strict";
  const LINES = {
    classic: {
      open_first: [
        "The {M} has crawled out of the shadows. {H} hits will fell it. Begin small: {T}, {N} minutes.",
        "Night falls on Hearthkeep, and the {M} is already here. First blow: {T}. It's only {N} minutes.",
        "Welcome home, hero. The {M} waits by the door. {T} takes {N} minutes. Shall we?",
        "Boots off, sword up. The {M} needs {H} hits. {G} suggests {T}: {N} minutes.",
        "The party gathers. The {M} grins. Wipe that grin off with {T}, just {N} minutes.",
        "A new evening, a new foe: the {M}. Every legend starts with one small blow. {T}, {N} minutes."
      ],
      next: [
        "{H} hits left. {T} is only {N} minutes. {G} is ready when you are.",
        "The {M} staggers. Keep the rhythm: {T}, {N} minutes.",
        "Good. Now {T}. {N} minutes, then you're closer to free time.",
        "{G} points at {T}. {N} minutes, a clean hit.",
        "The {M} is bleeding dust. {T} next, {N} minutes and done.",
        "One step at a time. {T}: {N} minutes. That's all the next step asks."
      ],
      almost: [
        "{H} more and the {M} falls. {T} is {N} minutes. Finish it.",
        "The {M} is on one knee. {T}, {N} minutes, and the bards start writing.",
        "So close the party can taste it. {T}: {N} minutes.",
        "The {M} looks around for an exit. Don't give it one: {T}, {N} minutes."
      ],
      any_left: [
        "The must-dos are done. {H} hit{HS} of anything finishes the {M}. {T} is {N} minutes.",
        "Your duty is done; now for the kill. Any task counts. {T}? {N} minutes.",
        "The {M} is out of tricks. {H} more of anything. Even your reading counts.",
        "Nearly there. Any task lands now. {T} takes {N} minutes."
      ],
      won: [
        "The {M} is slain. Everything else tonight is loot. {T} is {N} minutes of bonus gold, or simply rest.",
        "Victory before free time. {W} is already lighting the reading lamp.",
        "The {M} has fallen. The party bows. Anything more is treasure.",
        "Well fought. The night is yours. A little extra ({T}, {N} min) fills the purse, if you like."
      ],
      won_free: [
        "The {M} lies defeated. Rest now. Your book is waiting, and so is your game.",
        "The night is won. {K} has claimed the warm spot. You should claim yours.",
        "Free time, earned. Hearthkeep sleeps soundly tonight.",
        "No more quests tonight, hero. Read, play, rest. You did the work."
      ],
      free_unfinished: [
        "Free time, but the {M} still stands. {H} hit{HS} left. {T} is just {N} minutes before you settle in.",
        "The clock says rest, the {M} says not yet. {T}, {N} minutes, then the night is yours.",
        "One last push before the fire: {T}. {N} minutes. Then read in peace.",
        "{H} hit{HS} from victory. Your reading counts as one, if you start it now."
      ],
      late_push: [
        "{L} minutes until free time. {H} hit{HS} left. Start with {T}: {N} minutes.",
        "The sun of duty sets in {L} minutes. {T}, {N} minutes, keeps the party safe.",
        "Time runs, hero. {T} takes {N} minutes. The {M} won't wait forever, and neither will free time."
      ],
      dinner: [
        "Hunger is the oldest enemy. Tonight: {D}, about {DM} minutes. {C} will say grace.",
        "The kitchen calls. {D}, {DM} minutes. A fed party fights better.",
        "{C} has the pan ready. {D}: {DM} minutes of cooking, many minutes of being proud of yourself.",
        "Before the fight, the feast: {D}. {DM} minutes and the hearth is warm."
      ],
      weekend_catchup: [
        "Saturday dawns. {X} chore{XS} slipped through the week; catch {XP} first, then the day is yours.",
        "The week left a few loose ends: {X} catch-up{XS}. One block of work, then game time.",
        "Weekend, hero. Clear the {X} catch-up{XS} early, and the rest of the day belongs to you."
      ],
      weekend_free: [
        "Chores done. The realm is yours: play, read, rest. Don't forget the game timer.",
        "The weekend work is finished. {W} declares the rest of the day a holiday.",
        "Duty done. Go play. The party will guard Hearthkeep."
      ],
      commute: [
        "On the road home? Tonight's feast: {D}, about {DM} minutes.{SHOP}",
        "The party awaits you at 18:30. Dinner plan: {D} ({DM} min).{SHOP}",
        "Homeward, hero. {C} suggests {D} tonight, {DM} minutes.{SHOP}"
      ],
      commute_noplan: [
        "On the road home? No dinner planned yet. Something quick: eggs, a salad, or the air fryer.{SHOP}",
        "Homeward, hero. Nothing's planned for dinner. Keep it simple tonight.{SHOP}"
      ],
      react: ["A clean hit!", "The {M} reels!", "Well struck!", "That one landed.", "Ha! It felt that.", "{G} cheers!"],
      react_kill: ["The {M} falls! Victory!", "It's over. The {M} is no more.", "Down it goes! The party roars."]
    },
    cheeky: {
      open_first: [
        "Oh look, the {M} again. It thinks you'll scroll your phone all night. Prove it wrong: {T}, {N} minutes.",
        "Home sweet home, and a {M} on the sofa. Rude. {T} gets rid of it a bit: {N} minutes.",
        "{H} hits, hero. Or you could stare at the wall. {T} is {N} minutes, just saying.",
        "The {M} bet {K} five fish you'd do nothing tonight. {T}, {N} minutes. Take its money."
      ],
      next: [
        "{H} to go. {T} is {N} minutes. Shorter than your average loading screen.",
        "Nice. Don't stop now, the {M} is getting cocky. {T}: {N} minutes.",
        "{G} is tapping a foot. {T}, {N} minutes. Chop chop.",
        "Momentum! Keep it. {T} takes {N} minutes, about one song."
      ],
      almost: [
        "{H} more. The {M} is basically a puddle. {T}, {N} minutes, mop it up.",
        "You're so close it's embarrassing for the {M}. {T}: {N} minutes.",
        "Finish it. {N} minutes of {T} and you get to feel smug all night."
      ],
      any_left: [
        "Must-dos done, show-off. {H} of anything ends it. Even the bins count.",
        "Any task kills it now. {T}? {N} minutes. Or read your book and call it combat.",
        "The {M} is begging. Anything at all. {T}, {N} minutes."
      ],
      won: [
        "Monster dead before free time? Who are you? Extra tasks are just gold now.",
        "The {M} is toast. Go be smug. Or do {T} ({N} min) and be rich AND smug.",
        "Done and dusted. Literally. The rest is loot."
      ],
      won_free: [
        "Victory. Go read. Go play. Go lie on the floor like {K}. You earned it.",
        "The {M} is gone and so are your excuses for not relaxing.",
        "Night won. Put the phone down. Well, after you close this."
      ],
      free_unfinished: [
        "It's free time and the {M} is still here, eating your snacks. {T}: {N} minutes.",
        "{H} hit{HS} left. Your book counts as one. Reading as combat. Imagine that.",
        "Tiny push, then couch. {T}, {N} minutes. The {M} is lazier than you."
      ],
      late_push: [
        "{L} minutes to free time and {H} hit{HS} left. {T}, {N} minutes. Go go go.",
        "The clock is laughing at you. {T} takes {N} minutes. Laugh back."
      ],
      dinner: [
        "Tonight's menu: {D}, {DM} minutes. Way faster than deciding what to order.",
        "Cook {D} ({DM} min). Future you, eating lunch tomorrow, says thanks.",
        "{C} refuses to bless another takeaway. {D}, {DM} minutes."
      ],
      weekend_catchup: [
        "Weekend! Also, {X} thing{XS} you dodged this week. Catch {XP}, then go play.",
        "The week called. It wants its chores back: {X} of them. Quick block, then freedom."
      ],
      weekend_free: [
        "Chores done. Go play. Start the game timer or Ismay gets nothing.",
        "Free. Go be a gamer. Responsibly-ish."
      ],
      commute: [
        "Heading home? It's {D} night ({DM} min). Don't let the takeaway app tempt you.{SHOP}",
        "Dinner's {D}, {DM} minutes. That's less time than you'll spend picking a show.{SHOP}"
      ],
      commute_noplan: [
        "No dinner plan, eh? Eggs exist. So does the air fryer. Just saying.{SHOP}"
      ],
      react: ["Bonk!", "Ooh, that stung.", "Take that, {M}!", "Hit!", "{G} approves.", "Clean."],
      react_kill: ["Ding dong, the {M} is dead.", "Flawless. Well, done anyway.", "It's dead, Jim."]
    }
  };
  function hash(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function fill(t, v) {
    const pl = n => (Number(n) === 1 ? "" : "s");
    v = Object.assign({ HS: pl(v.H), XS: pl(v.X), XP: Number(v.X) === 1 ? "it" : "them", SHOP: v.S ? " " + v.S + " thing" + pl(v.S) + " on the shopping list, if you pass the shop." : "" }, v);
    return t.replace(/\{(DM|HS|XS|XP|SHOP|[A-Z])\}/g, (_, k) => (v[k] === undefined || v[k] === null || v[k] === "" ? "" : String(v[k]))).replace(/\s+([.,])/g, "$1").trim().replace(/(^|[.!?]\s+)([a-z])/g, (m, a, b) => a + b.toUpperCase()).replace(/\b1 minutes\b/g, "1 minute");
  }
  function line(situation, vars, seed, style) {
    const set = (LINES[style] || LINES.classic)[situation] || LINES.classic[situation] || [];
    if (!set.length) return "";
    return fill(set[hash(String(seed || "") + situation) % set.length], vars || {});
  }
  const api = { line, LINES };
  if (typeof module !== "undefined" && module.exports) module.exports = api; else root.DMLINES = api;
})(typeof window !== "undefined" ? window : this);
