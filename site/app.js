(function () {
  "use strict";

  var body = document.body;
  var menuButton = document.querySelector(".mobile-menu-button");
  var drawer = document.getElementById("mobile-drawer");

  function setMenu(open) {
    body.classList.toggle("menu-open", open);
    if (menuButton) menuButton.setAttribute("aria-expanded", String(open));
    if (drawer) drawer.setAttribute("aria-hidden", String(!open));
  }

  if (menuButton) menuButton.addEventListener("click", function () { setMenu(true); });
  document.querySelectorAll("[data-menu-close], .drawer-nav a:not([data-logout])").forEach(function (element) {
    element.addEventListener("click", function () { setMenu(false); });
  });
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") setMenu(false);
  });
  window.addEventListener("resize", function () {
    if (window.innerWidth >= 640) setMenu(false);
  });

  document.querySelectorAll("[data-logout]").forEach(function (link) {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      if (window.etdiosbLogout) window.etdiosbLogout();
    });
  });

  var applicationForm = document.getElementById("application-form");
  var successPanel = document.getElementById("success-panel");
  var reference = document.getElementById("application-reference");
  var newApplication = document.getElementById("new-application");

  if (applicationForm) {
    applicationForm.addEventListener("submit", function (event) {
      event.preventDefault();
      if (!applicationForm.checkValidity()) {
        applicationForm.reportValidity();
        return;
      }

      var token = Math.random().toString(36).slice(2, 8).toUpperCase();
      reference.textContent = "ETD-2026-" + token;
      applicationForm.hidden = true;
      successPanel.classList.add("show");
      successPanel.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }

  if (newApplication) {
    newApplication.addEventListener("click", function () {
      applicationForm.reset();
      applicationForm.hidden = false;
      successPanel.classList.remove("show");
      applicationForm.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }
})();
