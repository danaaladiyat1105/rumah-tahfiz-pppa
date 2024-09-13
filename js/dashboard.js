// Fungsi untuk menghitung usia dari tanggal lahir
const calculateAge = (birthdate) => {
  const today = new Date();
  const birthDate = new Date(birthdate);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();
  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age;
};

// Menu dan sidebar
const menuButton = document.getElementById("menu-checkbox");
const sidebar = document.querySelector(".sidebar");
const overlay = document.querySelector(".overlay");
const listItems = document.querySelectorAll(".list-item a");
const contentSections = document.querySelectorAll(".content-section");

// Fungsi untuk menutup sidebar
function closeSidebar() {
  sidebar.classList.remove("show");
  overlay.classList.remove("show");
  menuButton.checked = false;
}

menuButton.addEventListener("change", () => {
  if (menuButton.checked) {
    sidebar.classList.add("show");
    overlay.classList.add("show");
  } else {
    closeSidebar();
  }
});

overlay.addEventListener("click", closeSidebar);

listItems.forEach((item) => {
  item.addEventListener("click", (e) => {
    e.preventDefault();

    if (window.innerWidth <= 768) {
      closeSidebar();
    }

    contentSections.forEach((section) => {
      section.classList.remove("active");
    });

    const contentId = item.getAttribute("data-content");
    document.getElementById(contentId).classList.add("active");

    // Simpan ID konten aktif ke LocalStorage
    localStorage.setItem("activeContent", contentId);
  });
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 768) {
    closeSidebar();
  }
});

// Fungsi untuk menyimpan dan memuat data santri dari LocalStorage
document.addEventListener("DOMContentLoaded", () => {
  const showFormButton = document.getElementById("show-form-button");
  const santriForm = document.getElementById("santri-form");
  const santriTable = document.getElementById("santri-table");
  const submitButton = document.getElementById("submit");

  const saveToLocalStorage = (santriData) => {
    const santriList = JSON.parse(localStorage.getItem("santriList")) || [];
    santriList.push(santriData);
    localStorage.setItem("santriList", JSON.stringify(santriList));
  };

  const loadFromLocalStorage = () => {
    const santriList = JSON.parse(localStorage.getItem("santriList")) || [];
    santriList.forEach((santriData) => {
      addSantriCard(santriData);
    });
  };

  const addSantriCard = (santriData) => {
    const card = document.createElement("div");
    card.className = "santri-card";
    card.innerHTML = `
      <img src="${santriData.photo}" alt="Santri Foto">
      <h1>${santriData.name}</h1>
      <h4>${santriData.hafalan} Juz</h4>
      <p>${calculateAge(santriData.birthdate)} tahun</p>
      <p class="title">${santriData.address}</p>
      <p>${santriData.wali}</p>
      <button class="delete-button">Hapus Data</button>
    `;
    santriTable.appendChild(card);
  };

  showFormButton.addEventListener("click", () => {
    santriForm.style.display =
      santriForm.style.display === "none" ? "block" : "none";
  });

  submitButton.addEventListener("click", (e) => {
    e.preventDefault();

    const name = document.getElementById("santri-name").value;
    const address = document.getElementById("santri-address").value;
    const birthdate = document.getElementById("santri-birthdate").value;
    const hafalan = document.getElementById("santri-hafalan").value;
    const wali = document.getElementById("santri-wali").value;
    const photo = document.getElementById("santri-photo").files[0];

    if (name && address && birthdate && hafalan && wali && photo) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imgURL = e.target.result;

        const santriData = {
          name,
          address,
          birthdate,
          hafalan,
          wali,
          photo: imgURL,
        };

        addSantriCard(santriData);
        saveToLocalStorage(santriData);

        santriForm.style.display = "none";
        santriForm.reset();
      };
      reader.readAsDataURL(photo);
    } else {
      alert("Semua field harus diisi!");
    }
  });

  const removeFromLocalStorage = (name) => {
    const santriList = JSON.parse(localStorage.getItem("santriList")) || [];
    const updatedList = santriList.filter(
      (santriData) => santriData.name !== name
    );
    localStorage.setItem("santriList", JSON.stringify(updatedList));
  };

  santriTable.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete-button")) {
      const card = e.target.closest(".santri-card");
      const santriName = card.querySelector("h1").textContent;

      if (
        confirm(`Apakah Anda yakin ingin menghapus data santri: ${santriName}?`)
      ) {
        card.remove();
        removeFromLocalStorage(santriName);
      }
    }
  });

  loadFromLocalStorage();
});

