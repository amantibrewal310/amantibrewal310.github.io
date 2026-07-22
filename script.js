// Signature interaction: the hero "extracts" the profile like a document
// pipeline — lines type in one by one, then each extracted field links back
// to its source span in the prose on hover/focus.

(function () {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const status = document.getElementById("hero-status");
  const pre = document.getElementById("extract-json");
  const code = pre ? pre.querySelector("code") : null;

  function finish() {
    if (status) status.textContent = "done ✓";
  }

  // --- typing reveal (skipped under reduced motion) ---
  if (!reduceMotion && code) {
    // Wrap loose text nodes so every line-ish chunk can be revealed in order.
    const chunks = [];
    Array.from(code.childNodes).forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const span = document.createElement("span");
        span.textContent = node.textContent;
        code.replaceChild(span, node);
        chunks.push(span);
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        chunks.push(node);
      }
    });

    pre.classList.add("is-typing");
    let i = 0;
    (function reveal() {
      if (i >= chunks.length) {
        pre.classList.remove("is-typing");
        finish();
        return;
      }
      chunks[i].classList.add("is-typed");
      i += 1;
      setTimeout(reveal, 110);
    })();
  } else {
    finish();
  }

  // --- field ⇄ source-span linking ---
  const fields = document.querySelectorAll(".field-line[data-field]");
  fields.forEach((field) => {
    const marks = document.querySelectorAll('.hl[data-field="' + field.dataset.field + '"]');
    const on = () => marks.forEach((m) => m.classList.add("is-linked"));
    const off = () => marks.forEach((m) => m.classList.remove("is-linked"));
    field.addEventListener("mouseenter", on);
    field.addEventListener("mouseleave", off);
    field.addEventListener("focus", on);
    field.addEventListener("blur", off);
  });
})();
