const $ = (s, e = document) => e.querySelector(s);

/* ---------- Content ---------- */
const S = [
  { k: "t-violet", emoji: "🎨", tab: "Yibo’s Session", tag: "Part 1",
    title: "Vibe Coding & Claude Tools",
    intro: "Describe what you want, let Claude build it, then refine. Good prompts and a basic map of web files make that loop fast.",
    cards: [
      ["🎭", "Role", "Tell Claude who to be: “You’re a front-end developer.”"],
      ["🎯", "Goal", "Name the one job to finish: “Build a one-page club site.”"],
      ["👥", "Audience", "Say who it’s for so tone and level fit: “first-year students.”"],
      ["📦", "Output", "Ask for the format you want back: “three files, no extra chatter.”"],
      ["🛠️", "Claude Design & Claude Code", "Claude Design explores the look and layout visually. Claude Code writes and edits the real files in your project."],
      ["🌐", "Web essentials", "index.html is the structure, styles.css is the look, script.js is the behavior."]
    ] },
  { k: "t-sun", emoji: "🚀", tab: "Nirvan’s Session", tag: "Part 2",
    title: "Git, GitHub & Vercel",
    intro: "Version control keeps every change safe, and Vercel turns each merged change into a live website automatically.",
    cards: [
      ["🍴", "Fork", "Copy someone’s repo into your own GitHub account."],
      ["📥", "Clone", "Download your repo to your computer to work on it."],
      ["💾", "Commit", "Save a snapshot of your changes with a short message."],
      ["⬆️", "Push", "Send your commits from your computer up to GitHub."],
      ["🔀", "Pull Request", "Ask the project to merge your changes after a review."],
      ["▲", "Vercel hosting", "Connect the repo once. Every merge rebuilds and publishes your site."]
    ] },
  { k: "t-mint", emoji: "🔐", tab: "Rishabh’s Session", tag: "Part 3",
    title: "Backend, Auth & Supabase",
    intro: "A page alone can’t remember anything. A backend stores data and knows who each visitor is.",
    cards: [
      ["🧠", "Why websites forget", "Variables live in the browser tab. Refresh and they’re gone. Lasting data needs a database."],
      ["🎫", "Signup, login, tokens", "Signup creates a user. Login proves who you are and returns a token your app attaches to later requests."],
      ["🗄️", "Supabase", "Hosted Postgres database plus built-in auth. Row Level Security decides who may read or write each row."]
    ] },
  { k: "t-green", emoji: "🤖", tab: "Nick’s Session", tag: "Part 4",
    title: "Building an AI Marketing Team",
    intro: "Instead of one giant prompt, split the work across specialist agents that hand off to each other. Nick built a lite agentic team in Claude for a fictional Louis Vuitton handbag called Terra.",
    cards: [
      ["📰", "Why now", "Companies are shifting work toward AI, and agency groups are merging their creative units. Marketers who can run an AI team stand out."],
      ["📝", "Brief Writer", "Drafts the brief from Project context: goal, audience, budget, message, metric."],
      ["🔍", "Brief Validator", "Works in a new chat with fresh eyes. Checks objective and audience, then returns a verdict and top fixes."],
      ["🧭", "Strategist", "Digests the validated brief, shapes the Big Idea and writes a one-pager."],
      ["🎨", "Designer / Art Director", "Creates key visuals (KVs) with connectors such as Higgsfield, from concepts and assets."],
      ["✍️", "Copywriter", "Builds the messaging hierarchy and adapts it per channel and platform."],
      ["✅", "Reviewer", "Checks the work against brand voice, confirms it matches the brief and Big Idea, then signs off."],
      ["🧰", "Claude setup", "Skills hold each role’s instructions. A Project holds the knowledge base. An email trigger or a scheduled task starts the Brief Builder automatically."],
      ["🧑‍⚖️", "You stay in charge", "You approve each stage and save it to the knowledge base. A Creative Score even rated the Instagram options against BBH, Ogilvy and McCann standards."]
    ] }
];

