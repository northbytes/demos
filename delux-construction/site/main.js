/* Delux Construction — nav, hero scrub, portfolio filter, quote form. */
(function () {
  "use strict";

  var reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Mark the current page in both navs. */
  var here = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll('.slab__links a, .slab__menu a').forEach(function (a) {
    if (a.getAttribute("href") === here) a.setAttribute("aria-current", "page");
  });

  /* Burger */
  var burger = document.querySelector(".burger");
  var menu = document.getElementById("menu");
  if (burger && menu) {
    burger.addEventListener("click", function () {
      var open = burger.getAttribute("aria-expanded") === "true";
      burger.setAttribute("aria-expanded", String(!open));
      menu.classList.toggle("open", !open);
    });
  }

  /* ── Hero scrub ────────────────────────────────────────────────────
     Five stages, four clips. Stage i sits at i/(n-1) of the runtime, so
     dragging the rail scrubs the build rather than playing it.
     ponytail: no scroll-pinning here — the Hartwood demo already does that,
     and a drag rail states "you control it" more directly than scroll does. */
  var STAGES = [
    { name: "Before", note: "The enquiry" },
    { name: "Foundations", note: "Groundworks" },
    { name: "Shell", note: "Building · 41202" },
    { name: "First fix", note: "Electrical · 43210 + Plumbing · 43220" },
    { name: "Handover", note: "Complete" }
  ];

  var video = document.getElementById("build");
  var track = document.getElementById("track");
  var fill = document.getElementById("fill");
  var stops = document.getElementById("stops");
  var label = document.getElementById("stagelabel");

  if (video && track && stops) {
    var last = STAGES.length - 1;
    var current = 0;
    var userDriving = false;   // true once the visitor touches the rail
    var pendingSeek = null;    // coalesces drag moves onto one seek per frame
    var rafId = 0;

    STAGES.forEach(function (s, i) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "scrub__stop";
      b.setAttribute("aria-label", "Stage " + (i + 1) + ": " + s.name);
      b.addEventListener("click", function () { takeOver(); goTo(i); });
      stops.appendChild(b);
    });
    var stopEls = stops.querySelectorAll(".scrub__stop");

    function dur() {
      var d = video.duration;
      return (typeof d === "number" && isFinite(d) && d > 0) ? d : 0;
    }

    function paint(fraction) {
      fraction = Math.max(0, Math.min(1, fraction));
      var index = Math.round(fraction * last);
      fill.style.width = (fraction * 100) + "%";
      for (var i = 0; i < stopEls.length; i++) {
        stopEls[i].setAttribute("aria-current", String(i === index));
      }
      var s = STAGES[index];
      label.querySelector("b").textContent = s.name;
      label.querySelector("span").textContent = s.note;
      track.setAttribute("aria-valuenow", String(index + 1));
      track.setAttribute("aria-valuetext", s.name + " — " + s.note);
      current = index;
    }

    /* Seeking on every pointermove floods the decoder and the picture stalls.
       Coalesce to one seek per animation frame instead. */
    function seek(fraction) {
      var d = dur();
      if (!d) return;
      pendingSeek = Math.min(Math.max(fraction, 0), 1) * d;
      // Never land exactly on the duration — that blanks the last frame.
      if (pendingSeek > d - 0.05) pendingSeek = d - 0.05;
      if (rafId) return;
      rafId = requestAnimationFrame(function () {
        rafId = 0;
        if (pendingSeek !== null && !video.seeking) {
          video.currentTime = pendingSeek;
          pendingSeek = null;
        } else if (pendingSeek !== null) {
          seek(pendingSeek / dur()); // still seeking — try again next frame
        }
      });
    }

    function goTo(i) {
      var idx = Math.max(0, Math.min(last, i));
      var f = idx / last;
      seek(f);
      paint(f);
    }

    /* Stop the intro play-through the moment the visitor takes control. */
    function takeOver() {
      userDriving = true;
      if (!video.paused) video.pause();
    }

    video.addEventListener("loadedmetadata", function () {
      if (!userDriving) { seek(0); paint(0); }
    });
    if (video.readyState >= 1 && !userDriving) { seek(0); paint(0); }

    /* Drive the rail from the video itself, so playback and scrubbing share one
       source of truth and can't disagree. */
    video.addEventListener("timeupdate", function () {
      var d = dur();
      if (d && !pendingSeek) paint(video.currentTime / d);
    });
    video.addEventListener("seeked", function () {
      var d = dur();
      if (d) paint(video.currentTime / d);
    });

    function fromPointer(clientX) {
      var r = track.getBoundingClientRect();
      if (!r.width) return;
      var f = (clientX - r.left) / r.width;
      seek(f);
      paint(f);
    }

    var dragging = false;
    track.addEventListener("pointerdown", function (e) {
      dragging = true;
      takeOver();
      try { track.setPointerCapture(e.pointerId); } catch (err) {}
      fromPointer(e.clientX);
      e.preventDefault();
    });
    track.addEventListener("pointermove", function (e) {
      if (dragging) { fromPointer(e.clientX); e.preventDefault(); }
    });
    function endDrag(e) {
      if (!dragging) return;
      dragging = false;
      // No snap on release — snapping yanks the picture away from where the
      // visitor let go, which reads as a bug rather than a feature.
      try { if (track.hasPointerCapture(e.pointerId)) track.releasePointerCapture(e.pointerId); } catch (err) {}
    }
    track.addEventListener("pointerup", endDrag);
    track.addEventListener("pointercancel", endDrag);

    track.addEventListener("keydown", function (e) {
      var k = e.key;
      if (k === "ArrowRight" || k === "ArrowUp") { takeOver(); goTo(current + 1); e.preventDefault(); }
      else if (k === "ArrowLeft" || k === "ArrowDown") { takeOver(); goTo(current - 1); e.preventDefault(); }
      else if (k === "Home") { takeOver(); goTo(0); e.preventDefault(); }
      else if (k === "End") { takeOver(); goTo(last); e.preventDefault(); }
    });

    /* One unattended play-through on load so the page isn't inert — then the
       rail takes over. Skipped for reduced-motion and save-data users. */
    var saveData = navigator.connection && navigator.connection.saveData;
    if (!reduced && !saveData) {
      new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (en) {
          if (!en.isIntersecting || userDriving) return;
          obs.disconnect();
          var p = video.play();
          if (p && p.catch) p.catch(function () { /* autoplay refused — rail still works */ });
        });
      }, { threshold: 0.4 }).observe(video);
    }
  }

  /* ── Portfolio filter ─────────────────────────────────────────────── */
  var filters = document.querySelectorAll(".filter");
  if (filters.length) {
    var cards = document.querySelectorAll(".grid .card");
    filters.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var want = btn.dataset.filter;
        filters.forEach(function (b) { b.setAttribute("aria-pressed", String(b === btn)); });
        cards.forEach(function (c) {
          c.hidden = want !== "all" && (c.dataset.tags || "").indexOf(want) === -1;
        });
      });
    });
  }

  /* ── Quote / contact form ─────────────────────────────────────────── */
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
        status.textContent = "Thanks — this is a demo, so nothing was sent. On the live site this reaches the office and we reply within one working day.";
      }, 700);
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
})();
