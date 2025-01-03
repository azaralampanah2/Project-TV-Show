function setup() {
  const allEpisodes = getAllEpisodes();
  const oneEp = getOneEpisode();
  makePageForEpisodes(oneEp);
}

const oneEp = getOneEpisode();
const allEpisodes = getAllEpisodes();

// makes episodeCode and film/episode template.
/*function makePageForEpisodes(episodeList) {
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
}*/

function makePageForEpisodes(episodeList) {
  if (!episodeList) {
    throw new Error("Invalid episodeList object!");
  }

  const episodeCode = `S${String(episodeList.season || 0).padStart(2, "0")}E${String(
    episodeList.number || 0
  ).padStart(2, "0")}`;

  const template = document.getElementById("filmEpisodes");

  if (!template) {
    throw new Error("Template with id 'filmEpisodes' not found!");
  }

  const filmTemplate = template.content.cloneNode(true);

  const episodeHeading = filmTemplate.querySelector("h3");
  if (episodeHeading) {
    episodeHeading.textContent = episodeList.name + " (" + episodeCode + ")";
  } else {
    console.error("Heading element (h3) not found in the template!");
  }

  const image = filmTemplate.querySelector("img");
  if (image) {
    image.src = episodeList.image?.medium || "default-image.jpg";
  } else {
    console.error("Image element not found in the template!");
  }

  const paragraph = filmTemplate.querySelector("p");
  if (paragraph) {
    paragraph.textContent = (episodeList.summary || "").replace(/<[^>]*>/g, "");
  } else {
    console.error("Paragraph element not found in the template!");
  }

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
  // Clear previous results
  root.innerHTML = "";

  //create and append episode cards that matched to root
     if (matchedEpisodes.length === 0) {
    root.innerHTML = "No results found";
  } else {
    for (let i = 0; i < matchedEpisodes.length; i++) {
      root.append(makePageForEpisodes(matchedEpisodes[i]));
    }
  }
});

window.onload = setup;
