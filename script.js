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


window.onload = setup;
