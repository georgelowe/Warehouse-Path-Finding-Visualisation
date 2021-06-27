function visualise(path, startCoords) {
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

    if (tileArray[currentX][currentY].status.length > "start".length) {
      tileArray[currentX][currentY].setStatus("x");
      stepCount++;
      drawTile(
        currentX * (tileDim + 3),
        currentY * (tileDim + 3),
        tileArray[currentX][currentY].colour
      );
    }
  }
  return stepCount;
}
