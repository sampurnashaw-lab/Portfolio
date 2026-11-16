/* =====================================================================
   EDIT HERE — add/remove/update projects by changing these arrays.
   Paste a Google Drive file URL for each video. Set each file to
   "Anyone with the link" / Viewer before publishing.
   ===================================================================== */
const showreel = { title: "Game Trailer", duration: "02:00", youtubeUrl: "https://youtu.be/H8NR0qaHdSM", description: "A glimpse into my creative world." };

const projects = [
  { title: "Cinematic Travel Film", category: "Cinematic", year: "2026", duration: "02:45", driveUrl: "PASTE_GOOGLE_DRIVE_LINK_HERE", description: "A cinematic travel film with professional color grading." },
  { title: "Brand Promotional Video", category: "Promotional", year: "2026", duration: "01:30", driveUrl: "PASTE_GOOGLE_DRIVE_LINK_HERE", description: "A promotional video designed to tell a brand story." },
  { title: "Vertical Reel Edit", category: "Reels & Shorts", year: "2026", duration: "00:30", driveUrl: "PASTE_GOOGLE_DRIVE_LINK_HERE", description: "Fast-paced vertical edit made for social feeds." },
  { title: "Short Documentary", category: "Documentary", year: "2025", duration: "08:10", driveUrl: "PASTE_GOOGLE_DRIVE_LINK_HERE", description: "Interview-driven documentary with archive footage." },
  { title: "AI Video", category: "AI Video", year: "2026", duration: "OPEN FOLDER", driveUrl: "https://drive.google.com/file/d/1oOtMczhDT3Mzmw9hygx3-YRCJ_QBZNIj/view?usp=sharing", description: "Generated content using artificial intelligence." },
  { title: "AI Video", category: "AI Video", year: "2026", duration: "OPEN FOLDER", driveUrl: "https://drive.google.com/file/d/1E7lf3Up38PcKJNxr63axvB6bd1-bOowj/view?usp=sharing", description: "Generated content using artificial intelligence." },
  { title: "Game Trailer", category: "Game Trailer", year: "2026", duration: "OPEN FOLDER", driveUrl: "https://drive.google.com/file/d/1x_P1HZRpoA_b-IhY8PhEExAeyaYfd_2w/view?usp=sharing", description: "Game Trailer." },
  { title: "Adobe Premiere Pro", category: "Adobe Premiere Pro", year: "2026", duration: "OPEN FOLDER", driveUrl: "https://drive.google.com/file/d/1vHMohaMY038IJmhIbVXA1zjMwr7MmOM2/view?usp=sharing", description: "Adobe Premiere Pro tutorial." },
  { title: "YouTube Channel Edit", category: "YouTube Videos", year: "2025", duration: "10:20", driveUrl: "PASTE_GOOGLE_DRIVE_LINK_HERE", description: "Retention-focused long-form edit." },
  { title: "Product Commercial", category: "Commercial", year: "2025", duration: "00:45", driveUrl: "PASTE_GOOGLE_DRIVE_LINK_HERE", description: "Sleek product spot with motion graphics." }
];

const testimonials = [ // SAMPLE CONTENT — replace with real client feedback
  { quote: "Sample testimonial: replace this with real feedback from a client.", name: "Client Name", role: "Designation, Company" },
  { quote: "Sample testimonial: describe the result, the process, or the experience.", name: "Client Name", role: "Designation, Company" },
  { quote: "Sample testimonial: keep it short, specific and honest.", name: "Client Name", role: "Designation, Company" }
];
const CONTACT_EMAIL = "hello@example.com"; // used by the mailto fallback

