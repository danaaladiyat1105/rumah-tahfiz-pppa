// app.js (untuk login)

document.getElementById("input-box").addEventListener("submit", function (e) {
  e.preventDefault(); // Mencegah form dari reload halaman

  const text = document.getElementById("text").value;
  const password = document.getElementById("password").value;

  // Validasi kredensial (contoh sederhana)
  if (text === "admin" && password === "password") {
    localStorage.setItem("loggedIn", "true"); // Simpan status login
    window.location.href = "dashboard.html"; // Arahkan ke dashboard
  } else {
    alert("Username atau password salah");
  }
});

document.addEventListener("DOMContentLoaded", function () {
  // Periksa status login
  if (localStorage.getItem("loggedIn") !== "true") {
    window.location.href = "index.html"; // Jika tidak login, arahkan ke login
  }
});
