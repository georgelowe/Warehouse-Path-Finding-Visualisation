// DOM Elements
var clearButton = document.getElementById("clear-button");
var setPickButton = document.getElementById("set-pick-button");
var goButton = document.getElementById("go-button");
var configMessage = document.getElementById("config-message-container");
var resultsMessage = document.getElementById("results-container");

// Colours
var startColour = "#0B9F00";
var pickColour = "#f64900";
var rackColour = "#dbdbdb";

// Tiles
var canvas;
var ctx;
var numColumns = 45;
var numRows = 25;
var tileWidth = 20;
var tileHeight = 20;

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

// Populate tileArray of tile objects
var tileArray = [];
for (let i = 0; i < numColumns; i++) {
  tileArray[i] = [];
  for (let j = 0; j < numRows; j++) {
    tileArray[i][j] = new Tile(i * (20 + 1), j * (20 + 1));
  }
}

tileArray[0][0].setStatus("start");

// RE CONFIGURE HEIGHT AND WIDTHS
tileArray[42][23].setStatus("start");

function configure() {
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
  populateGrid();
}

// Populate grid with tiles from tileArray
function populateGrid() {
  for (let i = 0; i < numColumns; i++) {
    for (let j = 0; j < numRows; j++) {
      drawTile(tileArray[i][j].x, tileArray[i][j].y, tileArray[i][j].colour);
    }
  }
}

function drawTile(x, y, state) {
  console.log("drawing ");
  ctx.fillStyle = state;
  ctx.beginPath();
  ctx.rect(x, y, 20, 20);
  ctx.closePath();
  ctx.fill();
}

// Calculate the path between two points
// @param firstPoint, secondPoint, algorithm
// @return cost
function calculateCost() {}

// Calculate the most efficient route
// @param
// @return
function calculateBestRoute() {}

configure();
