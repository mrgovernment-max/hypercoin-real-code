// Get elements for dashboard
async function dashboardAuth() {
  let token = cryptoServiveqwertypoiu.getItem("accessToken");
  if (!token) {
    redirectToLogin();
  }

  let res = await fetchDashboard(token);

  if (res.status === 401) {
    // Try refresh token
    await requestToken();

    token = cryptoServiveqwertypoiu.getItem("accessToken");

    res = await fetchDashboard(token);
  }

  if (!res.ok) return redirectToLogin();
  getNotSeenMessages();

  const data = await res.json();
  const page_title = document.getElementById("page-title");
  const userAvatar = document.getElementById("user-avatar");
  const profileUser = document.getElementById("profile-user");
  const usernameDisplayy = document.getElementById("usernamee");
  const userAvatarr = document.getElementById("user-avatarr");

  if (profileUser) profileUser.textContent = data.username || "Guest";
  if (usernameDisplayy) usernameDisplayy.textContent = data.username || "Guest";
  if (userAvatarr)
    userAvatarr.textContent = data.username ? data.username.slice(0, 2) : "G";
  if (userAvatar)
    userAvatar.innerHTML = data.username ? data.username.slice(0, 2) : "G";
  if (page_title)
    page_title.innerHTML = `
  <span>
   ${data.username}'s<BR>
  </span>DASHBOARD
`;
}

window.onload = dashboardAuth;

// Call dashboardAuth on load
document.addEventListener("DOMContentLoaded", function () {
  dashboardAuth();

  // Initialize mining stats after a short delay to ensure auth is complete
  setTimeout(initMiningStats, 1000);
});

