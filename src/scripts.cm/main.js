// @see https://ricardogeek.com/como-crear-un-playlist-de-audio-con-javascript

const audio = document.querySelector('audio');
const playlist = document.querySelector('.playlist');
const source = audio.querySelector('source');
const tracks = playlist.getElementsByTagName('a');

// Add the events to the links that will allow you to change the song
for (const track in tracks) {
  const link = tracks[track];
  if (typeof link === 'function' || typeof link === 'number') continue;
  link.addEventListener('click', e => {
    e.preventDefault();
    const song = link.getAttribute('href');
    window.run(song, audio, link);
  });
}
// Add event to play the next song in the list, and if the song is the last one play the first one again
audio.addEventListener('ended', e => {
  for (const track in tracks) {
    const link = tracks[track];
    let nextTrack = parseInt(track) + 1;
    if (typeof link === 'function' || typeof link === 'number') continue;
    if (!source.src) source.src = tracks[0];
    if (track === (tracks.length - 1).toString()) nextTrack = 0;
    const linkHref = link.getAttribute('href');
    if (
      linkHref.substr(linkHref.lastIndexOf('/') + 1) ===
      source.src.substr(source.src.lastIndexOf('/') + 1)
    ) {
      const nextLink = tracks[nextTrack];
      window.run(nextLink.getAttribute('href'), audio, nextLink);
      break;
    }
  }
});

window.run = (song, audio, element) => {
  // Remove the active from all items in the list
  const items = element.parentElement.getElementsByTagName('a');
  for (const item in items) {
    if (items[item].classList) items[item].classList.remove('active');
  }

  // Add active to this element
  element.classList.add('active');

  // Play the song
  source.src = song;
  audio.load();
  audio.play();
};
