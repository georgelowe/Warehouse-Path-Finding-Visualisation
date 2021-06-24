// DOM Elements
var clearButton = document.getElementById("clear-button");
var setPickButton = document.getElementById("set-pick-button");
var goButton = document.getElementById("go-button");
var configMessage = document.getElementById("config-message-container");
var resultsMessage = document.getElementById("results-container");

// Tiles
var canvas = document.getElementById("canvas");
ctx = canvas.getContext("2d");
var tileArray = [];
var numColumns = 40;
var numRows = 25;
var tileDim = 20;

// Selection Mode Handling
var selectionMode = "rackingMode";
var pickCount = 0;

// Event Listeners
clearButton.addEventListener(
  "click",
  function () {
    clearGrid();
  },
  false
);

setPickButton.addEventListener(
  "click",
  function () {
    if (selectionMode == "rackingMode") {
      setPickButton.textContent = "Set Racking";
      selectionMode = "pickingMode";
    } else if (selectionMode == "pickingMode") {
      setPickButton.textContent = "Set Pick Bays";
      selectionMode = "rackingMode";
    }
  },
  false
);

goButton.addEventListener("click", function () {}, false);

// Populate tileArray of tile objects

for (let i = 0; i < numColumns; i++) {
  tileArray[i] = [];
  for (let j = 0; j < numRows; j++) {
    tileArray[i][j] = new Tile(i * (tileDim + 3), j * (tileDim + 3));
  }
}
configDefaultTiles();

function configDefaultTiles() {
  // Config start and end points
  tileArray[0][0].setStatus("start");
  tileArray[numColumns - 1][numRows - 1].setStatus("end");
}

// Populate grid with tiles from tileArray
function populateGrid() {
  configDefaultTiles();
  for (let i = 0; i < numColumns; i++) {
    for (let j = 0; j < numRows; j++) {
      drawTile(tileArray[i][j].x, tileArray[i][j].y, tileArray[i][j].colour);
    }
  }
}

function clearGrid() {
  pickCount = 0;
  updatePickCountMessage();
  for (let i = 0; i < numColumns; i++) {
    for (let j = 0; j < numRows; j++) {
      tileArray[i][j].setStatus("empty");
    }
  }
  populateGrid();
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
        if (
          tileArray[i][j].status != "start" &&
          tileArray[i][j].status != "end"
        ) {
          if (selectionMode == "rackingMode") {
            if (tileArray[i][j].status == "pick") {
              pickCount--;
            }
            tileArray[i][j].setStatus("racking");
          } else if ((selectionMode = "pickingMode")) {
            if (tileArray[i][j].status != "pick") {
              tileArray[i][j].setStatus("pick");
              pickCount++;
            }
          }

          updatePickCountMessage();

          drawTile(
            i * (tileDim + 3),
            j * (tileDim + 3),
            tileArray[i][j].colour
          );
        }
      }
    }
  }
}

function updatePickCountMessage() {
  configMessage.textContent =
    "There are currently " + pickCount + " items selected to pick";
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