async function fetchDashboard(token) {
  try {
    return await fetch("https://backendroutes-lcpt.onrender.com/dashboard", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (err) {
    console.error("Error fetching dashboard:", err);
    redirectToLogin();
    return { ok: false }; // Return a mock response object
  }
}

async function requestToken() {
  const refreshToken = cryptoServiveqwertypoiu.getItem("refreshToken");
  if (!refreshToken) {
    redirectToLogin();
    return false;
  }

  try {
    const res = await fetch("https://backendroutes-lcpt.onrender.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: refreshToken }),
    });
    if (!res.ok) {
      redirectToLogin();
      return false;
    }

    const data = await res.json();
    cryptoServiveqwertypoiu.setItem("accessToken", data.accessToken);
    return true;
  } catch (err) {
    console.error("Token refresh failed:", err);
    redirectToLogin();
    return false;
  }
}

// Hamburger menu functionality
const menuToggle = document.getElementById("menuToggle");
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");

if (menuToggle && sidebar && overlay) {
  menuToggle.addEventListener("click", () => {
    sidebar.classList.toggle("active");
    overlay.classList.toggle("active");
  });

  overlay.addEventListener("click", () => {
    sidebar.classList.remove("active");
    overlay.classList.remove("active");
  });
}

function hideonClick() {
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("overlay");

  if (sidebar && overlay) {
    sidebar.classList.remove("active");
    overlay.classList.remove("active");
  }
}

// Theme toggle functionality
const themeToggle = document.getElementById("themeToggle");

if (themeToggle) {
  // Check for saved theme preference
  const currentTheme = localStorage.getItem("theme");

  // Apply the theme if previously set
  if (currentTheme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
    themeToggle.textContent = "☀️";
  }

  // Toggle theme on button click
  themeToggle.addEventListener("click", () => {
    if (!document.documentElement.getAttribute("data-theme")) {
      document.documentElement.setAttribute("data-theme", "dark");
      themeToggle.textContent = "☀️";
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
      themeToggle.textContent = "🌙";
      localStorage.setItem("theme", "light");
    }
  });
}

// Server data variable
let serverData = null;

// Function to fetch server data
async function fetchServerData() {
  await dashboardAuth();
  const token = cryptoServiveqwertypoiu.getItem("accessToken");

  // Check if the token exists
  if (!token) {
    redirectToLogin();
    return null;
  }

  try {
    const res = await fetch(
      "https://backendroutes-lcpt.onrender.com/getUserStats",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Check for 401 status specifically
    if (res.status === 401) {
      dashboardAuth();
      return null;
    }

    if (!res.ok) {
      console.error("Failed to fetch user stats:", res.status);
      return null;
    }

    serverData = await res.json();
    getNotSeenMessages();
    // Update UI to show premium status
    updatePremiumStatusUI(serverData);
    return serverData;
  } catch (err) {
    console.error("Error fetching server data:", err);
    serverData = null;
    return null;
  }
}

// Call fetchServerData on window load
window.onload = function () {
  fetchServerData();
};

function updatePremiumStatusUI(data) {
  if (!data) {
    console.error("No data provided to updatePremiumStatusUI");
    return;
  }

  dashboardAuth();

  const userRole = document.getElementById("user-role");
  const configure = document.getElementById("configure-plan");
  const profile_usertype = document.getElementById("profile-usertype");
  const rec = document.getElementById("rec");
  const miningState = document.getElementById("miningState");
  const mining_status = document.getElementById("mining-status");
  const startInv = document.getElementById("start-inv");
  const stoptInv = document.getElementById("stop-inv");
  const balanace_control = document.getElementById("balanace-control");
  const take_p_div = document.getElementById("take-p-div");
  const withdraw = document.getElementById("withdraw");
  const stop_l_div = document.getElementById("stop-l-div");

  // Mining efficiency bar display
  const hyper_efficiency = document.getElementById("miningeff");
  const miningInfo = document.getElementById("mining-info");
  const bar = document.getElementById("progress-bar");

  let randomNumber = (Math.random() * 99 + 1).toFixed(2);

  if (bar) bar.style.width = randomNumber + "%";
  if (hyper_efficiency) hyper_efficiency.innerHTML = randomNumber + "%";

  if (data && data.usertype) {
    if (data.usertype !== "Free") {
      // Premium / Professional / any non-free user
      if (randomNumber >= 45) {
        if (bar) bar.style.width = randomNumber + "%";
        if (hyper_efficiency) hyper_efficiency.innerHTML = randomNumber + "%";
      } else {
        if (bar) bar.style.width = "45%";
        if (hyper_efficiency) hyper_efficiency.innerHTML = "50%";
      }

      if (miningInfo)
        miningInfo.innerHTML = `Investmenst is active . Current efficiency is around :`;
      if (configure) configure.textContent = "Deposite Funds";
      if (profile_usertype)
        profile_usertype.innerHTML = ` <i class="fa-solid fa-circle" style="color: #63E6BE;margin-right:6px;"></i>  ${data.usertype} <i class="fa-solid fa-circle" style="color: #63E6BE;margin-left:6px;"></i>`;
      if (rec) rec.innerHTML = "";
      if (withdraw) withdraw.innerHTML = "Withdraw Funds";
      if (miningState) miningState.innerHTML = " Investment Enabled ";
      if (balanace_control) balanace_control.style.display = "flex";
      if (mining_status)
        mining_status.className = "mining-status status-active";
      if (startInv) {
        startInv.addEventListener("click", () => {
          startInv.style.animation = "softFloat 2s ease-in-out infinite";
          startInv.innerHTML = "Investment is Active";
        });
      }

      if (stoptInv) {
        stoptInv.innerHTML = "Pause Investment";
        stoptInv.addEventListener("click", () => {
          startInv.style.animation = "none";
          startInv.innerHTML = "Resume Investing";
        });
      }
      if (userRole)
        userRole.innerHTML = ` <i class="fa-solid fa-circle" style="color: #63E6BE; margin-right:6px;"></i> ${data.usertype} Investor`;
    } else {
      // Free users
      if (miningInfo)
        miningInfo.innerHTML = `Investment is inactive Deposite Funds into Your Account to Start Investing <br> Current HPC efficiency :`;
      if (configure) stoptInv.style.display = " none";
      if (startInv) startInv.style.display = "none";
      if (stoptInv) configure.innerHTML = "Deposite Funds";
      if (profile_usertype) profile_usertype.textContent = data.usertype;
      if (miningState) miningState.innerHTML = `Investment Disabled`;
      if (take_p_div) take_p_div.style.display = "none";
      if (stop_l_div) stop_l_div.style.display = "none";
      if (withdraw) withdraw.style.display = "none";

      if (rec)
        rec.innerHTML = `<span style='color:#ff9800'>
          <i class='fa-solid fa-circle' style='color: #FFD43B; margin-right:6px;'></i>
          <a style='color: #FFD43B' target='_blank' href='redirect.html'>Deposite</a>  funds into account<br>
          to start investing and use other features
        </span>`;
    }
  }
}

////////USER  AND DEACTIVATE

const startInv = document.getElementById("start-inv");
const stoptInv = document.getElementById("stop-inv");

startInv.addEventListener("click", async function activateUser() {
  await dashboardAuth();
  const token = cryptoServiveqwertypoiu.getItem("accessToken");
  await fetch("https://backendroutes-lcpt.onrender.com/activateuser", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token }),
  });
});

