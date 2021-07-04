// DOM Buttons
var clearButton = document.getElementById("clear-button");
var setPickBaysButton = document.getElementById("set-pick-button");
var findOptimalRouteButton = document.getElementById("optimal-route-button");
var instructionsButton = document.getElementById("help-button");
var optimalRouteTitle = document.getElementById("optimal-route-title");
var edgeResultsTitle = document.getElementById("edge-results-title");
var routePermutationsTitle = document.getElementById(
  "route-permutations-title"
);

// DOM Containers
var configMessage = document.getElementById("pick-count-message-container");
var optimalRouteContainer = document.getElementById("optimal-route-container");
var edgeResultsContainer = document.getElementById("edges-container");
var routeResultsContainer = document.getElementById("routes-container");
var modal = document.getElementById("myModal");

// Tile Grid Configuration
var canvas = document.getElementById("canvas");
canvasContext = canvas.getContext("2d");
var tileArray = [];
var tileGrid = new Grid(20, 45, 3, 20);

// Selection Mode
var selectionMode = "rackSelect";
var pickCount = 0;
var maxPickCount = 10;
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
var edgeDirectionsHash = {};
var optimalRoute;

// Event Listeners
setPickBaysButton.addEventListener(
  "click",
  function () {
    if (selectionMode == "rackSelect") {
      setPickBaysButton.textContent = "Set Racking";
      selectionMode = "pickSelect";
    } else {
      setPickBaysButton.textContent = "Set Pick Bays";
      selectionMode = "rackSelect";
    }
  },
  false
);

findOptimalRouteButton.addEventListener(
  "click",
  function () {
    if (pickCount > 0) {
      var edgeCostsHashMap = calculateAllEdgeCosts();
      displayEdgeResults(edgeCostsHashMap);

      var routePermutationsHash = calculateValidRoutePermutations();
      var routeResults = calculateRouteCosts(
        routePermutationsHash,
        edgeCostsHashMap
      );
      displayResultsTitles();
      displayRouteResults(routeResults);

      optimalRoute = calculateOptimalRoute(routeResults);
      displayOptimalRouteResult(optimalRoute);
    } else {
      updatePickCountMessage();
    }
  },
  false
);

optimalRouteContainer.addEventListener(
  "click",
  function () {
    visualiseOptimalRoute(optimalRoute[0]);
  },
  false
);

clearButton.addEventListener(
  "click",
  function () {
    clearGrid();
    updatePickCountMessage();
    populateCanvasWithTiles();
    clearResults(optimalRouteContainer);
    hideResultsTitles();
    clearResults(edgeResultsContainer);
    clearResults(routeResultsContainer);
    edgeDirectionsHash = {};
  },
  false
);

instructionsButton.addEventListener(
  "click",
  function () {
    modal.style.display = "block";
  },
  false
);

window.onclick = function (e) {
  if (e.target == modal) {
    modal.style.display = "none";
  }
};

// Populate tileArray of tile objects
for (let i = 0; i < tileGrid.numColumns; i++) {
  tileArray[i] = [];
  for (let j = 0; j < tileGrid.numRows; j++) {
    tileArray[i][j] = new Tile(
      i * (tileGrid.tileDimension + tileGrid.tileSpacing),
      j * (tileGrid.tileDimension + tileGrid.tileSpacing)
    );
  }
}
configDefaultTiles();
populateCanvasWithTiles();

function configDefaultTiles() {
  tileArray[0][0].setStatus("start");
  tileArray[0][0].lock();
  tileArray[tileGrid.numColumns - 1][tileGrid.numRows - 1].setStatus("X");
  tileArray[tileGrid.numColumns - 1][tileGrid.numRows - 1].lock();
}

function populateCanvasWithTiles() {
  configDefaultTiles();
  for (let i = 0; i < tileGrid.numColumns; i++) {
    for (let j = 0; j < tileGrid.numRows; j++) {
      drawTile(tileArray[i][j].x, tileArray[i][j].y, tileArray[i][j].colour);
    }
  }
}

function clearGrid() {
  clearPickCount();
  for (let i = 0; i < tileGrid.numColumns; i++) {
    for (let j = 0; j < tileGrid.numRows; j++) {
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
    tileXPos + tileGrid.tileDimension / 2,
    tileYPos + tileGrid.tileDimension / 2
  );
}

function updatePickCountMessage() {
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
  mouseCoords = locateMousePosition(e);
  for (let i = 0; i < tileGrid.numColumns; i++) {
    for (let j = 0; j < tileGrid.numRows; j++) {
      if (
        i * (tileGrid.tileDimension + tileGrid.tileSpacing) < mouseCoords.x &&
        mouseCoords.x <
          i * (tileGrid.tileDimension + tileGrid.tileSpacing) +
            tileGrid.tileDimension &&
        j * (tileGrid.tileDimension + tileGrid.tileSpacing) < mouseCoords.y &&
        mouseCoords.y <
          j * (tileGrid.tileDimension + tileGrid.tileSpacing) +
            tileGrid.tileDimension
      ) {
        if (tileArray[i][j].isClickable) {
          if (selectionMode == "rackSelect") {
            if (tileArray[i][j].status == "pick") {
              pickCount--;
              updatePickCountMessage();
            }
            tileArray[i][j].setStatus("racking");
          } else if (
            (selectionMode = "pickSelect") &&
            tileArray[i][j].status != "pick" &&
            pickCount < maxPickCount
          ) {
            tileArray[i][j].setStatus("pick");
            tileArray[i][j].setLabel("" + labelHashMap[pickCount + 1]);
            pickCount++;
            updatePickCountMessage();
          } else {
            break;
          }
          drawTile(
            i * (tileGrid.tileDimension + tileGrid.tileSpacing),
            j * (tileGrid.tileDimension + tileGrid.tileSpacing),
            tileArray[i][j].colour
          );
        }
      }
    }
  }
}

function locateMousePosition(e) {
  mouseCoords = {};
  mouseCoords.x = e.pageX - canvas.offsetLeft;
  mouseCoords.y = e.pageY - canvas.offsetTop;
  return mouseCoords;
}

function calculateAllEdgeCosts() {
  var edgeCostsHash = {};

  // Edges from start to each pick bay
  for (let i = 1; i < pickCount + 1; i++) {
    if (!edgeCostsHash[labelHashMap[i]]) {
      edgeCostsHash[labelHashMap[i]] = solveUnweighted(
        tileArray,
        "start",
        labelHashMap[i]
      );
    }
  }
  // Edges between each pair of pick bays
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
    var edgeCost = resultsHash[edge];
    if (edge.length == 1) {
      edge = "Start->" + edge;
    }
    appendNewDiv(edgeResultsContainer, edge, edgeCost);
  });
}

