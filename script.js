function setup() {
  const allEpisodes = getAllEpisodes();
  const oneEp = getOneEpisode();
  makePageForEpisodes(oneEp);
}

const oneEp = getOneEpisode();
const allEpisodes = getAllEpisodes();

// makes episodeCode and film/episode template.
function makePageForEpisodes(episodeList) {
  const episodeCode = `S${String(episodeList.season).padStart(2, "0")}E${String(
    episodeList.number
  ).padStart(2, "0")}`;

  const filmTemplate = document
    .getElementById("filmEpisodes")
    .content.cloneNode(true);

  filmTemplate.querySelector("h3").textContent = episodeList.name +" ("+ episodeCode+")";
  filmTemplate.querySelector("img").src = episodeList.image.medium;
  filmTemplate.querySelector("p").textContent = episodeList.summary.replace(/<[^>]*>/g, '');

  return filmTemplate;
}

const root = document.getElementById("root"); 

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
  const matchedEpisodes = [];
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
  
});



window.onload = setup;