// Fungsi untuk mengaktifkan konten berdasarkan ID
const activateContent = (contentId) => {
  contentSections.forEach((section) => {
    section.classList.remove("active");
  });
  const activeSection = document.getElementById(contentId);
  if (activeSection) {
    activeSection.classList.add("active");
  }
};

// Muat konten aktif dari LocalStorage
const activeContent = localStorage.getItem("activeContent");
if (activeContent) {
  activateContent(activeContent);
} else {
  if (contentSections.length > 0) {
    activateContent(contentSections[0].id);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const saveAttendanceButton = document.getElementById(
    "save-attendance-button"
  );
  const toggleRecapButton = document.getElementById("toggle-recap");
  const recapContainer = document.getElementById("recap-container");
  const santriTableBody = document.querySelector("#santri-table tbody");
  const recapTableBody = document.querySelector("#recap-table tbody");

  // Fungsi untuk menambahkan data santri ke tabel kehadiran
  const addSantriToAttendanceTable = () => {
    const santriData = JSON.parse(localStorage.getItem("santriList")) || [];
    const today = new Date().toISOString().split("T")[0]; // Format YYYY-MM-DD

    santriTableBody.innerHTML = ""; // Kosongkan tabel sebelum menambahkan data

    santriData.forEach((santri) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${santri.name}</td>
        <td>${today}</td>
        <td><input type="checkbox" data-name="${santri.name}" /></td>
      `;
      santriTableBody.appendChild(row);
    });
  };

  // Fungsi untuk menyimpan kehadiran ke LocalStorage
  const saveAttendance = () => {
    const rows = santriTableBody.querySelectorAll("tr");
    const attendanceData = [];
    const date = new Date().toISOString().split("T")[0]; // Format YYYY-MM-DD

    rows.forEach((row) => {
      const name = row.querySelector("td:nth-child(1)").textContent;
      const present = row.querySelector("input[type='checkbox']").checked;

      attendanceData.push({ name, date, present });
    });

    localStorage.setItem("attendanceData", JSON.stringify(attendanceData));
    alert("Kehadiran telah disimpan!");
  };

  // Fungsi untuk memuat data santri dari LocalStorage
  const loadSantriData = () => {
    return JSON.parse(localStorage.getItem("santriList")) || [];
  };

  // Fungsi untuk memuat data rekap kehadiran
  const loadRecapTable = () => {
    const santriList = loadSantriData();
    const attendanceData =
      JSON.parse(localStorage.getItem("attendanceData")) || [];
    recapTableBody.innerHTML = ""; // Kosongkan tabel rekap sebelum menambahkan data

    santriList.forEach((santri) => {
      const rows = attendanceData.filter((entry) => entry.name === santri.name);
      const totalPresent = rows.filter((entry) => entry.present).length;
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${santri.name}</td>
        <td>${totalPresent}</td> <!-- Total kehadiran -->
      `;
      recapTableBody.appendChild(row);
    });
  };

  // Fungsi untuk menampilkan atau menyembunyikan rekap kehadiran
  const toggleRecap = () => {
    recapContainer.style.display =
      recapContainer.style.display === "none" ? "block" : "none";
    if (recapContainer.style.display === "block") {
      loadRecapTable();
    }
  };

  // Event listener untuk tombol simpan kehadiran
  saveAttendanceButton.addEventListener("click", saveAttendance);

  // Event listener untuk tombol tampilkan/tutup rekap kehadiran
  toggleRecapButton.addEventListener("click", toggleRecap);

  // Menambahkan data santri ke tabel ketika halaman dimuat
  addSantriToAttendanceTable();
});