/* ---------- Tabs ---------- */
S.forEach((s, i) => {
  $("#nav").insertAdjacentHTML("beforeend", `<button role="tab" id="tab${i}" aria-controls="p${i}" class="tab ${s.k}">${s.emoji} ${s.tab}</button>`);
  $("#main").insertAdjacentHTML("beforeend", `<section id="p${i}" role="tabpanel" aria-labelledby="tab${i}" class="panel ${s.k}">
    <span class="pill">${s.tag}</span>
    <h2 class="text-3xl sm:text-5xl font-extrabold mt-3">${s.title}</h2>
    <p class="mt-2 max-w-2xl text-lg opacity-80">${s.intro}</p>
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-6">${s.cards.map(c => `<div class="card p-4"><span class="ico">${c[0]}</span><h3 class="font-bold text-lg mt-2">${c[1]}</h3><p class="opacity-80">${c[2]}</p></div>`).join("")}</div>
    <h3 class="text-2xl font-bold mt-10 mb-3">🎮 Mini-games</h3>
    <div id="g${i}" class="space-y-6"></div></section>`);
  $("#tab" + i).onclick = () => show(i);
});
function show(i) {
  S.forEach((_, j) => {
    $("#p" + j).classList.toggle("on", i === j);
    $("#tab" + j).setAttribute("aria-selected", i === j);
  });
  history.replaceState(null, "", "#t" + (i + 1));
  scrollTo({ top: 0 });
}
const mount = (g, id) => { $("#g" + g).insertAdjacentHTML("beforeend", `<div id="${id}"></div>`); return $("#" + id); };

/* ---------- Quiz engine (used by games 1 and 3) ---------- */
function quiz(el, o) {
  let n = 0, sc = 0;
  const len = o.items.length;
  const draw = () => {
    if (n >= len) {
      el.innerHTML = `<div class="card p-6 text-center"><div class="text-5xl">${sc === len ? "🏆" : "⭐"}</div><p class="disp text-2xl font-bold mt-2">${sc}/${len} on the first try</p><p class="opacity-70 mt-1">${o.end}</p><button class="btn solid mt-4" id="rs">Play again</button></div>`;
      $("#rs", el).onclick = () => { n = sc = 0; o.reset && o.reset(); draw(); };
      return;
    }
    const it = o.items[n]; let done = false, tried = false;
    el.innerHTML = `<div class="card p-5 sm:p-6"><p class="font-bold" style="color:var(--ac)">${o.name}</p>
      <div class="flex justify-between text-sm font-semibold opacity-70"><span>${o.label} ${n + 1} of ${len}</span><span>Score ${sc}</span></div>
      <p class="disp text-xl sm:text-2xl font-bold my-3">${it.q}</p>
      <div class="grid gap-3 ${o.cols || ""}">${it.o.map((t, i) => `<button class="btn text-left ${o.mono ? "font-mono text-sm" : ""}" data-i="${i}">${t}</button>`).join("")}</div>
      <div class="fb mt-4" aria-live="polite"></div></div>`;
    const fb = $(".fb", el);
    el.querySelectorAll("[data-i]").forEach(b => b.onclick = () => {
      if (done) return;
      if (+b.dataset.i === it.a) {
        done = true; if (!tried) sc++;
        b.classList.add("ok"); o.fx && o.fx(n);
        fb.innerHTML = `<p class="font-semibold">✅ ${it.w}</p><button class="btn solid mt-3" id="nx">${n + 1 === len ? "See score" : "Next"}</button>`;
        $("#nx", el).onclick = () => { n++; draw(); };
      } else {
        tried = true; b.classList.add("bad"); b.disabled = true;
        fb.innerHTML = `<p class="font-semibold">🤔 Not quite. Try another one.</p>`;
      }
    });
  };
  draw();
}

