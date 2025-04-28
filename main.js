document.addEventListener("DOMContentLoaded", () => {
  // ——————— BRANCHING RULES ———————
  const branchMap = {
    slide1: {
      yes: "slide2",
      no: "slide-thanks",
      _default: "slide-thanks",
    },
    slide2: {
      yes: "slide3",
      no: "slide2-no",
      issues: "slide2-issues",
      _default: "slide3",
    },
    "slide2-issues": {
      _default: "slide3",
    },
    "slide2-issues": {
      _default: "slide3",
    },
    slide3: {
      1: "slide3-improve",
      2: "slide3-improve",
      3: "slide3-improve",
      4: "slide4",
      5: "slide4",
      _default: "slide4",
    },
    "slide3-improve": {
      _default: "slide4",
    },
    slide4: {
      "Very Satisfied": "slide5",
      Satisfied: "slide5",
      Neutral: "slide4-disappoint",
      Dissatisfied: "slide4-disappoint",
      _default: "slide5",
    },
    "slide4-disappoint": {
      _default: "slide-thanks",
    },
    slide5: {
      Definitely: "slide6",
      Maybe: "slide5-recommend",
      "Not really": "slide5-recommend",
      _default: "slide6",
    },
    "slide5-recommend": {
      _default: "slide-thanks",
    },
    slide6: {
      _default: "slide7",
    },
    slide7: {
      yes: "slide-thanks",
      no: "slide-thanks",
      _default: "slide-thanks",
    },
    // slide-thanks has no next
  };

  // ——————— STATE & ELEMENTS ———————
  const history = ["slide1"];
  const backBtn = document.getElementById("backBtn");
  const nextBtn = document.getElementById("nextBtn");
  const progressTxt = document.getElementById("progressText");
  const totalSlides = document.querySelectorAll(".slide").length;
  const form = document.getElementById("feedbackForm");

  // ——————— HELPERS ———————
  function showSlide(id) {
    document
      .querySelectorAll(".slide")
      .forEach((s) => s.classList.remove("active"));
    document.getElementById(id).classList.add("active");
    backBtn.disabled = history.length === 1;
    progressTxt.textContent = `Slide ${history.length}`;
    updateNav();
  }

  function getAnswer(slideId) {
    // textarea?
    const ta = document.querySelector(`#${slideId} textarea`);
    if (ta) return ta.value.trim() || null;

    // radio?
    const name =
      slideId === "slide7"
        ? "publish"
        : "q" + slideId.replace("slide", "").match(/^\d+/)[0];
    const chk = document.querySelector(
      `#${slideId} input[name="${name}"]:checked`
    );
    return chk ? chk.value : null;
  }

  function validateCurrent() {
    const id = history[history.length - 1];
    const el = document.getElementById(id);
    const err = el.querySelector(".error-message");
    err.style.display = "none";

    if (el.querySelector("input,textarea")) {
      if (!getAnswer(id)) {
        err.textContent = el.querySelector("textarea")
          ? "This field is required."
          : "Please select an option to continue.";
        err.style.display = "block";
        return false;
      }
    }
    return true;
  }

  function getNextId() {
    const cur = history[history.length - 1];
    const rules = branchMap[cur] || {};
    const ans = getAnswer(cur);
    return rules[ans] ?? rules._default ?? "slide-thanks";
  }

  function updateNav() {
    const id = history[history.length - 1];
    // if no inputs on this slide, always active
    if (!document.querySelector(`#${id} input, #${id} textarea`)) {
      nextBtn.classList.remove("inactive");
      nextBtn.disabled = false;
      return;
    }
    // otherwise only active if answered
    const ok = !!getAnswer(id);
    nextBtn.classList.toggle("inactive", !ok);
    nextBtn.disabled = !ok;
  }

  // ——————— EVENT HANDLERS ———————
  nextBtn.addEventListener("click", () => {
    if (!validateCurrent()) return;
    const next = getNextId();
    history.push(next);
    showSlide(next);

    if (next === "slide-thanks") {
      nextBtn.textContent = "Submit";
      nextBtn.onclick = () => form.submit();
    }
  });

  backBtn.addEventListener("click", () => {
    if (history.length > 1) {
      history.pop();
      nextBtn.textContent = "Continue";
      nextBtn.onclick = null;
      showSlide(history[history.length - 1]);
    }
  });

  // whenever any input/textarea changes, re-check button state
  document
    .querySelectorAll(".slide input, .slide textarea")
    .forEach((el) => el.addEventListener("change", updateNav));

  // ——————— INITIALIZE ———————
  showSlide("slide1");
});
