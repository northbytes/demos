/* Redwood Tree & Land Services — nav, chaptered scroll reel, reveal, forms. */
(function () {
  "use strict";

  var reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ── Nav ──────────────────────────────────────────────────────────── */
  var here = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav__links a").forEach(function (a) {
    if (a.getAttribute("href") === here) a.setAttribute("aria-current", "page");
  });

  var burger = document.querySelector(".burger");
  var nav = document.getElementById("nav");
  if (burger && nav) {
    burger.addEventListener("click", function () {
      var open = burger.getAttribute("aria-expanded") === "true";
      burger.setAttribute("aria-expanded", String(!open));
      nav.classList.toggle("open", !open);
    });
  }

  /* Header goes opaque once you're off the hero, so the logo and links keep
     their contrast against whatever frame of the film is behind them. */
  var head = document.getElementById("head");
  if (head) {
    var solid = function () {
      head.dataset.solid = String(window.scrollY > 40);
    };
    solid();
    addEventListener("scroll", solid, { passive: true });
  }

  /* ── The reel ──────────────────────────────────────────────────────────
     One sticky video behind five chapters of copy. Scroll position across the
     reel maps linearly onto the film's timeline, so chapter i always lands on
     stage i of the job: chapter 1 talks about crown work while the film is on
     the crown work, and so on.

     Chapter i is centred at progress i/(n-1) because every chapter is exactly
     one viewport tall — which is also why the rail can scroll to a chapter by
     plain arithmetic instead of measuring each one. */
  var CHAPTERS = ["The problem", "Crown work", "Felling", "Stump", "Cleared"];

  /* Where each chapter's stage sits in the film, as a fraction of its duration.
     The clips are deliberately NOT equal length — the felling clip runs 10s
     against 5s for the others, because taking a whole trunk down needs the extra
     frames or the model morphs the trunk instead of cutting it. So this is an
     explicit table rather than an even division. Fractions, not seconds, so a
     re-encode that shifts the duration slightly can't desync the chapters.
     Scroll distance per chapter stays equal; only the rate within one differs. */
  var CHAPTER_AT = [0, 0.2, 0.4, 0.8, 1];

  var reel = document.getElementById("reel");
  var film = document.getElementById("film");
  var rail = document.getElementById("rail");
  var sections = reel ? reel.querySelectorAll(".chapter") : [];

  if (reel && film && sections.length) {
    var last = sections.length - 1;
    var active = -1;
    var pendingSeek = null;
    var rafId = 0;
    var primed = false;

    /* Rail */
    var railBtns = [];
    if (rail) {
      CHAPTERS.forEach(function (name, i) {
        var li = document.createElement("li");
        var b = document.createElement("button");
        b.type = "button";
        b.innerHTML = '<span class="rail__txt"></span><span class="rail__dot"></span>';
        b.querySelector(".rail__txt").textContent = name;
        b.setAttribute("aria-label", "Chapter " + (i + 1) + ": " + name);
        b.addEventListener("click", function () { scrollToChapter(i); });
        li.appendChild(b);
        rail.appendChild(li);
        railBtns.push(b);
      });
    }

    function range() {
      // How far you can scroll while the film is pinned.
      return Math.max(1, reel.offsetHeight - innerHeight);
    }

    function scrollToChapter(i) {
      var top = reel.offsetTop + (i / last) * range();
      scrollTo({ top: top, behavior: reduced ? "auto" : "smooth" });
    }

    function duration() {
      var d = film.duration;
      return (typeof d === "number" && isFinite(d) && d > 0) ? d : 0;
    }

    /* Scroll progress -> position in the film, piecewise-linear through
       CHAPTER_AT so every chapter lands exactly on its own stage. */
    function filmFraction(p) {
      var seg = Math.min(Math.max(p, 0), 1) * last;
      var i = Math.min(Math.floor(seg), last - 1);
      return CHAPTER_AT[i] + (CHAPTER_AT[i + 1] - CHAPTER_AT[i]) * (seg - i);
    }

    /* Seeking on every scroll event floods the decoder and the picture stalls.
       Coalesce to at most one seek per animation frame. */
    function seek(fraction) {
      var d = duration();
      if (!d) return;
      var t = Math.min(Math.max(fraction, 0), 1) * d;
      // Never land exactly on the duration — that blanks the final frame.
      if (t > d - 0.05) t = d - 0.05;
      pendingSeek = t;
      if (rafId) return;
      rafId = requestAnimationFrame(function () {
        rafId = 0;
        if (pendingSeek === null) return;
        if (film.seeking) { seek(pendingSeek / duration()); return; }
        film.currentTime = pendingSeek;
        pendingSeek = null;
      });
    }

    /* iOS refuses to paint a frame of a video that has never played, so the
       film sits black until the first seek is preceded by a play/pause. */
    function prime() {
      if (primed) return;
      primed = true;
      var p = film.play();
      if (p && p.then) p.then(function () { film.pause(); }).catch(function () {});
      else film.pause();
    }

    function setActive(i) {
      if (i === active) return;
      active = i;
      sections.forEach(function (s, n) { s.dataset.live = String(n === i); });
      railBtns.forEach(function (b, n) { b.setAttribute("aria-current", String(n === i)); });
      // Reduced motion: cut to the chapter's frame instead of scrubbing to it.
      if (reduced) seek(CHAPTER_AT[i]);
    }

    var ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        ticking = false;
        var top = reel.getBoundingClientRect().top;
        var p = Math.min(Math.max(-top / range(), 0), 1);
        reel.dataset.progressPast = String(p > 0.02);
        setActive(Math.round(p * last));
        if (!reduced) { prime(); seek(filmFraction(p)); }
      });
    }

    film.addEventListener("loadedmetadata", onScroll);
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    onScroll();
    setActive(0);

    /* If the file never arrives, the poster stays and the copy still reads —
       so say so in the console rather than failing silently. */
    film.addEventListener("error", function () {
      console.warn("[redwood] transform.mp4 failed to load — poster fallback in use.");
    });
  }

  /* ── Reveal ───────────────────────────────────────────────────────── */
  var revealables = document.querySelectorAll("[data-reveal]");
  if (reduced) {
    revealables.forEach(function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    revealables.forEach(function (el) { io.observe(el); });
  }

  /* ── Gallery filter ───────────────────────────────────────────────── */
  var filters = document.querySelectorAll(".filter");
  if (filters.length) {
    var shots = document.querySelectorAll(".shots .shot");
    filters.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var want = btn.dataset.filter;
        filters.forEach(function (b) { b.setAttribute("aria-pressed", String(b === btn)); });
        shots.forEach(function (s) {
          s.hidden = want !== "all" && (s.dataset.tags || "").indexOf(want) === -1;
        });
      });
    });
  }

  /* ── Enquiry form — validates for real, sends nothing ─────────────── */
  var form = document.querySelector("form[data-demo]");
  if (form) {
    var status = form.querySelector(".formstatus");
    var submit = form.querySelector('button[type="submit"]');

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = true;

      form.querySelectorAll("[required]").forEach(function (input) {
        var field = input.closest(".field");
        if (!field) return;
        var err = field.querySelector(".err");
        var valid = input.checkValidity();
        field.dataset.state = valid ? "success" : "error";
        if (err) err.textContent = valid ? "" : (input.validationMessage || "Please complete this field.");
        if (!valid && ok) { input.focus(); ok = false; }
      });

      if (!ok) {
        status.dataset.state = "error";
        status.textContent = "Please check the highlighted fields.";
        return;
      }

      submit.dataset.state = "loading";
      submit.disabled = true;
      status.dataset.state = "";
      status.textContent = "";

      setTimeout(function () {
        submit.dataset.state = "";
        submit.disabled = false;
        status.dataset.state = "success";
        status.textContent = "Thanks — this is a demo build, so nothing was sent. On the live site this would reach info@redwoodtreeandland.co.uk.";
      }, 700);
    });
  }
})();