/* ========================== Google Drive helpers ========================== */
/** Returns the file ID from a Google Drive share URL, else null. */
function parseDrive(input) {
  if (!input) return null;
  const s = String(input).trim(), ID = /^[\w-]{20,}$/;
  if (ID.test(s)) return { id: s };
  try {
    const u = new URL(s.startsWith("http") ? s : "https://" + s);
    const match = u.pathname.match(/\/(file\/d|folders)\/([\w-]+)/);
    const id = match ? match[2] : u.searchParams.get("id");
    return id && ID.test(id) ? { id, folder: Boolean(match && match[1] === "folders") } : null;
  } catch { return null; }
}
const thumbUrl = id => `https://drive.google.com/thumbnail?id=${id}&sz=w1200`;
const embedUrl = id => `https://drive.google.com/file/d/${id}/preview`;
function parseYouTube(input) {
  if (!input) return null;
  try {
    const u = new URL(String(input).trim());
    const host = u.hostname.replace(/^(www|m)\./, "");
    const parts = u.pathname.split("/").filter(Boolean);
    const id = host === "youtu.be" ? parts[0] : u.searchParams.get("v") || (["embed", "shorts", "live"].includes(parts[0]) ? parts[1] : null);
    return id && /^[\w-]{11}$/.test(id) ? { id, short: parts[0] === "shorts" } : null;
  } catch { return null; }
}
const youtubeThumbUrl = id => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
const youtubeEmbedUrl = id => `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`;

/* ============================== Utilities ============================== */
const $ = (s, c = document) => c.querySelector(s), $$ = (s, c = document) => [...c.querySelectorAll(s)];
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const hasGsap = typeof gsap !== "undefined";
if (hasGsap && typeof ScrollTrigger !== "undefined") gsap.registerPlugin(ScrollTrigger);
const esc = t => String(t).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
function fallbackThumb(img) { // stylish fallback if a thumbnail fails to load
  const d = document.createElement("div"); d.className = "ph-fallback"; d.textContent = "▶ VIDEO"; img.replaceWith(d);
}

/* ============================== Portfolio ============================== */
const grid = $("#grid"), filters = $("#filters");
const cats = ["All Projects", "AI Video", "Game Trailer", "Promotional", "Reels & Shorts", "Documentary", "YouTube Videos", "Commercial", "Adobe Premiere Pro"];
filters.innerHTML = cats.map((c, i) => `<button role="tab" aria-selected="${i === 0}" class="${i === 0 ? "on" : ""}" data-cat="${esc(c)}">${esc(c)}</button>`).join("");

function renderProjects(cat = "All Projects") {
  const list = projects.filter(p => cat === "All Projects" || p.category === cat);
  grid.innerHTML = list.map(p => {
    const drive = parseDrive(p.driveUrl);
    const media = drive && !drive.folder ? `<img src="${thumbUrl(drive.id)}" alt="${esc(p.title)} thumbnail" loading="lazy">` : `<span class='ph-fallback'>${drive ? "OPEN DRIVE FOLDER" : "ADD DRIVE VIDEO"}</span>`;
    return `<button class="pcard" data-url="${esc(p.driveUrl)}" data-title="${esc(p.title)}" data-desc="${esc(p.description)}" aria-label="Play ${esc(p.title)}">
      ${media}
      <span class="shade"></span><span class="dur">${esc(p.duration)}</span>
      <span class="play"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></span>
      <span class="p-info"><h3>${esc(p.title)}</h3><p>${esc(p.category)} · ${esc(p.year)}</p><span class="view">View project</span></span></button>`;
  }).join("") || "<p class='sub'>No projects in this category yet.</p>";
  $$("img", grid).forEach(i => i.addEventListener("error", () => fallbackThumb(i)));
  if (hasGsap && !reduce) gsap.from(".pcard", { y: 40, opacity: 0, duration: .6, stagger: .08, ease: "power3.out", clearProps: "all" });
}
filters.addEventListener("click", e => {
  const b = e.target.closest("button"); if (!b) return;
  $$("button", filters).forEach(x => { x.classList.toggle("on", x === b); x.setAttribute("aria-selected", x === b); });
  renderProjects(b.dataset.cat);
});
renderProjects();

/* Showreel card */
{ const youtube = parseYouTube(showreel.youtubeUrl);
const img = $("#reelImg"); if (youtube) { img.src = youtubeThumbUrl(youtube.id); img.addEventListener("error", () => fallbackThumb(img)); } else fallbackThumb(img);
  $("#reelTitle").textContent = showreel.title; $("#reelDur").textContent = showreel.duration; }

