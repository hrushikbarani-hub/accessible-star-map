import test from "node:test";
import assert from "node:assert/strict";
import { Window } from "happy-dom";
import { readFile } from "node:fs/promises";
test("text view, live filtering, selection focus and saved stars work through actual events", async () => {
  const window = new Window({ url: "https://example.test" });
  window.document.write(
    await readFile(new URL("../web/index.html", import.meta.url), "utf8"),
  );
  const globals = {
    window,
    document: window.document,
    localStorage: window.localStorage,
  };
  const old = new Map(
    Object.keys(globals).map((k) => [
      k,
      Object.getOwnPropertyDescriptor(globalThis, k),
    ]),
  );
  for (const [k, v] of Object.entries(globals))
    Object.defineProperty(globalThis, k, {
      value: v,
      writable: true,
      configurable: true,
    });
  try {
    await import("../web/app.js");
    const q = window.document.querySelector("#query");
    q.value = "Vega";
    q.dispatchEvent(new window.Event("input", { bubbles: true }));
    assert.match(
      window.document.querySelector("#count").textContent,
      /1 of 144/,
    );
    const b = window.document.querySelector("[data-select]");
    b.focus();
    b.click();
    assert.equal(window.document.activeElement, b);
    assert.match(
      window.document.querySelector("#inspector").textContent,
      /Vega/,
    );
    window.document.querySelector("#save-star").click();
    assert.ok(
      JSON.parse(window.localStorage.getItem("open-sky-saved")).length === 1,
    );
    const text = window.document.querySelector("#text-only");
    text.checked = true;
    text.dispatchEvent(new window.Event("change"));
    assert.equal(window.document.querySelector("#visual").hidden, true);
    const contrast = window.document.querySelector("#contrast");
    contrast.checked = true;
    contrast.dispatchEvent(new window.Event("change"));
    assert.equal(window.document.body.classList.contains("contrast"), true);
  } finally {
    for (const [k, d] of old) {
      if (d) Object.defineProperty(globalThis, k, d);
      else delete globalThis[k];
    }
    await window.happyDOM.abort();
  }
});
