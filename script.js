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
var canvas = document.getElementById("canvas");
ctx = canvas.getContext("2d");
var numColumns = 40;
var numRows = 25;
var tileDim = 20;

// Event Listeners
clearButton.addEventListener(
  "click",
  function () {
    window.alert("Clear button clicked");
    console.log(tileArray);
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
    tileArray[i][j] = new Tile(i * (tileDim + 3), j * (tileDim + 3));
  }
}
// Config start and end points
tileArray[0][0].setStatus("start");
tileArray[numColumns - 1][numRows - 1].setStatus("end");

// Populate grid with tiles from tileArray
function populateGrid() {
  for (let i = 0; i < numColumns; i++) {
    for (let j = 0; j < numRows; j++) {
      console.log("x at " + i + "," + j + " is: " + tileArray[i][j].x);
      drawTile(tileArray[i][j].x, tileArray[i][j].y, tileArray[i][j].colour);
    }
  }
}

function drawTile(x, y, state) {
  deleteTile(x + 1, y + 1);
  ctx.fillStyle = state;
  ctx.beginPath();
  ctx.rect(x, y, 20, 20);
  ctx.closePath();
  ctx.fill();
}

function deleteTile(x, y) {
  ctx.clearRect(x, y, tileDim, tileDim);
}

// check which mode we are in: i.e. selecting racking or selecting pick items
function selectTile(e) {
  let xCoord = e.pageX - canvas.offsetLeft;
  let yCoord = e.pageY - canvas.offsetTop;

  for (let i = 0; i < numColumns; i++) {
    for (let j = 0; j < numRows; j++) {
      if (
        i * (tileDim + 3) < xCoord &&
        xCoord < i * (tileDim + 3) + tileDim &&
        j * (tileDim + 3) < yCoord &&
        yCoord < j * (tileDim + 3) + tileDim
      ) {
        tileArray[i][j].setStatus("start");
        drawTile(i * (tileDim + 3), j * (tileDim + 3), "start");
        console.log("i is: " + i + "\nj is: " + j);
        console.log("xCoord is: " + xCoord + "\nyCoord is: " + yCoord);
      }
    }
  }
}

canvas.onmousedown = selectTile;

// Calculate the path between two points
// @param firstPoint, secondPoint, algorithm
// @return cost
function calculateCost() {}

// Calculate the most efficient route
// @param
// @return
function calculateBestRoute() {}

populateGrid();
