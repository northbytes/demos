const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const isPhone = matchMedia("(max-width: 40rem)").matches;
const video = document.getElementById("scene");
const scrolly = document.querySelector(".scrolly");

/* --- Video: scroll-scrubbed everywhere, poster on reduced motion --- */
if (reduceMotion) {
  video.removeAttribute("src"); // poster only
  video.load();
} else {
  if (isPhone) video.src = "assets/scene-mobile.mp4"; // same film, smaller encode
  // Continuous rAF loop easing currentTime toward the scroll target:
  // smoother than seeking on scroll events, which fire in coarse bursts
  // (worst during iOS momentum scrolling).
  const tick = () => {
    const max = scrolly.offsetHeight - innerHeight;
    const p = Math.min(Math.max(scrollY / max, 0), 1);
    if (video.readyState >= 1 && video.duration) {
      const diff = p * video.duration - video.currentTime;
      if (Math.abs(diff) > 0.01 && !video.seeking) {
        video.currentTime += diff * 0.15;
      }
    }
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

/* --- Panel entrances + nav goes solid over paper sections --- */
const io = new IntersectionObserver(
  (entries) => entries.forEach((e) => e.target.classList.toggle("in-view", e.isIntersecting)),
  { threshold: 0.35 }
);
document.querySelectorAll(".panel").forEach((p) => io.observe(p));

const nav = document.getElementById("nav");
new IntersectionObserver(
  ([e]) => nav.classList.toggle("nav--solid", e.isIntersecting),
  { rootMargin: "-80px 0px 0px 0px" }
).observe(document.getElementById("paper"));

/* --- Quote form (demo — no backend) --- */
const form = document.getElementById("quote-form");
const done = form.querySelector(".form__done");
const error = form.querySelector(".form__error");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const fields = [...form.querySelectorAll("input, textarea")];
  const missing = fields.filter((f) => !f.value.trim());
  fields.forEach((f) => f.setAttribute("aria-invalid", String(!f.value.trim())));
  error.hidden = missing.length === 0;
  if (missing.length) { missing[0].focus(); return; }
  form.querySelector("button").disabled = true;
  done.hidden = false; // ponytail: demo site, no backend — wire a real endpoint here
});
