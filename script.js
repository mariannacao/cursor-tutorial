const paletteEl = document.getElementById("palette");
const randomBtn = document.getElementById("btn-random");
const moodButtons = document.querySelectorAll(".btn-mood");

const TILE_COUNT = 6;

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

// initial state
renderPalette(generateRandomPalette(TILE_COUNT), "Random");