/* ============================ Video modal ============================ */
const modal = $("#modal"), mVideo = $("#mVideo"); let lastFocus = null;
function openVideo(url, title, desc) {
  const drive = parseDrive(url), youtube = parseYouTube(url);
  if (!drive && !youtube) { console.warn("Add a valid Google Drive or YouTube URL for:", title); return; }
  if (youtube) {
    lastFocus = document.activeElement;
    mVideo.className = "m-video" + (youtube.short ? " vert" : "");
    mVideo.innerHTML = `<iframe src="${youtubeEmbedUrl(youtube.id)}" title="${esc(title)}" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>`;
    $("#mTitle").textContent = title; $("#mDesc").textContent = desc || "";
    modal.hidden = false; document.body.style.overflow = "hidden";
    requestAnimationFrame(() => modal.classList.add("open")); $(".m-close").focus();
    return;
  }
  if (drive.folder) { window.open(url, "_blank", "noopener,noreferrer"); return; }
  lastFocus = document.activeElement;
  mVideo.className = "m-video";
  mVideo.innerHTML = `<iframe src="${embedUrl(drive.id)}" title="${esc(title)}" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>`; // iframe created only on click
  $("#mTitle").textContent = title; $("#mDesc").textContent = desc || "";
  modal.hidden = false; document.body.style.overflow = "hidden";
  requestAnimationFrame(() => modal.classList.add("open")); $(".m-close").focus();
}
function closeVideo() {
  if (modal.hidden) return;
  modal.classList.remove("open");
  setTimeout(() => { modal.hidden = true; mVideo.innerHTML = ""; document.body.style.overflow = ""; lastFocus && lastFocus.focus(); }, reduce ? 0 : 350);
}
document.addEventListener("click", e => {
  const card = e.target.closest(".pcard"), reel = e.target.closest("[data-open=showreel]");
  if (card) openVideo(card.dataset.url, card.dataset.title, card.dataset.desc);
  else if (reel) openVideo(showreel.youtubeUrl, showreel.title, showreel.description);
  else if (e.target.closest("[data-close]")) closeVideo();
});
document.addEventListener("keydown", e => {
  if (e.key === "Escape") closeVideo();
  if (e.key === "Tab" && !modal.hidden) { // keep focus inside the modal
    const f = $$("button,iframe", modal); const a = f[0], z = f[f.length - 1];
    if (e.shiftKey && document.activeElement === a) { z.focus(); e.preventDefault(); }
    else if (!e.shiftKey && document.activeElement === z) { a.focus(); e.preventDefault(); }
  }
});

/* ============================ Testimonials ============================ */
const slides = $("#slides"); let si = 0;
slides.innerHTML = testimonials.map(t => `<div class="slide"><blockquote>“${esc(t.quote)}”</blockquote><div class="who"><span class="av">${esc(t.name[0])}</span><div>${esc(t.name)}<small>${esc(t.role)}</small></div></div></div>`).join("");
const go = n => { si = (n + testimonials.length) % testimonials.length; slides.style.transform = `translateX(-${si * 100}%)`; };
$("#prev").onclick = () => go(si - 1); $("#next").onclick = () => go(si + 1);

/* ============================ Navigation ============================ */
const nav = $("#nav"), menu = $("#menu"), menuBtn = $("#menuBtn"), toTop = $("#toTop");
menuBtn.onclick = () => { const o = menu.classList.toggle("open"); menuBtn.setAttribute("aria-expanded", o); };
$$("a", menu).forEach(a => a.addEventListener("click", () => { menu.classList.remove("open"); menuBtn.setAttribute("aria-expanded", false); }));
addEventListener("scroll", () => { nav.classList.toggle("solid", scrollY > 60); toTop.classList.toggle("show", scrollY > 700); }, { passive: true });
toTop.onclick = () => scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
const spy = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) $$("a", menu).forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id));
}), { rootMargin: "-45% 0px -50% 0px" });
$$("section[id]").forEach(s => spy.observe(s));
$("#year").textContent = new Date().getFullYear();
if (window.lucide) lucide.createIcons();

