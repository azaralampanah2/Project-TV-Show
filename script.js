
const state ={
  allShows:[],
  allEpisodes: [], 
  searchTerm: "",
  showQuery:"",
  fetchedUrls: {},
  
}
const dropdownShowMenu = document.getElementById("show-dropdown");
const dropdownMenu = document.getElementById("dropdown");
const displayLabel = document.getElementById("display-label");
const showsUrl = "https://api.tvmaze.com/shows";
const root = document.getElementById("root");
const backLabel=document.getElementById("searchBox")
const inputSearchShows=document.getElementById("search-input-shows")
const backToShowsBtn=document.getElementById("backToShows")
const backToEpiosdesBtn=document.getElementById("backToEpisodes")
const searchInputForEpisodes=document.getElementById("search-input")


async function setup() {
  backToShowsBtn.style.display="none"
  backToEpiosdesBtn.style.display="none"
  dropdownMenu.style.display="none"

  searchInputForEpisodes.style.display="none"
  await fetchShows();
}

// DOM elements

// Fetch shows from API AND CACHE
function fetchShows() {
  
  const loadingMessage = document.createElement("p");
  loadingMessage.id = "loadingMessage";
  loadingMessage.textContent = "Loading shows, please wait...";
  root.append(loadingMessage);

  
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
      console.log(state.allShows)
      displayLabel.textContent = "Displaying all Shows"
      // Populate the dropdown menu
      dropdownShowMenu.innerHTML = '<option value="" disabled selected>Choose a Show</option>';
      populateDropdownshows(state.allShows); 
     
    })
.catch((err) => {
      console.error(err);
      loadingMessage.textContent = "Error loading shows. Please try again later.";
    });
}
  function  populateDropdownshows(){
  state.allShows.forEach((show) => {
    const option = document.createElement("option");
    option.value = show.id; // Use the show ID for reference
    option.textContent = show.name; // Show name in the dropdown
    dropdownShowMenu.appendChild(option); // Append option to dropdown
  });
}
// Fetch episodes from API AND CACHE
function fetchEpisodes(url) {
  document.getElementById("search-input").style.display=""
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
inputSearchShows.addEventListener("keyup",()=>{
  const query=inputSearchShows.value.toLowerCase()
  console.log(query)
  if (query===""){
    renderAllShows(state.allShows)

  }else{
        const matchedShows=state.allShows.filter(show=>
      show.name.toLowerCase().includes(query) 
     || show.summary.toLowerCase().includes(query)
    || show.genres.join().toLowerCase().includes(query)
    
  
    )
    clearEpisodes()
    matchedShows.forEach(show=>{
      document.getElementById("root").append(makePageForShows(show))
    })
    
  }
})

document.getElementById("search-input").addEventListener("keyup", function () {
  backToShowsBtn.style.display="none"
  backToEpiosdesBtn.style.display="inline-block"
   
  backToEpiosdesBtn.addEventListener("click",()=>{
    backToEpiosdesBtn.style.display="none"
      renderAllEpisodes(state.allEpisodes)
    })
  




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
  backToShowsBtn.style.display="none"
  backToEpiosdesBtn.style.display="inline-block"
backToEpiosdesBtn.addEventListener("click",()=>{
  backToEpiosdesBtn.style.display="none"
    renderAllEpisodes(state.allEpisodes)
  })
  const selectedCode = this.value;
  const matchedEpisode = state.allEpisodes.find(episode => getEpisodeCode(episode) === selectedCode);

  if (matchedEpisode) {
    clearEpisodes();
    document.getElementById("root").append(makePageForEpisodes(matchedEpisode));
     updateDisplayLabel(1);
 
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
    showTemplate.getElementById("rating").textContent=`rating : ${show.rating.average}`;
    showTemplate.getElementById("genres").textContent=`Genres : ${show.genres}`;
    showTemplate.getElementById("runTime").textContent=`Run Time: ${show.averageRuntime}`;
showTemplate.getElementById("status").textContent=`Status : ${show.status}`;

    showTemplate.querySelector("h3").textContent = show.name;
    showTemplate.querySelector("h3").addEventListener("click",(event)=>{
  
      const showId = show.id; // Assuming `show` has an `id` property
    
      // Update the state
      state.showQuery = showId
        
        const matchedShow = state.allShows.find(show => show.id === parseInt(state.showQuery));
         const episodeUrl = `https://api.tvmaze.com/shows/${matchedShow.id}/episodes`
       console.log(episodeUrl);
        if (episodeUrl) {
          clearEpisodes();
          fetchEpisodes(episodeUrl)
        }
      });
     
    showTemplate.querySelector("img").src = show.image.medium;
    showTemplate.querySelector("p").textContent = show.summary.replace(/<[^>]*>/g, '');
  return showTemplate;
}



function renderAllShows(allShows) {
  if (!Array.isArray(allShows)) {
    console.error("Invalid episodes data:");
    return; // Exit if the input is not an array
  }
  clearEpisodes();
  allShows.forEach(show => {
    document.getElementById("root").append(makePageForShows(show));
  });
  
}



function clearEpisodes() {
  const sections = document.querySelectorAll("#root section");
  sections.forEach(section => section.remove());
}

function renderAllEpisodes(allEpisodes) {

  dropdownMenu.style.display="inline-block"
  dropdownShowMenu.style.display="none"
  searchInputForEpisodes.style.display="inline-block"
  if (!Array.isArray(allEpisodes)) {
    console.error("Invalid episodes data:", allEpisodes);
    return; // Exit if the input is not an array
  }
  inputSearchShows.style.display="none"
  clearEpisodes();
  allEpisodes.forEach(episode => {
    document.getElementById("root").append(makePageForEpisodes(episode));
  });
  
  backToShowsBtn.style.display="inline-block"
  backToShowsBtn.addEventListener("click",()=>{
   displayLabel.textContent = "Displaying all Shows"

   
    backToShowsBtn.style.display="none"
    backToEpiosdesBtn.style.display="none"
    dropdownMenu.style.display="none"
    dropdownShowMenu.style.display="inline-block"
    inputSearchShows.style.display="inline-block"
    searchInputForEpisodes.style.display="none"
    renderAllShows(state.allShows)
    
    
  })
 


  updateDisplayLabel(allEpisodes.length);
}

function updateDisplayLabel(count) {
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
