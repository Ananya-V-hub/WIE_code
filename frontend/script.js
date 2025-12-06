// Simple frontend script for CollabX Lite
const API_BASE = "http://localhost:3000";

// Save user session (dummy)
function saveUser(name, email) {
    localStorage.setItem("collabxUser", JSON.stringify({ name, email }));
}

// Get current user
function getUser() {
    return JSON.parse(localStorage.getItem("collabxUser"));
}

// Logout
function logout() {
    localStorage.removeItem("collabxUser");
    alert("You have been logged out!");
    window.location.href = "index.html";
}

// Temporary message
console.log("CollabX Lite Frontend Loaded");
async function registerUser() {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // update the skills input if your UI has dropdown
    const skills = ["student"];

    try {
        const res = await fetch(`${API_BASE}/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name, email, password, skills })
        });

        const data = await res.json();
        console.log("REGISTER RESPONSE:", data);

        if (data.error) {
            alert(data.error);
        } else {
            alert("Registered Successfully!");

            // Save local session
            saveUser(name, email);

            window.location.href = "dashboard.html";
        }

    } catch (err) {
        console.error(err);
        alert("Backend unreachable");
    }
}

async function loginUser() {
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    try {
        const res = await fetch(`${API_BASE}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();
        console.log("LOGIN RESPONSE:", data);

        if (data.error) {
            alert("Invalid login credentials");
        } else {
            alert("Login Successful!");

            localStorage.setItem("collabXuser", JSON.stringify(data.user));

            window.location.href = "dashboard.html";
        }

    } catch (err) {
        console.error(err);
        alert("Backend unreachable");
    }
}

