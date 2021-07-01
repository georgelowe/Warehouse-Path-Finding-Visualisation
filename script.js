// DOM Buttons
var clearButton = document.getElementById("clear-button");
var setPickButton = document.getElementById("set-pick-button");
var findOptimalRouteButton = document.getElementById("optimal-route-button");

// DOM Containers
var configMessage = document.getElementById("pick-count-message-container");
var optimalRouteContainer = document.getElementById("optimal-route-container");
var edgeResultsContainer = document.getElementById("edges-container");
var routeResultsContainer = document.getElementById("routes-container");

// Tile Grid Configuration
var canvas = document.getElementById("canvas");
canvasContext = canvas.getContext("2d");
var tileArray = [];
var numColumns = 45;
var numRows = 20;
var tileDimension = 20;

// Selection Mode
var selectionMode = "rackSelect";
var pickCount = 0;
var labelHashMap = {
  1: "A",
  2: "B",
  3: "C",
  4: "D",
  5: "E",
  6: "F",
  7: "G",
  8: "H",
  9: "I",
  10: "J",
};

// Event Listeners
clearButton.addEventListener(
  "click",
  function () {
    clearGrid();
    updateConfigMessage();
    populateGrid();
    clearResults(optimalRouteContainer);
    clearResults(edgeResultsContainer);
    clearResults(routeResultsContainer);
  },
  false
);

setPickButton.addEventListener(
  "click",
  function () {
    if (selectionMode == "rackSelect") {
      setPickButton.textContent = "Set Racking";
      selectionMode = "pickSelect";
    } else if (selectionMode == "pickSelect") {
      setPickButton.textContent = "Set Pick Bays";
      selectionMode = "rackSelect";
    }
  },
  false
);

findOptimalRouteButton.addEventListener(
  "click",
  function () {
    if (pickCount > 0) {
      edgeCostsHashMap = calculateEdgeCosts();
      displayEdgeResults(edgeCostsHashMap);

      var routePermutationsHash = calculatePermutations(pickCount);
      var routeResults = calculateRouteCosts(
        routePermutationsHash,
        edgeCostsHashMap
      );
      displayRouteResults(routeResults);

      var optimalRoute = calculateOptimalRoute(routeResults);
      displayOptimalRouteResult(optimalRoute);
    } else {
      updateConfigMessage();
    }
  },
  false
);

// Populate tileArray of tile objects
for (let i = 0; i < numColumns; i++) {
  tileArray[i] = [];
  for (let j = 0; j < numRows; j++) {
    tileArray[i][j] = new Tile(
      i * (tileDimension + 3),
      j * (tileDimension + 3)
    );
  }
}
configDefaultTiles();
populateGrid();

function configDefaultTiles() {
  tileArray[0][0].setStatus("start");
  tileArray[0][0].lock();
  tileArray[numColumns - 1][numRows - 1].setStatus("X");
  tileArray[numColumns - 1][numRows - 1].lock();
}

// Populate canvas with grid of tiles
function populateGrid() {
  configDefaultTiles();
  for (let i = 0; i < numColumns; i++) {
    for (let j = 0; j < numRows; j++) {
      drawTile(tileArray[i][j].x, tileArray[i][j].y, tileArray[i][j].colour);
    }
  }
}

function clearGrid() {
  clearPickCount();
  for (let i = 0; i < numColumns; i++) {
    for (let j = 0; j < numRows; j++) {
      tileArray[i][j].setStatus("empty");
    }
  }
}

function clearPickCount() {
  pickCount = 0;
}

function clearResults(container) {
  while (container.firstChild) {
    container.removeChild(container.lastChild);
  }
}

function drawTile(tileXPos, tileYPos, tileColour) {
  canvasContext.fillStyle = tileColour;
  canvasContext.beginPath();
  canvasContext.rect(tileXPos, tileYPos, 20, 20);
  canvasContext.closePath();
  canvasContext.fill();

  // label tile if it is a pick item
  if (tileColour == "#f64900") {
    displayLabel(canvasContext, labelHashMap[pickCount], tileXPos, tileYPos);
  }
}

function displayLabel(canvasContext, text, tileXPos, tileYPos) {
  canvasContext.font = "10pt Arial";
  canvasContext.textAlign = "center";
  canvasContext.textBaseline = "middle";
  canvasContext.fillStyle = "#ffffff";
  canvasContext.fillText(
    text,
    tileXPos + tileDimension / 2,
    tileYPos + tileDimension / 2
  );
}

function updateConfigMessage() {
  if (pickCount == 0) {
    configMessage.textContent =
      "You must select at least one item to be picked";
  } else {
    configMessage.textContent =
      "There are currently " + pickCount + " items selected to pick";
  }
}

canvas.onmousedown = selectTile;

function selectTile(e) {
  let xCoord = e.pageX - canvas.offsetLeft;
  let yCoord = e.pageY - canvas.offsetTop;

  for (let i = 0; i < numColumns; i++) {
    for (let j = 0; j < numRows; j++) {
      if (
        i * (tileDimension + 3) < xCoord &&
        xCoord < i * (tileDimension + 3) + tileDimension &&
        j * (tileDimension + 3) < yCoord &&
        yCoord < j * (tileDimension + 3) + tileDimension
      ) {
        if (tileArray[i][j].isClickable) {
          if (selectionMode == "rackSelect") {
            if (tileArray[i][j].status == "pick") {
              pickCount--;
              updateConfigMessage();
            }
            tileArray[i][j].setStatus("racking");
          } else if (
            (selectionMode = "pickSelect") &&
            tileArray[i][j].status != "pick" &&
            pickCount < 10
          ) {
            tileArray[i][j].setStatus("pick");
            tileArray[i][j].setLabel("" + labelHashMap[pickCount + 1]);
            pickCount++;
            updateConfigMessage();
          }

          drawTile(
            i * (tileDimension + 3),
            j * (tileDimension + 3),
            tileArray[i][j].colour
          );
        }
      }
    }
  }
}

