function setup() {
  const allEpisodes = getAllEpisodes();
  const oneEp = getOneEpisode();
  makePageForEpisodes(oneEp);
}
const oneEp = getOneEpisode();
const allEpisodes = getAllEpisodes();
function makePageForEpisodes(episodeList) {
  const episodeCode = `S${String(episodeList.season).padStart(2, "0")}E${String(
    episodeList.number
  ).padStart(2, "0")}`;

  const filmTemplate = document
    .getElementById("filmEpisodes")
    .content.cloneNode(true);
  filmTemplate.querySelector("h3").textContent = episodeList.name + episodeCode;
  filmTemplate.querySelector("img").src = episodeList.image.medium;
  filmTemplate.querySelector("p").textContent = episodeList.summary;

  return filmTemplate;
}
for (i = 0; i < allEpisodes.length; i++) {
  document.body.append(makePageForEpisodes(allEpisodes[i]));
}
window.onload = setup;
