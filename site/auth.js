(function () {
  "use strict";

  var SESSION_KEY = "etdiosb-demo-auth";
  var USER_HASH = "a7ac6ef9ee3d39dee3282500e91a5a9964998e7cedb4a7ef239f6f77dd123eb4";
  var PASSWORD_HASH = "95f5c93cdf6f7d46d7c7cd41d2b6199ee390f2cc82259ce2233bad2cab194ad3";
  var fileName = window.location.pathname.split("/").pop() || "index.html";
  var onLoginPage = fileName === "login.html";

  function isAuthenticated() {
    return window.sessionStorage.getItem(SESSION_KEY) === "1";
  }

  function safeDestination() {
    var requested = new URLSearchParams(window.location.search).get("next");
    return requested === "basvuru.html" ? requested : "index.html";
  }

  if (!onLoginPage && !isAuthenticated()) {
    var destination = fileName === "basvuru.html" ? "?next=basvuru.html" : "";
    window.location.replace("login.html" + destination);
    return;
  }

  if (onLoginPage && isAuthenticated()) {
    window.location.replace(safeDestination());
    return;
  }

  document.documentElement.classList.remove("auth-pending");

  async function sha256(value) {
    var bytes = new TextEncoder().encode(value);
    var digest = await window.crypto.subtle.digest("SHA-256", bytes);
    return Array.from(new Uint8Array(digest)).map(function (byte) {
      return byte.toString(16).padStart(2, "0");
    }).join("");
  }

  window.addEventListener("DOMContentLoaded", function () {
    var form = document.getElementById("login-form");
    if (!form) return;

    form.addEventListener("submit", async function (event) {
      event.preventDefault();
      var submit = form.querySelector("button[type='submit']");
      var error = document.getElementById("login-error");
      var username = form.elements.username.value.trim();
      var password = form.elements.password.value;
      submit.disabled = true;
      submit.textContent = "Kontrol ediliyor…";
      error.textContent = "";

      try {
        var hashes = await Promise.all([sha256(username), sha256(password)]);
        if (hashes[0] === USER_HASH && hashes[1] === PASSWORD_HASH) {
          window.sessionStorage.setItem(SESSION_KEY, "1");
          window.location.replace(safeDestination());
          return;
        }
        error.textContent = "Kullanıcı adı veya şifre hatalı.";
      } catch (loginError) {
        error.textContent = "Giriş kontrolü başlatılamadı. Lütfen güncel bir tarayıcı kullanın.";
      }

      submit.disabled = false;
      submit.innerHTML = "Demoya Giriş <span>→</span>";
    });
  });

  window.etdiosbLogout = function () {
    window.sessionStorage.removeItem(SESSION_KEY);
    window.location.replace("login.html");
  };
})();
