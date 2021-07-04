function visualiseOptimalRoute(optimalRoute) {
  var trimmedOptimalRoute = optimalRoute.replace("Start->", "");
  var pickCoords = {};

  for (let i = 1; i < trimmedOptimalRoute.length + 1; i++) {
    pickCoords[trimmedOptimalRoute[i]] = findPickCoords(labelHashMap[i]);
  }

  for (let i = 0; i < trimmedOptimalRoute.length; i++) {
    var goal = trimmedOptimalRoute[i];
    if (i == 0) {
      var start = findPickCoords("start");
      var directions = edgeDirectionsHash[goal];
    } else {
      var start = findPickCoords(trimmedOptimalRoute[i - 1]);
      var path = trimmedOptimalRoute[i - 1] + "" + trimmedOptimalRoute[i];

      if (!edgeDirectionsHash[path]) {
        var reversedPath = path.split("").reverse().join("");
        var invertedDirections = edgeDirectionsHash[reversedPath];
        var directions = invertDirections(invertedDirections);
      } else {
        var directions = edgeDirectionsHash[path];
      }
    }
    followDirections(start, directions);
  }
}

function invertDirections(invertedDirections) {
  var oppositeDirections = invertedDirections.split("").reverse().join("");
  var directions = "";

  for (let i = 0; i < oppositeDirections.length; i++) {
    if (oppositeDirections[i] == "R") {
      directions += "L";
    }
    if (oppositeDirections[i] == "L") {
      directions += "R";
    }
    if (oppositeDirections[i] == "U") {
      directions += "D";
    }
    if (oppositeDirections[i] == "D") {
      directions += "U";
    }
  }
  return directions;
}

function findPickCoords(label) {
  for (let i = 0; i < tileGrid.numColumns; i++) {
    for (let j = 0; j < tileGrid.numRows; j++) {
      if (tileArray[i][j].label == label) {
        var pickCoords = [i, j];
        return pickCoords;
      }
    }
  }
}

function followDirections(startCoords, directions) {
  var currentX = startCoords[0];
  var currentY = startCoords[1];

  for (let i = 0; i < directions.length; i++) {
    if (directions[i] == "R") {
      currentX += 1;
    }
    if (directions[i] == "L") {
      currentX -= 1;
    }
    if (directions[i] == "U") {
      currentY -= 1;
    }
    if (directions[i] == "D") {
      currentY += 1;
    }

    if (tileArray[currentX][currentY].status != "pick") {
      drawTile(
        currentX * (tileGrid.tileDimension + tileGrid.tileSpacing),
        currentY * (tileGrid.tileDimension + tileGrid.tileSpacing),
        "#6dc567"
      );
    }
  }
}