function calculateEdgeCosts() {
  var edgeCostsHash = {};

  for (let i = 1; i < pickCount + 1; i++) {
    if (!edgeCostsHash[labelHashMap[i]]) {
      edgeCostsHash[labelHashMap[i]] = solveUnweighted(
        tileArray,
        "start",
        labelHashMap[i]
      );
    }
  }
  for (let i = 1; i < pickCount; i++) {
    for (let j = i + 1; j < pickCount + 1; j++) {
      let edge = labelHashMap[i] + "" + labelHashMap[j];
      if (!edgeCostsHash[edge]) {
        edgeCostsHash[edge] = solveUnweighted(
          tileArray,
          labelHashMap[i],
          labelHashMap[j]
        );
      }
    }
  }
  return edgeCostsHash;
}

function displayEdgeResults(resultsHash) {
  Object.keys(resultsHash).forEach(function (edge) {
    var value = resultsHash[edge];
    var content = edge;
    if (edge.length == 1) {
      content = "Start->" + content;
    }
    appendNewDiv(edgeResultsContainer, content, value);
  });
}

function calculatePermutations(pickCount) {
  var string = "";
  var permutationsHash = {};

  for (let i = 1; i < pickCount + 1; i++) {
    string += labelHashMap[i];
  }
  var permutations = getAllPermutations(string);

  for (let i = 0; i < permutations.length; i++) {
    var currentPermutation = permutations[i];
    var reversedCurrentPermutation = currentPermutation
      .split("")
      .reverse()
      .join("");

    if (
      !permutationsHash[currentPermutation] &&
      !permutationsHash[reversedCurrentPermutation]
    ) {
      permutationsHash[currentPermutation] = true;
    }
  }
  return permutationsHash;
}

function getAllPermutations(string) {
  var permutations = [];

  if (string.length == 1) {
    permutations.push(string);
    return permutations;
  }
  for (var i = 0; i < string.length; i++) {
    var firstChar = string[i];
    var otherChar = string.substring(0, i) + string.substring(i + 1);
    var otherPermutations = getAllPermutations(otherChar);

    for (var j = 0; j < otherPermutations.length; j++) {
      permutations.push(firstChar + otherPermutations[j]);
    }
  }
  return permutations;
}

function calculateRouteCosts(routePermutationsHash, edgeCostsHash) {
  var currentCost = 0;
  var content;
  var routeResults = [];

  Object.keys(routePermutationsHash).forEach(function (route) {
    if (route.length == 1) {
      routeResults = [[route, edgeCostsHash[route]]];
      return routeResults;
    }

    for (let i = 0; i < route.length - 1; i++) {
      var routeSubsection = route[i] + "" + route[i + 1];
      var orderedRouteSubsection = routeSubsection.split("").sort().join("");
      currentCost += edgeCostsHash[orderedRouteSubsection];

      if (i == route.length - 2) {
        for (let i = 0; i < 2; i++) {
          var updatedCost =
            currentCost + edgeCostsHash[route[i * (route.length - 1)]];

          var path = "" + route;
          if (i == 1) {
            path = path.split("").reverse().join("");
          }
          content = "Start->" + path;
          routeResults.push([content, updatedCost]);
        }
      }
    }
    currentCost = 0;
  });
  return routeResults;
}

function splitRouteIntoSubsections(route) {
  var routeSubSections = [];

  for (let i = 0; i < route.length; i++) {
    var routeSubsection = route[i] + "" + route[i + 1];
    var orderedRouteSubsection = routeSubsection.split("").sort().join("");
  }

  return routeSubSections;
}

function displayRouteResults(routeResults) {
  for (let i = 0; i < routeResults.length; i++) {
    appendNewDiv(routeResultsContainer, routeResults[i][0], routeResults[i][1]);
  }
}

function calculateOptimalRoute(routeResults) {
  var lowestCost = 999;
  var optimalRoute = "";
  for (let i = 0; i < routeResults.length; i++) {
    if (routeResults[i][1] < lowestCost) {
      lowestCost = routeResults[i][1];
      optimalRoute = routeResults[i][0];
    }
  }
  return [optimalRoute, lowestCost];
}

function displayOptimalRouteResult(optimalRoute) {
  appendNewDiv(optimalRouteContainer, optimalRoute[0], optimalRoute[1]);
}

function appendNewDiv(container, content, cost) {
  const div = document.createElement("div");
  if (container.id == "edges-container") {
    div.classList.add("edges-div");
  } else if (container.id == "routes-container") {
    div.classList.add("routes-div");
  } else if (container.id == "optimal-route-container") {
    div.classList.add("optimal-route-div");
  }
  div.classList.add("results-div");
  div.innerHTML = `<p >${content}</p><p >${cost}</p>`;
  container.appendChild(div);
}
