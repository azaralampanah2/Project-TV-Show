function setup() {
  renderAllEpisodes();
}

const allEpisodes = getAllEpisodes();

// Helper to get formatted episode code
function getEpisodeCode(episode) {
  return `S${String(episode.season).padStart(2, "0")}E${String(episode.number).padStart(2, "0")}`;
}

// Generate episode template
function makePageForEpisodes(episode) {
  const filmTemplate = document
    .getElementById("filmEpisodes")
    .content.cloneNode(true);

  filmTemplate.querySelector("h3").textContent = `${episode.name} ${getEpisodeCode(episode)}`;
  filmTemplate.querySelector("img").src = episode.image.medium;
  filmTemplate.querySelector("p").textContent = episode.summary.replace(/<[^>]*>/g, '');
  return filmTemplate;
}

// Clear displayed episodes
function clearEpisodes() {
  const sections = document.querySelectorAll("#root section");
  sections.forEach(section => section.remove());
}

// Render all episodes
function renderAllEpisodes() {
  clearEpisodes();
  allEpisodes.forEach(episode => {
    document.getElementById("root").append(makePageForEpisodes(episode));
  });
  updateDisplayLabel(allEpisodes.length);
}

// Update display label
function updateDisplayLabel(count) {
  const displayLabel = document.getElementById("display-label");
  displayLabel.textContent = `Displaying ${count}/${allEpisodes.length} episodes`;
}

// Search functionality
document.getElementById("search-input").addEventListener("keyup", function() {
  const query = this.value.toLowerCase();
  const matchedEpisodes = allEpisodes.filter(
    episode =>
      episode.name.toLowerCase().includes(query) ||
      episode.summary.toLowerCase().includes(query)
  );

  clearEpisodes();
  matchedEpisodes.forEach(episode => {
    document.getElementById("root").append(makePageForEpisodes(episode));
  });
  updateDisplayLabel(matchedEpisodes.length);
});

// Populate dropdown
const dropdownMenu = document.getElementById("dropdown");
allEpisodes.forEach(episode => {
  const option = document.createElement("option");
  option.value = getEpisodeCode(episode);
  option.text = `${getEpisodeCode(episode)} - ${episode.name}`;
  dropdownMenu.appendChild(option);
});

// Handle dropdown selection
dropdownMenu.addEventListener("change", function() {
  const selectedCode = this.value;
  const matchedEpisode = allEpisodes.find(episode => getEpisodeCode(episode) === selectedCode);

  if (matchedEpisode) {
    clearEpisodes();
    document.getElementById("root").append(makePageForEpisodes(matchedEpisode));

    const goBackButton = document.createElement("button");
    goBackButton.textContent = "Go Back to All Episodes";
    goBackButton.id = "goBackButton";
    document.getElementById("root").append(goBackButton);

    goBackButton.addEventListener("click", function() {
      renderAllEpisodes();
      this.remove();
      dropdownMenu.selectedIndex = 0;
    });
  }
});

window.onload = setup;
