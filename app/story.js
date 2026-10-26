/*
 * The campaign: "Hearthkeep". Every night the party wins turns one page.
 * Seven pages make a chapter, seven chapters make the first book.
 * {F} fighter, {C} cleric, {W} wizard, {R} rogue, {K} the familiar (the cat), {M} that night's monster.
 */
(function () {
  "use strict";
  const PROLOGUE = "Hearthkeep was a good house once. Then the long days came, and the clutter-creatures moved in one by one. {F}, {C}, {W}, {R} and {K} have sworn an oath: one evening at a time, they will make it a home again.";
  const CHAPTERS = [
    { title: "The Dusty Hall", icon: "hobbit-door", color: "#e0a050", pages: [
      "The front door creaks open for the first time in months. Dust swirls, and somewhere inside the {M} is still twitching. A start is a start.",
      "{F} props a chair against the door so it stays open. Fresh air walks in like it owns the place.",
      "{K} claims the first clean patch of floor and refuses to move. The party treats it as a victory flag.",
      "Under the dust, {R} finds old coat hooks shaped like little dragons. Someone once loved this hall.",
      "{C} lights a single candle in the window. From the street, the house looks lived-in again.",
      "The creatures whisper that the party will give up by Friday. The party is not listening.",
      "The hall is clear. Boots in a row, coats on the dragon hooks, a candle in the window. Hearthkeep has a front door again."
    ] },
    { title: "The Cold Hearth", icon: "fire-bowl", color: "#ff8a5c", pages: [
      "Beyond the hall lies the kitchen, where the great hearth has been cold for too long. {C} kneels and sweeps out the old ash.",
      "{W} finds a jar of herbs that still smells of summer. It goes on the shelf, label facing out.",
      "The first spark catches, then dies. {F} says nothing, just hands {C} another match.",
      "{K} discovers that a warm kitchen floor is the finest throne in any kingdom.",
      "A pot bubbles for the first time. Nobody knows who started humming, but everyone joins in.",
      "{R} counts the bowls: enough for all five. Enough for guests, even.",
      "The hearth burns steady now. Hearthkeep has warmth again, and warmth is where courage gets cooked."
    ] },
    { title: "The Quiet Library", icon: "bookshelf", color: "#9b7bd6", pages: [
      "Up the stairs, a locked door. Behind it: shelves, silence, and the faint glow the Siren left behind.",
      "{W} switches off the last glowing thing. The silence that follows isn't empty. It's waiting.",
      "One book falls open by itself, a story about an apprentice who learns patience the hard way. {W} keeps reading.",
      "{K} falls asleep on an open atlas. Nobody has the heart to turn the page.",
      "{R} finds a bookmark left mid-chapter, exactly where someone once stopped. It stays there, as a promise.",
      "The armchair by the window is cleared. It fits one person and one cat, exactly.",
      "The library is quiet again, the good kind of quiet. Hearthkeep remembers how to rest."
    ] },
    { title: "The Garden of Small Things", icon: "sprout", color: "#7cc28a", pages: [
      "Behind the house, a garden swallowed by weeds. {F} rolls up both sleeves.",
      "Under the weeds, small green shoots. They had been trying all along, just quietly.",
      "{K} stalks a butterfly with total seriousness, and loses with total dignity.",
      "{C} plants herbs in a crooked row. Crooked rows grow just as well.",
      "Rain comes. The party sits on the porch and watches the garden drink. Nobody needs to be anywhere.",
      "{R} builds a bench from old planks. It wobbles. It's perfect.",
      "The garden is alive. Nothing in it grew overnight, and all of it grew."
    ] },
    { title: "The Watchtower", icon: "stone-tower", color: "#6fb3e0", pages: [
      "A narrow stair climbs the old watchtower. Every step carries a monster's claw mark. {F} counts them, then stops counting.",
      "From the first window you can see the hall, the kitchen chimney, the library light. Proof.",
      "{W} pins a map to the wall and marks every battle won. The map is getting crowded.",
      "{K} sits on the highest ledge, surveying the kingdom. The kingdom is mostly rooftops and one pigeon.",
      "\"On the hard nights,\" {C} says, \"come up here and look back at how far the road goes.\"",
      "{R} hangs a lantern at the top so the party can always find the way home.",
      "The tower stands watch. Whatever comes next, Hearthkeep will see it coming."
    ] },
    { title: "The Great Hall", icon: "round-table", color: "#ffd27a", pages: [
      "The last locked room: the Great Hall. Dust sheets over a long table, chairs for many.",
      "{F} and {R} carry out the broken furniture. What's left is space, and space is a gift.",
      "{C} polishes the old silver until the candles have twins.",
      "{K} inspects every chair and approves exactly one. The head of the table, of course.",
      "{W} enchants the chandelier. It's mostly just light, but light is most of the magic.",
      "Invitations go out to everyone who ever said \"you can do this\".",
      "The feast is held: five plates, one cat bowl, many friends. Hearthkeep isn't just clean. It's shared."
    ] },
    { title: "Hearthkeep", icon: "family-house", color: "#e8604c", pages: [
      "The clutter-creatures gather one last time at the garden's edge. They look smaller than they used to.",
      "{F} doesn't draw a sword. Just opens the door wide and lets the light out. Several monsters reconsider.",
      "{K} yawns at the Clutter Troll. The Troll, deeply offended, leaves.",
      "{C} reminds everyone that the house was never the prize. The evenings were.",
      "{W} writes the whole story down, so it can be read again on some hard day.",
      "{R} hangs a key by the door. Anyone who lives here knows where it is.",
      "Hearthkeep is home. The monsters will come back, they always do. So will the party: every evening, one small thing at a time. The end of the first book."
    ] }
  ];
  const CHRONICLE = [
    "Another quiet victory. {K} marks it by sleeping in the sunniest spot in the house.",
    "{F} oils the hinges of the front door. It no longer creaks when the party comes home.",
    "{C} tries a new recipe. It's a success, mostly.",
    "{W} adds a new book to the library shelf, between two old friends.",
    "{R} finds a coin under the sofa and adds it to the feast fund.",
    "The garden bench still wobbles. Nobody will ever fix it.",
    "From the watchtower the lantern glows. Hearthkeep keeps."
  ];
  const SETBACK = [
    "A hard night. The {M} held its ground, but the party held together.",
    "The {M} won this one. Tomorrow the door opens again.",
    "Some nights the dust wins. The candle stays lit anyway.",
    "A stumble, not a fall. The story waits for its next page."
  ];
  function fill(t, names, monster) {
    return t.replace(/\{([FCWRKM])\}/g, (_, c) => c === "M" ? (monster || "monster") : (names[{ F: "fighter", C: "cleric", W: "wizard", R: "rogue", K: "familiar" }[c]] || ""));
  }
  // page n is the n-th won night, counting from 1
  function page(n, names, monster) {
    const total = CHAPTERS.length * 7;
    if (n <= total) {
      const ci = Math.floor((n - 1) / 7), pi = (n - 1) % 7, ch = CHAPTERS[ci];
      return { book: 1, chapter: ci + 1, title: ch.title, icon: ch.icon, color: ch.color, page: pi + 1, of: 7, last: pi === 6, text: fill(ch.pages[pi], names, monster), finale: n === total };
    }
    const m = n - total - 1, ci = Math.floor(m / 7), pi = m % 7;
    return { book: 2, chapter: ci + 1, title: "Chronicles of Hearthkeep", icon: "scroll-quill", color: "#b8c4d6", page: pi + 1, of: 7, last: pi === 6, text: fill(CHRONICLE[pi], names, monster), finale: false };
  }
  window.STORY = {
    prologue: names => fill(PROLOGUE, names),
    page,
    chapter: i => CHAPTERS[i],
    chapters: CHAPTERS.length,
    setback: (seed, names, monster) => fill(SETBACK[seed % SETBACK.length], names, monster)
  };
})();
