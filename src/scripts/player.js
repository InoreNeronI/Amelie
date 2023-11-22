// @see https://codepen.io/EmNudge/pen/rRbLJQ
// Possible improvements:
// - Change timeline and volume slider into input sliders, reskinned
// - Change into Vue or React component
// - Hover over sliders to see preview of timestamp/volume change

const element = document.querySelector('audio');
const player = document.querySelector('.player');

element.addEventListener(
  'loadeddata',
  () => {
    player.querySelector('.time .length').textContent =
      window.getTimeCodeFromNum(element.duration);
    const audioSrc = element.querySelector('source').src;
    player.querySelector('.name').textContent = window.htmlDecode(
      audioSrc.substr(audioSrc.lastIndexOf('/') + 1)
    );
    element.volume = 0.75;
  },
  false
);

//click on timeline to skip around
const timeline = player.querySelector('.timeline');
timeline.addEventListener(
  'click',
  e => {
    const timelineWidth = window.getComputedStyle(timeline).width;
    const timeToSeek = (e.offsetX / parseInt(timelineWidth)) * element.duration;
    element.currentTime = timeToSeek;
  },
  false
);

//click volume slider to change volume
const volumeSlider = player.querySelector('.controls .volume-slider');
volumeSlider.addEventListener(
  'click',
  e => {
    const sliderWidth = window.getComputedStyle(volumeSlider).width;
    const newVolume = e.offsetX / parseInt(sliderWidth);
    element.volume = newVolume;
    player.querySelector('.controls .volume-percentage').style.width =
      newVolume * 100 + '%';
  },
  false
);

//check audio percentage and update time accordingly
setInterval(() => {
  const progressBar = player.querySelector('.progress');
  progressBar.style.width =
    (element.currentTime / element.duration) * 100 + '%';
  player.querySelector('.time .current').textContent =
    window.getTimeCodeFromNum(element.currentTime);
}, 500);

//toggle between playing and pausing on button click
const playBtn = player.querySelector('.controls .toggle-play');
playBtn.addEventListener(
  'click',
  () => {
    if (element.paused) {
      playBtn.classList.remove('play');
      playBtn.classList.add('pause');
      element.play();
    } else {
      playBtn.classList.remove('pause');
      playBtn.classList.add('play');
      element.pause();
    }
  },
  false
);

element.addEventListener(
  'ended',
  () => {
    playBtn.classList.remove('pause');
    playBtn.classList.add('play');
  },
  false
);

element.addEventListener(
  'play',
  () => {
    playBtn.classList.remove('play');
    playBtn.classList.add('pause');
  },
  false
);

player.querySelector('.volume-button').addEventListener('click', () => {
  const volumeEl = player.querySelector('.volume-container .volume');
  element.muted = !element.muted;
  if (element.muted) {
    volumeEl.classList.remove('icono-volumeMedium');
    volumeEl.classList.add('icono-volumeMute');
  } else {
    volumeEl.classList.add('icono-volumeMedium');
    volumeEl.classList.remove('icono-volumeMute');
  }
});

/**
 * turn 128 seconds into 2:08
 * @param num
 * @returns {string}
 */
window.getTimeCodeFromNum = num => {
  let seconds = parseInt(num);
  let minutes = parseInt(seconds / 60);
  seconds -= minutes * 60;
  const hours = parseInt(minutes / 60);
  minutes -= hours * 60;

  if (hours === 0) return `${minutes}:${String(seconds % 60).padStart(2, 0)}`;
  return `${String(hours).padStart(2, 0)}:${minutes}:${String(
    seconds % 60
  ).padStart(2, 0)}`;
};

/**
 * @see https://stackoverflow.com/a/1912522
 * @param {string} input
 * @returns {string}
 */
window.htmlDecode = input => {
  const e = document.createElement('textarea');
  e.innerHTML = input;
  // handle case of empty input
  return e.childNodes.length === 0
    ? ''
    : e.childNodes[0].nodeValue.replaceAll('%20', ' ');
};
