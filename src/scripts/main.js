
import React from 'react';
import Audio from './audio';

// It's time to throw everything to the devil and go to Kislovodsk...
const node = document.querySelector('#root');
React.render(<Audio audio={node.getAttribute('data-audio')} />, node);

// @see https://codepen.io/EmNudge/pen/rRbLJQ
// Possible improvements:
// - Change timeline and volume slider into input sliders, reskinned
// - Change into Vue or React component
// - Hover over sliders to see preview of timestamp/volume change

const audioElement = document.querySelector('audio');
const audioPlayer = document.querySelector('.audio-player');

audioElement.addEventListener(
    "loadeddata",
    () => {
        audioPlayer.querySelector(".time .length").textContent = window.getTimeCodeFromNum(
            audioElement.duration
        );
        const audioSrc = audioElement.querySelector('source').src;
        audioPlayer.querySelector('.name').textContent = audioSrc.substr(audioSrc.lastIndexOf('/')+1);
        audioElement.volume = .75;
    },
    false
);

//click on timeline to skip around
const timeline = audioPlayer.querySelector(".timeline");
timeline.addEventListener("click", e => {
    const timelineWidth = window.getComputedStyle(timeline).width;
    const timeToSeek = e.offsetX / parseInt(timelineWidth) * audioElement.duration;
    audioElement.currentTime = timeToSeek;
}, false);

//click volume slider to change volume
const volumeSlider = audioPlayer.querySelector(".controls .volume-slider");
volumeSlider.addEventListener('click', e => {
    const sliderWidth = window.getComputedStyle(volumeSlider).width;
    const newVolume = e.offsetX / parseInt(sliderWidth);
    audioElement.volume = newVolume;
    audioPlayer.querySelector(".controls .volume-percentage").style.width = newVolume * 100 + '%';
}, false)

//check audio percentage and update time accordingly
setInterval(() => {
    const progressBar = audioPlayer.querySelector(".progress");
    progressBar.style.width = audioElement.currentTime / audioElement.duration * 100 + "%";
    audioPlayer.querySelector(".time .current").textContent = window.getTimeCodeFromNum(
        audioElement.currentTime
    );
}, 500);

//toggle between playing and pausing on button click
const playBtn = audioPlayer.querySelector(".controls .toggle-play");
playBtn.addEventListener(
    "click",
    () => {
        if (audioElement.paused) {
            playBtn.classList.remove("play");
            playBtn.classList.add("pause");
            audioElement.play();
        } else {
            playBtn.classList.remove("pause");
            playBtn.classList.add("play");
            audioElement.pause();
        }
    },
    false
);

audioElement.addEventListener(
    "ended",
    () => {
        playBtn.classList.remove("pause");
        playBtn.classList.add("play");
    },
    false
);

audioPlayer.querySelector(".volume-button").addEventListener("click", () => {
    const volumeEl = audioPlayer.querySelector(".volume-container .volume");
    audioElement.muted = !audioElement.muted;
    if (audioElement.muted) {
        volumeEl.classList.remove("icono-volumeMedium");
        volumeEl.classList.add("icono-volumeMute");
    } else {
        volumeEl.classList.add("icono-volumeMedium");
        volumeEl.classList.remove("icono-volumeMute");
    }
});

/**
 * turn 128 seconds into 2:08
 * @param num
 * @returns {string}
 */
window.getTimeCodeFromNum = (num) => {
    let seconds = parseInt(num);
    let minutes = parseInt(seconds / 60);
    seconds -= minutes * 60;
    const hours = parseInt(minutes / 60);
    minutes -= hours * 60;

    if (hours === 0) return `${minutes}:${String(seconds % 60).padStart(2, 0)}`;
    return `${String(hours).padStart(2, 0)}:${minutes}:${String(
        seconds % 60
    ).padStart(2, 0)}`;
}