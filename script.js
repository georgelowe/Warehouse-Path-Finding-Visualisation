// DOM Elements
var clearButton = document.getElementById("clear-button");
var setPickButton = document.getElementById("set-pick-button");
var goButton = document.getElementById("go-button");
var configMessage = document.getElementById("config-message-container");
var resultsMessage = document.getElementById("results-container");

// Colours
var startColour = "#0B9F00";
var pickColour = "#f64900";
var rackColour = "#f3f3f3";

// Tiles
var canvas;
var ctx;
var numColumns = 45;
var numRows = 25;

// Event Listeners
clearButton.addEventListener(
  "click",
  function () {
    window.alert("Clear button clicked");
  },
  false
);

setPickButton.addEventListener(
  "click",
  function () {
    window.alert("Set pick button clicked");
  },
  false
);

goButton.addEventListener(
  "click",
  function () {
    window.alert("Go button clicked");
  },
  false
);

function configure() {
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
  drawSpace();
}

function drawSpace() {
  ctx.fillStyle = startColour;
  ctx.beginPath();
  ctx.rect(0, 0, 20, 20);
  ctx.closePath();
  ctx.fill();
}

configure();
