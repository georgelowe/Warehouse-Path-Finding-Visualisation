function visualiseEdge(path, startCoords) {
  var pathLength = path.length;
  var currentX = startCoords[0];
  var currentY = startCoords[1];
  var stepCount = 0;

  for (var i = 0; i < pathLength - 1; i++) {
    if (path.charAt(i + 1) == "U") {
      currentY -= 1;
    }

    if (path.charAt(i + 1) == "D") {
      currentY += 1;
    }

    if (path.charAt(i + 1) == "R") {
      currentX += 1;
    }
    if (path.charAt(i + 1) == "L") {
      currentX -= 1;
    }

    if (tileArray[currentX][currentY].status.length > "pick".length) {
      if (tileArray[currentX][currentY].status != "start") {
        tileArray[currentX][currentY].setStatus("x");
        stepCount++;
        drawTile(
          currentX * (tileGrid.tileDimension + tileGrid.tileSpacing),
          currentY * (tileGrid.tileDimension + tileGrid.tileSpacing),
          tileArray[currentX][currentY].colour
        );
      }
    }
  }
  resetEmptyTiles();

  return stepCount;
}

function resetEmptyTiles() {
  for (let i = 0; i < tileGrid.numColumns; i++) {
    for (let j = 0; j < tileGrid.numRows; j++) {
      if (
        tileArray[i][j].status.includes("start") &&
        tileArray[i][j].status.length > "start".length
      ) {
        tileArray[i][j].setStatus("empty");
      } else if (
        tileArray[i][j].status.includes("pick") &&
        tileArray[i][j].status.length > "pick".length
      ) {
        tileArray[i][j].setStatus("empty");
      } else if (tileArray[i][j].status == "x") {
        tileArray[i][j].setStatus("empty");
      }
    }
  }
}
