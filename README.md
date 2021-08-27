# Amélie

Amélie is a curiously mesmerising kaleidoscope visualisation written in [React.js](http://facebook.github.io/react) using [D3](http://d3js.org) with HTML5's [`AnalyserNode` API](https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode).

![Amélie Screenshot](http://i.imgur.com/Ycuwn7b.png)

---

# Getting Started

You're more than welcome to run the example yourself locally &ndash; simply clone the repository and run `npm start` from your terminal &ndash; `npm start` uses [Foreman](http://theforeman.org) for running the example on [`0.0.0.0:5000`](http://127.0.0.1:5000).

# Module

Amélie utilises the [`AnalyserNode`](https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode) API to create the visualisation &ndash; the example itself is built using React and D3.

[In `player.js`](https://github.com/mmozos/Amelie/blob/main/src/scripts/player.js) there are a handful of core methods; there is the `configureAudioContext` method that passes the HTML5 `<audio>` stream through the `AnalyserNode` API; there is also [the `analyseAudioStream` method](https://github.com/mmozos/Amelie/blob/main/src/scripts/visualiser.js) that performs the analysis on the current audio stream and defines the `frequencyData` which is used to create the visualisations; from there we have the [`renderCircles` and `renderSplodges`](https://github.com/mmozos/Amelie/blob/main/src/scripts/canvas.js) that take the aforementioned `frequencyData` variable to construct the circles using the D3 library.