stoptInv.addEventListener("click", async function deactivateUser() {
  await dashboardAuth();
  const token = cryptoServiveqwertypoiu.getItem("accessToken");
  await fetch("https://backendroutes-lcpt.onrender.com/deactivateuser", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token }),
  });
  localStorage.removeItem("activate");
});

var cryptoServiveqwertypoiu = sessionStorage;

async function checkuserState() {
  await dashboardAuth();
  const token = cryptoServiveqwertypoiu.getItem("accessToken");
  const res = await fetch(
    "https://backendroutes-lcpt.onrender.com/checkuserstate",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    }
  );
  const data = await res.json();
  const mining_state = data.message.mining_state;
  if (mining_state === "active") {
    startInv.innerHTML = "Investment is Active";
    stoptInv.innerHTML = "Pause Investment";
  } else {
    startInv.innerHTML = "Resume Investing";
  }
}

checkuserState();

function redirectToLogin() {
  window.location.href = "login.html";
}

// Initialize variables
let currentHashRate = 0;
let prevHashRate = 0;
let highestHashRate = parseFloat(localStorage.getItem("highestHashRate")) || 0;

let currentBalance = 0;
let prevBalance = 0;
let highestBalance = parseFloat(localStorage.getItem("highestBalance")) || 0;

// API endpoint URL
const BALANCE_API_URL = "https://backendroutes-lcpt.onrender.com/balance";

