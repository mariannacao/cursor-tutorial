const paletteEl = document.getElementById("palette");
const randomBtn = document.getElementById("btn-random");
const moodButtons = document.querySelectorAll(".btn-mood");
const themeButtons = document.querySelectorAll(".theme-icon-btn");
const previewContainer = document.getElementById("preview-container");
const togglePreviewBtn = document.getElementById("btn-toggle-preview");
const previewToggleText = togglePreviewBtn.querySelector(".preview-toggle-text");

const TILE_COUNT = 6;
let currentColors = [];

const moodPalettes = {
  calm: ["#c7d2fe", "#bfdbfe", "#e0f2fe", "#a5b4fc", "#93c5fd", "#dbeafe"],
  energetic: ["#f97316", "#facc15", "#ef4444", "#22c55e", "#ec4899", "#06b6d4"],
  soft: ["#f9a8d4", "#fed7aa", "#fee2e2", "#e9d5ff", "#bbf7d0", "#fef9c3"],
};

function randomHexColor() {
  const n = Math.floor(Math.random() * 0xffffff);
  return "#" + n.toString(16).padStart(6, "0");
}

function generateRandomPalette(count) {
  const colors = [];
  for (let i = 0; i < count; i++) {
    colors.push(randomHexColor());
  }
  return colors;
}

function renderPalette(colors, moodLabel) {
  paletteEl.innerHTML = "";
  currentColors = colors; // Store current colors for preview

  colors.forEach((color) => {
    const tile = document.createElement("div");
    tile.className = "tile";
    tile.style.background = color;

    const label = document.createElement("div");
    label.className = "tile__label";
    label.textContent = color.toUpperCase();

    const moodTag = document.createElement("div");
    moodTag.className = "tile__mood-tag";
    moodTag.textContent = moodLabel || "Random";

    tile.appendChild(label);
    tile.appendChild(moodTag);

    tile.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(color);
        label.textContent = "Copied!";
        setTimeout(() => {
          label.textContent = color.toUpperCase();
        }, 800);
      } catch (err) {
        console.error("Clipboard error", err);
      }
    });

    paletteEl.appendChild(tile);
  });

  // Update preview if it's visible
  if (previewContainer.style.display !== "none") {
    updatePreview(colors);
  }
}

randomBtn.addEventListener("click", () => {
  const colors = generateRandomPalette(TILE_COUNT);
  renderPalette(colors, "Random");
});

moodButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const mood = btn.dataset.mood;
    const colors = moodPalettes[mood] || generateRandomPalette(TILE_COUNT);
    renderPalette(colors, mood[0].toUpperCase() + mood.slice(1));
  });
});

// Theme switching
function setTheme(theme) {
  if (theme === "default") {
    document.body.removeAttribute("data-theme");
  } else {
    document.body.setAttribute("data-theme", theme);
  }
  localStorage.setItem("selectedTheme", theme);
  
  // Update active state on buttons
  themeButtons.forEach((btn) => {
    if (btn.dataset.theme === theme) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });
}

function initTheme() {
  const savedTheme = localStorage.getItem("selectedTheme") || "default";
  setTheme(savedTheme);
}

themeButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const theme = btn.dataset.theme;
    setTheme(theme);
  });
});

// Preview functionality
function updatePreview(colors) {
  if (!colors || colors.length === 0) return;

  const headerMockup = document.getElementById("preview-header-mockup");
  const card1 = document.getElementById("preview-card-1");
  const card2 = document.getElementById("preview-card-2");
  const footerMockup = document.getElementById("preview-footer-mockup");
  const navLinks = document.querySelectorAll(".preview-nav-link");
  const previewBtns = document.querySelectorAll(".preview-btn");

  // Apply colors to different elements
  // Header background uses first color
  if (headerMockup) {
    headerMockup.style.background = colors[0];
    headerMockup.style.color = getContrastColor(colors[0]);
  }

  // Nav links use second color
  navLinks.forEach((link) => {
    link.style.color = colors[1] || colors[0];
  });

  // Card 1 uses third color
  if (card1) {
    card1.style.background = colors[2] || colors[0];
    card1.style.color = getContrastColor(colors[2] || colors[0]);
  }

  // Card 2 uses fourth color
  if (card2) {
    card2.style.background = colors[3] || colors[1];
    card2.style.color = getContrastColor(colors[3] || colors[1]);
  }

  // Primary button uses fifth color
  if (previewBtns[0]) {
    previewBtns[0].style.background = colors[4] || colors[2];
    previewBtns[0].style.color = getContrastColor(colors[4] || colors[2]);
  }

  // Secondary button uses sixth color
  if (previewBtns[1]) {
    previewBtns[1].style.color = colors[5] || colors[3];
    previewBtns[1].style.borderColor = colors[5] || colors[3];
  }

  // Footer uses first color with opacity
  if (footerMockup) {
    footerMockup.style.background = colors[0];
    footerMockup.style.color = getContrastColor(colors[0]);
  }
}

// Helper function to determine if text should be light or dark
function getContrastColor(hexColor) {
  if (!hexColor) return "#000000";
  
  // Remove # if present
  const hex = hexColor.replace("#", "");
  
  // Convert to RGB
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // Return black or white based on luminance
  return luminance > 0.5 ? "#000000" : "#ffffff";
}

// Toggle preview visibility
let previewVisible = false;
togglePreviewBtn.addEventListener("click", () => {
  previewVisible = !previewVisible;
  
  if (previewVisible) {
    previewContainer.style.display = "block";
    previewToggleText.textContent = "Hide Preview";
    updatePreview(currentColors);
  } else {
    previewContainer.style.display = "none";
    previewToggleText.textContent = "Show Preview";
  }
});

// initial state
initTheme();
renderPalette(generateRandomPalette(TILE_COUNT), "Random");
