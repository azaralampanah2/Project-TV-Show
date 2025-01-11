let allEpisodes = [];

const state ={
  allShows:[],
  filteredShows: []
}
async function setup() {
  console.log('set up');
  await fetchEpisodes();
  await fetchShows();
}

// Fetch episodes from API
 function fetchEpisodes() {
  console.log('fetched');
  const root = document.getElementById("root");
  const loadingMessage = document.createElement("p");
  loadingMessage.id = "loadingMessage";
  loadingMessage.textContent = "Loading episodes, please wait...";
  root.append(loadingMessage);

  
    fetch("https://api.tvmaze.com/shows/82/episodes")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch episodes.");
        }
        return response.json(); // Return parsed JSON data
      })
      .then((data) => {
        console.log(data, "2episode data");
        allEpisodes = data; 
        loadingMessage.remove(); // Remove loading message
        renderAllEpisodes(); 
        populateDropdown(); 
      })
      .catch((err) => {
        console.error(err);
        loadingMessage.textContent = "Error loading episodes. Please try again later.";
      });
  }
   


function getEpisodeCode(episode) {
  return `S${String(episode.season).padStart(2, "0")}E${String(episode.number).padStart(2, "0")}`;
}

function makePageForEpisodes(episode) {
  const filmTemplate = document
    .getElementById("filmEpisodes")
    .content.cloneNode(true);

  filmTemplate.querySelector("h3").textContent = `${episode.name} ${getEpisodeCode(episode)}`;
  filmTemplate.querySelector("img").src = episode.image.medium;
  filmTemplate.querySelector("p").textContent = episode.summary.replace(/<[^>]*>/g, '');
  return filmTemplate;
}

function clearEpisodes() {
  const sections = document.querySelectorAll("#root section");
  sections.forEach(section => section.remove());
}

function renderAllEpisodes() {
  clearEpisodes();
  allEpisodes.forEach(episode => {
    document.getElementById("root").append(makePageForEpisodes(episode));
  });
  updateDisplayLabel(allEpisodes.length);
}

function updateDisplayLabel(count) {
  const displayLabel = document.getElementById("display-label");
  displayLabel.textContent = `Displaying ${count}/${allEpisodes.length} episodes`;
}

document.getElementById("search-input").addEventListener("keyup", function () {
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

const dropdownMenu = document.getElementById("dropdown");

function populateDropdown() {
  dropdownMenu.innerHTML = '<option value="" disabled selected>Choose an Episode</option>';
  allEpisodes.forEach(episode => {
    const option = document.createElement("option");
    option.value = getEpisodeCode(episode);
    option.text = `${getEpisodeCode(episode)} - ${episode.name}`;
    dropdownMenu.appendChild(option);
  });
}

dropdownMenu.addEventListener("change", function () {
  const selectedCode = this.value;
  const matchedEpisode = allEpisodes.find(episode => getEpisodeCode(episode) === selectedCode);

  if (matchedEpisode) {
    clearEpisodes();
    document.getElementById("root").append(makePageForEpisodes(matchedEpisode));

    const goBackButton = document.createElement("button");
    goBackButton.textContent = "Go Back to All Episodes";
    goBackButton.id = "goBackButton";
    document.getElementById("root").append(goBackButton);

    goBackButton.addEventListener("click", function () {
      renderAllEpisodes();
      this.remove();
      dropdownMenu.selectedIndex = 0;
    });
  }
});

//level 400
//fetch shows and populate shows-dropdown
const dropdownShowMenu = document.getElementById("show-dropdown");

function fetchShows() {
  const root = document.getElementById("root");
  const loadingMessage = document.createElement("p");
  loadingMessage.id = "loadingMessage";
  loadingMessage.textContent = "Loading shows, please wait...";
  root.append(loadingMessage);

  fetch("https://api.tvmaze.com/shows")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch shows.");
      }
      return response.json(); // Return parsed JSON data
    })
    .then((data) => {
      console.log(data, "shows data");  
      state.allShows = data;
      loadingMessage.remove(); // Remove loading message

      // Populate the dropdown menu
      dropdownShowMenu.innerHTML = '<option value="" disabled selected>Choose a Show</option>';
      state.allShows.forEach((show) => {
        const option = document.createElement("option");
        option.value = show.id; // Use the show ID for reference
        option.textContent = show.name; // Show name in the dropdown
        dropdownShowMenu.appendChild(option); // Append option to dropdown
      });
    })
    .catch((err) => {
      console.error(err);
      loadingMessage.textContent = "Error loading shows. Please try again later.";
    });
}

// Call the function on window load
window.onload = setup;
