// Get elements for dashboard

async function dashboardAuth() {
  let token = sessionStorage.getItem("accessToken");
  //redirect to login page if user dosent have a token
  if (!token) return redirectToLogin();
  //Else mk a request for dashboard access
  let res = await fetchDashboard(token);
  //incase token has expired
  if (res.status === 401) {
    // Try refresh token
    const refreshed = await requestToken();
    if (!refreshed) return redirectToLogin();
  }

  const data = await res.json();
  const usernameDisplayy = document.getElementById("usernamee");
  const userAvatarr = document.getElementById("user-avatarr");

  //display name
  usernameDisplayy
    ? (usernameDisplayy.textContent = data.username)
    : (usernameDisplayy.textContent = "Guest");

  //display avatar
  userAvatarr.textContent = data.username.slice(0, 2);
}

dashboardAuth();

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
    return redirectToLogin();
  }
}

async function requestToken() {
  const refreshToken = sessionStorage.getItem("refreshToken");
  if (!refreshToken) return redirectToLogin();

  try {
    const res = await fetch("https://backendroutes-lcpt.onrender.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: refreshToken }),
    });
    if (!res.ok) return redirectToLogin();

    const data = await res.json();
    sessionStorage.setItem("accessToken", data.accessToken);

    return true;
  } catch (err) {
    console.error("Token refresh failed:", err);
    return redirectToLogin();
  }
}

function redirectToLogin() {
  window.location.href = "login.html";
}