// Function to fetch balance from API - USE REFRESH TOKEN
async function fetchBalanceFromAPI() {
  const token = cryptoServiveqwertypoiu.getItem("accessToken"); // Use refresh token here

  // Check if token exists
  if (!token) {
    console.error("No refresh token found in cryptoServiveqwertypoiu");
    return currentBalance;
  }

  try {
    const response = await fetch(BALANCE_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status: ${response.status}`);
    }

    const data = await response.json();

    // Check if hpcbalance exists in response
    if (data.hpcbalance === undefined) {
      throw new Error("hpcbalance field missing from API response");
    }

    return parseFloat(data.hpcbalance);
  } catch (error) {
    console.error("Error fetching balance:", error);
    return currentBalance; // Return current balance if API fails
  }
}

// Function to update mining stats with API balance
async function updateMiningStats() {
  // Get DOM elements
  const hashValue = document.getElementById("hash-value");
  const hashChange = document.getElementById("hash-change");
  const dailyHighHash = document.getElementById("dailyhighhash");
  const hashSig = document.getElementById("hashsig");
  const hashArrowIcon = hashSig ? hashSig.querySelector("i") : null;

  const balanceValue = document.getElementById("balance-value");
  const balanceChange = document.getElementById("balance-change");
  const dailyHigh = document.getElementById("dailyhigh");
  const balanceSig = document.getElementById("balancesig");
  const balanceArrowIcon = balanceSig ? balanceSig.querySelector("i") : null;

  // Store previous values
  prevHashRate = currentHashRate;
  prevBalance = currentBalance;

  currentHashRate = 50 + (Math.random() * 40 - 20); // Default hash rate

  // Update highest hash rate
  if (currentHashRate > highestHashRate) {
    highestHashRate = currentHashRate;
    localStorage.setItem("highestHashRate", highestHashRate);
  }

  // Fetch balance from API instead of calculating it
  try {
    const newBalance = await fetchBalanceFromAPI();

    // Update current balance with API response
    currentBalance = newBalance;

    // Update highest balance if current balance is higher
    if (currentBalance > highestBalance) {
      highestBalance = currentBalance;
      localStorage.setItem("highestBalance", highestBalance);
    }
  } catch (error) {
    console.error("Failed to update balance from API:", error);
    // Keep using the current balance if API call fails
  }

  // Calculate balance change for indicators
  const balanceChangeValue = currentBalance - prevBalance;
  const changePercent =
    prevBalance > 0 ? (balanceChangeValue / prevBalance) * 100 : 0;

  // Update UI elements
  if (hashValue) hashValue.textContent = Math.round(currentHashRate) + " MH/s";
  if (dailyHighHash)
    dailyHighHash.textContent = Math.round(highestHashRate) + " MH/s";
  if (balanceValue) balanceValue.textContent = currentBalance.toFixed(2) + " $";
  if (dailyHigh) dailyHigh.textContent = "1 HPC = 1.5 USD";

  // Update change indicators
  const hashChangeValue = currentHashRate - prevHashRate;

  if (hashChange) {
    hashChange.textContent =
      (hashChangeValue >= 0 ? "+" : "") + Math.round(hashChangeValue) + " MH/s";
    hashChange.style.color =
      hashChangeValue > 0 ? "green" : hashChangeValue < 0 ? "red" : "gray";
  }

  if (balanceChange) {
    balanceChange.textContent =
      (balanceChangeValue >= 0 ? "+" : "") + changePercent.toFixed(2) + "%";
    balanceChange.style.color =
      balanceChangeValue > 0
        ? "green"
        : balanceChangeValue < 0
        ? "red"
        : "gray";
  }

  // Update arrows
  if (hashSig && hashArrowIcon) {
    hashArrowIcon.className =
      hashChangeValue > 0
        ? "fas fa-arrow-up"
        : hashChangeValue < 0
        ? "fas fa-arrow-down"
        : "fas fa-minus";
    hashSig.style.color =
      hashChangeValue > 0 ? "green" : hashChangeValue < 0 ? "red" : "gray";
  }

  if (balanceSig && balanceArrowIcon) {
    balanceArrowIcon.className =
      balanceChangeValue > 0
        ? "fas fa-arrow-up"
        : balanceChangeValue < 0
        ? "fas fa-arrow-down"
        : "fas fa-minus";
    balanceSig.style.color =
      balanceChangeValue > 0
        ? "green"
        : balanceChangeValue < 0
        ? "red"
        : "gray";
  }

  dashboardAuth();
}

// Initialize and start updating
function initMiningStats() {
  // Load highest values from localStorage
  highestHashRate = parseFloat(localStorage.getItem("highestHashRate")) || 0;
  highestBalance = parseFloat(localStorage.getItem("highestBalance")) || 0;
}

async function activeUsers() {
  const activeUsers = document.getElementById("active-users");
  const res = await fetch(
    "https://backendroutes-lcpt.onrender.com/activeusers"
  );

  const data = await res.json();
  const active = data.activeUsers;
  activeUsers.innerHTML = active;
  const offline = 200 - parseFloat(active.split(" ")[0]);
  const offlineUsers = document.getElementById("offline-users");
  offlineUsers.innerHTML = offline;
}

activeUsers();

initMiningStats();

// Start regular updates
setInterval(updateMiningStats, 5000); // Update every 5 seconds
updateMiningStats(); // Initial update

// Avatar controls
document.addEventListener("DOMContentLoaded", function () {
  const avatar_controls = document.getElementById("avatar-controls");
  const user_avatar = document.getElementById("user-avatar-img");

  // When user selects a new avatar
  avatar_controls.addEventListener("change", async function () {
    dashboardAuth();
    const token = cryptoServiveqwertypoiu.getItem("accessToken");
    const avatarimg = this.value; // selected avatar URL
    user_avatar.src = avatarimg; // update image

    try {
      const res = await fetch(
        "https://backendroutes-lcpt.onrender.com/postav",
        {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token, uavatar: avatarimg }),
        }
      );
      const data = await res.json();
      const msg = data.message;
    } catch (err) {
      console.log(err);
    }
  });

  async function getAvr() {
    const token = cryptoServiveqwertypoiu.getItem("accessToken");
    const user_avatar = document.getElementById("user-avatar-img");
    try {
      const res = await fetch("https://backendroutes-lcpt.onrender.com/getav", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();
      const msg = data.avatar;
      user_avatar.src = msg;
    } catch (err) {
      console.log(err);
    }
  }

  getAvr();

  // Forgot password button
  const pforgot = document.getElementById("forgot-password");
  const changeps = document.getElementById("change-password");
  const pinput = document.getElementById("psInput");
  const vinput = document.getElementById("vinput");
  if (pforgot) {
    pforgot.addEventListener("click", async () => {
      changeps.style.display = "block";
      changeps.addEventListener("click", async () => {
        if (changeps.style.display === "block") {
          const token = cryptoServiveqwertypoiu.getItem("accessToken");

          if (!token) {
            console.error("No access token found");
            alert("Please log in first");
            return;
          }

          try {
            const res = await fetch(
              "https://backendroutes-lcpt.onrender.com/resetpass",
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token }),
              }
            );

            const data = await res.json();

            if (res.ok) {
            } else {
              console.error("Error:", data.error);
            }
          } catch (err) {
            console.error("Request failed:", err);
          }

          pinput.style.display = "block";
          changeps.innerHTML =
            "Input the reset code sent to your registered mail";
          pinput.addEventListener("focus", () => {
            vinput.style.display = "block";
            vinput.innerHTML = "Verify Code";
            pforgot.innerHTML =
              "Please refresh the page to start a new password reset request. ";
          });
        }
      });
    });
  }
});

async function verifyCode() {
  const token = cryptoServiveqwertypoiu.getItem("accessToken");
  const ucode = document.getElementById("psInput").value;
  const newps = document.getElementById("reset-container");
  const vinput = document.getElementById("vinput");
  const recovery_actions = document.getElementById("recovery-actions");

  try {
    const res = await fetch(
      "https://backendroutes-lcpt.onrender.com/verifyReset",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, ucode }),
      }
    );

    const data = await res.json();
    const codeValidation = data.message;
    if (codeValidation === "Valid code") {
      newps.style.display = "flex";
      recovery_actions.style.display = "none";
    }

    codeValidation === "Invalid code"
      ? (vinput.innerHTML = "Invalid code")
      : [];

    if (codeValidation === "Code Expired") {
      vinput.innerHTML = "Code Expired Roloading Page ....";

      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }

    if (res.ok) {
    } else {
      console.error("Error:", data.error);
    }
  } catch (err) {
    console.error("Request failed:", err);
  }
}
const confirmBtn = document.getElementById("confirm-password");

confirmBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  const confirm = document.getElementById("new-password").value;
  const token = cryptoServiveqwertypoiu.getItem("accessToken");

  try {
    const res = await fetch("https://backendroutes-lcpt.onrender.com/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, confirm }),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Password updated successfully!");
      window.location.href = "login.html";
    } else {
      alert(data.error || "Failed to update password");
    }
  } catch (err) {
    console.error(err);
    alert("An error occurred. Try again.");
  }
});

const logOut = document.getElementById("logout-btn");
logOut.addEventListener("click", () => {
  ["accessToken", "refreshToken"].forEach((key) =>
    cryptoServiveqwertypoiu.removeItem(key)
  );
  window.location.reload();
});

const take_p = document.getElementById("take-p");

take_p.addEventListener("click", async () => {
  const take_p_balance = parseFloat(
    document.getElementById("take-p-balance").value
  ).toFixed(2);
  if (isNaN(take_p_balance)) {
    return;
  }
  let balanceset = document.getElementById("take-p-balance");
  const take_p_msg = document.getElementById("take-p-msg");
  take_p_msg.style.display = "block";

  const token = cryptoServiveqwertypoiu.getItem("accessToken");
  try {
    const res = await fetch(
      "https://backendroutes-lcpt.onrender.com/takeprofit",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, takepbalance: take_p_balance }),
      }
    );
    if (res.ok) {
      const data = await res.json();
      take_p_msg.innerHTML = ` <i class="fa-solid fa-check"></i>  ${data.message}`;
      setTimeout(() => {
        take_p_msg.innerHTML = "";
        take_p_msg.style.display = "none";
        balanceset.value = "";
      }, 2000);
      getUsermsg();
      getNotSeenMessages();
    }
  } catch (err) {
    if (err) {
      console.log(err);
    }
  }
});

const stop_l = document.getElementById("stop-l");

stop_l.addEventListener("click", async () => {
  const stop_loss_balance = parseFloat(
    document.getElementById("stop-l-balance").value
  ).toFixed(2);

  if (isNaN(stop_loss_balance)) {
    return; // stop if it's not a number
  }
  const token = cryptoServiveqwertypoiu.getItem("accessToken");
  let balanceset = document.getElementById("stop-l-balance");
  const stop_l_msg = document.getElementById("stop-l-msg");
  stop_l_msg.style.display = "block";
  try {
    const res = await fetch(
      "https://backendroutes-lcpt.onrender.com/stoploss",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, stoplbalance: stop_loss_balance }),
      }
    );
    if (res.ok) {
      const data = await res.json();
      stop_l_msg.innerHTML = ` <i class="fa-solid fa-check"></i>  ${data.message}`;
      setTimeout(() => {
        stop_l_msg.innerHTML = "";
        stop_l_msg.style.display = "none";
        balanceset.value = "";
      }, 2000);
      getUsermsg();
      getNotSeenMessages();
    }
  } catch (err) {
    if (err) {
      console.log(err);
    }
  }
});

const notificationb = document.getElementById("notification-btn");
const notification_msg = document.getElementById("notification-msg");
const notification_overlay = document.getElementById("notification-overlay");

notificationb.addEventListener("click", () => {
  notification_overlay.classList.add("active");
  notification_msg.classList.add("active");
});

notification_overlay.addEventListener("click", () => {
  // Start fade-out
  notification_overlay.style.opacity = "0";
  notification_msg.style.opacity = "0";

  // Wait for transition to finish before hiding
  setTimeout(() => {
    notification_overlay.classList.remove("active");
    notification_msg.classList.remove("active");

    // Reset opacity for next time
    notification_overlay.style.opacity = "";
    notification_msg.style.opacity = "";
  }, 600); // match the CSS transition duration
});

async function getUsermsg() {
  const token = cryptoServiveqwertypoiu.getItem("accessToken");
  try {
    const res = await fetch(
      "https://backendroutes-lcpt.onrender.com/getusermsg",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      }
    );
    const data = await res.json();
    const container = document.getElementById("notification-msg");
    container.innerHTML = "";

    data.forEach((msg) => {
      const date = new Date(msg.created_at);

      // Format date parts
      const year = date.getUTCFullYear();
      const month = String(date.getUTCMonth()).padStart(2, "0");
      const day = String(date.getUTCDate()).padStart(2, "0");
      const hour = String(date.getUTCHours()).padStart(2, "0");
      const minute = String(date.getUTCMinutes()).padStart(2, "0");

      const time = ` ${month}-${day}-${year} ${hour}:${minute}`;

      // Decide message color based on type
      let color = "#fff"; // default
      if (msg.type === "take_profit") color = "green";
      if (msg.type === "stop_loss") color = "red";

      // Create and insert element
      const p = document.createElement("p");
      p.id = "user-msg-p";
      p.style.color = color;
      p.style.fontSize = "14px";
      p.style.marginBottom = "10px";

      p.innerHTML = `
      ${
        msg.message
      }  <span style="margin:0 5px;"> at </span> <span style="color :yellow; margin-left:5px;"> ${time}  </span>
      ${
        msg.interactions === "notseen"
          ? `<br>
        <button
          class="check-btn"
          id="${msg.id}"
          onclick="checkUsermsg(${msg.id})"
          style="
            width:5px;
            height:auto;
            background: transparent;
            border:none;
            border-radius: 6px;
            font-size: 30px;
            cursor: pointer;
            margin-right: 8px;
            margin-left: 8px;
            transition: 0.2s ease-in-out;">
            <i class="fa-solid fa-check-double" style="color: #ededed;"></i>
        </button>
      `
          : ""
      }
    
      <button
        class = "del-msg"
        onclick="deleteUsermsg(${msg.id}, this)"
        style="
          width:50px;
          height:30px;
          background: transparent;
          border:none;
          border-radius: 6px;
          font-size: 30px;
          color: red;
          cursor: pointer;
          margin-left: 4px;
          transition: 0.2s ease-in-out;">
        🗑
      </button>
    `;

      container.appendChild(p);
    });

    console.log(data);
  } catch (err) {
    if (err) {
      console.log(err);
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  getUsermsg();
});

async function checkUsermsg(id) {
  const btn = document.getElementById("check-btn");
  const res = await fetch(
    "https://backendroutes-lcpt.onrender.com/checkUsermsg",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    }
  );

  if (res.ok) {
    getNotSeenMessages();
    const checkbtn = document.getElementById(`${id}`);
    checkbtn.style.display = "none";
  }
}

async function deleteUsermsg(id, btn) {
  const res = await fetch(
    "https://backendroutes-lcpt.onrender.com/deleteUsermsg",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    }
  );

  if (res.ok) {
    getNotSeenMessages();
    // Remove the whole message <p> element from DOM
    btn.closest("p").remove();
  } else {
    console.error("Failed to delete message");
  }
}

async function getNotSeenMessages() {
  const btn = document.getElementById("notification-badge");
  const token = cryptoServiveqwertypoiu.getItem("accessToken");
  const res = await fetch(
    "https://backendroutes-lcpt.onrender.com/getNotSeenMessages",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    }
  );

  const data = await res.json();
  const unseenmsg = data.number;
  unseenmsg ? (btn.innerHTML = unseenmsg) : (btn.innerHTML = 0);
}

getNotSeenMessages();

///Load Transactions
async function loadTransactions() {
  try {
    // 1️⃣ Get token from sessionStorage
    const token = sessionStorage.getItem("accessToken");
    if (!token) {
      console.warn("⚠️ No access token found. Cannot fetch transactions.");
      return;
    }

    // 2️⃣ Fetch transactions from backend
    const res = await fetch(
      "https://backendroutes-lcpt.onrender.com/transactions",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // send token in header
        },
      }
    );

    if (!res.ok) {
      throw new Error(`Server returned ${res.status}`);
    }

    const transactions = await res.json();
    console.log("✅ Transactions fetched:", transactions);

    // 3️⃣ Render transactions in the table
    const tbody = document.querySelector("#transactions tbody");
    tbody.innerHTML = ""; // clear existing rows

    transactions.forEach((tx) => {
      const tr = document.createElement("tr");

      // Date
      const dateTd = document.createElement("td");
      const txDate = new Date(tx.created_at);
      dateTd.textContent = txDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
      tr.appendChild(dateTd);

      // Type
      const typeTd = document.createElement("td");
      typeTd.textContent = tx.type;
      tr.appendChild(typeTd);

      // Amount
      const amountTd = document.createElement("td");
      amountTd.textContent =
        (tx.type === "withdrawal" ? "-" : "+") + tx.amount + " USD";
      amountTd.className =
        tx.type === "withdrawal"
          ? "transaction-positive"
          : "transaction-positive";
      tr.appendChild(amountTd);

      // Status
      const statusTd = document.createElement("td");
      const span = document.createElement("span");
      span.className =
        "status-badge " +
        (tx.status === "pending"
          ? "status-pending"
          : tx.status === "confirmed"
          ? "status-completed"
          : "status-failed");

      span.textContent = tx.status.charAt(0).toUpperCase() + tx.status.slice(1);
      statusTd.appendChild(span);
      tr.appendChild(statusTd);

      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error("❌ Error fetching transactions:", err);
  }
}

// Load transactions on page load
window.addEventListener("DOMContentLoaded", loadTransactions);