/* ============================ Contact form ============================ */
$("#form").addEventListener("submit", e => {
  e.preventDefault();
  const f = e.target, msg = $("#formMsg"); let ok = true;
  $$("input,select,textarea", f).forEach(el => { const bad = !el.value.trim() || (el.type === "email" && !/^\S+@\S+\.\S+$/.test(el.value)); el.classList.toggle("bad", bad); if (bad) ok = false; });
  msg.className = ""; if (!ok) { msg.textContent = "Please fill in every field with valid details."; return; }
  // No backend: opens the visitor's email app. To use a form service later, post FormData to e.g. Formspree here.
  const d = new FormData(f);
  location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Project enquiry: " + d.get("type"))}&body=${encodeURIComponent(`Name: ${d.get("name")}\nEmail: ${d.get("email")}\n\n${d.get("message")}`)}`;
  msg.className = "ok"; msg.textContent = "Your email app should open with the message ready to send.";
});

/* ============================ Animations ============================ */
function initMotion() {
  if (!hasGsap || reduce) { $$("[data-count]").forEach(c => c.textContent = c.dataset.count + (c.dataset.suffix || "")); return; }
  const ST = typeof ScrollTrigger !== "undefined"; if (!ST) return;
  gsap.utils.toArray(".rv").forEach(el => gsap.from(el, { y: 40, opacity: 0, duration: .9, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 88%", once: true } }));
  gsap.from(".step", { x: -30, opacity: 0, stagger: .2, duration: .8, scrollTrigger: { trigger: ".steps", start: "top 80%", once: true } });
  $$("[data-count]").forEach(c => { const o = { v: 0 }, t = +c.dataset.count;
    ScrollTrigger.create({ trigger: c, start: "top 90%", once: true, onEnter: () => gsap.to(o, { v: t, duration: 1.8, ease: "power2.out", onUpdate: () => c.textContent = Math.round(o.v) + (c.dataset.suffix || "") }) }); });
  $$(".parallax").forEach(el => gsap.to(el, { yPercent: 12, ease: "none", scrollTrigger: { trigger: el.parentElement, start: "top top", end: "bottom top", scrub: true } }));
  if (matchMedia("(hover:hover)").matches) $$(".magnetic").forEach(b => { // subtle magnetic hover
    b.addEventListener("mousemove", e => { const r = b.getBoundingClientRect(); gsap.to(b, { x: (e.clientX - r.left - r.width / 2) * .25, y: (e.clientY - r.top - r.height / 2) * .35, duration: .3 }); });
    b.addEventListener("mouseleave", () => gsap.to(b, { x: 0, y: 0, duration: .5, ease: "elastic.out(1,.4)" })); });
}
function heroIn() {
  if (!hasGsap || reduce) return;
  gsap.from(".hero-title .line > span", { yPercent: 110, duration: 1.1, stagger: .18, ease: "power4.out" });
  gsap.from(".hero .rv", { y: 24, opacity: 0, duration: .9, stagger: .15, delay: .5 });
}

/* ============================ Preloader ============================ */
const pre = $("#preloader"); let finished = false;
function finish() { // always reveals the page; safe to call more than once
  if (finished) return; finished = true;
  const done = () => { pre.remove(); document.body.classList.remove("loading"); sessionStorage.setItem("introSeen", "1"); heroIn(); initMotion(); };
  if (hasGsap && !reduce) gsap.to(pre, { clipPath: "inset(0 0 100% 0)", duration: .9, ease: "power4.inOut", onComplete: done }); else done();
}
if (sessionStorage.getItem("introSeen") || reduce || !hasGsap) { finished = true; pre.remove(); document.body.classList.remove("loading"); heroIn(); initMotion(); }
else {
  const tl = gsap.timeline({ onComplete: finish });
  gsap.set(".pre-logo", { opacity: 0, filter: "blur(14px)", scale: 1.15, letterSpacing: ".4em" });
  tl.to(".pre-logo", { opacity: 1, filter: "blur(0px)", scale: 1, letterSpacing: ".08em", duration: 1.1, ease: "power3.out" })
    .to(".pre-tag", { opacity: 1, duration: .6 }, .7)
    .to("#barFill", { width: "100%", duration: 2, ease: "power1.inOut" }, .5)
    .to(".frames i", { x: innerWidth + 240, duration: 2.4, stagger: .18, ease: "none" }, 0)
    .to(".pre-center", { opacity: 0, scale: .96, filter: "blur(6px)", duration: .4 }, "+=.1");
  $("#skipIntro").onclick = () => { tl.kill(); finish(); };
  setTimeout(finish, 6000); // safety net: never get stuck
}
