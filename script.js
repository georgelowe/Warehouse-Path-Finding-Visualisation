// DOM Elements
var clearButton = document.getElementById("clear-button");
var setPickButton = document.getElementById("set-pick-button");
var goButton = document.getElementById("optimal-route-button");
var generateMapButton = document.getElementById("generate-map-button");
var pickCountMessage = document.getElementById("pick-count-message-container");
var resultsMessage = document.getElementById("results-message");

var optimalRouteContainer = document.getElementById("optimal-route-container");
var edgesContainer = document.getElementById("edges-container");
var routesContainer = document.getElementById("routes-container");

// Tiles
var canvas = document.getElementById("canvas");
ctx = canvas.getContext("2d");
var tileArray = [];
var numColumns = 45;
var numRows = 20;
var tileDim = 20;

// Selection Mode Handling
var selectionMode = "rackSelect";
var pickCount = 0;
var labelMap = {
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
    clearResults(optimalRouteContainer);
    clearResults(edgesContainer);
    clearResults(routesContainer);
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

goButton.addEventListener(
  "click",
  function () {
    var emptyHash = {};
    if (pickCount > 0) {
      var innerEdges = findInnerEdgeLengths(emptyHash);
      var allEdges = findEdgesFromStart(innerEdges);
      displayEdgeResults(allEdges);

      var reducedPermutations = reducePermutations(pickCount);
      myFunc(reducedPermutations, allEdges);
    } else {
      pickCountMessage.textContent =
        "You must select at least one item to be picked";
    }
  },
  false
);

// TO DO: Pass values to be used in DOM display
function displayEdgeResults(resultsHash) {
  var content;
  Object.keys(resultsHash).forEach(function (key) {
    var value = resultsHash[key];
    if (key.length == 1) {
      content = "Start->" + key;
    } else {
      content = key;
    }

    appendNewDiv(edgesContainer, content, value);
  });
}

// Populate tileArray of tile objects
for (let i = 0; i < numColumns; i++) {
  tileArray[i] = [];
  for (let j = 0; j < numRows; j++) {
    tileArray[i][j] = new Tile(i * (tileDim + 3), j * (tileDim + 3));
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
  pickCount = 0;
  updatePickCountMessage();
  for (let i = 0; i < numColumns; i++) {
    for (let j = 0; j < numRows; j++) {
      tileArray[i][j].setStatus("empty");
    }
  }
  populateGrid();
}

function clearResults(container) {
  while (container.firstChild) {
    container.removeChild(container.lastChild);
  }
}

function drawTile(tileXPos, tileYPos, tileColour) {
  ctx.fillStyle = tileColour;
  ctx.beginPath();
  ctx.rect(tileXPos, tileYPos, 20, 20);
  ctx.closePath();
  ctx.fill();

  // label tile if it is a pick item
  if (tileColour == "#f64900") {
    displayLabel(ctx, labelMap[pickCount], tileXPos, tileYPos);
  }
}

function displayLabel(ctx, text, tileXPos, tileYPos) {
  ctx.font = "10pt Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#ffffff";
  ctx.fillText(text, tileXPos + tileDim / 2, tileYPos + tileDim / 2);
}

function updatePickCountMessage() {
  pickCountMessage.textContent =
    "There are currently " + pickCount + " items selected to pick";
}

canvas.onmousedown = selectTile;

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
            pickCount < 10
          ) {
            tileArray[i][j].setStatus("pick");
            tileArray[i][j].setLabel("" + labelMap[pickCount + 1]);
            pickCount++;
            updatePickCountMessage();
          }

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

function findInnerEdgeLengths(hash) {
  var string = "";

  for (let i = 1; i < pickCount + 1; i++) {
    string = string + labelMap[i];
  }

  for (let i = 0; i < string.length - 1; i++) {
    for (let j = 1; j < string.length; j++) {
      if (i + j < string.length) {
        let res = string[i] + "" + string[i + j];

        if (!hash[res]) {
          hash[res] = solveUnweighted(tileArray, string[i], string[i + j]);
        }
      }
    }
  }
  return hash;
}

function findEdgesFromStart(hash) {
  for (let i = 1; i < pickCount + 1; i++) {
    if (!hash[labelMap[i]]) {
      hash[labelMap[i]] = solveUnweighted(tileArray, "start", labelMap[i]);
    }
  }
  return hash;
}

function getPermutations(string) {
  var permutations = [];

  if (string.length === 1) {
    permutations.push(string);
    permutations[string];
    return permutations;
  }
  for (var i = 0; i < string.length; i++) {
    var firstChar = string[i];
    var otherChar = string.substring(0, i) + string.substring(i + 1);
    var otherPermutations = getPermutations(otherChar);

    for (var j = 0; j < otherPermutations.length; j++) {
      permutations.push(firstChar + otherPermutations[j]);
    }
  }
  return permutations;
}

function reducePermutations(pickCount) {
  var string = "";

  for (let i = 1; i < pickCount + 1; i++) {
    string = string + labelMap[i];
  }

  var permutationsHash = {};
  var permutations = getPermutations(string);

  // Create hash of permutations excluding reversed duplicates
  for (let i = 0; i < permutations.length; i++) {
    var perm = permutations[i];
    var reversedPerm = perm.split("").reverse().join("");

    if (!permutationsHash[perm] && !permutationsHash[reversedPerm]) {
      permutationsHash[perm] = true;
    }
  }
  return permutationsHash;
}

function myFunc(routes, hash) {
  var count = 0;
  var lowestCount = 999;
  var bestRoute = "";
  var content;

  Object.keys(routes).forEach(function (key) {
    if (key.length == 1) {
      lowestCount = hash[key];
      bestRoute = key;
    }

    for (let i = 0; i < key.length - 1; i++) {
      var newKey = key[i] + "" + key[i + 1];
      var sortedNewKey = newKey.split("").sort().join("");

      count = count + hash[sortedNewKey];

      if (i == key.length - 2) {
        for (let i = 0; i < 2; i++) {
          var updatedCount = count + hash[key[i * (key.length - 1)]];

          var path = "" + key;

          if (i == 1) {
            path = path.split("").reverse().join("");
          }

          content = "Start->" + path;
          appendNewDiv(routesContainer, content, updatedCount);

          if (updatedCount < lowestCount) {
            lowestCount = updatedCount;
            bestRoute = path;
          }
        }
      }
    }

    count = 0;
  });
  content = "Start->" + bestRoute;
  appendNewDiv(optimalRouteContainer, content, lowestCount);
}

function appendNewDiv(container, content, cost) {
  const div = document.createElement("div");

  switch (container.id) {
    case "edges-container":
      div.classList.add("edges-div");
      break;
    case "routes-container":
      div.classList.add("routes-div");
      break;
    case "optimal-route-container":
      div.classList.add("optimal-route-div");
      break;
  }

  div.classList.add("results-div");

  div.innerHTML = `
      <div>
        <p >${content}</p>
        <p >${cost}</p>
      </div>
    `;
  container.appendChild(div);
}
