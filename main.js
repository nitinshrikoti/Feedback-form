document.addEventListener("DOMContentLoaded", () => {
  const slides = Array.from(document.querySelectorAll(".slide"));
  const backBtn = document.getElementById("backBtn");
  const nextBtn = document.getElementById("nextBtn");
  const progress = document.getElementById("progressText");
  const form = document.getElementById("feedbackForm");
  let current = 0;
  const total = slides.length;

  function updateNav() {
    // only slides 0–3 are required
    if (current < 4) {
      const qName = `q${current + 1}`;
      const answered = !!document.querySelector(
        `input[name="${qName}"]:checked`
      );
      nextBtn.classList.toggle("inactive", !answered);
    } else {
      nextBtn.classList.remove("inactive");
    }
  }

  function showSlide(n) {
    slides.forEach((s, i) => s.classList.toggle("active", i === n));
    backBtn.disabled = n === 0;
    nextBtn.textContent = n === total - 1 ? "Submit" : "Continue";
    progress.textContent = `Question ${n + 1} of ${total}`;
    // hide old error
    const err = slides[n].querySelector(".error-message");
    if (err) err.style.display = "none";
    updateNav();
  }

  nextBtn.addEventListener("click", () => {
    if (current < 4) {
      const qName = `q${current + 1}`;
      const answered = document.querySelector(`input[name="${qName}"]:checked`);
      const err = slides[current].querySelector(".error-message");
      if (!answered) {
        err.textContent = "Please select an option to continue.";
        err.style.display = "block";
        return; // don’t advance
      }
    }
    if (current < total - 1) {
      current++;
      showSlide(current);
    } else {
      form.submit();
    }
  });

  backBtn.addEventListener("click", () => {
    if (current > 0) {
      current--;
      showSlide(current);
    }
  });

  // attach change-listeners to required radios to re-check button state
  for (let i = 1; i <= 4; i++) {
    document
      .querySelectorAll(`input[name="q${i}"]`)
      .forEach((radio) => radio.addEventListener("change", updateNav));
  }

  // initial
  showSlide(0);
});
