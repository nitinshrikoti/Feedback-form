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
    "slide2-no": { _default: "slide-thanks" },
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
      Definitely: "slide5-referral",
      Maybe: "slide5-recommend",
      "Not really": "slide5-recommend",
      _default: "slide6",
    },
    "slide5-referral": {
      _default: "slide7",
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
  const form = document.getElementById("feedbackForm");

  // slides that are purely optional
  const optionalSlides = ["slide5-referral", "slide6", "slide7"];

  function showSlide(id) {
    document
      .querySelectorAll(".slide")
      .forEach((s) => s.classList.remove("active"));
    document.getElementById(id).classList.add("active");
    backBtn.disabled = history.length === 1;
    progressTxt.textContent = `Question ${history.length}`;
    // if it's THANK-YOU, turn button into real submit
    if (id === "slide-thanks") {
      nextBtn.textContent = "Submit";
      nextBtn.type = "submit";
      nextBtn.disabled = false;
      nextBtn.classList.remove("inactive");
    } else {
      nextBtn.textContent = "Continue";
      nextBtn.type = "button";
      updateNav();
    }
  }

  function getAnswer(slideId) {
    const ta = document.querySelector(`#${slideId} textarea`);
    if (ta) return ta.value.trim() || null;
    const name =
      slideId === "slide7"
        ? "publish"
        : "q" + slideId.replace("slide", "").match(/^\d+/)[0];
    const ck = document.querySelector(
      `#${slideId} input[name="${name}"]:checked`
    );
    return ck ? ck.value : null;
  }

  function validateCurrent() {
    const cur = history[history.length - 1];
    if (optionalSlides.includes(cur)) {
      // never block optional slides
      return true;
    }
    const el = document.getElementById(cur);
    const err = el.querySelector(".error-message");
    err.style.display = "none";
    // only required if there's an input or textarea
    if (el.querySelector("input,textarea")) {
      if (!getAnswer(cur)) {
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
    return rules[ans] || rules._default || "slide-thanks";
  }

  function updateNav() {
    const cur = history[history.length - 1];
    if (optionalSlides.includes(cur)) {
      nextBtn.disabled = false;
      nextBtn.classList.remove("inactive");
      return;
    }
    // slides without inputs get auto-enabled
    if (!document.querySelector(`#${cur} input, #${cur} textarea`)) {
      nextBtn.disabled = false;
      nextBtn.classList.remove("inactive");
      return;
    }
    // otherwise only enable if answered
    const ok = !!getAnswer(cur);
    nextBtn.disabled = !ok;
    nextBtn.classList.toggle("inactive", !ok);
  }

  nextBtn.addEventListener("click", () => {
    if (!validateCurrent()) return;
    const next = getNextId();
    history.push(next);
    showSlide(next);
  });

  backBtn.addEventListener("click", () => {
    if (history.length > 1) {
      history.pop();
      nextBtn.textContent = "Continue";
      nextBtn.type = "button";
      showSlide(history[history.length - 1]);
    }
  });

  // re-check whenever anything changes
  document
    .querySelectorAll(".slide input, .slide textarea")
    .forEach((el) => el.addEventListener("change", updateNav));

  showSlide("slide1");
});