/* ---------- Game 1: Prompt Doctor + Code Matcher ---------- */
const P = "Which prompt would get a better result from Claude?";
quiz(mount(0, "g0a"), { name: "Prompt Doctor", label: "Patient", end: "A good prompt covers Role, Goal, Audience and Output.", cols: "md:grid-cols-2",
  items: [
    { q: P, a: 1, o: ["Make a website for my club.", "You’re a front-end developer. Build a one-page site for the Photography Club to recruit members. Audience: first-year students. Output: index.html, styles.css, script.js."], w: "It has all four: Role, Goal, Audience and Output." },
    { q: P, a: 0, o: ["You’re a UX designer. Design a login screen for a campus food app used by busy students. Output: three layout options as a short list.", "Design something cool and modern, make it good, thanks!"], w: "“Cool and modern” gives Claude nothing to aim at. The first prompt is specific." },
    { q: P, a: 1, o: ["Fix my code.", "You’re a senior JavaScript reviewer. The delete button in my to-do app does nothing. Explain the bug for a beginner, then show only the fixed function."], w: "It names the problem, the audience and the output format." },
    { q: P, a: 0, o: ["You’re a patient tutor. Explain commit vs push to a first-year student with a pizza-delivery analogy. Output: 5 bullets maximum.", "Write everything about Git."], w: "Limits on audience and length make the answer usable." }
  ] });
const F = ["index.html", "styles.css", "script.js"];
quiz(mount(0, "g0b"), { name: "Code Matcher", label: "Clue", end: "Structure, style, behavior: three files, three jobs.", cols: "sm:grid-cols-3", mono: true,
  items: [
    ["Holds the headings, buttons and text on the page", 0, "HTML is the structure."],
    ["Sets colors, fonts and spacing", 1, "CSS handles the look."],
    ["Makes the quiz react when you click a button", 2, "JavaScript adds behavior."],
    ["The first file a browser opens for your site", 0, "Browsers look for index.html by default."],
    ["Switches the layout to one column on phones", 1, "Responsive layout rules live in CSS."],
    ["Counts the score and updates it on screen", 2, "Logic and live updates are JavaScript."]
  ].map(([q, a, w]) => ({ q, a, w, o: F })) });

/* ---------- Game 2: Git workflow drag-and-drop ---------- */
function seqGame(el, cfg) {
  const { ST, shuffled } = cfg;
  const N = ST.length;
  let seq = [], res = null, msg = "";
  const chip = id => `<div class="btn chip" draggable="true" tabindex="0" data-id="${id}">${ST[id][0]} <b>${ST[id][1]}</b><small class="block opacity-70">${ST[id][2]}</small></div>`;
  const draw = () => {
    el.innerHTML = `<div class="card p-5"><p class="font-bold" style="color:var(--ac)">${cfg.name}</p>
      <p class="font-semibold my-2">${cfg.prompt} Drag them, or tap to add. Tap a placed step to remove it.</p>
      <div id="pool" class="flex flex-wrap gap-3 mb-5 min-h-[4rem] p-2 rounded-xl border-2 border-dashed border-[#1e1b3b]">${shuffled.filter(i => !seq.includes(i)).map(chip).join("") || "<span class='opacity-60 p-2'>All steps placed. Check your order.</span>"}</div>
      <ol class="grid gap-2">${ST.map((_, i) => `<li class="slot ${res ? (res[i] ? "ok" : "bad") : ""}" data-s="${i}"><span class="num">${i + 1}</span>${seq[i] !== undefined ? chip(seq[i]) : "<span class='opacity-60'>Drop step here</span>"}</li>`).join("")}</ol>
      <div class="mt-4 flex gap-3 flex-wrap items-center"><button class="btn solid" id="ck">Check order</button><button class="btn" id="rs">Reset</button><span class="font-semibold" aria-live="polite">${msg}</span></div></div>`;
    const set = (s, m) => { seq = s; res = null; msg = m || ""; draw(); };
    el.querySelectorAll(".chip").forEach(c => {
      const id = +c.dataset.id, toggle = () => set(seq.includes(id) ? seq.filter(x => x !== id) : [...seq, id]);
      c.onclick = toggle;
      c.onkeydown = e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); } };
      c.ondragstart = e => e.dataTransfer.setData("text/plain", id);
    });
    el.querySelectorAll(".slot").forEach(s => {
      s.ondragover = e => { e.preventDefault(); s.classList.add("over"); };
      s.ondragleave = () => s.classList.remove("over");
      s.ondrop = e => {
        e.preventDefault();
        const id = +e.dataTransfer.getData("text/plain"), rest = seq.filter(x => x !== id);
        rest.splice(Math.min(+s.dataset.s, rest.length), 0, id); set(rest);
      };
    });
    $("#pool", el).ondragover = e => e.preventDefault();
    $("#pool", el).ondrop = e => set(seq.filter(x => x !== +e.dataTransfer.getData("text/plain")));
    $("#rs", el).onclick = () => set([]);
    $("#ck", el).onclick = () => {
      if (seq.length < N) { msg = "Place all " + N + " steps first."; return draw(); }
      res = seq.map((id, i) => id === i);
      const n = res.filter(Boolean).length;
      msg = n === N ? cfg.win : `${n}/${N} in the right spot. ${cfg.hint}`;
      draw();
    };
  };
  draw();
}
seqGame(mount(1, "g1"), {
  name: "Git Workflow Drag-and-Drop",
  prompt: "Put the steps in order, from a fresh fork to a live site.",
  win: "🎉 Perfect! Merging triggers Vercel to rebuild and publish with no manual step.",
  hint: "Hint: you can’t push what you haven’t committed.",
  shuffled: [3, 0, 5, 2, 4, 1],
  ST: [
    ["🍴", "Fork the repo", "Copy it to your GitHub"], ["📥", "git clone", "Download it to your computer"],
    ["💾", "git commit", "Save a snapshot"], ["⬆️", "git push", "Send commits to GitHub"],
    ["🔀", "Open a Pull Request", "Ask to merge"], ["▲", "Merge and auto-deploy", "Vercel publishes the site"]
  ]
});

