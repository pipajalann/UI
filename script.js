// Live Clock & Date (Indonesian)
const topClock = document.getElementById("top-clock");
const trayDay = document.getElementById("tray-day");
const tileClock = document.getElementById("tile-clock");
const tileDate = document.getElementById("tile-date");
const lockClock = document.getElementById("lock-clock");
const lockDate = document.getElementById("lock-date");

const hari = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
const bulan = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

function updateClock() {
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  const timeStr = `${hh}:${mm}`;
  const dateStr = `${hari[now.getDay()]}, ${now.getDate()} ${bulan[now.getMonth()]} ${now.getFullYear()}`;

  topClock.textContent = timeStr;
  trayDay.textContent = `${String(now.getDate()).padStart(2, "0")}/${String(now.getMonth() + 1).padStart(2, "0")}`;
  tileClock.textContent = timeStr;
  tileDate.textContent = dateStr;
  lockClock.textContent = timeStr;
  lockDate.textContent = dateStr;
}
updateClock();
setInterval(updateClock, 15000);

// Pivot Navigation
const tabs = document.querySelectorAll(".pivot-tab");
const views = {
  start: document.getElementById("view-start"),
  system: document.getElementById("view-system"),
};

function switchView(name) {
  tabs.forEach((t) => t.classList.toggle("active", t.dataset.view === name));
  Object.entries(views).forEach(([key, el]) => {
    el.classList.toggle("active", key === name);
  });
}

tabs.forEach((tab) => {
  tab.addEventListener("click", () => switchView(tab.dataset.view));
});

document.getElementById("bar-start").addEventListener("click", () => switchView("start"));
document.getElementById("bar-theme").addEventListener("click", () => switchView("system"));
document.getElementById("open-theme-tile").addEventListener("click", () => switchView("system"));

// Toast notification
const toast = document.getElementById("toast");
let toastTimer = null;

function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2000);
}

document.querySelectorAll("[data-app]").forEach((btn) => {
  btn.addEventListener("click", () => {
    showToast(`Membuka ${btn.dataset.app}...`);
  });
});

// Music Tile Play/Pause Toggle
const musicTile = document.getElementById("music-tile");
const musicStatus = document.getElementById("music-status");
const eqBars = document.getElementById("eq-bars");

musicTile.addEventListener("click", () => {
  const paused = eqBars.classList.toggle("paused");
  musicStatus.textContent = paused ? "DIJEDA" : "SEDANG DIPUTAR";
});

// Accent Color Switcher
const swatches = document.querySelectorAll(".swatch");
swatches.forEach((swatch) => {
  swatch.addEventListener("click", () => {
    document.documentElement.style.setProperty("--accent", swatch.dataset.accent);
    swatches.forEach((s) => s.classList.remove("active"));
    swatch.classList.add("active");
    showToast("Warna aksen diperbarui");
  });
});

// Dark / Light Theme Switcher
const darkBtn = document.getElementById("theme-dark-btn");
const lightBtn = document.getElementById("theme-light-btn");

darkBtn.addEventListener("click", () => {
  document.documentElement.setAttribute("data-theme", "dark");
  darkBtn.classList.add("active");
  lightBtn.classList.remove("active");
});

lightBtn.addEventListener("click", () => {
  document.documentElement.setAttribute("data-theme", "light");
  lightBtn.classList.add("active");
  darkBtn.classList.remove("active");
});

// Live Flip Animation Toggle
const flipOnBtn = document.getElementById("flip-on-btn");
const flipOffBtn = document.getElementById("flip-off-btn");

flipOnBtn.addEventListener("click", () => {
  document.body.classList.remove("no-flip");
  flipOnBtn.classList.add("active");
  flipOffBtn.classList.remove("active");
});

flipOffBtn.addEventListener("click", () => {
  document.body.classList.add("no-flip");
  flipOffBtn.classList.add("active");
  flipOnBtn.classList.remove("active");
});

// App List Search Filter (Type-to-Search, hidden until key pressed)
const sidebarHead = document.getElementById("sidebar-head");
const searchInput = document.getElementById("app-search");
const appGroups = document.querySelectorAll(".app-group");

function filterApps(query) {
  const q = query.trim().toLowerCase();
  appGroups.forEach((group) => {
    const items = group.querySelectorAll(".app-item");
    let visibleCount = 0;
    items.forEach((item) => {
      const match = item.textContent.toLowerCase().includes(q);
      item.style.display = match ? "flex" : "none";
      if (match) visibleCount++;
    });
    group.style.display = visibleCount > 0 ? "flex" : "none";
  });
}

function openSearch(initialChar = "") {
  switchView("start");
  sidebarHead.classList.add("search-open");
  if (initialChar) {
    searchInput.value = initialChar;
    filterApps(initialChar);
  }
  searchInput.focus();
}

function closeSearch() {
  searchInput.value = "";
  filterApps("");
  searchInput.blur();
  sidebarHead.classList.remove("search-open");
}

searchInput.addEventListener("input", () => {
  filterApps(searchInput.value);
  if (!searchInput.value) {
    closeSearch();
  }
});

searchInput.addEventListener("blur", () => {
  if (!searchInput.value.trim()) {
    sidebarHead.classList.remove("search-open");
  }
});

// Lockscreen Overlay
const lockscreen = document.getElementById("lockscreen");
function toggleLock(open) {
  lockscreen.classList.toggle("open", open);
  lockscreen.setAttribute("aria-hidden", String(!open));
}

document.getElementById("bar-lock").addEventListener("click", () => toggleLock(true));
document.getElementById("lock-tile").addEventListener("click", () => toggleLock(true));
lockscreen.addEventListener("click", () => toggleLock(false));

window.addEventListener("keydown", (e) => {
  if (lockscreen.classList.contains("open")) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleLock(false);
    }
    return;
  }

  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
    e.preventDefault();
    openSearch();
    return;
  }

  if (e.key === "Escape" && sidebarHead.classList.contains("search-open")) {
    e.preventDefault();
    closeSearch();
    return;
  }

  if (e.key === "Enter" && document.activeElement === searchInput) {
    const firstMatch = Array.from(document.querySelectorAll(".app-item")).find(
      (el) => el.style.display !== "none"
    );
    if (firstMatch) {
      firstMatch.click();
      closeSearch();
    }
    return;
  }

  // Type-to-search: langsung ketik huruf/angka apa saja saat tidak fokus di input
  if (
    document.activeElement !== searchInput &&
    !e.ctrlKey &&
    !e.metaKey &&
    !e.altKey &&
    e.key.length === 1 &&
    /^[a-zA-Z0-9]$/.test(e.key)
  ) {
    e.preventDefault();
    openSearch(e.key);
  }
});