// Valid: no reverse duplicates i.e. AB, BA
function calculateValidRoutePermutations() {
  var stringOfPickBays = "";
  var permutationsHash = {};

  for (let i = 1; i < pickCount + 1; i++) {
    stringOfPickBays += labelHashMap[i];
  }
  var allPermutations = getAllPermutations(stringOfPickBays);

  for (let i = 0; i < allPermutations.length; i++) {
    var currentPermutation = allPermutations[i];
    // If currentPermutation isn't in the hash then check for its reverse
    if (
      !permutationsHash[currentPermutation] &&
      !permutationsHash[currentPermutation.split("").reverse().join("")]
    ) {
      permutationsHash[currentPermutation] = true;
    }
  }
  return permutationsHash;
}

function getAllPermutations(stringOfPickBays) {
  var allPermutations = [];

  if (stringOfPickBays.length == 1) {
    allPermutations.push(stringOfPickBays);
    return allPermutations;
  }
  for (var i = 0; i < stringOfPickBays.length; i++) {
    var firstChar = stringOfPickBays[i];
    var otherChar =
      stringOfPickBays.substring(0, i) + stringOfPickBays.substring(i + 1);
    var otherPermutations = getAllPermutations(otherChar);

    for (var j = 0; j < otherPermutations.length; j++) {
      allPermutations.push(firstChar + otherPermutations[j]);
    }
  }
  return allPermutations;
}

function calculateRouteCosts(routePermutationsHash, edgeCostsHash) {
  var currentCost = 0;
  var routeResults = [];

  Object.keys(routePermutationsHash).forEach(function (route) {
    if (route.length == 1) {
      routeResults = [[route, edgeCostsHash[route]]];
      return routeResults;
    }
    for (let i = 0; i < route.length - 1; i++) {
      var routeSubsection = splitRouteIntoSubsection(route, i);
      currentCost += edgeCostsHash[routeSubsection];

      if (i == route.length - 2) {
        // Save the route including distance from start and distance from end (reverse this route)
        // e.g. ABC: Cost of Start->ABC and also Cost of Start->CBA
        for (let i = 0; i < 2; i++) {
          var routeCopy = "" + route;
          if (i == 1) {
            routeCopy = routeCopy.split("").reverse().join("");
          }
          // i * (route.length - 1) gives us either 0 (index of first element) or route.length - 1 (index of last element)
          var updatedCost =
            currentCost + edgeCostsHash[route[i * (route.length - 1)]];
          routeResults.push(["Start->" + routeCopy, updatedCost]);
        }
      }
    }
    currentCost = 0;
  });
  return routeResults;
}

// @param route e.g. ABCD
// @param currentIndex e.g. 1
// @return routesubSection e.g. BC
function splitRouteIntoSubsection(route, currentIndex) {
  var unorderedRouteSubsection =
    route[currentIndex] + "" + route[currentIndex + 1];
  var routeSubsection = unorderedRouteSubsection.split("").sort().join("");
  return routeSubsection;
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
    div.innerHTML = `<p >${content}</p><p class="cost-display">Total Steps: ${cost}</p>`;
  } else if (container.id == "routes-container") {
    div.classList.add("routes-div");
    div.innerHTML = `<p >${content}</p><p class="cost-display">Total Steps: ${cost}</p>`;
  } else if (container.id == "optimal-route-container") {
    div.classList.add("optimal-route-div");
    div.id = "optimal-route-div";
    div.innerHTML = `<p class ="visualise-optimal-route">Click to visualise</p><p >${content}</p><p class="cost-display">Total Steps: ${cost}</p>`;
  }
  div.classList.add("results-div");

  container.appendChild(div);
}

function displayResultsTitles() {
  optimalRouteTitle.style.display = "block";
  edgeResultsTitle.style.display = "block";
  routePermutationsTitle.style.display = "block";
}

function hideResultsTitles() {
  optimalRouteTitle.style.display = "none";
  edgeResultsTitle.style.display = "none";
  routePermutationsTitle.style.display = "none";
}
