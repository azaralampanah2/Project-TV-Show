function setup() {
  const allEpisodes = getAllEpisodes();
  const oneEp = getOneEpisode();
  makePageForEpisodes(oneEp);
}

const oneEp = getOneEpisode();
const allEpisodes = getAllEpisodes();
function getEpisodeCode(episode) {
  return `S${String(episode.season).padStart(2, "0")}E${String(episode.number).padStart(2, "0")}`;
}

// makes film/episode template.
function makePageForEpisodes(episodeList) {
  const filmTemplate = document
    .getElementById("filmEpisodes")
    .content.cloneNode(true);

  filmTemplate.querySelector("h3").textContent = episodeList.name + `${getEpisodeCode(episodeList)}`;
  filmTemplate.querySelector("img").src = episodeList.image.medium;
  filmTemplate.querySelector("p").textContent = episodeList.summary.replace(/<[^>]*>/g, '');

  return filmTemplate;
}

const root = document.getElementById("root"); 
console.log(root)

/*for (let i = 0; i < allEpisodes.length; i++) {
  root.append(makePageForEpisodes(allEpisodes[i])); 
}*/
//Using map to iterate over allEpisodes and append the result of makePageForEpisodes to root 
allEpisodes.map((episode) => root.append(makePageForEpisodes(episode)));

//level 200
//step 1: get all variables needed
const searchInput = document.getElementById("search-input");

function clear(){
 const sections = document.getElementsByTagName("section");
 const elements = Array.from(sections); 
  elements.forEach(element => element.remove());
}

//2: add event listener to get event & compare query when key is pressed i.e event
searchInput.addEventListener('keyup', function(event) {
  let matchedEpisodes = [];
  const query = searchInput.value.toLowerCase(); // Get the search input value in lowercase
  
  // Compare the query with episode summaries
  for (let episode of allEpisodes) {
    if (episode.summary.toLowerCase().includes(query)|| 
        episode.name.toLowerCase().includes(query)) {
      matchedEpisodes.push(episode); // Add matching episodes to the array
    }
  }
  
  clear() // Clear previous results

  //episode template for each matched episode.
  for (let i = 0; i < matchedEpisodes.length; i++) {
     const pages = makePageForEpisodes(matchedEpisodes[i]);
      root.append(pages);
    }  

//episodes displayed counter.
  const episodeDisplayed = document.getElementById("display-label")
  episodeDisplayed.textContent = `Displaying ${matchedEpisodes.length}/73 episodes`
 
});

// 200 B
const dropdownMenu = document.getElementById("dropdown")
//iterate and append the name of all the episode to the dropdown menu.
allEpisodes.forEach(episode =>{
  const option = document.createElement("option");
   option.text = `${getEpisodeCode(episode)} - ${episode.name}`;
   dropdownMenu.appendChild(option);
})

// getCode() deconstructs selection to get only episode code
function getCode(selectedEpisode) {
  const indexOfDash = selectedEpisode.indexOf(" -");
  return selectedEpisode.substring(0, indexOfDash);
}

dropdownMenu.addEventListener('change', function() {
  const selectedEpisode = (getCode(dropdownMenu.value));
  //compare selectedEpisode with all Episode
  const foundMatch = allEpisodes.find(episode => selectedEpisode === getEpisodeCode(episode))
   if (foundMatch) {
    clear()
    root.append(makePageForEpisodes(foundMatch));

    // Create the "Go Back" button
    const goBackButton = document.createElement("button");
    goBackButton.textContent = "Go Back to All Episodes";
    goBackButton.id = "goBackButton";
    root.append(goBackButton);

    // Add event listener to "Go Back" button
    goBackButton.addEventListener('click', function() {
      clear();
      allEpisodes.forEach(episode => {
        root.append(makePageForEpisodes(episode));
      });
      // Remove the "Go Back" button after clicking
      goBackButton.remove();
    });
    
  }else {
    return "No match found.";
  }
});








window.onload = setup;
