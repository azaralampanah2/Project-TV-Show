
const state ={
  allShows:[],
  allEpisodes: [], 
  searchTerm: "",
  showQuery:"",
  fetchedUrls: {},
}
async function setup() {
  //await fetchEpisodes();
  await fetchShows();
}

// DOM elements
const dropdownShowMenu = document.getElementById("show-dropdown");
const dropdownMenu = document.getElementById("dropdown");


// Fetch shows from API AND CACHE
function fetchShows() {
  const root = document.getElementById("root");
  const loadingMessage = document.createElement("p");
  loadingMessage.id = "loadingMessage";
  loadingMessage.textContent = "Loading shows, please wait...";
  root.append(loadingMessage);

  const showsUrl = "https://api.tvmaze.com/shows";

   if (state.fetchedUrls[showsUrl]) {
    // If it has been fetched, use the cached data
    console.log('Using cached shows data');
    state.allShows = state.fetchedUrls[showsUrl];
    loadingMessage.remove();
    populateDropdown(state.allShows);  // Re-populate the dropdown
    renderAllShows(state.allShows)
    return;
  }

  fetch(showsUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch shows.");
      }
      return response.json(); 
    })
    .then((data) => {
      state.allShows = data;
      state.fetchedUrls[showsUrl] = data;
      loadingMessage.remove(); 
      console.log(state,'Using cached episodes data');

      // Sort the shows alphabetically by name
      state.allShows.sort((a, b) => a.name.localeCompare(b.name));
      renderAllShows(state.allShows)
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

// Fetch episodes from API AND CACHE
function fetchEpisodes(url) {
  const root = document.getElementById("root");
  const loadingMessage = document.createElement("p");
  loadingMessage.id = "loadingMessage";
  loadingMessage.textContent = "Loading episodes, please wait...";
  root.append(loadingMessage);
    // Check if the URL has already been fetched
  if (state.fetchedUrls[url]) {
    // If it has been fetched, use the cached data
    console.log(state.fetchedUrls,'Using cached episodes data');
    state.allEpisodes = state.fetchedUrls[url];
    loadingMessage.remove();
    renderAllEpisodes(state.allEpisodes); 
    populateDropdown(); 
    return;
  }
  
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch episodes.");
        }
        return response.json(); // Return parsed JSON data
      })
      .then((episodeData) => {
        state.allEpisodes = episodeData; 
        loadingMessage.remove(); // Remove loading message
         state.fetchedUrls[url] = episodeData; // Cache the fetched data
        renderAllEpisodes(state.allEpisodes); 
        populateDropdown(); 
      })
      .catch((err) => {
        console.error(err);
        loadingMessage.textContent = "Error loading episodes. Please try again later.";
      });
}

document.getElementById("search-input").addEventListener("keyup", function () {
  const query = this.value.toLowerCase();
  
  if (query === "") {
    // If the search box is cleared, show all episodes
    renderAllEpisodes(state.allEpisodes);
  } else {
    // Otherwise, filter episodes based on the query
    const matchedEpisodes = state.allEpisodes.filter(
      episode =>
        episode.name.toLowerCase().includes(query) ||
        episode.summary.toLowerCase().includes(query)
    );

    clearEpisodes();
    matchedEpisodes.forEach(episode => {
      document.getElementById("root").append(makePageForEpisodes(episode));
    });
    updateDisplayLabel(matchedEpisodes.length);
  }
});

dropdownShowMenu.addEventListener("change", function () {
  state.showQuery = this.value;
  
  const matchedShow = state.allShows.find(show => show.id === parseInt(state.showQuery));
   const episodeUrl = `https://api.tvmaze.com/shows/${matchedShow.id}/episodes`
 console.log(episodeUrl);
  if (episodeUrl) {
    clearEpisodes();
    fetchEpisodes(episodeUrl)
  }
});

dropdownMenu.addEventListener("change", function () {
  const selectedCode = this.value;
  const matchedEpisode = state.allEpisodes.find(episode => getEpisodeCode(episode) === selectedCode);

  if (matchedEpisode) {
    clearEpisodes();
    document.getElementById("root").append(makePageForEpisodes(matchedEpisode));
     updateDisplayLabel(1);
    const goBackButton = document.createElement("button");
    goBackButton.textContent = "Go Back to All Episodes";
    goBackButton.id = "goBackButton";
    document.getElementById("root").append(goBackButton);

    goBackButton.addEventListener("click", function () {
      renderAllEpisodes(state.allEpisodes);
      this.remove();
      dropdownMenu.selectedIndex = 0;
    });
  }
});


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

function makePageForShows(show) {
  const showTemplate = document
    .getElementById("showsTemplate")
    .content.cloneNode(true);

  filmTemplate.querySelector("h3").textContent = show.name;
  filmTemplate.querySelector("img").src = show.image.medium;
  filmTemplate.querySelector("p").textContent = show.summary.replace(/<[^>]*>/g, '');
  return showTemplate;
}

function renderAllShows(allShows) {
  if (!Array.isArray(allShows)) {
    console.error("Invalid episodes data:");
    return; // Exit if the input is not an array
  }
  clearEpisodes();
  allShows.forEach(show => {
    document.getElementById("root").append(makePageForEpisodes(show));
  });
  //updateDisplayLabel(allEpisodes.length);
}

function clearEpisodes() {
  const sections = document.querySelectorAll("#root section");
  sections.forEach(section => section.remove());
}

function renderAllEpisodes(allEpisodes) {
  if (!Array.isArray(allEpisodes)) {
    console.error("Invalid episodes data:", allEpisodes);
    return; // Exit if the input is not an array
  }

  clearEpisodes();
  allEpisodes.forEach(episode => {
    document.getElementById("root").append(makePageForEpisodes(episode));
  });
  updateDisplayLabel(allEpisodes.length);
}

function updateDisplayLabel(count) {
  const displayLabel = document.getElementById("display-label");
  displayLabel.textContent = `Displaying ${count}/${state.allEpisodes.length} episodes`;
}

function populateDropdown() {
  dropdownMenu.innerHTML = '<option value="" disabled selected>Choose an Episode</option>';
  
  state.allEpisodes.forEach(episode => {
    const option = document.createElement("option");
    option.value = getEpisodeCode(episode);
    option.text = `${getEpisodeCode(episode)} - ${episode.name}`;
    dropdownMenu.appendChild(option);
  });
}


window.onload = setup;
