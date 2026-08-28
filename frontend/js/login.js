// ==========================================
// LOGIN
// ==========================================

const loginForm = document.getElementById("loginForm");
const loginButton = document.getElementById("loginButton");
const errorMessage = document.getElementById("errorMessage");

// ==========================================
// LOGIN FORM SUBMIT
// ==========================================

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Get values
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    // Hide previous error
    errorMessage.classList.add("hidden");
    errorMessage.textContent = "";

    // Disable button
    loginButton.disabled = true;
    loginButton.textContent = "Logging in...";

    try {
        // ==========================================
        // CALL BACKEND
        // ==========================================

        const data = await apiRequest("/auth/login", {
            method: "POST",
            body: JSON.stringify({
                email,
                password
            })
        });

        console.log("LOGIN RESPONSE:", data);

        // ==========================================
        // CHECK RESPONSE
        // ==========================================

        if (!data.token) {
            throw new Error("Login succeeded but no authentication token was returned.");
        }

        // ==========================================
        // SAVE TOKEN
        // ==========================================

        localStorage.setItem("token", data.token);

        // ==========================================
        // SAVE USER
        // ==========================================

        if (data.user) {
            localStorage.setItem("user", JSON.stringify(data.user));
        }

        // ==========================================
        // CHECK USER ROLE
        // ==========================================

        const user = data.user;

        if (!user) {
            throw new Error("User information was not returned.");
        }

       console.log("User role:", user.role);

const role = user.role?.toUpperCase();

if (role === "ADMIN") {
    console.log("Redirecting to admin dashboard...");
    window.location.href = "dashboard.html";
    return;
}

if (role === "CUSTOMER") {
    console.log("Redirecting to customer homepage...");
    window.location.href = "../index.html";
    return;
}

if (role === "WAITER") {
    console.log("Redirecting to waiter page...");
    window.location.href = "../index.html";
    return;
}

throw new Error("Unknown user role: " + user.role);

    } catch (error) {
        console.error("LOGIN ERROR:", error);

        // Show error
        errorMessage.textContent = error.message || "Login failed.";
        errorMessage.classList.remove("hidden");

    } finally {
        // Enable button
        loginButton.disabled = false;
        loginButton.textContent = "Login";
    }
});