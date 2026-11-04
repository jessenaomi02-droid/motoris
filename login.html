
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Motoris | Sign In</title>

  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: Arial, sans-serif;
    }

    body {
      min-height: 100vh;
      background: #f3f6fb;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }

    .login-wrap {
      width: 100%;
      max-width: 420px;
    }

    .card {
      background: #fff;
      padding: 40px 32px;
      border-radius: 14px;
      box-shadow: 0 8px 30px rgba(0,0,0,0.08);
    }

    h2 {
      font-size: 30px;
      color: #1261d6;
      text-align: center;
      margin-bottom: 10px;
    }

    .muted {
      color: #777;
      text-align: center;
      margin-bottom: 30px;
    }

    label {
      display: block;
      margin: 18px 0 8px;
      color: #333;
      font-weight: 600;
      font-size: 14px;
    }

    input {
      width: 100%;
      padding: 13px;
      border: 1px solid #d5dce8;
      border-radius: 7px;
      font-size: 15px;
      outline: none;
    }

    input:focus {
      border-color: #1261d6;
      box-shadow: 0 0 0 3px rgba(18,97,214,0.1);
    }

    .btn {
      width: 100%;
      padding: 14px;
      margin-top: 25px;
      border: none;
      border-radius: 7px;
      background: #1261d6;
      color: white;
      font-size: 16px;
      font-weight: bold;
      cursor: pointer;
    }

    .btn:hover {
      background: #0d4eaf;
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .error {
      background: #fff0f0;
      color: #c62828;
      padding: 12px;
      border-radius: 6px;
      font-size: 14px;
      margin-bottom: 15px;
    }

    .footer {
      text-align: center;
      color: #999;
      font-size: 12px;
      margin-top: 25px;
    }
  </style>
</head>

<body>

  <div class="login-wrap">
    <form class="card" id="loginForm">

      <h2>Motoris</h2>
      <p class="muted">Sign in to continue</p>

      <div id="errorMessage" class="error" hidden></div>

      <label for="email">Email</label>
      <input
        type="email"
        id="email"
        placeholder="Enter your email"
        required
      >

      <label for="password">Password</label>
      <input
        type="password"
        id="password"
        placeholder="Enter your password"
        required
      >

      <button type="submit" class="btn" id="loginButton">
        Sign in
      </button>

      <p class="footer">Motoris Vehicle Management System</p>

    </form>
  </div>

  <script>
    const API_URL = "https://motoris-tvsg.onrender.com";

    const form = document.getElementById("loginForm");
    const button = document.getElementById("loginButton");
    const errorMessage = document.getElementById("errorMessage");

    form.addEventListener("submit", async function(e) {
      e.preventDefault();

      errorMessage.hidden = true;
      button.disabled = true;
      button.textContent = "Signing in…";

      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value;

      try {
        const response = await fetch(`${API_URL}/api/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Login failed");
        }

        // Save the authenticated session.
        sessionStorage.setItem("motorisToken", data.token);
        sessionStorage.setItem("motorisUser", JSON.stringify(data.user));

        // Redirect after successful login.
        window.location.href = "dashboard.html";

      } catch (error) {
        errorMessage.textContent = error.message;
        errorMessage.hidden = false;

        button.disabled = false;
        button.textContent = "Sign in";
      }
    });
  </script>

</body>
</html>
