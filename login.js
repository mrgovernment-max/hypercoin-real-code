// Theme toggle
const themeToggle = document.getElementById("themeToggle");
if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const isDark =
      document.documentElement.getAttribute("data-theme") === "dark";
    if (isDark) {
      document.documentElement.removeAttribute("data-theme");
      themeToggle.textContent = "🌙";
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.setAttribute("data-theme", "dark");
      themeToggle.textContent = "☀️";
      localStorage.setItem("theme", "dark");
    }
  });
}
// Login form

document.addEventListener("DOMContentLoaded", () => {
  const messageEl = document.getElementById("loginMessage");
  if (messageEl) messageEl.textContent = "";

  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;

      try {
        const res = await fetch(
          "https://backendroutes-lcpt.onrender.com/login",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: username, password }),
          }
        );

        const data = await res.json();

        if (!res.ok) {
          showMessage(data.error || "Login failed.", "error", messageEl);
          return;
        }

        sessionStorage.setItem("accessToken", data.accessToken);
        sessionStorage.setItem("refreshToken", data.refreshToken);

        showMessage("Login successful! Redirecting...", "success", messageEl);
        messageEl.className = "success";

        setTimeout(() => {
          window.location.href = "dashboard.html";
        }, 1600);
      } catch (err) {
        messageEl.textContent = "Login failed. Check username/password.";
        messageEl.className = "error";
        console.error(err);
      }
    });
  }
});

// Helper function to show messages temporarily
function showMessage(text, type, element, duration = 1500) {
  element.textContent = text;
  element.className = type;

  // Remove message after 'duration' milliseconds
  setTimeout(() => {
    element.textContent = "";
    element.className = "";
  }, duration);
}