seqGame(mount(3, "g3a"), {
  name: "Handoff Chain: Build the AI Team",
  prompt: "Put Nick’s marketing workflow in order, from the first draft to the final sign-off.",
  win: "🎉 Perfect! Each agent hands off to the next, and a human approves in the middle.",
  hint: "Hint: validate the brief before strategy starts, and review the work last.",
  shuffled: [4, 1, 5, 0, 3, 2],
  ST: [
    ["📝", "Brief Writer", "Drafts the brief from Project context"],
    ["🔍", "Brief Validator", "New chat, fresh eyes"],
    ["🧭", "Strategist", "Digests the brief, shapes the Big Idea"],
    ["🧑‍⚖️", "You approve", "Save to the knowledge base"],
    ["🎨", "Designer + Copywriter", "KVs via Higgsfield, plus channel messaging"],
    ["✅", "Reviewer", "Checks brand voice and signs off"]
  ]
});


/* ---------- Game 3: Auth & database simulator ---------- */
(function authSim(el) {
  const base = { b: "Logged out. No token.", a: "No users yet.", d: "notes table: empty" };
  let st = { ...base };
  const box = (ic, t, k) => `<div class="card p-4"><b>${ic} ${t}</b><p class="state mt-2" id="st-${k}"></p></div>`;
  el.innerHTML = `<p class="font-bold" style="color:var(--ac)">Auth & Database Simulator: Campus Notes app</p>
    <div class="grid sm:grid-cols-3 gap-3 my-3">${box("🧑‍💻", "Browser", "b")}${box("🔐", "Supabase Auth", "a")}${box("🗄️", "Database", "d")}</div><div id="q"></div>`;
  const paint = () => ["b", "a", "d"].forEach(k => $("#st-" + k, el).textContent = st[k]);
  const fx = [
    () => st.a = "1 user created. Password stored hashed 🔒",
    () => st.b = "Token: eyJhbGciOi… (expires in 1h)",
    () => st.b = "Token saved in browser storage ✓ survives refresh",
    () => st.d = "notes: 1 row, owner = your user id",
    () => st.d += " | RLS on: strangers blocked 🛡️",
    () => st.b = "Logged out. Token deleted."
  ];
  paint();
  quiz($("#q", el), { name: "Scenario", label: "Step", end: "Signup creates a user, login returns a token, and every request carries it.", cols: "",
    reset: () => { st = { ...base }; paint(); }, fx: n => { fx[n](); paint(); },
    items: [
      { q: "You sign up with email and password. What should the app do?", a: 0, o: ["Send them to Supabase Auth, which creates the user and hashes the password", "Save the password in script.js", "Put the password in the page’s HTML"], w: "Passwords never belong in front-end code. Auth stores only a hash." },
      { q: "You log in. What does Supabase send back?", a: 1, o: ["Your password", "A session token (JWT) that proves who you are", "Nothing, the browser just remembers"], w: "The token is your temporary ID badge." },
      { q: "You refresh the page and its variables reset. How does the app still know you?", a: 2, o: ["It asks you to log in on every click", "It guesses from your IP address", "The Supabase client keeps the token in browser storage and reloads it"], w: "That’s why you stay logged in after a refresh." },
      { q: "You save a note. What must the database request include?", a: 1, o: ["Your password again", "The token, so Supabase knows which user owns the row", "Nothing, anyone can write"], w: "The token lets the database tag the row with your user id." },
      { q: "A stranger with no token tries to read your notes. With Row Level Security on, what happens?", a: 0, o: ["The request is blocked", "They see every note", "They see only the newest note"], w: "RLS rules run inside the database, so the front end can’t bypass them." },
      { q: "You click Log out. What happens to the token?", a: 2, o: ["It lives forever", "It moves to the database", "It’s deleted, so the app forgets you"], w: "No token means no access. You’d log in again to get a new one." }
    ] });
})(mount(2, "g2"));

/* ---------- Game 4b/4c: Role Matcher + Claude Setup quiz ---------- */
const R = ["Brief Writer", "Brief Validator", "Strategist", "Designer", "Copywriter", "Reviewer"];
quiz(mount(3, "g3b"), { name: "Who Does What?", label: "Task", end: "Specialist agents keep each job small and checkable.", cols: "sm:grid-cols-2 lg:grid-cols-3",
  items: [
    ["Drafts the brief from Project context: goal, audience, budget, message, metric", 0, "The Brief Writer starts the chain."],
    ["Critiques the brief in a new chat and returns a verdict and top fixes", 1, "A fresh chat gives it fresh eyes, so it isn’t biased by the drafting."],
    ["Delivers the Big Idea one-pager", 2, "The Strategist turns the validated brief into the Big Idea."],
    ["Creates the key visuals with a connector like Higgsfield", 3, "The Designer / Art Director makes the KVs."],
    ["Builds the messaging hierarchy and adapts it per channel", 4, "The Copywriter writes channel-by-channel copy."],
    ["Checks everything against brand voice and gives sign-off", 5, "The Reviewer closes the loop."]
  ].map(([q, a, w]) => ({ q, a, w, o: R })) });
quiz(mount(3, "g3c"), { name: "Claude Setup", label: "Question", end: "Skills, Projects and triggers turn one chat into a repeatable team.", cols: "",
  items: [
    { q: "Where do you store each agent’s reusable instructions, like Marketing Brief Builder?", a: 1, o: ["In your browser bookmarks", "As a Skill in Claude’s settings", "In the footer of each email"], w: "A Skill packages instructions so the same role behaves the same way every time." },
    { q: "Where do the approved brief, research and strategy live so later agents can use them?", a: 0, o: ["In the Project’s knowledge base", "Only in your memory", "On a sticky note"], w: "Saving approved work to the Project gives every agent shared context." },
    { q: "You want the Brief Builder to run every day at a set time without you opening Claude. What do you set up?", a: 2, o: ["A longer prompt", "A new Skill", "A scheduled task"], w: "A scheduled task, like Marketing Brief Builder running daily, starts the work for you." },
    { q: "You email a brief to your inbox and want Claude to pick it up and respond. What is this called in the session?", a: 1, o: ["Prompt injection", "The email trigger", "A fork"], w: "The email trigger starts the Brief Builder from the email’s contents." },
    { q: "Creative Score rated the Instagram story options. What was the human’s job?", a: 2, o: ["Nothing, the AI decides", "Only to post the result", "Judge the results, approve and decide what ships"], w: "Agents prepare and critique. You stay the decision maker." }
  ] });

show(Math.min(S.length - 1, Math.max(0, (parseInt(location.hash.slice(2)) || 1) - 1)));
